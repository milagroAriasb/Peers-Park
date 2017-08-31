function getDateUTCString(now){
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  return today
}

var now = new Date();
var todays_date = getDateUTCString(now) 
$("#date").val(todays_date);
//document.getElementById("date").valueAsDate = new Date()
     
function display_kid_checkin(kid){

      var arrivalTime = "<div class='col-xs-3'>"+ kid.arrivalTime +"</div>";
      var departureTime = "<div class='col-xs-3'>"+ kid.departureTime +"</div>";
      var age = "<div class='col-xs-3'>"+ kid.age +"</div>";
      var gender = "<div class='col-xs-3'>"+ kid.gender +"</div>";
      dataToDisplay = arrivalTime + departureTime + age + gender;
      // append each kid checking to the div
      $("#display-results").append(dataToDisplay);  
      
    }

    function filter_checkin(data, gender, age){

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
          display_kid_checkin(kid) 
        }

      }

    // event handler 
    function getParkCheckins(evt){
      evt.preventDefault();

      // getting data from form
        var formInputs = { 
          date: $('#date').val(),
          start_time_to_check: $('#arrival_time').val(),
          end_time_to_check: $('#departure_time').val(),
          selected_park_id: $('#park_id').val()
        }

      $.get('selectedPark/park.json',
            formInputs, 
            displayKidsCheckin
      );

    }

    $('#submit').on('click', getParkCheckins);