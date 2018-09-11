SELECT DISTINCT

	a.B1_CON_COMMENT "Condition Comment",
	a.B1_CON_ISS_FNAME || ' ' || a.B1_CON_ISS_LNAME "Condition Applied By",
	a.B1_CON_TYP "Condition Type",
	a.B1_CON_STATUS "Condition Status",
	a.B1_CON_ISS_DD "Condition Date"
	
FROM B6CONDIT a
	
WHERE
    a.SERV_PROV_CODE = '{?SERV_PROV_CODE}' AND
    a.B1_PER_ID1 = '{?B1_PER_ID1}' AND
    a.B1_PER_ID2 = '{?B1_PER_ID2}' AND
    a.B1_PER_ID3 = '{?B1_PER_ID3}' AND
    a.B1_CON_STATUS = 'Applied'

	
ORDER BY a.B1_CON_ISS_DD