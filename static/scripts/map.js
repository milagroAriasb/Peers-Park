var infowindow, map, pos, locator, infowindowContent;
var nearByParkList = [];
var placeIdList = [];

function initMap() {

    var center = {
        lat: 37.468319,
        lng: -122.143936
    };
    var zoom = 13;
    map = createMap(center, zoom);
    var clickHandler = new ClickEventHandler();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            respondToGeolocation(position);
        });
    } else {
        // If Browser doesn't support Geolocation
        alert("Must have location to use app!");
    }

    setAutoCompleteOnSearchBarByID('pac-input');
    createParkIdentidentifier();
}

// create an info window
function setupInfoWindow() {
        infowindow = new google.maps.InfoWindow();
        infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
    }
    // Create a marker an put it in the map
function setupMarker() {
    locator = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP

    });
    locator.addListener('click', function() {
        infowindow.open(map, locator);
    });
}

// when a park is found on the search bar we need to create an infowindow
function createParkIdentidentifier(autoComplete) {

    setupMarker(autoComplete)
}

// map click event stuff
var ClickEventHandler = function() {
    this.map = map;
    this.placesService = new google.maps.places.PlacesService(map);
    setupInfoWindow()
        // Listen for clicks on the map.
    this.map.addListener('click', this.handleClick.bind(this));
};


ClickEventHandler.prototype.handleClick = function(event) {
    createLocalMarker("Hello");
    // If the event has a placeId, use it.
    if (event.placeId) {

        event.stop();
        this.getPlaceInformation(event.placeId);
    }
};

ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
    var me = this;
    // console.log(placeId);
    this.placesService.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === 'OK') {
            infowindow.close();

            locator.setPlace({
                placeId: place.place_id,
                location: place.geometry.location
            });
            locator.setVisible(true);
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent =
                place.formatted_address;
            infowindow.open(map, locator);

            // Get place id after user clicks for a park and send it to the form 
            var park_id = place.place_id;
            $('#park_id').attr('value', park_id)


        }
    });
}

// returns a map  
function createMap(center, zoom) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: zoom,
        styles: [

            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{
                    "hue": "#83cead"
                }, {
                    "saturation": 1
                }, {
                    "lightness": -15
                }, {
                    "visibility": "on"
                }]
            },

            {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{
                    "hue": "#f3f4f4"
                }, {
                    "saturation": -84
                }, {
                    "lightness": 59
                }, {
                    "visibility": "on"
                }]
            }, {
                featureType: "landscape",
                elementType: "labels",
                stylers: [{
                    "hue": "#ffffff"
                }, {
                    "saturation": -100
                }, {
                    "lightness": 100
                }, {
                    "visibility": "off"
                }]
            },

            {
                featureType: "water",
                elementType: "all",
                stylers: [{
                    "hue": "#7fc8ed"
                }, {
                    "saturation": 55
                }, {
                    "lightness": -6
                }, {
                    "visibility": "on"
                }]
            },


            {
                featureType: "poi.school",
                elementType: "all",
                stylers: [{
                    "hue": "#d7e4e4"
                }, {
                    "saturation": -60
                }, {
                    "lightness": 23
                }, {
                    "visibility": "on"
                }]
            },

            {
                featureType: 'poi.attraction',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.business',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.government',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.medical',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.place_of_worship',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.school',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: 'poi.sports_complex',
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            }
        ]
    });
    return map
}

function createMarker(position, title) {

    var marker = new google.maps.Marker({
        position: position,
        map: map,

        title: title
    });

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title
    });



    return marker
}

function createLocalMarker(title) {
    return createMarker(pos, title)
}



function respondToGeolocation(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    var title = 'You are here!';
    var marker = createMarker(pos, title)
    map.setCenter(pos);
    map.setZoom(14);
}



function searchBarEventHandler(autocomplete) {
    infowindow.close();
    var place = autocomplete.getPlace();
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
    locator.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
    });
    locator.setVisible(true);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent =
        place.formatted_address;
    infowindow.open(map, locator);
    // Get place id after user searchs for a park and send it to the form 
    park_id = place.place_id;
    $('#park_id').attr('value', park_id)

}

function setAutoCompleteOnSearchBarByID(id) {
    var input = document.getElementById(id);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    autocomplete.addListener('place_changed', function() {
        searchBarEventHandler(autocomplete);
    });
}


function createPlaceMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
    return marker;
}

function makeNearbyParksList(results) {
    for (var i = 0; i < results.length; i++) {
        placeIdList.push(results[i].place_id);
      
    }

}
var nearbyMarkers = [];

function nearbyParksCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var newMarker = createPlaceMarker(results[i]);
            nearbyMarkers.push(newMarker);

        }
        makeNearbyParksList(results);
    }
}

function nearbyParks() {
    if (nearbyMarkers.length > 0) {
        for (var i = 0; i < nearbyMarkers.length; i++) {
            nearbyMarkers[i].setMap(null);
        }
        nearbyMarkers = [];
        placeIdList = [];
    } else {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pos,
            radius: 1000,
            type: ['parks'],
            keyword: ['playground', 'parks']
        }, nearbyParksCallback);
    }

}
$('#nearby').change(nearbyParks);