// Enter sheet name where data is stored
var SHEET_NAME = "Sheet1";

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// This function glues spreadsheet and Apps Script project
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("key", doc.getId());
}

function doGet() {
  return HtmlService
      .createTemplateFromFile('Index')
      .evaluate();
}

function getDataFromSheet(column_name='temp') {
  try{
    // Alternatively, you can hard code spreadsheet here
		// eg. SpreadsheetApp.openById("1AcsuboS3xxk0kj02ACcE_j4ASb8GrxyZscTU5IM-wqc")

  	var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
		var sheet = doc.getSheetByName(SHEET_NAME);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    //Find column by name
    column = headers.indexOf(column_name);

    var data = [];
    if(column !== -1) {
      data = sheet.getRange(2, column + 1, sheet.getLastRow(), 1).getValues()
    }
    var results = [];

    //Get data from column and parse it to Chart.js format
    for (row in data) {
      y = data[row][0]
      results.push({
        "x": row,
        "y": Math.round(y * 100) / 100
      })
    }

    return results;
  }
  catch (e) {
    return []
  }

}

function getHistogramData() {
    try{

  	var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
		var sheet = doc.getSheetByName("Pivot Table 1");


    var data = sheet.getRange(2, 1, 8, 2).getValues();


    var results = [];

    //Get data and parse it to Chart.js format
    for (row in data) {
      results.push({
        "x": data[row][0],
        "y": data[row][1]
      })
    }
    Logger.log(results);

    return results;
  }
  catch (e) {
    Logger.log(e);
    return []
  }
}