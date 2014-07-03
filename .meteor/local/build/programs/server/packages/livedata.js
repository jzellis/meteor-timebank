(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var Deps = Package.deps.Deps;
var Log = Package.logging.Log;
var Retry = Package.retry.Retry;
var Hook = Package['callback-hook'].Hook;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var DDP, DDPServer, LivedataTest, toSockjsUrl, toWebsocketUrl, StreamServer, Heartbeat, Server, SUPPORTED_DDP_VERSIONS, MethodInvocation, parseDDP, stringifyDDP, RandomStream, makeRpcSeed, allConnections;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/common.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
LivedataTest = {};                                                                                                     // 1
                                                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/stream_client_nodejs.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// @param endpoint {String} URL to Meteor app                                                                          // 1
//   "http://subdomain.meteor.com/" or "/" or                                                                          // 2
//   "ddp+sockjs://foo-**.meteor.com/sockjs"                                                                           // 3
//                                                                                                                     // 4
// We do some rewriting of the URL to eventually make it "ws://" or "wss://",                                          // 5
// whatever was passed in.  At the very least, what Meteor.absoluteUrl() returns                                       // 6
// us should work.                                                                                                     // 7
//                                                                                                                     // 8
// We don't do any heartbeating. (The logic that did this in sockjs was removed,                                       // 9
// because it used a built-in sockjs mechanism. We could do it with WebSocket                                          // 10
// ping frames or with DDP-level messages.)                                                                            // 11
LivedataTest.ClientStream = function (endpoint, options) {                                                             // 12
  var self = this;                                                                                                     // 13
  options = options || {};                                                                                             // 14
                                                                                                                       // 15
  self.options = _.extend({                                                                                            // 16
    retry: true                                                                                                        // 17
  }, options);                                                                                                         // 18
                                                                                                                       // 19
  self.client = null;  // created in _launchConnection                                                                 // 20
  self.endpoint = endpoint;                                                                                            // 21
                                                                                                                       // 22
  self.headers = self.options.headers || {};                                                                           // 23
                                                                                                                       // 24
  self._initCommon();                                                                                                  // 25
                                                                                                                       // 26
  //// Kickoff!                                                                                                        // 27
  self._launchConnection();                                                                                            // 28
};                                                                                                                     // 29
                                                                                                                       // 30
_.extend(LivedataTest.ClientStream.prototype, {                                                                        // 31
                                                                                                                       // 32
  // data is a utf8 string. Data sent while not connected is dropped on                                                // 33
  // the floor, and it is up the user of this API to retransmit lost                                                   // 34
  // messages on 'reset'                                                                                               // 35
  send: function (data) {                                                                                              // 36
    var self = this;                                                                                                   // 37
    if (self.currentStatus.connected) {                                                                                // 38
      self.client.send(data);                                                                                          // 39
    }                                                                                                                  // 40
  },                                                                                                                   // 41
                                                                                                                       // 42
  // Changes where this connection points                                                                              // 43
  _changeUrl: function (url) {                                                                                         // 44
    var self = this;                                                                                                   // 45
    self.endpoint = url;                                                                                               // 46
  },                                                                                                                   // 47
                                                                                                                       // 48
  _onConnect: function (client) {                                                                                      // 49
    var self = this;                                                                                                   // 50
                                                                                                                       // 51
    if (client !== self.client) {                                                                                      // 52
      // This connection is not from the last call to _launchConnection.                                               // 53
      // But _launchConnection calls _cleanup which closes previous connections.                                       // 54
      // It's our belief that this stifles future 'open' events, but maybe                                             // 55
      // we are wrong?                                                                                                 // 56
      throw new Error("Got open from inactive client");                                                                // 57
    }                                                                                                                  // 58
                                                                                                                       // 59
    if (self._forcedToDisconnect) {                                                                                    // 60
      // We were asked to disconnect between trying to open the connection and                                         // 61
      // actually opening it. Let's just pretend this never happened.                                                  // 62
      self.client.close();                                                                                             // 63
      self.client = null;                                                                                              // 64
      return;                                                                                                          // 65
    }                                                                                                                  // 66
                                                                                                                       // 67
    if (self.currentStatus.connected) {                                                                                // 68
      // We already have a connection. It must have been the case that we                                              // 69
      // started two parallel connection attempts (because we wanted to                                                // 70
      // 'reconnect now' on a hanging connection and we had no way to cancel the                                       // 71
      // connection attempt.) But this shouldn't happen (similarly to the client                                       // 72
      // !== self.client check above).                                                                                 // 73
      throw new Error("Two parallel connections?");                                                                    // 74
    }                                                                                                                  // 75
                                                                                                                       // 76
    self._clearConnectionTimer();                                                                                      // 77
                                                                                                                       // 78
    // update status                                                                                                   // 79
    self.currentStatus.status = "connected";                                                                           // 80
    self.currentStatus.connected = true;                                                                               // 81
    self.currentStatus.retryCount = 0;                                                                                 // 82
    self.statusChanged();                                                                                              // 83
                                                                                                                       // 84
    // fire resets. This must come after status change so that clients                                                 // 85
    // can call send from within a reset callback.                                                                     // 86
    _.each(self.eventCallbacks.reset, function (callback) { callback(); });                                            // 87
  },                                                                                                                   // 88
                                                                                                                       // 89
  _cleanup: function () {                                                                                              // 90
    var self = this;                                                                                                   // 91
                                                                                                                       // 92
    self._clearConnectionTimer();                                                                                      // 93
    if (self.client) {                                                                                                 // 94
      var client = self.client;                                                                                        // 95
      self.client = null;                                                                                              // 96
      client.close();                                                                                                  // 97
    }                                                                                                                  // 98
                                                                                                                       // 99
    _.each(self.eventCallbacks.disconnect, function (callback) { callback(); });                                       // 100
  },                                                                                                                   // 101
                                                                                                                       // 102
  _clearConnectionTimer: function () {                                                                                 // 103
    var self = this;                                                                                                   // 104
                                                                                                                       // 105
    if (self.connectionTimer) {                                                                                        // 106
      clearTimeout(self.connectionTimer);                                                                              // 107
      self.connectionTimer = null;                                                                                     // 108
    }                                                                                                                  // 109
  },                                                                                                                   // 110
                                                                                                                       // 111
  _launchConnection: function () {                                                                                     // 112
    var self = this;                                                                                                   // 113
    self._cleanup(); // cleanup the old socket, if there was one.                                                      // 114
                                                                                                                       // 115
    // Since server-to-server DDP is still an experimental feature, we only                                            // 116
    // require the module if we actually create a server-to-server                                                     // 117
    // connection.                                                                                                     // 118
    var FayeWebSocket = Npm.require('faye-websocket');                                                                 // 119
                                                                                                                       // 120
    // We would like to specify 'ddp' as the subprotocol here. The npm module we                                       // 121
    // used to use as a client would fail the handshake if we ask for a                                                // 122
    // subprotocol and the server doesn't send one back (and sockjs doesn't).                                          // 123
    // Faye doesn't have that behavior; it's unclear from reading RFC 6455 if                                          // 124
    // Faye is erroneous or not.  So for now, we don't specify protocols.                                              // 125
    var client = self.client = new FayeWebSocket.Client(                                                               // 126
      toWebsocketUrl(self.endpoint),                                                                                   // 127
      [/*no subprotocols*/],                                                                                           // 128
      {headers: self.headers}                                                                                          // 129
    );                                                                                                                 // 130
                                                                                                                       // 131
    self._clearConnectionTimer();                                                                                      // 132
    self.connectionTimer = Meteor.setTimeout(                                                                          // 133
      _.bind(self._lostConnection, self),                                                                              // 134
      self.CONNECT_TIMEOUT);                                                                                           // 135
                                                                                                                       // 136
    self.client.on('open', Meteor.bindEnvironment(function () {                                                        // 137
      return self._onConnect(client);                                                                                  // 138
    }, "stream connect callback"));                                                                                    // 139
                                                                                                                       // 140
    var clientOnIfCurrent = function (event, description, f) {                                                         // 141
      self.client.on(event, Meteor.bindEnvironment(function () {                                                       // 142
        // Ignore events from any connection we've already cleaned up.                                                 // 143
        if (client !== self.client)                                                                                    // 144
          return;                                                                                                      // 145
        f.apply(this, arguments);                                                                                      // 146
      }, description));                                                                                                // 147
    };                                                                                                                 // 148
                                                                                                                       // 149
    clientOnIfCurrent('error', 'stream error callback', function (error) {                                             // 150
      if (!self.options._dontPrintErrors)                                                                              // 151
        Meteor._debug("stream error", error.message);                                                                  // 152
                                                                                                                       // 153
      // XXX: Make this do something better than make the tests hang if it does                                        // 154
      // not work.                                                                                                     // 155
      self._lostConnection();                                                                                          // 156
    });                                                                                                                // 157
                                                                                                                       // 158
                                                                                                                       // 159
    clientOnIfCurrent('close', 'stream close callback', function () {                                                  // 160
      self._lostConnection();                                                                                          // 161
    });                                                                                                                // 162
                                                                                                                       // 163
                                                                                                                       // 164
    clientOnIfCurrent('message', 'stream message callback', function (message) {                                       // 165
      // Ignore binary frames, where message.data is a Buffer                                                          // 166
      if (typeof message.data !== "string")                                                                            // 167
        return;                                                                                                        // 168
                                                                                                                       // 169
      _.each(self.eventCallbacks.message, function (callback) {                                                        // 170
        callback(message.data);                                                                                        // 171
      });                                                                                                              // 172
    });                                                                                                                // 173
  }                                                                                                                    // 174
});                                                                                                                    // 175
                                                                                                                       // 176
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/stream_client_common.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// XXX from Underscore.String (http://epeli.github.com/underscore.string/)                                             // 1
var startsWith = function(str, starts) {                                                                               // 2
  return str.length >= starts.length &&                                                                                // 3
    str.substring(0, starts.length) === starts;                                                                        // 4
};                                                                                                                     // 5
var endsWith = function(str, ends) {                                                                                   // 6
  return str.length >= ends.length &&                                                                                  // 7
    str.substring(str.length - ends.length) === ends;                                                                  // 8
};                                                                                                                     // 9
                                                                                                                       // 10
// @param url {String} URL to Meteor app, eg:                                                                          // 11
//   "/" or "madewith.meteor.com" or "https://foo.meteor.com"                                                          // 12
//   or "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                                 // 13
// @returns {String} URL to the endpoint with the specific scheme and subPath, e.g.                                    // 14
// for scheme "http" and subPath "sockjs"                                                                              // 15
//   "http://subdomain.meteor.com/sockjs" or "/sockjs"                                                                 // 16
//   or "https://ddp--1234-foo.meteor.com/sockjs"                                                                      // 17
var translateUrl =  function(url, newSchemeBase, subPath) {                                                            // 18
  if (! newSchemeBase) {                                                                                               // 19
    newSchemeBase = "http";                                                                                            // 20
  }                                                                                                                    // 21
                                                                                                                       // 22
  var ddpUrlMatch = url.match(/^ddp(i?)\+sockjs:\/\//);                                                                // 23
  var httpUrlMatch = url.match(/^http(s?):\/\//);                                                                      // 24
  var newScheme;                                                                                                       // 25
  if (ddpUrlMatch) {                                                                                                   // 26
    // Remove scheme and split off the host.                                                                           // 27
    var urlAfterDDP = url.substr(ddpUrlMatch[0].length);                                                               // 28
    newScheme = ddpUrlMatch[1] === "i" ? newSchemeBase : newSchemeBase + "s";                                          // 29
    var slashPos = urlAfterDDP.indexOf('/');                                                                           // 30
    var host =                                                                                                         // 31
          slashPos === -1 ? urlAfterDDP : urlAfterDDP.substr(0, slashPos);                                             // 32
    var rest = slashPos === -1 ? '' : urlAfterDDP.substr(slashPos);                                                    // 33
                                                                                                                       // 34
    // In the host (ONLY!), change '*' characters into random digits. This                                             // 35
    // allows different stream connections to connect to different hostnames                                           // 36
    // and avoid browser per-hostname connection limits.                                                               // 37
    host = host.replace(/\*/g, function () {                                                                           // 38
      return Math.floor(Random.fraction()*10);                                                                         // 39
    });                                                                                                                // 40
                                                                                                                       // 41
    return newScheme + '://' + host + rest;                                                                            // 42
  } else if (httpUrlMatch) {                                                                                           // 43
    newScheme = !httpUrlMatch[1] ? newSchemeBase : newSchemeBase + "s";                                                // 44
    var urlAfterHttp = url.substr(httpUrlMatch[0].length);                                                             // 45
    url = newScheme + "://" + urlAfterHttp;                                                                            // 46
  }                                                                                                                    // 47
                                                                                                                       // 48
  // Prefix FQDNs but not relative URLs                                                                                // 49
  if (url.indexOf("://") === -1 && !startsWith(url, "/")) {                                                            // 50
    url = newSchemeBase + "://" + url;                                                                                 // 51
  }                                                                                                                    // 52
                                                                                                                       // 53
  // XXX This is not what we should be doing: if I have a site                                                         // 54
  // deployed at "/foo", then DDP.connect("/") should actually connect                                                 // 55
  // to "/", not to "/foo". "/" is an absolute path. (Contrast: if                                                     // 56
  // deployed at "/foo", it would be reasonable for DDP.connect("bar")                                                 // 57
  // to connect to "/foo/bar").                                                                                        // 58
  //                                                                                                                   // 59
  // We should make this properly honor absolute paths rather than                                                     // 60
  // forcing the path to be relative to the site root. Simultaneously,                                                 // 61
  // we should set DDP_DEFAULT_CONNECTION_URL to include the site                                                      // 62
  // root. See also client_convenience.js #RationalizingRelativeDDPURLs                                                // 63
  url = Meteor._relativeToSiteRootUrl(url);                                                                            // 64
                                                                                                                       // 65
  if (endsWith(url, "/"))                                                                                              // 66
    return url + subPath;                                                                                              // 67
  else                                                                                                                 // 68
    return url + "/" + subPath;                                                                                        // 69
};                                                                                                                     // 70
                                                                                                                       // 71
toSockjsUrl = function (url) {                                                                                         // 72
  return translateUrl(url, "http", "sockjs");                                                                          // 73
};                                                                                                                     // 74
                                                                                                                       // 75
toWebsocketUrl = function (url) {                                                                                      // 76
  var ret = translateUrl(url, "ws", "websocket");                                                                      // 77
  return ret;                                                                                                          // 78
};                                                                                                                     // 79
                                                                                                                       // 80
LivedataTest.toSockjsUrl = toSockjsUrl;                                                                                // 81
                                                                                                                       // 82
                                                                                                                       // 83
_.extend(LivedataTest.ClientStream.prototype, {                                                                        // 84
                                                                                                                       // 85
  // Register for callbacks.                                                                                           // 86
  on: function (name, callback) {                                                                                      // 87
    var self = this;                                                                                                   // 88
                                                                                                                       // 89
    if (name !== 'message' && name !== 'reset' && name !== 'disconnect')                                               // 90
      throw new Error("unknown event type: " + name);                                                                  // 91
                                                                                                                       // 92
    if (!self.eventCallbacks[name])                                                                                    // 93
      self.eventCallbacks[name] = [];                                                                                  // 94
    self.eventCallbacks[name].push(callback);                                                                          // 95
  },                                                                                                                   // 96
                                                                                                                       // 97
                                                                                                                       // 98
  _initCommon: function () {                                                                                           // 99
    var self = this;                                                                                                   // 100
    //// Constants                                                                                                     // 101
                                                                                                                       // 102
    // how long to wait until we declare the connection attempt                                                        // 103
    // failed.                                                                                                         // 104
    self.CONNECT_TIMEOUT = 10000;                                                                                      // 105
                                                                                                                       // 106
    self.eventCallbacks = {}; // name -> [callback]                                                                    // 107
                                                                                                                       // 108
    self._forcedToDisconnect = false;                                                                                  // 109
                                                                                                                       // 110
    //// Reactive status                                                                                               // 111
    self.currentStatus = {                                                                                             // 112
      status: "connecting",                                                                                            // 113
      connected: false,                                                                                                // 114
      retryCount: 0                                                                                                    // 115
    };                                                                                                                 // 116
                                                                                                                       // 117
                                                                                                                       // 118
    self.statusListeners = typeof Deps !== 'undefined' && new Deps.Dependency;                                         // 119
    self.statusChanged = function () {                                                                                 // 120
      if (self.statusListeners)                                                                                        // 121
        self.statusListeners.changed();                                                                                // 122
    };                                                                                                                 // 123
                                                                                                                       // 124
    //// Retry logic                                                                                                   // 125
    self._retry = new Retry;                                                                                           // 126
    self.connectionTimer = null;                                                                                       // 127
                                                                                                                       // 128
  },                                                                                                                   // 129
                                                                                                                       // 130
  // Trigger a reconnect.                                                                                              // 131
  reconnect: function (options) {                                                                                      // 132
    var self = this;                                                                                                   // 133
    options = options || {};                                                                                           // 134
                                                                                                                       // 135
    if (options.url) {                                                                                                 // 136
      self._changeUrl(options.url);                                                                                    // 137
    }                                                                                                                  // 138
                                                                                                                       // 139
    if (options._sockjsOptions) {                                                                                      // 140
      self.options._sockjsOptions = options._sockjsOptions;                                                            // 141
    }                                                                                                                  // 142
                                                                                                                       // 143
    if (self.currentStatus.connected) {                                                                                // 144
      if (options._force || options.url) {                                                                             // 145
        // force reconnect.                                                                                            // 146
        self._lostConnection();                                                                                        // 147
      } // else, noop.                                                                                                 // 148
      return;                                                                                                          // 149
    }                                                                                                                  // 150
                                                                                                                       // 151
    // if we're mid-connection, stop it.                                                                               // 152
    if (self.currentStatus.status === "connecting") {                                                                  // 153
      self._lostConnection();                                                                                          // 154
    }                                                                                                                  // 155
                                                                                                                       // 156
    self._retry.clear();                                                                                               // 157
    self.currentStatus.retryCount -= 1; // don't count manual retries                                                  // 158
    self._retryNow();                                                                                                  // 159
  },                                                                                                                   // 160
                                                                                                                       // 161
  disconnect: function (options) {                                                                                     // 162
    var self = this;                                                                                                   // 163
    options = options || {};                                                                                           // 164
                                                                                                                       // 165
    // Failed is permanent. If we're failed, don't let people go back                                                  // 166
    // online by calling 'disconnect' then 'reconnect'.                                                                // 167
    if (self._forcedToDisconnect)                                                                                      // 168
      return;                                                                                                          // 169
                                                                                                                       // 170
    // If _permanent is set, permanently disconnect a stream. Once a stream                                            // 171
    // is forced to disconnect, it can never reconnect. This is for                                                    // 172
    // error cases such as ddp version mismatch, where trying again                                                    // 173
    // won't fix the problem.                                                                                          // 174
    if (options._permanent) {                                                                                          // 175
      self._forcedToDisconnect = true;                                                                                 // 176
    }                                                                                                                  // 177
                                                                                                                       // 178
    self._cleanup();                                                                                                   // 179
    self._retry.clear();                                                                                               // 180
                                                                                                                       // 181
    self.currentStatus = {                                                                                             // 182
      status: (options._permanent ? "failed" : "offline"),                                                             // 183
      connected: false,                                                                                                // 184
      retryCount: 0                                                                                                    // 185
    };                                                                                                                 // 186
                                                                                                                       // 187
    if (options._permanent && options._error)                                                                          // 188
      self.currentStatus.reason = options._error;                                                                      // 189
                                                                                                                       // 190
    self.statusChanged();                                                                                              // 191
  },                                                                                                                   // 192
                                                                                                                       // 193
  _lostConnection: function () {                                                                                       // 194
    var self = this;                                                                                                   // 195
                                                                                                                       // 196
    self._cleanup();                                                                                                   // 197
    self._retryLater(); // sets status. no need to do it here.                                                         // 198
  },                                                                                                                   // 199
                                                                                                                       // 200
  // fired when we detect that we've gone online. try to reconnect                                                     // 201
  // immediately.                                                                                                      // 202
  _online: function () {                                                                                               // 203
    // if we've requested to be offline by disconnecting, don't reconnect.                                             // 204
    if (this.currentStatus.status != "offline")                                                                        // 205
      this.reconnect();                                                                                                // 206
  },                                                                                                                   // 207
                                                                                                                       // 208
  _retryLater: function () {                                                                                           // 209
    var self = this;                                                                                                   // 210
                                                                                                                       // 211
    var timeout = 0;                                                                                                   // 212
    if (self.options.retry) {                                                                                          // 213
      timeout = self._retry.retryLater(                                                                                // 214
        self.currentStatus.retryCount,                                                                                 // 215
        _.bind(self._retryNow, self)                                                                                   // 216
      );                                                                                                               // 217
    }                                                                                                                  // 218
                                                                                                                       // 219
    self.currentStatus.status = "waiting";                                                                             // 220
    self.currentStatus.connected = false;                                                                              // 221
    self.currentStatus.retryTime = (new Date()).getTime() + timeout;                                                   // 222
    self.statusChanged();                                                                                              // 223
  },                                                                                                                   // 224
                                                                                                                       // 225
  _retryNow: function () {                                                                                             // 226
    var self = this;                                                                                                   // 227
                                                                                                                       // 228
    if (self._forcedToDisconnect)                                                                                      // 229
      return;                                                                                                          // 230
                                                                                                                       // 231
    self.currentStatus.retryCount += 1;                                                                                // 232
    self.currentStatus.status = "connecting";                                                                          // 233
    self.currentStatus.connected = false;                                                                              // 234
    delete self.currentStatus.retryTime;                                                                               // 235
    self.statusChanged();                                                                                              // 236
                                                                                                                       // 237
    self._launchConnection();                                                                                          // 238
  },                                                                                                                   // 239
                                                                                                                       // 240
                                                                                                                       // 241
  // Get current status. Reactive.                                                                                     // 242
  status: function () {                                                                                                // 243
    var self = this;                                                                                                   // 244
    if (self.statusListeners)                                                                                          // 245
      self.statusListeners.depend();                                                                                   // 246
    return self.currentStatus;                                                                                         // 247
  }                                                                                                                    // 248
});                                                                                                                    // 249
                                                                                                                       // 250
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/stream_server.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var url = Npm.require('url');                                                                                          // 1
                                                                                                                       // 2
var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX ||  "";                                                // 3
                                                                                                                       // 4
StreamServer = function () {                                                                                           // 5
  var self = this;                                                                                                     // 6
  self.registration_callbacks = [];                                                                                    // 7
  self.open_sockets = [];                                                                                              // 8
                                                                                                                       // 9
  // Because we are installing directly onto WebApp.httpServer instead of using                                        // 10
  // WebApp.app, we have to process the path prefix ourselves.                                                         // 11
  self.prefix = pathPrefix + '/sockjs';                                                                                // 12
  // routepolicy is only a weak dependency, because we don't need it if we're                                          // 13
  // just doing server-to-server DDP as a client.                                                                      // 14
  if (Package.routepolicy) {                                                                                           // 15
    Package.routepolicy.RoutePolicy.declare(self.prefix + '/', 'network');                                             // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  // set up sockjs                                                                                                     // 19
  var sockjs = Npm.require('sockjs');                                                                                  // 20
  var serverOptions = {                                                                                                // 21
    prefix: self.prefix,                                                                                               // 22
    log: function() {},                                                                                                // 23
    // this is the default, but we code it explicitly because we depend                                                // 24
    // on it in stream_client:HEARTBEAT_TIMEOUT                                                                        // 25
    heartbeat_delay: 45000,                                                                                            // 26
    // The default disconnect_delay is 5 seconds, but if the server ends up CPU                                        // 27
    // bound for that much time, SockJS might not notice that the user has                                             // 28
    // reconnected because the timer (of disconnect_delay ms) can fire before                                          // 29
    // SockJS processes the new connection. Eventually we'll fix this by not                                           // 30
    // combining CPU-heavy processing with SockJS termination (eg a proxy which                                        // 31
    // converts to Unix sockets) but for now, raise the delay.                                                         // 32
    disconnect_delay: 60 * 1000,                                                                                       // 33
    // Set the USE_JSESSIONID environment variable to enable setting the                                               // 34
    // JSESSIONID cookie. This is useful for setting up proxies with                                                   // 35
    // session affinity.                                                                                               // 36
    jsessionid: !!process.env.USE_JSESSIONID                                                                           // 37
  };                                                                                                                   // 38
                                                                                                                       // 39
  // If you know your server environment (eg, proxies) will prevent websockets                                         // 40
  // from ever working, set $DISABLE_WEBSOCKETS and SockJS clients (ie,                                                // 41
  // browsers) will not waste time attempting to use them.                                                             // 42
  // (Your server will still have a /websocket endpoint.)                                                              // 43
  if (process.env.DISABLE_WEBSOCKETS)                                                                                  // 44
    serverOptions.websocket = false;                                                                                   // 45
                                                                                                                       // 46
  self.server = sockjs.createServer(serverOptions);                                                                    // 47
  if (!Package.webapp) {                                                                                               // 48
    throw new Error("Cannot create a DDP server without the webapp package");                                          // 49
  }                                                                                                                    // 50
  // Install the sockjs handlers, but we want to keep around our own particular                                        // 51
  // request handler that adjusts idle timeouts while we have an outstanding                                           // 52
  // request.  This compensates for the fact that sockjs removes all listeners                                         // 53
  // for "request" to add its own.                                                                                     // 54
  Package.webapp.WebApp.httpServer.removeListener('request', Package.webapp.WebApp._timeoutAdjustmentRequestCallback); // 55
  self.server.installHandlers(Package.webapp.WebApp.httpServer);                                                       // 56
  Package.webapp.WebApp.httpServer.addListener('request', Package.webapp.WebApp._timeoutAdjustmentRequestCallback);    // 57
                                                                                                                       // 58
  Package.webapp.WebApp.httpServer.on('meteor-closing', function () {                                                  // 59
    _.each(self.open_sockets, function (socket) {                                                                      // 60
      socket.end();                                                                                                    // 61
    });                                                                                                                // 62
  });                                                                                                                  // 63
                                                                                                                       // 64
  // Support the /websocket endpoint                                                                                   // 65
  self._redirectWebsocketEndpoint();                                                                                   // 66
                                                                                                                       // 67
  self.server.on('connection', function (socket) {                                                                     // 68
                                                                                                                       // 69
    if (Package.webapp.WebAppInternals.usingDdpProxy) {                                                                // 70
      // If we are behind a DDP proxy, immediately close any sockjs connections                                        // 71
      // that are not using websockets; the proxy will terminate sockjs for us,                                        // 72
      // so we don't expect to be handling any other transports.                                                       // 73
      if (socket.protocol !== "websocket" &&                                                                           // 74
          socket.protocol !== "websocket-raw") {                                                                       // 75
        socket.close();                                                                                                // 76
        return;                                                                                                        // 77
      }                                                                                                                // 78
    }                                                                                                                  // 79
                                                                                                                       // 80
    socket.send = function (data) {                                                                                    // 81
      socket.write(data);                                                                                              // 82
    };                                                                                                                 // 83
    socket.on('close', function () {                                                                                   // 84
      self.open_sockets = _.without(self.open_sockets, socket);                                                        // 85
    });                                                                                                                // 86
    self.open_sockets.push(socket);                                                                                    // 87
                                                                                                                       // 88
    // XXX COMPAT WITH 0.6.6. Send the old style welcome message, which                                                // 89
    // will force old clients to reload. Remove this once we're not                                                    // 90
    // concerned about people upgrading from a pre-0.7.0 release. Also,                                                // 91
    // remove the clause in the client that ignores the welcome message                                                // 92
    // (livedata_connection.js)                                                                                        // 93
    socket.send(JSON.stringify({server_id: "0"}));                                                                     // 94
                                                                                                                       // 95
    // call all our callbacks when we get a new socket. they will do the                                               // 96
    // work of setting up handlers and such for specific messages.                                                     // 97
    _.each(self.registration_callbacks, function (callback) {                                                          // 98
      callback(socket);                                                                                                // 99
    });                                                                                                                // 100
  });                                                                                                                  // 101
                                                                                                                       // 102
};                                                                                                                     // 103
                                                                                                                       // 104
_.extend(StreamServer.prototype, {                                                                                     // 105
  // call my callback when a new socket connects.                                                                      // 106
  // also call it for all current connections.                                                                         // 107
  register: function (callback) {                                                                                      // 108
    var self = this;                                                                                                   // 109
    self.registration_callbacks.push(callback);                                                                        // 110
    _.each(self.all_sockets(), function (socket) {                                                                     // 111
      callback(socket);                                                                                                // 112
    });                                                                                                                // 113
  },                                                                                                                   // 114
                                                                                                                       // 115
  // get a list of all sockets                                                                                         // 116
  all_sockets: function () {                                                                                           // 117
    var self = this;                                                                                                   // 118
    return _.values(self.open_sockets);                                                                                // 119
  },                                                                                                                   // 120
                                                                                                                       // 121
  // Redirect /websocket to /sockjs/websocket in order to not expose                                                   // 122
  // sockjs to clients that want to use raw websockets                                                                 // 123
  _redirectWebsocketEndpoint: function() {                                                                             // 124
    var self = this;                                                                                                   // 125
    // Unfortunately we can't use a connect middleware here since                                                      // 126
    // sockjs installs itself prior to all existing listeners                                                          // 127
    // (meaning prior to any connect middlewares) so we need to take                                                   // 128
    // an approach similar to overshadowListeners in                                                                   // 129
    // https://github.com/sockjs/sockjs-node/blob/cf820c55af6a9953e16558555a31decea554f70e/src/utils.coffee            // 130
    _.each(['request', 'upgrade'], function(event) {                                                                   // 131
      var httpServer = Package.webapp.WebApp.httpServer;                                                               // 132
      var oldHttpServerListeners = httpServer.listeners(event).slice(0);                                               // 133
      httpServer.removeAllListeners(event);                                                                            // 134
                                                                                                                       // 135
      // request and upgrade have different arguments passed but                                                       // 136
      // we only care about the first one which is always request                                                      // 137
      var newListener = function(request /*, moreArguments */) {                                                       // 138
        // Store arguments for use within the closure below                                                            // 139
        var args = arguments;                                                                                          // 140
                                                                                                                       // 141
        // Rewrite /websocket and /websocket/ urls to /sockjs/websocket while                                          // 142
        // preserving query string.                                                                                    // 143
        var parsedUrl = url.parse(request.url);                                                                        // 144
        if (parsedUrl.pathname === pathPrefix + '/websocket' ||                                                        // 145
            parsedUrl.pathname === pathPrefix + '/websocket/') {                                                       // 146
          parsedUrl.pathname = self.prefix + '/websocket';                                                             // 147
          request.url = url.format(parsedUrl);                                                                         // 148
        }                                                                                                              // 149
        _.each(oldHttpServerListeners, function(oldListener) {                                                         // 150
          oldListener.apply(httpServer, args);                                                                         // 151
        });                                                                                                            // 152
      };                                                                                                               // 153
      httpServer.addListener(event, newListener);                                                                      // 154
    });                                                                                                                // 155
  }                                                                                                                    // 156
});                                                                                                                    // 157
                                                                                                                       // 158
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/heartbeat.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Heartbeat options:                                                                                                  // 1
//   heartbeatInterval: interval to send pings, in milliseconds.                                                       // 2
//   heartbeatTimeout: timeout to close the connection if a reply isn't                                                // 3
//     received, in milliseconds.                                                                                      // 4
//   sendPing: function to call to send a ping on the connection.                                                      // 5
//   onTimeout: function to call to close the connection.                                                              // 6
                                                                                                                       // 7
Heartbeat = function (options) {                                                                                       // 8
  var self = this;                                                                                                     // 9
                                                                                                                       // 10
  self.heartbeatInterval = options.heartbeatInterval;                                                                  // 11
  self.heartbeatTimeout = options.heartbeatTimeout;                                                                    // 12
  self._sendPing = options.sendPing;                                                                                   // 13
  self._onTimeout = options.onTimeout;                                                                                 // 14
                                                                                                                       // 15
  self._heartbeatIntervalHandle = null;                                                                                // 16
  self._heartbeatTimeoutHandle = null;                                                                                 // 17
};                                                                                                                     // 18
                                                                                                                       // 19
_.extend(Heartbeat.prototype, {                                                                                        // 20
  stop: function () {                                                                                                  // 21
    var self = this;                                                                                                   // 22
    self._clearHeartbeatIntervalTimer();                                                                               // 23
    self._clearHeartbeatTimeoutTimer();                                                                                // 24
  },                                                                                                                   // 25
                                                                                                                       // 26
  start: function () {                                                                                                 // 27
    var self = this;                                                                                                   // 28
    self.stop();                                                                                                       // 29
    self._startHeartbeatIntervalTimer();                                                                               // 30
  },                                                                                                                   // 31
                                                                                                                       // 32
  _startHeartbeatIntervalTimer: function () {                                                                          // 33
    var self = this;                                                                                                   // 34
    self._heartbeatIntervalHandle = Meteor.setTimeout(                                                                 // 35
      _.bind(self._heartbeatIntervalFired, self),                                                                      // 36
      self.heartbeatInterval                                                                                           // 37
    );                                                                                                                 // 38
  },                                                                                                                   // 39
                                                                                                                       // 40
  _startHeartbeatTimeoutTimer: function () {                                                                           // 41
    var self = this;                                                                                                   // 42
    self._heartbeatTimeoutHandle = Meteor.setTimeout(                                                                  // 43
      _.bind(self._heartbeatTimeoutFired, self),                                                                       // 44
      self.heartbeatTimeout                                                                                            // 45
    );                                                                                                                 // 46
  },                                                                                                                   // 47
                                                                                                                       // 48
  _clearHeartbeatIntervalTimer: function () {                                                                          // 49
    var self = this;                                                                                                   // 50
    if (self._heartbeatIntervalHandle) {                                                                               // 51
      Meteor.clearTimeout(self._heartbeatIntervalHandle);                                                              // 52
      self._heartbeatIntervalHandle = null;                                                                            // 53
    }                                                                                                                  // 54
  },                                                                                                                   // 55
                                                                                                                       // 56
  _clearHeartbeatTimeoutTimer: function () {                                                                           // 57
    var self = this;                                                                                                   // 58
    if (self._heartbeatTimeoutHandle) {                                                                                // 59
      Meteor.clearTimeout(self._heartbeatTimeoutHandle);                                                               // 60
      self._heartbeatTimeoutHandle = null;                                                                             // 61
    }                                                                                                                  // 62
  },                                                                                                                   // 63
                                                                                                                       // 64
  // The heartbeat interval timer is fired when we should send a ping.                                                 // 65
  _heartbeatIntervalFired: function () {                                                                               // 66
    var self = this;                                                                                                   // 67
    self._heartbeatIntervalHandle = null;                                                                              // 68
    self._sendPing();                                                                                                  // 69
    // Wait for a pong.                                                                                                // 70
    self._startHeartbeatTimeoutTimer();                                                                                // 71
  },                                                                                                                   // 72
                                                                                                                       // 73
  // The heartbeat timeout timer is fired when we sent a ping, but we                                                  // 74
  // timed out waiting for the pong.                                                                                   // 75
  _heartbeatTimeoutFired: function () {                                                                                // 76
    var self = this;                                                                                                   // 77
    self._heartbeatTimeoutHandle = null;                                                                               // 78
    self._onTimeout();                                                                                                 // 79
  },                                                                                                                   // 80
                                                                                                                       // 81
  pingReceived: function () {                                                                                          // 82
    var self = this;                                                                                                   // 83
    // We know the connection is alive if we receive a ping, so we                                                     // 84
    // don't need to send a ping ourselves.  Reset the interval timer.                                                 // 85
    if (self._heartbeatIntervalHandle) {                                                                               // 86
      self._clearHeartbeatIntervalTimer();                                                                             // 87
      self._startHeartbeatIntervalTimer();                                                                             // 88
    }                                                                                                                  // 89
  },                                                                                                                   // 90
                                                                                                                       // 91
  pongReceived: function () {                                                                                          // 92
    var self = this;                                                                                                   // 93
                                                                                                                       // 94
    // Receiving a pong means we won't timeout, so clear the timeout                                                   // 95
    // timer and start the interval again.                                                                             // 96
    if (self._heartbeatTimeoutHandle) {                                                                                // 97
      self._clearHeartbeatTimeoutTimer();                                                                              // 98
      self._startHeartbeatIntervalTimer();                                                                             // 99
    }                                                                                                                  // 100
  }                                                                                                                    // 101
});                                                                                                                    // 102
                                                                                                                       // 103
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/livedata_server.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
DDPServer = {};                                                                                                        // 1
                                                                                                                       // 2
var Fiber = Npm.require('fibers');                                                                                     // 3
                                                                                                                       // 4
// This file contains classes:                                                                                         // 5
// * Session - The server's connection to a single DDP client                                                          // 6
// * Subscription - A single subscription for a single client                                                          // 7
// * Server - An entire server that may talk to > 1 client. A DDP endpoint.                                            // 8
//                                                                                                                     // 9
// Session and Subscription are file scope. For now, until we freeze                                                   // 10
// the interface, Server is package scope (in the future it should be                                                  // 11
// exported.)                                                                                                          // 12
                                                                                                                       // 13
// Represents a single document in a SessionCollectionView                                                             // 14
var SessionDocumentView = function () {                                                                                // 15
  var self = this;                                                                                                     // 16
  self.existsIn = {}; // set of subscriptionHandle                                                                     // 17
  self.dataByKey = {}; // key-> [ {subscriptionHandle, value} by precedence]                                           // 18
};                                                                                                                     // 19
                                                                                                                       // 20
_.extend(SessionDocumentView.prototype, {                                                                              // 21
                                                                                                                       // 22
  getFields: function () {                                                                                             // 23
    var self = this;                                                                                                   // 24
    var ret = {};                                                                                                      // 25
    _.each(self.dataByKey, function (precedenceList, key) {                                                            // 26
      ret[key] = precedenceList[0].value;                                                                              // 27
    });                                                                                                                // 28
    return ret;                                                                                                        // 29
  },                                                                                                                   // 30
                                                                                                                       // 31
  clearField: function (subscriptionHandle, key, changeCollector) {                                                    // 32
    var self = this;                                                                                                   // 33
    // Publish API ignores _id if present in fields                                                                    // 34
    if (key === "_id")                                                                                                 // 35
      return;                                                                                                          // 36
    var precedenceList = self.dataByKey[key];                                                                          // 37
                                                                                                                       // 38
    // It's okay to clear fields that didn't exist. No need to throw                                                   // 39
    // an error.                                                                                                       // 40
    if (!precedenceList)                                                                                               // 41
      return;                                                                                                          // 42
                                                                                                                       // 43
    var removedValue = undefined;                                                                                      // 44
    for (var i = 0; i < precedenceList.length; i++) {                                                                  // 45
      var precedence = precedenceList[i];                                                                              // 46
      if (precedence.subscriptionHandle === subscriptionHandle) {                                                      // 47
        // The view's value can only change if this subscription is the one that                                       // 48
        // used to have precedence.                                                                                    // 49
        if (i === 0)                                                                                                   // 50
          removedValue = precedence.value;                                                                             // 51
        precedenceList.splice(i, 1);                                                                                   // 52
        break;                                                                                                         // 53
      }                                                                                                                // 54
    }                                                                                                                  // 55
    if (_.isEmpty(precedenceList)) {                                                                                   // 56
      delete self.dataByKey[key];                                                                                      // 57
      changeCollector[key] = undefined;                                                                                // 58
    } else if (removedValue !== undefined &&                                                                           // 59
               !EJSON.equals(removedValue, precedenceList[0].value)) {                                                 // 60
      changeCollector[key] = precedenceList[0].value;                                                                  // 61
    }                                                                                                                  // 62
  },                                                                                                                   // 63
                                                                                                                       // 64
  changeField: function (subscriptionHandle, key, value,                                                               // 65
                         changeCollector, isAdd) {                                                                     // 66
    var self = this;                                                                                                   // 67
    // Publish API ignores _id if present in fields                                                                    // 68
    if (key === "_id")                                                                                                 // 69
      return;                                                                                                          // 70
                                                                                                                       // 71
    // Don't share state with the data passed in by the user.                                                          // 72
    value = EJSON.clone(value);                                                                                        // 73
                                                                                                                       // 74
    if (!_.has(self.dataByKey, key)) {                                                                                 // 75
      self.dataByKey[key] = [{subscriptionHandle: subscriptionHandle,                                                  // 76
                              value: value}];                                                                          // 77
      changeCollector[key] = value;                                                                                    // 78
      return;                                                                                                          // 79
    }                                                                                                                  // 80
    var precedenceList = self.dataByKey[key];                                                                          // 81
    var elt;                                                                                                           // 82
    if (!isAdd) {                                                                                                      // 83
      elt = _.find(precedenceList, function (precedence) {                                                             // 84
        return precedence.subscriptionHandle === subscriptionHandle;                                                   // 85
      });                                                                                                              // 86
    }                                                                                                                  // 87
                                                                                                                       // 88
    if (elt) {                                                                                                         // 89
      if (elt === precedenceList[0] && !EJSON.equals(value, elt.value)) {                                              // 90
        // this subscription is changing the value of this field.                                                      // 91
        changeCollector[key] = value;                                                                                  // 92
      }                                                                                                                // 93
      elt.value = value;                                                                                               // 94
    } else {                                                                                                           // 95
      // this subscription is newly caring about this field                                                            // 96
      precedenceList.push({subscriptionHandle: subscriptionHandle, value: value});                                     // 97
    }                                                                                                                  // 98
                                                                                                                       // 99
  }                                                                                                                    // 100
});                                                                                                                    // 101
                                                                                                                       // 102
// Represents a client's view of a single collection                                                                   // 103
var SessionCollectionView = function (collectionName, sessionCallbacks) {                                              // 104
  var self = this;                                                                                                     // 105
  self.collectionName = collectionName;                                                                                // 106
  self.documents = {};                                                                                                 // 107
  self.callbacks = sessionCallbacks;                                                                                   // 108
};                                                                                                                     // 109
                                                                                                                       // 110
LivedataTest.SessionCollectionView = SessionCollectionView;                                                            // 111
                                                                                                                       // 112
                                                                                                                       // 113
_.extend(SessionCollectionView.prototype, {                                                                            // 114
                                                                                                                       // 115
  isEmpty: function () {                                                                                               // 116
    var self = this;                                                                                                   // 117
    return _.isEmpty(self.documents);                                                                                  // 118
  },                                                                                                                   // 119
                                                                                                                       // 120
  diff: function (previous) {                                                                                          // 121
    var self = this;                                                                                                   // 122
    LocalCollection._diffObjects(previous.documents, self.documents, {                                                 // 123
      both: _.bind(self.diffDocument, self),                                                                           // 124
                                                                                                                       // 125
      rightOnly: function (id, nowDV) {                                                                                // 126
        self.callbacks.added(self.collectionName, id, nowDV.getFields());                                              // 127
      },                                                                                                               // 128
                                                                                                                       // 129
      leftOnly: function (id, prevDV) {                                                                                // 130
        self.callbacks.removed(self.collectionName, id);                                                               // 131
      }                                                                                                                // 132
    });                                                                                                                // 133
  },                                                                                                                   // 134
                                                                                                                       // 135
  diffDocument: function (id, prevDV, nowDV) {                                                                         // 136
    var self = this;                                                                                                   // 137
    var fields = {};                                                                                                   // 138
    LocalCollection._diffObjects(prevDV.getFields(), nowDV.getFields(), {                                              // 139
      both: function (key, prev, now) {                                                                                // 140
        if (!EJSON.equals(prev, now))                                                                                  // 141
          fields[key] = now;                                                                                           // 142
      },                                                                                                               // 143
      rightOnly: function (key, now) {                                                                                 // 144
        fields[key] = now;                                                                                             // 145
      },                                                                                                               // 146
      leftOnly: function(key, prev) {                                                                                  // 147
        fields[key] = undefined;                                                                                       // 148
      }                                                                                                                // 149
    });                                                                                                                // 150
    self.callbacks.changed(self.collectionName, id, fields);                                                           // 151
  },                                                                                                                   // 152
                                                                                                                       // 153
  added: function (subscriptionHandle, id, fields) {                                                                   // 154
    var self = this;                                                                                                   // 155
    var docView = self.documents[id];                                                                                  // 156
    var added = false;                                                                                                 // 157
    if (!docView) {                                                                                                    // 158
      added = true;                                                                                                    // 159
      docView = new SessionDocumentView();                                                                             // 160
      self.documents[id] = docView;                                                                                    // 161
    }                                                                                                                  // 162
    docView.existsIn[subscriptionHandle] = true;                                                                       // 163
    var changeCollector = {};                                                                                          // 164
    _.each(fields, function (value, key) {                                                                             // 165
      docView.changeField(                                                                                             // 166
        subscriptionHandle, key, value, changeCollector, true);                                                        // 167
    });                                                                                                                // 168
    if (added)                                                                                                         // 169
      self.callbacks.added(self.collectionName, id, changeCollector);                                                  // 170
    else                                                                                                               // 171
      self.callbacks.changed(self.collectionName, id, changeCollector);                                                // 172
  },                                                                                                                   // 173
                                                                                                                       // 174
  changed: function (subscriptionHandle, id, changed) {                                                                // 175
    var self = this;                                                                                                   // 176
    var changedResult = {};                                                                                            // 177
    var docView = self.documents[id];                                                                                  // 178
    if (!docView)                                                                                                      // 179
      throw new Error("Could not find element with id " + id + " to change");                                          // 180
    _.each(changed, function (value, key) {                                                                            // 181
      if (value === undefined)                                                                                         // 182
        docView.clearField(subscriptionHandle, key, changedResult);                                                    // 183
      else                                                                                                             // 184
        docView.changeField(subscriptionHandle, key, value, changedResult);                                            // 185
    });                                                                                                                // 186
    self.callbacks.changed(self.collectionName, id, changedResult);                                                    // 187
  },                                                                                                                   // 188
                                                                                                                       // 189
  removed: function (subscriptionHandle, id) {                                                                         // 190
    var self = this;                                                                                                   // 191
    var docView = self.documents[id];                                                                                  // 192
    if (!docView) {                                                                                                    // 193
      var err = new Error("Removed nonexistent document " + id);                                                       // 194
      throw err;                                                                                                       // 195
    }                                                                                                                  // 196
    delete docView.existsIn[subscriptionHandle];                                                                       // 197
    if (_.isEmpty(docView.existsIn)) {                                                                                 // 198
      // it is gone from everyone                                                                                      // 199
      self.callbacks.removed(self.collectionName, id);                                                                 // 200
      delete self.documents[id];                                                                                       // 201
    } else {                                                                                                           // 202
      var changed = {};                                                                                                // 203
      // remove this subscription from every precedence list                                                           // 204
      // and record the changes                                                                                        // 205
      _.each(docView.dataByKey, function (precedenceList, key) {                                                       // 206
        docView.clearField(subscriptionHandle, key, changed);                                                          // 207
      });                                                                                                              // 208
                                                                                                                       // 209
      self.callbacks.changed(self.collectionName, id, changed);                                                        // 210
    }                                                                                                                  // 211
  }                                                                                                                    // 212
});                                                                                                                    // 213
                                                                                                                       // 214
/******************************************************************************/                                       // 215
/* Session                                                                    */                                       // 216
/******************************************************************************/                                       // 217
                                                                                                                       // 218
var Session = function (server, version, socket, options) {                                                            // 219
  var self = this;                                                                                                     // 220
  self.id = Random.id();                                                                                               // 221
                                                                                                                       // 222
  self.server = server;                                                                                                // 223
  self.version = version;                                                                                              // 224
                                                                                                                       // 225
  self.initialized = false;                                                                                            // 226
  self.socket = socket;                                                                                                // 227
                                                                                                                       // 228
  // set to null when the session is destroyed. multiple places below                                                  // 229
  // use this to determine if the session is alive or not.                                                             // 230
  self.inQueue = [];                                                                                                   // 231
                                                                                                                       // 232
  self.blocked = false;                                                                                                // 233
  self.workerRunning = false;                                                                                          // 234
                                                                                                                       // 235
  // Sub objects for active subscriptions                                                                              // 236
  self._namedSubs = {};                                                                                                // 237
  self._universalSubs = [];                                                                                            // 238
                                                                                                                       // 239
  self.userId = null;                                                                                                  // 240
                                                                                                                       // 241
  self.collectionViews = {};                                                                                           // 242
                                                                                                                       // 243
  // Set this to false to not send messages when collectionViews are                                                   // 244
  // modified. This is done when rerunning subs in _setUserId and those messages                                       // 245
  // are calculated via a diff instead.                                                                                // 246
  self._isSending = true;                                                                                              // 247
                                                                                                                       // 248
  // If this is true, don't start a newly-created universal publisher on this                                          // 249
  // session. The session will take care of starting it when appropriate.                                              // 250
  self._dontStartNewUniversalSubs = false;                                                                             // 251
                                                                                                                       // 252
  // when we are rerunning subscriptions, any ready messages                                                           // 253
  // we want to buffer up for when we are done rerunning subscriptions                                                 // 254
  self._pendingReady = [];                                                                                             // 255
                                                                                                                       // 256
  // List of callbacks to call when this connection is closed.                                                         // 257
  self._closeCallbacks = [];                                                                                           // 258
                                                                                                                       // 259
                                                                                                                       // 260
  // XXX HACK: If a sockjs connection, save off the URL. This is                                                       // 261
  // temporary and will go away in the near future.                                                                    // 262
  self._socketUrl = socket.url;                                                                                        // 263
                                                                                                                       // 264
  // Allow tests to disable responding to pings.                                                                       // 265
  self._respondToPings = options.respondToPings;                                                                       // 266
                                                                                                                       // 267
  // This object is the public interface to the session. In the public                                                 // 268
  // API, it is called the `connection` object.  Internally we call it                                                 // 269
  // a `connectionHandle` to avoid ambiguity.                                                                          // 270
  self.connectionHandle = {                                                                                            // 271
    id: self.id,                                                                                                       // 272
    close: function () {                                                                                               // 273
      self.close();                                                                                                    // 274
    },                                                                                                                 // 275
    onClose: function (fn) {                                                                                           // 276
      var cb = Meteor.bindEnvironment(fn, "connection onClose callback");                                              // 277
      if (self.inQueue) {                                                                                              // 278
        self._closeCallbacks.push(cb);                                                                                 // 279
      } else {                                                                                                         // 280
        // if we're already closed, call the callback.                                                                 // 281
        Meteor.defer(cb);                                                                                              // 282
      }                                                                                                                // 283
    },                                                                                                                 // 284
    clientAddress: self._clientAddress(),                                                                              // 285
    httpHeaders: self.socket.headers                                                                                   // 286
  };                                                                                                                   // 287
                                                                                                                       // 288
  socket.send(stringifyDDP({msg: 'connected',                                                                          // 289
                            session: self.id}));                                                                       // 290
  // On initial connect, spin up all the universal publishers.                                                         // 291
  Fiber(function () {                                                                                                  // 292
    self.startUniversalSubs();                                                                                         // 293
  }).run();                                                                                                            // 294
                                                                                                                       // 295
  if (version !== 'pre1' && options.heartbeatInterval !== 0) {                                                         // 296
    self.heartbeat = new Heartbeat({                                                                                   // 297
      heartbeatInterval: options.heartbeatInterval,                                                                    // 298
      heartbeatTimeout: options.heartbeatTimeout,                                                                      // 299
      onTimeout: function () {                                                                                         // 300
        self.close();                                                                                                  // 301
      },                                                                                                               // 302
      sendPing: function () {                                                                                          // 303
        self.send({msg: 'ping'});                                                                                      // 304
      }                                                                                                                // 305
    });                                                                                                                // 306
    self.heartbeat.start();                                                                                            // 307
  }                                                                                                                    // 308
                                                                                                                       // 309
  Package.facts && Package.facts.Facts.incrementServerFact(                                                            // 310
    "livedata", "sessions", 1);                                                                                        // 311
};                                                                                                                     // 312
                                                                                                                       // 313
_.extend(Session.prototype, {                                                                                          // 314
                                                                                                                       // 315
  sendReady: function (subscriptionIds) {                                                                              // 316
    var self = this;                                                                                                   // 317
    if (self._isSending)                                                                                               // 318
      self.send({msg: "ready", subs: subscriptionIds});                                                                // 319
    else {                                                                                                             // 320
      _.each(subscriptionIds, function (subscriptionId) {                                                              // 321
        self._pendingReady.push(subscriptionId);                                                                       // 322
      });                                                                                                              // 323
    }                                                                                                                  // 324
  },                                                                                                                   // 325
                                                                                                                       // 326
  sendAdded: function (collectionName, id, fields) {                                                                   // 327
    var self = this;                                                                                                   // 328
    if (self._isSending)                                                                                               // 329
      self.send({msg: "added", collection: collectionName, id: id, fields: fields});                                   // 330
  },                                                                                                                   // 331
                                                                                                                       // 332
  sendChanged: function (collectionName, id, fields) {                                                                 // 333
    var self = this;                                                                                                   // 334
    if (_.isEmpty(fields))                                                                                             // 335
      return;                                                                                                          // 336
                                                                                                                       // 337
    if (self._isSending) {                                                                                             // 338
      self.send({                                                                                                      // 339
        msg: "changed",                                                                                                // 340
        collection: collectionName,                                                                                    // 341
        id: id,                                                                                                        // 342
        fields: fields                                                                                                 // 343
      });                                                                                                              // 344
    }                                                                                                                  // 345
  },                                                                                                                   // 346
                                                                                                                       // 347
  sendRemoved: function (collectionName, id) {                                                                         // 348
    var self = this;                                                                                                   // 349
    if (self._isSending)                                                                                               // 350
      self.send({msg: "removed", collection: collectionName, id: id});                                                 // 351
  },                                                                                                                   // 352
                                                                                                                       // 353
  getSendCallbacks: function () {                                                                                      // 354
    var self = this;                                                                                                   // 355
    return {                                                                                                           // 356
      added: _.bind(self.sendAdded, self),                                                                             // 357
      changed: _.bind(self.sendChanged, self),                                                                         // 358
      removed: _.bind(self.sendRemoved, self)                                                                          // 359
    };                                                                                                                 // 360
  },                                                                                                                   // 361
                                                                                                                       // 362
  getCollectionView: function (collectionName) {                                                                       // 363
    var self = this;                                                                                                   // 364
    if (_.has(self.collectionViews, collectionName)) {                                                                 // 365
      return self.collectionViews[collectionName];                                                                     // 366
    }                                                                                                                  // 367
    var ret = new SessionCollectionView(collectionName,                                                                // 368
                                        self.getSendCallbacks());                                                      // 369
    self.collectionViews[collectionName] = ret;                                                                        // 370
    return ret;                                                                                                        // 371
  },                                                                                                                   // 372
                                                                                                                       // 373
  added: function (subscriptionHandle, collectionName, id, fields) {                                                   // 374
    var self = this;                                                                                                   // 375
    var view = self.getCollectionView(collectionName);                                                                 // 376
    view.added(subscriptionHandle, id, fields);                                                                        // 377
  },                                                                                                                   // 378
                                                                                                                       // 379
  removed: function (subscriptionHandle, collectionName, id) {                                                         // 380
    var self = this;                                                                                                   // 381
    var view = self.getCollectionView(collectionName);                                                                 // 382
    view.removed(subscriptionHandle, id);                                                                              // 383
    if (view.isEmpty()) {                                                                                              // 384
      delete self.collectionViews[collectionName];                                                                     // 385
    }                                                                                                                  // 386
  },                                                                                                                   // 387
                                                                                                                       // 388
  changed: function (subscriptionHandle, collectionName, id, fields) {                                                 // 389
    var self = this;                                                                                                   // 390
    var view = self.getCollectionView(collectionName);                                                                 // 391
    view.changed(subscriptionHandle, id, fields);                                                                      // 392
  },                                                                                                                   // 393
                                                                                                                       // 394
  startUniversalSubs: function () {                                                                                    // 395
    var self = this;                                                                                                   // 396
    // Make a shallow copy of the set of universal handlers and start them. If                                         // 397
    // additional universal publishers start while we're running them (due to                                          // 398
    // yielding), they will run separately as part of Server.publish.                                                  // 399
    var handlers = _.clone(self.server.universal_publish_handlers);                                                    // 400
    _.each(handlers, function (handler) {                                                                              // 401
      self._startSubscription(handler);                                                                                // 402
    });                                                                                                                // 403
  },                                                                                                                   // 404
                                                                                                                       // 405
  // Destroy this session and unregister it at the server.                                                             // 406
  close: function () {                                                                                                 // 407
    var self = this;                                                                                                   // 408
                                                                                                                       // 409
    // Destroy this session, even if it's not registered at the                                                        // 410
    // server. Stop all processing and tear everything down. If a socket                                               // 411
    // was attached, close it.                                                                                         // 412
                                                                                                                       // 413
    // Already destroyed.                                                                                              // 414
    if (! self.inQueue)                                                                                                // 415
      return;                                                                                                          // 416
                                                                                                                       // 417
    if (self.heartbeat) {                                                                                              // 418
      self.heartbeat.stop();                                                                                           // 419
      self.heartbeat = null;                                                                                           // 420
    }                                                                                                                  // 421
                                                                                                                       // 422
    if (self.socket) {                                                                                                 // 423
      self.socket.close();                                                                                             // 424
      self.socket._meteorSession = null;                                                                               // 425
    }                                                                                                                  // 426
                                                                                                                       // 427
    // Drop the merge box data immediately.                                                                            // 428
    self.collectionViews = {};                                                                                         // 429
    self.inQueue = null;                                                                                               // 430
                                                                                                                       // 431
    Package.facts && Package.facts.Facts.incrementServerFact(                                                          // 432
      "livedata", "sessions", -1);                                                                                     // 433
                                                                                                                       // 434
    Meteor.defer(function () {                                                                                         // 435
      // stop callbacks can yield, so we defer this on close.                                                          // 436
      // sub._isDeactivated() detects that we set inQueue to null and                                                  // 437
      // treats it as semi-deactivated (it will ignore incoming callbacks, etc).                                       // 438
      self._deactivateAllSubscriptions();                                                                              // 439
                                                                                                                       // 440
      // Defer calling the close callbacks, so that the caller closing                                                 // 441
      // the session isn't waiting for all the callbacks to complete.                                                  // 442
      _.each(self._closeCallbacks, function (callback) {                                                               // 443
        callback();                                                                                                    // 444
      });                                                                                                              // 445
    });                                                                                                                // 446
                                                                                                                       // 447
    // Unregister the session.                                                                                         // 448
    self.server._removeSession(self);                                                                                  // 449
  },                                                                                                                   // 450
                                                                                                                       // 451
  // Send a message (doing nothing if no socket is connected right now.)                                               // 452
  // It should be a JSON object (it will be stringified.)                                                              // 453
  send: function (msg) {                                                                                               // 454
    var self = this;                                                                                                   // 455
    if (self.socket) {                                                                                                 // 456
      if (Meteor._printSentDDP)                                                                                        // 457
        Meteor._debug("Sent DDP", stringifyDDP(msg));                                                                  // 458
      self.socket.send(stringifyDDP(msg));                                                                             // 459
    }                                                                                                                  // 460
  },                                                                                                                   // 461
                                                                                                                       // 462
  // Send a connection error.                                                                                          // 463
  sendError: function (reason, offendingMessage) {                                                                     // 464
    var self = this;                                                                                                   // 465
    var msg = {msg: 'error', reason: reason};                                                                          // 466
    if (offendingMessage)                                                                                              // 467
      msg.offendingMessage = offendingMessage;                                                                         // 468
    self.send(msg);                                                                                                    // 469
  },                                                                                                                   // 470
                                                                                                                       // 471
  // Process 'msg' as an incoming message. (But as a guard against                                                     // 472
  // race conditions during reconnection, ignore the message if                                                        // 473
  // 'socket' is not the currently connected socket.)                                                                  // 474
  //                                                                                                                   // 475
  // We run the messages from the client one at a time, in the order                                                   // 476
  // given by the client. The message handler is passed an idempotent                                                  // 477
  // function 'unblock' which it may call to allow other messages to                                                   // 478
  // begin running in parallel in another fiber (for example, a method                                                 // 479
  // that wants to yield.) Otherwise, it is automatically unblocked                                                    // 480
  // when it returns.                                                                                                  // 481
  //                                                                                                                   // 482
  // Actually, we don't have to 'totally order' the messages in this                                                   // 483
  // way, but it's the easiest thing that's correct. (unsub needs to                                                   // 484
  // be ordered against sub, methods need to be ordered against each                                                   // 485
  // other.)                                                                                                           // 486
  processMessage: function (msg_in) {                                                                                  // 487
    var self = this;                                                                                                   // 488
    if (!self.inQueue) // we have been destroyed.                                                                      // 489
      return;                                                                                                          // 490
                                                                                                                       // 491
    // Respond to ping and pong messages immediately without queuing.                                                  // 492
    // If the negotiated DDP version is "pre1" which didn't support                                                    // 493
    // pings, preserve the "pre1" behavior of responding with a "bad                                                   // 494
    // request" for the unknown messages.                                                                              // 495
    //                                                                                                                 // 496
    // Fibers are needed because heartbeat uses Meteor.setTimeout, which                                               // 497
    // needs a Fiber. We could actually use regular setTimeout and avoid                                               // 498
    // these new fibers, but it is easier to just make everything use                                                  // 499
    // Meteor.setTimeout and not think too hard.                                                                       // 500
    if (self.version !== 'pre1' && msg_in.msg === 'ping') {                                                            // 501
      if (self._respondToPings)                                                                                        // 502
        self.send({msg: "pong", id: msg_in.id});                                                                       // 503
      if (self.heartbeat)                                                                                              // 504
        Fiber(function () {                                                                                            // 505
          self.heartbeat.pingReceived();                                                                               // 506
        }).run();                                                                                                      // 507
      return;                                                                                                          // 508
    }                                                                                                                  // 509
    if (self.version !== 'pre1' && msg_in.msg === 'pong') {                                                            // 510
      if (self.heartbeat)                                                                                              // 511
        Fiber(function () {                                                                                            // 512
          self.heartbeat.pongReceived();                                                                               // 513
        }).run();                                                                                                      // 514
      return;                                                                                                          // 515
    }                                                                                                                  // 516
                                                                                                                       // 517
    self.inQueue.push(msg_in);                                                                                         // 518
    if (self.workerRunning)                                                                                            // 519
      return;                                                                                                          // 520
    self.workerRunning = true;                                                                                         // 521
                                                                                                                       // 522
    var processNext = function () {                                                                                    // 523
      var msg = self.inQueue && self.inQueue.shift();                                                                  // 524
      if (!msg) {                                                                                                      // 525
        self.workerRunning = false;                                                                                    // 526
        return;                                                                                                        // 527
      }                                                                                                                // 528
                                                                                                                       // 529
      Fiber(function () {                                                                                              // 530
        var blocked = true;                                                                                            // 531
                                                                                                                       // 532
        var unblock = function () {                                                                                    // 533
          if (!blocked)                                                                                                // 534
            return; // idempotent                                                                                      // 535
          blocked = false;                                                                                             // 536
          processNext();                                                                                               // 537
        };                                                                                                             // 538
                                                                                                                       // 539
        if (_.has(self.protocol_handlers, msg.msg))                                                                    // 540
          self.protocol_handlers[msg.msg].call(self, msg, unblock);                                                    // 541
        else                                                                                                           // 542
          self.sendError('Bad request', msg);                                                                          // 543
        unblock(); // in case the handler didn't already do it                                                         // 544
      }).run();                                                                                                        // 545
    };                                                                                                                 // 546
                                                                                                                       // 547
    processNext();                                                                                                     // 548
  },                                                                                                                   // 549
                                                                                                                       // 550
  protocol_handlers: {                                                                                                 // 551
    sub: function (msg) {                                                                                              // 552
      var self = this;                                                                                                 // 553
                                                                                                                       // 554
      // reject malformed messages                                                                                     // 555
      if (typeof (msg.id) !== "string" ||                                                                              // 556
          typeof (msg.name) !== "string" ||                                                                            // 557
          (('params' in msg) && !(msg.params instanceof Array))) {                                                     // 558
        self.sendError("Malformed subscription", msg);                                                                 // 559
        return;                                                                                                        // 560
      }                                                                                                                // 561
                                                                                                                       // 562
      if (!self.server.publish_handlers[msg.name]) {                                                                   // 563
        self.send({                                                                                                    // 564
          msg: 'nosub', id: msg.id,                                                                                    // 565
          error: new Meteor.Error(404, "Subscription not found")});                                                    // 566
        return;                                                                                                        // 567
      }                                                                                                                // 568
                                                                                                                       // 569
      if (_.has(self._namedSubs, msg.id))                                                                              // 570
        // subs are idempotent, or rather, they are ignored if a sub                                                   // 571
        // with that id already exists. this is important during                                                       // 572
        // reconnect.                                                                                                  // 573
        return;                                                                                                        // 574
                                                                                                                       // 575
      var handler = self.server.publish_handlers[msg.name];                                                            // 576
      self._startSubscription(handler, msg.id, msg.params, msg.name);                                                  // 577
                                                                                                                       // 578
    },                                                                                                                 // 579
                                                                                                                       // 580
    unsub: function (msg) {                                                                                            // 581
      var self = this;                                                                                                 // 582
                                                                                                                       // 583
      self._stopSubscription(msg.id);                                                                                  // 584
    },                                                                                                                 // 585
                                                                                                                       // 586
    method: function (msg, unblock) {                                                                                  // 587
      var self = this;                                                                                                 // 588
                                                                                                                       // 589
      // reject malformed messages                                                                                     // 590
      // For now, we silently ignore unknown attributes,                                                               // 591
      // for forwards compatibility.                                                                                   // 592
      if (typeof (msg.id) !== "string" ||                                                                              // 593
          typeof (msg.method) !== "string" ||                                                                          // 594
          (('params' in msg) && !(msg.params instanceof Array)) ||                                                     // 595
          (('randomSeed' in msg) && (typeof msg.randomSeed !== "string"))) {                                           // 596
        self.sendError("Malformed method invocation", msg);                                                            // 597
        return;                                                                                                        // 598
      }                                                                                                                // 599
                                                                                                                       // 600
      var randomSeed = msg.randomSeed || null;                                                                         // 601
                                                                                                                       // 602
      // set up to mark the method as satisfied once all observers                                                     // 603
      // (and subscriptions) have reacted to any writes that were                                                      // 604
      // done.                                                                                                         // 605
      var fence = new DDPServer._WriteFence;                                                                           // 606
      fence.onAllCommitted(function () {                                                                               // 607
        // Retire the fence so that future writes are allowed.                                                         // 608
        // This means that callbacks like timers are free to use                                                       // 609
        // the fence, and if they fire before it's armed (for                                                          // 610
        // example, because the method waits for them) their                                                           // 611
        // writes will be included in the fence.                                                                       // 612
        fence.retire();                                                                                                // 613
        self.send({                                                                                                    // 614
          msg: 'updated', methods: [msg.id]});                                                                         // 615
      });                                                                                                              // 616
                                                                                                                       // 617
      // find the handler                                                                                              // 618
      var handler = self.server.method_handlers[msg.method];                                                           // 619
      if (!handler) {                                                                                                  // 620
        self.send({                                                                                                    // 621
          msg: 'result', id: msg.id,                                                                                   // 622
          error: new Meteor.Error(404, "Method not found")});                                                          // 623
        fence.arm();                                                                                                   // 624
        return;                                                                                                        // 625
      }                                                                                                                // 626
                                                                                                                       // 627
      var setUserId = function(userId) {                                                                               // 628
        self._setUserId(userId);                                                                                       // 629
      };                                                                                                               // 630
                                                                                                                       // 631
      var invocation = new MethodInvocation({                                                                          // 632
        isSimulation: false,                                                                                           // 633
        userId: self.userId,                                                                                           // 634
        setUserId: setUserId,                                                                                          // 635
        unblock: unblock,                                                                                              // 636
        connection: self.connectionHandle,                                                                             // 637
        randomSeed: randomSeed                                                                                         // 638
      });                                                                                                              // 639
      try {                                                                                                            // 640
        var result = DDPServer._CurrentWriteFence.withValue(fence, function () {                                       // 641
          return DDP._CurrentInvocation.withValue(invocation, function () {                                            // 642
            return maybeAuditArgumentChecks(                                                                           // 643
              handler, invocation, msg.params, "call to '" + msg.method + "'");                                        // 644
          });                                                                                                          // 645
        });                                                                                                            // 646
      } catch (e) {                                                                                                    // 647
        var exception = e;                                                                                             // 648
      }                                                                                                                // 649
                                                                                                                       // 650
      fence.arm(); // we're done adding writes to the fence                                                            // 651
      unblock(); // unblock, if the method hasn't done it already                                                      // 652
                                                                                                                       // 653
      exception = wrapInternalException(                                                                               // 654
        exception, "while invoking method '" + msg.method + "'");                                                      // 655
                                                                                                                       // 656
      // send response and add to cache                                                                                // 657
      var payload =                                                                                                    // 658
        exception ? {error: exception} : (result !== undefined ?                                                       // 659
                                          {result: result} : {});                                                      // 660
      self.send(_.extend({msg: 'result', id: msg.id}, payload));                                                       // 661
    }                                                                                                                  // 662
  },                                                                                                                   // 663
                                                                                                                       // 664
  _eachSub: function (f) {                                                                                             // 665
    var self = this;                                                                                                   // 666
    _.each(self._namedSubs, f);                                                                                        // 667
    _.each(self._universalSubs, f);                                                                                    // 668
  },                                                                                                                   // 669
                                                                                                                       // 670
  _diffCollectionViews: function (beforeCVs) {                                                                         // 671
    var self = this;                                                                                                   // 672
    LocalCollection._diffObjects(beforeCVs, self.collectionViews, {                                                    // 673
      both: function (collectionName, leftValue, rightValue) {                                                         // 674
        rightValue.diff(leftValue);                                                                                    // 675
      },                                                                                                               // 676
      rightOnly: function (collectionName, rightValue) {                                                               // 677
        _.each(rightValue.documents, function (docView, id) {                                                          // 678
          self.sendAdded(collectionName, id, docView.getFields());                                                     // 679
        });                                                                                                            // 680
      },                                                                                                               // 681
      leftOnly: function (collectionName, leftValue) {                                                                 // 682
        _.each(leftValue.documents, function (doc, id) {                                                               // 683
          self.sendRemoved(collectionName, id);                                                                        // 684
        });                                                                                                            // 685
      }                                                                                                                // 686
    });                                                                                                                // 687
  },                                                                                                                   // 688
                                                                                                                       // 689
  // Sets the current user id in all appropriate contexts and reruns                                                   // 690
  // all subscriptions                                                                                                 // 691
  _setUserId: function(userId) {                                                                                       // 692
    var self = this;                                                                                                   // 693
                                                                                                                       // 694
    if (userId !== null && typeof userId !== "string")                                                                 // 695
      throw new Error("setUserId must be called on string or null, not " +                                             // 696
                      typeof userId);                                                                                  // 697
                                                                                                                       // 698
    // Prevent newly-created universal subscriptions from being added to our                                           // 699
    // session; they will be found below when we call startUniversalSubs.                                              // 700
    //                                                                                                                 // 701
    // (We don't have to worry about named subscriptions, because we only add                                          // 702
    // them when we process a 'sub' message. We are currently processing a                                             // 703
    // 'method' message, and the method did not unblock, because it is illegal                                         // 704
    // to call setUserId after unblock. Thus we cannot be concurrently adding a                                        // 705
    // new named subscription.)                                                                                        // 706
    self._dontStartNewUniversalSubs = true;                                                                            // 707
                                                                                                                       // 708
    // Prevent current subs from updating our collectionViews and call their                                           // 709
    // stop callbacks. This may yield.                                                                                 // 710
    self._eachSub(function (sub) {                                                                                     // 711
      sub._deactivate();                                                                                               // 712
    });                                                                                                                // 713
                                                                                                                       // 714
    // All subs should now be deactivated. Stop sending messages to the client,                                        // 715
    // save the state of the published collections, reset to an empty view, and                                        // 716
    // update the userId.                                                                                              // 717
    self._isSending = false;                                                                                           // 718
    var beforeCVs = self.collectionViews;                                                                              // 719
    self.collectionViews = {};                                                                                         // 720
    self.userId = userId;                                                                                              // 721
                                                                                                                       // 722
    // Save the old named subs, and reset to having no subscriptions.                                                  // 723
    var oldNamedSubs = self._namedSubs;                                                                                // 724
    self._namedSubs = {};                                                                                              // 725
    self._universalSubs = [];                                                                                          // 726
                                                                                                                       // 727
    _.each(oldNamedSubs, function (sub, subscriptionId) {                                                              // 728
      self._namedSubs[subscriptionId] = sub._recreate();                                                               // 729
      // nb: if the handler throws or calls this.error(), it will in fact                                              // 730
      // immediately send its 'nosub'. This is OK, though.                                                             // 731
      self._namedSubs[subscriptionId]._runHandler();                                                                   // 732
    });                                                                                                                // 733
                                                                                                                       // 734
    // Allow newly-created universal subs to be started on our connection in                                           // 735
    // parallel with the ones we're spinning up here, and spin up universal                                            // 736
    // subs.                                                                                                           // 737
    self._dontStartNewUniversalSubs = false;                                                                           // 738
    self.startUniversalSubs();                                                                                         // 739
                                                                                                                       // 740
    // Start sending messages again, beginning with the diff from the previous                                         // 741
    // state of the world to the current state. No yields are allowed during                                           // 742
    // this diff, so that other changes cannot interleave.                                                             // 743
    Meteor._noYieldsAllowed(function () {                                                                              // 744
      self._isSending = true;                                                                                          // 745
      self._diffCollectionViews(beforeCVs);                                                                            // 746
      if (!_.isEmpty(self._pendingReady)) {                                                                            // 747
        self.sendReady(self._pendingReady);                                                                            // 748
        self._pendingReady = [];                                                                                       // 749
      }                                                                                                                // 750
    });                                                                                                                // 751
  },                                                                                                                   // 752
                                                                                                                       // 753
  _startSubscription: function (handler, subId, params, name) {                                                        // 754
    var self = this;                                                                                                   // 755
                                                                                                                       // 756
    var sub = new Subscription(                                                                                        // 757
      self, handler, subId, params, name);                                                                             // 758
    if (subId)                                                                                                         // 759
      self._namedSubs[subId] = sub;                                                                                    // 760
    else                                                                                                               // 761
      self._universalSubs.push(sub);                                                                                   // 762
                                                                                                                       // 763
    sub._runHandler();                                                                                                 // 764
  },                                                                                                                   // 765
                                                                                                                       // 766
  // tear down specified subscription                                                                                  // 767
  _stopSubscription: function (subId, error) {                                                                         // 768
    var self = this;                                                                                                   // 769
                                                                                                                       // 770
    if (subId && self._namedSubs[subId]) {                                                                             // 771
      self._namedSubs[subId]._removeAllDocuments();                                                                    // 772
      self._namedSubs[subId]._deactivate();                                                                            // 773
      delete self._namedSubs[subId];                                                                                   // 774
    }                                                                                                                  // 775
                                                                                                                       // 776
    var response = {msg: 'nosub', id: subId};                                                                          // 777
                                                                                                                       // 778
    if (error)                                                                                                         // 779
      response.error = wrapInternalException(error, "from sub " + subId);                                              // 780
                                                                                                                       // 781
    self.send(response);                                                                                               // 782
  },                                                                                                                   // 783
                                                                                                                       // 784
  // tear down all subscriptions. Note that this does NOT send removed or nosub                                        // 785
  // messages, since we assume the client is gone.                                                                     // 786
  _deactivateAllSubscriptions: function () {                                                                           // 787
    var self = this;                                                                                                   // 788
                                                                                                                       // 789
    _.each(self._namedSubs, function (sub, id) {                                                                       // 790
      sub._deactivate();                                                                                               // 791
    });                                                                                                                // 792
    self._namedSubs = {};                                                                                              // 793
                                                                                                                       // 794
    _.each(self._universalSubs, function (sub) {                                                                       // 795
      sub._deactivate();                                                                                               // 796
    });                                                                                                                // 797
    self._universalSubs = [];                                                                                          // 798
  },                                                                                                                   // 799
                                                                                                                       // 800
  // Determine the remote client's IP address, based on the                                                            // 801
  // HTTP_FORWARDED_COUNT environment variable representing how many                                                   // 802
  // proxies the server is behind.                                                                                     // 803
  _clientAddress: function () {                                                                                        // 804
    var self = this;                                                                                                   // 805
                                                                                                                       // 806
    // For the reported client address for a connection to be correct,                                                 // 807
    // the developer must set the HTTP_FORWARDED_COUNT environment                                                     // 808
    // variable to an integer representing the number of hops they                                                     // 809
    // expect in the `x-forwarded-for` header. E.g., set to "1" if the                                                 // 810
    // server is behind one proxy.                                                                                     // 811
    //                                                                                                                 // 812
    // This could be computed once at startup instead of every time.                                                   // 813
    var httpForwardedCount = parseInt(process.env['HTTP_FORWARDED_COUNT']) || 0;                                       // 814
                                                                                                                       // 815
    if (httpForwardedCount === 0)                                                                                      // 816
      return self.socket.remoteAddress;                                                                                // 817
                                                                                                                       // 818
    var forwardedFor = self.socket.headers["x-forwarded-for"];                                                         // 819
    if (! _.isString(forwardedFor))                                                                                    // 820
      return null;                                                                                                     // 821
    forwardedFor = forwardedFor.trim().split(/\s*,\s*/);                                                               // 822
                                                                                                                       // 823
    // Typically the first value in the `x-forwarded-for` header is                                                    // 824
    // the original IP address of the client connecting to the first                                                   // 825
    // proxy.  However, the end user can easily spoof the header, in                                                   // 826
    // which case the first value(s) will be the fake IP address from                                                  // 827
    // the user pretending to be a proxy reporting the original IP                                                     // 828
    // address value.  By counting HTTP_FORWARDED_COUNT back from the                                                  // 829
    // end of the list, we ensure that we get the IP address being                                                     // 830
    // reported by *our* first proxy.                                                                                  // 831
                                                                                                                       // 832
    if (httpForwardedCount < 0 || httpForwardedCount > forwardedFor.length)                                            // 833
      return null;                                                                                                     // 834
                                                                                                                       // 835
    return forwardedFor[forwardedFor.length - httpForwardedCount];                                                     // 836
  }                                                                                                                    // 837
});                                                                                                                    // 838
                                                                                                                       // 839
/******************************************************************************/                                       // 840
/* Subscription                                                               */                                       // 841
/******************************************************************************/                                       // 842
                                                                                                                       // 843
// ctor for a sub handle: the input to each publish function                                                           // 844
var Subscription = function (                                                                                          // 845
    session, handler, subscriptionId, params, name) {                                                                  // 846
  var self = this;                                                                                                     // 847
  self._session = session; // type is Session                                                                          // 848
  self.connection = session.connectionHandle; // public API object                                                     // 849
                                                                                                                       // 850
  self._handler = handler;                                                                                             // 851
                                                                                                                       // 852
  // my subscription ID (generated by client, undefined for universal subs).                                           // 853
  self._subscriptionId = subscriptionId;                                                                               // 854
  // undefined for universal subs                                                                                      // 855
  self._name = name;                                                                                                   // 856
                                                                                                                       // 857
  self._params = params || [];                                                                                         // 858
                                                                                                                       // 859
  // Only named subscriptions have IDs, but we need some sort of string                                                // 860
  // internally to keep track of all subscriptions inside                                                              // 861
  // SessionDocumentViews. We use this subscriptionHandle for that.                                                    // 862
  if (self._subscriptionId) {                                                                                          // 863
    self._subscriptionHandle = 'N' + self._subscriptionId;                                                             // 864
  } else {                                                                                                             // 865
    self._subscriptionHandle = 'U' + Random.id();                                                                      // 866
  }                                                                                                                    // 867
                                                                                                                       // 868
  // has _deactivate been called?                                                                                      // 869
  self._deactivated = false;                                                                                           // 870
                                                                                                                       // 871
  // stop callbacks to g/c this sub.  called w/ zero arguments.                                                        // 872
  self._stopCallbacks = [];                                                                                            // 873
                                                                                                                       // 874
  // the set of (collection, documentid) that this subscription has                                                    // 875
  // an opinion about                                                                                                  // 876
  self._documents = {};                                                                                                // 877
                                                                                                                       // 878
  // remember if we are ready.                                                                                         // 879
  self._ready = false;                                                                                                 // 880
                                                                                                                       // 881
  // Part of the public API: the user of this sub.                                                                     // 882
  self.userId = session.userId;                                                                                        // 883
                                                                                                                       // 884
  // For now, the id filter is going to default to                                                                     // 885
  // the to/from DDP methods on LocalCollection, to                                                                    // 886
  // specifically deal with mongo/minimongo ObjectIds.                                                                 // 887
                                                                                                                       // 888
  // Later, you will be able to make this be "raw"                                                                     // 889
  // if you want to publish a collection that you know                                                                 // 890
  // just has strings for keys and no funny business, to                                                               // 891
  // a ddp consumer that isn't minimongo                                                                               // 892
                                                                                                                       // 893
  self._idFilter = {                                                                                                   // 894
    idStringify: LocalCollection._idStringify,                                                                         // 895
    idParse: LocalCollection._idParse                                                                                  // 896
  };                                                                                                                   // 897
                                                                                                                       // 898
  Package.facts && Package.facts.Facts.incrementServerFact(                                                            // 899
    "livedata", "subscriptions", 1);                                                                                   // 900
};                                                                                                                     // 901
                                                                                                                       // 902
_.extend(Subscription.prototype, {                                                                                     // 903
  _runHandler: function () {                                                                                           // 904
    // XXX should we unblock() here? Either before running the publish                                                 // 905
    // function, or before running _publishCursor.                                                                     // 906
    //                                                                                                                 // 907
    // Right now, each publish function blocks all future publishes and                                                // 908
    // methods waiting on data from Mongo (or whatever else the function                                               // 909
    // blocks on). This probably slows page load in common cases.                                                      // 910
                                                                                                                       // 911
    var self = this;                                                                                                   // 912
    try {                                                                                                              // 913
      var res = maybeAuditArgumentChecks(                                                                              // 914
        self._handler, self, EJSON.clone(self._params),                                                                // 915
        // It's OK that this would look weird for universal subscriptions,                                             // 916
        // because they have no arguments so there can never be an                                                     // 917
        // audit-argument-checks failure.                                                                              // 918
        "publisher '" + self._name + "'");                                                                             // 919
    } catch (e) {                                                                                                      // 920
      self.error(e);                                                                                                   // 921
      return;                                                                                                          // 922
    }                                                                                                                  // 923
                                                                                                                       // 924
    // Did the handler call this.error or this.stop?                                                                   // 925
    if (self._isDeactivated())                                                                                         // 926
      return;                                                                                                          // 927
                                                                                                                       // 928
    // SPECIAL CASE: Instead of writing their own callbacks that invoke                                                // 929
    // this.added/changed/ready/etc, the user can just return a collection                                             // 930
    // cursor or array of cursors from the publish function; we call their                                             // 931
    // _publishCursor method which starts observing the cursor and publishes the                                       // 932
    // results. Note that _publishCursor does NOT call ready().                                                        // 933
    //                                                                                                                 // 934
    // XXX This uses an undocumented interface which only the Mongo cursor                                             // 935
    // interface publishes. Should we make this interface public and encourage                                         // 936
    // users to implement it themselves? Arguably, it's unnecessary; users can                                         // 937
    // already write their own functions like                                                                          // 938
    //   var publishMyReactiveThingy = function (name, handler) {                                                      // 939
    //     Meteor.publish(name, function () {                                                                          // 940
    //       var reactiveThingy = handler();                                                                           // 941
    //       reactiveThingy.publishMe();                                                                               // 942
    //     });                                                                                                         // 943
    //   };                                                                                                            // 944
    var isCursor = function (c) {                                                                                      // 945
      return c && c._publishCursor;                                                                                    // 946
    };                                                                                                                 // 947
    if (isCursor(res)) {                                                                                               // 948
      res._publishCursor(self);                                                                                        // 949
      // _publishCursor only returns after the initial added callbacks have run.                                       // 950
      // mark subscription as ready.                                                                                   // 951
      self.ready();                                                                                                    // 952
    } else if (_.isArray(res)) {                                                                                       // 953
      // check all the elements are cursors                                                                            // 954
      if (! _.all(res, isCursor)) {                                                                                    // 955
        self.error(new Error("Publish function returned an array of non-Cursors"));                                    // 956
        return;                                                                                                        // 957
      }                                                                                                                // 958
      // find duplicate collection names                                                                               // 959
      // XXX we should support overlapping cursors, but that would require the                                         // 960
      // merge box to allow overlap within a subscription                                                              // 961
      var collectionNames = {};                                                                                        // 962
      for (var i = 0; i < res.length; ++i) {                                                                           // 963
        var collectionName = res[i]._getCollectionName();                                                              // 964
        if (_.has(collectionNames, collectionName)) {                                                                  // 965
          self.error(new Error(                                                                                        // 966
            "Publish function returned multiple cursors for collection " +                                             // 967
              collectionName));                                                                                        // 968
          return;                                                                                                      // 969
        }                                                                                                              // 970
        collectionNames[collectionName] = true;                                                                        // 971
      };                                                                                                               // 972
                                                                                                                       // 973
      _.each(res, function (cur) {                                                                                     // 974
        cur._publishCursor(self);                                                                                      // 975
      });                                                                                                              // 976
      self.ready();                                                                                                    // 977
    } else if (res) {                                                                                                  // 978
      // truthy values other than cursors or arrays are probably a                                                     // 979
      // user mistake (possible returning a Mongo document via, say,                                                   // 980
      // `coll.findOne()`).                                                                                            // 981
      self.error(new Error("Publish function can only return a Cursor or "                                             // 982
                           + "an array of Cursors"));                                                                  // 983
    }                                                                                                                  // 984
  },                                                                                                                   // 985
                                                                                                                       // 986
  // This calls all stop callbacks and prevents the handler from updating any                                          // 987
  // SessionCollectionViews further. It's used when the user unsubscribes or                                           // 988
  // disconnects, as well as during setUserId re-runs. It does *NOT* send                                              // 989
  // removed messages for the published objects; if that is necessary, call                                            // 990
  // _removeAllDocuments first.                                                                                        // 991
  _deactivate: function() {                                                                                            // 992
    var self = this;                                                                                                   // 993
    if (self._deactivated)                                                                                             // 994
      return;                                                                                                          // 995
    self._deactivated = true;                                                                                          // 996
    self._callStopCallbacks();                                                                                         // 997
    Package.facts && Package.facts.Facts.incrementServerFact(                                                          // 998
      "livedata", "subscriptions", -1);                                                                                // 999
  },                                                                                                                   // 1000
                                                                                                                       // 1001
  _callStopCallbacks: function () {                                                                                    // 1002
    var self = this;                                                                                                   // 1003
    // tell listeners, so they can clean up                                                                            // 1004
    var callbacks = self._stopCallbacks;                                                                               // 1005
    self._stopCallbacks = [];                                                                                          // 1006
    _.each(callbacks, function (callback) {                                                                            // 1007
      callback();                                                                                                      // 1008
    });                                                                                                                // 1009
  },                                                                                                                   // 1010
                                                                                                                       // 1011
  // Send remove messages for every document.                                                                          // 1012
  _removeAllDocuments: function () {                                                                                   // 1013
    var self = this;                                                                                                   // 1014
    Meteor._noYieldsAllowed(function () {                                                                              // 1015
      _.each(self._documents, function(collectionDocs, collectionName) {                                               // 1016
        // Iterate over _.keys instead of the dictionary itself, since we'll be                                        // 1017
        // mutating it.                                                                                                // 1018
        _.each(_.keys(collectionDocs), function (strId) {                                                              // 1019
          self.removed(collectionName, self._idFilter.idParse(strId));                                                 // 1020
        });                                                                                                            // 1021
      });                                                                                                              // 1022
    });                                                                                                                // 1023
  },                                                                                                                   // 1024
                                                                                                                       // 1025
  // Returns a new Subscription for the same session with the same                                                     // 1026
  // initial creation parameters. This isn't a clone: it doesn't have                                                  // 1027
  // the same _documents cache, stopped state or callbacks; may have a                                                 // 1028
  // different _subscriptionHandle, and gets its userId from the                                                       // 1029
  // session, not from this object.                                                                                    // 1030
  _recreate: function () {                                                                                             // 1031
    var self = this;                                                                                                   // 1032
    return new Subscription(                                                                                           // 1033
      self._session, self._handler, self._subscriptionId, self._params,                                                // 1034
      self._name);                                                                                                     // 1035
  },                                                                                                                   // 1036
                                                                                                                       // 1037
  error: function (error) {                                                                                            // 1038
    var self = this;                                                                                                   // 1039
    if (self._isDeactivated())                                                                                         // 1040
      return;                                                                                                          // 1041
    self._session._stopSubscription(self._subscriptionId, error);                                                      // 1042
  },                                                                                                                   // 1043
                                                                                                                       // 1044
  // Note that while our DDP client will notice that you've called stop() on the                                       // 1045
  // server (and clean up its _subscriptions table) we don't actually provide a                                        // 1046
  // mechanism for an app to notice this (the subscribe onError callback only                                          // 1047
  // triggers if there is an error).                                                                                   // 1048
  stop: function () {                                                                                                  // 1049
    var self = this;                                                                                                   // 1050
    if (self._isDeactivated())                                                                                         // 1051
      return;                                                                                                          // 1052
    self._session._stopSubscription(self._subscriptionId);                                                             // 1053
  },                                                                                                                   // 1054
                                                                                                                       // 1055
  onStop: function (callback) {                                                                                        // 1056
    var self = this;                                                                                                   // 1057
    if (self._isDeactivated())                                                                                         // 1058
      callback();                                                                                                      // 1059
    else                                                                                                               // 1060
      self._stopCallbacks.push(callback);                                                                              // 1061
  },                                                                                                                   // 1062
                                                                                                                       // 1063
  // This returns true if the sub has been deactivated, *OR* if the session was                                        // 1064
  // destroyed but the deferred call to _deactivateAllSubscriptions hasn't                                             // 1065
  // happened yet.                                                                                                     // 1066
  _isDeactivated: function () {                                                                                        // 1067
    var self = this;                                                                                                   // 1068
    return self._deactivated || self._session.inQueue === null;                                                        // 1069
  },                                                                                                                   // 1070
                                                                                                                       // 1071
  added: function (collectionName, id, fields) {                                                                       // 1072
    var self = this;                                                                                                   // 1073
    if (self._isDeactivated())                                                                                         // 1074
      return;                                                                                                          // 1075
    id = self._idFilter.idStringify(id);                                                                               // 1076
    Meteor._ensure(self._documents, collectionName)[id] = true;                                                        // 1077
    self._session.added(self._subscriptionHandle, collectionName, id, fields);                                         // 1078
  },                                                                                                                   // 1079
                                                                                                                       // 1080
  changed: function (collectionName, id, fields) {                                                                     // 1081
    var self = this;                                                                                                   // 1082
    if (self._isDeactivated())                                                                                         // 1083
      return;                                                                                                          // 1084
    id = self._idFilter.idStringify(id);                                                                               // 1085
    self._session.changed(self._subscriptionHandle, collectionName, id, fields);                                       // 1086
  },                                                                                                                   // 1087
                                                                                                                       // 1088
  removed: function (collectionName, id) {                                                                             // 1089
    var self = this;                                                                                                   // 1090
    if (self._isDeactivated())                                                                                         // 1091
      return;                                                                                                          // 1092
    id = self._idFilter.idStringify(id);                                                                               // 1093
    // We don't bother to delete sets of things in a collection if the                                                 // 1094
    // collection is empty.  It could break _removeAllDocuments.                                                       // 1095
    delete self._documents[collectionName][id];                                                                        // 1096
    self._session.removed(self._subscriptionHandle, collectionName, id);                                               // 1097
  },                                                                                                                   // 1098
                                                                                                                       // 1099
  ready: function () {                                                                                                 // 1100
    var self = this;                                                                                                   // 1101
    if (self._isDeactivated())                                                                                         // 1102
      return;                                                                                                          // 1103
    if (!self._subscriptionId)                                                                                         // 1104
      return;  // unnecessary but ignored for universal sub                                                            // 1105
    if (!self._ready) {                                                                                                // 1106
      self._session.sendReady([self._subscriptionId]);                                                                 // 1107
      self._ready = true;                                                                                              // 1108
    }                                                                                                                  // 1109
  }                                                                                                                    // 1110
});                                                                                                                    // 1111
                                                                                                                       // 1112
/******************************************************************************/                                       // 1113
/* Server                                                                     */                                       // 1114
/******************************************************************************/                                       // 1115
                                                                                                                       // 1116
Server = function (options) {                                                                                          // 1117
  var self = this;                                                                                                     // 1118
                                                                                                                       // 1119
  // The default heartbeat interval is 30 seconds on the server and 35                                                 // 1120
  // seconds on the client.  Since the client doesn't need to send a                                                   // 1121
  // ping as long as it is receiving pings, this means that pings                                                      // 1122
  // normally go from the server to the client.                                                                        // 1123
  self.options = _.defaults(options || {}, {                                                                           // 1124
    heartbeatInterval: 30000,                                                                                          // 1125
    heartbeatTimeout: 15000,                                                                                           // 1126
    // For testing, allow responding to pings to be disabled.                                                          // 1127
    respondToPings: true                                                                                               // 1128
  });                                                                                                                  // 1129
                                                                                                                       // 1130
  // Map of callbacks to call when a new connection comes in to the                                                    // 1131
  // server and completes DDP version negotiation. Use an object instead                                               // 1132
  // of an array so we can safely remove one from the list while                                                       // 1133
  // iterating over it.                                                                                                // 1134
  self.onConnectionHook = new Hook({                                                                                   // 1135
    debugPrintExceptions: "onConnection callback"                                                                      // 1136
  });                                                                                                                  // 1137
                                                                                                                       // 1138
  self.publish_handlers = {};                                                                                          // 1139
  self.universal_publish_handlers = [];                                                                                // 1140
                                                                                                                       // 1141
  self.method_handlers = {};                                                                                           // 1142
                                                                                                                       // 1143
  self.sessions = {}; // map from id to session                                                                        // 1144
                                                                                                                       // 1145
  self.stream_server = new StreamServer;                                                                               // 1146
                                                                                                                       // 1147
  self.stream_server.register(function (socket) {                                                                      // 1148
    // socket implements the SockJSConnection interface                                                                // 1149
    socket._meteorSession = null;                                                                                      // 1150
                                                                                                                       // 1151
    var sendError = function (reason, offendingMessage) {                                                              // 1152
      var msg = {msg: 'error', reason: reason};                                                                        // 1153
      if (offendingMessage)                                                                                            // 1154
        msg.offendingMessage = offendingMessage;                                                                       // 1155
      socket.send(stringifyDDP(msg));                                                                                  // 1156
    };                                                                                                                 // 1157
                                                                                                                       // 1158
    socket.on('data', function (raw_msg) {                                                                             // 1159
      if (Meteor._printReceivedDDP) {                                                                                  // 1160
        Meteor._debug("Received DDP", raw_msg);                                                                        // 1161
      }                                                                                                                // 1162
      try {                                                                                                            // 1163
        try {                                                                                                          // 1164
          var msg = parseDDP(raw_msg);                                                                                 // 1165
        } catch (err) {                                                                                                // 1166
          sendError('Parse error');                                                                                    // 1167
          return;                                                                                                      // 1168
        }                                                                                                              // 1169
        if (msg === null || !msg.msg) {                                                                                // 1170
          sendError('Bad request', msg);                                                                               // 1171
          return;                                                                                                      // 1172
        }                                                                                                              // 1173
                                                                                                                       // 1174
        if (msg.msg === 'connect') {                                                                                   // 1175
          if (socket._meteorSession) {                                                                                 // 1176
            sendError("Already connected", msg);                                                                       // 1177
            return;                                                                                                    // 1178
          }                                                                                                            // 1179
          Fiber(function () {                                                                                          // 1180
            self._handleConnect(socket, msg);                                                                          // 1181
          }).run();                                                                                                    // 1182
          return;                                                                                                      // 1183
        }                                                                                                              // 1184
                                                                                                                       // 1185
        if (!socket._meteorSession) {                                                                                  // 1186
          sendError('Must connect first', msg);                                                                        // 1187
          return;                                                                                                      // 1188
        }                                                                                                              // 1189
        socket._meteorSession.processMessage(msg);                                                                     // 1190
      } catch (e) {                                                                                                    // 1191
        // XXX print stack nicely                                                                                      // 1192
        Meteor._debug("Internal exception while processing message", msg,                                              // 1193
                      e.message, e.stack);                                                                             // 1194
      }                                                                                                                // 1195
    });                                                                                                                // 1196
                                                                                                                       // 1197
    socket.on('close', function () {                                                                                   // 1198
      if (socket._meteorSession) {                                                                                     // 1199
        Fiber(function () {                                                                                            // 1200
          socket._meteorSession.close();                                                                               // 1201
        }).run();                                                                                                      // 1202
      }                                                                                                                // 1203
    });                                                                                                                // 1204
  });                                                                                                                  // 1205
};                                                                                                                     // 1206
                                                                                                                       // 1207
_.extend(Server.prototype, {                                                                                           // 1208
                                                                                                                       // 1209
  onConnection: function (fn) {                                                                                        // 1210
    var self = this;                                                                                                   // 1211
    return self.onConnectionHook.register(fn);                                                                         // 1212
  },                                                                                                                   // 1213
                                                                                                                       // 1214
  _handleConnect: function (socket, msg) {                                                                             // 1215
    var self = this;                                                                                                   // 1216
                                                                                                                       // 1217
    // The connect message must specify a version and an array of supported                                            // 1218
    // versions, and it must claim to support what it is proposing.                                                    // 1219
    if (!(typeof (msg.version) === 'string' &&                                                                         // 1220
          _.isArray(msg.support) &&                                                                                    // 1221
          _.all(msg.support, _.isString) &&                                                                            // 1222
          _.contains(msg.support, msg.version))) {                                                                     // 1223
      socket.send(stringifyDDP({msg: 'failed',                                                                         // 1224
                                version: SUPPORTED_DDP_VERSIONS[0]}));                                                 // 1225
      socket.close();                                                                                                  // 1226
      return;                                                                                                          // 1227
    }                                                                                                                  // 1228
                                                                                                                       // 1229
    // In the future, handle session resumption: something like:                                                       // 1230
    //  socket._meteorSession = self.sessions[msg.session]                                                             // 1231
    var version = calculateVersion(msg.support, SUPPORTED_DDP_VERSIONS);                                               // 1232
                                                                                                                       // 1233
    if (msg.version !== version) {                                                                                     // 1234
      // The best version to use (according to the client's stated preferences)                                        // 1235
      // is not the one the client is trying to use. Inform them about the best                                        // 1236
      // version to use.                                                                                               // 1237
      socket.send(stringifyDDP({msg: 'failed', version: version}));                                                    // 1238
      socket.close();                                                                                                  // 1239
      return;                                                                                                          // 1240
    }                                                                                                                  // 1241
                                                                                                                       // 1242
    // Yay, version matches! Create a new session.                                                                     // 1243
    socket._meteorSession = new Session(self, version, socket, self.options);                                          // 1244
    self.sessions[socket._meteorSession.id] = socket._meteorSession;                                                   // 1245
    self.onConnectionHook.each(function (callback) {                                                                   // 1246
      if (socket._meteorSession)                                                                                       // 1247
        callback(socket._meteorSession.connectionHandle);                                                              // 1248
      return true;                                                                                                     // 1249
    });                                                                                                                // 1250
  },                                                                                                                   // 1251
  /**                                                                                                                  // 1252
   * Register a publish handler function.                                                                              // 1253
   *                                                                                                                   // 1254
   * @param name {String} identifier for query                                                                         // 1255
   * @param handler {Function} publish handler                                                                         // 1256
   * @param options {Object}                                                                                           // 1257
   *                                                                                                                   // 1258
   * Server will call handler function on each new subscription,                                                       // 1259
   * either when receiving DDP sub message for a named subscription, or on                                             // 1260
   * DDP connect for a universal subscription.                                                                         // 1261
   *                                                                                                                   // 1262
   * If name is null, this will be a subscription that is                                                              // 1263
   * automatically established and permanently on for all connected                                                    // 1264
   * client, instead of a subscription that can be turned on and off                                                   // 1265
   * with subscribe().                                                                                                 // 1266
   *                                                                                                                   // 1267
   * options to contain:                                                                                               // 1268
   *  - (mostly internal) is_auto: true if generated automatically                                                     // 1269
   *    from an autopublish hook. this is for cosmetic purposes only                                                   // 1270
   *    (it lets us determine whether to print a warning suggesting                                                    // 1271
   *    that you turn off autopublish.)                                                                                // 1272
   */                                                                                                                  // 1273
  publish: function (name, handler, options) {                                                                         // 1274
    var self = this;                                                                                                   // 1275
                                                                                                                       // 1276
    options = options || {};                                                                                           // 1277
                                                                                                                       // 1278
    if (name && name in self.publish_handlers) {                                                                       // 1279
      Meteor._debug("Ignoring duplicate publish named '" + name + "'");                                                // 1280
      return;                                                                                                          // 1281
    }                                                                                                                  // 1282
                                                                                                                       // 1283
    if (Package.autopublish && !options.is_auto) {                                                                     // 1284
      // They have autopublish on, yet they're trying to manually                                                      // 1285
      // picking stuff to publish. They probably should turn off                                                       // 1286
      // autopublish. (This check isn't perfect -- if you create a                                                     // 1287
      // publish before you turn on autopublish, it won't catch                                                        // 1288
      // it. But this will definitely handle the simple case where                                                     // 1289
      // you've added the autopublish package to your app, and are                                                     // 1290
      // calling publish from your app code.)                                                                          // 1291
      if (!self.warned_about_autopublish) {                                                                            // 1292
        self.warned_about_autopublish = true;                                                                          // 1293
        Meteor._debug(                                                                                                 // 1294
"** You've set up some data subscriptions with Meteor.publish(), but\n" +                                              // 1295
"** you still have autopublish turned on. Because autopublish is still\n" +                                            // 1296
"** on, your Meteor.publish() calls won't have much effect. All data\n" +                                              // 1297
"** will still be sent to all clients.\n" +                                                                            // 1298
"**\n" +                                                                                                               // 1299
"** Turn off autopublish by removing the autopublish package:\n" +                                                     // 1300
"**\n" +                                                                                                               // 1301
"**   $ meteor remove autopublish\n" +                                                                                 // 1302
"**\n" +                                                                                                               // 1303
"** .. and make sure you have Meteor.publish() and Meteor.subscribe() calls\n" +                                       // 1304
"** for each collection that you want clients to see.\n");                                                             // 1305
      }                                                                                                                // 1306
    }                                                                                                                  // 1307
                                                                                                                       // 1308
    if (name)                                                                                                          // 1309
      self.publish_handlers[name] = handler;                                                                           // 1310
    else {                                                                                                             // 1311
      self.universal_publish_handlers.push(handler);                                                                   // 1312
      // Spin up the new publisher on any existing session too. Run each                                               // 1313
      // session's subscription in a new Fiber, so that there's no change for                                          // 1314
      // self.sessions to change while we're running this loop.                                                        // 1315
      _.each(self.sessions, function (session) {                                                                       // 1316
        if (!session._dontStartNewUniversalSubs) {                                                                     // 1317
          Fiber(function() {                                                                                           // 1318
            session._startSubscription(handler);                                                                       // 1319
          }).run();                                                                                                    // 1320
        }                                                                                                              // 1321
      });                                                                                                              // 1322
    }                                                                                                                  // 1323
  },                                                                                                                   // 1324
                                                                                                                       // 1325
  _removeSession: function (session) {                                                                                 // 1326
    var self = this;                                                                                                   // 1327
    if (self.sessions[session.id]) {                                                                                   // 1328
      delete self.sessions[session.id];                                                                                // 1329
    }                                                                                                                  // 1330
  },                                                                                                                   // 1331
                                                                                                                       // 1332
  methods: function (methods) {                                                                                        // 1333
    var self = this;                                                                                                   // 1334
    _.each(methods, function (func, name) {                                                                            // 1335
      if (self.method_handlers[name])                                                                                  // 1336
        throw new Error("A method named '" + name + "' is already defined");                                           // 1337
      self.method_handlers[name] = func;                                                                               // 1338
    });                                                                                                                // 1339
  },                                                                                                                   // 1340
                                                                                                                       // 1341
  call: function (name /*, arguments */) {                                                                             // 1342
    // if it's a function, the last argument is the result callback,                                                   // 1343
    // not a parameter to the remote method.                                                                           // 1344
    var args = Array.prototype.slice.call(arguments, 1);                                                               // 1345
    if (args.length && typeof args[args.length - 1] === "function")                                                    // 1346
      var callback = args.pop();                                                                                       // 1347
    return this.apply(name, args, callback);                                                                           // 1348
  },                                                                                                                   // 1349
                                                                                                                       // 1350
  // @param options {Optional Object}                                                                                  // 1351
  // @param callback {Optional Function}                                                                               // 1352
  apply: function (name, args, options, callback) {                                                                    // 1353
    var self = this;                                                                                                   // 1354
                                                                                                                       // 1355
    // We were passed 3 arguments. They may be either (name, args, options)                                            // 1356
    // or (name, args, callback)                                                                                       // 1357
    if (!callback && typeof options === 'function') {                                                                  // 1358
      callback = options;                                                                                              // 1359
      options = {};                                                                                                    // 1360
    }                                                                                                                  // 1361
    options = options || {};                                                                                           // 1362
                                                                                                                       // 1363
    if (callback)                                                                                                      // 1364
      // It's not really necessary to do this, since we immediately                                                    // 1365
      // run the callback in this fiber before returning, but we do it                                                 // 1366
      // anyway for regularity.                                                                                        // 1367
      // XXX improve error message (and how we report it)                                                              // 1368
      callback = Meteor.bindEnvironment(                                                                               // 1369
        callback,                                                                                                      // 1370
        "delivering result of invoking '" + name + "'"                                                                 // 1371
      );                                                                                                               // 1372
                                                                                                                       // 1373
    // Run the handler                                                                                                 // 1374
    var handler = self.method_handlers[name];                                                                          // 1375
    var exception;                                                                                                     // 1376
    if (!handler) {                                                                                                    // 1377
      exception = new Meteor.Error(404, "Method not found");                                                           // 1378
    } else {                                                                                                           // 1379
      // If this is a method call from within another method, get the                                                  // 1380
      // user state from the outer method, otherwise don't allow                                                       // 1381
      // setUserId to be called                                                                                        // 1382
      var userId = null;                                                                                               // 1383
      var setUserId = function() {                                                                                     // 1384
        throw new Error("Can't call setUserId on a server initiated method call");                                     // 1385
      };                                                                                                               // 1386
      var connection = null;                                                                                           // 1387
      var currentInvocation = DDP._CurrentInvocation.get();                                                            // 1388
      if (currentInvocation) {                                                                                         // 1389
        userId = currentInvocation.userId;                                                                             // 1390
        setUserId = function(userId) {                                                                                 // 1391
          currentInvocation.setUserId(userId);                                                                         // 1392
        };                                                                                                             // 1393
        connection = currentInvocation.connection;                                                                     // 1394
      }                                                                                                                // 1395
                                                                                                                       // 1396
      var invocation = new MethodInvocation({                                                                          // 1397
        isSimulation: false,                                                                                           // 1398
        userId: userId,                                                                                                // 1399
        setUserId: setUserId,                                                                                          // 1400
        connection: connection,                                                                                        // 1401
        randomSeed: makeRpcSeed(currentInvocation, name)                                                               // 1402
      });                                                                                                              // 1403
      try {                                                                                                            // 1404
        var result = DDP._CurrentInvocation.withValue(invocation, function () {                                        // 1405
          return maybeAuditArgumentChecks(                                                                             // 1406
            handler, invocation, EJSON.clone(args), "internal call to '" +                                             // 1407
              name + "'");                                                                                             // 1408
        });                                                                                                            // 1409
      } catch (e) {                                                                                                    // 1410
        exception = e;                                                                                                 // 1411
      }                                                                                                                // 1412
    }                                                                                                                  // 1413
                                                                                                                       // 1414
    // Return the result in whichever way the caller asked for it. Note that we                                        // 1415
    // do NOT block on the write fence in an analogous way to how the client                                           // 1416
    // blocks on the relevant data being visible, so you are NOT guaranteed that                                       // 1417
    // cursor observe callbacks have fired when your callback is invoked. (We                                          // 1418
    // can change this if there's a real use case.)                                                                    // 1419
    if (callback) {                                                                                                    // 1420
      callback(exception, result);                                                                                     // 1421
      return undefined;                                                                                                // 1422
    }                                                                                                                  // 1423
    if (exception)                                                                                                     // 1424
      throw exception;                                                                                                 // 1425
    return result;                                                                                                     // 1426
  },                                                                                                                   // 1427
                                                                                                                       // 1428
  _urlForSession: function (sessionId) {                                                                               // 1429
    var self = this;                                                                                                   // 1430
    var session = self.sessions[sessionId];                                                                            // 1431
    if (session)                                                                                                       // 1432
      return session._socketUrl;                                                                                       // 1433
    else                                                                                                               // 1434
      return null;                                                                                                     // 1435
  }                                                                                                                    // 1436
});                                                                                                                    // 1437
                                                                                                                       // 1438
var calculateVersion = function (clientSupportedVersions,                                                              // 1439
                                 serverSupportedVersions) {                                                            // 1440
  var correctVersion = _.find(clientSupportedVersions, function (version) {                                            // 1441
    return _.contains(serverSupportedVersions, version);                                                               // 1442
  });                                                                                                                  // 1443
  if (!correctVersion) {                                                                                               // 1444
    correctVersion = serverSupportedVersions[0];                                                                       // 1445
  }                                                                                                                    // 1446
  return correctVersion;                                                                                               // 1447
};                                                                                                                     // 1448
                                                                                                                       // 1449
LivedataTest.calculateVersion = calculateVersion;                                                                      // 1450
                                                                                                                       // 1451
                                                                                                                       // 1452
// "blind" exceptions other than those that were deliberately thrown to signal                                         // 1453
// errors to the client                                                                                                // 1454
var wrapInternalException = function (exception, context) {                                                            // 1455
  if (!exception || exception instanceof Meteor.Error)                                                                 // 1456
    return exception;                                                                                                  // 1457
                                                                                                                       // 1458
  // Did the error contain more details that could have been useful if caught in                                       // 1459
  // server code (or if thrown from non-client-originated code), but also                                              // 1460
  // provided a "sanitized" version with more context than 500 Internal server                                         // 1461
  // error? Use that.                                                                                                  // 1462
  if (exception.sanitizedError) {                                                                                      // 1463
    if (exception.sanitizedError instanceof Meteor.Error)                                                              // 1464
      return exception.sanitizedError;                                                                                 // 1465
    Meteor._debug("Exception " + context + " provides a sanitizedError that " +                                        // 1466
                  "is not a Meteor.Error; ignoring");                                                                  // 1467
  }                                                                                                                    // 1468
                                                                                                                       // 1469
  // tests can set the 'expected' flag on an exception so it won't go to the                                           // 1470
  // server log                                                                                                        // 1471
  if (!exception.expected)                                                                                             // 1472
    Meteor._debug("Exception " + context, exception.stack);                                                            // 1473
                                                                                                                       // 1474
  return new Meteor.Error(500, "Internal server error");                                                               // 1475
};                                                                                                                     // 1476
                                                                                                                       // 1477
                                                                                                                       // 1478
// Audit argument checks, if the audit-argument-checks package exists (it is a                                         // 1479
// weak dependency of this package).                                                                                   // 1480
var maybeAuditArgumentChecks = function (f, context, args, description) {                                              // 1481
  args = args || [];                                                                                                   // 1482
  if (Package['audit-argument-checks']) {                                                                              // 1483
    return Match._failIfArgumentsAreNotAllChecked(                                                                     // 1484
      f, context, args, description);                                                                                  // 1485
  }                                                                                                                    // 1486
  return f.apply(context, args);                                                                                       // 1487
};                                                                                                                     // 1488
                                                                                                                       // 1489
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/writefence.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var path = Npm.require('path');                                                                                        // 1
var Future = Npm.require(path.join('fibers', 'future'));                                                               // 2
                                                                                                                       // 3
// A write fence collects a group of writes, and provides a callback                                                   // 4
// when all of the writes are fully committed and propagated (all                                                      // 5
// observers have been notified of the write and acknowledged it.)                                                     // 6
//                                                                                                                     // 7
DDPServer._WriteFence = function () {                                                                                  // 8
  var self = this;                                                                                                     // 9
                                                                                                                       // 10
  self.armed = false;                                                                                                  // 11
  self.fired = false;                                                                                                  // 12
  self.retired = false;                                                                                                // 13
  self.outstanding_writes = 0;                                                                                         // 14
  self.completion_callbacks = [];                                                                                      // 15
};                                                                                                                     // 16
                                                                                                                       // 17
// The current write fence. When there is a current write fence, code                                                  // 18
// that writes to databases should register their writes with it using                                                 // 19
// beginWrite().                                                                                                       // 20
//                                                                                                                     // 21
DDPServer._CurrentWriteFence = new Meteor.EnvironmentVariable;                                                         // 22
                                                                                                                       // 23
_.extend(DDPServer._WriteFence.prototype, {                                                                            // 24
  // Start tracking a write, and return an object to represent it. The                                                 // 25
  // object has a single method, committed(). This method should be                                                    // 26
  // called when the write is fully committed and propagated. You can                                                  // 27
  // continue to add writes to the WriteFence up until it is triggered                                                 // 28
  // (calls its callbacks because all writes have committed.)                                                          // 29
  beginWrite: function () {                                                                                            // 30
    var self = this;                                                                                                   // 31
                                                                                                                       // 32
    if (self.retired)                                                                                                  // 33
      return { committed: function () {} };                                                                            // 34
                                                                                                                       // 35
    if (self.fired)                                                                                                    // 36
      throw new Error("fence has already activated -- too late to add writes");                                        // 37
                                                                                                                       // 38
    self.outstanding_writes++;                                                                                         // 39
    var committed = false;                                                                                             // 40
    return {                                                                                                           // 41
      committed: function () {                                                                                         // 42
        if (committed)                                                                                                 // 43
          throw new Error("committed called twice on the same write");                                                 // 44
        committed = true;                                                                                              // 45
        self.outstanding_writes--;                                                                                     // 46
        self._maybeFire();                                                                                             // 47
      }                                                                                                                // 48
    };                                                                                                                 // 49
  },                                                                                                                   // 50
                                                                                                                       // 51
  // Arm the fence. Once the fence is armed, and there are no more                                                     // 52
  // uncommitted writes, it will activate.                                                                             // 53
  arm: function () {                                                                                                   // 54
    var self = this;                                                                                                   // 55
    if (self === DDPServer._CurrentWriteFence.get())                                                                   // 56
      throw Error("Can't arm the current fence");                                                                      // 57
    self.armed = true;                                                                                                 // 58
    self._maybeFire();                                                                                                 // 59
  },                                                                                                                   // 60
                                                                                                                       // 61
  // Register a function to be called when the fence fires.                                                            // 62
  onAllCommitted: function (func) {                                                                                    // 63
    var self = this;                                                                                                   // 64
    if (self.fired)                                                                                                    // 65
      throw new Error("fence has already activated -- too late to " +                                                  // 66
                      "add a callback");                                                                               // 67
    self.completion_callbacks.push(func);                                                                              // 68
  },                                                                                                                   // 69
                                                                                                                       // 70
  // Convenience function. Arms the fence, then blocks until it fires.                                                 // 71
  armAndWait: function () {                                                                                            // 72
    var self = this;                                                                                                   // 73
    var future = new Future;                                                                                           // 74
    self.onAllCommitted(function () {                                                                                  // 75
      future['return']();                                                                                              // 76
    });                                                                                                                // 77
    self.arm();                                                                                                        // 78
    future.wait();                                                                                                     // 79
  },                                                                                                                   // 80
                                                                                                                       // 81
  _maybeFire: function () {                                                                                            // 82
    var self = this;                                                                                                   // 83
    if (self.fired)                                                                                                    // 84
      throw new Error("write fence already activated?");                                                               // 85
    if (self.armed && !self.outstanding_writes) {                                                                      // 86
      self.fired = true;                                                                                               // 87
      _.each(self.completion_callbacks, function (f) {f(self);});                                                      // 88
      self.completion_callbacks = [];                                                                                  // 89
    }                                                                                                                  // 90
  },                                                                                                                   // 91
                                                                                                                       // 92
  // Deactivate this fence so that adding more writes has no effect.                                                   // 93
  // The fence must have already fired.                                                                                // 94
  retire: function () {                                                                                                // 95
    var self = this;                                                                                                   // 96
    if (! self.fired)                                                                                                  // 97
      throw new Error("Can't retire a fence that hasn't fired.");                                                      // 98
    self.retired = true;                                                                                               // 99
  }                                                                                                                    // 100
});                                                                                                                    // 101
                                                                                                                       // 102
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/crossbar.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// A "crossbar" is a class that provides structured notification registration.                                         // 1
                                                                                                                       // 2
DDPServer._Crossbar = function (options) {                                                                             // 3
  var self = this;                                                                                                     // 4
  options = options || {};                                                                                             // 5
                                                                                                                       // 6
  self.nextId = 1;                                                                                                     // 7
  // map from listener id to object. each object has keys 'trigger',                                                   // 8
  // 'callback'.                                                                                                       // 9
  self.listeners = {};                                                                                                 // 10
  self.factPackage = options.factPackage || "livedata";                                                                // 11
  self.factName = options.factName || null;                                                                            // 12
};                                                                                                                     // 13
                                                                                                                       // 14
_.extend(DDPServer._Crossbar.prototype, {                                                                              // 15
  // Listen for notification that match 'trigger'. A notification                                                      // 16
  // matches if it has the key-value pairs in trigger as a                                                             // 17
  // subset. When a notification matches, call 'callback', passing                                                     // 18
  // the actual notification.                                                                                          // 19
  //                                                                                                                   // 20
  // Returns a listen handle, which is an object with a method                                                         // 21
  // stop(). Call stop() to stop listening.                                                                            // 22
  //                                                                                                                   // 23
  // XXX It should be legal to call fire() from inside a listen()                                                      // 24
  // callback?                                                                                                         // 25
  listen: function (trigger, callback) {                                                                               // 26
    var self = this;                                                                                                   // 27
    var id = self.nextId++;                                                                                            // 28
    self.listeners[id] = {trigger: EJSON.clone(trigger), callback: callback};                                          // 29
    if (self.factName && Package.facts) {                                                                              // 30
      Package.facts.Facts.incrementServerFact(                                                                         // 31
        self.factPackage, self.factName, 1);                                                                           // 32
    }                                                                                                                  // 33
    return {                                                                                                           // 34
      stop: function () {                                                                                              // 35
        if (self.factName && Package.facts) {                                                                          // 36
          Package.facts.Facts.incrementServerFact(                                                                     // 37
            self.factPackage, self.factName, -1);                                                                      // 38
        }                                                                                                              // 39
        delete self.listeners[id];                                                                                     // 40
      }                                                                                                                // 41
    };                                                                                                                 // 42
  },                                                                                                                   // 43
                                                                                                                       // 44
  // Fire the provided 'notification' (an object whose attribute                                                       // 45
  // values are all JSON-compatibile) -- inform all matching listeners                                                 // 46
  // (registered with listen()).                                                                                       // 47
  //                                                                                                                   // 48
  // If fire() is called inside a write fence, then each of the                                                        // 49
  // listener callbacks will be called inside the write fence as well.                                                 // 50
  //                                                                                                                   // 51
  // The listeners may be invoked in parallel, rather than serially.                                                   // 52
  fire: function (notification) {                                                                                      // 53
    var self = this;                                                                                                   // 54
    // Listener callbacks can yield, so we need to first find all the ones that                                        // 55
    // match in a single iteration over self.listeners (which can't be mutated                                         // 56
    // during this iteration), and then invoke the matching callbacks, checking                                        // 57
    // before each call to ensure they are still in self.listeners.                                                    // 58
    var matchingCallbacks = {};                                                                                        // 59
    // XXX consider refactoring to "index" on "collection"                                                             // 60
    _.each(self.listeners, function (l, id) {                                                                          // 61
      if (self._matches(notification, l.trigger))                                                                      // 62
        matchingCallbacks[id] = l.callback;                                                                            // 63
    });                                                                                                                // 64
                                                                                                                       // 65
    _.each(matchingCallbacks, function (c, id) {                                                                       // 66
      if (_.has(self.listeners, id))                                                                                   // 67
        c(notification);                                                                                               // 68
    });                                                                                                                // 69
  },                                                                                                                   // 70
                                                                                                                       // 71
  // A notification matches a trigger if all keys that exist in both are equal.                                        // 72
  //                                                                                                                   // 73
  // Examples:                                                                                                         // 74
  //  N:{collection: "C"} matches T:{collection: "C"}                                                                  // 75
  //    (a non-targeted write to a collection matches a                                                                // 76
  //     non-targeted query)                                                                                           // 77
  //  N:{collection: "C", id: "X"} matches T:{collection: "C"}                                                         // 78
  //    (a targeted write to a collection matches a non-targeted query)                                                // 79
  //  N:{collection: "C"} matches T:{collection: "C", id: "X"}                                                         // 80
  //    (a non-targeted write to a collection matches a                                                                // 81
  //     targeted query)                                                                                               // 82
  //  N:{collection: "C", id: "X"} matches T:{collection: "C", id: "X"}                                                // 83
  //    (a targeted write to a collection matches a targeted query targeted                                            // 84
  //     at the same document)                                                                                         // 85
  //  N:{collection: "C", id: "X"} does not match T:{collection: "C", id: "Y"}                                         // 86
  //    (a targeted write to a collection does not match a targeted query                                              // 87
  //     targeted at a different document)                                                                             // 88
  _matches: function (notification, trigger) {                                                                         // 89
    return _.all(trigger, function (triggerValue, key) {                                                               // 90
      return !_.has(notification, key) ||                                                                              // 91
        EJSON.equals(triggerValue, notification[key]);                                                                 // 92
    });                                                                                                                // 93
  }                                                                                                                    // 94
});                                                                                                                    // 95
                                                                                                                       // 96
// The "invalidation crossbar" is a specific instance used by the DDP server to                                        // 97
// implement write fence notifications. Listener callbacks on this crossbar                                            // 98
// should call beginWrite on the current write fence before they return, if they                                       // 99
// want to delay the write fence from firing (ie, the DDP method-data-updated                                          // 100
// message from being sent).                                                                                           // 101
DDPServer._InvalidationCrossbar = new DDPServer._Crossbar({                                                            // 102
  factName: "invalidation-crossbar-listeners"                                                                          // 103
});                                                                                                                    // 104
                                                                                                                       // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/livedata_common.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
DDP = {};                                                                                                              // 1
                                                                                                                       // 2
SUPPORTED_DDP_VERSIONS = [ 'pre2', 'pre1' ];                                                                           // 3
                                                                                                                       // 4
LivedataTest.SUPPORTED_DDP_VERSIONS = SUPPORTED_DDP_VERSIONS;                                                          // 5
                                                                                                                       // 6
MethodInvocation = function (options) {                                                                                // 7
  var self = this;                                                                                                     // 8
                                                                                                                       // 9
  // true if we're running not the actual method, but a stub (that is,                                                 // 10
  // if we're on a client (which may be a browser, or in the future a                                                  // 11
  // server connecting to another server) and presently running a                                                      // 12
  // simulation of a server-side method for latency compensation                                                       // 13
  // purposes). not currently true except in a client such as a browser,                                               // 14
  // since there's usually no point in running stubs unless you have a                                                 // 15
  // zero-latency connection to the user.                                                                              // 16
  this.isSimulation = options.isSimulation;                                                                            // 17
                                                                                                                       // 18
  // call this function to allow other method invocations (from the                                                    // 19
  // same client) to continue running without waiting for this one to                                                  // 20
  // complete.                                                                                                         // 21
  this._unblock = options.unblock || function () {};                                                                   // 22
  this._calledUnblock = false;                                                                                         // 23
                                                                                                                       // 24
  // current user id                                                                                                   // 25
  this.userId = options.userId;                                                                                        // 26
                                                                                                                       // 27
  // sets current user id in all appropriate server contexts and                                                       // 28
  // reruns subscriptions                                                                                              // 29
  this._setUserId = options.setUserId || function () {};                                                               // 30
                                                                                                                       // 31
  // On the server, the connection this method call came in on.                                                        // 32
  this.connection = options.connection;                                                                                // 33
                                                                                                                       // 34
  // The seed for randomStream value generation                                                                        // 35
  this.randomSeed = options.randomSeed;                                                                                // 36
                                                                                                                       // 37
  // This is set by RandomStream.get; and holds the random stream state                                                // 38
  this.randomStream = null;                                                                                            // 39
};                                                                                                                     // 40
                                                                                                                       // 41
_.extend(MethodInvocation.prototype, {                                                                                 // 42
  unblock: function () {                                                                                               // 43
    var self = this;                                                                                                   // 44
    self._calledUnblock = true;                                                                                        // 45
    self._unblock();                                                                                                   // 46
  },                                                                                                                   // 47
  setUserId: function(userId) {                                                                                        // 48
    var self = this;                                                                                                   // 49
    if (self._calledUnblock)                                                                                           // 50
      throw new Error("Can't call setUserId in a method after calling unblock");                                       // 51
    self.userId = userId;                                                                                              // 52
    self._setUserId(userId);                                                                                           // 53
  }                                                                                                                    // 54
});                                                                                                                    // 55
                                                                                                                       // 56
parseDDP = function (stringMessage) {                                                                                  // 57
  try {                                                                                                                // 58
    var msg = JSON.parse(stringMessage);                                                                               // 59
  } catch (e) {                                                                                                        // 60
    Meteor._debug("Discarding message with invalid JSON", stringMessage);                                              // 61
    return null;                                                                                                       // 62
  }                                                                                                                    // 63
  // DDP messages must be objects.                                                                                     // 64
  if (msg === null || typeof msg !== 'object') {                                                                       // 65
    Meteor._debug("Discarding non-object DDP message", stringMessage);                                                 // 66
    return null;                                                                                                       // 67
  }                                                                                                                    // 68
                                                                                                                       // 69
  // massage msg to get it into "abstract ddp" rather than "wire ddp" format.                                          // 70
                                                                                                                       // 71
  // switch between "cleared" rep of unsetting fields and "undefined"                                                  // 72
  // rep of same                                                                                                       // 73
  if (_.has(msg, 'cleared')) {                                                                                         // 74
    if (!_.has(msg, 'fields'))                                                                                         // 75
      msg.fields = {};                                                                                                 // 76
    _.each(msg.cleared, function (clearKey) {                                                                          // 77
      msg.fields[clearKey] = undefined;                                                                                // 78
    });                                                                                                                // 79
    delete msg.cleared;                                                                                                // 80
  }                                                                                                                    // 81
                                                                                                                       // 82
  _.each(['fields', 'params', 'result'], function (field) {                                                            // 83
    if (_.has(msg, field))                                                                                             // 84
      msg[field] = EJSON._adjustTypesFromJSONValue(msg[field]);                                                        // 85
  });                                                                                                                  // 86
                                                                                                                       // 87
  return msg;                                                                                                          // 88
};                                                                                                                     // 89
                                                                                                                       // 90
stringifyDDP = function (msg) {                                                                                        // 91
  var copy = EJSON.clone(msg);                                                                                         // 92
  // swizzle 'changed' messages from 'fields undefined' rep to 'fields                                                 // 93
  // and cleared' rep                                                                                                  // 94
  if (_.has(msg, 'fields')) {                                                                                          // 95
    var cleared = [];                                                                                                  // 96
    _.each(msg.fields, function (value, key) {                                                                         // 97
      if (value === undefined) {                                                                                       // 98
        cleared.push(key);                                                                                             // 99
        delete copy.fields[key];                                                                                       // 100
      }                                                                                                                // 101
    });                                                                                                                // 102
    if (!_.isEmpty(cleared))                                                                                           // 103
      copy.cleared = cleared;                                                                                          // 104
    if (_.isEmpty(copy.fields))                                                                                        // 105
      delete copy.fields;                                                                                              // 106
  }                                                                                                                    // 107
  // adjust types to basic                                                                                             // 108
  _.each(['fields', 'params', 'result'], function (field) {                                                            // 109
    if (_.has(copy, field))                                                                                            // 110
      copy[field] = EJSON._adjustTypesToJSONValue(copy[field]);                                                        // 111
  });                                                                                                                  // 112
  if (msg.id && typeof msg.id !== 'string') {                                                                          // 113
    throw new Error("Message id is not a string");                                                                     // 114
  }                                                                                                                    // 115
  return JSON.stringify(copy);                                                                                         // 116
};                                                                                                                     // 117
                                                                                                                       // 118
// This is private but it's used in a few places. accounts-base uses                                                   // 119
// it to get the current user. accounts-password uses it to stash SRP                                                  // 120
// state in the DDP session. Meteor.setTimeout and friends clear                                                       // 121
// it. We can probably find a better way to factor this.                                                               // 122
DDP._CurrentInvocation = new Meteor.EnvironmentVariable;                                                               // 123
                                                                                                                       // 124
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/random_stream.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// RandomStream allows for generation of pseudo-random values, from a seed.                                            // 1
//                                                                                                                     // 2
// We use this for consistent 'random' numbers across the client and server.                                           // 3
// We want to generate probably-unique IDs on the client, and we ideally want                                          // 4
// the server to generate the same IDs when it executes the method.                                                    // 5
//                                                                                                                     // 6
// For generated values to be the same, we must seed ourselves the same way,                                           // 7
// and we must keep track of the current state of our pseudo-random generators.                                        // 8
// We call this state the scope. By default, we use the current DDP method                                             // 9
// invocation as our scope.  DDP now allows the client to specify a randomSeed.                                        // 10
// If a randomSeed is provided it will be used to seed our random sequences.                                           // 11
// In this way, client and server method calls will generate the same values.                                          // 12
//                                                                                                                     // 13
// We expose multiple named streams; each stream is independent                                                        // 14
// and is seeded differently (but predictably from the name).                                                          // 15
// By using multiple streams, we support reordering of requests,                                                       // 16
// as long as they occur on different streams.                                                                         // 17
//                                                                                                                     // 18
// @param options {Optional Object}                                                                                    // 19
//   seed: Array or value - Seed value(s) for the generator.                                                           // 20
//                          If an array, will be used as-is                                                            // 21
//                          If a value, will be converted to a single-value array                                      // 22
//                          If omitted, a random array will be used as the seed.                                       // 23
RandomStream = function (options) {                                                                                    // 24
  var self = this;                                                                                                     // 25
                                                                                                                       // 26
  this.seed = [].concat(options.seed || randomToken());                                                                // 27
                                                                                                                       // 28
  this.sequences = {};                                                                                                 // 29
};                                                                                                                     // 30
                                                                                                                       // 31
// Returns a random string of sufficient length for a random seed.                                                     // 32
// This is a placeholder function; a similar function is planned                                                       // 33
// for Random itself; when that is added we should remove this function,                                               // 34
// and call Random's randomToken instead.                                                                              // 35
function randomToken() {                                                                                               // 36
  return Random.hexString(20);                                                                                         // 37
};                                                                                                                     // 38
                                                                                                                       // 39
// Returns the random stream with the specified name, in the specified scope.                                          // 40
// If scope is null (or otherwise falsey) then we will use Random, which will                                          // 41
// give us as random numbers as possible, but won't produce the same                                                   // 42
// values across client and server.                                                                                    // 43
// However, scope will normally be the current DDP method invocation, so                                               // 44
// we'll use the stream with the specified name, and we should get consistent                                          // 45
// values on the client and server sides of a method call.                                                             // 46
RandomStream.get = function (scope, name) {                                                                            // 47
  if (!name) {                                                                                                         // 48
    name = "default";                                                                                                  // 49
  }                                                                                                                    // 50
  if (!scope) {                                                                                                        // 51
    // There was no scope passed in;                                                                                   // 52
    // the sequence won't actually be reproducible.                                                                    // 53
    return Random;                                                                                                     // 54
  }                                                                                                                    // 55
  var randomStream = scope.randomStream;                                                                               // 56
  if (!randomStream) {                                                                                                 // 57
    scope.randomStream = randomStream = new RandomStream({                                                             // 58
      seed: scope.randomSeed                                                                                           // 59
    });                                                                                                                // 60
  }                                                                                                                    // 61
  return randomStream._sequence(name);                                                                                 // 62
};                                                                                                                     // 63
                                                                                                                       // 64
// Returns the named sequence of pseudo-random values.                                                                 // 65
// The scope will be DDP._CurrentInvocation.get(), so the stream will produce                                          // 66
// consistent values for method calls on the client and server.                                                        // 67
DDP.randomStream = function (name) {                                                                                   // 68
  var scope = DDP._CurrentInvocation.get();                                                                            // 69
  return RandomStream.get(scope, name);                                                                                // 70
};                                                                                                                     // 71
                                                                                                                       // 72
// Creates a randomSeed for passing to a method call.                                                                  // 73
// Note that we take enclosing as an argument,                                                                         // 74
// though we expect it to be DDP._CurrentInvocation.get()                                                              // 75
// However, we often evaluate makeRpcSeed lazily, and thus the relevant                                                // 76
// invocation may not be the one currently in scope.                                                                   // 77
// If enclosing is null, we'll use Random and values won't be repeatable.                                              // 78
makeRpcSeed = function (enclosing, methodName) {                                                                       // 79
  var stream = RandomStream.get(enclosing, '/rpc/' + methodName);                                                      // 80
  return stream.hexString(20);                                                                                         // 81
};                                                                                                                     // 82
                                                                                                                       // 83
_.extend(RandomStream.prototype, {                                                                                     // 84
  // Get a random sequence with the specified name, creating it if does not exist.                                     // 85
  // New sequences are seeded with the seed concatenated with the name.                                                // 86
  // By passing a seed into Random.create, we use the Alea generator.                                                  // 87
  _sequence: function (name) {                                                                                         // 88
    var self = this;                                                                                                   // 89
                                                                                                                       // 90
    var sequence = self.sequences[name] || null;                                                                       // 91
    if (sequence === null) {                                                                                           // 92
      var sequenceSeed = self.seed.concat(name);                                                                       // 93
      for (var i = 0; i < sequenceSeed.length; i++) {                                                                  // 94
        if (_.isFunction(sequenceSeed[i])) {                                                                           // 95
          sequenceSeed[i] = sequenceSeed[i]();                                                                         // 96
        }                                                                                                              // 97
      }                                                                                                                // 98
      self.sequences[name] = sequence = Random.createWithSeeds.apply(null, sequenceSeed);                              // 99
    }                                                                                                                  // 100
    return sequence;                                                                                                   // 101
  }                                                                                                                    // 102
});                                                                                                                    // 103
                                                                                                                       // 104
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/livedata_connection.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 1
  var path = Npm.require('path');                                                                                      // 2
  var Fiber = Npm.require('fibers');                                                                                   // 3
  var Future = Npm.require(path.join('fibers', 'future'));                                                             // 4
}                                                                                                                      // 5
                                                                                                                       // 6
// @param url {String|Object} URL to Meteor app,                                                                       // 7
//   or an object as a test hook (see code)                                                                            // 8
// Options:                                                                                                            // 9
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?                                       // 10
//   headers: extra headers to send on the websockets connection, for                                                  // 11
//     server-to-server DDP only                                                                                       // 12
//   _sockjsOptions: Specifies options to pass through to the sockjs client                                            // 13
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.                                          // 14
//                                                                                                                     // 15
// XXX There should be a way to destroy a DDP connection, causing all                                                  // 16
// outstanding method calls to fail.                                                                                   // 17
//                                                                                                                     // 18
// XXX Our current way of handling failure and reconnection is great                                                   // 19
// for an app (where we want to tolerate being disconnected as an                                                      // 20
// expect state, and keep trying forever to reconnect) but cumbersome                                                  // 21
// for something like a command line tool that wants to make a                                                         // 22
// connection, call a method, and print an error if connection                                                         // 23
// fails. We should have better usability in the latter case (while                                                    // 24
// still transparently reconnecting if it's just a transient failure                                                   // 25
// or the server migrating us).                                                                                        // 26
var Connection = function (url, options) {                                                                             // 27
  var self = this;                                                                                                     // 28
  options = _.extend({                                                                                                 // 29
    onConnected: function () {},                                                                                       // 30
    onDDPVersionNegotiationFailure: function (description) {                                                           // 31
      Meteor._debug(description);                                                                                      // 32
    },                                                                                                                 // 33
    heartbeatInterval: 35000,                                                                                          // 34
    heartbeatTimeout: 15000,                                                                                           // 35
    // These options are only for testing.                                                                             // 36
    reloadWithOutstanding: false,                                                                                      // 37
    supportedDDPVersions: SUPPORTED_DDP_VERSIONS,                                                                      // 38
    retry: true,                                                                                                       // 39
    respondToPings: true                                                                                               // 40
  }, options);                                                                                                         // 41
                                                                                                                       // 42
  // If set, called when we reconnect, queuing method calls _before_ the                                               // 43
  // existing outstanding ones. This is the only data member that is part of the                                       // 44
  // public API!                                                                                                       // 45
  self.onReconnect = null;                                                                                             // 46
                                                                                                                       // 47
  // as a test hook, allow passing a stream instead of a url.                                                          // 48
  if (typeof url === "object") {                                                                                       // 49
    self._stream = url;                                                                                                // 50
  } else {                                                                                                             // 51
    self._stream = new LivedataTest.ClientStream(url, {                                                                // 52
      retry: options.retry,                                                                                            // 53
      headers: options.headers,                                                                                        // 54
      _sockjsOptions: options._sockjsOptions,                                                                          // 55
      // To keep some tests quiet (because we don't have a real API for handling                                       // 56
      // client-stream-level errors).                                                                                  // 57
      _dontPrintErrors: options._dontPrintErrors                                                                       // 58
    });                                                                                                                // 59
  }                                                                                                                    // 60
                                                                                                                       // 61
  self._lastSessionId = null;                                                                                          // 62
  self._versionSuggestion = null;  // The last proposed DDP version.                                                   // 63
  self._version = null;   // The DDP version agreed on by client and server.                                           // 64
  self._stores = {}; // name -> object with methods                                                                    // 65
  self._methodHandlers = {}; // name -> func                                                                           // 66
  self._nextMethodId = 1;                                                                                              // 67
  self._supportedDDPVersions = options.supportedDDPVersions;                                                           // 68
                                                                                                                       // 69
  self._heartbeatInterval = options.heartbeatInterval;                                                                 // 70
  self._heartbeatTimeout = options.heartbeatTimeout;                                                                   // 71
                                                                                                                       // 72
  // Tracks methods which the user has tried to call but which have not yet                                            // 73
  // called their user callback (ie, they are waiting on their result or for all                                       // 74
  // of their writes to be written to the local cache). Map from method ID to                                          // 75
  // MethodInvoker object.                                                                                             // 76
  self._methodInvokers = {};                                                                                           // 77
                                                                                                                       // 78
  // Tracks methods which the user has called but whose result messages have not                                       // 79
  // arrived yet.                                                                                                      // 80
  //                                                                                                                   // 81
  // _outstandingMethodBlocks is an array of blocks of methods. Each block                                             // 82
  // represents a set of methods that can run at the same time. The first block                                        // 83
  // represents the methods which are currently in flight; subsequent blocks                                           // 84
  // must wait for previous blocks to be fully finished before they can be sent                                        // 85
  // to the server.                                                                                                    // 86
  //                                                                                                                   // 87
  // Each block is an object with the following fields:                                                                // 88
  // - methods: a list of MethodInvoker objects                                                                        // 89
  // - wait: a boolean; if true, this block had a single method invoked with                                           // 90
  //         the "wait" option                                                                                         // 91
  //                                                                                                                   // 92
  // There will never be adjacent blocks with wait=false, because the only thing                                       // 93
  // that makes methods need to be serialized is a wait method.                                                        // 94
  //                                                                                                                   // 95
  // Methods are removed from the first block when their "result" is                                                   // 96
  // received. The entire first block is only removed when all of the in-flight                                        // 97
  // methods have received their results (so the "methods" list is empty) *AND*                                        // 98
  // all of the data written by those methods are visible in the local cache. So                                       // 99
  // it is possible for the first block's methods list to be empty, if we are                                          // 100
  // still waiting for some objects to quiesce.                                                                        // 101
  //                                                                                                                   // 102
  // Example:                                                                                                          // 103
  //  _outstandingMethodBlocks = [                                                                                     // 104
  //    {wait: false, methods: []},                                                                                    // 105
  //    {wait: true, methods: [<MethodInvoker for 'login'>]},                                                          // 106
  //    {wait: false, methods: [<MethodInvoker for 'foo'>,                                                             // 107
  //                            <MethodInvoker for 'bar'>]}]                                                           // 108
  // This means that there were some methods which were sent to the server and                                         // 109
  // which have returned their results, but some of the data written by                                                // 110
  // the methods may not be visible in the local cache. Once all that data is                                          // 111
  // visible, we will send a 'login' method. Once the login method has returned                                        // 112
  // and all the data is visible (including re-running subs if userId changes),                                        // 113
  // we will send the 'foo' and 'bar' methods in parallel.                                                             // 114
  self._outstandingMethodBlocks = [];                                                                                  // 115
                                                                                                                       // 116
  // method ID -> array of objects with keys 'collection' and 'id', listing                                            // 117
  // documents written by a given method's stub. keys are associated with                                              // 118
  // methods whose stub wrote at least one document, and whose data-done message                                       // 119
  // has not yet been received.                                                                                        // 120
  self._documentsWrittenByStub = {};                                                                                   // 121
  // collection -> IdMap of "server document" object. A "server document" has:                                         // 122
  // - "document": the version of the document according the                                                           // 123
  //   server (ie, the snapshot before a stub wrote it, amended by any changes                                         // 124
  //   received from the server)                                                                                       // 125
  //   It is undefined if we think the document does not exist                                                         // 126
  // - "writtenByStubs": a set of method IDs whose stubs wrote to the document                                         // 127
  //   whose "data done" messages have not yet been processed                                                          // 128
  self._serverDocuments = {};                                                                                          // 129
                                                                                                                       // 130
  // Array of callbacks to be called after the next update of the local                                                // 131
  // cache. Used for:                                                                                                  // 132
  //  - Calling methodInvoker.dataVisible and sub ready callbacks after                                                // 133
  //    the relevant data is flushed.                                                                                  // 134
  //  - Invoking the callbacks of "half-finished" methods after reconnect                                              // 135
  //    quiescence. Specifically, methods whose result was received over the old                                       // 136
  //    connection (so we don't re-send it) but whose data had not been made                                           // 137
  //    visible.                                                                                                       // 138
  self._afterUpdateCallbacks = [];                                                                                     // 139
                                                                                                                       // 140
  // In two contexts, we buffer all incoming data messages and then process them                                       // 141
  // all at once in a single update:                                                                                   // 142
  //   - During reconnect, we buffer all data messages until all subs that had                                         // 143
  //     been ready before reconnect are ready again, and all methods that are                                         // 144
  //     active have returned their "data done message"; then                                                          // 145
  //   - During the execution of a "wait" method, we buffer all data messages                                          // 146
  //     until the wait method gets its "data done" message. (If the wait method                                       // 147
  //     occurs during reconnect, it doesn't get any special handling.)                                                // 148
  // all data messages are processed in one update.                                                                    // 149
  //                                                                                                                   // 150
  // The following fields are used for this "quiescence" process.                                                      // 151
                                                                                                                       // 152
  // This buffers the messages that aren't being processed yet.                                                        // 153
  self._messagesBufferedUntilQuiescence = [];                                                                          // 154
  // Map from method ID -> true. Methods are removed from this when their                                              // 155
  // "data done" message is received, and we will not quiesce until it is                                              // 156
  // empty.                                                                                                            // 157
  self._methodsBlockingQuiescence = {};                                                                                // 158
  // map from sub ID -> true for subs that were ready (ie, called the sub                                              // 159
  // ready callback) before reconnect but haven't become ready again yet                                               // 160
  self._subsBeingRevived = {}; // map from sub._id -> true                                                             // 161
  // if true, the next data update should reset all stores. (set during                                                // 162
  // reconnect.)                                                                                                       // 163
  self._resetStores = false;                                                                                           // 164
                                                                                                                       // 165
  // name -> array of updates for (yet to be created) collections                                                      // 166
  self._updatesForUnknownStores = {};                                                                                  // 167
  // if we're blocking a migration, the retry func                                                                     // 168
  self._retryMigrate = null;                                                                                           // 169
                                                                                                                       // 170
  // metadata for subscriptions.  Map from sub ID to object with keys:                                                 // 171
  //   - id                                                                                                            // 172
  //   - name                                                                                                          // 173
  //   - params                                                                                                        // 174
  //   - inactive (if true, will be cleaned up if not reused in re-run)                                                // 175
  //   - ready (has the 'ready' message been received?)                                                                // 176
  //   - readyCallback (an optional callback to call when ready)                                                       // 177
  //   - errorCallback (an optional callback to call if the sub terminates with                                        // 178
  //                    an error)                                                                                      // 179
  self._subscriptions = {};                                                                                            // 180
                                                                                                                       // 181
  // Reactive userId.                                                                                                  // 182
  self._userId = null;                                                                                                 // 183
  self._userIdDeps = new Deps.Dependency;                                                                              // 184
                                                                                                                       // 185
  // Block auto-reload while we're waiting for method responses.                                                       // 186
  if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {                                           // 187
    Package.reload.Reload._onMigrate(function (retry) {                                                                // 188
      if (!self._readyToMigrate()) {                                                                                   // 189
        if (self._retryMigrate)                                                                                        // 190
          throw new Error("Two migrations in progress?");                                                              // 191
        self._retryMigrate = retry;                                                                                    // 192
        return false;                                                                                                  // 193
      } else {                                                                                                         // 194
        return [true];                                                                                                 // 195
      }                                                                                                                // 196
    });                                                                                                                // 197
  }                                                                                                                    // 198
                                                                                                                       // 199
  var onMessage = function (raw_msg) {                                                                                 // 200
    try {                                                                                                              // 201
      var msg = parseDDP(raw_msg);                                                                                     // 202
    } catch (e) {                                                                                                      // 203
      Meteor._debug("Exception while parsing DDP", e);                                                                 // 204
      return;                                                                                                          // 205
    }                                                                                                                  // 206
                                                                                                                       // 207
    if (msg === null || !msg.msg) {                                                                                    // 208
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back                                                // 209
      // compat.  Remove this 'if' once the server stops sending welcome                                               // 210
      // messages (stream_server.js).                                                                                  // 211
      if (! (msg && msg.server_id))                                                                                    // 212
        Meteor._debug("discarding invalid livedata message", msg);                                                     // 213
      return;                                                                                                          // 214
    }                                                                                                                  // 215
                                                                                                                       // 216
    if (msg.msg === 'connected') {                                                                                     // 217
      self._version = self._versionSuggestion;                                                                         // 218
      options.onConnected();                                                                                           // 219
      self._livedata_connected(msg);                                                                                   // 220
    }                                                                                                                  // 221
    else if (msg.msg == 'failed') {                                                                                    // 222
      if (_.contains(self._supportedDDPVersions, msg.version)) {                                                       // 223
        self._versionSuggestion = msg.version;                                                                         // 224
        self._stream.reconnect({_force: true});                                                                        // 225
      } else {                                                                                                         // 226
        var description =                                                                                              // 227
              "DDP version negotiation failed; server requested version " + msg.version;                               // 228
        self._stream.disconnect({_permanent: true, _error: description});                                              // 229
        options.onDDPVersionNegotiationFailure(description);                                                           // 230
      }                                                                                                                // 231
    }                                                                                                                  // 232
    else if (msg.msg === 'ping') {                                                                                     // 233
      if (options.respondToPings)                                                                                      // 234
        self._send({msg: "pong", id: msg.id});                                                                         // 235
      if (self._heartbeat)                                                                                             // 236
        self._heartbeat.pingReceived();                                                                                // 237
    }                                                                                                                  // 238
    else if (msg.msg === 'pong') {                                                                                     // 239
      if (self._heartbeat) {                                                                                           // 240
        self._heartbeat.pongReceived();                                                                                // 241
      }                                                                                                                // 242
    }                                                                                                                  // 243
    else if (_.include(['added', 'changed', 'removed', 'ready', 'updated'], msg.msg))                                  // 244
      self._livedata_data(msg);                                                                                        // 245
    else if (msg.msg === 'nosub')                                                                                      // 246
      self._livedata_nosub(msg);                                                                                       // 247
    else if (msg.msg === 'result')                                                                                     // 248
      self._livedata_result(msg);                                                                                      // 249
    else if (msg.msg === 'error')                                                                                      // 250
      self._livedata_error(msg);                                                                                       // 251
    else                                                                                                               // 252
      Meteor._debug("discarding unknown livedata message type", msg);                                                  // 253
  };                                                                                                                   // 254
                                                                                                                       // 255
  var onReset = function () {                                                                                          // 256
    // Send a connect message at the beginning of the stream.                                                          // 257
    // NOTE: reset is called even on the first connection, so this is                                                  // 258
    // the only place we send this message.                                                                            // 259
    var msg = {msg: 'connect'};                                                                                        // 260
    if (self._lastSessionId)                                                                                           // 261
      msg.session = self._lastSessionId;                                                                               // 262
    msg.version = self._versionSuggestion || self._supportedDDPVersions[0];                                            // 263
    self._versionSuggestion = msg.version;                                                                             // 264
    msg.support = self._supportedDDPVersions;                                                                          // 265
    self._send(msg);                                                                                                   // 266
                                                                                                                       // 267
    // Now, to minimize setup latency, go ahead and blast out all of                                                   // 268
    // our pending methods ands subscriptions before we've even taken                                                  // 269
    // the necessary RTT to know if we successfully reconnected. (1)                                                   // 270
    // They're supposed to be idempotent; (2) even if we did                                                           // 271
    // reconnect, we're not sure what messages might have gotten lost                                                  // 272
    // (in either direction) since we were disconnected (TCP being                                                     // 273
    // sloppy about that.)                                                                                             // 274
                                                                                                                       // 275
    // If the current block of methods all got their results (but didn't all get                                       // 276
    // their data visible), discard the empty block now.                                                               // 277
    if (! _.isEmpty(self._outstandingMethodBlocks) &&                                                                  // 278
        _.isEmpty(self._outstandingMethodBlocks[0].methods)) {                                                         // 279
      self._outstandingMethodBlocks.shift();                                                                           // 280
    }                                                                                                                  // 281
                                                                                                                       // 282
    // Mark all messages as unsent, they have not yet been sent on this                                                // 283
    // connection.                                                                                                     // 284
    _.each(self._methodInvokers, function (m) {                                                                        // 285
      m.sentMessage = false;                                                                                           // 286
    });                                                                                                                // 287
                                                                                                                       // 288
    // If an `onReconnect` handler is set, call it first. Go through                                                   // 289
    // some hoops to ensure that methods that are called from within                                                   // 290
    // `onReconnect` get executed _before_ ones that were originally                                                   // 291
    // outstanding (since `onReconnect` is used to re-establish auth                                                   // 292
    // certificates)                                                                                                   // 293
    if (self.onReconnect)                                                                                              // 294
      self._callOnReconnectAndSendAppropriateOutstandingMethods();                                                     // 295
    else                                                                                                               // 296
      self._sendOutstandingMethods();                                                                                  // 297
                                                                                                                       // 298
    // add new subscriptions at the end. this way they take effect after                                               // 299
    // the handlers and we don't see flicker.                                                                          // 300
    _.each(self._subscriptions, function (sub, id) {                                                                   // 301
      self._send({                                                                                                     // 302
        msg: 'sub',                                                                                                    // 303
        id: id,                                                                                                        // 304
        name: sub.name,                                                                                                // 305
        params: sub.params                                                                                             // 306
      });                                                                                                              // 307
    });                                                                                                                // 308
  };                                                                                                                   // 309
                                                                                                                       // 310
  var onDisconnect = function () {                                                                                     // 311
    if (self._heartbeat) {                                                                                             // 312
      self._heartbeat.stop()                                                                                           // 313
      self._heartbeat = null;                                                                                          // 314
    }                                                                                                                  // 315
  };                                                                                                                   // 316
                                                                                                                       // 317
  if (Meteor.isServer) {                                                                                               // 318
    self._stream.on('message', Meteor.bindEnvironment(onMessage, Meteor._debug));                                      // 319
    self._stream.on('reset', Meteor.bindEnvironment(onReset, Meteor._debug));                                          // 320
    self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, Meteor._debug));                                // 321
  } else {                                                                                                             // 322
    self._stream.on('message', onMessage);                                                                             // 323
    self._stream.on('reset', onReset);                                                                                 // 324
    self._stream.on('disconnect', onDisconnect);                                                                       // 325
  }                                                                                                                    // 326
};                                                                                                                     // 327
                                                                                                                       // 328
// A MethodInvoker manages sending a method to the server and calling the user's                                       // 329
// callbacks. On construction, it registers itself in the connection's                                                 // 330
// _methodInvokers map; it removes itself once the method is fully finished and                                        // 331
// the callback is invoked. This occurs when it has both received a result,                                            // 332
// and the data written by it is fully visible.                                                                        // 333
var MethodInvoker = function (options) {                                                                               // 334
  var self = this;                                                                                                     // 335
                                                                                                                       // 336
  // Public (within this file) fields.                                                                                 // 337
  self.methodId = options.methodId;                                                                                    // 338
  self.sentMessage = false;                                                                                            // 339
                                                                                                                       // 340
  self._callback = options.callback;                                                                                   // 341
  self._connection = options.connection;                                                                               // 342
  self._message = options.message;                                                                                     // 343
  self._onResultReceived = options.onResultReceived || function () {};                                                 // 344
  self._wait = options.wait;                                                                                           // 345
  self._methodResult = null;                                                                                           // 346
  self._dataVisible = false;                                                                                           // 347
                                                                                                                       // 348
  // Register with the connection.                                                                                     // 349
  self._connection._methodInvokers[self.methodId] = self;                                                              // 350
};                                                                                                                     // 351
_.extend(MethodInvoker.prototype, {                                                                                    // 352
  // Sends the method message to the server. May be called additional times if                                         // 353
  // we lose the connection and reconnect before receiving a result.                                                   // 354
  sendMessage: function () {                                                                                           // 355
    var self = this;                                                                                                   // 356
    // This function is called before sending a method (including resending on                                         // 357
    // reconnect). We should only (re)send methods where we don't already have a                                       // 358
    // result!                                                                                                         // 359
    if (self.gotResult())                                                                                              // 360
      throw new Error("sendingMethod is called on method with result");                                                // 361
                                                                                                                       // 362
    // If we're re-sending it, it doesn't matter if data was written the first                                         // 363
    // time.                                                                                                           // 364
    self._dataVisible = false;                                                                                         // 365
                                                                                                                       // 366
    self.sentMessage = true;                                                                                           // 367
                                                                                                                       // 368
    // If this is a wait method, make all data messages be buffered until it is                                        // 369
    // done.                                                                                                           // 370
    if (self._wait)                                                                                                    // 371
      self._connection._methodsBlockingQuiescence[self.methodId] = true;                                               // 372
                                                                                                                       // 373
    // Actually send the message.                                                                                      // 374
    self._connection._send(self._message);                                                                             // 375
  },                                                                                                                   // 376
  // Invoke the callback, if we have both a result and know that all data has                                          // 377
  // been written to the local cache.                                                                                  // 378
  _maybeInvokeCallback: function () {                                                                                  // 379
    var self = this;                                                                                                   // 380
    if (self._methodResult && self._dataVisible) {                                                                     // 381
      // Call the callback. (This won't throw: the callback was wrapped with                                           // 382
      // bindEnvironment.)                                                                                             // 383
      self._callback(self._methodResult[0], self._methodResult[1]);                                                    // 384
                                                                                                                       // 385
      // Forget about this method.                                                                                     // 386
      delete self._connection._methodInvokers[self.methodId];                                                          // 387
                                                                                                                       // 388
      // Let the connection know that this method is finished, so it can try to                                        // 389
      // move on to the next block of methods.                                                                         // 390
      self._connection._outstandingMethodFinished();                                                                   // 391
    }                                                                                                                  // 392
  },                                                                                                                   // 393
  // Call with the result of the method from the server. Only may be called                                            // 394
  // once; once it is called, you should not call sendMessage again.                                                   // 395
  // If the user provided an onResultReceived callback, call it immediately.                                           // 396
  // Then invoke the main callback if data is also visible.                                                            // 397
  receiveResult: function (err, result) {                                                                              // 398
    var self = this;                                                                                                   // 399
    if (self.gotResult())                                                                                              // 400
      throw new Error("Methods should only receive results once");                                                     // 401
    self._methodResult = [err, result];                                                                                // 402
    self._onResultReceived(err, result);                                                                               // 403
    self._maybeInvokeCallback();                                                                                       // 404
  },                                                                                                                   // 405
  // Call this when all data written by the method is visible. This means that                                         // 406
  // the method has returns its "data is done" message *AND* all server                                                // 407
  // documents that are buffered at that time have been written to the local                                           // 408
  // cache. Invokes the main callback if the result has been received.                                                 // 409
  dataVisible: function () {                                                                                           // 410
    var self = this;                                                                                                   // 411
    self._dataVisible = true;                                                                                          // 412
    self._maybeInvokeCallback();                                                                                       // 413
  },                                                                                                                   // 414
  // True if receiveResult has been called.                                                                            // 415
  gotResult: function () {                                                                                             // 416
    var self = this;                                                                                                   // 417
    return !!self._methodResult;                                                                                       // 418
  }                                                                                                                    // 419
});                                                                                                                    // 420
                                                                                                                       // 421
_.extend(Connection.prototype, {                                                                                       // 422
  // 'name' is the name of the data on the wire that should go in the                                                  // 423
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,                                       // 424
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.                                       // 425
  registerStore: function (name, wrappedStore) {                                                                       // 426
    var self = this;                                                                                                   // 427
                                                                                                                       // 428
    if (name in self._stores)                                                                                          // 429
      return false;                                                                                                    // 430
                                                                                                                       // 431
    // Wrap the input object in an object which makes any store method not                                             // 432
    // implemented by 'store' into a no-op.                                                                            // 433
    var store = {};                                                                                                    // 434
    _.each(['update', 'beginUpdate', 'endUpdate', 'saveOriginals',                                                     // 435
            'retrieveOriginals'], function (method) {                                                                  // 436
              store[method] = function () {                                                                            // 437
                return (wrappedStore[method]                                                                           // 438
                        ? wrappedStore[method].apply(wrappedStore, arguments)                                          // 439
                        : undefined);                                                                                  // 440
              };                                                                                                       // 441
            });                                                                                                        // 442
                                                                                                                       // 443
    self._stores[name] = store;                                                                                        // 444
                                                                                                                       // 445
    var queued = self._updatesForUnknownStores[name];                                                                  // 446
    if (queued) {                                                                                                      // 447
      store.beginUpdate(queued.length, false);                                                                         // 448
      _.each(queued, function (msg) {                                                                                  // 449
        store.update(msg);                                                                                             // 450
      });                                                                                                              // 451
      store.endUpdate();                                                                                               // 452
      delete self._updatesForUnknownStores[name];                                                                      // 453
    }                                                                                                                  // 454
                                                                                                                       // 455
    return true;                                                                                                       // 456
  },                                                                                                                   // 457
                                                                                                                       // 458
  subscribe: function (name /* .. [arguments] .. (callback|callbacks) */) {                                            // 459
    var self = this;                                                                                                   // 460
                                                                                                                       // 461
    var params = Array.prototype.slice.call(arguments, 1);                                                             // 462
    var callbacks = {};                                                                                                // 463
    if (params.length) {                                                                                               // 464
      var lastParam = params[params.length - 1];                                                                       // 465
      if (typeof lastParam === "function") {                                                                           // 466
        callbacks.onReady = params.pop();                                                                              // 467
      } else if (lastParam && (typeof lastParam.onReady === "function" ||                                              // 468
                               typeof lastParam.onError === "function")) {                                             // 469
        callbacks = params.pop();                                                                                      // 470
      }                                                                                                                // 471
    }                                                                                                                  // 472
                                                                                                                       // 473
    // Is there an existing sub with the same name and param, run in an                                                // 474
    // invalidated Computation? This will happen if we are rerunning an                                                // 475
    // existing computation.                                                                                           // 476
    //                                                                                                                 // 477
    // For example, consider a rerun of:                                                                               // 478
    //                                                                                                                 // 479
    //     Deps.autorun(function () {                                                                                  // 480
    //       Meteor.subscribe("foo", Session.get("foo"));                                                              // 481
    //       Meteor.subscribe("bar", Session.get("bar"));                                                              // 482
    //     });                                                                                                         // 483
    //                                                                                                                 // 484
    // If "foo" has changed but "bar" has not, we will match the "bar"                                                 // 485
    // subcribe to an existing inactive subscription in order to not                                                   // 486
    // unsub and resub the subscription unnecessarily.                                                                 // 487
    //                                                                                                                 // 488
    // We only look for one such sub; if there are N apparently-identical subs                                         // 489
    // being invalidated, we will require N matching subscribe calls to keep                                           // 490
    // them all active.                                                                                                // 491
    var existing = _.find(self._subscriptions, function (sub) {                                                        // 492
      return sub.inactive && sub.name === name &&                                                                      // 493
        EJSON.equals(sub.params, params);                                                                              // 494
    });                                                                                                                // 495
                                                                                                                       // 496
    var id;                                                                                                            // 497
    if (existing) {                                                                                                    // 498
      id = existing.id;                                                                                                // 499
      existing.inactive = false; // reactivate                                                                         // 500
                                                                                                                       // 501
      if (callbacks.onReady) {                                                                                         // 502
        // If the sub is not already ready, replace any ready callback with the                                        // 503
        // one provided now. (It's not really clear what users would expect for                                        // 504
        // an onReady callback inside an autorun; the semantics we provide is                                          // 505
        // that at the time the sub first becomes ready, we call the last                                              // 506
        // onReady callback provided, if any.)                                                                         // 507
        if (!existing.ready)                                                                                           // 508
          existing.readyCallback = callbacks.onReady;                                                                  // 509
      }                                                                                                                // 510
      if (callbacks.onError) {                                                                                         // 511
        // Replace existing callback if any, so that errors aren't                                                     // 512
        // double-reported.                                                                                            // 513
        existing.errorCallback = callbacks.onError;                                                                    // 514
      }                                                                                                                // 515
    } else {                                                                                                           // 516
      // New sub! Generate an id, save it locally, and send message.                                                   // 517
      id = Random.id();                                                                                                // 518
      self._subscriptions[id] = {                                                                                      // 519
        id: id,                                                                                                        // 520
        name: name,                                                                                                    // 521
        params: EJSON.clone(params),                                                                                   // 522
        inactive: false,                                                                                               // 523
        ready: false,                                                                                                  // 524
        readyDeps: new Deps.Dependency,                                                                                // 525
        readyCallback: callbacks.onReady,                                                                              // 526
        errorCallback: callbacks.onError,                                                                              // 527
        connection: self,                                                                                              // 528
        remove: function() {                                                                                           // 529
          delete this.connection._subscriptions[this.id];                                                              // 530
          this.ready && this.readyDeps.changed();                                                                      // 531
        },                                                                                                             // 532
        stop: function() {                                                                                             // 533
          this.connection._send({msg: 'unsub', id: id});                                                               // 534
          this.remove();                                                                                               // 535
        }                                                                                                              // 536
      };                                                                                                               // 537
      self._send({msg: 'sub', id: id, name: name, params: params});                                                    // 538
    }                                                                                                                  // 539
                                                                                                                       // 540
    // return a handle to the application.                                                                             // 541
    var handle = {                                                                                                     // 542
      stop: function () {                                                                                              // 543
        if (!_.has(self._subscriptions, id))                                                                           // 544
          return;                                                                                                      // 545
                                                                                                                       // 546
        self._subscriptions[id].stop();                                                                                // 547
      },                                                                                                               // 548
      ready: function () {                                                                                             // 549
        // return false if we've unsubscribed.                                                                         // 550
        if (!_.has(self._subscriptions, id))                                                                           // 551
          return false;                                                                                                // 552
        var record = self._subscriptions[id];                                                                          // 553
        record.readyDeps.depend();                                                                                     // 554
        return record.ready;                                                                                           // 555
      }                                                                                                                // 556
    };                                                                                                                 // 557
                                                                                                                       // 558
    if (Deps.active) {                                                                                                 // 559
      // We're in a reactive computation, so we'd like to unsubscribe when the                                         // 560
      // computation is invalidated... but not if the rerun just re-subscribes                                         // 561
      // to the same subscription!  When a rerun happens, we use onInvalidate                                          // 562
      // as a change to mark the subscription "inactive" so that it can                                                // 563
      // be reused from the rerun.  If it isn't reused, it's killed from                                               // 564
      // an afterFlush.                                                                                                // 565
      Deps.onInvalidate(function (c) {                                                                                 // 566
        if (_.has(self._subscriptions, id))                                                                            // 567
          self._subscriptions[id].inactive = true;                                                                     // 568
                                                                                                                       // 569
        Deps.afterFlush(function () {                                                                                  // 570
          if (_.has(self._subscriptions, id) &&                                                                        // 571
              self._subscriptions[id].inactive)                                                                        // 572
            handle.stop();                                                                                             // 573
        });                                                                                                            // 574
      });                                                                                                              // 575
    }                                                                                                                  // 576
                                                                                                                       // 577
    return handle;                                                                                                     // 578
  },                                                                                                                   // 579
                                                                                                                       // 580
  // options:                                                                                                          // 581
  // - onLateError {Function(error)} called if an error was received after the ready event.                            // 582
  //     (errors received before ready cause an error to be thrown)                                                    // 583
  _subscribeAndWait: function (name, args, options) {                                                                  // 584
    var self = this;                                                                                                   // 585
    var f = new Future();                                                                                              // 586
    var ready = false;                                                                                                 // 587
    var handle;                                                                                                        // 588
    args = args || [];                                                                                                 // 589
    args.push({                                                                                                        // 590
      onReady: function () {                                                                                           // 591
        ready = true;                                                                                                  // 592
        f['return']();                                                                                                 // 593
      },                                                                                                               // 594
      onError: function (e) {                                                                                          // 595
        if (!ready)                                                                                                    // 596
          f['throw'](e);                                                                                               // 597
        else                                                                                                           // 598
          options && options.onLateError && options.onLateError(e);                                                    // 599
      }                                                                                                                // 600
    });                                                                                                                // 601
                                                                                                                       // 602
    handle = self.subscribe.apply(self, [name].concat(args));                                                          // 603
    f.wait();                                                                                                          // 604
    return handle;                                                                                                     // 605
  },                                                                                                                   // 606
                                                                                                                       // 607
  methods: function (methods) {                                                                                        // 608
    var self = this;                                                                                                   // 609
    _.each(methods, function (func, name) {                                                                            // 610
      if (self._methodHandlers[name])                                                                                  // 611
        throw new Error("A method named '" + name + "' is already defined");                                           // 612
      self._methodHandlers[name] = func;                                                                               // 613
    });                                                                                                                // 614
  },                                                                                                                   // 615
                                                                                                                       // 616
  call: function (name /* .. [arguments] .. callback */) {                                                             // 617
    // if it's a function, the last argument is the result callback,                                                   // 618
    // not a parameter to the remote method.                                                                           // 619
    var args = Array.prototype.slice.call(arguments, 1);                                                               // 620
    if (args.length && typeof args[args.length - 1] === "function")                                                    // 621
      var callback = args.pop();                                                                                       // 622
    return this.apply(name, args, callback);                                                                           // 623
  },                                                                                                                   // 624
                                                                                                                       // 625
  // @param options {Optional Object}                                                                                  // 626
  //   wait: Boolean - Should we wait to call this until all current methods                                           // 627
  //                   are fully finished, and block subsequent method calls                                           // 628
  //                   until this method is fully finished?                                                            // 629
  //                   (does not affect methods called from within this method)                                        // 630
  //   onResultReceived: Function - a callback to call as soon as the method                                           // 631
  //                                result is received. the data written by                                            // 632
  //                                the method may not yet be in the cache!                                            // 633
  //   returnStubValue: Boolean - If true then in cases where we would have                                            // 634
  //                              otherwise discarded the stub's return value                                          // 635
  //                              and returned undefined, instead we go ahead                                          // 636
  //                              and return it.  Specifically, this is any                                            // 637
  //                              time other than when (a) we are already                                              // 638
  //                              inside a stub or (b) we are in Node and no                                           // 639
  //                              callback was provided.  Currently we require                                         // 640
  //                              this flag to be explicitly passed to reduce                                          // 641
  //                              the likelihood that stub return values will                                          // 642
  //                              be confused with server return values; we                                            // 643
  //                              may improve this in future.                                                          // 644
  // @param callback {Optional Function}                                                                               // 645
  apply: function (name, args, options, callback) {                                                                    // 646
    var self = this;                                                                                                   // 647
                                                                                                                       // 648
    // We were passed 3 arguments. They may be either (name, args, options)                                            // 649
    // or (name, args, callback)                                                                                       // 650
    if (!callback && typeof options === 'function') {                                                                  // 651
      callback = options;                                                                                              // 652
      options = {};                                                                                                    // 653
    }                                                                                                                  // 654
    options = options || {};                                                                                           // 655
                                                                                                                       // 656
    if (callback) {                                                                                                    // 657
      // XXX would it be better form to do the binding in stream.on,                                                   // 658
      // or caller, instead of here?                                                                                   // 659
      // XXX improve error message (and how we report it)                                                              // 660
      callback = Meteor.bindEnvironment(                                                                               // 661
        callback,                                                                                                      // 662
        "delivering result of invoking '" + name + "'"                                                                 // 663
      );                                                                                                               // 664
    }                                                                                                                  // 665
                                                                                                                       // 666
    // Keep our args safe from mutation (eg if we don't send the message for a                                         // 667
    // while because of a wait method).                                                                                // 668
    args = EJSON.clone(args);                                                                                          // 669
                                                                                                                       // 670
    // Lazily allocate method ID once we know that it'll be needed.                                                    // 671
    var methodId = (function () {                                                                                      // 672
      var id;                                                                                                          // 673
      return function () {                                                                                             // 674
        if (id === undefined)                                                                                          // 675
          id = '' + (self._nextMethodId++);                                                                            // 676
        return id;                                                                                                     // 677
      };                                                                                                               // 678
    })();                                                                                                              // 679
                                                                                                                       // 680
    var enclosing = DDP._CurrentInvocation.get();                                                                      // 681
    var alreadyInSimulation = enclosing && enclosing.isSimulation;                                                     // 682
                                                                                                                       // 683
    // Lazily generate a randomSeed, only if it is requested by the stub.                                              // 684
    // The random streams only have utility if they're used on both the client                                         // 685
    // and the server; if the client doesn't generate any 'random' values                                              // 686
    // then we don't expect the server to generate any either.                                                         // 687
    // Less commonly, the server may perform different actions from the client,                                        // 688
    // and may in fact generate values where the client did not, but we don't                                          // 689
    // have any client-side values to match, so even here we may as well just                                          // 690
    // use a random seed on the server.  In that case, we don't pass the                                               // 691
    // randomSeed to save bandwidth, and we don't even generate it to save a                                           // 692
    // bit of CPU and to avoid consuming entropy.                                                                      // 693
    var randomSeed = null;                                                                                             // 694
    var randomSeedGenerator = function () {                                                                            // 695
      if (randomSeed === null) {                                                                                       // 696
        randomSeed = makeRpcSeed(enclosing, name);                                                                     // 697
      }                                                                                                                // 698
      return randomSeed;                                                                                               // 699
    };                                                                                                                 // 700
                                                                                                                       // 701
    // Run the stub, if we have one. The stub is supposed to make some                                                 // 702
    // temporary writes to the database to give the user a smooth experience                                           // 703
    // until the actual result of executing the method comes back from the                                             // 704
    // server (whereupon the temporary writes to the database will be reversed                                         // 705
    // during the beginUpdate/endUpdate process.)                                                                      // 706
    //                                                                                                                 // 707
    // Normally, we ignore the return value of the stub (even if it is an                                              // 708
    // exception), in favor of the real return value from the server. The                                              // 709
    // exception is if the *caller* is a stub. In that case, we're not going                                           // 710
    // to do a RPC, so we use the return value of the stub as our return                                               // 711
    // value.                                                                                                          // 712
                                                                                                                       // 713
    var stub = self._methodHandlers[name];                                                                             // 714
    if (stub) {                                                                                                        // 715
      var setUserId = function(userId) {                                                                               // 716
        self.setUserId(userId);                                                                                        // 717
      };                                                                                                               // 718
                                                                                                                       // 719
      var invocation = new MethodInvocation({                                                                          // 720
        isSimulation: true,                                                                                            // 721
        userId: self.userId(),                                                                                         // 722
        setUserId: setUserId,                                                                                          // 723
        randomSeed: function () { return randomSeedGenerator(); }                                                      // 724
      });                                                                                                              // 725
                                                                                                                       // 726
      if (!alreadyInSimulation)                                                                                        // 727
        self._saveOriginals();                                                                                         // 728
                                                                                                                       // 729
      try {                                                                                                            // 730
        // Note that unlike in the corresponding server code, we never audit                                           // 731
        // that stubs check() their arguments.                                                                         // 732
        var stubReturnValue = DDP._CurrentInvocation.withValue(invocation, function () {                               // 733
          if (Meteor.isServer) {                                                                                       // 734
            // Because saveOriginals and retrieveOriginals aren't reentrant,                                           // 735
            // don't allow stubs to yield.                                                                             // 736
            return Meteor._noYieldsAllowed(function () {                                                               // 737
              // re-clone, so that the stub can't affect our caller's values                                           // 738
              return stub.apply(invocation, EJSON.clone(args));                                                        // 739
            });                                                                                                        // 740
          } else {                                                                                                     // 741
            return stub.apply(invocation, EJSON.clone(args));                                                          // 742
          }                                                                                                            // 743
        });                                                                                                            // 744
      }                                                                                                                // 745
      catch (e) {                                                                                                      // 746
        var exception = e;                                                                                             // 747
      }                                                                                                                // 748
                                                                                                                       // 749
      if (!alreadyInSimulation)                                                                                        // 750
        self._retrieveAndStoreOriginals(methodId());                                                                   // 751
    }                                                                                                                  // 752
                                                                                                                       // 753
    // If we're in a simulation, stop and return the result we have,                                                   // 754
    // rather than going on to do an RPC. If there was no stub,                                                        // 755
    // we'll end up returning undefined.                                                                               // 756
    if (alreadyInSimulation) {                                                                                         // 757
      if (callback) {                                                                                                  // 758
        callback(exception, stubReturnValue);                                                                          // 759
        return undefined;                                                                                              // 760
      }                                                                                                                // 761
      if (exception)                                                                                                   // 762
        throw exception;                                                                                               // 763
      return stubReturnValue;                                                                                          // 764
    }                                                                                                                  // 765
                                                                                                                       // 766
    // If an exception occurred in a stub, and we're ignoring it                                                       // 767
    // because we're doing an RPC and want to use what the server                                                      // 768
    // returns instead, log it so the developer knows.                                                                 // 769
    //                                                                                                                 // 770
    // Tests can set the 'expected' flag on an exception so it won't                                                   // 771
    // go to log.                                                                                                      // 772
    if (exception && !exception.expected) {                                                                            // 773
      Meteor._debug("Exception while simulating the effect of invoking '" +                                            // 774
                    name + "'", exception, exception.stack);                                                           // 775
    }                                                                                                                  // 776
                                                                                                                       // 777
                                                                                                                       // 778
    // At this point we're definitely doing an RPC, and we're going to                                                 // 779
    // return the value of the RPC to the caller.                                                                      // 780
                                                                                                                       // 781
    // If the caller didn't give a callback, decide what to do.                                                        // 782
    if (!callback) {                                                                                                   // 783
      if (Meteor.isClient) {                                                                                           // 784
        // On the client, we don't have fibers, so we can't block. The                                                 // 785
        // only thing we can do is to return undefined and discard the                                                 // 786
        // result of the RPC.                                                                                          // 787
        callback = function () {};                                                                                     // 788
      } else {                                                                                                         // 789
        // On the server, make the function synchronous. Throw on                                                      // 790
        // errors, return on success.                                                                                  // 791
        var future = new Future;                                                                                       // 792
        callback = future.resolver();                                                                                  // 793
      }                                                                                                                // 794
    }                                                                                                                  // 795
    // Send the RPC. Note that on the client, it is important that the                                                 // 796
    // stub have finished before we send the RPC, so that we know we have                                              // 797
    // a complete list of which local documents the stub wrote.                                                        // 798
    var message = {                                                                                                    // 799
      msg: 'method',                                                                                                   // 800
      method: name,                                                                                                    // 801
      params: args,                                                                                                    // 802
      id: methodId()                                                                                                   // 803
    };                                                                                                                 // 804
                                                                                                                       // 805
    // Send the randomSeed only if we used it                                                                          // 806
    if (randomSeed !== null) {                                                                                         // 807
      message.randomSeed = randomSeed;                                                                                 // 808
    }                                                                                                                  // 809
                                                                                                                       // 810
    var methodInvoker = new MethodInvoker({                                                                            // 811
      methodId: methodId(),                                                                                            // 812
      callback: callback,                                                                                              // 813
      connection: self,                                                                                                // 814
      onResultReceived: options.onResultReceived,                                                                      // 815
      wait: !!options.wait,                                                                                            // 816
      message: message                                                                                                 // 817
    });                                                                                                                // 818
                                                                                                                       // 819
    if (options.wait) {                                                                                                // 820
      // It's a wait method! Wait methods go in their own block.                                                       // 821
      self._outstandingMethodBlocks.push(                                                                              // 822
        {wait: true, methods: [methodInvoker]});                                                                       // 823
    } else {                                                                                                           // 824
      // Not a wait method. Start a new block if the previous block was a wait                                         // 825
      // block, and add it to the last block of methods.                                                               // 826
      if (_.isEmpty(self._outstandingMethodBlocks) ||                                                                  // 827
          _.last(self._outstandingMethodBlocks).wait)                                                                  // 828
        self._outstandingMethodBlocks.push({wait: false, methods: []});                                                // 829
      _.last(self._outstandingMethodBlocks).methods.push(methodInvoker);                                               // 830
    }                                                                                                                  // 831
                                                                                                                       // 832
    // If we added it to the first block, send it out now.                                                             // 833
    if (self._outstandingMethodBlocks.length === 1)                                                                    // 834
      methodInvoker.sendMessage();                                                                                     // 835
                                                                                                                       // 836
    // If we're using the default callback on the server,                                                              // 837
    // block waiting for the result.                                                                                   // 838
    if (future) {                                                                                                      // 839
      return future.wait();                                                                                            // 840
    }                                                                                                                  // 841
    return options.returnStubValue ? stubReturnValue : undefined;                                                      // 842
  },                                                                                                                   // 843
                                                                                                                       // 844
  // Before calling a method stub, prepare all stores to track changes and allow                                       // 845
  // _retrieveAndStoreOriginals to get the original versions of changed                                                // 846
  // documents.                                                                                                        // 847
  _saveOriginals: function () {                                                                                        // 848
    var self = this;                                                                                                   // 849
    _.each(self._stores, function (s) {                                                                                // 850
      s.saveOriginals();                                                                                               // 851
    });                                                                                                                // 852
  },                                                                                                                   // 853
  // Retrieves the original versions of all documents modified by the stub for                                         // 854
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed                                       // 855
  // by document) and _documentsWrittenByStub (keyed by method ID).                                                    // 856
  _retrieveAndStoreOriginals: function (methodId) {                                                                    // 857
    var self = this;                                                                                                   // 858
    if (self._documentsWrittenByStub[methodId])                                                                        // 859
      throw new Error("Duplicate methodId in _retrieveAndStoreOriginals");                                             // 860
                                                                                                                       // 861
    var docsWritten = [];                                                                                              // 862
    _.each(self._stores, function (s, collection) {                                                                    // 863
      var originals = s.retrieveOriginals();                                                                           // 864
      // not all stores define retrieveOriginals                                                                       // 865
      if (!originals)                                                                                                  // 866
        return;                                                                                                        // 867
      originals.forEach(function (doc, id) {                                                                           // 868
        docsWritten.push({collection: collection, id: id});                                                            // 869
        if (!_.has(self._serverDocuments, collection))                                                                 // 870
          self._serverDocuments[collection] = new LocalCollection._IdMap;                                              // 871
        var serverDoc = self._serverDocuments[collection].setDefault(id, {});                                          // 872
        if (serverDoc.writtenByStubs) {                                                                                // 873
          // We're not the first stub to write this doc. Just add our method ID                                        // 874
          // to the record.                                                                                            // 875
          serverDoc.writtenByStubs[methodId] = true;                                                                   // 876
        } else {                                                                                                       // 877
          // First stub! Save the original value and our method ID.                                                    // 878
          serverDoc.document = doc;                                                                                    // 879
          serverDoc.flushCallbacks = [];                                                                               // 880
          serverDoc.writtenByStubs = {};                                                                               // 881
          serverDoc.writtenByStubs[methodId] = true;                                                                   // 882
        }                                                                                                              // 883
      });                                                                                                              // 884
    });                                                                                                                // 885
    if (!_.isEmpty(docsWritten)) {                                                                                     // 886
      self._documentsWrittenByStub[methodId] = docsWritten;                                                            // 887
    }                                                                                                                  // 888
  },                                                                                                                   // 889
                                                                                                                       // 890
  // This is very much a private function we use to make the tests                                                     // 891
  // take up fewer server resources after they complete.                                                               // 892
  _unsubscribeAll: function () {                                                                                       // 893
    var self = this;                                                                                                   // 894
    _.each(_.clone(self._subscriptions), function (sub, id) {                                                          // 895
      // Avoid killing the autoupdate subscription so that developers                                                  // 896
      // still get hot code pushes when writing tests.                                                                 // 897
      //                                                                                                               // 898
      // XXX it's a hack to encode knowledge about autoupdate here,                                                    // 899
      // but it doesn't seem worth it yet to have a special API for                                                    // 900
      // subscriptions to preserve after unit tests.                                                                   // 901
      if (sub.name !== 'meteor_autoupdate_clientVersions') {                                                           // 902
        self._subscriptions[id].stop();                                                                                // 903
      }                                                                                                                // 904
    });                                                                                                                // 905
  },                                                                                                                   // 906
                                                                                                                       // 907
  // Sends the DDP stringification of the given message object                                                         // 908
  _send: function (obj) {                                                                                              // 909
    var self = this;                                                                                                   // 910
    self._stream.send(stringifyDDP(obj));                                                                              // 911
  },                                                                                                                   // 912
                                                                                                                       // 913
  // We detected via DDP-level heartbeats that we've lost the                                                          // 914
  // connection.  Unlike `disconnect` or `close`, a lost connection                                                    // 915
  // will be automatically retried.                                                                                    // 916
  _lostConnection: function () {                                                                                       // 917
    var self = this;                                                                                                   // 918
    self._stream._lostConnection();                                                                                    // 919
  },                                                                                                                   // 920
                                                                                                                       // 921
  status: function (/*passthrough args*/) {                                                                            // 922
    var self = this;                                                                                                   // 923
    return self._stream.status.apply(self._stream, arguments);                                                         // 924
  },                                                                                                                   // 925
                                                                                                                       // 926
  reconnect: function (/*passthrough args*/) {                                                                         // 927
    var self = this;                                                                                                   // 928
    return self._stream.reconnect.apply(self._stream, arguments);                                                      // 929
  },                                                                                                                   // 930
                                                                                                                       // 931
  disconnect: function (/*passthrough args*/) {                                                                        // 932
    var self = this;                                                                                                   // 933
    return self._stream.disconnect.apply(self._stream, arguments);                                                     // 934
  },                                                                                                                   // 935
                                                                                                                       // 936
  close: function () {                                                                                                 // 937
    var self = this;                                                                                                   // 938
    return self._stream.disconnect({_permanent: true});                                                                // 939
  },                                                                                                                   // 940
                                                                                                                       // 941
  ///                                                                                                                  // 942
  /// Reactive user system                                                                                             // 943
  ///                                                                                                                  // 944
  userId: function () {                                                                                                // 945
    var self = this;                                                                                                   // 946
    if (self._userIdDeps)                                                                                              // 947
      self._userIdDeps.depend();                                                                                       // 948
    return self._userId;                                                                                               // 949
  },                                                                                                                   // 950
                                                                                                                       // 951
  setUserId: function (userId) {                                                                                       // 952
    var self = this;                                                                                                   // 953
    // Avoid invalidating dependents if setUserId is called with current value.                                        // 954
    if (self._userId === userId)                                                                                       // 955
      return;                                                                                                          // 956
    self._userId = userId;                                                                                             // 957
    if (self._userIdDeps)                                                                                              // 958
      self._userIdDeps.changed();                                                                                      // 959
  },                                                                                                                   // 960
                                                                                                                       // 961
  // Returns true if we are in a state after reconnect of waiting for subs to be                                       // 962
  // revived or early methods to finish their data, or we are waiting for a                                            // 963
  // "wait" method to finish.                                                                                          // 964
  _waitingForQuiescence: function () {                                                                                 // 965
    var self = this;                                                                                                   // 966
    return (! _.isEmpty(self._subsBeingRevived) ||                                                                     // 967
            ! _.isEmpty(self._methodsBlockingQuiescence));                                                             // 968
  },                                                                                                                   // 969
                                                                                                                       // 970
  // Returns true if any method whose message has been sent to the server has                                          // 971
  // not yet invoked its user callback.                                                                                // 972
  _anyMethodsAreOutstanding: function () {                                                                             // 973
    var self = this;                                                                                                   // 974
    return _.any(_.pluck(self._methodInvokers, 'sentMessage'));                                                        // 975
  },                                                                                                                   // 976
                                                                                                                       // 977
  _livedata_connected: function (msg) {                                                                                // 978
    var self = this;                                                                                                   // 979
                                                                                                                       // 980
    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {                                                   // 981
      self._heartbeat = new Heartbeat({                                                                                // 982
        heartbeatInterval: self._heartbeatInterval,                                                                    // 983
        heartbeatTimeout: self._heartbeatTimeout,                                                                      // 984
        onTimeout: function () {                                                                                       // 985
          if (Meteor.isClient) {                                                                                       // 986
            // only print on the client. this message is useful on the                                                 // 987
            // browser console to see that we've lost connection. on the                                               // 988
            // server (eg when doing server-to-server DDP), it gets                                                    // 989
            // kinda annoying. also this matches the behavior with                                                     // 990
            // sockjs timeouts.                                                                                        // 991
            Meteor._debug("Connection timeout. No DDP heartbeat received.");                                           // 992
          }                                                                                                            // 993
          self._lostConnection();                                                                                      // 994
        },                                                                                                             // 995
        sendPing: function () {                                                                                        // 996
          self._send({msg: 'ping'});                                                                                   // 997
        }                                                                                                              // 998
      });                                                                                                              // 999
      self._heartbeat.start();                                                                                         // 1000
    }                                                                                                                  // 1001
                                                                                                                       // 1002
    // If this is a reconnect, we'll have to reset all stores.                                                         // 1003
    if (self._lastSessionId)                                                                                           // 1004
      self._resetStores = true;                                                                                        // 1005
                                                                                                                       // 1006
    if (typeof (msg.session) === "string") {                                                                           // 1007
      var reconnectedToPreviousSession = (self._lastSessionId === msg.session);                                        // 1008
      self._lastSessionId = msg.session;                                                                               // 1009
    }                                                                                                                  // 1010
                                                                                                                       // 1011
    if (reconnectedToPreviousSession) {                                                                                // 1012
      // Successful reconnection -- pick up where we left off.  Note that right                                        // 1013
      // now, this never happens: the server never connects us to a previous                                           // 1014
      // session, because DDP doesn't provide enough data for the server to know                                       // 1015
      // what messages the client has processed. We need to improve DDP to make                                        // 1016
      // this possible, at which point we'll probably need more code here.                                             // 1017
      return;                                                                                                          // 1018
    }                                                                                                                  // 1019
                                                                                                                       // 1020
    // Server doesn't have our data any more. Re-sync a new session.                                                   // 1021
                                                                                                                       // 1022
    // Forget about messages we were buffering for unknown collections. They'll                                        // 1023
    // be resent if still relevant.                                                                                    // 1024
    self._updatesForUnknownStores = {};                                                                                // 1025
                                                                                                                       // 1026
    if (self._resetStores) {                                                                                           // 1027
      // Forget about the effects of stubs. We'll be resetting all collections                                         // 1028
      // anyway.                                                                                                       // 1029
      self._documentsWrittenByStub = {};                                                                               // 1030
      self._serverDocuments = {};                                                                                      // 1031
    }                                                                                                                  // 1032
                                                                                                                       // 1033
    // Clear _afterUpdateCallbacks.                                                                                    // 1034
    self._afterUpdateCallbacks = [];                                                                                   // 1035
                                                                                                                       // 1036
    // Mark all named subscriptions which are ready (ie, we already called the                                         // 1037
    // ready callback) as needing to be revived.                                                                       // 1038
    // XXX We should also block reconnect quiescence until unnamed subscriptions                                       // 1039
    //     (eg, autopublish) are done re-publishing to avoid flicker!                                                  // 1040
    self._subsBeingRevived = {};                                                                                       // 1041
    _.each(self._subscriptions, function (sub, id) {                                                                   // 1042
      if (sub.ready)                                                                                                   // 1043
        self._subsBeingRevived[id] = true;                                                                             // 1044
    });                                                                                                                // 1045
                                                                                                                       // 1046
    // Arrange for "half-finished" methods to have their callbacks run, and                                            // 1047
    // track methods that were sent on this connection so that we don't                                                // 1048
    // quiesce until they are all done.                                                                                // 1049
    //                                                                                                                 // 1050
    // Start by clearing _methodsBlockingQuiescence: methods sent before                                               // 1051
    // reconnect don't matter, and any "wait" methods sent on the new connection                                       // 1052
    // that we drop here will be restored by the loop below.                                                           // 1053
    self._methodsBlockingQuiescence = {};                                                                              // 1054
    if (self._resetStores) {                                                                                           // 1055
      _.each(self._methodInvokers, function (invoker) {                                                                // 1056
        if (invoker.gotResult()) {                                                                                     // 1057
          // This method already got its result, but it didn't call its callback                                       // 1058
          // because its data didn't become visible. We did not resend the                                             // 1059
          // method RPC. We'll call its callback when we get a full quiesce,                                           // 1060
          // since that's as close as we'll get to "data must be visible".                                             // 1061
          self._afterUpdateCallbacks.push(_.bind(invoker.dataVisible, invoker));                                       // 1062
        } else if (invoker.sentMessage) {                                                                              // 1063
          // This method has been sent on this connection (maybe as a resend                                           // 1064
          // from the last connection, maybe from onReconnect, maybe just very                                         // 1065
          // quickly before processing the connected message).                                                         // 1066
          //                                                                                                           // 1067
          // We don't need to do anything special to ensure its callbacks get                                          // 1068
          // called, but we'll count it as a method which is preventing                                                // 1069
          // reconnect quiescence. (eg, it might be a login method that was run                                        // 1070
          // from onReconnect, and we don't want to see flicker by seeing a                                            // 1071
          // logged-out state.)                                                                                        // 1072
          self._methodsBlockingQuiescence[invoker.methodId] = true;                                                    // 1073
        }                                                                                                              // 1074
      });                                                                                                              // 1075
    }                                                                                                                  // 1076
                                                                                                                       // 1077
    self._messagesBufferedUntilQuiescence = [];                                                                        // 1078
                                                                                                                       // 1079
    // If we're not waiting on any methods or subs, we can reset the stores and                                        // 1080
    // call the callbacks immediately.                                                                                 // 1081
    if (!self._waitingForQuiescence()) {                                                                               // 1082
      if (self._resetStores) {                                                                                         // 1083
        _.each(self._stores, function (s) {                                                                            // 1084
          s.beginUpdate(0, true);                                                                                      // 1085
          s.endUpdate();                                                                                               // 1086
        });                                                                                                            // 1087
        self._resetStores = false;                                                                                     // 1088
      }                                                                                                                // 1089
      self._runAfterUpdateCallbacks();                                                                                 // 1090
    }                                                                                                                  // 1091
  },                                                                                                                   // 1092
                                                                                                                       // 1093
                                                                                                                       // 1094
  _processOneDataMessage: function (msg, updates) {                                                                    // 1095
    var self = this;                                                                                                   // 1096
    // Using underscore here so as not to need to capitalize.                                                          // 1097
    self['_process_' + msg.msg](msg, updates);                                                                         // 1098
  },                                                                                                                   // 1099
                                                                                                                       // 1100
                                                                                                                       // 1101
  _livedata_data: function (msg) {                                                                                     // 1102
    var self = this;                                                                                                   // 1103
                                                                                                                       // 1104
    // collection name -> array of messages                                                                            // 1105
    var updates = {};                                                                                                  // 1106
                                                                                                                       // 1107
    if (self._waitingForQuiescence()) {                                                                                // 1108
      self._messagesBufferedUntilQuiescence.push(msg);                                                                 // 1109
                                                                                                                       // 1110
      if (msg.msg === "nosub")                                                                                         // 1111
        delete self._subsBeingRevived[msg.id];                                                                         // 1112
                                                                                                                       // 1113
      _.each(msg.subs || [], function (subId) {                                                                        // 1114
        delete self._subsBeingRevived[subId];                                                                          // 1115
      });                                                                                                              // 1116
      _.each(msg.methods || [], function (methodId) {                                                                  // 1117
        delete self._methodsBlockingQuiescence[methodId];                                                              // 1118
      });                                                                                                              // 1119
                                                                                                                       // 1120
      if (self._waitingForQuiescence())                                                                                // 1121
        return;                                                                                                        // 1122
                                                                                                                       // 1123
      // No methods or subs are blocking quiescence!                                                                   // 1124
      // We'll now process and all of our buffered messages, reset all stores,                                         // 1125
      // and apply them all at once.                                                                                   // 1126
      _.each(self._messagesBufferedUntilQuiescence, function (bufferedMsg) {                                           // 1127
        self._processOneDataMessage(bufferedMsg, updates);                                                             // 1128
      });                                                                                                              // 1129
      self._messagesBufferedUntilQuiescence = [];                                                                      // 1130
    } else {                                                                                                           // 1131
      self._processOneDataMessage(msg, updates);                                                                       // 1132
    }                                                                                                                  // 1133
                                                                                                                       // 1134
    if (self._resetStores || !_.isEmpty(updates)) {                                                                    // 1135
      // Begin a transactional update of each store.                                                                   // 1136
      _.each(self._stores, function (s, storeName) {                                                                   // 1137
        s.beginUpdate(_.has(updates, storeName) ? updates[storeName].length : 0,                                       // 1138
                      self._resetStores);                                                                              // 1139
      });                                                                                                              // 1140
      self._resetStores = false;                                                                                       // 1141
                                                                                                                       // 1142
      _.each(updates, function (updateMessages, storeName) {                                                           // 1143
        var store = self._stores[storeName];                                                                           // 1144
        if (store) {                                                                                                   // 1145
          _.each(updateMessages, function (updateMessage) {                                                            // 1146
            store.update(updateMessage);                                                                               // 1147
          });                                                                                                          // 1148
        } else {                                                                                                       // 1149
          // Nobody's listening for this data. Queue it up until                                                       // 1150
          // someone wants it.                                                                                         // 1151
          // XXX memory use will grow without bound if you forget to                                                   // 1152
          // create a collection or just don't care about it... going                                                  // 1153
          // to have to do something about that.                                                                       // 1154
          if (!_.has(self._updatesForUnknownStores, storeName))                                                        // 1155
            self._updatesForUnknownStores[storeName] = [];                                                             // 1156
          Array.prototype.push.apply(self._updatesForUnknownStores[storeName],                                         // 1157
                                     updateMessages);                                                                  // 1158
        }                                                                                                              // 1159
      });                                                                                                              // 1160
                                                                                                                       // 1161
      // End update transaction.                                                                                       // 1162
      _.each(self._stores, function (s) { s.endUpdate(); });                                                           // 1163
    }                                                                                                                  // 1164
                                                                                                                       // 1165
    self._runAfterUpdateCallbacks();                                                                                   // 1166
  },                                                                                                                   // 1167
                                                                                                                       // 1168
  // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose                                            // 1169
  // relevant docs have been flushed, as well as dataVisible callbacks at                                              // 1170
  // reconnect-quiescence time.                                                                                        // 1171
  _runAfterUpdateCallbacks: function () {                                                                              // 1172
    var self = this;                                                                                                   // 1173
    var callbacks = self._afterUpdateCallbacks;                                                                        // 1174
    self._afterUpdateCallbacks = [];                                                                                   // 1175
    _.each(callbacks, function (c) {                                                                                   // 1176
      c();                                                                                                             // 1177
    });                                                                                                                // 1178
  },                                                                                                                   // 1179
                                                                                                                       // 1180
  _pushUpdate: function (updates, collection, msg) {                                                                   // 1181
    var self = this;                                                                                                   // 1182
    if (!_.has(updates, collection)) {                                                                                 // 1183
      updates[collection] = [];                                                                                        // 1184
    }                                                                                                                  // 1185
    updates[collection].push(msg);                                                                                     // 1186
  },                                                                                                                   // 1187
                                                                                                                       // 1188
  _getServerDoc: function (collection, id) {                                                                           // 1189
    var self = this;                                                                                                   // 1190
    if (!_.has(self._serverDocuments, collection))                                                                     // 1191
      return null;                                                                                                     // 1192
    var serverDocsForCollection = self._serverDocuments[collection];                                                   // 1193
    return serverDocsForCollection.get(id) || null;                                                                    // 1194
  },                                                                                                                   // 1195
                                                                                                                       // 1196
  _process_added: function (msg, updates) {                                                                            // 1197
    var self = this;                                                                                                   // 1198
    var id = LocalCollection._idParse(msg.id);                                                                         // 1199
    var serverDoc = self._getServerDoc(msg.collection, id);                                                            // 1200
    if (serverDoc) {                                                                                                   // 1201
      // Some outstanding stub wrote here.                                                                             // 1202
      if (serverDoc.document !== undefined)                                                                            // 1203
        throw new Error("Server sent add for existing id: " + msg.id);                                                 // 1204
      serverDoc.document = msg.fields || {};                                                                           // 1205
      serverDoc.document._id = id;                                                                                     // 1206
    } else {                                                                                                           // 1207
      self._pushUpdate(updates, msg.collection, msg);                                                                  // 1208
    }                                                                                                                  // 1209
  },                                                                                                                   // 1210
                                                                                                                       // 1211
  _process_changed: function (msg, updates) {                                                                          // 1212
    var self = this;                                                                                                   // 1213
    var serverDoc = self._getServerDoc(                                                                                // 1214
      msg.collection, LocalCollection._idParse(msg.id));                                                               // 1215
    if (serverDoc) {                                                                                                   // 1216
      if (serverDoc.document === undefined)                                                                            // 1217
        throw new Error("Server sent changed for nonexisting id: " + msg.id);                                          // 1218
      LocalCollection._applyChanges(serverDoc.document, msg.fields);                                                   // 1219
    } else {                                                                                                           // 1220
      self._pushUpdate(updates, msg.collection, msg);                                                                  // 1221
    }                                                                                                                  // 1222
  },                                                                                                                   // 1223
                                                                                                                       // 1224
  _process_removed: function (msg, updates) {                                                                          // 1225
    var self = this;                                                                                                   // 1226
    var serverDoc = self._getServerDoc(                                                                                // 1227
      msg.collection, LocalCollection._idParse(msg.id));                                                               // 1228
    if (serverDoc) {                                                                                                   // 1229
      // Some outstanding stub wrote here.                                                                             // 1230
      if (serverDoc.document === undefined)                                                                            // 1231
        throw new Error("Server sent removed for nonexisting id:" + msg.id);                                           // 1232
      serverDoc.document = undefined;                                                                                  // 1233
    } else {                                                                                                           // 1234
      self._pushUpdate(updates, msg.collection, {                                                                      // 1235
        msg: 'removed',                                                                                                // 1236
        collection: msg.collection,                                                                                    // 1237
        id: msg.id                                                                                                     // 1238
      });                                                                                                              // 1239
    }                                                                                                                  // 1240
  },                                                                                                                   // 1241
                                                                                                                       // 1242
  _process_updated: function (msg, updates) {                                                                          // 1243
    var self = this;                                                                                                   // 1244
    // Process "method done" messages.                                                                                 // 1245
    _.each(msg.methods, function (methodId) {                                                                          // 1246
      _.each(self._documentsWrittenByStub[methodId], function (written) {                                              // 1247
        var serverDoc = self._getServerDoc(written.collection, written.id);                                            // 1248
        if (!serverDoc)                                                                                                // 1249
          throw new Error("Lost serverDoc for " + JSON.stringify(written));                                            // 1250
        if (!serverDoc.writtenByStubs[methodId])                                                                       // 1251
          throw new Error("Doc " + JSON.stringify(written) +                                                           // 1252
                          " not written by  method " + methodId);                                                      // 1253
        delete serverDoc.writtenByStubs[methodId];                                                                     // 1254
        if (_.isEmpty(serverDoc.writtenByStubs)) {                                                                     // 1255
          // All methods whose stubs wrote this method have completed! We can                                          // 1256
          // now copy the saved document to the database (reverting the stub's                                         // 1257
          // change if the server did not write to this object, or applying the                                        // 1258
          // server's writes if it did).                                                                               // 1259
                                                                                                                       // 1260
          // This is a fake ddp 'replace' message.  It's just for talking                                              // 1261
          // between livedata connections and minimongo.  (We have to stringify                                        // 1262
          // the ID because it's supposed to look like a wire message.)                                                // 1263
          self._pushUpdate(updates, written.collection, {                                                              // 1264
            msg: 'replace',                                                                                            // 1265
            id: LocalCollection._idStringify(written.id),                                                              // 1266
            replace: serverDoc.document                                                                                // 1267
          });                                                                                                          // 1268
          // Call all flush callbacks.                                                                                 // 1269
          _.each(serverDoc.flushCallbacks, function (c) {                                                              // 1270
            c();                                                                                                       // 1271
          });                                                                                                          // 1272
                                                                                                                       // 1273
          // Delete this completed serverDocument. Don't bother to GC empty                                            // 1274
          // IdMaps inside self._serverDocuments, since there probably aren't                                          // 1275
          // many collections and they'll be written repeatedly.                                                       // 1276
          self._serverDocuments[written.collection].remove(written.id);                                                // 1277
        }                                                                                                              // 1278
      });                                                                                                              // 1279
      delete self._documentsWrittenByStub[methodId];                                                                   // 1280
                                                                                                                       // 1281
      // We want to call the data-written callback, but we can't do so until all                                       // 1282
      // currently buffered messages are flushed.                                                                      // 1283
      var callbackInvoker = self._methodInvokers[methodId];                                                            // 1284
      if (!callbackInvoker)                                                                                            // 1285
        throw new Error("No callback invoker for method " + methodId);                                                 // 1286
      self._runWhenAllServerDocsAreFlushed(                                                                            // 1287
        _.bind(callbackInvoker.dataVisible, callbackInvoker));                                                         // 1288
    });                                                                                                                // 1289
  },                                                                                                                   // 1290
                                                                                                                       // 1291
  _process_ready: function (msg, updates) {                                                                            // 1292
    var self = this;                                                                                                   // 1293
    // Process "sub ready" messages. "sub ready" messages don't take effect                                            // 1294
    // until all current server documents have been flushed to the local                                               // 1295
    // database. We can use a write fence to implement this.                                                           // 1296
    _.each(msg.subs, function (subId) {                                                                                // 1297
      self._runWhenAllServerDocsAreFlushed(function () {                                                               // 1298
        var subRecord = self._subscriptions[subId];                                                                    // 1299
        // Did we already unsubscribe?                                                                                 // 1300
        if (!subRecord)                                                                                                // 1301
          return;                                                                                                      // 1302
        // Did we already receive a ready message? (Oops!)                                                             // 1303
        if (subRecord.ready)                                                                                           // 1304
          return;                                                                                                      // 1305
        subRecord.readyCallback && subRecord.readyCallback();                                                          // 1306
        subRecord.ready = true;                                                                                        // 1307
        subRecord.readyDeps.changed();                                                                                 // 1308
      });                                                                                                              // 1309
    });                                                                                                                // 1310
  },                                                                                                                   // 1311
                                                                                                                       // 1312
  // Ensures that "f" will be called after all documents currently in                                                  // 1313
  // _serverDocuments have been written to the local cache. f will not be called                                       // 1314
  // if the connection is lost before then!                                                                            // 1315
  _runWhenAllServerDocsAreFlushed: function (f) {                                                                      // 1316
    var self = this;                                                                                                   // 1317
    var runFAfterUpdates = function () {                                                                               // 1318
      self._afterUpdateCallbacks.push(f);                                                                              // 1319
    };                                                                                                                 // 1320
    var unflushedServerDocCount = 0;                                                                                   // 1321
    var onServerDocFlush = function () {                                                                               // 1322
      --unflushedServerDocCount;                                                                                       // 1323
      if (unflushedServerDocCount === 0) {                                                                             // 1324
        // This was the last doc to flush! Arrange to run f after the updates                                          // 1325
        // have been applied.                                                                                          // 1326
        runFAfterUpdates();                                                                                            // 1327
      }                                                                                                                // 1328
    };                                                                                                                 // 1329
    _.each(self._serverDocuments, function (collectionDocs) {                                                          // 1330
      collectionDocs.forEach(function (serverDoc) {                                                                    // 1331
        var writtenByStubForAMethodWithSentMessage = _.any(                                                            // 1332
          serverDoc.writtenByStubs, function (dummy, methodId) {                                                       // 1333
            var invoker = self._methodInvokers[methodId];                                                              // 1334
            return invoker && invoker.sentMessage;                                                                     // 1335
          });                                                                                                          // 1336
        if (writtenByStubForAMethodWithSentMessage) {                                                                  // 1337
          ++unflushedServerDocCount;                                                                                   // 1338
          serverDoc.flushCallbacks.push(onServerDocFlush);                                                             // 1339
        }                                                                                                              // 1340
      });                                                                                                              // 1341
    });                                                                                                                // 1342
    if (unflushedServerDocCount === 0) {                                                                               // 1343
      // There aren't any buffered docs --- we can call f as soon as the current                                       // 1344
      // round of updates is applied!                                                                                  // 1345
      runFAfterUpdates();                                                                                              // 1346
    }                                                                                                                  // 1347
  },                                                                                                                   // 1348
                                                                                                                       // 1349
  _livedata_nosub: function (msg) {                                                                                    // 1350
    var self = this;                                                                                                   // 1351
                                                                                                                       // 1352
    // First pass it through _livedata_data, which only uses it to help get                                            // 1353
    // towards quiescence.                                                                                             // 1354
    self._livedata_data(msg);                                                                                          // 1355
                                                                                                                       // 1356
    // Do the rest of our processing immediately, with no                                                              // 1357
    // buffering-until-quiescence.                                                                                     // 1358
                                                                                                                       // 1359
    // we weren't subbed anyway, or we initiated the unsub.                                                            // 1360
    if (!_.has(self._subscriptions, msg.id))                                                                           // 1361
      return;                                                                                                          // 1362
    var errorCallback = self._subscriptions[msg.id].errorCallback;                                                     // 1363
    self._subscriptions[msg.id].remove();                                                                              // 1364
    if (errorCallback && msg.error) {                                                                                  // 1365
      errorCallback(new Meteor.Error(                                                                                  // 1366
        msg.error.error, msg.error.reason, msg.error.details));                                                        // 1367
    }                                                                                                                  // 1368
  },                                                                                                                   // 1369
                                                                                                                       // 1370
  _process_nosub: function () {                                                                                        // 1371
    // This is called as part of the "buffer until quiescence" process, but                                            // 1372
    // nosub's effect is always immediate. It only goes in the buffer at all                                           // 1373
    // because it's possible for a nosub to be the thing that triggers                                                 // 1374
    // quiescence, if we were waiting for a sub to be revived and it dies                                              // 1375
    // instead.                                                                                                        // 1376
  },                                                                                                                   // 1377
                                                                                                                       // 1378
  _livedata_result: function (msg) {                                                                                   // 1379
    // id, result or error. error has error (code), reason, details                                                    // 1380
                                                                                                                       // 1381
    var self = this;                                                                                                   // 1382
                                                                                                                       // 1383
    // find the outstanding request                                                                                    // 1384
    // should be O(1) in nearly all realistic use cases                                                                // 1385
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                                    // 1386
      Meteor._debug("Received method result but no methods outstanding");                                              // 1387
      return;                                                                                                          // 1388
    }                                                                                                                  // 1389
    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;                                                 // 1390
    var m;                                                                                                             // 1391
    for (var i = 0; i < currentMethodBlock.length; i++) {                                                              // 1392
      m = currentMethodBlock[i];                                                                                       // 1393
      if (m.methodId === msg.id)                                                                                       // 1394
        break;                                                                                                         // 1395
    }                                                                                                                  // 1396
                                                                                                                       // 1397
    if (!m) {                                                                                                          // 1398
      Meteor._debug("Can't match method response to original method call", msg);                                       // 1399
      return;                                                                                                          // 1400
    }                                                                                                                  // 1401
                                                                                                                       // 1402
    // Remove from current method block. This may leave the block empty, but we                                        // 1403
    // don't move on to the next block until the callback has been delivered, in                                       // 1404
    // _outstandingMethodFinished.                                                                                     // 1405
    currentMethodBlock.splice(i, 1);                                                                                   // 1406
                                                                                                                       // 1407
    if (_.has(msg, 'error')) {                                                                                         // 1408
      m.receiveResult(new Meteor.Error(                                                                                // 1409
        msg.error.error, msg.error.reason,                                                                             // 1410
        msg.error.details));                                                                                           // 1411
    } else {                                                                                                           // 1412
      // msg.result may be undefined if the method didn't return a                                                     // 1413
      // value                                                                                                         // 1414
      m.receiveResult(undefined, msg.result);                                                                          // 1415
    }                                                                                                                  // 1416
  },                                                                                                                   // 1417
                                                                                                                       // 1418
  // Called by MethodInvoker after a method's callback is invoked.  If this was                                        // 1419
  // the last outstanding method in the current block, runs the next block. If                                         // 1420
  // there are no more methods, consider accepting a hot code push.                                                    // 1421
  _outstandingMethodFinished: function () {                                                                            // 1422
    var self = this;                                                                                                   // 1423
    if (self._anyMethodsAreOutstanding())                                                                              // 1424
      return;                                                                                                          // 1425
                                                                                                                       // 1426
    // No methods are outstanding. This should mean that the first block of                                            // 1427
    // methods is empty. (Or it might not exist, if this was a method that                                             // 1428
    // half-finished before disconnect/reconnect.)                                                                     // 1429
    if (! _.isEmpty(self._outstandingMethodBlocks)) {                                                                  // 1430
      var firstBlock = self._outstandingMethodBlocks.shift();                                                          // 1431
      if (! _.isEmpty(firstBlock.methods))                                                                             // 1432
        throw new Error("No methods outstanding but nonempty block: " +                                                // 1433
                        JSON.stringify(firstBlock));                                                                   // 1434
                                                                                                                       // 1435
      // Send the outstanding methods now in the first block.                                                          // 1436
      if (!_.isEmpty(self._outstandingMethodBlocks))                                                                   // 1437
        self._sendOutstandingMethods();                                                                                // 1438
    }                                                                                                                  // 1439
                                                                                                                       // 1440
    // Maybe accept a hot code push.                                                                                   // 1441
    self._maybeMigrate();                                                                                              // 1442
  },                                                                                                                   // 1443
                                                                                                                       // 1444
  // Sends messages for all the methods in the first block in                                                          // 1445
  // _outstandingMethodBlocks.                                                                                         // 1446
  _sendOutstandingMethods: function() {                                                                                // 1447
    var self = this;                                                                                                   // 1448
    if (_.isEmpty(self._outstandingMethodBlocks))                                                                      // 1449
      return;                                                                                                          // 1450
    _.each(self._outstandingMethodBlocks[0].methods, function (m) {                                                    // 1451
      m.sendMessage();                                                                                                 // 1452
    });                                                                                                                // 1453
  },                                                                                                                   // 1454
                                                                                                                       // 1455
  _livedata_error: function (msg) {                                                                                    // 1456
    Meteor._debug("Received error from server: ", msg.reason);                                                         // 1457
    if (msg.offendingMessage)                                                                                          // 1458
      Meteor._debug("For: ", msg.offendingMessage);                                                                    // 1459
  },                                                                                                                   // 1460
                                                                                                                       // 1461
  _callOnReconnectAndSendAppropriateOutstandingMethods: function() {                                                   // 1462
    var self = this;                                                                                                   // 1463
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;                                                    // 1464
    self._outstandingMethodBlocks = [];                                                                                // 1465
                                                                                                                       // 1466
    self.onReconnect();                                                                                                // 1467
                                                                                                                       // 1468
    if (_.isEmpty(oldOutstandingMethodBlocks))                                                                         // 1469
      return;                                                                                                          // 1470
                                                                                                                       // 1471
    // We have at least one block worth of old outstanding methods to try                                              // 1472
    // again. First: did onReconnect actually send anything? If not, we just                                           // 1473
    // restore all outstanding methods and run the first block.                                                        // 1474
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                                    // 1475
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;                                                      // 1476
      self._sendOutstandingMethods();                                                                                  // 1477
      return;                                                                                                          // 1478
    }                                                                                                                  // 1479
                                                                                                                       // 1480
    // OK, there are blocks on both sides. Special case: merge the last block of                                       // 1481
    // the reconnect methods with the first block of the original methods, if                                          // 1482
    // neither of them are "wait" blocks.                                                                              // 1483
    if (!_.last(self._outstandingMethodBlocks).wait &&                                                                 // 1484
        !oldOutstandingMethodBlocks[0].wait) {                                                                         // 1485
      _.each(oldOutstandingMethodBlocks[0].methods, function (m) {                                                     // 1486
        _.last(self._outstandingMethodBlocks).methods.push(m);                                                         // 1487
                                                                                                                       // 1488
        // If this "last block" is also the first block, send the message.                                             // 1489
        if (self._outstandingMethodBlocks.length === 1)                                                                // 1490
          m.sendMessage();                                                                                             // 1491
      });                                                                                                              // 1492
                                                                                                                       // 1493
      oldOutstandingMethodBlocks.shift();                                                                              // 1494
    }                                                                                                                  // 1495
                                                                                                                       // 1496
    // Now add the rest of the original blocks on.                                                                     // 1497
    _.each(oldOutstandingMethodBlocks, function (block) {                                                              // 1498
      self._outstandingMethodBlocks.push(block);                                                                       // 1499
    });                                                                                                                // 1500
  },                                                                                                                   // 1501
                                                                                                                       // 1502
  // We can accept a hot code push if there are no methods in flight.                                                  // 1503
  _readyToMigrate: function() {                                                                                        // 1504
    var self = this;                                                                                                   // 1505
    return _.isEmpty(self._methodInvokers);                                                                            // 1506
  },                                                                                                                   // 1507
                                                                                                                       // 1508
  // If we were blocking a migration, see if it's now possible to continue.                                            // 1509
  // Call whenever the set of outstanding/blocked methods shrinks.                                                     // 1510
  _maybeMigrate: function () {                                                                                         // 1511
    var self = this;                                                                                                   // 1512
    if (self._retryMigrate && self._readyToMigrate()) {                                                                // 1513
      self._retryMigrate();                                                                                            // 1514
      self._retryMigrate = null;                                                                                       // 1515
    }                                                                                                                  // 1516
  }                                                                                                                    // 1517
});                                                                                                                    // 1518
                                                                                                                       // 1519
