SELECT
--1 Case Number
	B.B1_ALT_ID,

--2
	B.B1_PER_GROUP||'/'||B.B1_PER_TYPE||'/'||B.B1_PER_SUB_TYPE||'/'||B.B1_PER_CATEGORY CAPTYPE,

--3
--B3A.*,
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
			)
	) Address,
--4
	(
		SELECT
			CASE WHEN COALESCE(TRIM(B3C.B1_FNAME||B3C.B1_FNAME||B3C.B1_LNAME),'') <> ''
			THEN
				CASE WHEN B3C.B1_FNAME IS NOT NULL THEN B3C.B1_FNAME||' ' ELSE '' END||
				CASE WHEN B3C.B1_FNAME IS NOT NULL THEN B3C.B1_FNAME||' ' ELSE '' END||
				CASE WHEN B3C.B1_FNAME IS NOT NULL THEN B3C.B1_FNAME||' ' ELSE '' END
				ELSE B3C.B1_FULL_NAME
			END
		FROM B3CONTACT B3C 
		WHERE 
			B.SERV_PROV_CODE = B3C.SERV_PROV_CODE AND B.REC_STATUS = B3C.REC_STATUS
			AND B.B1_PER_ID1 = B3C.B1_PER_ID1 AND B.B1_PER_ID2 = B3C.B1_PER_ID2 AND B.B1_PER_ID3 = B3C.B1_PER_ID3
			AND B3C.B1_CONTACT_TYPE = 'Applicant'
			AND B3C.B1_CONTACT_NBR = (
				SELECT MIN(B3C1.B1_CONTACT_NBR)
				FROM B3CONTACT B3C1
				WHERE B.SERV_PROV_CODE = B3C1.SERV_PROV_CODE AND B.REC_STATUS = B3C1.REC_STATUS
					AND B.B1_PER_ID1 = B3C1.B1_PER_ID1 AND B.B1_PER_ID2 = B3C1.B1_PER_ID2 AND B.B1_PER_ID3 = B3C1.B1_PER_ID3
					AND B3C1.B1_CONTACT_TYPE = 'Applicant'
					AND B3C1.B1_FLAG = (
						SELECT MAX(B3C1.B1_FLAG)
						FROM B3CONTACT B3C2
						WHERE
							B.SERV_PROV_CODE = B3C2.SERV_PROV_CODE AND B.REC_STATUS = B3C2.REC_STATUS
							AND B.B1_PER_ID1 = B3C2.B1_PER_ID1 AND B.B1_PER_ID2 = B3C2.B1_PER_ID2 AND B.B1_PER_ID3 = B3C2.B1_PER_ID3
							AND B3C2.B1_CONTACT_TYPE = 'Applicant'
					)
			)
	) ApplicantName,
--5
	(
		SELECT COALESCE(B3C.B1_PHONE1,B3C.B1_PHONE2,'')
		FROM B3CONTACT B3C 
		WHERE 
			B.SERV_PROV_CODE = B3C.SERV_PROV_CODE AND B.REC_STATUS = B3C.REC_STATUS
			AND B.B1_PER_ID1 = B3C.B1_PER_ID1 AND B.B1_PER_ID2 = B3C.B1_PER_ID2 AND B.B1_PER_ID3 = B3C.B1_PER_ID3
			AND B3C.B1_CONTACT_TYPE = 'Applicant'
			AND B3C.B1_CONTACT_NBR = (
				SELECT MIN(B3C1.B1_CONTACT_NBR)
				FROM B3CONTACT B3C1
				WHERE B.SERV_PROV_CODE = B3C1.SERV_PROV_CODE AND B.REC_STATUS = B3C1.REC_STATUS
					AND B.B1_PER_ID1 = B3C1.B1_PER_ID1 AND B.B1_PER_ID2 = B3C1.B1_PER_ID2 AND B.B1_PER_ID3 = B3C1.B1_PER_ID3
					AND B3C1.B1_CONTACT_TYPE = 'Applicant'
					AND B3C1.B1_FLAG = (
						SELECT MAX(B3C1.B1_FLAG)
						FROM B3CONTACT B3C2
						WHERE
							B.SERV_PROV_CODE = B3C2.SERV_PROV_CODE AND B.REC_STATUS = B3C2.REC_STATUS
							AND B.B1_PER_ID1 = B3C2.B1_PER_ID1 AND B.B1_PER_ID2 = B3C2.B1_PER_ID2 AND B.B1_PER_ID3 = B3C2.B1_PER_ID3
							AND B3C2.B1_CONTACT_TYPE = 'Applicant'
					)
			)
	) ApplicantPhone,
