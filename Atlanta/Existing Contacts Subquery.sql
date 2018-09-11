SELECT
	'('||Ownr.b1_contact_type||')' ContactType,
  CASE WHEN COALESCE(ownr.b1_full_name, ownr.b1_fname||' '||ownr.b1_mname||' '||ownr.b1_lname) IS NOT NULL THEN COALESCE(ownr.b1_full_name, ownr.b1_fname||' '||ownr.b1_mname||' '||ownr.b1_lname) ELSE '' END ||
  CASE WHEN (COALESCE(ownr.b1_full_name, ownr.b1_fname||' '||ownr.b1_mname||' '||ownr.b1_lname) IS NOT NULL AND ownr.b1_business_name IS NOT NULL) THEN ', '||ownr.b1_business_name ELSE ownr.b1_business_name END NAME,
  CASE WHEN ownr.b1_address1 IS NULL THEN '' ELSE ownr.b1_address1 END ||
  CASE WHEN ownr.b1_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_address1 is not null then chr(10)||ownr.b1_address2 else ownr.b1_address2 end)END ||
  CASE WHEN ownr.b1_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_address1||ownr.b1_address2 is not null then chr(10)||ownr.b1_address3 else ownr.b1_address3 end)END ||
  CASE WHEN ownr.b1_city || ownr.b1_state || ownr.b1_zip is null then '' else chr(10)||ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip end address,
  ''
FROM B3Contact Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
		AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
  union all
  
SELECT
'(OWNER)',
  COALESCE(ownr.b1_owner_full_name,ownr.b1_owner_fname||' '||ownr.b1_owner_mname||' '||ownr.b1_owner_lname) name,
  CASE WHEN ownr.b1_mail_address1 IS NULL THEN '' ELSE ownr.b1_mail_address1 END ||
  CASE WHEN ownr.b1_mail_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_mail_address1 is not null then chr(10)||ownr.b1_mail_address2 else ownr.b1_mail_address2 end)END ||
  CASE WHEN ownr.b1_mail_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_mail_address1||ownr.b1_mail_address2 is not null then chr(10)||ownr.b1_mail_address3 else ownr.b1_mail_address3 end)END ||
  CASE WHEN ownr.b1_mail_city || ownr.b1_mail_state || ownr.b1_mail_zip is null then '' else chr(10)||ownr.b1_mail_city||', '||ownr.b1_mail_state||' '|| ownr.b1_mail_zip end address,
  ''
FROM B3Owners Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
		AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
union all

SELECT
  '(COMPANY)',
  CASE WHEN ownr.b1_cae_fname ||' '|| ownr.b1_cae_mname ||' '||ownr.b1_cae_lname IS NOT NULL THEN ownr.b1_cae_fname ||' '|| ownr.b1_cae_mname ||' '||ownr.b1_cae_lname ELSE '' END ||
CASE WHEN (ownr.b1_cae_fname ||' '|| ownr.b1_cae_mname ||' '||ownr.b1_cae_lname IS NOT NULL AND TRIM(ownr.b1_cae_fname ||' '|| ownr.b1_cae_mname ||' '||ownr.b1_cae_lname) <> '') THEN ', '||Ownr.B1_BUS_NAME ELSE Ownr.B1_BUS_NAME END,
  CASE WHEN ownr.b1_address1 IS NULL THEN '' ELSE ownr.b1_address1 END ||
  CASE WHEN ownr.b1_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_address1 is not null then chr(10)||ownr.b1_address2 else ownr.b1_address2 end)END ||
  CASE WHEN ownr.b1_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_address1||ownr.b1_address2 is not null then chr(10)||ownr.b1_address3 else ownr.b1_address3 end)END ||
  CASE WHEN ownr.b1_city || ownr.b1_state || ownr.b1_zip is null then '' else chr(10)||ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip end address,
  OWNR.B1_LICENSE_NBR
FROM B3Contra Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
		AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
