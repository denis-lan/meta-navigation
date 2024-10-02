function randomiseObjects(){
  //totObjs = coding.numrows * coding.numcols;

  totObjs = 4570;

  // only select odd numbers
  randomList = Array(totObjs).fill(0).map((e,i)=>i+1).filter(e => e % 2 == 1).sort(() => Math.random() - 0.5); //array of 1 to totObjs in random order
  // randomList = Array(totObjs).fill(0).map((e,i)=>i+1).sort(() => Math.random() - 0.5);; //array of 1 to totObjs in random order

  i = 0;
  for (blockno = 0; blockno < parameters.nb_blocks; blockno ++){
    board.objectimg[blockno] = new Array (parameters.nb_trials);
    for (trialno = 0; trialno < parameters.nb_trials; trialno ++){
      board.objectimg[blockno][trialno] = new Array (coding.numrows);
      for(xobj = 0; xobj < coding.numrows; xobj++){
        board.objectimg[blockno][trialno][xobj] = new Array (coding.numcols);
        for(yobj = 0; yobj < coding.numcols; yobj++){
          //board.objectimg[xobj][yobj] = ('0' + randomList[number]).slice(-2);
          if(xobj == 0 | xobj == coding.numrows - 1 | yobj == 0 | yobj == coding.numcols - 1){
            board.objectimg[blockno][trialno][xobj][yobj] = 9998;
          }
          else{
            board.objectimg[blockno][trialno][xobj][yobj] = randomList[i];
            i++;
          }  
          //console.log(board.objectimg[xobj][yobj]);
        }
      }
    }
  }
  sdata.cond_objectimgs = board.objectimg;
}



