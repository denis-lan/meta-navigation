
function runExperiment(){
  board = {};

  // BIND KEYS
  // jwerty.key('←', function ()  { handleResponse('Left', 1); });
  // jwerty.key('→',handleRight);
  // jwerty.key('↑',handleUp);
  // jwerty.key('↓', handleDown);
  jwerty.key('space',next);


  jwerty.key('I', function() {coding.pageno = 0; coding.ipressed = true; showInstructions();});

  // BOARD
  // fonts
  board.font_bigsize   = 100;
  board.font_medsize   = 15;
  board.font_tinysize  = 12;
  // paper (paper)
  board.paper = {};
  board.paper.width  = window.innerWidth;
  board.paper.height = window.innerHeight;
  board.paper.centre = [0.5*window.innerWidth , 0.5*window.innerHeight];
  board.paper.rect   = [
                        0,
                        0,
                        board.paper.width,
                        board.paper.height
                       ];
  board.paper.object = drawPaper(board.paper.rect);


  board.background = {};
  board.background.width  = window.innerWidth;
  board.background.height = window.innerHeight;
  board.background.rect   = [0, 0,
                        board.background.width,
                        board.background.height
                       ];
  board.background.object = drawRect(board.paper.object, board.background.rect);
  board.background.object.attr({"fill": "white"});
  board.background.object.toBack();
  
  

/*
  // FIXATION
  board.fixation = createFixation(board.paper);
  showFixation(board.fixation);

  //STIMULUS
  disp('runExperiment: FILL IN');
  // this is an example
  board.stimuli = {};
  board.stimuli.rectangle = {};
  board.stimuli.rectangle.rect   = [board.paper.centre[0]-50,board.paper.centre[1]-50,100,100];
  board.stimuli.rectangle.object = drawRect(board.paper.object,board.stimuli.rectangle.rect)
  hideStimuli();
  board.stimuli.rectangle.object.attr({"stroke-width":10})
*/

  // TEXT
  // instructions (text)
  board.instructions = {};
  board.instructions.centre       = [board.paper.centre[0], board.paper.centre[1]-150];
  board.instructions.text         = "";
  board.instructions.object       = drawText(board.paper.object,board.instructions.centre,board.instructions.text);
  board.instructions.object.attr({"font-size": board.font_medsize});
  board.instructions.object.attr({"text-anchor": "middle"});

  //point counter
  board.points = {};
  board.points.text   = "Points: " + coding.reward;
  board.points.centre = [board.paper.centre[0], board.paper.centre[1]+board.paper.centre[1]*0.88];
  board.points.object = drawText(board.paper.object,board.points.centre, board.points.text);
  board.points.object.attr({"font-size": 30});
  board.points.object.attr({"text-anchor": "left"});

  //replay text
  board.replaytext = {};
  board.replaytext.text   = "REPLAY";
  board.replaytext.centre = [board.paper.centre[0], board.paper.centre[1]-250];
  board.replaytext.object = drawText(board.paper.object,board.replaytext.centre, board.replaytext.text);
  board.replaytext.object.attr({"font-size": 30});
  board.replaytext.object.attr({"text-anchor": "left"});
  board.replaytext.object.attr({"opacity": 0});

  /*


  //trial counter
  board.trial = {};
  board.trial.text   = "Trial: " + (coding.trial + 1);
  board.trial.centre = [board.paper.centre[0]+150, board.paper.centre[1]+200];
  board.trial.object = drawText(board.paper.object,board.trial.centre, board.trial.text);
  board.trial.object.attr({"font-size": board.font_medsize});
  board.trial.object.attr({"text-anchor": "right"});



  // CLOCK
  drawClock([board.paper.centre[0], board.paper.centre[1]+150]);

  // COUNTDOWN
  drawCountdown("#808",1);
  board.countdown.total = 5;
  */
  
  // FEEDBACK
  // posfeedback (text)
  board.posfeedback = {};
  board.posfeedback.centre   = [board.paper.centre[0], board.paper.centre[1]-300];
  board.posfeedback.text     = "+" + coding.goalreward;
  board.posfeedback.colour   = "#2D2";
  board.posfeedback.object   = drawText(board.paper.object,board.posfeedback.centre,board.posfeedback.text);
  board.posfeedback.object.attr({"font-size": board.font_bigsize});
  board.posfeedback.object.attr({"fill": board.posfeedback.colour});
  board.posfeedback.object.attr({"zIndex": 100});

  // negfeedback (text)
  board.negfeedback = {};
  board.negfeedback.centre   = board.paper.centre;
  board.negfeedback.text     = coding.penalty;
  board.negfeedback.colour   = "#D22";
  board.negfeedback.object   = drawText(board.paper.object,board.negfeedback.centre,board.negfeedback.text);
  board.negfeedback.object.attr({"font-size": board.font_bigsize});
  board.negfeedback.object.attr({"fill": board.negfeedback.colour});
  board.negfeedback.object.attr({"zIndex": 100});

  //point update (text)
  board.pointupdate = {};
  board.pointupdate.centre   = board.paper.centre;
  board.pointupdate.text     = "Your current point tally is " + coding.reward + ".";
  board.pointupdate.object   = drawText(board.paper.object,board.negfeedback.centre,board.negfeedback.text);
  board.pointupdate.object.attr({"font-size": 50});
  board.pointupdate.object.attr({"fill": "black"});
  board.pointupdate.object.attr({"zIndex": 100});
  board.pointupdate.object.attr({"opacity": 0});

  //pre/post-block instructions

  board.instructions1 = {};
  board.instructions1.rect   = [board.paper.centre[0]-((board.paper.width * 0.85)/2), board.paper.centre[1]-(((board.paper.width * 0.85) / 1325 * 682)/2), board.paper.width * 0.85, (board.paper.width * 0.85) /  1325 * 682];
  board.instructions1.object   = drawImage(board.paper.object, "img/instructions1.png", board.instructions1.rect);
  board.instructions1.object.attr({"opacity": 0});

  board.instructions2 = {};
  board.instructions2.rect   = [board.paper.centre[0]-((board.paper.width * 0.85)/2), board.paper.centre[1]-(((board.paper.width * 0.85) / 866 * 434)/2), board.paper.width * 0.9, (board.paper.width * 0.85) / 866 * 434];
  board.instructions2.text     = "HI";
  board.instructions2.object   = drawImage(board.paper.object, "img/instructions2.png", board.instructions2.rect);
  board.instructions2.object.attr({"opacity": 0});

  board.instructions3 = {};
  board.instructions3.rect   = [board.paper.centre[0]-((board.paper.width * 0.85)/2), board.paper.centre[1]-(((board.paper.width * 0.85) / 838 * 452)/2), board.paper.width * 0.9, (board.paper.width * 0.85) / 838 * 452];
  board.instructions3.text     = "HI";
  board.instructions3.object   = drawImage(board.paper.object, "img/instructions3.png", board.instructions3.rect);
  board.instructions3.object.attr({"opacity": 0});

  board.instructions4 = {};
  board.instructions4.rect   = [board.paper.centre[0]-((board.paper.width * 0.85)/2), board.paper.centre[1]-(((board.paper.width * 0.85) / 1194 * 610)/2), board.paper.width * 0.9, (board.paper.width * 0.85) / 1194 * 610];
  board.instructions4.text     = "HI";
  board.instructions4.object   = drawImage(board.paper.object, "img/instructions4.png", board.instructions4.rect);
  board.instructions4.object.attr({"opacity": 0});


  board.pressspacetext = {};
  board.pressspacetext.centre   = [board.paper.centre[0], board.paper.centre[1]+board.paper.centre[1]*0.95];
  board.pressspacetext.text     = "HI";
  board.pressspacetext.object   = drawText(board.paper.object,board.pressspacetext.centre,board.pressspacetext.text);
  board.pressspacetext.object.attr({"font-size": 20});
  board.pressspacetext.object.attr({"fill": "black"});
  board.pressspacetext.object.attr({"zIndex": 100});
  board.pressspacetext.object.attr({"opacity": 0});

  board.instructionstext = {}
  board.instructionstext.centre   = [board.paper.centre[0], board.paper.centre[1]];
  board.instructionstext.text     = "HI";
  board.instructionstext.object   = drawText(board.paper.object,board.instructionstext.centre,board.instructionstext.text);
  board.instructionstext.object.attr({"font-size": 25});
  board.instructionstext.object.attr({"fill": "black"});
  board.instructionstext.object.attr({"zIndex": 100});
  board.instructionstext.object.attr({"opacity": 0});

  //prediction text
  board.prediction = {}
  board.prediction.centre   = [board.paper.centre[0], board.paper.centre[1]+200];
  board.prediction.text     = "Prediction: ";
  board.prediction.object   = drawText(board.paper.object,board.prediction.centre,board.prediction.text);
  board.prediction.object.attr({"font-size": 30});
  board.prediction.object.attr({"fill": "black"});
  board.prediction.object.attr({"zIndex": 100});
  board.prediction.object.attr({"opacity": 0});
  board.prediction.object.attr({"font-weight": "bold"});
  
  board.error = {}
  board.error.centre   = [board.paper.centre[0], board.paper.centre[1]+240];
  board.error.text     = "Please enter a number from 0 to 10.";
  board.error.object   = drawText(board.paper.object,board.error.centre,board.error.text);
  board.error.object.attr({"font-size": 20});
  board.error.object.attr({"fill": "red"});
  board.error.object.attr({"zIndex": 100});
  board.error.object.attr({"opacity": 0});

/*
  //NUMBERS
  board.xnumber = {};
  board.xnumber.centre   = board.paper.centre;
  board.xnumber.text     = coding.xloc;
  board.xnumber.colour   = "#000";
  board.xnumber.object   = drawText(board.paper.object,board.xnumber.centre,board.xnumber.text);
  board.xnumber.object.attr({"font-size": board.font_bigsize});
  board.xnumber.object.attr({"fill": board.xnumber.colour});

  board.ynumber = {};
  board.ynumber.centre   = board.paper.centre;
  board.ynumber.text     = coding.yloc;
  board.ynumber.colour   = "#2D2";
  board.ynumber.object   = drawText(board.paper.object,board.ynumber.centre,board.ynumber.text);
  board.ynumber.object.attr({"font-size": board.font_bigsize});
  board.ynumber.object.attr({"fill": board.ynumber.colour});
*/

  //hide grid
  board.cover =  {}
  board.cover.width  = 10000;
  board.cover.height = 10000;
  board.cover.rect   = [0,
                        0,
                        board.cover.width,
                        board.cover.height
                       ];
  board.cover.object = drawRect(board.paper.object, board.cover.rect);
  board.cover.object.attr({"fill": "white"});
  board.cover.object.attr({"opacity": 0});
  board.cover.object.toBack();
  board.cover.object.attr({"stroke-width":0});
  
  // //replay screen
  // board.arrow = {};
  // board.arrow.rect = [board.paper.centre[0]-70, board.paper.centre[1]-50, 150, 150];
  // board.arrow.object = drawImage(board.paper.object, "img/arrow.png", board.arrow.rect);
  // board.arrow.object.attr({"opacity": 0});
  // board.replayobj1 = new Array(coding.numrows);
  // board.replayobj2 = new Array(coding.numrows);
  // for(xobj = 0; xobj < coding.numrows; xobj++){
  // 	board.replayobj1[xobj] = new Array(coding.numcols);
  // 	board.replayobj2[xobj] = new Array(coding.numcols);
  // 	for(yobj = 0; yobj < coding.numcols; yobj++){
  // 		board.replayobj1[xobj][yobj] = {}
  // 		board.replayobj1[xobj][yobj].rect = [board.paper.centre[0]-210, board.paper.centre[1]-50, 140, 140];
  //       board.replayobj1[xobj][yobj].object = drawImage(board.paper.object, "img/object_" + board.objectimg[xobj][yobj] + ".png", board.replayobj1[xobj][yobj].rect);
  //       board.replayobj1[xobj][yobj].object.attr({"opacity":0});
  //       board.replayobj2[xobj][yobj] = {}
  // 		board.replayobj2[xobj][yobj].rect = [board.paper.centre[0]+90, board.paper.centre[1]-60, 140, 140];
  //       board.replayobj2[xobj][yobj].object = drawImage(board.paper.object, "img/object_" + board.objectimg[xobj][yobj] + ".png", board.replayobj2[xobj][yobj].rect);
  //       board.replayobj2[xobj][yobj].object.attr({"opacity":0});
  // 	}
  // }

  board.donebutton = {};
  board.donebutton.rect   = [board.paper.centre[0]+46+board.paper.centre[0]*0.5, board.paper.centre[1]+board.paper.centre[1]*0.7, 175, 92];
  board.donebutton.object = drawImage(board.paper.object, "img/donebutton.png", board.donebutton.rect);
  board.donebutton.object.toBack();
  board.donebutton.object.node.onclick = function(){endExplore()};

  generateGrid(min([board.paper.height*0.2, board.paper.width*0.13]), min([board.paper.height*0.2, board.paper.width*0.13]), 3, 3);
  generateExploreGrid(board.paper.height*0.08, board.paper.height*0.08, coding.numrows, coding.numcols);
  generateClickArrows(board.paper.width*0.08, board.paper.width*0.08);
  generateClickObjects(board.paper.width*0.10, board.paper.width*0.10);

  board.replayaction = {}
  board.replayaction.centre   = [board.paper.centre[0], board.paper.centre[1]+100, 150, 150];
  board.replayaction.text     = "UP";
  board.replayaction.object   = drawText(board.paper.object,board.replayaction.centre,board.replayaction.text);
  board.replayaction.object.attr({"font-size": 30});
  board.replayaction.object.attr({"fill": "black"});
  board.replayaction.object.attr({"zIndex": 100});
  board.replayaction.object.attr({"opacity": 0});

  board.startingupdate = {}
  board.startingupdate.centre   = board.paper.centre;
  board.startingupdate.text     = "Starting next trial...";
  board.startingupdate.object   = drawText(board.paper.object,board.startingupdate.centre,board.startingupdate.text);
  board.startingupdate.object.attr({"font-size": 50});
  board.startingupdate.object.attr({"fill": "black"});
  board.startingupdate.object.attr({"zIndex": 100});
  board.startingupdate.object.attr({"opacity": 0});

  board.trialinstructions = {}
  board.trialinstructions.centre   = [board.paper.centre[0], board.paper.centre[1]*0.08, 150, 150];
  board.trialinstructions.text     = "";
  board.trialinstructions.object   = drawText(board.paper.object,board.trialinstructions.centre,board.trialinstructions.text);
  board.trialinstructions.object.attr({"font-size": 25});
  board.trialinstructions.object.attr({"fill": "black"});
  board.trialinstructions.object.attr({"zIndex": 100});
  board.trialinstructions.object.attr({"opacity": 0});
  board.trialinstructions.object.attr({"font-weight": "bold"});

  board.trialinstructions1 = {}
  board.trialinstructions1.centre   = [board.paper.centre[0]*0.3, board.paper.centre[1]*0.4, 150, 150];
  board.trialinstructions1.text     = "Click on an arrow to take a step \n in the arrow's direction...";
  board.trialinstructions1.object   = drawText(board.paper.object,board.trialinstructions1.centre,board.trialinstructions1.text);
  board.trialinstructions1.object.attr({"font-size": 20});
  board.trialinstructions1.object.attr({"fill": "black"});
  board.trialinstructions1.object.attr({"zIndex": 100});
  board.trialinstructions1.object.attr({"opacity": 0});
  board.trialinstructions1.object.attr({"font-weight": "bold"});

  board.trialinstructions2 = {}
  board.trialinstructions2.centre   = [board.paper.centre[0]*1.7, board.paper.centre[1]*0.4, 150, 150];
  board.trialinstructions2.text     = "or click on an object to move to \n that object.";
  board.trialinstructions2.object   = drawText(board.paper.object,board.trialinstructions2.centre,board.trialinstructions2.text);
  board.trialinstructions2.object.attr({"font-size": 20});
  board.trialinstructions2.object.attr({"fill": "black"});
  board.trialinstructions2.object.attr({"zIndex": 100});
  board.trialinstructions2.object.attr({"opacity": 1});
  board.trialinstructions2.object.attr({"font-weight": "bold"});


  // board.trialinstructions1 = {}
  // board.trialinstructions1.centre   = [board.paper.centre[0], board.paper.centre[1]*0.08, 150, 150];
  // board.trialinstructions1.text     = "Click on the arrows to take one step in the direction of the arrow.";
  // board.trialinstructions1.object   = drawText(board.paper.object,board.trialinstructions.centre,board.trialinstructions.text);
  // board.trialinstructions1.object.attr({"font-size": 20});
  // board.trialinstructions1.object.attr({"fill": "black"});
  // board.trialinstructions1.object.attr({"zIndex": 100});
  // board.trialinstructions1.object.attr({"opacity": 0});
  // board.trialinstructions1.object.attr({"font-weight": "bold"});


  // START
  //newTrial();

  hideFeedback();
  //initialiseOrder();
  newBlock();
}
