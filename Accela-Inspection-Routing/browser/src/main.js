//  Declare variables
const form = document.querySelector('form');
const input = document.querySelector('#searchInspector');
const start = document.querySelector('#searchStartDate');
const end = document.querySelector('#searchEndDate');
const tableSection = document.querySelector('#inspectionTableBody');
var API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
var request = {};
var fullLineAddresses = [];
var today = new Date();
var yyyymmdd = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
var directionsService = new google.maps.DirectionsService();
var atlanta = new google.maps.LatLng(33.755239, -84.393380);
var directionsDisplay = new google.maps.DirectionsRenderer();
var mapOptions = {
    zoom: 12,
    center: atlanta
};
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//  Set default dates to today
start.defaultValue = yyyymmdd;
end.defaultValue = yyyymmdd;

//  Actions for buttons
form.addEventListener('submit', formSubmitted);

//  Clear contents before next search
function searchStart() {
    tableSection.innerHTML = "";
    fullLineAddresses = [];
    API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
    request = {};
}

//  MAIN FUNCTION : Create variables from form input, search API, display results, and display route
function formSubmitted(event) {
    event.preventDefault();
    var searchTerm = "&inspectorIds=" + input.value.toUpperCase();
    var startDate = "&scheduledDateFrom=" + start.value;
    var endDate = "&scheduledDateTo=" + end.value;
    
    searchStart();
    search(searchTerm, startDate, endDate)
    .then(displayResults)
    .then(calcRoute);
}


//  Filter returned Accela API Array to only Scheduled or Rescheduled statuses
function filterResults(resultAll) {
    var scheduled = ["Scheduled"];
    var filteredArray = resultAll.result.filter(function(itm) {
        return scheduled.indexOf(itm.status.value) > -1;
    });
    return {result: filteredArray};
}

//  Call Accela API
function search(searchTerm, startDate, endDate) {
    API_URL = `${API_URL}${searchTerm}${startDate}${endDate}&limit=8`;
    request = new Request(API_URL, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-accela-appid': '636603438780966771',
            'Authorization': 'qsLB7gWOL_UECoRVOylL6BEs2zQSFtNTda9NyL8Z4GoP7YcP5rNwqmHizgrqwfyIz8JI2EXXNDJ5J5lFAYZv9G1ROBPHbve6lfCHI_-XyxD_2NWOJktMJ0JACGqMrigAOAxXDcVhycD3WbeVVhyRisR_vqhElwjJ43b94Efq_sTW3KsufAIQ58-ZIsj8OErqWCv5FAsBrR2sU-fvpUMkH9YS_V2k4YtugTA9LPicZGv-kVMs6MP7ZWlDTMXU6qamMfEA7pTWWtKXsxehZ8yy-jYLbUU_C5V1l2uGxTUTMDqxhhM_ktz9rLf7mVp_3KXiM8tYoudjW3A0SrYzet3JYXanJx9Iq4mhtY_V1d5wLWAeUgzauacCciuhrYvIDPCpjbGEnZY6qL3Af1o1K974h4eIAaTpx7yOONiKhaEh-tc1'
        })
    });
    return fetch(request)
    .then(response => response.json())
    .then(resultAll => filterResults(resultAll))
    .then(result => {
        return result.result;
    });
}

//  Display results in Table
function displayResults(returnResult) {
    returnResult.forEach(returnResultEach => {
        console.log(returnResultEach);
        var scheduledDateToShort = returnResultEach.scheduleDate.split("-");
        scheduledDateToShort = scheduledDateToShort[1] + "/" + scheduledDateToShort[2] + "/" + scheduledDateToShort[0];
        var tableRows = document.createElement("tr");
        var tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(returnResultEach.recordId.customId));
        tableRows.appendChild(tableElement);
        tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(returnResultEach.type.value));
        tableRows.appendChild(tableElement);
        tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(returnResultEach.address.streetStart + ' ' + returnResultEach.address.streetName + ' ' + returnResultEach.address.streetSuffix.text + ' ' + returnResultEach.address.streetSuffixDirection.text));
        tableElement.appendChild(document.createElement("br"));
        tableElement.appendChild(document.createTextNode(returnResultEach.address.city + ', ' + returnResultEach.address.state.text + ' ' + returnResultEach.address.postalCode));
        tableRows.appendChild(tableElement);
        tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(scheduledDateToShort));
        tableRows.appendChild(tableElement);
        tableSection.appendChild(tableRows);
        tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(returnResultEach.status.value));
        tableRows.appendChild(tableElement);
        tableSection.appendChild(tableRows);
        tableElement = document.createElement("td");
        tableElement.appendChild(document.createTextNode(returnResultEach.inspectorFullName));
        tableRows.appendChild(tableElement);
        tableSection.appendChild(tableRows);
        // Push full address to variable to pass into Google Maps routing
        fullLineAddresses.push(returnResultEach.address.streetStart + ' ' + returnResultEach.address.streetName + ' ' + returnResultEach.address.streetSuffix.text + ' ' + returnResultEach.address.streetSuffixDirection.text + ', ' + returnResultEach.address.city + ', ' + returnResultEach.address.state.text + ' ' + returnResultEach.address.postalCode);
    })
return fullLineAddresses;
}

//  Call Google Maps API
function calcRoute(fullLineAddresses) {
    var addresses = fullLineAddresses;
    console.log(addresses);
    var start = "90 Mitchell St SW, Atlanta, GA 30303";
    //var end = new google.maps.LatLng(38.334818, -181.884886);
    var end = "98 Mitchell St SW, Atlanta, GA 30303";
    var waypoints = [];
    for (var i = 0; i < addresses.length; i++) {
        waypoints.push({
            location: addresses[i],
            stopover: true
        });
    }
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
                summaryPanel.innerHTML += `<a href="https://maps.google.com/?q=${route.legs[j].start_address}" target="_blank">${route.legs[j].start_address.replace(/, USA|, United States/gi,"")}</a>` + ' to ';
                summaryPanel.innerHTML += `<a href="https://maps.google.com/?q=${route.legs[j].end_address}" target="_blank">${route.legs[j].end_address.replace(/, USA|, United States/gi,"")}</a>` + '<br>';
                summaryPanel.innerHTML += route.legs[j].distance.text + '<br><br>';
            }
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
}

/*function initialize() {
    directionsDisplay.setMap(map);
}

function mapLocation() {
    
    google.maps.event.addDomListener(window, 'load', initialize());
}*/