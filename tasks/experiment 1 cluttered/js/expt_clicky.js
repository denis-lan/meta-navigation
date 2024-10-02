function bringClickysToFront(){
    board.uparrow.object.toFront();
    board.downarrow.object.toFront();
    board.leftarrow.object.toFront();
    board.rightarrow.object.toFront();

    blockno = coding.block;
    trialno = coding.trial;

    for(i = 0; i < 4; i++){
        direction = adjObjects[i];
        if(direction == 1 && x > 0){
            board.clickimg[i][x-1][y].object[blockno][trialno].attr({"opacity":1});
            board.clickimg[i][x-1][y].object[blockno][trialno].toFront();
            board.clickimg[i][x-1][y].object[blockno][trialno].node.onclick = function(){handleResponse('Left',1,'o')};
        }
        else if(direction == 2 && x < coding.numrows-1){
            board.clickimg[i][x+1][y].object[blockno][trialno].attr({"opacity":1});
            board.clickimg[i][x+1][y].object[blockno][trialno].toFront();
            board.clickimg[i][x+1][y].object[blockno][trialno].node.onclick = function(){handleResponse('Right',2,'o')};
        }
        else if(direction == 3 && y > 0){
            board.clickimg[i][x][y-1].object[blockno][trialno].attr({"opacity":1});
            board.clickimg[i][x][y-1].object[blockno][trialno].toFront();
            board.clickimg[i][x][y-1].object[blockno][trialno].node.onclick = function(){handleResponse('Up',3,'o')};
        }
        else if(direction == 4 && y < coding.numrows-1){
            board.clickimg[i][x][y+1].object[blockno][trialno].attr({"opacity":1});
            board.clickimg[i][x][y+1].object[blockno][trialno].toFront();
            board.clickimg[i][x][y+1].object[blockno][trialno].node.onclick = function(){handleResponse('Down',4,'o')};
        }
        
    }

    board.points.object.attr({"text": "Points: " + coding.reward});
    console.log('clicku points');
	board.points.object.attr({"opacity": 1});
    board.points.object.toFront();
}

