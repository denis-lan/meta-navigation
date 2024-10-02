
function handleLeft()  { handleResponse('Left', 1, 'd'); }
function handleRight() { handleResponse('Right',2, 'd'); }
function handleUp() { handleResponse('Up', 3 ,'d'); }
function handleDown() { handleResponse('Down', 4,'d'); }

function handleResponse(key, category, responsetype) {
  if(coding.answering && !coding.feedbackshown){
    // coding.answering = false;
    // setTimeout(function(){
    //   if(!coding.feedbackshown){
    //     coding.answering = true;
    //   }
    // }, 100)
    if(isnan(category)) {
      handleNoResponse();
    } else {
      saveResponse(key, category, responsetype);
      //coding.answering = false;
      if(key == 'Right'){
        if (coding.xloc < coding.totcols - 2){
          //board.gridcontent[coding.yloc][coding.xloc].object.attr({"text": ""});
          newxloc = coding.xloc + 1;
          newyloc = coding.yloc;
          moved = true;
          //board.xnumber.object.attr({"text": coding.xloc});
        }
        else{
          moved = false;
        }
      }
      else if(key == 'Left'){
        if (coding.xloc > 1){
          //board.gridcontent[coding.yloc][coding.xloc].object.attr({"text": ""});
          newxloc = coding.xloc - 1;
          newyloc = coding.yloc;
          moved = true;
          //board.xnumber.object.attr({"text": coding.xloc});
        }
        else{
          moved = false;
        }
      }
      else if(key == 'Up'){
        if (coding.yloc > 1){
          //board.gridcontent[coding.yloc][coding.xloc].object.attr({"text": ""});
          newyloc = coding.yloc - 1;
          newxloc = coding.xloc; 
          moved = true;
          //board.ynumber.object.attr({"text": coding.yloc});
        }
        else{
          moved = false;
        }
      }
      else if(key == 'Down'){
        if (coding.yloc < coding.numrows - 2){
          //board.gridcontent[coding.yloc][coding.xloc].object.attr({"text": ""});
          newyloc = coding.yloc + 1;
          newxloc = coding.xloc;
          moved = true
          //board.ynumber.object.attr({"text": coding.yloc});
        }
        else {
          moved = false;
        }
      }

      if (moved == true){
        //board.characterimg[coding.yloc][coding.xloc].object.attr({"opacity": 0});
        coding.xloc = newxloc;
        coding.yloc = newyloc;
        if (coding.trial == 0){
          //goalorstart[coding.xloc][coding.yloc] = 5; //if a new goal is required, this prevents the function from setting the goal to a state that has already been traversed
        }
        saveMovement(key,category,responsetype);
        for(action = 1; action <= 4; action ++){
          if(category == action){
            board.actionindicator[action][0].object.attr({"opacity":1});
            board.actionindicator[action][0].object.toFront();
          }
          else{
            for(colour = 0; colour <= 2; colour++){
              board.actionindicator[action][colour].object.attr({"opacity":0});
            }
          }
        }
        // board.actionindicator[category].object.attr({"opacity":1});
        coding.answering = false;
        coding.feedbackshown = true;
        timeout = 300;
        setTimeout(function(){
          if(key == 'Left'){
              board.leftimg[newxloc][newyloc].object[coding.block][coding.trial].attr({"opacity": 0.7});
              board.leftimg[newxloc][newyloc].object[coding.block][coding.trial].toFront();
            }
            else if(key == 'Right'){
              board.rightimg[newxloc][newyloc].object[coding.block][coding.trial].attr({"opacity": 0.7});
              board.rightimg[newxloc][newyloc].object[coding.block][coding.trial].toFront();
            }
            else if(key == 'Up'){
              board.upimg[newxloc][newyloc].object[coding.block][coding.trial].attr({"opacity": 0.7});
              board.upimg[newxloc][newyloc].object[coding.block][coding.trial].toFront();
            }
            else if(key == 'Down'){
              board.downimg[newxloc][newyloc].object[coding.block][coding.trial].attr({"opacity": 0.7});
              board.downimg[newxloc][newyloc].object[coding.block][coding.trial].toFront();
            }
        }, timeout/2);

        setTimeout(function () {
          // board.actionindicator[category].object.attr({"opacity":0});
          //clearReplayObjects();
          updateImages();
          //TO DO: separate update arrows from update images
          board.lastactionindicator[category][0].object.attr({"opacity":0.7});
          board.lastactionindicator[category][0].object.toFront();



          setTimeout(function(){
            coding.answering = true;
            coding.feedbackshown = false;
            board.lastactionindicator[category][0].object.attr({"opacity":0});
            checkTrialCondition();
            updateArrows();
            updateClickObjects();

            if(coding.block != 0){ //code for practice block, not currently used (change to 0 to set first block)
              coding.reward -= coding.movementcost;
              board.points.object.attr({"text": "Points: " + coding.reward});
              console.log('handleresponse points')
            }
            else{
              stepsleft = max([parameters.practicetrialsteps - sdata.resp_validkeypresses[coding.index].length, 0]);
              if(parameters.practicetrialsteps - sdata.resp_validkeypresses[coding.index].length < 0){
                board.points.object.attr({"text": "Try moving using both the objects and the arrows!"});
              }
              else{
                board.points.object.attr({"text": "Steps Remaining: " + stepsleft});
              }  
            }
            
            

            if(coding.block == 0){ //code for practice block, not currently used (change to 0 to set first block)
              // console.log(responsetype);
              // console.log(sdata.resp_keypresses[coding.index]);
              // console.log(sdata.resp_keypresses[coding.index].length);
              if(coding.trial == 0 && sdata.resp_keypresses[coding.index].length == 1){
                coding.firstway = responsetype;
              }
              else if(coding.firstway != responsetype){
                console.log('yay');
                coding.practicedboth = true;
              }
              
              if(sdata.resp_keypresses[coding.index].length >= parameters.practicetrialsteps && coding.practicedboth){
                endTrial(false);
              }
            }
            else{
              if(coding.xloc == coding.goalxloc && coding.yloc == coding.goalyloc){
                endTrial(true); 
              }
            }

          }, timeout);
        }, timeout);
        
      }
      
      //board.gridcontent[coding.yloc][coding.xloc].object.attr({"text": "X"});
      
    }
  }
}


