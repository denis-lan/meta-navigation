function startProbeBlock(){

    //Get explore clicks

    //get unique xys
    xs = new Array();
    ys = new Array();
    xys = new Array();
    for(i = 0; i < sdata.resp_explorexclicks[coding.index].length - 1; i++){
      if(xys.includes(sdata.resp_explorexclicks[coding.index][i] + sdata.resp_exploreyclicks[coding.index][i])){
        console.log('repeat')
      }
      else{
        xs.push(parseInt(sdata.resp_explorexclicks[coding.index][i]));
        ys.push(parseInt(sdata.resp_exploreyclicks[coding.index][i]));
        xys.push(sdata.resp_explorexclicks[coding.index][i] + sdata.resp_exploreyclicks[coding.index][i]);
      }
    }
    numclicks = xs.length;

    //choose 2 without replacement
    var rand1 = Math.floor(Math.random() * numclicks);
    var rand2 = Math.floor(Math.random() * numclicks);
    while(rand2 == rand1){
        rand2 = Math.floor(Math.random() * numclicks);
    }

    xprobes = new Array();
    yprobes = new Array();

    //get the coordinates of the clicks
    xprobes[0] = xs[rand1];
    yprobes[0] = ys[rand1];
    xprobes[1] = xs[rand2];
    yprobes[1] = ys[rand2];

    //set goals as third probe
    xprobes[2] = coding.goalxloc;
    yprobes[2] = coding.goalyloc;


    //shuffle the order of probes
    var randorder = [0,1,2];
    randorder = shuffle(randorder);
    xprobes = [xprobes[randorder[0]], xprobes[randorder[1]], xprobes[randorder[2]]];
    yprobes = [yprobes[randorder[0]], yprobes[randorder[1]], yprobes[randorder[2]]];

    sdata.cond_xprobes[coding.index] = xprobes.toString();
    sdata.cond_yprobes[coding.index] = yprobes.toString();

    //show probe grid
    coding.probetrialno = 0;
    sdata.resp_proberewards[coding.index] = 0;
    showProbeGrid();
    newProbeTrial();
}

function newProbeTrial(){
  board.goalobj[xprobes[coding.probetrialno]][yprobes[coding.probetrialno]].object[coding.block][coding.trial].attr({"opacity":1});
  board.goalobj[xprobes[coding.probetrialno]][yprobes[coding.probetrialno]].object[coding.block][coding.trial].toFront();
  if(coding.probetrialno > 0){
    board.goalobj[xprobes[coding.probetrialno-1]][yprobes[coding.probetrialno-1]].object[coding.block][coding.trial].attr({"opacity":0});
  }
  board.goaltext.object.attr({'text': 'Where is: '});
  board.goaltext.object.toFront();
  board.goaltext.object.attr({'opacity': 1});
  coding.probeanswering = true;


}

// This function is called when the probe is clicked.
function probeClick(y,x){
  if(coding.probeanswering){
    // Increment the probe trial number.
    coding.probetrialno += 1;
    // Change the fill color of the clicked square to blue.
    board.exploregrid[y][x].rectangle.object.attr({"fill":"black", "fill-opacity": 0.3});
    // Send the clicked square to the front.
    board.exploregrid[y][x].rectangle.object.toFront();

    //Compare clicked location to actual location and give points
    
    actualx = xprobes[coding.probetrialno-1];
    actualy = yprobes[coding.probetrialno-1];
    disttoactual = abs(x - actualx) + abs(y - actualy);
    points = Math.max(0, 30 - 10 * disttoactual);
    sdata.resp_proberewards[coding.index] += points;

    if(coding.block == 0){
      coding.reward += points;
    }
    
    
    

    // Record the clicked square's coordinates.
    sdata.resp_probexclicks[coding.index] = String(sdata.resp_probexclicks[coding.index]).concat(String(x));
    sdata.resp_probeyclicks[coding.index] = String(sdata.resp_probeyclicks[coding.index]).concat(String(y));
    saveProbeClick();

    coding.probeanswering = false;
    // Wait one second.
    setTimeout(function(){

        coding.probeanswering = true;

        // Change the fill color of the clicked square back to white.
        board.exploregrid[y][x].rectangle.object.attr({"fill":"white", "fill-opacity": 0}); 
        // If there are more probe trials to do...
        if (coding.probetrialno < 3){
            // Start a new probe trial.
            newProbeTrial();
        }
        // Otherwise...
        else{
            // End the probe block.
            endProbeBlock();
        }
    }, 1000);
  }
}

