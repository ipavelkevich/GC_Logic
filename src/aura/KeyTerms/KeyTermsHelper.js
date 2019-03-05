({
    getAllGlosariesHelper : function(component) {
        var action = component.get("c.getAllGlosaries");
        var self = this;
        action.setCallback(this,function(actionResult){
            var state = actionResult.getState();
            if (component.isValid() && state === "SUCCESS") {
                var glosaries = actionResult.getReturnValue();
                component.set('v.GlosaryCards',glosaries);
                this.setNewGlosariesHelper(component, glosaries);
            }
        });        
        $A.enqueueAction(action); 
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
    
    setNewGlosariesHelper : function(component, glosaries) {
        var url_string = window.location.href;
        var url = this.getQueryStringHelper(url_string);
        if(url != undefined){
            var glosaryId = url
            for(var i = 0; i < glosaries.length; i++){
                if(glosaryId == glosaries[i].Id){
                    var index = i;
                    var glosary = glosaries[i];
                    break;
                }
            }
            history.pushState(null, null, '/lightning/n/GC_LoGiC');
            if(index != 0 && index != null){
                glosaries.splice(index, 1);
                glosaries.unshift(glosary);                
                component.set('v.GlosaryCards',glosaries); 
            }
        } 
    },
})