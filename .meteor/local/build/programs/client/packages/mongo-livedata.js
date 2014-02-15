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
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var JSON = Package.json.JSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Log = Package.logging.Log;
var DDP = Package.livedata.DDP;
var Deps = Package.deps.Deps;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var LocalCollectionDriver;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/local_collection_driver.js                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
LocalCollectionDriver = function () {                                                                  // 1
  var self = this;                                                                                     // 2
  self.noConnCollections = {};                                                                         // 3
};                                                                                                     // 4
                                                                                                       // 5
var ensureCollection = function (name, collections) {                                                  // 6
  if (!(name in collections))                                                                          // 7
    collections[name] = new LocalCollection(name);                                                     // 8
  return collections[name];                                                                            // 9
};                                                                                                     // 10
                                                                                                       // 11
_.extend(LocalCollectionDriver.prototype, {                                                            // 12
  open: function (name, conn) {                                                                        // 13
    var self = this;                                                                                   // 14
    if (!name)                                                                                         // 15
      return new LocalCollection;                                                                      // 16
    if (! conn) {                                                                                      // 17
      return ensureCollection(name, self.noConnCollections);                                           // 18
    }                                                                                                  // 19
    if (! conn._mongo_livedata_collections)                                                            // 20
      conn._mongo_livedata_collections = {};                                                           // 21
    // XXX is there a way to keep track of a connection's collections without                          // 22
    // dangling it off the connection object?                                                          // 23
    return ensureCollection(name, conn._mongo_livedata_collections);                                   // 24
  }                                                                                                    // 25
});                                                                                                    // 26
                                                                                                       // 27
// singleton                                                                                           // 28
LocalCollectionDriver = new LocalCollectionDriver;                                                     // 29
                                                                                                       // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/collection.js                                                               //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
// options.connection, if given, is a LivedataClient or LivedataServer                                 // 1
// XXX presently there is no way to destroy/clean up a Collection                                      // 2
                                                                                                       // 3
