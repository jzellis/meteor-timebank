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
var SHA256 = Package.sha.SHA256;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/accounts-password/password_client.js                                 //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// Attempt to log in with a password.                                            // 1
//                                                                               // 2
// @param selector {String|Object} One of the following:                         // 3
//   - {username: (username)}                                                    // 4
//   - {email: (email)}                                                          // 5
//   - a string which may be a username or email, depending on whether           // 6
//     it contains "@".                                                          // 7
// @param password {String}                                                      // 8
// @param callback {Function(error|undefined)}                                   // 9
Meteor.loginWithPassword = function (selector, password, callback) {             // 10
  if (typeof selector === 'string')                                              // 11
    if (selector.indexOf('@') === -1)                                            // 12
      selector = {username: selector};                                           // 13
    else                                                                         // 14
      selector = {email: selector};                                              // 15
                                                                                 // 16
  Accounts.callLoginMethod({                                                     // 17
    methodArguments: [{                                                          // 18
      user: selector,                                                            // 19
      password: hashPassword(password)                                           // 20
    }],                                                                          // 21
    userCallback: function (error, result) {                                     // 22
      if (error && error.error === 400 &&                                        // 23
          error.reason === 'old password format') {                              // 24
        // The "reason" string should match the error thrown in the              // 25
        // password login handler in password_server.js.                         // 26
                                                                                 // 27
        // XXX COMPAT WITH 0.8.1.3                                               // 28
        // If this user's last login was with a previous version of              // 29
        // Meteor that used SRP, then the server throws this error to            // 30
        // indicate that we should try again. The error includes the             // 31
        // user's SRP identity. We provide a value derived from the              // 32
        // identity and the password to prove to the server that we know         // 33
        // the password without requiring a full SRP flow, as well as            // 34
        // SHA256(password), which the server bcrypts and stores in              // 35
        // place of the old SRP information for this user.                       // 36
        srpUpgradePath({                                                         // 37
          upgradeError: error,                                                   // 38
          userSelector: selector,                                                // 39
          plaintextPassword: password                                            // 40
        }, callback);                                                            // 41
      }                                                                          // 42
      else if (error) {                                                          // 43
        callback(error);                                                         // 44
      } else {                                                                   // 45
        callback();                                                              // 46
      }                                                                          // 47
    }                                                                            // 48
  });                                                                            // 49
};                                                                               // 50
                                                                                 // 51
var hashPassword = function (password) {                                         // 52
  return {                                                                       // 53
    digest: SHA256(password),                                                    // 54
    algorithm: "sha-256"                                                         // 55
  };                                                                             // 56
};                                                                               // 57
                                                                                 // 58
// XXX COMPAT WITH 0.8.1.3                                                       // 59
// The server requested an upgrade from the old SRP password format,             // 60
// so supply the needed SRP identity to login. Options:                          // 61
//   - upgradeError: the error object that the server returned to tell           // 62
//     us to upgrade from SRP to bcrypt.                                         // 63
//   - userSelector: selector to retrieve the user object                        // 64
//   - plaintextPassword: the password as a string                               // 65
var srpUpgradePath = function (options, callback) {                              // 66
  var details;                                                                   // 67
  try {                                                                          // 68
    details = EJSON.parse(options.upgradeError.details);                         // 69
  } catch (e) {}                                                                 // 70
  if (!(details && details.format === 'srp')) {                                  // 71
    callback(new Meteor.Error(400,                                               // 72
                              "Password is old. Please reset your " +            // 73
                              "password."));                                     // 74
  } else {                                                                       // 75
    Accounts.callLoginMethod({                                                   // 76
      methodArguments: [{                                                        // 77
        user: options.userSelector,                                              // 78
        srp: SHA256(details.identity + ":" + options.plaintextPassword),         // 79
        password: hashPassword(options.plaintextPassword)                        // 80
      }],                                                                        // 81
      userCallback: callback                                                     // 82
    });                                                                          // 83
  }                                                                              // 84
};                                                                               // 85
                                                                                 // 86
                                                                                 // 87
// Attempt to log in as a new user.                                              // 88
Accounts.createUser = function (options, callback) {                             // 89
  options = _.clone(options); // we'll be modifying options                      // 90
                                                                                 // 91
  if (!options.password)                                                         // 92
    throw new Error("Must set options.password");                                // 93
                                                                                 // 94
  // Replace password with the hashed password.                                  // 95
  options.password = hashPassword(options.password);                             // 96
                                                                                 // 97
  Accounts.callLoginMethod({                                                     // 98
    methodName: 'createUser',                                                    // 99
    methodArguments: [options],                                                  // 100
    userCallback: callback                                                       // 101
  });                                                                            // 102
};                                                                               // 103
                                                                                 // 104
                                                                                 // 105
                                                                                 // 106
