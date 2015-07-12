/*
	this file contains raix:push callback event handlers.
	note because the framework _technically_ has the same hooks for 
	browser users
*/

Meteor.startup(function(){
	Push.debug = true;
});


//this callback handles the case where the user is currently using the app
//when the message arrives
Push.addListener("alert", function(notification){
	IonPopup.show({
		title: 'Notification received!',
		template : notification.message,
		buttons : [{
			text: 'Ok',
			type: 'button-positive',
			onTap: function(){
				IonPopup.close();
			}
		}]
	});
});


