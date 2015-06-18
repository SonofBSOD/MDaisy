/*
	message_list:
		retrieve the session variables that should have been set
		by a staff_list link, and then fetch/display the message log
		for this appointment.
*/
Template.staff_appointment_detail_message_tab.helpers({
	has_messages:function(){
		var appointment_id = Session.get("tab.appointment_id");
		var patient_id = Session.get("tab.patient_id");
		var physician_id = Session.get("tab.physician_id");

		if(appointment_id === undefined || 
		   patient_id === undefined ||
           physician_id === undefined){
			IonPopup.show({
				title: 'Error',
				template : "Sorry! Session data deleted. Please back out and reselect.",
				buttons : [{
					text: 'Ok',
					type: 'button-positive',
					onTap: function(){
						IonPopup.close();
					}
				}]
			});
		}
		else{
			return messages.find(
				{'to_id':physician_id, 
				'from_id':patient_id, 
				'appointment_id':appointment_id}, 
				{sort:{date:1}}).count() !== 0;
		}
	},
	message_list:function(){
		var appointment_id = Session.get("tab.appointment_id");
		var patient_id = Session.get("tab.patient_id");
		var physician_id = Session.get("tab.physician_id");

		if(appointment_id === undefined || 
		   patient_id === undefined ||
           physician_id === undefined){
			alert("undefined session vars!");
		}
		else{
			return messages.find(
				{'to_id':physician_id, 
				'from_id':patient_id, 
				'appointment_id':appointment_id}, 
				{sort:{date:1}});
		}
	},
	message_text:function(){
		return this.text;},
	message_date:function(){
		return this.date.toLocaleString();
	}
});