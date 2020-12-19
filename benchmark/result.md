aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   move_const ≣[13:27]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 50 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 24 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 68 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 63 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 53 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 47 ms vs. fuzzaldrin-plus: 203 ms
length 65124 66672

Matching 66672 results for 'index' took 279ms (Prepare in advance)
Matching 66672 results for 'index' took 279ms (cache)
Matching 66672 results for 'index' took 81ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 11.047s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.827s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 418.173ms
======
ThreeLetter#legacy: 8.702s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.882s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 394.234ms
======
TwoLetter#Keybased#Filter: 3.326s
ThreeLetter#Keybased#Filter: 4.139s
======
setCandidates: 203.829ms
TwoLetter#Filter: 674.958ms
ThreeLetter#Filter: 384.347ms
======
setCandidates#Keybased: 213.387ms
TwoLetter#Keybased#Filter: 414.907ms
ThreeLetter#Keybased#Filter: 399.302ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 2.04 ms
TreeFilterer.filter text: 0.99 ms
TreeFilterer.filter dips: 0.42 ms
TreeFilterer.filter disp: 0.29 ms
TreeFilterer.filter txt: 0.40 ms
TreeFilterer.filter getBuffer: 0.44 ms
         TreeFilterer.filter average: 0.508 ms
filterTree text: 2.54 ms
filterTree dips: 2.25 ms
filterTree disp: 3.09 ms
filterTree txt: 3.10 ms
filterTree getBuffer: 2.59 ms
         filterTree average: 2.715 ms
aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   move_const ≣[13:28]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 43 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 50 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 24 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 45 ms vs. fuzzaldrin-plus: 68 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 64 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 49 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 57 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 48 ms vs. fuzzaldrin-plus: 232 ms
length 65124 66672

Matching 66672 results for 'index' took 435ms (Prepare in advance)
Matching 66672 results for 'index' took 276ms (cache)
Matching 66672 results for 'index' took 84ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.683s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.812s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 401.432ms
======
ThreeLetter#legacy: 8.805s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.979s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 403.136ms
======
TwoLetter#Keybased#Filter: 3.581s
ThreeLetter#Keybased#Filter: 4.378s
======
setCandidates: 224.655ms
TwoLetter#Filter: 644.337ms
ThreeLetter#Filter: 385.908ms
======
setCandidates#Keybased: 228.899ms
TwoLetter#Keybased#Filter: 401.137ms
ThreeLetter#Keybased#Filter: 395.375ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 1.98 ms
TreeFilterer.filter text: 1.04 ms
TreeFilterer.filter dips: 0.34 ms
TreeFilterer.filter disp: 0.36 ms
TreeFilterer.filter txt: 0.58 ms
TreeFilterer.filter getBuffer: 0.35 ms
         TreeFilterer.filter average: 0.534 ms
filterTree text: 2.49 ms
filterTree dips: 2.18 ms
filterTree disp: 3.19 ms
filterTree txt: 2.31 ms
filterTree getBuffer: 2.27 ms
         filterTree average: 2.488 ms



aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   master ≣ +1 [13:31] 
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 43 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 52 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 24 ms vs. fuzzaldrin-plus: 15 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 70 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 63 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 45 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 54 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 48 ms vs. fuzzaldrin-plus: 206 ms
length 65124 66672

Matching 66672 results for 'index' took 281ms (Prepare in advance)
Matching 66672 results for 'index' took 273ms (cache)
Matching 66672 results for 'index' took 82ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.941s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.842s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 416.639ms
======
ThreeLetter#legacy: 8.690s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.998s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 404.098ms
======
TwoLetter#Keybased#Filter: 3.623s
ThreeLetter#Keybased#Filter: 4.398s
======
setCandidates: 213.502ms
TwoLetter#Filter: 594.316ms
ThreeLetter#Filter: 424.559ms
======
setCandidates#Keybased: 221.766ms
TwoLetter#Keybased#Filter: 435.412ms
ThreeLetter#Keybased#Filter: 411.929ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 2.03 ms
TreeFilterer.filter text: 0.64 ms
TreeFilterer.filter dips: 0.51 ms
TreeFilterer.filter disp: 0.35 ms
TreeFilterer.filter txt: 0.58 ms
TreeFilterer.filter getBuffer: 0.27 ms
         TreeFilterer.filter average: 0.468 ms
