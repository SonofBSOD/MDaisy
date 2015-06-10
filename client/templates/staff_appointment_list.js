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
	get_class
		Returns the class tag for a list item.
		By default, returns only "staff_list_button".
		If the corresponding appointment was also updated by the client,
		then the returned string becomes "staff_list_button staff_appointment_list_updated_item".
*/
Template.staff_appointment_list.helpers({
	app_list : function(){
		var user_id = Meteor.userId();
		
		if(user_id !== null){
			return appointments.find({'ordering_physician':user_id});
		}
		else{
			return [];
		}
	},
	get_appointment_id: function(){
		return {appointment_id:this._id};
	},
	get_class : function(){
		var default_class = "staff_list_button";
		if(this.updated_by_client){
			return default_class + " " + "staff_appointment_list_updated_item";
		}
		else{
			return default_class;
		}
	}
});

/*
	Events:
	"click .staff_button":
		when we click to view an appointment, we first attempt to set the appointment's
		"updated_by_client" flag to false; this is because the staff is going to view it.
		if this fails, we issue a prompt to try again. otherwise, we set the current
		appointment_view_time and continue on to the staff detail page.
		
*/
Template.staff_appointment_list.events({
	"click .staff_list_button":function(e, tmp_inst){
		e.preventDefault();
		//save the appointment id before the data context gets mangled in the Meteor.call callback
		var id = this.data.appointment_id;
		Meteor.call("set_updated_by_client_false", id, function(error, res){
			if(res){
				Router.go("/detail/" + id);
			}
			else{
					IonPopup.show({
					title: 'Error',
					template : "Sorry! Appointment status could not be updated! Please try again!",
					buttons : [{
						text: 'Ok',
						type: 'button-positive',
						onTap: function(){
							IonPopup.close();
						}
					}]
				});
			}
		});
		Session.set("appointment_view_time", new Date());
	}

});