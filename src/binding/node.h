#pragma once
#ifndef Zadeh_H
#define Zadeh_H

#include <napi.h>

#include "../common.h"
#include "../options.h"
#include "../scorer.h"
#include "../matcher.h"
#include "../path_scorer.h"
#include "../query.h"
#include "../filter.h"

#include "tree.h"

// Converted from the example at
// https://github.com/nodejs/node-addon-examples/blob/master/6_object_wrap/node-addon-api/

class Zadeh : public Napi::ObjectWrap<Zadeh> {
  public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    explicit Zadeh(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Zadeh>(info) {}

    Napi::Value Filter(const Napi::CallbackInfo &info);
    Napi::Value setArrayFiltererCandidates(const Napi::CallbackInfo &info);

    Napi::Value setTreeFiltererCandidates(const Napi::CallbackInfo &info);
    Napi::Value FilterTree(const Napi::CallbackInfo &info);

  private:
    vector<std::vector<CandidateString>> candidates_{};
    Tree _tree;
};

#endif    // Zadeh_H
