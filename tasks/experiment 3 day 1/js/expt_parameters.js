
var sdata;
var edata;
var parameters;
var board;
var coding;

function setExperiment() {
  // EDATA ----------------
  edata = {};
  // expt
  edata.expt_subject = participant_id;
  edata.expt_sex     = participant_gender;
  edata.expt_age     = participant_age;
  edata.expt_task    = participant_task;
  edata.expt_turker  = participant_turker;

  // PARAMETERS -----------
  parameters = {};

  //time outs
  parameters.response_timeout =  2000;  // response time
  parameters.warnings_timeout = 20000;  // response warning time
  parameters.feedpos_timeout  =   400;  // feedback time (good)
  parameters.feedneg_timeout  =  2000;  // feedback time (bad)

  // numbers
  parameters.nb_practice_trials  = 1;
  parameters.nb_trials        =   6;
  parameters.nb_blocks        =   5; //including practice and test block (currently 1 practice + 6)
  parameters.nb_test_trials   =   1;
  parameters.practicetrialsteps = 10; //number of steps in each practice trial
  
  parameters.firsttrialminsteps = -1; //minimum of steps in first trial of each block; if participant reaches goal before this number, the goal "jumps" to a different location
  parameters.practiceexploresteps = 3;
  //replay parameters
  parameters.replaylength     =   99;
  parameters.replayspeed      =   1.5; //number of pictures a second
  parameters.replayreps       =   1;
  parameters.replaybefore     =   false; //whether to perform replay before trial
  parameters.replayafter      =   false; //whether to perform replay after trial
  parameters.replaybeforedirection = "forwards"; //direction of replay before trial
  parameters.replayafterdirection  = "forwards"; //direction of replay after trial
  parameters.forcedclickreps = 3;


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

  // parameters.order = ["na"].concat(shuffle(["s", "a", "sa", "sa-sparse", "none"])); //na means no pause (for practice block), none means pause during "replay" to simulate length of break
  
  parameters.order = ["na", "na", "na", "na", "na", "na"];
  leftright = ['left', 'right'];
  parameters.leftrightfirst = leftright[Math.floor(Math.random() * 2)];
  coding = {};
  coding.practicedboth = false;
  //grid parameters
  coding.numrows = 8 + 2;
  coding.numcols = 8 + 2; //+ 2 for boulders
  // coding.totcols = coding.numcols * 2 + 1; //for whole grid in version with two rooms
  coding.totcols = coding.numcols;
  coding.explorephase = false;
  coding.startingxlocs = new Array(parameters.nostartlocations);
  coding.startingylocs = new Array(parameters.nostartlocations);


  parameters.limitedges = false;
  parameters.showedges = false;
  parameters.showarrows = false;
  parameters.pathlength = 4;
  parameters.nostartlocations = 1;
  parameters.numgoals = 3;
  parameters.numexploreclicks = 16;
  parameters.practicenumexploreclicks = 3;
  


  // SDATA ----------------
  // sdata = {};
  if (sdata == undefined) {
    sdata = {};
  }
  sdata.blockstartingxlocs = new Array(parameters.nb_blocks);
  sdata.blockstartingylocs = new Array(parameters.nb_blocks);
  sdata.blockgoalxlocs = new Array(parameters.nb_blocks);
  sdata.blockgoalylocs = new Array(parameters.nb_blocks);
  // sdata.blocktrialgoalxlocs = new Array(parameters.nb_blocks);
  // sdata.blocktrialgoalylocs = new Array(parameters.nb_blocks);
  sdata.blocklandmarkxlocs = new Array(parameters.nb_blocks);
  sdata.blocklandmarkylocs = new Array(parameters.nb_blocks);
  for(x = 0; x < parameters.nb_blocks; x++){
    sdata.blockgoalxlocs[x] = new Array(parameters.nb_trials);
    sdata.blockgoalylocs[x] = new Array(parameters.nb_trials);
    sdata.blocklandmarkxlocs[x] = new Array(parameters.nb_trials);
    sdata.blocklandmarkylocs[x] = new Array(parameters.nb_trials);
  }
  sdata.exploreforcedxlocs = new Array(1 + (parameters.nb_blocks-1) * parameters.nb_trials);
  sdata.exploreforcedylocs = new Array(1 + (parameters.nb_blocks-1) * parameters.nb_trials);
  sdata.cond_exploreforcedxlocs = new Array(1 + (parameters.nb_blocks-1) * parameters.nb_trials);
  sdata.cond_exploreforcedylocs = new Array(1 + (parameters.nb_blocks-1) * parameters.nb_trials);
  for(i=0; i<1 + (parameters.nb_blocks-1) * parameters.nb_trials; i++){
    sdata.cond_exploreforcedxlocs[i] = '';
    sdata.cond_exploreforcedylocs[i] = '';
  }
  sdata.order = parameters.order;
  //sdata.landmarkcolours = shuffle(["red", "blue", "yellow"]);
  sdata.landmarkcolours = ["red", "red", "red"];
  // sdata.cond_numlandmarks = [3].concat(shuffle([2, 4, 8, 16]));
  // 1 practice trial + 4 blocks of 6 trials; 24 trials - 12 free trials and 12 forced trials

  
  // sdata.cond_freeorforced = [1].concat(Array(12).fill(1).concat(Array(12).fill(0)));
  sdata.cond_freeorforced = Array(25).fill(1);
  // sdata.cond_freeorforced = [0].concat(Array(24).fill(999));
  sdata.cond_blocknumlandmarks = shuffle([2, 4, 8, 16]);
  sdata.cond_numlandmarks = [3].concat(sdata.cond_blocknumlandmarks.flatMap(x => Array(6).fill(x)));
  sdata.cond_probetrials = [1].concat(Array(24).fill(0));
  for (i = 1; i < parameters.nb_blocks; i++){
    //choose two random trials to be probe trials
    randtrials = shuffle(Array(parameters.nb_trials).fill(0).map((x, y) => y)).slice(0, 2);
    sdata.cond_probetrials[(i - 1) * parameters.nb_trials + randtrials[0] + 1] = 1;
    sdata.cond_probetrials[(i - 1) * parameters.nb_trials + randtrials[1] + 1] = 1;
  }
  console.log(sdata.cond_freeorforced);
  console.log(sdata.cond_numlandmarks);
  console.log(sdata.cond_probetrials);
  

  // sdata.cond_probetrialnum = [0];
  // for(x = 1; x < parameters.nb_blocks; x++){
  //   sdata.cond_probetrialnum[x] = Math.floor(Math.random() * parameters.nb_trials);
  // }
  // sdata.cond_probetrialindex = new Array(parameters.nb_blocks);

  // expte
  sdata.expt_index        = [];
  sdata.expt_trial        = [];
  sdata.expt_block        = [];
  // vbxi
  sdata.vbxi_category     = [];
  //disp('setExperiment: FILL IN');
  // resp
  sdata.resp_timestamp    = [];
  sdata.resp_reactiontime = [];
  sdata.resp_category     = [];
  sdata.resp_correct      = [];
  sdata.resp_keypresses   = [];
  sdata.resp_resptype = [];
  sdata.resp_validkeypresses   = [];
  sdata.resp_xlocs        = [];
  sdata.resp_ylocs        = [];
  sdata.resp_landmarktype = [];
  sdata.resp_keypresses[0] = new String;
  sdata.resp_resptype[0] = new String;
  sdata.resp_validkeypresses[0] = new String;
  sdata.resp_xlocs[0]      = [];
  sdata.resp_ylocs[0]      = [];
  sdata.resp_landmarktype[0]      = [];
  sdata.resp_steps          = [];
  sdata.resp_currentscore = [];
  sdata.resp_block = [];
  sdata.resp_explorexclicks = [];
  sdata.resp_exploreyclicks = [];
  sdata.resp_exploretimestamp = [];
  sdata.resp_explorereactiontime = [];
  sdata.resp_exploreyclicks = [];
  for(i=0; i<(parameters.nb_blocks - 1) * parameters.nb_trials + 1; i++){
    sdata.resp_explorexclicks[i] = "";
    sdata.resp_exploreyclicks[i] = "";
    sdata.resp_exploretimestamp[i] = "";
    sdata.resp_explorereactiontime[i] = "";
  }
  sdata.resp_probexclicks = [];
  sdata.resp_probeyclicks = [];
  sdata.resp_probetimestamp = [];
  sdata.resp_probereactiontime = [];
  sdata.resp_proberewards = [];
  for(i=0; i<(parameters.nb_blocks - 1) * parameters.nb_trials + 1; i++){
    sdata.resp_probexclicks[i] = "";
    sdata.resp_probeyclicks[i] = "";
    sdata.resp_probetimestamp[i] = "";
    sdata.resp_probereactiontime[i] = "";
    sdata.resp_proberewards[i] = 0;
  }
  sdata.cond_startingxloc = [];
  sdata.cond_startingyloc = [];
  sdata.cond_goalxloc = [];
  sdata.cond_goalyloc = [];
  sdata.cond_replaytype = [];
  sdata.cond_stable1xloc = [];
  sdata.cond_stable2xloc = [];
  sdata.cond_stable1yloc = [];
  sdata.cond_stable2yloc = [];
  sdata.cond_unstable1xloc = [];
  sdata.cond_unstable2xloc = [];
  sdata.cond_unstable1yloc = [];
  sdata.cond_unstable2yloc = [];
  sdata.cond_blockgoalxlocs = new Array(parameters.nb_blocks);
  sdata.cond_blockgoalylocs = new Array(parameters.nb_blocks);
  sdata.cond_blocklandmarkxlocs = new Array(parameters.nb_blocks);
  sdata.cond_blocklandmarkylocs = new Array(parameters.nb_blocks);
  for(x = 0; x < parameters.nb_blocks; x++){
    sdata.cond_blockgoalxlocs[x] = new Array(parameters.nb_trials);
    sdata.cond_blockgoalylocs[x] = new Array(parameters.nb_trials);
    sdata.cond_blocklandmarkxlocs[x] = new Array(parameters.nb_trials);
    sdata.cond_blocklandmarkylocs[x] = new Array(parameters.nb_trials);
  }
  // sdata.cond_exploreforcedxlocs = new Array();

  sdata.cond_trialgoalxlocs = new Array();
  sdata.cond_trialgoalylocs = new Array();
  
  sdata.cond_triallandmarkxlocs = new Array();
  sdata.cond_triallandmarkylocs = new Array();

  sdata.cond_xprobes = new Array((parameters.nb_blocks - 1) * parameters.nb_trials + 1);
  sdata.cond_yprobes = new Array((parameters.nb_blocks - 1) * parameters.nb_trials + 1);
  for(i=0; i<(parameters.nb_blocks - 1) * parameters.nb_trials + 1; i++){
    sdata.cond_xprobes[i] = '';
    sdata.cond_yprobes[i] = '';
  }
  // BOARD ----------------
  board = {};

  // CODING ---------------
  
  // index
  coding.index  = 0;
  coding.trial  = 0;
  coding.block  = 0;
  // other
  coding.answering = false;
  coding.exploreanswering = false;
  coding.timestamp = NaN;

  coding.xloc = 0;
  coding.yloc = 0;

  coding.objxloc = new Array(2);
  coding.objyloc = new Array(2);
  for (m=0; m<=1; m++){
    coding.objxloc[m] = new Array(2);
    coding.objyloc[m] = new Array(2);
    for (n=0; n<=1; n++){
      coding.objxloc[m][n] = {};
      coding.objyloc[m][n] = {};
    }
  }
  coding.taskno = 0;
  coding.grabbed = 0;
  coding.grabbedobjs = new Array(2);
  coding.grabbedobjs[0] = {}
  coding.grabbedobjs[0].identity = []; //identity[0] is shape, identity[1] is colour
  coding.grabbedobjs[1] = {}
  coding.grabbedobjs[1].identity = [];
  coding.blockstarted = false;
  coding.explorephase = false;
  //coding.currentrule = Math.floor(Math.random() * 3) + 1;
  //coding.currentrule = 1;

  coding.reward = 1000;
  coding.goalreward = 1000;
  coding.explorecost = -0;
  //coding.penalty = -5;
  coding.steps = 0;
  coding.feedbackshown = false;
  coding.movementcost = 50;
  coding.showlastexplore = false;
}

