#ifndef Zadeh_filter_h_
#define Zadeh_filter_h_

#include <queue>
#include <functional>
#include <thread>
#include <limits>

#include "common.h"
#include "options.h"

namespace zadeh {


struct CandidateScore {
    // TODO non const
    Score score;
    CandidateIndex index;
    CandidateScore(const Score score_, const size_t index_) noexcept : score(score_), index(index_) {}

    bool operator<(const CandidateScore &other) const noexcept {
        return score > other.score;
    }
};

using CandidateScoreVector = std::vector<CandidateScore>;

void filter_internal(const std::vector<CandidateString> &candidates,
  size_t start_index,
  const Element &query,
  const Options &options,
  size_t max_results,
  CandidateScoreVector &results) {
    const auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    auto results_size = results.size();
    for (size_t i = 0, len = candidates.size(); i < len; i++) {
        const auto &candidate = candidates[i];
        if (candidate.empty()) {
            continue;
        }
        const auto score = scoreProvider(candidate, query, options);
        if (score > 0) {
            results.emplace_back(score, start_index + i);
            ++results_size;    // maintain size manually rather than calling results.size() every time
            if (results_size > max_results) {
                results.pop_back();
                --results_size;
            }
        }
    }
}

std::vector<CandidateIndex> sort_priority_queue(CandidateScoreVector &&candidates, size_t max_results) {
    // sort all the results
    std::sort(candidates.begin(), candidates.end());

    // find the end based on max_results or the length of the results
    const auto end = min(max_results, candidates.size());

    // make the return from the indices of the results
    std::vector<CandidateIndex> ret;
    ret.reserve(end);
    for (auto i = 0u; i < end; i++) {
        ret.emplace_back(candidates[i].index);
    }

    return ret;
}

std::vector<CandidateIndex> filter(const vector<std::vector<CandidateString>> &candidates, const Element &query, const Options &options) {
    const auto candidates_size = candidates.size();
    assert(1 <= candidates_size);    // TODO handled outside

    auto max_results = options.max_results;
    if (max_results == 0u) {
        max_results = std::numeric_limits<size_t>::max();
    }

    // Split the dataset and pass down to multiple threads.
    vector<thread> threads;
    threads.reserve(candidates_size - 1);    // 1 less thread

    auto results = vector<CandidateScoreVector>(candidates_size);

    size_t start_index = 0;
    for (size_t i = 1; i < candidates_size; i++) {
        assert(1 <= i && i < candidates_size && i < results.size());
        start_index += candidates[i - 1].size();    //inbounds
        threads.emplace_back(filter_internal, ref(candidates[i]), start_index, ref(query), ref(options), max_results, ref(results[i]));    // inbounds
    }
    assert(threads.size() == candidates_size - 1 && results.size() == candidates_size);

    CandidateScoreVector top_k;
    // Do the work for first thread.
    filter_internal(candidates[0], 0, query, options, max_results, top_k);    //inbounds (candidate_size >= 1)
    // Wait for threads to complete and merge the results.

    for (size_t i = 1; i < candidates_size; i++) {
        threads[i - 1].join();    //inbounds

        const auto new_results = results[i];
        std::move(new_results.begin(), new_results.end(), std::back_inserter(top_k));
    }

    return sort_priority_queue(move(top_k), max_results);
}


}    // namespace zadeh
#endif
