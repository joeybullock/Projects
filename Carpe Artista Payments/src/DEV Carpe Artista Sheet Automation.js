var EMAIL_TEMPLATE_DOC_URL =        "";
var EVENT_EMAIL_TEMPLATE_DOC_URL =  "";
var FORM_ID =                       "";
var FORM_ITEM_FOR_TRIP =            "225290537";
var FORM_ITEM_NAME =                "2032958687";
var EMAIL_SUBJECT =                 "Carpe Artista Receipt";
var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

/*---------------------------
Developed for Carpe Artista by Joey Bullock (joeybullock@gmail.com), December 2020
V1: On form submit, calculate balance remaining, trip amount, and receipt number. Generate and send email with receipt.
V2: Remove 'Trip Amount' calculation by script to allow sheet formula to calculate. Repurpose calculate 'Balance Remaining' to 'Balance Remaining at time of payment' because
    sheet formula now calculates total balance remaining. Add menu scripts for 'Recalc Balance Remaining at time of payment' and 'Send receipt emails for selected rows'.
V3: Add 'Create new trip' menu script
V4: Update recalculateBalanceRemaining function to calculate much faster
---------------------------*/

/**
 * Form ID's:
Name: 2032958687
Amount Paid: 602672250
For Trip: 225290537
: 449691158
Send Email Receipt: 1254954954
Payment or Event: 407454692
Date Paid: 57021869
Notes (Check Number, Payment Method, etc): 241945240
Event/Fundraiser Info: 144043923
Event/Fundraiser: 411551078
 */

/**
 * Installs a trigger on the Spreadsheet for when a Form response is submitted.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();
}

function onOpen() {
  replaceNameHeader();
  //  Create 'Scripts' menu
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Scripts')
  .addItem('Create new person', 'createNewPerson')
  .addItem('Create new trip', 'createNewTrip')
  .addItem('Send receipt emails for selected rows', 'sendEmailAgain')
  .addItem('Recalc Balance Remaining at time of payment', 'recalculateBalanceRemaining')
  .addToUi();
}

/**
 * Sends a customized email for every response on a form.
 * 
 * @param {Object} event - Form submit event
 */
function onFormSubmit(e) {
  //  Make sure Name header is there
  replaceNameHeader();

  var responses = e.namedValues;

  // If the question title is a label, it can be accessed as an object field.
  // If it has spaces or other characters, it can be accessed as a dictionary.
  var timestamp = responses.Timestamp[0];
  var name = responses.Name[0].trim();
  var amountPaid = responses["Amount Paid"][0].trim();
  var trip = responses["For Trip"][0];
  var date = responses["Date Paid"][0];
  var sendEmail = responses["Send Email Receipt"][0] == "Send";
  var paymentOrEvent = responses["Payment or Event"][0];
  if (paymentOrEvent == "Event/Fundraiser") {
    EMAIL_TEMPLATE_DOC_URL = EVENT_EMAIL_TEMPLATE_DOC_URL;
  }
  var eventFundraiser = responses["Event/Fundraiser"][0];
  var notes = responses["Notes (Check Number, Payment Method, etc)"][0];
  if (!notes) notes = "";

  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();

  //  Get receipt number and append to response row
  var receiptNumber = createReceiptNumber(row);
  var receiptColumn = e.values.length + 1;
  sheet.getRange(row, receiptColumn).setValue(receiptNumber);

  //  Get remaining balance & trip amount and append to response row
  var tripAmountAndBalance = getBalance(name, trip, null);
  var tripAmount = tripAmountAndBalance[0];
  var balance = tripAmountAndBalance[1];
  var balanceColumn = e.values.length + 4;
  sheet.getRange(row, balanceColumn).setValue(balance);
  /*  sheet formula will calculate trip amounts from now on
  var tripAmountColumn = e.values.length + 5;
  sheet.getRange(row, tripAmountColumn).setValue(tripAmount);
  */

  //  Handle Emails and create status
  if (sendEmail) {
    var emails = getEmails(name);
    var status = "";
    for (var m in emails) {
      MailApp.sendEmail({
        to: emails[m],
        subject: EMAIL_SUBJECT,
        htmlBody: createEmailBody(name, eventFundraiser, receiptNumber, amountPaid, trip, balance, notes),
      });
      status += emails[m] + ";";
    }
    if (status) {
      status = status.slice(0, -1);
    } else {
      status = "No email found";
    }
  } else {
    status = "No email sent";
  }


  //  Append the status to response row
  var statusColumn = e.values.length + 2;
  sheet.getRange(row, statusColumn).setValue(status);


  //  Log info
  Logger.log("status=" + status + "; receipt=" + receiptNumber + "; balance=" + balance + "; responses=" + JSON.stringify(responses));
}

