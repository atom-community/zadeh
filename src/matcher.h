#ifndef Zadeh_matcher_h_
#define Zadeh_matcher_h_

#include <iterator>
#include <algorithm>

#include "common.h"
#include "options.h"
#include "query.h"

namespace zadeh {

//----------------------------------------------------------------------
// Align sequence (used for zadeh.match)
// Return position of subject characters that match query.
//
// Follow closely scorer.computeScore.
// Except at each step we record what triggered the best score.
// Then we trace back to output matched characters.
//
// Differences are:
// - we record the best move at each position in a matrix, and finish by a traceback.
// - we reset consecutive sequence if we do not take the match.
// - no hit miss limit
std::vector<size_t> computeMatch(const CandidateString &subject, const CandidateString &subject_lw,
                                 const PreparedQuery &preparedQuery, size_t offset = 0u) {
  const auto &query = preparedQuery.query;
  const auto &query_lw = preparedQuery.query_lw;

  const auto subject_size = subject.size();
  const auto query_size = query.size();

  // TODO optimization for the case that the sizes are 1

  // this is like the consecutive bonus, but for camelCase / snake_case initials
  const auto acro = scoreAcronyms(subject, subject_lw, query, query_lw);
  const auto acro_score = acro.score;

  // Init
  auto score_row = vector<Score>(query_size, 0);
  auto csc_row = vector<Score>(query_size, 0);

  // Directions constants
  enum class Direction { STOP, UP, LEFT, DIAGONAL };

  // Traceback matrix
  auto trace = std::vector<Direction>(subject_size * query_size, Direction::STOP);
  auto pos = 0u;

  auto i = 0u;
  while (i < subject_size) { // foreach char is of subject
    assert(0 <= i && i < subject_lw.size());
    Score score = 0;
    Score score_up = 0;
    Score csc_diag = 0;
    const auto si_lw = subject_lw[i];

    auto j = 0u;             // 0..n-1
    while (j < query_size) { // foreach char qj of query
      assert(0u <= j &&
             j < min({static_cast<size_t>(query_size), query_lw.size(), score_row.size(), csc_row.size()}));

      // reset score
      Score csc_score = 0;
      Score align = 0;
      const auto score_diag = score_up;

      // Compute a tentative match
      if (query_lw[j] == si_lw) {
        const auto start = isWordStart(i, subject, subject_lw);

        // Forward search for a sequence of consecutive char
        csc_score =
            csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);

        // Determine bonus for matching A[i] with B[j]
        align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);
      }
      // Prepare next sequence & match score.
      score_up = score_row[j]; // Current score_up is next run score diag
      csc_diag = csc_row[j];

      auto move = [&score_up, &score]() {
        // In case of equality, moving UP get us closer to the start of the candidate string.
        if (score > score_up) {
          return Direction::LEFT;
        }
        score = score_up;
        return Direction::UP;
      }();

      // Only take alignment if it's the absolute best option.
      if (align > score) {
        score = align;
        move = Direction::DIAGONAL;
      } else {
        // If we do not take this character, break consecutive sequence.
        // (when consecutive is 0, it'll be recomputed)
        csc_score = 0;
      }

      score_row[j] = score;
      csc_row[j] = csc_score;

      assert(0u <= pos && pos < trace.size());
      trace[pos] = score > 0 ? move : Direction::STOP;

      ++pos;

      ++j;
    }
    assert(0u <= j && j <= query_size);

    ++i;
  }
  assert(0 <= i && i <= subject_lw.size());

  // -------------------
  // Go back in the trace matrix
  // and collect matches (diagonals)

  // TODO narrowing conversions

  const auto query_size_int = static_cast<int>(query_size);

  auto ii = static_cast<int>(subject_size) - 1;
  auto jj = query_size_int - 1;
  auto pos_ = static_cast<size_t>(ii * query_size_int + jj);
  auto backtrack = true;
  std::vector<size_t> matches;

  while (backtrack && ii >= 0 && jj >= 0) {
    switch (trace[pos_]) {
    case Direction::UP:
      ii--;
      pos_ -= query_size;
      break;
    case Direction::LEFT:
      jj--;
      pos_--;
      break;
    case Direction::DIAGONAL:
      matches.emplace_back(ii + offset);
      jj--;
      ii--;
      pos_ -= query_size + 1;
      break;
    default:
      backtrack = false;
    }
  }

  std::reverse(matches.begin(), matches.end());
  return matches;
}

