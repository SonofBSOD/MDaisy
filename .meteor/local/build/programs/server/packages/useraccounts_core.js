(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var AccountsTemplates, Field, STATE_PAT, ERRORS_PAT, INFO_PAT, INPUT_ICONS_PAT, ObjWithStringValues, TEXTS_PAT, CONFIG_PAT, FIELD_SUB_PAT, FIELD_PAT, AT;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/useraccounts:core/lib/field.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// ---------------------------------------------------------------------------------                               // 1
                                                                                                                   // 2
// Field object                                                                                                    // 3
                                                                                                                   // 4
// ---------------------------------------------------------------------------------                               // 5
                                                                                                                   // 6
                                                                                                                   // 7
Field = function(field){                                                                                           // 8
    check(field, FIELD_PAT);                                                                                       // 9
    _.defaults(this, field);                                                                                       // 10
                                                                                                                   // 11
    this.validating = new ReactiveVar(false);                                                                      // 12
    this.status = new ReactiveVar(null);                                                                           // 13
};                                                                                                                 // 14
                                                                                                                   // 15
if (Meteor.isClient)                                                                                               // 16
    Field.prototype.clearStatus = function(){                                                                      // 17
        return this.status.set(null);                                                                              // 18
    };                                                                                                             // 19
if (Meteor.isServer)                                                                                               // 20
    Field.prototype.clearStatus = function(){                                                                      // 21
        // Nothing to do server-side                                                                               // 22
        return                                                                                                     // 23
    };                                                                                                             // 24
                                                                                                                   // 25
Field.prototype.fixValue = function(value){                                                                        // 26
    if (this.type === "checkbox")                                                                                  // 27
        return !!value;                                                                                            // 28
    if (this.type === "select")                                                                                    // 29
        // TODO: something working...                                                                              // 30
        return value;                                                                                              // 31
    if (this.type === "radio")                                                                                     // 32
        // TODO: something working...                                                                              // 33
        return value;                                                                                              // 34
    // Possibly applies required transformations to the input value                                                // 35
    if (this.trim)                                                                                                 // 36
        value = value.trim();                                                                                      // 37
    if (this.lowercase)                                                                                            // 38
        value = value.toLowerCase();                                                                               // 39
    if (this.uppercase)                                                                                            // 40
        value = value.toUpperCase();                                                                               // 41
    if (!!this.transform)                                                                                          // 42
        value = this.transform(value);                                                                             // 43
    return value;                                                                                                  // 44
};                                                                                                                 // 45
                                                                                                                   // 46
if (Meteor.isClient)                                                                                               // 47
    Field.prototype.getDisplayName = function(state){                                                              // 48
        var dN = this.displayName;                                                                                 // 49
        if (_.isObject(dN))                                                                                        // 50
            dN = dN[state] || dN["default"];                                                                       // 51
        if (!dN)                                                                                                   // 52
            dN = capitalize(this._id);                                                                             // 53
        return dN;                                                                                                 // 54
    };                                                                                                             // 55
                                                                                                                   // 56
if (Meteor.isClient)                                                                                               // 57
    Field.prototype.getPlaceholder = function(state){                                                              // 58
        var placeholder = this.placeholder;                                                                        // 59
        if (_.isObject(placeholder))                                                                               // 60
            placeholder = placeholder[state] || placeholder["default"];                                            // 61
        if (!placeholder)                                                                                          // 62
            placeholder = capitalize(this._id);                                                                    // 63
        return placeholder;                                                                                        // 64
    };                                                                                                             // 65
                                                                                                                   // 66
Field.prototype.getStatus = function(){                                                                            // 67
    return this.status.get();                                                                                      // 68
};                                                                                                                 // 69
                                                                                                                   // 70
if (Meteor.isClient)                                                                                               // 71
    Field.prototype.getValue = function(tempalteInstance){                                                         // 72
        if (this.type === "checkbox")                                                                              // 73
            return !!(tempalteInstance.$("#at-field-" + this._id + ":checked").val());                             // 74
        if (this.type === "radio")                                                                                 // 75
            return tempalteInstance.$("[name=at-field-"+ this._id + "]:checked").val();                            // 76
        return tempalteInstance.$("#at-field-" + this._id).val();                                                  // 77
    };                                                                                                             // 78
                                                                                                                   // 79
if (Meteor.isClient)                                                                                               // 80
    Field.prototype.hasError = function() {                                                                        // 81
        return this.negativeValidation && this.status.get();                                                       // 82
    };                                                                                                             // 83
                                                                                                                   // 84
if (Meteor.isClient)                                                                                               // 85
    Field.prototype.hasIcon = function(){                                                                          // 86
        if (this.showValidating && this.isValidating())                                                            // 87
            return true;                                                                                           // 88
        if (this.negativeFeedback && this.hasError())                                                              // 89
            return true;                                                                                           // 90
        if (this.positiveFeedback && this.hasSuccess())                                                            // 91
            return true;                                                                                           // 92
    };                                                                                                             // 93
                                                                                                                   // 94
if (Meteor.isClient)                                                                                               // 95
    Field.prototype.hasSuccess = function() {                                                                      // 96
        return this.positiveValidation && this.status.get() === false;                                             // 97
    };                                                                                                             // 98
                                                                                                                   // 99
if (Meteor.isClient)                                                                                               // 100
    Field.prototype.iconClass = function(){                                                                        // 101
        if (this.isValidating())                                                                                   // 102
            return AccountsTemplates.texts.inputIcons["isValidating"];                                             // 103
        if (this.hasError())                                                                                       // 104
            return AccountsTemplates.texts.inputIcons["hasError"];                                                 // 105
        if (this.hasSuccess())                                                                                     // 106
            return AccountsTemplates.texts.inputIcons["hasSuccess"];                                               // 107
    };                                                                                                             // 108
                                                                                                                   // 109
if (Meteor.isClient)                                                                                               // 110
    Field.prototype.isValidating = function(){                                                                     // 111
        return this.validating.get();                                                                              // 112
    };                                                                                                             // 113
                                                                                                                   // 114
if (Meteor.isClient)                                                                                               // 115
    Field.prototype.setError = function(err){                                                                      // 116
        check(err, Match.OneOf(String, undefined, Boolean));                                                       // 117
        if (err === false)                                                                                         // 118
            return this.status.set(false);                                                                         // 119
        return this.status.set(err || true);                                                                       // 120
    };                                                                                                             // 121
if (Meteor.isServer)                                                                                               // 122
    Field.prototype.setError = function(err){                                                                      // 123
        // Nothing to do server-side                                                                               // 124
        return;                                                                                                    // 125
    };                                                                                                             // 126
                                                                                                                   // 127
if (Meteor.isClient)                                                                                               // 128
    Field.prototype.setSuccess = function(){                                                                       // 129
        return this.status.set(false);                                                                             // 130
    };                                                                                                             // 131
if (Meteor.isServer)                                                                                               // 132
    Field.prototype.setSuccess = function(){                                                                       // 133
        // Nothing to do server-side                                                                               // 134
        return;                                                                                                    // 135
    };                                                                                                             // 136
                                                                                                                   // 137
                                                                                                                   // 138
if (Meteor.isClient)                                                                                               // 139
    Field.prototype.setValidating = function(state){                                                               // 140
        check(state, Boolean);                                                                                     // 141
        return this.validating.set(state);                                                                         // 142
    };                                                                                                             // 143
if (Meteor.isServer)                                                                                               // 144
    Field.prototype.setValidating = function(state){                                                               // 145
        // Nothing to do server-side                                                                               // 146
        return;                                                                                                    // 147
    };                                                                                                             // 148
                                                                                                                   // 149
if (Meteor.isClient)                                                                                               // 150
    Field.prototype.setValue = function(tempalteInstance, value){                                                  // 151
        if (this.type === "checkbox") {                                                                            // 152
            tempalteInstance.$("#at-field-" + this._id).prop('checked', true);                                     // 153
            return;                                                                                                // 154
        }                                                                                                          // 155
        if (this.type === "radio") {                                                                               // 156
            tempalteInstance.$("[name=at-field-"+ this._id + "]").prop('checked', true);                           // 157
            return;                                                                                                // 158
        }                                                                                                          // 159
        tempalteInstance.$("#at-field-" + this._id).val(value);                                                    // 160
    };                                                                                                             // 161
                                                                                                                   // 162
Field.prototype.validate = function(value, strict) {                                                               // 163
    check(value, Match.OneOf(undefined, String, Boolean));                                                         // 164
    this.setValidating(true);                                                                                      // 165
    this.clearStatus();                                                                                            // 166
    if (value === undefined || value === ''){                                                                      // 167
        if (!!strict){                                                                                             // 168
            if (this.required) {                                                                                   // 169
                this.setError(AccountsTemplates.texts.requiredField);                                              // 170
                this.setValidating(false);                                                                         // 171
                return AccountsTemplates.texts.requiredField;                                                      // 172
            }                                                                                                      // 173
            else {                                                                                                 // 174
                this.setSuccess();                                                                                 // 175
                this.setValidating(false);                                                                         // 176
                return false;                                                                                      // 177
            }                                                                                                      // 178
        }                                                                                                          // 179
        else {                                                                                                     // 180
            this.clearStatus();                                                                                    // 181
            this.setValidating(false);                                                                             // 182
            return null;                                                                                           // 183
        }                                                                                                          // 184
    }                                                                                                              // 185
    var valueLength = value.length;                                                                                // 186
    var minLength = this.minLength;                                                                                // 187
    if (minLength && valueLength < minLength) {                                                                    // 188
        this.setError(AccountsTemplates.texts.minRequiredLength + ": " + minLength);                               // 189
        this.setValidating(false);                                                                                 // 190
        return AccountsTemplates.texts.minRequiredLength + ": " + minLength;                                       // 191
    }                                                                                                              // 192
    var maxLength = this.maxLength;                                                                                // 193
    if (maxLength && valueLength > maxLength) {                                                                    // 194
        this.setError(AccountsTemplates.texts.maxAllowedLength + ": " + maxLength);                                // 195
        this.setValidating(false);                                                                                 // 196
        return AccountsTemplates.texts.maxAllowedLength + ": " + maxLength;                                        // 197
    }                                                                                                              // 198
    if (this.re && valueLength && !value.match(this.re)) {                                                         // 199
        this.setError(this.errStr);                                                                                // 200
        this.setValidating(false);                                                                                 // 201
        return this.errStr;                                                                                        // 202
    }                                                                                                              // 203
    if (this.func){                                                                                                // 204
        var result = this.func(value);                                                                             // 205
        var err = result === true ? this.errStr || true : result;                                                  // 206
        if (result === undefined)                                                                                  // 207
            return err;                                                                                            // 208
        this.status.set(err);                                                                                      // 209
        this.setValidating(false);                                                                                 // 210
        return err;                                                                                                // 211
    }                                                                                                              // 212
    this.setSuccess();                                                                                             // 213
    this.setValidating(false);                                                                                     // 214
    return false;                                                                                                  // 215
};                                                                                                                 // 216
                                                                                                                   // 217
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/useraccounts:core/lib/core.js                                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// ---------------------------------------------------------------------------------                               // 1
                                                                                                                   // 2
// Patterns for methods" parameters                                                                                // 3
                                                                                                                   // 4
// ---------------------------------------------------------------------------------                               // 5
                                                                                                                   // 6
STATE_PAT = {                                                                                                      // 7
    changePwd: Match.Optional(String),                                                                             // 8
    enrollAccount: Match.Optional(String),                                                                         // 9
    forgotPwd: Match.Optional(String),                                                                             // 10
    resetPwd: Match.Optional(String),                                                                              // 11
    signIn: Match.Optional(String),                                                                                // 12
    signUp: Match.Optional(String),                                                                                // 13
    verifyEmail: Match.Optional(String),                                                                           // 14
    resendVerificationEmail: Match.Optional(String),                                                               // 15
};                                                                                                                 // 16
                                                                                                                   // 17
ERRORS_PAT = {                                                                                                     // 18
    accountsCreationDisabled: Match.Optional(String),                                                              // 19
    cannotRemoveService: Match.Optional(String),                                                                   // 20
    captchaVerification: Match.Optional(String),                                                                   // 21
    loginForbidden: Match.Optional(String),                                                                        // 22
    mustBeLoggedIn: Match.Optional(String),                                                                        // 23
    pwdMismatch: Match.Optional(String),                                                                           // 24
    validationErrors: Match.Optional(String),                                                                      // 25
    verifyEmailFirst: Match.Optional(String),                                                                      // 26
};                                                                                                                 // 27
                                                                                                                   // 28
INFO_PAT = {                                                                                                       // 29
    emailSent: Match.Optional(String),                                                                             // 30
    emailVerified: Match.Optional(String),                                                                         // 31
    pwdChanged: Match.Optional(String),                                                                            // 32
    pwdReset: Match.Optional(String),                                                                              // 33
    pwdSet: Match.Optional(String),                                                                                // 34
    signUpVerifyEmail: Match.Optional(String),                                                                     // 35
    verificationEmailSent: Match.Optional(String),                                                                 // 36
};                                                                                                                 // 37
                                                                                                                   // 38
INPUT_ICONS_PAT = {                                                                                                // 39
    hasError: Match.Optional(String),                                                                              // 40
    hasSuccess: Match.Optional(String),                                                                            // 41
    isValidating: Match.Optional(String),                                                                          // 42
};                                                                                                                 // 43
                                                                                                                   // 44
ObjWithStringValues = Match.Where(function (x) {                                                                   // 45
    check(x, Object);                                                                                              // 46
    _.each(_.values(x), function(value){                                                                           // 47
        check(value, String);                                                                                      // 48
    });                                                                                                            // 49
    return true;                                                                                                   // 50
});                                                                                                                // 51
                                                                                                                   // 52
TEXTS_PAT = {                                                                                                      // 53
    button: Match.Optional(STATE_PAT),                                                                             // 54
    errors: Match.Optional(ERRORS_PAT),                                                                            // 55
    info: Match.Optional(INFO_PAT),                                                                                // 56
    inputIcons: Match.Optional(INPUT_ICONS_PAT),                                                                   // 57
    maxAllowedLength: Match.Optional(String),                                                                      // 58
    minRequiredLength: Match.Optional(String),                                                                     // 59
    navSignIn: Match.Optional(String),                                                                             // 60
    navSignOut: Match.Optional(String),                                                                            // 61
    optionalField: Match.Optional(String),                                                                         // 62
    pwdLink_link: Match.Optional(String),                                                                          // 63
    pwdLink_pre: Match.Optional(String),                                                                           // 64
    pwdLink_suff: Match.Optional(String),                                                                          // 65
    requiredField: Match.Optional(String),                                                                         // 66
    resendVerificationEmailLink_pre: Match.Optional(String),                                                       // 67
    resendVerificationEmailLink_link: Match.Optional(String),                                                      // 68
    resendVerificationEmailLink_suff: Match.Optional(String),                                                      // 69
    sep: Match.Optional(String),                                                                                   // 70
    signInLink_link: Match.Optional(String),                                                                       // 71
    signInLink_pre: Match.Optional(String),                                                                        // 72
    signInLink_suff: Match.Optional(String),                                                                       // 73
    signUpLink_link: Match.Optional(String),                                                                       // 74
    signUpLink_pre: Match.Optional(String),                                                                        // 75
    signUpLink_suff: Match.Optional(String),                                                                       // 76
    socialAdd: Match.Optional(String),                                                                             // 77
    socialConfigure: Match.Optional(String),                                                                       // 78
    socialIcons: Match.Optional(ObjWithStringValues),                                                              // 79
    socialRemove: Match.Optional(String),                                                                          // 80
    socialSignIn: Match.Optional(String),                                                                          // 81
    socialSignUp: Match.Optional(String),                                                                          // 82
    socialWith: Match.Optional(String),                                                                            // 83
    termsAnd: Match.Optional(String),                                                                              // 84
    termsPreamble: Match.Optional(String),                                                                         // 85
    termsPrivacy: Match.Optional(String),                                                                          // 86
    termsTerms: Match.Optional(String),                                                                            // 87
    title: Match.Optional(STATE_PAT),                                                                              // 88
};                                                                                                                 // 89
                                                                                                                   // 90
// Configuration pattern to be checked with check                                                                  // 91
CONFIG_PAT = {                                                                                                     // 92
    // Behaviour                                                                                                   // 93
    confirmPassword: Match.Optional(Boolean),                                                                      // 94
    defaultState: Match.Optional(String),                                                                          // 95
    enablePasswordChange: Match.Optional(Boolean),                                                                 // 96
    enforceEmailVerification: Match.Optional(Boolean),                                                             // 97
    forbidClientAccountCreation: Match.Optional(Boolean),                                                          // 98
    lowercaseUsername: Match.Optional(Boolean),                                                                    // 99
    overrideLoginErrors: Match.Optional(Boolean),                                                                  // 100
    sendVerificationEmail: Match.Optional(Boolean),                                                                // 101
    socialLoginStyle: Match.Optional(Match.OneOf("popup", "redirect")),                                            // 102
                                                                                                                   // 103
    // Appearance                                                                                                  // 104
    defaultLayout: Match.Optional(String),                                                                         // 105
    hideSignInLink: Match.Optional(Boolean),                                                                       // 106
    hideSignUpLink: Match.Optional(Boolean),                                                                       // 107
    showAddRemoveServices: Match.Optional(Boolean),                                                                // 108
    showForgotPasswordLink: Match.Optional(Boolean),                                                               // 109
    showResendVerificationEmailLink: Match.Optional(Boolean),                                                      // 110
    showLabels: Match.Optional(Boolean),                                                                           // 111
    showPlaceholders: Match.Optional(Boolean),                                                                     // 112
                                                                                                                   // 113
    // Client-side Validation                                                                                      // 114
    continuousValidation: Match.Optional(Boolean),                                                                 // 115
    negativeFeedback: Match.Optional(Boolean),                                                                     // 116
    negativeValidation: Match.Optional(Boolean),                                                                   // 117
    positiveFeedback: Match.Optional(Boolean),                                                                     // 118
    positiveValidation: Match.Optional(Boolean),                                                                   // 119
    showValidating: Match.Optional(Boolean),                                                                       // 120
                                                                                                                   // 121
    // Privacy Policy and Terms of Use                                                                             // 122
    privacyUrl: Match.Optional(String),                                                                            // 123
    termsUrl: Match.Optional(String),                                                                              // 124
                                                                                                                   // 125
    // Redirects                                                                                                   // 126
    homeRoutePath: Match.Optional(String),                                                                         // 127
    redirectTimeout: Match.Optional(Number),                                                                       // 128
                                                                                                                   // 129
    // Hooks                                                                                                       // 130
    onLogoutHook: Match.Optional(Function),                                                                        // 131
    onSubmitHook: Match.Optional(Function),                                                                        // 132
                                                                                                                   // 133
    texts: Match.Optional(TEXTS_PAT),                                                                              // 134
                                                                                                                   // 135
    //reCaptcha config                                                                                             // 136
    reCaptcha: Match.Optional({                                                                                    // 137
        data_type: Match.Optional(Match.OneOf("audio", "image")),                                                  // 138
        secretKey: Match.Optional(String),                                                                         // 139
        siteKey: Match.Optional(String),                                                                           // 140
        theme: Match.Optional(Match.OneOf("dark", "light")),                                                       // 141
    }),                                                                                                            // 142
                                                                                                                   // 143
    showReCaptcha: Match.Optional(Boolean),                                                                        // 144
};                                                                                                                 // 145
                                                                                                                   // 146
                                                                                                                   // 147
FIELD_SUB_PAT = {                                                                                                  // 148
    "default": Match.Optional(String),                                                                             // 149
    changePwd: Match.Optional(String),                                                                             // 150
    enrollAccount: Match.Optional(String),                                                                         // 151
    forgotPwd: Match.Optional(String),                                                                             // 152
    resetPwd: Match.Optional(String),                                                                              // 153
    signIn: Match.Optional(String),                                                                                // 154
    signUp: Match.Optional(String),                                                                                // 155
};                                                                                                                 // 156
                                                                                                                   // 157
                                                                                                                   // 158
// Field pattern                                                                                                   // 159
FIELD_PAT = {                                                                                                      // 160
    _id: String,                                                                                                   // 161
    type: String,                                                                                                  // 162
    required: Match.Optional(Boolean),                                                                             // 163
    displayName: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),                                               // 164
    placeholder: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),                                               // 165
    select: Match.Optional([{text: String, value: Match.Any}]),                                                    // 166
    minLength: Match.Optional(Match.Integer),                                                                      // 167
    maxLength: Match.Optional(Match.Integer),                                                                      // 168
    re: Match.Optional(RegExp),                                                                                    // 169
    func: Match.Optional(Match.Where(_.isFunction)),                                                               // 170
    errStr: Match.Optional(String),                                                                                // 171
                                                                                                                   // 172
    // Client-side Validation                                                                                      // 173
    continuousValidation: Match.Optional(Boolean),                                                                 // 174
    negativeFeedback: Match.Optional(Boolean),                                                                     // 175
    negativeValidation: Match.Optional(Boolean),                                                                   // 176
    positiveValidation: Match.Optional(Boolean),                                                                   // 177
    positiveFeedback: Match.Optional(Boolean),                                                                     // 178
                                                                                                                   // 179
    // Transforms                                                                                                  // 180
    trim: Match.Optional(Boolean),                                                                                 // 181
    lowercase: Match.Optional(Boolean),                                                                            // 182
    uppercase: Match.Optional(Boolean),                                                                            // 183
    transform: Match.Optional(Match.Where(_.isFunction)),                                                          // 184
                                                                                                                   // 185
    // Custom options                                                                                              // 186
    options: Match.Optional(Object),                                                                               // 187
    template: Match.Optional(String),                                                                              // 188
};                                                                                                                 // 189
                                                                                                                   // 190
