#ifndef Zadeh_scorer_h_
#define Zadeh_scorer_h_

#include <cmath>
#include <iostream> // cerr

#include "common.h"
#include "options.h"

namespace zadeh {

//
// Score similarity between two string
//
//  isMatch: Fast detection if all character of needle is in haystack
//  score: Find string similarity using a Smith Waterman algorithm
//         Modified to account for programing scenarios (CamelCase folder/file.ext object.property)

// Base point for a single character match
// This balance making patterns VS position and size penalty.
constexpr int wm = 150;

// Fading function
// The character from 0..pos_bonus receive a greater bonus for being at the start of string.
constexpr Score pos_bonus = 20;
// Full path length at which the whole match score is halved.
constexpr Score tau_size = 150;

// Miss count
// When subject[i] is query[j] we register a hit.
// Limiting hit put a boundary on how many permutation we consider to find the best one.
// Helps to speed-up processing of long path and query containing frequent character (eg vowels)
//
// If a spec with frequent repetition fail, increase this.
// This has a direct influence on worst case scenario benchmark.
constexpr float miss_coeff = 0.75; // Max number missed consecutive hit = ceil(miss_coeff*query.length) + 5

//
// isMatch:
// Are all (non optional)characters of query in subject, in proper order ?
//
bool isMatch(const CandidateString &subject, const Element &query_lw, const Element &query_up) {
  const auto subject_size = subject.size();
  const auto query_lw_size = query_lw.size();

  if (subject_size == 0 || query_lw_size > subject_size) {
    return false;
  }
  // if (query_up.empty()) {// TODO will query_up be ever empty?
  //     // TODO don't know what to do. return true; seems to pass the tests
  // }

  auto i = 0u;
  auto j = 0u;

  // foreach char of query
  while (j < query_lw_size) {
    assert(0 <= j && j < query_lw.size()); // fuzz: if n==0, does not enter while and j==0
    const auto qj_lw = query_lw[j];        // inbounds
    const auto qj_up = query_up[j];        // TODO bounds

    // continue walking the subject from where we have left with previous query char
    // until we have found a character that is either lowercase or uppercase query.
    while (i < subject_size) {
      assert(0 <= i && i < subject.size()); // fuzz: if m==0, does not enter while and i==0
      const auto si = subject[i];           // inbounds
      if (si == qj_lw || si == qj_up) {
        break;
      }

      ++i;
    }
    assert(0 <= i && i <= subject.size());

    // if we passed the last char, query is not in subject
    if (i == subject_size) {
      assert(i >= 0); // fuzz: if m==0, i is 0
      return false;
    }

    ++j;
  }
  assert(0 <= j && j <= query_lw.size());

  // Found every char of query in subject in proper order, match is positive
  return true;
}

constexpr bool isSeparator(const char c) noexcept {
  return c == ' ' || c == '.' || c == '-' || c == '_' || c == '/' || c == '\\';
}

//
// Boundaries
//
// Is the character at the start of a word, end of the word, or a separator ?
// Fortunately those small function inline well.
//
bool isWordStart(const size_t pos, const CandidateString &subject,
                 const CandidateString &subject_lw) noexcept {
  if (pos == 0u) {
    return true; // match is FIRST char ( place a virtual token separator before first char of string)
  }
  assert(0u < pos && pos < subject.size());
  const auto curr_s = subject[pos];
  const auto prev_s = subject[pos - 1]; // inbounds
  return isSeparator(prev_s) ||         // match FOLLOW a separator
         ((curr_s != subject_lw[pos]) &&
          (prev_s == subject_lw[pos - 1])); // match is Capital in camelCase (preceded by lowercase)
}

bool isWordEnd(const size_t pos, const CandidateString &subject, const CandidateString &subject_lw,
               const size_t len) {
  if (pos == len - 1u) {
    return true; // last char of string
  }
  const auto curr_s = subject[pos];
  const auto next_s = subject[pos + 1];
  return isSeparator(next_s) || // match IS FOLLOWED BY a separator
         ((curr_s == subject_lw[pos]) &&
          (next_s != subject_lw[pos + 1])); // match is lowercase, followed by uppercase
}

//
// Scoring helper
//
Score scorePosition(const Score pos) noexcept {
  if (pos < pos_bonus) {
    const auto sc = pos_bonus - pos;
    return 100 + sc * sc;
  }
  return fmax(100 + pos_bonus - pos, 0);
}

Score scoreSize(const Score n, const Score m) {
  // TODO will the denominator will be ever 0?
  // Size penalty, use the difference of size (m-n)
  return tau_size / (tau_size + fabs(m - n));
}

Score scoreExact(const size_t n, const size_t m, const size_t quality, const Score pos) {
  return 2 * n * (wm * quality + scorePosition(pos)) * scoreSize(n, m);
}

//
// Shared scoring logic between exact match, consecutive & acronym
// Ensure pattern length dominate the score then refine to take into account case-sensitivity
// and structural quality of the pattern on the overall string (word boundary)
//

constexpr Score scorePattern(const size_t count, const size_t len, const size_t sameCase, const bool start,
                             const bool end) noexcept {
  auto sz = count;

  auto bonus = 6; // to ensure consecutive length dominate score, this should be as large other bonus combined
  if (sameCase == count) {
    bonus += 2;
  }
  if (start) {
    bonus += 3;
  }
  if (end) {
    bonus += 1;
  }

  if (count == len) {
    // when we match 100% of query we allow to break the size ordering.
    // This is to help exact match bubble up vs size, depth penalty etc
    if (start) {
      if (sameCase == len) {
        sz += 2;
      } else {
        sz += 1;
      }
    }
    if (end) {
      bonus += 1;
    }
  }

  return sameCase + sz * (sz + bonus);
}

//
// Compute the bonuses for two chars that are confirmed to matches in a case-insensitive way
//
Score scoreCharacter(const size_t i, const size_t j, const bool start, const Score acro_score,
                     const Score csc_score) {
  // TODO j is not used!

  // start of string / position of match bonus
  const auto posBonus = scorePosition(static_cast<Score>(i));

  // match IS a word boundary
  // choose between taking part of consecutive characters or consecutive acronym
  if (start) {
    return posBonus + wm * ((acro_score > csc_score ? acro_score : csc_score) + 10);
  }

  // normal Match
  return posBonus + wm * csc_score;
}

//
// Forward search for a sequence of consecutive character.
//
Score scoreConsecutives(const CandidateString &subject, const CandidateString &subject_lw,
                        const Element &query, const Element &query_lw, size_t i, size_t j,
                        const bool startOfWord) {
  const auto subject_size = subject.size();
  const auto query_size = query.size();

  // TODO do we need this check?
  if (!(j < query_size) || !(i <= subject_size)) {
    cerr << "\n out of bounds! \n j, query_size, i, subject_size \n"
         << j << query_size << i << subject_size << '\n';
    std::abort();
  }

  auto sameCase = 0u;
  // query_lw[i] is subject_lw[j] has been checked before entering now do case sensitive check.
  if (query[j] == subject[i]) {
    sameCase++;
  }

  auto sz = 1u; // sz will be one more than the last qi is sj
  const auto min_subject_size_i_query_size_j = min(subject_size - i, query_size - j);
  assert(1u <= min_subject_size_i_query_size_j);

  // Continue while lowercase char are the same, record when they are case-sensitive match.
  while (sz < min_subject_size_i_query_size_j && query_lw[++j] == subject_lw[++i]) {
    assert(1u <= sz && sz < min_subject_size_i_query_size_j); // fuzz: if min_subject_size_i_query_size_j==1u
                                                              // does not enter while loop, and sz ==1u
    if (query[j] == subject[i]) {
      sameCase++;
    }
    ++sz;
  }
  assert(1u <= sz && sz <= min_subject_size_i_query_size_j);

  // If we quit because of a non match
  // replace cursor to the last match
  if (sz < min_subject_size_i_query_size_j) { // equal to: sz != min_subject_size_i_query_size_j
    i--;
  }

  // Faster path for single match.
  // Isolated character match occurs often and are not really interesting.
  // Fast path so we don't compute expensive pattern score on them.
  // Acronym should be addressed with acronym context bonus instead of consecutive.
  if (sz == 1u) {
    return static_cast<Score>(1u + 2u * sameCase);
  }

  return scorePattern(sz, query_size, sameCase, startOfWord, isWordEnd(i, subject, subject_lw, subject_size));
}

//
// Compute the score of an exact match at position pos.
//
Score scoreExactMatch(const CandidateString &subject, const CandidateString &subject_lw, const Element &query,
                      const Element &query_lw, size_t pos, const size_t n, const size_t m) {

  // Test for word start
  auto start = isWordStart(pos, subject, subject_lw);

  // Heuristic
  // If not a word start, test next occurrence
  // - We want exact match to be fast
  // - For exact match, word start has the biggest impact on score.
  // - Testing 2 instances is somewhere between testing only one and testing every instances.

  if (!start) {
    const auto pos2 = subject_lw.find(query_lw, pos + 1);
    if (pos2 != string::npos) {
      start = isWordStart(pos2, subject, subject_lw);
      if (start) {
        pos = pos2;
      }
    }
  }

  // Exact case bonus.
  auto i = 0u;
  auto sameCase = 0u;
  while (i < n) {
    assert(i >= 0); // fuzz: if n==0, does not enter while and i==0u
    if (query[i] == subject[pos + i]) {
      sameCase++;
    }
    ++i;
  }
  assert(i >= 0);

  const auto end = isWordEnd(pos + n - 1u, subject, subject_lw, m);

  Score baseNameStart = 1.0;
  if (start && pos > 0 && (subject[pos - 1] == '/' || subject[pos - 1] == '\\')) {
    baseNameStart = static_cast<Score>(1.1);
  }

  return scoreExact(n, m, baseNameStart * scorePattern(n, n, sameCase, start, end), pos);
}

//
// Acronym prefix
//

struct AcronymResult {
  Score score;
  float pos;
  size_t count;