function swapClickyPlaces(){
    width = board.clickimg[0][0][0].object[coding.block][coding.trial].attrs.width;
    height = board.clickimg[0][0][0].object[coding.block][coding.trial].attrs.height;
    if(board.upclick.rectangle.object.attrs.x < board.paper.centre[0]){
        //swap arrows from left to right
        board.trialinstructions1.object.attr({"text": "Click on an object to move to \n that object..."});
        board.trialinstructions2.object.attr({"text": "or click on an arrow to take a step \n in the arrow's direction."});
        board.upclick.rectangle.object.attr({"x": board.upclick.rectangle.object.attrs.x + board.paper.width*0.7});
        board.downclick.rectangle.object.attr({"x": board.downclick.rectangle.object.attrs.x + board.paper.width*0.7});
        board.leftclick.rectangle.object.attr({"x": board.leftclick.rectangle.object.attrs.x + board.paper.width*0.7});
        board.rightclick.rectangle.object.attr({"x": board.rightclick.rectangle.object.attrs.x + board.paper.width*0.7});

        board.uparrow.object.attr({"y": board.uparrow.object.attrs.y + board.paper.width*0.7});
        board.downarrow.object.attr({"y": board.downarrow.object.attrs.y - board.paper.width*0.7});
        board.leftarrow.object.attr({"x": board.leftarrow.object.attrs.x - board.paper.width*0.7});
        board.rightarrow.object.attr({"x": board.rightarrow.object.attrs.x + board.paper.width*0.7});

        for(i=0; i<row; i++){
            for(j=0; j<col; j++){
                board.objectgrid[i][j].rectangle.object.attr({"x": board.objectgrid[i][j].rectangle.object.attrs.x - board.paper.width*0.7});

                for (xobj = 0; xobj < coding.numrows; xobj++){
                    for (yobj = 0; yobj < coding.numcols; yobj++){
                        board.clickimg[i+j*2][xobj][yobj].rect = [board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.x - board.paper.width*0.7,board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.y,width,height];
                        board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attr({"x": board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.x - board.paper.width*0.7});
                    }
                }
            }
                    

        }
    }
    else{
        // move arrows from right to left

        board.trialinstructions1.object.attr({"text": "Click on an arrow to take a step \n in the arrow's direction..."});
        board.trialinstructions2.object.attr({"text": "or click on an object to move to \n that object."});

        board.upclick.rectangle.object.attr({"x": board.upclick.rectangle.object.attrs.x - board.paper.width*0.7});
        board.downclick.rectangle.object.attr({"x": board.downclick.rectangle.object.attrs.x - board.paper.width*0.7});
        board.leftclick.rectangle.object.attr({"x": board.leftclick.rectangle.object.attrs.x - board.paper.width*0.7});
        board.rightclick.rectangle.object.attr({"x": board.rightclick.rectangle.object.attrs.x - board.paper.width*0.7});

        board.uparrow.object.attr({"y": board.uparrow.object.attrs.y - board.paper.width*0.7});
        board.downarrow.object.attr({"y": board.downarrow.object.attrs.y + board.paper.width*0.7});
        board.leftarrow.object.attr({"x": board.leftarrow.object.attrs.x + board.paper.width*0.7});
        board.rightarrow.object.attr({"x": board.rightarrow.object.attrs.x - board.paper.width*0.7});

        for(i=0; i<row; i++){
            for(j=0; j<col; j++){
                board.objectgrid[i][j].rectangle.object.attr({"x": board.objectgrid[i][j].rectangle.object.attrs.x + board.paper.width*0.7});

                for (xobj = 0; xobj < coding.numrows; xobj++){
                    for (yobj = 0; yobj < coding.numcols; yobj++){
                        board.clickimg[i+j*2][xobj][yobj].rect = [board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.x + board.paper.width*0.7,board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.y,width,height];
                        board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attr({"x": board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attrs.x + board.paper.width*0.7});
                    }
                }
            }

        }

    }
    

}
function generateClickArrows(width, height) {

    row = 3;
    col = 3;
  
    //newcol = col * 2 + 1; //for two rooms version of task
    newcol = col;
  
    board.arrowgrid = new Array(row);
    
  
    var x;
    var y = board.paper.centre[1] - height * 1.5;
    for(i=0; i<row; i++){
  
      board.arrowgrid[i] = new Array(newcol);
      
      x = board.paper.centre[0] - board.paper.width*0.35 - (width * newcol / 2);
      for(j=0; j<col; j++){
        board.grid[i][j] = {};
        board.grid[i][j].rectangle = {};
  
        // UP SQUARE
        if (i == 0 && j == 1){
          board.upclick = {};
          board.upclick.rectangle = {};
          board.upclick.rectangle.rect   = [x,y,width,height];
          board.upclick.rectangle.object = drawRect(board.paper.object,board.upclick.rectangle.rect);
          board.upclick.rectangle.object.attr({"stroke-width":5});
          // board.up.rectangle.object.attr({"fill": "grey"});
          
          board.uparrow = [];
          board.uparrow.rect = [x+5,y+5,width-10,height-10];
          board.uparrow.object = drawImage(board.paper.object, "img/arrow.png", board.uparrow.rect);
          board.uparrow.object.rotate(270);
          board.uparrow.object.toFront();
          board.uparrow.object.node.onclick = function(){handleUp()};
        }
  
        // LEFT SQUARE
        if (i == 1 && j == 0){
          board.leftclick = {};
          board.leftclick.rectangle = {};
          board.leftclick.rectangle.rect   = [x,y,width,height];
          board.leftclick.rectangle.object = drawRect(board.paper.object,board.leftclick.rectangle.rect);
          board.leftclick.rectangle.object.attr({"stroke-width":5});
          // board.left.rectangle.object.attr({"fill": "grey"});
          
          board.leftarrow = [];
          board.leftarrow.rect = [x+5,y+5,width-10,height-10];
          board.leftarrow.object = drawImage(board.paper.object, "img/arrow.png", board.leftarrow.rect);
          board.leftarrow.object.rotate(180);
          board.leftarrow.object.toFront();
          board.leftarrow.object.node.onclick = function(){handleLeft()};
        }
  
        // CURRENT SQUARE
        // if (i == 1 && j == 1){
        //   board.current = {};
        //   board.current.rectangle = {};
        //   board.current.rectangle.rect   = [x,y,width,height];
        //   board.current.rectangle.object = drawRect(board.paper.object,board.current.rectangle.rect);
        //   board.current.rectangle.object.attr({"stroke-width":10});
        // }
  
        // RIGHT SQUARE
        if (i == 1 && j == 2){
          board.rightclick = {};
          board.rightclick.rectangle = {};
          board.rightclick.rectangle.rect   = [x,y,width,height];
          board.rightclick.rectangle.object = drawRect(board.paper.object,board.rightclick.rectangle.rect);
          board.rightclick.rectangle.object.attr({"stroke-width":5});
          // board.right.rectangle.object.attr({"fill": "grey"});
          
          board.rightarrow = [];
          board.rightarrow.rect = [x+5,y+5,width-10,height-10];
          board.rightarrow.object = drawImage(board.paper.object, "img/arrow.png", board.rightarrow.rect);
          board.rightarrow.object.toFront();
          board.rightarrow.object.node.onclick = function(){handleRight(); console.log('rightclicked')};
          
        }
  
        // DOWN SQUARE
        if (i == 2 && j == 1){
          board.downclick = {};
          board.downclick.rectangle = {};
          board.downclick.rectangle.rect   = [x,y,width,height];
          board.downclick.rectangle.object = drawRect(board.paper.object,board.downclick.rectangle.rect);
          board.downclick.rectangle.object.attr({"stroke-width":5});
          // board.down.rectangle.object.attr({"fill": "grey"});
          
          board.downarrow = [];
          board.downarrow.rect = [x+5,y+5,width-10,height-10];
          board.downarrow.object = drawImage(board.paper.object, "img/arrow.png", board.downarrow.rect);
          board.downarrow.object.attr({'fill':'unstable'});
          board.downarrow.object.rotate(90);
          board.downarrow.object.toFront();
          board.downarrow.object.node.onclick = function(){handleDown()};
        }
  
        x = x + width;
      }
      y = y + height;
  
      
    }
    
    // if(!parameters.showarrows){
    //   board.downarrow.object.attr({"opacity": 0});
    //   board.uparrow.object.attr({"opacity": 0});
    //   board.leftarrow.object.attr({"opacity": 0});
    //   board.rightarrow.object.attr({"opacity": 0});
    // }

  }


  function generateClickObjects(width, height) {

    row = 2;
    col = 2;
  
    newcol = col;
  
    board.objectgrid = new Array(row);
    
  
    var x;
    var y = board.paper.centre[1] - height;
    board.clickimg = new Array(row*col);
    for(i=0; i<row; i++){
  
      board.objectgrid[i] = new Array(newcol);
      
      x = board.paper.centre[0] + board.paper.width*0.35 - (width * newcol / 2);
      for(j=0; j<col; j++){
        board.objectgrid[i][j] = {};
        board.objectgrid[i][j].rectangle = {};
        board.objectgrid[i][j].rectangle.rect   = [x,y,width,height];
        board.objectgrid[i][j].rectangle.object = drawRect(board.paper.object, board.objectgrid[i][j].rectangle.rect);
        board.objectgrid[i][j].rectangle.object.attr({"stroke-width":5, "fill": 'white', "fill-opacity": 0});

        board.clickimg[i+j*2]= new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
            board.clickimg[i+j*2][xobj] = new Array(newcol);
            for (yobj = 0; yobj < coding.numcols; yobj++){
                board.clickimg[i+j*2][xobj][yobj] = {};
                board.clickimg[i+j*2][xobj][yobj].rect = [x+5,y+5,width-10,height-10];
                board.clickimg[i+j*2][xobj][yobj].object = new Array(parameters.nb_blocks);
                for(jj = 0; jj < parameters.nb_blocks; jj++){
                    board.clickimg[i+j*2][xobj][yobj].object[jj] = new Array(parameters.nb_trials);
                }
                board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.clickimg[i+j*2][xobj][yobj].rect);
                board.clickimg[i+j*2][xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
            }
        }

  
  
        x = x + width;
      }
      y = y + height;
  
      
    }
  }

  function clearClickObjects(){

    for (i = 0; i < 4; i++){

        for (xobj = 0; xobj < coding.numrows; xobj++){
            for (yobj = 0; yobj < coding.numcols; yobj++){
                board.clickimg[i][xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
                board.clickimg[i][xobj][yobj].object[coding.block][coding.trial].node.onclick = function(){};
                //board.clickimg[i][blockno][xobj][yobj].object.toBack();
            }
        }
    }
            

    
  }


  function updateClickObjects(){
    clearClickObjects();
    x = coding.xloc;
    y = coding.yloc;
    blockno = coding.block;
    trialno = coding.trial;
    adjObjects = [1, 2, 3, 4];
    adjObjects = shuffle(adjObjects);

    if(coding.stepactioncondition == 'vonly'){
        board.objectgrid[0][0].rectangle.object.attr({'stroke': 'grey'});
        board.objectgrid[0][1].rectangle.object.attr({'stroke': 'grey'});
        board.objectgrid[1][0].rectangle.object.attr({'stroke': 'grey'});
        board.objectgrid[1][1].rectangle.object.attr({'stroke': 'grey'});
    }
    else{
        board.objectgrid[0][0].rectangle.object.attr({'stroke': 'black'});
        board.objectgrid[0][1].rectangle.object.attr({'stroke': 'black'});
        board.objectgrid[1][0].rectangle.object.attr({'stroke': 'black'});
        board.objectgrid[1][1].rectangle.object.attr({'stroke': 'black'});
    }

    for(i = 0; i < 4; i++){
        direction = adjObjects[i];
        if(direction == 1 && x > 0){
            if(coding.stepactioncondition == 'vonly'){
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].attr({"opacity":0.5});
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].node.onclick = function(){};
            }
            else{
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].attr({"opacity":1});
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x-1][y].object[coding.block][coding.trial].node.onclick = function(){handleResponse('Left',1,'o')};
            }
        }
        else if(direction == 2 && x < coding.numrows-1){
            if(coding.stepactioncondition == 'vonly'){
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].attr({"opacity":0.5});
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].node.onclick = function(){};
            }
            else{
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].attr({"opacity":1});
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x+1][y].object[coding.block][coding.trial].node.onclick = function(){handleResponse('Right',2,'o')};
            }
        }
        else if(direction == 3 && y > 0){
            if(coding.stepactioncondition == 'vonly'){
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].attr({"opacity":0.5});
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].node.onclick = function(){};
            }
            else{
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].attr({"opacity":1});
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x][y-1].object[coding.block][coding.trial].node.onclick = function(){handleResponse('Up',3,'o')};
            }
        }
        else if(direction == 4 && y < coding.numrows-1){
            if(coding.stepactioncondition == 'vonly'){
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].attr({"opacity":0.5});
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].node.onclick = function(){};
            }
            else{
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].attr({"opacity":1});
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].toFront();
                board.clickimg[i][x][y+1].object[coding.block][coding.trial].node.onclick = function(){handleResponse('Down',4,'o')};
            }
        }
        
    }
  }

  function checkTrialCondition(){
    //random number between 0 and 1
    
    if(coding.block == 0){
        console.log(sdata.resp_validkeypresses[coding.index].length);
        // length of string

        if (sdata.resp_validkeypresses[coding.index].length == 0){
            coding.stepactioncondition = 'tonly';
        }
        else if(sdata.resp_validkeypresses[coding.index].length == 1){
            coding.stepactioncondition = 'vonly';
        }
        else{
            coding.stepactioncondition = sdata.cond_blockactionconditions[coding.block];
        }
    }

    else if (sdata.cond_blockactionconditions[coding.block] != 'random'){
        coding.stepactioncondition = sdata.cond_blockactionconditions[coding.block];
    }
    else{
        var rand = Math.random();
        if(rand < 0.5){
            coding.stepactioncondition = 'tonly';
        }
        else{
            coding.stepactioncondition = 'vonly';
        }
    }

    if (coding.stepactioncondition == 'both'){
        if(board.upclick.rectangle.object.attrs.x > board.paper.centre[0]){
            board.trialinstructions1.object.attr({"text": "Click on an object to move to \n that object..."});
            board.trialinstructions2.object.attr({"text": "or click on an arrow to take a step \n in the arrow's direction."});
        }
        else{
            board.trialinstructions1.object.attr({"text": "Click on an arrow to take a step \n in the arrow's direction..."});
            board.trialinstructions2.object.attr({"text": "or click on an object to move to \n that object."});
        }
        
    }
    else if (coding.stepactioncondition == 'tonly'){
        if(board.upclick.rectangle.object.attrs.x > board.paper.centre[0]){
            board.trialinstructions1.object.attr({"text": "Click on an object to move to \n that object."});
            board.trialinstructions2.object.attr({"text": "(Arrows are currently disabled)"});
        }
        else{
            board.trialinstructions1.object.attr({"text": "(Arrows are currently disabled)"});
            board.trialinstructions2.object.attr({"text": "Click on an object to move to \n that object."});
        }
    }
    else if (coding.stepactioncondition == 'vonly'){
        if(board.upclick.rectangle.object.attrs.x > board.paper.centre[0]){
            board.trialinstructions1.object.attr({"text": "(Objects are currently disabled)"});
            board.trialinstructions2.object.attr({"text": "Click on an arrow to take a step \n in the arrow's direction."});
        }
        else{
            board.trialinstructions1.object.attr({"text": "Click on an arrow to take a step \n in the arrow's direction."});
            board.trialinstructions2.object.attr({"text": "(Objects are currently disabled)"});
        }
    }
    else{
        console.log('error in checkTrialCondition');
    }

    //concatenate with first letter of step action condition
    sdata.cond_trialactionconditions[coding.index] = sdata.cond_trialactionconditions[coding.index].concat(coding.stepactioncondition[0]);
  }