function endTrial(goalReached){
  
  if(goalReached){
    pointchange = coding.goalreward;
    coding.reward += pointchange;
    timeout = 1000;
  
    if(pointchange > 0){
      showFeedbackPos();
    }
    else{
      showFeedbackNeg();
    }
    coding.answering = false;
    coding.feedbackshown = true;
  }
  else{
    pointchange = 0;
    coding.answering = false;
    coding.feedbackshown = true;
    timeout = 500;
  }
  
  //timeout = ((coding.trial + 1) == 5) ? 4000 : 1000;
  setTimeout(function () {
    saveTrial(pointchange);
    

    if(sdata.cond_probetrials[coding.index] == 1){
      if(coding.block == 0){
        showInstructions();
      }
      else{
        startProbeBlock();
      }
      
    }
    else{
      coding.index += 1;
      clearOldImages();
      if(coding.block == 0 && coding.trial + 1 == parameters.nb_practice_trials|| coding.block != 0 && coding.trial + 1 >= parameters.nb_trials){     
        endBlock();
      }
      else{
        coding.trial += 1;
        startExplore();
        //newTrial();
      }
    }
      //if(coding.block == 0 && coding.trial + 1 == parameters.nb_practice_trials||coding.block == 1 && coding.trial + 1 == parameters.nb_trials||coding.block == 2 && coding.trial + 1 == parameters.nb_test_trials){
    
    

    // coding.answering = true;
    // coding.feedbackshown = false;
    hideFeedback();
  
    // if(coding.block!=0){
    //   board.points.object.attr({"text": "Points: " + coding.reward});
    // }
    
    //board.trial.object.attr({"text": "Trial: " + coding.trial});
    coding.steps = 0; 
  }, timeout);
}

