function get_patient_name(id){
	var user = Meteor.users.findOne({_id:id});
	if(user !== undefined){
		return user.profile.name;
	}
	else{
		return "";
	}
}

Template.staff_appointment_detail_notification_tab.events({
	"click #message_one" : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object !== undefined){
			var patient_name = get_patient_name(appointment_object.user_id);
			var message = patient_name + ", please come to the front desk.";
			alert(message);
		}
		else{
			
		}
	},
	"click #message_two" : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object !== undefined){
			var patient_name = get_patient_name(appointment_object.user_id);
			var message = patient_name + ", your appointment is next in line.";
			alert(message);
		}
		else{
			
		}
	},
	"click #message_three" : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object !== undefined){
			var patient_name = get_patient_name(appointment_object.user_id);
			var message = patient_name + ", please quiet down.";
			alert(message);
		}
		else{
			
		}
	},
	"click #message_four" : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object !== undefined){
			var patient_name = get_patient_name(appointment_object.user_id);
			var message = patient_name + ", please return this device.";
			alert(message);
		}
		else{
			
		}
	}
});

Template.staff_appointment_detail_notification_tab.events({
	"click #message_send" : function(){
		var message_text = $("#message_box").val();
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object !== undefined){
			var patient_name = get_patient_name(appointment_object.user_id);
			var message = patient_name + ", " + message_text;
			alert(message);
		}
		else{
			
		}
	},
	"keyup #message_box" : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		var patient_name = get_patient_name(appointment_object.user_id);
		$("#message_preview").val(patient_name + ", " + $("#message_box").val());
	}
});