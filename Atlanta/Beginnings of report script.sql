select a.b1_alt_id,
b.c6_reference_type,
c.g6_act_des,
c.g6_doc_des,
c.g6_status,
c.g6_status_dd

from b1permit a
inner join bpermit_detail b on
a.b1_per_id1 = b.b1_per_id1
and a.b1_per_id3 = b.b1_per_id3

inner join g6action c on
a.b1_per_id1 = c.b1_per_id1
and a.b1_per_id3 = c.b1_per_id3
and c.g6_status_dd between '01-JAN-17' and '31-MAR-17'

where
a.b1_per_group = 'Enforcement'
and a.b1_per_type = 'Complaint'