// Route configuration pattern to be checked with check                                                            // 191
var ROUTE_PAT = {                                                                                                  // 192
    name: Match.Optional(String),                                                                                  // 193
    path: Match.Optional(String),                                                                                  // 194
    template: Match.Optional(String),                                                                              // 195
    layoutTemplate: Match.Optional(String),                                                                        // 196
    redirect: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),                                      // 197
};                                                                                                                 // 198
                                                                                                                   // 199
                                                                                                                   // 200
// -----------------------------------------------------------------------------                                   // 201
                                                                                                                   // 202
// AccountsTemplates object                                                                                        // 203
                                                                                                                   // 204
// -----------------------------------------------------------------------------                                   // 205
                                                                                                                   // 206
                                                                                                                   // 207
                                                                                                                   // 208
// -------------------                                                                                             // 209
// Client/Server stuff                                                                                             // 210
// -------------------                                                                                             // 211
                                                                                                                   // 212
// Constructor                                                                                                     // 213
AT = function() {                                                                                                  // 214
                                                                                                                   // 215
};                                                                                                                 // 216
                                                                                                                   // 217
                                                                                                                   // 218
                                                                                                                   // 219
                                                                                                                   // 220
/*                                                                                                                 // 221
    Each field object is represented by the following properties:                                                  // 222
        _id:         String   (required)  // A unique field"s id / name                                            // 223
        type:        String   (required)  // Displayed input type                                                  // 224
        required:    Boolean  (optional)  // Specifies Whether to fail or not when field is left empty             // 225
        displayName: String   (optional)  // The field"s name to be displayed as a label above the input element   // 226
        placeholder: String   (optional)  // The placeholder text to be displayed inside the input element         // 227
        minLength:   Integer  (optional)  // Possibly specifies the minimum allowed length                         // 228
        maxLength:   Integer  (optional)  // Possibly specifies the maximum allowed length                         // 229
        re:          RegExp   (optional)  // Regular expression for validation                                     // 230
        func:        Function (optional)  // Custom function for validation                                        // 231
        errStr:      String   (optional)  // Error message to be displayed in case re validation fails             // 232
*/                                                                                                                 // 233
                                                                                                                   // 234
                                                                                                                   // 235
                                                                                                                   // 236
