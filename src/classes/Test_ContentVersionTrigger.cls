@isTest
public class Test_ContentVersionTrigger {
    
    static testMethod void testProjectName(){
        
        Account ac = new Account ();
        ac.Name = 'test';
        ac.MEM_REC_ID__c = '123';
        Database.insert(ac);
        
        GC_Profile__c gc = new GC_Profile__c();
        gc.Company__c = ac.Id;
        gc.Name = 'qqq1';
        Database.insert(gc);
        
        Product__c gc2 = new Product__c();
        gc2.Name = 'qqq12';
        Database.insert(gc2);
        
        ContentVersion cv = new ContentVersion();
        cv.title='Test title';
        cv.VersionData=blob.valueof('New Bitmap Image.bmp');
        cv.PathOnClient ='/abc.txt';
        cv.Title  ='H';
        cv.Record_Id__c = '123';
        cv.Record_Type__c = 'GC_Profile';
        cv.Type__c = 'Capital';
        cv.Sub_type__c = 'Other';
        Database.insert(cv);
        
        ContentVersion cv5 = new ContentVersion();
        cv5.title='Test title';
        cv5.VersionData=blob.valueof('New Bitmap Image.bmp');
        cv5.PathOnClient ='/abc.txt';
        cv5.Title  ='H';
        cv5.Record_Id__c = gc2.id;
        cv5.Record_Type__c = 'GC_Product';
        Database.insert(cv5);
        
        ContentVersion cv3 = new ContentVersion();
        cv3.title='Test title 3';
        cv3.VersionData=blob.valueof('Image.bmp');
        cv3.PathOnClient ='/abc2.txt';
        cv3.Title  ='H';
        cv3.Type__c = 'Capital';
        cv3.Record_Id__c = 'qqq3';
        cv3.Record_Type__c = '345tyrges';
        cv3.Sub_type__c = 'Other';
        Database.insert(cv3);

        System.Test.startTest();
        ContentVersionTriggerHandler cvth = new ContentVersionTriggerHandler();
        System.assertEquals(false, cvth.IsDisabled());
        System.Test.stopTest();
    }
}