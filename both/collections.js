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

	set_updated_by_client_false : function(appointment_id){
		var ret = appointments.update({_id:appointment_id}, {$set:{updated_by_client:false}});
		return ret === 1;
	},
	set_message_read_true : function(related_appointment_id){
		messages.update({appointment_id:related_appointment_id, read:false},{$set:{read:true}}, {multi:true});
	}

});