function newTrial(){
  if(!(coding.block == parameters.nb_blocks - 1 && coding.trial == parameters.nb_trials - 1)){
    preUpdateExploreImages();
  }
  console.log('newtrial hello');
  
  if(coding.block == 0){
    board.trialinstructions.object.attr({"text":"Practice run: try moving around using both the objects and the arrows!"});
    stepsleft = max([parameters.practicetrialsteps - sdata.resp_validkeypresses[coding.index].length, 0]);
    board.points.object.attr({"text": "Steps Remaining: " + stepsleft});
  }
  else{
    board.trialinstructions.object.attr({"text":""});
    board.points.object.attr({"text": "Points: " + coding.reward});
    console.log('newtrial points');
  }

  if(coding.trial == 0){
    if((coding.block == 0 & parameters.leftrightfirst == "right")){
      swapClickyPlaces();
      console.log('swap');
    }
  }
  if(coding.block > 0){
    swapClickyPlaces();
  }
  board.pressspacetext.object.attr({"text": "Press 'I' to review instructions." });
  board.pressspacetext.object.attr({"opacity": 1});
  board.pressspacetext.object.toFront();
  board.pressspacetext.object.attr({"font-weight": "bold"});

  coding.timestamp = getTimestamp();
  //showStartingText();
  //coding.answering = false;
  timeout = 0;

  //newUnstableLandmarks();

  if(coding.goalxloc){ //if a goal location has been defined
    board.goalobj[coding.goalxloc][coding.goalyloc].object[coding.block][coding.trial].attr({"opacity":0});
  }
  
  
  // newgoalxloc = Math.floor(Math.random() * (coding.numrows));
  // newgoalyloc = Math.floor(Math.random() * (coding.numrows));

  // //console.log(coding.landmarks);
  // //while((newgoalxloc % 2 == 0 && newgoalyloc % 2 != 0) || (newgoalxloc % 2 != 0 && newgoalyloc % 2 == 0)){\
  // //console.log(coding.landmarks[newgoalxloc][newgoalyloc]);
  // while(coding.landmarks[newgoalxloc][newgoalyloc] != 0){
  //   newgoalxloc = Math.floor(Math.random() * (coding.numrows));
  //   newgoalyloc = Math.floor(Math.random() * (coding.numrows));
  // }

  // coding.goalxloc = newgoalxloc;
  // coding.goalyloc = newgoalyloc;
  //goalorstart[newgoalxloc][newgoalyloc] = 1;

  coding.goalxloc = sdata.blockgoalxlocs[coding.block][coding.trial];
  coding.goalyloc = sdata.blockgoalylocs[coding.block][coding.trial];
  // console.log(coding.goalxloc);
  // console.log(coding.goalyloc);
  // xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
  // yloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
  // while(goalorstart[xloc][yloc]!=0|| (coding.landmarks[xloc][yloc] != 0) || (abs(coding.goalxloc - xloc) + abs(coding.goalyloc - yloc) != parameters.pathlength)){
  //   console.log('hi');
  //   xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
  //   yloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
  // }

  xloc = sdata.blockstartingxlocs[coding.block][coding.trial];
  yloc = sdata.blockstartingylocs[coding.block][coding.trial];
  if(coding.block > 0 && coding.block < sdata.blockstartingylocs.length){
    board.goaltext.object.attr({"text": 'GOAL: '});
    board.goaltext.object.attr({"opacity": 1});
    board.goalobj[coding.goalxloc][coding.goalyloc].object[coding.block][coding.trial].attr({"opacity":1});
  }
  
  board.trialinstructions.object.attr({"opacity": 1});
  board.trialinstructions1.object.attr({"opacity": 1});
  board.trialinstructions2.object.attr({"opacity": 1});
  //board.goalobj[coding.block][coding.goalxloc][coding.goalyloc].object.toFront();
  coding.xloc = xloc;
  coding.yloc = yloc;

  //showMeTheWay();
  //console.log(coding.block);
  // if(coding.block == 999){ //code for practice block (not currently used)
  //   coding.startingxloc = coding.startingxlocs[coding.trial];
  //   coding.startingyloc = coding.startingylocs[coding.trial];
  //   coding.xloc = coding.startingxloc;
  //   coding.yloc = coding.startingyloc;
  //   stepsleft = parameters.practicetrialsteps;
  //   board.points.object.attr({"text": "Steps Remaining: " + stepsleft});
  // }
  // else if (coding.block > 999) { //code for testing block (not currently used)
  //   board.goalobj[coding.goalxloc][coding.goalyloc].object.attr({"opacity":0});
  //   newgoalxloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //   newgoalyloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //   while(goalorstart[newgoalxloc][newgoalyloc] == 1){
  //     newgoalxloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //     newgoalyloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //   }
  //   coding.goalxloc = newgoalxloc;
  //   coding.goalyloc = newgoalyloc;
  //   goalorstart[newgoalxloc][newgoalyloc] = 1;

  //   xloc = Math.floor(Math.random() * (coding.numrows));
  //   yloc = Math.floor(Math.random() * (coding.numrows));
  //   while(xloc == newgoalxloc && yloc == newgoalyloc || abs(coding.goalxloc - xloc) + abs(coding.goalyloc - yloc) != parameters.pathlength){
  //     xloc = Math.floor(Math.random() * (coding.numrows));
  //     yloc = Math.floor(Math.random() * (coding.numrows));
  //     console.log(xloc);
  //     console.log(yloc);
  //   }
  // board.goaltext.object.attr({"opacity": 1});
  //   board.goalobj[coding.goalxloc][coding.goalyloc].object.attr({"opacity":1});
  //   coding.xloc = xloc;
  //   coding.yloc = yloc;

  // }
  //   else{
  //     i = Math.floor(Math.random() * (parameters.nostartlocations));
  //     coding.startingxloc = coding.startingxlocs[i];
  //     coding.startingyloc = coding.startingylocs[i];
  //     coding.xloc = coding.startingxloc;
  //     coding.yloc = coding.startingyloc;
  //     board.points.object.attr({"text": "Points: " + coding.reward});
  //   }

    // i = Math.floor(Math.random() * (parameters.nostartlocations));
    // coding.startingxloc = coding.startingxlocs[i];
    // coding.startingyloc = coding.startingylocs[i];
    // coding.xloc = coding.startingxloc;
    // coding.yloc = coding.startingyloc;
    // board.points.object.attr({"text": "Points: " + coding.reward});
    board.points.object.toFront();

    

 
  
  

  // if(coding.limitedges){
  //   //code for random starting location away from edge
  //   coding.xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //   coding.yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;

  //   while(coding.xloc==coding.goalxloc && coding.yloc==coding.goalyloc){
  //     coding.xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
  //     coding.yloc = Math.floor(Math.random() * (coding.numrows-2))+ 1;
  //   }
  // }
  // else{
  //   //code for random starting location
  //   coding.xloc = Math.floor(Math.random() * (coding.numrows));
  //   coding.yloc = Math.floor(Math.random() * (coding.numrows));

  //   while(coding.xloc==coding.goalxloc && coding.yloc==coding.goalyloc){
  //     coding.xloc = Math.floor(Math.random() * (coding.numrows));
  //     coding.yloc = Math.floor(Math.random() * (coding.numrows));
  //   }
  // }





  //code for fixed starting location
  // coding.xloc = coding.startingxloc;
  // coding.yloc = coding.startingyloc;
  checkTrialCondition();
  updateImages();
  updateArrows();
  updateClickObjects();
  // coding.startingxloc = coding.xloc;
  // coding.startingyloc = coding.yloc;
  hideStartingText();
  coding.answering = true;
  
    // resetGrid();
  if (coding.index < 10000){
    // console.log(coding.index);
    console.log('hello world');
    sdata.resp_keypresses[coding.index] = [];
    sdata.resp_resptype[coding.index] = [];
    sdata.resp_validkeypresses[coding.index] = [];
    sdata.resp_validkeypresses[coding.index] = [];
    sdata.resp_xlocs[coding.index] = String(coding.xloc);
    sdata.resp_ylocs[coding.index] = String(coding.yloc);
    // sdata.resp_landmarktype[coding.index] = String(coding.landmarks[coding.xloc][coding.yloc]);
    console.log(sdata.resp_timestamp);
    sdata.resp_timestamp[coding.index] = [];
    sdata.resp_reactiontime[coding.index] = [];
    console.log(sdata.resp_timestamp);
  }

  console.log('new trial');
  // if(coding.block == 0){
  //   board.cover.object.attr({"opacity":1});
  //   board.cover.object.toFront();
  //   board.instructions.object.attr({"text": "Loading task - please wait..."});
  //   board.instructions.object.toFront();
  //   board.instructions.object.attr({"font-size": 30});
  //   board.instructions.object.attr({"opacity": 1});
  //   setTimeout(function(){
  //     board.instructions.object.attr({"opacity": 0});
  //     board.cover.object.attr({"opacity":0});
  //     board.cover.object.toBack();
  //   },60000);
  // }
}

