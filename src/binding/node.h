#ifdef Zadeh_NODE_BINDING    // only defined for building the Node-js binding
#ifndef Zadeh_Node_H
#define Zadeh_Node_H

#include <napi.h>

#include "../zadeh.h"
#include "./node_data_interface.h"

namespace zadeh {

class ZadehNode : public Napi::ObjectWrap<ZadehNode> {
  public:
    Napi::Value filter(const Napi::CallbackInfo &info) {
        // NOTE: not used, as it seems slower than using `ZadehNode::filterIndices` and then filter based on the indices on the JavaScript side.
        // Currently, it is disabled and so `set_candidates` doens't store a reference. If you want to use this function,
        // you should call `strArrFilterer.set_candidates` with the second argument set to `true`
        return strArrFilterer.filter(
          info[0].As<Napi::String>(),
          info.Env(),
          info[1].As<Napi::Number>().Uint32Value(),
          info[2].As<Napi::Boolean>(),
          info[3].As<Napi::Boolean>());
    }

    Napi::Value filterIndices(const Napi::CallbackInfo &info) {
        const auto env = info.Env();
        const auto filter_indices = strArrFilterer.filter_indices(
          info[0].As<Napi::String>(),
          info[1].As<Napi::Number>().Uint32Value(),
          info[2].As<Napi::Boolean>(),
          info[3].As<Napi::Boolean>());

        const auto indices_num = filter_indices.size();
        auto res = Napi::Array::New(env, indices_num);
        for (uint32_t i = 0; i < indices_num; i++) {
            res[i] = Napi::Number::New(env, filter_indices[i]);
        }
        return res;
    }

    Napi::Value setArrayFiltererCandidates(const Napi::CallbackInfo &info) {
        strArrFilterer.set_candidates(info[0].As<Napi::Array>(), false);
        return Napi::Boolean();
    }

    Napi::Value setTreeFiltererCandidates(const Napi::CallbackInfo &info) {
        // create Tree and set candidates
        treeFilterer.set_candidates(
          info[0].As<Napi::Array>(),
          info[1].As<Napi::String>(),
          info[2].As<Napi::String>());

        return Napi::Boolean();
    }

    Napi::Value filterTree(const Napi::CallbackInfo &info) {
        return treeFilterer.filter(
          info[0].As<Napi::String>(),
          info.Env(),
          info[1].As<Napi::Number>().Uint32Value(),
          info[2].As<Napi::Boolean>(),
          info[3].As<Napi::Boolean>());
    }

    Napi::Value filterIndicesTree(const Napi::CallbackInfo &info) {
        return treeFilterer.filter_indices(
          info[0].As<Napi::String>(),
          info.Env(),
          info[1].As<Napi::Number>().Uint32Value(),
          info[2].As<Napi::Boolean>(),
          info[3].As<Napi::Boolean>());
    }

    // NAPI entry functions:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    explicit ZadehNode(const Napi::CallbackInfo &info) : Napi::ObjectWrap<ZadehNode>(info) {}

  private:
    StringArrayFilterer<Napi::Array, Napi::Reference<Napi::Array>, CandidateString, Napi::Env> strArrFilterer{};
    TreeFilterer<Napi::Array, Napi::Object, Napi::Number, Napi::Reference<Napi::Array>, Napi::Env> treeFilterer{};
};


Napi::Number score(const Napi::CallbackInfo &info) {
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
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    assert(pathSeparator.size() == 1);

    Options options(query, pathSeparator[0]);
    auto matches = matcher_match(candidate, query, options);
    for (uint32_t i = 0, len = matches.size(); i < len; i++) {
        res[i] = Napi::Number::New(info.Env(), matches[i]);
    }
    return res;
}

Napi::String wrap(const Napi::CallbackInfo &info) {
    std::string candidate = info[0].As<Napi::String>();
    std::string query = info[1].As<Napi::String>();
    std::string pathSeparator = info[2].As<Napi::String>();
    assert(pathSeparator.size() == 1);

    Options options(query, pathSeparator[0]);
    std::string res;
    get_wrap(candidate, query, options, &res);
    return Napi::String::New(info.Env(), res);
}


}    // namespace zadeh
#endif    // Zadeh_Node_H

#endif
