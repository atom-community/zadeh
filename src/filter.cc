#include "common.h"
#include <queue>
#include <functional>
#include <thread>

namespace {

struct CandidateScore {
  Score score;
  Candidate candidate;
  CandidateScore(Score score, Candidate candidate) : score(score), candidate(candidate) {}

  bool operator<(const CandidateScore& other) const {
    return score > other.score;
  }
};

typedef std::priority_queue<CandidateScore> CandidateScorePriorityQueue;

void thread_worker_filter(const Candidates &candidates,
                          size_t start, size_t end,
                          const Element &query, const Options &options,
                          size_t max_results,
                          CandidateScorePriorityQueue &results) {
  if (start >= end || end >candidates.size())
    return;
  for (size_t i = start; i < end; i++) {
    const auto &candidate = candidates[i];
    if(candidate.empty()) continue;
    auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    auto score = scoreProvider(candidate, query, options);
    if (score>0) {
      results.emplace(score, candidate);
      if (results.size() > max_results)
        results.pop();
    }
  }
}

Candidates sort_priority_queue(CandidateScorePriorityQueue &candidates) {
  vector<CandidateScore> sorted;
  Candidates ret;
  sorted.reserve(candidates.size());
  ret.reserve(candidates.size());
  while(!candidates.empty()) {
    sorted.emplace_back(candidates.top());
    candidates.pop();
  }
  std::sort(sorted.begin(), sorted.end());
  std::transform(sorted.begin(), sorted.end(), std::back_inserter(ret),
    [] (const auto &item) { return item.candidate; });
  return ret;
}

}

Candidates filter(const Candidates &candidates, const Element &query, Options &options) {
  CandidateScorePriorityQueue top_k;
  size_t max_results = options.max_results;
  if (!max_results || max_results >= candidates.size())
    max_results = candidates.size();

  if (candidates.size() < 10000) {
    thread_worker_filter(candidates, 0, candidates.size(), query,
      options, max_results, top_k);
    return sort_priority_queue(top_k);
  }

  // Split the dataset and pass down to multiple threads.
  const size_t max_threads = 8;
  vector<thread> threads;
  vector<CandidateScorePriorityQueue> thread_results(max_threads);
  size_t cur_start = 0;
  for (size_t i = 0; i < max_threads; i++) {
    size_t chunk_size = candidates.size() / max_threads;
    // Distribute remainder among the chunks.
    if (i < candidates.size() % max_threads) {
      chunk_size++;
    }
    threads.emplace_back(
      thread_worker_filter, ref(candidates),
        cur_start, cur_start + chunk_size,
        ref(query), ref(options),
        max_results, ref(thread_results[i])
    );
    cur_start += chunk_size;
  }
  // Wait for threads to complete and merge the restuls.
  for (size_t i = 0; i < max_threads; i++) {
    threads[i].join();
    while(!thread_results[i].empty()) {
      top_k.emplace(thread_results[i].top());
      thread_results[i].pop();
      if (top_k.size() > max_results)
        top_k.pop();
    }
  }
  return sort_priority_queue(top_k);
}
