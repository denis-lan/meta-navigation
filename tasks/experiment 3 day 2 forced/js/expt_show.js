
function showTrial() {
  //showFixation(board.fixation);
  //showStimuli();
  showInstructions();
  //showClock();
}
/*
function showStimuli() {
  disp('showStimuli: FILL IN');
  // this is an example
  board.stimuli.rectangle.object.attr({"opacity": 1});
}
*/



function showFeedbackPos() {
  coding.answering = false;
  // board.cover.object.attr({"opacity": 1});
  // board.cover.object.toFront();

  board.trialinstructions.object.attr({"opacity": 0});
  board.posfeedback.object.attr({"opacity": 1});
  board.posfeedback.object.toFront();
  board.goalobj[coding.goalxloc][coding.goalyloc].object[coding.block][coding.trial].attr({"opacity":0});
  board.goaltext.object.attr({"opacity": 0});
  
  
  /*
  if ((coding.trial + 1) == 5){
    setTimeout(function() {
        board.posfeedback.object.attr({"opacity": 0});
        board.negfeedback.object.attr({"opacity": 0});
        board.pointupdate.object.toFront();
        board.pointupdate.object.attr({"opacity": 1});
        board.pointupdate.object.attr({"text": "Your current point tally is " + coding.reward+ "."});
    }, 1000)
  }*/

  var audio = new Audio('sound/correct.mp3');
  audio.loop = false;
  audio.play(); 

}
function showFeedbackNeg() {
  coding.answering = false;
  board.cover.object.attr({"opacity": 1});
  board.cover.object.toFront();
  board.negfeedback.object.attr({"opacity": 1});
  board.negfeedback.object.toFront();
  /*
    if ((coding.trial + 1) == 5){
    setTimeout(function() {
        board.posfeedback.object.attr({"opacity": 0});
        board.negfeedback.object.attr({"opacity": 0});
        board.pointupdate.object.toFront();
        board.pointupdate.object.attr({"opacity": 1});
        board.pointupdate.object.attr({"text": "Your current point tally is " + coding.reward+ "."});
    }, 1000)
  } */
  var audio = new Audio('sound/wrong.mp3');
  audio.loop = false;
  audio.play(); 
  board.characterimg[coding.yloc][coding.xloc].object.toBack();
}

function showStartingText(){
  coding.answering = false;
  coding.feedbackshown = true;
  board.cover.object.attr({"opacity": 1});
  board.cover.object.toFront();
  board.startingupdate.object.attr({"opacity": 1});
  board.startingupdate.object.toFront();
}

function showBlock(){
  board.block = {};
  board.block.centre = board.paper.centre;
  board.block.text = "A couple of seconds' break. Press the SPACE bar when you're ready to continue";
  board.block.object = drawText(board.paper.object,board.block.centre,board.block.text);
  board.block.object.attr({"font-size": board.font_medsize});
}