filterTree text: 2.53 ms
filterTree dips: 2.34 ms
filterTree disp: 3.16 ms
filterTree txt: 2.45 ms
filterTree getBuffer: 2.25 ms
         filterTree average: 2.544 ms
aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   master ≣ +1 [13:31] 
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 43 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 49 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 25 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 70 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 61 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 51 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 55 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 48 ms vs. fuzzaldrin-plus: 210 ms
length 65124 66672

Matching 66672 results for 'index' took 280ms (Prepare in advance)
Matching 66672 results for 'index' took 270ms (cache)
Matching 66672 results for 'index' took 81ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.681s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.892s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 413.988ms
======
ThreeLetter#legacy: 8.800s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 3.055s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 399.793ms
======
TwoLetter#Keybased#Filter: 3.509s
ThreeLetter#Keybased#Filter: 4.089s
======
setCandidates: 231.127ms
TwoLetter#Filter: 704.343ms
ThreeLetter#Filter: 411.724ms
======
setCandidates#Keybased: 221.918ms
TwoLetter#Keybased#Filter: 420.331ms
ThreeLetter#Keybased#Filter: 400.389ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 1.99 ms
TreeFilterer.filter text: 0.76 ms
TreeFilterer.filter dips: 0.39 ms
TreeFilterer.filter disp: 0.38 ms
TreeFilterer.filter txt: 1.02 ms
TreeFilterer.filter getBuffer: 0.48 ms
         TreeFilterer.filter average: 0.606 ms
filterTree text: 2.49 ms
filterTree dips: 2.43 ms
filterTree disp: 3.26 ms
filterTree txt: 2.44 ms
filterTree getBuffer: 2.30 ms
         filterTree average: 2.586 ms         




aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   vector-insteadof-priority_queue ≣ +1 ~0 -0 !                                                                                       [13:37]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 50 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 24 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 68 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 64 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 51 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 51 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 210 ms
length 65124 66672

Matching 66672 results for 'index' took 296ms (Prepare in advance)
Matching 66672 results for 'index' took 284ms (cache)
Matching 66672 results for 'index' took 81ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.414s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.974s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 427.822ms
======
ThreeLetter#legacy: 8.902s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 3.031s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 381.527ms
======
TwoLetter#Keybased#Filter: 3.426s
ThreeLetter#Keybased#Filter: 4.202s
======
setCandidates: 218.763ms
TwoLetter#Filter: 398.307ms
ThreeLetter#Filter: 403.848ms
======
setCandidates#Keybased: 228.245ms
TwoLetter#Keybased#Filter: 403.966ms
ThreeLetter#Keybased#Filter: 401.546ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 2.00 ms
TreeFilterer.filter text: 0.77 ms
TreeFilterer.filter dips: 0.36 ms
TreeFilterer.filter disp: 0.26 ms
TreeFilterer.filter txt: 0.59 ms
TreeFilterer.filter getBuffer: 0.26 ms
         TreeFilterer.filter average: 0.447 ms
filterTree text: 2.68 ms
filterTree dips: 2.33 ms
filterTree disp: 3.34 ms
filterTree txt: 2.41 ms
filterTree getBuffer: 2.11 ms
         filterTree average: 2.571 ms
aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   vector-insteadof-priority_queue ≣ +1 ~0 -0 !                                                                                       [13:38]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 51 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 24 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 43 ms vs. fuzzaldrin-plus: 67 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 41 ms vs. fuzzaldrin-plus: 62 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 41 ms vs. fuzzaldrin-plus: 50 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 238 ms
length 65124 66672

