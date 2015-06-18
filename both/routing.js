/*
	Routes/templates associated with each "screen" of the app
	are listed below.

	NOTE: route configurations about what to show after logging in
	and logging out are listed instead in at_config.js, because
	they rely on AccountsTemplates configuration.
*/

Router.configure({
	layoutTemplate : "layout"
});

/*
	The /landing route is used purely to redirect the user to either
	the patient /list page, or the staff /staff_list page, depending
	on their credentials.
*/
Router.route('/landing', {
	onBeforeAction : function(){
		var user_type = Meteor.user().user_type;
		if(user_type === "staff"){
			Router.go("/staff_list");
		}
		else{
			Router.go("/list");
		}
	}
});

Router.route('/list', function(){
	this.render('appointmentList');
});

/*
	The /detail route is the link for the details page for one particular
	appointment. It requires the unique DB id for that appointment, and 
	sets the data context of the appointment_detail template to precisely
	that appointment object.
*/
Router.route('/detail/:appointment_id', 
		function(){
			this.render('appointmentDetail');
		}, 
		{
			name:'detail',
			data: function(){
				return appointments.findOne({_id:this.params.appointment_id});
			}
		}
);

Router.route('/staff_list', function(){
	this.render("staff_appointment_list");
	}, {
	name:"staff_list"
});

Router.route('/staff_obligation_tab', 
	function(){
		this.render("staff_appointment_detail_obligation_tab");
	}, {
		name:'staff_obligation_tab',
});

Router.route('/staff_message_tab', 
	function(){
		this.render("staff_appointment_detail_message_tab");
	}, {
		name:'staff_message_tab',
});