function showMeTheWay(){
  xdirection = coding.goalxloc - coding.xloc;
  ydirection = coding.goalyloc - coding.yloc;
  console.log('you cheater!');
  if(xdirection >= 0){
    console.log('go right ' + xdirection + ' steps');
  }
  else{
    console.log('go left ' + abs(xdirection) + ' steps');
  }

  if(ydirection >= 0){
    console.log('go down ' + ydirection + ' steps');
  }
  else{
    console.log('go up ' + abs(ydirection) + ' steps');
  }

}

function newTask(){


  coding.taskno += 1;
  if (coding.taskno == parameters.nb_blocks){
    finishExperiment_data();
  }
  coding.taskno += 1;
  coding.trial = 0;
  //board.trial.object.attr({"text": "Trial: " + (coding.trial+1)});

  if (coding.needreversal){
    coding.reversed = true;
  }
  resetGrid();
}

function handleNoResponse() {
  if(!isFullscreen() && startedexperiment && !finishedexperiment) {
    finishExperiment_noresponse();
  }
}

function saveResponse(key,category,responsetype) {
  var resp_timestamp = getTimestamp();
  var resp_rt      = getSecs(coding.timestamp);
  console.log('save response');
  sdata.resp_keypresses[coding.index]   = String(sdata.resp_keypresses[coding.index].concat(category));
  sdata.resp_timestamp[coding.index]    = String(sdata.resp_timestamp[coding.index].concat(resp_timestamp + ","));
  sdata.resp_reactiontime[coding.index] = String(sdata.resp_reactiontime[coding.index].concat(resp_rt + ","));
  // disp(sdata.resp_timestamp);
  // disp(sdata.resp_reactiontime);
  coding.timestamp = resp_timestamp; 
}

