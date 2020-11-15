#include "common.h"
#include <queue>
#include <functional>
#include <thread>
#include <limits>


struct CandidateScore {
    // TODO non const
    Score score;
    CandidateIndex index;
    CandidateScore(const Score score_, const size_t index_) noexcept : score(score_), index(index_) {}

    bool operator<(const CandidateScore &other) const noexcept {
        return score > other.score;
    }
};

using CandidateScorePriorityQueue = std::priority_queue<CandidateScore>;

void filter_internal(const std::vector<CandidateString> &candidates,
  size_t start_index,
  const Element &query,
  const Options &options,
  size_t max_results,
  CandidateScorePriorityQueue &results) {
    const auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    for (size_t i = 0, len = candidates.size(); i < len; i++) {
        const auto &candidate = candidates[i];
        if (candidate.empty()) {
            continue;
        }
        auto score = scoreProvider(candidate, query, options);
        if (score > 0) {
            results.emplace(score, start_index + i);
            if (results.size() > max_results) {
                results.pop();
            }
        }
    }
}

std::vector<CandidateIndex> sort_priority_queue(CandidateScorePriorityQueue &&candidates) {
    vector<CandidateScore> sorted;
    std::vector<CandidateIndex> ret;

    const auto initial_candidates_size = candidates.size();
    sorted.reserve(initial_candidates_size);
    ret.reserve(initial_candidates_size);

    while (!candidates.empty()) {
        sorted.emplace_back(candidates.top());
        candidates.pop();
    }
    std::sort(sorted.begin(), sorted.end());
    for (const auto &item : sorted) {
        ret.emplace_back(item.index);
    }
    return ret;
}

std::vector<CandidateIndex> filter(const vector<std::vector<CandidateString>> &candidates, const Element &query, const Options &options) {
    const auto candidates_size = candidates.size();

    assert(1 <= candidates_size);// TODO handled outside

    CandidateScorePriorityQueue top_k;
    auto max_results = options.max_results;
    if (max_results == 0u) {
        max_results = std::numeric_limits<size_t>::max();
    }

    // Split the dataset and pass down to multiple threads.
    vector<thread> threads;
    threads.reserve(candidates.size());

    auto results = vector<CandidateScorePriorityQueue>(candidates.size());

    size_t start_index = 0;
    for (size_t i = 1; i < candidates_size; i++) {
        assert(1 < i && i < candidates.size() && i < results.size());
        start_index += candidates[i - 1].size();//inbounds
        threads.emplace_back(filter_internal, ref(candidates[i]), start_index, ref(query), ref(options), max_results, ref(results[i]));// inbounds
    }

    assert(threads.size() == candidates.size() && results.size() == candidates.size());

    // Do the work for first thread.
    filter_internal(candidates[0], 0, query, options, max_results, top_k);//inbounds (candidate_size >= 1)
    // Wait for threads to complete and merge the results.
    for (size_t i = 1; i < candidates_size; i++) {
        threads[i - 1].join();//inbounds
        while (!results[i].empty()) {
            top_k.emplace(results[i].top());
            results[i].pop();
            if (top_k.size() > max_results) {
                top_k.pop();
            }
        }
    }
    return sort_priority_queue(move(top_k));
}
