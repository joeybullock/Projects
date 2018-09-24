Remove Arborist Preliminary Review task from each workflow.  As a result, noticed that the Final Plan Coordination task would also not be needed.  Revise event scripts to accomodate changes to workflow tasks.

Created COMMERCIAL_V2018 workflow and process

Standard Choice Scripts

WTUA:Building/*/*/*

01 wfTask.equals("Arborist Review") && wfStatus.equals("Accepted Plan Review") ^ childId = createChild("Building","Arborist","Plan Review","NA",capName);  copyAppSpecific(childId); updateAppStatus("Pending - Building","Updated via script",childId);holdId=capId;capId=childId;copyParcelGisObjects();capId = holdId;

02 wfTask.equals("Arborist Review") && wfStatus.equals("Accepted Infrastructure") ^ childId = createChild("Building","Arborist","Infrastructure","NA",capName);  copyAppSpecific(childId);updateAppStatus("Pending - Building","Updated via script",childId);holdId=capId;capId=childId;copyParcelGisObjects();capId = holdId;

03 wfTask.equals("Plan Coordination") && wfStatus.equals("Ready to Issue") ^ branch ("CMN:Building/*/*/*:Technical Related CAPS");

WTUA:Building/Arborist/*/*

03 wfTask.equals("Arborist Review") && wfStatus.equals("Accepted Plan Review") ^ childId = createChild("Building","Arborist","Plan Review","NA",capName);  copyAppSpecific(childId);updateAppStatus("Pending - Building","Updated via script",childId);holdId=capId;capId=childId;copyParcelGisObjects();capId = holdId;


CMN:Building/Arborist/*/*:Parent CAP Update

