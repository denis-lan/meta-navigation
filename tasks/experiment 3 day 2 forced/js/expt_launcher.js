/*
<!-- Block methods -->
function newBlock() {
  hideTrial();
  hideFeedback();
  showBlock();
  saveExperiment();
}

function startBlock() {
  if (coding.newblock){
    coding.newblock  = false;
    hideBlock();
    newTrial();
  }
}

<!-- Trial methods -->
function nextTrial() {
  // INCREMENT TRIAL
  coding.index++;
  coding.trial++;

  // INCREMENT BLOCK
  if (coding.trial==parameters.nb_trials) {
    coding.block++;
    coding.trial=0;

    // END OF EXPERIMENT
    if (coding.block==parameters.nb_blocks) {
      finishExperiment_data();
      return;
    }

    // NEW BLOCK
    coding.newblock  = true;
    newBlock();
    return;
  }

  // NEW TRIAL
  newTrial();
}

function newTrial() {
  if (!startedexperiment) { return; }
  // update
  updateSdata();
  updateStimuli();
  // show
  showTrial();
  // hide
  hideFeedback();
  // timestamp
  coding.timestamp = getTimestamp();
  // allow answering
  coding.answering = true;
  coding.newblock  = false;
  // countdown
  //startCountdown();
}
*/