/*                                                                                                                 // 237
    Routes configuration can be done by calling AccountsTemplates.configureRoute with the route name and the       // 238
    following options in a separate object. E.g. AccountsTemplates.configureRoute("gingIn", option);               // 239
        name:           String (optional). A unique route"s name to be passed to iron-router                       // 240
        path:           String (optional). A unique route"s path to be passed to iron-router                       // 241
        template:       String (optional). The name of the template to be rendered                                 // 242
        layoutTemplate: String (optional). The name of the layout to be used                                       // 243
        redirect:       String (optional). The name of the route (or its path) where to redirect after form submit // 244
*/                                                                                                                 // 245
                                                                                                                   // 246
                                                                                                                   // 247
// Allowed routes along with theirs default configuration values                                                   // 248
AT.prototype.ROUTE_DEFAULT = {                                                                                     // 249
    changePwd:      { name: "atChangePwd",      path: "/change-password"},                                         // 250
    enrollAccount:  { name: "atEnrollAccount",  path: "/enroll-account"},                                          // 251
    ensureSignedIn: { name: "atEnsureSignedIn", path: null},                                                       // 252
    forgotPwd:      { name: "atForgotPwd",      path: "/forgot-password"},                                         // 253
    resetPwd:       { name: "atResetPwd",       path: "/reset-password"},                                          // 254
    signIn:         { name: "atSignIn",         path: "/sign-in"},                                                 // 255
    signUp:         { name: "atSignUp",         path: "/sign-up"},                                                 // 256
    verifyEmail:    { name: "atVerifyEmail",    path: "/verify-email"},                                            // 257
    resendVerificationEmail: { name: "atResendVerificationEmail", path: "/send-again"},                            // 258
};                                                                                                                 // 259
                                                                                                                   // 260
                                                                                                                   // 261
                                                                                                                   // 262
