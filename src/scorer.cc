#include "common.h"

//
// Score similarity between two string
//
//  isMatch: Fast detection if all character of needle is in haystack
//  score: Find string similarity using a Smith Waterman algorithm
//         Modified to account for programing scenarios (CamelCase folder/file.ext object.property)

namespace {

// Base point for a single character match
// This balance making patterns VS position and size penalty.
const int wm = 150;

// Fading function
// The character from 0..pos_bonus receive a greater bonus for being at the start of string.
const Score pos_bonus = 20;
// Full path length at which the whole match score is halved.
const Score tau_size = 150;

// Miss count
// When subject[i] is query[j] we register a hit.
// Limiting hit put a boundary on how many permutation we consider to find the best one.
// Helps to speed-up processing of long path and query containing frequent character (eg vowels)
//
// If a spec with frequent repetition fail, increase this.
// This has a direct influence on worst case scenario benchmark.
const float miss_coeff = 0.75; // Max number missed consecutive hit = ceil(miss_coeff*query.length) + 5

} // namepace

extern bool isWordEnd(int pos, const Candidate &subject, const Candidate &subject_lw, int len);
extern bool isSeparator(char c);
extern Score scoreExact(size_t n, size_t m, size_t quality, Score pos);

extern Score scorePattern(int count, int len, bool sameCase, bool start, bool end);
extern Score scoreExactMatch(const Candidate &subject, const Candidate &subject_lw, const Element &query, const Element &query_lw, int pos, int n, int m);

extern bool isAcronymFullWord(Candidate subject, Candidate subject_lw, Element query, int nbAcronymInQuery);


//
// Main export
//
// Manage the logic of testing if there's a match and calling the main scoring function
// Also manage scoring a path and optional character.

Score scorer_score(const Candidate &string, const Element &query, const Options &options) {
  // {preparedQuery, allowErrors} = options
  if (!options.allowErrors && !isMatch(string, options.preparedQuery.core_lw, options.preparedQuery.core_up)) {
    return 0;
  }
  const auto string_lw = ToLower(string);
  auto score = computeScore(string, string_lw, options.preparedQuery);
  return ceil(score);
}

//
// isMatch:
// Are all (non optional)characters of query in subject, in proper order ?
//
bool isMatch(const Candidate &subject, const Element &query_lw, const Element &query_up) {
  int m = subject.size();
  int n = query_lw.size();

  if (!m || n > m)
    return false;

  int i = -1;
  int j = -1;

  // foreach char of query
  while (++j < n) {
    char qj_lw = query_lw[j];
    char qj_up = query_up[j];

    // continue walking the subject from where we have left with previous query char
    // until we have found a character that is either lowercase or uppercase query.
    while (++i < m) {
      char si = subject[i];
      if (si == qj_lw || si == qj_up)
        break;
    }

    // if we passed the last char, query is not in subject
    if (i == m) return false;
  }

  // Found every char of query in subject in proper order, match is positive
  return true;
}


//----------------------------------------------------------------------
//
// Main scoring algorithm
//
Score computeScore(const Candidate &subject, const Candidate &subject_lw, const PreparedQuery &preparedQuery) {
  const auto& query = preparedQuery.query;
  const auto& query_lw = preparedQuery.query_lw;

  int m = subject.size();
  int n = query.size();

  //----------------------------
  // Abbreviations sequence

  auto acro = scoreAcronyms(subject, subject_lw, query, query_lw);
  auto acro_score = acro.score;

  // Whole query is abbreviation ?
  // => use that as score
  if (acro.count == n)
    return scoreExact(n, m, acro_score, acro.pos);

  //----------------------------
  // Exact Match ?
  // => use that as score

  auto pos = subject_lw.find(query_lw);
  if (pos != std::string::npos) {
    return scoreExactMatch(subject, subject_lw, query, query_lw, pos, n, m);
  }


  //----------------------------
  // Individual characters
  // (Smith Waterman algorithm)


  // Init
  vector<Score> score_row(n, 0);
  vector<Score> csc_row(n, 0);
  auto sz = scoreSize(n, m);

  auto miss_budget = ceil(miss_coeff * n) + 5;
  auto miss_left = miss_budget;
  bool csc_should_rebuild = true;

  // Fill with 0
  /*
  int j = -1;
  while (++j < n) {
    score_row[j] = 0;
    csc_row[j] = 0;
  }*/

  int i = -1;
  while (++i < m ) {    //foreach char si of subject
    char si_lw = subject_lw[i];

    // if si_lw is not in query
    if (preparedQuery.charCodes.find(si_lw) == preparedQuery.charCodes.end()) {
      // reset csc_row and move to next subject char
      // unless we just cleaned it then keep cleaned version.
      if (csc_should_rebuild) {
        int j = -1;
        while (++j < n) {
          csc_row[j] = 0;
        }
        csc_should_rebuild = false;
      }
      continue;
    }

    Score score = 0;
    Score score_diag = 0;
    Score csc_diag = 0;
    bool record_miss = true;
    csc_should_rebuild = true;

    int j = -1; //0..n-1
    while (++j < n) {   //foreach char qj of query

      // What is the best gap ?
      // score_up contain the score of a gap in subject.
      // score_left = last iteration of score, -> gap in query.
      Score score_up = score_row[j];
      if (score_up > score) score = score_up;

      //Reset consecutive
      Score csc_score = 0;

      //Compute a tentative match
      if ( query_lw[j] == si_lw ) {

        auto start = isWordStart(i, subject, subject_lw);

        // Forward search for a sequence of consecutive char
        csc_score = csc_diag > 0  ? csc_diag :
          scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);

        // Determine bonus for matching A[i] with B[j]
        Score align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);

        //Are we better using this match or taking the best gap (currently stored in score)?
        if(align > score) {
          score = align;
          // reset consecutive missed hit count
          miss_left = miss_budget;
        } else {
          // We rejected this match and record a miss.
          // If budget is exhausted exit
          // Each character of query have it's score history stored in score_row
          // To get full query score use last item of row.
          if(record_miss && --miss_left <= 0)
            return fmax(score, score_row[n - 1]) * sz;

          record_miss = false;
        }
      }


      //Prepare next sequence & match score.
      score_diag = score_up;
      csc_diag = csc_row[j];
      csc_row[j] = csc_score;
      score_row[j] = score;
    }
  }

  // get hightest score so far
  auto score = score_row[n - 1];
  return score * sz;
}


