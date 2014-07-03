(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var Facebook;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/facebook/facebook_server.js                                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
Facebook = {};                                                                                    // 1
                                                                                                  // 2
var querystring = Npm.require('querystring');                                                     // 3
                                                                                                  // 4
                                                                                                  // 5
OAuth.registerService('facebook', 2, null, function(query) {                                      // 6
                                                                                                  // 7
  var response = getTokenResponse(query);                                                         // 8
  var accessToken = response.accessToken;                                                         // 9
  var identity = getIdentity(accessToken);                                                        // 10
                                                                                                  // 11
  var serviceData = {                                                                             // 12
    accessToken: accessToken,                                                                     // 13
    expiresAt: (+new Date) + (1000 * response.expiresIn)                                          // 14
  };                                                                                              // 15
                                                                                                  // 16
  // include all fields from facebook                                                             // 17
  // http://developers.facebook.com/docs/reference/login/public-profile-and-friend-list/          // 18
  var whitelisted = ['id', 'email', 'name', 'first_name',                                         // 19
      'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];                          // 20
                                                                                                  // 21
  var fields = _.pick(identity, whitelisted);                                                     // 22
  _.extend(serviceData, fields);                                                                  // 23
                                                                                                  // 24
  return {                                                                                        // 25
    serviceData: serviceData,                                                                     // 26
    options: {profile: {name: identity.name}}                                                     // 27
  };                                                                                              // 28
});                                                                                               // 29
                                                                                                  // 30
// checks whether a string parses as JSON                                                         // 31
var isJSON = function (str) {                                                                     // 32
  try {                                                                                           // 33
    JSON.parse(str);                                                                              // 34
    return true;                                                                                  // 35
  } catch (e) {                                                                                   // 36
    return false;                                                                                 // 37
  }                                                                                               // 38
};                                                                                                // 39
                                                                                                  // 40
// returns an object containing:                                                                  // 41
// - accessToken                                                                                  // 42
// - expiresIn: lifetime of token in seconds                                                      // 43
var getTokenResponse = function (query) {                                                         // 44
  var config = ServiceConfiguration.configurations.findOne({service: 'facebook'});                // 45
  if (!config)                                                                                    // 46
    throw new ServiceConfiguration.ConfigError();                                                 // 47
                                                                                                  // 48
  var responseContent;                                                                            // 49
  try {                                                                                           // 50
    // Request an access token                                                                    // 51
    responseContent = HTTP.get(                                                                   // 52
      "https://graph.facebook.com/oauth/access_token", {                                          // 53
        params: {                                                                                 // 54
          client_id: config.appId,                                                                // 55
          redirect_uri: Meteor.absoluteUrl("_oauth/facebook?close"),                              // 56
          client_secret: OAuth.openSecret(config.secret),                                         // 57
          code: query.code                                                                        // 58
        }                                                                                         // 59
      }).content;                                                                                 // 60
  } catch (err) {                                                                                 // 61
    throw _.extend(new Error("Failed to complete OAuth handshake with Facebook. " + err.message), // 62
                   {response: err.response});                                                     // 63
  }                                                                                               // 64
                                                                                                  // 65
  // If 'responseContent' parses as JSON, it is an error.                                         // 66
  // XXX which facebook error causes this behvaior?                                               // 67
  if (isJSON(responseContent)) {                                                                  // 68
    throw new Error("Failed to complete OAuth handshake with Facebook. " + responseContent);      // 69
  }                                                                                               // 70
                                                                                                  // 71
  // Success!  Extract the facebook access token and expiration                                   // 72
  // time from the response                                                                       // 73
  var parsedResponse = querystring.parse(responseContent);                                        // 74
  var fbAccessToken = parsedResponse.access_token;                                                // 75
  var fbExpires = parsedResponse.expires;                                                         // 76
                                                                                                  // 77
  if (!fbAccessToken) {                                                                           // 78
    throw new Error("Failed to complete OAuth handshake with facebook " +                         // 79
                    "-- can't find access token in HTTP response. " + responseContent);           // 80
  }                                                                                               // 81
  return {                                                                                        // 82
    accessToken: fbAccessToken,                                                                   // 83
    expiresIn: fbExpires                                                                          // 84
  };                                                                                              // 85
};                                                                                                // 86
                                                                                                  // 87
var getIdentity = function (accessToken) {                                                        // 88
  try {                                                                                           // 89
    return HTTP.get("https://graph.facebook.com/me", {                                            // 90
      params: {access_token: accessToken}}).data;                                                 // 91
  } catch (err) {                                                                                 // 92
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),           // 93
                   {response: err.response});                                                     // 94
  }                                                                                               // 95
};                                                                                                // 96
                                                                                                  // 97
Facebook.retrieveCredential = function(credentialToken, credentialSecret) {                       // 98
  return OAuth.retrieveCredential(credentialToken, credentialSecret);                             // 99
};                                                                                                // 100
                                                                                                  // 101
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.facebook = {
  Facebook: Facebook
};

})();
