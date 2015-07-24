Template.control_modal.events({
	"click #patient_switch" : function(e){
		e.preventDefault();
		//Meteor.logout();
		Meteor.loginWithPassword("demo", "demo", function(error){
			if(error){
				alert("login failed!");
			}
			else{
				IonModal.close();
				Router.go("/staff_control_list");
			}
		});
	},
	"click #staff_switch" : function(e){
		e.preventDefault();
		//Meteor.logout();
		Meteor.loginWithPassword("demo", "demo", function(error){
			if(error){
				alert("login failed!");
			}
			else{
				IonModal.close();
				Router.go("/staff_list");
			}
		});
	},
	"click #change_appointment_button" : function(e){
		IonPopup.show({
				title: 'Staff Change',
				templateName : "staff_control_simple_login",
				buttons : [
					{
						text:'Sign In',
						type:'button-positive',
						onTap:function(){
							var username = $("#username").val();
							var password = $("#password").val();
							
							Meteor.loginWithPassword(
								username,
								password,
								function(error){
									if(error){
										$("#status_bar").text("Login forbidden");
									}
									else{
										IonPopup.close();
										IonModal.close();
										Router.go("/staff_control_list");
									}
							
								}
							);
						}
					},
					{
						text: 'Close',
						type: 'button-positive',
						onTap: function(){
							IonPopup.close();
						}
					}
				]
		});
	}
	
});