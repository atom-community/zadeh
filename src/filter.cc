#include "common.h"
#include <queue>
#include <functional>
#include <thread>
#include <limits>
#include <cassert>

#include "ConcurrentQueue.h"

namespace {

struct CandidateScore {
  Score score;
  CandidateIndex index;
  CandidateScore(Score score, size_t thread_id, size_t index) : score(score), index(thread_id, index) {}

  bool operator<(const CandidateScore& other) const {
    return score > other.score;
  }
};

typedef std::priority_queue<CandidateScore> CandidateScorePriorityQueue;

struct ThreadState {
  ConcurrentQueue<Candidates> input;
  CandidateScorePriorityQueue results;
  ThreadState() = default;
};

void filter_internal(const Candidates &candidates,
                     size_t thread_id,
                     size_t start_index,
                     const Element &query, const Options &options,
                     size_t max_results,
                     CandidateScorePriorityQueue &results) {
  for (size_t i=0; i<candidates.size(); i++) {
    const auto &candidate = candidates[i];
    if(candidate.empty()) continue;
    auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    auto score = scoreProvider(candidate, query, options);
    if (score>0) {
      results.emplace(score, thread_id, start_index+i);
      if (results.size() > max_results)
        results.pop();
    }
  }
}

void thread_worker_filter(ThreadState &thread_state, size_t thread_id,
                          const Candidates *initial_candidates,
                          const Element &query, const Options &options,
                          size_t max_results) {
  size_t start_index = 0;
  if (initial_candidates) {
    filter_internal(*initial_candidates, thread_id, 0, query, options, max_results,
      thread_state.results);
    start_index += initial_candidates->size();
  }
  while (true) {
    Candidates candidates;
    thread_state.input.pop(candidates);
    if(candidates.empty()) break;
    filter_internal(candidates, thread_id, start_index, query, options, max_results,
        thread_state.results);
    start_index += candidates.size();
  }
}

CandidateIndexes sort_priority_queue(CandidateScorePriorityQueue &candidates) {
  vector<CandidateScore> sorted;
  CandidateIndexes ret;
  sorted.reserve(candidates.size());
  ret.reserve(candidates.size());
  while(!candidates.empty()) {
    sorted.emplace_back(candidates.top());
    candidates.pop();
  }
  std::sort(sorted.begin(), sorted.end());
  for(const auto& item : sorted) {
    ret.push_back(item.index);
  }
  return ret;
}

}  // namespace

CandidateIndexes filter(const vector<Candidates> &candidates, const Element &query, const Options &options) {
  CandidateScorePriorityQueue top_k;
  size_t max_results = options.max_results;
  if (!max_results)
    max_results = std::numeric_limits<size_t>::max();

  // Split the dataset and pass down to multiple threads.
  vector<thread> threads;
  vector<ThreadState> thread_state(candidates.size());
  for (size_t i = 1; i < candidates.size(); i++) {
    threads.emplace_back(
        thread_worker_filter, ref(thread_state[i]), i,
        &candidates[i],
        ref(query), ref(options), max_results);
  }
  // Push an empty vector for the threads to terminate.
  for (size_t i = 1; i < candidates.size(); i++) {
    Candidates t;
    thread_state[i].input.push(t);
  }
  // Do the work for firsr thread.
  filter_internal(candidates[0], 0, 0, query, options, max_results, top_k);
  // Wait for threads to complete and merge the restuls.
  for (size_t i = 1; i < candidates.size(); i++) {
    threads[i-1].join();
    auto &results = thread_state[i].results;
    while(!results.empty()) {
      top_k.emplace(results.top());
      results.pop();
      if (top_k.size() > max_results)
        top_k.pop();
    }
  }
  return sort_priority_queue(top_k);
}

Napi::Value filter_with_candidates(Napi::Env env, const Napi::Array &candidates,
        const std::string &key, const std::string &query, const Options &options) {
  CandidateScorePriorityQueue top_k;
  size_t max_results = options.max_results;
  if (!max_results)
    max_results = std::numeric_limits<size_t>::max();

  Napi::Array res = Napi::Array::New(env);
  vector<thread> threads;
  vector<ThreadState> thread_state(kMaxThreads);
  vector<size_t> chunks;
  vector<Candidates> initial_candidates(kMaxThreads);
  size_t cur_start = 0;
  for (size_t i = 0; i < kMaxThreads; i++) {
    size_t chunk_size = candidates.Length() / kMaxThreads;
    // Distribute remainder among the chunks.
    if (i < candidates.Length() % kMaxThreads) {
      chunk_size++;
    }
    for(size_t j=0; j<1000 && j<chunk_size; j++) {
      initial_candidates[i].push_back(key.empty() ? candidates[cur_start+j].ToString() : candidates[cur_start+j].ToObject().Get(key).ToString());
    }
    threads.emplace_back(
        thread_worker_filter, ref(thread_state[i]), i,
        &initial_candidates[i],
        ref(query), ref(options), max_results);
    cur_start += chunk_size;
    chunks.push_back(cur_start);
  }
  for (size_t i = 0; i < kMaxThreads; i++) {
    Candidates c;
    for(size_t j=(i==0)?1000:chunks[i-1]+1000; j<chunks[i]; j++) {
      c.push_back(key.empty() ? candidates[j].ToString() : candidates[j].ToObject().Get(key).ToString());
    }
    thread_state[i].input.push(c);
  }
  // Push an empty vector for the threads to terminate.
  for (size_t i = 0; i < kMaxThreads; i++) {
    Candidates t;
    thread_state[i].input.push(t);
  }
  // Wait for threads to complete and merge the restuls.
  for (size_t i = 0; i < kMaxThreads; i++) {
    threads[i].join();
    auto &results = thread_state[i].results;
    while(!results.empty()) {
      top_k.emplace(results.top());
      results.pop();
      if (top_k.size() > max_results)
        top_k.pop();
    }
  }
  auto indexes = sort_priority_queue(top_k);
  for(size_t i=0; i<indexes.size(); i++) {
    size_t ind = indexes[i].index;
    if (indexes[i].thread_id > 0)
      ind += chunks[indexes[i].thread_id-1];
    res[i] = Napi::Number::New(env, ind);
  }
  return res;
}
