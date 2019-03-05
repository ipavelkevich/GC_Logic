({
    getProductFileHelper: function(component, event, helper) {
        var idProduct = component.get("v.FullProductCardFromViewProduct.product.Id");
        var action2 = component.get("c.getAttachFilesId");
        action2.setParams({ IdProduct : idProduct});
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                component.set("v.fileContentVersionId", storeResponse);  
                var files = component.get("v.fileContentVersionId");
                if(files.length > 2){
                    component.set("v.forButton", true); 
                }
            }
        });
        $A.enqueueAction(action2); 
    },
    
    getProductEmployeeHelper: function(component, event, helper) {
        var idProductEmployee = component.get("v.FullProductCardFromViewProduct.product.Employee__c");
        var action = component.get("c.getEmployeeOfProductById");
        action.setParams({ idEmployee : idProductEmployee});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.EmployeeProduct", storeResponse);
            }
        });
        $A.enqueueAction(action); 
    },
})