function generateGrid(width, height, row, col) {
  //newcol = col * 2 + 1; //for two rooms version of task
  newcol = col;

  board.grid = new Array(row);
  board.gridcontent = new Array(row);
  board.characterimg = new Array(row);
  board.obj = new Array(row);
  board.upimg = new Array(parameters.nb_blocks);
  board.downimg = new Array(parameters.nb_blocks);
  board.leftimg = new Array(parameters.nb_blocks);
  board.rightimg = new Array(parameters.nb_blocks);
  board.currentimg = new Array(parameters.nb_blocks);
  board.objectimg = new Array(parameters.nb_blocks);
  board.actionindicator = new Array(5);
  board.lastactionindicator = new Array(5);
  randomiseObjects();

  var x;
  var y = board.paper.centre[1] - height * 1.5;
  for(i=0; i<row; i++){

    board.grid[i] = new Array(newcol);
    board.gridcontent[i] = new Array(newcol);
    board.characterimg[i] = new Array(newcol);
    board.obj[i] = new Array(newcol);
   
    x = board.paper.centre[0] - (width * newcol / 2);
    for(j=0; j<col; j++){
      board.grid[i][j] = {};
      board.grid[i][j].rectangle = {};

      // UP SQUARE
      if (i == 0 && j == 1){
        board.up = {};
        board.up.rectangle = {};
        board.up.rectangle.rect   = [x,y,width,height];
        board.up.rectangle.object = drawRect(board.paper.object,board.up.rectangle.rect);
        board.up.rectangle.object.attr({"stroke-width":5});
        // board.up.rectangle.object.attr({"fill": "grey"});
        
        // board.uparrow = [];
        // board.uparrow.rect = [x+5,y+5,width-10,height-10];
        // board.uparrow.object = drawImage(board.paper.object, "img/arrow.png", board.uparrow.rect);
        // board.uparrow.object.rotate(270);

        
        board.actionindicator[3] = [];
        board.actionindicator[3].rect = [x+5,y+5,width-10,height-10];
        for(z = 0; z < 3; z++){
          board.actionindicator[3][z] = [];
          board.actionindicator[3][z].object = drawImage(board.paper.object, "img/actionindicator_" + sdata.landmarkcolours[z] + ".png", board.actionindicator[3].rect);
          board.actionindicator[3][z].object.rotate(270);
          board.actionindicator[3][z].object.attr({"opacity":0});
        }
        


        board.upimg = new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
          board.upimg[xobj] = new Array(newcol);
          for (yobj = 0; yobj < coding.numcols; yobj++){
            board.upimg[xobj][yobj] = {};
            board.upimg[xobj][yobj].rect = [x+5,y+5,width-10,height-10];
            board.upimg[xobj][yobj].object = new Array(parameters.nb_blocks);
            for(jj = 0; jj < parameters.nb_blocks; jj++){
              board.upimg[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
            }
            board.upimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.upimg[xobj][yobj].rect);
            board.upimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
          }
        }
          
      }

      // LEFT SQUARE
      if (i == 1 && j == 0){
        board.left = {};
        board.left.rectangle = {};
        board.left.rectangle.rect   = [x,y,width,height];
        board.left.rectangle.object = drawRect(board.paper.object,board.left.rectangle.rect);
        board.left.rectangle.object.attr({"stroke-width":5});
        // board.left.rectangle.object.attr({"fill": "grey"});
        
        // board.leftarrow = [];
        // board.leftarrow.rect = [x+5,y+5,width-10,height-10];
        // board.leftarrow.object = drawImage(board.paper.object, "img/arrow.png", board.leftarrow.rect);
        // board.leftarrow.object.rotate(180);

        board.actionindicator[1] = [];
        board.actionindicator[1].rect = [x+5,y+5,width-10,height-10];
        for(z = 0; z < 3; z++){
          board.actionindicator[1][z] = [];
          board.actionindicator[1][z].object = drawImage(board.paper.object, "img/actionindicator_" + sdata.landmarkcolours[z] + ".png", board.actionindicator[1].rect);
          board.actionindicator[1][z].object.rotate(180);
          board.actionindicator[1][z].object.attr({"opacity":0});
        }


        board.leftimg = new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
          board.leftimg[xobj] = new Array(newcol);
          for (yobj = 0; yobj < coding.numcols; yobj++){
            board.leftimg[xobj][yobj] = {};
            board.leftimg[xobj][yobj].rect = [x+5,y+5,width-10,height-10];
            board.leftimg[xobj][yobj].object = new Array(parameters.nb_blocks);
            for(jj = 0; jj < parameters.nb_blocks; jj++){
              board.leftimg[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
            }
            board.leftimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.leftimg[xobj][yobj].rect);
            board.leftimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
          }
        }
          
      }

      // CURRENT SQUARE
      if (i == 1 && j == 1){
        board.current = {};
        board.current.rectangle = {};
        board.current.rectangle.rect   = [x,y,width,height];
        board.current.rectangle.object = drawRect(board.paper.object,board.current.rectangle.rect);
        board.current.rectangle.object.attr({"stroke-width":10});
        
        //TO DO: add colours to action indicator

        rotationAngles = [180, 0, 270, 90];

        for(action = 1; action <= 4; action++){
          board.lastactionindicator[action] = [];
          board.lastactionindicator[action].rect = [x+5,y+5,width-10,height-10];
          for (colour = 0; colour <= 2; colour++){
            board.lastactionindicator[action][colour] = [];
            board.lastactionindicator[action][colour].object = drawImage(board.paper.object, "img/actionindicator_" + sdata.landmarkcolours[colour] + ".png", board.lastactionindicator[action].rect);
            board.lastactionindicator[action][colour].object.rotate(rotationAngles[action-1]);
            board.lastactionindicator[action][colour].object.attr({"opacity":0}); 
          }
        }
        
        // board.lastactionindicator[1].object = drawImage(board.paper.object, "img/actionindicator.png", board.lastactionindicator[1].rect);
        // board.lastactionindicator[1].object.rotate(180);
        // board.lastactionindicator[1].object.attr({"opacity":0});

        // board.lastactionindicator[2] = [];
        // board.lastactionindicator[2].rect = [x+5,y+5,width-10,height-10];
        // board.lastactionindicator[2].object = drawImage(board.paper.object, "img/actionindicator.png", board.lastactionindicator[2].rect);
        // board.lastactionindicator[2].object.attr({"opacity":0});

        // board.lastactionindicator[3] = [];
        // board.lastactionindicator[3].rect = [x+5,y+5,width-10,height-10];
        // board.lastactionindicator[3].object = drawImage(board.paper.object, "img/actionindicator.png", board.lastactionindicator[3].rect);
        // board.lastactionindicator[3].object.rotate(270);
        // board.lastactionindicator[3].object.attr({"opacity":0});

        // board.lastactionindicator[4] = [];
        // board.lastactionindicator[4].rect = [x+5,y+5,width-10,height-10];
        // board.lastactionindicator[4].object = drawImage(board.paper.object, "img/actionindicator.png", board.lastactionindicator[4].rect);
        // board.lastactionindicator[4].object.rotate(90);
        // board.lastactionindicator[4].object.attr({"opacity":0});


        board.currentimg = new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
          board.currentimg[xobj] = new Array(newcol);
          for (yobj = 0; yobj < coding.numcols; yobj++){
            board.currentimg[xobj][yobj] = {};
            board.currentimg[xobj][yobj].rect = [x+5,y+5,width-10,height-10];
            board.currentimg[xobj][yobj].object = new Array(parameters.nb_blocks);
            for(jj = 0; jj < parameters.nb_blocks; jj++){
              board.currentimg[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
            }
            board.currentimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.currentimg[xobj][yobj].rect);
            board.currentimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
          }
        }
          
      }

      // RIGHT SQUARE
      if (i == 1 && j == 2){
        board.right = {};
        board.right.rectangle = {};
        board.right.rectangle.rect   = [x,y,width,height];
        board.right.rectangle.object = drawRect(board.paper.object,board.right.rectangle.rect);
        board.right.rectangle.object.attr({"stroke-width":5});
        // board.right.rectangle.object.attr({"fill": "grey"});
        
        // board.rightarrow = [];
        // board.rightarrow.rect = [x+5,y+5,width-10,height-10];
        // board.rightarrow.object = drawImage(board.paper.object, "img/arrow.png", board.rightarrow.rect);

        board.actionindicator[2] = [];
        board.actionindicator[2].rect = [x+5,y+5,width-10,height-10];
        for(z = 0; z < 3; z++){
          board.actionindicator[2][z] = [];
          board.actionindicator[2][z].object = drawImage(board.paper.object, "img/actionindicator_" + sdata.landmarkcolours[z] + ".png", board.actionindicator[2].rect);
          board.actionindicator[2][z].object.attr({"opacity":0});
        }


        board.rightimg = new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
          board.rightimg[xobj] = new Array(newcol);
          for (yobj = 0; yobj < coding.numcols; yobj++){
            board.rightimg[xobj][yobj] = {};
            board.rightimg[xobj][yobj].rect = [x+5,y+5,width-10,height-10];
            board.rightimg[xobj][yobj].object = new Array(parameters.nb_blocks);
            for(jj = 0; jj < parameters.nb_blocks; jj++){
              board.rightimg[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
            }
            board.rightimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.rightimg[xobj][yobj].rect);
            board.rightimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
          }
        }
