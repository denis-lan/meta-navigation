function generateExploreGrid(width, height, row, col){
    board.exploregrid = new Array(row);
    board.exploreobjimg = new Array(parameters.nb_blocks);
  
    for(blockno=0; blockno < parameters.nb_blocks; blockno ++){
      board.exploreobjimg[blockno] = new Array(parameters.nb_trials);
      for(trialno=0; trialno<parameters.nb_trials;trialno++){
        board.exploreobjimg[blockno][trialno] = new Array(row);
      }
    }
  
  
    var x;
    var y = board.paper.centre[1] - (height * row / 2);
    for(i=0; i<row; i++){
  
      board.exploregrid[i] = new Array(col);
      board.exploreobjimg[i] = new Array(col)
  
      // for(blockno = 0; blockno < parameters.nb_blocks; blockno ++){
      //   for(trialno=0; trialno<parameters.nb_trials;trialno++){
      //     board.exploreobjimg[blockno][trialno][i] = new Array(col);
      //   }
      // }
      
      
      x = board.paper.centre[0] - (width * col / 2);
      for(j=0; j<col; j++){
  
  
        board.exploregrid[i][j] = {};
        board.exploregrid[i][j].rectangle = {};
        board.exploregrid[i][j].rectangle.rect   = [x,y,width,height];
        board.exploregrid[i][j].rectangle.object = drawRect(board.paper.object, board.exploregrid[i][j].rectangle.rect);
        board.exploregrid[i][j].rectangle.object.attr({"stroke-width":5, "fill": 'white', "fill-opacity": 0});
        board.exploregrid[i][j].rectangle.object.node.id = i + "" + j;
        // board.exploregrid[i][j].rectangle.object.click(function(test, i, j){console.log(test); console.log(j); exploreClick(i, j)});
        board.exploregrid[i][j].rectangle.object.node.onclick = function(evt){id = evt.srcElement.id; clickx = parseInt(id.charAt(0)); clicky = parseInt(id.charAt(1)); exploreClick(clickx,clicky);};
        board.exploregrid[i][j].rectangle.object.toBack();
  
  
        // for(blockno=0; blockno < parameters.nb_blocks; blockno ++){
        //   for(trialno=0; trialno<parameters.nb_trials;trialno++){
        //     board.exploreobjimg[blockno][trialno][i][j] = {};
        //     board.exploreobjimg[blockno][trialno][i][j].rect = [x+5,y+5,width-10,height-10];
        //     board.exploreobjimg[blockno][trialno][i][j].object = drawImage(board.paper.object, "img/object_" + board.objectimg[blockno][trialno][j][i] + ".jpg", board.exploreobjimg[blockno][trialno][i][j].rect);;
        //     board.exploreobjimg[blockno][trialno][i][j].object.attr({"opacity":0});
            
        //     board.exploreobjimg[blockno][trialno][i][j].object.toBack()
        //   }
        // }


        board.exploreobjimg[i][j] = {};
        board.exploreobjimg[i][j].rect = [x+5,y+5,width-10,height-10];
        board.exploreobjimg[i][j].object = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][j][i] + ".jpg", board.exploreobjimg[i][j].rect);;
        board.exploreobjimg[i][j].object.attr({"opacity":0});
        
        board.exploreobjimg[i][j].object.toBack()
        x = x + width;
      }
  
  
  
      
  
      y = y + height;
    }
  
    // board.explorecover =  {}
    // board.explorecover.width  = 10000;
    // board.explorecover.height = 10000;
    // board.explorecover.rect   = [0,
    //                       0,
    //                       board.explorecover.width,
    //                       board.explorecover.height
    //                      ];
    // board.explorecover.object = drawRect(board.paper.object, board.cover.rect);
    // board.explorecover.object.attr({"fill": "white"});
    // board.explorecover.object.attr({"opacity": 1});
    // board.explorecover.object.attr({"stroke-width":0});
  
    hideExploreGrid();
  }
  
  function showExploreGrid(){
    
    board.cover.object.attr({"opacity": 1});
    board.cover.object.toFront();
    if(sdata.cond_freeorforced[coding.index] == 0){
      board.trialinstructions.object.attr({"text":"Click on the squares to reveal the objects! \n You are allowed to re-click on squares you have already clicked on."});
    }
    else{
      board.trialinstructions.object.attr({"text":"Click on the squares highlighted blue to reveal the objects!"});
    }
    board.trialinstructions.object.attr({"opacity":1.0});
    board.trialinstructions.object.toFront();
    redi = -1;
    redj = -1;
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
          board.exploregrid[i][j].rectangle.object.node.onclick = function(evt){id = evt.srcElement.id; clickx = parseInt(id.charAt(0)); clicky = parseInt(id.charAt(1)); exploreClick(clickx,clicky);};
        }
        // for(k = 0; k < sdata.resp_explorexclicks[coding.index].length - 1; k++){
        //   if(sdata.resp_explorexclicks[coding.index][k] == j && sdata.resp_exploreyclicks[coding.index][k] == i){
        //     board.exploregrid[i][j].rectangle.object.attr({"fill":"red", "fill-opacity": 0.3});
        //   }
        // }
        if(board.exploregrid[i][j].rectangle.object.attrs.stroke == "yellow" || board.exploregrid[i][j].rectangle.object.attrs.stroke == "blue"){
          redi = i;
          redj = j;
        }
      }
    }

    if(redi >= 0){
      board.exploregrid[redi][redj].rectangle.object.toFront();
    }
    //board.donebutton.object.toFront();
    
    clicksSoFar = sdata.resp_explorexclicks[coding.index].length;
    if(clicksSoFar == 0){
      var resp_exptimestamp = getTimestamp();
      coding.timestamp = resp_exptimestamp; 
      if(clicksSoFar < parameters.numexploreclicks){
        if(sdata.cond_freeorforced[coding.index] == 1){
          board.exploregrid[sdata.exploreforcedylocs[coding.index][0]][sdata.exploreforcedxlocs[coding.index][0]].rectangle.object.attr({'stroke':'blue'});
          board.exploregrid[sdata.exploreforcedylocs[coding.index][0]][sdata.exploreforcedxlocs[coding.index][0]].rectangle.object.toFront();
        }
        if(sdata.cond_freeorforced[coding.index] == 0){
          board.trialinstructions.object.attr({"text":"Click on the squares to reveal the objects! \n You are allowed to re-click on squares you have already clicked on."});
        }
        else{
          board.trialinstructions.object.attr({"text":"Click on the squares highlighted blue to reveal the objects!"});
        }
      }
      else{
        board.exploregrid[sdata.blockgoalylocs[coding.block][coding.trial]][sdata.blockgoalxlocs[coding.block][coding.trial]].rectangle.object.attr({'stroke':'yellow'});
        board.exploregrid[sdata.blockgoalylocs[coding.block][coding.trial]][sdata.blockgoalxlocs[coding.block][coding.trial]].rectangle.object.toFront();
        board.trialinstructions.object.attr({"text":"This is your goal for the next trial! Click to reveal it."});
      }
      
      // board.exploregrid[sdata.exploreforcedylocs[coding.index][0]][sdata.exploreforcedxlocs[coding.index][0]].rectangle.object.toFront();
    }
    else{
      if(coding.showlastexplore){
        showx = sdata.resp_explorexclicks[coding.index].charAt(clicksSoFar - 1);
        showy = sdata.resp_exploreyclicks[coding.index].charAt(clicksSoFar - 1);
        board.exploreobjimg[showy][showx].object.attr({"opacity":1});
        board.exploreobjimg[showy][showx].object.toFront();
      } 
    }

    if(coding.block == 0){
      clicksleft = parameters.practicenumexploreclicks - clicksSoFar;
      clicksleft = Math.max(clicksleft, 0);
    }
    else{
      clicksleft = parameters.numexploreclicks - clicksSoFar;
      clicksleft = Math.max(clicksleft, 0);
    }

    board.points.object.attr({"text": "Clicks Left: " + String(clicksleft)});
    board.points.object.attr({"opacity":1});
    board.points.object.toFront();

    board.pressspacetext.object.attr({"text": "Press 'I' to review instructions." });
		board.pressspacetext.object.attr({"opacity": 1});
		board.pressspacetext.object.toFront();
		board.pressspacetext.object.attr({"font-weight": "bold"});

    if((coding.block == 0 && clicksSoFar == parameters.practicenumexploreclicks + 1) || (clicksSoFar == parameters.numexploreclicks + 1)){
      board.donebutton.object.toFront();
    }
  }

  function endExplore(){
    saveExploreClick();
    coding.explorephase = false;
    coding.showlastexplore = false;
    // coding.blockstarted = false;
    for(i=0; i<coding.numrows; i++){
      for(j=0; j<coding.numcols; j++){
        board.exploregrid[i][j].rectangle.object.attr({"stroke": "black"});
      }
    }

    
    
    hideExploreGrid();
    if(coding.block == 0){
      coding.pageno += 0.25;
      showInstructions();
    }
    else{
      console.log('endexplore hi');
      newTrial();
      console.log('endexplore hello');
    }
    
  }
  
  function hideExploreGrid(){
    for(i=0; i<coding.numrows; i++){
      for(j=0; j<coding.numcols; j++){
        board.exploregrid[i][j].rectangle.object.toBack();
        board.exploreobjimg[i][j].object.attr({'opacity': 0});
        board.exploreobjimg[i][j].object.toBack();
      }
    }
    board.donebutton.object.toBack();
    // board.cover.object.attr({"opacity": 0});
    // board.cover.object.toBack();
  }

  function generateExploreForcedClicks(){
    sdata.exploreforcedxlocs[coding.index] = new Array();
    sdata.exploreforcedylocs[coding.index] = new Array();
    isGoal = new Array();
    numlandmarks = sdata.cond_numlandmarks[coding.index];
    if(coding.block == 0){
      reps = 1;
    }
    else{
      reps = 16 / numlandmarks;
    }
    ids = [];
    for(i = 0; i < reps; i++){
      x = shuffle([... Array(numlandmarks).keys()]);
      trycount = 0;
      while(i > 0 && x[0] == ids[ids.length-1]){
        trycount += 1;
        x = shuffle([... Array(numlandmarks).keys()]);
        if(trycount > 1000){
          generateLandmarks();
          generateExploreForcedClicks();
          console.log('ERROR: generateExploreForcedClicks()');
          break;
        }
      }
      ids = ids.concat(x);
      console.log(x);
    }
    console.log(ids);
    for (i = 0; i < numlandmarks * reps; i++){
      sdata.exploreforcedxlocs[coding.index][i] = sdata.blocklandmarkxlocs[coding.block][coding.trial][ids[i]];
      sdata.exploreforcedylocs[coding.index][i] = sdata.blocklandmarkylocs[coding.block][coding.trial][ids[i]];
      isGoal[i] = false;
    }
    generateGoalAndStart();
    sdata.exploreforcedxlocs[coding.index][numlandmarks * reps] = sdata.blockgoalxlocs[coding.block][coding.trial];
    sdata.exploreforcedylocs[coding.index][numlandmarks * reps] = sdata.blockgoalylocs[coding.block][coding.trial];
    isGoal[numlandmarks * reps] = true;
    // reps = 1; //goal number of reps - 1 in newest version
    // ids = [];
    // for(i = 0; i < reps; i++){
    //   x = shuffle([... Array(parameters.numgoals).keys()]);
    //   while(i > 0 && x[0] == ids[ids.length-1]){
    //     x = shuffle([... Array(parameters.numgoals).keys()]);
    //   }
    //   ids = ids.concat(x);
    //   console.log(x);
    //   console.log('hi');
    // }
    // console.log(ids);
    // console.log(sdata.exploreforcedxlocs[coding.index].length + parameters.numgoals * reps);

    // currlength = sdata.exploreforcedxlocs[coding.index].length;
    // x = shuffle([... Array(currlength).keys()]);
    // x = x.slice(0, parameters.numgoals * reps);
    // x.sort(function(a, b){return a-b});
    // x.reverse();
    // console.log(x);
    // //shuffle an array of integers, pick the first few, then use these as the index in place of i
    // for (i = currlength; i < (currlength + parameters.numgoals * reps); i++){
    //   console.log(i);
    //   // sdata.exploreforcedxlocs[coding.index][x[i-currlength]] = sdata.blockgoalxlocs[coding.block][ids[i - currlength]];
    //   // sdata.exploreforcedylocs[coding.index][x[i-currlength]] = sdata.blockgoalylocs[coding.block][ids[i - currlength]];
    //   sdata.exploreforcedxlocs[coding.index].splice(x[i-currlength], 0, sdata.blockgoalxlocs[coding.block][ids[i - currlength]]);
    //   sdata.exploreforcedylocs[coding.index].splice(x[i-currlength], 0, sdata.blockgoalylocs[coding.block][ids[i - currlength]]);
    //   isGoal.splice(x[i-currlength], 0, true);
    //   console.log(sdata.exploreforcedxlocs);
    // }

    sdata.cond_exploreforcedxlocs[coding.index] = sdata.exploreforcedxlocs[coding.index].toString();
    sdata.cond_exploreforcedylocs[coding.index] = sdata.exploreforcedylocs[coding.index].toString();
    

  }
  
  function exploreClick(y, x){
    clicksSoFar = sdata.resp_explorexclicks[coding.index].length;
    // console.log("previous x" + sdata.resp_explorexclicks[coding.block].charAt(clicksSoFar - 1) + "previous y" + sdata.resp_exploreyclicks[coding.block].charAt(clicksSoFar - 1));
    if(coding.exploreanswering){
      if(sdata.cond_freeorforced[coding.index] == 1 && (clicksSoFar <= sdata.exploreforcedxlocs[coding.index].length - 1 && (x != sdata.exploreforcedxlocs[coding.index][clicksSoFar] || y != sdata.exploreforcedylocs[coding.index][clicksSoFar]))){
        console.log("desired x" + sdata.exploreforcedxlocs[coding.index][clicksSoFar] + "desired y" + sdata.exploreforcedylocs[coding.index][clicksSoFar]);
      }
      else if(clicksSoFar > 0 && (x == sdata.resp_explorexclicks[coding.index].charAt(clicksSoFar - 1) && y == sdata.resp_exploreyclicks[coding.index].charAt(clicksSoFar - 1))){
        // console.log("clicked x" + x + "clicked y" + y);
        // console.log("previous x" + sdata.resp_explorexclicks[coding.block].charAt(clicksSoFar - 1) + "previous y" + sdata.resp_exploreyclicks[coding.block].charAt(clicksSoFar - 1));
        // console.log("previous xs" + sdata.resp_ssexplorexclicks[coding.block]);
        // console.log("previous ys" + sdata.resp_exploreyclicks[coding.block]);
        console.log('reclick');
      }
      else if((coding.block == 0 && clicksSoFar > parameters.practicenumexploreclicks) || (clicksSoFar > parameters.numexploreclicks)){
        console.log('clicks exceeded');
      }
      else if ((((coding.block == 0 && clicksSoFar == parameters.practicenumexploreclicks) || (clicksSoFar == parameters.numexploreclicks))) && (x != sdata.blockgoalxlocs[coding.block][coding.trial] || y != sdata.blockgoalylocs[coding.block][coding.trial])){
        console.log('not the goal');
      }
      else{
        if(clicksSoFar > 0){
          hidex = sdata.resp_explorexclicks[coding.index].charAt(clicksSoFar - 1);
          hidey = sdata.resp_exploreyclicks[coding.index].charAt(clicksSoFar - 1);
          board.exploreobjimg[hidey][hidex].object.attr({"opacity":0});
          board.exploreobjimg[hidey][hidex].object.toBack();
          alreadyhidden[clicksSoFar - 1] = true;
          // board.exploregrid[hidey][hidex].rectangle.object.attr({'fill':'red', 'fill-opacity':0.3});
          // if((coding.block!=0 & clicksSoFar < parameters.practicenumexploreclicks) || clicksSoFar < parameters.numexploreclicks){
          //   board.exploregrid[hidey][hidex].rectangle.object.toFront();
          // }
          
        }
        

        coding.exploreanswering = false;
        sdata.resp_explorexclicks[coding.index] = String(sdata.resp_explorexclicks[coding.index].concat(x));
        sdata.resp_exploreyclicks[coding.index] = String(sdata.resp_exploreyclicks[coding.index].concat(y));
        
        board.exploreobjimg[y][x].object.attr({"opacity":1});
        board.exploreobjimg[y][x].object.toFront();
        coding.showlastexplore = true;

        saveExploreClick();
        clicksSoFar = sdata.resp_explorexclicks[coding.index].length;
        if (sdata.cond_freeorforced[coding.index] == 1){
          board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar - 1]][sdata.exploreforcedxlocs[coding.index][clicksSoFar - 1]].rectangle.object.attr({'stroke':'black'});
        }
        else if(clicksSoFar == parameters.numexploreclicks + 1 || (coding.block == 0 && clicksSoFar == parameters.practicenumexploreclicks + 1)){
          board.exploregrid[sdata.blockgoalylocs[coding.block][coding.trial]][sdata.blockgoalxlocs[coding.block][coding.trial]].rectangle.object.attr({'stroke':'black'});
        }
        setTimeout(function(){
          coding.exploreanswering = true;
          // if((clicksSoFar < sdata.exploreforcedxlocs[coding.index].length)){
          //   console.log(clicksSoFar);
          if(sdata.cond_freeorforced[coding.index] == 1 && (clicksSoFar < sdata.exploreforcedxlocs[coding.index].length)){
            if (!isGoal[clicksSoFar]){
              board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar]][sdata.exploreforcedxlocs[coding.index][clicksSoFar]].rectangle.object.attr({'stroke':'blue'});
              board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar]][sdata.exploreforcedxlocs[coding.index][clicksSoFar]].rectangle.object.toFront();
              if(sdata.cond_freeorforced[coding.index] == 0){
                board.trialinstructions.object.attr({"text":"Click on the squares to reveal the objects! \n You are allowed to re-click on squares you have already clicked on."});
              }
              else{
                board.trialinstructions.object.attr({"text":"Click on the squares highlighted blue to reveal the objects!"});
              }
            }
            else{
              board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar]][sdata.exploreforcedxlocs[coding.index][clicksSoFar]].rectangle.object.attr({'stroke':'yellow'});
              board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar]][sdata.exploreforcedxlocs[coding.index][clicksSoFar]].rectangle.object.toFront();
              board.trialinstructions.object.attr({"text":"This is your goal for the next trial! Click to reveal it."});
            }
          }
          else{
          //   board.exploregrid[sdata.exploreforcedylocs[coding.index][clicksSoFar]][sdata.exploreforcedxlocs[coding.index][clicksSoFar]].rectangle.object.toFront();
          // }

            if((coding.block == 0 && clicksSoFar == parameters.practicenumexploreclicks) || (clicksSoFar == parameters.numexploreclicks)){
              generateGoalAndStart();
              board.exploregrid[sdata.blockgoalylocs[coding.block][coding.trial]][sdata.blockgoalxlocs[coding.block][coding.trial]].rectangle.object.attr({'stroke':'yellow'});
              board.exploregrid[sdata.blockgoalylocs[coding.block][coding.trial]][sdata.blockgoalxlocs[coding.block][coding.trial]].rectangle.object.toFront();
              board.trialinstructions.object.attr({"text":"This is your goal for the next trial! Click to reveal it."});
            }
          }
          

          if((coding.block == 0 && clicksSoFar == parameters.practicenumexploreclicks + 1) || (clicksSoFar == parameters.numexploreclicks + 1)){
            board.donebutton.object.toFront();
          }
        }, 500);
        timeoutclicksofar = clicksSoFar;
        setTimeout(function(timeoutclicksofar){ 
          console.log('timeoutclicksofar: ' + timeoutclicksofar);
          console.log(clicksSoFar);
          if(timeoutclicksofar == clicksSoFar){
            board.exploreobjimg[y][x].object.toBack();
            board.exploreobjimg[y][x].object.attr({"opacity":0});
          }
          coding.showlastexplore = false;
        }.bind(null, timeoutclicksofar), 3000);

        console.log('clicked '+ x + 'and ' + y);
        
        
        
        coding.reward += coding.explorecost;
        

        if(coding.block == 0){
          clicksleft = parameters.practicenumexploreclicks - clicksSoFar;
          clicksleft = Math.max(clicksleft, 0);
        }
        else{
          clicksleft = parameters.numexploreclicks - clicksSoFar;
          clicksleft = Math.max(clicksleft, 0);
        }

        board.points.object.attr({"text": "Clicks Left: " + String(clicksleft)});
        

      }

      

    }
    
    
  }

  function updateExploreImages(){
    for(i=0; i<coding.numrows; i++){
      for(j=0; j<coding.numcols; j++){
        delete(board.exploreobjimg[i][j].object);
        board.exploreobjimg[i][j].object = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][j][i] + ".jpg", board.exploreobjimg[i][j].rect);;
        console.log('hi');
        board.exploreobjimg[i][j].object.attr({"opacity":0});
        board.exploreobjimg[i][j].object.toBack()
      }
    }
  }

  function preUpdateExploreImages(){
    if(coding.block == 0){
      block = 1;
      trial = 0;
    }
    else if(coding.trial == parameters.nb_trials-1){
      block = coding.block + 1;
      trial = 0;
    }
    else{
      block = coding.block;
      trial = coding.trial + 1;
    }
    for(i=0; i<coding.numrows; i++){
      for(j=0; j<coding.numcols; j++){
        delete(board.exploreobjimg[i][j].object);
        board.exploreobjimg[i][j].object = drawImage(board.paper.object, "img/object_" + board.objectimg[block][trial][j][i] + ".jpg", board.exploreobjimg[i][j].rect);;
        console.log('hi');
        board.exploreobjimg[i][j].object.attr({"opacity":0});
        board.exploreobjimg[i][j].object.toBack()
      }
    }
  }

  function saveExploreClick() {
    var resp_exptimestamp = getTimestamp();
    var resp_exprt      = getSecs(coding.timestamp);

    sdata.resp_exploretimestamp[coding.index] =       String(sdata.resp_exploretimestamp[coding.index].concat(resp_exptimestamp + ","));
    sdata.resp_explorereactiontime[coding.index] =       String(sdata.resp_explorereactiontime[coding.index].concat(resp_exprt + ","));
    // disp(sdata.resp_timestamp);
    // disp(sdata.resp_reactiontime);
    coding.timestamp = resp_exptimestamp; 
  }