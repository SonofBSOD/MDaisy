Template.staff_control_button.events({
	"click .change_appointment_button" : function(){
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