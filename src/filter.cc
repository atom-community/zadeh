#include "common.h"
#include <queue>
#include <functional>

struct CandidateScore {
  Score score;
  Candidate candidate;
  CandidateScore(Score score, Candidate candidate) : score(score), candidate(candidate) {}
};

bool CompareCandidateScore(const CandidateScore &a, const CandidateScore& b) {
  return a.score > b.score;
}

Candidates filter(const Candidates &candidates, const Element &query, Options &options) {
  std::priority_queue<CandidateScore, std::vector<CandidateScore>, std::function<bool(const CandidateScore&, const CandidateScore&)>> top_k(CompareCandidateScore);
  size_t max_results = options.max_results;
  if (!max_results || max_results >= candidates.size())
    max_results = candidates.size();

  for(const auto &candidate : candidates) {
    if(candidate.empty()) continue;
    auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    auto score = scoreProvider(candidate, query, options);
    if (score>0) {
      top_k.emplace(score, candidate);
      if (top_k.size() > max_results)
        top_k.pop();
    }
  }
  vector<CandidateScore> sort_top_k;
  Candidates ret;
  sort_top_k.reserve(max_results);
  ret.reserve(max_results);
  while(!top_k.empty()) {
    sort_top_k.emplace_back(top_k.top());
    top_k.pop();
  }
  std::sort(sort_top_k.begin(), sort_top_k.end(), CompareCandidateScore);
  std::transform(sort_top_k.begin(), sort_top_k.end(), std::back_inserter(ret),
    [] (const auto &item) { return item.candidate; });
  return ret;
}
