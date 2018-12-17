#include "common.h"

Candidates filter(const Candidates &candidates, const Element &query, Options &options) {
  std::vector<std::pair<Score,Candidate>> scored_candidates;
  for(const auto &candidate : candidates) {
    if(candidate.empty()) continue;
    auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    auto score = scoreProvider(candidate, query, options);
    if (score>0) {
      scored_candidates.emplace_back(std::make_pair(score, candidate));
    }
  }
  // Sort scores in descending order
  std::sort(scored_candidates.begin(), scored_candidates.end(),
      [] (const auto &a, const auto& b) {return a.first > b.first;});
  Candidates ret;
  // Trim to maxResults if specified
  if (!options.max_results)
    options.max_results = candidates.size();
  for(size_t i=0; i<options.max_results && i<scored_candidates.size(); i++)
    ret.push_back(scored_candidates[i].second);
  return ret;
}