// Allowed input types                                                                                             // 263
AT.prototype.INPUT_TYPES = [                                                                                       // 264
    "checkbox",                                                                                                    // 265
    "email",                                                                                                       // 266
    "hidden",                                                                                                      // 267
    "password",                                                                                                    // 268
    "radio",                                                                                                       // 269
    "select",                                                                                                      // 270
    "tel",                                                                                                         // 271
    "text",                                                                                                        // 272
    "url",                                                                                                         // 273
];                                                                                                                 // 274
                                                                                                                   // 275
// Current configuration values                                                                                    // 276
AT.prototype.options = {                                                                                           // 277
    // Appearance                                                                                                  // 278
    //defaultLayout: undefined,                                                                                    // 279
    showAddRemoveServices: false,                                                                                  // 280
    showForgotPasswordLink: false,                                                                                 // 281
    showResendVerificationEmailLink: false,                                                                        // 282
    showLabels: true,                                                                                              // 283
    showPlaceholders: true,                                                                                        // 284
                                                                                                                   // 285
    // Behaviour                                                                                                   // 286
    confirmPassword: true,                                                                                         // 287
    defaultState: "signIn",                                                                                        // 288
    enablePasswordChange: false,                                                                                   // 289
    forbidClientAccountCreation: false,                                                                            // 290
    lowercaseUsername: false,                                                                                      // 291
    overrideLoginErrors: true,                                                                                     // 292
    sendVerificationEmail: false,                                                                                  // 293
    socialLoginStyle: "popup",                                                                                     // 294
                                                                                                                   // 295
    // Client-side Validation                                                                                      // 296
    //continuousValidation: false,                                                                                 // 297
    //negativeFeedback: false,                                                                                     // 298
    //negativeValidation: false,                                                                                   // 299
    //positiveValidation: false,                                                                                   // 300
    //positiveFeedback: false,                                                                                     // 301
    //showValidating: false,                                                                                       // 302
                                                                                                                   // 303
    // Privacy Policy and Terms of Use                                                                             // 304
    privacyUrl: undefined,                                                                                         // 305
    termsUrl: undefined,                                                                                           // 306
                                                                                                                   // 307
    // Redirects                                                                                                   // 308
    homeRoutePath: "/",                                                                                            // 309
    redirectTimeout: 2000, // 2 seconds                                                                            // 310
                                                                                                                   // 311
    // Hooks                                                                                                       // 312
    onSubmitHook: undefined,                                                                                       // 313
};                                                                                                                 // 314
                                                                                                                   // 315
AT.prototype.texts = {                                                                                             // 316
    button: {                                                                                                      // 317
        changePwd: "updateYourPassword",                                                                           // 318
        //enrollAccount: "createAccount",                                                                          // 319
        enrollAccount: "signUp",                                                                                   // 320
        forgotPwd: "emailResetLink",                                                                               // 321
        resetPwd: "setPassword",                                                                                   // 322
        signIn: "signIn",                                                                                          // 323
        signUp: "signUp",                                                                                          // 324
        resendVerificationEmail: "Send email again",                                                               // 325
    },                                                                                                             // 326
    errors: {                                                                                                      // 327
        accountsCreationDisabled: "Client side accounts creation is disabled!!!",                                  // 328
        cannotRemoveService: "Cannot remove the only active service!",                                             // 329
        captchaVerification: "Captcha verification failed!",                                                       // 330
        loginForbidden: "error.accounts.Login forbidden",                                                          // 331
        mustBeLoggedIn: "error.accounts.Must be logged in",                                                        // 332
        pwdMismatch: "error.pwdsDontMatch",                                                                        // 333
        validationErrors: "Validation Errors",                                                                     // 334
        verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",                  // 335
    },                                                                                                             // 336
    navSignIn: 'signIn',                                                                                           // 337
    navSignOut: 'signOut',                                                                                         // 338
    info: {                                                                                                        // 339
        emailSent: "info.emailSent",                                                                               // 340
        emailVerified: "info.emailVerified",                                                                       // 341
        pwdChanged: "info.passwordChanged",                                                                        // 342
        pwdReset: "info.passwordReset",                                                                            // 343
        pwdSet: "Password Set",                                                                                    // 344
        signUpVerifyEmail: "Successful Registration! Please check your email and follow the instructions.",        // 345
        verificationEmailSent: "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.",
    },                                                                                                             // 347
    inputIcons: {                                                                                                  // 348
        isValidating: "fa fa-spinner fa-spin",                                                                     // 349
        hasSuccess: "fa fa-check",                                                                                 // 350
        hasError: "fa fa-times",                                                                                   // 351
    },                                                                                                             // 352
    maxAllowedLength: "Maximum allowed length",                                                                    // 353
    minRequiredLength: "Minimum required length",                                                                  // 354
    optionalField: "optional",                                                                                     // 355
    pwdLink_pre: "",                                                                                               // 356
    pwdLink_link: "forgotPassword",                                                                                // 357
    pwdLink_suff: "",                                                                                              // 358
    requiredField: "Required Field",                                                                               // 359
    resendVerificationEmailLink_pre: "Verification email lost?",                                                   // 360
    resendVerificationEmailLink_link: "Send again",                                                                // 361
    resendVerificationEmailLink_suff: "",                                                                          // 362
    sep: "OR",                                                                                                     // 363
    signInLink_pre: "ifYouAlreadyHaveAnAccount",                                                                   // 364
    signInLink_link: "signin",                                                                                     // 365
    signInLink_suff: "",                                                                                           // 366
    signUpLink_pre: "dontHaveAnAccount",                                                                           // 367
    signUpLink_link: "signUp",                                                                                     // 368
    signUpLink_suff: "",                                                                                           // 369
    socialAdd: "add",                                                                                              // 370
    socialConfigure: "configure",                                                                                  // 371
    socialIcons: {                                                                                                 // 372
        "meteor-developer": "fa fa-rocket"                                                                         // 373
    },                                                                                                             // 374
    socialRemove: "remove",                                                                                        // 375
    socialSignIn: "signIn",                                                                                        // 376
    socialSignUp: "signUp",                                                                                        // 377
    socialWith: "with",                                                                                            // 378
    termsPreamble: "clickAgree",                                                                                   // 379
    termsPrivacy: "privacyPolicy",                                                                                 // 380
    termsAnd: "and",                                                                                               // 381
    termsTerms: "terms",                                                                                           // 382
    title: {                                                                                                       // 383
        changePwd: "changePassword",                                                                               // 384
        enrollAccount: "createAccount",                                                                            // 385
        forgotPwd: "resetYourPassword",                                                                            // 386
        resetPwd: "resetYourPassword",                                                                             // 387
        signIn: "signIn",                                                                                          // 388
        signUp: "createAccount",                                                                                   // 389
        verifyEmail: "",                                                                                           // 390
        resendVerificationEmail: "Send the verification email again",                                              // 391
    },                                                                                                             // 392
};                                                                                                                 // 393
                                                                                                                   // 394
AT.prototype.SPECIAL_FIELDS = [                                                                                    // 395
    "password_again",                                                                                              // 396
    "username_and_email",                                                                                          // 397
];                                                                                                                 // 398
                                                                                                                   // 399
// SignIn / SignUp fields                                                                                          // 400
AT.prototype._fields = [                                                                                           // 401
    new Field({                                                                                                    // 402
        _id: "email",                                                                                              // 403
        type: "email",                                                                                             // 404
        required: true,                                                                                            // 405
        lowercase: true,                                                                                           // 406
        trim: true,                                                                                                // 407
        func: function(email){                                                                                     // 408
            return !_.contains(email, '@');                                                                        // 409
        },                                                                                                         // 410
        errStr: 'Invalid email',                                                                                   // 411
    }),                                                                                                            // 412
    new Field({                                                                                                    // 413
        _id: "password",                                                                                           // 414
        type: "password",                                                                                          // 415
        required: true,                                                                                            // 416
        minLength: 6,                                                                                              // 417
        displayName: {                                                                                             // 418
            "default": "password",                                                                                 // 419
            changePwd: "newPassword",                                                                              // 420
            resetPwd: "newPassword",                                                                               // 421
        },                                                                                                         // 422
        placeholder: {                                                                                             // 423
            "default": "password",                                                                                 // 424
            changePwd: "newPassword",                                                                              // 425
            resetPwd: "newPassword",                                                                               // 426
        },                                                                                                         // 427
    }),                                                                                                            // 428
];                                                                                                                 // 429
                                                                                                                   // 430
