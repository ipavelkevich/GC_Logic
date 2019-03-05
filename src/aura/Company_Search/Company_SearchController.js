({
    doInit: function(component, event, helper) {
        helper.getAllCompanyCardsForLoggedUser(component);
    },
    
    getAllAccount : function(component,event,helper){ 
        helper.getAllAccountHelper(component,event,helper);
    },
    
    handleComponentEvent : function(component, event, helper) {
        helper.handleComponentEventHelper(component, event, helper);
    },
    
    closeOutsideDiv : function (component, event, helper) {
        window.setTimeout(
            $A.getCallback(function() {
                var switcher = component.get("v.closeListController");
                if(!switcher){
                    helper.forCloseHelper(component);
                }component.set("v.closeOutsideDiv", false);
            }),500);
    },
    
    deactivationcloseOutsideDiv : function (component, event, helper) {
        component.set("v.closeOutsideDiv", true);
    },
    
    deactivationcloseListController : function (component, event, helper) {
        var switcher = component.get("v.closeOutsideDiv");
        component.set("v.closeListController", true);
    },
    
    closeListController : function (component, event, helper) {
        window.setTimeout(
            $A.getCallback(function() {
                var switcher = component.get("v.closeOutsideDiv");
                if(!switcher){
                    helper.forCloseHelper(component);
                }component.set("v.closeListController", false);
            }),500);
    },
    
    showMoreProfilesController : function (component, event, helper) {
        var device = $A.get("$Browser.formFactor");
        var testIE = helper.detectIEHelper();
        if(device === 'PHONE' || device === 'TABLET' || testIE === true){ 
            helper.getMoreCompanyHelper(component);
        }
    },
    
    handleEvent  : function(component, event) {
        var profile = event.getParam("company"); 
        component.set("v.compPerfom" , profile);
        component.set("v.openCompanyTabs" , false); 
        window.scrollTo(0, 0);
    },
    
    actionFromSideBarController : function(component, event, helper) {
        component.set("v.openCompanyTabs" , true);
    },  
})