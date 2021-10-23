#ifndef Zadeh_options_h_
#define Zadeh_options_h_

#include "common.h"

namespace zadeh {

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

  explicit Options(const Element &_query, size_t _maxResults, bool _usePathScoring, bool _useExtensionBonus)
      : max_results(_maxResults), usePathScoring(_usePathScoring), useExtensionBonus(_useExtensionBonus),
        preparedQuery(_query, pathSeparator) {}
  explicit Options(const Element &_query, char _pathSeparator)
      : pathSeparator(_pathSeparator), preparedQuery(_query, _pathSeparator) {}
};

} // namespace zadeh
#endif
