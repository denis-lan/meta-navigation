
<!-- Update methods -->
function updateSdata() {
  sdata.expt_index[coding.index]  = coding.index;
  sdata.expt_trial[coding.index]  = coding.trial;
  sdata.expt_block[coding.index]  = coding.block;

 // sdata.vbxi_category[coding.index] = randi(2);
  disp('updateSdata: FILL IN');
}

function updateStimuli() {
  disp('updateStimuli: FILL IN');
  // this is an example
  /*
  if(sdata.vbxi_category[coding.index]==0) {
    board.stimuli.rectangle.object.attr({"stroke":"#088"});
  } else {
    board.stimuli.rectangle.object.attr({"stroke":"#880"});
  }
  */
}