/**
 * Creates email body from Google Doc and replaces variables with passed params
 * @return {string} - The email body as an HTML string.
 */
function createEmailBody(name, eventFundraiser, receipt, paid, trip, balance, notes) {
  /*
  var topicsHtml = topics.map(function(topic) {
  var url = topicUrls[topic];
    return '<li><a href="' + url + '">' + topic + '</a></li>';
  }).join('');
  topicsHtml = '<ul>' + topicsHtml + '</ul>';
  */
  // Make sure to update the emailTemplateDocId at the top.
  var docId = DocumentApp.openByUrl(EMAIL_TEMPLATE_DOC_URL).getId();
  var emailBody = docToHtml(docId);
  emailBody = emailBody.replace(/{{NAME}}/g, name);
  emailBody = emailBody.replace(/{{EVENTFUNDRAISER}}/g, eventFundraiser);
  emailBody = emailBody.replace(/{{RECEIPT}}/g, receipt);
  emailBody = emailBody.replace(/{{AMOUNTPAID}}/g, paid);
  emailBody = emailBody.replace(/{{DESTINATION}}/g, trip);
  emailBody = emailBody.replace(/{{BALANCE}}/g, balance);
  if (notes) notes = "Notes: " + notes;
  emailBody = emailBody.replace(/{{NOTES}}/g, notes);
  return emailBody;
}

