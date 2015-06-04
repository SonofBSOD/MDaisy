
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
*/
Template.appointmentDetail.helpers({
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
	obligations_exp : function(){
		var appointment_group = preparations.find({appointment_id:this._id}).fetch();
		var unique_date_list = unique_date(appointment_group);
		var insert_date_list = insert_by_date(unique_date_list, appointment_group); 
		return insert_date_list;
	},
	obligation_id : function(){
		return this._id;
	},
	has_obligations : function(){
		return (preparations.find({appointment_id:this._id}).fetch().length) !== 0;
	}
});

/*
	contains code to handle the three buttons in the bottom of the page
	click .medical_information
		pass the medical procedure's type to the modal window
	click .update_preparation
		attempt to the push the status of the checkboxes to the preparations database,
		and prompt the user on success/failure
*/
Template.appointmentDetail.events({
	'click .medical_information' : function(){
		var medical_info_record = medicalInfo.findOne({proc_type:this.proc_type});

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
	
		var all_checkboxes = tmp_inst.$(".test_class");
		var all_update_success = true;
		var popup_text = "";

		if(all_checkboxes.length > 0){
			all_checkboxes.each(function(i, v){
				all_update_success = all_update_success && 
					(!!preparations.update({_id:$(v).attr("obligation_id")}, {$set:{completed:$(v).prop("checked")}}));
			});

			if(all_update_success){
				popup_text = "Your checklist was saved.";
			}
			else{
				popup_text = "Your checklist could not be fully updated. Please try again.";
			}
		}
		else{
			popup_text = "You have no preparations to update.";
		}

		IonPopup.show({
			title: 'Update Status',
			template : popup_text,
			buttons : [{
				text: 'Ok',
				type: 'button-positive',
				onTap: function(){
					IonPopup.close();
				}
			}]
		});

	},

	'click .contact_staff' : function(e, tmp_inst){
		//Session.set("appointment_ordering_physician", this.ordering_physician);
		var ordering_physician_record = Meteor.users.findOne({_id:this.ordering_physician});
		
		if(ordering_physician_record !== null){
			//the second argument sets the modal's data context to an object containing
			//the doctor's name and email.
			IonModal.open("contact_modal", {name:ordering_physician_record.profile.name, 
											email:ordering_physician_record.emails});
		}
		else{
			IonPopup.show({
				title: 'Error',
				template : "Sorry! Staff information could not be loaded. Please try again.",
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