({
    doInitController: function(component, event, helper) {
        helper.getAllProductsHelper(component, false);
        helper.tagsForInitHelper(component);
        window.setTimeout(
            $A.getCallback(function() {
                helper.showBtnHelper(component);
            }), 2000);
    },
    
    arrowsController: function(component, event, helper) {
        var myMap = component.get("v.listOfSearchRecords");  
        if (event.keyCode == 40) { 
            helper.forOpenHelper(component);
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
            helper.forOpenHelper(component);
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
                    obj = myMap[j];
                    break;
                }
            }
            if (check) {  
                var listSelectedItems = component.get("v.lstSelectedRecords");
                var check2 = helper.filterTagToPillsHelper(component, listSelectedItems, obj);
                if(check2){
                    helper.searchByPillsHelper(component, false);
                }
                var listSelectedItems = component.get("v.lstSelectedRecords");
                helper.refreshListWithNewTag(component, myMap);
                helper.forCloseHelper(component);
            }
        }
    },
    
    doSearchController: function(component, event, helper) {   
        var listRecords = component.get("v.lstSelectedRecords");
        if(listRecords.length > 0){
            helper.searchByPillsHelper(component, false);
            component.set("v.showPageFullProduct", false);
        }
    },
    
    onfocusController: function(component, event, helper){
        var checkPhone = helper.detectPhoneHelper();
        var getInputkeyWord = component.get("v.SearchKeyWord");
        helper.forOpenHelper(component); 
        helper.lookUpHelper(component, getInputkeyWord, checkPhone); 
    },
    
    keyPressController: function(component, event, helper) {
        var getInputkeyWord = component.get("v.SearchKeyWord");
        if (getInputkeyWord != undefined) {
            var oldInputString = component.get("v.CheckInputKey"); 
            if (getInputkeyWord.toUpperCase() != oldInputString.toUpperCase()) { 
                component.set("v.CheckInputKey", getInputkeyWord);
                if(getInputkeyWord.length >= 0){
                    var checkPhone = helper.detectPhoneHelper();
                    helper.forOpenHelper(component); 
                    helper.lookUpHelper(component, getInputkeyWord, checkPhone); 
                }
            }
        }
    },
    
    clearController: function(component, event, helper){
        var selectedPillId = event.getSource().get("v.name");
        var AllPillsList = component.get("v.lstSelectedRecords"); 
        for(var i = 0; i < AllPillsList.length; i++){
            if(AllPillsList[i] === selectedPillId){
                AllPillsList.splice(i, 1); 
                component.set("v.lstSelectedRecords", AllPillsList);
            }
        }   
        if (AllPillsList.length <= 1){
            component.set("v.valueSwitchShow" , false);
            component.set("v.valueSwitch" , false);
        }
        component.set("v.SwitchProductCards", false);
        helper.searchByPillsHelper(component, false);  
    },
    
    handleComponentEventController: function(component, event, helper) {
        helper.forCloseHelper(component);
        component.set("v.SearchKeyWord",'');	 
        var listSelectedItems =  component.get("v.lstSelectedRecords");
        var selectedTagFromEvent = event.getParam("recordByEvent");
        helper.filterTagToPillsHelper(component, listSelectedItems, selectedTagFromEvent);
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
    
    checkActionController: function(component, event, helper) {
        var product = event.getParam("ProductRecordByEvent"); 
        var tag = event.getParam("TagByEvent"); 
        if(product != undefined){
            component.set("v.lstSelectedRecords", []);
            helper.openFullProductHelper(component, event);
        }else if(tag != undefined){
            helper.addTagToPillsHelper(component, event, tag);
        }    
    },
    
    renderResultsController: function(component, event, helper){
        helper.resultsRenderHelper(component);
    },
    
    showMoreController : function(component, event, helper){
        var device = $A.get("$Browser.formFactor");
        var testIE = helper.detectIEHelper();
        if(device === 'PHONE' || device === 'TABLET' || testIE === true){ 
            helper.showMoreHelper(component);
            window.setTimeout(
                $A.getCallback(function() {
                    helper.inactiveShowMoreBtnHelper(component);
                }), 1000
            );
        }
    },
    
    getAllProductsForScrollController: function(component, event, helper){
        helper.getAllProductsHelper(component, true);
    },
    
    addTagToPillsController: function(component, event, helper) {
        var tag = event.getParam("TagByEvent"); 
        if(tag != undefined){
            component.set("v.showPageFullProduct", false);
            helper.addTagToPillsHelper(component, event, tag);
        }    
    },
    
    actionFromSideBarController : function(component, event, helper) {
        var selectedTagFromSideBar = event.getParam("TagByEvent");
        if(selectedTagFromSideBar != undefined){
            helper.addTagToPillsHelper(component, event, selectedTagFromSideBar);
        }else{
            component.set("v.valueSwitchShow" , false);
            component.set("v.valueSwitch" , false);
            component.set("v.lstSelectedRecords", []);      
            helper.closeFullProductHelper(component, event);
        }
    },
    
    removeAllTagsController : function(component, event, helper) {
        helper.forCloseHelper(component);
        component.set("v.lstSelectedRecords", []);
        component.set("v.valueSwitchShow" , false);
        component.set("v.valueSwitch" , false);
        helper.getTagsAllHelper(component);
        helper.getAllProductsHelper(component, false);
    },
})