// Configured routes                                                                                               // 431
AT.prototype.routes = {};                                                                                          // 432
                                                                                                                   // 433
AT.prototype._initialized = false;                                                                                 // 434
                                                                                                                   // 435
// Input type validation                                                                                           // 436
AT.prototype._isValidInputType = function(value) {                                                                 // 437
    return _.indexOf(this.INPUT_TYPES, value) !== -1;                                                              // 438
};                                                                                                                 // 439
                                                                                                                   // 440
AT.prototype.addField = function(field) {                                                                          // 441
    // Fields can be added only before initialization                                                              // 442
    if (this._initialized)                                                                                         // 443
        throw new Error("AccountsTemplates.addField should strictly be called before AccountsTemplates.init!");    // 444
    field = _.pick(field, _.keys(FIELD_PAT));                                                                      // 445
    check(field, FIELD_PAT);                                                                                       // 446
    // Checks there"s currently no field called field._id                                                          // 447
    if (_.indexOf(_.pluck(this._fields, "_id"), field._id) !== -1)                                                 // 448
        throw new Error("A field called " + field._id + " already exists!");                                       // 449
    // Validates field.type                                                                                        // 450
    if (!this._isValidInputType(field.type))                                                                       // 451
        throw new Error("field.type is not valid!");                                                               // 452
    // Checks field.minLength is strictly positive                                                                 // 453
    if (typeof field.minLength !== "undefined" && field.minLength <= 0)                                            // 454
        throw new Error("field.minLength should be greater than zero!");                                           // 455
    // Checks field.maxLength is strictly positive                                                                 // 456
    if (typeof field.maxLength !== "undefined" && field.maxLength <= 0)                                            // 457
        throw new Error("field.maxLength should be greater than zero!");                                           // 458
    // Checks field.maxLength is greater than field.minLength                                                      // 459
    if (typeof field.minLength !== "undefined" && typeof field.minLength !== "undefined" && field.maxLength < field.minLength)
        throw new Error("field.maxLength should be greater than field.maxLength!");                                // 461
                                                                                                                   // 462
    if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, field._id)))                                          // 463
        this._fields.push(new Field(field));                                                                       // 464
    return this._fields;                                                                                           // 465
};                                                                                                                 // 466
                                                                                                                   // 467
AT.prototype.addFields = function(fields) {                                                                        // 468
    var ok;                                                                                                        // 469
    try { // don"t bother with `typeof` - just access `length` and `catch`                                         // 470
        ok = fields.length > 0 && "0" in Object(fields);                                                           // 471
    } catch (e) {                                                                                                  // 472
        throw new Error("field argument should be an array of valid field objects!");                              // 473
    }                                                                                                              // 474
    if (ok) {                                                                                                      // 475
        _.map(fields, function(field){                                                                             // 476
            this.addField(field);                                                                                  // 477
        }, this);                                                                                                  // 478
    } else                                                                                                         // 479
        throw new Error("field argument should be an array of valid field objects!");                              // 480
    return this._fields;                                                                                           // 481
};                                                                                                                 // 482
                                                                                                                   // 483
AT.prototype.configure = function(config) {                                                                        // 484
    // Configuration options can be set only before initialization                                                 // 485
    if (this._initialized)                                                                                         // 486
        throw new Error("Configuration options must be set before AccountsTemplates.init!");                       // 487
                                                                                                                   // 488
    // Updates the current configuration                                                                           // 489
    check(config, CONFIG_PAT);                                                                                     // 490
    var options = _.omit(config, "texts", "reCaptcha");                                                            // 491
    this.options = _.defaults(options, this.options);                                                              // 492
                                                                                                                   // 493
    // Possibly sets up reCaptcha options                                                                          // 494
    var reCaptcha = config.reCaptcha;                                                                              // 495
    if (reCaptcha) {                                                                                               // 496
        // Updates the current button object                                                                       // 497
        this.options.reCaptcha = _.defaults(reCaptcha, this.options.reCaptcha || {});                              // 498
    }                                                                                                              // 499
                                                                                                                   // 500
    // Possibly sets up texts...                                                                                   // 501
    if (config.texts){                                                                                             // 502
        var texts = config.texts;                                                                                  // 503
        var simpleTexts = _.omit(texts, "button", "errors", "info", "inputIcons", "socialIcons", "title");         // 504
        this.texts = _.defaults(simpleTexts, this.texts);                                                          // 505
                                                                                                                   // 506
        if (texts.button) {                                                                                        // 507
            // Updates the current button object                                                                   // 508
            this.texts.button = _.defaults(texts.button, this.texts.button);                                       // 509
        }                                                                                                          // 510
        if (texts.errors) {                                                                                        // 511
            // Updates the current errors object                                                                   // 512
            this.texts.errors = _.defaults(texts.errors, this.texts.errors);                                       // 513
        }                                                                                                          // 514
        if (texts.info) {                                                                                          // 515
            // Updates the current info object                                                                     // 516
            this.texts.info = _.defaults(texts.info, this.texts.info);                                             // 517
        }                                                                                                          // 518
        if (texts.inputIcons) {                                                                                    // 519
            // Updates the current inputIcons object                                                               // 520
            this.texts.inputIcons = _.defaults(texts.inputIcons, this.texts.inputIcons);                           // 521
        }                                                                                                          // 522
        if (texts.socialIcons) {                                                                                   // 523
            // Updates the current socialIcons object                                                              // 524
            this.texts.socialIcons = _.defaults(texts.socialIcons, this.texts.socialIcons);                        // 525
        }                                                                                                          // 526
        if (texts.title) {                                                                                         // 527
            // Updates the current title object                                                                    // 528
            this.texts.title = _.defaults(texts.title, this.texts.title);                                          // 529
        }                                                                                                          // 530
    }                                                                                                              // 531
};                                                                                                                 // 532
                                                                                                                   // 533
AT.prototype.configureRoute = function(route, options) {                                                           // 534
    check(route, String);                                                                                          // 535
    check(options, Match.OneOf(undefined, ROUTE_PAT));                                                             // 536
    options = _.clone(options);                                                                                    // 537
    // Route Configuration can be done only before initialization                                                  // 538
    if (this._initialized)                                                                                         // 539
        throw new Error("Route Configuration can be done only before AccountsTemplates.init!");                    // 540
    // Only allowed routes can be configured                                                                       // 541
    if (!(route in this.ROUTE_DEFAULT))                                                                            // 542
        throw new Error("Unknown Route!");                                                                         // 543
                                                                                                                   // 544
    // Possibly adds a initial / to the provided path                                                              // 545
    if (options && options.path && options.path[0] !== "/")                                                        // 546
        options.path = "/" + options.path;                                                                         // 547
    // Updates the current configuration                                                                           // 548
    options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);                                                // 549
    this.routes[route] = options;                                                                                  // 550
};                                                                                                                 // 551
                                                                                                                   // 552
AT.prototype.hasField = function(fieldId) {                                                                        // 553
    return !!this.getField(fieldId);                                                                               // 554
};                                                                                                                 // 555
                                                                                                                   // 556
AT.prototype.getField = function(fieldId) {                                                                        // 557
    var field = _.filter(this._fields, function(field){                                                            // 558
        return field._id == fieldId;                                                                               // 559
    });                                                                                                            // 560
    return (field.length === 1) ? field[0] : undefined;                                                            // 561
};                                                                                                                 // 562
                                                                                                                   // 563
AT.prototype.getFields = function() {                                                                              // 564
    return this._fields;                                                                                           // 565
};                                                                                                                 // 566
                                                                                                                   // 567
AT.prototype.getFieldIds = function() {                                                                            // 568
    return _.pluck(this._fields, "_id");                                                                           // 569
};                                                                                                                 // 570
                                                                                                                   // 571
AT.prototype.getRouteName = function(route) {                                                                      // 572
    if (route in this.routes)                                                                                      // 573
        return this.routes[route].name;                                                                            // 574
    return null;                                                                                                   // 575
};                                                                                                                 // 576
                                                                                                                   // 577
AT.prototype.getRoutePath = function(route) {                                                                      // 578
    if (route in this.routes)                                                                                      // 579
        return this.routes[route].path;                                                                            // 580
    return "#";                                                                                                    // 581
};                                                                                                                 // 582
                                                                                                                   // 583