Meteor.Collection = function (name, options) {                                                         // 4
  var self = this;                                                                                     // 5
  if (! (self instanceof Meteor.Collection))                                                           // 6
    throw new Error('use "new" to construct a Meteor.Collection');                                     // 7
  if (options && options.methods) {                                                                    // 8
    // Backwards compatibility hack with original signature (which passed                              // 9
    // "connection" directly instead of in options. (Connections must have a "methods"                 // 10
    // method.)                                                                                        // 11
    // XXX remove before 1.0                                                                           // 12
    options = {connection: options};                                                                   // 13
  }                                                                                                    // 14
  // Backwards compatibility: "connection" used to be called "manager".                                // 15
  if (options && options.manager && !options.connection) {                                             // 16
    options.connection = options.manager;                                                              // 17
  }                                                                                                    // 18
  options = _.extend({                                                                                 // 19
    connection: undefined,                                                                             // 20
    idGeneration: 'STRING',                                                                            // 21
    transform: null,                                                                                   // 22
    _driver: undefined,                                                                                // 23
    _preventAutopublish: false                                                                         // 24
  }, options);                                                                                         // 25
                                                                                                       // 26
  switch (options.idGeneration) {                                                                      // 27
  case 'MONGO':                                                                                        // 28
    self._makeNewID = function () {                                                                    // 29
      return new Meteor.Collection.ObjectID();                                                         // 30
    };                                                                                                 // 31
    break;                                                                                             // 32
  case 'STRING':                                                                                       // 33
  default:                                                                                             // 34
    self._makeNewID = function () {                                                                    // 35
      return Random.id();                                                                              // 36
    };                                                                                                 // 37
    break;                                                                                             // 38
  }                                                                                                    // 39
                                                                                                       // 40
  if (options.transform)                                                                               // 41
    self._transform = Deps._makeNonreactive(options.transform);                                        // 42
  else                                                                                                 // 43
    self._transform = null;                                                                            // 44
                                                                                                       // 45
  if (!name && (name !== null)) {                                                                      // 46
    Meteor._debug("Warning: creating anonymous collection. It will not be " +                          // 47
                  "saved or synchronized over the network. (Pass null for " +                          // 48
                  "the collection name to turn off this warning.)");                                   // 49
  }                                                                                                    // 50
                                                                                                       // 51
  if (! name || options.connection === null)                                                           // 52
    // note: nameless collections never have a connection                                              // 53
    self._connection = null;                                                                           // 54
  else if (options.connection)                                                                         // 55
    self._connection = options.connection;                                                             // 56
  else if (Meteor.isClient)                                                                            // 57
    self._connection = Meteor.connection;                                                              // 58
  else                                                                                                 // 59
    self._connection = Meteor.server;                                                                  // 60
                                                                                                       // 61
  if (!options._driver) {                                                                              // 62
    if (name && self._connection === Meteor.server &&                                                  // 63
        typeof MongoInternals !== "undefined" &&                                                       // 64
        MongoInternals.defaultRemoteCollectionDriver) {                                                // 65
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                // 66
    } else {                                                                                           // 67
      options._driver = LocalCollectionDriver;                                                         // 68
    }                                                                                                  // 69
  }                                                                                                    // 70
                                                                                                       // 71
  self._collection = options._driver.open(name, self._connection);                                     // 72
  self._name = name;                                                                                   // 73
                                                                                                       // 74
  if (self._connection && self._connection.registerStore) {                                            // 75
    // OK, we're going to be a slave, replicating some remote                                          // 76
    // database, except possibly with some temporary divergence while                                  // 77
    // we have unacknowledged RPC's.                                                                   // 78
    var ok = self._connection.registerStore(name, {                                                    // 79
      // Called at the beginning of a batch of updates. batchSize is the number                        // 80
      // of update calls to expect.                                                                    // 81
      //                                                                                               // 82
      // XXX This interface is pretty janky. reset probably ought to go back to                        // 83
      // being its own function, and callers shouldn't have to calculate                               // 84
      // batchSize. The optimization of not calling pause/remove should be                             // 85
      // delayed until later: the first call to update() should buffer its                             // 86
      // message, and then we can either directly apply it at endUpdate time if                        // 87
      // it was the only update, or do pauseObservers/apply/apply at the next                          // 88
      // update() if there's another one.                                                              // 89
      beginUpdate: function (batchSize, reset) {                                                       // 90
        // pause observers so users don't see flicker when updating several                            // 91
        // objects at once (including the post-reconnect reset-and-reapply                             // 92
        // stage), and so that a re-sorting of a query can take advantage of the                       // 93
        // full _diffQuery moved calculation instead of applying change one at a                       // 94
        // time.                                                                                       // 95
        if (batchSize > 1 || reset)                                                                    // 96
          self._collection.pauseObservers();                                                           // 97
                                                                                                       // 98
        if (reset)                                                                                     // 99
          self._collection.remove({});                                                                 // 100
      },                                                                                               // 101
                                                                                                       // 102
      // Apply an update.                                                                              // 103
      // XXX better specify this interface (not in terms of a wire message)?                           // 104
      update: function (msg) {                                                                         // 105
        var mongoId = LocalCollection._idParse(msg.id);                                                // 106
        var doc = self._collection.findOne(mongoId);                                                   // 107
                                                                                                       // 108
        // Is this a "replace the whole doc" message coming from the quiescence                        // 109
        // of method writes to an object? (Note that 'undefined' is a valid                            // 110
        // value meaning "remove it".)                                                                 // 111
        if (msg.msg === 'replace') {                                                                   // 112
          var replace = msg.replace;                                                                   // 113
          if (!replace) {                                                                              // 114
            if (doc)                                                                                   // 115
              self._collection.remove(mongoId);                                                        // 116
          } else if (!doc) {                                                                           // 117
            self._collection.insert(replace);                                                          // 118
          } else {                                                                                     // 119
            // XXX check that replace has no $ ops                                                     // 120
            self._collection.update(mongoId, replace);                                                 // 121
          }                                                                                            // 122
          return;                                                                                      // 123
        } else if (msg.msg === 'added') {                                                              // 124
          if (doc) {                                                                                   // 125
            throw new Error("Expected not to find a document already present for an add");             // 126
          }                                                                                            // 127
          self._collection.insert(_.extend({_id: mongoId}, msg.fields));                               // 128
        } else if (msg.msg === 'removed') {                                                            // 129
          if (!doc)                                                                                    // 130
            throw new Error("Expected to find a document already present for removed");                // 131
          self._collection.remove(mongoId);                                                            // 132
        } else if (msg.msg === 'changed') {                                                            // 133
          if (!doc)                                                                                    // 134
            throw new Error("Expected to find a document to change");                                  // 135
          if (!_.isEmpty(msg.fields)) {                                                                // 136
            var modifier = {};                                                                         // 137
            _.each(msg.fields, function (value, key) {                                                 // 138
              if (value === undefined) {                                                               // 139
                if (!modifier.$unset)                                                                  // 140
                  modifier.$unset = {};                                                                // 141
                modifier.$unset[key] = 1;                                                              // 142
              } else {                                                                                 // 143
                if (!modifier.$set)                                                                    // 144
                  modifier.$set = {};                                                                  // 145
                modifier.$set[key] = value;                                                            // 146
              }                                                                                        // 147
            });                                                                                        // 148
            self._collection.update(mongoId, modifier);                                                // 149
          }                                                                                            // 150
        } else {                                                                                       // 151
          throw new Error("I don't know how to deal with this message");                               // 152
        }                                                                                              // 153
                                                                                                       // 154
      },                                                                                               // 155
                                                                                                       // 156
      // Called at the end of a batch of updates.                                                      // 157
      endUpdate: function () {                                                                         // 158
        self._collection.resumeObservers();                                                            // 159
      },                                                                                               // 160
                                                                                                       // 161
      // Called around method stub invocations to capture the original versions                        // 162
      // of modified documents.                                                                        // 163
      saveOriginals: function () {                                                                     // 164
        self._collection.saveOriginals();                                                              // 165
      },                                                                                               // 166
      retrieveOriginals: function () {                                                                 // 167
        return self._collection.retrieveOriginals();                                                   // 168
      }                                                                                                // 169
    });                                                                                                // 170
                                                                                                       // 171
    if (!ok)                                                                                           // 172
      throw new Error("There is already a collection named '" + name + "'");                           // 173
  }                                                                                                    // 174
                                                                                                       // 175
  self._defineMutationMethods();                                                                       // 176
                                                                                                       // 177
  // autopublish                                                                                       // 178
  if (Package.autopublish && !options._preventAutopublish && self._connection                          // 179
      && self._connection.publish) {                                                                   // 180
    self._connection.publish(null, function () {                                                       // 181
      return self.find();                                                                              // 182
    }, {is_auto: true});                                                                               // 183
  }                                                                                                    // 184
};                                                                                                     // 185
                                                                                                       // 186
///                                                                                                    // 187
/// Main collection API                                                                                // 188
///                                                                                                    // 189
                                                                                                       // 190
                                                                                                       // 191
