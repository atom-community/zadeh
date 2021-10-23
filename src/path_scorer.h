#ifndef Zadeh_path_scorer_h_
#define Zadeh_path_scorer_h_

#include "common.h"
#include "options.h"
#include "scorer.h"

namespace zadeh {

// Directory depth at which the full path influence is halved.
constexpr size_t tau_depth = 20;

// Full path is also penalized for length of basename. This adjust a scale factor for that penalty.
constexpr Score file_coeff = 2.5;

//
// Find fraction of extension that is matched by query.
// For example mf.h prefers myFile.h to myfile.html
// This need special handling because it give point for not having characters (the `tml` in above example)
//
CandidateString getExtension(const CandidateString &str) {
  const auto pos = str.rfind('.');
  return pos == string::npos ? "" : str.substr(pos + 1);
}

Score getExtensionScore(const CandidateString &candidate, const CandidateString &ext, const int startPos,
                        const int endPos, const int maxDepth) {
  // TODO make startPos and endPos size_t and m, n, pos auto
  // startPos is the position of last slash of candidate, -1 if absent.

  if (ext.empty()) {
    return 0;
  }

  // Check that (a) extension exist, (b) it is after the start of the basename
  int pos = candidate.rfind('.', endPos);
  assert(pos >= 0u);
  if (pos <= startPos) {
    return 0; // (note that startPos >= -1)
  }

  int ext_size = ext.size();
  auto m = endPos - pos;

  // n contain the smallest of both extension length, m the largest.
  if (m < ext_size) {
    ext_size = m;
    m = ext.size();
  }

  // place cursor after dot & count number of matching characters in extension
  pos++;
  assert(pos >= 1u);
  auto matched = 0;
  while (matched < ext_size) {
    assert(matched >= 0);                           // fuzz: if n==0, does not enter while and matched==0
    if (candidate[pos + matched] != ext[matched]) { // TODO candidate upper bound
      break;
    }
    ++matched;
  }
  assert(matched >= 0);

  // if nothing found, try deeper for multiple extensions, with some penalty for depth
  if (matched == 0u && maxDepth > 0) {
    return 0.9f * getExtensionScore(candidate, ext, startPos, pos - 2, maxDepth - 1);
  }

  // cannot divide by zero because m is the largest extension length and we return if either is 0
  return static_cast<Score>(matched) / static_cast<Score>(m);
}

//
// Count number of folder in a path.
// (consecutive slashes count as a single directory)
//
int countDir(const CandidateString &path, const size_t end, const char pathSeparator) {
  // TODO bounds

  if (end < 1u) {
    return 0;
  }

  auto count = 0u;
  auto i = 0u;

  // skip slash at the start so `foo/bar` and `/foo/bar` have the same depth.
  //  the following skips all the pathSeparator from the beginning of the given path
  while ((i < end) && (path[i] == pathSeparator)) {
    assert(0 <= i); // fuzz: if end==0, it does not enter while and i==0
    ++i;
  }
  assert(0 <= i); // if there were no pathSeparator i==0

  ++i; // the current char is certainly a non-pathSeparator, so we should check the other following ones
  while (i < end) {
    assert(0 <= i && i < path.size()); // fuzz: if end==0, it does not enter while and i==0
    if (path[i] == pathSeparator) {
      count++; // record first slash, but then skip consecutive ones

      // skip consecutive slashes:
      ++i; // current one is already pathSeparator, so we should check the other following ones
      while ((i < end) && (path[i] == pathSeparator)) {
        ++i;
      }
      // once a non-pathSeparator is found the above while exits
      // after this, i is certainly a non-pathSeparator, so we should check the other following ones, so i is
      // incremented before the next loop;
    }
    ++i;
  }
  // assert(0 <= i && i <= path.size()); // TODO
  // cout << "i" << i << endl << "path.size()" << path.size() << endl;

  return count;
}

//
// Score adjustment for path
//
Score scorePath(const CandidateString &subject, const CandidateString &subject_lw, Score fullPathScore,
                const Options &options) {
  if (fullPathScore == 0) {
    return 0;
  }

  // {preparedQuery, useExtensionBonus, pathSeparator} = options

  // Skip trailing slashes
  int end = subject.size() - 1;
  while (subject[end] == options.pathSeparator) {
    end--;
  }

  // Get position of basePath of subject.
  int basePos = subject.rfind(options.pathSeparator, end);
  const auto fileLength = end - basePos;

  // Get a bonus for matching extension
  Score extAdjust = 1.0;

  if (options.useExtensionBonus) {
    extAdjust += getExtensionScore(subject_lw, options.preparedQuery.ext, basePos, end, 2);
    fullPathScore *= extAdjust;
  }

  // no basePath, nothing else to compute.
  if (basePos == -1) {
    return fullPathScore;
  }

  // Get the number of folder in query
  auto depth = options.preparedQuery.depth;

  // Get that many folder from subject
  while (basePos > -1 && depth-- > 0) {
    basePos = subject.rfind(options.pathSeparator, basePos - 1);
  }

  // Get basePath score, if BaseName is the whole string, no need to recompute
  // We still need to apply the folder depth and filename penalty.
  const auto basePathScore = basePos == -1 ? fullPathScore
                                           : extAdjust * computeScore(subject.substr(basePos + 1, end + 1),
                                                                      subject_lw.substr(basePos + 1, end + 1),
                                                                      options.preparedQuery);

  // Final score is linear interpolation between base score and full path score.
  // For low directory depth, interpolation favor base Path then include more of full path as depth increase
  //
  // A penalty based on the size of the basePath is applied to fullPathScore
  // That way, more focused basePath match can overcome longer directory path.

  const Score alpha = (0.5 * tau_depth) / (tau_depth + countDir(subject, end + 1, options.pathSeparator));
  return alpha * basePathScore + (1 - alpha) * fullPathScore * scoreSize(0, file_coeff * fileLength);
}

//
// Main export
//
// Manage the logic of testing if there's a match and calling the main scoring function
// Also manage scoring a path and optional character.

Score path_scorer_score(const CandidateString &string, const Element &query, const Options &options) {
  if (!options.allowErrors &&
      !isMatch(string, options.preparedQuery.core_lw, options.preparedQuery.core_up)) {
    return 0;
  }
  const auto string_lw = ToLower(string);
  auto sc = computeScore(string, string_lw, options.preparedQuery);
  sc = scorePath(string, string_lw, sc, options);
  return ceil(sc);
}

} // namespace zadeh
#endif
