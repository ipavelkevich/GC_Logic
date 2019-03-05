({
    sendTagToProductSearchController: function(component, event, helper) {
        var tagFromClick = event.target.id;
        var listTags = component.get("v.FullProductCardFromViewProduct.setTags");
        var compEvent = component.getEvent("oFromVFProductToProductSearch");
        for(let i = 0; i < listTags.length; i++){
            if(tagFromClick == listTags[i].Id){
                compEvent.setParams({"TagByEvent" : listTags[i]});
            }
        }
        compEvent.fire();
        window.scrollTo(0, 0);
    },
    
    doInitController: function(component, event, helper) {
        helper.getProductFileHelper(component, event);
        helper.getProductEmployeeHelper(component, event);
        var colorShortNameIco = component.get("v.FullProductCardFromViewProduct.product.Short_Name_Color_Icon__c");
        var testHex = '#' + colorShortNameIco;
        var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(testHex);
        var hue = 'background: #' + colorShortNameIco + ';';
        if (colorShortNameIco != '' && colorShortNameIco != undefined && isOk == true){
            component.set("v.styleVFP", hue);
        } else {
            component.set("v.styleVFP", "background:rgb(0, 109, 204)");
        }
    },
    
    showAllFilesButtonController: function(component, event, helper) {
        var forShow = component.find("showAllButton");
        $A.util.addClass(forShow, 'slds-show');
        $A.util.removeClass(forShow, 'slds-hide');  
    },
    
    showAllFilesController: function(component, event, helper) {
        var forShow = component.find("showAllButton");
        $A.util.addClass(forShow, 'slds-hide');
        $A.util.removeClass(forShow, 'slds-show');
        var iter = component.find("iterFiles").get("v.end");
        if (iter > "10"){
            alert("The number of files exceeded the limit. Maximum limit of 10 files!!!");
        } else {
            component.find("iterFiles").set("v.end", 10);
        }
    },
})