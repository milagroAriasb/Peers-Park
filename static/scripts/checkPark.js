var checkin_data = [];

function filter_handler(){
  var age = $('#age').val()
  var gender = $('#gender').val()
  if (age == ""){
    age = null;
  }
   console.log(age)
  if (gender == "-"){
    gender = null;
  }
  
  filterCheckinValues(age, gender);
}

$('#age').on('keyup', filter_handler);
$('#gender').on('change', filter_handler);

function filterCheckinValues(age, gender){  
  var filter_checkin_data = checkin_data.filter(function(kid) {
    console.log ("age and data");
    console.log(age);
    console.log(gender);
     if ((age != null) && (gender != null )){
      return ((age == kid.age) && (gender == kid.gender));
     } else if (gender != null ){
      return gender == kid.gender;
     }else if (age != null){
      console.log(age); 
      return age == kid.age;
     }
  });
  displayKidsCheckin1({checkins: filter_checkin_data});
}

function getDateUTCString(now){
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  return today
}

var gender, age
var now = new Date();
var todays_date = getDateUTCString(now) 
$("#date").val(todays_date);
// $("#date_of_birth").val(todays_date));
//document.getElementById("date").valueAsDate = new Date()

$("#filters").change(function(){
  console.log("Hello");
  $("#filter").toggle();
});

     
function display_kid_checkin(kid){

      var arrivalTime = "<div class='col-xs-3'>"+ kid.arrivalTime +"</div>";
      var departureTime = "<div class='col-xs-3'>"+ kid.departureTime +"</div>";
      var age = "<div class='col-xs-3'>"+ kid.age +"</div>";
      var gender = "<div class='col-xs-3'>"+ kid.gender +"</div>";
      dataToDisplay = arrivalTime + departureTime + age + gender;
      // append each kid checking to the div
      $("#display-results").append(dataToDisplay);  
      
    }

function filter_checkin(data){

  for( var i in data.checkins){
      var kid = data.checkins[i]; //gettin one checking at the time
      //filter by gender
      if (gender != null){
        if (kid.gender != gender){
          continue; //takes us to the next kid (for loop)
        }
      }
      // filter by age
      if (age != null){
        if (kid.age != age){
          continue;
        }
      }  
      display_kid_checkin(kid)

    }
}

function displayKidsCheckin1(data) {
    console.log(data.checkins) 
    if (data.checkins.length == 0){
      data.checkins = checkin_data;
    }
    console.log(data.checkins) 
    $("#display-results").text(""); //clear div
    // colum headers
    var header = "<div class='col-xs-3'>Arrival Time</div>" +
                  "<div class='col-xs-3'>Departure Time</div>" +
                  "<div class='col-xs-3'>Age</div>" +
                  "<div class='col-xs-3'>Gender</div>";
    // append header to div
    $("#display-results").append(header)
    
    // getting data from response 
    for( var i in data.checkins){
      var kid = data.checkins[i]; //gettin one checking at the time
      display_kid_checkin(kid) 
    }


  }

function displayKidsCheckin(data) { 
    
    $("#display-results").text(""); //clear div
    // colum headers
    var header = "<div class='col-xs-3'>Arrival Time</div>" +
                  "<div class='col-xs-3'>Departure Time</div>" +
                  "<div class='col-xs-3'>Age</div>" +
                  "<div class='col-xs-3'>Gender</div>";
    // append header to div
    $("#display-results").append(header)
    
    // getting data from response 
    for( var i in data.checkins){
      var kid = data.checkins[i]; //gettin one checking at the time
      checkin_data.push(kid);
      display_kid_checkin(kid) 
    }

  }

// event handler 
function getParkCheckins(evt){
  evt.preventDefault();


  // getting data from form and puting in dic to send to Ajax
    var formInputs = { 
      date: $('#date').val(),
      start_time_to_check: $('#arrival_time').val(),
      end_time_to_check: $('#departure_time').val(),
      selected_park_id: $('#park_id').val(),
      gender: $('#gender').val(),
      age: $('#age').val()
    }
  checkin_data = []
  $.get('selectedPark/park.json',
        formInputs, 
        displayKidsCheckin
  );

}

$('#submit').on('click', getParkCheckins);