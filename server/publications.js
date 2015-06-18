/*
	This is a custom publication to publish the additional fields added during user registration.
	Additional fields:
		-user_type
		-profile
*/
Meteor.publish("user_custom_fields", function () {
  if (this.userId) {
    return Meteor.users.find({},
                             {fields: {'user_type': 1, 'profile':1}});
  } else {
    this.ready();
  }
});

/*
	Temporary publications to allow access to all databases
*/

Meteor.publish("all_appointments", function(){
	return appointments.find({});
});

Meteor.publish("all_medical_info", function(){
	return medicalInfo.find({});
});

Meteor.publish("all_preparations", function(){
	return preparations.find({});
});

Meteor.publish("all_notifications", function(){
	return notifications.find({});
});

Meteor.publish("all_messages", function(){
	return messages.find({});
});