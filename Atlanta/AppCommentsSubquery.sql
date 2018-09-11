SELECT
    BPC.REC_DATE APPCOMMENTDATE,
    BPC.TEXT APPCOMMENT
    
FROM 	B1PERMIT b

    LEFT OUTER JOIN BPERMIT_COMMENT BPC ON 1=1
        and b.rec_status = bpc.rec_status
        and b.serv_prov_code = bpc.serv_prov_code
        and b.b1_per_Id1 = bpc.b1_per_id1
        and b.b1_per_Id2 = bpc.b1_per_id2
        and b.b1_per_Id3 = bpc.b1_per_id3
        
WHERE 
        B.B1_ALT_ID = UPPER('{?capid}')
        AND BPC.REC_STATUS = 'A'