--6
	(
		SELECT B3C.B1_EMAIL
				FROM B3CONTACT B3C 
		WHERE 
			B.SERV_PROV_CODE = B3C.SERV_PROV_CODE AND B.REC_STATUS = B3C.REC_STATUS
			AND B.B1_PER_ID1 = B3C.B1_PER_ID1 AND B.B1_PER_ID2 = B3C.B1_PER_ID2 AND B.B1_PER_ID3 = B3C.B1_PER_ID3
			AND B3C.B1_CONTACT_TYPE = 'Applicant'
			AND B3C.B1_CONTACT_NBR = (
				SELECT MIN(B3C1.B1_CONTACT_NBR)
				FROM B3CONTACT B3C1
				WHERE B.SERV_PROV_CODE = B3C1.SERV_PROV_CODE AND B.REC_STATUS = B3C1.REC_STATUS
					AND B.B1_PER_ID1 = B3C1.B1_PER_ID1 AND B.B1_PER_ID2 = B3C1.B1_PER_ID2 AND B.B1_PER_ID3 = B3C1.B1_PER_ID3
					AND B3C1.B1_CONTACT_TYPE = 'Applicant'
					AND B3C1.B1_FLAG = (
						SELECT MAX(B3C1.B1_FLAG)
						FROM B3CONTACT B3C2
						WHERE
							B.SERV_PROV_CODE = B3C2.SERV_PROV_CODE AND B.REC_STATUS = B3C2.REC_STATUS
							AND B.B1_PER_ID1 = B3C2.B1_PER_ID1 AND B.B1_PER_ID2 = B3C2.B1_PER_ID2 AND B.B1_PER_ID3 = B3C2.B1_PER_ID3
							AND B3C2.B1_CONTACT_TYPE = 'Applicant'
					)
			)
	) B1_EMAIL,
--7 Fee Item Description
	F4F.GF_DES FeeDesc,
--8 Fee's Amount Due
	(
		F4F.GF_FEE - COALESCE((
			SELECT SUM(X4F1.fee_allocation)
			FROM X4PAYMENT_FEEITEM X4F1 WHERE
				1=1 AND F4F.FEEITEM_SEQ_NBR = X4F1.FEEITEM_SEQ_NBR
				AND B.SERV_PROV_CODE = X4F1.SERV_PROV_CODE AND B.REC_STATUS = X4F1.REC_STATUS
				AND B.B1_PER_ID1 = X4F1.B1_PER_ID1 AND B.B1_PER_ID2 = X4F1.B1_PER_ID2 AND B.B1_PER_ID3 = X4F1.B1_PER_ID3
		),0)--*/
	) FeeDue,
--9 Payment Date (Assessed Date)
	F4I.INVOICE_DATE,
--10 Account Number
	(
		CASE WHEN F4F.GF_L1 IS NOT NULL THEN F4F.GF_L1 ELSE '' END||
		CASE WHEN (F4F.GF_L1 IS NOT NULL AND F4F.GF_L2||F4F.GF_L3 IS NOT NULL) THEN ', '||chr(10) ELSE '' END ||
		CASE WHEN F4F.GF_L2 IS NOT NULL THEN F4F.GF_L2 ELSE '' END||
		CASE WHEN (F4F.GF_L2 IS NOT NULL AND F4F.GF_L3 IS NOT NULL) THEN ', '||chr(10) ELSE '' END ||
		CASE WHEN F4F.GF_L3 IS NOT NULL THEN F4F.GF_L3 ELSE '' END
	) AccountNumber, --*/
