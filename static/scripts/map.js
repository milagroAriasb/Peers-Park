// This sample uses the Place Autocomplete widget to allow the user to search
      // for and select a place. The sample then displays an info window containing
      // the place ID and other information about the place that the user has
      // selected.
      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      var infowindow, map, pos, locator, infowindowContent


      function initMap() {
        var center = {lat:  37.773972, lng: -122.431297};
        var zoom = 13;
        map = createMap(center, zoom);
        var clickHandler = new ClickEventHandler();
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            respondToGeolocation(position);
          } );
        } else {
          // If Browser doesn't support Geolocation
          alert("Must have location to use app!");
        }
       
        setAutoCompleteOnSearchBarByID('pac-input');
        createParkIdentidentifier();
      }

      // create an info window
      function setupInfoWindow(){
        infowindow = new google.maps.InfoWindow();
        infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
      }
      // Create a marker an put it in the map
      function setupMarker(){
        locator = new google.maps.Marker({
          map: map
        });
        locator.addListener('click', function() {
          infowindow.open(map, locator);
        });  
      }

      // when a park is found on the search bar we need to create an infowindow
      function createParkIdentidentifier(autoComplete){
         
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
        console.log('You clicked on: ' + event.latLng);
        createLocalMarker("Hello");
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

      ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
        var me = this;
        console.log(placeId);
        this.placesService.getDetails({placeId: placeId}, function(place, status) {
          if (status === 'OK') {
            infowindow.close();
            infowindow.setPosition(place.geometry.location);
            // me.infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-id'].textContent = place.place_id;
            console.log(typeof(place.place_id))
            infowindowContent.children['place-address'].textContent =
                place.formatted_address;
            infowindow.open(me.map);
          // Get place id after user clicks for a park and send it to the form 
            var park_id = place.place_id;
            $('#park_id').attr('value',park_id)
            // function redirect_to_home(result) {
            //     window.location.replace ('/');  
            // }
          }
        });
      }

      // returns a map  
      function createMap(center, zoom){
          var map = new google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: zoom,
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
        return map 
      }

      function createMarker(position, title){
        var marker = new google.maps.Marker({
              position: position,
              map: map,
              title: title
            });
        return marker
      }

      function createLocalMarker(title){
        return createMarker(pos, title)
      }
      
      function respondToGeolocation(position){
            pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
            };
            var title = 'You are here!';
            var marker = createLocalMarker(title)
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
          infowindowContent.children['place-id'].textContent = place.place_id;
          console.log(typeof(place.place_id))
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, locator);
          // Get place id after user searchs for a park and send it to the form 
          park_id = place.place_id;
          $('#park_id').attr('value',park_id)
          
        }
    
      function setAutoCompleteOnSearchBarByID(id){
          var input = document.getElementById(id);
          var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          autocomplete.addListener('place_changed', function() {
            searchBarEventHandler(autocomplete);
          });
        }

      //   function nearbyParks(position){
      //         // body...
      //     pos = {
      //           lat: position.coords.latitude,
      //           lng: position.coords.longitude
      //         };
              
      //         console.log(pos)
      //       //DO it need to create a new map????????????????
      //     // map = new google.maps.Map(document.getElementById('map'), {
      //     //   center: pos,
      //     //   zoom: 15
      //     // });

      //     // infowindow = new google.maps.InfoWindow();

      //     var service = new google.maps.places.PlacesService(map);
      //     service.nearbySearch({
      //       location: pos,
      //       radius: 500,
      //       type: ['park']
      //     }, callback);

      //   }

      //   function callback(results, status) {
      //   if (status === google.maps.places.PlacesServiceStatus.OK) {
      //     for (var i = 0; i < results.length; i++) {
      //       createMarker(results[i]);
      //       }
      //     }
      //   }

      // function createMarker(place) {
      //   var placeLoc = place.geometry.location;
      //   var marker = new google.maps.Marker({
      //     map: map,
      //     position: place.geometry.location
      //   });

      //   google.maps.event.addListener(marker, 'click', function() {
      //     infowindow.setContent(place.name);
      //     infowindow.open(map, this);
      //     });
      //   }