LivedataTest.Connection = Connection;                                                                                  // 1520
                                                                                                                       // 1521
// @param url {String} URL to Meteor app,                                                                              // 1522
//     e.g.:                                                                                                           // 1523
//     "subdomain.meteor.com",                                                                                         // 1524
//     "http://subdomain.meteor.com",                                                                                  // 1525
//     "/",                                                                                                            // 1526
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                                  // 1527
//                                                                                                                     // 1528
DDP.connect = function (url, options) {                                                                                // 1529
  var ret = new Connection(url, options);                                                                              // 1530
  allConnections.push(ret); // hack. see below.                                                                        // 1531
  return ret;                                                                                                          // 1532
};                                                                                                                     // 1533
                                                                                                                       // 1534
// Hack for `spiderable` package: a way to see if the page is done                                                     // 1535
// loading all the data it needs.                                                                                      // 1536
//                                                                                                                     // 1537
allConnections = [];                                                                                                   // 1538
DDP._allSubscriptionsReady = function () {                                                                             // 1539
  return _.all(allConnections, function (conn) {                                                                       // 1540
    return _.all(conn._subscriptions, function (sub) {                                                                 // 1541
      return sub.ready;                                                                                                // 1542
    });                                                                                                                // 1543
  });                                                                                                                  // 1544
};                                                                                                                     // 1545
                                                                                                                       // 1546
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/livedata/server_convenience.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Only create a server if we are in an environment with a HTTP server                                                 // 1
// (as opposed to, eg, a command-line tool).                                                                           // 2
//                                                                                                                     // 3
if (Package.webapp) {                                                                                                  // 4
  if (process.env.DDP_DEFAULT_CONNECTION_URL) {                                                                        // 5
    __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL =                                                             // 6
      process.env.DDP_DEFAULT_CONNECTION_URL;                                                                          // 7
  }                                                                                                                    // 8
                                                                                                                       // 9
  Meteor.server = new Server;                                                                                          // 10
                                                                                                                       // 11
  Meteor.refresh = function (notification) {                                                                           // 12
    DDPServer._InvalidationCrossbar.fire(notification);                                                                // 13
  };                                                                                                                   // 14
                                                                                                                       // 15
  // Proxy the public methods of Meteor.server so they can                                                             // 16
  // be called directly on Meteor.                                                                                     // 17
  _.each(['publish', 'methods', 'call', 'apply', 'onConnection'],                                                      // 18
         function (name) {                                                                                             // 19
           Meteor[name] = _.bind(Meteor.server[name], Meteor.server);                                                  // 20
         });                                                                                                           // 21
} else {                                                                                                               // 22
  // No server? Make these empty/no-ops.                                                                               // 23
  Meteor.server = null;                                                                                                // 24
  Meteor.refresh = function (notification) {                                                                           // 25
  };                                                                                                                   // 26
}                                                                                                                      // 27
                                                                                                                       // 28
// Meteor.server used to be called Meteor.default_server. Provide                                                      // 29
// backcompat as a courtesy even though it was never documented.                                                       // 30
// XXX COMPAT WITH 0.6.4                                                                                               // 31
Meteor.default_server = Meteor.server;                                                                                 // 32
                                                                                                                       // 33
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.livedata = {
  DDP: DDP,
  DDPServer: DDPServer,
  LivedataTest: LivedataTest
};

})();