_.extend(Meteor.Collection.prototype, {                                                                // 192
                                                                                                       // 193
  _getFindSelector: function (args) {                                                                  // 194
    if (args.length == 0)                                                                              // 195
      return {};                                                                                       // 196
    else                                                                                               // 197
      return args[0];                                                                                  // 198
  },                                                                                                   // 199
                                                                                                       // 200
  _getFindOptions: function (args) {                                                                   // 201
    var self = this;                                                                                   // 202
    if (args.length < 2) {                                                                             // 203
      return { transform: self._transform };                                                           // 204
    } else {                                                                                           // 205
      return _.extend({                                                                                // 206
        transform: self._transform                                                                     // 207
      }, args[1]);                                                                                     // 208
    }                                                                                                  // 209
  },                                                                                                   // 210
                                                                                                       // 211
  find: function (/* selector, options */) {                                                           // 212
    // Collection.find() (return all docs) behaves differently                                         // 213
    // from Collection.find(undefined) (return 0 docs).  so be                                         // 214
    // careful about the length of arguments.                                                          // 215
    var self = this;                                                                                   // 216
    var argArray = _.toArray(arguments);                                                               // 217
    return self._collection.find(self._getFindSelector(argArray),                                      // 218
                                 self._getFindOptions(argArray));                                      // 219
  },                                                                                                   // 220
                                                                                                       // 221
  findOne: function (/* selector, options */) {                                                        // 222
    var self = this;                                                                                   // 223
    var argArray = _.toArray(arguments);                                                               // 224
    return self._collection.findOne(self._getFindSelector(argArray),                                   // 225
                                    self._getFindOptions(argArray));                                   // 226
  }                                                                                                    // 227
                                                                                                       // 228
});                                                                                                    // 229
                                                                                                       // 230
Meteor.Collection._publishCursor = function (cursor, sub, collection) {                                // 231
  var observeHandle = cursor.observeChanges({                                                          // 232
    added: function (id, fields) {                                                                     // 233
      sub.added(collection, id, fields);                                                               // 234
    },                                                                                                 // 235
    changed: function (id, fields) {                                                                   // 236
      sub.changed(collection, id, fields);                                                             // 237
    },                                                                                                 // 238
    removed: function (id) {                                                                           // 239
      sub.removed(collection, id);                                                                     // 240
    }                                                                                                  // 241
  });                                                                                                  // 242
                                                                                                       // 243
  // We don't call sub.ready() here: it gets called in livedata_server, after                          // 244
  // possibly calling _publishCursor on multiple returned cursors.                                     // 245
                                                                                                       // 246
  // register stop callback (expects lambda w/ no args).                                               // 247
  sub.onStop(function () {observeHandle.stop();});                                                     // 248
};                                                                                                     // 249
                                                                                                       // 250
// protect against dangerous selectors.  falsey and {_id: falsey} are both                             // 251
// likely programmer error, and not what you want, particularly for destructive                        // 252
// operations.  JS regexps don't serialize over DDP but can be trivially                               // 253
// replaced by $regex.                                                                                 // 254
Meteor.Collection._rewriteSelector = function (selector) {                                             // 255
  // shorthand -- scalars match _id                                                                    // 256
  if (LocalCollection._selectorIsId(selector))                                                         // 257
    selector = {_id: selector};                                                                        // 258
                                                                                                       // 259
  if (!selector || (('_id' in selector) && !selector._id))                                             // 260
    // can't match anything                                                                            // 261
    return {_id: Random.id()};                                                                         // 262
                                                                                                       // 263
  var ret = {};                                                                                        // 264
  _.each(selector, function (value, key) {                                                             // 265
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                 // 266
    if (value instanceof RegExp) {                                                                     // 267
      ret[key] = convertRegexpToMongoSelector(value);                                                  // 268
    } else if (value && value.$regex instanceof RegExp) {                                              // 269
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                           // 270
      // if value is {$regex: /foo/, $options: ...} then $options                                      // 271
      // override the ones set on $regex.                                                              // 272
      if (value.$options !== undefined)                                                                // 273
        ret[key].$options = value.$options;                                                            // 274
    }                                                                                                  // 275
    else if (_.contains(['$or','$and','$nor'], key)) {                                                 // 276
      // Translate lower levels of $and/$or/$nor                                                       // 277
      ret[key] = _.map(value, function (v) {                                                           // 278
        return Meteor.Collection._rewriteSelector(v);                                                  // 279
      });                                                                                              // 280
    }                                                                                                  // 281
    else {                                                                                             // 282
      ret[key] = value;                                                                                // 283
    }                                                                                                  // 284
  });                                                                                                  // 285
  return ret;                                                                                          // 286
};                                                                                                     // 287
                                                                                                       // 288
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                  // 289
// selector                                                                                            // 290
var convertRegexpToMongoSelector = function (regexp) {                                                 // 291
  check(regexp, RegExp); // safety belt                                                                // 292
                                                                                                       // 293
  var selector = {$regex: regexp.source};                                                              // 294
  var regexOptions = '';                                                                               // 295
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                 // 296
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                   // 297
  if (regexp.ignoreCase)                                                                               // 298
    regexOptions += 'i';                                                                               // 299
  if (regexp.multiline)                                                                                // 300
    regexOptions += 'm';                                                                               // 301
  if (regexOptions)                                                                                    // 302
    selector.$options = regexOptions;                                                                  // 303
                                                                                                       // 304
  return selector;                                                                                     // 305
};                                                                                                     // 306
                                                                                                       // 307
var throwIfSelectorIsNotId = function (selector, methodName) {                                         // 308
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                       // 309
    throw new Meteor.Error(                                                                            // 310
      403, "Not permitted. Untrusted code may only " + methodName +                                    // 311
        " documents by ID.");                                                                          // 312
  }                                                                                                    // 313
};                                                                                                     // 314
                                                                                                       // 315
