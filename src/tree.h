#include <variant>

struct CandidateObject {
	CandidateString data;
	size_t level = 0;
	int32_t index = -1;

	CandidateObject(CandidateString const data, size_t const level, int32_t const index);
};

template <typename T>
struct Tree {
	T jsTreeArrayOrObject;
	string dataKey;
	string childrenKey;
	vector<CandidateObject> entriesArray;

	Tree(T const _jsTreeArrayOrObject, string const _dataKey, string const _childrenKey) {};
};