--11 Sub Total
--12
	(
		SELECT
		CASE
		WHEN B3O.B1_OWNER_FULL_NAME IS NOT NULL
			THEN B3O.B1_OWNER_FULL_NAME
			ELSE (
				CASE WHEN B3O.B1_OWNER_FNAME IS NOT NULL THEN B3O.B1_OWNER_FNAME ELSE '' END ||
				CASE WHEN B3O.B1_OWNER_MNAME IS NOT NULL THEN ' '||B3O.B1_OWNER_MNAME ELSE '' END ||
				CASE WHEN B3O.B1_OWNER_LNAME IS NOT NULL THEN ' '||B3O.B1_OWNER_LNAME ELSE '' END
			) --*/
		END ||
		(
			CASE WHEN B3O.B1_MAIL_ADDRESS1 IS NOT NULL THEN chr(10)||B3O.B1_MAIL_ADDRESS1 ELSE '' END||
			CASE WHEN B3O.B1_MAIL_ADDRESS2 IS NOT NULL THEN chr(10)||B3O.B1_MAIL_ADDRESS2 ELSE '' END||
			CASE WHEN B3O.B1_MAIL_ADDRESS3 IS NOT NULL THEN chr(10)||B3O.B1_MAIL_ADDRESS3 ELSE '' END||
			chr(10)||
            CASE WHEN B3O.B1_MAIL_CITY IS NOT NULL THEN B3O.B1_MAIL_CITY ||', ' ELSE '' END ||
            B3O.B1_MAIL_STATE||' '||B3O.B1_MAIL_ZIP
		)
		FROM B3OWNERS B3O WHERE
		B.SERV_PROV_CODE = B3O.SERV_PROV_CODE AND B.REC_STATUS = B3O.REC_STATUS
		AND B.B1_PER_ID1 = B3O.B1_PER_ID1 AND B.B1_PER_ID2 = B3O.B1_PER_ID2 AND B.B1_PER_ID3 = B3O.B1_PER_ID3
		AND B3O.B1_OWNER_NBR = (
			SELECT MIN(B3O1.B1_OWNER_NBR)
			FROM B3OWNERS B3O1
			WHERE B.SERV_PROV_CODE = B3O1.SERV_PROV_CODE AND B.REC_STATUS = B3O1.REC_STATUS
				AND B.B1_PER_ID1 = B3O1.B1_PER_ID1 AND B.B1_PER_ID2 = B3O1.B1_PER_ID2 AND B.B1_PER_ID3 = B3O1.B1_PER_ID3
				AND B3O1.B1_PRIMARY_OWNER = (
					SELECT MAX(B3O2.B1_PRIMARY_OWNER)
					FROM B3OWNERS B3O2
					WHERE B.SERV_PROV_CODE = B3O2.SERV_PROV_CODE AND B.REC_STATUS = B3O2.REC_STATUS
						AND B.B1_PER_ID1 = B3O2.B1_PER_ID1 AND B.B1_PER_ID2 = B3O2.B1_PER_ID2 AND B.B1_PER_ID3 = B3O2.B1_PER_ID3
				)
		)
	) OWNERINFO,--*/
--13
	BWD.B1_WORK_DESC,
