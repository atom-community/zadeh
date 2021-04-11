#ifndef Zadeh_data_interface_h_
#define Zadeh_data_interface_h_

#include "common.h"

namespace zadeh {


/** Data Interface */

/** Initialize array */
template<typename ArrayType, typename AllocatorType, typename SizeType = size_t>
ArrayType init(const SizeType len, const AllocatorType &alloc);

template<typename ReferenceType, typename ValueType>
ReferenceType get_ref(const ValueType &value);

// TODO do we need manual releasing?
//template<typename ReferenceType>
//void release_ref(ReferenceType reference);

/** Index array */
template<typename ArrayType, typename ElementType, typename IndexType = size_t>
ElementType get_at(const ArrayType &candidates, const IndexType iCandidate);

/** Get size of array */
template<typename ArrayType, typename SizeType = size_t>
SizeType get_size(const ArrayType &candidates);

/** Set element of array */
template<typename ArrayType, typename ElementType, typename IndexType = size_t>
void set_at(ArrayType &candidates, ElementType &&value, const IndexType iCandidate);

/** Get children of a tree */
template<typename ParentType, typename ChildType>
optional<ChildType> get_children(const ParentType &tree_object, const string &children_key);

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
