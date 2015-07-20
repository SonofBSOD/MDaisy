var exam_ready_checkbox = undefined;

/*
	the idea Session.get("staff_appointment_detail_status.hide_var");
	is that is that we don't display appointment data on delete
	so we first hide and then try to delete
	if success, we set it back to undefined on redirect
	if fail, we unhide!
*/
Template.staff_appointment_detail_status_tab.helpers({
	appointment_patient_name : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			var user = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user != null){
				return user.profile.name;
			}
			else{
				alert("Error! Could not fetch user associated with this appointment!");
			}
		}
	},
	appointment_patient_mrn : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			var user = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user != null){
				return user.profile.mrn;
			}
			else{
				alert("Error! Could not fetch user associated with this appointment!");
			}
		}
	},
	appointment_date : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.date;
		}
	},
	appointment_department : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.department;
		}
	},
	appointment_reason : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.reason;
		}
	},
	appointment_type : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			return appointment_object.proc_type;
		}
	},
	exam_ready : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			//fetch this from the database; we want reactive updates for this.
			var db_appointment_object = appointments.findOne({_id:appointment_object._id});
			if(db_appointment_object != null){
				return db_appointment_object.exam_ready; 
			}
			else{
				alert("Error! Could not find appointment object!");
				return false;
			}
		}
	},
	exam_checked : function(){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			//fetch this from the database; we want reactive updates for this.
			var db_appointment_object = appointments.findOne({_id:appointment_object._id});
			if(db_appointment_object != null){
				if(db_appointment_object.exam_ready){
					return "checked";
				}
				else{
					return "";
				}
			}
			else{
				alert("Error! Could not find appointment object!");
			}
		}
	},
	no_delete_hide : function(){
		var hide_value = Session.get("staff_appointment_detail_status.hide_var");
		if(hide_value == undefined){
			return true;
		}
		else{
			return hide_value;
		}
	}
});

Template.staff_appointment_detail_status_tab.events({
	"click #exam_status_update" : function(e, tmp_inst){
		var appointment_object = Session.get("staff.tab.appointment_object");
		if(appointment_object == undefined){
			alert("Error! Could not load session appointment object!");
		}
		else{
			var exam_checkbox = tmp_inst.$("#exam_checkbox");
			Meteor.call("staff_set_and_notify_appointment_exam_status", appointment_object._id, Meteor.userId(),  $(exam_checkbox).prop("checked"),
				function(err, res){
					if(err){
						alert("Error! Database error occurred on update!");
					}
					else{
						if(res.success){
							if(res.notification_sent){
								IonPopup.show({
									title: 'EXAM READY',
									template : "Push notification sent to patient.",
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
									title: 'EXAM NOT READY',
									template : "Status reset.",
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
						else{
							IonPopup.show({
									title: 'Update Failure',
									template : "A database error occurred on update.",
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
		}
	},
	"click #delete_appointment" : function(){
		IonPopup.show({
				title: 'Confirm Delete',
				template : "Do you really want to delete this appointment?",
				buttons : [{
					text: 'Yes',
					type: 'button-positive',
					onTap: function(){
						Session.set("staff_appointment_detail_status.hide_var", false);
						var appointment_object = Session.get("staff.tab.appointment_object");
						if(appointment_object == undefined){
							alert("Error! Could not load session appointment object!");
						}
						else{
						Meteor.call("staff_delete_appointment", appointment_object._id, Meteor.userId(),
						function(err, res){
							if(err){
								alert("Error! Database error occurred on update!");
							}
							else{
								if(res){
									//alert("success!");
									//VERY important: reset the hiding state for future appointments!
									Session.set("staff_appointment_detail_status.hide_var", undefined);
									IonPopup.close();
									Router.go("/staff_list");
								}
								else{
									//alert("fail!");
							}
							}
						});
						}
					}
				},
					{
						text:'No',
						type:'button-positive',
						onTap: function(){
							IonPopup.close();
						}
					}
				]}
			);
		
	}
});