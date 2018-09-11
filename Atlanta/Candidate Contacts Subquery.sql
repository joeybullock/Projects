SELECT
	'('||Ownr.b1_contact_type||')' ContactType,
  COALESCE(CASE WHEN ownr.b1_full_name IS NOT NULL THEN ownr.b1_full_name || ' ' ELSE '' END,
           CASE WHEN ownr.b1_fname IS NOT NULL THEN ownr.b1_fname ||' ' ELSE '' END
         ||CASE WHEN ownr.b1_mname IS NOT NULL THEN ownr.b1_mname || ' ' ELSE '' END
         ||CASE WHEN ownr.b1_lname IS NOT NULL THEN ownr.b1_lname ELSE '' END)
    ||
           CASE WHEN (COALESCE(ownr.b1_full_name, ownr.b1_fname, ownr.b1_mname, ownr.b1_lname) IS NOT NULL AND ownr.b1_business_name IS NOT NULL) THEN ', '||ownr.b1_business_name ELSE ownr.b1_business_name END NAME,
  CASE WHEN ownr.b1_address1 IS NULL THEN '' ELSE ownr.b1_address1 END ||
  CASE WHEN ownr.b1_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_address1 is not null then chr(10)||ownr.b1_address2 else ownr.b1_address2 end)END ||
  CASE WHEN ownr.b1_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_address1||ownr.b1_address2 is not null then chr(10)||ownr.b1_address3 else ownr.b1_address3 end)END ||
  CASE WHEN ownr.b1_city || ownr.b1_state || ownr.b1_zip is null then ''
    when ownr.b1_address1 || ownr.b1_address2 || ownr.b1_address3 is null then ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip
    else chr(10)||ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip end address,
  CASE WHEN ownr.b1_phone1 IS NULL THEN '' ELSE ownr.b1_phone1 end phone,
  ''
FROM B3Contact Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
		AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
    -- TEST CASE START
    --    AND 'ATLANTA_GA' = ownr.SERV_PROV_CODE
    --    AND '17BL4' = ownr.B1_PER_ID1
    --    AND '00000' = ownr.B1_PER_ID2
    --    AND '00528' = ownr.B1_PER_ID3
    --    AND 'A' = ownr.REC_STATUS
    -- TEST CASE END
  union all
  
SELECT
'(OWNER)',
  COALESCE(ownr.b1_owner_full_name,ownr.b1_owner_fname||' '||CASE WHEN ownr.b1_owner_mname IS NOT NULL THEN ownr.b1_owner_mname || ' ' ELSE '' END ||ownr.b1_owner_lname) name,
  CASE WHEN ownr.b1_mail_address1 IS NULL THEN '' ELSE ownr.b1_mail_address1 END ||
  CASE WHEN ownr.b1_mail_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_mail_address1 is not null then chr(10)||ownr.b1_mail_address2 else ownr.b1_mail_address2 end)END ||
  CASE WHEN ownr.b1_mail_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_mail_address1||ownr.b1_mail_address2 is not null then chr(10)||ownr.b1_mail_address3 else ownr.b1_mail_address3 end)END ||
  CASE WHEN ownr.b1_mail_city || ownr.b1_mail_state || ownr.b1_mail_zip is null then ''
    when ownr.b1_mail_address1 || ownr.b1_mail_address2 || ownr.b1_mail_address3 is null then ownr.b1_mail_city||', '||ownr.b1_mail_state||' '|| ownr.b1_mail_zip
    else chr(10)||ownr.b1_mail_city||', '||ownr.b1_mail_state||' '|| ownr.b1_mail_zip end address,
  CASE WHEN ownr.b1_phone IS NULL THEN '' ELSE ownr.b1_phone end phone,
  ''
FROM B3Owners Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
		AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
    -- TEST CASE START
    --    AND 'ATLANTA_GA' = ownr.SERV_PROV_CODE
    --    AND '17BL4' = ownr.B1_PER_ID1
    --    AND '00000' = ownr.B1_PER_ID2
    --    AND '00528' = ownr.B1_PER_ID3
    --    AND 'A' = ownr.REC_STATUS
    -- TEST CASE END
union all

SELECT
  '(COMPANY)',
  COALESCE(ownr.b1_bus_name,
           CASE WHEN ownr.b1_cae_fname IS NOT NULL THEN ownr.b1_cae_fname ||' ' ELSE '' END
         ||CASE WHEN ownr.b1_cae_mname IS NOT NULL THEN ownr.b1_cae_mname || ' ' ELSE '' END
         ||CASE WHEN ownr.b1_cae_lname IS NOT NULL THEN ownr.b1_cae_lname ELSE '' END)
    ||
           CASE WHEN ownr.b1_bus_name IS NOT NULL THEN (
           CASE WHEN ownr.b1_cae_fname IS NOT NULL THEN ', ' || ownr.b1_cae_fname ||' ' ELSE '' END
         ||CASE WHEN ownr.b1_cae_mname IS NOT NULL THEN ownr.b1_cae_mname || ' ' ELSE '' END
         ||CASE WHEN ownr.b1_cae_lname IS NOT NULL THEN ownr.b1_cae_lname ELSE '' END
                                                        ) ELSE ownr.b1_bus_name END NAME,
                                                        
  CASE WHEN ownr.b1_address1 IS NULL THEN '' ELSE ownr.b1_address1 END ||
  CASE WHEN ownr.b1_address2 IS NULL THEN '' ELSE( CASE when ownr.b1_address1 is not null then chr(10)||ownr.b1_address2 else ownr.b1_address2 end)END ||
  CASE WHEN ownr.b1_address3 IS NULL THEN '' ELSE( CASE when ownr.b1_address1||ownr.b1_address2 is not null then chr(10)||ownr.b1_address3 else ownr.b1_address3 end)END ||
  CASE WHEN ownr.b1_city || ownr.b1_state || ownr.b1_zip is null then ''
    when ownr.b1_address1 || ownr.b1_address2 || ownr.b1_address3 is null then ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip
    else chr(10)||ownr.b1_city||', '||ownr.b1_state||' '|| ownr.b1_zip end address,
  
  CASE WHEN ownr.b1_phone1 IS NULL THEN '' ELSE ownr.b1_phone1 end phone,
  OWNR.B1_LICENSE_NBR
FROM B3Contra Ownr
WHERE
		1=1
		AND '{?servProv}'= Ownr.SERV_PROV_CODE
    	AND '{?perID1}' = Ownr.B1_PER_ID1
		AND '{?perID2}' = Ownr.B1_PER_ID2
		AND '{?perID3}' = Ownr.B1_PER_ID3
		AND '{?recStat}' = Ownr.REC_STATUS
        
    -- TEST CASE START
    --    AND 'ATLANTA_GA' = ownr.SERV_PROV_CODE
    --    AND '17BL4' = ownr.B1_PER_ID1
    --    AND '00000' = ownr.B1_PER_ID2
    --    AND '00528' = ownr.B1_PER_ID3
    --    AND 'A' = ownr.REC_STATUS
    -- TEST CASE END
