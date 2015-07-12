/*
	obligation_tab_link
		provides a route of form "/staff_obligation_tab/:appointment_id"
	message_tab_link
		provides a route of form "/staff_message_tab/:ordering_physician",
		
*/
Template.staff_tab_bar.helpers({
	obligation_tab_data : function(){
		return {appointment_id:"dummyaptid"};
	},
	message_tab_data : function(){
		return {appointment_id:"dummy_apt_id", staff_id:"dummy_staff_id"}; 
	}
});

/*
	set the ionTab.current and the clicked tab's path attribute to the same value;
	this will force the highlight that we want.
*/
Template.staff_tab_bar.events({
	"click .tab_workaround" : function(e){
		var this_tab = e.currentTarget;
		/*var new_value = "";

		if(Session.get("ionTab.current") === undefined){
			new_value = "first";
		}
		else{
			var current_value = Session.get("ionTab.current");
			if(current_value === "first"){
				new_value = "second";
			}
			else{
				new_value = "first";
			}
		}*/

		//so new_value is either initialized as "first", or inverted between first and second
		Session.set("ionTab.current", this.path);
		//this.path = new_value;
		alert("class: " + this.path);
	}
});