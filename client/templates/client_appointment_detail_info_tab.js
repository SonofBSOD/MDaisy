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
	},
	ready_background_class : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			//fetch this from the database; we want reactive updates for this.
			var db_appointment_object = appointments.findOne({_id:appointment_object._id});
			if(db_appointment_object != null){
				if(db_appointment_object.exam_ready){
					return "patient_ready_background";
				}
				else{
					return "patient_not_ready_background";
				}
			}
			else{
				return "patient_not_ready_background";
			}
		}
	}
});