/*
	getQuery:
		"query" session variable is a javascript object that contain query text, proc_type, and organization.
		Every time user change something in search-box or fliter, fill get current query and update the Session variable.

	keyup .search-box:
		updates the "query" Session variable with whatever the user typed in.
		staff_appointment_list will then dynamically update with the correct result.

	click #proc_filter span:
		filter for procedure such as CT, MRI, Ultrasound

	change #organization_filter select:
		filter for organization
		
*/

var getQuery = function(){
	var query = {};
	query.procs = []
	query.procs_id = []
	query.organization = ""
	query.organization_id = ""
	query.text = ""

	$("#proc_filter span.proc_selected").each(function(id, proc){
		query.procs.push( $(proc).text() )
		query.procs_id.push( $(proc).data("id") )
	})

	if(query.procs.length === 0){
		$("#proc_filter span").each(function(id, proc){
			query.procs.push( $(proc).text() )
			query.procs_id.push( $(proc).text() )
		})
	}

	query.text = $("#search_box .search-box").val();
	query.organization = $("#organization_filter :selected").text();
	query.organization_id = $("#organization_filter select").val();

	return query;

}



Template.staff_search_box.onRendered(function () {
	var query = Session.get("query");
	if(query){

		if(query.organization_id){
			$("#organization_filter select").val(query.organization_id)	
		}
		if(query.text){
			$("#search_box input").val(query.text)
		}
		if(query.procs_id){
			for (var i = 0; i < query.procs_id.length; i++) {
				
				$("#proc_filter [data-id='" + query.procs_id[i] + "']").addClass("proc_selected")

			};		
		}
	}
});

Template.staff_search_box.events({
	"keyup .search-box" : function(e){
		Session.set("query", getQuery());
	},
	"click #proc_filter span" : function(e){
		$(e.currentTarget).toggleClass("proc_selected")
		Session.set("query", getQuery());
	},
	"change #organization_filter select" : function(e){
		Session.set("query", getQuery());
	}	

});