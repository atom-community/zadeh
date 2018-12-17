#include <vector>
#include <set>
#include <string>
#include <cmath>
#include <algorithm>
#include <cstring>

using namespace std;

typedef std::string Element;
typedef std::string Candidate;
typedef std::vector<Candidate> Candidates;
typedef float Score;

struct Options;

struct PreparedQuery {
  Element query;
  Element query_lw;
  Element core;
  Element core_lw;
  Element core_up;
  int depth = 0;
  Element ext;
  std::set<char> charCodes;

  PreparedQuery(const Element &q, char pathSeparator);
};

struct Options {
  size_t max_results = 0;
  bool allowErrors = false;
  bool usePathScoring = true;
  bool useExtensionBonus = false;
  char pathSeparator = '/';
  const PreparedQuery preparedQuery;

  Options(const string &query, size_t maxResults, bool usePathScoring, bool useExtensionBonus) : max_results(maxResults), usePathScoring(usePathScoring), useExtensionBonus(useExtensionBonus), preparedQuery(query, pathSeparator) {}
};

extern std::string ToLower(const std::string &s);
extern std::string ToUpper(const std::string &s);

extern bool isMatch(const Candidate &subject, const Element &query_lw, const Element &query_up);
extern Score computeScore(Candidate subject, Candidate subject_lw, PreparedQuery preparedQuery);

extern Score scorer_score(const Candidate &string, const Element &query, Options &options);
extern Score scoreSize(Score n, Score m);

extern Score path_scorer_score(const Candidate &string, const Element &query, Options &options);
extern int countDir(const Candidate &path, int end, char pathSeparator);
extern Candidate getExtension(const Candidate &str);

extern Candidates filter(const Candidates &candidates, const Element &query, Options &options);
