var SITE_LINK = "http://mdaisydist3.meteor.com/";
var BEEP_LINK = SITE_LINK + "/beep.mp3";

/*
	this file contains raix:push callback event handlers.
	note because the framework _technically_ has the same hooks for 
	browser users
*/

Meteor.startup(function(){
	Push.debug = true;
});

/*function getMediaUrl(sound) {

    

	return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/' + sound.substr(1);



}

function playSound(sound) {

    return new Media(

		     getMediaUrl(sound),

		     function (success) {
			 // success
		     },
		     function (err) {
			 // error
		     }
		     );
}
*/

var getLocalPath = function (localPath) {
    return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/' + localPath.substr(1);
};



//this callback handles the case where the user is currently using the app
//when the message arrives
Push.addListener("alert", function(notification){
	
	var beep_music = new Audio(BEEP_LINK);
	beep_music.play();
	if($(".popup").length != 0){
	    return;
	}

	IonPopup.show({
		title: 'Exam Status',
		    template : notification.message,
		buttons : [{
			text: 'Ok',
			type: 'button-positive',
			onTap: function(){
			    IonPopup.close();
				Router.go("/client_status_tab");
			}
		}]
		});
       
});


