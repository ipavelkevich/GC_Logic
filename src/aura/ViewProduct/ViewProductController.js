({
    doInitController: function(component, event, helper) {
        var colorShortNameIco = component.get("v.ProductCardFromProductSearch.product.Short_Name_Color_Icon__c");
        var testHex = '#' + colorShortNameIco;
        var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(testHex);
        var hue = 'background: #' + colorShortNameIco + ';';
        if (colorShortNameIco != '' && colorShortNameIco != undefined && isOk == true){
            component.set("v.styleVP", hue);
        } else {
            component.set("v.styleVP", "background:rgb(0, 109, 204)");
        }
    },
    
    sendObjectToProductSearchController: function(component, event, helper) {      
        var getSelectRecord = component.get("v.ProductCardFromProductSearch");
        var compEvent = component.getEvent("oFromVProductToProductSearch");
        compEvent.setParams({"ProductRecordByEvent" : getSelectRecord });
        compEvent.fire();
    },
    
    sendTagToProductSearchController: function(component, event, helper) {
        var tagFromClick = event.target.id;
        var listTags = component.get("v.ProductCardFromProductSearch.setTags");
        var compEvent = component.getEvent("oFromVProductToProductSearch");
        for(let i = 0; i < listTags.length; i++){
            if(tagFromClick == listTags[i].Id){
                compEvent.setParams({"TagByEvent" : listTags[i]});
            }
        }
        compEvent.fire();
        window.scrollTo(0, 0);
    },
})