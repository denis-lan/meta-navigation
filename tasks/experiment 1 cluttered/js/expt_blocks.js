 function newBlock(){
 	coding.answering = false;
	coding.exploreanswering = false;
  	coding.trial = 0;
 	coding.correctcount = 0;

  	board.cover.object.attr({"opacity":1});
	board.cover.object.toFront();

	
	// coding.pageno = 0;
	//coding.reward = 1000;
	
	showInstructions();	
	if (coding.block == 0){
		coding.pageno = 0;
		showInstructions();
	}
	else {
		coding.pageno = 3;
		showInstructions();
	}

  
  /*
  "In this block, you will use the arrow keys to naviage the grid and pick up one object from each room.",
  	"You will be awarded points if you pick up the correct object in the first room AND the correct object in the second room.",
   	"You will only be awarded points if both objects are correct. You will lose points instead if you pick up the wrong object in either the first or second room.",

   		"However, unlike you, these participants are NOT told what the correct objects are at the start of their block.",
   	"Instead, these participants will be required to discover the rules themselves through trial and error, based only on the points they earn or lose after each trial."
  */

  
  // board.instructions2.object.attr({"opacity": 1});
  // board.instructions2.object.toFront();

  
 } 


function showInstructions(){
	board.points.object.toBack();
	board.cover.object.attr({"opacity" : 1});
	board.cover.object.toFront();
	board.pressspacetext.object.attr({"text": "Press space to continue." });
	board.pressspacetext.object.attr({"opacity": 1});
	board.pressspacetext.object.attr({"font-weight": "bold"});
	board.pressspacetext.object.toFront();
	 
	board.instructions1.object.attr({"opacity": 0});
	board.instructions2.object.attr({"opacity": 0});
	board.instructions3.object.attr({"opacity": 0});
	board.instructions4.object.attr({"opacity": 0});

	board.instructionstext.object.attr({"opacity": 0});

	coding.instructionswait = true;
	// coding.probeinstructions = false;
	// if (coding.instructionswait && coding.pageno == -1){
	// 	board.instructions_explore.object.attr({"opacity": 1});
   	// 	board.instructions_explore.object.toFront();
   	// 	coding.spacewait = 1;
   	// 	coding.pageno ++;
	// }
	// else 
	if(coding.instructionswait && coding.pageno == 0){
		coding.probeinstructions = false;
		board.instructions1.object.attr({"opacity": 1});
   		board.instructions1.object.toFront();

		if(coding.block == 0 && !coding.blockstarted){
			coding.spacewait = 2;
			coding.pageno += 0.5;
			
		}
		else if(coding.block == 0 && coding.blockstarted && coding.explorephase){
			coding.spacewait = 1;
			coding.pageno = 0.5;
		}
		else{
			coding.spacewait = 2;
			coding.pageno ++;
		}
	}
	else if(coding.instructionswait && coding.pageno == 0.5){
		//this page is used before the practice run of the learning phase.
		text = ["You will now have a practice run for the learning phase.",
				"In the practice version, you will practice clicking on 3 blue squares and a yellow square.",
				"You may press ‘I’ at any point in time to review the instructions again."
				].join("\n \n");
		// updateExploreImages();
		
		board.instructionstext.object.attr({"text": text});
		board.instructionstext.object.attr({"opacity": 1});
		board.instructionstext.object.toFront();
		coding.spacewait = 1;
	}
	else if(coding.instructionswait && coding.pageno == 0.75){
		//this page is used after the practice run of the learning phase.
		text = ["Well done on completing the practice run for the learning phase.",
				"You will now move on the the instructions and practice for the test phase."
				].join("\n \n");
		
		board.instructionstext.object.attr({"text": text});
		board.instructionstext.object.attr({"opacity": 1});
		board.instructionstext.object.toFront();
		coding.pageno = 1;
		coding.spacewait = 2;

	}
	else if(coding.instructionswait && coding.pageno == 1){
		board.instructions2.object.attr({"opacity": 1});
   		board.instructions2.object.toFront();
   		coding.spacewait = 2;
   		coding.pageno ++;
	}
	else if(coding.instructionswait && coding.pageno == 1.5){
		board.instructions2.object.attr({"opacity": 1});
   		board.instructions2.object.toFront();
   		coding.spacewait = 2;
	}
	else if(coding.instructionswait && coding.pageno == 2){
		// if(coding.block != 0){
		board.instructions3.object.attr({"opacity": 1});
		board.instructions3.object.toFront();
		if(coding.block == 0){
			coding.spacewait = 2;
			coding.pageno ++;
			console.log('hohoho');
		}
		// else if(!coding.blockstarted){
		// 	coding.spacewait = 1;
		// 	console.log('here');
		// 	coding.pageno ++;
		// }
		else{
			coding.spacewait = 2;
			console.log('gaa');
			coding.pageno ++;
		}
	}

	// else if((coding.instructionswait && coding.pageno == 2.5)||coding.probestarted == true){
	// 	board.instructions4.object.attr({"opacity": 1});
	// 	board.instructions4.object.toFront();
	// 	if(coding.probestarted == true || coding.ipressed == true){
	// 		coding.spacewait = 1;
	// 	}
	// 	else{
	// 		coding.spacewait = 2;
	// 		coding.pageno += 0.5;
	// 		coding.probeinstructions = true;
	// 	}
		
	// }
	
	else if(coding.instructionswait && coding.pageno == 3){

		//action condition instructions

		if (sdata.cond_blockactionconditions[coding.block] == 'both'){
			conditionins = "In this block, you will be allowed to use both the objects and the arrows on every step.";
		}
		else if (sdata.cond_blockactionconditions[coding.block] == 'tonly'){
			conditionins = "In this block, you will be allowed to use only the objects on every step.";
		}
		else if (sdata.cond_blockactionconditions[coding.block] == 'vonly'){
			conditionins = "In this block, you will be allowed to use only the arrows on every step.";
		}
		else{
			conditionins = "In this block, you will be allowed to use either only the arrows or only the objects (chosen randomly on every step).";
		}
		
		if (coding.block == 0 && coding.probeinstructions == false){
			text = ["You will now complete a practice run of the test phase.",
				"This practice run will give you the opportunity to test out \n the two different ways of moving around.",
				"Unlike on the actual task, you will not have a goal in this practice run.",
				"Instead, the practice will end when you have made 10 steps AND \n tried moving around using both the objects and the arrows.",
			conditionins].join("\n \n");
			coding.pageno ++;
		}
		else if (coding.block == 0 && coding.probeinstructions == true){
			text = ["You will now complete a practice run of the a probe trial.",
		"You will see the points you would have earned at the end of the trial, \n but these will not count towards your bonus payment."].join("\n \n");
			coding.pageno ++;
		}
		else if (coding.block == 1){
			text = ["Well done on completing the practice! You will now move on to the actual task",
				"This is Block " + (coding.block) + " of 4.",
				"The objects you encounter on this block will be different from the practice block",
				"The objects and their locations will change on every trial of the block.",
				"The points you earn on this block will count towards your bonus payment.",
				"You may press ‘I’ at any point in time to review the instructions again.",
				conditionins
				].join("\n \n");
			// updateExploreImages();
			coding.pageno ++;
		}
		else{
			text = ["This is Block " + (coding.block) + " of 4.",
				"The objects you encounter on this block will be different from previous blocks",
				"The objects and their locations will change on every trial of the block.",
				"The points you earn on this block will count towards your bonus payment.",
				"You may press ‘I’ at any point in time to review the instructions again.",
				conditionins
				].join("\n \n");
			// updateExploreImages();
			coding.pageno ++;
		}
		board.instructionstext.object.attr({"text": text});
		board.instructionstext.object.attr({"opacity": 1});
		board.instructionstext.object.toFront();

		coding.spacewait = 1;
	}

	

}
	
