#include <napi.h>

#include "node.h"

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


Napi::Value ZadehNode::Filter(const Napi::CallbackInfo &info) {
    auto res = Napi::Array::New(info.Env());
    if (info.Length() != 4 || !info[0].IsString() || !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for Filter").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }

    const auto filter_indices = arrayFilterer.filter_indices(
      info[0].As<Napi::String>(),
      info[1].As<Napi::Number>().Uint32Value(),
      info[2].As<Napi::Boolean>(),
      info[3].As<Napi::Boolean>());

    for (uint32_t i = 0, len = filter_indices.size(); i < len; i++) {
        res[i] = Napi::Number::New(info.Env(), filter_indices[i]);
    }
    return res;
}

Napi::Value ZadehNode::setArrayFiltererCandidates(const Napi::CallbackInfo &info) {
    if (info.Length() != 1 || !info[0].IsArray()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for setArrayFiltererCandidates").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }

    arrayFilterer.set_candidates(info[0].As<Napi::Array>());

    return Napi::Boolean();
}

Napi::Value ZadehNode::setTreeFiltererCandidates(const Napi::CallbackInfo &info) {
    // parse arguments
    if (info.Length() != 3
        || !info[0].IsArray()
        || !info[1].IsString() || !info[2].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for setTreeFiltererCandidates").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }

    // create Tree and set candidates
    treeFilterer.set_candidates(
      info[0].As<Napi::Array>(),
      info[1].As<Napi::String>(),
      info[2].As<Napi::String>());

    return Napi::Boolean();
}

/** (query: string, maxResults: number, usePathScoring: bool, useExtensionBonus: bool) */
Napi::Value ZadehNode::FilterTree(const Napi::CallbackInfo &info) {
    // parse arguments
    if (info.Length() != 4
        || !info[0].IsString()
        || !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for FilterTree").ThrowAsJavaScriptException();
        return Napi::Array::New(info.Env());
    }

    const auto filter_indices = treeFilterer.filter_indices(
      info[0].As<Napi::String>(),
      info[1].As<Napi::Number>().Uint32Value(),
      info[2].As<Napi::Boolean>(),
      info[3].As<Napi::Boolean>());


    auto filteredCandidateObjects = Napi::Array::New(info.Env());    // array of candidate objects (with their address in index and level)
    for (uint32_t i = 0, len = filter_indices.size(); i < len; i++) {
        auto &entry = treeFilterer.candidates_vector[filter_indices[i]];    //

        // create {data, index, level}
        auto obj = Napi::Object::New(info.Env());
        obj.Set("data", entry.data);
        obj.Set("index", entry.index);
        obj.Set("level", entry.level);

        filteredCandidateObjects[i] = obj;
    }
    return filteredCandidateObjects;
}


Napi::Number score(const Napi::CallbackInfo &info) {
    if (info.Length() != 4 || !info[0].IsString() || !info[1].IsString() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for score").ThrowAsJavaScriptException();
    }
    const std::string candidate = info[0].As<Napi::String>();
    const std::string query = info[1].As<Napi::String>();
    const bool usePathScoring = info[2].As<Napi::Boolean>();
    const bool useExtensionBonus = info[3].As<Napi::Boolean>();
    const Options options(query, 1, usePathScoring, useExtensionBonus);
    const auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
    const auto score = scoreProvider(candidate, query, options);
    return Napi::Number::New(info.Env(), score);
}

Napi::Array match(const Napi::CallbackInfo &info) {
    auto res = Napi::Array::New(info.Env());
    if (info.Length() != 3 || !info[0].IsString() || !info[1].IsString() || !info[2].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for match").ThrowAsJavaScriptException();
        return res;
    }
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    if (pathSeparator.size() != 1) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for match").ThrowAsJavaScriptException();
        return res;
    }
    Options options(query, pathSeparator[0]);
    auto matches = matcher_match(candidate, query, options);
    for (uint32_t i = 0, len = matches.size(); i < len; i++) {
        res[i] = Napi::Number::New(info.Env(), matches[i]);
    }
    return res;
}

Napi::String wrap(const Napi::CallbackInfo &info) {
    if (info.Length() != 3 || !info[0].IsString() || !info[1].IsString() || !info[2].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for wrap").ThrowAsJavaScriptException();
        return Napi::String::New(info.Env(), "");
    }
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    if (pathSeparator.size() != 1) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for wrap").ThrowAsJavaScriptException();
        return Napi::String::New(info.Env(), "");
    }
    Options options(query, pathSeparator[0]);
    std::string res;
    get_wrap(candidate, query, options, &res);
    return Napi::String::New(info.Env(), res);
}

Napi::Object ZadehNode::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    // define ZadehNode class in JS
    const auto func = DefineClass(
      env,
      "Zadeh",
      { // member functions in JS
        InstanceMethod("filter", &ZadehNode::Filter),
        InstanceMethod("filterTree", &ZadehNode::FilterTree),
        InstanceMethod("setArrayFiltererCandidates", &ZadehNode::setArrayFiltererCandidates),
        InstanceMethod("setTreeFiltererCandidates", &ZadehNode::setTreeFiltererCandidates)

      });
    // export ZadehNode class to JS
    exports.Set("Zadeh", func);

    exports.Set("score", Napi::Function::New(env, score));
    exports.Set("match", Napi::Function::New(env, match));
    exports.Set("wrap", Napi::Function::New(env, wrap));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return ZadehNode::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)


}    // namespace zadeh