//
// Boundaries
//
// Is the character at the start of a word, end of the word, or a separator ?
// Fortunately those small function inline well.
//
bool isWordStart(int pos, const Candidate &subject, const Candidate &subject_lw) {
  if (pos == 0) return true; // match is FIRST char ( place a virtual token separator before first char of string)
  char curr_s = subject[pos];
  char prev_s = subject[pos - 1];
  return isSeparator(prev_s) || // match FOLLOW a separator
      (  curr_s != subject_lw[pos] &&
        prev_s == subject_lw[pos - 1] ); // match is Capital in camelCase (preceded by lowercase)
}

bool isWordEnd(int pos, const Candidate &subject, const Candidate &subject_lw, int len) {
  if (pos == len - 1) return true; // last char of string
  char curr_s = subject[pos];
  char next_s = subject[pos + 1];
  return isSeparator(next_s) || // match IS FOLLOWED BY a separator
      ( curr_s == subject_lw[pos] &&
        next_s != subject_lw[pos + 1] ); // match is lowercase, followed by uppercase
}

bool isSeparator(char c) {
  return c == ' ' || c == '.' || c == '-' || c == '_' || c == '/' || c == '\\';
}

//
// Scoring helper
//
Score scorePosition(Score pos) {
  if (pos < pos_bonus) {
    Score sc = pos_bonus - pos;
    return 100 + sc * sc;
  } else {
    return fmax(100 + pos_bonus - pos, 0);
  }
}

Score scoreSize(Score n, Score m) {
  // Size penalty, use the difference of size (m-n)
  return tau_size / ( tau_size + fabs(m - n));
}

Score scoreExact(size_t n, size_t m, size_t quality, Score pos) {
  return 2 * n * ( wm * quality + scorePosition(pos) ) * scoreSize(n, m);
}


//
// Shared scoring logic between exact match, consecutive & acronym
// Ensure pattern length dominate the score then refine to take into account case-sensitivity
// and structural quality of the pattern on the overall string (word boundary)
//

Score scorePattern(int count, int len, int sameCase, bool start, bool end) {
  auto sz = count;

  int bonus = 6; // to ensure consecutive length dominate score, this should be as large other bonus combined
  if (sameCase == count) bonus += 2;
  if (start) bonus += 3;
  if (end) bonus += 1;

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
    if (end)
      bonus += 1;
  }

  return sameCase + sz * ( sz + bonus );
}

//
// Compute the bonuses for two chars that are confirmed to matches in a case-insensitive way
//
Score scoreCharacter(int i, int j, bool start, Score acro_score, Score csc_score) {

  // start of string / position of match bonus
  Score posBonus = scorePosition(i);

  // match IS a word boundary
  // choose between taking part of consecutive characters or consecutive acronym
  if (start) {
    return posBonus + wm * ( (acro_score > csc_score ? acro_score : csc_score) + 10  );
  }

  // normal Match
  return posBonus + wm * csc_score;
}


