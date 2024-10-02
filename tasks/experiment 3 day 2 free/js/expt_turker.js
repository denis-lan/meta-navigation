html_humanform = "html/turker_form.html";

var participant_age    = '';
var participant_gender = '';
var participant_turker = '';
function getTurkerform(){
  participant_age    = document.getElementById("ageSelect").value;
  participant_gender = document.getElementById("genderSelect").value;
  participant_turker = document.getElementById("turkerSelect").value;
}


html_feedbackform = "html/feedback_form.html"
var feedback = '';
function getFeedbackform(){
	feedback = document.getElementById("feedback").value;
	edata.feedback = feedback;

  feedback2 = document.getElementById("feedback2").value;
  edata.feedback2 = feedback2;
  finishExperiment_feedback()
}

function getQuestionnaireform(){
  sdata = {};
  const sbsodq1Radios = document.querySelectorAll('input[name="sbsodq1"]');
  let sbsodq1Response = '';
  sbsodq1Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq1 = radio.value;
    }
  });

  const sbsodq2Radios = document.querySelectorAll('input[name="sbsodq2"]');
  let sbsodq2Response = '';
  sbsodq2Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq2 = radio.value;
    }
  });

  const sbsodq3Radios = document.querySelectorAll('input[name="sbsodq3"]');
  let sbsodq3Response = '';
  sbsodq3Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq3 = radio.value;
    }
  } );

  const sbsodq4Radios = document.querySelectorAll('input[name="sbsodq4"]');
  let sbsodq4Response = '';
  sbsodq4Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq4 = radio.value;
    }
  }
  );

  const sbsodq5Radios = document.querySelectorAll('input[name="sbsodq5"]');
  let sbsodq5Response = '';
  sbsodq5Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq5 = radio.value;
    }
  }
  );

  const sbsodq6Radios = document.querySelectorAll('input[name="sbsodq6"]');
  let sbsodq6Response = '';
  sbsodq6Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq6 = radio.value;
    }
  }
  );

  const sbsodq7Radios = document.querySelectorAll('input[name="sbsodq7"]');
  let sbsodq7Response = '';
  sbsodq7Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq7 = radio.value;
    }
  }
  );

  const sbsodq8Radios = document.querySelectorAll('input[name="sbsodq8"]');
  let sbsodq8Response = '';
  sbsodq8Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq8 = radio.value;
    }
  }
  );

  const sbsodq9Radios = document.querySelectorAll('input[name="sbsodq9"]');
  let sbsodq9Response = '';
  sbsodq9Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq9 = radio.value;
    }
  }
  );

  const sbsodq10Radios = document.querySelectorAll('input[name="sbsodq10"]');
  let sbsodq10Response = '';
  sbsodq10Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq10 = radio.value;
    }
  }
  );

  const sbsodq11Radios = document.querySelectorAll('input[name="sbsodq11"]');
  let sbsodq11Response = '';
  sbsodq11Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq11 = radio.value;
    }
  }
  );

  const sbsodq12Radios = document.querySelectorAll('input[name="sbsodq12"]');
  let sbsodq12Response = ''; 
  sbsodq12Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq12 = radio.value;
    }
  }
  );

  const sbsodq13Radios = document.querySelectorAll('input[name="sbsodq13"]');
  let sbsodq13Response = '';
  sbsodq13Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq13 = radio.value;
    }
  }
  );

  const sbsodq14Radios = document.querySelectorAll('input[name="sbsodq14"]');
  let sbsodq14Response = '';
  sbsodq14Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq14 = radio.value;
    }
  }
  );

  const sbsodq15Radios = document.querySelectorAll('input[name="sbsodq15"]');
  let sbsodq15Response = '';
  sbsodq15Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_sbsodq15 = radio.value;
    }
  }
  );

  const nsq1Radios = document.querySelectorAll('input[name="nsq1"]');
  let nsq1Response = '';
  nsq1Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq1 = radio.value;
    }
  });

  const nsq2Radios = document.querySelectorAll('input[name="nsq2"]');
  let nsq2Response = '';
  nsq2Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq2 = radio.value;
    }
  }
  );

  const nsq3Radios = document.querySelectorAll('input[name="nsq3"]');
  let nsq3Response = '';
  nsq3Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq3 = radio.value;
    }
  }
  );

  const nsq4Radios = document.querySelectorAll('input[name="nsq4"]');
  let nsq4Response = '';
  nsq4Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq4 = radio.value;
    }
  }
  );

  const nsq5Radios = document.querySelectorAll('input[name="nsq5"]');
  let nsq5Response = '';
  nsq5Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq5 = radio.value;
    }
  }
  );

  const nsq6Radios = document.querySelectorAll('input[name="nsq6"]');
  let nsq6Response = '';
  nsq6Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq6 = radio.value;
    }
  }
  );

  const nsq7Radios = document.querySelectorAll('input[name="nsq7"]');
  let nsq7Response = '';
  nsq7Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq7 = radio.value;
    }
  }
  );

  const nsq8Radios = document.querySelectorAll('input[name="nsq8"]');
  let nsq8Response = '';
  nsq8Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq8 = radio.value;
    }
  }
  );

  const nsq9Radios = document.querySelectorAll('input[name="nsq9"]');
  let nsq9Response = '';
  nsq9Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq9 = radio.value;
    }
  }
  );

  const nsq10Radios = document.querySelectorAll('input[name="nsq10"]');
  let nsq10Response = '';
  nsq10Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq10 = radio.value;
    }
  }
  );

  const nsq11Radios = document.querySelectorAll('input[name="nsq11"]');
  let nsq11Response = '';
  nsq11Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq11 = radio.value;
    }
  }
  );

  const nsq12Radios = document.querySelectorAll('input[name="nsq12"]');
  let nsq12Response = '';
  nsq12Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq12 = radio.value;
    }
  }
  );

  const nsq13Radios = document.querySelectorAll('input[name="nsq13"]');
  let nsq13Response = '';
  nsq13Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq13 = radio.value;
    }
  }
  );

  const nsq14Radios = document.querySelectorAll('input[name="nsq14"]');
  let nsq14Response = '';
  nsq14Radios.forEach(radio => {
    if (radio.checked) {
      sdata.resp_quest_nsq14 = radio.value;
    }
  }
  );

  // questions 1, 6, 7, and 14 have an other field
  sdata.resp_quest_nsq1other = document.getElementById('nsq1_other').value;
  sdata.resp_quest_nsq6other = document.getElementById('nsq6_other').value;
  sdata.resp_quest_nsq7other = document.getElementById('nsq7_other').value;
  sdata.resp_quest_nsq14other = document.getElementById('nsq14_other').value;
}