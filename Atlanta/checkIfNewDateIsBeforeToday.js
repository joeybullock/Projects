function checkIfNewDateIsBeforeToday(inputdate){
	var now = new Date();
		if(now.getTime() < inputdate.getTime())
			return false;
		else
			return true;
}