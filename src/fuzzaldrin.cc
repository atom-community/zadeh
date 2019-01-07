#include <napi.h>

#include "fuzzaldrin.h"

Napi::Value Fuzzaldrin::Filter(const Napi::CallbackInfo& info) {
  Napi::Array res = Napi::Array::New(info.Env());
  if (info.Length() != 5 || !info[0].IsString() || !info[1].IsNumber() ||
      !info[2].IsBoolean() || !info[3].IsBoolean() || !info[4].IsBoolean()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
    return Napi::Boolean();
  }
  std::string query = info[0].As<Napi::String>();
  size_t maxResults = info[1].As<Napi::Number>().Uint32Value();
  bool usePathScoring = info[2].As<Napi::Boolean>();
  bool useExtensionBonus = info[3].As<Napi::Boolean>();
  bool returnIndexes = info[4].As<Napi::Boolean>();
  Options options(query, maxResults, usePathScoring, useExtensionBonus);
  const auto matches = filter(candidates_, query, options);

  std::vector<size_t> counts;
  if (returnIndexes) {
    size_t start = 0;
    for(const auto &c : candidates_) {
      counts.push_back(start);
      start += c.size();
    }
  }

  for(uint32_t i=0; i<matches.size(); i++) {
    const auto &index = matches[i];
    if (returnIndexes) {
      res[i] = Napi::Number::New(info.Env(), counts[index.thread_id] + index.index);
    } else {
      res[i] = Napi::String::New(info.Env(), candidates_[index.thread_id][index.index]);
    }
  }
  return res;
}

Napi::Value Fuzzaldrin::SetCandidates(const Napi::CallbackInfo& info) {
  if (info.Length() != 1 || !info[0].IsArray()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
    return Napi::Boolean();
  }
  Napi::Array candidates = info[0].As<Napi::Array>();
  candidates_.clear();
  candidates_.resize(kMaxThreads);
  const size_t N = candidates.Length();
  size_t cur_start = 0;
  for(size_t i=0; i<kMaxThreads; i++) {
    size_t chunk_size = N / kMaxThreads;
    // Distribute remainder among the chunks.
    if (i < N % kMaxThreads) {
      chunk_size++;
    }
    for(size_t j=cur_start; j < cur_start+chunk_size; j++) {
      Napi::Value val = candidates[j];
      candidates_[i].push_back(val.ToString().Utf8Value());
    }
    cur_start += chunk_size;
  }
  return Napi::Boolean();
}

Napi::Number score(const Napi::CallbackInfo& info) {
  if (info.Length() != 4 || !info[0].IsString() || !info[1].IsString() ||
      !info[2].IsBoolean() || !info[3].IsBoolean()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
  }
  std::string candidate = info[0].As<Napi::String>();
  std::string query = info[1].As<Napi::String>();
  bool usePathScoring = info[2].As<Napi::Boolean>();
  bool useExtensionBonus = info[3].As<Napi::Boolean>();
  Options options(query, 1, usePathScoring, useExtensionBonus);
  auto scoreProvider = options.usePathScoring ? path_scorer_score : scorer_score;
  auto score = scoreProvider(candidate, query, options);
  return Napi::Number::New(info.Env(), score);
}

Napi::Value filterWithCandidates(const Napi::CallbackInfo& info) {
  if (info.Length() != 6 || !info[0].IsString() ||
      !info[1].IsNumber() || !info[2].IsBoolean() || !info[3].IsBoolean() ||
      !info[4].IsArray() || !info[5].IsString()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
    return Napi::Boolean();
  }
  std::string query = info[0].As<Napi::String>();
  size_t maxResults = info[1].As<Napi::Number>().Uint32Value();
  bool usePathScoring = info[2].As<Napi::Boolean>();
  bool useExtensionBonus = info[3].As<Napi::Boolean>();
  Options options(query, maxResults, usePathScoring, useExtensionBonus);
  return filter_with_candidates(info.Env(), info[4].As<Napi::Array>(), info[5].As<Napi::String>(), query, options);
}

Napi::Object Fuzzaldrin::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "Fuzzaldrin", {
    InstanceMethod("filter", &Fuzzaldrin::Filter),
    InstanceMethod("setCandidates", &Fuzzaldrin::SetCandidates)
  });

  exports.Set("Fuzzaldrin", func);
  exports.Set("score", Napi::Function::New(env, score));
  exports.Set("filterWithCandidates", Napi::Function::New(env, filterWithCandidates));
  return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return Fuzzaldrin::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
