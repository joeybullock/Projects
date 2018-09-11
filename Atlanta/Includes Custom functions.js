function getScheduledInspIdForUnassignedInsp()
    {
    // warning, returns only the first scheduled occurrence
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess())
        {
        inspList = inspResultObj.getOutput();
		
        inspList.sort(compareInspDateDesc);
		
        for (xx in inspList) {
            try {
				inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
				if  (!inspUserObj.getUserID().getSuccess() && inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
				{ return inspList[xx].getIdNumber();
				} else {	
				return false;
			}
		} catch(err) {
			return false;
		}
        }   else {
			return false;
		}
	}
    
function assignUnassignedInspection(iNumber)
    {
    // updates the inspection and assigns to a new user
    // requires the inspection id and the user name
    //
    var capPrefix = capIDString.substr(0,2);
    var addressAttributes = loadAddressAttributes(attr);
    var streetSuffix = addressAttributes["AddressAttribute.StreetSuffix"];
    iObjResult = aa.inspection.getInspection(capId,iNumber);
    if (!iObjResult.getSuccess())
        { logDebug("**ERROR retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage()) ; return false ; }
    
    iObj = iObjResult.getOutput();
    
    iName = function () {
        if (capPrefix == "BB" && streetSuffix == "SE")
		{ return "TREHKLAU"; }
        else if (capPrefix == "BB" && streetSuffix == "SW")
        { return "GCONWAY"; }
        else if (capPrefix == "BE" && streetSuffix == "SE")
        { return "DLEMASTER"; }
        else if (capPrefix == "BE" && streetSuffix == "SW")
        { return "CFRAZIER"; }
        else if (capPrefix == "BM" && streetSuffix == "NW")
        { return "CDGATTLING"; }
        else if (capPrefix == "BM" && streetSuffix == "NE")
        { return "DREGISTER"; }
        else if (capPrefix == "BM" && streetSuffix == "SE")
        { return "WBRYANT"; }
        else if (capPrefix == "BM" && streetSuffix == "SW")
        { return "WLBARNWELL"; }
        else if (capPrefix == "BP" && (streetSuffix == "NW" || streetSuffix == "SW"))
        { return "CSTARR"; }
        else if (capPrefix == "BP" && streetSuffix == "NE")
        { return "AMARKELL"; }
        else if (capPrefix == "BP" && streetSuffix == "SE")
        { return "JDOCKERY"; }
        else if ((capPrefix == "BB" || capPrefix == "BM" || capPrefix == "BP") && addressAttributes["AddressAttribute.StreetName"].toUpperCase().substr(0,10) == "HARTSFIELD")
        { return "PPROCTOR"; }
        else if (capPrefix == "BE" && addressAttributes["AddressAttribute.StreetName"].toUpperCase().substr(0,10) == "HARTSFIELD")
        { return "COTHOMPSON"; }
		else
		{ return ""; }
    };
    iNameResult  = aa.person.getUser(iName);

    if (!iNameResult.getSuccess())
        { return true; }
    
    iInspector = iNameResult.getOutput();
    
    iObj.setInspector(iInspector);

    aa.inspection.editInspection(iObj);
    }

    
  
    
    
    
    
    
    
    
function getLastInspector(insp2Check)
    // function getLastInspector: returns the inspector ID (string) of the last inspector to result the inspection.
    //
    {
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess())
        {
        inspList = inspResultObj.getOutput();
        
        inspList.sort(compareInspDateDesc)
        for (xx in inspList)
            if (String(insp2Check).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
                {
                // have to re-grab the user since the id won't show up in this object.
                inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
                return inspUserObj.getUserID();
                }
        }
    return null;
    }

function compareInspDateDesc(a,b) { return (a.getScheduledDate().getEpochMilliseconds() < b.getScheduledDate().getEpochMilliseconds()); }

function getInspector(insp2Check)
    {
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess())
        {
        inspList = inspResultObj.getOutput();
        for (xx in inspList)
            if (String(insp2Check).equals(inspList[xx].getInspectionType()))
                {
                // have to re-grab the user since the id won't show up in this object.
                inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
                return inspUserObj.getUserID();
                }
        }
    return false;
    }
    
