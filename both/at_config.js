/*
	The following file contains configuration parameters for
	the AccountTemplates system underlying accounts:ionic.

*/

var AT_CONFIG_DEBUG = true;

/*As stated here: https://atmospherejs.com/useraccounts/ionic
	because Ionic does not support form input validation, 
	we must choose the following settings:
	
	-do not highlight input elements nor display feedback message
	on both positive and negative form validation.
*/
AccountsTemplates.configure({
  negativeValidation: false,
  negativeFeedback: false,
  positiveValidation: false,
  positiveFeedback: false,
  forbidClientAccountCreation:true
});

/*
	Modify user account creation by adding a "user_type" field
	to all created users, indicating whether they are a patient or medical staff.

	Precondition: 
		the "options" object passed to Accounts.CreateUser
		MUST contain a "user_type" attribute with one of the following values:
		"patient", or "staff".

	Postcondition: 
		returns a user document with a "user_type" attribute matching the value,
		and otherwise behaves like regular account creation.
	
	More information:
		http://docs.meteor.com/#/full/accounts_oncreateuser
*/
if(Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {
		if(AT_CONFIG_DEBUG){
			if((!options.hasOwnProperty("user_type")) || 
			((options.user_type !== "patient") && (options.user_type !== "staff"))){
				alert("at_config.js, Accounts.onCreateUser precondition violation");
			}
		}

		user.user_type = options.user_type;

		if(options.profile){
			user.profile = options.profile;
		}

		return user;
});
}

/*
	Wire up the paths to connect to after successfully signing in and
	signing out of the app.

	After sign-in: display the user's appointment list @ /list
	After sign-out: revert back to log-in page

	More information:
		https://github.com/meteor-useraccounts/core/blob/master/Guide.md#routing
*/
AccountsTemplates.configureRoute('signIn', {
		name: 'signin',
		path: '/',
		template: 'login',
		redirect: '/list'
});

/*
	The sign-in page itself @ "/" does not need to be content-protected. Doesn't make
	sense to log-in just to log-in.
*/
Router.plugin('ensureSignedIn', {
	except: ['signin']
});
