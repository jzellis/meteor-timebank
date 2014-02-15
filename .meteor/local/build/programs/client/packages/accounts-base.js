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
var _ = Package.underscore._;
var Deps = Package.deps.Deps;
var Random = Package.random.Random;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var DDP = Package.livedata.DDP;

/* Package-scope variables */
var Accounts, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS, getTokenLifetimeMs, autoLoginEnabled, makeClientLoggedOut, makeClientLoggedIn, storeLoginToken, unstoreLoginToken, storedLoginToken, storedLoginTokenExpires;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/accounts-base/accounts_common.js                                            //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
Accounts = {};                                                                          // 1
                                                                                        // 2
// Currently this is read directly by packages like accounts-password                   // 3
// and accounts-ui-unstyled.                                                            // 4
Accounts._options = {};                                                                 // 5
                                                                                        // 6
// how long (in days) until a login token expires                                       // 7
var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;                                                 // 8
// Clients don't try to auto-login with a token that is going to expire within          // 9
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.           // 10
// Tries to avoid abrupt disconnects from expiring tokens.                              // 11
var MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour                                     // 12
// how often (in milliseconds) we check for expired tokens                              // 13
EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000; // 10 minutes                                   // 14
// how long we wait before logging out clients when Meteor.logoutOtherClients is        // 15
// called                                                                               // 16
CONNECTION_CLOSE_DELAY_MS = 10 * 1000;                                                  // 17
                                                                                        // 18
// Set up config for the accounts system. Call this on both the client                  // 19
// and the server.                                                                      // 20
//                                                                                      // 21
// XXX we should add some enforcement that this is called on both the                   // 22
// client and the server. Otherwise, a user can                                         // 23
// 'forbidClientAccountCreation' only on the client and while it looks                  // 24
// like their app is secure, the server will still accept createUser                    // 25
// calls. https://github.com/meteor/meteor/issues/828                                   // 26
//                                                                                      // 27
// @param options {Object} an object with fields:                                       // 28
// - sendVerificationEmail {Boolean}                                                    // 29
//     Send email address verification emails to new users created from                 // 30
//     client signups.                                                                  // 31
// - forbidClientAccountCreation {Boolean}                                              // 32
//     Do not allow clients to create accounts directly.                                // 33
// - restrictCreationByEmailDomain {Function or String}                                 // 34
//     Require created users to have an email matching the function or                  // 35
//     having the string as domain.                                                     // 36
// - loginExpirationInDays {Number}                                                     // 37
//     Number of days since login until a user is logged out (login token               // 38
//     expires).                                                                        // 39
//                                                                                      // 40
Accounts.config = function(options) {                                                   // 41
  // We don't want users to accidentally only call Accounts.config on the               // 42
  // client, where some of the options will have partial effects (eg removing           // 43
  // the "create account" button from accounts-ui if forbidClientAccountCreation        // 44
  // is set, or redirecting Google login to a specific-domain page) without             // 45
  // having their full effects.                                                         // 46
  if (Meteor.isServer) {                                                                // 47
    __meteor_runtime_config__.accountsConfigCalled = true;                              // 48
  } else if (!__meteor_runtime_config__.accountsConfigCalled) {                         // 49
    // XXX would be nice to "crash" the client and replace the UI with an error         // 50
    // message, but there's no trivial way to do this.                                  // 51
    Meteor._debug("Accounts.config was called on the client but not on the " +          // 52
                  "server; some configuration options may not take effect.");           // 53
  }                                                                                     // 54
                                                                                        // 55
  // validate option keys                                                               // 56
  var VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation",             // 57
                    "restrictCreationByEmailDomain", "loginExpirationInDays"];          // 58
  _.each(_.keys(options), function (key) {                                              // 59
    if (!_.contains(VALID_KEYS, key)) {                                                 // 60
      throw new Error("Accounts.config: Invalid key: " + key);                          // 61
    }                                                                                   // 62
  });                                                                                   // 63
                                                                                        // 64
  // set values in Accounts._options                                                    // 65
  _.each(VALID_KEYS, function (key) {                                                   // 66
    if (key in options) {                                                               // 67
      if (key in Accounts._options) {                                                   // 68
        throw new Error("Can't set `" + key + "` more than once");                      // 69
      } else {                                                                          // 70
        Accounts._options[key] = options[key];                                          // 71
      }                                                                                 // 72
    }                                                                                   // 73
  });                                                                                   // 74
                                                                                        // 75
  // If the user set loginExpirationInDays to null, then we need to clear the           // 76
  // timer that periodically expires tokens.                                            // 77
  if (Meteor.isServer)                                                                  // 78
    maybeStopExpireTokensInterval();                                                    // 79
};                                                                                      // 80
                                                                                        // 81
