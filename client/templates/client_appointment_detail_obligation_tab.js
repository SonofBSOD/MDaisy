/*
	Precondition: 
		p - a list whose structure is identical to the "preparations"
			field described under "appointments" in DatabaseSchemaSpec.

	Postcondition: a list of objects of the following form:
	[{date_header: a locale date string}...], where each such
	date string is unique, and the objects are sorted from earliest
	to latest date.
*/
function unique_date(p){
	var unique_date_list = [];
	//work with a copy of the preparations list, and first sort
	//it in order of increasing list.
	var l = _.map(p, function(e){return e;}).sort(function(x, y){
		return x.date_by - y.date_by;
	});

	l.forEach(function(e, i){
		var date_str = e.date_by.toLocaleDateString();
		var date_str_repeated = false;
		
		unique_date_list.forEach(function(x){
			date_str_repeated = (x.date_header === date_str); 
		});

		if(!date_str_repeated){
			unique_date_list.push({date_header:date_str});
		}
	});

	//lastly, remove the temp_date attribute before sending to the user.
	return unique_date_list;
}

/*
	Precondition:
		date_object_list - a list of objects containing date_header fields
						   with unique date locale strings
		prep_list - a list whose structure is identical to the "preparations"
			        field described under "appointments" in DatabaseSchemaSpec.
		
		Additionally, date_object_list must be obtained by calling unique_date on prep_list.

	Postcondition:
		a list of the objects from prep_list, arranged in the following form:
		[{date_header : locale date string, date_obligations : [{preparation object}] } ...],
		where each preparation object's date_by.toLocaleDateString() inside the date_obligations list 
		shares the same value as the date_header field.

		in addition, each obligation related under a given date_header is also sorted in increasing
		Date order

		NOTE: these objects are NOT deep copies.
*/		
function insert_by_date(date_object_list, prep_list){
	//first add an empty date_obligations list for each of them.
	var new_date_object_list = _.map(date_object_list, function(e){
		return {date_header:e.date_header, date_obligations:[]};
	});
	
	prep_list.forEach(function(e){
		for(var i = 0; i < new_date_object_list.length; i++){
			if(new_date_object_list[i].date_header === e.date_by.toLocaleDateString()){
				new_date_object_list[i].date_obligations.push(e);
			}
		}
	});

	//now sort each date_obligation list
	new_date_object_list.forEach(function(e){
		e.date_obligations.sort(function(x, y){
			return x.date_by - y.date_by;
		});
	});

	return new_date_object_list;
}

/*
	title 
		returns a string containing the title of the appointment.
	obligations [deprecated, see obligations_exp]
		returns a list of objects, each of the following form:
		{date_header:the day assigned for the following obligations
		date_obligations:a list of preparation objects grouped sharing this date}
	obligation_checked
		returns whether or not the current obligation object is marked as completed.
	obligation_disabled
		returns a string, either "disabled" or "", indicating whether the current obligation
		can be updated. it cannot be updated if 1)the client-side time now has passed the obligation's
		date_by field, or 2) the obligation permission field does not allow the patient to do so.
	
		NOTE: though the client may be malicious and attempt to cheat by rewinding time, the server
		does the final check with its own timestamp, and so this will not pass.
	obligations_exp 
		obligations but with the "experimental" preparations database.
		returns a list of objects, each of the following form:
		{date_header:the day assigned for the following obligations
		date_obligations:a list of preparation objects grouped sharing this date}
	obligation_id
		returns a string containing the Mongo assigned _id field for an obligation document.
	has_obligations
		returns a boolean indicating whether a given appointment object has attached
		obligations
	updated_obligation_class
*/
Template.client_appointment_detail_obligation_tab.helpers({
	title : function(){
		return this.date + " " + this.proc_type;
	},
	obligations : function(){	
		var unique_date_list = unique_date(this.preparation);
		var insert_date_list = insert_by_date(unique_date_list, this.preparation);
		return insert_date_list;
	},
	obligation_checked : function(){
		if(this.completed){
			return "checked";
		}
		else{
			return "";
		}
	},
	obligation_disabled : function(){
		var current_time = new Date();
		if((current_time > this.date_by) || (this.permission !== "both" && this.permission !== "patient")){
			return "disabled";
		}
		else{
			return "";
		}
	},
	obligations_exp : function(){
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
		var appointment_id = Session.get("client.tab.appointment_object")._id;
		var appointment_group = preparations.find({"appointment_id":appointment_id}).fetch();
		var unique_date_list = unique_date(appointment_group);
		var insert_date_list = insert_by_date(unique_date_list, appointment_group); 
		return insert_date_list;
	},
	obligation_id : function(){
		return this._id;
	},
	has_obligations : function(){
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
		var aid = Session.get("client.tab.appointment_object")._id;
		return (preparations.find({appointment_id:aid}).fetch().length) !== 0;
	},
	updated_obligation_class : function(){
		if(this.completed !== this.previous_completed){
			return "updated_obligation";
		}
		else{
			return "";
		}
	}
});