0
      }

      // DOWN SQUARE
      if (i == 2 && j == 1){
        board.down = {};
        board.down.rectangle = {};
        board.down.rectangle.rect   = [x,y,width,height];
        board.down.rectangle.object = drawRect(board.paper.object,board.down.rectangle.rect);
        board.down.rectangle.object.attr({"stroke-width":5});
        // board.down.rectangle.object.attr({"fill": "grey"});
        
        // board.downarrow = [];
        // board.downarrow.rect = [x+5,y+5,width-10,height-10];
        // board.downarrow.object = drawImage(board.paper.object, "img/arrow.png", board.downarrow.rect);
        // board.downarrow.object.attr({'fill':'unstable'});
        // board.downarrow.object.rotate(90);

        board.actionindicator[4] = [];
        board.actionindicator[4].rect = [x+5,y+5,width-10,height-10];
        for(z = 0; z < 3; z++){
          board.actionindicator[4][z] = [];
          board.actionindicator[4][z].object = drawImage(board.paper.object, "img/actionindicator_" + sdata.landmarkcolours[z] + ".png", board.actionindicator[4].rect);
          board.actionindicator[4][z].object.rotate(90);
          board.actionindicator[4][z].object.attr({"opacity":0});
        }


        board.downimg = new Array(coding.numrows);
        for (xobj = 0; xobj < coding.numrows; xobj++){
          board.downimg[xobj] = new Array(newcol);
          for (yobj = 0; yobj < coding.numcols; yobj++){
            board.downimg[xobj][yobj] = {};
            board.downimg[xobj][yobj].rect = [x+5,y+5,width-10,height-10];
            board.downimg[xobj][yobj].object = new Array(parameters.nb_blocks);
            for(jj = 0; jj < parameters.nb_blocks; jj++){
              board.downimg[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
            }
            board.downimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.downimg[xobj][yobj].rect);
            board.downimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
          }
        }
          
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

  board.goaltext = {};
  board.goaltext.text   = "GOAL:";
  board.goaltext.centre = [board.paper.centre[0]-60, board.paper.centre[1]*0.1];
  board.goaltext.object = drawText(board.paper.object,board.goaltext.centre, board.goaltext.text);
  board.goaltext.object.attr({"font-size": 30});
  board.goaltext.object.attr({"text-anchor": "left"});
  board.goaltext.object.attr({"opacity": 0});


  
  board.goalobj = new Array (coding.numrows);
  for(xobj = 0; xobj < coding.numrows; xobj++){
    board.goalobj[xobj] = new Array(coding.numcols);
    for(yobj = 0; yobj < coding.numcols; yobj++){
      board.goalobj[xobj][yobj] = {}
      board.goalobj[xobj][yobj].rect = [board.paper.centre[0], board.paper.centre[1]*0.1-35, 70, 70];
      board.goalobj[xobj][yobj].object = new Array(parameters.nb_blocks);
      for(jj = 0; jj < parameters.nb_blocks; jj++){
        board.goalobj[xobj][yobj].object[jj] = new Array(parameters.nb_trials);
      }
      board.goalobj[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[0][0][xobj][yobj] + ".jpg", board.goalobj[xobj][yobj].rect);
      board.goalobj[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
    }
    
  
  }
  board.current.rectangle.object.toFront();
  //board.gridcontent[coding.xloc][coding.yloc].object.attr({"text": "X"});

  /*for(i=0; i<row; i++){
    if(i != Math.floor(row/2)){
      board.grid[i][col].rectangle.object.attr({"opacity":0});
      board.grid[i][col].ispassable = false;
    }
    else{
      board.grid[i][col].rectangle.object.attr({"fill":"black"});
      board.grid[i][col].ispassable = false;
    }
  }*/
  generateLandmarks();
 //generateGoalAndStart();
  //updateImages();
  //updateArrows();

  
}

function clearOldImages(){
  clearClickObjects();
  for (xobj = 0; xobj < coding.numrows; xobj++){
    for (yobj = 0; yobj < coding.numcols; yobj++){
      board.upimg[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.upimg[xobj][yobj].object[coding.block][coding.trial]);

      board.downimg[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.downimg[xobj][yobj].object[coding.block][coding.trial]);

      board.leftimg[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.leftimg[xobj][yobj].object[coding.block][coding.trial]);

      board.rightimg[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.rightimg[xobj][yobj].object[coding.block][coding.trial]);

      board.currentimg[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.currentimg[xobj][yobj].object[coding.block][coding.trial]);

      board.goalobj[xobj][yobj].object[coding.block][coding.trial] = null;
      delete(board.goalobj[xobj][yobj].object[coding.block][coding.trial]);

      for(i=0; i<4; i++){
        board.clickimg[i][xobj][yobj].object[coding.block][coding.trial] = null;
        delete(board.clickimg[i][xobj][yobj].object[coding.block][coding.trial]);
      }
    }
  }
}

function updateTrialImages(){
  for (xobj = 0; xobj < coding.numrows; xobj++){
    for (yobj = 0; yobj < coding.numcols; yobj++){
      board.upimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.upimg[xobj][yobj].rect);
      board.upimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      
      board.downimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.downimg[xobj][yobj].rect);
      board.downimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      
      board.leftimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.leftimg[xobj][yobj].rect);
      board.leftimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
     
      board.rightimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.rightimg[xobj][yobj].rect);
      board.rightimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      
      board.currentimg[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.currentimg[xobj][yobj].rect);
      board.currentimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});

      board.goalobj[xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.goalobj[xobj][yobj].rect);
      board.goalobj[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});

      for(i=0; i<4; i++){
        board.clickimg[i][xobj][yobj].object[coding.block][coding.trial] = drawImage(board.paper.object, "img/object_" + board.objectimg[coding.block][coding.trial][xobj][yobj] + ".jpg", board.clickimg[i][xobj][yobj].rect);
        board.clickimg[i][xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      }
    }
  }
}

