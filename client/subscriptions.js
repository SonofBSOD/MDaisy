/*
	These subscriptions allow sharing more/custom user fields, and until
	exact database layout is known, simulates what we had before with autopublish.
*/

Meteor.subscribe("user_custom_fields");
Meteor.subscribe("all_appointments");
Meteor.subscribe("all_medical_info");
Meteor.subscribe("all_preparations");
Meteor.subscribe("all_notifications");
Meteor.subscribe("all_messages");