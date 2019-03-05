({  
    upFetchDataHelper: function (cmp, event, helper) {
        var uploadedFiles = event.getParam("files");
        
        for (let i = 0; i < uploadedFiles.length; i++) {
            var documentId = uploadedFiles[i].documentId;
            if(documentId != null){
                var action = cmp.get('c.modifyAfterUpload');
                action.setParams({
                    recordId: cmp.get("v.recordId"),
                    docId: documentId
                });
                action.setCallback(this,function(res){
                    var updata = res.getReturnValue();
                    var state=res.getState();
                    if(state=='SUCCESS'){
                        this.showRowDetailsUploadHelper(cmp, event, helper, updata); 
                    }
                });        
                $A.enqueueAction(action);
            }else{
                alert('Something gone wrong. Try to reload page');
            }
        }
    },
    
    showRowDetailsUploadHelper :function (cmp, event, helper, contId) {
        var modalBody;
        $A.createComponent("c:modalForUploadFile", {
            recordId: contId,
        },
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   cmp.find('overlayLibFileUpload').showCustomModal({
                                       header: "File Details",
                                       body: modalBody,
                                   })
                               }                               
                           });
    },
})