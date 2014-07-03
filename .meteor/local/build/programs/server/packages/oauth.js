(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Log = Package.logging.Log;

/* Package-scope variables */
var OAuth, OAuthTest, Oauth, middleware;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/oauth_server.js                                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var Fiber = Npm.require('fibers');                                                                // 1
var url = Npm.require('url');                                                                     // 2
                                                                                                  // 3
OAuth = {};                                                                                       // 4
OAuthTest = {};                                                                                   // 5
                                                                                                  // 6
RoutePolicy.declare('/_oauth/', 'network');                                                       // 7
                                                                                                  // 8
var registeredServices = {};                                                                      // 9
                                                                                                  // 10
// Internal: Maps from service version to handler function. The                                   // 11
// 'oauth1' and 'oauth2' packages manipulate this directly to register                            // 12
// for callbacks.                                                                                 // 13
//                                                                                                // 14
OAuth._requestHandlers = {};                                                                      // 15
                                                                                                  // 16
                                                                                                  // 17
// Register a handler for an OAuth service. The handler will be called                            // 18
// when we get an incoming http request on /_oauth/{serviceName}. This                            // 19
// handler should use that information to fetch data about the user                               // 20
// logging in.                                                                                    // 21
//                                                                                                // 22
// @param name {String} e.g. "google", "facebook"                                                 // 23
// @param version {Number} OAuth version (1 or 2)                                                 // 24
// @param urls   For OAuth1 only, specify the service's urls                                      // 25
// @param handleOauthRequest {Function(oauthBinding|query)}                                       // 26
//   - (For OAuth1 only) oauthBinding {OAuth1Binding} bound to the appropriate provider           // 27
//   - (For OAuth2 only) query {Object} parameters passed in query string                         // 28
//   - return value is:                                                                           // 29
//     - {serviceData:, (optional options:)} where serviceData should end                         // 30
//       up in the user's services[name] field                                                    // 31
//     - `null` if the user declined to give permissions                                          // 32
//                                                                                                // 33
OAuth.registerService = function (name, version, urls, handleOauthRequest) {                      // 34
  if (registeredServices[name])                                                                   // 35
    throw new Error("Already registered the " + name + " OAuth service");                         // 36
                                                                                                  // 37
  registeredServices[name] = {                                                                    // 38
    serviceName: name,                                                                            // 39
    version: version,                                                                             // 40
    urls: urls,                                                                                   // 41
    handleOauthRequest: handleOauthRequest                                                        // 42
  };                                                                                              // 43
};                                                                                                // 44
                                                                                                  // 45
// For test cleanup.                                                                              // 46
OAuthTest.unregisterService = function (name) {                                                   // 47
  delete registeredServices[name];                                                                // 48
};                                                                                                // 49
                                                                                                  // 50
                                                                                                  // 51
OAuth.retrieveCredential = function(credentialToken, credentialSecret) {                          // 52
  return OAuth._retrievePendingCredential(credentialToken, credentialSecret);                     // 53
};                                                                                                // 54
                                                                                                  // 55
                                                                                                  // 56
// Listen to incoming OAuth http requests                                                         // 57
WebApp.connectHandlers.use(function(req, res, next) {                                             // 58
  // Need to create a Fiber since we're using synchronous http calls and nothing                  // 59
  // else is wrapping this in a fiber automatically                                               // 60
  Fiber(function () {                                                                             // 61
    middleware(req, res, next);                                                                   // 62
  }).run();                                                                                       // 63
});                                                                                               // 64
                                                                                                  // 65
middleware = function (req, res, next) {                                                          // 66
  // Make sure to catch any exceptions because otherwise we'd crash                               // 67
  // the runner                                                                                   // 68
  try {                                                                                           // 69
    var serviceName = oauthServiceName(req);                                                      // 70
    if (!serviceName) {                                                                           // 71
      // not an oauth request. pass to next middleware.                                           // 72
      next();                                                                                     // 73
      return;                                                                                     // 74
    }                                                                                             // 75
                                                                                                  // 76
    var service = registeredServices[serviceName];                                                // 77
                                                                                                  // 78
    // Skip everything if there's no service set by the oauth middleware                          // 79
    if (!service)                                                                                 // 80
      throw new Error("Unexpected OAuth service " + serviceName);                                 // 81
                                                                                                  // 82
    // Make sure we're configured                                                                 // 83
    ensureConfigured(serviceName);                                                                // 84
                                                                                                  // 85
    var handler = OAuth._requestHandlers[service.version];                                        // 86
    if (!handler)                                                                                 // 87
      throw new Error("Unexpected OAuth version " + service.version);                             // 88
    handler(service, req.query, res);                                                             // 89
  } catch (err) {                                                                                 // 90
    // if we got thrown an error, save it off, it will get passed to                              // 91
    // the appropriate login call (if any) and reported there.                                    // 92
    //                                                                                            // 93
    // The other option would be to display it in the popup tab that                              // 94
    // is still open at this point, ignoring the 'close' or 'redirect'                            // 95
    // we were passed. But then the developer wouldn't be able to                                 // 96
    // style the error or react to it in any way.                                                 // 97
    if (req.query.state && err instanceof Error) {                                                // 98
      try { // catch any exceptions to avoid crashing runner                                      // 99
        OAuth._storePendingCredential(req.query.state, err);                                      // 100
      } catch (err) {                                                                             // 101
        // Ignore the error and just give up. If we failed to store the                           // 102
        // error, then the login will just fail with a generic error.                             // 103
        Log.warn("Error in OAuth Server while storing pending login result.\n" +                  // 104
                 err.stack || err.message);                                                       // 105
      }                                                                                           // 106
    }                                                                                             // 107
                                                                                                  // 108
    // close the popup. because nobody likes them just hanging                                    // 109
    // there.  when someone sees this multiple times they might                                   // 110
    // think to check server logs (we hope?)                                                      // 111
    OAuth._endOfLoginResponse(res, {                                                              // 112
      query: req.query,                                                                           // 113
      error: err                                                                                  // 114
    });                                                                                           // 115
  }                                                                                               // 116
};                                                                                                // 117
                                                                                                  // 118
OAuthTest.middleware = middleware;                                                                // 119
                                                                                                  // 120
// Handle /_oauth/* paths and extract the service name.                                           // 121
//                                                                                                // 122
// @returns {String|null} e.g. "facebook", or null if this isn't an                               // 123
// oauth request                                                                                  // 124
var oauthServiceName = function (req) {                                                           // 125
  // req.url will be "/_oauth/<service name>?<action>"                                            // 126
  var barePath = req.url.substring(0, req.url.indexOf('?'));                                      // 127
  var splitPath = barePath.split('/');                                                            // 128
                                                                                                  // 129
  // Any non-oauth request will continue down the default                                         // 130
  // middlewares.                                                                                 // 131
  if (splitPath[1] !== '_oauth')                                                                  // 132
    return null;                                                                                  // 133
                                                                                                  // 134
  // Find service based on url                                                                    // 135
  var serviceName = splitPath[2];                                                                 // 136
  return serviceName;                                                                             // 137
};                                                                                                // 138
                                                                                                  // 139
// Make sure we're configured                                                                     // 140
var ensureConfigured = function(serviceName) {                                                    // 141
  if (!ServiceConfiguration.configurations.findOne({service: serviceName})) {                     // 142
    throw new ServiceConfiguration.ConfigError();                                                 // 143
  }                                                                                               // 144
};                                                                                                // 145
                                                                                                  // 146
var isSafe = function (value) {                                                                   // 147
  // This matches strings generated by `Random.secret` and                                        // 148
  // `Random.id`.                                                                                 // 149
  return typeof value === "string" &&                                                             // 150
    /^[a-zA-Z0-9\-_]+$/.test(value);                                                              // 151
};                                                                                                // 152
                                                                                                  // 153
// Internal: used by the oauth1 and oauth2 packages                                               // 154
OAuth._renderOauthResults = function(res, query, credentialSecret) {                              // 155
  // We expect the ?close parameter to be present, in which case we                               // 156
  // close the popup at the end of the OAuth flow. Any other query                                // 157
  // string should just serve a blank page. For tests, we support the                             // 158
  // `only_credential_secret_for_test` parameter, which just returns the                          // 159
  // credential secret without any surrounding HTML. (The test needs to                           // 160
  // be able to easily grab the secret and use it to log in.)                                     // 161
  //                                                                                              // 162
  // XXX only_credential_secret_for_test could be useful for other                                // 163
  // things beside tests, like command-line clients. We should give it a                          // 164
  // real name and serve the credential secret in JSON.                                           // 165
  if (query.only_credential_secret_for_test) {                                                    // 166
    res.writeHead(200, {'Content-Type': 'text/html'});                                            // 167
    res.end(credentialSecret, 'utf-8');                                                           // 168
  } else {                                                                                        // 169
    var details = { query: query };                                                               // 170
    if (query.error) {                                                                            // 171
      details.error = query.error;                                                                // 172
    } else {                                                                                      // 173
      var token = query.state;                                                                    // 174
      var secret = credentialSecret;                                                              // 175
      if (token && secret &&                                                                      // 176
          isSafe(token) && isSafe(secret)) {                                                      // 177
        details.credentials = { token: token, secret: secret};                                    // 178
      } else {                                                                                    // 179
        details.error = "invalid_credential_token_or_secret";                                     // 180
      }                                                                                           // 181
    }                                                                                             // 182
                                                                                                  // 183
    OAuth._endOfLoginResponse(res, details);                                                      // 184
  }                                                                                               // 185
};                                                                                                // 186
                                                                                                  // 187
// Writes an HTTP response to the popup window at the end of an OAuth                             // 188
// login flow. At this point, if the user has successfully authenticated                          // 189
// to the OAuth server and authorized this app, we communicate the                                // 190
// credentialToken and credentialSecret to the main window. The main                              // 191
// window must provide both these values to the DDP `login` method to                             // 192
// authenticate its DDP connection. After communicating these vaues to                            // 193
// the main window, we close the popup.                                                           // 194
//                                                                                                // 195
// We export this function so that developers can override this                                   // 196
// behavior, which is particularly useful in, for example, some mobile                            // 197
// environments where popups and/or `window.opener` don't work. For                               // 198
// example, an app could override `OAuth._endOfLoginResponse` to put the                          // 199
// credential token and credential secret in the popup URL for the main                           // 200
// window to read them there instead of using `window.opener`. If you                             // 201
// override this function, you take responsibility for writing to the                             // 202
// request and calling `res.end()` to complete the request.                                       // 203
//                                                                                                // 204
// Arguments:                                                                                     // 205
//   - res: the HTTP response object                                                              // 206
//   - details:                                                                                   // 207
//      - query: the query string on the HTTP request                                             // 208
//      - credentials: { token: *, secret: * }. If present, this field                            // 209
//        indicates that the login was successful. Return these values                            // 210
//        to the client, who can use them to log in over DDP. If                                  // 211
//        present, the values have been checked against a limited                                 // 212
//        character set and are safe to include in HTML.                                          // 213
//      - error: if present, a string or Error indicating an error that                           // 214
//        occurred during the login. This can come from the client and                            // 215
//        so shouldn't be trusted for security decisions or included in                           // 216
//        the response without sanitizing it first. Only one of `error`                           // 217
//        or `credentials` should be set.                                                         // 218
OAuth._endOfLoginResponse = function(res, details) {                                              // 219
                                                                                                  // 220
  res.writeHead(200, {'Content-Type': 'text/html'});                                              // 221
                                                                                                  // 222
  var content = function (setCredentialSecret) {                                                  // 223
    return '<html><head><script>' +                                                               // 224
      setCredentialSecret +                                                                       // 225
      'window.close()</script></head></html>';                                                    // 226
  };                                                                                              // 227
                                                                                                  // 228
  if (details.error) {                                                                            // 229
    Log.warn("Error in OAuth Server: " +                                                          // 230
             (details.error instanceof Error ?                                                    // 231
              details.error.message : details.error));                                            // 232
    res.end(content(""), 'utf-8');                                                                // 233
    return;                                                                                       // 234
  }                                                                                               // 235
                                                                                                  // 236
  if ("close" in details.query) {                                                                 // 237
    // If we have a credentialSecret, report it back to the parent                                // 238
    // window, with the corresponding credentialToken. The parent window                          // 239
    // uses the credentialToken and credentialSecret to log in over DDP.                          // 240
    var setCredentialSecret = '';                                                                 // 241
    if (details.credentials.token && details.credentials.secret) {                                // 242
      setCredentialSecret = 'var credentialToken = ' +                                            // 243
        JSON.stringify(details.credentials.token) + ';' +                                         // 244
        'var credentialSecret = ' +                                                               // 245
        JSON.stringify(details.credentials.secret) + ';' +                                        // 246
        'window.opener && ' +                                                                     // 247
        'window.opener.Package.oauth.OAuth._handleCredentialSecret(' +                            // 248
        'credentialToken, credentialSecret);';                                                    // 249
    }                                                                                             // 250
    res.end(content(setCredentialSecret), "utf-8");                                               // 251
  } else {                                                                                        // 252
    res.end("", "utf-8");                                                                         // 253
  }                                                                                               // 254
};                                                                                                // 255
                                                                                                  // 256
                                                                                                  // 257
var OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption; // 258
                                                                                                  // 259
var usingOAuthEncryption = function () {                                                          // 260
  return OAuthEncryption && OAuthEncryption.keyIsLoaded();                                        // 261
};                                                                                                // 262
                                                                                                  // 263
// Encrypt sensitive service data such as access tokens if the                                    // 264
// "oauth-encryption" package is loaded and the oauth secret key has                              // 265
// been specified.  Returns the unencrypted plaintext otherwise.                                  // 266
//                                                                                                // 267
// The user id is not specified because the user isn't known yet at                               // 268
// this point in the oauth authentication process.  After the oauth                               // 269
// authentication process completes the encrypted service data fields                             // 270
// will be re-encrypted with the user id included before inserting the                            // 271
// service data into the user document.                                                           // 272
//                                                                                                // 273
OAuth.sealSecret = function (plaintext) {                                                         // 274
  if (usingOAuthEncryption())                                                                     // 275
    return OAuthEncryption.seal(plaintext);                                                       // 276
  else                                                                                            // 277
    return plaintext;                                                                             // 278
}                                                                                                 // 279
                                                                                                  // 280
// Unencrypt a service data field, if the "oauth-encryption"                                      // 281
// package is loaded and the field is encrypted.                                                  // 282
//                                                                                                // 283
// Throws an error if the "oauth-encryption" package is loaded and the                            // 284
// field is encrypted, but the oauth secret key hasn't been specified.                            // 285
//                                                                                                // 286
OAuth.openSecret = function (maybeSecret, userId) {                                               // 287
  if (!Package["oauth-encryption"] || !OAuthEncryption.isSealed(maybeSecret))                     // 288
    return maybeSecret;                                                                           // 289
                                                                                                  // 290
  return OAuthEncryption.open(maybeSecret, userId);                                               // 291
};                                                                                                // 292
                                                                                                  // 293
// Unencrypt fields in the service data object.                                                   // 294
//                                                                                                // 295
OAuth.openSecrets = function (serviceData, userId) {                                              // 296
  var result = {};                                                                                // 297
  _.each(_.keys(serviceData), function (key) {                                                    // 298
    result[key] = OAuth.openSecret(serviceData[key], userId);                                     // 299
  });                                                                                             // 300
  return result;                                                                                  // 301
};                                                                                                // 302
                                                                                                  // 303
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/pending_credentials.js                                                          //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
//                                                                                                // 1
// When an oauth request is made, Meteor receives oauth credentials                               // 2
// in one browser tab, and temporarily persists them while that                                   // 3
// tab is closed, then retrieves them in the browser tab that                                     // 4
// initiated the credential request.                                                              // 5
//                                                                                                // 6
// _pendingCredentials is the storage mechanism used to share the                                 // 7
// credential between the 2 tabs                                                                  // 8
//                                                                                                // 9
                                                                                                  // 10
                                                                                                  // 11
// Collection containing pending credentials of oauth credential requests                         // 12
// Has key, credential, and createdAt fields.                                                     // 13
OAuth._pendingCredentials = new Meteor.Collection(                                                // 14
  "meteor_oauth_pendingCredentials", {                                                            // 15
    _preventAutopublish: true                                                                     // 16
  });                                                                                             // 17
                                                                                                  // 18
OAuth._pendingCredentials._ensureIndex('key', {unique: 1});                                       // 19
OAuth._pendingCredentials._ensureIndex('credentialSecret');                                       // 20
OAuth._pendingCredentials._ensureIndex('createdAt');                                              // 21
                                                                                                  // 22
                                                                                                  // 23
                                                                                                  // 24
// Periodically clear old entries that were never retrieved                                       // 25
var _cleanStaleResults = function() {                                                             // 26
  // Remove credentials older than 1 minute                                                       // 27
  var timeCutoff = new Date();                                                                    // 28
  timeCutoff.setMinutes(timeCutoff.getMinutes() - 1);                                             // 29
  OAuth._pendingCredentials.remove({ createdAt: { $lt: timeCutoff } });                           // 30
};                                                                                                // 31
var _cleanupHandle = Meteor.setInterval(_cleanStaleResults, 60 * 1000);                           // 32
                                                                                                  // 33
                                                                                                  // 34
// Stores the key and credential in the _pendingCredentials collection.                           // 35
// Will throw an exception if `key` is not a string.                                              // 36
//                                                                                                // 37
// @param key {string}                                                                            // 38
// @param credential {Object}   The credential to store                                           // 39
// @param credentialSecret {string} A secret that must be presented in                            // 40
//   addition to the `key` to retrieve the credential                                             // 41
//                                                                                                // 42
OAuth._storePendingCredential = function (key, credential, credentialSecret) {                    // 43
  check(key, String);                                                                             // 44
  check(credentialSecret, Match.Optional(String));                                                // 45
                                                                                                  // 46
  if (credential instanceof Error) {                                                              // 47
    credential = storableError(credential);                                                       // 48
  } else {                                                                                        // 49
    credential = OAuth.sealSecret(credential);                                                    // 50
  }                                                                                               // 51
                                                                                                  // 52
  // We do an upsert here instead of an insert in case the user happens                           // 53
  // to somehow send the same `state` parameter twice during an OAuth                             // 54
  // login; we don't want a duplicate key error.                                                  // 55
  OAuth._pendingCredentials.upsert({                                                              // 56
    key: key                                                                                      // 57
  }, {                                                                                            // 58
    key: key,                                                                                     // 59
    credential: credential,                                                                       // 60
    credentialSecret: credentialSecret || null,                                                   // 61
    createdAt: new Date()                                                                         // 62
  });                                                                                             // 63
};                                                                                                // 64
                                                                                                  // 65
                                                                                                  // 66
// Retrieves and removes a credential from the _pendingCredentials collection                     // 67
//                                                                                                // 68
// @param key {string}                                                                            // 69
// @param credentialSecret {string}                                                               // 70
//                                                                                                // 71
OAuth._retrievePendingCredential = function (key, credentialSecret) {                             // 72
  check(key, String);                                                                             // 73
                                                                                                  // 74
  var pendingCredential = OAuth._pendingCredentials.findOne({                                     // 75
    key: key,                                                                                     // 76
    credentialSecret: credentialSecret || null                                                    // 77
  });                                                                                             // 78
  if (pendingCredential) {                                                                        // 79
    OAuth._pendingCredentials.remove({ _id: pendingCredential._id });                             // 80
    if (pendingCredential.credential.error)                                                       // 81
      return recreateError(pendingCredential.credential.error);                                   // 82
    else                                                                                          // 83
      return OAuth.openSecret(pendingCredential.credential);                                      // 84
  } else {                                                                                        // 85
    return undefined;                                                                             // 86
  }                                                                                               // 87
};                                                                                                // 88
                                                                                                  // 89
                                                                                                  // 90
// Convert an Error into an object that can be stored in mongo                                    // 91
// Note: A Meteor.Error is reconstructed as a Meteor.Error                                        // 92
// All other error classes are reconstructed as a plain Error.                                    // 93
var storableError = function(error) {                                                             // 94
  var plainObject = {};                                                                           // 95
  Object.getOwnPropertyNames(error).forEach(function(key) {                                       // 96
    plainObject[key] = error[key];                                                                // 97
  });                                                                                             // 98
                                                                                                  // 99
  // Keep track of whether it's a Meteor.Error                                                    // 100
  if(error instanceof Meteor.Error) {                                                             // 101
    plainObject['meteorError'] = true;                                                            // 102
  }                                                                                               // 103
                                                                                                  // 104
  return { error: plainObject };                                                                  // 105
};                                                                                                // 106
                                                                                                  // 107
// Create an error from the error format stored in mongo                                          // 108
var recreateError = function(errorDoc) {                                                          // 109
  var error;                                                                                      // 110
                                                                                                  // 111
  if (errorDoc.meteorError) {                                                                     // 112
    error = new Meteor.Error();                                                                   // 113
    delete errorDoc.meteorError;                                                                  // 114
  } else {                                                                                        // 115
    error = new Error();                                                                          // 116
  }                                                                                               // 117
                                                                                                  // 118
  Object.getOwnPropertyNames(errorDoc).forEach(function(key) {                                    // 119
    error[key] = errorDoc[key];                                                                   // 120
  });                                                                                             // 121
                                                                                                  // 122
  return error;                                                                                   // 123
};                                                                                                // 124
                                                                                                  // 125
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/deprecated.js                                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
// XXX COMPAT WITH 0.8.0                                                                          // 1
                                                                                                  // 2
Oauth = OAuth;                                                                                    // 3
                                                                                                  // 4
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.oauth = {
  OAuth: OAuth,
  OAuthTest: OAuthTest,
  Oauth: Oauth
};

})();
