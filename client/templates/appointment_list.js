/*
	Helpers:
	app_list
		Returns an array of JSON objects that give general details
		of a patient's appointment.
		
		The following attributes in these objects are used in the
		appointment_list template:
		{{date}} - A string listing both date and time of the appointment
		{{event}} - A string listing the type of medical event
	get_appointment_id
		Returns an object consisting of the named parameters that the
		detail route expects.
*/
Template.appointmentList.helpers({
	app_list : function(){
		var user_id = Meteor.userId();
		
		if(user_id !== null){
			return appointments.find({'user_id':user_id}, {sort:{date:1}});
		}
		else{
			return [];
		}
	},

	//Return a data object corresponding to the parameters that the detail route needs
	get_appointment_id : function(){
		return {appointment_id:this._id};
	}
});