// 'insert' immediately returns the inserted document's new _id.                                       // 316
// The others return values immediately if you are in a stub, an in-memory                             // 317
// unmanaged collection, or a mongo-backed collection and you don't pass a                             // 318
// callback. 'update' and 'remove' return the number of affected                                       // 319
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                         // 320
// insert happened, 'insertedId'.                                                                      // 321
//                                                                                                     // 322
// Otherwise, the semantics are exactly like other methods: they take                                  // 323
// a callback as an optional last argument; if no callback is                                          // 324
// provided, they block until the operation is complete, and throw an                                  // 325
// exception if it fails; if a callback is provided, then they don't                                   // 326
// necessarily block, and they call the callback when they finish with error and                       // 327
// result arguments.  (The insert method provides the document ID as its result;                       // 328
// update and remove provide the number of affected docs as the result; upsert                         // 329
// provides an object with numberAffected and maybe insertedId.)                                       // 330
//                                                                                                     // 331
// On the client, blocking is impossible, so if a callback                                             // 332
// isn't provided, they just return immediately and any error                                          // 333
// information is lost.                                                                                // 334
//                                                                                                     // 335
// There's one more tweak. On the client, if you don't provide a                                       // 336
// callback, then if there is an error, a message will be logged with                                  // 337
// Meteor._debug.                                                                                      // 338
//                                                                                                     // 339
// The intent (though this is actually determined by the underlying                                    // 340
// drivers) is that the operations should be done synchronously, not                                   // 341
// generating their result until the database has acknowledged                                         // 342
// them. In the future maybe we should provide a flag to turn this                                     // 343
// off.                                                                                                // 344
_.each(["insert", "update", "remove"], function (name) {                                               // 345
  Meteor.Collection.prototype[name] = function (/* arguments */) {                                     // 346
    var self = this;                                                                                   // 347
    var args = _.toArray(arguments);                                                                   // 348
    var callback;                                                                                      // 349
    var insertId;                                                                                      // 350
    var ret;                                                                                           // 351
                                                                                                       // 352
    if (args.length && args[args.length - 1] instanceof Function)                                      // 353
      callback = args.pop();                                                                           // 354
                                                                                                       // 355
    if (name === "insert") {                                                                           // 356
      if (!args.length)                                                                                // 357
        throw new Error("insert requires an argument");                                                // 358
      // shallow-copy the document and generate an ID                                                  // 359
      args[0] = _.extend({}, args[0]);                                                                 // 360
      if ('_id' in args[0]) {                                                                          // 361
        insertId = args[0]._id;                                                                        // 362
        if (!insertId || !(typeof insertId === 'string'                                                // 363
              || insertId instanceof Meteor.Collection.ObjectID))                                      // 364
          throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs"); // 365
      } else {                                                                                         // 366
        insertId = args[0]._id = self._makeNewID();                                                    // 367
      }                                                                                                // 368
    } else {                                                                                           // 369
      args[0] = Meteor.Collection._rewriteSelector(args[0]);                                           // 370
                                                                                                       // 371
      if (name === "update") {                                                                         // 372
        // Mutate args but copy the original options object. We need to add                            // 373
        // insertedId to options, but don't want to mutate the caller's options                        // 374
        // object. We need to mutate `args` because we pass `args` into the                            // 375
        // driver below.                                                                               // 376
        var options = args[2] = _.clone(args[2]) || {};                                                // 377
        if (options && typeof options !== "function" && options.upsert) {                              // 378
          // set `insertedId` if absent.  `insertedId` is a Meteor extension.                          // 379
          if (options.insertedId) {                                                                    // 380
            if (!(typeof options.insertedId === 'string'                                               // 381
                  || options.insertedId instanceof Meteor.Collection.ObjectID))                        // 382
              throw new Error("insertedId must be string or ObjectID");                                // 383
          } else {                                                                                     // 384
            options.insertedId = self._makeNewID();                                                    // 385
          }                                                                                            // 386
        }                                                                                              // 387
      }                                                                                                // 388
    }                                                                                                  // 389
                                                                                                       // 390
    // On inserts, always return the id that we generated; on all other                                // 391
    // operations, just return the result from the collection.                                         // 392
    var chooseReturnValueFromCollectionResult = function (result) {                                    // 393
      if (name === "insert")                                                                           // 394
        return insertId;                                                                               // 395
      else                                                                                             // 396
        return result;                                                                                 // 397
    };                                                                                                 // 398
                                                                                                       // 399
    var wrappedCallback;                                                                               // 400
    if (callback) {                                                                                    // 401
      wrappedCallback = function (error, result) {                                                     // 402
        callback(error, ! error && chooseReturnValueFromCollectionResult(result));                     // 403
      };                                                                                               // 404
    }                                                                                                  // 405
                                                                                                       // 406
    if (self._connection && self._connection !== Meteor.server) {                                      // 407
      // just remote to another endpoint, propagate return value or                                    // 408
      // exception.                                                                                    // 409
                                                                                                       // 410
      var enclosing = DDP._CurrentInvocation.get();                                                    // 411
      var alreadyInSimulation = enclosing && enclosing.isSimulation;                                   // 412
                                                                                                       // 413
      if (Meteor.isClient && !wrappedCallback && ! alreadyInSimulation) {                              // 414
        // Client can't block, so it can't report errors by exception,                                 // 415
        // only by callback. If they forget the callback, give them a                                  // 416
        // default one that logs the error, so they aren't totally                                     // 417
        // baffled if their writes don't work because their database is                                // 418
        // down.                                                                                       // 419
        // Don't give a default callback in simulation, because inside stubs we                        // 420
        // want to return the results from the local collection immediately and                        // 421
        // not force a callback.                                                                       // 422
        wrappedCallback = function (err) {                                                             // 423
          if (err)                                                                                     // 424
            Meteor._debug(name + " failed: " + (err.reason || err.stack));                             // 425
        };                                                                                             // 426
      }                                                                                                // 427
                                                                                                       // 428
      if (!alreadyInSimulation && name !== "insert") {                                                 // 429
        // If we're about to actually send an RPC, we should throw an error if                         // 430
        // this is a non-ID selector, because the mutation methods only allow                          // 431
        // single-ID selectors. (If we don't throw here, we'll see flicker.)                           // 432
        throwIfSelectorIsNotId(args[0], name);                                                         // 433
      }                                                                                                // 434
                                                                                                       // 435
      ret = chooseReturnValueFromCollectionResult(                                                     // 436
        self._connection.apply(self._prefix + name, args, wrappedCallback)                             // 437
      );                                                                                               // 438
                                                                                                       // 439
    } else {                                                                                           // 440
      // it's my collection.  descend into the collection object                                       // 441
      // and propagate any exception.                                                                  // 442
      args.push(wrappedCallback);                                                                      // 443
      try {                                                                                            // 444
        // If the user provided a callback and the collection implements this                          // 445
        // operation asynchronously, then queryRet will be undefined, and the                          // 446
        // result will be returned through the callback instead.                                       // 447
        var queryRet = self._collection[name].apply(self._collection, args);                           // 448
        ret = chooseReturnValueFromCollectionResult(queryRet);                                         // 449
      } catch (e) {                                                                                    // 450
        if (callback) {                                                                                // 451
          callback(e);                                                                                 // 452
          return null;                                                                                 // 453
        }                                                                                              // 454
        throw e;                                                                                       // 455
      }                                                                                                // 456
    }                                                                                                  // 457
                                                                                                       // 458
    // both sync and async, unless we threw an exception, return ret                                   // 459
    // (new document ID for insert, num affected for update/remove, object with                        // 460
    // numberAffected and maybe insertedId for upsert).                                                // 461
    return ret;                                                                                        // 462
  };                                                                                                   // 463
});                                                                                                    // 464
                                                                                                       // 465
