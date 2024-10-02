
function logStart(taskname,idname) {
  alldata = {
    task: taskname,
    id:   idname
  };
  $.post("lib/php/log_start.php",alldata);
}

function logWrite(alldata) {
  $.post("lib/php/log_write.php",alldata);
}

function bonusWrite(alldata) {
  $.post("lib/php/bonus_write.php",alldata);
}
