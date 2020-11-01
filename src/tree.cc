#include <optional>
#include "common.h"

/** Get the children of a jsTree (Napi::Object) */
std::optional<Napi::Array> getChildren(Napi::Object const& jsTree, string const& childrenKey) {
	Napi::Array childrenArray;

	// determine if it has children
	bool hasChildren = false;
	if (jsTree.HasOwnProperty(childrenKey)) {
		auto childrenRaw = jsTree.Get(childrenKey);
		if (childrenRaw.IsArray()) {
			childrenArray = childrenRaw.As<Napi::Array>();
			if (childrenArray.Length() != 0) {
				hasChildren = true;
			}
		}
	}
	if (hasChildren)
		return childrenArray;
	return {};
}


struct CandidateObject {
	CandidateString data;
	size_t level = 0;
	size_t index = 0;
};

struct Tree {
	Napi::Object jsTree;
	string dataKey;
	string childrenKey;

	/** Parse a Tree object from JS */
	Tree(const Napi::CallbackInfo& info) {
		if (info.Length() != 3 || !info[0].IsObject() || !info[1].IsString() || !info[2].IsString()) {
			Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
			// default constructor
		}
		else {
			jsTree = info[0].As<Napi::Object>();
			dataKey = info[1].As<Napi::String>();
			childrenKey = info[2].As<Napi::String>();
		}
	}
};