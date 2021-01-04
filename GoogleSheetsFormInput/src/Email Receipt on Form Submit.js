var EMAIL_TEMPLATE_DOC_URL = "https://docs.google.com/document/d/1Lmja4QAUQPuuAEfUA_mQGDfvsng9VP-wN0bM_4KI11g/edit";
var EMAIL_SUBJECT = "Carpe Artista Receipt";
var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

/**
 * Installs a trigger on the Spreadsheet for when a Form response is submitted.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();
}

/**
 * Sends a customized email for every response on a form.
 * 
 * @param {Object} event - Form submit event
 */
function onFormSubmit(e) {
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
    EMAIL_TEMPLATE_DOC_URL = "https://docs.google.com/document/d/1RNMKpk60h-XV1XlpvhQkFcO_ml2aa3t5QdeCmDB5otY/edit";
  }
  var eventFundraiser = responses["Event/Fundraiser"][0];

  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();

  //  Get receipt number and append to response row
  var receiptNumber = createReceiptNumber(row);
  var receiptColumn = e.values.length + 1;
  sheet.getRange(row, receiptColumn).setValue(receiptNumber);

  //  Get remaining balance & trip amount and append to response row
  var tripAmountAndBalance = getBalance(name, trip)
  var tripAmount = tripAmountAndBalance[0];
  var balance = tripAmountAndBalance[1];
  var balanceColumn = e.values.length + 3;
  sheet.getRange(row, balanceColumn).setValue(balance);
  var tripAmountColumn = e.values.length + 4;
  sheet.getRange(row, tripAmountColumn).setValue(tripAmount);

  //  Handle Emails and create status
  if (sendEmail) {
    var emails = getEmails(name);
    var status = "";
    for (var m in emails) {
      MailApp.sendEmail({
        to: emails[m],
        subject: EMAIL_SUBJECT,
        htmlBody: createEmailBody(name, eventFundraiser, receiptNumber, amountPaid, trip, balance),
      });
      status += emails[m] + ";";
    }
    if (status) {
      status = status.slice(0,-1);
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
 * Creates email body and includes the links based on topic.
 *
 * @param {string} recipient - The recipient's email address.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} - The email body as an HTML string.
 */
function createEmailBody(name, eventFundraiser, receipt, paid, trip, balance) {
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
  row = "0" + row.toString();
  row = row.slice(-2);
  return year + month + date + row;
}

function getEmails(name) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var emailSheet = doc.getSheetByName("Emails");

  var headers = emailSheet.getRange(1, 1, 1, emailSheet.getLastColumn()).getValues()[0];
  var emails = [];
  var nameColumn = headers.indexOf("Name") + 1;
  var emailColumn = headers.indexOf("Email") + 1;
  if (emailColumn !== -1) {
    var data = emailSheet.getRange(2, nameColumn, emailSheet.getLastRow(), emailColumn).getValues();
    for (var e = 0; e < data.length; e++) {
      if (matches(data[e][nameColumn - 1], name)) {
        emails.push(data[e][emailColumn - 1]);
      }
    }
  }
  return emails;
}

function getBalance(name, trip) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var tripAmountsSheet = doc.getSheetByName("Trip Amounts");
  var tripAmount = 0;
  var headers = tripAmountsSheet.getRange(1, 1, 1, tripAmountsSheet.getLastColumn()).getValues()[0];
  var tripColumn = headers.indexOf("Trip") + 1;
  var amountColumn = headers.indexOf("Amount") + 1;
  if (amountColumn) {
    var data = tripAmountsSheet.getRange(2, 1, tripAmountsSheet.getLastRow(), tripAmountsSheet.getLastColumn()).getValues();
    for (var a = 0; a < data.length; a++) {
      if (matches(data[a][tripColumn - 1], trip)) {
        tripAmount += parseFloat(data[a][amountColumn - 1]);
      }
    }
  }

  var responsesSheet = doc.getSheetByName("Form Responses");
  var amountPaid = 0;
  var responseHeaders = responsesSheet.getRange(1, 1, 1, responsesSheet.getLastColumn()).getValues()[0];
  var nameColumn = responseHeaders.indexOf("Name") + 1;
  var amountPaidColumn = responseHeaders.indexOf("Amount Paid") + 1;
  var responseTripColumn = responseHeaders.indexOf("For Trip") + 1;
  if (amountPaidColumn) {
    var responseData = responsesSheet.getRange(2, 1, responsesSheet.getLastRow(), responsesSheet.getLastColumn()).getValues();
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

function matches(eVal, argList) {
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i] == eVal) {
      return true;
    }
  }
  return false;
}