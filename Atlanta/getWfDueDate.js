function getWfDueDate(JSDate){
	var wfDueDate = new Date(wfDue.getEpochMilliseconds());
	if(JSDate === undefined || JSDate == "N")
		return wfDueDate;
	else {
		var JSwfDueDate = (wfDueDate.getMonth() + 1) + "/" + wfDueDate.getDate() + "/" + wfDueDate.getFullYear();
		return JSwfDueDate;
	}
}