// function generateLandmarks(){

//   coding.landmarks = new Array(coding.numrows)
//   for (x=0; x<coding.numrows; x++){
//     coding.landmarks[x] = new Array(coding.numrows);
//     for (y=0; y<coding.numrows; y++){
//       coding.landmarks[x][y] = 0;
//     }
//   }

//   // // 1 - stable landmark; 2 - unstable landmark
//   // coding.stable1xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // coding.stable1yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // coding.landmarks[coding.stable1xloc][coding.stable1yloc] =  1;

//   // coding.stable2xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // coding.stable2yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;

//   // while(coding.landmarks[coding.stable2xloc][coding.stable2yloc] + coding.landmarks[coding.stable2xloc-1][coding.stable2yloc] + coding.landmarks[coding.stable2xloc+1][coding.stable2yloc] + coding.landmarks[coding.stable2xloc][coding.stable2yloc+1] + coding.landmarks[coding.stable2xloc][coding.stable2yloc-1]!= 0){
//   //   coding.stable2xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   //   coding.stable2yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // }
//   // coding.landmarks[coding.stable2xloc][coding.stable2yloc] =  1;

//   // coding.unstable1xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // coding.unstable1yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;

//   // while(coding.landmarks[coding.unstable1xloc][coding.unstable1yloc] + coding.landmarks[coding.unstable1xloc-1][coding.unstable1yloc] + coding.landmarks[coding.unstable1xloc+1][coding.unstable1yloc] + coding.landmarks[coding.unstable1xloc][coding.unstable1yloc+1] + coding.landmarks[coding.unstable1xloc][coding.unstable1yloc-1]!= 0){
//   //   coding.unstable1xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   //   coding.unstable1yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // }
//   // coding.landmarks[coding.unstable1xloc][coding.unstable1yloc] =  2;

