Template.client_appointment_detail_info_tab.helpers({
	appointment_exam_info : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			// alert("Error! Could not load session appointment object!");
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
	appointment_exam_video : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment in exam object!");
		}
		else{
			var medical_info = medicalInfo.findOne({proc_type:Session.get("client.tab.appointment_object").proc_type});
			console.log(medical_info.youtube_src);
			if(medical_info != null){
				return medical_info.youtube_src;
			}
			else{
				alert("Error! Could not load exam medical exam video!");
			}
		}
	},
	ready_background_class : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			// alert("Error! Could not load session appointment object!");
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
	},
	exam_ready : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			// alert("Error! Could not load session appointment object!");
		}
		else{
			//fetch this from the database; we want reactive updates for this.
			var db_appointment_object = appointments.findOne({_id:appointment_object._id});
			if(db_appointment_object != null){
				return db_appointment_object.exam_ready;
			}
			else{
				alert("Error! Could not find appointment object!");
			}
		}
	}
});

