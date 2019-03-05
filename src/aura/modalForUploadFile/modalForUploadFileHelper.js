({
	initFileDetailsHelper : function(component){
        var actionTitle = component.get('c.FileInfo');
        actionTitle.setParams({
            contVerId: component.get("v.recordId"),
        });
        actionTitle.setCallback(this,function(resTitle){
            var updataTitle = resTitle.getReturnValue();
            var stateTitle=resTitle.getState();
            if(stateTitle=='SUCCESS'){
                component.set('v.fileDetails', updataTitle);
            }
        });        
        $A.enqueueAction(actionTitle);

        var actionType = component.get('c.getPicklistValuesType');
        actionType.setCallback(this,function(resType){
            var updataType = resType.getReturnValue();
            var stateType=resType.getState();
            if(stateType=='SUCCESS'){
                component.set('v.lstPickvalsType', updataType);
                component.find("type").set("v.value", updataType[0])
            }
        });        
        $A.enqueueAction(actionType);
        
        var actionSubType = component.get('c.getPicklistValuesSubType');
        actionSubType.setCallback(this,function(resSubType){
            var updataSubType = resSubType.getReturnValue();
            var stateSubType=resSubType.getState();
            if(stateSubType=='SUCCESS'){
                component.set('v.lstPickvalsSubType', updataSubType);
                component.find("subtype").set("v.value", updataSubType[0])
            }
        });        
        $A.enqueueAction(actionSubType);
    },
})