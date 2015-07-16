Template.client_appointment_detail_info_tab.helpers({
	appointment_exam_info : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			var medical_info = medicalInfo.findOne({proc_type:Session.get("client.tab.appointment_object").proc_type});
			if(medical_info != null){
				return medical_info.text;
			}
			else{
				alert("Error! Could not load exam medical information!");
			}
		}
	}
});