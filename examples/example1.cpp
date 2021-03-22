#include <string>
#include "../src/zadeh.h"
#include <iostream>

using namespace std;

int main() {
  // the data to fuzzy search on
  auto data = vector<string>{"eye", "why", "bi"};

  // setup ArrayFilterer
  auto arrayFilterer = zadeh::ArrayFilterer<vector<string>, string>{};
  arrayFilterer.set_candidates(data);

  // filter the indices that match the query
  auto filtered_indices = arrayFilterer.filter_indices("ye");

  // print the filtered data
  for (auto ind: filtered_indices) {
    cout << data[ind] << '\n';
  }
}
