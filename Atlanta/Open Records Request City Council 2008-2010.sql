SELECT

(B.B1_PER_GROUP || '/' || B.B1_PER_TYPE || '/' || B.B1_PER_SUB_TYPE || '/' || B.B1_PER_CATEGORY) AS "Permit Type",
B.B1_ALT_ID AS "Permit Number",
TO_CHAR(B.B1_FILE_DD, 'MM/DD/YYYY') AS "Opened Date",
(
		SELECT
			CASE WHEN B3A.B1_HSE_NBR_START IS NOT NULL THEN B3A.B1_HSE_NBR_START||' ' ELSE '' END||
			CASE WHEN B3A.B1_STR_NAME IS NOT NULL THEN B3A.B1_STR_NAME||' ' ELSE '' END ||
			CASE WHEN B3A.B1_STR_SUFFIX IS NOT NULL THEN B3A.B1_STR_SUFFIX||' ' ELSE '' END ||
			CASE WHEN B3A.B1_STR_SUFFIX_DIR IS NOT NULL THEN B3A.B1_STR_SUFFIX_DIR||' ' ELSE '' END ||
			CASE WHEN B3A.B1_SITUS_CITY IS NOT NULL THEN B3A.B1_SITUS_CITY||', ' ELSE '' END ||
			CASE WHEN B3A.B1_SITUS_STATE IS NOT NULL THEN B3A.B1_SITUS_STATE||' ' ELSE '' END ||
			CASE WHEN B3A.B1_SITUS_ZIP IS NOT NULL THEN B3A.B1_SITUS_ZIP||' ' ELSE '' END
		FROM B3ADDRES B3A
		WHERE
			B.SERV_PROV_CODE = B3A.SERV_PROV_CODE AND B.REC_STATUS = B3A.REC_STATUS
			AND B.B1_PER_ID1 = B3A.B1_PER_ID1 AND B.B1_PER_ID2 = B3A.B1_PER_ID2 AND B.B1_PER_ID3 = B3A.B1_PER_ID3
			AND B1_ADDRESS_NBR = (
					SELECT MIN(B1_ADDRESS_NBR)
					FROM B3ADDRES B3A1
					WHERE
						1=1
						AND B.SERV_PROV_CODE = B3A1.SERV_PROV_CODE AND B.REC_STATUS = B3A1.REC_STATUS
						AND B.B1_PER_ID1 = B3A1.B1_PER_ID1 AND B.B1_PER_ID2 = B3A1.B1_PER_ID2 AND B.B1_PER_ID3 = B3A1.B1_PER_ID3
						AND B3A1.B1_PRIMARY_ADDR_FLG = (
							SELECT MAX(B3A2.B1_PRIMARY_ADDR_FLG)
							FROM B3ADDRES B3A2
							WHERE
								1=1
								AND B.SERV_PROV_CODE = B3A2.SERV_PROV_CODE AND B.REC_STATUS = B3A2.REC_STATUS
								AND B.B1_PER_ID1 = B3A2.B1_PER_ID1 AND B.B1_PER_ID2 = B3A2.B1_PER_ID2 AND B.B1_PER_ID3 = B3A2.B1_PER_ID3
						)
			) --*/
	) AS "Address",
B.B1_SPECIAL_TEXT AS "Permit Name",
(   SELECT
        C.B1_CHECKLIST_COMMENT
    FROM
        BCHCKBOX C
    WHERE
            B.SERV_PROV_CODE = C.SERV_PROV_CODE AND B.REC_STATUS = C.REC_STATUS
        AND B.B1_PER_ID1 = C.B1_PER_ID1 AND B.B1_PER_ID2 = C.B1_PER_ID2 AND B.B1_PER_ID3 = C.B1_PER_ID3
        AND C.B1_CHECKBOX_DESC = 'Council District'
)   AS "Council District",

(   SELECT
        C.B1_CHECKLIST_COMMENT
    FROM
        BCHCKBOX C
    WHERE
         B.SERV_PROV_CODE = C.SERV_PROV_CODE AND B.REC_STATUS = C.REC_STATUS
        AND B.B1_PER_ID1 = C.B1_PER_ID1 AND B.B1_PER_ID2 = C.B1_PER_ID2 AND B.B1_PER_ID3 = C.B1_PER_ID3
        AND C.B1_CHECKBOX_DESC = 'Cost of Construction'
)   AS "Cost of Construction",

(   SELECT
        C.B1_CHECKLIST_COMMENT
    FROM
        BCHCKBOX C
    WHERE
         B.SERV_PROV_CODE = C.SERV_PROV_CODE AND B.REC_STATUS = C.REC_STATUS
        AND B.B1_PER_ID1 = C.B1_PER_ID1 AND B.B1_PER_ID2 = C.B1_PER_ID2 AND B.B1_PER_ID3 = C.B1_PER_ID3
        AND C.B1_CHECKBOX_DESC = 'Calculated Valuation'
)   AS "Calculated Valuation",

(   SELECT
        G.G3_VALUE_TTL
    FROM
        BVALUATN G
    WHERE
         B.SERV_PROV_CODE = G.SERV_PROV_CODE AND B.REC_STATUS = G.REC_STATUS
        AND B.B1_PER_ID1 = G.B1_PER_ID1 AND B.B1_PER_ID2 = G.B1_PER_ID2 AND B.B1_PER_ID3 = G.B1_PER_ID3
)   AS "Job Value",
B.B1_APPL_STATUS AS "Status"

FROM B1PERMIT B
WHERE
        B.B1_PER_GROUP = 'Building'
    AND B.REC_STATUS = 'A'
    AND B.B1_APPL_STATUS NOT IN ('Void','Terminated')
    AND B.B1_FILE_DD BETWEEN TO_DATE('20080101','YYYYMMDD') AND TO_DATE('20101231','YYYYMMDD')

ORDER BY
    B.B1_FILE_DD ASC
