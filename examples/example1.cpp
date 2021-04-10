#include "../src/zadeh.h"  // include zadeh.h
#include <string>
#include <iostream>

using namespace std;

int main() {
  // the data to fuzzy search on
  auto data = vector<string>{"eye", "why", "bi"};

  // setup StringArrayFilterer
  auto arrayFilterer = zadeh::StringArrayFilterer<vector<string>, string>{};
  arrayFilterer.set_candidates(data);

  // filter the indices that match the query
  auto filtered_indices = arrayFilterer.filter_indices("ye");

  // print the filtered data
  for (auto ind: filtered_indices) {
    cout << data[ind] << '\n';
  }
}
