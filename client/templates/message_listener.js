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
							if(u.from_id != Meteor.userId()){
								alert("you have received a new message!");
								Router.go("/client_message_tab");
							}
						}
					}
		});
		ignore = false;
	});

Template.message_listener.onDestroyed(function(){
	//console.log("DEAD!");
	message_handler.stop();
});