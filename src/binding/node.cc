#include <napi.h>

#include "node.h"

namespace zadeh {

Napi::Value Zadeh::Filter(const Napi::CallbackInfo &info) {
    auto res = Napi::Array::New(info.Env());
    if (info.Length() != 4 || !info[0].IsString() || !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for Filter").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }
    // optimization for no candidates
    if (candidates_.empty()) {
        return Napi::Array::New(info.Env());
    }
    const std::string query = info[0].As<Napi::String>();
    const size_t maxResults = info[1].As<Napi::Number>().Uint32Value();
    const bool usePathScoring = info[2].As<Napi::Boolean>();
    const bool useExtensionBonus = info[3].As<Napi::Boolean>();
    const Options options(query, maxResults, usePathScoring, useExtensionBonus);
    const auto matches = filter(candidates_, query, options);

    for (uint32_t i = 0, len = matches.size(); i < len; i++) {
        res[i] = Napi::Number::New(info.Env(), matches[i]);
    }
    return res;
}

Napi::Value Zadeh::setArrayFiltererCandidates(const Napi::CallbackInfo &info) {
    if (info.Length() != 1 || !info[0].IsArray()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for setArrayFiltererCandidates").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }
    auto candidates = info[0].As<Napi::Array>();
    const auto N = candidates.Length();
    const auto num_chunks = N < 1000u * kMaxThreads ? N / 1000u + 1u : kMaxThreads;


    candidates_.clear();
    candidates_.resize(num_chunks);

    auto cur_start = 0u;
    for (auto i = 0u; i < num_chunks; i++) {

        auto chunk_size = N / num_chunks;
        // Distribute remainder among the chunks.
        if (i < N % num_chunks) {
            chunk_size++;
        }
        for (auto j = cur_start; j < cur_start + chunk_size; j++) {
            candidates_[i].emplace_back(candidates.Get(j).ToString().Utf8Value());
        }
        cur_start += chunk_size;
    }

    return Napi::Boolean();
}

Napi::Value Zadeh::setTreeFiltererCandidates(const Napi::CallbackInfo &info) {
    // parse arguments
    if (info.Length() != 3
        || !info[0].IsArray()
        || !info[1].IsString() || !info[2].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for setTreeFiltererCandidates").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }
    const auto jsTreeArray = info[0].As<Napi::Array>();
    const string dataKey = info[1].As<Napi::String>();
    const string childrenKey = info[2].As<Napi::String>();

    // create Tree and set candidates
    _tree = Tree(jsTreeArray, dataKey, childrenKey);

    const auto &candidates = _tree.entriesArray;

    const auto N = candidates.size();    // different
    const auto num_chunks = N < 1000u * kMaxThreads ? N / 1000u + 1u : kMaxThreads;


    candidates_.clear();
    candidates_.resize(num_chunks);

    auto cur_start = 0u;
    for (auto i = 0u; i < num_chunks; i++) {
        auto chunk_size = N / num_chunks;
        // Distribute remainder among the chunks.
        if (i < N % num_chunks) {
            chunk_size++;
        }
        for (auto j = cur_start; j < cur_start + chunk_size; j++) {
            candidates_[i].emplace_back(candidates[j].data);    // different // TODO copy
        }
        cur_start += chunk_size;
    }


    return Napi::Boolean();
}

/** (query: string, maxResults: number, usePathScoring: bool, useExtensionBonus: bool) */
Napi::Value Zadeh::FilterTree(const Napi::CallbackInfo &info) {
    // parse arguments
    if (info.Length() != 4
        || !info[0].IsString()
        || !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments for FilterTree").ThrowAsJavaScriptException();
        return Napi::Array::New(info.Env());
    }
    // optimization for no candidates
    if (candidates_.empty()) {
        return Napi::Array::New(info.Env());
    }

    // parse query
    const std::string query = info[0].As<Napi::String>();

    // parse options
    const size_t maxResults = info[1].As<Napi::Number>().Uint32Value();
    const bool usePathScoring = info[2].As<Napi::Boolean>();
    const bool useExtensionBonus = info[3].As<Napi::Boolean>();

    // create options
    const auto options = Options(query, maxResults, usePathScoring, useExtensionBonus);

    // perform filtering
    const auto matches = filter(candidates_, query, options);

    auto filteredCandidateObjects = Napi::Array::New(info.Env());    // array of candidate objects (with their address in index and level)
    for (uint32_t i = 0, len = matches.size(); i < len; i++) {
        auto &entry = _tree.entriesArray[matches[i]];    //

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

Napi::Object Zadeh::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    // define Zadeh class in JS
    const auto func = DefineClass(
      env,
      "Zadeh",
      { // member functions in JS
        InstanceMethod("filter", &Zadeh::Filter),
        InstanceMethod("filterTree", &Zadeh::FilterTree),
        InstanceMethod("setArrayFiltererCandidates", &Zadeh::setArrayFiltererCandidates),
        InstanceMethod("setTreeFiltererCandidates", &Zadeh::setTreeFiltererCandidates)

      });
    // export Zadeh class to JS
    exports.Set("Zadeh", func);

    exports.Set("score", Napi::Function::New(env, score));
    exports.Set("match", Napi::Function::New(env, match));
    exports.Set("wrap", Napi::Function::New(env, wrap));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return Zadeh::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)


}    // namespace zadeh