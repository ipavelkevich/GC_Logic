({
    getAllCompanyCardsForLoggedUser: function(component) {
        var action = component.get("c.getLoggedUserGcProfiles");
        var self = this;
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.CompanyCards", []);
                var compCard = component.get("v.CompanyCards");
                if(actionResult.getReturnValue().length == 11 ){
                    for(let i =0 ; i < 10; i++){
                        compCard.push(actionResult.getReturnValue()[i]);
                    }
                }else{
                    for(let i =0 ; i < actionResult.getReturnValue().length; i++){
                        compCard.push(actionResult.getReturnValue()[i]);
                    }
                }
                component.set('v.CompanyCards', compCard);
                this.inactiveShowMoreBtnHelper(component, actionResult.getReturnValue());
            }  
        });
        $A.enqueueAction(action); 
    },
    
    getMoreCompanyHelper: function(component) {
        var action = component.get("c.getMoreCompany");
        var amount2 = component.get("v.amount");
        action.setParams({ 'amount': amount2 });
        var self = this;
        action.setCallback(this, function(actionResult) {
            var state = actionResult.getState();
            if (component.isValid() && state === "SUCCESS") {
                var compCard = component.get("v.CompanyCards");
                if(actionResult.getReturnValue().length == 11 ){
                    for(let i = 0 ; i < 10; i++){
                        compCard.push(actionResult.getReturnValue()[i]);
                    }
                }else{
                    for(let i = 0 ; i < actionResult.getReturnValue().length; i++){
                        compCard.push(actionResult.getReturnValue()[i]);
                        
                    }
                }
                component.set('v.CompanyCards', compCard);
                component.set('v.amount', parseInt(amount2) + 10);
                this.inactiveShowMoreBtnHelper(component, actionResult.getReturnValue());  
            }          
        });
        $A.enqueueAction(action); 
    },
    
    getAllAccountHelper : function(component,event,helper){
        var getInputkeyWord = component.get("v.SearchKeyWord");        
        if(getInputkeyWord === ''){            
            var inputKeyChecked = component.get("v.CheckedInputValue");
            if(inputKeyChecked){
                this.forCloseHelper(component);
                this.getAllCompanyCardsForLoggedUser(component);
                component.set("v.CheckedInputValue", false);
            }else{
                this.forOpen(component);             
                this.searchHelper(component, event, getInputkeyWord);
            }
        }else{            
            this.forOpen(component);
            this.searchHelper(component, event, getInputkeyWord); 
        }
    },
    
    searchHelper : function(component, event, getInputkeyWord) { 
        if (event.keyCode != 40 &&
            event.keyCode != 38 &&
            event.keyCode != 13 &&
            event.keyCode != 37 &&
            event.keyCode != 39) {
            component.set('v.loaded', false);             
            var typingTimer = component.get("v.timer");
            clearTimeout(typingTimer);
            var that = this;
            typingTimer = setTimeout(function() {                             
                var checkPhone = that.detectPhoneHelper();
                var action = component.get("c.fetchGcProfiles");
                action.setParams({ 'searchKeyWord': getInputkeyWord, 'check': checkPhone });                
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var storeResponse = response.getReturnValue(); 
                        if (storeResponse.length == 0) {
                            component.set("v.Message", 'No Result Found...');
                        } else {
                            component.set("v.Message", 'Result Found');
                        }
                        component.set("v.listOfSearchRecords", storeResponse);                         
                    }
                    component.set('v.loaded', true); 
                });
                $A.enqueueAction(action);  
            },1000);
            component.set("v.timer", typingTimer);
        } else {            
            var myMap = component.get("v.listOfSearchRecords");
            if (myMap.length != 0) {
                if (event.keyCode == 40) { 
                    for (let j = 0; j < myMap.length; j++) {
                        if (myMap[j].bool && j == myMap.length - 1) {
                            break;
                        } else if (myMap[j].bool) {
                            myMap[j].bool = false;                             
                            myMap[j+1].bool = true;
                            break;
                        } else if (j == myMap.length - 1) {
                            myMap[0].bool = true;
                        }
                    }                        
                    component.set("v.listOfSearchRecords", myMap);
                } else if (event.keyCode == 38) {
                    for (let j = 0; j < myMap.length; j++) {
                        if (myMap[j].bool && j == 0) {
                            break;
                        } else if (myMap[j].bool) {
                            myMap[j].bool = false;                             
                            myMap[j-1].bool = true;
                            break;
                        }
                    }
                    component.set("v.listOfSearchRecords", myMap);
                } else if (event.keyCode == 13) { 
                    let check = false;
                    let obj;
                    for (let j = 0; j < myMap.length; j++) {
                        if (myMap[j].bool) {
                            check = true;
                            obj = myMap[j].obj;
                            break;
                        }
                    }
                    if (check) {
                        component.set("v.CompanyCards", obj);
                        component.set("v.SearchKeyWord", obj.Name);
                        component.set("v.CheckedInputValue", true);
                        this.forCloseHelper(component);
                    }
                }
            }
        }  
    },
    
    handleComponentEventHelper : function(component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("accountByEvent");
        this.inactiveShowMoreBtnHelper(component, selectedAccountGetFromEvent);
        component.set("v.CompanyCards", selectedAccountGetFromEvent);
        component.set("v.SearchKeyWord", selectedAccountGetFromEvent.Name);
        component.set("v.CheckedInputValue", true);
        this.forCloseHelper(component);
    },
    
    forOpen : function (component) {
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
    },
    
    forCloseHelper: function(component){
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
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
    
    detectPhoneHelper : function(){
        var device = $A.get("$Browser.formFactor");
        if(device === 'PHONE' || device === 'TABLET'){
            return true;
        }else{
            return false;
        }
    },
    
    inactiveShowMoreBtnHelper: function(component, listOfProfiles){
        var device = $A.get("$Browser.formFactor");
        var testIE = this.detectIEHelper();
        if(device === 'PHONE' || device === 'TABLET' || testIE === true){
            if(listOfProfiles.length == 11){
                $A.util.removeClass(component.find("ShowMoreBtn"), "slds-hide");
            }else{
                $A.util.addClass(component.find("ShowMoreBtn"), "slds-hide");
            }
        }
    },
    
})