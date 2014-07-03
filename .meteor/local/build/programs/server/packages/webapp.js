(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var HTML = Package.htmljs.HTML;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package['spacebars-common'].Spacebars;
var HTMLTools = Package['html-tools'].HTMLTools;

/* Package-scope variables */
var WebApp, main, WebAppInternals;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/webapp/webapp_server.js                                                      //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
////////// Requires //////////                                                           // 1
                                                                                         // 2
var fs = Npm.require("fs");                                                              // 3
var http = Npm.require("http");                                                          // 4
var os = Npm.require("os");                                                              // 5
var path = Npm.require("path");                                                          // 6
var url = Npm.require("url");                                                            // 7
var crypto = Npm.require("crypto");                                                      // 8
                                                                                         // 9
var connect = Npm.require('connect');                                                    // 10
var useragent = Npm.require('useragent');                                                // 11
var send = Npm.require('send');                                                          // 12
                                                                                         // 13
var SHORT_SOCKET_TIMEOUT = 5*1000;                                                       // 14
var LONG_SOCKET_TIMEOUT = 120*1000;                                                      // 15
                                                                                         // 16
WebApp = {};                                                                             // 17
WebAppInternals = {};                                                                    // 18
                                                                                         // 19
var bundledJsCssPrefix;                                                                  // 20
                                                                                         // 21
// The reload safetybelt is some js that will be loaded after everything else in         // 22
// the HTML.  In some multi-server deployments, when you update, you have a              // 23
// chance of hitting an old server for the HTML and the new server for the JS or         // 24
// CSS.  This prevents you from displaying the page in that case, and instead            // 25
// reloads it, presumably all on the new version now.                                    // 26
var RELOAD_SAFETYBELT = "\n" +                                                           // 27
      "if (typeof Package === 'undefined' ||\n" +                                        // 28
      "    ! Package.webapp ||\n" +                                                      // 29
      "    ! Package.webapp.WebApp ||\n" +                                               // 30
      "    ! Package.webapp.WebApp._isCssLoaded())\n" +                                  // 31
      "  document.location.reload(); \n";                                                // 32
                                                                                         // 33
// Keepalives so that when the outer server dies unceremoniously and                     // 34
// doesn't kill us, we quit ourselves. A little gross, but better than                   // 35
// pidfiles.                                                                             // 36
// XXX This should really be part of the boot script, not the webapp package.            // 37
//     Or we should just get rid of it, and rely on containerization.                    // 38
                                                                                         // 39
var initKeepalive = function () {                                                        // 40
  var keepaliveCount = 0;                                                                // 41
                                                                                         // 42
  process.stdin.on('data', function (data) {                                             // 43
    keepaliveCount = 0;                                                                  // 44
  });                                                                                    // 45
                                                                                         // 46
  process.stdin.resume();                                                                // 47
                                                                                         // 48
  setInterval(function () {                                                              // 49
    keepaliveCount ++;                                                                   // 50
    if (keepaliveCount >= 3) {                                                           // 51
      console.log("Failed to receive keepalive! Exiting.");                              // 52
      process.exit(1);                                                                   // 53
    }                                                                                    // 54
  }, 3000);                                                                              // 55
};                                                                                       // 56
                                                                                         // 57
                                                                                         // 58
var sha1 = function (contents) {                                                         // 59
  var hash = crypto.createHash('sha1');                                                  // 60
  hash.update(contents);                                                                 // 61
  return hash.digest('hex');                                                             // 62
};                                                                                       // 63
                                                                                         // 64
// #BrowserIdentification                                                                // 65
//                                                                                       // 66
// We have multiple places that want to identify the browser: the                        // 67
// unsupported browser page, the appcache package, and, eventually                       // 68
// delivering browser polyfills only as needed.                                          // 69
//                                                                                       // 70
// To avoid detecting the browser in multiple places ad-hoc, we create a                 // 71
// Meteor "browser" object. It uses but does not expose the npm                          // 72
// useragent module (we could choose a different mechanism to identify                   // 73
// the browser in the future if we wanted to).  The browser object                       // 74
// contains                                                                              // 75
//                                                                                       // 76
// * `name`: the name of the browser in camel case                                       // 77
// * `major`, `minor`, `patch`: integers describing the browser version                  // 78
//                                                                                       // 79
// Also here is an early version of a Meteor `request` object, intended                  // 80
// to be a high-level description of the request without exposing                        // 81
// details of connect's low-level `req`.  Currently it contains:                         // 82
//                                                                                       // 83
// * `browser`: browser identification object described above                            // 84
// * `url`: parsed url, including parsed query params                                    // 85
//                                                                                       // 86
// As a temporary hack there is a `categorizeRequest` function on WebApp which           // 87
// converts a connect `req` to a Meteor `request`. This can go away once smart           // 88
// packages such as appcache are being passed a `request` object directly when           // 89
// they serve content.                                                                   // 90
//                                                                                       // 91
// This allows `request` to be used uniformly: it is passed to the html                  // 92
// attributes hook, and the appcache package can use it when deciding                    // 93
// whether to generate a 404 for the manifest.                                           // 94
//                                                                                       // 95
// Real routing / server side rendering will probably refactor this                      // 96
// heavily.                                                                              // 97
                                                                                         // 98
                                                                                         // 99
// e.g. "Mobile Safari" => "mobileSafari"                                                // 100
var camelCase = function (name) {                                                        // 101
  var parts = name.split(' ');                                                           // 102
  parts[0] = parts[0].toLowerCase();                                                     // 103
  for (var i = 1;  i < parts.length;  ++i) {                                             // 104
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);                    // 105
  }                                                                                      // 106
  return parts.join('');                                                                 // 107
};                                                                                       // 108
                                                                                         // 109
var identifyBrowser = function (userAgentString) {                                       // 110
  var userAgent = useragent.lookup(userAgentString);                                     // 111
  return {                                                                               // 112
    name: camelCase(userAgent.family),                                                   // 113
    major: +userAgent.major,                                                             // 114
    minor: +userAgent.minor,                                                             // 115
    patch: +userAgent.patch                                                              // 116
  };                                                                                     // 117
};                                                                                       // 118
                                                                                         // 119
// XXX Refactor as part of implementing real routing.                                    // 120
WebAppInternals.identifyBrowser = identifyBrowser;                                       // 121
                                                                                         // 122
WebApp.categorizeRequest = function (req) {                                              // 123
  return {                                                                               // 124
    browser: identifyBrowser(req.headers['user-agent']),                                 // 125
    url: url.parse(req.url, true)                                                        // 126
  };                                                                                     // 127
};                                                                                       // 128
                                                                                         // 129
