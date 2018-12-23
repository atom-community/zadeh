#include <napi.h>

#include "fuzzaldrin.h"

Napi::Value Fuzzaldrin::Filter(const Napi::CallbackInfo& info) {
  Napi::Array res = Napi::Array::New(info.Env());
  if (info.Length() != 4 || !info[0].IsString() || !info[1].IsNumber() ||
      !info[2].IsBoolean() || !info[3].IsBoolean()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
    return res;
  }
  std::string query = info[0].As<Napi::String>();
  size_t maxResults = info[1].As<Napi::Number>().Uint32Value();
  bool usePathScoring = info[2].As<Napi::Boolean>();
  bool useExtensionBonus = info[3].As<Napi::Boolean>();
  Options options(query, maxResults, usePathScoring, useExtensionBonus);
  const auto matches = filter(candidates_, query, options);

  for(uint32_t i=0; i<matches.size(); i++) {
    res[i] = Napi::String::New(info.Env(), matches[i]);
  }
  return res;
}

Napi::Value Fuzzaldrin::SetCandidates(const Napi::CallbackInfo& info) {
  if (info.Length() != 1 || !info[0].IsArray()) {
    Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
    return Napi::Boolean::New(info.Env(), false);
  }
  Napi::Array candidates = info[0].As<Napi::Array>();
  candidates_.clear();
  candidates_.reserve(candidates.Length());
  for(uint32_t i=0; i<candidates.Length(); i++) {
    Napi::Value val = candidates[i];
    candidates_.push_back(val.ToString().Utf8Value());
  }
  return Napi::Boolean::New(info.Env(), true);
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

Napi::Object Fuzzaldrin::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "Fuzzaldrin", {
    InstanceMethod("filter", &Fuzzaldrin::Filter),
    InstanceMethod("setCandidates", &Fuzzaldrin::SetCandidates)
  });

  exports.Set("Fuzzaldrin", func);
  exports.Set("score", Napi::Function::New(env, score));
  return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return Fuzzaldrin::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
