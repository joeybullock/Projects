SELECT
	A.B1_ALT_ID AS "Permit",
	A.B1_SPECIAL_TEXT AS "Project Name",
	A.B1_APP_TYPE_ALIAS AS "Permit Type",
	C.STATUS_DATE AS "Date Issued",
	A.B1_APPL_STATUS AS "Current Application Status",
	
	-------------Address Combined-----------------------------
			CONVERT(varchar(10),B.B1_HSE_NBR_START) + ' ' + 
			ISNULL(B.B1_STR_DIR + ' ','') +
			ISNULL(B.B1_STR_NAME + ' ','') + 
			ISNULL(B.B1_STR_SUFFIX,'')
			ISNULL(B.B1_STR_SUFFIX_DIR,'')+ CHAR(10) + 
			ISNULL(B.B1_SITUS_CITY,'') +
			-------OPTIONAL ADD CITY AND STATE---------
			', ' + ISNULL(B.B1_SITUS_STATE,'') +
			----------------------------------
			' ' + ISNULL(CONVERT(varchar(10),B.B1_SITUS_ZIP),'') AS "Address"
	----------------------------------------------------------
	
	
FROM B1PERMIT A
	
	INNER JOIN B3ADDRES B ON
	A.SERV_PROV_CODE = B.SERV_PROV_CODE
	AND A.B1_PER_ID1 = B.B1_PER_ID1
	AND A.B1_PER_ID2 = B.B1_PER_ID2
	AND A.B1_PER_ID3 = B.B1_PER_ID3
	AND B.B1_PRIMARY_ADDR_FLG = 'Y'
	
	INNER JOIN STATUS_HISTORY C ON
	A.SERV_PROV_CODE = C.SERV_PROV_CODE
	AND A.B1_PER_ID1 = C.B1_PER_ID1
	AND A.B1_PER_ID2 = C.B1_PER_ID2
	AND A.B1_PER_ID3 = C.B1_PER_ID3
	AND C.STATUS = 'Issued'
	AND C.STATUS_DATE >= '07/01/2015'
	
WHERE
		A.SERV_PROV_CODE = 'ATLANTA_GA'
	AND A.REC_STATUS = 'A'
	AND A.B1_APPL_STATUS NOT IN ('Withdrawn','Void')
	AND A.B1_PER_GROUP = 'Building'
	AND A.B1_PER_TYPE = 'Residential'
	AND A.B1_PER_SUB_TYPE IN ('New','Addition','Alteration','Conversion')