  explicit AcronymResult(Score s, float p, size_t c) noexcept : score(s), pos(p), count(c) {}
};

//
// Test whether there's a 1:1 relationship between query and acronym of candidate.
// For that to happens
// (a) All character of query must be matched to an acronym of candidate
// (b) All acronym of candidate must be matched to a character of query.
//
// This method check for (b) assuming (a) has been checked before entering.

bool isAcronymFullWord(const CandidateString &subject, const CandidateString &subject_lw,
                       const Element &query, const unsigned nbAcronymInQuery) noexcept {
  const auto subject_size = subject.size();
  const auto query_size = query.size();
  auto count = 0u;

  // Heuristic:
  // Assume one acronym every (at most) 12 character on average
  // This filter out long paths, but then they can match on the filename.
  if (subject_size > 12u * query_size) {
    return false;
  }

  auto i = 0u;
  while (i < subject_size) {
    assert(i >= 0); // fuzz: if m==0, does not enter while and i==0
    // For each char of subject
    // Test if we have an acronym, if so increase acronym count.
    // If the acronym count is more than nbAcronymInQuery (number of non separator char in query)
    // Then we do not have 1:1 relationship.
    if (isWordStart(i, subject, subject_lw) && (++count > nbAcronymInQuery)) {
      return false;
    }

    ++i;
  }
  assert(i >= 0);

  return true;
}

const auto emptyAcronymResult =
    AcronymResult(static_cast<Score>(0), static_cast<float>(0.1), static_cast<int>(0));

AcronymResult scoreAcronyms(const CandidateString &subject, const CandidateString &subject_lw,
                            const Element &query, const Element &query_lw) {
  const auto subject_size = subject.size();
  const auto query_size = query.size();

  // TODO do we need this inbounds check?
  if (query_lw.size() < query_size) {
    std::cerr << out_of_range("query_lw.size() < n").what();
    abort();
  }

  // a single char is not an acronym
  if (subject_size <= 1 || query_size <= 1) {
    return emptyAcronymResult;
  }

  auto count = 0u;
  auto sepCount = 0;
  auto sumPos = 0;
  auto sameCase = 0;

  auto i = string::npos; // incrementing will become 0

  // foreach char of query
  for (auto j = 0u; j < query_size; j++) {
    assert(0u <= j && j < query_lw.size());
    const auto qj_lw = query_lw[j];

    // Separator will not score point but will continue the prefix when present.
    // Test that the separator is in the candidate and advance cursor to that position.
    // If no separator break the prefix

    if (isSeparator(qj_lw)) {
      i = subject_lw.find(qj_lw, i + 1);
      if (i != string::npos) {
        sepCount++;
        continue;
      }
      break;
    }

    // For other characters we search for the first match where subject[i] = query[j]
    // that also happens to be a start-of-word

    while (++i < subject_size) {
      if (qj_lw == subject_lw[i] && isWordStart(i, subject, subject_lw)) {
        if (query[j] == subject[i]) { // TODO bounds
          sameCase++;
        }
        sumPos += i;
        count++;
        break;
      }
    }

    // All of subject is consumed, stop processing the query.
    if (i == subject_size) {
      break;
    }
  }

  // Here, all of query is consumed (or we have reached a character not in acronym)
  // A single character is not an acronym (also prevent division by 0)
  if (count < 2) {
    return emptyAcronymResult;
  }

  // Acronym are scored as start-of-word
  // Unless the acronym is a 1:1 match with candidate then it is upgraded to full-word.
  const auto fullWord = count == query_size ? isAcronymFullWord(subject, subject_lw, query, count) : false;
  const auto score = scorePattern(count, query_size, sameCase, true, fullWord);

  return AcronymResult(score, static_cast<Score>(sumPos) / count, count + sepCount);
}

//----------------------------------------------------------------------
//
// Main scoring algorithm
//
Score computeScore(const CandidateString &subject, const CandidateString &subject_lw,
                   const PreparedQuery &preparedQuery) {
  const auto &query = preparedQuery.query;
  const auto &query_lw = preparedQuery.query_lw;

  const auto subject_size = subject.size();
  const auto query_size = query.size();

  //----------------------------
  // Abbreviations sequence

  const auto acro = scoreAcronyms(subject, subject_lw, query, query_lw);
  const auto acro_score = acro.score;

  // Whole query is abbreviation ?
  // => use that as score
  if (acro.count == query_size) {
    return scoreExact(query_size, subject_size, acro_score, acro.pos);
  }

  //----------------------------
  // Exact Match ?
  // => use that as score

  const auto pos = subject_lw.find(query_lw);
  if (pos != std::string::npos) {
    return scoreExactMatch(subject, subject_lw, query, query_lw, pos, query_size, subject_size);
  }

  //----------------------------
  // Individual characters
  // (Smith Waterman algorithm)

  // Init
  // Fill with 0
  vector<Score> score_row(query_size, 0);
  vector<Score> csc_row(query_size, 0);
  const auto sz = scoreSize(query_size, subject_size);

  const auto miss_budget = ceil(miss_coeff * query_size) + 5;
  auto miss_left = miss_budget;
  auto csc_should_rebuild = true;

  auto i = 0u;
  while (i < subject_size) { // foreach char si of subject
    assert(i >= 0);          // fuzz: if m==0, does not enter while and i==0
    auto si_lw = subject_lw[i];

    // if si_lw is not in query
    if (preparedQuery.charCodes.find(si_lw) == preparedQuery.charCodes.end()) {
      // reset csc_row and move to next subject char
      // unless we just cleaned it then keep cleaned version.
      if (csc_should_rebuild) {
        auto k = 0u;
        while (k < query_size) {
          assert(k >= 0); // fuzz: if n==0, does not enter while and k==0
          csc_row[k] = 0;
          ++k;
        }
        assert(k >= 0);
        csc_should_rebuild = false;
      }

      ++i;
      continue;
    }

    Score score = 0;
    Score score_diag = 0;
    Score csc_diag = 0;
    auto record_miss = true;
    csc_should_rebuild = true;

    auto j = 0u;             // 0..n-1
    while (j < query_size) { // foreach char qj of query
      assert(j >= 0);        // fuzz: if n==0, does not enter while and j==0
      // What is the best gap ?
      // score_up contain the score of a gap in subject.
      // score_left = last iteration of score, -> gap in query.
      const auto score_up = score_row[j];
      if (score_up > score) {
        score = score_up;
      }

      // Reset consecutive
      Score csc_score = 0;

      // Compute a tentative match
      if (query_lw[j] == si_lw) {
        const auto start = isWordStart(i, subject, subject_lw);

        // Forward search for a sequence of consecutive char
        csc_score =
            csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);

        // Determine bonus for matching A[i] with B[j]
        const auto align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);

        // Are we better using this match or taking the best gap (currently stored in score)?
        if (align > score) {
          score = align;
          // reset consecutive missed hit count
          miss_left = miss_budget;
        } else {
          // We rejected this match and record a miss.
          // If budget is exhausted exit
          // Each character of query have it's score history stored in score_row
          // To get full query score use last item of row.
          if (record_miss && --miss_left <= 0) {
            return fmax(score, score_row[query_size - 1]) * sz;
          }

          record_miss = false;
        }
      }

      // Prepare next sequence & match score.
      score_diag = score_up;
      csc_diag = csc_row[j];
      csc_row[j] = csc_score;
      score_row[j] = score;

      ++j;
    }
    assert(j >= 0);
    ++i;
  }
  assert(i >= 0); // fuzz: if m==0, does not enter while and i==0
  // get highest score so far
  const auto score = score_row[query_size - 1];
  return score * sz;
}

//
// Main export
//
// Manage the logic of testing if there's a match and calling the main scoring function
// Also manage scoring a path and optional character.

Score scorer_score(const CandidateString &string, const Element &query, const Options &options) {
  // {preparedQuery, allowErrors} = options
  if (!options.allowErrors &&
      !isMatch(string, options.preparedQuery.core_lw, options.preparedQuery.core_up)) {
    return 0;
  }
  const auto string_lw = ToLower(string);
  const auto score = computeScore(string, string_lw, options.preparedQuery);
  return ceil(score);
}

} // namespace zadeh
#endif
