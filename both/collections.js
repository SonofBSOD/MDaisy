/*
	This file contains all collections (with the exception of 
	Meteor.user) as listed in the DatabaseSchemaSpec.
*/

appointments = new Mongo.Collection("appointments");
medicalInfo = new Mongo.Collection("medicalInfo");
preparations = new Mongo.Collection("preparations");
user_to_push_id_map = new Mongo.Collection("user_to_push_id_map");
notifications = new Mongo.Collection("notifications");
messages = new Mongo.Collection("messages");

/*
	The following arguments are the rpc calls exposed to the 
	client for database inserts and edits.

	update_obligations:
		Precondition
			obligation_status_list - a list of objects of the following form
			{_id, checked}, where _id is the Mongo-assigned _id of an 
			obligations document stored in preparations (exposed through the
			"obligations_id" attribute tag in appointment_detail), and checked
			is a boolean indicating whether the corresponding checkbox is checked
			or not.

			appointment_id - a string that is the Mongo-assigned _id of the
			medical appointment that these obligations are grouped under.

		Postcondition
			attempts to update the "checked" fields of all given obligations.
			on success, also sets the "updated_by_client" flag to true in the corresponding
			appointment, and updates the previous_completed field.

			returns an object with the following attributes:
				success:
					a boolean indicating whether updating of all passed-in
					obligations succeeded.
				outdated:
					a list of Mongo-assigned id's whose corresponding obligations
					were submitted in a RETROACTIVE attempt to update their statuses.
					this is not allowed, and so the _id's are passed back for an error
					message.

			**the entire update operation succeeds only if:
				1) all passed-in obligations are NOT retroactive and all database update operations on these 
				obligations succeed.
				2) setting the "updated_by_client" flag to true also succeeds.
				3) setting the "previous_completed" field of each obligation succeeds.

			there are no "roll-back" guarantees, if for example, out of 10 non-retroactive
			obligations, 4 succeed, and the 5th fails. success will be set to false.
	staff_update_obligations_with_notify
		Precondition
			obligation_status_list - a list of objects of the following form
			{_id, checked}, 
				_id is the Mongo-assigned _id of an 
				obligations document stored in preparations (exposed through the
				"obligations_id" attribute tag in appointment_detail)
				
				checked is a boolean indicating whether the corresponding checkbox is checked
				or not.

			appointment_id - a string that is the Mongo-assigned _id of the
			medical appointment that these obligations are grouped under.
			
			user_id - a string that is the Mongo-assigned _id of the user who called this method. This user
			must have the "staff" account type.
			
		Postcondition
			attemps to set the "checked" fields of all given obligations, updates the previous-completed field
			and will send out push notifications
			with sound and vibration
			
			returns an object with the following attributes:
				success:
					a boolean indicating whether updating of all passed-in
					obligations succeeded.
				reason:
					if success is false, returns a string indicating the encountered error
		
			**the entire operation succeeds if:
				1) all database operations are allowed by their permissions
				2) all database operations succeed
	set_updated_by_client_false:
		Precondition
			appointment_id - a string that is the Mongo-assigned _id of the medical appointment.

		Postcondition
			sets the "updated_by_client" field of the identified document to false.
			returns true if the operation succeeded, false otherwise.
	set_message_read_true:
		Precondition
			related_appointment_id - a string that is the Mongo-assigned _id of the appointment
			under which this message was sent
		
		Postcondition
			sets the "read" field of all related messages whose "read" field is false
			to true. no meaningful value is returned.
	set_message_addressed_to_id_true
		Precondition
			related_appointment_id - a string that is the Mongo-assigned _id of the appointment
			under which this message was sent
			to_id - a string that is the Mongo-assigned _id of the user that the message is addressed to
		
		Postcondition
			sets the "read" field of all messages under appointment with id related_appointment_id
			that are addressed to user with _id = to_id to "true" if they were originally "false".
	staff_set_and_notify_appointment_exam_status
		Precondition
		
		Postcondition
			returns {success:boolean, notification_sent:boolean}
*/
Meteor.methods({
	update_obligations : function(obligation_status_list, appointment_id){
		//first check that all proposed updates are NOT retroactive
		var current_time = (new Date());
		var retroactive = false;
		var retroactive_list = [];

		obligation_status_list.forEach(function(e){
			var obligation_record = preparations.findOne({_id:e._id});
			
			//db lookup failure
			if(obligation_record === null){
				return {success:false, outdated:[]};
			}

			if(current_time > obligation_record.date_by){
				retroactive = true;
				retroactive_list.push(e._id);
			}
		});

		//cannot update if the user is trying to maliciously change overdue obligations
		if(retroactive){
			return {success:false, outdated:retroactive_list};
		}

		//else, update the completed and previous_completed fields for each obligation, and make sure
		//every update passes
		obligation_status_list.forEach(function(e){
			var obligation_record = preparations.findOne({_id:e._id});
			
			//db lookup failure
			if(obligation_record === null){
				return {success:false, outdated:[]};
			}
			var old_completed = obligation_record.completed;
			
			var ret = preparations.update({_id:e._id}, {$set:{completed:e.checked, previous_completed:old_completed}});

			if(ret != 1){
				return {success:false, outdated:[]};
			}
		});

		//finally, set the appointment's update flag
		var ret = appointments.update({_id:appointment_id}, {$set:{updated_by_client : true}});
		if(ret != 1){
			return {success:false, outdated:[]};
		}

		return {success:true, outdated:[]};
		
	},
	staff_update_obligations_with_notify : function(obligation_status_list, appointment_id, user_id){
		var appointment_object = appointments.findOne({_id:appointment_id});
		var user_object = Meteor.users.findOne({_id:user_id});
		
		if(appointment_object === null){
			return {success:false, reason:"Appointment does not exist."};
		}
		
		if(user_object === null){
			return {success:false, reason:"User does not exist."};
		}
		
		if(user_object.user_type !== "staff"){
			return {success:false, reason:"User does not have staff previlege."};
		}
		
		obligation_status_list.forEach(function(e){
			var obligation_record = preparations.findOne({_id:e._id});
			
			//db lookup failure
			if(obligation_record === null){
				return {success:false, reason:"Nonexistent preparation record."};
			}
			var old_completed = obligation_record.completed;
			
			var ret = preparations.update({_id:e._id}, {$set:{completed:e.checked, previous_completed:old_completed}});

			if(ret != 1){
				return {success:false, reason:"Preparation document update failed."};
			}
			
			if(obligation_record.notify_on_complete && e.checked){
				console.log("notification: " + obligation_record.notify_options.text);
				Push.send({from:obligation_record.notify_options.from, 
							title:obligation_record.notify_options.title, 
							text:obligation_record.notify_options.text, 
							query:{userId:appointment_object.user_id}, 
							sound:"test.wav", 
							vibrate:true});
			}
		});
		
		return {success:true, reason:""};
	},

	set_updated_by_client_false : function(appointment_id){
		var ret = appointments.update({_id:appointment_id}, {$set:{updated_by_client:false}});
		return ret === 1;
	},
	set_message_read_true : function(related_appointment_id){
		messages.update({appointment_id:related_appointment_id, read:false},{$set:{read:true}}, {multi:true});
	},
	set_message_addressed_to_id_true: function(related_appointment_id, user_id){
		messages.update({appointment_id:related_appointment_id, read:false, to_id:user_id},{$set:{read:true}}, {multi:true});
	},
	send_message : function(message_text, user_id, physician_id, message_date, related_appointment_id){
		messages.insert({text:message_text, to_id:physician_id, from_id:user_id, appointment_id:related_appointment_id, date:message_date, read:false});
	},
	staff_set_and_notify_appointment_exam_status : function(appointment_id, user_id, exam_status){
		var appointment = appointments.findOne({_id:appointment_id});
		if(appointment == null){
			return {success:false};
		}
		
		var user = Meteor.users.findOne({_id:user_id});
		if(user == null){
			return {success:false};
		}
		
		if(user.user_type !== "staff"){
			return {success:false};
		}
		
		if(exam_status != true && exam_status != false){
			return {success:false};
		}
		
		appointments.update({_id:appointment_id}, {$set:{exam_ready:exam_status}});
		if(exam_status == true){
		    console.log("ID: " + appointment.user_id);
			Push.send({from:"Radiology Staff", 
							title:"Exam Status", 
							text:"Hi! You are ready for your exam!", 
							query:{userId:appointment.user_id}, 
							sound:"test.wav",
							alert:true,
							vibrate:true});
		}
		
		return {success:true, notification_sent:exam_status};
	},
	staff_delete_appointment : function(appointment_id, user_id){
		var appointment = appointments.findOne({_id:appointment_id});
		if(appointment == null){
			return false;
		}
		
		var user = Meteor.users.findOne({_id:user_id});
		if(user == null){
			return false;
		}
		
		if(user.user_type !== "staff"){
			return false;
		}
		
		appointments.remove({_id:appointment_id});
		return true;
	}
});
