#ifdef Zadeh_NODE_BINDING    // only defined for building the Node-js binding

#ifndef Zadeh_Node_DATA_INTERFACE_H
#define Zadeh_Node_DATA_INTERFACE_H

#include <napi.h>

#include "../data_interface.h"

namespace zadeh {

/** Napi::Array Data Interface */
template<>
Napi::Array init(const size_t len, const Napi::Env &env) {
    return Napi::Array::New(env, len);
}

template<>
string get_at(const Napi::Array &candidates, const size_t ind) {
    return candidates.Get(ind).ToString().Utf8Value();
}

template<>
Napi::Object get_at(const Napi::Array &candidates, const uint32_t ind) {
    return candidates.Get(ind).As<Napi::Object>();
}

template<>
size_t get_size(const Napi::Array &candidates) {
    return candidates.Length();
}

template<>
void set_at(Napi::Array &candidates, CandidateString &&value, const size_t iCandidate) {
    candidates.Set(iCandidate, move(value));
}

template<>
Napi::Reference<Napi::Array> get_ref(const Napi::Array &arr) {
    return Napi::Persistent(arr);
}

//template<>
//void release_ref(Napi::Reference<Napi::Array> &arr) {
//    arr.Unref();
//}

/** Napi::Object Data Interface */

template<>
Napi::Object init(const Napi::Env &env) {
    return Napi::Object::New(env);
}

template<>
CandidateString get_at(const Napi::Object &candidates, const string ind) {
    return candidates.Get(ind).ToString().Utf8Value();
}

template<>
void set_at(Napi::Object &candidates, string &&value, const string index) {
    candidates.Set(index, move(value));
}

template<>
void set_at(Napi::Object &candidates, size_t &&value, const string index) {
    candidates.Set(index, move(value));
}

template<>
void set_at(Napi::Object &candidates, const string &value, const string index) {
    candidates.Set(index, value);
}

template<>
void set_at(Napi::Object &candidates, const size_t &value, const string index) {
    candidates.Set(index, value);
}

template<>
Napi::Reference<Napi::Object> get_ref(const Napi::Object &obj) {
    return Napi::Persistent(obj);
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
#endif
