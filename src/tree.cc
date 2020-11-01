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
};
