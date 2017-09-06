
function getDateUTCString(now) {
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + (month) + "-" + (day);
  return today
}

var now = new Date();
var todays_date = getDateUTCString(now)
$("#date").val(todays_date);

 function goBack() {
                window.history.back();
              }