Select B1_Alt_Id, 
       B1_App_Type_Alias,
       fn_get_address_info (a.Serv_Prov_Code,a.B1_Per_Id1, a.B1_Per_Id2, a.B1_Per_Id3, 'Y','PartAddr_Line'),
       B1_Created_By,
       
    
(Select b.B1_Str_Suffix_Dir From B3addres b 
  Where b.Serv_Prov_Code = a.Serv_Prov_Code  
    And b.B1_Per_Id1     = a.B1_Per_Id1   
    And b.B1_Per_Id2     = a.B1_Per_Id2
    And b.B1_Per_Id3     = a.B1_Per_Id3 
    And b.B1_Str_Suffix_Dir Is Not Null
    And Rownum           = 1) As Quadrant,
    
            NVL((Select To_Number(NVL((CASE B1_Checklist_Comment WHEN ' ' THEN '0' ELSE B1_Checklist_Comment END), 0)) from BCHCKBOX b
               Where b.SERV_PROV_CODE = a.SERV_PROV_CODE
                 And b.B1_PER_ID1 = a.B1_PER_ID1
                 And b.B1_PER_ID2 = a.B1_PER_ID2
                 And b.B1_PER_ID3 = a.B1_PER_ID3
                 And b.B1_CHECKBOX_DESC = 'Application Square Footage'
                 And RowNum       = 1), 0 ) As Square_Footage,

       B1_Special_Text,
       to_char(sh.Status_Date,'MM/DD/YYYY'),
       To_Char(sh.Status_Date, 'YYYY') As Year,
       To_Char(sh.Status_Date, 'MM/YYYY') As MonthYear,
            NVL((Select To_Number(NVL((CASE B1_Checklist_Comment WHEN ' ' THEN '0' ELSE B1_Checklist_Comment END), 0)) from Bchckbox b
               Where b.Serv_Prov_Code = a.Serv_Prov_Code
                 And b.B1_Per_Id1     = a.B1_Per_Id1   
                 And b.B1_Per_Id2     = a.B1_Per_Id2
                 And b.B1_Per_Id3     = a.B1_Per_Id3 
                 And b.B1_Checkbox_Desc = 'Adjusted Calculated Value' 
                 And RowNum           = 1), 0 ) As Calculated_Valuation,

            NVL((Select G3_Value_TTL from Bvaluatn b
               Where b.Serv_Prov_Code = a.Serv_Prov_Code            
                 And b.B1_Per_Id1     = a.B1_Per_Id1   
                 And b.B1_Per_Id2     = a.B1_Per_Id2
                 And b.B1_Per_Id3     = a.B1_Per_Id3  
                 And RowNum           = 1), 0) As Stated_Valuation,
                 
            (Select Total_Fee from Bpermit_Detail b
               Where b.Serv_Prov_Code = a.Serv_Prov_Code            
                 And b.B1_Per_Id1     = a.B1_Per_Id1   
                 And b.B1_Per_Id2     = a.B1_Per_Id2
                 And b.B1_Per_Id3     = a.B1_Per_Id3  
                 And RowNum           = 1) As Total_Permit_Fees,
                 
            (Select B.B1_CHECKLIST_COMMENT
                    FROM BCHCKBOX B
                WHERE B.SERV_PROV_CODE = A.SERV_PROV_CODE
                  AND B.B1_PER_ID1     = A.B1_PER_ID1
                  AND B.B1_PER_ID2     = A.B1_PER_ID2
                  AND B.B1_PER_ID3     = A.B1_PER_ID3
                  AND B.B1_CHECKBOX_DESC = 'Workstream'
            ) as Workstream

From b1permit a Join Status_History sh 
                  On sh.Serv_Prov_Code = a.Serv_Prov_Code 
                 And sh.B1_Per_Id1     = a.B1_Per_Id1   
                 And sh.B1_Per_Id2     = a.B1_Per_Id2
                 And sh.B1_Per_Id3     = a.B1_Per_Id3  
                 And sh.Status_Hist_Nbr = (Select Min(Status_Hist_Nbr) From Status_History s
                                            Where s.Serv_Prov_Code = a.Serv_Prov_Code 
                                              And s.B1_Per_Id1     = a.B1_Per_Id1   
                                              And s.B1_Per_Id2     = a.B1_Per_Id2
                                              And s.B1_Per_Id3     = a.B1_Per_Id3  
                                              And s.Status     = 'Issued'               
                                              And s.Status_Date >= {?From_Date}
                                              And s.Status_Date <{?To_Date} +1
                                              --And s.Status_Date >= '06-JAN-16'
                                              --And s.Status_Date < '09-JAN-16' --+1
                                              And s.Rec_Status = 'A')
      Where a.Serv_Prov_Code = 'ATLANTA_GA'
 And Substr(a.B1_Alt_Id,1,2) IN ('BB','LD');
  