/**
 * Downloads a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {

  // Downloads a Google Doc as an HTML string.
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" +
    docId + "&exportFormat=html";
  var param = {
    method: "get",
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}

function createReceiptNumber(row) {
  var today = new Date();
  var year = today.getFullYear().toString().slice(-2);
  var month = "0" + String(today.getMonth() + 1);
  month = month.slice(-2);
  var date = "0" + String(today.getDate());
  date = date.slice(-2);
  row = "00" + row.toString();
  row = row.slice(-3);
  return year + month + date + row;
}

function getEmails(name) {
  replaceNameHeader();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var emailSheet = doc.getSheetByName("Emails");

  var headers = emailSheet.getRange(1, 1, 1, emailSheet.getLastColumn()).getValues()[0];
  var emails = [];
  var nameColumn = headers.indexOf("Name") + 1;
  var emailColumn = headers.indexOf("Email") + 1;
  if (emailColumn) {
    var data = emailSheet.getRange(2, nameColumn, emailSheet.getLastRow(), emailColumn).getValues();
    for (var e = 0; e < data.length; e++) {
      if (data[e][nameColumn - 1] && data[e][nameColumn - 1].toUpperCase().indexOf(name.toUpperCase()) > -1) {
        emails.push(data[e][emailColumn - 1]);
      }
    }
  }
  return emails;
}

function getBalance(name, trip, toRow) {
  replaceNameHeader();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var tripAmountsSheet = doc.getSheetByName("Trip Amounts");
  var tripAmount = 0;
  var headers = tripAmountsSheet.getRange(1, 1, 1, tripAmountsSheet.getLastColumn()).getValues()[0];
  var tripColumn = headers.indexOf("Trip") + 1;
  var amountColumn = headers.indexOf("Amount") + 1;
  if (amountColumn) {
    var data = tripAmountsSheet.getRange(2, 1, tripAmountsSheet.getLastRow(), tripAmountsSheet.getLastColumn()).getValues();
    //  Look for individualized trip amounts
    for (var a = 0; a < data.length; a++) {
      if ((data[a][tripColumn - 1]) && (data[a][tripColumn - 1].toUpperCase().indexOf(trip.toUpperCase()) > -1 && data[a][tripColumn - 1].toUpperCase().indexOf(name.toUpperCase()) > -1)) {
        tripAmount = parseFloat(data[a][amountColumn - 1]);
      }
    }
    //  If individualized trip amounts not found, look for general trip amounts
    if (!tripAmount) {
      for (var b = 0; b < data.length; b++) {
        if ((data[b][tripColumn - 1]) && (data[b][tripColumn - 1].toUpperCase().indexOf(trip.toUpperCase()) > -1 && data[b][tripColumn - 1].indexOf("-") == -1)) {
          tripAmount = parseFloat(data[b][amountColumn - 1]);
        }
      }
    }
  }

  var responseSheet = doc.getSheetByName("Form Responses");
  if (!toRow) toRow = responseSheet.getLastRow();
  var amountPaid = 0;
  var responseHeaders = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  var nameColumn = responseHeaders.indexOf("Name") + 1;
  var amountPaidColumn = responseHeaders.indexOf("Amount Paid") + 1;
  var responseTripColumn = responseHeaders.indexOf("For Trip") + 1;
  if (amountPaidColumn) {
    var responseData = responseSheet.getRange(2, 1, toRow, responseSheet.getLastColumn()).getValues();
    for (var p = 0; p < responseData.length; p++) {
      if (matches(responseData[p][nameColumn - 1], name)) {
        if (matches(responseData[p][responseTripColumn - 1], trip)) {
          amountPaid += parseFloat(responseData[p][amountPaidColumn - 1]);
        }
      }
    }
  }
  //  Log trip amount
  var tripAmountAndBalance = [];
  tripAmountAndBalance.push(tripAmount);
  tripAmountAndBalance.push((tripAmount - amountPaid).toFixed(2))
  return tripAmountAndBalance;
}

function recalculateBalanceRemaining() {
  replaceNameHeader();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var responseSheet = doc.getSheetByName("Form Responses");
  var responseHeaders = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  var nameColumn = responseHeaders.indexOf("Name") + 1;
  var amountPaidColumn = responseHeaders.indexOf("Amount Paid") + 1;
  var forTripColumn = responseHeaders.indexOf("For Trip") + 1;
  var datePaidColumn = responseHeaders.indexOf("Date Paid") + 1;
  var balanceRemainingColumn = responseHeaders.indexOf("Balance Remaining at time of payment") + 1;
  var tripAmountColumn = responseHeaders.indexOf("Trip Amount") + 1;
  var responseData = responseSheet.getRange(2, 1, responseSheet.getLastRow(), responseSheet.getLastColumn()).getValues();

  var person = [];
  //  Build object array for each row
  person = responseData.map(function (n, i) {
    return {personsName: n[nameColumn-1],
            datePaid: n[datePaidColumn-1],
            paid: n[amountPaidColumn-1],
            trip: n[forTripColumn-1],
            tripTotal: n[tripAmountColumn-1],
            balanceRemaining: 0,
            originalIndex: i
           }
  });
  //  Sort by name, then trip, then date paid
  person.sort(function (a, b) {
    return a.personsName.localeCompare(b.personsName) || a.trip.localeCompare(b.trip) || a.datePaid - b.datePaid;
  });
  //  Calculate balance remaining for each person/trip
  for (var pi = 0; pi < person.length; pi++) {
    var item = person[pi];
    var previous = person[pi - 1];
    if (pi === 0 || (item.personsName !== previous.personsName || item.trip !== previous.trip)) {
      item.balanceRemaining = item.tripTotal - item.paid;
    } else {
      item.balanceRemaining = previous.balanceRemaining - item.paid;
    }
  }
  //  Update spreadsheet with balance remaining
  for (var eachItem = 0; eachItem < person.length + 1; eachItem++) {
    var currentPerson = person[eachItem];
    if (currentPerson && currentPerson.personsName && !isNaN(currentPerson.balanceRemaining)) {
      responseSheet.getRange(currentPerson.originalIndex+2, balanceRemainingColumn).setValue(currentPerson.balanceRemaining);
    }
  }
  doc.toast("Recalculate Balance Remaining at time of payment complete!");
}

function sendEmailAgain() {
  //  Make sure things are up to date
  replaceNameHeader();
  //  Make sure they're selecting from the Form Responses sheet
  var ui = SpreadsheetApp.getUi();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var selection = sheet.getSelection();
  if (selection.getActiveSheet().getName() != "Form Responses") {
    //  Can't run if selected range isn't on the Form Responses sheet
    ui.alert("Please select rows in the Form Responses sheet to send emails");
    return;
  }
  var ranges = selection.getActiveRangeList().getRanges();
  //Logger.log("ranges.length: " + ranges.length);
  var rows = [];
  for (var range in ranges) {
    var firstRowInRange = ranges[range].getRow();
    rows.push(firstRowInRange);
    //Logger.log("firstRowInRange: " + firstRowInRange);
    if (ranges[range].getNumRows() > 1) {
      for (var rr = 1; rr < ranges[range].getNumRows(); rr++) {
        var nextRow = firstRowInRange + rr;
        //Logger.log("nextRow: " + nextRow);
        rows.push(nextRow);
      }
    }
  }
  if (!rows.length) return;
  var prompt = ui.alert("Send emails to people from rows " + rows.sort().join(", ") + "?", ui.ButtonSet.YES_NO);
  if (prompt != ui.Button.YES) {
    return;
  }

  //  Get header names
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  //  Get column numbers
  var nameColumn = headers.indexOf("Name") + 1;
  var sendEmailReceiptColumn = headers.indexOf("Send Email Receipt") + 1;
  var emailSentColumn = headers.indexOf("Email Sent") + 1;
  var eventFundraiserColumn = headers.indexOf("Event/Fundraiser") + 1;
  var forTripColumn = headers.indexOf("For Trip") + 1;
  var amountPaidColumn = headers.indexOf("Amount Paid") + 1;
  var receiptNumberColumn = headers.indexOf("Receipt Number") + 1;
  var balanceRemainingColumn = headers.indexOf("Current Balance Remaining") + 1;
  var notesColumn = headers.indexOf("Notes (Check Number, Payment Method, etc)") + 1;

  //  For each distinct row
  for (var row = 0; row < rows.length; row++) {
    //  Get all the values for the row
    var name = sheet.getRange(rows[row], nameColumn).getValue();
    var eventFundraiser = sheet.getRange(rows[row], eventFundraiserColumn).getValue();
    var forTrip = sheet.getRange(rows[row], forTripColumn).getValue();
    var amountPaid = sheet.getRange(rows[row], amountPaidColumn).getValue();
    var receiptNumber = sheet.getRange(rows[row], receiptNumberColumn).getValue();
    var balanceRemaining = sheet.getRange(rows[row], balanceRemainingColumn).getValue();
    var notes = sheet.getRange(rows[row], notesColumn).getValue();
    if (!notes) notes = "";
    //  Get the email addresses
    var emails = getEmails(name);
    var status = "";
    for (var m in emails) {
      MailApp.sendEmail({
        to: emails[m],
        subject: EMAIL_SUBJECT,
        htmlBody: createEmailBody(name, eventFundraiser, receiptNumber, amountPaid, forTrip, balanceRemaining, notes),
      });
      status += emails[m] + ";";
    }
    if (status) {
      status = status.slice(0, -1);
    } else {
      status = "No email found";
    }
    sheet.getRange(rows[row], sendEmailReceiptColumn).setValue("Send");
    sheet.getRange(rows[row], emailSentColumn).setValue(status);
  }
  doc.toast("Emails sent!");
}

function createNewTrip() {
  //  Make sure name header is there
  replaceNameHeader();
  //  continue
  var ui = SpreadsheetApp.getUi();
  var newTrip = ui.prompt("What's the name of the new trip?");
  if (newTrip.getSelectedButton() == ui.Button.OK) {
    newTrip = newTrip.getResponseText();
  } else {
    return;
  }
  var costOfNewTrip = ui.prompt("What's the cost of a singular trip?");
  if (costOfNewTrip.getSelectedButton() == ui.Button.OK) {
    costOfNewTrip = costOfNewTrip.getResponseText();
  } else {
    return;
  }
  var verify = ui.alert("Create new trip " + newTrip + " with a cost of " + costOfNewTrip + "?", ui.ButtonSet.YES_NO);
  if (verify != ui.Button.YES) {
    return;
  }
  //  Insert trip into form
  var form = FormApp.openById(FORM_ID);
  var forTripItem = form.getItemById(FORM_ITEM_FOR_TRIP).asMultipleChoiceItem();
  var currentTripChoices = forTripItem.getChoices();
  var choices = [];
  choices.push(newTrip);
  for (var ec in currentTripChoices) {
    choices.push(currentTripChoices[ec].getValue());
  }
  forTripItem
    .setChoiceValues(choices)
    .showOtherOption(false);
  //  Insert trip cost into Trip Amounts sheet
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var tripsSheet = doc.getSheetByName("Trip Amounts");
  tripsSheet.insertRowBefore(2);
  tripsSheet.getRange(2, 1).setValue(newTrip);
  tripsSheet.getRange(2, 2).setValue(costOfNewTrip);
  //  Create new Summary sheet
  var pivotTableSheetCopyFrom = doc.getSheetByName("Houston Summary");
  var pivotTableSheetCopyTo = pivotTableSheetCopyFrom.copyTo(doc);
  pivotTableSheetCopyTo.setName(newTrip + " Summary");
  //  Get pivot table
  var pivotTableCopyTo = pivotTableSheetCopyTo.getPivotTables()[0]
  var pivotTableCopyToFilters = pivotTableCopyTo.getFilters();
  //  remove existing filters
  pivotTableCopyToFilters.map(f => f.remove());
  //  create new filter criteria
  var newFilterCriteria = SpreadsheetApp.newFilterCriteria()
    .setVisibleValues([newTrip])
    .build();
  //  apply new filter criteria to copied pivot table
  pivotTableCopyTo.addFilter(4, newFilterCriteria);
  //  customize the new sheet tab
  //  move to position 1
  doc.setActiveSheet(pivotTableSheetCopyTo)
  doc.moveActiveSheet(1);
  //  pick random color
  var lightColors = ["LightCoral", "PaleGreen", "Cornsilk", "LightPink", "LightBlue", "Lavender"];
  var darkColors = ["Crimson", "Green", "Goldenrod", "MediumVioletRed", "RoyalBlue", "MediumOrchid"];
  var randomColorNumber = Math.floor(Math.random() * lightColors.length);
  var lightColor = lightColors[randomColorNumber];
  var darkColor = darkColors[randomColorNumber];
  //  set tab color
  pivotTableSheetCopyTo.setTabColor(darkColor);
  //  set background cell color
  pivotTableSheetCopyTo.getRange(1, 3).setBackground(darkColor);
  pivotTableSheetCopyTo.getRange(1, 4).setBackground(lightColor);
  //  edit charts
  var charts = pivotTableSheetCopyTo.getCharts();
  //  edit bar chart
  var barChartBuilder = charts[0].modify().setOption('title', newTrip).asColumnChart().setColors([darkColor, lightColor]);
  pivotTableSheetCopyTo.updateChart(barChartBuilder.build());
  /*  for some reason, scorecard charts are not editable via script
  //  edit paid scorecard chart
  var paidScoreChart = charts[1].modify().setOption('colors', [darkColor]).setOption('title', newTrip + " Total Paid");
  pivotTableSheetCopyTo.updateChart(paidScoreChart.build());
  //  edit balance scorecard chart
  var balanceScoreChart = charts[2].modify().setOption('colors', [lightColor]).setOption('title', newTrip + " Total Balance");
  pivotTableSheetCopyTo.updateChart(balanceScoreChart.build());
  */
 doc.toast("New trip " + newTrip + " created!");
}

