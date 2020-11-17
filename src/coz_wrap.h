#include "coz/coz.h"
// #include "Samples/functionexample.h"


// Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
//   // return functionexample::Init(env, exports);
//   return node_coz::Init(env, exports);
// }

// Original functions, they just call the Coz macros directly.
void cozProgress(){
  COZ_PROGRESS
}

void cozProgressNamed(const char* name){
  COZ_PROGRESS_NAMED(name)
}

void cozBegin(const char* name){
  COZ_BEGIN(name)
}

void cozEnd(const char* name){
  COZ_END(name)
}

// N-API Wrapped functions.
void CozProgressWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() > 0) {
      Napi::TypeError::New(env, "No arguments expected").ThrowAsJavaScriptException();
      return;
  }

  cozProgress();
}

void CozProgressNamedWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsString() || info.Length() > 1) {
      Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
      return;
  }

  Napi::String name = info[0].As<Napi::String>();

  cozProgressNamed(name.Utf8Value().c_str());
}

void CozBeginWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsString() || info.Length() > 1) {
      Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
      return;
  }

  Napi::String name = info[0].As<Napi::String>();

  cozBegin(name.Utf8Value().c_str());
}

void CozEndWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsString() || info.Length() > 1) {
      Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
      return;
  }

  Napi::String name = info[0].As<Napi::String>();

  cozEnd(name.Utf8Value().c_str());
}
