public without sharing class FileUpload {
    
    @AuraEnabled
    public static Id modifyAfterUpload(String recordId, String docId){
        List<ContentVersion> contver = [SELECT Id, FirstPublishLocationId, ContentDocument.Title, ContentDocument.Id, ContentDocument.LastModifiedDate, ContentDocument.FileType, 
                                        IsLatest, ContentUrl, Title,Description, ContentModifiedDate, LastModifiedDate,
                                        OwnerID, PathOnClient  
                                        FROM ContentVersion WHERE FirstPublishLocationId  =:recordId AND ContentDocument.Id =:docId];
        if(contver.IsEmpty()){
            return null;
        }
        return contver.get(0).Id;
    } 
    
    @AuraEnabled
    public static ContentVersion FileInfo(String contVerId) {
        ContentVersion fileDetail = [SELECT Id, /*Type__c, Sub_type__c,*/ Description, Title FROM ContentVersion WHERE Id =:contVerId];
        return fileDetail;
    }
    
    @AuraEnabled
    public static List<String> getPicklistValuesType (){
        List<String> lstPickvalsType=new List<String>();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get('ContentVersion');
        Sobject Object_name = targetType.newSObject();
        Schema.sObjectType sobject_type = Object_name.getSObjectType();
        Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe(); 
        Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap(); 
        List<Schema.PicklistEntry> pick_list_values = field_map.get('Type__c').getDescribe().getPickListValues(); 
        for (Schema.PicklistEntry a : pick_list_values) {
            lstPickvalsType.add(a.getValue());
        }
        return lstPickvalsType;
    } 

     @AuraEnabled
    public static List<String> getPicklistValuesSubType (){
        List<String> lstPickvalsSubType=new List<String>();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get('ContentVersion');
        Sobject Object_name = targetType.newSObject();
        Schema.sObjectType sobject_type = Object_name.getSObjectType();
        Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe(); 
        Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap(); 
        List<Schema.PicklistEntry> pick_list_values = field_map.get('Sub_type__c').getDescribe().getPickListValues(); 
        for (Schema.PicklistEntry a : pick_list_values) {
            lstPickvalsSubType.add(a.getValue());
        }
        return lstPickvalsSubType;
    } 
    
    @AuraEnabled
    public static void saveFileUpload(String contVerId, String typeFile, String subtypeFile, String titleFile, String descriptionFile) {
        ContentVersion fileUpload = [SELECT Id, Type__c, Sub_type__c, Description, Title FROM ContentVersion WHERE Id =:contVerId];
        fileUpload.Title = titleFile;
        fileUpload.Type__c = typeFile;
        fileUpload.Sub_type__c = subtypeFile;
        fileUpload.Description = descriptionFile;
        update fileUpload;
    }
}