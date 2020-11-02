#include <variant>

struct Tree {
	std::variant<Napi::Array, Napi::Object> jsTreeArrayOrObject;
	string dataKey;
	string childrenKey;

	Tree(Napi::Object const _jsTreeArrayOrObject, string const _dataKey, string const _childrenKey) {};
};