std::vector<size_t> basenameMatch(const CandidateString &subject, const CandidateString &subject_lw,
                                  const PreparedQuery &preparedQuery, char pathSeparator) {
  // Skip trailing slashes
  auto end = subject.size() - 1;
  while (subject[end] == pathSeparator) {
    end--;
  }

  // Get position of basePath of subject.
  auto basePos = subject.rfind(pathSeparator, end);

  // If no PathSeparator, no base path exist.
  if (basePos == std::string::npos) {
    return std::vector<size_t>();
  }

  // Get the number of folder in query
  auto depth = preparedQuery.depth;

  // Get that many folder from subject
  while (depth-- > 0) {
    basePos = subject.rfind(pathSeparator, basePos - 1);
    if (basePos == std::string::npos) { // consumed whole subject ?
      return std::vector<size_t>();
    }
  }

  // Get basePath match
  basePos++;
  end++;
  return computeMatch(subject.substr(basePos, end - basePos), subject_lw.substr(basePos, end - basePos),
                      preparedQuery, basePos);
}

//
// Combine two matches result and remove duplicate
// (Assume sequences are sorted, matches are sorted by construction.)
//
std::vector<size_t> mergeMatches(const std::vector<size_t> &a, const std::vector<size_t> &b) {
  const auto a_size = a.size();
  const auto b_size = b.size();

  if (b_size == 0u) {
    return a;
  }
  if (a_size == 0u) {
    return b;
  }

  auto i = 0u;
  auto j = 0u;
  auto bj = b[j];
  std::vector<size_t> out;

  while (i < a_size) {
    auto ai = a[i];

    while (bj <= ai && ++j < b_size) {
      if (bj < ai) {
        out.emplace_back(bj);
      }
      bj = b[j];
    }
    out.emplace_back(ai);
    ++i;
  }
  while (j < b_size) {
    out.emplace_back(b[j++]);
  }
  return out;
}

// Return position of character which matches
std::vector<size_t> matcher_match(const CandidateString &string, const Element &query,
                                  const Options &options) {
  const auto string_lw = ToLower(string);
  auto matches = computeMatch(string, string_lw, options.preparedQuery);

  if (string.find(options.pathSeparator) != std::string::npos) {
    const auto baseMatches = basenameMatch(string, string_lw, options.preparedQuery, options.pathSeparator);
    return mergeMatches(matches, baseMatches);
  }
  return matches;
}

void get_wrap(const CandidateString &string, const Element &query, const Options &options, std::string *out) {
  // const auto tagClass = "highlight"s;
  // const auto tagOpen = "<strong class=\""s + tagClass + "\">"s;
  const auto tagOpen = R"(<strong class="highlight">)"s;
  const auto tagClose = "</strong>"s;

  if (string == query) {
    *out = tagOpen + string + tagClose;
    return;
  }

  // Run get position where a match is found
  auto matchPositions = matcher_match(string, query, options);

  // If no match return as is
  if (matchPositions.empty()) {
    *out = string;
    return;
  }

  // Loop over match positions
  std::string output;
  auto matchIndex = 0u;
  auto strPos = 0u;
  while (matchIndex < matchPositions.size()) {
    auto matchPos = matchPositions[matchIndex];
    matchIndex++;

    // Get text before the current match position
    if (matchPos > strPos) {
      output += string.substr(strPos, matchPos - strPos);
      strPos = matchPos;
    }

    // Get consecutive matches to wrap under a single tag
    while (matchIndex < matchPositions.size()) {
      matchIndex++;
      if (matchPositions[matchIndex - 1] == matchPos + 1) {
        matchPos++;
      } else {
        matchIndex--;
        break;
      }
    }

    // Get text inside the match, including current character
    matchPos++;
    if (matchPos > strPos) {
      output += tagOpen;
      output += string.substr(strPos, matchPos - strPos);
      output += tagClose;
      strPos = matchPos;
    }
  }

  // Get string after last match
  if (strPos <= string.size() - 1) {
    output += string.substr(strPos);
  }

  // return wrapped text
  *out = output;
}

} // namespace zadeh
#endif
