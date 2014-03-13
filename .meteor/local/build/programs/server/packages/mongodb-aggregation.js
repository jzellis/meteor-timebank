(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/mongodb-aggregation/server.coffee.js                                         //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Future, MongoDB, path, tl, _dummyCollection_, _futureWrapper;

tl = typeof TLog !== "undefined" && TLog !== null ? TLog.getLogger() : void 0;

if (Meteor.isServer) {
  path = Npm.require("path");
  MongoDB = Npm.require("mongodb");
  Future = Npm.require(path.join("fibers", "future"));
  _dummyCollection_ = new Meteor.Collection('__dummy__');
  _futureWrapper = function(collection, commandName, args) {
    var cb, col, coll1, collectionName, future, result;
    col = (typeof collection) === "string" ? _dummyCollection_ : collection;
    collectionName = (typeof collection) === "string" ? collection : collection._name;
    coll1 = col.find()._mongo.db.collection(collectionName);
    future = new Future;
    cb = future.resolver();
    coll1[commandName](args, cb);
    return result = future.wait();
  };
  Meteor.methods({
    _callAdvancedDBMethod: _futureWrapper,
    _callMapReduce: function(collection, map, reduce, options) {
      var col, coll1, collectionName, future, result;
      col = (typeof collection) === "string" ? _dummyCollection_ : collection;
      collectionName = (typeof collection) === "string" ? collection : collection._name;
      if (tl != null) {
        tl.debug("callMapReduce called for collection " + collectionName + " map: " + map + " reduce: " + reduce + (" options: " + (JSON.stringify(options))));
      }
      coll1 = col.find()._mongo.db.collection(collectionName);
      future = new Future;
      coll1.mapReduce(map, reduce, options, function(err, result, stats) {
        var res;
        if (err) {
          future["throw"](err);
        }
        res = {
          collectionName: result.collectionName,
          stats: stats
        };
        return future["return"]([true, res]);
      });
      result = future.wait();
      if (!result[0]) {
        throw result[1];
      }
      if (result[1].collectionName) {
        col = new Meteor.Collection(result[1].collectionName);
        Meteor.publish(result[1].collectionName, function() {
          return col.find({
            "_id": {
              $ne: ""
            }
          });
        });
      }
      return result[1];
    }
  });
  _.extend(Meteor.Collection.prototype, {
    distinct: function(key) {
      return _futureWrapper(this._name, "distinct", key);
    },
    aggregate: function(pipeline) {
      return _futureWrapper(this._name, "aggregate", pipeline);
    },
    mapReduce: function(map, reduce, options) {
      return Meteor.apply("_callMapReduce", [this._name, map, reduce, options]);
    }
  });
}
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongodb-aggregation'] = {};

})();
