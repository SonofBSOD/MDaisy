Template.staff_message_reporter.onRendered(function(){
	var user = Meteor.users.findOne({_id:this.data.to_id});
	if(user != undefined && user.user_type == "staff" && !this.data.read){
		Meteor.call("set_message_addressed_to_id_true", this.data.appointment_id, this.data.to_id, function(){});
	}
});