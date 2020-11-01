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
	uint32_t index = 0;

	CandidateObject(CandidateString data, size_t level, uint32_t index)
		: data{ data }, level{ level }, index{ index } {};
};

struct Tree {
	Napi::Array jsTreeArray;
	string dataKey;
	string childrenKey;


	/** an array of the CandidateObject which includes the data and its address (index, level) in the tree for each */
	vector<CandidateObject> entriesArray;

	/** Recursive function that fills the entriesArray from the given jsTreeArray */
	void makeEntriesArray(Napi::Array & jsTreeArray, size_t level) {
		for (uint32_t iEntry = 0, len = jsTreeArray.Length(); iEntry < len; iEntry++) {
			auto jsTree = jsTreeArray.Get(iEntry).As<Napi::Object>();

			// get the current data
			CandidateString data = jsTree.Get(dataKey).As<Napi::String>();
			entriesArray.push_back(CandidateObject(data, level, iEntry));

			// add children if any
			auto mayChildren = getChildren(jsTreeArray, childrenKey);
			if (mayChildren.has_value()) {
				// recurse
				makeEntriesArray(mayChildren.value(), level + 1);
			}
		}
	}

	/** Parse a Tree object from JS */
	Tree(const Napi::CallbackInfo& info) {
		if (info.Length() != 3 || !info[0].IsObject() || !info[1].IsString() || !info[2].IsString()) {
			Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
			// default constructor
		}
		else {
			jsTreeArray = info[0].As<Napi::Array>();
			dataKey = info[1].As<Napi::String>();
			childrenKey = info[2].As<Napi::String>();

			makeEntriesArray(jsTreeArray, 0);
		}
	}
};