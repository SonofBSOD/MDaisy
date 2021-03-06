var session_object_name = undefined;

/*
	The control modal must ensure that only one of (client|staff).tab.appointment_object
	is defined. This allows reusing the same card template over both staff and patient views.
*/
/*Template.common_info_card.onRendered(function(){
	if(Session.get("client.tab.appointment_object") == undefined){
		session_object_name = "staff.tab.appointment_object";
	}
	else{
		session_object_name = "client.tab.appointment_object";
	}
});*/

function get_appointment_object_reactive(){
	if(Meteor.user() != null){
		var user_type = Meteor.user().user_type;
		switch(user_type){
			case "staff":
				return Session.get("staff.tab.appointment_object");
				break;
			case "patient":
				return Session.get("client.tab.appointment_object");
				break;
			default:
				return {};
				break;
		}
	}
	
	return undefined;
}

function get_appointment_object(){
	return Tracker.nonreactive(get_appointment_object_reactive);
}

Template.common_info_card.onRendered(function () {
	//$("#bcTarget").barcode("1234567890128", "ean13");  
	//$("#bcTarget").barcode("1234567890128", "ean13",{barWidth:1, barHeight:60});
	$("#bcTarget").barcode("1234567", "int25",{barWidth:2, barHeight:90});
});

Template.common_info_card.helpers({
	appointment_image_name : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var proc_type = appointment_object.proc_type;
			switch(proc_type){
				case "Ultrasound":
					return "radiology_US.png";
					break;
				case "MRI":
					return "radiology_MR.png";
					break;
				case "CT":
					return "radiology_CT.png";
					break;
				default:
					return "undefined.png";
					break;
			}
		}
	},
	appointment_type : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			return appointment_object.proc_type;
		}
	},
	appointment_accession : function(){
        var appointment_object = get_appointment_object();
        if(appointment_object != undefined){
            // $("#bcTarget").barcode(appointment_object.accession, "int25",{barWidth:2, barHeight:90});
            return appointment_object.accession;
        }
    },
    appointment_accession_barcode : function(){
        var appointment_object = get_appointment_object();
        if(appointment_object != undefined){
            $("#bcTarget").barcode(appointment_object.accession, "int25",{barWidth:2, barHeight:90}); 
        }
    },
	appointment_reason : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			return appointment_object.reason;
		}
	},
	appointment_date : function(){
        var appointment_object = get_appointment_object();
        if(appointment_object != undefined){
            return appointment_object.date.toLocaleDateString().replace(/\//g, "-");
        }
    },
    exam_ready : function(){
        var appointment_object = get_appointment_object();
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
            }
        }
    },
	patient_gender : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user_object != undefined){
			        if (user_object.profile.gender == 'female') {
			            return 'F';
			        } else {
			            return 'M';
			        }
				
			}
			else{
				console.log("common_info_card: could not fetch user associated with this appointment");
			}
		}
	},
	patient_age : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user_object != undefined){
				var diff = Date.now() - user_object.profile.dob.getTime();
				var yrs = Math.abs((new Date(diff)).getUTCFullYear() - 1970);
				return yrs + "";
				// return yrs + " yrs";
			}
			else{
				console.log("common_info_card: could not fetch user associated with this appointment");
			}
		}
	},
	patient_name : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user_object != undefined){
				return user_object.profile.name;
			}
			else{
				console.log("common_info_card: could not fetch user associated with this appointment");
			}
		}
	},
	patient_dob : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user_object != undefined){
				return user_object.profile.dob.toLocaleDateString().replace(/\//g, "-");
			}
			else{
				console.log("common_info_card: could not fetch user associated with this appointment");
			}
		}
	},
	patient_mrn_barcode : function(){
        var appointment_object = get_appointment_object();
        if(appointment_object != undefined){
            var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
            if(user_object != undefined){
                $("#bcTarget").barcode(user_object.profile.mrn, "int25",{barWidth:2, barHeight:90});
            }
            else{
                console.log("common_info_card: could not fetch user associated with this appointment");
            }
        }
    },
	patient_mrn : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			var user_object = Meteor.users.findOne({_id:appointment_object.user_id});
			if(user_object != undefined){
				return user_object.profile.mrn;
			}
			else{
				console.log("common_info_card: could not fetch user associated with this appointment");
			}
		}
	}
	
});
