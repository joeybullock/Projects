select SD_PRO_DES, TO_CHAR(MAX(SD_APP_DD),'MM/DD/YYYY')
from gprocess_history
WHERE B1_PER_ID1 = '17CAP' AND B1_PER_ID3 = '00BF5'
GROUP BY SD_PRO_DES
ORDER BY MAX(SD_APP_DD)