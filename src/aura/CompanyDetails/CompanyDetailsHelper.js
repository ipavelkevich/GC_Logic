({
	formatedProfileFieldsHelper : function(profile) {		
		profile.Surplus__c = this.checkFieldsHelper(profile.Surplus__c);
		profile.GWP__c = this.checkFieldsHelper(profile.GWP__c);
		profile.NWP__c = this.checkFieldsHelper(profile.NWP__c);
		if(profile.Market__c == 'US'){
			profile.Personal_Lines_Total__c = this.checkFieldsHelper(profile.Personal_Lines_Total__c);
			profile.HO__c = this.checkFieldsHelper(profile.HO__c);
			profile.Auto__c = this.checkFieldsHelper(profile.Auto__c);
			profile.Commercial_Lines_Total__c = this.checkFieldsHelper(profile.Commercial_Lines_Total__c);
			profile.Property__c = this.checkFieldsHelper(profile.Property__c);
			profile.Liability__c = this.checkFieldsHelper(profile.Liability__c);
			profile.WC__c = this.checkFieldsHelper(profile.WC__c);
			profile.Specialty_Lines_Total__c = this.checkFieldsHelper(profile.Specialty_Lines_Total__c);
			profile.A_H__c = this.checkFieldsHelper(profile.A_H__c);
			profile.Assumed_Reins__c = this.checkFieldsHelper(profile.Assumed_Reins__c);
			profile.Financial_Lines_Surety_Mortgage_Credi__c = this.checkFieldsHelper(profile.Financial_Lines_Surety_Mortgage_Credi__c);
			profile.Other_B_M_Aircraft_Ocean_Marine__c = this.checkFieldsHelper(profile.Other_B_M_Aircraft_Ocean_Marine__c);
		}else if(profile.Market__c == 'International'){
			profile.Non_Life_GWP_2017_2016__c = this.checkFieldsHelper(profile.Non_Life_GWP_2017_2016__c);
			profile.Non_Life_NWP_2017_2016__c = this.checkFieldsHelper(profile.Non_Life_NWP_2017_2016__c);
		}
	},

	checkFieldsHelper : function(field) {		
		if(field != undefined && field != null){
			return (parseFloat(field)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}

})