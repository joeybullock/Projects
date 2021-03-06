SELECT DISTINCT
    A.SD_PRO_DES,
    A.SD_APP_DES,
    TO_CHAR(A.SD_APP_DD, 'MM/DD/YYYY HH24:MI:SS'),
    TO_CHAR(A.B1_DUE_DD, 'MM/DD/YYYY HH24:MI:SS'),
    TO_CHAR(A.G6_ASGN_DD,'MM/DD/YYYY HH24:MI:SS'),
    TO_CHAR(A.REC_DATE, 'MM/DD/YYYY HH24:MI:SS'),
    TO_CHAR(A.SD_ESTIMATED_DUE_DATE, 'MM/DD/YYYY HH24:MI:SS'),
    TO_CHAR(A.SD_TRACK_START_DATE, 'MM/DD/YYYY HH24:MI:SS'),
    FLOOR(24 * 60 * (A.REC_DATE - A.SD_TRACK_START_DATE)) AS "Hours In Poss",
    A.GPROCESS_HISTORY_SEQ_NBR,
    NTH_VALUE(A.SD_APP_DES,3) --Had to do 3rd_Value because each recorded WF History transaction is duplicated, so 1&2 are 1st, 3&4 are 2nd, etc.
        OVER (PARTITION BY A.SD_APP_DES ORDER BY A.GPROCESS_HISTORY_SEQ_NBR ASC
        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
        AS "Second Review"

FROM GPROCESS_HISTORY A

    INNER JOIN B1PERMIT B ON
        A.B1_PER_ID1 = B.B1_PER_ID1
    AND A.B1_PER_ID3 = B.B1_PER_ID3

WHERE
    B.B1_ALT_ID = 'BB-201804232'

ORDER BY
    A.GPROCESS_HISTORY_SEQ_NBR ASC