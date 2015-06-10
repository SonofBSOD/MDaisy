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
				phone_number : "555-666-7777"},
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

		//insert a fake appointment associated with
		//testpatient;
		var test_record = Meteor.users.findOne({'emails.address':'testpatient@fake.com'});
		var appointment_id = appointments.insert({
			user_id : test_record._id,
			proc_type : "Lobotomy",
			date : "5/31/2015, 12:00 PM",
			location : "1300 York Ave, New York, NY 10065",
			organization : "Weill Cornell Medical College",
			department : "Radiology",
			ordering_physician : doctor_id,
			reason : "Lobotomy is cool, so you're the lab rat.",
			last_checked : (new Date()),
			updated_by_client : true
		});

		//along with fake sample information
		medicalInfo.insert({
			proc_type:"Lobotomy", 
			text:   "Lobotomy consists of cutting or scraping away most of the connections to and from the prefrontal cortex, the anterior part of the frontal lobes of the brain."
		});

		medicalInfo.insert({
			proc_type:"MRI",
			text: "MRI is a medical imaging technique used in radiology to investigate the anatomy and physiology of the body in both health and disease."
		});

		//also insert 3 preparations 
		preparations.insert({
			appointment_id : appointment_id,
			completed:true,
			text:"drink lots of water, by 9:00AM",
			date_by:(new Date(2015, 4, 30, 9, 00)),
			last_updated:(new Date())
		});

		preparations.insert({
			appointment_id : appointment_id,
			completed:true,
			text:"stay up all night, by 11:00AM",
			date_by:(new Date(2015, 4, 29, 11, 00)),
			last_updated:(new Date())
		});

		preparations.insert({
			appointment_id : appointment_id,
			completed:false,
			text:"discover the meaning of life, by 10:00AM",
			date_by:(new Date(2015, 4, 29, 10, 30)),
			last_updated:(new Date())
		});

		//followed by an appointment with no preparation requirements
		appointments.insert({
			user_id : test_record._id,
			preparation : [],
			proc_type : "MRI",
			date : "7/4/2015, 3:00 PM",
			location : "240 E 38th St, New York, NY 10016",
			organization : "NYU Langone Medical Center",
			department : "Neurology",
			ordering_physician : doctor_id,
			reason : "Post-lobotomy checkup.",
			last_checked : (new Date()),
			updated_by_client : true
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
		var test_record = Meteor.users.findOne({'emails.address':'testpatient@fake.com'});
		//set a sample notification 3 minutes into the future
		var time_now = new Date();
		time_now.setMinutes(time_now.getMinutes() + 3);
		var test = Meteor.absoluteUrl();
		notifications.insert({
			notification_type : "appointment",
			user_id : test_record._id,
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
