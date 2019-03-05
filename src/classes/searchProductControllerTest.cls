@isTest
public class searchProductControllerTest {

    @TestSetup static void setup(){
        
        insert new Tag__c(CurrencyIsoCode = 'USD', Name = 'test'); 
        insert new Tag__c(CurrencyIsoCode = 'USD', Name = 'test2'); 
		Tag__c tt = new Tag__c(CurrencyIsoCode = 'USD', Name = 'risk'); 
        insert tt;
        
        insert new Product__c(Name = 'rrrrr', Short_description__c = 'ttttt', Short_name__c = 'yyy', Product_Information__c = 'uuuuuu');
        Product__c pp =  new Product__c(Name = 'BenchmaRQ', Short_description__c = 'qwqwqwwqwqw', Short_name__c = 'yyy', Product_Information__c = 'qqqqqqq');
        insert pp;
        
        insert new ProductTagAssociation__c(Tag__c = tt.Id, GC_Product__c = pp.id);
	}
    
    static testMethod void amountReturnedTest(){
        System.Test.startTest();
        List<Tag__c> tags = new List<Tag__c>([SELECT id, Name FROM Tag__c]);
        System.assertNotEquals(0, searchProductController.amountReturned('getAllProducts', tags, false));
        System.Test.stopTest();
    }
    
    static testMethod void amountReturnedElseTest(){
        System.Test.startTest();
        List<Tag__c> tags = new List<Tag__c>([SELECT id, Name FROM Tag__c]);
        System.assertNotEquals(0, searchProductController.amountReturned('getSearchProducts', tags, true));
        System.Test.stopTest();
    }
    
    static testMethod void getAllProductsTest(){
        System.Test.startTest();
        System.assertNotEquals(null, searchProductController.getAllProducts(5));
        System.Test.stopTest();
    }
    
    
    static testMethod void getProfileInfoTest(){
        System.Test.startTest();
        System.assertNotEquals(null, searchProductController.getProfileInfo());
        System.Test.stopTest();
    }
    
    
    static testMethod void getTagsTest(){
        System.Test.startTest();
        System.assertNotEquals(null, searchProductController.getTags(0));
        System.Test.stopTest();
    }

    static testMethod void getAllProductsElseTest(){
        System.Test.startTest();
        System.assertNotEquals(null, searchProductController.getAllProducts(null));
        System.Test.stopTest();
    }
    
    static testMethod void getAllTagsTest(){
        System.Test.startTest();
        System.assertNotEquals(null, searchProductController.getAllTags(true));
        System.assertNotEquals(null, searchProductController.getAllTags(false));
        System.Test.stopTest();
    }
    
    static testMethod void getSearchProductsTest(){
        System.Test.startTest();
        List<Tag__c> tags = new List<Tag__c>([SELECT id, Name FROM Tag__c]);
        System.assertnotEquals(0, searchProductController.getSearchProducts(tags, true, 0).size());
        System.Test.stopTest();
    }
    
    static testMethod void lookUpTagsTest(){
        System.Test.startTest();
         List<Tag__c> tags = new List<Tag__c>([SELECT id, Name FROM Tag__c WHERE Name LIKE 'test2']);
        System.assertNotEquals(0, searchProductController.lookUpTags('risk', true, tags).size());
        System.Test.stopTest();
    }
    
    static testMethod void getEmployeeOfProductByIdTest(){
        System.Test.startTest();
        Employee__c e = new Employee__c(Employee_ID__c = 'qqqqqqqqqqq');
        insert e;
        System.assertNotEquals(null, searchProductController.getEmployeeOfProductById(e.id));
        System.Test.stopTest();
    }
    
    static testMethod void getProductByIdTest(){
        System.Test.startTest();
        Product__c pp =  new Product__c(Name = 'BenchmaRQTest', Short_description__c = 'qwqwqwwqwqw', Short_name__c = 'yyy', Product_Information__c = 'qqqqqqq');
        insert pp;
        System.assertNotEquals(null, searchProductController.getProductById(pp.id));
        System.Test.stopTest();
    }
        
}