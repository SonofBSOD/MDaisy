/*
	keyup .search-box:
		updates the "query" Session variable with whatever the user typed in.
		staff_appointment_list will then dynamically update with the correct result.
*/
Template.staff_search_box.events({
	"keyup .search-box" : function(e){
		var search_string = e.currentTarget.value;
		Session.set("query", search_string);
	},
	"click #proc_filter span" : function(e){
		$(e.currentTarget).toggleClass("proc_selected")
		$("#proc_filter span.proc_selected").forEach(function(proc){
			console.log(proc.text())
		})
	}

});