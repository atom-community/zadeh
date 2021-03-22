#ifndef Zadeh_data_interface_h_
#define Zadeh_data_interface_h_

#include "common.h"

namespace zadeh {


// Data Interface

template<typename ArrayType, typename ElementType, typename IndexType = size_t>
ElementType get_at(const ArrayType &candidates, const IndexType iCandidate);

template<typename ArrayType, typename SizeType = size_t>
SizeType get_size(const ArrayType &candidates);

// vector<E>
template<>
CandidateString get_at(const vector<CandidateString> &candidates, const size_t iCandidate) {
    return candidates[iCandidate];
}
template<>
CandidateString get_at(const vector<CandidateString> &candidates, const unsigned int iCandidate) {
    return candidates[iCandidate];
}

template<>
size_t get_size(const vector<CandidateString> &candidates) {
    return candidates.size();
}

template<typename ParentType, typename ChildType>
optional<ChildType> get_children(const ParentType &tree_object, const string &children_key);


}    // namespace zadeh
#endif
