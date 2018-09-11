function sendNotificationSimple(notificationTemplate, sendToUser) {
	// Validate arguments and plug-in defaults if blank
	if (!notificationTemplate) {
		logDebug("**ERROR: Email Template not defined."); return false;
	}
	if (!sendToUser) {
		sendToUser = "N";
	}
	var contactTypesArray = new Array();
	if (arguments.length>2) {
	for (var i=1; i<arguments.length; i++) 
		contactTypesArray.push(arguments[i]);
	} else {
		contactTypesArray.push("Applicant");
	}
	// Provide the ACA URl - This should be set in INCLUDES_CUSTOM_GLOBALS
	var acaURL = "aca3.accela.com/atlanta_ga"
	// Provide the Agency Reply Email - This should be set in INCLUDES_CUSTOM_GLOBALS
	var agencyReplyEmail = "accela_noreply@atlantaga.gov"
	// Provide the name of the report from Report Manager
	var reportName = "";
	// Get an array of Contact Objects using Master Scripts 3.0
	var contactObjArray = getContactObjs(capId,contactTypesArray);
	// Set the report parameters. For Ad Hoc use p1Value, p2Value etc.
	var rptParams = aa.util.newHashMap();
	//rptParams.put("serviceProviderCode",servProvCode);
	rptParams.put("p1Value", capIDString);
	// Get User's First Name, Last Name, Email Address, and Phone Number
	var userObj = systemUserObj;
	var userFirstName = userObj.getFirstName();
	var userLastName = userObj.getLastName();
	var userEmail = userObj.getEmail();
	var userPhone = userObj.getPhoneNumber();
	// Call runReportAttach to attach the report to Documents Tab
	var attachResults = null //runReportAttach(capId,reportName,"p1Value",capIDString);
	
	for (iCon in contactObjArray) {
		var tContactObj = contactObjArray[iCon];
		logDebug("ContactName: " + tContactObj.people.getFirstName() + " " + tContactObj.people.getLastName());
		
		if (!matches(tContactObj.people.getEmail(),null,undefined,"")) {
			var contactEmail = tContactObj.people.getEmail();
			logDebug("Contact Email: " + contactEmail);
			var eParams = aa.util.newHashtable();
			//create parameters for notification
			addParameter(eParams, "$$userFirstName$$", userFirstName);
			addParameter(eParams, "$$userLastName$$", userLastName);
			addParameter(eParams, "$$userEmail$$", userEmail);
			addParameter(eParams, "$$userPhone$$", userPhone);
			addParameter(eParams, "$$recordTypeAlias$$", cap.getCapType().getAlias());
			
			getRecordParams4Notification(eParams);
			getACARecordParam4Notification(eParams,acaURL);
			tContactObj.getEmailTemplateParams(eParams);
			//getInspectionScheduleParams4Notification(eParams);
			getPrimaryAddressLineParam4Notification(eParams);
			
			if(!matches(reportName,null,undefined,"")){
				// Call runReport4Email to generate the report and send the email
				runReport4Email(capId,reportName,tContactObj,rptParams,eParams,notificationTemplate,cap.getCapModel().getModuleName(),agencyReplyEmail);	
			}
			else{
				if (sendToUser == "Y") {
				sendNotification(agencyReplyEmail,contactEmail,userEmail,notificationTemplate,eParams,null);
				} else {
				// Call sendNotification if you are not using a report
				sendNotification(agencyReplyEmail,contactEmail,"",notificationTemplate,eParams,null);
				}
			}
		}
	}
}