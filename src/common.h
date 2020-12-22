#ifndef Fuzzaldrin_common_h_
#define Fuzzaldrin_common_h_

#include <vector>
#include <set>
#include <string>
#include <cmath>
#include <algorithm>
#include <cstring>
#include <iostream>
#include <utility>
#include <cassert>
#include <thread>

#include <napi.h>

using namespace std;

static const auto kMaxThreads = std::thread::hardware_concurrency();

#ifdef ENABLE_DEBUG
// TODO does not work anymore because we added explicit to constructors
// Safe string class that logs error when index is accessed outside the string.
class SafeString : public std::string {
  public:
    explicit SafeString() = default;
    explicit SafeString(const std::string &s) : std::string(s) {}
    const char &operator[](size_t i) const {
        if (i >= size()) {
            printf("ERROR string index access index=%zu str=%s\n", i, c_str());
        }
        return at(i);
    }
};

using Element = SafeString;
using CandidateString = SafeString;
#else
using Element = string;
using CandidateString = string;
#endif

using CandidateIndex = size_t;

using Score = float;

struct Options;

struct PreparedQuery {
    Element query;
    Element query_lw;
    Element core;
    Element core_lw;
    Element core_up;
    int depth = 0;
    Element ext;
    std::set<char> charCodes{};

    explicit PreparedQuery(const Element &q, const char pathSeparator);
};

struct Options {
    size_t max_results = 0;
    bool allowErrors = false;
    bool usePathScoring = true;
    bool useExtensionBonus = false;
#ifdef _WIN32
    char pathSeparator = '\\';
#else
    char pathSeparator = '/';
#endif
    const PreparedQuery preparedQuery;

    explicit Options(const Element &_query, size_t _maxResults, bool _usePathScoring, bool _useExtensionBonus) : max_results(_maxResults), usePathScoring(_usePathScoring), useExtensionBonus(_useExtensionBonus), preparedQuery(_query, pathSeparator) {}
    explicit Options(const Element &_query, char _pathSeparator) : pathSeparator(_pathSeparator), preparedQuery(_query, _pathSeparator) {}
};

struct AcronymResult {
    Score score;
    float pos;
    size_t count;

    explicit AcronymResult(Score s, float p, size_t c) noexcept : score(s), pos(p), count(c) {}
};

Element ToLower(const Element &s) {
    string snew = string(s.size(), ' ');    // new string
    std::transform(s.begin(), s.end(), snew.begin(), ::tolower);
    return snew;
}

Element ToUpper(const Element &s) {
    string snew = string(s.size(), ' ');    // new string
    std::transform(s.begin(), s.end(), snew.begin(), ::toupper);
    return snew;
}

#include "scorer.h"
#include "matcher.h"
#include "path_scorer.h"
#include "query.h"
#include "filter.h"

#endif    // Fuzzaldrin_common_h_
