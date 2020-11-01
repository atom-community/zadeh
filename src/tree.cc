#include "common.h"

struct CandidateObject {
	CandidateString data;
	size_t level = 0;
	size_t index = 0;
};


struct Tree {
	Napi::Object tree;
	string dataKey;
	string childrenKey;
	bool hasChildren = false;

	/** Parse a Tree object from JS */
	Tree(const Napi::CallbackInfo& info) {
		if (info.Length() != 3 || !info[0].IsObject() || !info[1].IsString() || !info[2].IsString()) {
			Napi::TypeError::New(info.Env(), "Invalid arguments").ThrowAsJavaScriptException();
			// default constructor
		}
		else {
			tree = info[0].As<Napi::Object>();
			dataKey = info[1].As<Napi::String>();
			childrenKey = info[2].As<Napi::String>();
		}
	};

};