//   // coding.unstable2xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // coding.unstable2yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // while(coding.landmarks[coding.unstable2xloc][coding.unstable2yloc] + coding.landmarks[coding.unstable2xloc-1][coding.unstable2yloc] + coding.landmarks[coding.unstable2xloc+1][coding.unstable2yloc] + coding.landmarks[coding.unstable2xloc][coding.unstable2yloc+1] + coding.landmarks[coding.unstable2xloc][coding.unstable2yloc-1]!= 0){
//   //   coding.unstable2xloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   //   coding.unstable2yloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
//   // }
//   // coding.landmarks[coding.unstable2xloc][coding.unstable2yloc] =  2;
// }



function generateNewGoal(){
// this function is only used for generating a new goal within a trial (when the participant reaches the goal before min steps)
  if (parameters.limitedges){
    coding.goalxloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
    coding.goalyloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
    while(coding.landmarks[coding.goalxloc][coding.goalyloc] != 0 && (goalorstart[coding.goalxloc][coding.goalyloc]!= 0 || abs(coding.goalxloc-coding.startingxloc) + abs(coding.goalyloc - coding.startingyloc) != parameters.pathlength)){
      coding.goalxloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
      coding.goalyloc = Math.floor(Math.random() * (coding.numrows-2)) + 1;
    }
    goalorstart[coding.goalxloc][coding.goalyloc] = 1;
    //console.log('new goal generated at ' + coding.goalxloc + ', ' + coding.goalyloc);
  }
  else{
    coding.goalxloc = Math.floor(Math.random() * (coding.numrows));
    coding.goalyloc = Math.floor(Math.random() * (coding.numrows));
    while(coding.landmarks[coding.goalxloc][coding.goalyloc] != 0 && (goalorstart[coding.goalxloc][coding.goalyloc]!= 0 || abs(coding.goalxloc-coding.startingxloc) + abs(coding.goalyloc - coding.startingyloc) != parameters.pathlength)){
      coding.goalxloc = Math.floor(Math.random() * (coding.numrows));
      coding.goalyloc = Math.floor(Math.random() * (coding.numrows));
    }
    goalorstart[coding.goalxloc][coding.goalyloc] = 1;
    //console.log('new goal generated at ' + coding.goalxloc + ', ' + coding.goalyloc);
  }
}

function generateLandmarks(){
  goalorstart = new Array(coding.numrows);
  for (i = 0; i < coding.numrows; i++){
    goalorstart[i] = Array(coding.numcols).fill(0);
  }
  sdata.blocklandmarkxlocs[coding.block][coding.trial] = new Array(sdata.cond_numlandmarks[coding.block]);
  sdata.blocklandmarkylocs[coding.block][coding.trial] = new Array(sdata.cond_numlandmarks[coding.block]);
  
  trycount = 0;
  for(i = 0; i < sdata.cond_numlandmarks[coding.index]; i++){
    candxloc = Math.floor(Math.random() * (coding.numrows-4))+2;
    candyloc = Math.floor(Math.random() * (coding.numrows-4))+2;
    while(goalorstart[candxloc][candyloc] !=0){
      trycount++;
      candxloc = Math.floor(Math.random() * (coding.numrows-4))+2;
      candyloc = Math.floor(Math.random() * (coding.numrows-4))+2;
      if(trycount > 1000){
        console.log('too many tries');
        generateLandmarks();
        break;
      }
    }
    sdata.blocklandmarkxlocs[coding.block][coding.trial][i] = candxloc;
    sdata.blocklandmarkylocs[coding.block][coding.trial][i] = candyloc;
    console.log(candxloc);
    goalorstart[candxloc][candyloc] = 3;
  }
}