/*
	
*/
Template.client_appointment_detail_obligation_tab.events({
	'click .medical_information' : function(e, tmp_inst){
		e.preventDefault();
		var medical_info_record = medicalInfo.findOne({proc_type:Session.get("client.tab.appointment_object").proc_type});
		
		if(medical_info_record !== null){
			IonModal.open("information_modal", medical_info_record);
		}
		else{
				IonPopup.show({
				title: 'Error',
				template : "Sorry! Medical procedure information could not be loaded!",
				buttons : [{
					text: 'Ok',
					type: 'button-positive',
					onTap: function(){
						IonPopup.close();
					}
				}]
			});
		}
	},

	'click .update_preparation' : function(e, tmp_inst){
		//only get the ones that are not disabled!
		var all_checkboxes = tmp_inst.$(".obligation_checkbox:not([disabled])");
		if(all_checkboxes.length > 0){
			var id_and_checked_list = [];

			all_checkboxes.each(function(i, v){
				id_and_checked_list.push({_id:$(v).attr("obligation_id"), checked:$(v).prop("checked")});
			});
			
			Meteor.call("update_obligations", id_and_checked_list, Session.get("client.tab.appointment_object")._id, function(error, result){
				if(error){
					IonPopup.show({
						title: 'Update Status',
						template : "A database error occurred. Please try again.",
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
					if(result.success){
						IonPopup.show({
								title: 'Update Status',
								template : "Your checklist was updated successfully.",
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
						//must differentiate between attempted retroactive update or update failure!
						if(result.outdated.length === 0){
							IonPopup.show({
								title: 'Update Status',
								template : "A database error occurred. Please try again.",
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
							IonPopup.show({
								title: 'Update Status',
								template : "Retroactive obligation updates are not allowed!",
								buttons : [{
									text: 'Ok',
									type: 'button-positive',
								onTap: function(){
									IonPopup.close();
								}
								}]
							});
						}
					}
				}
			});
		}
		else{
			IonPopup.show({
				title: 'Update Status',
				template : "You have no preparations to update",
				buttons : [{
					text: 'Ok',
					type: 'button-positive',
					onTap: function(){
						IonPopup.close();
					}
				}]
			});
		}

	}
	
});

Template.client_appointment_detail_obligation_tab.onCreated(
	function(){
		alert("ALIVE!");
		var appointment = Session.get("client.tab.appointment_object");
		var message_list = messages.find({'appointment_id':appointment._id}, {sort:{date:1}});
		var ignore = true;
		var message_handler = message_list.observeChanges({
					added : function(id, u){
						if(!ignore){
							alert("new message!");
						}
					}
		});
		ignore = false;
		console.log("Y");
		console.log(message_handler);
		Session.set("client.message_handler", message_handler.stop);
	}
);