--14
1
FROM
(	
	SELECT
		X1a.SERV_PROV_CODE,
		X1a.B1_PER_ID1, X1a.B1_PER_ID2, X1a.B1_PER_ID3,
		X1a.B1_MASTER_ID1, X1a.B1_MASTER_ID2, X1a.B1_MASTER_ID3
        , X1a.REC_STATUS 
	FROM
		XAPP2REF X1a
	UNION ALL
	SELECT
		X2b.SERV_PROV_CODE,
		X2b.B1_PER_ID1, X2b.B1_PER_ID2, X2b.B1_PER_ID3,
		X1b.B1_MASTER_ID1, X1b.B1_MASTER_ID2, X1b.B1_MASTER_ID3
        , X1b.REC_STATUS 
	FROM
		XAPP2REF X1b
		INNER JOIN XAPP2REF X2b ON
			X1b.SERV_PROV_CODE = X2b.SERV_PROV_CODE
			AND X1b.B1_PER_ID1 = X2b.B1_MASTER_ID1
			AND X1b.B1_PER_ID2 = X2b.B1_MASTER_ID2
			AND X1b.B1_PER_ID3 = X2b.B1_MASTER_ID3
			AND X1b.REC_STATUS = X2b.REC_STATUS
	UNION ALL
	SELECT
		X3c.SERV_PROV_CODE,
		X3c.B1_PER_ID1, X3c.B1_PER_ID2, X3c.B1_PER_ID3,
		X1c.B1_MASTER_ID1, X1c.B1_MASTER_ID2, X1c.B1_MASTER_ID3
        , X1c.REC_STATUS 
	FROM
		XAPP2REF X1c
		INNER JOIN XAPP2REF X2c ON
			X1c.SERV_PROV_CODE = X2c.SERV_PROV_CODE
			AND X1c.B1_PER_ID1 = X2c.B1_MASTER_ID1
			AND X1c.B1_PER_ID2 = X2c.B1_MASTER_ID2
			AND X1c.B1_PER_ID3 = X2c.B1_MASTER_ID3
			AND X1c.REC_STATUS = X2c.REC_STATUS
		INNER JOIN XAPP2REF X3c ON
			X2c.SERV_PROV_CODE = X3c.SERV_PROV_CODE
			AND X2c.B1_PER_ID1 = X3c.B1_MASTER_ID1
			AND X2c.B1_PER_ID2 = X3c.B1_MASTER_ID2
			AND X2c.B1_PER_ID3 = X3c.B1_MASTER_ID3
			AND X2c.REC_STATUS = X3c.REC_STATUS
) B2
	INNER JOIN B1PERMIT B ON
		1=1
		AND B.SERV_PROV_CODE = B2.SERV_PROV_CODE AND B.REC_STATUS = B2.REC_STATUS
		AND B.B1_PER_ID1 = B2.B1_PER_ID1 AND B.B1_PER_ID2 = B2.B1_PER_ID2 AND B.B1_PER_ID3 = B2.B1_PER_ID3
	LEFT OUTER JOIN BWORKDES BWD ON
		1=1
		AND B.SERV_PROV_CODE = BWD.SERV_PROV_CODE AND B.REC_STATUS = BWD.REC_STATUS
		AND B.B1_PER_ID1 = BWD.B1_PER_ID1 AND B.B1_PER_ID2 = BWD.B1_PER_ID2 AND B.B1_PER_ID3 = BWD.B1_PER_ID3
	INNER JOIN BPERMIT_DETAIL BD ON
		1=1
		AND B.SERV_PROV_CODE = BD.SERV_PROV_CODE AND B.REC_STATUS = BD.REC_STATUS
		AND B.B1_PER_ID1 = BD.B1_PER_ID1 AND B.B1_PER_ID2 = BD.B1_PER_ID2 AND B.B1_PER_ID3 = BD.B1_PER_ID3
		AND BD.TOTAL_FEE <> BD.TOTAL_PAY
	INNER JOIN F4FEEITEM F4F ON
		1=1 AND B.SERV_PROV_CODE = F4F.SERV_PROV_CODE AND B.REC_STATUS = F4F.REC_STATUS
		AND B.B1_PER_ID1 = F4F.B1_PER_ID1 AND B.B1_PER_ID2 = F4F.B1_PER_ID2 AND B.B1_PER_ID3 = F4F.B1_PER_ID3
		AND F4F.GF_FEE <> COALESCE((
			SELECT SUM(X4F.fee_allocation)
			FROM X4PAYMENT_FEEITEM X4F WHERE
				1=1 AND F4F.FEEITEM_SEQ_NBR = X4F.FEEITEM_SEQ_NBR
				AND B.SERV_PROV_CODE = X4F.SERV_PROV_CODE AND B.REC_STATUS = X4F.REC_STATUS
				AND B.B1_PER_ID1 = X4F.B1_PER_ID1 AND B.B1_PER_ID2 = X4F.B1_PER_ID2 AND B.B1_PER_ID3 = X4F.B1_PER_ID3
		),0)
		AND F4F.GF_ITEM_STATUS_FLAG = 'INVOICED'
	--INNER JOIN X4PAYMENT_FEEITEM X4FI ON
	INNER JOIN X4FEEITEM_INVOICE X4FI ON
		1=1 AND F4F.FEEITEM_SEQ_NBR = X4FI.FEEITEM_SEQ_NBR
		AND B.SERV_PROV_CODE = X4FI.SERV_PROV_CODE AND B.REC_STATUS = X4FI.REC_STATUS
		AND B.B1_PER_ID1 = X4FI.B1_PER_ID1 AND B.B1_PER_ID2 = X4FI.B1_PER_ID2 AND B.B1_PER_ID3 = X4FI.B1_PER_ID3
	LEFT OUTER JOIN F4INVOICE F4I ON
		1=1 AND B.SERV_PROV_CODE = F4I.SERV_PROV_CODE AND B.REC_STATUS = F4I.REC_STATUS
		AND F4I.INVOICE_NBR = X4FI.INVOICE_NBR AND F4I.balance_due > 0
WHERE
	1=1
	AND UPPER(B2.SERV_PROV_CODE) = 'ATLANTA_GA'
	AND B2.B1_MASTER_ID1 = '{?MasterID1}'
	AND B2.B1_MASTER_ID2 = '{?MasterID2}'
	AND B2.B1_MASTER_ID3 = '{?MasterID3}'
	AND B2.SERV_PROV_CODE = '{?ServProv}'
	AND B2.REC_STATUS = '{?RecStatus}'
--    AND B2.B1_MASTER_ID1 = '16CAP'
--    AND B2.B1_MASTER_ID2 = '00000'
--    AND B2.B1_MASTER_ID3 = '000Q7'
--    AND B2.SERV_PROV_CODE = 'ATLANTA_GA'
--    AND B2.REC_STATUS = 'A'