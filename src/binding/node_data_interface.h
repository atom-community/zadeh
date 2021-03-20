#ifndef Zadeh_Node_DATA_INTERFACE_H
#define Zadeh_Node_DATA_INTERFACE_H

#include <napi.h>

#include "../data_interface.h"

namespace zadeh {


// Node Array Data Interface
template<>
string get_at(const Napi::Array &candidates, const uint32_t j) {
    return candidates.Get(j).ToString().Utf8Value();
}

template<>
Napi::Object get_at(const Napi::Array &candidates, const uint32_t j) {
    return candidates.Get(j).As<Napi::Object>();
}

template<>
size_t get_size(const Napi::Array &candidates) {
    return candidates.Length();
}

// Node Object Data Interface
template<>
CandidateString get_at(const Napi::Object &candidates, const string j) {
    return candidates.Get(j).ToString().Utf8Value();
}


/** Get the children of a tree_object (Napi::Object) */
template<>
optional<Napi::Array> get_children(const Napi::Object &tree_object, const string &children_key) {
    // determine if it has children
    if (tree_object.HasOwnProperty(children_key)) {
        const auto childrenRaw = tree_object.Get(children_key);
        if (childrenRaw.IsArray()) {
            const auto childrenArray = childrenRaw.As<Napi::Array>();
            if (childrenArray.Length() != 0) {
                return childrenArray;
            }
        }
    }
    return {};
}


}    // namespace zadeh
#endif
