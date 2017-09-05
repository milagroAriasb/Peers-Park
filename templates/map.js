<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<!-- GOOGLE MAP showing current location -->
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<style>
/* Always set the map height explicitly to define the size of the div
 * element that contains the map. */
#map {
  height: 50%;
}
/* Optional: Makes the sample page fill the window. */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.controls {
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  height: 29px;
  margin-left: 17px;
  margin-top: 10px;
  outline: none;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 400px;
}

.controls:focus {
  border-color: #4d90fe;
}
.title {
  font-weight: bold;
}
#infowindow-content {
  display: none;
}
#map #infowindow-content {
  display: inline;
}

</style>
</head>
<body>
<input id="pac-input" class="controls" type="text"
  placeholder="Enter a location">
<div id="map"></div>
<div id="infowindow-content">
<span id="place-name"  class="title"></span><br>
Place ID <span id="place-id"></span><br>
<span id="place-address"></span>
</div>

<script>
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var infowindow, map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4419, lng: 37.4419},
    zoom: 13,
    styles: [
      {
        featureType: 'poi.attraction',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.business',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.government',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.medical',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.place_of_worship',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.school',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: 'poi.sports_complex',
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  });

  var clickHandler = new ClickEventHandler();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude

      };
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!'
      });
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // If Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map
    // icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|ddd'
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
var place;
  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    //infowindowContent.children['place-id'].textContent = place.place_id;
    //console.log(place.place_id)
    infowindowContent.children['place-address'].textContent =
        place.formatted_address;
    infowindow.open(map, marker);
  });


}



ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
  var me = this;
  this.placesService.getDetails({placeId: placeId}, function(place, status) {
    if (status === 'OK') {
      me.infowindow.close();
      me.infowindow.setPosition(place.geometry.location);
      me.infowindowContent.children['place-name'].textContent = place.name;
      me.infowindowContent.children['place-address'].textContent =
          place.formatted_address;
      me.infowindow.open(me.map);
    }
  });
}

ClickEventHandler.prototype.handleClick = function(event) {
  // console.log('You clicked on: ' + event.latLng);
  // If the event has a placeId, use it.
  if (event.placeId) {
    console.log('You clicked on place:' + event.placeId);

    // Calling e.stop() on the event prevents the default info window from
    // showing.
    // If you call stop here when there is no placeId you will prevent some
    // other map click event handlers from receiving the event.
    event.stop();
    this.getPlaceInformation(event.placeId);
  }
};


// map click event stuff
var ClickEventHandler = function() {
  this.map = map;
  this.placesService = new google.maps.places.PlacesService(map);
  this.infowindow = new google.maps.InfoWindow;
  this.infowindowContent = document.getElementById('infowindow-content');
  this.infowindow.setContent(this.infowindowContent);

  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
}; 




<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAD33R9gDYfAKyLOOolNm8pjGcA4b0T60k&libraries=places&callback=initMap"
    async defer></script>
  
