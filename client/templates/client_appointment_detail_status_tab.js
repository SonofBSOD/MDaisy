Template.client_appointment_detail_status_tab.helpers({
	appointment_user_name : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.user_name;
		}
	},
	appointment_user_mrn : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.user_mrn;
		}
	},
	appointment_date : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.date;
		}
	},
	appointment_department : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.department;
		}
	},
	appointment_reason : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.reason;
		}
	},
	appointment_type : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.proc_type;
		}
	},
	exam_ready : function(){
		var appointment_object = Session.get("client.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
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