SELECT --COUNT(*)
1
,B.GA_FNAME AS "First Name"
,B.GA_MNAME AS "Middle Name"
,B.GA_LNAME AS "Last Name"
,A.USER_NAME AS "User Name"
,B.GA_TITLE AS "Title"
,B.GA_EMPLOY_PH1 AS "Phone Num"
,B.GA_EMAIL AS "Email"
,A.LAST_LOGIN_TIME AS "Last Login Time"
,B.GA_BUREAU_CODE || '-' || B.GA_DIVISION_CODE || '-' || B.GA_OFFICE_CODE || '-' || B.GA_SECTION_CODE || '-' || B.GA_GROUP_CODE AS "Bureau Hierarchy"
,B.GA_AGENCY_CODE AS "Agency"

FROM PUSER A
INNER JOIN G3STAFFS B ON
A.USER_NAME = B.USER_NAME
where 1=1
AND A.USER_NAME NOT LIKE 'PUBLICUSER%'
AND A.REC_STATUS = 'A'
AND A.LAST_LOGIN_TIME >= '01-NOV-17'

ORDER BY
B.GA_LNAME,
B.GA_FNAME