Meteor.Collection.prototype.upsert = function (selector, modifier,                                     // 466
                                               options, callback) {                                    // 467
  var self = this;                                                                                     // 468
  if (! callback && typeof options === "function") {                                                   // 469
    callback = options;                                                                                // 470
    options = {};                                                                                      // 471
  }                                                                                                    // 472
  return self.update(selector, modifier,                                                               // 473
              _.extend({}, options, { _returnObject: true, upsert: true }),                            // 474
              callback);                                                                               // 475
};                                                                                                     // 476
                                                                                                       // 477
// We'll actually design an index API later. For now, we just pass through to                          // 478
// Mongo's, but make it synchronous.                                                                   // 479
Meteor.Collection.prototype._ensureIndex = function (index, options) {                                 // 480
  var self = this;                                                                                     // 481
  if (!self._collection._ensureIndex)                                                                  // 482
    throw new Error("Can only call _ensureIndex on server collections");                               // 483
  self._collection._ensureIndex(index, options);                                                       // 484
};                                                                                                     // 485
Meteor.Collection.prototype._dropIndex = function (index) {                                            // 486
  var self = this;                                                                                     // 487
  if (!self._collection._dropIndex)                                                                    // 488
    throw new Error("Can only call _dropIndex on server collections");                                 // 489
  self._collection._dropIndex(index);                                                                  // 490
};                                                                                                     // 491
Meteor.Collection.prototype._dropCollection = function () {                                            // 492
  var self = this;                                                                                     // 493
  if (!self._collection.dropCollection)                                                                // 494
    throw new Error("Can only call _dropCollection on server collections");                            // 495
  self._collection.dropCollection();                                                                   // 496
};                                                                                                     // 497
Meteor.Collection.prototype._createCappedCollection = function (byteSize) {                            // 498
  var self = this;                                                                                     // 499
  if (!self._collection._createCappedCollection)                                                       // 500
    throw new Error("Can only call _createCappedCollection on server collections");                    // 501
  self._collection._createCappedCollection(byteSize);                                                  // 502
};                                                                                                     // 503
                                                                                                       // 504
Meteor.Collection.ObjectID = LocalCollection._ObjectID;                                                // 505
                                                                                                       // 506
///                                                                                                    // 507
/// Remote methods and access control.                                                                 // 508
///                                                                                                    // 509
                                                                                                       // 510
// Restrict default mutators on collection. allow() and deny() take the                                // 511
// same options:                                                                                       // 512
//                                                                                                     // 513
// options.insert {Function(userId, doc)}                                                              // 514
//   return true to allow/deny adding this document                                                    // 515
//                                                                                                     // 516
// options.update {Function(userId, docs, fields, modifier)}                                           // 517
//   return true to allow/deny updating these documents.                                               // 518
//   `fields` is passed as an array of fields that are to be modified                                  // 519
//                                                                                                     // 520
// options.remove {Function(userId, docs)}                                                             // 521
//   return true to allow/deny removing these documents                                                // 522
//                                                                                                     // 523
// options.fetch {Array}                                                                               // 524
//   Fields to fetch for these validators. If any call to allow or deny                                // 525
//   does not have this option then all fields are loaded.                                             // 526
//                                                                                                     // 527
// allow and deny can be called multiple times. The validators are                                     // 528
// evaluated as follows:                                                                               // 529
// - If neither deny() nor allow() has been called on the collection,                                  // 530
//   then the request is allowed if and only if the "insecure" smart                                   // 531
//   package is in use.                                                                                // 532
// - Otherwise, if any deny() function returns true, the request is denied.                            // 533
// - Otherwise, if any allow() function returns true, the request is allowed.                          // 534
// - Otherwise, the request is denied.                                                                 // 535
//                                                                                                     // 536
// Meteor may call your deny() and allow() functions in any order, and may not                         // 537
// call all of them if it is able to make a decision without calling them all                          // 538
// (so don't include side effects).                                                                    // 539
                                                                                                       // 540
