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
    //port: 443,
    path: '/v4/inspections?module=Building',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-accela-appid': '636603438780966771',
        'Authorization': 'UpUmXEZdVU86B5Xj6XNBphRL5jeWrHpP85PA1tZbPnJ9WvamrBCsB1X2yyR1in2kogvKE8QkIR4ruPds4GGcTxAE6Avl1LfSox0_5YQChlZ6xUv8-K12A6tLTTTHKkqPwwigFzAVJKo2QgMCgiUBuOwI3KoFsOqoiCtrXlXg--qu0RrGCSLnEJoBZS64jFQEHvODLEjRPEbbA0S0QZ2lT0qo4c5h5rRMF6BaUKsPEqBrYEjF4819egyvPiXiY62F6c31ttIt8U8Av7BvbcznhqpGKOsVxcCl9IccbbM6v6wqreng7cZ_n_I_obyvJLDA-hDnP3_7eloLAcg5OahkhE116i8HC9mtXSSFKqp_KjIHkYGCQQXIhCWleXdV2QoAbX3Kt3pbt80GSpnyTX7n5ia9Y1Y9i0vt_3PskAodhHuOWRWq7g36R5C0YimDDhs40'
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
    var searchTerm = "&inspectorIds=" + inspectorId,
        startDate = "&scheduledDateFrom=" + startDate,
        endDate = "&scheduledDateTo=" + endDate;
    
    searchStart();
    search(searchTerm, startDate, endDate);
//   displayResults(result);
//    calcRoute(mapsReadyAddresses);
}

//  Filter returned Accela API Array to only Scheduled or Rescheduled statuses
function filterResults(resultAll) {
    console.log('filterResults');
    let scheduled = ["Scheduled"];
    let filteredArray = resultAll.result.filter(function(itm) {
        return scheduled.indexOf(itm.status.value) > -1;
    });
    console.log('result: ' + filteredArray);
    return {result: filteredArray};
}

//  Call Accela API
function search(searchTerm, startDate, endDate) {
    console.log('search');
    console.log('path: ' + accelaOptions.host + accelaOptions.path);
    API_URL = `${API_URL}${searchTerm}${startDate}${endDate}`;
    https.request(accelaOptions, (res) => {
        console.log('statusCode: ' + res.statusCode);
        var data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('Length of data: ' + Object.keys(data).length);
            var dataParsed = JSON.parse(data);
            console.log('Length of dataParsed: ' + Object.keys(dataParsed).length);
            var filteredResults = filterResults(dataParsed);
            displayResults(filteredResults);
        });
        
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    }).end();
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
        //recordId.push(returnResultEach.recordId.customId);
        //inspectionType.push(returnResultEach.type.value);
        //scheduleDate = returnResultEach.scheduleDate.split("-");
        //scheduledDateToShort.push(scheduleDate[1] + "/" + scheduleDate[2] + "/" + scheduleDate[0]);
        //inspectionStatus.push(returnResultEach.status.value);
        //inspectorFullName.push(returnResultEach.inspectorFullName);
        // Push address to variable to pass into Google Maps routing
        fullLineAddresses.push(returnResultEach.address.streetStart + ' ' + returnResultEach.address.streetName + ' ' + returnResultEach.address.streetSuffix.text + ' ' + returnResultEach.address.streetSuffixDirection.text + ', ' + returnResultEach.address.city + ', ' + returnResultEach.address.state.text + ' ' + returnResultEach.address.postalCode);
        //mapsReadyAddresses.push(returnResultEach.address.streetStart + '+' + returnResultEach.address.streetName + '+' + returnResultEach.address.streetSuffix.text + '+' + returnResultEach.address.streetSuffixDirection.text + '+' + returnResultEach.address.city + '+' + returnResultEach.address.state.text + '+' + returnResultEach.address.postalCode);
    });
    console.log(mapsReadyAddresses[0]);
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