//
// Forward search for a sequence of consecutive character.
//
Score scoreConsecutives(const Candidate &subject, const Candidate &subject_lw, const Element &query, const Element &query_lw, int i, int j, bool startOfWord) {
  auto m = subject.size();
  auto n = query.size();

  int mi = m - i;
  int nj = n - j;
  int k = mi < nj ? mi : nj;

  int sameCase = 0;
  int sz = 0; //sz will be one more than the last qi is sj

  // query_lw[i] is subject_lw[j] has been checked before entering now do case sensitive check.
  if (query[j] == subject[i]) sameCase++;

  //Continue while lowercase char are the same, record when they are case-sensitive match.
  while (++sz < k && query_lw[++j] == subject_lw[++i])
    if (query[j] == subject[i]) sameCase++;


  // If we quit because of a non match
  // replace cursor to the last match
  if (sz < k) i--;

  // Faster path for single match.
  // Isolated character match occurs often and are not really interesting.
  // Fast path so we don't compute expensive pattern score on them.
  // Acronym should be addressed with acronym context bonus instead of consecutive.
  if (sz == 1) return 1 + 2 * sameCase;

  return scorePattern(sz, n, sameCase, startOfWord, isWordEnd(i, subject, subject_lw, m));
}



//
// Compute the score of an exact match at position pos.
//
Score scoreExactMatch(const Candidate &subject, const Candidate &subject_lw, const Element &query, const Element &query_lw, int pos, int n, int m) {

  // Test for word start
  bool start = isWordStart(pos, subject, subject_lw);

  // Heuristic
  // If not a word start, test next occurrence
  // - We want exact match to be fast
  // - For exact match, word start has the biggest impact on score.
  // - Testing 2 instances is somewhere between testing only one and testing every instances.

  if (!start) {
    auto pos2 = subject_lw.find(query_lw, pos + 1);
    if (pos2 != string::npos) {
      start = isWordStart(pos2, subject, subject_lw);
      if (start) pos = pos2;
    }
  }

  //Exact case bonus.
  int i = -1;
  int sameCase = 0;
  while (++i < n) {
    if (query[i] == subject[pos + i])
      sameCase++;
  }

  int end = isWordEnd(pos + n - 1, subject, subject_lw, m);

  Score baseNameStart = 1.0;
  if (start && pos>0 && (subject[pos-1]=='/' || subject[pos-1]=='\\')) {
    baseNameStart = static_cast<Score>(1.1);
  }

  return scoreExact(n, m, baseNameStart*scorePattern(n, n, sameCase, start, end), pos);
}


//
// Acronym prefix
//

AcronymResult emptyAcronymResult(static_cast<Score>(0), static_cast<float>(0.1), static_cast<int>(0));

AcronymResult scoreAcronyms(Candidate subject, Candidate subject_lw, Element query, Element query_lw) {
  auto m = subject.size();
  auto n = query.size();

  //a single char is not an acronym
  if (m<=1 || n<=1) return emptyAcronymResult;

  size_t count = 0;
  int sepCount = 0;
  int sumPos = 0;
  int sameCase = 0;

  size_t i = string::npos;  // incrementing will become 0

  //foreach char of query
  for (size_t j=0; j<n; j++) {

    char qj_lw = query_lw[j];

    // Separator will not score point but will continue the prefix when present.
    // Test that the separator is in the candidate and advance cursor to that position.
    // If no separator break the prefix

    if (isSeparator(qj_lw)) {
      i = subject_lw.find(qj_lw, i + 1);
      if (i != string::npos) {
        sepCount++;
        continue;
      } else {
        break;
      }
    }

    // For other characters we search for the first match where subject[i] = query[j]
    // that also happens to be a start-of-word

    while (++i < m) {
      if (qj_lw == subject_lw[i] && isWordStart(i, subject, subject_lw)) {
        if ( query[j] == subject[i] )
          sameCase++;
        sumPos += i;
        count++;
        break;
      }
    }

    // All of subject is consumed, stop processing the query.
    if (i == m) break;
  }


  // Here, all of query is consumed (or we have reached a character not in acronym)
  // A single character is not an acronym (also prevent division by 0)
  if(count < 2)
    return emptyAcronymResult;

  // Acronym are scored as start-of-word
  // Unless the acronym is a 1:1 match with candidate then it is upgraded to full-word.
  bool fullWord = count == n ? isAcronymFullWord(subject, subject_lw, query, count) : false;
  auto score = scorePattern(count, n, sameCase, true, fullWord);

  return AcronymResult(score, Score(sumPos) / count, count + sepCount);
}


//
// Test whether there's a 1:1 relationship between query and acronym of candidate.
// For that to happens
// (a) All character of query must be matched to an acronym of candidate
// (b) All acronym of candidate must be matched to a character of query.
//
// This method check for (b) assuming (a) has been checked before entering.

bool isAcronymFullWord(Candidate subject, Candidate subject_lw, Element query, int nbAcronymInQuery) {
  int m = subject.size();
  int n = query.size();
  int count = 0;

  // Heuristic:
  // Assume one acronym every (at most) 12 character on average
  // This filter out long paths, but then they can match on the filename.
  if (m > 12 * n) return false;

  int i = -1;
  while (++i < m) {
    //For each char of subject
    //Test if we have an acronym, if so increase acronym count.
    //If the acronym count is more than nbAcronymInQuery (number of non separator char in query)
    //Then we do not have 1:1 relationship.
    if (isWordStart(i, subject, subject_lw) && ++count > nbAcronymInQuery) {
      return false;
    }
  }

  return true;
}
