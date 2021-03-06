/*------------------------------------------
|   TITLE: WORKSTREAM SLA GRAPHS SUBREPORT
|   AUTHOR: JOSEPH BULLOCK
|   DATE: 2/19/2018
|   SUMMARY: SUBREPORT FOR WORKSTREAM SLA
|            REPORT SHOWING REVIEW DAYS
|            PER REVIEWER FOR GRAPHS
/------------------------------------------*/

SELECT *



FROM B1PERMIT B

INNER JOIN GPROCESS G ON 1=1
AND B.SERV_PROV_CODE = G.SERV_PROV_CODE
AND B.B1_PER_ID1 = G.B1_PER_ID1
AND B.B1_PER_ID2 = G.B1_PER_ID2
AND B.B1_PER_ID3 = G.B1_PER_ID3
AND G.REC_STATUS = 'A'
AND (G.SD_CHK_LV1 = 'Y' OR G.SD_CHK_LV2 = 'Y')

LEFT OUTER JOIN G3STAFFS S ON 1=1
AND B.SERV_PROV_CODE = S.SERV_PROV_CODE
AND CASE WHEN G.GA_FNAME IS NULL THEN G.ASGN_FNAME ELSE G.GA_FNAME END = S.GA_FNAME
AND	CASE WHEN G.GA_LNAME IS NULL THEN G.ASGN_LNAME ELSE G.GA_LNAME END = S.GA_LNAME
AND	S.REC_STATUS = 'A'
AND	S.GA_DIVISION_CODE != 'PUBLIC'
    
INNER JOIN BCHCKBOX BOX ON 1=1
AND B.SERV_PROV_CODE = BOX.SERV_PROV_CODE
AND B.B1_PER_ID1 = BOX.B1_PER_ID1
AND B.B1_PER_ID2 = BOX.B1_PER_ID2
AND B.B1_PER_ID3 = BOX.B1_PER_ID3
AND BOX.REC_STATUS = 'A'

WHERE 1=1
AND B.SERV_PROV_CODE = 'ATLANTA_GA'
AND B.B1_PER_GROUP = 'Building'
AND B.B1_FILE_DD >= '05-Jun-17'
AND B.B1_FILE_DD <= '09-Jun-17'
--AND B.B1_FILE_DD >= {?startDate}
--AND B.B1_FILE_DD <= {?endDate}
--AND B.B1_ALT_ID = 'BB-201704401'
AND ROWNUM <= 1000
