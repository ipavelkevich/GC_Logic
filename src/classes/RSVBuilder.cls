public without sharing class RSVBuilder {
    public static Map<String,List<ContentVersion>> contVer{get;set;}
    
    @AuraEnabled
    public static Map<String,List<ContentVersion>> getDocs(Id recordId){
        List<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        Set <Id> contIds = new Set <Id> ();
        for (ContentDocumentLink con : cdls) {
            contIds.add(con.ContentDocumentId);
        }
        List<String> pickListValuesList= new List<String>();
        Schema.DescribeFieldResult fieldResult = ContentVersion.Sub_type__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            if(pickListVal.getLabel() != 'Uncategorized'){
                pickListValuesList.add(pickListVal.getLabel());   
            }
        }     
        List<GC_Profile__c> profiles = [SELECT Id, Company__c FROM GC_Profile__c WHERE Company__c =:recordId OR Id =: recordId];
        contVer = new Map<String,List<ContentVersion>>();
        
        List<ContentVersion> conts = [SELECT Id, ContentDocumentId, Type__c, Sub_type__c, FirstPublishLocationId,ContentDocument.Title FROM ContentVersion 
                                      WHERE Sub_type__c in: pickListValuesList AND ContentDocumentId IN : contIds ];
        for(String type : pickListValuesList){
            contVer.put(type, new List<ContentVersion>());
            for(ContentVersion c : conts){
                if(c.Sub_type__c == type){
                    contVer.get(type).add(c);
                }
            }
        }
        return contVer;
    }
    
    @AuraEnabled
    public static List<Files_History__c> saveHistory(String description, String prepareFor, Id recordId){
        Files_History__c file = new Files_History__c();
        try{            
            file.Name = prepareFor;
            file.User_Id__c = UserInfo.getUserId();
            file.Description__c = description;
            file.Prepared_For__c = prepareFor;
            file.GC_Profile__c = recordId;
            file.Files_Ids__c = '';           
            insert file;
        }catch(Exception  e){
            throw new AuraHandledException(e.getMessage());           
        }
        List<Files_History__c> files = [SELECT Id, User_Id__c, Files_Ids__c, Description__c,
                                        Prepared_For__c, GC_Profile__c FROM Files_History__c 
                                        WHERE GC_Profile__c =: recordId AND User_Id__c =: UserInfo.getUserId() Order by CreatedDate DESC];
        return files;
    }
    
    @AuraEnabled
    public static String saveExisting(List<Id> ids, Id recordId, Id historyId){
        List<Files_History__c> files = [SELECT Id, User_Id__c, Files_Ids__c, Description__c,
                                        Prepared_For__c, GC_Profile__c FROM Files_History__c 
                                        WHERE Id =: historyId AND User_Id__c =: UserInfo.getUserId()];
        if (files != Null && !files.isEmpty()) {
        files.get(0).Files_Ids__c = '';     
        for(Id id : ids){
            files.get(0).Files_Ids__c += id+';';
        }
        update files;
        String filesIds = files.get(0).Files_Ids__c;
        return filesIds;
        } else {
           throw new AuraHandledException('User has no access to this files.');
        }
        
    }
    
    @AuraEnabled
    public static List<Files_History__c> getHistory(Id recordId){
        List<Files_History__c> files = [SELECT Id, User_Id__c, Files_Ids__c, Description__c,
                                        Prepared_For__c, GC_Profile__c FROM Files_History__c 
                                        WHERE GC_Profile__c =: recordId AND User_Id__c =: UserInfo.getUserId()];
        if(files.isEmpty()){            
            return null;
        }else{
            return files;
        }
    }
    
    @AuraEnabled
    public static List<Files_History__c> delHistory(Id recordId, Id hisId){
        Files_History__c file = [SELECT Id, User_Id__c, GC_Profile__c FROM Files_History__c 
                                 WHERE Id =: hisId AND User_Id__c =: UserInfo.getUserId() LIMIT 1];
        
        delete file;            
        return getHistory(recordId);
    }
}