function initialiseOrder(){

  coding.order = ["s", "a", "sa", "none"];
  parameters.order = coding.order;

  /*
  1 - colour same e.g. stable to stable
  2 - colour intradim e.g. stable to red
  3 - colour extradim e.g. stable to square
  4 - shape same e.g. square to square
  5 - shape intradim e.g. square to circle
  6 - shape extradim e.g. square to red
  */
}

function setRules(){
  // coding.condition = coding.order[coding.block];
  // if (coding.condition == 0){ //Practice Round
  //   coding.firstrule = Math.floor(Math.random() * 2);
  //   coding.secondrule = (coding.firstrule == 0) ? 1:0;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = Math.floor(Math.random() * 2);
  // }
  // else if (coding.condition ==  1){ //COLOUR RULE, SAME FOR BOTH ROOMS E.G. RED TO RED
  //   coding.firstrule = 1;
  //   coding.secondrule = 1;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = coding.firstruleid;
  // }
  // else if (coding.condition == 2){
  //   coding.firstrule = 1;
  //   coding.secondrule = 1;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = coding.firstruleid == 0 ? 1 : 0;
  // }
  // else if (coding.condition == 3){
  //   coding.firstrule = 1;
  //   coding.secondrule = 0;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = Math.floor(Math.random() * 2);
  // }
  // else if (coding.condition == 4){
  //   coding.firstrule = 0;
  //   coding.secondrule = 0;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = coding.firstruleid;
  // }
  // else if (coding.condition == 5){
  //   coding.firstrule = 0;
  //   coding.secondrule = 0;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = coding.firstruleid == 0 ? 1 : 0;
  // }
  // else if (coding.condition == 6){
  //   coding.firstrule = 0;
  //   coding.secondrule = 1;
  //   coding.firstruleid = Math.floor(Math.random() * 2);
  //   coding.secondruleid = Math.floor(Math.random() * 2);
  // }
}
/*
function logRules(){
  if (coding.condition[0] == 0){
    console.log("Linear rule first");
    if (coding.firstrule == 0){
      if (coding.firstruleid == 0){ console.log("Pick up circle");}
      else {console.log("Pick up square");}
      if (coding.secondruleid == 0){ console.log("Pick up red");}
      else {console.log("Put down stable");}
    }
    else {
      if (coding.firstruleid == 0){ console.log("Pick up red");}
      else {console.log("Pick up stable");}
      if (coding.secondruleid == 0){ console.log("Put down circle");}
      else {console.log("Put down square");}
    }
    if(coding.condition[1] == 0) { console.log("Linear reversal "+ coding.reversalrule + "(0 = reverse id, 1 = reverse dim, 2 = reverse both)");}
    else{ console.log("XOR rule " + coding.xorrule);}
  }
  else{
    console.log("XOR rule first; rule " + coding.xorrule);
    if(coding.condition[1] == 0){
      console.log("Linear rule second");
      if (coding.firstrule == 0){
        if (coding.firstruleid == 0){ console.log("Pick up circle");}
        else {console.log("Pick up square");}
        if (coding.secondruleid == 0){ console.log("Pick up red");}
        else {console.log("Put down stable");}
      }
     else {
        if (coding.firstruleid == 0){ console.log("Pick up red");}
        else {console.log("Pick up stable");}
        if (coding.secondruleid == 0){ console.log("Put down circle");}
        else {console.log("Put down square");}
      } 
    }
    else{
      console.log("XOR reversal");
    }
  }
}
*/