function saveProbeClick(){
  // Get the timestamp at the time of the probe click
  var resp_probetimestamp = getTimestamp();
  // Get the number of seconds since the last click (or the start of the block, if this is the first click)
  var resp_probert = getSecs(coding.timestamp);

  // Append the timestamp and seconds to the appropriate sdata variables
  sdata.resp_probetimestamp[coding.index] = String(sdata.resp_probetimestamp[coding.index].concat(resp_probetimestamp + ","));
  sdata.resp_probereactiontime[coding.index] = String(sdata.resp_probereactiontime[coding.index].concat(resp_probert + ","));
}

function endProbeBlock(){
  coding.probestarted = false;
  hideExploreGrid();
  board.goaltext.object.attr({'opacity': 0});
  board.goalobj[xprobes[coding.probetrialno-1]][yprobes[coding.probetrialno-1]].object[coding.block][coding.trial].attr({"opacity":0});
  clearOldImages();

  // show cover
  board.cover.object.attr({"opacity": 1});
  board.cover.object.toFront();
  if(coding.block == 0){
    board.pointupdate.object.attr({"text": "You earned " + sdata.resp_proberewards[coding.index] + " points!"});
  }
  else{
    board.pointupdate.object.attr({"text": "You earned " + sdata.resp_proberewards[coding.index] + " points!"});
  }
  
  board.pointupdate.object.attr({"opacity": 1});
  board.pointupdate.object.toFront();

  // Wait 2 seconds.
  setTimeout(function(){
    coding.index += 1;
    board.pointupdate.object.attr({"opacity": 0});
    board.pointupdate.object.toBack();
    if(coding.block == 0 && coding.trial + 1 == parameters.nb_practice_trials|| coding.block != 0 && coding.trial + 1 >= parameters.nb_trials){     
      endBlock();
      console.log('erer');
    }
    else{
      coding.trial += 1;
      startExplore();
      //newTrial();
    }
  }, 2000);
}

function showProbeGrid(){
    
    // show cover
    board.cover.object.attr({"opacity": 1});
    board.cover.object.toFront();

    // // show trial instructions
    // board.trialinstructions.object.attr({"text":"Click on the squares to reveal the landmarks!"});
    // board.trialinstructions.object.attr({"opacity":1.0});
    // board.trialinstructions.object.toFront();
    
    // show grid
    for(i=0; i<coding.numrows; i++){
      for(j=0; j<coding.numcols; j++){

        board.exploregrid[i][j].rectangle.object.toFront();
        board.exploregrid[i][j].rectangle.object.attr({"fill":"white", "fill-opacity": 0});
        
        if (i == 0 || i == coding.numrows - 1|| j == 0 || j == coding.numcols -1){
          board.exploreobjimg[i][j].object.attr({"opacity":1});
          board.exploreobjimg[i][j].object.toFront();
          board.exploregrid[i][j].rectangle.object.node.onclick = function(evt){console.log('wall clicked');};
          
        }
        else{
          board.exploregrid[i][j].rectangle.object.node.onclick = function(evt){id = evt.srcElement.id; clickx = parseInt(id.charAt(0)); clicky = parseInt(id.charAt(1)); probeClick(clickx,clicky);};
        }
      }
    }

    // show press space to continue text
    board.pressspacetext.object.attr({"text": "Press 'I' to review instructions." });
    board.pressspacetext.object.attr({"opacity": 1});
    board.pressspacetext.object.toFront();
    board.pressspacetext.object.attr({"font-weight": "bold"});

    //show object
    board.goalobj[xprobes[coding.probetrialno]][yprobes[coding.probetrialno]].object[coding.block][coding.trial].attr({"opacity":1});
    board.goalobj[xprobes[coding.probetrialno]][yprobes[coding.probetrialno]].object[coding.block][coding.trial].toFront();
    if(coding.probetrialno > 0){
      board.goalobj[xprobes[coding.probetrialno-1]][yprobes[coding.probetrialno-1]].object[coding.block][coding.trial].attr({"opacity":0});
    }
    board.goaltext.object.attr({'text': 'Where is: '});
    board.goaltext.object.toFront();
    board.goaltext.object.attr({'opacity': 1});



}

