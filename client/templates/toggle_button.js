Template.toggle_button.events({
	"click .patient_switch" : function(e){
		e.preventDefault();
		Meteor.logout();
		/*Meteor.loginWithPassword("testpatient@fake.com", "testpatient", function(error){
			if(error){
				alert("login failed!");
			}
			else{
				Router.go("/landing");
			}
		});*/
		Meteor.loginWithPassword("gh@fake.com", "teststaff", function(error){
			if(error){
				alert("login failed!");
			}
			else{
				Router.go("/staff_control_list");
			}
		});
	},
	"click .staff_switch" : function(e){
		//e.preventDefault();
		Meteor.logout();
		Meteor.loginWithPassword("gh@fake.com", "teststaff", function(error){
			if(error){
				alert("login failed!");
			}
			else{
				Router.go("/landing");
			}
		});
	}

});