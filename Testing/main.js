//  Declare variables
var express = require("express");
var bodyParcer = require("body-parser");
var request = require("request");
var app = express();

//  API variables
console.log('running');
var API_URL = `https://egis.pinellas.gov/gis/rest/services/Accela/AccelaAddressParcel/MapServer/1/query?where=PGIS.PGIS.AccelaParcels.PIN='152801885600861400'&f=json&returnIdsOnly=false&returnCountOnly=false&outFields=PGIS.PGIS.AccelaParcels.HISTORICDISTRICT`;

//  MAIN FUNCTION : Create variables from form input, search API, display results, and display route
function formSubmitted() {
    console.log('formSubmitted');
    search();
//   displayResults(result);
//    calcRoute(mapsReadyAddresses);
}

//  Call Accela API
function search() {
    console.log('searching: ' + API_URL);
    request(API_URL, {json: true}, (err, res, body) => {
        if (err) {return console.log(err);}
        console.log('statusCode: ' + res.statusCode);
        var resp = res.body;
        console.log(resp.length);

 //       console.log(resp.features);
 //       console.log(resp.features.[{attributes.].values);
        var key1 = Object.keys(resp);
 //       console.log(resp);

        console.log(resp.features[0].attributes['PGIS.PGIS.AccelaParcels.HISTORICDISTRICT']);

    });
}

formSubmitted();