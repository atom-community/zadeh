#ifndef Zadeh_ArrayFilterer_H
#define Zadeh_ArrayFilterer_H

#include "common.h"
#include "data_interface.h"
#include "options.h"
#include "filter.h"

namespace zadeh {


struct CandidateObject {
    const CandidateString data;
    const size_t level = 0;
    const size_t index = 0;

    explicit CandidateObject(CandidateString &&data_, const size_t level_, const size_t index_) noexcept
      : data{ move(data_) }, level{ level_ }, index{ index_ } {}
};


template<typename ArrayType, typename NodeType, typename ReferenceType = ArrayType, typename AllocatorType = std::allocator<NodeType>>
class TreeFilterer {
  private:
    /* const */ string data_key = "data"s;
    /* const */ string children_key = "children"s;
    /** an array of the CandidateObject which includes the data and its address (index, level) in the tree for each */
    vector<std::vector<CandidateString>> partitioned_candidates{};

    /** Should we keep a reference to the candidates. Set to `true` if you want to call `::filter` method */
    bool keepReference;
    /** Reference to the candidates used in `::filter` method */
    ReferenceType candidates_view;

  public:
    vector<CandidateObject> candidates_vector;

    // default constructor is needed for generation of all the move/copy methods
    TreeFilterer() = default;

    explicit TreeFilterer(const string &data_key_, const string &children_key_)
      : data_key{ data_key_ },
        children_key{ children_key_ } {
    }

    /** create a Tree object and make an entries array */
    explicit TreeFilterer(const ArrayType &candidates_, const string &data_key_, const string &children_key_, const bool keepReference_ = true)
      : data_key{ data_key_ },
        children_key{ children_key_ } {
        set_candiates(candidates_, keepReference_);
    }

    auto set_candidates(const ArrayType &candidates_, const bool keepReference_ = true) {
        keepReference = keepReference_;
        make_candidates_vector(candidates_, 0);
        set_partitioned_candidates();


        if (keepReference) {
            // store a view of candidates in case filter was called
            candidates_view = get_ref<ReferenceType, NodeType>(candidates_);
        }
    }

    auto set_candidates(const ArrayType &candidates_, const string &data_key_, const string &children_key_, const bool keepReference_ = true) {
        keepReference = keepReference_;
        data_key = data_key_;
        children_key = children_key_;
        set_candidates(candidates_);
    }

    auto filter_indices(const std::string &query, const AllocatorType &env, const size_t maxResults = 0, const bool usePathScoring = true, const bool useExtensionBonus = false) {
        // optimization for no candidates
        if (partitioned_candidates.empty()) {
            return init<ArrayType, AllocatorType>(static_cast<size_t>(0), env);    // return an empty vector (should we throw?)
        }

        const Options options(query, maxResults, usePathScoring, useExtensionBonus);
        const auto filtered_indices = zadeh::filter(partitioned_candidates, query, options);
        const auto filter_indices_length = filtered_indices.size();

        auto res = init<ArrayType, AllocatorType>(filter_indices_length, env);    // array of candidate objects (with their address in index and level)
        for (uint32_t i = 0; i < filter_indices_length; i++) {
            auto entry = candidates_vector[filtered_indices[i]];

            // create {data, index, level}
            auto obj = init<NodeType, AllocatorType>(env);
            set_at(obj, entry.data, "data"s);
            set_at(obj, entry.index, "index"s);
            set_at(obj, entry.level, "level"s);
            res[i] = obj;
        }
        return res;
    }

    // auto filter(const std::string &query, const AllocatorType &env, const size_t maxResults = 0, const bool usePathScoring = true, const bool useExtensionBonus = false) {
    //     if (!keepReference || candidates_view == nullptr) {
    //         return init<ArrayType, AllocatorType>(static_cast<size_t>(0), env);  // return an empty vector (should we throw?)
    //     }
    //     const auto filtered_indices = filter_indices(query, maxResults, usePathScoring, useExtensionBonus);
    //     const auto filter_indices_length = filtered_indices.size();
    //
    //    auto res = init<ArrayType, AllocatorType>(filter_indices_length, env);  // array of candidate objects (with their address in index and level)
    //    auto candidates = candidates_view.Value();
    //    for (uint32_t i = 0; i < filter_indices_length; i++) {
    //        auto &entry = = partitioned_candidates[filter_indices[i]];
    //
    //        // create {data, index, level}
    //        auto obj = init<NodeType, AllocatorType>(env);  // a filtered tree
    //        set_at(obj, entry.data, "data");
    //        set_at(obj, entry.data, "index");
    //        set_at(obj, entry.data, "level");
    //        res[i] = obj;
    //    }
    //    return res;
    // }

  private:
    /** Recursive function that fills the candidates_vector from the given tree_array */
    void make_candidates_vector(const ArrayType &tree_array, const size_t level) {
        const auto candidates_vectorLength = get_size(tree_array);
        candidates_vector.reserve(candidates_vectorLength);    // reserve enough space
        for (auto i_entry = 0u; i_entry < candidates_vectorLength; i_entry++) {
            make_candidates_vector(get_at<ArrayType, NodeType>(tree_array, i_entry), level, i_entry);
        }
    }

    /** 1st argument is a single object */
    void make_candidates_vector(const NodeType &tree_object, const size_t level, const size_t i_entry) {
        // make the CandidateObject and push it back
        candidates_vector.emplace_back(
          get_at<NodeType, CandidateString, string>(tree_object, data_key),    // first, get the current data
          level,
          i_entry

        );

        // add children if any
        auto may_children = get_children<NodeType, ArrayType>(tree_object, children_key);
        if (may_children.has_value()) {
            // recurse
            make_candidates_vector(may_children.value(), level + 1);
        }
    }


    auto set_partitioned_candidates() {

        const auto N = candidates_vector.size();
        const auto num_chunks = get_num_chunks(N);


        partitioned_candidates.clear();
        partitioned_candidates.resize(num_chunks);

        auto cur_start = 0u;
        for (auto i = 0u; i < num_chunks; i++) {

            auto chunk_size = N / num_chunks;
            // Distribute remainder among the chunks.
            if (i < N % num_chunks) {
                chunk_size++;
            }
            for (auto j = cur_start; j < cur_start + chunk_size; j++) {
                partitioned_candidates[i].emplace_back(candidates_vector[j].data);    // different
            }
            cur_start += chunk_size;
        }
    }
};


}    // namespace zadeh
#endif
