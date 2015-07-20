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

function get_appointment_object(){
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
	appointment_reason : function(){
		var appointment_object = get_appointment_object();
		if(appointment_object != undefined){
			return appointment_object.reason;
		}
	},
	appointment_date : function(){
        var appointment_object = get_appointment_object();
        if(appointment_object != undefined){
            return appointment_object.date.replace(/\//g, "-");
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
		 var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
