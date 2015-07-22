var staff_list_message_handler = undefined;

Template.staff_list_message_listener.onRendered(
	function(){
		var all_messages = messages.find({});
		var ignore = true;
		staff_list_message_handler = all_messages.observeChanges({
					added : function(id, u){
						if(!ignore){
							var knock = new Audio(KNOCK_LINK);
							knock.play();
						}
					}
		});
		ignore = false;
	});

Template.staff_list_message_listener.onDestroyed(function(){
	staff_list_message_handler.stop();
});