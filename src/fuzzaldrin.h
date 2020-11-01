#ifndef FUZZALDRIN_H
#define FUZZALDRIN_H

#include <napi.h>
#include "common.h"

// Converted from the example at
// https://github.com/nodejs/node-addon-examples/blob/master/6_object_wrap/node-addon-api/

class Fuzzaldrin : public Napi::ObjectWrap<Fuzzaldrin> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  Fuzzaldrin(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Fuzzaldrin>(info) {}

  Napi::Value Filter(const Napi::CallbackInfo& info);
  Napi::Value SetCandidates(const Napi::CallbackInfo& info);

private:
  vector<std::vector<CandidateString>> candidates_;
};

#endif // FUZZALDRIN_H
