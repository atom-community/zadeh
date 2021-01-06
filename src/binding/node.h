#ifndef Zadeh_Node_H
#define Zadeh_Node_H

#include <napi.h>

#include "../zadeh.h"

namespace zadeh {


// Converted from the example at
// https://github.com/nodejs/node-addon-examples/blob/master/6_object_wrap/node-addon-api/

class ZadehNode : public Napi::ObjectWrap<ZadehNode> {
  public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    explicit ZadehNode(const Napi::CallbackInfo &info) : Napi::ObjectWrap<ZadehNode>(info) {}

    Napi::Value Filter(const Napi::CallbackInfo &info);
    Napi::Value setArrayFiltererCandidates(const Napi::CallbackInfo &info);

    Napi::Value setTreeFiltererCandidates(const Napi::CallbackInfo &info);
    Napi::Value FilterTree(const Napi::CallbackInfo &info);

  private:
    ArrayFilterer<Napi::Array, CandidateString> arrayFilterer{};
    TreeFilterer<Napi::Array, Napi::Object> treeFilterer{};
};


}    // namespace zadeh
#endif    // Zadeh_Node_H
