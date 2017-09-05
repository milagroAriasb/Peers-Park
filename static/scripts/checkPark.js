
// contains the filter results from the main results
var checkin_data = {};
// check if there were any filters aply to the results
function filter_handler() {
  var age = $('#age').val()
  var gender = $('#gender').val()
  if (age == "") {
    age = null;
  }
  if (gender == "-") {
    gender = null;
  }

  filterCheckinValues(age, gender);
}

// if something happens on age or gender call filter_handler
$('#age').on('keyup', filter_handler);
$('#gender').on('change', filter_handler);

function filterCheckinValues(age, gender) {

  // check if the statemnets bellow is true. If so, it adds it that chekin to 
  //filter_checkin_data dictionary
  // JONATHAN how to filter on a dictionary? 
  for (var i in checkin_data){
    var filter_checkin_data = checkin_data[i].filter(function(kid) {

    if ((age != null) && (gender != null)) {
      return ((kid.age == age) && (kid.gender == gender));
    } else if (gender != null) {
      return gender == kid.gender;
    } else if (age != null) {
      return age == kid.age;
    }

  });
  // if there is something in gender and age  but they are not 
  //found in the kids 
  //JONATHAN!!!!! 
  if ((age != null) || (gender != null)) {
      displayFilteredKidsCheckin({
        checkins: filter_checkin_data
      });
    }else{
      displayFilteredKidsCheckin({
        checkins: checkin_data[i]
      });
    }

  
}
  }
  

function getDateUTCString(now) {
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + (month) + "-" + (day);
  return today
}

var gender, age
var now = new Date();
var todays_date = getDateUTCString(now)
$("#date").val(todays_date);
// hide and show the options when filter's checkbox is selected and unselected
$("#filters").change(function() {
  $("#filter").toggle();
});



// display the kids checkins in the display-results div
function display_kid_checkin(kid) {

  var arrivalTime = "<div class='col-xs-3'>" + kid.arrivalTime + "</div>";
  var departureTime = "<div class='col-xs-3'>" + kid.departureTime + "</div>";
  var age = "<div class='col-xs-3'>" + kid.age + "</div>";
  var gender = "<div class='col-xs-3'>" + kid.gender + "</div>";
  
 

  var park_id = "<div class='col-xs-3'>" + kid.park_id + "</div>";
  dataToDisplay = arrivalTime + departureTime + age + gender;
  // append each kid checking to the div
  $("#display-results").append(dataToDisplay);

}


function filter_checkin(data) {

  for (var i in data.checkins) {
   var park_id = i
   console.log(i)
   console.log(data.checkins[i])
   for (var j in data.checkins[i]) {
      var kid = data.checkins[i][j]; //gettin one checking at the time
      console.log(data.checkins[i][j])

      //filter by gender
      if (gender != null) {
        if (kid.gender != gender) {
          continue; //takes us to the next kid (for loop)
        }
      }
      // filter by age
      if (age != null) {
        if (kid.age != age) {
          continue;
        }
      }
      display_kid_checkin(kid)

    }

  }
}

// displays header for the results
function displayHeader(parkid){
 //clear div
  // colum headers



  var header = "<h3 class='col-xs-12'>"+ parkid +"</h3>" +
  "<div class='col-xs-3'>Arrival Time</div>" +
    "<div class='col-xs-3'>Departure Time</div>" +
    "<div class='col-xs-3'>Age</div>" +
    "<div class='col-xs-3'>Gender</div>";
  // append header to div
  $("#display-results").append(header)
}

// displays the filtered results
function displayFilteredKidsCheckin(data) {
  $("#display-results").text("");
  displayParkData(data.checkins[0]["park_id"], data.checkins)
  
  // // getting data from response 
  // for (var i in data.checkins) {
  //   var kid = data.checkins[i]; //gettin one checking at the time
  //   display_kid_checkin(kid)
  // }

}

// displays all the results 
function displayKidsCheckin(data) {
   console.log(data);



  for (var i in data.checkins) {
    var kid = data.checkins[i];
    var parkID = kid.park_id;
    if (!(kid.park_id in checkin_data)){
      checkin_data[parkID] = [];
    }
    checkin_data[parkID].push(kid);
  }

  for (var i in checkin_data) {
    displayParkData(i, checkin_data[i]);
  }
}



// event handler 
function getParkCheckins(evt) {
  evt.preventDefault();



  if (placeIdList.length > 0){
    var formInputs = {
      date: $('#date').val(),
      start_time_to_check: $('#arrival_time').val(),
      end_time_to_check: $('#departure_time').val(),
      selected_park_list: placeIdList
    }
  }else{
      // getting data from form and puting in dic to send to Ajax
    var formInputs = {
      date: $('#date').val(),
      start_time_to_check: $('#arrival_time').val(),
      end_time_to_check: $('#departure_time').val(),
      selected_park_id: $('#park_id').val(),
   
    }
  }
  // debugger;

  checkin_data = []
  $.get('selectedPark/park.json',
    formInputs,
    displayKidsCheckin
  );
  

}

$('#submit').on('click', getParkCheckins);

function displayParkData(parkid, kids){
  getParkNameBy(parkid, kids)
}


function getParkNameBy(parkid, kids){
      console.log(kids)

  var request = {
    placeId: parkid
  };
  kids = kids;
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);
  var parkName = '';
  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      parkName = place.name;
      displayHeader(place.name);
      console.log("---------------------------")
      console.log(kids)
      for (var kid in kids){
        display_kid_checkin(kids[kid])
      }
      console.log (parkName);
    }

  }
}
  