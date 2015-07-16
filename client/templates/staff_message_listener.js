var staff_message_handler = undefined;

Template.staff_message_listener.onRendered(
	function(){
		console.log("ALIVE!");
		var appointment = Session.get("staff.tab.appointment_object");
		var message_list = messages.find({'appointment_id':appointment._id}, {sort:{date:1}});
		var ignore = true;
		staff_message_handler = message_list.observeChanges({
					added : function(id, u){
						if(!ignore){
							alert("new message!");
						}
					}
		});
		ignore = false;
	});

Template.staff_message_listener.onDestroyed(function(){
	console.log("DEAD!");
	staff_message_handler.stop();
});