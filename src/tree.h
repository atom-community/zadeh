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
    const CandidateString data;
    const size_t level = 0;
    const size_t index = 0;

    CandidateObject(CandidateString &&data_, const size_t level_, const size_t index_) noexcept
      : data{ move(data_) }, level{ level_ }, index{ index_ } {}
};

struct Tree {
    /* const */ string dataKey = "data"s;
    /* const */ string childrenKey = "children"s;
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
    void makeEntriesArray(const Napi::Object &jsTree, const size_t level, const size_t iEntry) {
        // finally emplace it back
        entriesArray.emplace_back(
          // then make the CandidateObject
          CandidateObject(
            jsTree.Get(dataKey).ToString().Utf8Value(),// first, get the current data
            level,
            iEntry)

        );

        // add children if any
        auto mayChildren = getChildren(jsTree, childrenKey);
        if (mayChildren.has_value()) {
            // recurse
            makeEntriesArray(mayChildren.value(), level + 1);
        }
    }

    // default constructor is needed for generation of all the move/copy methods
    Tree() = default;

    /** create a Tree object and make an entries array */
    // NOTE: this is made to only accept Napi::Array because we cannot export templates to JavaScript
    Tree(const Napi::Array &jsTreeArrayOrObject_, const string &dataKey_, const string &childrenKey_)
      : dataKey{ dataKey_ },
        childrenKey{ childrenKey_ } {
        makeEntriesArray(jsTreeArrayOrObject_, 0);
    }
};

#endif// tree_h__
