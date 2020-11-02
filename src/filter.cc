#include "common.h"
#include <queue>
#include <functional>
#include <thread>
#include <limits>
#include <cassert>

namespace {

struct CandidateScore {
    Score score;
    CandidateIndex index;
    CandidateScore(Score score, size_t index) : score(score), index(index) {}

    bool operator<(const CandidateScore &other) const {
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
    for (size_t i = 0, len = candidates.size(); i < len; i++) {
        const auto &candidate = candidates[i];
        if (candidate.empty()) continue;
        auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
        auto score = scoreProvider(candidate, query, options);
        if (score > 0) {
            results.emplace(score, start_index + i);
            if (results.size() > max_results)
                results.pop();
        }
    }
}

void thread_worker_filter(const std::vector<CandidateString> &candidates,
  size_t start_index,
  const Element &query,
  const Options &options,
  size_t max_results,
  CandidateScorePriorityQueue &results) {
    filter_internal(candidates, start_index, query, options, max_results, results);
}

std::vector<CandidateIndex> sort_priority_queue(CandidateScorePriorityQueue &candidates) {
    vector<CandidateScore> sorted;
    std::vector<CandidateIndex> ret;
    sorted.reserve(candidates.size());
    ret.reserve(candidates.size());
    while (!candidates.empty()) {
        sorted.emplace_back(candidates.top());
        candidates.pop();
    }
    std::sort(sorted.begin(), sorted.end());
    for (const auto &item : sorted) {
        ret.push_back(item.index);
    }
    return ret;
}

}// namespace

std::vector<CandidateIndex> filter(const vector<std::vector<CandidateString>> &candidates, const Element &query, const Options &options) {
    CandidateScorePriorityQueue top_k;
    size_t max_results = options.max_results;
    if (max_results == 0u) {
        max_results = std::numeric_limits<size_t>::max();
    }

    // Split the dataset and pass down to multiple threads.
    vector<thread> threads;
    vector<CandidateScorePriorityQueue> results(candidates.size());
    size_t start_index = 0;
    for (size_t i = 1, len = candidates.size(); i < len; i++) {
        start_index += candidates[i - 1].size();
        threads.emplace_back(thread_worker_filter, ref(candidates[i]), start_index, ref(query), ref(options), max_results, ref(results[i]));
    }
    // Do the work for first thread.
    filter_internal(candidates[0], 0, query, options, max_results, top_k);
    // Wait for threads to complete and merge the restuls.
    for (size_t i = 1, len = candidates.size(); i < len; i++) {
        threads[i - 1].join();
        while (!results[i].empty()) {
            top_k.emplace(results[i].top());
            results[i].pop();
            if (top_k.size() > max_results)
                top_k.pop();
        }
    }
    return sort_priority_queue(top_k);
}
