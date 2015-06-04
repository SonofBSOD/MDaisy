(function(){Template.information_modal.helpers({
	info : function(){
		return medicalInfo.findOne({proc_type:Session.get("appointment_proc_type")}).text;
	}
});

})();
