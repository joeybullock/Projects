SELECT DISTINCT
--    A.B1_ALT_ID
*
/*    A.B1_ALT_ID
    --,COUNT(B.SD_PRO_DES)
    ,B.SD_PRO_DES
    ,B.SD_APP_DES
    ,TO_TIMESTAMP(B.SD_APP_DD)
    ,TO_TIMESTAMP(B.REC_DATE)
*/    
FROM
    B1PERMIT A INNER JOIN
    GPROCESS_HISTORY B ON
        A.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND A.B1_PER_ID1 = B.B1_PER_ID1
    AND A.B1_PER_ID2 = B.B1_PER_ID2
    AND A.B1_PER_ID3 = B.B1_PER_ID3
    
INNER JOIN
    BCHCKBOX C ON
        A.SERV_PROV_CODE = C.SERV_PROV_CODE
    AND A.B1_PER_ID1 = C.B1_PER_ID1
    AND A.B1_PER_ID2 = C.B1_PER_ID2
    AND A.B1_PER_ID3 = C.B1_PER_ID3
    AND C.B1_CHECKBOX_DESC = 'Workstream'
    
WHERE
    A.B1_PER_GROUP = 'Building'
    AND A.B1_FILE_DD BETWEEN '01-JUN-18' AND '30-JUN-18'
    AND A.B1_APPL_STATUS != 'Void'
    AND B.SD_IN_POSSESSION_TIME IS NOT NULL
    AND B.SD_PRO_DES NOT IN ('Inspection','Certificate of Occupancy','Close','Issue Permit','Accepted')

--GROUP BY
--    A.B1_ALT_ID,
--    B.SD_PRO_DES
    
ORDER BY
    A.B1_ALT_ID,
    B.SD_APP_DD