(function () {                                                                                         // 541
  var addValidator = function(allowOrDeny, options) {                                                  // 542
    // validate keys                                                                                   // 543
    var VALID_KEYS = ['insert', 'update', 'remove', 'fetch', 'transform'];                             // 544
    _.each(_.keys(options), function (key) {                                                           // 545
      if (!_.contains(VALID_KEYS, key))                                                                // 546
        throw new Error(allowOrDeny + ": Invalid key: " + key);                                        // 547
    });                                                                                                // 548
                                                                                                       // 549
    var self = this;                                                                                   // 550
    self._restricted = true;                                                                           // 551
                                                                                                       // 552
    _.each(['insert', 'update', 'remove'], function (name) {                                           // 553
      if (options[name]) {                                                                             // 554
        if (!(options[name] instanceof Function)) {                                                    // 555
          throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");              // 556
        }                                                                                              // 557
        if (self._transform && options.transform !== null)                                             // 558
          options[name].transform = self._transform;                                                   // 559
        if (options.transform)                                                                         // 560
          options[name].transform = Deps._makeNonreactive(options.transform);                          // 561
        self._validators[name][allowOrDeny].push(options[name]);                                       // 562
      }                                                                                                // 563
    });                                                                                                // 564
                                                                                                       // 565
    // Only update the fetch fields if we're passed things that affect                                 // 566
    // fetching. This way allow({}) and allow({insert: f}) don't result in                             // 567
    // setting fetchAllFields                                                                          // 568
    if (options.update || options.remove || options.fetch) {                                           // 569
      if (options.fetch && !(options.fetch instanceof Array)) {                                        // 570
        throw new Error(allowOrDeny + ": Value for `fetch` must be an array");                         // 571
      }                                                                                                // 572
      self._updateFetch(options.fetch);                                                                // 573
    }                                                                                                  // 574
  };                                                                                                   // 575
                                                                                                       // 576
  Meteor.Collection.prototype.allow = function(options) {                                              // 577
    addValidator.call(this, 'allow', options);                                                         // 578
  };                                                                                                   // 579
  Meteor.Collection.prototype.deny = function(options) {                                               // 580
    addValidator.call(this, 'deny', options);                                                          // 581
  };                                                                                                   // 582
})();                                                                                                  // 583
                                                                                                       // 584
                                                                                                       // 585
Meteor.Collection.prototype._defineMutationMethods = function() {                                      // 586
  var self = this;                                                                                     // 587
                                                                                                       // 588
  // set to true once we call any allow or deny methods. If true, use                                  // 589
  // allow/deny semantics. If false, use insecure mode semantics.                                      // 590
  self._restricted = false;                                                                            // 591
                                                                                                       // 592
  // Insecure mode (default to allowing writes). Defaults to 'undefined' which                         // 593
  // means insecure iff the insecure package is loaded. This property can be                           // 594
  // overriden by tests or packages wishing to change insecure mode behavior of                        // 595
  // their collections.                                                                                // 596
  self._insecure = undefined;                                                                          // 597
                                                                                                       // 598
  self._validators = {                                                                                 // 599
    insert: {allow: [], deny: []},                                                                     // 600
    update: {allow: [], deny: []},                                                                     // 601
    remove: {allow: [], deny: []},                                                                     // 602
    upsert: {allow: [], deny: []}, // dummy arrays; can't set these!                                   // 603
    fetch: [],                                                                                         // 604
    fetchAllFields: false                                                                              // 605
  };                                                                                                   // 606
                                                                                                       // 607
  if (!self._name)                                                                                     // 608
    return; // anonymous collection                                                                    // 609
                                                                                                       // 610
  // XXX Think about method namespacing. Maybe methods should be                                       // 611
  // "Meteor:Mongo:insert/NAME"?                                                                       // 612
  self._prefix = '/' + self._name + '/';                                                               // 613
                                                                                                       // 614
  // mutation methods                                                                                  // 615
  if (self._connection) {                                                                              // 616
    var m = {};                                                                                        // 617
                                                                                                       // 618
    _.each(['insert', 'update', 'remove'], function (method) {                                         // 619
      m[self._prefix + method] = function (/* ... */) {                                                // 620
        // All the methods do their own validation, instead of using check().                          // 621
        check(arguments, [Match.Any]);                                                                 // 622
        try {                                                                                          // 623
          if (this.isSimulation) {                                                                     // 624
                                                                                                       // 625
            // In a client simulation, you can do any mutation (even with a                            // 626
            // complex selector).                                                                      // 627
            return self._collection[method].apply(                                                     // 628
              self._collection, _.toArray(arguments));                                                 // 629
          }                                                                                            // 630
                                                                                                       // 631
          // This is the server receiving a method call from the client.                               // 632
                                                                                                       // 633
          // We don't allow arbitrary selectors in mutations from the client: only                     // 634
          // single-ID selectors.                                                                      // 635
          if (method !== 'insert')                                                                     // 636
            throwIfSelectorIsNotId(arguments[0], method);                                              // 637
                                                                                                       // 638
          if (self._restricted) {                                                                      // 639
            // short circuit if there is no way it will pass.                                          // 640
            if (self._validators[method].allow.length === 0) {                                         // 641
              throw new Meteor.Error(                                                                  // 642
                403, "Access denied. No allow validators set on restricted " +                         // 643
                  "collection for method '" + method + "'.");                                          // 644
            }                                                                                          // 645
                                                                                                       // 646
            var validatedMethodName =                                                                  // 647
                  '_validated' + method.charAt(0).toUpperCase() + method.slice(1);                     // 648
            var argsWithUserId = [this.userId].concat(_.toArray(arguments));                           // 649
            return self[validatedMethodName].apply(self, argsWithUserId);                              // 650
          } else if (self._isInsecure()) {                                                             // 651
            // In insecure mode, allow any mutation (with a simple selector).                          // 652
            return self._collection[method].apply(self._collection,                                    // 653
                                                  _.toArray(arguments));                               // 654
          } else {                                                                                     // 655
            // In secure mode, if we haven't called allow or deny, then nothing                        // 656
            // is permitted.                                                                           // 657
            throw new Meteor.Error(403, "Access denied");                                              // 658
          }                                                                                            // 659
        } catch (e) {                                                                                  // 660
          if (e.name === 'MongoError' || e.name === 'MinimongoError') {                                // 661
            throw new Meteor.Error(409, e.toString());                                                 // 662
          } else {                                                                                     // 663
            throw e;                                                                                   // 664
          }                                                                                            // 665
        }                                                                                              // 666
      };                                                                                               // 667
    });                                                                                                // 668
    // Minimongo on the server gets no stubs; instead, by default                                      // 669
    // it wait()s until its result is ready, yielding.                                                 // 670
    // This matches the behavior of macromongo on the server better.                                   // 671
    if (Meteor.isClient || self._connection === Meteor.server)                                         // 672
      self._connection.methods(m);                                                                     // 673
  }                                                                                                    // 674
};                                                                                                     // 675
                                                                                                       // 676
                                                                                                       // 677
