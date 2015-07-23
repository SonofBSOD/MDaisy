var staff_message_handler = undefined;

Template.staff_message_listener.onRendered(
	function(){
		//console.log("ALIVE!");
		var appointment = Session.get("staff.tab.appointment_object");
		var message_list = messages.find({'appointment_id':appointment._id}, {sort:{date:1}});
		var ignore = true;
		staff_message_handler = message_list.observeChanges({
					added : function(id, u){
						if(!ignore){
							//alert("new message!");
							if(u.from_id != Meteor.userId()){
								var drip = Router.current().route.getName() == "staff_message_tab" ? new Audio(DRIP_LINK) : new Audio(KNOCK_LINK);
								drip.onplaying = function ()
								{
									if(Router.current().route.getName() != "staff_message_tab"){
										alert("Message: you have received a new message!");
										Router.go("/staff_message_tab");
									}
									
								};
								drip.play();
								
								/*var drip = new Audio(DRIP_LINK);
								drip.onplay = function(){alert("you have received a new message!");
									Router.go("/staff_message_tab");};
								drip.play();*/
							}
						}
					}
		});
		ignore = false;
	});

Template.staff_message_listener.onDestroyed(function(){
	//console.log("DEAD!");
	staff_message_handler.stop();
});
