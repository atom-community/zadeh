#ifdef Zadeh_NODE_BINDING    // only defined for building the Node-js binding

#include "./node.h"

namespace zadeh {

Napi::Object ZadehNode::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    // define ZadehNode class in JS
    const auto func = DefineClass(
      env,
      "Zadeh",
      { // member functions in JS
        InstanceMethod("filter", &ZadehNode::filter),
        InstanceMethod("filterIndices", &ZadehNode::filterIndices),
        // InstanceMethod("filterTree", &ZadehNode::filterTree),
        InstanceMethod("filterIndicesTree", &ZadehNode::filterIndicesTree),
        InstanceMethod("setArrayFiltererCandidates", &ZadehNode::setArrayFiltererCandidates),
        InstanceMethod("setTreeFiltererCandidates", &ZadehNode::setTreeFiltererCandidates) });
    // export ZadehNode class to JS
    exports.Set("Zadeh", func);

    exports.Set("score", Napi::Function::New(env, score));
    exports.Set("match", Napi::Function::New(env, match));
    exports.Set("wrap", Napi::Function::New(env, wrap));
    return exports;
}

}    // namespace zadeh


Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return zadeh::ZadehNode::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll);

#endif
