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
		Accounts.createUser({
			email:"testpatient@fake.com",
			password:"testpatient",
			profile :{
				name: "Bob Jones",
				phone_number : "555-666-7777",
				dob:new Date("12 Jun 1990"),
				mrn:"16182369",
				gender:"male"},
			user_type:"patient"
		});

		Accounts.createUser({
			email:"ella.amaryllis@fake.com",
			password:"testpatient",
			profile :{
				name: "Ella Amaryllis",
				phone_number : "555-111-2222",
				dob:new Date("1 Aug 2000"),
				mrn:"12983102",
				gender:"female"},
			user_type:"patient"
		});
		
		Accounts.createUser({
			email:"davor.fionnbarra@fake.com",
			password:"testpatient",
			profile :{
				name: "Davor Fionnbarra",
				phone_number : "555-222-3333",
				dob:new Date("3 Feb 1986"),
				mrn:"36193716",
				gender:"male"},
			user_type:"patient"
		});
		
		Accounts.createUser({
			email:"thamar.goran@fake.com",
			password:"testpatient",
			profile :{
				name: "Thamar Goran",
				phone_number : "555-777-8888",
				dob:new Date("27 Jan 1970"),
				mrn:"81730183",
				gender:"male"},
			user_type:"patient"
		});
		
		
		Accounts.createUser({
			email:"gh@fake.com",
			password:"teststaff",
			profile : {
				name: "Gregory House",
				phone_number : "555-888-9999"}, 
			user_type: "staff"
		});

		//get Dr. House's id
		var doctor_id = Meteor.users.findOne({'emails.address':'gh@fake.com'})._id;

		//Medical procedure sample information-------------------------------------------------------------------
		medicalInfo.insert({
			proc_type:"Ultrasound", 
			text: "Ultrasonic devices are used to detect objects and measure distances. Ultrasound imaging or sonography is often in medicine."
		});

		medicalInfo.insert({
			proc_type:"MRI",
			text: "MRI is a medical imaging technique used in radiology to investigate the anatomy and physiology of the body in both health and disease."
		});

		medicalInfo.insert({
			proc_type:"Barium Enema", 
			text:   "Barium enema is a special x-ray of the large intestine, which includes the colon and rectum."
		});

		//sample_CT_data is defined in both/sample_data_strings.js
		medicalInfo.insert({
			proc_type:"CT", 
			text: sample_CT_data
		});
		
		
		//sample Lobotomy data insertion---------------------------------------------------------------
		var fake_user_object = Meteor.users.findOne({'emails.address':'testpatient@fake.com'});
		var ella_object = Meteor.users.findOne({'emails.address':'ella.amaryllis@fake.com'});
		var davor_object = Meteor.users.findOne({'emails.address':'davor.fionnbarra@fake.com'});
		var thamar_object = Meteor.users.findOne({'emails.address':'thamar.goran@fake.com'});
		var ultrasound_appointment_id = appointments.insert({
			user_id : ella_object._id,
			user_name : "Ella Amaryllis",
			user_dob: (new Date("1 Aug 2000")).toLocaleDateString(),
			user_mrn: "12983102",
			proc_type : "Ultrasound",
			date : "5/31/2017, 12:00 PM",
			location : "2315 Broadway 4th Floor, New York, NY 10024",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Pregnancy, with pelvic pain",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});

		preparations.insert({
			appointment_id : ultrasound_appointment_id,
			completed:true,
			text:"drink lots of water, by 9:00AM",
			date_by:(new Date("30 May 2017 9:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});

		preparations.insert({
			appointment_id : ultrasound_appointment_id,
			completed:true,
			text:"stay up all night, by 11:00AM",
			date_by:(new Date("29 May 2017 11:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});

		preparations.insert({
			appointment_id : ultrasound_appointment_id,
			completed:false,
			text:"discover the meaning of life, by 10:00AM",
			date_by:(new Date("29 May 2017 10:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});

		preparations.insert({
			appointment_id : ultrasound_appointment_id,
			completed:false,
			text:"only eat tofu, by 8:30AM",
			date_by:(new Date("29 May 2017 8:30:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});
		
		preparations.insert({
			appointment_id : ultrasound_appointment_id,
			completed:false,
			text:"Ready for exam",
			date_by:(new Date("31 May 2017 0:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:true,
			notify_options:{from:"Radiology Staff", title:"Note", text:"Hi! You are ready for your exam!"},
			permission:"staff"
		});

		//sample MRI data insertion---------------------------------------------------------------
		var mri_appointment_id = appointments.insert({
			user_id : fake_user_object._id,
			user_name : "Bob Jones",
			user_dob: (new Date("12 Jun 1990")).toLocaleDateString(),
			user_mrn: "16182369",
			preparation : [],
			proc_type : "CT",
			date : "7/4/2016, 3:00 PM",
			location : "520 East 70th Street, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Status post tumor resection",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});
		
		preparations.insert({
			appointment_id : mri_appointment_id,
			completed:false,
			text:"Ready for exam",
			date_by:(new Date("4 July 2016 15:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:true,
			notify_options:{"from":"Radiology Staff", title:"Note", text:"Hi! You are ready for your exam!"},
			permission:"staff"
		});

		//sample Barium Enema data insertion--------------------------------------------------------
		var barium_appointment_id = appointments.insert({
			user_id : thamar_object._id,
			user_name : "Thamar Goran",
			user_dob: (new Date("27 Jan 1970")).toLocaleDateString(),
			user_mrn: "81730183",
			proc_type : "MRI",
			date : "6/12/2016, 2:00 PM",
			location : "1305 York Avenue, 3rd Floor, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Crohn's disease",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});

		preparations.insert({
			appointment_id : barium_appointment_id,
			completed:false,
			text:"Bowel preparation, start by 6/12 1:00AM",
			date_by:(new Date("12 Jun 2016 13:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});

		preparations.insert({
			appointment_id : barium_appointment_id,
			completed:false,
			text:"NPO, start by 6/12 12:00AM",
			date_by:(new Date("12 Jun 2016 00:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});

		preparations.insert({
			appointment_id : barium_appointment_id,
			completed:false,
			text:"Ready for exam",
			date_by:(new Date("12 Jun 2016 14:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:true,
			notify_options:{from:"Radiology Staff", title:"Note", text:"Hi! You are ready for your exam!"},
			permission:"staff"
		});
		
		//sample Abdomen CT data insertion--------------------------------------------------------
		var ct_appointment_id = appointments.insert({
			user_id : davor_object._id,
			user_name : "Davor Fionnbarra",
			user_dob: (new Date("3 Feb 1986")).toLocaleDateString(),
			user_mrn: "36193716",
			proc_type : "MRI",
			date : "6/12/2016, 2:00 PM",
			location : "1305 York Avenue, 3rd Floor, New York, NY 10065",
			organization : "Weill Cornell Imaging at NewYork-Presbyterian",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Right ankle pain",
			last_checked : (new Date()),
			updated_by_client : true,
			exam_ready : false
		});

		preparations.insert({
			appointment_id : ct_appointment_id,
			completed:false,
			text:"NPO, start by 6/12 10:00AM",
			date_by:(new Date("12 Jun 2016 10:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:false,
			notify_options:{},
			permission:"both"
		});
		
		preparations.insert({
			appointment_id : ct_appointment_id,
			completed:false,
			text:"Ready for exam",
			date_by:(new Date("12 Jun 2016 14:00:00 EDT")),
			last_updated:(new Date()),
			previous_completed:undefined,
			notify_on_complete:true,
			notify_options:{from:"Radiology Staff", title:"Note", text:"Hi! You are ready for your exam!"},
			permission:"staff"
		});

		//sample message insertion--------------------------------------------------                     
                messages.insert({
                        text: "Hi Dr.House. I wanted to know whether a barium enema is safe?",
			    to_id: doctor_id,
			    from_id: thamar_object._id,
			    date: (new Date("10 Jun 2015 8:00:00 EDT")),
			    appointment_id: barium_appointment_id,
			    read: false
			    });

                messages.insert({
                        text: "What about eating a little bit of food? I'm feeling a little lightheaded right no\
w. Need to get my usual fix of green eggs and ham.",
			    to_id: doctor_id,
			    from_id: thamar_object._id,
			    date: (new Date("10 Jun 2015 10:00:00 EDT")),
			    appointment_id: barium_appointment_id,
			    read:false
			    });

                messages.insert({
                        text: "I'm here early. Can I meet with you and ask a couple questions before the actual \
operation?",
			    to_id: doctor_id,
			    from_id: thamar_object._id,
			    date: (new Date("10 Jun 2015 00:00:00 EDT")),
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

Meteor.startup(function() {
	startup_data();

	//register the push notification cronjob
	if(!Meteor.isCordova){
		var fake_user_object = Meteor.users.findOne({'emails.address':'testpatient@fake.com'});
		//set a sample notification 3 minutes into the future
		var time_now = new Date();
		time_now.setMinutes(time_now.getMinutes() + 3);
		var test = Meteor.absoluteUrl();
		notifications.insert({
			notification_type : "appointment",
			user_id : fake_user_object._id,
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
