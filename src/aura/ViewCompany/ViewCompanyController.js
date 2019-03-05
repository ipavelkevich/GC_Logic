({
    handleClick : function(component, event, helper) {
        var compEvents = component.getEvent("compProfile");
        compEvents.setParams({ "company" : component.get('v.CompanyFromParent') });
        compEvents.fire();
        window.scrollTo(0, 0);
    }
})