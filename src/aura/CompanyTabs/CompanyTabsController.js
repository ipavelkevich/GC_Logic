({
    handleEvent : function(component, event, helper) {
        var profile = event.getParam("company");
        component.set('v.compPerfom', profile);
    },

})