AT.prototype.oauthServices = function(){                                                                           // 584
    // Extracts names of available services                                                                        // 585
    var names;                                                                                                     // 586
    if (Meteor.isServer)                                                                                           // 587
        names = (Accounts.oauth && Accounts.oauth.serviceNames()) || [];                                           // 588
    else                                                                                                           // 589
        names = (Accounts.oauth && Accounts.loginServicesConfigured() && Accounts.oauth.serviceNames()) || [];     // 590
    // Extracts names of configured services                                                                       // 591
    var configuredServices = [];                                                                                   // 592
    if (Accounts.loginServiceConfiguration)                                                                        // 593
        configuredServices = _.pluck(Accounts.loginServiceConfiguration.find().fetch(), "service");                // 594
                                                                                                                   // 595
    // Builds a list of objects containing service name as _id and its configuration status                        // 596
    var services = _.map(names, function(name){                                                                    // 597
        return {                                                                                                   // 598
            _id : name,                                                                                            // 599
            configured: _.contains(configuredServices, name),                                                      // 600
        };                                                                                                         // 601
    });                                                                                                            // 602
                                                                                                                   // 603
    // Checks whether there is a UI to configure services...                                                       // 604
    // XXX: this only works with the accounts-ui package                                                           // 605
    var showUnconfigured = typeof Accounts._loginButtonsSession !== "undefined";                                   // 606
                                                                                                                   // 607
    // Filters out unconfigured services in case they"re not to be displayed                                       // 608
    if (!showUnconfigured){                                                                                        // 609
        services = _.filter(services, function(service){                                                           // 610
            return service.configured;                                                                             // 611
        });                                                                                                        // 612
    }                                                                                                              // 613
                                                                                                                   // 614
    // Sorts services by name                                                                                      // 615
    services = _.sortBy(services, function(service){                                                               // 616
        return service._id;                                                                                        // 617
    });                                                                                                            // 618
                                                                                                                   // 619
    return services;                                                                                               // 620
};                                                                                                                 // 621
                                                                                                                   // 622
AT.prototype.removeField = function(fieldId) {                                                                     // 623
    // Fields can be removed only before initialization                                                            // 624
    if (this._initialized)                                                                                         // 625
        throw new Error("AccountsTemplates.removeField should strictly be called before AccountsTemplates.init!"); // 626
    // Tries to look up the field with given _id                                                                   // 627
    var index = _.indexOf(_.pluck(this._fields, "_id"), fieldId);                                                  // 628
    if (index !== -1)                                                                                              // 629
        return this._fields.splice(index, 1)[0];                                                                   // 630
    else                                                                                                           // 631
        if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, fieldId)))                                        // 632
            throw new Error("A field called " + fieldId + " does not exist!");                                     // 633
};                                                                                                                 // 634
                                                                                                                   // 635
AT.prototype.setupRoutes = function() {                                                                            // 636
    if (Meteor.isServer){                                                                                          // 637
        // Possibly prints a warning in case showForgotPasswordLink is set to true but the route is not configured // 638
        if (AccountsTemplates.options.showForgotPasswordLink && !("forgotPwd" in  AccountsTemplates.routes))       // 639
            console.warn("[AccountsTemplates] WARNING: showForgotPasswordLink set to true, but forgotPwd route is not configured!");
        // Configures "reset password" email link                                                                  // 641
        if ("resetPwd" in AccountsTemplates.routes){                                                               // 642
            var resetPwdPath = AccountsTemplates.routes["resetPwd"].path.substr(1);                                // 643
            Accounts.urls.resetPassword = function(token){                                                         // 644
                return Meteor.absoluteUrl(resetPwdPath + "/" + token);                                             // 645
            };                                                                                                     // 646
        }                                                                                                          // 647
        // Configures "enroll account" email link                                                                  // 648
        if ("enrollAccount" in AccountsTemplates.routes){                                                          // 649
            var enrollAccountPath = AccountsTemplates.routes["enrollAccount"].path.substr(1);                      // 650
            Accounts.urls.enrollAccount = function(token){                                                         // 651
                return Meteor.absoluteUrl(enrollAccountPath + "/" + token);                                        // 652
            };                                                                                                     // 653
        }                                                                                                          // 654
        // Configures "verify email" email link                                                                    // 655
        if ("verifyEmail" in AccountsTemplates.routes){                                                            // 656
            var verifyEmailPath = AccountsTemplates.routes["verifyEmail"].path.substr(1);                          // 657
            Accounts.urls.verifyEmail = function(token){                                                           // 658
                return Meteor.absoluteUrl(verifyEmailPath + "/" + token);                                          // 659
            };                                                                                                     // 660
        }                                                                                                          // 661
    }                                                                                                              // 662
                                                                                                                   // 663
    // Determines the default layout to be used in case no specific one is specified for single routes             // 664
    var defaultLayout = AccountsTemplates.options.defaultLayout || Router.options.layoutTemplate;                  // 665
                                                                                                                   // 666
    _.each(AccountsTemplates.routes, function(options, route){                                                     // 667
        if (route === "ensureSignedIn")                                                                            // 668
            return;                                                                                                // 669
        if (route === "changePwd" && !AccountsTemplates.options.enablePasswordChange)                              // 670
            throw new Error("changePwd route configured but enablePasswordChange set to false!");                  // 671
        if (route === "forgotPwd" && !AccountsTemplates.options.showForgotPasswordLink)                            // 672
            throw new Error("forgotPwd route configured but showForgotPasswordLink set to false!");                // 673
        if (route === "signUp" && AccountsTemplates.options.forbidClientAccountCreation)                           // 674
            throw new Error("signUp route configured but forbidClientAccountCreation set to true!");               // 675
        // Possibly prints a warning in case the MAIL_URL environment variable was not set                         // 676
        //if (Meteor.isServer && route === "forgotPwd" && (!process.env.MAIL_URL || ! Package["email"])){          // 677
        //    console.warn("[AccountsTemplates] WARNING: showForgotPasswordLink set to true, but MAIL_URL is not configured!");
        //}                                                                                                        // 679
                                                                                                                   // 680
        var name = options.name; // Default provided...                                                            // 681
        var path = options.path; // Default provided...                                                            // 682
        var template = options.template || "fullPageAtForm";                                                       // 683
        var layoutTemplate = options.layoutTemplate || defaultLayout;                                              // 684
                                                                                                                   // 685
        // Possibly adds token parameter                                                                           // 686
        if (_.contains(["enrollAccount", "resetPwd", "verifyEmail"], route)){                                      // 687
            path += "/:paramToken";                                                                                // 688
            if (route === "verifyEmail")                                                                           // 689
                Router.route(path, {                                                                               // 690
                    name: name,                                                                                    // 691
                    template: template,                                                                            // 692
                    layoutTemplate: layoutTemplate,                                                                // 693
                    onRun: function() {                                                                            // 694
                        AccountsTemplates.setState(route);                                                         // 695
                        AccountsTemplates.setDisabled(true);                                                       // 696
                        var token = this.params.paramToken;                                                        // 697
                        Accounts.verifyEmail(token, function(error){                                               // 698
                            AccountsTemplates.setDisabled(false);                                                  // 699
                            AccountsTemplates.submitCallback(error, route, function(){                             // 700
                                AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.emailVerified);
                            });                                                                                    // 702
                        });                                                                                        // 703
                                                                                                                   // 704
                        this.next();                                                                               // 705
                    },                                                                                             // 706
                    onStop: function() {                                                                           // 707
                        AccountsTemplates.clearState();                                                            // 708
                    },                                                                                             // 709
                });                                                                                                // 710
            else                                                                                                   // 711
                Router.route(path, {                                                                               // 712
                    name: name,                                                                                    // 713
                    template: template,                                                                            // 714
                    layoutTemplate: layoutTemplate,                                                                // 715
                    onRun: function() {                                                                            // 716
                        AccountsTemplates.paramToken = this.params.paramToken;                                     // 717
                        this.next();                                                                               // 718
                    },                                                                                             // 719
                    onBeforeAction: function() {                                                                   // 720
                        AccountsTemplates.setState(route);                                                         // 721
                        this.next();                                                                               // 722
                    },                                                                                             // 723
                    onStop: function() {                                                                           // 724
                        AccountsTemplates.clearState();                                                            // 725
                        AccountsTemplates.paramToken = null;                                                       // 726
                    }                                                                                              // 727
                });                                                                                                // 728
        }                                                                                                          // 729
        else                                                                                                       // 730
            Router.route(path, {                                                                                   // 731
                name: name,                                                                                        // 732
                template: template,                                                                                // 733
                layoutTemplate: layoutTemplate,                                                                    // 734
                onBeforeAction: function() {                                                                       // 735
                    var redirect = false;                                                                          // 736
                    if (route === 'changePwd') {                                                                   // 737
                      if (!Meteor.loggingIn() && !Meteor.userId()) {                                               // 738
                        redirect = true;                                                                           // 739
                      }                                                                                            // 740
                    }                                                                                              // 741
                    else if (Meteor.userId()) {                                                                    // 742
                        redirect = true;                                                                           // 743
                    }                                                                                              // 744
                    if (redirect) {                                                                                // 745
                        AccountsTemplates.postSubmitRedirect(route);                                               // 746
                        this.stop();                                                                               // 747
                    }                                                                                              // 748
                    else {                                                                                         // 749
                        AccountsTemplates.setState(route);                                                         // 750
                        this.next();                                                                               // 751
                    }                                                                                              // 752
                },                                                                                                 // 753
                onStop: function() {                                                                               // 754
                    AccountsTemplates.clearState();                                                                // 755
                }                                                                                                  // 756
            });                                                                                                    // 757
    });                                                                                                            // 758
};                                                                                                                 // 759
                                                                                                                   // 760
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/useraccounts:core/lib/server.js                                                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// Initialization                                                                                                  // 1
                                                                                                                   // 2