function createNewPerson() {
  //  Make sure name header is there
  replaceNameHeader();

  //  Prompt for new name
  var ui = SpreadsheetApp.getUi();
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var newPerson = ui.prompt("Who do you want to add?");
  if (newPerson.getSelectedButton() == ui.Button.OK) {
    var newPersonResponse = newPerson.getResponseText();
  } else {
    return;
  }
  //  Get full trips from Trip Amounts page
  var tripsSheet = doc.getSheetByName("Trip Amounts");
  var tripsHeaders = tripsSheet.getRange(1, 1, 1, tripsSheet.getLastColumn()).getValues()[0];
  var tripsTripColumn = tripsHeaders.indexOf("Trip") + 1;
  var tripsAmountColumn = tripsHeaders.indexOf("Amount") + 1;
  var tripsNotesColumn = tripsHeaders.indexOf("Notes") + 1;
  var fullTrips = [];
  if (tripsTripColumn) {
    var tripData = tripsSheet.getRange(2, tripsTripColumn, tripsSheet.getLastRow(), tripsTripColumn).getValues();
    for (var ta = 0; ta < tripData.length; ta++) {
      if (tripData[ta][0] && tripData[ta][0].indexOf("-") == -1) {
        fullTrips.push(tripData[ta][0]);
      }
    }
  }
  //  Prompt for trips to associate
  var tripsArray = [];
  for (var ft in fullTrips) {
    var tripsPrompt = ui.alert("Is " + newPersonResponse + " going on the " + fullTrips[ft] + " trip?", ui.ButtonSet.YES_NO);
    if (tripsPrompt == ui.Button.YES) {
      tripsArray.push(fullTrips[ft]);
    }
  }
  //  Prompt for emails
  var emailsToAdd = ui.prompt("Emails to add for new person " + newPersonResponse + " (comma separated if more than one)");
  if (emailsToAdd.getSelectedButton() == ui.Button.OK) {
    var emailsToAddResponse = emailsToAdd.getResponseText();
    if (emailsToAddResponse) {
      var emailsToAddArray = emailsToAddResponse.split(",").map(a => a.trim());
      var emailsSheet = doc.getSheetByName("Emails");
      var emailsHeaders = emailsSheet.getRange(1, 1, 1, emailsSheet.getLastColumn()).getValues()[0];
      var emailsNameColumn = emailsHeaders.indexOf("Name") + 1;
      var emailsEmailColumn = emailsHeaders.indexOf("Email") + 1;
      for (var emails in emailsToAddArray) {
        emailsToAddArray[emails] = emailsToAddArray[emails].trim();
        emailsSheet.insertRowBefore(2);
        emailsSheet.getRange(2, emailsNameColumn).setValue(newPersonResponse);
        emailsSheet.getRange(2, emailsEmailColumn).setValue(emailsToAddArray[emails]);
      }
      let emailsSortOrder = [
        {column: emailsNameColumn, ascending: true},
        {column: emailsEmailColumn, ascending: true}
      ];
      emailsSheet.getRange(2, 1, emailsSheet.getLastRow(), emailsSheet.getLastColumn()).sort(emailsSortOrder);
    }
  }
  //  Create custom trip amounts if needed
  for (var t in tripsArray) {
    var customTripAmount = ui.prompt("Custom amount to pay for " + newPersonResponse + " going on the " + tripsArray[t] + " trip (just close this box if it's the normal amount)");
    if (customTripAmount.getSelectedButton() == ui.Button.OK) {
      var customTripAmountResponse = customTripAmount.getResponseText();
      if (customTripAmountResponse) {
        //  Insert trip cost into Trip Amounts sheet
        tripsSheet.insertRowBefore(2);
        tripsSheet.getRange(2, tripsTripColumn).setValue(tripsArray[t] + " - " + newPersonResponse);
        tripsSheet.getRange(2, tripsAmountColumn).setValue(customTripAmountResponse);
      }
    }
  }
  let tripsSortOrder = [
    {column: tripsTripColumn, ascending: true},
    {column: tripsAmountColumn, ascending: true},
    {column: tripsNotesColumn, ascending: true}
  ];
  tripsSheet.getRange(2, 1, tripsSheet.getLastRow(), tripsSheet.getLastColumn()).sort(tripsSortOrder);
  //  Create new person in the form
  var form = FormApp.openById(FORM_ID);
  var nameItem = form.getItemById(FORM_ITEM_NAME).asListItem();
  var currentNameChoices = nameItem.getChoices();
  var choices = [];
  choices.push(newPersonResponse);
  for (var ec in currentNameChoices) {
    choices.push(currentNameChoices[ec].getValue());
  }
  choices.sort();
  nameItem
    .setChoiceValues(choices);
  doc.toast("New person " + newPersonResponse + " created!");
}

function replaceNameHeader() {
  //  Replace Name header if missing
  var doc = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses");
  var nameHeader = doc.getRange(1, 2).getValue();
  if (!nameHeader) doc.getRange(1, 2).setValue("Name");
}

function matches(eVal, argList) {
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i] == eVal) {
      return true;
    }
  }
  return false;
}

function distinctArray(array) {
  return [...new Set(array)];
}