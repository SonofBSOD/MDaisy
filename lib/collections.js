/*
	This file contains all collections (with the exception of 
	Meteor.user) as listed in the DatabaseSchemaSpec.
*/

appointments = new Mongo.Collection("appointments");
medicalInfo = new Mongo.Collection("medicalInfo");
user_to_push_id_map = new Mongo.Collection("user_to_push_id_map");
notifications = new Mongo.Collection("notifications");
messages = new Mongo.Collection("messages");


/*
	The following arguments are the rpc calls exposed to the 
	client for database inserts and edits.


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
	set_updated_by_client_false : function(appointment_id){
		var ret = appointments.update({_id:appointment_id}, {$set:{updated_by_client:false}});
		return ret === 1;
	},
	set_message_read_true : function(related_appointment_id){
		messages.update({appointment_id:related_appointment_id, read:false},{$set:{read:true}}, {multi:true});
	},
	set_message_addressed_to_id_true: function(related_appointment_id, user_id){
		//messages.update({appointment_id:related_appointment_id, read:false, to_id:user_id},{$set:{read:true}}, {multi:true});
		messages.update({appointment_id:related_appointment_id, read:false, to_id:user_id},{$set:{read:true}});
	},
	set_message_addressed_from_id_true:function(related_appointment_id, user_id){
		//messages.update({appointment_id:related_appointment_id, read:false, from_id:user_id},{$set:{read:true}}, {multi:true});
		messages.update({appointment_id:related_appointment_id, read:false, from_id:user_id},{$set:{read:true}});
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
