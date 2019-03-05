@isTest
public class SearchCompanyControllerTest {

    @TestSetup static void setup(){
       Account ac = new Account (Name = 'test', MEM_REC_ID__c = '123');
        insert ac;
        insert new GC_Profile__c(Name = 'Test', Company__c = ac.Id);
	}
    

    static testMethod void getLoggedUserGcProfilesTest(){
        System.Test.startTest();
        System.assertEquals(1, SearchCompanyController.getLoggedUserGcProfiles().size());
        System.Test.stopTest();
    }
    
    static testMethod void fetchGcProfilesTest(){
        System.Test.startTest();
        System.assertEquals(1, SearchCompanyController.fetchGcProfiles('Test', true).size());
        System.assertEquals(1, SearchCompanyController.fetchGcProfiles('Test', false).size());
        System.assertEquals(1, SearchCompanyController.fetchGcProfiles( null, true).size());
        System.assertEquals(1, SearchCompanyController.fetchGcProfiles( '', false).size());
        System.Test.stopTest();
    }
    
     static testMethod void getMoreCompany(){
        System.Test.startTest();
        System.assertEquals(0, SearchCompanyController.getMoreCompany(1).size());
        System.Test.stopTest();
    }
}