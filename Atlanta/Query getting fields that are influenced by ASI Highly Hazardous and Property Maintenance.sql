select-- * 
a.b1_short_notes,
c.b1_checkbox_desc,
c.b1_checklist_comment,
b.b1_alt_id
from bpermit_detail a
inner join b1permit b on
a.b1_per_id1 = b.b1_per_id1
and a.b1_per_id3 = b.b1_per_id3

inner join bchckbox c on
a.b1_per_id1 = c.b1_per_id1
and a.b1_per_id3 = c.b1_per_id3

where b.b1_per_group = 'Enforcement' and c.b1_checkbox_desc in ('Property Maintenance','Highly Hazardous') and c.b1_checklist_comment = 'CHECKED'