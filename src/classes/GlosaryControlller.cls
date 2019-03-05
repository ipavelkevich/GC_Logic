public without sharing class GlosaryControlller {
    
    @AuraEnabled
    public static List<Glosary__c> getAllGlosaries(){
        List<Glosary__c> gls = [SELECT Id, Name, Description__c FROM Glosary__c ORDER BY Name]; 
        return gls;
    }

}