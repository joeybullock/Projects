select * from RINSPTYP A
LEFT OUTER JOIN G6ACTION B ON
A.INSP_TYPE = B.G6_ACT_TYP
AND A.INSP_SEQ_NBR = B.INSP_SEQ_NBR
AND B.G6_ACT_DD > '01-JAN-17'
AND B.REC_STATUS = 'A'


WHERE A.REC_STATUS = 'A'
AND A.INSP_CODE NOT IN ('Code', 'CODE', 'BOB License', 'Fire Inspection', 'Fire Liquor', 'Fire Other', 'Fire Sp.Evt', 'Fire Tents', 'Fire_Comp.', 'Fire_Cooking', 'Fire_EDU', 'FIRE_GENERAL')
--AND B.SERV_PROV_CODE IS NULL

ORDER BY A.INSP_CODE, A.INSP_TYPE, B.G6_ACT_DD