function generateGoalAndStart(){
  if(sdata.cond_freeorforced[coding.index] == 0){
    goalorstart = new Array(coding.numrows);
    for (i = 0; i < coding.numrows; i++){
      goalorstart[i] = Array(coding.numcols).fill(0);
    }

    eligiblegoals = [];
    for (i = 2; i < coding.numrows - 4; i++){
      for (j = 2; j < coding.numcols - 4; j++){
        eligible = true;
        for(k = 0; k < sdata.resp_explorexclicks[coding.index].length; k++){
          if (sdata.resp_explorexclicks[coding.index][k] == i.toString() && sdata.resp_exploreyclicks[coding.index][k] == j.toString()){
            console.log('not eligible')
            eligible = false;
            break
          }
          
        }
        if (eligible){
          eligiblegoals.push([i,j]);
        }

      }
    }
    console.log(eligiblegoals);
    sdata.blockgoalxlocs[coding.block][coding.trial] = new Array(parameters.numgoals);
    sdata.blockgoalylocs[coding.block][coding.trial] = new Array(parameters.numgoals);



    // candgoalxloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    // candgoalyloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    // while(goalorstart[candgoalxloc][candgoalyloc] !=0){
    //   candgoalxloc = Math.floor(Math.random() * (coding.numrows-4))+2;
    //   candgoalyloc = Math.floor(Math.random() * (coding.numrows-4))+2;
    // }

    chosengoal = Math.floor(Math.random() * eligiblegoals.length);
    sdata.blockgoalxlocs[coding.block][coding.trial] = eligiblegoals[chosengoal][0];
    sdata.blockgoalylocs[coding.block][coding.trial] = eligiblegoals[chosengoal][1];
    goalorstart[eligiblegoals[chosengoal][0]][eligiblegoals[chosengoal][1]] = 1;

    eligiblestarts = [];
    for (i = 2; i < coding.numrows - 4; i++){
      for (j = 2; j < coding.numcols - 4; j++){
        eligible = true;
        if(abs(i - sdata.blockgoalxlocs[coding.block][coding.trial]) + abs(j - sdata.blockgoalylocs[coding.block][coding.trial]) != parameters.pathlength){
          eligible = false;
        }
        else{
          for(k = 0; k < sdata.resp_explorexclicks[coding.index].length; k++){
            if (sdata.resp_explorexclicks[coding.index][k] == i.toString() && sdata.resp_exploreyclicks[coding.index][k] == j.toString()){
              console.log('not eligible')
              eligible = false;
              break
            }
          }
        }
        if (eligible){
          eligiblestarts.push([i,j]);
        }
      }
    }
    console.log(eligiblestarts);
    if(eligiblestarts.length == 0){
      console.log('no eligible starts');
      generateGoalAndStart();
      return;
    }
    chosenstart = Math.floor(Math.random() * eligiblestarts.length);
    sdata.blockstartingxlocs = new Array();
    sdata.blockstartingylocs = new Array();
    for(i = 0; i < parameters.nb_blocks; i++){
      sdata.blockstartingxlocs[i] = new Array();
      sdata.blockstartingylocs[i] = new Array();
    }
    sdata.blockstartingxlocs[coding.block][coding.trial] = eligiblestarts[chosenstart][0];
    sdata.blockstartingylocs[coding.block][coding.trial] = eligiblestarts[chosenstart][1];
    console.log(sdata.blockstartingxlocs);
    goalorstart[eligiblestarts[chosenstart][0]][eligiblestarts[chosenstart][1]] = 2;
  }
  else{
    console.log('choosing forced goal and start');
    sdata.blockgoalxlocs[coding.block][coding.trial] = new Array(parameters.numgoals);
    sdata.blockgoalylocs[coding.block][coding.trial] = new Array(parameters.numgoals);

    candgoalxloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    candgoalyloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    while(goalorstart[candgoalxloc][candgoalyloc] !=0){
      candgoalxloc = Math.floor(Math.random() * (coding.numrows-4))+2;
      candgoalyloc = Math.floor(Math.random() * (coding.numrows-4))+2;
    }
    sdata.blockgoalxlocs[coding.block][coding.trial] = candgoalxloc;
    sdata.blockgoalylocs[coding.block][coding.trial] = candgoalyloc;
    goalorstart[candgoalxloc][candgoalyloc] = 1;
    coding.goalxloc = candgoalxloc;
    coding.goalyloc = candgoalyloc;

    xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    yloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    console.log(abs(coding.goalxloc-xloc) + abs(coding.goalyloc - yloc));
    trycount = 0;
    while((goalorstart[xloc][yloc]!=0 || abs(coding.goalxloc-xloc) + abs(coding.goalyloc - yloc) != parameters.pathlength)){
      if (trycount > 100){
        console.log('too many tries');
        generateGoalAndStart();
        break;
      }
      xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
      yloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
      console.log( abs(coding.goalxloc-xloc) + abs(coding.goalyloc - yloc));
    }
    goalorstart[xloc][yloc] = 2;
    coding.startingxloc = xloc;
    coding.startingyloc = yloc;
    console.log('chosen starts' + xloc + ',' + yloc);
    console.log('chosen goal' + candgoalxloc + ',' + candgoalyloc);




      // sdata.blockstartingxlocs[coding.block] = coding.startingxloc;
      // sdata.blockstartingylocs[coding.block] = coding.startingyloc;
      // sdata.blockgoalxlocs[coding.block] = coding.goalxloc;
      // sdata.blockgoalylocs[coding.block] = coding.goalyloc;

      // coding.xloc = coding.startingxloc;
      // coding.yloc = coding.startingyloc;
      // inds = shuffle([... Array(parameters.numgoals).keys()].concat([... Array(parameters.numgoals).keys()]));
      // sdata.blocktrialgoalxlocs[coding.block] = new Array(parameters.nb_trials);
      // sdata.blocktrialgoalylocs[coding.block] = new Array(parameters.nb_trials);
      // for(i = 0; i < parameters.nb_trials; i++){
      //   sdata.blocktrialgoalxlocs[coding.block][i] = sdata.blockgoalxlocs[coding.block][inds[i]];
      //   sdata.blocktrialgoalylocs[coding.block][i] = sdata.blockgoalylocs[coding.block][inds[i]];
      // }
      sdata.blockstartingxlocs = new Array();
      sdata.blockstartingylocs = new Array();
      for(i = 0; i < parameters.nb_blocks; i++){
        sdata.blockstartingxlocs[i] = new Array();
        sdata.blockstartingylocs[i] = new Array();
      }
      sdata.blockstartingxlocs[coding.block][coding.trial] = coding.startingxloc;
      sdata.blockstartingylocs[coding.block][coding.trial] = coding.startingyloc;

    }
  



  sdata.cond_blockgoalxlocs[coding.block][coding.trial] = sdata.blockgoalxlocs[coding.block][coding.trial].toString();
  sdata.cond_blockgoalylocs[coding.block][coding.trial] = sdata.blockgoalylocs[coding.block][coding.trial].toString();

  sdata.cond_trialgoalxlocs[coding.index] = sdata.blockgoalxlocs[coding.block][coding.trial].toString();
  sdata.cond_trialgoalylocs[coding.index] = sdata.blockgoalylocs[coding.block][coding.trial].toString();

  
  // sdata.cond_blocklandmarkxlocs[coding.block][coding.trial] = sdata.blocklandmarkxlocs[coding.block][coding.trial].toString();
  // sdata.cond_blocklandmarkylocs[coding.block][coding.trial] = sdata.blocklandmarkylocs[coding.block][coding.trial].toString();
  
  // sdata.cond_triallandmarkxlocs[coding.index] = sdata.blocklandmarkxlocs[coding.block][coding.trial].toString();
  // sdata.cond_triallandmarkylocs[coding.index] = sdata.blocklandmarkylocs[coding.block][coding.trial].toString();
  
  // console.log(sdata.blockstartingxlocs[coding.block]);
  // console.log(sdata.blockstartingylocs[coding.block]);
  // sdata.resp_xlocs[0] = String(coding.startingxloc);
  // sdata.resp_ylocs[0] = String(coding.startingyloc);

}