// Change password. Must be logged in.                                           // 107
//                                                                               // 108
// @param oldPassword {String|null} By default servers no longer allow           // 109
//   changing password without the old password, but they could so we            // 110
//   support passing no password to the server and letting it decide.            // 111
// @param newPassword {String}                                                   // 112
// @param callback {Function(error|undefined)}                                   // 113
Accounts.changePassword = function (oldPassword, newPassword, callback) {        // 114
  if (!Meteor.user()) {                                                          // 115
    callback && callback(new Error("Must be logged in to change password."));    // 116
    return;                                                                      // 117
  }                                                                              // 118
                                                                                 // 119
  Accounts.connection.apply(                                                     // 120
    'changePassword',                                                            // 121
    [oldPassword ? hashPassword(oldPassword) : null, hashPassword(newPassword)], // 122
    function (error, result) {                                                   // 123
      if (error || !result) {                                                    // 124
        if (error && error.error === 400 &&                                      // 125
            error.reason === 'old password format') {                            // 126
          // XXX COMPAT WITH 0.8.1.3                                             // 127
          // The server is telling us to upgrade from SRP to bcrypt, as          // 128
          // in Meteor.loginWithPassword.                                        // 129
          srpUpgradePath({                                                       // 130
            upgradeError: error,                                                 // 131
            userSelector: { id: Meteor.userId() },                               // 132
            plaintextPassword: oldPassword                                       // 133
          }, function (err) {                                                    // 134
            if (err) {                                                           // 135
              callback(err);                                                     // 136
            } else {                                                             // 137
              // Now that we've successfully migrated from srp to                // 138
              // bcrypt, try changing the password again.                        // 139
              Accounts.changePassword(oldPassword, newPassword, callback);       // 140
            }                                                                    // 141
          });                                                                    // 142
        } else {                                                                 // 143
          // A normal error, not an error telling us to upgrade to bcrypt        // 144
          callback && callback(                                                  // 145
            error || new Error("No result from changePassword."));               // 146
        }                                                                        // 147
      } else {                                                                   // 148
        callback && callback();                                                  // 149
      }                                                                          // 150
    }                                                                            // 151
  );                                                                             // 152
};                                                                               // 153
                                                                                 // 154
// Sends an email to a user with a link that can be used to reset                // 155
// their password                                                                // 156
//                                                                               // 157
// @param options {Object}                                                       // 158
//   - email: (email)                                                            // 159
// @param callback (optional) {Function(error|undefined)}                        // 160
Accounts.forgotPassword = function(options, callback) {                          // 161
  if (!options.email)                                                            // 162
    throw new Error("Must pass options.email");                                  // 163
  Accounts.connection.call("forgotPassword", options, callback);                 // 164
};                                                                               // 165
                                                                                 // 166
// Resets a password based on a token originally created by                      // 167
// Accounts.forgotPassword, and then logs in the matching user.                  // 168
//                                                                               // 169
// @param token {String}                                                         // 170
// @param newPassword {String}                                                   // 171
// @param callback (optional) {Function(error|undefined)}                        // 172
Accounts.resetPassword = function(token, newPassword, callback) {                // 173
  if (!token)                                                                    // 174
    throw new Error("Need to pass token");                                       // 175
  if (!newPassword)                                                              // 176
    throw new Error("Need to pass newPassword");                                 // 177
                                                                                 // 178
  Accounts.callLoginMethod({                                                     // 179
    methodName: 'resetPassword',                                                 // 180
    methodArguments: [token, hashPassword(newPassword)],                         // 181
    userCallback: callback});                                                    // 182
};                                                                               // 183
                                                                                 // 184
// Verifies a user's email address based on a token originally                   // 185
// created by Accounts.sendVerificationEmail                                     // 186
//                                                                               // 187
// @param token {String}                                                         // 188
// @param callback (optional) {Function(error|undefined)}                        // 189
Accounts.verifyEmail = function(token, callback) {                               // 190
  if (!token)                                                                    // 191
    throw new Error("Need to pass token");                                       // 192
                                                                                 // 193
  Accounts.callLoginMethod({                                                     // 194
    methodName: 'verifyEmail',                                                   // 195
    methodArguments: [token],                                                    // 196
    userCallback: callback});                                                    // 197
};                                                                               // 198
                                                                                 // 199
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=1c04ffd0d48e07e29c6ac91b93835592b9d3f4e8.map