AT.prototype.init = function() {                                                                                   // 3
    console.warn("[AccountsTemplates] There is no more need to call AccountsTemplates.init()! Simply remove the call ;-)");
};                                                                                                                 // 5
                                                                                                                   // 6
AT.prototype._init = function() {                                                                                  // 7
    if (this._initialized)                                                                                         // 8
        return;                                                                                                    // 9
                                                                                                                   // 10
    // Checks there is at least one account service installed                                                      // 11
    if (!Package["accounts-password"] && (!Accounts.oauth || Accounts.oauth.serviceNames().length === 0))          // 12
        throw Error("AccountsTemplates: You must add at least one account service!");                              // 13
                                                                                                                   // 14
    // A password field is strictly required                                                                       // 15
    var password = this.getField("password");                                                                      // 16
    if (!password)                                                                                                 // 17
        throw Error("A password field is strictly required!");                                                     // 18
    if (password.type !== "password")                                                                              // 19
        throw Error("The type of password field should be password!");                                             // 20
                                                                                                                   // 21
    // Then we can have "username" or "email" or even both of them                                                 // 22
    // but at least one of the two is strictly required                                                            // 23
    var username = this.getField("username");                                                                      // 24
    var email = this.getField("email");                                                                            // 25
    if (!username && !email)                                                                                       // 26
        throw Error("At least one field out of username and email is strictly required!");                         // 27
    if (username && !username.required)                                                                            // 28
        throw Error("The username field should be required!");                                                     // 29
    if (email){                                                                                                    // 30
        if (email.type !== "email")                                                                                // 31
            throw Error("The type of email field should be email!");                                               // 32
        if (username){                                                                                             // 33
            // username and email                                                                                  // 34
            if (username.type !== "text")                                                                          // 35
                throw Error("The type of username field should be text when email field is present!");             // 36
        }else{                                                                                                     // 37
            // email only                                                                                          // 38
            if (!email.required)                                                                                   // 39
                throw Error("The email field should be required when username is not present!");                   // 40
        }                                                                                                          // 41
    }                                                                                                              // 42
    else{                                                                                                          // 43
        // username only                                                                                           // 44
        if (username.type !== "text" && username.type !== "tel")                                                   // 45
            throw Error("The type of username field should be text or tel!");                                      // 46
    }                                                                                                              // 47
                                                                                                                   // 48
    // Possibly publish more user data in order to be able to show add/remove                                      // 49
    // buttons for 3rd-party services                                                                              // 50
    if (this.options.showAddRemoveServices){                                                                       // 51
        // Publish additional current user info to get the list of registered services                             // 52
        // XXX TODO: use                                                                                           // 53
        // Accounts.addAutopublishFields({                                                                         // 54
        //   forLoggedInUser: ['services.facebook'],                                                               // 55
        //   forOtherUsers: [],                                                                                    // 56
        // })                                                                                                      // 57
        // ...adds only user.services.*.id                                                                         // 58
        Meteor.publish("userRegisteredServices", function() {                                                      // 59
            var userId = this.userId;                                                                              // 60
            return Meteor.users.find(userId, {fields: {services: 1}});                                             // 61
            /*                                                                                                     // 62
            if (userId){                                                                                           // 63
                var user = Meteor.users.findOne(userId);                                                           // 64
                var services_id = _.chain(user.services)                                                           // 65
                    .keys()                                                                                        // 66
                    .reject(function(service){return service === "resume";})                                       // 67
                    .map(function(service){return "services." + service + ".id";})                                 // 68
                    .value();                                                                                      // 69
                var projection = {};                                                                               // 70
                _.each(services_id, function(key){projection[key] = 1;});                                          // 71
                return Meteor.users.find(userId, {fields: projection});                                            // 72
            }                                                                                                      // 73
            */                                                                                                     // 74
        });                                                                                                        // 75
    }                                                                                                              // 76
                                                                                                                   // 77
    // Security stuff                                                                                              // 78
    if (this.options.overrideLoginErrors){                                                                         // 79
        Accounts.validateLoginAttempt(function(attempt){                                                           // 80
            if (attempt.error){                                                                                    // 81
                var reason = attempt.error.reason;                                                                 // 82
                if (reason === "User not found" || reason === "Incorrect password")                                // 83
                    throw new Meteor.Error(403, AccountsTemplates.texts.errors.loginForbidden);                    // 84
            }                                                                                                      // 85
            return attempt.allowed;                                                                                // 86
        });                                                                                                        // 87
    }                                                                                                              // 88
                                                                                                                   // 89
    if (this.options.sendVerificationEmail && this.options.enforceEmailVerification){                              // 90
        Accounts.validateLoginAttempt(function(info){                                                              // 91
            if (info.type !== "password" || info.methodName !== "login")                                           // 92
                return true;                                                                                       // 93
            var user = info.user;                                                                                  // 94
            if (!user)                                                                                             // 95
                return true;                                                                                       // 96
            var ok = true;                                                                                         // 97
            var loginEmail = info.methodArguments[0].user.email;                                                   // 98
            if (loginEmail){                                                                                       // 99
              var email = _.filter(user.emails, function(obj){                                                     // 100
                  return obj.address === loginEmail;                                                               // 101
              });                                                                                                  // 102
              if (!email.length || !email[0].verified)                                                             // 103
                  ok = false;                                                                                      // 104
            }                                                                                                      // 105
            else {                                                                                                 // 106
              // we got the username, lets check there's at lease one verified email                               // 107
              var emailVerified = _.chain(user.emails)                                                             // 108
                .pluck('verified')                                                                                 // 109
                .any()                                                                                             // 110
                .value();                                                                                          // 111
              if (!emailVerified)                                                                                  // 112
                ok = false;                                                                                        // 113
            }                                                                                                      // 114
            if (!ok)                                                                                               // 115
              throw new Meteor.Error(401, AccountsTemplates.texts.errors.verifyEmailFirst);                        // 116
            return true;                                                                                           // 117
        });                                                                                                        // 118
    }                                                                                                              // 119
                                                                                                                   // 120
    //Check that reCaptcha secret keys are available                                                               // 121
    if (this.options.showReCaptcha) {                                                                              // 122
        var atSecretKey = AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey;    // 123
        var settingsSecretKey = Meteor.settings.reCaptcha && Meteor.settings.reCaptcha.secretKey;                  // 124
                                                                                                                   // 125
        if (!atSecretKey && !settingsSecretKey) {                                                                  // 126
            throw new Meteor.Error(401, "User Accounts: reCaptcha secret key not found! Please provide it or set showReCaptcha to false." );
        }                                                                                                          // 128
    }                                                                                                              // 129
                                                                                                                   // 130
    // ------------                                                                                                // 131
    // Server-Side Routes Definition                                                                               // 132
    //                                                                                                             // 133
    //   this allows for server-side iron-router usage, like, e.g.                                                 // 134
    //   Router.map(function(){                                                                                    // 135
    //       this.route("fullPageSigninForm", {                                                                    // 136
    //           path: "*",                                                                                        // 137
    //           where: "server"                                                                                   // 138
    //           action: function() {                                                                              // 139
    //               this.response.statusCode = 404;                                                               // 140
    //               return this.response.end(Handlebars.templates["404"]());                                      // 141
    //           }                                                                                                 // 142
    //       });                                                                                                   // 143
    //   })                                                                                                        // 144
    // ------------                                                                                                // 145
    AccountsTemplates.setupRoutes();                                                                               // 146
                                                                                                                   // 147
    // Marks AccountsTemplates as initialized                                                                      // 148
    this._initialized = true;                                                                                      // 149
};                                                                                                                 // 150
                                                                                                                   // 151
                                                                                                                   // 152
