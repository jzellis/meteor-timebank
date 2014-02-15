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
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var Accounts = Package['accounts-base'].Accounts;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/accounts-oauth/oauth_common.js                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
Accounts.oauth = {};                                                             // 1
                                                                                 // 2
var services = {};                                                               // 3
                                                                                 // 4
// Helper for registering OAuth based accounts packages.                         // 5
// On the server, adds an index to the user collection.                          // 6
Accounts.oauth.registerService = function (name) {                               // 7
  if (_.has(services, name))                                                     // 8
    throw new Error("Duplicate service: " + name);                               // 9
  services[name] = true;                                                         // 10
                                                                                 // 11
  if (Meteor.server) {                                                           // 12
    // Accounts.updateOrCreateUserFromExternalService does a lookup by this id,  // 13
    // so this should be a unique index. You might want to add indexes for other // 14
    // fields returned by your service (eg services.github.login) but you can do // 15
    // that in your app.                                                         // 16
    Meteor.users._ensureIndex('services.' + name + '.id',                        // 17
                              {unique: 1, sparse: 1});                           // 18
  }                                                                              // 19
};                                                                               // 20
                                                                                 // 21
Accounts.oauth.serviceNames = function () {                                      // 22
  return _.keys(services);                                                       // 23
};                                                                               // 24
                                                                                 // 25
///////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/accounts-oauth/oauth_client.js                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// Send an OAuth login method to the server. If the user authorized              // 1
// access in the popup this should log the user in, otherwise                    // 2
// nothing should happen.                                                        // 3
Accounts.oauth.tryLoginAfterPopupClosed = function(credentialToken, callback) {  // 4
  Accounts.callLoginMethod({                                                     // 5
    methodArguments: [{oauth: {credentialToken: credentialToken}}],              // 6
    userCallback: callback && function (err) {                                   // 7
      // Allow server to specify a specify subclass of errors. We should come    // 8
      // up with a more generic way to do this!                                  // 9
      if (err && err instanceof Meteor.Error &&                                  // 10
          err.error === Accounts.LoginCancelledError.numericError) {             // 11
        callback(new Accounts.LoginCancelledError(err.details));                 // 12
      } else {                                                                   // 13
        callback(err);                                                           // 14
      }                                                                          // 15
    }});                                                                         // 16
};                                                                               // 17
                                                                                 // 18
Accounts.oauth.credentialRequestCompleteHandler = function(callback) {           // 19
  return function (credentialTokenOrError) {                                     // 20
    if(credentialTokenOrError && credentialTokenOrError instanceof Error) {      // 21
      callback && callback(credentialTokenOrError);                              // 22
    } else {                                                                     // 23
      Accounts.oauth.tryLoginAfterPopupClosed(credentialTokenOrError, callback); // 24
    }                                                                            // 25
  };                                                                             // 26
};                                                                               // 27
                                                                                 // 28
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-oauth'] = {};

})();

//# sourceMappingURL=ec0c258ab408470b49f37de355c3b9b55fb044e4.map
