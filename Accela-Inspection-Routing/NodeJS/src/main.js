//  Declare variables
var express = require("express");
var bodyParcer = require("body-parser");
var https = require("https");
var app = express();

//  API variables
console.log('running');
var API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
var accelaOptions = {
    host: 'apis.accela.com',
    port: 443,
    path: '/v4/inspections?module=Building',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-accela-appid': '636603438780966771',
        'Authorization': 'fbD2fS4UE1u2xUc9CjTNRnGthIk6SVvBvJxD7SF8XzgtYRTgzOD3EkLA3ovmFarM9zTXVpX4oalW1L3q6jsE_bTQLNSm5Oa297_seZeFbQnOdVd2sZTLkuIMAfTdQtnStKGtACPJ0Rxck0W_EdvT4LpJB_6Y44fWYXxjdbBgZkiHSp0zB5ER9PPegOtdM1I8p4wBdRrXcqmS6HguJR6z4DmugXZv4SLnJISYhYzSco47zQm6--CiDpgVGATZ52gfzhTwIyg8NJW6iaA0IQHprZUbRFz_abXOuaxgi8eoKPQQKG4pqWFIKpY6bv8c4CiT9zZEn08juU5CJjStpw1Yg3cz0D4vCYgZfuccLC9s2SNS4Gaz0Pl1Rr-RPVJs6hf1uqLku2SFoNtiYaxFbkIdPuT7o5JbLMU6qxzOHh-B4OruJoO7897n6QgRE7mhEkLY0'
    }
};
var request = {};

//  Inspection detail variables
var recordId = [];
var inspectionType = [];
var scheduleDate = [];
var scheduledDateToShort = [];
var inspectionStatus = [];
var inspectorFullName = [];
var fullLineAddresses = [];
var mapsReadyAddresses = [];

//  Date variables
const today = new Date();
const yyyymmdd = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);

//  Google Maps variables
const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=90+Mitchell+St+SW+Atlanta+GA&destination=98+Mitchell+St+SW+Atlanta+GA`;
var mapsReadyAddresses = '';

//  Set inspection search parameters
var startDate = '2018-05-01';
var endDate = '2018-07-31';
var inspectorId = 'JBULLOCK';

//  Clear contents before next search
function searchStart() {
    console.log('searchStart');
    recordId = [];
    inspectionType = [];
    scheduleDate = [];
    scheduledDateToShort = [];
    inspectionStatus = [];
    inspectorFullName = [];
    fullLineAddresses = [];
    API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
    request = {};
}

//  MAIN FUNCTION : Create variables from form input, search API, display results, and display route
function formSubmitted() {
    console.log('formSubmitted');
    var searchTerm = "&inspectorIds=" + inspectorId;
        startDate = "&scheduledDateFrom=" + startDate;
        endDate = "&scheduledDateTo=" + endDate;
    
    searchStart();
    search(searchTerm, startDate, endDate)
//    .then(displayResults)
//    .then(calcRoute);
}

//  Filter returned Accela API Array to only Scheduled or Rescheduled statuses
function filterResults(resultAll) {
    console.log('filterResults');
    var scheduled = ["Scheduled"];
    var filteredArray = resultAll.result.filter(function(itm) {
        return scheduled.indexOf(itm.status.value) > -1;
    });
    return {result: filteredArray};
}

//  Call Accela API
function search(searchTerm, startDate, endDate) {
    console.log('search');
    API_URL = `${API_URL}${searchTerm}${startDate}${endDate}`;
    https.get(accelaOptions, res => {
        console.log('Connected to Accela API');
        res.on('data', data => {
            console.log(data);
        });
        res.body = JSON.parse(res);
    })
    //return fetch(request)
    //.then(response => response.json())
    //.then(resultAll => filterResults(resultAll))
    //.then(result => {
    //    return result.result;
    //});
}

//  Push Accela API results to variable arrays
function displayResults(returnResult) {
    console.log('displayResults');
    returnResult.forEach(returnResultEach => {
        recordId.push(returnResultEach.recordId.customId);
        inspectionType.push(returnResultEach.type.value);
        scheduleDate = returnResultEach.scheduleDate.split("-");
        scheduledDateToShort.push(scheduleDate[1] + "/" + scheduleDate[2] + "/" + scheduleDate[0]);
        inspectionStatus.push(returnResultEach.status.value);
        inspectorFullName.push(returnResultEach.inspectorFullName);
        // Push address to variable to pass into Google Maps routing
        //fullLineAddresses.push(returnResultEach.address.streetStart + ' ' + returnResultEach.address.streetName + ' ' + returnResultEach.address.streetSuffix.text + ' ' + returnResultEach.address.streetSuffixDirection.text + ', ' + returnResultEach.address.city + ', ' + returnResultEach.address.state.text + ' ' + returnResultEach.address.postalCode);
        mapsReadyAddresses.push(returnResultEach.address.streetStart + '+' + returnResultEach.address.streetName + '+' + returnResultEach.address.streetSuffix.text + '+' + returnResultEach.address.streetSuffixDirection.text + '+' + returnResultEach.address.city + '+' + returnResultEach.address.state.text + '+' + returnResultEach.address.postalCode);
    })
return mapsReadyAddresses;
}

//  Call Google Maps API
function calcRoute(mapsReadyAddresses) {
    console.log('calcRoute');
    var addresses = mapsReadyAddresses;
    var waypoints = '';
    for (var i = 0; i < addresses.length; i++) {
        waypoints += addresses[i];
        if (addresses.length != i) waypoints += '|';
    }
    mapsLink = mapsLink + '&waypoints=' + waypoints;
    console.log(mapsLink);
}

formSubmitted();


/*function initialize() {
    directionsDisplay.setMap(map);
}

function mapLocation() {
    
    google.maps.event.addDomListener(window, 'load', initialize());
}*/