// Fake server-side IR plugin to allow for shared routing files                                                    // 153
Iron.Router.plugins.ensureSignedIn = function (router, options) {};                                                // 154
                                                                                                                   // 155
                                                                                                                   // 156
AccountsTemplates = new AT();                                                                                      // 157
                                                                                                                   // 158
                                                                                                                   // 159
// Client side account creation is disabled by default:                                                            // 160
// the methos ATCreateUserServer is used instead!                                                                  // 161
// to actually disable client side account creation use:                                                           // 162
//                                                                                                                 // 163
//    AccountsTemplates.config({                                                                                   // 164
//        forbidClientAccountCreation: true                                                                        // 165
//    });                                                                                                          // 166
Accounts.config({                                                                                                  // 167
    forbidClientAccountCreation: true                                                                              // 168
});                                                                                                                // 169
                                                                                                                   // 170
                                                                                                                   // 171
// Initialization                                                                                                  // 172
Meteor.startup(function(){                                                                                         // 173
    AccountsTemplates._init();                                                                                     // 174
});                                                                                                                // 175
                                                                                                                   // 176
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/useraccounts:core/lib/methods.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
                                                                                                                   // 1
Meteor.methods({                                                                                                   // 2
    ATRemoveService: function(service_name){                                                                       // 3
        var userId = this.userId;                                                                                  // 4
        if (userId){                                                                                               // 5
            var user = Meteor.users.findOne(userId);                                                               // 6
            var numServices = _.keys(user.services).length; // including "resume"                                  // 7
            if (numServices === 2)                                                                                 // 8
                throw new Meteor.Error(403, AccountsTemplates.texts.errors.cannotRemoveService, {});               // 9
            var unset = {};                                                                                        // 10
            unset["services." + service_name] = "";                                                                // 11
            Meteor.users.update(userId, {$unset: unset});                                                          // 12
        }                                                                                                          // 13
    },                                                                                                             // 14
});                                                                                                                // 15
                                                                                                                   // 16
                                                                                                                   // 17
if (Meteor.isServer) {                                                                                             // 18
    Meteor.methods({                                                                                               // 19
        ATCreateUserServer: function(options){                                                                     // 20
            if (AccountsTemplates.options.forbidClientAccountCreation)                                             // 21
                throw new Meteor.Error(403, AccountsTemplates.texts.errors.accountsCreationDisabled);              // 22
            // createUser() does more checking.                                                                    // 23
            check(options, Object);                                                                                // 24
            var allFieldIds = AccountsTemplates.getFieldIds();                                                     // 25
            // Picks-up whitelisted fields for profile                                                             // 26
            var profile = options.profile;                                                                         // 27
            profile = _.pick(profile, allFieldIds);                                                                // 28
            profile = _.omit(profile, "username", "email", "password");                                            // 29
            // Validates fields" value                                                                             // 30
            var signupInfo = _.clone(profile);                                                                     // 31
            if (options.username) {                                                                                // 32
                signupInfo.username = options.username;                                                            // 33
                                                                                                                   // 34
                if (AccountsTemplates.options.lowercaseUsername) {                                                 // 35
                  signupInfo.username = signupInfo.username.trim().replace(/\s+/gm, ' ');                          // 36
                  options.profile.username = signupInfo.username;                                                  // 37
                  signupInfo.username = signupInfo.username.toLowerCase().replace(/\s+/gm, '');                    // 38
                  options.username = signupInfo.username                                                           // 39
                }                                                                                                  // 40
            }                                                                                                      // 41
            if (options.email) {                                                                                   // 42
                signupInfo.email = options.email;                                                                  // 43
                                                                                                                   // 44
                if (AccountsTemplates.options.lowercaseUsername) {                                                 // 45
                  signupInfo.email = signupInfo.email.toLowerCase().replace(/\s+/gm, '');                          // 46
                  options.email = signupInfo.email                                                                 // 47
                }                                                                                                  // 48
            }                                                                                                      // 49
            if (options.password)                                                                                  // 50
                signupInfo.password = options.password;                                                            // 51
            var validationErrors = {};                                                                             // 52
            var someError = false;                                                                                 // 53
                                                                                                                   // 54
            // Validates fields values                                                                             // 55
            _.each(AccountsTemplates.getFields(), function(field){                                                 // 56
                var fieldId = field._id;                                                                           // 57
                var value = signupInfo[fieldId];                                                                   // 58
                if (fieldId === "password"){                                                                       // 59
                    // Can"t Pick-up password here                                                                 // 60
                    // NOTE: at this stage the password is already encripted,                                      // 61
                    //       so there is no way to validate it!!!                                                  // 62
                    check(value, Object);                                                                          // 63
                    return;                                                                                        // 64
                }                                                                                                  // 65
                var validationErr = field.validate(value, "strict");                                               // 66
                if (validationErr) {                                                                               // 67
                    validationErrors[fieldId] = validationErr;                                                     // 68
                    someError = true;                                                                              // 69
                }                                                                                                  // 70
            });                                                                                                    // 71
                                                                                                                   // 72
            if (AccountsTemplates.options.showReCaptcha) {                                                         // 73
                var secretKey = null;                                                                              // 74
                                                                                                                   // 75
                if (AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey) {        // 76
                    secretKey = AccountsTemplates.options.reCaptcha.secretKey;                                     // 77
                }                                                                                                  // 78
                else {                                                                                             // 79
                    secretKey = Meteor.settings.reCaptcha.secretKey;                                               // 80
                }                                                                                                  // 81
                                                                                                                   // 82
                var apiResponse = HTTP.post("https://www.google.com/recaptcha/api/siteverify", {                   // 83
                  params: {                                                                                        // 84
                      secret: secretKey,                                                                           // 85
                      response: options.profile.reCaptchaResponse,                                                 // 86
                      remoteip: this.connection.clientAddress,                                                     // 87
                  }                                                                                                // 88
                }).data;                                                                                           // 89
                                                                                                                   // 90
                if (!apiResponse.success) {                                                                        // 91
                    throw new Meteor.Error(403, AccountsTemplates.texts.errors.captchaVerification,                // 92
                      apiResponse['error-codes'] ? apiResponse['error-codes'].join(", ") : "Unknown Error.");      // 93
                }                                                                                                  // 94
            }                                                                                                      // 95
                                                                                                                   // 96
            if (someError)                                                                                         // 97
                throw new Meteor.Error(403, AccountsTemplates.texts.errors.validationErrors, validationErrors);    // 98
                                                                                                                   // 99
            // Possibly removes the profile field                                                                  // 100
            if (_.isEmpty(options.profile))                                                                        // 101
                delete options.profile;                                                                            // 102
                                                                                                                   // 103
            // Create user. result contains id and token.                                                          // 104
            var userId = Accounts.createUser(options);                                                             // 105
            // safety belt. createUser is supposed to throw on error. send 500 error                               // 106
            // instead of sending a verification email with empty userid.                                          // 107
            if (! userId)                                                                                          // 108
                throw new Error("createUser failed to insert new user");                                           // 109
                                                                                                                   // 110
            // Send a email address verification email in case the context permits it                              // 111
            // and the specific configuration flag was set to true                                                 // 112
            if (options.email && AccountsTemplates.options.sendVerificationEmail)                                  // 113
                Accounts.sendVerificationEmail(userId, options.email);                                             // 114
        },                                                                                                         // 115
                                                                                                                   // 116
        // Resend a user's verification e-mail                                                                     // 117
        ATResendVerificationEmail: function (email) {                                                              // 118
            check(email, String);                                                                                  // 119
                                                                                                                   // 120
            var user = Meteor.users.findOne({ "emails.address": email });                                          // 121
                                                                                                                   // 122
            // Send the standard error back to the client if no user exist with this e-mail                        // 123
            if (!user)                                                                                             // 124
                throw new Meteor.Error(403, "User not found");                                                     // 125
                                                                                                                   // 126
            try {                                                                                                  // 127
                Accounts.sendVerificationEmail(user._id);                                                          // 128
            }                                                                                                      // 129
            catch (error) {                                                                                        // 130
                // Handle error when email already verified                                                        // 131
                // https://github.com/dwinston/send-verification-email-bug                                         // 132
                throw new Meteor.Error(403, "Already verified");                                                   // 133
            }                                                                                                      // 134
        },                                                                                                         // 135
    });                                                                                                            // 136
}                                                                                                                  // 137
                                                                                                                   // 138
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['useraccounts:core'] = {
  AccountsTemplates: AccountsTemplates
};

})();

//# sourceMappingURL=useraccounts_core.js.map