// HTML attribute hooks: functions to be called to determine any attributes to           // 130
// be added to the '<html>' tag. Each function is passed a 'request' object (see         // 131
// #BrowserIdentification) and should return a string,                                   // 132
var htmlAttributeHooks = [];                                                             // 133
var getHtmlAttributes = function (request) {                                             // 134
  var combinedAttributes  = {};                                                          // 135
  _.each(htmlAttributeHooks || [], function (hook) {                                     // 136
    var attributes = hook(request);                                                      // 137
    if (attributes === null)                                                             // 138
      return;                                                                            // 139
    if (typeof attributes !== 'object')                                                  // 140
      throw Error("HTML attribute hook must return null or object");                     // 141
    _.extend(combinedAttributes, attributes);                                            // 142
  });                                                                                    // 143
  return combinedAttributes;                                                             // 144
};                                                                                       // 145
WebApp.addHtmlAttributeHook = function (hook) {                                          // 146
  htmlAttributeHooks.push(hook);                                                         // 147
};                                                                                       // 148
                                                                                         // 149
// Serve app HTML for this URL?                                                          // 150
var appUrl = function (url) {                                                            // 151
  if (url === '/favicon.ico' || url === '/robots.txt')                                   // 152
    return false;                                                                        // 153
                                                                                         // 154
  // NOTE: app.manifest is not a web standard like favicon.ico and                       // 155
  // robots.txt. It is a file name we have chosen to use for HTML5                       // 156
  // appcache URLs. It is included here to prevent using an appcache                     // 157
  // then removing it from poisoning an app permanently. Eventually,                     // 158
  // once we have server side routing, this won't be needed as                           // 159
  // unknown URLs with return a 404 automatically.                                       // 160
  if (url === '/app.manifest')                                                           // 161
    return false;                                                                        // 162
                                                                                         // 163
  // Avoid serving app HTML for declared routes such as /sockjs/.                        // 164
  if (RoutePolicy.classify(url))                                                         // 165
    return false;                                                                        // 166
                                                                                         // 167
  // we currently return app HTML on all URLs by default                                 // 168
  return true;                                                                           // 169
};                                                                                       // 170
                                                                                         // 171
                                                                                         // 172
// Calculate a hash of all the client resources downloaded by the                        // 173
// browser, including the application HTML, runtime config, code, and                    // 174
// static files.                                                                         // 175
//                                                                                       // 176
// This hash *must* change if any resources seen by the browser                          // 177
// change, and ideally *doesn't* change for any server-only changes                      // 178
// (but the second is a performance enhancement, not a hard                              // 179
// requirement).                                                                         // 180
                                                                                         // 181
var calculateClientHash = function () {                                                  // 182
  var hash = crypto.createHash('sha1');                                                  // 183
  hash.update(JSON.stringify(__meteor_runtime_config__), 'utf8');                        // 184
  _.each(WebApp.clientProgram.manifest, function (resource) {                            // 185
    if (resource.where === 'client' || resource.where === 'internal') {                  // 186
      hash.update(resource.path);                                                        // 187
      hash.update(resource.hash);                                                        // 188
    }                                                                                    // 189
  });                                                                                    // 190
  return hash.digest('hex');                                                             // 191
};                                                                                       // 192
                                                                                         // 193
                                                                                         // 194
// We need to calculate the client hash after all packages have loaded                   // 195
// to give them a chance to populate __meteor_runtime_config__.                          // 196
//                                                                                       // 197
// Calculating the hash during startup means that packages can only                      // 198
// populate __meteor_runtime_config__ during load, not during startup.                   // 199
//                                                                                       // 200
// Calculating instead it at the beginning of main after all startup                     // 201
// hooks had run would allow packages to also populate                                   // 202
// __meteor_runtime_config__ during startup, but that's too late for                     // 203
// autoupdate because it needs to have the client hash at startup to                     // 204
// insert the auto update version itself into                                            // 205
// __meteor_runtime_config__ to get it to the client.                                    // 206
//                                                                                       // 207
// An alternative would be to give autoupdate a "post-start,                             // 208
// pre-listen" hook to allow it to insert the auto update version at                     // 209
// the right moment.                                                                     // 210
                                                                                         // 211
Meteor.startup(function () {                                                             // 212
  WebApp.clientHash = calculateClientHash();                                             // 213
});                                                                                      // 214
                                                                                         // 215
                                                                                         // 216
                                                                                         // 217
// When we have a request pending, we want the socket timeout to be long, to             // 218
// give ourselves a while to serve it, and to allow sockjs long polls to                 // 219
// complete.  On the other hand, we want to close idle sockets relatively                // 220
// quickly, so that we can shut down relatively promptly but cleanly, without            // 221
// cutting off anyone's response.                                                        // 222
WebApp._timeoutAdjustmentRequestCallback = function (req, res) {                         // 223
  // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);                     // 224
  req.setTimeout(LONG_SOCKET_TIMEOUT);                                                   // 225
  // Insert our new finish listener to run BEFORE the existing one which removes         // 226
  // the response from the socket.                                                       // 227
  var finishListeners = res.listeners('finish');                                         // 228
  // XXX Apparently in Node 0.12 this event is now called 'prefinish'.                   // 229
  // https://github.com/joyent/node/commit/7c9b6070                                      // 230
  res.removeAllListeners('finish');                                                      // 231
  res.on('finish', function () {                                                         // 232
    res.setTimeout(SHORT_SOCKET_TIMEOUT);                                                // 233
  });                                                                                    // 234
  _.each(finishListeners, function (l) { res.on('finish', l); });                        // 235
};                                                                                       // 236
                                                                                         // 237
