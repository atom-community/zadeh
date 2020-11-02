#include "common.h"

extern Element coreChars(Element query);
extern std::set<char> getCharCodes(const Element &str);

PreparedQuery::PreparedQuery(const Element &q, char pathSeparator) : query(q), query_lw(ToLower(q)), core(coreChars(q)), core_lw(ToLower(core)), core_up(ToUpper(core)) {
    depth = countDir(query, query.size(), pathSeparator);
    ext = getExtension(query_lw);
    charCodes = getCharCodes(query_lw);
}

//
// Optional chars
// Those char improve the score if present, but will not block the match (score=0) if absent.


Element coreChars(Element query) {
    for (auto ch : " _-:/\\") {
        query.erase(std::remove(query.begin(), query.end(), ch), query.end());
    }
    return query;
}

std::set<char> getCharCodes(const Element &str) {
    std::set<char> charCodes;
    const int len = str.size();
    auto i = -1;

    // create map
    while (++i < len)
        charCodes.insert(str[i]);
    return charCodes;
}
