#include <variant>

template <typename T>
struct Tree {
	T jsTreeArrayOrObject;
	string dataKey;
	string childrenKey;

	Tree(T const _jsTreeArrayOrObject, string const _dataKey, string const _childrenKey) {};
};