({
    closeModalCreateWorkspaceController : function(component,event,helper){
        component.find("overlayLib").notifyClose();
    },
    
    sendToRiskController: function(component,event,helper){ 
        var description = component.get('v.descriptionModal');
        var prepareFor = component.get('v.prepareForModal');
        var history = component.get('v.historyOld');
        if(description != undefined && prepareFor != undefined
           && /\S/.test(description) && /\S/.test(prepareFor)){
            var compEvent = $A.get("e.c:FromModalToRisk");
            for (let index in history){
                if (history[index].Prepared_For__c == prepareFor){
                    component.find('notifLib').showNotice({
                        "variant": "error",
                        "header": "Create Workspace",
                        "message": "Workspace with this name '" + prepareFor + "'' already exists.",
                    });
                    return;
                } 
            }
            compEvent.setParams({
                "descriptionModalEvent" : description,
                "prepareForModalEvent" : prepareFor
            });
            compEvent.fire();
            component.find("overlayLib").notifyClose();
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Please fill required fields",
                "message": "'Description' and 'Prepare' for is required fields",
            });
        }
    },
    
})