Matching 66672 results for 'index' took 288ms (Prepare in advance)
Matching 66672 results for 'index' took 278ms (cache)
Matching 66672 results for 'index' took 85ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 11.007s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.825s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 399.931ms
======
ThreeLetter#legacy: 8.729s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.872s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 398.955ms
======
TwoLetter#Keybased#Filter: 3.297s
ThreeLetter#Keybased#Filter: 3.786s
======
setCandidates: 179.187ms
TwoLetter#Filter: 680.216ms
ThreeLetter#Filter: 400.146ms
======
setCandidates#Keybased: 190.329ms
TwoLetter#Keybased#Filter: 392.905ms
ThreeLetter#Keybased#Filter: 389.068ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 2.01 ms
TreeFilterer.filter text: 0.84 ms
TreeFilterer.filter dips: 0.35 ms
TreeFilterer.filter disp: 0.31 ms
TreeFilterer.filter txt: 0.40 ms
TreeFilterer.filter getBuffer: 0.33 ms
         TreeFilterer.filter average: 0.445 ms
filterTree text: 2.60 ms
filterTree dips: 2.25 ms
filterTree disp: 3.01 ms
filterTree txt: 2.22 ms
filterTree getBuffer: 2.29 ms
         filterTree average: 2.472 ms         


rity_queue ≣ +1 ~0 -0 !                                                                                       [13:39]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 50 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 25 ms vs. fuzzaldrin-plus: 15 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 68 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 41 ms vs. fuzzaldrin-plus: 62 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 41 ms vs. fuzzaldrin-plus: 56 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 210 ms
length 65124 66672

Matching 66672 results for 'index' took 286ms (Prepare in advance)
Matching 66672 results for 'index' took 285ms (cache)
Matching 66672 results for 'index' took 81ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.551s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.821s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 400.354ms
======
ThreeLetter#legacy: 8.722s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.921s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 416.597ms
======
TwoLetter#Keybased#Filter: 3.338s
ThreeLetter#Keybased#Filter: 3.932s
======
setCandidates: 194.706ms
TwoLetter#Filter: 398.627ms
ThreeLetter#Filter: 387.128ms
======
setCandidates#Keybased: 203.621ms
TwoLetter#Keybased#Filter: 512.334ms
ThreeLetter#Keybased#Filter: 384.935ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 2.00 ms
TreeFilterer.filter text: 0.74 ms
TreeFilterer.filter dips: 0.41 ms
TreeFilterer.filter disp: 0.38 ms
TreeFilterer.filter txt: 0.50 ms
TreeFilterer.filter getBuffer: 0.30 ms
         TreeFilterer.filter average: 0.468 ms
filterTree text: 2.66 ms
filterTree dips: 2.34 ms
filterTree disp: 3.18 ms
filterTree txt: 2.38 ms
filterTree getBuffer: 2.28 ms
         filterTree average: 2.566 ms         


⨯ aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   vector-insteadof-priority_queue ↑1 +1 ~0 -0 !                                                                                    [13:55]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 3 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 5 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 43 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 49 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 23 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 68 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 62 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 53 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 56 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 211 ms
length 65124 66672

Matching 66672 results for 'index' took 278ms (Prepare in advance)
Matching 66672 results for 'index' took 276ms (cache)
Matching 66672 results for 'index' took 84ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 11.106s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.835s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 398.202ms
======
ThreeLetter#legacy: 8.740s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.978s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 388.019ms
======
TwoLetter#Keybased#Filter: 3.660s
ThreeLetter#Keybased#Filter: 4.582s
======
setCandidates: 302.197ms
TwoLetter#Filter: 391.702ms
ThreeLetter#Filter: 369.228ms
======
setCandidates#Keybased: 281.732ms
TwoLetter#Keybased#Filter: 494.869ms
ThreeLetter#Keybased#Filter: 392.675ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 1.99 ms
TreeFilterer.filter text: 0.73 ms
TreeFilterer.filter dips: 0.53 ms
TreeFilterer.filter disp: 0.25 ms
TreeFilterer.filter txt: 0.43 ms
TreeFilterer.filter getBuffer: 0.26 ms
         TreeFilterer.filter average: 0.440 ms
filterTree text: 2.52 ms
filterTree dips: 2.28 ms
filterTree disp: 3.50 ms
filterTree txt: 2.38 ms
filterTree getBuffer: 2.33 ms
         filterTree average: 2.603 ms