function updateImages(){

  //clear all objects

  for(xobj = 0; xobj < coding.numrows; xobj++){
    for (yobj = 0; yobj < coding.numcols; yobj++){
      board.currentimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      board.leftimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      board.rightimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      board.downimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      board.upimg[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
      board.goalobj[xobj][yobj].object[coding.block][coding.trial].attr({"opacity":0});
    }
  }

  
  for(action = 1; action <= 4; action ++ ){
    for (colour = 0; colour <= 2; colour ++){
      board.actionindicator[action][colour].object.attr({"opacity":0});
    }
  }

  //update current object
  board.currentimg[coding.xloc][coding.yloc].object[coding.block][coding.trial].attr({"opacity":1});
  board.current.rectangle.object.attr({"stroke": "red"});
  

  

  //update goal object
  if(coding.block > 0){
    board.goalobj[coding.goalxloc][coding.goalyloc].object[coding.block][coding.trial].attr({"opacity":1});
  }
  

}

function updateArrows(){
  //update up object
  if(coding.yloc-1 >= 0){
    // board.up.rectangle.object.attr({"fill": "grey"});
    // board.upimg[coding.block][coding.xloc][coding.yloc-1].object.attr({"opacity":0.5});
    board.actionindicator[3][0].object.attr({"opacity":1});
    board.uparrow.object.attr({"opacity": 1});
    board.uparrow.object.node.onclick = function(){handleUp()};
    board.uparrow.object.toFront();
  }
  else{
    if(parameters.showedges){ board.up.rectangle.object.attr({"fill": "black"});}
    board.uparrow.object.attr({"opacity": 0.2});
    board.uparrow.object.node.onclick = function(){};
    //board.actionindicator[3][0].object.attr({"opacity":1});
  }

  //update down object
  if(coding.yloc+1 < coding.numrows){
    // board.down.rectangle.object.attr({"fill": "grey"});
    // board.downimg[coding.block][coding.xloc][coding.yloc+1].object.attr({"opacity":0.5});
    board.actionindicator[4][0].object.attr({"opacity":1});
    board.downarrow.object.attr({"opacity": 1});
    board.downarrow.object.node.onclick = function(){handleDown()};
    board.downarrow.object.toFront();
  }
  else{
    if(parameters.showedges){ board.up.rectangle.object.attr({"fill": "black"});}
    //board.actionindicator[4][0].object.attr({"opacity":1});
    board.downarrow.object.attr({"opacity": 0.2});
    board.downarrow.object.node.onclick = function(){};
  }

  //update left object
  if(coding.xloc-1 >= 0){
    // board.left.rectangle.object.attr({"fill": "grey"});
    // board.leftimg[coding.block][coding.xloc-1][coding.yloc].object.attr({"opacity":0.5});
    board.actionindicator[1][0].object.attr({"opacity":1});
    board.leftarrow.object.attr({"opacity": 1});
    board.leftarrow.object.node.onclick = function(){handleLeft();};
    board.leftarrow.object.toFront();
  }
  else{
    if(parameters.showedges){ board.up.rectangle.object.attr({"fill": "black"});}
    //board.actionindicator[1][0].object.attr({"opacity":1});
    board.leftarrow.object.attr({"opacity": 0.2});
    board.leftarrow.object.node.onclick = function(){};
  }

  //update right object
  if(coding.xloc+1 < coding.numcols){
    // board.right.rectangle.object.attr({"fill": "grey"});
    // board.rightimg[coding.block][coding.xloc+1][coding.yloc].object.attr({"opacity":0.5});
    board.actionindicator[2][0].object.attr({"opacity":1});
    board.rightarrow.object.attr({"opacity": 1});
    board.rightarrow.object.node.onclick = function(){handleRight();};
    board.rightarrow.object.toFront();
  }
  else{
    if(parameters.showedges){ board.up.rectangle.object.attr({"fill": "black"});}
    //board.actionindicator[2][0].object.attr({"opacity":1});
    board.rightarrow.object.attr({"opacity": 0.2});
    board.rightarrow.object.node.onclick = function(){};
  }
}

function populateGrid(){
  // row = coding.numrows;
  // col = coding.numcols;
  
  // coding.xloc = Math.floor(Math.random() * row);
  // coding.yloc = Math.floor(Math.random() * col);
  // board.characterimg[coding.yloc][coding.xloc].object.attr({"opacity":100});
  // coding.startingxloc = coding.xloc;
  // coding.startingyloc = coding.yloc;

}



function resetGrid(){

  /// this function is not used

  //code for random starting location
  coding.xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
  coding.yloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;

  while(coding.xloc==coding.goalxloc && coding.yloc==coding.goalyloc){
    coding.xloc = Math.floor(Math.random() * (coding.numrows-4)) + 2;
    coding.yloc = Math.floor(Math.random() * (coding.numrows-4))+ 2;
  }

  updateImages();
  updateArrows();
  updateClickObjects();
  coding.startingxloc = coding.xloc;
  coding.startingyloc = coding.yloc;
  console.log('reset grid');


  //code for fixed starting location
  // coding.xloc = coding.startingxloc;
  // coding.yloc = coding.startingyloc;
  // updateImages();


  // coding.grabbed = 0;
  // board.characterimg[coding.yloc][coding.xloc].object.attr({"opacity":0});
  // //console.log("hi");
  // coding.xloc = 0;
  // coding.yloc = 0;

  // // //close door
  // // board.grid[Math.floor(coding.numrows/2)][coding.numcols].rectangle.object.attr({"fill":"black"});
  // // board.grid[Math.floor(coding.numrows/2)][coding.numcols].ispassable = false;

  // for (i=0; i<coding.numrows; i++){
  //   for(j=0; j<coding.totcols; j++){
  //     if(board.grid[i][j].isfull > 0){
  //       board.obj[i][j].object.remove();
  //       board.grid[i][j].isfull = false;
  //       board.obj[i][j].identity[0] = {};
  //       board.obj[i][j].identity[1] = {};
  //     }
  //   }
  // }
  // populateGrid();
}
