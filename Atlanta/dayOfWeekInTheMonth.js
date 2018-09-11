function dayOfWeekInTheMonth(inputdate, dayOfWeek, weeks, offset, convertToScriptDate){
		if(arguments.length < 5)
			convertToScriptDate = "N";
	var voffset;
	var vconvertToScriptDate;
	var endDate;
	var date;
		if(offset == null)
			voffset = 0;
		else
			voffset = offset;
		if(convertToScriptDate == 'N')
			vconvertToScriptDate = false;
		else
			vconvertToScriptDate = true;
	var parts = inputdate.split('/');
		parts[0] = parts[0] - 1;
	date = new Date(parts[2], parts[0], 1);
	var vweeks = ((weeks - 1) * 7);
	var dayCount = 0;
		while (dayCount < weeks){		//Main Loop
			if (date.getDay() === dayOfWeek){
				break;
			}
			date = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
		}
		if(vconvertToScriptDate == true)
			endDate = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + vweeks + voffset));
		else {
    	endDate = new Date(date.getFullYear(), date.getMonth(), (date.setDate(date.getDate() +vweeks + voffset)));
			endDate = ('0' + (date.getMonth()+1)).slice(-2) + "/" + ('0' + (date.getDate())).slice(-2) + "/" + date.getFullYear();
    }
	return endDate;
}