public without sharing class ContentVersionTriggerHandler implements ITriggerHandler
{
    // Allows unit tests (or other code) to disable this trigger for the transaction
    public static Boolean TriggerDisabled = false;
    
    /* Checks to see if the trigger has been disabled either by custom setting or by running code */
    public Boolean IsDisabled(){
        if (TriggerSettings__c.getInstance().ContentVersionTriggerDisabled__c) 
            return true;
        else{
            return TriggerDisabled;
        }
    } 
    
    //Aren`t using at ContentVersion Object now.
    /*public void BeforeInsert(List<SObject> newItems) {}
    public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
    public void BeforeDelete(Map<Id, SObject> oldItems) {}*/ 
        
    public static void AfterInsert(Map<Id, SObject> newItems) {
        Set<String> setTitle = new Set<String>();
        Set<String> setType = new Set<String>();
        Set<String> setSubtype = new Set<String>();
        Set<Id> setId = new Set<Id>();
        Map <String, GC_Profile__c> profiles = new Map <String, GC_Profile__c> ();
        Map <String, Product__c> products = new Map <String, Product__c> ();
        Set<String> mdmIds = new Set<String>(); 
        Set<String> productsIds = new Set<String>();
        Set<Id> setCVDelete = new Set<Id>();
        Map<String, ContentVersion> cvv = new Map <String, ContentVersion> ();
        List<ContentVersion> newContentVersion = new List<ContentVersion>();
        
        for (ContentVersion newCV : (List<ContentVersion>) newItems.values()) { 
            setTitle.add(newCV.Title);
            setType.add(newCV.Type__c); 
            setSubtype.add(newCV.Sub_type__c);
            setId.add(newCV.Id);
            if(newCv.Record_Type__c == 'GC_Profile') {
                mdmIds.add(newCV.Record_Id__c);    
            } else if (newCv.Record_Type__c == 'GC_Product') {
                productsIds.add(newCV.Record_Id__c);
            }
        }
        List<ContentVersion> lstExistingCV = [SELECT Id, Title, Type__c, Sub_type__c, ContentDocumentId FROM ContentVersion WHERE
                                              Title IN: setTitle AND Type__c IN: setType AND Sub_type__c IN: setSubtype AND Id NOT IN: setId];
        List <GC_Profile__c> profiless = [SELECT Id, Company__r.MEM_rec_id__c FROM GC_Profile__c WHERE Company__r.MEM_rec_id__c IN: mdmIds];
        List <Product__c> productss = [SELECT Id FROM Product__c WHERE Id IN: productsIds];
        for (ContentVersion cv : lstExistingCV) {
            cvv.put((cv.Title + cv.Type__c + cv.Sub_type__c).toUpperCase(), cv);
        }
        for (GC_Profile__c prof : profiless) {
            profiles.put(prof.Company__r.MEM_rec_id__c, prof);
        }
        for (Product__c prod : productss) {
            products.put(prod.Id, prod);
        }			
        Map <String, Map <Id, ContentVersion>> records = new Map <String, Map<Id, ContentVersion>> ();
        for (ContentVersion newCV: (List<ContentVersion>) newItems.values()){ 
            if(String.isNotBlank(newCV.Record_Id__c) && String.isNotBlank(newCV.Record_Type__c)) {                 
                if (cvv.containsKey((newCV.Title + newCV.Type__c + newCV.Sub_type__c).toUpperCase())) {
                    String key = (newCV.Title + newCV.Type__c + newCV.Sub_type__c).toUpperCase();
                    Map <Id, ContentVersion> temp = records.put(key, new Map <Id, ContentVersion> ());
                    if (temp != Null) {
                        records.get(key).putAll(temp);
                    }
                    setCVDelete.add(newCV.Id);
                    if (newCv.Record_Type__c == 'GC_Profile') {
                        if(profiles.get(newCV.Record_Id__c) != Null){
                            records.get(key).put(profiles.get(newCV.Record_Id__c).Id, cvv.get(key)); 
                        }else{
                            newCV.addError('Company record with MDM Id '+ newCV.Record_Id__c + ' does not exist');
                        }
                    } else if (newCv.Record_Type__c == 'GC_Product') {
                        if(products.get(newCV.Record_Id__c) != Null){
                            records.get(key).put(products.get(newCV.Record_Id__c).Id, cvv.get(key));
                        }else{
                            newCV.addError('GC Product record with Id '+ newCV.Record_Id__c + ' does not exist');
                        }
                    }
                } else {
                    String key = (newCV.Title + newCV.Type__c + newCV.Sub_type__c).toUpperCase();
                    Map <Id, ContentVersion> temp = records.put(key, new Map <Id, ContentVersion> ());
                    if (temp != Null) {
                        records.get(key).putAll(temp);
                    }
                    if (newCv.Record_Type__c == 'GC_Profile') {
                        if(profiles.get(newCV.Record_Id__c) != Null){
                            records.get(key).put(profiles.get(newCV.Record_Id__c).Id, newCV);   
                        }else{
                            newCV.addError('Company record with MDM Id '+ newCV.Record_Id__c + ' does not exist');
                        }
                    } else if (newCv.Record_Type__c == 'GC_Product') {
                        if(products.get(newCV.Record_Id__c) != Null){
                            records.get(key).put(products.get(newCV.Record_Id__c).Id, newCV);  
                        }else{
                            newCV.addError('GC Product record with Id '+ newCV.Record_Id__c + ' does not exist');
                        }
                    }
                }
            }
        }
        
        List<ContentDocumentLink> lstCDLProducts = new List<ContentDocumentLink>();
        for (String key: records.keySet()) {  
            for(Id id: records.get(key).keySet()){
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = records.get(key).get(id).ContentDocumentId;
                cdl.LinkedEntityId = id;
                cdl.ShareType = 'V';
                cdl.Visibility = 'AllUsers';
                lstCDLProducts.add(cdl);
            }
        }
        Database.insert(lstCDLProducts, false);        

        List<ContentDocument> lstDel = [SELECT Id FROM ContentDocument WHERE Id IN (SELECT ContentDocumentId FROM ContentVersion WHERE Id IN: setCVDelete)];
        delete lstDel; 
    }
    
    /*public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {} 
    public void AfterDelete(Map<Id, SObject> oldItems) {} 
    public void AfterUndelete(Map<Id, SObject> oldItems) {}*/
}