var runWebAppServer = function () {                                                      // 238
  var shuttingDown = false;                                                              // 239
  // read the control for the client we'll be serving up                                 // 240
  var clientJsonPath = path.join(__meteor_bootstrap__.serverDir,                         // 241
                                 __meteor_bootstrap__.configJson.client);                // 242
  var clientDir = path.dirname(clientJsonPath);                                          // 243
  var clientJson = JSON.parse(fs.readFileSync(clientJsonPath, 'utf8'));                  // 244
                                                                                         // 245
  if (clientJson.format !== "browser-program-pre1")                                      // 246
    throw new Error("Unsupported format for client assets: " +                           // 247
                    JSON.stringify(clientJson.format));                                  // 248
                                                                                         // 249
  // webserver                                                                           // 250
  var app = connect();                                                                   // 251
                                                                                         // 252
  // Auto-compress any json, javascript, or text.                                        // 253
  app.use(connect.compress());                                                           // 254
                                                                                         // 255
  // Packages and apps can add handlers that run before any other Meteor                 // 256
  // handlers via WebApp.rawConnectHandlers.                                             // 257
  var rawConnectHandlers = connect();                                                    // 258
  app.use(rawConnectHandlers);                                                           // 259
                                                                                         // 260
  // Strip off the path prefix, if it exists.                                            // 261
  app.use(function (request, response, next) {                                           // 262
    var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;                     // 263
    var url = Npm.require('url').parse(request.url);                                     // 264
    var pathname = url.pathname;                                                         // 265
    // check if the path in the url starts with the path prefix (and the part            // 266
    // after the path prefix must start with a / if it exists.)                          // 267
    if (pathPrefix && pathname.substring(0, pathPrefix.length) === pathPrefix &&         // 268
       (pathname.length == pathPrefix.length                                             // 269
        || pathname.substring(pathPrefix.length, pathPrefix.length + 1) === "/")) {      // 270
      request.url = request.url.substring(pathPrefix.length);                            // 271
      next();                                                                            // 272
    } else if (pathname === "/favicon.ico" || pathname === "/robots.txt") {              // 273
      next();                                                                            // 274
    } else if (pathPrefix) {                                                             // 275
      response.writeHead(404);                                                           // 276
      response.write("Unknown path");                                                    // 277
      response.end();                                                                    // 278
    } else {                                                                             // 279
      next();                                                                            // 280
    }                                                                                    // 281
  });                                                                                    // 282
                                                                                         // 283
  // Parse the query string into res.query. Used by oauth_server, but it's               // 284
  // generally pretty handy..                                                            // 285
  app.use(connect.query());                                                              // 286
                                                                                         // 287
  var getItemPathname = function (itemUrl) {                                             // 288
    return decodeURIComponent(url.parse(itemUrl).pathname);                              // 289
  };                                                                                     // 290
                                                                                         // 291
  var staticFiles = {};                                                                  // 292
  _.each(clientJson.manifest, function (item) {                                          // 293
    if (item.url && item.where === "client") {                                           // 294
      staticFiles[getItemPathname(item.url)] = {                                         // 295
        path: item.path,                                                                 // 296
        cacheable: item.cacheable,                                                       // 297
        // Link from source to its map                                                   // 298
        sourceMapUrl: item.sourceMapUrl,                                                 // 299
        type: item.type                                                                  // 300
      };                                                                                 // 301
                                                                                         // 302
      if (item.sourceMap) {                                                              // 303
        // Serve the source map too, under the specified URL. We assume all              // 304
        // source maps are cacheable.                                                    // 305
        staticFiles[getItemPathname(item.sourceMapUrl)] = {                              // 306
          path: item.sourceMap,                                                          // 307
          cacheable: true                                                                // 308
        };                                                                               // 309
      }                                                                                  // 310
    }                                                                                    // 311
  });                                                                                    // 312
                                                                                         // 313
  // Exported for tests.                                                                 // 314
  WebAppInternals.staticFiles = staticFiles;                                             // 315
                                                                                         // 316
                                                                                         // 317
  // Serve static files from the manifest.                                               // 318
  // This is inspired by the 'static' middleware.                                        // 319
  app.use(function (req, res, next) {                                                    // 320
    if ('GET' != req.method && 'HEAD' != req.method) {                                   // 321
      next();                                                                            // 322
      return;                                                                            // 323
    }                                                                                    // 324
    var pathname = connect.utils.parseUrl(req).pathname;                                 // 325
                                                                                         // 326
    try {                                                                                // 327
      pathname = decodeURIComponent(pathname);                                           // 328
    } catch (e) {                                                                        // 329
      next();                                                                            // 330
      return;                                                                            // 331
    }                                                                                    // 332
                                                                                         // 333
    var serveStaticJs = function (s) {                                                   // 334
      res.writeHead(200, {                                                               // 335
        'Content-type': 'application/javascript; charset=UTF-8'                          // 336
      });                                                                                // 337
      res.write(s);                                                                      // 338
      res.end();                                                                         // 339
    };                                                                                   // 340
                                                                                         // 341
    if (pathname === "/meteor_runtime_config.js" &&                                      // 342
        ! WebAppInternals.inlineScriptsAllowed()) {                                      // 343
      serveStaticJs("__meteor_runtime_config__ = " +                                     // 344
                    JSON.stringify(__meteor_runtime_config__) + ";");                    // 345
      return;                                                                            // 346
    } else if (pathname === "/meteor_reload_safetybelt.js" &&                            // 347
               ! WebAppInternals.inlineScriptsAllowed()) {                               // 348
      serveStaticJs(RELOAD_SAFETYBELT);                                                  // 349
      return;                                                                            // 350
    }                                                                                    // 351
                                                                                         // 352
    if (!_.has(staticFiles, pathname)) {                                                 // 353
      next();                                                                            // 354
      return;                                                                            // 355
    }                                                                                    // 356
                                                                                         // 357
    // We don't need to call pause because, unlike 'static', once we call into           // 358
    // 'send' and yield to the event loop, we never call another handler with            // 359
    // 'next'.                                                                           // 360
                                                                                         // 361
    var info = staticFiles[pathname];                                                    // 362
                                                                                         // 363
    // Cacheable files are files that should never change. Typically                     // 364
    // named by their hash (eg meteor bundled js and css files).                         // 365
    // We cache them ~forever (1yr).                                                     // 366
    //                                                                                   // 367
    // We cache non-cacheable files anyway. This isn't really correct, as users          // 368
    // can change the files and changes won't propagate immediately. However, if         // 369
    // we don't cache them, browsers will 'flicker' when rerendering                     // 370
    // images. Eventually we will probably want to rewrite URLs of static assets         // 371
    // to include a query parameter to bust caches. That way we can both get             // 372
    // good caching behavior and allow users to change assets without delay.             // 373
    // https://github.com/meteor/meteor/issues/773                                       // 374
    var maxAge = info.cacheable                                                          // 375
          ? 1000 * 60 * 60 * 24 * 365                                                    // 376
          : 1000 * 60 * 60 * 24;                                                         // 377
                                                                                         // 378
    // Set the X-SourceMap header, which current Chrome understands.                     // 379
    // (The files also contain '//#' comments which FF 24 understands and                // 380
    // Chrome doesn't understand yet.)                                                   // 381
    //                                                                                   // 382
    // Eventually we should set the SourceMap header but the current version of          // 383
    // Chrome and no version of FF supports it.                                          // 384
    //                                                                                   // 385
    // To figure out if your version of Chrome should support the SourceMap              // 386
    // header,                                                                           // 387
    //   - go to chrome://version. Let's say the Chrome version is                       // 388
    //      28.0.1500.71 and the Blink version is 537.36 (@153022)                       // 389
    //   - go to http://src.chromium.org/viewvc/blink/branches/chromium/1500/Source/core/inspector/InspectorPageAgent.cpp?view=log
    //     where the "1500" is the third part of your Chrome version                     // 391
    //   - find the first revision that is no greater than the "153022"                  // 392
    //     number.  That's probably the first one and it probably has                    // 393
    //     a message of the form "Branch 1500 - blink@r149738"                           // 394
    //   - If *that* revision number (149738) is at least 151755,                        // 395
    //     then Chrome should support SourceMap (not just X-SourceMap)                   // 396
    // (The change is https://codereview.chromium.org/15832007)                          // 397
    //                                                                                   // 398
    // You also need to enable source maps in Chrome: open dev tools, click              // 399
    // the gear in the bottom right corner, and select "enable source maps".             // 400
    //                                                                                   // 401
    // Firefox 23+ supports source maps but doesn't support either header yet,           // 402
    // so we include the '//#' comment for it:                                           // 403
    //   https://bugzilla.mozilla.org/show_bug.cgi?id=765993                             // 404
    // In FF 23 you need to turn on `devtools.debugger.source-maps-enabled`              // 405
    // in `about:config` (it is on by default in FF 24).                                 // 406
    if (info.sourceMapUrl)                                                               // 407
      res.setHeader('X-SourceMap', info.sourceMapUrl);                                   // 408
                                                                                         // 409
    if (info.type === "js") {                                                            // 410
      res.setHeader("Content-Type", "application/javascript; charset=UTF-8");            // 411
    } else if (info.type === "css") {                                                    // 412
      res.setHeader("Content-Type", "text/css; charset=UTF-8");                          // 413
    }                                                                                    // 414
                                                                                         // 415
    send(req, path.join(clientDir, info.path))                                           // 416
      .maxage(maxAge)                                                                    // 417
      .hidden(true)  // if we specified a dotfile in the manifest, serve it              // 418
      .on('error', function (err) {                                                      // 419
        Log.error("Error serving static file " + err);                                   // 420
        res.writeHead(500);                                                              // 421
        res.end();                                                                       // 422
      })                                                                                 // 423
      .on('directory', function () {                                                     // 424
        Log.error("Unexpected directory " + info.path);                                  // 425
        res.writeHead(500);                                                              // 426
        res.end();                                                                       // 427
      })                                                                                 // 428
      .pipe(res);                                                                        // 429
  });                                                                                    // 430
                                                                                         // 431
  // Packages and apps can add handlers to this via WebApp.connectHandlers.              // 432
  // They are inserted before our default handler.                                       // 433
  var packageAndAppHandlers = connect();                                                 // 434
  app.use(packageAndAppHandlers);                                                        // 435
                                                                                         // 436
  var suppressConnectErrors = false;                                                     // 437
  // connect knows it is an error handler because it has 4 arguments instead of          // 438
  // 3. go figure.  (It is not smart enough to find such a thing if it's hidden          // 439
  // inside packageAndAppHandlers.)                                                      // 440
  app.use(function (err, req, res, next) {                                               // 441
    if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {            // 442
      next(err);                                                                         // 443
      return;                                                                            // 444
    }                                                                                    // 445
    res.writeHead(err.status, { 'Content-Type': 'text/plain' });                         // 446
    res.end("An error message");                                                         // 447
  });                                                                                    // 448
                                                                                         // 449
  // Will be updated by main before we listen.                                           // 450
  var boilerplateTemplate = null;                                                        // 451
  var boilerplateBaseData = null;                                                        // 452
  var boilerplateByAttributes = {};                                                      // 453
  app.use(function (req, res, next) {                                                    // 454
    if (! appUrl(req.url))                                                               // 455
      return next();                                                                     // 456
                                                                                         // 457
    if (!boilerplateTemplate)                                                            // 458
      throw new Error("boilerplateTemplate should be set before listening!");            // 459
    if (!boilerplateBaseData)                                                            // 460
      throw new Error("boilerplateBaseData should be set before listening!");            // 461
                                                                                         // 462
                                                                                         // 463
    var headers = {                                                                      // 464
      'Content-Type':  'text/html; charset=utf-8'                                        // 465
    };                                                                                   // 466
    if (shuttingDown)                                                                    // 467
      headers['Connection'] = 'Close';                                                   // 468
                                                                                         // 469
    var request = WebApp.categorizeRequest(req);                                         // 470
                                                                                         // 471
    if (request.url.query && request.url.query['meteor_css_resource']) {                 // 472
      // In this case, we're requesting a CSS resource in the meteor-specific            // 473
      // way, but we don't have it.  Serve a static css file that indicates that         // 474
      // we didn't have it, so we can detect that and refresh.                           // 475
      headers['Content-Type'] = 'text/css; charset=utf-8';                               // 476
      res.writeHead(200, headers);                                                       // 477
      res.write(".meteor-css-not-found-error { width: 0px;}");                           // 478
      res.end();                                                                         // 479
      return undefined;                                                                  // 480
    }                                                                                    // 481
                                                                                         // 482
    var htmlAttributes = getHtmlAttributes(request);                                     // 483
                                                                                         // 484
    // The only thing that changes from request to request (for now) are the             // 485
    // HTML attributes (used by, eg, appcache), so we can memoize based on that.         // 486
    var attributeKey = JSON.stringify(htmlAttributes);                                   // 487
    if (!_.has(boilerplateByAttributes, attributeKey)) {                                 // 488
      try {                                                                              // 489
        var boilerplateData = _.extend({htmlAttributes: htmlAttributes},                 // 490
                                       boilerplateBaseData);                             // 491
        var boilerplateInstance = boilerplateTemplate.extend({                           // 492
          data: boilerplateData                                                          // 493
        });                                                                              // 494
        var boilerplateHtmlJs = boilerplateInstance.render();                            // 495
        boilerplateByAttributes[attributeKey] = "<!DOCTYPE html>\n" +                    // 496
              HTML.toHTML(boilerplateHtmlJs, boilerplateInstance);                       // 497
      } catch (e) {                                                                      // 498
        Log.error("Error running template: " + e);                                       // 499
        res.writeHead(500, headers);                                                     // 500
        res.end();                                                                       // 501
        return undefined;                                                                // 502
      }                                                                                  // 503
    }                                                                                    // 504
                                                                                         // 505
    res.writeHead(200, headers);                                                         // 506
    res.write(boilerplateByAttributes[attributeKey]);                                    // 507
    res.end();                                                                           // 508
    return undefined;                                                                    // 509
  });                                                                                    // 510
                                                                                         // 511
  // Return 404 by default, if no other handlers serve this URL.                         // 512
  app.use(function (req, res) {                                                          // 513
    res.writeHead(404);                                                                  // 514
    res.end();                                                                           // 515
  });                                                                                    // 516
                                                                                         // 517
                                                                                         // 518
  var httpServer = http.createServer(app);                                               // 519
  var onListeningCallbacks = [];                                                         // 520
                                                                                         // 521
  // After 5 seconds w/o data on a socket, kill it.  On the other hand, if               // 522
  // there's an outstanding request, give it a higher timeout instead (to avoid          // 523
  // killing long-polling requests)                                                      // 524
  httpServer.setTimeout(SHORT_SOCKET_TIMEOUT);                                           // 525
                                                                                         // 526
  // Do this here, and then also in livedata/stream_server.js, because                   // 527
  // stream_server.js kills all the current request handlers when installing its         // 528
  // own.                                                                                // 529
  httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback);                    // 530
                                                                                         // 531
                                                                                         // 532
  // For now, handle SIGHUP here.  Later, this should be in some centralized             // 533
  // Meteor shutdown code.                                                               // 534
  process.on('SIGHUP', Meteor.bindEnvironment(function () {                              // 535
    shuttingDown = true;                                                                 // 536
    // tell others with websockets open that we plan to close this.                      // 537
    // XXX: Eventually, this should be done with a standard meteor shut-down             // 538
    // logic path.                                                                       // 539
    httpServer.emit('meteor-closing');                                                   // 540
                                                                                         // 541
    httpServer.close(Meteor.bindEnvironment(function () {                                // 542
      if (proxy) {                                                                       // 543
        try {                                                                            // 544
          proxy.call('removeBindingsForJob', process.env.GALAXY_JOB);                    // 545
        } catch (e) {                                                                    // 546
          Log.error("Error removing bindings: " + e.message);                            // 547
          process.exit(1);                                                               // 548
        }                                                                                // 549
      }                                                                                  // 550
      process.exit(0);                                                                   // 551
                                                                                         // 552
    }, "On http server close failed"));                                                  // 553
                                                                                         // 554
    // Ideally we will close before this hits.                                           // 555
    Meteor.setTimeout(function () {                                                      // 556
      Log.warn("Closed by SIGHUP but one or more HTTP requests may not have finished."); // 557
      process.exit(1);                                                                   // 558
    }, 5000);                                                                            // 559
                                                                                         // 560
  }, function (err) {                                                                    // 561
    console.log(err);                                                                    // 562
    process.exit(1);                                                                     // 563
  }));                                                                                   // 564
                                                                                         // 565
  // start up app                                                                        // 566
  _.extend(WebApp, {                                                                     // 567
    connectHandlers: packageAndAppHandlers,                                              // 568
    rawConnectHandlers: rawConnectHandlers,                                              // 569
    httpServer: httpServer,                                                              // 570
    // metadata about the client program that we serve                                   // 571
    clientProgram: {                                                                     // 572
      manifest: clientJson.manifest                                                      // 573
      // XXX do we need a "root: clientDir" field here? it used to be here but           // 574
      // was unused.                                                                     // 575
    },                                                                                   // 576
    // For testing.                                                                      // 577
    suppressConnectErrors: function () {                                                 // 578
      suppressConnectErrors = true;                                                      // 579
    },                                                                                   // 580
    onListening: function (f) {                                                          // 581
      if (onListeningCallbacks)                                                          // 582
        onListeningCallbacks.push(f);                                                    // 583
      else                                                                               // 584
        f();                                                                             // 585
    },                                                                                   // 586
    // Hack: allow http tests to call connect.basicAuth without making them              // 587
    // Npm.depends on another copy of connect. (That would be fine if we could           // 588
    // have test-only NPM dependencies but is overkill here.)                            // 589
    __basicAuth__: connect.basicAuth                                                     // 590
  });                                                                                    // 591
                                                                                         // 592
  // Let the rest of the packages (and Meteor.startup hooks) insert connect              // 593
  // middlewares and update __meteor_runtime_config__, then keep going to set up         // 594
  // actually serving HTML.                                                              // 595
  main = function (argv) {                                                               // 596
    // main happens post startup hooks, so we don't need a Meteor.startup() to           // 597
    // ensure this happens after the galaxy package is loaded.                           // 598
    var AppConfig = Package["application-configuration"].AppConfig;                      // 599
    // We used to use the optimist npm package to parse argv here, but it's              // 600
    // overkill (and no longer in the dev bundle). Just assume any instance of           // 601
    // '--keepalive' is a use of the option.                                             // 602
    var expectKeepalives = _.contains(argv, '--keepalive');                              // 603
                                                                                         // 604
    boilerplateBaseData = {                                                              // 605
      css: [],                                                                           // 606
      js: [],                                                                            // 607
      head: '',                                                                          // 608
      body: '',                                                                          // 609
      inlineScriptsAllowed: WebAppInternals.inlineScriptsAllowed(),                      // 610
      meteorRuntimeConfig: JSON.stringify(__meteor_runtime_config__),                    // 611
      reloadSafetyBelt: RELOAD_SAFETYBELT,                                               // 612
      rootUrlPathPrefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',           // 613
      bundledJsCssPrefix: bundledJsCssPrefix ||                                          // 614
        __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || ''                             // 615
    };                                                                                   // 616
                                                                                         // 617
    _.each(WebApp.clientProgram.manifest, function (item) {                              // 618
      if (item.type === 'css' && item.where === 'client') {                              // 619
        boilerplateBaseData.css.push({url: item.url});                                   // 620
      }                                                                                  // 621
      if (item.type === 'js' && item.where === 'client') {                               // 622
        boilerplateBaseData.js.push({url: item.url});                                    // 623
      }                                                                                  // 624
      if (item.type === 'head') {                                                        // 625
        boilerplateBaseData.head = fs.readFileSync(                                      // 626
          path.join(clientDir, item.path), 'utf8');                                      // 627
      }                                                                                  // 628
      if (item.type === 'body') {                                                        // 629
        boilerplateBaseData.body = fs.readFileSync(                                      // 630
          path.join(clientDir, item.path), 'utf8');                                      // 631
      }                                                                                  // 632
    });                                                                                  // 633
                                                                                         // 634
    var boilerplateTemplateSource = Assets.getText("boilerplate.html");                  // 635
    var boilerplateRenderCode = Spacebars.compile(                                       // 636
      boilerplateTemplateSource, { isBody: true });                                      // 637
                                                                                         // 638
    // Note that we are actually depending on eval's local environment capture           // 639
    // so that UI and HTML are visible to the eval'd code.                               // 640
    var boilerplateRender = eval(boilerplateRenderCode);                                 // 641
                                                                                         // 642
    boilerplateTemplate = UI.Component.extend({                                          // 643
      kind: "MainPage",                                                                  // 644
      render: boilerplateRender                                                          // 645
    });                                                                                  // 646
                                                                                         // 647
    // only start listening after all the startup code has run.                          // 648
    var localPort = parseInt(process.env.PORT) || 0;                                     // 649
    var host = process.env.BIND_IP;                                                      // 650
    var localIp = host || '0.0.0.0';                                                     // 651
    httpServer.listen(localPort, localIp, Meteor.bindEnvironment(function() {            // 652
      if (expectKeepalives)                                                              // 653
        console.log("LISTENING"); // must match run-app.js                               // 654
      var proxyBinding;                                                                  // 655
                                                                                         // 656
      AppConfig.configurePackage('webapp', function (configuration) {                    // 657
        if (proxyBinding)                                                                // 658
          proxyBinding.stop();                                                           // 659
        if (configuration && configuration.proxy) {                                      // 660
          // TODO: We got rid of the place where this checks the app's                   // 661
          // configuration, because this wants to be configured for some things          // 662
          // on a per-job basis.  Discuss w/ teammates.                                  // 663
          proxyBinding = AppConfig.configureService(                                     // 664
            "proxy",                                                                     // 665
            "pre0",                                                                      // 666
            function (proxyService) {                                                    // 667
              if (proxyService && ! _.isEmpty(proxyService)) {                           // 668
                var proxyConf;                                                           // 669
                // XXX Figure out a per-job way to specify bind location                 // 670
                // (besides hardcoding the location for ADMIN_APP jobs).                 // 671
                if (process.env.ADMIN_APP) {                                             // 672
                  var bindPathPrefix = "";                                               // 673
                  if (process.env.GALAXY_APP !== "panel") {                              // 674
                    bindPathPrefix = "/" + bindPathPrefix +                              // 675
                      encodeURIComponent(                                                // 676
                        process.env.GALAXY_APP                                           // 677
                      ).replace(/\./g, '_');                                             // 678
                  }                                                                      // 679
                  proxyConf = {                                                          // 680
                    bindHost: process.env.GALAXY_NAME,                                   // 681
                    bindPathPrefix: bindPathPrefix,                                      // 682
                    requiresAuth: true                                                   // 683
                  };                                                                     // 684
                } else {                                                                 // 685
                  proxyConf = configuration.proxy;                                       // 686
                }                                                                        // 687
                Log("Attempting to bind to proxy at " +                                  // 688
                    proxyService);                                                       // 689
                WebAppInternals.bindToProxy(_.extend({                                   // 690
                  proxyEndpoint: proxyService                                            // 691
                }, proxyConf));                                                          // 692
              }                                                                          // 693
            }                                                                            // 694
          );                                                                             // 695
        }                                                                                // 696
      });                                                                                // 697
                                                                                         // 698
      var callbacks = onListeningCallbacks;                                              // 699
      onListeningCallbacks = null;                                                       // 700
      _.each(callbacks, function (x) { x(); });                                          // 701
                                                                                         // 702
    }, function (e) {                                                                    // 703
      console.error("Error listening:", e);                                              // 704
      console.error(e && e.stack);                                                       // 705
    }));                                                                                 // 706
                                                                                         // 707
    if (expectKeepalives)                                                                // 708
      initKeepalive();                                                                   // 709
    return 'DAEMON';                                                                     // 710
  };                                                                                     // 711
};                                                                                       // 712
                                                                                         // 713
                                                                                         // 714
