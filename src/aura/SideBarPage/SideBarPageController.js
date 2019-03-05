({
    init : function(component, event, helper) {
        helper.getTagsAllHelper(component, null, false);
        helper.getAmountAllTagsHelper(component);
        var url_string = window.location.href;
        var url = helper.getQueryStringHelper(url_string);
        if(url != 'undefined' &&
           url != undefined && 
           url !='' && 
           url != null && 
           !url.startsWith('5#') && 
           !url.startsWith('aloha') && 
           url.length !== 0 && 
           url != NaN &&
           url.length == 18){
            window.scrollTo(0, 0);          
        }else{
        }
        var action = component.get('c.getProfileInfo');
        action.setCallback(this,function(res){
            var profileName = res.getReturnValue();
            var state=res.getState();
            if(state=='SUCCESS'){
                if (profileName == 'GC Logic Admin' ||
                    profileName == 'System Administrator' ||
                    profileName == 'SFDC Support' ||
                    profileName == 'System Administrator_Mini') {
                    component.set('v.adminProfile', true);
                }
            }
        });        
        $A.enqueueAction(action);
    }, 
    
    sendTagToProductSearchController: function(component, event, helper) {
        var tagFromClick = event.target.id;
        var listTags = component.get("v.listTags");
        var compEvent = $A.get("e.c:fromSideBarPageToProductSearch");
        for(let i = 0; i < listTags.length; i++){ 
            if(tagFromClick == listTags[i].Id){ 
                compEvent.setParams({"TagByEvent" : listTags[i]});
            }
        }
        compEvent.fire();
        window.scrollTo(0, 0);
    },
    
    clickBtnShowAllController: function(component, event, helper) {
        var amountAllTags = component.get("v.amountAllTags");
        var sizeListTags = component.get("v.listTags").length;
        var count = parseInt(amountAllTags) - parseInt(sizeListTags);
        var visibilityBtnShowAll = component.find("visibilityBtnShowAll");
        if(count > 0){
            helper.getTagsAllHelper(component, 12, true);
            window.setTimeout(
                $A.getCallback(function() {
                    helper.hiddenHelper(visibilityBtnShowAll);
                }), 200
            );
        }else{
            helper.visibleHelper(visibilityBtnShowAll);
        }
    },
    
    tabsProductSearch : function(component, event, helper) {
        var visibilityBtnShowAll = component.find("visibilityBtnShowAll");
        helper.visibleHelper(visibilityBtnShowAll);
        helper.getTagsAllHelper(component, null, false);
        component.set('v.showTags', true);
        var compEvent = $A.get("e.c:fromSideBarPageToProductSearch");
        compEvent.fire(); 
        component.set('v.Product_Search', true);
        component.set('v.Company_Search', false);
        component.set('v.KeyTerms', false);
        component.set('v.AdminMenu', false);
        helper.tabsHelper(component, event);
    },
    
    tabsCompanySearch : function(component, event, helper) {
        component.set('v.Company_Search', true);
        var compEvent = $A.get("e.c:fromSideBarPageToCompanySearch");
        compEvent.fire(); 
        helper.tabs(component, event);
        component.set('v.Product_Search', false);
        component.set('v.KeyTerms', false);
        component.set('v.AdminMenu', false);
    },
    
    tabsKeyTerms : function(component, event, helper) {
        component.set('v.Product_Search', false);
        component.set('v.Company_Search', false);
        component.set('v.KeyTerms', true);
        component.set('v.AdminMenu', false);
        helper.tabs(component, event);
    },
    
    tabsAdminMenu : function(component, event, helper) {
        component.set('v.admin',true);
        component.set('v.Product_Search', false);
        component.set('v.Company_Search', false);
        component.set('v.KeyTerms', false);
        component.set('v.AdminMenu', true);
        helper.tabs(component, event);
    },
    
    openNav : function(component, event, helper) {
        helper.openNavHelper();
    }, 
    
    closeNav : function(component, event, helper) {
        helper.closeNavHelper();
    },
})