function saveMovement(key, category, responsetype) {
  console.log('save valid movement');
  sdata.resp_validkeypresses[coding.index] = String(sdata.resp_validkeypresses[coding.index].concat(category));
  sdata.resp_xlocs[coding.index]           = String(sdata.resp_xlocs[coding.index].concat(coding.xloc));
  sdata.resp_ylocs[coding.index]           = String(sdata.resp_ylocs[coding.index].concat(coding.yloc));
  // sdata.resp_landmarktype[coding.index]    = String(sdata.resp_landmarktype[coding.index].concat(coding.landmarks[coding.xloc][coding.yloc]));
  sdata.resp_resptype[coding.index] = String(sdata.resp_resptype[coding.index].concat(responsetype));
}

function saveTrial(pointchange){
//   sdata.resp_firstobjshape[coding.index] = coding.grabbedobjs[0].identity[0];
//   sdata.resp_secondobjshape[coding.index] = coding.grabbedobjs[1].identity[0];
//   sdata.resp_firstobjcolour[coding.index] = coding.grabbedobjs[0].identity[1];
//   sdata.resp_secondobjcolour[coding.index] = coding.grabbedobjs[1].identity[1];
//   sdata.resp_pointsgained[coding.index] = pointchange;
//   sdata.resp_correct[coding.index] = (pointchange > 0) ? 1 : 0;
//   coding.correctcount += sdata.resp_correct[coding.index];
  sdata.resp_currentscore[coding.index] = coding.reward;
  // console.log(sdata.resp_keypresses[coding.index]);
  // console.log(coding.index);
  sdata.resp_steps[coding.index] = sdata.resp_validkeypresses[coding.index].length;
  sdata.resp_block[coding.index] = coding.block;



  sdata.cond_startingxloc[coding.index] = coding.startingxloc;
  sdata.cond_startingyloc[coding.index] = coding.startingyloc;
  sdata.cond_stable1xloc[coding.index] = coding.stable1xloc;
  sdata.cond_stable1yloc[coding.index] = coding.stable1yloc;
  sdata.cond_stable2xloc[coding.index] = coding.stable2xloc;
  sdata.cond_stable2yloc[coding.index] = coding.stable2yloc;
  sdata.cond_unstable1xloc[coding.index] = coding.unstable1xloc;
  sdata.cond_unstable1yloc[coding.index] = coding.unstable1yloc;
  sdata.cond_unstable2xloc[coding.index] = coding.unstable2xloc;
  sdata.cond_unstable2yloc[coding.index] = coding.unstable2yloc;
  sdata.cond_goalxloc[coding.index] = coding.goalxloc;
  sdata.cond_goalyloc[coding.index] = coding.goalyloc;
  sdata.cond_replaytype[coding.index] = parameters.order[coding.block];
}
