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

/* Package-scope variables */
var HTTP, makeErrorByStatus, encodeParams, encodeString, buildUrl, populateData;

(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/http/httpcall_common.js                                                //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
makeErrorByStatus = function(statusCode, content) {                                // 1
  var MAX_LENGTH = 160; // if you change this, also change the appropriate test    // 2
                                                                                   // 3
  var truncate = function(str, length) {                                           // 4
    return str.length > length ? str.slice(0, length) + '...' : str;               // 5
  };                                                                               // 6
                                                                                   // 7
  var message = "failed [" + statusCode + "]";                                     // 8
  if (content)                                                                     // 9
    message += " " + truncate(content.replace(/\n/g, " "), MAX_LENGTH);            // 10
                                                                                   // 11
  return new Error(message);                                                       // 12
};                                                                                 // 13
                                                                                   // 14
encodeParams = function(params) {                                                  // 15
  var buf = [];                                                                    // 16
  _.each(params, function(value, key) {                                            // 17
    if (buf.length)                                                                // 18
      buf.push('&');                                                               // 19
    buf.push(encodeString(key), '=', encodeString(value));                         // 20
  });                                                                              // 21
  return buf.join('').replace(/%20/g, '+');                                        // 22
};                                                                                 // 23
                                                                                   // 24
encodeString = function(str) {                                                     // 25
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A"); // 26
};                                                                                 // 27
                                                                                   // 28
buildUrl = function(before_qmark, from_qmark, opt_query, opt_params) {             // 29
  var url_without_query = before_qmark;                                            // 30
  var query = from_qmark ? from_qmark.slice(1) : null;                             // 31
                                                                                   // 32
  if (typeof opt_query === "string")                                               // 33
    query = String(opt_query);                                                     // 34
                                                                                   // 35
  if (opt_params) {                                                                // 36
    query = query || "";                                                           // 37
    var prms = encodeParams(opt_params);                                           // 38
    if (query && prms)                                                             // 39
      query += '&';                                                                // 40
    query += prms;                                                                 // 41
  }                                                                                // 42
                                                                                   // 43
  var url = url_without_query;                                                     // 44
  if (query !== null)                                                              // 45
    url += ("?"+query);                                                            // 46
                                                                                   // 47
  return url;                                                                      // 48
};                                                                                 // 49
                                                                                   // 50
// Fill in `response.data` if the content-type is JSON.                            // 51
populateData = function(response) {                                                // 52
  // Read Content-Type header, up to a ';' if there is one.                        // 53
  // A typical header might be "application/json; charset=utf-8"                   // 54
  // or just "application/json".                                                   // 55
  var contentType = (response.headers['content-type'] || ';').split(';')[0];       // 56
                                                                                   // 57
  // Only try to parse data as JSON if server sets correct content type.           // 58
  if (_.include(['application/json', 'text/javascript'], contentType)) {           // 59
    try {                                                                          // 60
      response.data = JSON.parse(response.content);                                // 61
    } catch (err) {                                                                // 62
      response.data = null;                                                        // 63
    }                                                                              // 64
  } else {                                                                         // 65
    response.data = null;                                                          // 66
  }                                                                                // 67
};                                                                                 // 68
                                                                                   // 69
HTTP = {};                                                                         // 70
                                                                                   // 71
HTTP.get = function (/* varargs */) {                                              // 72
  return HTTP.call.apply(this, ["GET"].concat(_.toArray(arguments)));              // 73
};                                                                                 // 74
                                                                                   // 75
HTTP.post = function (/* varargs */) {                                             // 76
  return HTTP.call.apply(this, ["POST"].concat(_.toArray(arguments)));             // 77
};                                                                                 // 78
                                                                                   // 79
HTTP.put = function (/* varargs */) {                                              // 80
  return HTTP.call.apply(this, ["PUT"].concat(_.toArray(arguments)));              // 81
};                                                                                 // 82
                                                                                   // 83
HTTP.del = function (/* varargs */) {                                              // 84
  return HTTP.call.apply(this, ["DELETE"].concat(_.toArray(arguments)));           // 85
};                                                                                 // 86
                                                                                   // 87
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/http/httpcall_client.js                                                //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
HTTP.call = function(method, url, options, callback) {                             // 1
                                                                                   // 2
  ////////// Process arguments //////////                                          // 3
                                                                                   // 4
  if (! callback && typeof options === "function") {                               // 5
    // support (method, url, callback) argument list                               // 6
    callback = options;                                                            // 7
    options = null;                                                                // 8
  }                                                                                // 9
                                                                                   // 10
  options = options || {};                                                         // 11
                                                                                   // 12
  if (typeof callback !== "function")                                              // 13
    throw new Error(                                                               // 14
      "Can't make a blocking HTTP call from the client; callback required.");      // 15
                                                                                   // 16
  method = (method || "").toUpperCase();                                           // 17
                                                                                   // 18
  var headers = {};                                                                // 19
                                                                                   // 20
  var content = options.content;                                                   // 21
  if (options.data) {                                                              // 22
    content = JSON.stringify(options.data);                                        // 23
    headers['Content-Type'] = 'application/json';                                  // 24
  }                                                                                // 25
                                                                                   // 26
  var params_for_url, params_for_body;                                             // 27
  if (content || method === "GET" || method === "HEAD")                            // 28
    params_for_url = options.params;                                               // 29
  else                                                                             // 30
    params_for_body = options.params;                                              // 31
                                                                                   // 32
  var query_match = /^(.*?)(\?.*)?$/.exec(url);                                    // 33
  url = buildUrl(query_match[1], query_match[2],                                   // 34
                 options.query, params_for_url);                                   // 35
                                                                                   // 36
  if (options.followRedirects === false)                                           // 37
    throw new Error("Option followRedirects:false not supported on client.");      // 38
                                                                                   // 39
  var username, password;                                                          // 40
  if (options.auth) {                                                              // 41
    var colonLoc = options.auth.indexOf(':');                                      // 42
    if (colonLoc < 0)                                                              // 43
      throw new Error('auth option should be of the form "username:password"');    // 44
    username = options.auth.substring(0, colonLoc);                                // 45
    password = options.auth.substring(colonLoc+1);                                 // 46
  }                                                                                // 47
                                                                                   // 48
  if (params_for_body) {                                                           // 49
    content = encodeParams(params_for_body);                                       // 50
  }                                                                                // 51
                                                                                   // 52
  _.extend(headers, options.headers || {});                                        // 53
                                                                                   // 54
  ////////// Callback wrapping //////////                                          // 55
                                                                                   // 56
  // wrap callback to add a 'response' property on an error, in case               // 57
  // we have both (http 4xx/5xx error, which has a response payload)               // 58
  callback = (function(callback) {                                                 // 59
    return function(error, response) {                                             // 60
      if (error && response)                                                       // 61
        error.response = response;                                                 // 62
      callback(error, response);                                                   // 63
    };                                                                             // 64
  })(callback);                                                                    // 65
                                                                                   // 66
  // safety belt: only call the callback once.                                     // 67
  callback = _.once(callback);                                                     // 68
                                                                                   // 69
                                                                                   // 70
  ////////// Kickoff! //////////                                                   // 71
                                                                                   // 72
  // from this point on, errors are because of something remote, not               // 73
  // something we should check in advance. Turn exceptions into error              // 74
  // results.                                                                      // 75
  try {                                                                            // 76
    // setup XHR object                                                            // 77
    var xhr;                                                                       // 78
    if (typeof XMLHttpRequest !== "undefined")                                     // 79
      xhr = new XMLHttpRequest();                                                  // 80
    else if (typeof ActiveXObject !== "undefined")                                 // 81
      xhr = new ActiveXObject("Microsoft.XMLHttp"); // IE6                         // 82
    else                                                                           // 83
      throw new Error("Can't create XMLHttpRequest"); // ???                       // 84
                                                                                   // 85
    xhr.open(method, url, true, username, password);                               // 86
                                                                                   // 87
    for (var k in headers)                                                         // 88
      xhr.setRequestHeader(k, headers[k]);                                         // 89
                                                                                   // 90
                                                                                   // 91
    // setup timeout                                                               // 92
    var timed_out = false;                                                         // 93
    var timer;                                                                     // 94
    if (options.timeout) {                                                         // 95
      timer = Meteor.setTimeout(function() {                                       // 96
        timed_out = true;                                                          // 97
        xhr.abort();                                                               // 98
      }, options.timeout);                                                         // 99
    };                                                                             // 100
                                                                                   // 101
    // callback on complete                                                        // 102
    xhr.onreadystatechange = function(evt) {                                       // 103
      if (xhr.readyState === 4) { // COMPLETE                                      // 104
        if (timer)                                                                 // 105
          Meteor.clearTimeout(timer);                                              // 106
                                                                                   // 107
        if (timed_out) {                                                           // 108
          callback(new Error("timeout"));                                          // 109
        } else if (! xhr.status) {                                                 // 110
          // no HTTP response                                                      // 111
          callback(new Error("network"));                                          // 112
        } else {                                                                   // 113
                                                                                   // 114
          var response = {};                                                       // 115
          response.statusCode = xhr.status;                                        // 116
          response.content = xhr.responseText;                                     // 117
                                                                                   // 118
          response.headers = {};                                                   // 119
          var header_str = xhr.getAllResponseHeaders();                            // 120
                                                                                   // 121
          // https://github.com/meteor/meteor/issues/553                           // 122
          //                                                                       // 123
          // In Firefox there is a weird issue, sometimes                          // 124
          // getAllResponseHeaders returns the empty string, but                   // 125
          // getResponseHeader returns correct results. Possibly this              // 126
          // issue:                                                                // 127
          // https://bugzilla.mozilla.org/show_bug.cgi?id=608735                   // 128
          //                                                                       // 129
          // If this happens we can't get a full list of headers, but              // 130
          // at least get content-type so our JSON decoding happens                // 131
          // correctly. In theory, we could try and rescue more header             // 132
          // values with a list of common headers, but content-type is             // 133
          // the only vital one for now.                                           // 134
          if ("" === header_str && xhr.getResponseHeader("content-type"))          // 135
            header_str =                                                           // 136
            "content-type: " + xhr.getResponseHeader("content-type");              // 137
                                                                                   // 138
          var headers_raw = header_str.split(/\r?\n/);                             // 139
          _.each(headers_raw, function (h) {                                       // 140
            var m = /^(.*?):(?:\s+)(.*)$/.exec(h);                                 // 141
            if (m && m.length === 3)                                               // 142
              response.headers[m[1].toLowerCase()] = m[2];                         // 143
          });                                                                      // 144
                                                                                   // 145
          populateData(response);                                                  // 146
                                                                                   // 147
          var error = null;                                                        // 148
          if (response.statusCode >= 400)                                          // 149
            error = makeErrorByStatus(response.statusCode, response.content);      // 150
                                                                                   // 151
          callback(error, response);                                               // 152
        }                                                                          // 153
      }                                                                            // 154
    };                                                                             // 155
                                                                                   // 156
    // send it on its way                                                          // 157
    xhr.send(content);                                                             // 158
                                                                                   // 159
  } catch (err) {                                                                  // 160
    callback(err);                                                                 // 161
  }                                                                                // 162
                                                                                   // 163
};                                                                                 // 164
                                                                                   // 165
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/http/deprecated.js                                                     //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
// The HTTP object used to be called Meteor.http.                                  // 1
// XXX COMPAT WITH 0.6.4                                                           // 2
Meteor.http = HTTP;                                                                // 3
                                                                                   // 4
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.http = {
  HTTP: HTTP
};

})();

//# sourceMappingURL=4aec4250e79a92408f1c5e234a52434907239586.map
