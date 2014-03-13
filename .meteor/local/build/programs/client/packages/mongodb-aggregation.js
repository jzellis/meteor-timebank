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
var __coffeescriptShare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/mongodb-aggregation/client.coffee.js                                                        //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isClient) {
  _.extend(Meteor.Collection.prototype, {
    distinct: function(key, callback) {
      return Meteor.apply("_callAdvancedDBMethod", [this._name, "distinct", key], {
        wait: false,
        onResultReceived: callback
      });
    },
    aggregate: function(pipeline, callback) {
      return Meteor.apply("_callAdvancedDBMethod", [this._name, "aggregate", pipeline], {
        wait: false,
        onResultReceived: callback
      });
    },
    mapReduce1: function(map, reduce, options, callback) {
      return Meteor.apply("_callAdvancedDBMethod", [this._name, "mapReduce", [map, reduce, options]], {
        wait: false,
        onResultReceived: callback
      });
    },
    mapReduce: function(map, reduce, options, callback) {
      return Meteor.apply("_callMapReduce", [this._name, map, reduce, options], {
        wait: false,
        onResultReceived: callback
      });
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongodb-aggregation'] = {};

})();

//# sourceMappingURL=ca0f3a303b6e027c915a187ac5de9230820b5dad.map
