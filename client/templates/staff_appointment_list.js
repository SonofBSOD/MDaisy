/*
  Helpers:
	app_list
		Returns an array of JSON objects that give general details
		of a patient's appointment. Uses the "query" Session variable
		to determine which appointments to show up. If query is undefined
		or the empty string, returns all of the user's appointments.
		
	get_id_data
		Returns an object with three id's that will be used to set 
		Session variables for the tabbed interfaces.
			appointment_id
			patient_id
			physician_id 
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
			//return everything if nothing searched for, else 
			//do a regular expression search!
			var query = Session.get("query");
			if(query === undefined || query === ""){
				//return appointments.find({'ordering_physician':user_id});
				return appointments.find({}, {
					sort: ['user_name']
				});
			}
			else{
				var query_exp = new RegExp(query.text, "i");
				//and then filter the list to make sure we get a match on user name, dob, or mrn
				/*var db_list = appointments.find({$and: [{'ordering_physician':user_id}, {$or: [{proc_type:query_exp}, {date:query_exp}, {location:query_exp},
																					{organization:query_exp}, {department:query_exp}, {user_dob:query_exp},
																						{user_mrn:query_exp}, {user_name:query_exp}
																					]}]});*/
				// var db_list = appointments.find({$and: [{'ordering_physician':user_id}, {$or: [ 
				// 																		{proc_type:query_exp}, {user_mrn:query_exp}, {user_name:query_exp}
				// 																	]}]});
				

				var db_list = appointments.find({ ordering_physician: user_id,
												  proc_type: { $in: query.procs },
												  user_name: query_exp,
												  organization: query.organization })

				return db_list;
			}
			
		}
		else{
			return [];
		}
	},
	get_id_data: function(){
		return {appointment_id:this._id, patient_id:this.user_id, physician_id:this.ordering_physician};
	},
	get_all_data: function(){
		return this;
	},
	get_class : function(){
		var default_class = "staff_list_button";
		/*if(this.updated_by_client){
			return default_class + " " + "staff_appointment_list_updated_item";
		}
		else{
			return default_class;
		}*/
		return default_class;
	},
	get_class_and_ready_status : function(){
		var default_class = "staff_list_button";
		if(this.exam_ready){
			return default_class + " " + "staff_appointment_list_exam_ready_item";
		}
		else{
			return default_class;
		}
	},
	has_unread_messages: function(){
		//do a query over all messages tied to this appointment
		var unread_messages = messages.find({appointment_id:this._id, read:false});
		return unread_messages.count() !== 0;
	},
	num_unread_messages: function(){
		var unread_messages = messages.find({appointment_id:this._id, read:false});
		return unread_messages.count();
	},
	patient_name : function(){
		var user = Meteor.users.findOne({_id:this.user_id});
		if(user != undefined){
			return user.profile.name;
		}
	},
	patient_dob : function(){
		var user = Meteor.users.findOne({_id:this.user_id});
		if(user != undefined){
			return user.profile.dob.toLocaleDateString().replace(/\//g, "-");
		}
	},
	patient_gender : function(){
        var user = Meteor.users.findOne({_id:this.user_id});
        if (user != undefined){
                    if (user.profile.gender == 'female') {
                        return 'F';
                    } else {
                        return 'M';
                    }
                
        }
        else{
                console.log("common_info_card: could not fetch user associated with this appointment");
        }
    },
    patient_age : function(){
        var user = Meteor.users.findOne({_id:this.user_id});
        if (user != undefined){
            var diff = Date.now() - user.profile.dob.getTime();
            var yrs = Math.abs((new Date(diff)).getUTCFullYear() - 1970);
            return yrs + "";
            // return yrs + " yrs";
        }
        else{
            console.log("common_info_card: could not fetch user associated with this appointment");
        }
    },
	patient_mrn : function(){
		var user = Meteor.users.findOne({_id:this.user_id});
		if(user != undefined){
			return user.profile.mrn;
		}
	},
	formatted_date : function(){
		return this.date.toLocaleDateString().replace(/\//g, "-");
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
		//save all data before the context gets mangled and lost in the Meteor.call callback
		var appointment_id = this.data._id;
		var patient_id = this.data.user_id;
		var physician_id = this.data.ordering_physician;
		var appointment_object = this.data;
		
		Meteor.call("set_updated_by_client_false", appointment_id, function(error, res){
			if(res){
				Session.set("staff.tab.appointment_object", appointment_object);
				Session.set("tab.appointment_id", appointment_id);
				Session.set("tab.patient_id", patient_id);
				Session.set("tab.physician_id", physician_id);
				Router.go("/staff_status_tab");
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

