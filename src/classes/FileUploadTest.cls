@IsTest
public class FileUploadTest {

    static TestMethod void modifyAfterUploadTest(){
        ContentVersion cc = (ContentVersion)TestDataFactory.createsObject(new ContentVersion(),true);
        
		List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        
        System.Test.startTest();
        System.assertNotEquals(null, FileUpload.modifyAfterUpload(UserInfo.getUserId(), documents[0].id));
        System.assertEquals(null, FileUpload.modifyAfterUpload( documents[0].id, UserInfo.getUserId()));
        
        System.assertNotEquals(null, FileUpload.getPicklistValuesType());
        System.assertNotEquals(null, FileUpload.getPicklistValuesSubType());
        
        FileUpload.saveFileUpload(string.valueOf(cc.Id), 'Capital', 'Other', 'Test', 'descriptionTest');
        System.Test.stopTest();
    }
}