Meteor.Collection.prototype._updateFetch = function (fields) {                                         // 678
  var self = this;                                                                                     // 679
                                                                                                       // 680
  if (!self._validators.fetchAllFields) {                                                              // 681
    if (fields) {                                                                                      // 682
      self._validators.fetch = _.union(self._validators.fetch, fields);                                // 683
    } else {                                                                                           // 684
      self._validators.fetchAllFields = true;                                                          // 685
      // clear fetch just to make sure we don't accidentally read it                                   // 686
      self._validators.fetch = null;                                                                   // 687
    }                                                                                                  // 688
  }                                                                                                    // 689
};                                                                                                     // 690
                                                                                                       // 691
Meteor.Collection.prototype._isInsecure = function () {                                                // 692
  var self = this;                                                                                     // 693
  if (self._insecure === undefined)                                                                    // 694
    return !!Package.insecure;                                                                         // 695
  return self._insecure;                                                                               // 696
};                                                                                                     // 697
                                                                                                       // 698
var docToValidate = function (validator, doc) {                                                        // 699
  var ret = doc;                                                                                       // 700
  if (validator.transform)                                                                             // 701
    ret = validator.transform(EJSON.clone(doc));                                                       // 702
  return ret;                                                                                          // 703
};                                                                                                     // 704
                                                                                                       // 705
Meteor.Collection.prototype._validatedInsert = function(userId, doc) {                                 // 706
  var self = this;                                                                                     // 707
                                                                                                       // 708
  // call user validators.                                                                             // 709
  // Any deny returns true means denied.                                                               // 710
  if (_.any(self._validators.insert.deny, function(validator) {                                        // 711
    return validator(userId, docToValidate(validator, doc));                                           // 712
  })) {                                                                                                // 713
    throw new Meteor.Error(403, "Access denied");                                                      // 714
  }                                                                                                    // 715
  // Any allow returns true means proceed. Throw error if they all fail.                               // 716
  if (_.all(self._validators.insert.allow, function(validator) {                                       // 717
    return !validator(userId, docToValidate(validator, doc));                                          // 718
  })) {                                                                                                // 719
    throw new Meteor.Error(403, "Access denied");                                                      // 720
  }                                                                                                    // 721
                                                                                                       // 722
  self._collection.insert.call(self._collection, doc);                                                 // 723
};                                                                                                     // 724
                                                                                                       // 725
var transformDoc = function (validator, doc) {                                                         // 726
  if (validator.transform)                                                                             // 727
    return validator.transform(doc);                                                                   // 728
  return doc;                                                                                          // 729
};                                                                                                     // 730
                                                                                                       // 731