⨯ aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   vector-insteadof-priority_queue ↑1 +1 ~0 -0 !                                                                                    [13:58]
❯ npm run benchmark:large

> fuzzaldrin-plus-fast@1.2.3 benchmark:large C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.700s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.929s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 391.701ms
======
ThreeLetter#legacy: 8.909s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.881s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 399.011ms
======
TwoLetter#Keybased#Filter: 3.410s
ThreeLetter#Keybased#Filter: 4.024s
======
setCandidates: 199.113ms
TwoLetter#Filter: 406.935ms
ThreeLetter#Filter: 382.368ms
======
setCandidates#Keybased: 210.49ms
TwoLetter#Keybased#Filter: 407.596ms
ThreeLetter#Keybased#Filter: 390.161ms         



aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   master ≣ +1 [14:00] 
❯ npm run benchmark:large

> fuzzaldrin-plus-fast@1.2.3 benchmark:large C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.634s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.880s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 421.454ms
======
ThreeLetter#legacy: 8.901s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.967s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 403.255ms
======
TwoLetter#Keybased#Filter: 3.454s
ThreeLetter#Keybased#Filter: 4.154s
======
setCandidates: 200.672ms
TwoLetter#Filter: 489.184ms
ThreeLetter#Filter: 538.219ms
======
setCandidates#Keybased: 212.821ms
TwoLetter#Keybased#Filter: 525.045ms
ThreeLetter#Keybased#Filter: 418.513ms
aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   master ≣ +1 [14:00] 
❯ npm run benchmark:large

> fuzzaldrin-plus-fast@1.2.3 benchmark:large C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> node benchmark/benchmark-large.js

TwoLetter#legacy: 11.007s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.867s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 417.078ms
======
ThreeLetter#legacy: 8.673s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.917s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 405.307ms
======
TwoLetter#Keybased#Filter: 3.418s
ThreeLetter#Keybased#Filter: 3.957s
======
setCandidates: 190.025ms
TwoLetter#Filter: 555.341ms
ThreeLetter#Filter: 412.148ms
======
setCandidates#Keybased: 195.928ms
TwoLetter#Keybased#Filter: 414.564ms
ThreeLetter#Keybased#Filter: 404.176ms

aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   master ≣   [17:49]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 28 ms vs. fuzzaldrin-plus: 51 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 26 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 69 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 61 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 44 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 45 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 51 ms vs. fuzzaldrin-plus: 238 ms
length 65124 66672

Matching 66672 results for 'index' took 287ms (Prepare in advance)
Matching 66672 results for 'index' took 277ms (cache)
Matching 66672 results for 'index' took 86ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 10.569s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.909s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 411.434ms
======
ThreeLetter#legacy: 8.844s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.999s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 406.735ms
======
TwoLetter#Keybased#Filter: 3.454s
ThreeLetter#Keybased#Filter: 3.832s
======
setCandidates: 187.174ms
TwoLetter#Filter: 414.171ms
ThreeLetter#Filter: 418.369ms
======
setCandidates#Keybased: 196.369ms
TwoLetter#Keybased#Filter: 546.893ms
ThreeLetter#Keybased#Filter: 416.643ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

         TreeFilterer.setCandidates: 1.99 ms
TreeFilterer.filter text: 0.60 ms
TreeFilterer.filter dips: 0.56 ms
TreeFilterer.filter disp: 0.29 ms
TreeFilterer.filter txt: 0.39 ms
TreeFilterer.filter getBuffer: 0.28 ms
         TreeFilterer.filter average: 0.425 ms
filterTree text: 2.53 ms
filterTree dips: 2.14 ms
filterTree disp: 3.10 ms
filterTree txt: 2.55 ms
filterTree getBuffer: 2.74 ms
         filterTree average: 2.610 ms


aminy@LAPTOP-DHBEBJRL  ~\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast   vector-insteadof-priority_queue ↑1 ↓1                                                                                              [17:46]
❯ npm run benchmark

