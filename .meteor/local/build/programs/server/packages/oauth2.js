(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/oauth2/oauth2_server.js                                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
// connect middleware                                                // 1
OAuth._requestHandlers['2'] = function (service, query, res) {       // 2
  // check if user authorized access                                 // 3
  if (!query.error) {                                                // 4
    // Prepare the login results before returning.                   // 5
                                                                     // 6
    // Run service-specific handler.                                 // 7
    var oauthResult = service.handleOauthRequest(query);             // 8
    var credentialSecret = Random.secret();                          // 9
                                                                     // 10
    // Store the login result so it can be retrieved in another      // 11
    // browser tab by the result handler                             // 12
    OAuth._storePendingCredential(query.state, {                     // 13
      serviceName: service.serviceName,                              // 14
      serviceData: oauthResult.serviceData,                          // 15
      options: oauthResult.options                                   // 16
    }, credentialSecret);                                            // 17
  }                                                                  // 18
                                                                     // 19
  // Either close the window, redirect, or render nothing            // 20
  // if all else fails                                               // 21
  OAuth._renderOauthResults(res, query, credentialSecret);           // 22
};                                                                   // 23
                                                                     // 24
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.oauth2 = {};

})();
