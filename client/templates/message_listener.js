var message_handler = undefined;

Template.message_listener.onRendered(
	function(){
		//console.log("ALIVE!");
		var appointment = Session.get("client.tab.appointment_object");
		var message_list = messages.find({'appointment_id':appointment._id}, {sort:{date:1}});
		var ignore = true;
		message_handler = message_list.observeChanges({
					added : function(id, u){
						if(!ignore){
							//alert("new message!");
						}
					}
		});
		ignore = false;
	});

Template.message_listener.onDestroyed(function(){
	//console.log("DEAD!");
	message_handler.stop();
});