({
    getAllProductsHelper: function(component, check){
        var actionAmount = component.get("c.amountReturned");
        actionAmount.setParams({ nameMethod : "getAllProducts" });
        actionAmount.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (state === "SUCCESS") {
                component.set("v.CountSearchRezults", actionResult.getReturnValue());
            }            
        });
        $A.enqueueAction(actionAmount);   
        var action = component.get("c.getAllProducts");
        var self = this; 
        if(check){
            var body = component.get("v.body");
            var amountV = component.get('v.amount');
            action.setParams({ amount : amountV });
            action.setCallback(this, function(actionResult) {
                var state = actionResult.getState();
                var items = actionResult.getReturnValue();
                if (state === "SUCCESS") {
                    for(let item in items){                    
                        $A.createComponent(
                            "c:ViewProduct",
                            { "ProductCardFromProductSearch": items[item] },
                            function(newButton, status, errorMessage){
                                if (status === "SUCCESS") {
                                    var body = component.get("v.body");
                                    body.push(newButton);
                                    component.set("v.body", body);
                                }
                            }
                        );} 
                    component.set('v.amount', parseInt(amountV) + 10);
                    component.set("v.ProductCards", actionResult.getReturnValue());
                }            
                this.inactiveShowMoreBtnHelper(component);
            });
            $A.enqueueAction(action);   
        }else{
            component.set("v.body", []);
            action.setCallback(this, function(actionResult) {
                var state = actionResult.getState();
                var items = actionResult.getReturnValue();
                if (state === "SUCCESS") {
                    for(let item in items){                    
                        $A.createComponent(
                            "c:ViewProduct", { "ProductCardFromProductSearch": items[item] },
                            function(newButton, status, errorMessage){
                                if (status === "SUCCESS") {
                                    var body = component.get("v.body");
                                    body.push(newButton);
                                    component.set("v.body", body);
                                }
                            }
                        );
                    }
                    component.set("v.ProductCards", actionResult.getReturnValue());
                }            
                this.inactiveShowMoreBtnHelper(component);
            });
            $A.enqueueAction(action); 
            this.resetAmountHelper(component);
            component.set("v.SwitchProductCards", true);
        }
    },
    
    resultsRenderHelper: function(component) {
        var choicePilse = component.get("v.lstSelectedRecords");
        var x = component.get("v.SwitchProductCards");
        if(choicePilse.length > 0){
            var pCards = component.get("v.ProductCards");
            for(let item in pCards){
                $A.createComponent(
                    "c:ViewProduct", { "ProductCardFromProductSearch": pCards[item] },
                    function(comp, status, errorMessage){
                        var body = component.get("v.body");
                        body.push(comp);
                        component.set("v.body", body);
                    }
                );
            }
        } else if(choicePilse.length == 0 && !x){ 
            this.getAllProductsHelper(component, false); 
        }
    },
    
    getTagsAllHelper: function(component) {
        var action = component.get("c.getAllTags");
        var checkPhone = this.detectPhoneHelper();
        action.setParams({ 'check': checkPhone });
        action.setCallback(that, function(actionResult) {
            var state = actionResult.getState();
            if (state === "SUCCESS") {
                component.set("v.listOfSearchRecords", actionResult.getReturnValue());
            }            
        });
        $A.enqueueAction(action);    
    },
    
    searchByPillsHelper: function(component, check) { 
        var listPills = component.get("v.lstSelectedRecords");
        var switcher = component.get("v.valueSwitch");
        var actionAmount = component.get("c.amountReturned");
        actionAmount.setParams({ nameMethod : "getSearchProducts",  valueSearch : listPills, switchValue : switcher });
        actionAmount.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (state === "SUCCESS") {
                component.set("v.CountSearchRezults", actionResult.getReturnValue());
            }          
        });
        var action = component.get("c.getSearchProducts");
        if(check){
            var amount2 = component.get('v.amount2');
            action.setParams({ valueSearch : listPills, switchValue : switcher, amount : amount2});
            component.set('v.amount2', parseInt(amount2) + 10);
        }else{
            action.setParams({ valueSearch : listPills, switchValue : switcher});
            component.set("v.body", []);
        }
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (state === "SUCCESS") {
                component.set("v.ProductCards", actionResult.getReturnValue());
            }            
            
            this.inactiveShowMoreBtnHelper(component);
        });
        $A.enqueueAction(actionAmount);
        $A.enqueueAction(action);
        
    },
    
    lookUpHelper : function(component, getInputkeyWord, check) {
        component.set('v.loaded', false);  
        var typingTimer = component.get("v.timer"); 
        clearTimeout(typingTimer);
        var that = this;
        typingTimer = setTimeout(function() {  
            var listPills = component.get('v.lstSelectedRecords');
            var action = component.get("c.lookupTags");
            action.setParams({
                'searchKeyWord': getInputkeyWord, 'check': check, 'lstPills': listPills
            });
            action.setCallback(that, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    if (storeResponse.length == 0) {
                        component.set("v.Message", 'No Records Found...'); 
                    }else{
                        component.set("v.Message", '');
                    }
                    component.set("v.listOfSearchRecords", storeResponse);
                }
                component.set('v.loaded', true); 
            });
            $A.enqueueAction(action);
        },1000);
        component.set("v.timer", typingTimer);
    },
    
    detectPhoneHelper : function(){
        var device = $A.get("$Browser.formFactor");
        if(device === 'PHONE' || device === 'TABLET'){
            return true;
        }else{
            return false;
        }
    },
    
    refreshListWithNewTag: function(component, tags){
        var pills = component.get("v.lstSelectedRecords");
        for (let i = 0; i < pills.length; i++) {
            for (let l = 0; l < tags.length; l++) {
                if (pills[i].Id == tags[l].Id){
                    tags.splice(l, 1);
                    l--;
                } 
            }	
        }                    
        component.set("v.listOfSearchRecords", tags); 
    },
    
    showMoreHelper: function(component){
        var amountResult = component.get("v.CountSearchRezults");
        var pills = component.get("v.lstSelectedRecords");
        if(pills.length > 0){
            var amount2 = component.get("v.amount2");
            var count = parseInt(amountResult) - parseInt(amount2);
            if(count > 0){
                this.searchByPillsHelper(component, true);
            }
        }else{
            var amount = component.get("v.amount");
            var count = parseInt(amountResult) - parseInt(amount);
            if(count > 0){
                this.getAllProductsHelper(component, true);
            }
        } 
    },
    
    inactiveShowMoreBtnHelper: function(component){
        var device = $A.get("$Browser.formFactor");
        var testIE = this.detectIEHelper();
        if(device === 'PHONE' || device === 'TABLET' || testIE === true){
            var amountProducts = component.get("v.CountSearchRezults");
            var sizeBody = component.get("v.body").length;
            if(amountProducts == sizeBody){
                $A.util.addClass(component.find("ShowMoreBtn"), "slds-hide");
            }else{
                $A.util.removeClass(component.find("ShowMoreBtn"), "slds-hide");
            }
        }
    },
    
    detectIEHelper : function(){
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');
        if (msie > 0 || trident > 0) {
            return true;
        }
        return false;
    },
    
    showBtnHelper: function(component){
        var device = $A.get("$Browser.formFactor");
        var testIE = this.detectIEHelper();
        if(device === 'PHONE' || device === 'TABLET' || testIE === true){ 
            $A.util.removeClass(component.find("ShowMoreBtn"), "slds-hide");
        }else if(device === 'DESKTOP'){ 
            $A.util.addClass(component.find("ShowMoreBtn"), "slds-hide");            
        }
    },
    
    openFullProductHelper: function(component, event) {
        var selectedProductGetFromEvent = event.getParam("ProductRecordByEvent"); 
        component.set("v.productSelectedViewFull" , selectedProductGetFromEvent);
        component.set("v.valueSwitchShow" , false); 
        component.set("v.showPageFullProduct", true);
        window.scrollTo(0, 0);
    },
    
    closeFullProductHelper: function(component, event) {
        component.set("v.showPageFullProduct", false);
        component.set("v.SwitchProductCards", false);
        this.getAllProductsHelper(component, false);
        window.scrollTo(0, 0);
    },
    
    addTagToPillsHelper: function(component, event, tag) {
        var listSelectedItems =  component.get("v.lstSelectedRecords");
        var check = this.filterTagToPillsHelper(component, listSelectedItems, tag);
        if(check){
            this.searchByPillsHelper(component, false);
        }
    },
    
    filterTagToPillsHelper : function(component, listItems, item){
        var forShow = component.find("lookup-pill");
        $A.util.addClass(forShow, 'slds-show');
        var check = true;
        for(let i = 0; i < listItems.length; i++){
            if(listItems[i].Id == item.Id){
                check = false;
            }
        }
        if(check){
            listItems.push(item);
            component.set("v.lstSelectedRecords" , listItems); 
            var lenghtPills =  component.get("v.lstSelectedRecords").length;
            if(lenghtPills > 1){
                component.set("v.valueSwitchShow", true); 
            } 
            return true;
        }
        return false;
    },
    
    forOpenHelper: function(component){
        var list =  component.get("v.listOfSearchRecords");
        if(list.length > 0){
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');  
        }
    },
    
    forCloseHelper: function(component){
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },
    
    resetAmountHelper : function(component){
        component.set('v.amount', '10');
        component.set('v.amount2', '10');
    },
    
    tagsForInitHelper : function(component){
        var action = component.get("c.lookupTags");
        var checkPhone = this.detectPhoneHelper();
        action.setParams({
            'searchKeyWord': '', 'check': checkPhone, 'lstPills': []
        });
        action.setCallback(that, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.listOfSearchRecords", storeResponse);   
            }
        });
        $A.enqueueAction(action);
    }
})