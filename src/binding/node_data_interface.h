#ifdef Zadeh_NODE_BINDING    // only defined for building the Node-js binding

#ifndef Zadeh_Node_DATA_INTERFACE_H
#define Zadeh_Node_DATA_INTERFACE_H

#include <napi.h>

#include "../data_interface.h"

namespace zadeh {

template<>
Napi::Number init(const size_t value, const Napi::Env &env) {
    return Napi::Number::New(env, value);
}

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
Napi::Object get_at(const Napi::Array &candidates, const size_t ind) {
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
void set_at(Napi::Array &candidates, Napi::Number &&value, const uint32_t iCandidate) {
    candidates.Set(iCandidate, move(value));
}

template<>
void set_at(Napi::Array &candidates, Napi::Object &&value, const size_t iCandidate) {
    candidates.Set(iCandidate, move(value));
}

template<>
void set_at(Napi::Array &candidates, Napi::Object &value, const size_t iCandidate) {
    candidates.Set(iCandidate, value);
}

template<>
void set_at(Napi::Array &candidates, Napi::Object &&value, const string ind) {
    candidates.Set(ind, move(value));
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
Napi::Object copy(const Napi::Object &obj, const Napi::Env &env) {
    auto obj_copy = Napi::Object::New(env);
    env.Global().Get("Object").As<Napi::Object>().Get("assign").As<Napi::Function>().Call({ obj_copy, obj });
    return obj_copy;
}

template<>
Napi::Array copy(const Napi::Array &arr, const Napi::Env &env) {
    auto arr_copy = Napi::Array::New(env);
    env.Global().Get("Object").As<Napi::Object>().Get("assign").As<Napi::Function>().Call({ arr_copy, arr });
    return arr_copy;
}

template<>
CandidateString get_at(const Napi::Object &candidates, const string ind) {
    return candidates.Get(ind).ToString().Utf8Value();
}

template<>
Napi::Array get_at(const Napi::Object &candidates, const string ind) {
    return candidates.Get(ind).As<Napi::Array>();
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
void set_at(Napi::Object &candidates, Napi::Array &&value, const string ind) {
    candidates.Set(ind, move(value));
}

template<>
void set_at(Napi::Object &candidates, Napi::Array &value, const string ind) {
    candidates.Set(ind, value);
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
