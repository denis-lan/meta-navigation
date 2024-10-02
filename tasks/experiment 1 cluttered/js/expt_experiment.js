
function startExperiment() {
  // clean div
  goWebsite(html_task);
  // set flags
  startedexperiment  = true;
  finishedexperiment = false;
  // set new variables
  setExperiment();
  // run the experiment
  edata.exp_starttime = getTimestamp();
  runExperiment();
}

function finishExperiment_resize() {
  //instructions screen
  if(!isFullscreen() && $('#startButton').length>0){
    document.getElementById('startButton').disabled = true;
  }
  //task screen
  if(!isFullscreen() && startedexperiment && !finishedexperiment) {
    stopExperiment();
    saveExperiment("data/resize");
    goWebsite(html_errscreen);
  }
}

function finishExperiment_noresponse() {
  // stop the experiment
  edata.exp_finishtime = getTimestamp();
  stopExperiment();
  // send the data
  saveExperiment("data/noresponse");
  goWebsite(html_errnoresp);
}

function finishExperiment_data() {
  // stop the experiment
  edata.exp_finishtime = getTimestamp();
  stopExperiment();

  // move to feedback form
  goWebsite(html_feedbackform);
  saveExperiment("data/data");
}

function finishExperiment_feedback(){
  // send the data
  if (edata.feedback == undefined) {
    edata.feedback = "";
  }
  if (edata.feedback2 == undefined) {
    edata.feedback2 = "";
  }
  goWebsite(html_sending);
  saveExperiment("data/data");
  goWebsite(html_vercode);

}
function stopExperiment() {
  if(startedexperiment){
    // set flags
    finishedexperiment = true;
    // remove
    //removeFeedback();
    //removeStimuli();
    removeInstructions();
    //removeCountdown();
    removePaper();
  }
}

function saveExperiment(path_data){
  //set the data to be saved
  var path_tmp  = "data/tmp";

  var alldata = {
      task:       participant_task,
      path:       path_tmp,
      id:         participant_id,
      
      sdata:      JSON.stringify(sdata),
      edata:      JSON.stringify(edata),
      parameters: JSON.stringify(parameters),
  };
  if(finishedexperiment) {
    alldata.move = path_data;
  }
  //send it to the back-end
  logWrite(alldata);
}
