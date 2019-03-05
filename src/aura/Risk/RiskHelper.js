({
    initHelper : function(component) {     
        var id = component.get("v.compPerfom.Id");  
        component.set('v.compPerfomIdOld', id); 
        var action = component.get('c.getDocs');
        action.setParams({
            recordId : id           
        });
        action.setCallback(this,function(res){
            var updata = res.getReturnValue();
            var state = res.getState();         
            if(state=='SUCCESS'){
                var accountmap = updata;
                var accountList = [];
                for ( var key in accountmap ) {
                    accountList.push({priorityType:key, value:accountmap[key]});
                    $A.util.addClass(component.find("volatilitySMButton"), "slds-hide");
                    $A.util.addClass(component.find("growthSMButton"), "slds-hide");
                    $A.util.addClass(component.find("capitalSMButton"), "slds-hide");
                }
                for( let priorityType in accountList ){
                    for( let i = 0; i<accountList[priorityType].value.length;i++ ){
                        accountList[priorityType].value[i].checked = false;
                        var fileType = accountList[priorityType].value[i];
                        if(fileType.Type__c === "Volatility" && fileType.Sub_type__c != "Priority"){
                            $A.util.removeClass(component.find("volatilitySMButton"), "slds-hide");
                        }
                        if(fileType.Type__c === "Growth" && fileType.Sub_type__c != "Priority"){
                            $A.util.removeClass(component.find("growthSMButton"), "slds-hide");
                        }
                        if(fileType.Type__c === "Capital" && fileType.Sub_type__c != "Priority"){
                            $A.util.removeClass(component.find("capitalSMButton"), "slds-hide");
                        }
                    }
                } 
                component.set('v.risksDocs', accountList);
                this.mapHelper(component);
                component.set('v.otherCapital', false);
                component.set('v.otherGrowth', false);
                component.set('v.otherVolatility', false);
            } else {   
                this.errorFunction(res);
            }          
        });        
        $A.enqueueAction(action);
    },
    
    mapHelper : function(component) {       
        var risksDocsDisplay = component.get('v.risksDocsDisplay');        
        var recordId = component.get('v.compPerfom.Id');
        var action = component.get('c.getHistory');
        var files = component.get('v.risksDocs');
        var risksDocsChecked = [];
        action.setParams({recordId : recordId});
        action.setCallback(this,function(res){
            var state=res.getState();
            if(state=='SUCCESS'){
                var history = res.getReturnValue();  
                if(history == null){
                    this.saveDefaultWorkspaceHelper(component);
                }else{
                    component.set('v.history',history); 
                    component.find('select').set('v.value', history[0].Id);
                    if(history[0].Files_Ids__c != undefined && history[0].Files_Ids__c != ''){
                        let docs = history[0].Files_Ids__c.split(';');
                        for(let key = 0; key < docs.length; key++){
                            for( let index = 0; index < files.length; index++ ){
                                var outterMap = files[index];
                                var innerArr = [];    
                                for( let i = 0; i<files[index].value.length;i++ ){                                  
                                    if(files[index].value[i].ContentDocumentId == docs[key]){                                       
                                        files[index].value[i].checked = true;
                                        var element = files[index].value[i];
                                        innerArr.push(element); 
                                    }
                                }
                                risksDocsChecked.push({
                                    priorityType : outterMap.priorityType, 
                                    value : innerArr});
                            }  
                        }
                    }
                }
            } else {   
                this.errorFunction(res);
            }
            component.set('v.risksDocsDisplay', files);            
            component.set('v.risksDocsBottomBar',risksDocsChecked);
            if (risksDocsChecked.length == 0){
                component.set('v.isButtonStatus', true);
            } else {
                component.set('v.isButtonStatus', false);
            }
        });
        $A.enqueueAction(action); 
    },
    
    onCheckHelper: function(component, event) {
        var ids = [];
        var risksDocs = component.get('v.risksDocsDisplay');
        var risksDocsChecked = [];
        for( let index =0; index<risksDocs.length; index++ ){
            var outterMap = risksDocs[index];
            var innerArr = [];            
            for( let i = 0; i < risksDocs[index].value.length; i++){
                if(risksDocs[index].value[i].checked == true){
                    var element = risksDocs[index].value[i];
                    innerArr.push(element);  
                    ids.push(element.ContentDocumentId);
                }
            }
            risksDocsChecked.push({
                priorityType : outterMap.priorityType, 
                value : innerArr});
        }
        component.set('v.risksDocsBottomBar',risksDocsChecked);
        var recordId = component.get('v.compPerfom.Id');
        var action =  component.get('c.saveExisting');
        var historyId = component.find('select').get('v.value');
        action.setParams({             
            ids: ids,
            recordId : recordId,
            historyId : historyId
        });
        action.setCallback(this,function(res){
            var state=res.getState();
            if(state=='SUCCESS'){
                var filesIds = res.getReturnValue(); 
                if (filesIds == ''){
                    component.set('v.isButtonStatus', true);
                } else {
                    component.set('v.isButtonStatus', false);
                }
                
                var history = component.get("v.history");
                for (let index in history) {
                    if (historyId == history[index].Id) {
                        history[index].Files_Ids__c = filesIds;
                        break;
                    }
                }
                component.set("v.history", history); 
            } else {   
                this.errorFunction(res);
            }            
        });
        $A.enqueueAction(action); 
    },
    errorFunction : function(res) {
        let errors = res.getError();
        console.log(errors);
        let errorMessage = errors[0].message;
        var showToast = $A.get("e.force:showToast");
        showToast.setParams({
            title : 'ERROR',
            type: 'error',
            message:errorMessage                      
        }); 
        showToast.fire();
    }, 
    
    saveDefaultWorkspaceHelper : function(component){         
        var action =  component.get('c.saveHistory');
        var description, prepareFor = 'My Workspace';        
        var recordId = component.get('v.compPerfom.Id')
        action.setParams({
            description: description,
            prepareFor: prepareFor,
            recordId : recordId
        });
        action.setCallback(this,function(res){
            var state=res.getState();
            if(state=='SUCCESS'){
                var history =  res.getReturnValue();
                component.set("v.history", history);
                component.find('select').set('v.value', history[0].Id);
            } else {   
                this.errorFunction(res);
            }           
        });
        $A.enqueueAction(action);
        component.set('v.isButtonStatus', true);
    },
    
    saveNewWorkspaceHelper : function(component,event,helper){ 
        var descriptionFromModal = event.getParam("descriptionModalEvent");
        component.set('v.description', descriptionFromModal);
        var prepareForFromModal = event.getParam("prepareForModalEvent");
        component.set('v.prepareFor', prepareForFromModal);
        var action =  component.get('c.saveHistory');
        var description = component.get('v.description');
        var prepareFor = component.get('v.prepareFor');
        var recordId = component.get('v.compPerfom.Id');
        var risksDocsDisplay = component.get('v.risksDocsDisplay');
        action.setParams({
            description: description,
            prepareFor: prepareFor,
            recordId : recordId
        });
        action.setCallback(this,function(res){
            var state=res.getState();
            if(state=='SUCCESS'){
                var history =  res.getReturnValue();
                component.set('v.history',history); 
                component.find('select').set('v.value', history[0].Id);
                this.changeWorkspaceHelper(component,event,helper);
                component.set('v.isButtonStatus', true);
                var showToastSucces = $A.get("e.force:showToast"); 
                showToastSucces.setParams({ 
                    type: 'success',
                    duration:'2000',
                    title : 'Create Workspace',
                    message : 'Workspace has been created'
                }); 
                showToastSucces.fire();
            } else {   
                this.errorFunction(res);
            }
        });
        $A.enqueueAction(action);
    },
    
    changeWorkspaceHelper : function(component,event,helper){ 
        var historyId = component.find('select').get('v.value');      
        var history = component.get('v.history');
        var risksDocsChecked = [];
        var risksDocsDisplay = component.get('v.risksDocsDisplay');
        for (let indexofHistory in history) {
            if (history[indexofHistory].Id == historyId) {
                for( let priorityType = 0; priorityType<risksDocsDisplay.length; priorityType++){
                    for( let i = 0; i<risksDocsDisplay[priorityType].value.length;i++ ){
                        risksDocsDisplay[priorityType].value[i].checked = false;
                    }
                }
                if(history[indexofHistory].Files_Ids__c != undefined && 
                   history[indexofHistory].Files_Ids__c != '') {
                    let docs = history[indexofHistory].Files_Ids__c.split(';');
                    for(let key in docs){
                        for( let index = 0; index < risksDocsDisplay.length; index++ ){
                            var outterMap = risksDocsDisplay[index];
                            var innerArr = [];    
                            
                            for( let i = 0; i<risksDocsDisplay[index].value.length;i++ ){                            
                                if(risksDocsDisplay[index].value[i].ContentDocumentId == docs[key]){                                 
                                    risksDocsDisplay[index].value[i].checked = true;
                                    var element = risksDocsDisplay[index].value[i];
                                    innerArr.push(element);  
                                } 
                            }
                            risksDocsChecked.push({
                                priorityType : outterMap.priorityType, 
                                value : innerArr});
                        }  
                    }
                }
                break;
            }
        }
        component.set('v.risksDocsDisplay', risksDocsDisplay);
        component.set('v.risksDocsBottomBar',risksDocsChecked);       
        if (risksDocsChecked.length == 0){
            component.set('v.isButtonStatus', true);
        } else {
            component.set('v.isButtonStatus', false);
        }
    },
    
    deleteWorkspaceHelper :function(component,event,helper) {
        var curentWorkspaceId = component.find('select').get('v.value'); 
        var recordId = component.get('v.compPerfom.Id');
        var action = component.get('c.delHistory');
        action.setParams({recordId : recordId,
                          hisId : curentWorkspaceId});
        action.setCallback(this,function(res){
            var state=res.getState();
            if(state=='SUCCESS'){                
                var history =  res.getReturnValue();
                component.set('v.history',history);
                component.find('select').set('v.value', history[0].Id);
                this.changeWorkspaceHelper(component,event,helper);
                var showToast = $A.get("e.force:showToast"); 
                showToast.setParams({ 
                    type: 'success',
                    duration:' 3000',
                    title : 'Delete Workspace',
                    message : 'Workspace has been deleted'
                }); 
                showToast.fire(); 
            } else {   
                this.errorFunction(res);
            }
        });
        $A.enqueueAction(action);
    },
})