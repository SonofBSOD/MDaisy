var background_handler = undefined;

Template.on_ready_player.onRendered(function(){
	var appointment = Session.get("client.tab.appointment_object");
	var appointment_info = appointments.find({_id:appointment._id});
	var ignore = true;
	background_handler = appointment_info.observeChanges({
			changed : function(id, fields){
				if(!ignore){
					//alert("new message!");
					if(fields.exam_ready != undefined && fields.exam_ready){
						var ding = new Audio(DING_LINK);
						ding.play();
					}
				}
			}
	});
	ignore = false;
});

Template.on_ready_player.onDestroyed(function(){
	background_handler.stop();
});