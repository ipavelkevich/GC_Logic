public without sharing class SearchCompanyController {
    
    @AuraEnabled
    public static List<GC_Profile__c> getLoggedUserGcProfiles(){
        
        Id userId = UserInfo.getUserId();
        Map <Id, Account> accs = new Map <Id, Account> ([Select Id, Name from Account Where OwnerId = :userId]);
        
        List<GC_Profile__c> gcProfiles = [SELECT Id, Name, OwnerId, Company__c, Market__c, Ownership_CR_Benchmarking__c,
                                                Commercial_Lines_Total__c, Region__c, Operational__c , Ownership__c, Personal_Lines_Total__c, Specialty_Lines_Total__c,
                                                HO__c, Property__c, A_H__c, Auto__c, Liability__c, Assumed_Reins__c, WC__c, Financial_Lines_Surety_Mortgage_Credi__c,
                                                Other_B_M_Aircraft_Ocean_Marine__c, Surplus__c, ROS__c, GWP__c, NWP__c, GWP_Growth__c, Ceded_Ratio__c, Net_CR__c, Profitability_Trend__c,
                                                Best_Ratings__c, Non_Life_GWP_2017_2016__c, Non_Life_NWP_2017_2016__c, Region_NPE_CAGR_Benchmarking__c,
                                                Operational_NPE_CAGR_Benchmarking__c, Ownership_NPE_CAGR_Benchmarking__c, Region_NPE_CAGR_Quartile__c, Operational_NPE_CAGR_Quartile__c,
                                                Ownership_NPE_CAGR_Quartile__c, Region_PHS_CAGR_Benchmarking__c, Operational_PHS_CAGR_Benchmarking__c, Ownership_PHS_CAGR_Benchmarking__c,
                                                Region_PHS_CAGR_Quartile__c, Operational_PHS_CAGR_Quartile__c, Ownership_PHS_CAGR_Quartile__c, Region_CR_Benchmarking__c,
                                                Operational_CR_Benchmarking__c, Region_CR_Quartile__c, Operational_CR_Quartile__c, Ownership_CR_Quartile__c, Region_ROS_AVG_Benchmarking__c,
                                                Operational_ROS_AVG_Benchmarking__c, Ownership_ROS_AVG_Benchmarking__c, Region_ROS_AVG_Quartile__c, Operational_ROS_AVG_Quartile__c,
                                                Ownership_ROS_AVG_Quartile__c, Region_NPW_PHS_Benchmarking__c, Operational_NPW_PHS_Benchmarking__c, Ownership_NPW_PHS_Benchmarking__c,
                                                Region_NPW_PHS_Quartile__c, Operational_NPW_PHS_Quartile__c, Ownership_NPW_PHS_Quartile__c, Region_RES_PHS_Benchmarking__c,
                                                Operational_RES_PHS_Benchmarking__c, Ownership_RES_PHS_Benchmarking__c, Region_RES_PHS_Quartile__c, Operational_RES_PHS_Quartile__c,
                                                Ownership_RES_PHS_Quartile__c, Region_ROS_VOL_Benchmarking__c, Operational_ROS_VOL_Benchmarking__c, Ownership_ROS_VOL_Benchmarking__c,
                                                Region_ROS_VOL_Quartile__c, Operational_ROS_VOL_Quartile__c, Ownership_ROS_VOL_Quartile__c
                                             FROM GC_Profile__c WHERE Company__c != null AND Company__c IN : accs.keySet() ORDER BY Name LIMIT 11];  
        return gcProfiles;
    } 
    
    @AuraEnabled
    public static List<InnerClass> fetchGcProfiles(String searchKeyWord, Boolean check) {
        List <InnerClass> returnListGcProfiles = new List <InnerClass> ();
        String query = 'SELECT Id, Name, OwnerId, Company__c, Market__c, Ownership_CR_Benchmarking__c,' + 
                            ' Commercial_Lines_Total__c, Region__c, Operational__c , Ownership__c, Personal_Lines_Total__c, Specialty_Lines_Total__c,' + 
                            ' HO__c, Property__c, A_H__c, Auto__c, Liability__c, Assumed_Reins__c, WC__c, Financial_Lines_Surety_Mortgage_Credi__c,' + 
                            ' Other_B_M_Aircraft_Ocean_Marine__c, Surplus__c, ROS__c, GWP__c, NWP__c, GWP_Growth__c, Ceded_Ratio__c, Net_CR__c, Profitability_Trend__c,' + 
                            ' Best_Ratings__c, Non_Life_GWP_2017_2016__c, Non_Life_NWP_2017_2016__c, Region_NPE_CAGR_Benchmarking__c,' + 
                            ' Operational_NPE_CAGR_Benchmarking__c, Ownership_NPE_CAGR_Benchmarking__c, Region_NPE_CAGR_Quartile__c, Operational_NPE_CAGR_Quartile__c,' + 
                            ' Ownership_NPE_CAGR_Quartile__c, Region_PHS_CAGR_Benchmarking__c, Operational_PHS_CAGR_Benchmarking__c, Ownership_PHS_CAGR_Benchmarking__c,' + 
                            ' Region_PHS_CAGR_Quartile__c, Operational_PHS_CAGR_Quartile__c, Ownership_PHS_CAGR_Quartile__c, Region_CR_Benchmarking__c,' + 
                            ' Operational_CR_Benchmarking__c, Region_CR_Quartile__c, Operational_CR_Quartile__c, Ownership_CR_Quartile__c, Region_ROS_AVG_Benchmarking__c,' + 
                            ' Operational_ROS_AVG_Benchmarking__c, Ownership_ROS_AVG_Benchmarking__c, Region_ROS_AVG_Quartile__c, Operational_ROS_AVG_Quartile__c,' + 
                            ' Ownership_ROS_AVG_Quartile__c, Region_NPW_PHS_Benchmarking__c, Operational_NPW_PHS_Benchmarking__c, Ownership_NPW_PHS_Benchmarking__c,' + 
                            ' Region_NPW_PHS_Quartile__c, Operational_NPW_PHS_Quartile__c, Ownership_NPW_PHS_Quartile__c, Region_RES_PHS_Benchmarking__c,' + 
                            ' Operational_RES_PHS_Benchmarking__c, Ownership_RES_PHS_Benchmarking__c, Region_RES_PHS_Quartile__c, Operational_RES_PHS_Quartile__c,' + 
                            ' Ownership_RES_PHS_Quartile__c, Region_ROS_VOL_Benchmarking__c, Operational_ROS_VOL_Benchmarking__c, Ownership_ROS_VOL_Benchmarking__c,' + 
                            ' Region_ROS_VOL_Quartile__c, Operational_ROS_VOL_Quartile__c, Ownership_ROS_VOL_Quartile__c' +  
                            ' FROM GC_Profile__c WHERE Company__c != null ';

        If( searchKeyWord != '' && searchKeyWord != null ){
            String searchKey = '%' + searchKeyWord + '%';  
            query += 'AND Name LIKE \'' + searchKey + '\' ORDER BY Name LIMIT ';
            if(check){
                query += '5';
            }else{
                query += '100';
            }           
        } else {
            if(check){
                query += ' ORDER BY Name LIMIT 5';
            }else{
                query += ' ORDER BY Name LIMIT 100';
            }
        }
        List<GC_Profile__c> gcProfiles = Database.query(query);
        for (GC_Profile__c gg : gcProfiles) {
            returnListGcProfiles.add(new InnerClass (false, gg));    
        } 
        return returnListGcProfiles;
    }

    public class InnerClass {
        @AuraEnabled
        public Boolean bool {get;set;}
        @AuraEnabled
        public GC_Profile__c obj {get;set;}
        
        InnerClass (Boolean bool, GC_Profile__c obj) {
            this.bool = bool;
            this.obj = obj;
        }
    }
    
    @AuraEnabled
    public static List<GC_Profile__c> getMoreCompany ( Integer amount ){
        List<GC_Profile__c> profiles;
        Id userId = UserInfo.getUserId();
        Map <Id, Account> accs = new Map <Id, Account> ([Select Id, Name from Account Where OwnerId = :userId]);
        
        profiles = [SELECT Id, Name, OwnerId, Company__c, Market__c, Ownership_CR_Benchmarking__c,
                                                Commercial_Lines_Total__c, Region__c, Operational__c , Ownership__c, Personal_Lines_Total__c, Specialty_Lines_Total__c,
                                                HO__c, Property__c, A_H__c, Auto__c, Liability__c, Assumed_Reins__c, WC__c, Financial_Lines_Surety_Mortgage_Credi__c,
                                                Other_B_M_Aircraft_Ocean_Marine__c, Surplus__c, ROS__c, GWP__c, NWP__c, GWP_Growth__c, Ceded_Ratio__c, Net_CR__c, Profitability_Trend__c,
                                                Best_Ratings__c, Non_Life_GWP_2017_2016__c, Non_Life_NWP_2017_2016__c, Region_NPE_CAGR_Benchmarking__c,
                                                Operational_NPE_CAGR_Benchmarking__c, Ownership_NPE_CAGR_Benchmarking__c, Region_NPE_CAGR_Quartile__c, Operational_NPE_CAGR_Quartile__c,
                                                Ownership_NPE_CAGR_Quartile__c, Region_PHS_CAGR_Benchmarking__c, Operational_PHS_CAGR_Benchmarking__c, Ownership_PHS_CAGR_Benchmarking__c,
                                                Region_PHS_CAGR_Quartile__c, Operational_PHS_CAGR_Quartile__c, Ownership_PHS_CAGR_Quartile__c, Region_CR_Benchmarking__c,
                                                Operational_CR_Benchmarking__c, Region_CR_Quartile__c, Operational_CR_Quartile__c, Ownership_CR_Quartile__c, Region_ROS_AVG_Benchmarking__c,
                                                Operational_ROS_AVG_Benchmarking__c, Ownership_ROS_AVG_Benchmarking__c, Region_ROS_AVG_Quartile__c, Operational_ROS_AVG_Quartile__c,
                                                Ownership_ROS_AVG_Quartile__c, Region_NPW_PHS_Benchmarking__c, Operational_NPW_PHS_Benchmarking__c, Ownership_NPW_PHS_Benchmarking__c,
                                                Region_NPW_PHS_Quartile__c, Operational_NPW_PHS_Quartile__c, Ownership_NPW_PHS_Quartile__c, Region_RES_PHS_Benchmarking__c,
                                                Operational_RES_PHS_Benchmarking__c, Ownership_RES_PHS_Benchmarking__c, Region_RES_PHS_Quartile__c, Operational_RES_PHS_Quartile__c,
                                                Ownership_RES_PHS_Quartile__c, Region_ROS_VOL_Benchmarking__c, Operational_ROS_VOL_Benchmarking__c, Ownership_ROS_VOL_Benchmarking__c,
                                                Region_ROS_VOL_Quartile__c, Operational_ROS_VOL_Quartile__c, Ownership_ROS_VOL_Quartile__c
                                             FROM GC_Profile__c WHERE Company__c != null AND Company__c IN : accs.keySet() ORDER BY Name LIMIT 11 OFFSET : amount];
        
        return profiles;
    }
    
}