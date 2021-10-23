#ifndef Zadeh_common_h_
#define Zadeh_common_h_

#include <vector>
#include <set>
#include <string>
#include <algorithm>
#include <utility>
#include <cassert>
#include <thread>
#include <optional>

namespace zadeh {

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

Element ToLower(const Element &s) {
  auto snew = string(s.size(), ' '); // new string
  std::transform(s.begin(), s.end(), snew.begin(), ::tolower);
  return snew;
}

Element ToUpper(const Element &s) {
  auto snew = string(s.size(), ' '); // new string
  std::transform(s.begin(), s.end(), snew.begin(), ::toupper);
  return snew;
}

auto get_num_chunks(const size_t N) { return N < 1000u * kMaxThreads ? N / 1000u + 1u : kMaxThreads; }

} // namespace zadeh
#endif // Zadeh_common_h_
