SELECT *
--DISTINCT 
--B.B1_PER_GROUP,
--B.B1_PER_TYPE,
--B.B1_PER_SUB_TYPE,
--B.B1_PER_CATEGORY,
--('ASI::' || A.B1_ACT_STATUS || '::' || A.B1_CHECKBOX_TYPE)


FROM BCHCKBOX a
inner join b1permit b on
a.b1_per_id1 = b.b1_per_id1
and a.b1_per_id3 = b.b1_per_id3
WHERE a.B1_CHECKBOX_DESC = 'Workstream'