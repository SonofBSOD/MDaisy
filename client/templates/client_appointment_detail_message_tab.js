/*
	message_list:
		retrieve the session variables that should have been set
		by a staff_list link, and then fetch/display the message log
		for this appointment.
*/
Template.client_appointment_detail_message_tab.helpers({
	has_messages:function(){
		if(Session.get("client.tab.appointment_object") === undefined){
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
			var appointment_id = Session.get("client.tab.appointment_object")._id;
			var patient_id = Session.get("client.tab.appointment_object").user_id;
			var physician_id = Session.get("client.tab.appointment_object").ordering_physician;
			return messages.find(
				{/*'to_id':physician_id, 
				'from_id':patient_id, */
				'appointment_id':appointment_id}, 
				{sort:{date:1}}).count() !== 0;
		}
	},
	message_list:function(){
		if(Session.get("client.tab.appointment_object") === undefined){
			alert("undefined session vars!");
		}
		else{
			var appointment_id = Session.get("client.tab.appointment_object")._id;
			var patient_id = Session.get("client.tab.appointment_object").user_id;
			var physician_id = Session.get("client.tab.appointment_object").ordering_physician;
			return messages.find(
				{'appointment_id':appointment_id}, 
				{sort:{date:1}});
		}
	},
	message_text:function(){
		return this.text;},
	message_date:function(){
		return this.date.toLocaleString();
	},
	message_read_by_staff:function(){
		console.log(this.to_id);
		var to_user = Meteor.users.findOne({_id:this.to_id});
		if(to_user != undefined){
			return this.read && to_user.user_type == "staff";
		}
		else{
			return false;
		}
	},
	message_sender_style_class:function(){
		var user = Meteor.users.findOne({_id:this.from_id});
		if(user != undefined){
			if(user.user_type == "patient"){
				return "message_sent_by_patient";
			}
			else if(user.user_type == "staff"){
				return "message_sent_by_staff";
			}
			else{
				return "";
			}
		}
		else{
			return "";
		}
	},
	message_sender:function(){
		var user = Meteor.users.findOne({_id:this.from_id});
		console.log(user);
		if(user != undefined){
			console.log("here");
			if(user.user_type == "patient"){
				return "Sent by patient: " + user.profile.name;
			}
			else if(user.user_type == "staff"){
				return "Sent by staff: " + user.profile.name;
			}
			else{
				return "";
			}
		}
		else{
			console.log("there");
			return "";
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
					return "ready_background";
				}
				else{
					return "";
				}
			}
			else{
				return "";
			}
		}
	}
});

Template.client_appointment_detail_message_tab.events({
	"click .send_message" : function(e){
		e.preventDefault();
		//message_text, user_id, physician_id, message_date, related_appointment_id){
		var message_text = $("textarea#message_box").val();
		var appointment = Session.get("client.tab.appointment_object");
		Meteor.call("send_message", message_text, appointment.user_id, appointment.ordering_physician, (new Date()), appointment._id, function(err, res){
			if(err){
				//alert("fail");
			}
			else{
				//alert("success!");
				$("#message_box").focus();
				$("#message_box").val("");
			}
			
		} );
	},
	"keyup #message_box" : function(event){
		if(event.keyCode == 13){
			var message_text = $("textarea#message_box").val();
			var appointment = Session.get("client.tab.appointment_object");
			Meteor.call("send_message", message_text, appointment.user_id, appointment.ordering_physician, (new Date()), appointment._id, function(err, res){
				if(err){
					//alert("fail");
				}
				else{
					//alert("success!");
					$("#message_box").focus();
					$("#message_box").val("");
				}
			});
		}
	}
});

Template.client_appointment_detail_message_tab.onRendered(function(){
	/*if(Session.get("client.tab.appointment_object") === undefined){
		alert("undefined session vars!");
	}
	else{
		var appointment = Session.get("client.tab.appointment_object");
		Meteor.call("set_message_addressed_to_id_true", appointment._id, appointment.user_id, function(error, res){
			if(error){
				//alert("failure");
			}
			else{
				// $("#message_box").focus();
				//alert("success!");
			}
		});
// 		$("#message_box").focus();
	}*/
});
