public without sharing class searchProductController {
    
    public class Inner_Product{
          @AuraEnabled
        public Boolean bool {get;set;}
        @AuraEnabled public Product__c product {get;set;}
        @AuraEnabled public Set<Tag__c> setTags{get;set;}
        
        Inner_Product(Product__c product, Set<Tag__c> setTags, Boolean bool){
            this.product = product;
            this.setTags = setTags;
            this.bool = bool;
        }
    }
    
    @AuraEnabled
    public static Integer amountReturned(String nameMethod, List<Tag__c> valueSearch, Boolean switchValue){
        Integer amount = 0;  
        if(nameMethod == 'getAllProducts'){
            amount = [SELECT Id FROM Product__c].size();
        }else if(nameMethod == 'getSearchProducts'){
            amount = getSearchProductsForAmountReturned(valueSearch, switchValue).size();
        }
        return amount;
    }
    
    @AuraEnabled
    public static List<Inner_Product> getSearchProductsForAmountReturned(List<Tag__c> valueSearch, Boolean switchValue){
        List<Inner_Product> searchProductByTags = new List<Inner_Product>();  
        if (valueSearch != Null && valueSearch.size() > 0){
            String query = 'SELECT Id, (SELECT id, GC_Product__r.Name, Tag__r.Name FROM ProductTagAssociations__r)' +
                ' FROM Product__c where ID IN (SELECT GC_Product__c FROM ProductTagAssociation__c WHERE Tag__r.Name = \'';
            if (valueSearch.size() > 1) {
                for (Tag__c tag : valueSearch) {
                    query +=  tag.Name + '\' OR Tag__r.Name = \'';
                }
                query = query.removeEnd(' OR Tag__r.Name = \'');
            } else{
                query += valueSearch[0].Name + '\' ';
            } 
            query += ')';
            List<Product__c> products = Database.query(query);
            Set<String> tagsName = new Set<String>();
            for(Tag__c tag: valueSearch){
                tagsName.add(tag.Name);
            }
            List<Product__c> returnProducts = new List<Product__c>();
            for (Product__c product : products) {
                Set <String> temp = new Set <String> ();
                for (ProductTagAssociation__c pTA : product.ProductTagAssociations__r) {
                    temp.add(pTA.Tag__r.Name);    
                }
                if(switchValue){
                    returnProducts.add(product);
                }else{
                    if (temp.containsAll(tagsName)) {
                        returnProducts.add(product);
                    }
                }
            }
            if (returnProducts != Null && !returnProducts.isEmpty()) {
                searchProductByTags.addAll(getProductsWithTags(returnProducts));
            }
            return searchProductByTags;
        }else{
            return new List<Inner_Product>();
        }
    }
    
    @AuraEnabled
    public static List<Inner_Product> getAllProducts(Integer amount){
        List<Product__c> products;
        If(amount != null){
            products = [SELECT Id, Short_name__c, Short_Name_Color_Icon__c, name, Product_Information__c, Short_description__c, Employee__c
                        FROM Product__c ORDER BY name LIMIT 10 offset : amount];
        }else{
            products = [SELECT Id, Short_name__c, Short_Name_Color_Icon__c, name, Product_Information__c, Short_description__c, Employee__c
                        FROM Product__c ORDER BY name LIMIT 10];
        }
        return getProductsWithTags(products);
    }
    
    public static List<Inner_Product> getProductsWithTags(List<Product__c> products){
        List<Inner_Product> ProductTags = new List<Inner_Product>();
        for(Product__c product: products){
            Set<Tag__c> tagsForProduct = new Set<Tag__c>();
            List<Tag__c> tagsList = [SELECT Id, Name FROM Tag__c WHERE id IN (SELECT Tag__c FROM ProductTagAssociation__c WHERE GC_Product__c =: product.Id)];
            tagsForProduct.addAll(tagsList);
            ProductTags.add(new Inner_Product(product, tagsForProduct, false)) ;
        }                                                  
        return ProductTags;
    }
    
    @AuraEnabled
    public static List<Inner_Product> getSearchProducts(List<Tag__c> valueSearch, Boolean switchValue, Integer amount){
        List<Inner_Product> searchProductByTags = new List<Inner_Product>();  
        if (valueSearch != Null && valueSearch.size() > 0){
            String query = 'SELECT Id, Name, Short_name__c, Short_Name_Color_Icon__c, Product_Information__c, Short_description__c, Employee__c, ' +
                '(SELECT id, GC_Product__r.Name, Tag__r.Name FROM ProductTagAssociations__r)' +
                ' FROM Product__c where ID IN (SELECT GC_Product__c FROM ProductTagAssociation__c WHERE Tag__r.Name = \'';
            if (valueSearch.size() > 1) {
                for (Tag__c tag : valueSearch) {
                    query +=  tag.Name + '\' OR Tag__r.Name = \'';
                }
                query = query.removeEnd(' OR Tag__r.Name = \'');
            } else{
                query += valueSearch[0].Name + '\'';
            }
            If(amount != null){
                query += ') ORDER BY name LIMIT 10 offset ' + amount;
            }else{
                query += ') ORDER BY name LIMIT 10';
            }
            List<Product__c> products = Database.query(query);
            
            Set<String> tagsName = new Set<String>();
            for(Tag__c tag: valueSearch){
                tagsName.add(tag.Name);
            }
            
            List<Product__c> returnProducts = new List<Product__c>();
            for (Product__c product : products) {
                Set <String> temp = new Set <String> ();
                for (ProductTagAssociation__c pTA : product.ProductTagAssociations__r) {
                    temp.add(pTA.Tag__r.Name);    
                }
                if(switchValue){
                    returnProducts.add(product);
                }else{
                    if (temp.containsAll(tagsName)) {
                        returnProducts.add(product);
                    }
                }
            }
            
            if (returnProducts != Null && !returnProducts.isEmpty()) {
                searchProductByTags.addAll(getProductsWithTags(returnProducts));
            }
            return searchProductByTags;
        }else{
            return new List<Inner_Product>();
        }
    }
    
    @AuraEnabled
    public static List<Tag__c> getAllTags(Boolean check){ 
        String query = 'SELECT Id, Name FROM Tag__c ';
        if(check){
            query += 'LIMIT 5';
        }else{
            query += 'LIMIT 100';
        }
        List<Tag__c> tags = Database.query(query);
        return tags;
    }

    @AuraEnabled
    public static List<Tag__c> lookupTags(String searchKeyWord, Boolean check, List<Tag__c> lstPills){
        List<String> tagsName = new List<String>();
        for (Tag__c tag: lstPills) {
            tagsName.add('\'' + tag.Name + '\'');
        }
        String query = 'SELECT Id, Name FROM Tag__c';
        if(tagsName.size() != 0 && searchKeyWord != '' && searchKeyWord != null){
            query += ' WHERE Name LIKE \'%' + searchKeyWord + '%\'' + ' AND Name NOT IN ' + tagsName;  
        }else if(searchKeyWord != '' && searchKeyWord != null){ 
            query += ' WHERE Name LIKE \'%' + searchKeyWord + '%\'';
        }else if(tagsName.size() != 0){
            query += ' WHERE Name NOT IN ' + tagsName;
        }
        if(check){
            query += ' ORDER BY Name LIMIT 5';
        }else{
            query += ' ORDER BY Name LIMIT 100';
        }
        List<Tag__c> tags = Database.query(query);
        return tags;
    } 
    
    @AuraEnabled
    public static List<ContentDocument> getAttachFilesId(String IdProduct){
        List<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: IdProduct];
        Set <Id> contIds = new Set <Id> ();
        for (ContentDocumentLink con : cdls) { 
            contIds.add(con.ContentDocumentId);
        }
        List<ContentDocument> IdAttach = [SELECT Id, Title, FileType FROM ContentDocument WHERE Id IN: contIds];
        return IdAttach;        
    }
    
    @AuraEnabled
    public static Product__c getProductById(Id id){
        return [SELECT Id, Short_name__c, Short_Name_Color_Icon__c, name, Product_Information__c, Employee__c, Short_description__c 
                FROM Product__c WHERE Id =:id LIMIT 1];      
    }
    
    @AuraEnabled
    public static Employee__c getEmployeeOfProductById(Id idEmployee){
        return [SELECT Id, Name, Email_Address__c FROM Employee__c WHERE Id =:idEmployee LIMIT 1];      
    }
    
    @AuraEnabled
    public static String getProfileInfo(){
        try{
            String profileId = UserInfo.getProfileId();
            Profile profile = [SELECT Id, Name FROM Profile WHERE Id =:profileId];           
            return profile.Name;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage()); 
        }
    }

    @AuraEnabled
    public static List<Tag__c> getTags(Integer amount){
        String query = 'SELECT Id, Name FROM Tag__c ORDER BY name ';
        if(amount != null){
            query += 'OFFSET ' + amount;
        }else{
            query += 'LIMIT 12';
        }
        List<Tag__c> tags = Database.query(query);
        return tags;
    }

    @AuraEnabled
    public static Integer amountAllTags(){
        Integer amount = [SELECT Id FROM Tag__c].size();
        return amount;
    }
}