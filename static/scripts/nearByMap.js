      var map;
      var infowindow;


      function initMap() {

          // Try HTML5 geolocation.
        if (navigator.geolocation) {
          
          navigator.geolocation.getCurrentPosition(function(position){
            map_making(position);})
        } else {
          // If Browser doesn't support Geolocation
          alert("Must have location to use app!");
        }

      function map_making (position) {
        // body...
        pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(pos)
        map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        // service.nearbySearch({
        //   location: pos,
        //   radius: 1000,
        //   type: ['parks']
        //   // keyword: ['parks']
        // }, callback);
        service.nearbySearch({
          location: pos,
          radius: 1000,
          type: ['parks'],
          keyword: ['playground', 'parks']
          // keyword: ['parks']
        }, callback);
      }
    }

      function callback(results, status) {
        console.log 
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }
   
      function createMarker(place) {

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
      }