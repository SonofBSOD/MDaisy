(function(){/*
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
			user_type:"patient"
		});

		Accounts.createUser({
			email:"teststaff@fake.com",
			password:"teststaff",
			user_type:"staff"
		});

		//insert a fake appointment associated with
		//testpatient;
		var test_record = Meteor.users.findOne({'emails.address':'testpatient@fake.com'});
		var appointment_id = appointments.insert({
			user_id : test_record._id,
			preparation : [{
								completed:true,
								text:"drink lots of water",
								date_by:(new Date(2015, 4, 30, 9, 00))
							}, 
							{
								completed:true,
								text:"stay up all night",
								date_by:(new Date(2015, 4, 29, 11, 00))
							}, 
							{
								completed:false,
								text:"discover the meaning of life",
								date_by:(new Date(2015, 4, 29, 10, 30))
							}],
			proc_type : "Lobotomy",
			date : "5/31/2015, 12:00 PM"
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
			date_by:(new Date(2015, 4, 30, 9, 00))
		});

		preparations.insert({
			appointment_id : appointment_id,
			completed:true,
			text:"stay up all night, by 11:00AM",
			date_by:(new Date(2015, 4, 29, 11, 00))
		});

		preparations.insert({
			appointment_id : appointment_id,
			completed:false,
			text:"discover the meaning of life, by 10:00AM",
			date_by:(new Date(2015, 4, 29, 10, 30))
		});

		//followed by an appointment with no preparation requirements
		appointments.insert({
			user_id : test_record._id,
			preparation : [],
			proc_type : "MRI",
			date : "7/4/2015, 3:00 PM"
		});
	}
}

Meteor.startup(function() {
	startup_data();
});

})();
