@isTest
public class GlosaryControlllerTest {
    
    @TestSetup static void setup(){
        insert new Glosary__c(Description__c = 'description..');
	}
    
   static testMethod void getAllGlosariesTest(){
       System.Test.startTest();
       System.assertEquals(1, GlosaryControlller.getAllGlosaries().size());
       System.Test.stopTest();
    }
}