==== How to build a new task ====


=== Create a folder for your own experiments ===

You need to create a folder where you will put your experiments if you haven't done it yet.
It needs to be located in "/Library/WebServer/Documents/tasks/", for example:
  /Library/WebServer/Documents/tasks/jan
Make sure you use a sensible name! This will be what we call your "personal folder". You only will have one. And it will be the same one from now on and forever.


=== Copy a template task ===

If you want to create a new experiment, copy one of the template folders from
"tasks/generic/" (e.g. "tasks/generic/basic")  into your personal folder (e.g. "tasks/jan/"). You should now have a folder called "tasks/jan/basic/". If you copy it somewhere else than in personal folder, nothing will work. This is what we call your "experiment folder".


=== Rename your task ===

Rename the experiment folder with the name of your new experiment. Use a unique name that allows you to identify it, without spaces or weird characters. If you anticipate having multiple versions of the same experiment, you can put the date in front of the name, or enumerate them in increasing order (e.g. "tasks/jan/hello_world").


=== Find your experiment from the browser ===
Good! Your experiment is already running! You can see it if you go to "http://localhost/tasks/jan/hello_world". You'll find the "Before starting" page.

Alternatively, you can also go to "http://localhost" and navigate through your files. Try both ways and make sure you understand how your files relate with what you see in the browser.


=== Set the title ===
Go see what's in the folder. You'll find a file "index.html". Open it with a text editor. You can do that by right-clicking and using "Open with/TextEdit.app". Modify the value of the variable "participant_task" to match the path to the folder. It's important because subjects have been asked to report any technical issues to our email (neuronoodle@gmail.com), specifying what's the task they were running.
  participant_task = "jan/hello_world";
  

=== JavaScript files ===
I suggest [[http://www.sublimetext.com/|SublimeText]] to edit all your javascript code.
You can also force your computer to open HTML files with sublime text (or another text editor) by right-clicking on the file, and going to "Get Info/Open with". Select your prefered text editor and click on "Change All".

We now need to work out how to tell to the browser what's the experiment we plan to do (i.e. code the task). You'll find some files in "tasks/jan/hello_world/js/". Go have a look!
All of your JavaScript files will be executed at the beginning of your code (they're invoked from "index.htm"). You can also complement your task with new JavaScript files. However, keep in mind that these scripts are executed when you load the "index.html" file! They will execute before participants see the "Before Starting" page. Of course we want to avoid running the experiment before they've signed the consent form, so most of things will be defined as functions. We will call these functions later when the participant has already signed the consent form and wants to start with the task. 

=== Parameters ===

The first thing to do is to declare the variables we are going to use. You can simply do it by adding lines inside the "setExperiment()" function in the "expt_parameters.js" file. Again, be aware that the file will be executed straight from the very first page (before the actual experiment) unless you add it inside the "setExperiment()" function. The function will be called every time you start the experiment. Also, it means that if you create a variable outside the function to save the size of the browser into a variable called "foo_size", and afterwards you go into fullscreen mode, then "foo_size" will be wrong.
Additionally, any global variable you want to use should belong to one of five big structs:

    parameters  ::  all parameters to set. values in the other structs will reflect this parameters.
    sdata       ::  variables and responses for every single trial (badgui format)
    board       ::  struct where you should use to plot
    coding      ::  extra variables you might need

=== Files and organisation ===

There are many scripts. Files "expt_experiment.js", "expt_launcher.js" are used to start and finish, either the experiment or any block or trial.
Files "expt_show.js", "expt_hide.js" and "expt_update.js" are used to change the stimulus (or anything you see on the screen). Also "expt_remove.js", which includes all functions to clear the screen at the end of the experiment. Don't bother about them. Simply fill in the gaps.
Finally, "expt_response.js" handles all key events.

The file "expt_run.js" should have one single function called "runExperiment()".  This is your main function, where your experiment starts.  It's the last function called from "startExperiment()" and puts everything in place (e.g. the screen board where you can draw, the keyboard events, ..). Thanks to Steven for working out how to use Raphael (among many other things!).

=== Instructions ===

Participants also need to know what is the task. Add detailed (but not too boring) instructions in a file called "html/instructions.html".

=== Where do I start? ===
Have a look at the code and try to understand the basic things. Which function calls which function, what is where. When is the data being saved, etc.
You need to fill in some bits (they are clearly specified). Obviously, the structure of the code will also depend on your experiment.

=== How to debug ===
Use google chrome and open the javascript console. It's not great but it's the best way i've found of debugging your code. It's a bit like the command window in matlab (but you can't stop the experiment half way through).
You don't need to go through the consent form every time you want to try your experiment. Instead of going to "http://localhost/tasks/jan/hello_world" you can open ""http://localhost/tasks/jan/hello_world/task.html", or type "startExperiment();" from the javascript console.
Keep two windows open: Google Chrome and Sublime (or another browser) and SublimeText (or another text editor). You'll switch many times between them while you write your experiment.
