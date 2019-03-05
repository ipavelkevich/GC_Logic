({
    doInit: function(component, event, helper) {
        component.set("v.Check", false);
        component.set("v.Check", true);
        var profile = component.get('v.compPerfom');
        helper.formatedProfileFieldsHelper(profile);
        if(profile.ROS__c != undefined && profile.ROS__c != null){
            profile.ROS__c = (parseFloat(profile.ROS__c)*100).toFixed(1);
        }else{
            profile.ROS__c = 0;
        }
        if(profile.GWP_Growth__c != undefined && profile.ROS__c != null){
            profile.GWP_Growth__c = (parseFloat(profile.GWP_Growth__c)*100).toFixed(1);
        }else{
            profile.GWP_Growth__c = 0;
        }
        if(profile.Ceded_Ratio__c != undefined && profile.ROS__c != null){
            profile.Ceded_Ratio__c = (parseFloat(profile.Ceded_Ratio__c)*100).toFixed(1);
        }else{
            profile.Ceded_Ratio__c = 0;
        }
        if(profile.Net_CR__c != undefined && profile.ROS__c != null){
            profile.Net_CR__c = (parseFloat(profile.Net_CR__c)*100).toFixed(1);
        }else{
            profile.Net_CR__c = 0;
        }
        var map = new Map();
        map.set(1, 'Top 25%')
        map.set(2, 'Middle 26-50%')
        map.set(3, 'Middle 51-75%')
        map.set(4, 'Bottom 25%');
        window.setTimeout(
            $A.getCallback(function() {
                var tags = document.getElementById("recordViewForm");
                var divs = tags.getElementsByTagName("div");
                var ps = tags.getElementsByTagName("p");
                for(let i = 0; i < divs.length; i++){
                    var divInnerHTML = divs[i].innerHTML;
                    if(ps[i] != undefined && ps[i].innerHTML != undefined){
                        var pInnerHTML = ps[i].innerHTML;
                        if(i > 8){
                            pInnerHTML = parseFloat(pInnerHTML) * 100;
                        }
                        var rounded = parseFloat(pInnerHTML); 
                        pInnerHTML = rounded.toFixed(1);
                        if( pInnerHTML != 'NaN' ){
                            if(pInnerHTML.length > 0){ 
                                var test1 = pInnerHTML;
                                if(parseFloat(test1) == 0){
                                    test1 = '0';
                                }
                                if(test1.length > 1){
                                    ps[i].innerHTML = test1 + '%';
                                }else if(test1.length == 1){
                                    ps[i].innerHTML = test1 + '.0%';
                                }
                            }
                        }
                        if(divInnerHTML.length > 0 && parseInt(divInnerHTML) > 0 && parseInt(divInnerHTML) < 5){
                            divs[i].innerHTML = map.get(parseInt(divInnerHTML));
                            if(divInnerHTML == '1'){
                                divs[i].style.color = "#00b04e";
                                ps[i].style.color = "#00b04e";
                            }else if(divInnerHTML == '2'){
                                divs[i].style.color = "#d5cd00";
                                ps[i].style.color = '#d5cd00';
                            }else if(divInnerHTML == '3'){
                                divs[i].style.color = "#fdc200";
                                ps[i].style.color = "#fdc200";
                            }else if(divInnerHTML == '4'){
                                divs[i].style.color = "#ff0000";
                                ps[i].style.color = "#ff0000";
                            }
                        }
                    }
                }
            }), 100);
    },
})