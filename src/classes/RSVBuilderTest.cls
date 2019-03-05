@isTest
public class RSVBuilderTest {
    
    static TestMethod void data(){
        GC_Profile__c acct = (GC_Profile__c)TestDataFactory.createsObject(new GC_Profile__c(),true);
        ContentVersion contentVersion = (ContentVersion)TestDataFactory.createsObject(new ContentVersion(),true);
        ContentVersion contentVersionSecond = (ContentVersion)TestDataFactory.createsObject(new ContentVersion(FirstPublishLocationId=acct.id),true);
        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        ContentDocumentLink cdl = (ContentDocumentLink)TestDataFactory.createsObject(
            new ContentDocumentLink(
                LinkedEntityId=acct.id,
                ContentDocumentId = documents[0].Id,
                shareType = 'V'),true);

        Account acc = new Account(name = 'test', MEM_REC_ID__c = '123');
        insert acc;
        
        GC_Profile__c gcProfile = new GC_Profile__c(Company__c = acc.id);
        insert gcProfile;
        
        Files_History__c Files_History = new Files_History__c(Description__c = 'description', Prepared_For__c = 'prepareFor', GC_Profile__c = gcProfile.Id, User_Id__c = UserInfo.getUserId());
        insert Files_History;
        
        List<id> test = new List<Id>();
        test.add('0691b000000NPHXAA4');
      
        System.Test.startTest();
        system.assertEquals(String.valueOf(RSVBuilder.getDocs(acct.id).containskey('Other')), 'true','');
        
        System.assertNotEquals(null, RSVBuilder.saveHistory('description', 'prepareFor', gcProfile.Id));
        System.assertNotEquals(null, RSVBuilder.getHistory(gcProfile.Id));
       
        System.assertNotEquals(null, RSVBuilder.saveExisting(test, gcProfile.Id, Files_History.id));
        System.assertNotEquals(null, RSVBuilder.delHistory(gcProfile.Id, Files_History.id));
        System.Test.stopTest();
    }
}