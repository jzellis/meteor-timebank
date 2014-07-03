(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Accounts = Package['accounts-base'].Accounts;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-oauth/oauth_common.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Accounts.oauth = {};                                                                                               // 1
                                                                                                                   // 2
var services = {};                                                                                                 // 3
                                                                                                                   // 4
// Helper for registering OAuth based accounts packages.                                                           // 5
// On the server, adds an index to the user collection.                                                            // 6
Accounts.oauth.registerService = function (name) {                                                                 // 7
  if (_.has(services, name))                                                                                       // 8
    throw new Error("Duplicate service: " + name);                                                                 // 9
  services[name] = true;                                                                                           // 10
                                                                                                                   // 11
  if (Meteor.server) {                                                                                             // 12
    // Accounts.updateOrCreateUserFromExternalService does a lookup by this id,                                    // 13
    // so this should be a unique index. You might want to add indexes for other                                   // 14
    // fields returned by your service (eg services.github.login) but you can do                                   // 15
    // that in your app.                                                                                           // 16
    Meteor.users._ensureIndex('services.' + name + '.id',                                                          // 17
                              {unique: 1, sparse: 1});                                                             // 18
  }                                                                                                                // 19
};                                                                                                                 // 20
                                                                                                                   // 21
Accounts.oauth.serviceNames = function () {                                                                        // 22
  return _.keys(services);                                                                                         // 23
};                                                                                                                 // 24
                                                                                                                   // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-oauth/oauth_server.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// Listen to calls to `login` with an oauth option set. This is where                                              // 1
// users actually get logged in to meteor via oauth.                                                               // 2
Accounts.registerLoginHandler(function (options) {                                                                 // 3
  if (!options.oauth)                                                                                              // 4
    return undefined; // don't handle                                                                              // 5
                                                                                                                   // 6
  check(options.oauth, {                                                                                           // 7
    credentialToken: String,                                                                                       // 8
    // When an error occurs while retrieving the access token, we store                                            // 9
    // the error in the pending credentials table, with a secret of                                                // 10
    // null. The client can call the login method with a secret of null                                            // 11
    // to retrieve the error.                                                                                      // 12
    credentialSecret: Match.OneOf(null, String)                                                                    // 13
  });                                                                                                              // 14
                                                                                                                   // 15
  var result = OAuth.retrieveCredential(options.oauth.credentialToken,                                             // 16
                                        options.oauth.credentialSecret);                                           // 17
                                                                                                                   // 18
  if (!result) {                                                                                                   // 19
    // OAuth credentialToken is not recognized, which could be either                                              // 20
    // because the popup was closed by the user before completion, or                                              // 21
    // some sort of error where the oauth provider didn't talk to our                                              // 22
    // server correctly and closed the popup somehow.                                                              // 23
    //                                                                                                             // 24
    // We assume it was user canceled and report it as such, using a                                               // 25
    // numeric code that the client recognizes (XXX this will get                                                  // 26
    // replaced by a symbolic error code at some point                                                             // 27
    // https://trello.com/c/kMkw800Z/53-official-ddp-specification). This                                          // 28
    // will mask failures where things are misconfigured such that the                                             // 29
    // server doesn't see the request but does close the window. This                                              // 30
    // seems unlikely.                                                                                             // 31
    //                                                                                                             // 32
    // XXX we want `type` to be the service name such as "facebook"                                                // 33
    return { type: "oauth",                                                                                        // 34
             error: new Meteor.Error(                                                                              // 35
               Accounts.LoginCancelledError.numericError,                                                          // 36
               "No matching login attempt found") };                                                               // 37
  }                                                                                                                // 38
                                                                                                                   // 39
  if (result instanceof Error)                                                                                     // 40
    // We tried to login, but there was a fatal error. Report it back                                              // 41
    // to the user.                                                                                                // 42
    throw result;                                                                                                  // 43
  else                                                                                                             // 44
    return Accounts.updateOrCreateUserFromExternalService(result.serviceName, result.serviceData, result.options); // 45
});                                                                                                                // 46
                                                                                                                   // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-oauth'] = {};

})();
