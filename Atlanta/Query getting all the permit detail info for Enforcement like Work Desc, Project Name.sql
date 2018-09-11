select * from b1permit a
inner join bpermit_detail b on
a.b1_per_id1 = b.b1_per_id1
and a.b1_per_id3 = b.b1_per_id3

inner join bworkdes c on
a.b1_per_id1 = c.b1_per_id1
and a.b1_per_id3 = c.b1_per_id3
where a.b1_per_group = 'Enforcement'
