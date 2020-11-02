#pragma once
#include <optional>
#include <variant>
#include "common.h"

/** Get the children of a jsTree (Napi::Object) */
std::optional<Napi::Array> getChildren(Napi::Object const &jsTree, string const &childrenKey) {
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
	int32_t index = -1;

	CandidateObject(CandidateString const data, size_t const level, int32_t const index)
		: data{ data }, level{ level }, index{ index } {};
};

template <typename T>
struct Tree {
	T jsTreeArrayOrObject;
	string dataKey;
	string childrenKey;


	/** an array of the CandidateObject which includes the data and its address (index, level) in the tree for each */
	vector<CandidateObject> entriesArray;

	/** Recursive function that fills the entriesArray from the given jsTreeArray */
	void makeEntriesArray(Napi::Array const &jsTreeArray, size_t const level) {
		for (uint32_t iEntry = 0, len = jsTreeArray.Length(); iEntry < len; iEntry++) {
			auto jsTree = jsTreeArray[iEntry].As<Napi::Object>();
			makeEntriesArray(jsTree, level, iEntry);
		}
	}

	/** 1st argument is a single object */
	void makeEntriesArray(Napi::Object const &jsTree, size_t const level, int32_t const iEntry = -1) {
		// get the current data
		CandidateString data = jsTree.Get(dataKey).As<Napi::String>();
		entriesArray.push_back(CandidateObject(data, level, iEntry));

		// add children if any
		auto mayChildren = getChildren(jsTree, childrenKey);
		if (mayChildren.has_value()) {
			// recurse
			makeEntriesArray(mayChildren.value(), level + 1);
		}
	}

	/** Parse a Tree object from JS */
	Tree(T const _jsTreeArrayOrObject, string const _dataKey, string const _childrenKey) {
		dataKey = _dataKey;
		childrenKey = _childrenKey;
		jsTreeArrayOrObject = _jsTreeArrayOrObject;
		makeEntriesArray(jsTreeArrayOrObject, 0);
	}
};