function startExplore(){
	console.log('start explore');
	
	
	coding.explorephase = true;
	coding.spacewait = 0;
	board.instructionstext.object.attr({"opacity": 0});
	board.pressspacetext.object.attr({"opacity": 0});

	// generateGoalAndStart();
	// generateExploreForcedClicks();
	if(sdata.cond_freeorforced[coding.index] == 1){
		generateLandmarks();
		generateExploreForcedClicks();
		updateExploreImages();
		updateTrialImages();
		console.log('forced: start explore');
	}
	alreadyhidden = new Array(parameters.numexploreclicks + 1).fill(false);
	showExploreGrid();
	coding.exploreanswering = true;

	
}

function startBlock(){
	coding.blockstarted = true;
	board.cover.object.attr({"opacity": 0});
	board.cover.object.toBack();
	board.instructions1.object.attr({"opacity": 0});
	board.instructions2.object.attr({"opacity": 0});
	board.instructions3.object.attr({"opacity":0});
	board.instructions4.object.attr({"opacity":0});
	board.instructionstext.object.attr({"opacity": 0});
	board.pressspacetext.object.attr({"opacity": 0});

		
  	coding.answering = true;
  	//generateGoalAndStart();
  	// resetGrid();
	// generateLandmarks();
  	startExplore();
}

function endBlock(){
	coding.blockstarted = false;
	coding.answering = false;
	if (coding.block == 0){
		coding.reward = 1000;
	}
	coding.block += 1;
	board.cover.object.attr({"opacity":1});
	board.cover.object.toFront();
	
	if (coding.block == parameters.nb_blocks){
    	finishExperiment_data();
  	}
	else {
		coding.spacewait = 0;
		newBlock();
	}
	
}

function next(){
	console.log(coding.pageno);
	if(coding.spacewait == 1){
		//spacewait = 1 means start block
		// if(coding.pageno == 0){
		// 	startExplore();
		// }
		// else{
		coding.instructionswait = false;
		coding.ipressed = false;
		coding.spacewait = 0;

		board.pressspacetext.object.attr({"text": "Press 'I' to review instructions." });
		board.pressspacetext.object.attr({"opacity": 1});
		board.pressspacetext.object.toFront();
		board.pressspacetext.object.attr({"font-weight": "bold"});

		if (!coding.blockstarted & !coding.probeinstructions){
			startBlock();
		}
		else if(coding.probeinstructions){
			coding.probeinstructions = false;
			coding.probestarted = true;
			startProbeBlock();

		}
		else{
			board.instructions1.object.attr({"opacity": 0});
			board.instructions2.object.attr({"opacity": 0});
			board.instructions3.object.attr({"opacity": 0});
			board.instructions4.object.attr({"opacity": 0});
			board.instructionstext.object.attr({"opacity": 0});
			board.cover.object.attr({"opacity": 0});
			board.cover.object.toBack();
			if(coding.block == 0 && !coding.explorephase && !coding.probestarted){
				newTrial();
			}
			else if(coding.explorephase){
				showExploreGrid();
			}
			else if(coding.probestarted){
				console.log('show probe grid');
				showProbeGrid();
			}
			else{
				bringClickysToFront();
			}
		}
		
		// }
		
	}
	else if(coding.spacewait == 2){
		//spacewait = 2 means show next page of instructions
		showInstructions();
	}
// 	else if (coding.spacewait == 3){
// 		coding.spacewait = 0;
// 		if (coding.quizpageno == 0 || coding.quizpageno == 1){
// 			coding.quizpageno += 1;
// 		}
// 		else {
// 			coding.quizpageno = 0;
// 		}
// 		runQuiz();
// 	}

}