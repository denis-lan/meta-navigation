
function hideTrial() {
  hideFixation(board.fixation);
  hideStimuli();
  hideInstructions();
  hideClock();
}

function hideStimuli() {
  disp('hideStimuli: FILL IN');
  // this is an example
}

function hideInstructions() {
  board.instructions.object.attr({"opacity": 0});
}

function hideFeedback() {
	coding.answering = true;
	// board.cover.object.attr({"opacity": 0});
 	board.posfeedback.object.attr({"opacity": 0});
 	board.negfeedback.object.attr({"opacity": 0});
 	board.pointupdate.object.attr({"opacity": 0});
  if (coding.index>0){
    // board.goalobj[coding.goalxloc][coding.goalyloc].object[coding.block][coding.trial].attr({"opacity":1});
    // board.goaltext.object.attr({"opacity": 1});
    //board.trialinstructions.object.attr({"opacity": 1});
  }
  
}

function hideStartingText(){
  coding.answering = true;
  board.cover.object.attr({"opacity": 0});
  board.startingupdate.object.attr({"opacity": 0});
  coding.feedbackshown = false;
}

function hideBlock() {
  board.block.object.remove();
}
