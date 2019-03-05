({
    tabsHelper : function(component, event) {
        var device = $A.get("$Browser.formFactor");
        if(device === 'PHONE' || device === 'TABLET'){ 
            this.closeNavHelper();
        }
    },
    
    tabs : function(component, event) {
        component.set("v.listTags", []);
        component.set('v.showTags', false);
        this.tabsHelper(component, event);
    },
    
    openNavHelper : function() {
        var device = $A.get("$Browser.formFactor");
        if(device === 'PHONE' || device === 'TABLET'){ 
            document.getElementById("mySidenav").style.transition = "0.5s";    
            document.getElementById("mySidenav").style.width = "100%";    
        }else{ 
            document.getElementById("mySidenav").style.transition = "0.5s";    
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
        }
    }, 
    
    closeNavHelper : function() {
        document.getElementById("mySidenav").style.transition = "0.5s";    
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    },
    
    getQueryStringHelper : function(query) {
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);          
            query_string = decodeURIComponent(value); 
        }
        return query_string; 
    },
    
    getTagsAllHelper: function(component, amount, check) {
        var action = component.get("c.getTags");
        if(check){
            var action = component.get("c.getTags");
            action.setParams({ 'amount': amount });
            var self = this;
            action.setCallback(this, function(actionResult) {
                var state = actionResult.getState();
                if (component.isValid() && state === "SUCCESS") {
                    var listTags = component.get("v.listTags");
                    var result = actionResult.getReturnValue();
                    component.set("v.listTags", listTags.concat(result));
                }            
            });
            $A.enqueueAction(action);    
            component.set("v.amount", amount);
        }else{
            var self = this;
            action.setCallback(this, function(actionResult) {
                var state = actionResult.getState();
                if (component.isValid() && state === "SUCCESS") {
                    component.set("v.listTags", actionResult.getReturnValue());
                }            
            }); 
            $A.enqueueAction(action);  
        }  
    },
    
    getAmountAllTagsHelper: function(component) {
        var action = component.get("c.amountAllTags");
        var self = this;
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.amountAllTags", actionResult.getReturnValue());
            }            
        });
        $A.enqueueAction(action);    
    },
    
    hiddenHelper: function(element) {
        $A.util.addClass(element, 'slds-hidden');
        $A.util.removeClass(element, 'slds-visible');  
    },
    
    visibleHelper: function(element) {
        $A.util.addClass(element, 'slds-visible');
        $A.util.removeClass(element, 'slds-hidden');  
    },
    
})