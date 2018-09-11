
//gisGetZoning Standard Choice branch
true ^ moraArray = new Array(); moraArray = getGISBufferInfo("Atlanta_AA","Building Moratoriums",-1,"NAME");
moraArray.length > 0 ^ branch("Moratoriums");

//Moratoriums Standard Choice branch
true ^ moraArray.length > 0 && moraArray[0]["NAME"] == "Beltline Storage" ^ addParcelCondition(null,"Moratoriums","Applied","Beltline Storage Moratorium","http://gis.atlantaga.gov/docs/moratoriums/storage.pdf Moratorium on SAP and New Construction of self-storage facilities.  End Date 11/19/2017","Notice");
moraArray.length > 0 && moraArray[0]["NAME"] == "Buckhead Parking Overlay" ^ addParcelCondition(null,"Moratoriums","Applied","Buckhead Parking Moratorium","http://gis.atlantaga.gov/docs/moratoriums/buckhead.pdf Moratorium on New Construction that includes parking, except for eating and drinking establishments. End Date 2/15/2018","Notice");
moraArray.length > 0 && moraArray[0]["NAME"] == "Tuxedo Park" ^ addParcelCondition(null,"Moratoriums","Applied","Tuxedo Park Moratorium","http://gis.atlantaga.gov/docs/moratoriums/tuxedopark.pdf No demolition or new construction of single-family in Tuxedo Park.  End Date 12/10/2017","Notice");
moraArray.length > 0 && moraArray[0]["NAME"] == "Westside Revive" ^ addParcelCondition(null,"Moratoriums","Applied","Westside Revive Moratorium","http://gis.atlantaga.gov/docs/moratoriums/westsiderevive.pdf Marietta Street Artery, Home Park, and West Midtown with zoning districts C-1 and I-1.  End Date 3/5/2018","Notice");
moraArray.length > 1 && moraArray[1]["NAME"] == "Beltline Storage" ^ addParcelCondition(null,"Moratoriums","Applied","Beltline Storage Moratorium","http://gis.atlantaga.gov/docs/moratoriums/storage.pdf Moratorium on SAP and New Construction of self-storage facilities.  End Date 11/19/2017","Notice");
moraArray.length > 1 && moraArray[1]["NAME"] == "Buckhead Parking Overlay" ^ addParcelCondition(null,"Moratoriums","Applied","Buckhead Parking Moratorium","http://gis.atlantaga.gov/docs/moratoriums/buckhead.pdf Moratorium on New Construction that includes parking, except for eating and drinking establishments. End Date 2/15/2018","Notice");