var proxy;                                                                               // 715
WebAppInternals.bindToProxy = function (proxyConfig) {                                   // 716
  var securePort = proxyConfig.securePort || 4433;                                       // 717
  var insecurePort = proxyConfig.insecurePort || 8080;                                   // 718
  var bindPathPrefix = proxyConfig.bindPathPrefix || "";                                 // 719
  // XXX also support galaxy-based lookup                                                // 720
  if (!proxyConfig.proxyEndpoint)                                                        // 721
    throw new Error("missing proxyEndpoint");                                            // 722
  if (!proxyConfig.bindHost)                                                             // 723
    throw new Error("missing bindHost");                                                 // 724
  if (!process.env.GALAXY_JOB)                                                           // 725
    throw new Error("missing $GALAXY_JOB");                                              // 726
  if (!process.env.GALAXY_APP)                                                           // 727
    throw new Error("missing $GALAXY_APP");                                              // 728
  if (!process.env.LAST_START)                                                           // 729
    throw new Error("missing $LAST_START");                                              // 730
                                                                                         // 731
  // XXX rename pid argument to bindTo.                                                  // 732
  // XXX factor out into a 'getPid' function in a 'galaxy' package?                      // 733
  var pid = {                                                                            // 734
    job: process.env.GALAXY_JOB,                                                         // 735
    lastStarted: +(process.env.LAST_START),                                              // 736
    app: process.env.GALAXY_APP                                                          // 737
  };                                                                                     // 738
  var myHost = os.hostname();                                                            // 739
                                                                                         // 740
  WebAppInternals.usingDdpProxy = true;                                                  // 741
                                                                                         // 742
  // This is run after packages are loaded (in main) so we can use                       // 743
  // Follower.connect.                                                                   // 744
  if (proxy) {                                                                           // 745
    // XXX the concept here is that our configuration has changed and                    // 746
    // we have connected to an entirely new follower set, which does                     // 747
    // not have the state that we set up on the follower set that we                     // 748
    // were previously connected to, and so we need to recreate all of                   // 749
    // our bindings -- analogous to getting a SIGHUP and rereading                       // 750
    // your configuration file. so probably this should actually tear                    // 751
    // down the connection and make a whole new one, rather than                         // 752
    // hot-reconnecting to a different URL.                                              // 753
    proxy.reconnect({                                                                    // 754
      url: proxyConfig.proxyEndpoint                                                     // 755
    });                                                                                  // 756
  } else {                                                                               // 757
    proxy = Package["follower-livedata"].Follower.connect(                               // 758
      proxyConfig.proxyEndpoint, {                                                       // 759
        group: "proxy"                                                                   // 760
      }                                                                                  // 761
    );                                                                                   // 762
  }                                                                                      // 763
                                                                                         // 764
  var route = process.env.ROUTE;                                                         // 765
  var ourHost = route.split(":")[0];                                                     // 766
  var ourPort = +route.split(":")[1];                                                    // 767
                                                                                         // 768
  var outstanding = 0;                                                                   // 769
  var startedAll = false;                                                                // 770
  var checkComplete = function () {                                                      // 771
    if (startedAll && ! outstanding)                                                     // 772
      Log("Bound to proxy.");                                                            // 773
  };                                                                                     // 774
  var makeCallback = function () {                                                       // 775
    outstanding++;                                                                       // 776
    return function (err) {                                                              // 777
      if (err)                                                                           // 778
        throw err;                                                                       // 779
      outstanding--;                                                                     // 780
      checkComplete();                                                                   // 781
    };                                                                                   // 782
  };                                                                                     // 783
                                                                                         // 784
  // for now, have our (temporary) requiresAuth flag apply to all                        // 785
  // routes created by this process.                                                     // 786
  var requiresDdpAuth = !! proxyConfig.requiresAuth;                                     // 787
  var requiresHttpAuth = (!! proxyConfig.requiresAuth) &&                                // 788
        (pid.app !== "panel" && pid.app !== "auth");                                     // 789
                                                                                         // 790
  // XXX a current limitation is that we treat securePort and                            // 791
  // insecurePort as a global configuration parameter -- we assume                       // 792
  // that if the proxy wants us to ask for 8080 to get port 80 traffic                   // 793
  // on our default hostname, that's the same port that we would use                     // 794
  // to get traffic on some other hostname that our proxy listens                        // 795
  // for. Likewise, we assume that if the proxy can receive secure                       // 796
  // traffic for our domain, it can assume secure traffic for any                        // 797
  // domain! Hopefully this will get cleaned up before too long by                       // 798
  // pushing that logic into the proxy service, so we can just ask for                   // 799
  // port 80.                                                                            // 800
                                                                                         // 801
  // XXX BUG: if our configuration changes, and bindPathPrefix                           // 802
  // changes, it appears that we will not remove the routes derived                      // 803
  // from the old bindPathPrefix from the proxy (until the process                       // 804
  // exits). It is not actually normal for bindPathPrefix to change,                     // 805
  // certainly not without a process restart for other reasons, but                      // 806
  // it'd be nice to fix.                                                                // 807
                                                                                         // 808
  _.each(routes, function (route) {                                                      // 809
    var parsedUrl = url.parse(route.url, /* parseQueryString */ false,                   // 810
                              /* slashesDenoteHost aka workRight */ true);               // 811
    if (parsedUrl.protocol || parsedUrl.port || parsedUrl.search)                        // 812
      throw new Error("Bad url");                                                        // 813
    parsedUrl.host = null;                                                               // 814
    parsedUrl.path = null;                                                               // 815
    if (! parsedUrl.hostname) {                                                          // 816
      parsedUrl.hostname = proxyConfig.bindHost;                                         // 817
      if (! parsedUrl.pathname)                                                          // 818
        parsedUrl.pathname = "";                                                         // 819
      if (! parsedUrl.pathname.indexOf("/") !== 0) {                                     // 820
        // Relative path                                                                 // 821
        parsedUrl.pathname = bindPathPrefix + parsedUrl.pathname;                        // 822
      }                                                                                  // 823
    }                                                                                    // 824
    var version = "";                                                                    // 825
                                                                                         // 826
    var AppConfig = Package["application-configuration"].AppConfig;                      // 827
    version = AppConfig.getStarForThisJob() || "";                                       // 828
                                                                                         // 829
                                                                                         // 830
    var parsedDdpUrl = _.clone(parsedUrl);                                               // 831
    parsedDdpUrl.protocol = "ddp";                                                       // 832
    // Node has a hardcoded list of protocols that get '://' instead                     // 833
    // of ':'. ddp needs to be added to that whitelist. Until then, we                   // 834
    // can set the undocumented attribute 'slashes' to get the right                     // 835
    // behavior. It's not clear whether than is by design or accident.                   // 836
    parsedDdpUrl.slashes = true;                                                         // 837
    parsedDdpUrl.port = '' + securePort;                                                 // 838
    var ddpUrl = url.format(parsedDdpUrl);                                               // 839
                                                                                         // 840
    var proxyToHost, proxyToPort, proxyToPathPrefix;                                     // 841
    if (! _.has(route, 'forwardTo')) {                                                   // 842
      proxyToHost = ourHost;                                                             // 843
      proxyToPort = ourPort;                                                             // 844
      proxyToPathPrefix = parsedUrl.pathname;                                            // 845
    } else {                                                                             // 846
      var parsedFwdUrl = url.parse(route.forwardTo, false, true);                        // 847
      if (! parsedFwdUrl.hostname || parsedFwdUrl.protocol)                              // 848
        throw new Error("Bad forward url");                                              // 849
      proxyToHost = parsedFwdUrl.hostname;                                               // 850
      proxyToPort = parseInt(parsedFwdUrl.port || "80");                                 // 851
      proxyToPathPrefix = parsedFwdUrl.pathname || "";                                   // 852
    }                                                                                    // 853
                                                                                         // 854
    if (route.ddp) {                                                                     // 855
      proxy.call('bindDdp', {                                                            // 856
        pid: pid,                                                                        // 857
        bindTo: {                                                                        // 858
          ddpUrl: ddpUrl,                                                                // 859
          insecurePort: insecurePort                                                     // 860
        },                                                                               // 861
        proxyTo: {                                                                       // 862
          tags: [version],                                                               // 863
          host: proxyToHost,                                                             // 864
          port: proxyToPort,                                                             // 865
          pathPrefix: proxyToPathPrefix + '/websocket'                                   // 866
        },                                                                               // 867
        requiresAuth: requiresDdpAuth                                                    // 868
      }, makeCallback());                                                                // 869
    }                                                                                    // 870
                                                                                         // 871
    if (route.http) {                                                                    // 872
      proxy.call('bindHttp', {                                                           // 873
        pid: pid,                                                                        // 874
        bindTo: {                                                                        // 875
          host: parsedUrl.hostname,                                                      // 876
          port: insecurePort,                                                            // 877
          pathPrefix: parsedUrl.pathname                                                 // 878
        },                                                                               // 879
        proxyTo: {                                                                       // 880
          tags: [version],                                                               // 881
          host: proxyToHost,                                                             // 882
          port: proxyToPort,                                                             // 883
          pathPrefix: proxyToPathPrefix                                                  // 884
        },                                                                               // 885
        requiresAuth: requiresHttpAuth                                                   // 886
      }, makeCallback());                                                                // 887
                                                                                         // 888
      // Only make the secure binding if we've been told that the                        // 889
      // proxy knows how terminate secure connections for us (has an                     // 890
      // appropriate cert, can bind the necessary port..)                                // 891
      if (proxyConfig.securePort !== null) {                                             // 892
        proxy.call('bindHttp', {                                                         // 893
          pid: pid,                                                                      // 894
          bindTo: {                                                                      // 895
            host: parsedUrl.hostname,                                                    // 896
            port: securePort,                                                            // 897
            pathPrefix: parsedUrl.pathname,                                              // 898
            ssl: true                                                                    // 899
          },                                                                             // 900
          proxyTo: {                                                                     // 901
            tags: [version],                                                             // 902
            host: proxyToHost,                                                           // 903
            port: proxyToPort,                                                           // 904
            pathPrefix: proxyToPathPrefix                                                // 905
          },                                                                             // 906
          requiresAuth: requiresHttpAuth                                                 // 907
        }, makeCallback());                                                              // 908
      }                                                                                  // 909
    }                                                                                    // 910
  });                                                                                    // 911
                                                                                         // 912
  startedAll = true;                                                                     // 913
  checkComplete();                                                                       // 914
};                                                                                       // 915
                                                                                         // 916