// Users table. Don't use the normal autopublish, since we want to hide                 // 82
// some fields. Code to autopublish this is in accounts_server.js.                      // 83
// XXX Allow users to configure this collection name.                                   // 84
//                                                                                      // 85
Meteor.users = new Meteor.Collection("users", {_preventAutopublish: true});             // 86
// There is an allow call in accounts_server that restricts this                        // 87
// collection.                                                                          // 88
                                                                                        // 89
// loginServiceConfiguration and ConfigError are maintained for backwards compatibility // 90
Accounts.loginServiceConfiguration = ServiceConfiguration.configurations;               // 91
Accounts.ConfigError = ServiceConfiguration.ConfigError;                                // 92
                                                                                        // 93
// Thrown when the user cancels the login process (eg, closes an oauth                  // 94
// popup, declines retina scan, etc)                                                    // 95
Accounts.LoginCancelledError = function(description) {                                  // 96
  this.message = description;                                                           // 97
};                                                                                      // 98
                                                                                        // 99
// This is used to transmit specific subclass errors over the wire. We should           // 100
// come up with a more generic way to do this (eg, with some sort of symbolic           // 101
// error code rather than a number).                                                    // 102
Accounts.LoginCancelledError.numericError = 0x8acdc2f;                                  // 103
Accounts.LoginCancelledError.prototype = new Error();                                   // 104
Accounts.LoginCancelledError.prototype.name = 'Accounts.LoginCancelledError';           // 105
                                                                                        // 106