> fuzzaldrin-plus-fast@1.2.3 benchmark C:\Users\aminy\Documents\GitHub\JavaScript\@atom-ide-community\fuzzaldrin-plus-fast
> npm run benchmark:small && npm run benchmark:regular && npm run benchmark:large && npm run benchmark:tree


> fuzzaldrin-plus-fast@1.2.3 benchmark:small
> node benchmark/benchmark-small.js

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 100 100

====== Running test - query:npm ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 55 100

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 100 100

====== Running test - query:grunt ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 33 100

====== Running test - query:html ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 10 100

====== Running test - query:doc ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 4 ms
length 87 100

====== Running test - query:cli ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 57 100

====== Running test - query:js ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 0 ms
length 60 100

====== Running test - query:jas ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100

====== Running test - query:mine ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 2 ms
length 65 100

====== Running test - query:stream ======
Elapsed time - fuzzaldrin-plus-fast: 0 ms vs. fuzzaldrin-plus: 1 ms
length 19 100


> fuzzaldrin-plus-fast@1.2.3 benchmark:regular
> node benchmark/benchmark.js

====== Running test - query:index ======
Elapsed time - fuzzaldrin-plus-fast: 28 ms vs. fuzzaldrin-plus: 44 ms
length 6168 66672

====== Running test - query:indx ======
Elapsed time - fuzzaldrin-plus-fast: 27 ms vs. fuzzaldrin-plus: 50 ms
length 6192 66672

====== Running test - query:walkdr ======
Elapsed time - fuzzaldrin-plus-fast: 25 ms vs. fuzzaldrin-plus: 16 ms
length 504 66672
====== fuzzaldrin-plus-fast is SLOWER

====== Running test - query:node ======
Elapsed time - fuzzaldrin-plus-fast: 42 ms vs. fuzzaldrin-plus: 71 ms
length 65136 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 40 ms vs. fuzzaldrin-plus: 61 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 39 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:nm ======
Elapsed time - fuzzaldrin-plus-fast: 39 ms vs. fuzzaldrin-plus: 52 ms
length 65208 66672

====== Running test - query:ndem ======
Elapsed time - fuzzaldrin-plus-fast: 46 ms vs. fuzzaldrin-plus: 248 ms
length 65124 66672

Matching 66672 results for 'index' took 294ms (Prepare in advance)
Matching 66672 results for 'index' took 277ms (cache)
Matching 66672 results for 'index' took 86ms (legacy)

> fuzzaldrin-plus-fast@1.2.3 benchmark:large
> node benchmark/benchmark-large.js

TwoLetter#legacy: 11.316s
TwoLetter#fuzzaldrin-plus-fast#DirectFilter: 2.853s
TwoLetter#fuzzaldrin-plus-fast#setCandidates#filter: 401.659ms
======
ThreeLetter#legacy: 8.940s
ThreeLetter#fuzzaldrin-plus-fast#DirectFilter: 2.986s
ThreeLetter#fuzzaldrin-plus-fast#setCandidates#filter: 399.152ms
======
TwoLetter#Keybased#Filter: 3.842s
ThreeLetter#Keybased#Filter: 4.146s
======
setCandidates: 205.464ms
TwoLetter#Filter: 417.096ms
ThreeLetter#Filter: 406.179ms
======
setCandidates#Keybased: 209.739ms
TwoLetter#Keybased#Filter: 413.274ms
ThreeLetter#Keybased#Filter: 404.988ms

> fuzzaldrin-plus-fast@1.2.3 benchmark:tree
> node benchmark/benchmark-tree.js

        TreeFilterer.setCandidates: 2.04 ms
TreeFilterer.filter text: 0.64 ms
TreeFilterer.filter dips: 0.29 ms
TreeFilterer.filter disp: 0.25 ms
TreeFilterer.filter txt: 0.43 ms
TreeFilterer.filter getBuffer: 0.32 ms
        TreeFilterer.filter average: 0.388 ms
filterTree text: 2.57 ms
filterTree dips: 2.51 ms
filterTree disp: 3.09 ms
filterTree txt: 2.49 ms
filterTree getBuffer: 2.29 ms
        filterTree average: 2.590 ms
