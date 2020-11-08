#ifndef fuzzaldrin_tree_h__
#define fuzzaldrin_tree_h__

#include <optional>
#include "common.h"

/** Get the children of a jsTree (Napi::Object) */
std::optional<Napi::Array> getChildren(const Napi::Object &jsTree, const string &childrenKey) {
    Napi::Array childrenArray;

    // determine if it has children
    auto hasChildren = false;
    if (jsTree.HasOwnProperty(childrenKey)) {
        const auto childrenRaw = jsTree.Get(childrenKey);
        if (childrenRaw.IsArray()) {
            childrenArray = childrenRaw.As<Napi::Array>();
            if (childrenArray.Length() != 0) {
                hasChildren = true;
            }
        }
    }
    if (hasChildren) {
        return childrenArray;
    }
    return {};
}


struct CandidateObject {
    const CandidateString data;// TODO copy
    const size_t level = 0;
    const size_t index = 0;

    CandidateObject(const CandidateString data_, const size_t level_, const size_t index_) noexcept
      : data{ data_ }, level{ level_ }, index{ index_ } {};
};

template<typename T>
struct Tree {
    const string &dataKey;
    const string &childrenKey;
    /** an array of the CandidateObject which includes the data and its address (index, level) in the tree for each */
    vector<CandidateObject> entriesArray;


    /** Recursive function that fills the entriesArray from the given jsTreeArray */
    void makeEntriesArray(const Napi::Array &jsTreeArray, const size_t level) {
        for (auto iEntry = 0u, len = jsTreeArray.Length(); iEntry < len; iEntry++) {
            auto jsTree = jsTreeArray[iEntry].As<Napi::Object>();
            makeEntriesArray(jsTree, level, iEntry);
        }
    }

    /** 1st argument is a single object */
    void makeEntriesArray(const Napi::Object &jsTree, const size_t level, const size_t iEntry = -1) {
        // get the current data
        const auto data = jsTree.Get(dataKey).ToString().Utf8Value();
        entriesArray.emplace_back(CandidateObject(data, level, iEntry));

        // add children if any
        auto mayChildren = getChildren(jsTree, childrenKey);
        if (mayChildren.has_value()) {
            // recurse
            makeEntriesArray(mayChildren.value(), level + 1);
        }
    }

    /** create a Tree object and make an entries array */
    Tree(const T &jsTreeArrayOrObject_, const string &dataKey_, const string &childrenKey_)
      : dataKey{ dataKey_ },
        childrenKey{ childrenKey_ } {
        makeEntriesArray(jsTreeArrayOrObject_, 0);
    }
};

#endif// tree_h__
