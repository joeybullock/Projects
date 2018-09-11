SELECT
		B.B1_ALT_ID,
		B.B1_APPL_STATUS STATUS,
		(ACCELA.FN_GET_ADDRESS_INFO (B.SERV_PROV_CODE, B.B1_PER_ID1, B.B1_PER_ID2, B.B1_PER_ID3, 'B', 'PARTADDR_LINE')
        || ' ' ||
        ACCELA.FN_GET_ADDRESS_INFO (B.SERV_PROV_CODE, B.B1_PER_ID1, B.B1_PER_ID2, B.B1_PER_ID3, 'B', 'STREETSUFFIXDIR')) ADDRESS,
	COALESCE(
        (
        SELECT A.B1_PARCEL_NBR
        FROM   B3PARCEL A
        WHERE  A.SERV_PROV_CODE=B.SERV_PROV_CODE AND
                A.B1_PER_ID1=B.B1_PER_ID1 AND
                A.B1_PER_ID2=B.B1_PER_ID2 AND
                A.B1_PER_ID3=B.B1_PER_ID3 AND
                A.B1_PRIMARY_PAR_FLG='Y' AND
                ROWNUM<2
        ),
        (
        SELECT A.B1_PARCEL_NBR
        FROM   B3PARCEL A
        WHERE  A.SERV_PROV_CODE=B.SERV_PROV_CODE AND
                A.B1_PER_ID1=B.B1_PER_ID1 AND
                A.B1_PER_ID2=B.B1_PER_ID2 AND
                A.B1_PER_ID3=B.B1_PER_ID3 AND
                ROWNUM<2
        )
    ) B1_PARCEL_NBR,
		B.B1_SPECIAL_TEXT PROJECT,
        BW.B1_WORK_DESC WORKDES,
	(
		SELECT BCBS.B1_CHECKLIST_COMMENT
		FROM BCHCKBOX BCBS
		WHERE
			1=1 AND B.SERV_PROV_CODE = BCBS.SERV_PROV_CODE AND B.REC_STATUS = BCBS.REC_STATUS
			AND B.B1_PER_ID1 = BCBS.B1_PER_ID1 AND B.B1_PER_ID2 = BCBS.B1_PER_ID2 AND B.B1_PER_ID3 = BCBS.B1_PER_ID3
			AND BCBS.B1_CHECKBOX_DESC = 'Zoning 1' AND B1_CHECKBOX_TYPE = 'GENERAL'
			AND ROWNUM<2
	) ZONING,
	(
		SELECT
			CASE WHEN B1_OWNER_FULL_NAME IS NOT NULL
				THEN B1_OWNER_FULL_NAME
				ELSE (
					CASE WHEN B1_OWNER_FNAME IS NOT NULL THEN B1_OWNER_FNAME||' ' ELSE '' END ||
					CASE WHEN B1_OWNER_MNAME IS NOT NULL THEN B1_OWNER_MNAME||' ' ELSE '' END ||
					CASE WHEN B1_OWNER_LNAME IS NOT NULL THEN B1_OWNER_LNAME||' ' ELSE '' END
				)
			END ||
			CASE WHEN B1_MAIL_ADDRESS1 IS NOT NULL THEN chr(10)||B1_MAIL_ADDRESS1 ELSE '' END ||
			CASE WHEN B1_MAIL_ADDRESS2 IS NOT NULL THEN chr(10)||B1_MAIL_ADDRESS2 ELSE '' END ||
			CASE WHEN B1_MAIL_ADDRESS3 IS NOT NULL THEN chr(10)||B1_MAIL_ADDRESS3 ELSE '' END ||
			CASE WHEN B1_MAIL_CITY IS NOT NULL THEN chr(10)||B1_MAIL_CITY||', ' ELSE '' END ||
			CASE WHEN B1_MAIL_STATE IS NOT NULL THEN B1_MAIL_STATE||' ' ELSE '' END ||
			CASE WHEN B1_MAIL_ZIP IS NOT NULL THEN B1_MAIL_ZIP ELSE '' END
		FROM B3OWNERS B3O
		WHERE
			1=1 and b.rec_status = b3o.rec_status and b.serv_prov_code = b3o.serv_prov_code
			and b.b1_per_Id1 = b3o.b1_per_id1 and b.b1_per_Id2 = b3o.b1_per_id2 and b.b1_per_Id3 = b3o.b1_per_id3
			AND b3o.b1_owner_nbr =
			(
				SELECT MIN(B3o1.b1_owner_nbr)
				FROM B3OWNERS B3O1
				WHERE
					1=1 and b3o.rec_status = b3o1.rec_status and b3o.serv_prov_code = b3o1.serv_prov_code
					and b3o.b1_per_Id1 = b3o1.b1_per_id1 and b3o.b1_per_Id2 = b3o1.b1_per_id2 and b3o.b1_per_Id3 = b3o1.b1_per_id3
					and b3o1.b1_primary_owner = (
						SELECT MAX(b1_primary_owner)
						FROM B3OWNERS B3O2
						WHERE
							1=1 and b3o2.rec_status = b3o1.rec_status and b3o2.serv_prov_code = b3o1.serv_prov_code
							and b3o2.b1_per_Id1 = b3o1.b1_per_id1 and b3o2.b1_per_Id2 = b3o1.b1_per_id2 and b3o2.b1_per_Id3 = b3o1.b1_per_id3
							AND ROWNUM<2
					)
					AND ROWNUM<2
			)
			AND ROWNUM<2
	) OwnerInfo,
	1
    
FROM
	B1PERMIT B

	INNER JOIN BPERMIT_DETAIL BD ON
		B.SERV_PROV_CODE = BD.SERV_PROV_CODE
		AND B.B1_PER_ID1 = BD.B1_PER_ID1
		AND B.B1_PER_ID2 = BD.B1_PER_ID2
		AND B.B1_PER_ID3 = BD.B1_PER_ID3
		AND B.REC_STATUS = BD.REC_STATUS
        
    INNER JOIN BWORKDES BW ON 1=1
        AND B.SERV_PROV_CODE = BW.SERV_PROV_CODE
        AND B.B1_PER_ID1 = BW.B1_PER_ID1
        AND B.B1_PER_ID2 = BW.B1_PER_ID2
        AND B.B1_PER_ID3 = BW.B1_PER_ID3
        AND B.REC_STATUS = BW.REC_STATUS

WHERE
	1=1
	AND B.SERV_PROV_CODE ='ATLANTA_GA'
	AND B.B1_PER_GROUP = 'Building'
    AND B.B1_PER_TYPE = 'Complaint'
--	AND ( NOT UPPER(B.B1_APPL_STATUS) IN ('CANCELLED','DENIED','SUSPENDED','VOID') or B.B1_APPL_STATUS is null )
	--AND B.B1_ALT_ID = '17CAP-00000290'
	AND B.B1_ALT_ID = UPPER('{?capid}')
    --AND ROWNUM<2 --permit layout not designed to handle multiple result rows
ORDER BY 1