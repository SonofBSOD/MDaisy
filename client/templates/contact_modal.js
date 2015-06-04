Template.contact_modal.helpers({
	name : function(){
		return this.name;
	},
	email : function() {
		var email_str = "";
		this.email.forEach(function (e){
			email_str += (e + "<br>");
		});

		return email_str;
	}
}); 