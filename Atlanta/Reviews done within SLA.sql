SELECT DISTINCT --*
        1
    ,   A.B1_ALT_ID     AS "Permit Number"
    ,   A.B1_APP_TYPE_ALIAS                     AS "Permit Type"
    ,   TO_CHAR(A.B1_FILE_DD, 'MM/DD/YYYY')     AS "Opened Date"
    ,   G.SD_STP_NUM    AS "Step Number"
    ,   G.SD_PRO_DES    AS "Workflow Task"
    ,   G.SD_APP_DES    AS "Workflow Status"
    ,   G.GA_FNAME || ' ' || G.GA_LNAME || ' (' || G.REC_FUL_NAM || ')'     AS "Action By (recorded action by)"
    ,   TO_CHAR(G.G6_ASGN_DD, 'MM/DD/YYYY')     AS "Assigned Date"
    ,   TO_CHAR(G.G6_STAT_DD, 'MM/DD/YYYY')     AS "Status Date"
    ,   TO_CHAR(G.B1_DUE_DD,  'MM/DD/YYYY')     AS "Due Date"
    ,   CASE
            WHEN G.B1_DUE_DD - G.G6_STAT_DD >= 0
            THEN 'Completed SLA Complied'
            WHEN G.B1_DUE_DD - G.G6_STAT_DD < 0
            THEN 'Completed SLA Not Complied'
            WHEN G.G6_STAT_DD IS NULL
                AND G.SD_CHK_LV1 = 'N'
                AND G.SD_CHK_LV2 = 'Y'
            THEN 'Task deactivated by Supervisor override'
            WHEN SYSDATE - G.B1_DUE_DD > 0
                AND G.G6_STAT_DD IS NULL
            THEN 'Not Completed SLA Not Complied'
            WHEN SYSDATE - G.B1_DUE_DD <= 0
                AND G.G6_STAT_DD IS NULL
            THEN 'Not Completed SLA Complied'
            WHEN G.B1_DUE_DD IS NULL
            THEN 'No due date set'
            ELSE 'No info'
        END                 AS "SLA"

    ,   (   select bb.b1_checklist_comment
            from bchckbox bb
            where A.SERV_PROV_CODE = bb.serv_prov_code and A.B1_PER_ID1 = bb.b1_per_id1 and A.B1_PER_ID2 = bb.b1_per_id2 and A.B1_PER_ID3 = bb.b1_per_id3
            and bb.b1_checkbox_desc = 'Workstream'
        )                   AS "Workstream"

FROM
    B1PERMIT A
    INNER JOIN GPROCESS G ON
        A.SERV_PROV_CODE = G.SERV_PROV_CODE
    AND A.B1_PER_ID1 = G.B1_PER_ID1
    AND A.B1_PER_ID2 = G.B1_PER_ID2
    AND A.B1_PER_ID3 = G.B1_PER_ID3
    AND A.REC_STATUS = 'A'
    AND (G.SD_CHK_LV1 = 'Y' OR G.SD_CHK_LV2 = 'Y')
    
WHERE
        A.SERV_PROV_CODE = 'ATLANTA_GA'
    AND A.B1_PER_GROUP = 'Building'
    AND A.REC_STATUS = 'A'
    AND A.B1_APPL_STATUS NOT IN ('Void','Expired','Terminated')
--  AND A.B1_ALT_ID = 'BB-201605623'
    AND A.B1_FILE_DD > TO_DATE(20180101, 'YYYYMMDD')
    AND A.B1_App_Type_Alias = 'Commercial New'

ORDER BY
    A.B1_ALT_ID,
    G.SD_STP_NUM