getTokenLifetimeMs = function () {                                                      // 107
  return (Accounts._options.loginExpirationInDays ||                                    // 108
          DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;                         // 109
};                                                                                      // 110
                                                                                        // 111
Accounts._tokenExpiration = function (when) {                                           // 112
  // We pass when through the Date constructor for backwards compatibility;             // 113
  // `when` used to be a number.                                                        // 114
  return new Date((new Date(when)).getTime() + getTokenLifetimeMs());                   // 115
};                                                                                      // 116
                                                                                        // 117
Accounts._tokenExpiresSoon = function (when) {                                          // 118
  var minLifetimeMs = .1 * getTokenLifetimeMs();                                        // 119
  var minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;                            // 120
  if (minLifetimeMs > minLifetimeCapMs)                                                 // 121
    minLifetimeMs = minLifetimeCapMs;                                                   // 122
  return new Date() > (new Date(when) - minLifetimeMs);                                 // 123
};                                                                                      // 124
                                                                                        // 125
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/accounts-base/url_client.js                                                 //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
autoLoginEnabled = true;                                                                // 1
                                                                                        // 2
// reads a reset password token from the url's hash fragment, if it's                   // 3
// there. if so prevent automatically logging in since it could be                      // 4
// confusing to be logged in as user A while resetting password for                     // 5
// user B                                                                               // 6
//                                                                                      // 7
// reset password urls use hash fragments instead of url paths/query                    // 8
// strings so that the reset password token is not sent over the wire                   // 9
// on the http request                                                                  // 10
var match;                                                                              // 11
match = window.location.hash.match(/^\#\/reset-password\/(.*)$/);                       // 12
if (match) {                                                                            // 13
  autoLoginEnabled = false;                                                             // 14
  Accounts._resetPasswordToken = match[1];                                              // 15
  window.location.hash = '';                                                            // 16
}                                                                                       // 17
                                                                                        // 18
// reads a verify email token from the url's hash fragment, if                          // 19
// it's there.  also don't automatically log the user is, as for                        // 20
// reset password links.                                                                // 21
//                                                                                      // 22
// XXX we don't need to use hash fragments in this case, and having                     // 23
// the token appear in the url's path would allow us to use a custom                    // 24
// middleware instead of verifying the email on pageload, which                         // 25
// would be faster but less DDP-ish (and more specifically, any                         // 26
// non-web DDP app, such as an iOS client, would do something more                      // 27
// in line with the hash fragment approach)                                             // 28
match = window.location.hash.match(/^\#\/verify-email\/(.*)$/);                         // 29
if (match) {                                                                            // 30
  autoLoginEnabled = false;                                                             // 31
  Accounts._verifyEmailToken = match[1];                                                // 32
  window.location.hash = '';                                                            // 33
}                                                                                       // 34
                                                                                        // 35
// reads an account enrollment token from the url's hash fragment, if                   // 36
// it's there.  also don't automatically log the user is, as for                        // 37
// reset password links.                                                                // 38
match = window.location.hash.match(/^\#\/enroll-account\/(.*)$/);                       // 39
if (match) {                                                                            // 40
  autoLoginEnabled = false;                                                             // 41
  Accounts._enrollAccountToken = match[1];                                              // 42
  window.location.hash = '';                                                            // 43
}                                                                                       // 44
                                                                                        // 45
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/accounts-base/accounts_client.js                                            //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
///                                                                                     // 1
/// CURRENT USER                                                                        // 2
///                                                                                     // 3
                                                                                        // 4
// This is reactive.                                                                    // 5
Meteor.userId = function () {                                                           // 6
  return Meteor.connection.userId();                                                    // 7
};                                                                                      // 8
                                                                                        // 9
var loggingIn = false;                                                                  // 10
var loggingInDeps = new Deps.Dependency;                                                // 11
// This is mostly just called within this file, but Meteor.loginWithPassword            // 12
// also uses it to make loggingIn() be true during the beginPasswordExchange            // 13
// method call too.                                                                     // 14
Accounts._setLoggingIn = function (x) {                                                 // 15
  if (loggingIn !== x) {                                                                // 16
    loggingIn = x;                                                                      // 17
    loggingInDeps.changed();                                                            // 18
  }                                                                                     // 19
};                                                                                      // 20
Meteor.loggingIn = function () {                                                        // 21
  loggingInDeps.depend();                                                               // 22
  return loggingIn;                                                                     // 23
};                                                                                      // 24
                                                                                        // 25
// This calls userId, which is reactive.                                                // 26
Meteor.user = function () {                                                             // 27
  var userId = Meteor.userId();                                                         // 28
  if (!userId)                                                                          // 29
    return null;                                                                        // 30
  return Meteor.users.findOne(userId);                                                  // 31
};                                                                                      // 32
                                                                                        // 33
///                                                                                     // 34
/// LOGIN METHODS                                                                       // 35
///                                                                                     // 36
                                                                                        // 37
// Call a login method on the server.                                                   // 38
//                                                                                      // 39
// A login method is a method which on success calls `this.setUserId(id)` on            // 40
// the server and returns an object with fields 'id' (containing the user id)           // 41
// and 'token' (containing a resume token).                                             // 42
//                                                                                      // 43
// This function takes care of:                                                         // 44
//   - Updating the Meteor.loggingIn() reactive data source                             // 45
//   - Calling the method in 'wait' mode                                                // 46
//   - On success, saving the resume token to localStorage                              // 47
//   - On success, calling Meteor.connection.setUserId()                                // 48
//   - Setting up an onReconnect handler which logs in with                             // 49
//     the resume token                                                                 // 50
//                                                                                      // 51
// Options:                                                                             // 52
// - methodName: The method to call (default 'login')                                   // 53
// - methodArguments: The arguments for the method                                      // 54
// - validateResult: If provided, will be called with the result of the                 // 55
//                 method. If it throws, the client will not be logged in (and          // 56
//                 its error will be passed to the callback).                           // 57
// - userCallback: Will be called with no arguments once the user is fully              // 58
//                 logged in, or with the error on error.                               // 59
//                                                                                      // 60
Accounts.callLoginMethod = function (options) {                                         // 61
  options = _.extend({                                                                  // 62
    methodName: 'login',                                                                // 63
    methodArguments: [],                                                                // 64
    _suppressLoggingIn: false                                                           // 65
  }, options);                                                                          // 66
  // Set defaults for callback arguments to no-op functions; make sure we               // 67
  // override falsey values too.                                                        // 68
  _.each(['validateResult', 'userCallback'], function (f) {                             // 69
    if (!options[f])                                                                    // 70
      options[f] = function () {};                                                      // 71
  });                                                                                   // 72
  // make sure we only call the user's callback once.                                   // 73
  var onceUserCallback = _.once(options.userCallback);                                  // 74
                                                                                        // 75
  var reconnected = false;                                                              // 76
                                                                                        // 77
  // We want to set up onReconnect as soon as we get a result token back from           // 78
  // the server, without having to wait for subscriptions to rerun. This is             // 79
  // because if we disconnect and reconnect between getting the result and              // 80
  // getting the results of subscription rerun, we WILL NOT re-send this                // 81
  // method (because we never re-send methods whose results we've received)             // 82
  // but we WILL call loggedInAndDataReadyCallback at "reconnect quiesce"               // 83
  // time. This will lead to makeClientLoggedIn(result.id) even though we               // 84
  // haven't actually sent a login method!                                              // 85
  //                                                                                    // 86
  // But by making sure that we send this "resume" login in that case (and              // 87
  // calling makeClientLoggedOut if it fails), we'll end up with an accurate            // 88
  // client-side userId. (It's important that livedata_connection guarantees            // 89
  // that the "reconnect quiesce"-time call to loggedInAndDataReadyCallback             // 90
  // will occur before the callback from the resume login call.)                        // 91
  var onResultReceived = function (err, result) {                                       // 92
    if (err || !result || !result.token) {                                              // 93
      Meteor.connection.onReconnect = null;                                             // 94
    } else {                                                                            // 95
      Meteor.connection.onReconnect = function () {                                     // 96
        reconnected = true;                                                             // 97
        // If our token was updated in storage, use the latest one.                     // 98
        var storedToken = storedLoginToken();                                           // 99
        if (storedToken) {                                                              // 100
          result = {                                                                    // 101
            token: storedToken,                                                         // 102
            tokenExpires: storedLoginTokenExpires()                                     // 103
          };                                                                            // 104
        }                                                                               // 105
        if (! result.tokenExpires)                                                      // 106
          result.tokenExpires = Accounts._tokenExpiration(new Date());                  // 107
        if (Accounts._tokenExpiresSoon(result.tokenExpires)) {                          // 108
          makeClientLoggedOut();                                                        // 109
        } else {                                                                        // 110
          Accounts.callLoginMethod({                                                    // 111
            methodArguments: [{resume: result.token}],                                  // 112
            // Reconnect quiescence ensures that the user doesn't see an                // 113
            // intermediate state before the login method finishes. So we don't         // 114
            // need to show a logging-in animation.                                     // 115
            _suppressLoggingIn: true,                                                   // 116
            userCallback: function (error) {                                            // 117
              if (error) {                                                              // 118
                makeClientLoggedOut();                                                  // 119
              }                                                                         // 120
              // Possibly a weird callback to call, but better than nothing if          // 121
              // there is a reconnect between "login result received" and "data         // 122
              // ready".                                                                // 123
              onceUserCallback(error);                                                  // 124
            }});                                                                        // 125
        }                                                                               // 126
      };                                                                                // 127
    }                                                                                   // 128
  };                                                                                    // 129
                                                                                        // 130
  // This callback is called once the local cache of the current-user                   // 131
  // subscription (and all subscriptions, in fact) are guaranteed to be up to           // 132
  // date.                                                                              // 133
  var loggedInAndDataReadyCallback = function (error, result) {                         // 134
    // If the login method returns its result but the connection is lost                // 135
    // before the data is in the local cache, it'll set an onReconnect (see             // 136
    // above). The onReconnect will try to log in using the token, and *it*             // 137
    // will call userCallback via its own version of this                               // 138
    // loggedInAndDataReadyCallback. So we don't have to do anything here.              // 139
    if (reconnected)                                                                    // 140
      return;                                                                           // 141
                                                                                        // 142
    // Note that we need to call this even if _suppressLoggingIn is true,               // 143
    // because it could be matching a _setLoggingIn(true) from a                        // 144
    // half-completed pre-reconnect login method.                                       // 145
    Accounts._setLoggingIn(false);                                                      // 146
    if (error || !result) {                                                             // 147
      error = error || new Error(                                                       // 148
        "No result from call to " + options.methodName);                                // 149
      onceUserCallback(error);                                                          // 150
      return;                                                                           // 151
    }                                                                                   // 152
    try {                                                                               // 153
      options.validateResult(result);                                                   // 154
    } catch (e) {                                                                       // 155
      onceUserCallback(e);                                                              // 156
      return;                                                                           // 157
    }                                                                                   // 158
                                                                                        // 159
    // Make the client logged in. (The user data should already be loaded!)             // 160
    makeClientLoggedIn(result.id, result.token, result.tokenExpires);                   // 161
    onceUserCallback();                                                                 // 162
  };                                                                                    // 163
                                                                                        // 164
  if (!options._suppressLoggingIn)                                                      // 165
    Accounts._setLoggingIn(true);                                                       // 166
  Meteor.apply(                                                                         // 167
    options.methodName,                                                                 // 168
    options.methodArguments,                                                            // 169
    {wait: true, onResultReceived: onResultReceived},                                   // 170
    loggedInAndDataReadyCallback);                                                      // 171
};                                                                                      // 172
                                                                                        // 173
makeClientLoggedOut = function() {                                                      // 174
  unstoreLoginToken();                                                                  // 175
  Meteor.connection.setUserId(null);                                                    // 176
  Meteor.connection.onReconnect = null;                                                 // 177
};                                                                                      // 178
                                                                                        // 179
makeClientLoggedIn = function(userId, token, tokenExpires) {                            // 180
  storeLoginToken(userId, token, tokenExpires);                                         // 181
  Meteor.connection.setUserId(userId);                                                  // 182
};                                                                                      // 183
                                                                                        // 184
Meteor.logout = function (callback) {                                                   // 185
  Meteor.apply('logout', [], {wait: true}, function(error, result) {                    // 186
    if (error) {                                                                        // 187
      callback && callback(error);                                                      // 188
    } else {                                                                            // 189
      makeClientLoggedOut();                                                            // 190
      callback && callback();                                                           // 191
    }                                                                                   // 192
  });                                                                                   // 193
};                                                                                      // 194
                                                                                        // 195
Meteor.logoutOtherClients = function (callback) {                                       // 196
  // Our connection is going to be closed, but we don't want to call the                // 197
  // onReconnect handler until the result comes back for this method, because           // 198
  // the token will have been deleted on the server. Instead, wait until we get         // 199
  // a new token and call the reconnect handler with that.                              // 200
  // XXX this is messy.                                                                 // 201
  // XXX what if login gets called before the callback runs?                            // 202
  var origOnReconnect = Meteor.connection.onReconnect;                                  // 203
  var userId = Meteor.userId();                                                         // 204
  Meteor.connection.onReconnect = null;                                                 // 205
  Meteor.apply('logoutOtherClients', [], { wait: true },                                // 206
               function (error, result) {                                               // 207
                 Meteor.connection.onReconnect = origOnReconnect;                       // 208
                 if (! error)                                                           // 209
                   storeLoginToken(userId, result.token, result.tokenExpires);          // 210
                 Meteor.connection.onReconnect();                                       // 211
                 callback && callback(error);                                           // 212
               });                                                                      // 213
};                                                                                      // 214
                                                                                        // 215
///                                                                                     // 216
/// LOGIN SERVICES                                                                      // 217
///                                                                                     // 218
                                                                                        // 219
var loginServicesHandle = Meteor.subscribe("meteor.loginServiceConfiguration");         // 220
                                                                                        // 221
// A reactive function returning whether the loginServiceConfiguration                  // 222
// subscription is ready. Used by accounts-ui to hide the login button                  // 223
// until we have all the configuration loaded                                           // 224
//                                                                                      // 225
Accounts.loginServicesConfigured = function () {                                        // 226
  return loginServicesHandle.ready();                                                   // 227
};                                                                                      // 228
                                                                                        // 229
///                                                                                     // 230
/// HANDLEBARS HELPERS                                                                  // 231
///                                                                                     // 232
                                                                                        // 233
// If we're using Handlebars, register the {{currentUser}} and                          // 234
// {{loggingIn}} global helpers.                                                        // 235
if (Package.handlebars) {                                                               // 236
  Package.handlebars.Handlebars.registerHelper('currentUser', function () {             // 237
    return Meteor.user();                                                               // 238
  });                                                                                   // 239
  Package.handlebars.Handlebars.registerHelper('loggingIn', function () {               // 240
    return Meteor.loggingIn();                                                          // 241
  });                                                                                   // 242
}                                                                                       // 243
                                                                                        // 244
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/accounts-base/localstorage_token.js                                         //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// This file deals with storing a login token and user id in the                        // 1
// browser's localStorage facility. It polls local storage every few                    // 2
// seconds to synchronize login state between multiple tabs in the same                 // 3
// browser.                                                                             // 4
                                                                                        // 5
var lastLoginTokenWhenPolled;                                                           // 6
                                                                                        // 7
// Login with a Meteor access token. This is the only public function                   // 8
// here.                                                                                // 9
Meteor.loginWithToken = function (token, callback) {                                    // 10
  Accounts.callLoginMethod({                                                            // 11
    methodArguments: [{resume: token}],                                                 // 12
    userCallback: callback});                                                           // 13
};                                                                                      // 14
                                                                                        // 15
// Semi-internal API. Call this function to re-enable auto login after                  // 16
// if it was disabled at startup.                                                       // 17
Accounts._enableAutoLogin = function () {                                               // 18
  autoLoginEnabled = true;                                                              // 19
  pollStoredLoginToken();                                                               // 20
};                                                                                      // 21
                                                                                        // 22
                                                                                        // 23
///                                                                                     // 24
/// STORING                                                                             // 25
///                                                                                     // 26
                                                                                        // 27
// Key names to use in localStorage                                                     // 28
var loginTokenKey = "Meteor.loginToken";                                                // 29
var loginTokenExpiresKey = "Meteor.loginTokenExpires";                                  // 30
var userIdKey = "Meteor.userId";                                                        // 31
                                                                                        // 32
// Call this from the top level of the test file for any test that does                 // 33
// logging in and out, to protect multiple tabs running the same tests                  // 34
// simultaneously from interfering with each others' localStorage.                      // 35
Accounts._isolateLoginTokenForTest = function () {                                      // 36
  loginTokenKey = loginTokenKey + Random.id();                                          // 37
  userIdKey = userIdKey + Random.id();                                                  // 38
};                                                                                      // 39
                                                                                        // 40
storeLoginToken = function(userId, token, tokenExpires) {                               // 41
  Meteor._localStorage.setItem(userIdKey, userId);                                      // 42
  Meteor._localStorage.setItem(loginTokenKey, token);                                   // 43
  if (! tokenExpires)                                                                   // 44
    tokenExpires = Accounts._tokenExpiration(new Date());                               // 45
  Meteor._localStorage.setItem(loginTokenExpiresKey, tokenExpires);                     // 46
                                                                                        // 47
  // to ensure that the localstorage poller doesn't end up trying to                    // 48
  // connect a second time                                                              // 49
  lastLoginTokenWhenPolled = token;                                                     // 50
};                                                                                      // 51
                                                                                        // 52
unstoreLoginToken = function() {                                                        // 53
  Meteor._localStorage.removeItem(userIdKey);                                           // 54
  Meteor._localStorage.removeItem(loginTokenKey);                                       // 55
  Meteor._localStorage.removeItem(loginTokenExpiresKey);                                // 56
                                                                                        // 57
  // to ensure that the localstorage poller doesn't end up trying to                    // 58
  // connect a second time                                                              // 59
  lastLoginTokenWhenPolled = null;                                                      // 60
};                                                                                      // 61
                                                                                        // 62
// This is private, but it is exported for now because it is used by a                  // 63
// test in accounts-password.                                                           // 64
//                                                                                      // 65
storedLoginToken = Accounts._storedLoginToken = function() {                            // 66
  return Meteor._localStorage.getItem(loginTokenKey);                                   // 67
};                                                                                      // 68
                                                                                        // 69
storedLoginTokenExpires = function () {                                                 // 70
  return Meteor._localStorage.getItem(loginTokenExpiresKey);                            // 71
};                                                                                      // 72
                                                                                        // 73
var storedUserId = function() {                                                         // 74
  return Meteor._localStorage.getItem(userIdKey);                                       // 75
};                                                                                      // 76
                                                                                        // 77
var unstoreLoginTokenIfExpiresSoon = function () {                                      // 78
  var tokenExpires = Meteor._localStorage.getItem(loginTokenExpiresKey);                // 79
  if (tokenExpires && Accounts._tokenExpiresSoon(new Date(tokenExpires)))               // 80
    unstoreLoginToken();                                                                // 81
};                                                                                      // 82
                                                                                        // 83
///                                                                                     // 84
/// AUTO-LOGIN                                                                          // 85
///                                                                                     // 86
                                                                                        // 87
if (autoLoginEnabled) {                                                                 // 88
  // Immediately try to log in via local storage, so that any DDP                       // 89
  // messages are sent after we have established our user account                       // 90
  unstoreLoginTokenIfExpiresSoon();                                                     // 91
  var token = storedLoginToken();                                                       // 92
  if (token) {                                                                          // 93
    // On startup, optimistically present us as logged in while the                     // 94
    // request is in flight. This reduces page flicker on startup.                      // 95
    var userId = storedUserId();                                                        // 96
    userId && Meteor.connection.setUserId(userId);                                      // 97
    Meteor.loginWithToken(token, function (err) {                                       // 98
      if (err) {                                                                        // 99
        Meteor._debug("Error logging in with token: " + err);                           // 100
        makeClientLoggedOut();                                                          // 101
      }                                                                                 // 102
    });                                                                                 // 103
  }                                                                                     // 104
}                                                                                       // 105
                                                                                        // 106
// Poll local storage every 3 seconds to login if someone logged in in                  // 107
// another tab                                                                          // 108
lastLoginTokenWhenPolled = token;                                                       // 109
var pollStoredLoginToken = function() {                                                 // 110
  if (! autoLoginEnabled)                                                               // 111
    return;                                                                             // 112
                                                                                        // 113
  var currentLoginToken = storedLoginToken();                                           // 114
                                                                                        // 115
  // != instead of !== just to make sure undefined and null are treated the same        // 116
  if (lastLoginTokenWhenPolled != currentLoginToken) {                                  // 117
    if (currentLoginToken)                                                              // 118
      Meteor.loginWithToken(currentLoginToken); // XXX should we pass a callback here?  // 119
    else                                                                                // 120
      Meteor.logout();                                                                  // 121
  }                                                                                     // 122
  lastLoginTokenWhenPolled = currentLoginToken;                                         // 123
};                                                                                      // 124
                                                                                        // 125
setInterval(pollStoredLoginToken, 3000);                                                // 126
                                                                                        // 127
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-base'] = {
  Accounts: Accounts
};

})();

//# sourceMappingURL=1cf30596384b9e9f1f48d1f357b9e640c4065e01.map
