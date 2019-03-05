({
    initController : function(component, event, helper) {        
        helper.initHelper(component);
        var device = $A.get("$Browser.formFactor");
        if(device === 'PHONE' || device === 'TABLET') {
            $A.util.addClass(component.find("downloadButtonDiv"), "slds-hide");            
        }
        
    },
    
    checkChangeController : function (component, event, helper) {
        var old =  component.get('v.compPerfomIdOld');
        var newId =  component.get('v.compPerfomId');
        if (old != newId) {
            component.set('v.risksDocsDisplay', []);
            component.set('v.risksDocsBottomBar',[]);
            component.set('v.risksDocs', []);      
            component.set('v.compPerfomIdOld', newId);   
            helper.initHelper(component);
        } 
    },
    
    showMoreController: function(component, event) {
        var param = event.getSource().get("v.value");
        component.set('v.' + param, true);
    },
    
    showLessController: function(component, event) {
        var param = event.getSource().get("v.value");
        component.set('v.' + param, false);
    },
    
    drawerSlideController : function(component, event, helper) {
        var toggleButton = document.querySelector('.drawer-button') 
        toggleButton.classList.toggle('open');
        var toggleDrawer = document.querySelector('.drawer')
        toggleDrawer.classList.toggle('open');
        var up = document.getElementById('up');
        if(up.classList.contains('up')){
            up.classList.remove('up');
            up.classList.add('down');
        }else{
            up.classList.add('up');
            up.classList.remove('down');
        } 
    },
    
    onCheckController: function(component, event, helper) {
        helper.onCheckHelper(component, event);
    },
    
    downloadController: function(component, event) {
        var defaultVal = "/sfc/servlet.shepherd/version/download";
        var docs = component.get('v.risksDocsBottomBar');
        for(let key in docs ){
            for( let i = 0; i<docs[key].value.length;i++ ){
                if(docs[key].value[i].checked){
                    defaultVal += '/'+docs[key].value[i].Id;
                }
            }
        }
        component.set('v.href', defaultVal);
        window.open(component.get('v.href'), "_self");
    },
    
    changeWorkspaceController :function(component,event,helper){
        helper.changeWorkspaceHelper(component,event,helper);
    },
    
    openModalCreateWorkspaceController:function(component,event,helper) {
        var modalBody;
        var historyOld = component.get('v.history');
        $A.createComponent("c:modalForNewWorkspaceRSV", {
            historyOld: historyOld,
        },
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   component.find('overlayLib').showCustomModal({
                                       header: "Create new Workspace",
                                       body: modalBody,
                                       cssClass: "mymodal",
                                   })
                               }                               
                           });
    },
    
    saveNewWorkspaceController : function(component,event,helper){ 
        helper.saveNewWorkspaceHelper(component,event,helper);
    },
    
    closeModalCreateWorkspaceController:function(component,event,helper){ 
        helper.closeModalCreateWorkspaceHelper(component,event,helper);
        
    },
    
    deleteWorkspaceController:function(component,event,helper){
        helper.deleteWorkspaceHelper(component,event,helper);
    }, 
})