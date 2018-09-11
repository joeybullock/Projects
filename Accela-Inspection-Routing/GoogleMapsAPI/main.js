function mapLocation() {

    var fullLineAddresses = [
  "337 Ormond St SE, Atlanta, GA 30315",
  "600 Garson Dr NE, Atlanta, GA 30324",
  "168 Maple St NW, Atlanta, GA 30314",
  "298 Palatka St SE, Atlanta, GA 30317"
];
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var atlanta = new google.maps.LatLng(33.755239, -84.393380);
        var mapOptions = {
            zoom: 12,
            center: atlanta
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        google.maps.event.addDomListener(document.getElementById('routebtn'), 'click', calcRoute);
    }

    function calcRoute() {
        var start = "96 Mitchell St SW, Atlanta, GA 30303";
        //var end = new google.maps.LatLng(38.334818, -181.884886);
        var end = "96 Mitchell St SW, Atlanta, GA 30303";
        var waypoints = [];
        for (var i = 0; i < fullLineAddresses.length; i++) {
          waypoints.push({
            location: fullLineAddresses[i],
            stopover: true
          });
        }
        /*
var startMarker = new google.maps.Marker({
            position: start,
            map: map,
            draggable: true
        });
        var endMarker = new google.maps.Marker({
            position: end,
            map: map,
            draggable: true
        });
*/
//        var bounds = new google.maps.LatLngBounds();
//        bounds.extend(start);
//        bounds.extend(end);
//        map.fitBounds(bounds);
        var request = {
            origin: start,
            destination: end,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                      var route = response.routes[0];
      var summaryPanel = document.getElementById('directions-panel');
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var j = 0; j < route.legs.length; j++) {
        var routeSegment = j + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
        summaryPanel.innerHTML += route.legs[j].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[j].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[j].distance.text + '<br><br>';
      }
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
}
mapLocation();