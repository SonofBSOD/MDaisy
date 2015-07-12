Template.contact_modal.helpers({
	name : function(){
		return this.name;
	},
	email : function() {
		var email_str = "";
		this.email.forEach(function (e){
			email_str += (e + "<br>");
		});

		return email_str;
	}
}); 

Template.contact_modal.events({
	"click .send_message" : function(e){
		e.preventDefault();
		//message_text, user_id, physician_id, message_date, related_appointment_id){
		var message_text = $("textarea#message_box").val();
		Meteor.call("send_message", message_text, Meteor.userId(), this.physician_id, (new Date()), this.appointment_id, function(err, res){
			if(err){
				alert("fail");
			}
			else{
				alert("success!");
			}
			
		} );
	}
	
});