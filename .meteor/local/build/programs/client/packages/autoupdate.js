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
var Deps = Package.deps.Deps;
var DDP = Package.livedata.DDP;

/* Package-scope variables */
var Autoupdate;

(function () {

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// packages/autoupdate/autoupdate_client.js                                       //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
// Subscribe to the `meteor_autoupdate_clientVersions` collection,                // 1
// which contains the set of acceptable client versions.                          // 2
//                                                                                // 3
// A "hard code push" occurs when the running client version is not in            // 4
// the set of acceptable client versions (or the server updates the               // 5
// collection, there is a published client version marked `current` and           // 6
// the running client version is no longer in the set).                           // 7
//                                                                                // 8
// When the `reload` package is loaded, a hard code push causes                   // 9
// the browser to reload, so that it will load the latest client                  // 10
// version from the server.                                                       // 11
//                                                                                // 12
// A "soft code push" represents the situation when the running client            // 13
// version is in the set of acceptable versions, but there is a newer             // 14
// version available on the server.                                               // 15
//                                                                                // 16
// `Autoupdate.newClientAvailable` is a reactive data source which                // 17
// becomes `true` if there is a new version of the client is available on         // 18
// the server.                                                                    // 19
//                                                                                // 20
// This package doesn't implement a soft code reload process itself,              // 21
// but `newClientAvailable` could be used for example to display a                // 22
// "click to reload" link to the user.                                            // 23
                                                                                  // 24
// The client version of the client code currently running in the                 // 25
// browser.                                                                       // 26
var autoupdateVersion = __meteor_runtime_config__.autoupdateVersion || "unknown"; // 27
                                                                                  // 28
                                                                                  // 29
// The collection of acceptable client versions.                                  // 30
var ClientVersions = new Meteor.Collection("meteor_autoupdate_clientVersions");   // 31
                                                                                  // 32
                                                                                  // 33
Autoupdate = {};                                                                  // 34
                                                                                  // 35
Autoupdate.newClientAvailable = function () {                                     // 36
  return !! ClientVersions.findOne(                                               // 37
    {$and: [                                                                      // 38
      {current: true},                                                            // 39
      {_id: {$ne: autoupdateVersion}}                                             // 40
    ]}                                                                            // 41
  );                                                                              // 42
};                                                                                // 43
                                                                                  // 44
                                                                                  // 45
                                                                                  // 46
// XXX Livedata exporting this via DDP is a hack. See                             // 47
// packages/livedata/livedata_common.js                                           // 48
var retry = new DDP._Retry({                                                      // 49
  // Unlike the stream reconnect use of Retry, which we want to be instant        // 50
  // in normal operation, this is a wacky failure. We don't want to retry         // 51
  // right away, we can start slowly.                                             // 52
  //                                                                              // 53
  // A better way than timeconstants here might be to use the knowledge           // 54
  // of when we reconnect to help trigger these retries. Typically, the           // 55
  // server fixing code will result in a restart and reconnect, but               // 56
  // potentially the subscription could have a transient error.                   // 57
  minCount: 0, // don't do any immediate retries                                  // 58
  baseTimeout: 30*1000 // start with 30s                                          // 59
});                                                                               // 60
var failures = 0;                                                                 // 61
                                                                                  // 62
Autoupdate._retrySubscription = function () {                                     // 63
  Meteor.subscribe("meteor_autoupdate_clientVersions", {                          // 64
    onError: function (error) {                                                   // 65
      Meteor._debug("autoupdate subscription failed:", error);                    // 66
      failures++;                                                                 // 67
      retry.retryLater(failures, function () {                                    // 68
        // Just retry making the subscription, don't reload the whole             // 69
        // page. While reloading would catch more cases (for example,             // 70
        // the server went back a version and is now doing old-style hot          // 71
        // code push), it would also be more prone to reload loops,               // 72
        // which look really bad to the user. Just retrying the                   // 73
        // subscription over DDP means it is at least possible to fix by          // 74
        // updating the server.                                                   // 75
        Autoupdate._retrySubscription();                                          // 76
      });                                                                         // 77
    },                                                                            // 78
    onReady: function () {                                                        // 79
      if (Package.reload) {                                                       // 80
        Deps.autorun(function (computation) {                                     // 81
          if (ClientVersions.findOne({current: true}) &&                          // 82
              (! ClientVersions.findOne({_id: autoupdateVersion}))) {             // 83
            computation.stop();                                                   // 84
            Package.reload.Reload._reload();                                      // 85
          }                                                                       // 86
        });                                                                       // 87
      }                                                                           // 88
  }                                                                               // 89
  });                                                                             // 90
};                                                                                // 91
Autoupdate._retrySubscription();                                                  // 92
                                                                                  // 93
////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();

//# sourceMappingURL=c76cb651a032d3fdb795608d8dc51e7e07e1ee97.map
