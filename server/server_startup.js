/*
	This file contains startup code to initialize 
	Meteor.user() with temporary test data.
*/

function startup_data(){
	//just insert two accounts,
	//patient:
	//	testpatient@fake.com
	//	testpatient
	//staff:
	//	teststaff@fake.com
	//	teststaff
	if(Meteor.users.find().count() == 0){
		
		var hl7_listener_user_id = Accounts.createUser({
			email:"123456",
			username:"123456",
			password:"123456",
			profile: {
				name: "HL7 Listener Application",
				in_app_passcode:"12345"
			},
			user_type:"patient"
		});
		// Roles.addUsersToRoles(hl7_listener_user_id, ['manage-users']);

		var fake_staff_id = Accounts.createUser({
			email:"demo",
			password:"demo",
			profile : {
				name: "John Doe",
				in_app_passcode:"12345"
			},
			user_type:"staff"
		});
		// Roles.addUsersToRoles(fake_staff_id, ['staff']);

		var fake_patient_id = Accounts.createUser({
			email:"patient",
			password:"testpatient",
			profile : {
				name: "Ella Amaryllis",
				dob:new Date("3 Feb 1986"),
				mrn: "161823691",
				gender: "female",
				in_app_passcode:"12345"
			},
			user_type:"patient"
		});
		// Roles.addUsersToRoles(fake_patient_id, ['patient']);


		//get Dr. House's id
		var doctor_id = Meteor.users.findOne({'emails.address':'demo'})._id;

		//Medical procedure sample information-------------------------------------------------------------------
		medicalInfo.insert({
			proc_type:"Ultrasound", 
			text: sample_US_data,
			youtube_src: "//www.youtube.com/embed/xZ1hcEQl7ks"
		});

		medicalInfo.insert({
			proc_type:"MRI",
			text: sample_MRI_data,
			youtube_src: "//www.youtube.com/embed/LaAjrPbahBA"
		});


		//sample_CT_data is defined in both/sample_data_strings.js
		medicalInfo.insert({
			proc_type:"CT", 
			text: sample_CT_data,
			youtube_src: "//www.youtube.com/embed/BRPD-B_hpbo"
		});
		

		//sample Lobotomy data insertion---------------------------------------------------------------
		var patient_user_object = Meteor.users.findOne({'emails.address':'patient'});
		var ultrasound_appointment_id = appointments.insert({
			user_id : patient_user_object._id,
			user_name : "Ella Amaryllis",
			user_dob: new Date("1 Aug 1990"),
			user_mrn: "12983102",
			user_gender: "female",
			proc_type : "Ultrasound",
			accession: "5674567",
			date : new Date("31 May 2017 12:00:00 EDT"),//"5/31/2017, 12:00 PM",
			location : "2315 Broadway 4th Floor, New York, NY 10024",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Pregnancy, with pelvic pain",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});
		

		//sample Starr 0, CT data insertion---------------------------------------------------------------
		var mri_appointment_id = appointments.insert({
			user_id : patient_user_object._id,
			user_name : "Bob Jones",
			user_dob: new Date("12 Jun 1990"),
			user_mrn: "16182369",
			user_gender: "male",
			proc_type : "CT",
			accession: "5671234",
			date : new Date("4 July 2016 3:00:00 EDT"),//"7/4/2016, 3:00 PM",
			location : "520 East 70th Street, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Status post tumor resection",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});
		


		//sample York, MRI data insertion--------------------------------------------------------
		var barium_appointment_id = appointments.insert({
			user_id : patient_user_object._id,
			user_name : "Thamar Goran",
			user_dob: new Date("27 Jan 1970"),
			user_mrn: "81730183",
			user_gender: "male",
			proc_type : "MRI",
			accession: "5672345",
			date : new Date("12 June 2016 2:00:00 EDT"),//"6/12/2016, 2:00 PM",
			location : "1305 York Avenue, 3rd Floor, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Crohn's disease",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});

		
		//sample York MRI #2 data insertion--------------------------------------------------------
		var ct_appointment_id = appointments.insert({
			user_id : patient_user_object._id,
			user_name : "Davor Fionnbarra",
			user_dob: new Date("3 Feb 1986"),
			user_mrn: "36193716",
			user_gender: "male",
			proc_type : "MRI",
			accession: "5673456",
			date : new Date("6 Jun 2016 2:00:00 EDT"),//"6/12/2016, 2:00 PM",
			location : "1305 York Avenue, 3rd Floor, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Right ankle pain",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});


		//sample message insertion--------------------------------------------------                     
				messages.insert({
						text: "Hi Dr.House. I wanted to know whether a barium enema is safe?",
				to_id: doctor_id,
				from_id: patient_user_object._id,
				date: (new Date("22 Jul 2015 8:00:00 EDT")),
				appointment_id: barium_appointment_id,
				read: false
				});

				messages.insert({
						text: "What about eating a little bit of food? I'm feeling a little lightheaded right no\
w. Need to get my usual fix of green eggs and ham.",
				to_id: doctor_id,
				from_id: patient_user_object._id,
				date: (new Date("22 Jul 2015 10:00:00 EDT")),
				appointment_id: barium_appointment_id,
				read:false
				});

				messages.insert({
						text: "I'm here early. Can I meet with you and ask a couple questions before the actual \
operation?",
				to_id: doctor_id,
				from_id: patient_user_object._id,
				date: (new Date("22 Juj 2015 00:00:00 EDT")),
				appointment_id: barium_appointment_id,
				read:false
		});
		

	}
}

/*
	check the notifications
	collection every 1 minute for any overdue/deadlined notifications,
	and will send them out to their respective users.
*/
function send_notifications(){
	//first get all overdue notifications
	var start_time = new Date();
	var overdue = notifications.find({send_by : {$lt:start_time}});

	//go through each of them and send to its user's listed app ids
	overdue.forEach(function(notification){
		Push.send({from: "TEST", title: 'MDaisy Notification',text: notification.text, query: {userId:notification.user_id}});
	});

	//remove these notifications
	overdue.forEach(function (notification){
		notifications.remove({_id:notification._id});
	});
}


function setup_hl7_listener(){

	function parse_modality_from_service(service) {
		const REGEXP_MODALITY_MAP = {
			'\\b(MRA|MRI|MR)\\b' : 'MRI',
			'\\b(CT|CTA)\\b' : 'CT',
			'\\bUS\\b' : 'Ultrasound'
		}

		for (var regexp in REGEXP_MODALITY_MAP) {
			if (REGEXP_MODALITY_MAP.hasOwnProperty(regexp)) {
				if(service.search(new RegExp(regexp)) != -1) {
					return REGEXP_MODALITY_MAP[regexp];
				}
			}
		}
		return null;
	}

	function parse_gender(gender) {
		const GENDER_MAP = {
			'M' : 'male',
			'F' : 'female'
		};
		return GENDER_MAP[gender];
	}

	// Global API configuration
	var Api = new Restivus({
	useDefaultAuth: true,
	prettyJson: true
	});

	// Maps to: /api/hl7/appointments
	Api.addRoute('hl7/appointments', {authRequired: false}, {
		get: {
			action: function() {
				return {status: 'success', data: {message: 'appointments'}};
			}
		},
		post: {
			// roleRequired: ['manage-patients'],
			action: function () {
				const OUTPATIENT_CLASS_CODE = "O"
				const ORGANIZATION = "Weill Cornell Imaging at NewYork-Presbyterian"
				const DEPARTMENT = "Radiology"

				const RESULT_STATUS_CODE = {
					"scheduled": "S",
					"incomplete": "I",
					"cancelled": "X",
					"complete": "C"
				}

				var patient_id;

				if(this.bodyParams.patient_class != OUTPATIENT_CLASS_CODE || parse_modality_from_service(this.bodyParams.service) == null) {
					return {
						status: 'success',
						data: {message: 'Patient Class is OutPatient or unknown modality. appointment not added'}};
				}

				if (Meteor.users.findOne({'profile.mrn': this.bodyParams.patient_mrn}) === undefined) {
					patient_id = Accounts.createUser({
						email: this.bodyParams.patient_mrn,
						password: "testpatient",
						profile: {
							name: this.bodyParams.first_name + " " + this.bodyParams.last_name,
							dob: moment(this.bodyParams.patient_dob, "YYYYMMDD").toDate(),
							mrn: this.bodyParams.patient_mrn,
							gender: parse_gender(this.bodyParams.patient_gender),
							in_app_passcode:"12345"
						},
						user_type:"patient"
					})
				} else {
					patient_id = Meteor.users.findOne({'profile.mrn': this.bodyParams.patient_mrn})._id;
				}

				if(appointments.findOne({ 'accession': this.bodyParams.accession})) {
					if (this.bodyParams.result_status == RESULT_STATUS_CODE["cancelled"] || this.bodyParams.result_status == RESULT_STATUS_CODE["cancelled"]) {
						appointments.update({
							accession: this.bodyParams.accession},
							{$set: {exam_ready: true}
						});
					};
				} else {
					var location = this.bodyParams.site + ", " + this.bodyParams.point_of_care;
					appointments.insert({
						accession: this.bodyParams.accession,
						user_id:  patient_id,
						user_name: this.bodyParams.first_name + " " + this.bodyParams.last_name,
						user_dob: moment(this.bodyParams.patient_dob, "YYYYMMDD").toDate(),
						user_mrn: this.bodyParams.patient_mrn.split("-")[0],
						proc_type: parse_modality_from_service(this.bodyParams.service),
						date: moment(this.bodyParams.scheduled_time, "YYYYMMDDHHmmss").toDate(),
						location: location,
						organization: ORGANIZATION,
						department: DEPARTMENT,
						ordering_physician: Meteor.users.findOne({'emails.address':'demo'})._id,
						reason: this.bodyParams.reason,
						last_checked : (new Date()),
						updated_by_client : true,
						exam_ready : false
					});
				};

				return {status: 'success', data: {message: 'Appointment Added'}};
			}
		}
	});



}

Meteor.startup(function() {
	startup_data();
	setup_hl7_listener();

	//register the push notification cronjob
	if(!Meteor.isCordova){
		var patient_user_object = Meteor.users.findOne({'emails.address':'patient'});
		//set a sample notification 3 minutes into the future
		var time_now = new Date();
		time_now.setMinutes(time_now.getMinutes() + 3);
		var test = Meteor.absoluteUrl();
		notifications.insert({
			notification_type : "appointment",
			user_id : patient_user_object._id,
			from : "MDaisy",
			title : "MDaisy Notification",
			text : test + ": this is a test",
			send_by : time_now
		});


		SyncedCron.add({
			name:"push-notification-job",
			schedule:function(parser){
				return parser.text("every 1 minute");
			},
			job:function(){
				console.log("push notification runs!");
				send_notifications();
			}
		});

		//SyncedCron.start();
	}

});