// (Internal, unsupported interface -- subject to change)                                // 917
//                                                                                       // 918
// Listen for HTTP and/or DDP traffic and route it somewhere. Only                       // 919
// takes effect when using a proxy service.                                              // 920
//                                                                                       // 921
// 'url' is the traffic that we want to route, interpreted relative to                   // 922
// the default URL where this app has been told to serve itself. It                      // 923
// may not have a scheme or port, but it may have a host and a path,                     // 924
// and if no host is provided the path need not be absolute. The                         // 925
// following cases are possible:                                                         // 926
//                                                                                       // 927
//   //somehost.com                                                                      // 928
//     All incoming traffic for 'somehost.com'                                           // 929
//   //somehost.com/foo/bar                                                              // 930
//     All incoming traffic for 'somehost.com', but only when                            // 931
//     the first two path components are 'foo' and 'bar'.                                // 932
//   /foo/bar                                                                            // 933
//     Incoming traffic on our default host, but only when the                           // 934
//     first two path components are 'foo' and 'bar'.                                    // 935
//   foo/bar                                                                             // 936
//     Incoming traffic on our default host, but only when the path                      // 937
//     starts with our default path prefix, followed by 'foo' and                        // 938
//     'bar'.                                                                            // 939
//                                                                                       // 940
// (Yes, these scheme-less URLs that start with '//' are legal URLs.)                    // 941
//                                                                                       // 942
// You can select either DDP traffic, HTTP traffic, or both. Both                        // 943
// secure and insecure traffic will be gathered (assuming the proxy                      // 944
// service is capable, eg, has appropriate certs and port mappings).                     // 945
//                                                                                       // 946
// With no 'forwardTo' option, the traffic is received by this process                   // 947
// for service by the hooks in this 'webapp' package. The original URL                   // 948
// is preserved (that is, if you bind "/a", and a user visits "/a/b",                    // 949
// the app receives a request with a path of "/a/b", not a path of                       // 950
// "/b").                                                                                // 951
//                                                                                       // 952
// With 'forwardTo', the process is instead sent to some other remote                    // 953
// host. The URL is adjusted by stripping the path components in 'url'                   // 954
// and putting the path components in the 'forwardTo' URL in their                       // 955
// place. For example, if you forward "//somehost/a" to                                  // 956
// "//otherhost/x", and the user types "//somehost/a/b" into their                       // 957
// browser, then otherhost will receive a request with a Host header                     // 958
// of "somehost" and a path of "/x/b".                                                   // 959
//                                                                                       // 960
// The routing continues until this process exits. For now, all of the                   // 961
// routes must be set up ahead of time, before the initial                               // 962
// registration with the proxy. Calling addRoute from the top level of                   // 963
// your JS should do the trick.                                                          // 964
//                                                                                       // 965
// When multiple routes are present that match a given request, the                      // 966
// most specific route wins. When routes with equal specificity are                      // 967
// present, the proxy service will distribute the traffic between                        // 968
// them.                                                                                 // 969
//                                                                                       // 970
// options may be:                                                                       // 971
// - ddp: if true, the default, include DDP traffic. This includes                       // 972
//   both secure and insecure traffic, and both websocket and sockjs                     // 973
//   transports.                                                                         // 974
// - http: if true, the default, include HTTP/HTTPS traffic.                             // 975
// - forwardTo: if provided, should be a URL with a host, optional                       // 976
//   path and port, and no scheme (the scheme will be derived from the                   // 977
//   traffic type; for now it will always be a http or ws connection,                    // 978
//   never https or wss, but we could add a forwardSecure flag to                        // 979
//   re-encrypt).                                                                        // 980
var routes = [];                                                                         // 981
WebAppInternals.addRoute = function (url, options) {                                     // 982
  options = _.extend({                                                                   // 983
    ddp: true,                                                                           // 984
    http: true                                                                           // 985
  }, options || {});                                                                     // 986
                                                                                         // 987
  if (proxy)                                                                             // 988
    // In the future, lift this restriction                                              // 989
    throw new Error("Too late to add routes");                                           // 990
                                                                                         // 991
  routes.push(_.extend({ url: url }, options));                                          // 992
};                                                                                       // 993
                                                                                         // 994
// Receive traffic on our default URL.                                                   // 995
WebAppInternals.addRoute("");                                                            // 996
                                                                                         // 997
runWebAppServer();                                                                       // 998
                                                                                         // 999
                                                                                         // 1000
var inlineScriptsAllowed = true;                                                         // 1001
                                                                                         // 1002
WebAppInternals.inlineScriptsAllowed = function () {                                     // 1003
  return inlineScriptsAllowed;                                                           // 1004
};                                                                                       // 1005
                                                                                         // 1006
WebAppInternals.setInlineScriptsAllowed = function (value) {                             // 1007
  inlineScriptsAllowed = value;                                                          // 1008
};                                                                                       // 1009
                                                                                         // 1010
WebAppInternals.setBundledJsCssPrefix = function (prefix) {                              // 1011
  bundledJsCssPrefix = prefix;                                                           // 1012
};                                                                                       // 1013
                                                                                         // 1014
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.webapp = {
  WebApp: WebApp,
  main: main,
  WebAppInternals: WebAppInternals
};

})();
