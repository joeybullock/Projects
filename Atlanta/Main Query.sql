/*--------------------------------------------------------------/
|  MAIN QUERY FOR: WORKSTREAM SLA REPORT
|  AUTHOR: JOSEPH BULLOCK
|  DATE: 2/14/2018
|  SUMMARY: WRITTEN FOR REPORT TO GATHER SLA'S BY WORKSTREAM.
/---------------------------------------------------------------*/

SELECT 1
,B.B1_ALT_ID                              AS "PERMIT NUMBER"
,G.SD_PRO_DES                             AS "TASK"
,CASE
    WHEN G.SD_APP_DES IS NULL THEN 'PENDING'
    ELSE G.SD_APP_DES
    END                                   
                                          AS "STATUS"
,CASE
    WHEN G.G6_STAT_DD IS NULL
    THEN
        FLOOR(SYSDATE - B.B1_FILE_DD)
    ELSE
        FLOOR(G.G6_STAT_DD - B.B1_FILE_DD)
    END
                                          AS "DAYS ACTIVE SINCE OPENED"
,CASE
    WHEN G.G6_ASGN_DD IS NULL
    THEN 0
    WHEN G.G6_STAT_DD IS NULL AND G.G6_ASGN_DD IS NOT NULL
    THEN
        FLOOR(SYSDATE - G.G6_ASGN_DD)
    ELSE
        FLOOR(G.G6_STAT_DD - G.G6_ASGN_DD)
    END
                                          AS "DAYS ASSIGNED TIL COMPLETED"
,CASE WHEN B.B1_FILE_DD IS NULL THEN 'PENDING' ELSE TO_CHAR(B.B1_FILE_DD, 'MM/DD/YYYY') END
                                          AS "OPENED DATE"
,CASE WHEN G.G6_ASGN_DD IS NULL THEN 'NOT ASSIGNED' ELSE TO_CHAR(G.G6_ASGN_DD, 'MM/DD/YYYY') END
                                          AS "ASSIGNED DATE"
,CASE
    WHEN G.G6_STAT_DD IS NULL
    THEN 'PENDING'
    ELSE TO_CHAR(G.G6_STAT_DD, 'MM/DD/YYYY')
    END                                   
                                          AS "DATE TASK COMPLETED"
,S.USER_NAME                              AS "STAFF USER NAME"
,S.GA_FNAME || ' ' || S.GA_LNAME          AS "STAFF NAME"
,CASE
    WHEN (G.SD_CHK_LV2 = 'Y' AND G.SD_CHK_LV1 = 'N') THEN 'COMPLETED'
    WHEN (G.SD_CHK_LV2 = 'N' AND G.SD_CHK_LV1 = 'Y') THEN 'PENDING'
    ELSE 'ACTIVE'
    END
                                          AS "TASK STATUS"
,BOX.B1_CHECKLIST_COMMENT                 AS "WORKSTREAM"
,G.REC_STATUS
,G.SD_CHK_LV1
,G.SD_CHK_LV2

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
--AND B.B1_FILE_DD >= '05-Jun-17'
--AND B.B1_FILE_DD <= '09-Jun-17'
AND B.B1_FILE_DD >= {?startDate}
AND B.B1_FILE_DD <= {?endDate}
AND B.B1_PER_TYPE NOT IN ('QCR','Site Development')
AND B.B1_PER_SUB_TYPE != 'Land Development'
AND BOX.B1_CHECKLIST_COMMENT IN ('Express','Residential','Light Commercial','Commercial','Major Projects')
AND G.SD_PRO_DES NOT IN ('Issue Permit','Inspection','Certificate of Occupancy','Closed','Close')
AND B.B1_APPL_STATUS NOT IN ('Voided','Void','VOID','Terminated','TERMINATE','Revoked','Withdrawn')
--AND B.B1_ALT_ID = 'BB-201704401'
--AND ROWNUM <= 1000

ORDER BY B.B1_ALT_ID, G.B1_FILE_DD