// Simulate a mongo `update` operation while validating that the access                                // 732
// control rules set by calls to `allow/deny` are satisfied. If all                                    // 733
// pass, rewrite the mongo operation to use $in to set the list of                                     // 734
// document ids to change ##ValidatedChange                                                            // 735
Meteor.Collection.prototype._validatedUpdate = function(                                               // 736
    userId, selector, mutator, options) {                                                              // 737
  var self = this;                                                                                     // 738
                                                                                                       // 739
  options = options || {};                                                                             // 740
                                                                                                       // 741
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector))                                         // 742
    throw new Error("validated update should be of a single ID");                                      // 743
                                                                                                       // 744
  // We don't support upserts because they don't fit nicely into allow/deny                            // 745
  // rules.                                                                                            // 746
  if (options.upsert)                                                                                  // 747
    throw new Meteor.Error(403, "Access denied. Upserts not " +                                        // 748
                           "allowed in a restricted collection.");                                     // 749
                                                                                                       // 750
  // compute modified fields                                                                           // 751
  var fields = [];                                                                                     // 752
  _.each(mutator, function (params, op) {                                                              // 753
    if (op.charAt(0) !== '$') {                                                                        // 754
      throw new Meteor.Error(                                                                          // 755
        403, "Access denied. In a restricted collection you can only update documents, not replace them. Use a Mongo update operator, such as '$set'.");
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {                                                // 757
      throw new Meteor.Error(                                                                          // 758
        403, "Access denied. Operator " + op + " not allowed in a restricted collection.");            // 759
    } else {                                                                                           // 760
      _.each(_.keys(params), function (field) {                                                        // 761
        // treat dotted fields as if they are replacing their                                          // 762
        // top-level part                                                                              // 763
        if (field.indexOf('.') !== -1)                                                                 // 764
          field = field.substring(0, field.indexOf('.'));                                              // 765
                                                                                                       // 766
        // record the field we are trying to change                                                    // 767
        if (!_.contains(fields, field))                                                                // 768
          fields.push(field);                                                                          // 769
      });                                                                                              // 770
    }                                                                                                  // 771
  });                                                                                                  // 772
                                                                                                       // 773
  var findOptions = {transform: null};                                                                 // 774
  if (!self._validators.fetchAllFields) {                                                              // 775
    findOptions.fields = {};                                                                           // 776
    _.each(self._validators.fetch, function(fieldName) {                                               // 777
      findOptions.fields[fieldName] = 1;                                                               // 778
    });                                                                                                // 779
  }                                                                                                    // 780
                                                                                                       // 781
  var doc = self._collection.findOne(selector, findOptions);                                           // 782
  if (!doc)  // none satisfied!                                                                        // 783
    return;                                                                                            // 784
                                                                                                       // 785
  var factoriedDoc;                                                                                    // 786
                                                                                                       // 787
  // call user validators.                                                                             // 788
  // Any deny returns true means denied.                                                               // 789
  if (_.any(self._validators.update.deny, function(validator) {                                        // 790
    if (!factoriedDoc)                                                                                 // 791
      factoriedDoc = transformDoc(validator, doc);                                                     // 792
    return validator(userId,                                                                           // 793
                     factoriedDoc,                                                                     // 794
                     fields,                                                                           // 795
                     mutator);                                                                         // 796
  })) {                                                                                                // 797
    throw new Meteor.Error(403, "Access denied");                                                      // 798
  }                                                                                                    // 799
  // Any allow returns true means proceed. Throw error if they all fail.                               // 800
  if (_.all(self._validators.update.allow, function(validator) {                                       // 801
    if (!factoriedDoc)                                                                                 // 802
      factoriedDoc = transformDoc(validator, doc);                                                     // 803
    return !validator(userId,                                                                          // 804
                      factoriedDoc,                                                                    // 805
                      fields,                                                                          // 806
                      mutator);                                                                        // 807
  })) {                                                                                                // 808
    throw new Meteor.Error(403, "Access denied");                                                      // 809
  }                                                                                                    // 810
                                                                                                       // 811
  // Back when we supported arbitrary client-provided selectors, we actually                           // 812
  // rewrote the selector to include an _id clause before passing to Mongo to                          // 813
  // avoid races, but since selector is guaranteed to already just be an ID, we                        // 814
  // don't have to any more.                                                                           // 815
                                                                                                       // 816
  self._collection.update.call(                                                                        // 817
    self._collection, selector, mutator, options);                                                     // 818
};                                                                                                     // 819
                                                                                                       // 820
// Only allow these operations in validated updates. Specifically                                      // 821
// whitelist operations, rather than blacklist, so new complex                                         // 822
// operations that are added aren't automatically allowed. A complex                                   // 823
// operation is one that does more than just modify its target                                         // 824
// field. For now this contains all update operations except '$rename'.                                // 825
// http://docs.mongodb.org/manual/reference/operators/#update                                          // 826
var ALLOWED_UPDATE_OPERATIONS = {                                                                      // 827
  $inc:1, $set:1, $unset:1, $addToSet:1, $pop:1, $pullAll:1, $pull:1,                                  // 828
  $pushAll:1, $push:1, $bit:1                                                                          // 829
};                                                                                                     // 830
                                                                                                       // 831
// Simulate a mongo `remove` operation while validating access control                                 // 832
// rules. See #ValidatedChange                                                                         // 833
Meteor.Collection.prototype._validatedRemove = function(userId, selector) {                            // 834
  var self = this;                                                                                     // 835
                                                                                                       // 836
  var findOptions = {transform: null};                                                                 // 837
  if (!self._validators.fetchAllFields) {                                                              // 838
    findOptions.fields = {};                                                                           // 839
    _.each(self._validators.fetch, function(fieldName) {                                               // 840
      findOptions.fields[fieldName] = 1;                                                               // 841
    });                                                                                                // 842
  }                                                                                                    // 843
                                                                                                       // 844
  var doc = self._collection.findOne(selector, findOptions);                                           // 845
  if (!doc)                                                                                            // 846
    return;                                                                                            // 847
                                                                                                       // 848
  // call user validators.                                                                             // 849
  // Any deny returns true means denied.                                                               // 850
  if (_.any(self._validators.remove.deny, function(validator) {                                        // 851
    return validator(userId, transformDoc(validator, doc));                                            // 852
  })) {                                                                                                // 853
    throw new Meteor.Error(403, "Access denied");                                                      // 854
  }                                                                                                    // 855
  // Any allow returns true means proceed. Throw error if they all fail.                               // 856
  if (_.all(self._validators.remove.allow, function(validator) {                                       // 857
    return !validator(userId, transformDoc(validator, doc));                                           // 858
  })) {                                                                                                // 859
    throw new Meteor.Error(403, "Access denied");                                                      // 860
  }                                                                                                    // 861
                                                                                                       // 862
  // Back when we supported arbitrary client-provided selectors, we actually                           // 863
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to                       // 864
  // Mongo to avoid races, but since selector is guaranteed to already just be                         // 865
  // an ID, we don't have to any more.                                                                 // 866
                                                                                                       // 867
  self._collection.remove.call(self._collection, selector);                                            // 868
};                                                                                                     // 869
                                                                                                       // 870
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongo-livedata'] = {};

})();

//# sourceMappingURL=32cb8e7b8b1a4ecda94a731b3a18e434e3067a5f.map
