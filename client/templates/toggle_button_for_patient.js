Template.toggle_button_for_patient.events({
	"click #staff_view_with_passcode" : function(e){
		IonPopup.show({
			title: 'ENTER PASSCODE',
			templateName : "staff_passcode_enter",
			buttons : [
				{
					text:'Sign In',
					type:'button-positive',
					onTap:function(){
						var passcode = $("#passcode").val();

						if (Meteor.user().profile.in_app_passcode == passcode) {
							IonPopup.close();
							//IonModal.close();
							//Router.go("/control_modal");
							IonModal.open("control_modal");
						} else {
							$("#status_bar").text("Login forbidden");
							console.log(Meteor.user().profile.name + " attempted login to staff view");
						}
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