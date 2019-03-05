({
    initController : function(component,event,helper){
        helper.initFileDetailsHelper(component);
    },
    
    closeModalUploadFileController : function(component,event,helper){
        component.find("overlayLib").notifyClose();
    },
    
    saveUploadFileController: function(component,event,helper){ 
        var title = component.find("title").get("v.value");
        var actionSaveDetails = component.get('c.saveFileUpload');
        actionSaveDetails.setParams({
            contVerId: component.get("v.recordId"),
            typeFile: component.find("type").get("v.value"),
            subtypeFile: component.find("subtype").get("v.value"),
            titleFile: title,
            descriptionFile: component.find("description").get("v.value"),
        });
        actionSaveDetails.setCallback(this,function(resSaveDetails){
            var updataSaveDetails = resSaveDetails.getReturnValue();
            var stateSaveDetails=resSaveDetails.getState();
            if(stateSaveDetails=='SUCCESS'){
                component.set('v.fileDetails', updataSaveDetails);   
            }
        });        
        $A.enqueueAction(actionSaveDetails);
        component.find('notifLib').showToast({
            "variant": "success",
            "title": "Saving file",
            "message": "Details file '" + title + "' saved!",
        });
        component.find("overlayLib").notifyClose();
    },
})