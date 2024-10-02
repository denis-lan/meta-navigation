this is a STANDALONE version of BASIC.

It is alternative template for mturk experiments that doesn't require Perl and doesn't share JS libraries with other experiments. It fixes some issues of code structure, mostly on:
1. the requirement of Perl to save participant data and
2, the fact that many libraries are shared across different experiments.
If you have a Mac, Perl won't work if you have updated to "yosemite" or "el capitan". Without Perl you can't save data. The standalone version doesn't have this problem because it doesn't require Perl.

The standalone version saves participant data with PhP code (instead of Perl). this is also more flexible because you're allowed to have different php files for each experiment (that's not the case with Perl), and it also allows you to organise your experiments in whichever folders you want (e.g. i could have something like tasks/jan/memrise/training/groupA/index.html instead of only tasks/jan/memrise/index.html).

To edit/make your own task standalone:
1. make a backup of your experiment (just in case)
2. copy the "lib" and "php" folders
3. make sure there's a "docs" folder created, with writing permissions
4. make sure there's a "data/resize", "data/data", "data/tmp" folder created, with writing permissions
4. change your "index.html" so that the scripts included reference "lib" and not in "../../../lib"
5. edit the function "saveExperiment()" and make sure it references the right data folders (see "js/expt_experiment.js" in this template)
6. make sure you use "logStart" and "logWrite". if your code is anywhere calling "logStartLocal" or "logWriteLocal" instead, replace them.

PS. i didn't translate all the perl scripts to php. these ones are not available:
file_list.pl
fil_move.pl
file_read.pl
file_write.pl
bonus_write.pl