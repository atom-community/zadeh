#include <napi.h>

#include "fuzzaldrin.h"

Napi::Value Fuzzaldrin::Filter(const Napi::CallbackInfo &info) {
    auto res = Napi::Array::New(info.Env());
    if (info.Length() != 4 || !info[0].IsString() || !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return Napi::Boolean();
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

Napi::Value Fuzzaldrin::SetCandidates(const Napi::CallbackInfo &info) {
    if (info.Length() != 1 || !info[0].IsArray()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return Napi::Boolean();
    }
    auto candidates = info[0].As<Napi::Array>();
    const size_t N = candidates.Length();
    const auto num_chunks = N < 1000 * kMaxThreads ? N / 1000 + 1 : kMaxThreads;
    candidates_.clear();
    candidates_.resize(num_chunks);
    size_t cur_start = 0;
    for (size_t i = 0; i < num_chunks; i++) {
        auto chunk_size = N / num_chunks;
        // Distribute remainder among the chunks.
        if (i < N % num_chunks) {
            chunk_size++;
        }
        for (auto j = cur_start; j < cur_start + chunk_size; j++) {
            Napi::Value val = candidates[j];
            candidates_[i].push_back(val.ToString().Utf8Value());
        }
        cur_start += chunk_size;
    }
    return Napi::Boolean();
}

void Fuzzaldrin::SetCandidates(const vector<CandidateObject> &candidates) {
    const auto N = candidates.size();// different
    const auto num_chunks = N < 1000 * kMaxThreads ? N / 1000 + 1 : kMaxThreads;
    candidates_.clear();
    candidates_.resize(num_chunks);
    size_t cur_start = 0;
    for (size_t i = 0; i < num_chunks; i++) {
        auto chunk_size = N / num_chunks;
        // Distribute remainder among the chunks.
        if (i < N % num_chunks) {
            chunk_size++;
        }
        for (auto j = cur_start; j < cur_start + chunk_size; j++) {
            candidates_[i].push_back(candidates[j].data);// different // TODO copy
        }
        cur_start += chunk_size;
    }
}

/** (tree: Array<object>, query: string, dataKey: string, childrenKey: string, options: Options) */
Napi::Value Fuzzaldrin::FilterTree(const Napi::CallbackInfo &info) {

    // parse arguments
    if (info.Length() != 7
        || !info[0].IsArray()
        || !info[1].IsString() || !info[2].IsString() || !info[3].IsString()
        || !info[4].IsNumber() || !info[5].IsBoolean() || !info[6].IsBoolean()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return Napi::Array::New(info.Env());
    }
    const auto &jsTreeArray = info[0].As<Napi::Array>();
    const std::string &query = info[1].As<Napi::String>();

    const string &dataKey = info[2].As<Napi::String>();
    const string &childrenKey = info[3].As<Napi::String>();

    const size_t maxResults = info[4].As<Napi::Number>().Uint32Value();
    const bool usePathScoring = info[5].As<Napi::Boolean>();
    const bool useExtensionBonus = info[6].As<Napi::Boolean>();

    // create Tree and set candidates
    auto tree = Tree(jsTreeArray, dataKey, childrenKey);
    SetCandidates(tree.entriesArray);

    // create options
    const auto options = Options(query, maxResults, usePathScoring, useExtensionBonus);
    const auto &matches = filter(candidates_, query, options);

    // filter
    auto filteredCandidateObjects = Napi::Array::New(info.Env());// array of candidate objects (with their address in index and level)
    for (uint32_t i = 0, len = matches.size(); i < len; i++) {
        auto &entry = tree.entriesArray[matches[i]];//

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
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
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
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return res;
    }
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    if (pathSeparator.size() != 1) {
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
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
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return Napi::String::New(info.Env(), "");
    }
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    if (pathSeparator.size() != 1) {
        Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
        return Napi::String::New(info.Env(), "");
    }
    Options options(query, pathSeparator[0]);
    std::string res;
    get_wrap(candidate, query, options, &res);
    return Napi::String::New(info.Env(), res);
}

Napi::Object Fuzzaldrin::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    const auto func = DefineClass(env, "Fuzzaldrin", { InstanceMethod("filter", &Fuzzaldrin::Filter), InstanceMethod("filterTree", &Fuzzaldrin::FilterTree), InstanceMethod("setCandidates", &Fuzzaldrin::SetCandidates) });

    exports.Set("Fuzzaldrin", func);
    exports.Set("score", Napi::Function::New(env, score));
    exports.Set("match", Napi::Function::New(env, match));
    exports.Set("wrap", Napi::Function::New(env, wrap));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return Fuzzaldrin::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
