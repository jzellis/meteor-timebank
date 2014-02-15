//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;

(function () {

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// packages/accounts-password/password_client.js                                  //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
// Attempt to log in with a password.                                             // 1
//                                                                                // 2
// @param selector {String|Object} One of the following:                          // 3
//   - {username: (username)}                                                     // 4
//   - {email: (email)}                                                           // 5
//   - a string which may be a username or email, depending on whether            // 6
//     it contains "@".                                                           // 7
// @param password {String}                                                       // 8
// @param callback {Function(error|undefined)}                                    // 9
Meteor.loginWithPassword = function (selector, password, callback) {              // 10
  var srp = new SRP.Client(password);                                             // 11
  var request = srp.startExchange();                                              // 12
                                                                                  // 13
  if (typeof selector === 'string')                                               // 14
    if (selector.indexOf('@') === -1)                                             // 15
      selector = {username: selector};                                            // 16
    else                                                                          // 17
      selector = {email: selector};                                               // 18
                                                                                  // 19
  request.user = selector;                                                        // 20
                                                                                  // 21
  // Normally, we only set Meteor.loggingIn() to true within                      // 22
  // Accounts.callLoginMethod, but we'd also like it to be true during the        // 23
  // password exchange. So we set it to true here, and clear it on error; in      // 24
  // the non-error case, it gets cleared by callLoginMethod.                      // 25
  Accounts._setLoggingIn(true);                                                   // 26
  Meteor.apply('beginPasswordExchange', [request], function (error, result) {     // 27
    if (error || !result) {                                                       // 28
      Accounts._setLoggingIn(false);                                              // 29
      error = error || new Error("No result from call to beginPasswordExchange"); // 30
      callback && callback(error);                                                // 31
      return;                                                                     // 32
    }                                                                             // 33
                                                                                  // 34
    var response = srp.respondToChallenge(result);                                // 35
    Accounts.callLoginMethod({                                                    // 36
      methodArguments: [{srp: response}],                                         // 37
      validateResult: function (result) {                                         // 38
        if (!srp.verifyConfirmation({HAMK: result.HAMK}))                         // 39
          throw new Error("Server is cheating!");                                 // 40
      },                                                                          // 41
      userCallback: callback});                                                   // 42
  });                                                                             // 43
};                                                                                // 44
                                                                                  // 45
                                                                                  // 46
// Attempt to log in as a new user.                                               // 47
Accounts.createUser = function (options, callback) {                              // 48
  options = _.clone(options); // we'll be modifying options                       // 49
                                                                                  // 50
  if (!options.password)                                                          // 51
    throw new Error("Must set options.password");                                 // 52
  var verifier = SRP.generateVerifier(options.password);                          // 53
  // strip old password, replacing with the verifier object                       // 54
  delete options.password;                                                        // 55
  options.srp = verifier;                                                         // 56
                                                                                  // 57
  Accounts.callLoginMethod({                                                      // 58
    methodName: 'createUser',                                                     // 59
    methodArguments: [options],                                                   // 60
    userCallback: callback                                                        // 61
  });                                                                             // 62
};                                                                                // 63
                                                                                  // 64
                                                                                  // 65
                                                                                  // 66
// Change password. Must be logged in.                                            // 67
//                                                                                // 68
// @param oldPassword {String|null} By default servers no longer allow            // 69
//   changing password without the old password, but they could so we             // 70
//   support passing no password to the server and letting it decide.             // 71
// @param newPassword {String}                                                    // 72
// @param callback {Function(error|undefined)}                                    // 73
Accounts.changePassword = function (oldPassword, newPassword, callback) {         // 74
  if (!Meteor.user()) {                                                           // 75
    callback && callback(new Error("Must be logged in to change password."));     // 76
    return;                                                                       // 77
  }                                                                               // 78
                                                                                  // 79
  var verifier = SRP.generateVerifier(newPassword);                               // 80
                                                                                  // 81
  if (!oldPassword) {                                                             // 82
    Meteor.apply('changePassword', [{srp: verifier}], function (error, result) {  // 83
      if (error || !result) {                                                     // 84
        callback && callback(                                                     // 85
          error || new Error("No result from changePassword."));                  // 86
      } else {                                                                    // 87
        callback && callback();                                                   // 88
      }                                                                           // 89
    });                                                                           // 90
  } else { // oldPassword                                                         // 91
    var srp = new SRP.Client(oldPassword);                                        // 92
    var request = srp.startExchange();                                            // 93
    request.user = {id: Meteor.user()._id};                                       // 94
    Meteor.apply('beginPasswordExchange', [request], function (error, result) {   // 95
      if (error || !result) {                                                     // 96
        callback && callback(                                                     // 97
          error || new Error("No result from call to beginPasswordExchange"));    // 98
        return;                                                                   // 99
      }                                                                           // 100
                                                                                  // 101
      var response = srp.respondToChallenge(result);                              // 102
      response.srp = verifier;                                                    // 103
      Meteor.apply('changePassword', [response], function (error, result) {       // 104
        if (error || !result) {                                                   // 105
          callback && callback(                                                   // 106
            error || new Error("No result from changePassword."));                // 107
        } else {                                                                  // 108
          if (!srp.verifyConfirmation(result)) {                                  // 109
            // Monkey business!                                                   // 110
            callback && callback(new Error("Old password verification failed.")); // 111
          } else {                                                                // 112
            callback && callback();                                               // 113
          }                                                                       // 114
        }                                                                         // 115
      });                                                                         // 116
    });                                                                           // 117
  }                                                                               // 118
};                                                                                // 119
                                                                                  // 120
// Sends an email to a user with a link that can be used to reset                 // 121
// their password                                                                 // 122
//                                                                                // 123
// @param options {Object}                                                        // 124
//   - email: (email)                                                             // 125
// @param callback (optional) {Function(error|undefined)}                         // 126
Accounts.forgotPassword = function(options, callback) {                           // 127
  if (!options.email)                                                             // 128
    throw new Error("Must pass options.email");                                   // 129
  Meteor.call("forgotPassword", options, callback);                               // 130
};                                                                                // 131
                                                                                  // 132
// Resets a password based on a token originally created by                       // 133
// Accounts.forgotPassword, and then logs in the matching user.                   // 134
//                                                                                // 135
// @param token {String}                                                          // 136
// @param newPassword {String}                                                    // 137
// @param callback (optional) {Function(error|undefined)}                         // 138
Accounts.resetPassword = function(token, newPassword, callback) {                 // 139
  if (!token)                                                                     // 140
    throw new Error("Need to pass token");                                        // 141
  if (!newPassword)                                                               // 142
    throw new Error("Need to pass newPassword");                                  // 143
                                                                                  // 144
  var verifier = SRP.generateVerifier(newPassword);                               // 145
  Accounts.callLoginMethod({                                                      // 146
    methodName: 'resetPassword',                                                  // 147
    methodArguments: [token, verifier],                                           // 148
    userCallback: callback});                                                     // 149
};                                                                                // 150
                                                                                  // 151
// Verifies a user's email address based on a token originally                    // 152
// created by Accounts.sendVerificationEmail                                      // 153
//                                                                                // 154
// @param token {String}                                                          // 155
// @param callback (optional) {Function(error|undefined)}                         // 156
Accounts.verifyEmail = function(token, callback) {                                // 157
  if (!token)                                                                     // 158
    throw new Error("Need to pass token");                                        // 159
                                                                                  // 160
  Accounts.callLoginMethod({                                                      // 161
    methodName: 'verifyEmail',                                                    // 162
    methodArguments: [token],                                                     // 163
    userCallback: callback});                                                     // 164
};                                                                                // 165
                                                                                  // 166
////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=7194b16ddb1435bc72cb2308aab74d326cf082ff.map
