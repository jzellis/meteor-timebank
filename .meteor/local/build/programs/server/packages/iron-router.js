(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var RouteController, Route, Router, Utils, IronRouter, hasOld, paramParts;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/utils.js                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
/**                                                                                                  // 1
 * Utility methods available privately to the package.                                               // 2
 */                                                                                                  // 3
                                                                                                     // 4
Utils = {};                                                                                          // 5
                                                                                                     // 6
/**                                                                                                  // 7
 * global object on node or window object in the browser.                                            // 8
 */                                                                                                  // 9
                                                                                                     // 10
Utils.global = (function () { return this; })();                                                     // 11
                                                                                                     // 12
/**                                                                                                  // 13
 * deprecatation notice to the user which can be a string or object                                  // 14
 * of the form:                                                                                      // 15
 *                                                                                                   // 16
 * {                                                                                                 // 17
 *  name: 'somePropertyOrMethod',                                                                    // 18
 *  where: 'RouteController',                                                                        // 19
 *  instead: 'someOtherPropertyOrMethod',                                                            // 20
 *  message: ':name is deprecated. Please use :instead instead'                                      // 21
 * }                                                                                                 // 22
 */                                                                                                  // 23
Utils.notifyDeprecated = function (info) {                                                           // 24
  var name;                                                                                          // 25
  var instead;                                                                                       // 26
  var message;                                                                                       // 27
  var where;                                                                                         // 28
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";             // 29
                                                                                                     // 30
  if (_.isObject(info)) {                                                                            // 31
    name = info.name;                                                                                // 32
    instead = info.instead;                                                                          // 33
    message = info.message || defaultMessage;                                                        // 34
    where = info.where;                                                                              // 35
  } else {                                                                                           // 36
    message = info;                                                                                  // 37
    name = '';                                                                                       // 38
    instead = '';                                                                                    // 39
    where = '';                                                                                      // 40
  }                                                                                                  // 41
                                                                                                     // 42
  if (typeof console !== 'undefined' && console.warn) {                                              // 43
    console.warn(                                                                                    // 44
      '<deprecated> ' +                                                                              // 45
      message                                                                                        // 46
      .replace(':name', name)                                                                        // 47
      .replace(':instead', instead)                                                                  // 48
      .replace(':where', where)                                                                      // 49
    );                                                                                               // 50
  }                                                                                                  // 51
};                                                                                                   // 52
                                                                                                     // 53
Utils.withDeprecatedNotice = function (info, fn, thisArg) {                                          // 54
  return function () {                                                                               // 55
    Utils.notifyDeprecated(info);                                                                    // 56
    return fn && fn.apply(thisArg || this, arguments);                                               // 57
  };                                                                                                 // 58
};                                                                                                   // 59
                                                                                                     // 60
/**                                                                                                  // 61
 * Given the name of a property, resolves to the value. Works with namespacing                       // 62
 * too. If first parameter is already a value that isn't a string it's returned                      // 63
 * immediately.                                                                                      // 64
 *                                                                                                   // 65
 * Examples:                                                                                         // 66
 *  'SomeClass' => window.SomeClass || global.someClass                                              // 67
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                      // 68
 *                                                                                                   // 69
 * @param {String|Object} nameOrValue                                                                // 70
 */                                                                                                  // 71
                                                                                                     // 72
Utils.resolveValue = function (nameOrValue) {                                                        // 73
  var global = Utils.global;                                                                         // 74
  var parts;                                                                                         // 75
  var ptr;                                                                                           // 76
                                                                                                     // 77
  if (_.isString(nameOrValue)) {                                                                     // 78
    parts = nameOrValue.split('.')                                                                   // 79
    ptr = global;                                                                                    // 80
    for (var i = 0; i < parts.length; i++) {                                                         // 81
      ptr = ptr[parts[i]];                                                                           // 82
      if (!ptr)                                                                                      // 83
        return undefined;                                                                            // 84
    }                                                                                                // 85
  } else {                                                                                           // 86
    ptr = nameOrValue;                                                                               // 87
  }                                                                                                  // 88
                                                                                                     // 89
  // final position of ptr should be the resolved value                                              // 90
  return ptr;                                                                                        // 91
};                                                                                                   // 92
                                                                                                     // 93
Utils.hasOwnProperty = function (obj, key) {                                                         // 94
  var prop = {}.hasOwnProperty;                                                                      // 95
  return prop.call(obj, key);                                                                        // 96
};                                                                                                   // 97
                                                                                                     // 98
/**                                                                                                  // 99
 * Don't mess with this function. It's exactly the same as the compiled                              // 100
 * coffeescript mechanism. If you change it we can't guarantee that our code                         // 101
 * will work when used with Coffeescript. One exception is putting in a runtime                      // 102
 * check that both child and parent are of type Function.                                            // 103
 */                                                                                                  // 104
                                                                                                     // 105
Utils.inherits = function (child, parent) {                                                          // 106
  if (Utils.typeOf(child) !== '[object Function]')                                                   // 107
    throw new Error('First parameter to Utils.inherits must be a function');                         // 108
                                                                                                     // 109
  if (Utils.typeOf(parent) !== '[object Function]')                                                  // 110
    throw new Error('Second parameter to Utils.inherits must be a function');                        // 111
                                                                                                     // 112
  for (var key in parent) {                                                                          // 113
    if (Utils.hasOwnProperty(parent, key))                                                           // 114
      child[key] = parent[key];                                                                      // 115
  }                                                                                                  // 116
                                                                                                     // 117
  function ctor () {                                                                                 // 118
    this.constructor = child;                                                                        // 119
  }                                                                                                  // 120
                                                                                                     // 121
  ctor.prototype = parent.prototype;                                                                 // 122
  child.prototype = new ctor();                                                                      // 123
  child.__super__ = parent.prototype;                                                                // 124
  return child;                                                                                      // 125
};                                                                                                   // 126
                                                                                                     // 127
Utils.toArray = function (obj) {                                                                     // 128
  if (!obj)                                                                                          // 129
    return [];                                                                                       // 130
  else if (Utils.typeOf(obj) !== '[object Array]')                                                   // 131
    return [obj];                                                                                    // 132
  else                                                                                               // 133
    return obj;                                                                                      // 134
};                                                                                                   // 135
                                                                                                     // 136
Utils.typeOf = function (obj) {                                                                      // 137
  if (obj && obj.typeName)                                                                           // 138
    return obj.typeName;                                                                             // 139
  else                                                                                               // 140
    return Object.prototype.toString.call(obj);                                                      // 141
};                                                                                                   // 142
                                                                                                     // 143
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                               // 144
  if (arguments.length === 1)                                                                        // 145
    definition = Super;                                                                              // 146
  else {                                                                                             // 147
    definition = definition || {};                                                                   // 148
    definition.extend = Super;                                                                       // 149
  }                                                                                                  // 150
                                                                                                     // 151
  return Utils.create(definition, {                                                                  // 152
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                 // 153
  });                                                                                                // 154
};                                                                                                   // 155
                                                                                                     // 156
Utils.create = function (definition, options) {                                                      // 157
  var Constructor                                                                                    // 158
    , extendFrom                                                                                     // 159
    , savedPrototype;                                                                                // 160
                                                                                                     // 161
  options = options || {};                                                                           // 162
  definition = definition || {};                                                                     // 163
                                                                                                     // 164
  if (Utils.hasOwnProperty(definition, 'constructor'))                                               // 165
    Constructor = definition.constructor;                                                            // 166
  else {                                                                                             // 167
    Constructor = function () {                                                                      // 168
      if (Constructor.__super__ && Constructor.__super__.constructor)                                // 169
        return Constructor.__super__.constructor.apply(this, arguments);                             // 170
    }                                                                                                // 171
  }                                                                                                  // 172
                                                                                                     // 173
  extendFrom = definition.extend;                                                                    // 174
                                                                                                     // 175
  if (definition.extend) delete definition.extend;                                                   // 176
                                                                                                     // 177
  var inherit = function (Child, Super, prototype) {                                                 // 178
    Utils.inherits(Child, Utils.resolveValue(Super));                                                // 179
    if (prototype) _.extend(Child.prototype, prototype);                                             // 180
  };                                                                                                 // 181
                                                                                                     // 182
  if (extendFrom) {                                                                                  // 183
    inherit(Constructor, extendFrom);                                                                // 184
  }                                                                                                  // 185
                                                                                                     // 186
  if (options.onBeforeExtendPrototype)                                                               // 187
    options.onBeforeExtendPrototype.call(Constructor, definition);                                   // 188
                                                                                                     // 189
  _.extend(Constructor.prototype, definition);                                                       // 190
                                                                                                     // 191
  return Constructor;                                                                                // 192
};                                                                                                   // 193
                                                                                                     // 194
/**                                                                                                  // 195
 * Assert that the given condition is truthy.                                                        // 196
 *                                                                                                   // 197
 * @param {Boolean} condition The boolean condition to test for truthiness.                          // 198
 * @param {String} msg The error message to show if the condition is falsy.                          // 199
 */                                                                                                  // 200
                                                                                                     // 201
Utils.assert = function (condition, msg) {                                                           // 202
  if (!condition)                                                                                    // 203
    throw new Error(msg);                                                                            // 204
};                                                                                                   // 205
                                                                                                     // 206
Utils.warn = function (condition, msg) {                                                             // 207
  if (!condition)                                                                                    // 208
    console && console.warn && console.warn(msg);                                                    // 209
};                                                                                                   // 210
                                                                                                     // 211
Utils.capitalize = function (str) {                                                                  // 212
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                     // 213
};                                                                                                   // 214
                                                                                                     // 215
Utils.upperCamelCase = function (str) {                                                              // 216
  var re = /_|-|\./;                                                                                 // 217
                                                                                                     // 218
  if (!str)                                                                                          // 219
    return '';                                                                                       // 220
                                                                                                     // 221
  return _.map(str.split(re), function (word) {                                                      // 222
    return Utils.capitalize(word);                                                                   // 223
  }).join('');                                                                                       // 224
};                                                                                                   // 225
                                                                                                     // 226
Utils.camelCase = function (str) {                                                                   // 227
  var output = Utils.upperCamelCase(str);                                                            // 228
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                          // 229
  return output;                                                                                     // 230
};                                                                                                   // 231
                                                                                                     // 232
Utils.pick = function (/* args */) {                                                                 // 233
  var args = _.toArray(arguments)                                                                    // 234
    , arg;                                                                                           // 235
  for (var i = 0; i < args.length; i++) {                                                            // 236
    arg = args[i];                                                                                   // 237
    if (typeof arg !== 'undefined' && arg !== null)                                                  // 238
      return arg;                                                                                    // 239
  }                                                                                                  // 240
                                                                                                     // 241
  return null;                                                                                       // 242
};                                                                                                   // 243
                                                                                                     // 244
Utils.StringConverters = {                                                                           // 245
  'none': function(input) {                                                                          // 246
    return input;                                                                                    // 247
  },                                                                                                 // 248
                                                                                                     // 249
  'upperCamelCase': function (input) {                                                               // 250
    return Utils.upperCamelCase(input);                                                              // 251
  },                                                                                                 // 252
                                                                                                     // 253
  'camelCase': function (input) {                                                                    // 254
    return Utils.camelCase(input);                                                                   // 255
  }                                                                                                  // 256
};                                                                                                   // 257
                                                                                                     // 258
Utils.rewriteLegacyHooks = function (obj) {                                                          // 259
  var legacyToNew = IronRouter.LEGACY_HOOK_TYPES;                                                    // 260
                                                                                                     // 261
  _.each(legacyToNew, function (newHook, oldHook) {                                                  // 262
    // only look on the immediate object, not its                                                    // 263
    // proto chain                                                                                   // 264
    if (_.has(obj, oldHook)) {                                                                       // 265
      hasOld = true;                                                                                 // 266
      obj[newHook] = obj[oldHook];                                                                   // 267
                                                                                                     // 268
      Utils.notifyDeprecated({                                                                       // 269
        where: 'RouteController',                                                                    // 270
        name: oldHook,                                                                               // 271
        instead: newHook                                                                             // 272
      });                                                                                            // 273
    }                                                                                                // 274
  });                                                                                                // 275
};                                                                                                   // 276
                                                                                                     // 277
                                                                                                     // 278
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/route.js                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
/*                                                                                                   // 1
 * Inspiration and some code for the compilation of routes comes from pagejs.                        // 2
 * The original has been modified to better handle hash fragments, and to store                      // 3
 * the regular expression on the Route instance. Also, the resolve method has                        // 4
 * been added to return a resolved path given a parameters object.                                   // 5
 */                                                                                                  // 6
                                                                                                     // 7
Route = function (router, name, options) {                                                           // 8
  var path;                                                                                          // 9
                                                                                                     // 10
  Utils.assert(router instanceof IronRouter);                                                        // 11
                                                                                                     // 12
  Utils.assert(_.isString(name),                                                                     // 13
    'Route constructor requires a name as the second parameter');                                    // 14
                                                                                                     // 15
  if (_.isFunction(options))                                                                         // 16
    options = { handler: options };                                                                  // 17
                                                                                                     // 18
  options = this.options = options || {};                                                            // 19
  path = options.path || ('/' + name);                                                               // 20
                                                                                                     // 21
  this.router = router;                                                                              // 22
  this.originalPath = path;                                                                          // 23
                                                                                                     // 24
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                          // 25
    this.originalPath = '/' + this.originalPath;                                                     // 26
                                                                                                     // 27
  this.name = name;                                                                                  // 28
  this.where = options.where || 'client';                                                            // 29
  this.controller = options.controller;                                                              // 30
  this.action = options.action;                                                                      // 31
                                                                                                     // 32
  if (typeof options.reactive !== 'undefined')                                                       // 33
    this.isReactive = options.reactive;                                                              // 34
  else                                                                                               // 35
    this.isReactive = true;                                                                          // 36
                                                                                                     // 37
  Utils.rewriteLegacyHooks(this.options);                                                            // 38
                                                                                                     // 39
  this.compile();                                                                                    // 40
};                                                                                                   // 41
                                                                                                     // 42
Route.prototype = {                                                                                  // 43
  constructor: Route,                                                                                // 44
                                                                                                     // 45
  /**                                                                                                // 46
   * Compile the path.                                                                               // 47
   *                                                                                                 // 48
   *  @return {Route}                                                                                // 49
   *  @api public                                                                                    // 50
   */                                                                                                // 51
                                                                                                     // 52
  compile: function () {                                                                             // 53
    var self = this;                                                                                 // 54
    var path;                                                                                        // 55
    var options = self.options;                                                                      // 56
                                                                                                     // 57
    this.keys = [];                                                                                  // 58
                                                                                                     // 59
    if (self.originalPath instanceof RegExp) {                                                       // 60
      self.re = self.originalPath;                                                                   // 61
    } else {                                                                                         // 62
      path = self.originalPath                                                                       // 63
        .replace(/(.)\/$/, '$1')                                                                     // 64
        .concat(options.strict ? '' : '/?')                                                          // 65
        .replace(/\/\(/g, '(?:/')                                                                    // 66
        .replace(/#/, '/?#')                                                                         // 67
        .replace(                                                                                    // 68
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 69
          function (match, slash, format, key, capture, optional){                                   // 70
            self.keys.push({ name: key, optional: !! optional });                                    // 71
            slash = slash || '';                                                                     // 72
            return ''                                                                                // 73
              + (optional ? '' : slash)                                                              // 74
              + '(?:'                                                                                // 75
              + (optional ? slash : '')                                                              // 76
              + (format || '')                                                                       // 77
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                             // 78
              + (optional || '');                                                                    // 79
          }                                                                                          // 80
        )                                                                                            // 81
        .replace(/([\/.])/g, '\\$1')                                                                 // 82
        .replace(/\*/g, '(.*)');                                                                     // 83
                                                                                                     // 84
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                          // 85
    }                                                                                                // 86
                                                                                                     // 87
    return this;                                                                                     // 88
  },                                                                                                 // 89
                                                                                                     // 90
  /**                                                                                                // 91
   * Returns an array of parameters given a path. The array may have named                           // 92
   * properties in addition to indexed values.                                                       // 93
   *                                                                                                 // 94
   * @param {String} path                                                                            // 95
   * @return {Array}                                                                                 // 96
   * @api public                                                                                     // 97
   */                                                                                                // 98
                                                                                                     // 99
  params: function (path) {                                                                          // 100
    if (!path)                                                                                       // 101
      return null;                                                                                   // 102
                                                                                                     // 103
    var params = [];                                                                                 // 104
    var m = this.exec(path);                                                                         // 105
    var queryString;                                                                                 // 106
    var keys = this.keys;                                                                            // 107
    var key;                                                                                         // 108
    var value;                                                                                       // 109
                                                                                                     // 110
    if (!m)                                                                                          // 111
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"'); // 112
                                                                                                     // 113
    for (var i = 1, len = m.length; i < len; ++i) {                                                  // 114
      key = keys[i - 1];                                                                             // 115
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                             // 116
      if (key) {                                                                                     // 117
        params[key.name] = params[key.name] !== undefined ?                                          // 118
          params[key.name] : value;                                                                  // 119
      } else                                                                                         // 120
        params.push(value);                                                                          // 121
    }                                                                                                // 122
                                                                                                     // 123
    path = decodeURI(path);                                                                          // 124
                                                                                                     // 125
    queryString = path.split('?')[1];                                                                // 126
    if (queryString)                                                                                 // 127
      queryString = queryString.split('#')[0];                                                       // 128
                                                                                                     // 129
    params.hash = path.split('#')[1];                                                                // 130
                                                                                                     // 131
    if (queryString) {                                                                               // 132
      _.each(queryString.split('&'), function (paramString) {                                        // 133
        paramParts = paramString.split('=');                                                         // 134
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                   // 135
      });                                                                                            // 136
    }                                                                                                // 137
                                                                                                     // 138
    return params;                                                                                   // 139
  },                                                                                                 // 140
                                                                                                     // 141
  normalizePath: function (path) {                                                                   // 142
    var origin = Meteor.absoluteUrl();                                                               // 143
                                                                                                     // 144
    path = path.replace(origin, '');                                                                 // 145
                                                                                                     // 146
    var queryStringIndex = path.indexOf('?');                                                        // 147
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                               // 148
                                                                                                     // 149
    var hashIndex = path.indexOf('#');                                                               // 150
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                             // 151
                                                                                                     // 152
    if (path.charAt(0) !== '/')                                                                      // 153
      path = '/' + path;                                                                             // 154
                                                                                                     // 155
    return path;                                                                                     // 156
  },                                                                                                 // 157
                                                                                                     // 158
  /**                                                                                                // 159
   * Returns true if the path matches and false otherwise.                                           // 160
   *                                                                                                 // 161
   * @param {String} path                                                                            // 162
   * @return {Boolean}                                                                               // 163
   * @api public                                                                                     // 164
   */                                                                                                // 165
  test: function (path) {                                                                            // 166
    return this.re.test(this.normalizePath(path));                                                   // 167
  },                                                                                                 // 168
                                                                                                     // 169
  exec: function (path) {                                                                            // 170
    return this.re.exec(this.normalizePath(path));                                                   // 171
  },                                                                                                 // 172
                                                                                                     // 173
  resolve: function (params, options) {                                                              // 174
    var value;                                                                                       // 175
    var isValueDefined;                                                                              // 176
    var result;                                                                                      // 177
    var wildCardCount = 0;                                                                           // 178
    var path = this.originalPath;                                                                    // 179
    var hash;                                                                                        // 180
    var query;                                                                                       // 181
    var isMissingParams = false;                                                                     // 182
                                                                                                     // 183
    options = options || {};                                                                         // 184
    params = params || [];                                                                           // 185
    query = options.query;                                                                           // 186
    hash = options.hash && options.hash.toString();                                                  // 187
                                                                                                     // 188
    if (path instanceof RegExp) {                                                                    // 189
      throw new Error('Cannot currently resolve a regular expression path');                         // 190
    } else {                                                                                         // 191
      path = this.originalPath                                                                       // 192
        .replace(                                                                                    // 193
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 194
          function (match, slash, format, key, capture, optional, offset) {                          // 195
            slash = slash || '';                                                                     // 196
            value = params[key];                                                                     // 197
            isValueDefined = typeof value !== 'undefined';                                           // 198
                                                                                                     // 199
            if (optional && !isValueDefined) {                                                       // 200
              value = '';                                                                            // 201
            } else if (!isValueDefined) {                                                            // 202
              isMissingParams = true;                                                                // 203
              return;                                                                                // 204
            }                                                                                        // 205
                                                                                                     // 206
            value = _.isFunction(value) ? value.call(params) : value;                                // 207
            var escapedValue = _.map(String(value).split('/'), function (segment) {                  // 208
              return encodeURIComponent(segment);                                                    // 209
            }).join('/');                                                                            // 210
            return slash + escapedValue                                                              // 211
          }                                                                                          // 212
        )                                                                                            // 213
        .replace(                                                                                    // 214
          /\*/g,                                                                                     // 215
          function (match) {                                                                         // 216
            if (typeof params[wildCardCount] === 'undefined') {                                      // 217
              throw new Error(                                                                       // 218
                'You are trying to access a wild card parameter at index ' +                         // 219
                wildCardCount +                                                                      // 220
                ' but the value of params at that index is undefined');                              // 221
            }                                                                                        // 222
                                                                                                     // 223
            var paramValue = String(params[wildCardCount++]);                                        // 224
            return _.map(paramValue.split('/'), function (segment) {                                 // 225
              return encodeURIComponent(segment);                                                    // 226
            }).join('/');                                                                            // 227
          }                                                                                          // 228
        );                                                                                           // 229
                                                                                                     // 230
      if (_.isObject(query)) {                                                                       // 231
        query = _.map(_.pairs(query), function (queryPart) {                                         // 232
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                              // 233
        }).join('&');                                                                                // 234
      }                                                                                              // 235
                                                                                                     // 236
      if (query && query.length)                                                                     // 237
        path = path + '?' + query;                                                                   // 238
                                                                                                     // 239
      if (hash) {                                                                                    // 240
        hash = encodeURI(hash.replace('#', ''));                                                     // 241
        path = query ?                                                                               // 242
          path + '#' + hash : path + '/#' + hash;                                                    // 243
      }                                                                                              // 244
    }                                                                                                // 245
                                                                                                     // 246
    // Because of optional possibly empty segments we normalize path here                            // 247
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                         // 248
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                 // 249
                                                                                                     // 250
    return isMissingParams ? null : path;                                                            // 251
  },                                                                                                 // 252
                                                                                                     // 253
  path: function (params, options) {                                                                 // 254
    return this.resolve(params, options);                                                            // 255
  },                                                                                                 // 256
                                                                                                     // 257
  url: function (params, options) {                                                                  // 258
    var path = this.path(params, options);                                                           // 259
    if (path[0] === '/')                                                                             // 260
      path = path.slice(1, path.length);                                                             // 261
    return Meteor.absoluteUrl() + path;                                                              // 262
  },                                                                                                 // 263
                                                                                                     // 264
  getController: function (path, options) {                                                          // 265
    var self = this;                                                                                 // 266
    var handler;                                                                                     // 267
    var controllerClass;                                                                             // 268
    var controller;                                                                                  // 269
    var action;                                                                                      // 270
    var routeName;                                                                                   // 271
                                                                                                     // 272
    var resolveValue = Utils.resolveValue;                                                           // 273
    var toArray = Utils.toArray;                                                                     // 274
                                                                                                     // 275
    var findController = function (name) {                                                           // 276
      var controller = resolveValue(name);                                                           // 277
      if (typeof controller === 'undefined') {                                                       // 278
        throw new Error(                                                                             // 279
          'controller "' + name + '" is not defined');                                               // 280
      }                                                                                              // 281
                                                                                                     // 282
      return controller;                                                                             // 283
    };                                                                                               // 284
                                                                                                     // 285
    options = _.extend({}, options, {                                                                // 286
      path: path,                                                                                    // 287
      params: this.params(path),                                                                     // 288
      where: this.where,                                                                             // 289
      action: this.action                                                                            // 290
    });                                                                                              // 291
                                                                                                     // 292
    // case 1: controller option is defined on the route                                             // 293
    if (this.controller) {                                                                           // 294
      controllerClass = _.isString(this.controller) ?                                                // 295
        findController(this.controller) : this.controller;                                           // 296
      controller = new controllerClass(this.router, this, options);                                  // 297
      return controller;                                                                             // 298
    }                                                                                                // 299
                                                                                                     // 300
    // case 2: intelligently find the controller class in global namespace                           // 301
    routeName = this.name;                                                                           // 302
                                                                                                     // 303
    if (routeName) {                                                                                 // 304
      routeName = Router.convertRouteControllerName(routeName + 'Controller');                       // 305
      controllerClass = resolveValue(routeName);                                                     // 306
                                                                                                     // 307
      if (controllerClass) {                                                                         // 308
        controller = new controllerClass(this.router, this, options);                                // 309
        return controller;                                                                           // 310
      }                                                                                              // 311
    }                                                                                                // 312
                                                                                                     // 313
    // case 3: nothing found so create an anonymous controller                                       // 314
    return new RouteController(this.router, this, options);                                          // 315
  }                                                                                                  // 316
};                                                                                                   // 317
                                                                                                     // 318
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/route_controller.js                                                      //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
RouteController = function (router, route, options) {                                                // 1
  var self = this;                                                                                   // 2
                                                                                                     // 3
  if (!(router instanceof IronRouter))                                                               // 4
    throw new Error('RouteController requires a router');                                            // 5
                                                                                                     // 6
  if (!(route instanceof Route))                                                                     // 7
    throw new Error('RouteController requires a route');                                             // 8
                                                                                                     // 9
  options = this.options = options || {};                                                            // 10
                                                                                                     // 11
  this.router = router;                                                                              // 12
  this.route = route;                                                                                // 13
                                                                                                     // 14
  this.path = options.path || '';                                                                    // 15
  this.params = options.params || [];                                                                // 16
  this.where = options.where || 'client';                                                            // 17
  this.action = options.action || this.action;                                                       // 18
                                                                                                     // 19
  Utils.rewriteLegacyHooks(this.options);                                                            // 20
  Utils.rewriteLegacyHooks(this);                                                                    // 21
};                                                                                                   // 22
                                                                                                     // 23
RouteController.prototype = {                                                                        // 24
  constructor: RouteController,                                                                      // 25
                                                                                                     // 26
  /**                                                                                                // 27
   * Returns the value of a property, searching for the property in this lookup                      // 28
   * order:                                                                                          // 29
   *                                                                                                 // 30
   *   1. RouteController options                                                                    // 31
   *   2. RouteController prototype                                                                  // 32
   *   3. Route options                                                                              // 33
   *   4. Router options                                                                             // 34
   */                                                                                                // 35
  lookupProperty: function (key) {                                                                   // 36
    var value;                                                                                       // 37
                                                                                                     // 38
    if (!_.isString(key))                                                                            // 39
      throw new Error('key must be a string');                                                       // 40
                                                                                                     // 41
    // 1. RouteController options                                                                    // 42
    if (typeof (value = this.options[key]) !== 'undefined')                                          // 43
      return value;                                                                                  // 44
                                                                                                     // 45
    // 2. RouteController instance                                                                   // 46
    if (typeof (value = this[key]) !== 'undefined')                                                  // 47
      return value;                                                                                  // 48
                                                                                                     // 49
    var opts;                                                                                        // 50
                                                                                                     // 51
    // 3. Route options                                                                              // 52
    opts = this.route.options;                                                                       // 53
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 54
      return value;                                                                                  // 55
                                                                                                     // 56
    // 4. Router options                                                                             // 57
    opts = this.router.options;                                                                      // 58
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 59
      return value;                                                                                  // 60
                                                                                                     // 61
    // 5. Oops couldn't find property                                                                // 62
    return undefined;                                                                                // 63
  },                                                                                                 // 64
                                                                                                     // 65
  runHooks: function (hookName, more, cb) {                                                          // 66
    var self = this;                                                                                 // 67
    var ctor = this.constructor;                                                                     // 68
                                                                                                     // 69
    if (!_.isString(hookName))                                                                       // 70
      throw new Error('hookName must be a string');                                                  // 71
                                                                                                     // 72
    if (more && !_.isArray(more))                                                                    // 73
      throw new Error('more must be an array of functions');                                         // 74
                                                                                                     // 75
    var isPaused = false;                                                                            // 76
                                                                                                     // 77
    var lookupHook = function (nameOrFn) {                                                           // 78
      var fn = nameOrFn;                                                                             // 79
                                                                                                     // 80
      // if we already have a func just return it                                                    // 81
      if (_.isFunction(fn))                                                                          // 82
        return fn;                                                                                   // 83
                                                                                                     // 84
      // look up one of the out-of-box hooks like                                                    // 85
      // 'loaded or 'dataNotFound' if the nameOrFn is a                                              // 86
      // string                                                                                      // 87
      if (_.isString(fn)) {                                                                          // 88
        if (_.isFunction(Router.hooks[fn]))                                                          // 89
          return Router.hooks[fn];                                                                   // 90
      }                                                                                              // 91
                                                                                                     // 92
      // we couldn't find it so throw an error                                                       // 93
      throw new Error("No hook found named: ", nameOrFn);                                            // 94
    };                                                                                               // 95
                                                                                                     // 96
    // concatenate together hook arrays from the inheritance                                         // 97
    // heirarchy, starting at the top parent down to the child.                                      // 98
    var collectInheritedHooks = function (ctor) {                                                    // 99
      var hooks = [];                                                                                // 100
                                                                                                     // 101
      if (ctor.__super__)                                                                            // 102
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                     // 103
                                                                                                     // 104
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                        // 105
        hooks.concat(ctor.prototype[hookName]) : hooks;                                              // 106
    };                                                                                               // 107
                                                                                                     // 108
                                                                                                     // 109
    // get a list of hooks to run in the following order:                                            // 110
    // 1. RouteController option hooks                                                               // 111
    // 2. RouteController proto hooks (including inherited super to child)                           // 112
    // 3. RouteController object hooks                                                               // 113
    // 4. Router global hooks                                                                        // 114
    // 5. Route option hooks                                                                         // 115
    // 6. more                                                                                       // 116
                                                                                                     // 117
    var toArray = Utils.toArray;                                                                     // 118
    var routerHooks = this.router.getHooks(hookName, this.route.name);                               // 119
                                                                                                     // 120
    var opts;                                                                                        // 121
    opts = this.route.options;                                                                       // 122
    var routeOptionHooks = toArray(opts && opts[hookName]);                                          // 123
                                                                                                     // 124
    opts = this.options;                                                                             // 125
    var optionHooks = toArray(opts && opts[hookName]);                                               // 126
                                                                                                     // 127
    var protoHooks = collectInheritedHooks(this.constructor);                                        // 128
                                                                                                     // 129
    var objectHooks;                                                                                 // 130
    // don't accidentally grab the prototype hooks!                                                  // 131
    // this makes sure the hook is on the object itself                                              // 132
    // not on its constructor's prototype object.                                                    // 133
    if (_.has(this, hookName))                                                                       // 134
      objectHooks = toArray(this[hookName])                                                          // 135
    else                                                                                             // 136
      objectHooks = [];                                                                              // 137
                                                                                                     // 138
    var allHooks = optionHooks                                                                       // 139
      .concat(protoHooks)                                                                            // 140
      .concat(objectHooks)                                                                           // 141
      .concat(routeOptionHooks)                                                                      // 142
      .concat(routerHooks)                                                                           // 143
      .concat(more);                                                                                 // 144
                                                                                                     // 145
    var isPaused = false;                                                                            // 146
    var pauseFn = function () {                                                                      // 147
      isPaused = true;                                                                               // 148
    };                                                                                               // 149
                                                                                                     // 150
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                 // 151
      var hookFn = lookupHook(hook);                                                                 // 152
                                                                                                     // 153
      if (!isPaused && !this.isStopped)                                                              // 154
        hookFn.call(self, pauseFn, i);                                                               // 155
    }                                                                                                // 156
                                                                                                     // 157
    cb && cb.call(self, isPaused);                                                                   // 158
    return isPaused;                                                                                 // 159
  },                                                                                                 // 160
                                                                                                     // 161
  action: function () {                                                                              // 162
    throw new Error('not implemented');                                                              // 163
  },                                                                                                 // 164
                                                                                                     // 165
  stop: function (cb) {                                                                              // 166
    return this._stopController(cb);                                                                 // 167
  },                                                                                                 // 168
                                                                                                     // 169
  _stopController: function (cb) {                                                                   // 170
    var self = this;                                                                                 // 171
                                                                                                     // 172
    if (this.isStopped)                                                                              // 173
      return;                                                                                        // 174
                                                                                                     // 175
    self.isRunning = false;                                                                          // 176
    self.runHooks('onStop');                                                                         // 177
    self.isStopped = true;                                                                           // 178
    cb && cb.call(self);                                                                             // 179
  },                                                                                                 // 180
                                                                                                     // 181
  _run: function () {                                                                                // 182
    throw new Error('not implemented');                                                              // 183
  }                                                                                                  // 184
};                                                                                                   // 185
                                                                                                     // 186
_.extend(RouteController, {                                                                          // 187
  /**                                                                                                // 188
   * Inherit from RouteController                                                                    // 189
   *                                                                                                 // 190
   * @param {Object} definition Prototype properties for inherited class.                            // 191
   */                                                                                                // 192
                                                                                                     // 193
  extend: function (definition) {                                                                    // 194
    Utils.rewriteLegacyHooks(definition);                                                            // 195
                                                                                                     // 196
    return Utils.extend(this, definition, function (definition) {                                    // 197
      var klass = this;                                                                              // 198
                                                                                                     // 199
                                                                                                     // 200
      /*                                                                                             // 201
        Allow calling a class method from javascript, directly in the subclass                       // 202
        definition.                                                                                  // 203
                                                                                                     // 204
        Instead of this:                                                                             // 205
          MyController = RouteController.extend({...});                                              // 206
          MyController.before(function () {});                                                       // 207
                                                                                                     // 208
        You can do:                                                                                  // 209
          MyController = RouteController.extend({                                                    // 210
            before: function () {}                                                                   // 211
          });                                                                                        // 212
                                                                                                     // 213
        And in Coffeescript you can do:                                                              // 214
         MyController extends RouteController                                                        // 215
           @before function () {}                                                                    // 216
       */                                                                                            // 217
    });                                                                                              // 218
  }                                                                                                  // 219
});                                                                                                  // 220
                                                                                                     // 221
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/router.js                                                                //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
IronRouter = function (options) {                                                                    // 1
  var self = this;                                                                                   // 2
                                                                                                     // 3
  this.configure(options);                                                                           // 4
                                                                                                     // 5
  /**                                                                                                // 6
   * The routes array which doubles as a named route index by adding                                 // 7
   * properties to the array.                                                                        // 8
   *                                                                                                 // 9
   * @api public                                                                                     // 10
   */                                                                                                // 11
  this.routes = [];                                                                                  // 12
                                                                                                     // 13
  /**                                                                                                // 14
   * Default name conversions for controller                                                         // 15
   * and template lookup.                                                                            // 16
   */                                                                                                // 17
  this._nameConverters = {};                                                                         // 18
  this.setNameConverter('Template', 'none');                                                         // 19
  this.setNameConverter('RouteController', 'upperCamelCase');                                        // 20
                                                                                                     // 21
  this._globalHooks = {};                                                                            // 22
  _.each(IronRouter.HOOK_TYPES, function (type) {                                                    // 23
    self._globalHooks[type] = [];                                                                    // 24
                                                                                                     // 25
    // example:                                                                                      // 26
    //  self.onRun = function (hook, options) {                                                      // 27
    //    return self.addHook('onRun', hook, options);                                               // 28
    //  };                                                                                           // 29
    self[type] = function (hook, options) {                                                          // 30
      return self.addHook(type, hook, options);                                                      // 31
    };                                                                                               // 32
  });                                                                                                // 33
                                                                                                     // 34
  _.each(IronRouter.LEGACY_HOOK_TYPES, function (type, legacyType) {                                 // 35
    self[legacyType] = function () {                                                                 // 36
      Utils.notifyDeprecated({                                                                       // 37
        where: 'Router',                                                                             // 38
        name: legacyType,                                                                            // 39
        instead: type                                                                                // 40
      });                                                                                            // 41
                                                                                                     // 42
      return self[type].apply(this, arguments);                                                      // 43
    }                                                                                                // 44
  });                                                                                                // 45
};                                                                                                   // 46
                                                                                                     // 47
IronRouter.HOOK_TYPES = [                                                                            // 48
  'onRun',                                                                                           // 49
  'onData',                                                                                          // 50
  'onBeforeAction',                                                                                  // 51
  'onAfterAction',                                                                                   // 52
  'onStop',                                                                                          // 53
                                                                                                     // 54
  // not technically a hook but we'll use it                                                         // 55
  // in a similar way. This will cause waitOn                                                        // 56
  // to be added as a method to the Router and then                                                  // 57
  // it can be selectively applied to specific routes                                                // 58
  'waitOn'                                                                                           // 59
];                                                                                                   // 60
                                                                                                     // 61
IronRouter.LEGACY_HOOK_TYPES = {                                                                     // 62
  'load': 'onRun',                                                                                   // 63
  'before': 'onBeforeAction',                                                                        // 64
  'after': 'onAfterAction',                                                                          // 65
  'unload': 'onStop'                                                                                 // 66
};                                                                                                   // 67
                                                                                                     // 68
IronRouter.prototype = {                                                                             // 69
  constructor: IronRouter,                                                                           // 70
                                                                                                     // 71
  /**                                                                                                // 72
   * Configure instance with options. This can be called at any time. If the                         // 73
   * instance options object hasn't been created yet it is created here.                             // 74
   *                                                                                                 // 75
   * @param {Object} options                                                                         // 76
   * @return {IronRouter}                                                                            // 77
   * @api public                                                                                     // 78
   */                                                                                                // 79
                                                                                                     // 80
  configure: function (options) {                                                                    // 81
    var self = this;                                                                                 // 82
                                                                                                     // 83
    options = options || {};                                                                         // 84
    this.options = this.options || {};                                                               // 85
    _.extend(this.options, options);                                                                 // 86
                                                                                                     // 87
    // e.g. before: fn OR before: [fn1, fn2]                                                         // 88
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                   // 89
      if (self.options[type]) {                                                                      // 90
        _.each(Utils.toArray(self.options[type]), function(hook) {                                   // 91
          self.addHook(type, hook);                                                                  // 92
        });                                                                                          // 93
                                                                                                     // 94
        delete self.options[type];                                                                   // 95
      }                                                                                              // 96
    });                                                                                              // 97
                                                                                                     // 98
    _.each(IronRouter.LEGACY_HOOK_TYPES, function(type, legacyType) {                                // 99
      if (self.options[legacyType]) {                                                                // 100
        // XXX: warning?                                                                             // 101
        _.each(Utils.toArray(self.options[legacyType]), function(hook) {                             // 102
          self.addHook(type, hook);                                                                  // 103
        });                                                                                          // 104
                                                                                                     // 105
        delete self.options[legacyType];                                                             // 106
      }                                                                                              // 107
    });                                                                                              // 108
                                                                                                     // 109
    if (options.templateNameConverter)                                                               // 110
      this.setNameConverter('Template', options.templateNameConverter);                              // 111
                                                                                                     // 112
    if (options.routeControllerNameConverter)                                                        // 113
      this.setNameConverter('RouteController', options.routeControllerNameConverter);                // 114
                                                                                                     // 115
    return this;                                                                                     // 116
  },                                                                                                 // 117
                                                                                                     // 118
  convertTemplateName: function (input) {                                                            // 119
    var converter = this._nameConverters['Template'];                                                // 120
    if (!converter)                                                                                  // 121
      throw new Error('No name converter found for Template');                                       // 122
    return converter(input);                                                                         // 123
  },                                                                                                 // 124
                                                                                                     // 125
  convertRouteControllerName: function (input) {                                                     // 126
    var converter = this._nameConverters['RouteController'];                                         // 127
    if (!converter)                                                                                  // 128
      throw new Error('No name converter found for RouteController');                                // 129
    return converter(input);                                                                         // 130
  },                                                                                                 // 131
                                                                                                     // 132
  setNameConverter: function (key, stringOrFunc) {                                                   // 133
    var converter;                                                                                   // 134
                                                                                                     // 135
    if (_.isFunction(stringOrFunc))                                                                  // 136
      converter = stringOrFunc;                                                                      // 137
                                                                                                     // 138
    if (_.isString(stringOrFunc))                                                                    // 139
      converter = Utils.StringConverters[stringOrFunc];                                              // 140
                                                                                                     // 141
    if (!converter) {                                                                                // 142
      throw new Error('No converter found named: ' + stringOrFunc);                                  // 143
    }                                                                                                // 144
                                                                                                     // 145
    this._nameConverters[key] = converter;                                                           // 146
    return this;                                                                                     // 147
  },                                                                                                 // 148
                                                                                                     // 149
  /**                                                                                                // 150
   *                                                                                                 // 151
   * Add a hook to all routes. The hooks will apply to all routes,                                   // 152
   * unless you name routes to include or exclude via `only` and `except` options                    // 153
   *                                                                                                 // 154
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                             // 155
   * @param {Object} [options] Options to controll the hooks [optional]                              // 156
   * @param {Function} [hook] Callback to run                                                        // 157
   * @return {IronRouter}                                                                            // 158
   * @api public                                                                                     // 159
   *                                                                                                 // 160
   */                                                                                                // 161
                                                                                                     // 162
  addHook: function(type, hook, options) {                                                           // 163
    options = options || {}                                                                          // 164
                                                                                                     // 165
    if (options.only)                                                                                // 166
      options.only = Utils.toArray(options.only);                                                    // 167
    if (options.except)                                                                              // 168
      options.except = Utils.toArray(options.except);                                                // 169
                                                                                                     // 170
    this._globalHooks[type].push({options: options, hook: hook});                                    // 171
                                                                                                     // 172
    return this;                                                                                     // 173
  },                                                                                                 // 174
                                                                                                     // 175
  /**                                                                                                // 176
   *                                                                                                 // 177
   * Fetch the list of global hooks that apply to the given route name.                              // 178
   * Hooks are defined by the .addHook() function above.                                             // 179
   *                                                                                                 // 180
   * @param {String} [type] one of IronRouter.HOOK_TYPES                                             // 181
   * @param {String} [name] the name of the route we are interested in                               // 182
   * @return {[Function]} [hooks] an array of hooks to run                                           // 183
   * @api public                                                                                     // 184
   *                                                                                                 // 185
   */                                                                                                // 186
                                                                                                     // 187
  getHooks: function(type, name) {                                                                   // 188
    var hooks = [];                                                                                  // 189
                                                                                                     // 190
    _.each(this._globalHooks[type], function(hook) {                                                 // 191
      var options = hook.options;                                                                    // 192
                                                                                                     // 193
      if (options.except && _.include(options.except, name))                                         // 194
        return;                                                                                      // 195
                                                                                                     // 196
      if (options.only && ! _.include(options.only, name))                                           // 197
        return;                                                                                      // 198
                                                                                                     // 199
      hooks.push(hook.hook);                                                                         // 200
    });                                                                                              // 201
                                                                                                     // 202
    return hooks;                                                                                    // 203
  },                                                                                                 // 204
                                                                                                     // 205
                                                                                                     // 206
  /**                                                                                                // 207
   * Convenience function to define a bunch of routes at once. In the future we                      // 208
   * might call the callback with a custom dsl.                                                      // 209
   *                                                                                                 // 210
   * Example:                                                                                        // 211
   *  Router.map(function () {                                                                       // 212
   *    this.route('posts');                                                                         // 213
   *  });                                                                                            // 214
   *                                                                                                 // 215
   *  @param {Function} cb                                                                           // 216
   *  @return {IronRouter}                                                                           // 217
   *  @api public                                                                                    // 218
   */                                                                                                // 219
                                                                                                     // 220
  map: function (cb) {                                                                               // 221
    Utils.assert(_.isFunction(cb),                                                                   // 222
           'map requires a function as the first parameter');                                        // 223
    cb.call(this);                                                                                   // 224
    return this;                                                                                     // 225
  },                                                                                                 // 226
                                                                                                     // 227
  /**                                                                                                // 228
   * Define a new route. You must name the route, but as a second parameter you                      // 229
   * can either provide an object of options or a Route instance.                                    // 230
   *                                                                                                 // 231
   * @param {String} name The name of the route                                                      // 232
   * @param {Object} [options] Options to pass along to the route                                    // 233
   * @return {Route}                                                                                 // 234
   * @api public                                                                                     // 235
   */                                                                                                // 236
                                                                                                     // 237
  route: function (name, options) {                                                                  // 238
    var route;                                                                                       // 239
                                                                                                     // 240
    Utils.assert(_.isString(name), 'name is a required parameter');                                  // 241
                                                                                                     // 242
    if (options instanceof Route)                                                                    // 243
      route = options;                                                                               // 244
    else                                                                                             // 245
      route = new Route(this, name, options);                                                        // 246
                                                                                                     // 247
    this.routes[name] = route;                                                                       // 248
    this.routes.push(route);                                                                         // 249
    return route;                                                                                    // 250
  },                                                                                                 // 251
                                                                                                     // 252
  path: function (routeName, params, options) {                                                      // 253
    var route = this.routes[routeName];                                                              // 254
    Utils.warn(route,                                                                                // 255
     'You called Router.path for a route named ' + routeName + ' but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                     // 257
  },                                                                                                 // 258
                                                                                                     // 259
  url: function (routeName, params, options) {                                                       // 260
    var route = this.routes[routeName];                                                              // 261
    Utils.warn(route,                                                                                // 262
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                      // 264
  },                                                                                                 // 265
                                                                                                     // 266
  match: function (path) {                                                                           // 267
    return _.find(this.routes, function(r) { return r.test(path); });                                // 268
  },                                                                                                 // 269
                                                                                                     // 270
  dispatch: function (path, options, cb) {                                                           // 271
    var route = this.match(path);                                                                    // 272
                                                                                                     // 273
    if (! route)                                                                                     // 274
      return this.onRouteNotFound(path, options);                                                    // 275
                                                                                                     // 276
    if (route.where !== (Meteor.isClient ? 'client' : 'server'))                                     // 277
      return this.onUnhandled(path, options);                                                        // 278
                                                                                                     // 279
    var controller = route.getController(path, options);                                             // 280
    this.run(controller, cb);                                                                        // 281
  },                                                                                                 // 282
                                                                                                     // 283
  run: function (controller, cb) {                                                                   // 284
    var self = this;                                                                                 // 285
    var where = Meteor.isClient ? 'client' : 'server';                                               // 286
                                                                                                     // 287
    Utils.assert(controller, 'run requires a controller');                                           // 288
                                                                                                     // 289
    // one last check to see if we should handle the route here                                      // 290
    if (controller.where != where) {                                                                 // 291
      self.onUnhandled(controller.path, controller.options);                                         // 292
      return;                                                                                        // 293
    }                                                                                                // 294
                                                                                                     // 295
    var run = function () {                                                                          // 296
      self._currentController = controller;                                                          // 297
      // set the location                                                                            // 298
      cb && cb(controller);                                                                          // 299
      self._currentController._run();                                                                // 300
    };                                                                                               // 301
                                                                                                     // 302
    // if we already have a current controller let's stop it and then                                // 303
    // run the new one once the old controller is stopped. this will add                             // 304
    // the run function as an onInvalidate callback to the controller's                              // 305
    // computation. Otherwse, just run the new controller.                                           // 306
    if (this._currentController)                                                                     // 307
      this._currentController._stopController(run);                                                  // 308
    else                                                                                             // 309
      run();                                                                                         // 310
  },                                                                                                 // 311
                                                                                                     // 312
  onUnhandled: function (path, options) {                                                            // 313
    throw new Error('onUnhandled not implemented');                                                  // 314
  },                                                                                                 // 315
                                                                                                     // 316
  onRouteNotFound: function (path, options) {                                                        // 317
    throw new Error('Oh no! No route found for path: "' + path + '"');                               // 318
  }                                                                                                  // 319
};                                                                                                   // 320
                                                                                                     // 321
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/server/route_controller.js                                               //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
RouteController = Utils.extend(RouteController, {                                                    // 1
  constructor: function () {                                                                         // 2
    RouteController.__super__.constructor.apply(this, arguments);                                    // 3
    this.request = this.options.request;                                                             // 4
    this.response = this.options.response;                                                           // 5
    this.next = this.options.next;                                                                   // 6
                                                                                                     // 7
    this._dataValue = this.data || {};                                                               // 8
                                                                                                     // 9
    this.data = function (value) {                                                                   // 10
      if (value)                                                                                     // 11
        this._dataValue = value;                                                                     // 12
      else                                                                                           // 13
        return _.isFunction(this._dataValue) ? this._dataValue.call(this) : this._dataValue;         // 14
    };                                                                                               // 15
  },                                                                                                 // 16
                                                                                                     // 17
  _run: function () {                                                                                // 18
    var self = this                                                                                  // 19
      , args = _.toArray(arguments);                                                                 // 20
                                                                                                     // 21
    try {                                                                                            // 22
      // if we're already running, you can't call run again without                                  // 23
      // calling stop first.                                                                         // 24
      if (self.isRunning)                                                                            // 25
        throw new Error("You called _run without first calling stop");                               // 26
                                                                                                     // 27
      self.isRunning = true;                                                                         // 28
      self.isStopped = false;                                                                        // 29
                                                                                                     // 30
      var action = _.isFunction(self.action) ? self.action : self[self.action];                      // 31
      Utils.assert(action,                                                                           // 32
        "You don't have an action named \"" + self.action + "\" defined on your RouteController");   // 33
                                                                                                     // 34
      this.runHooks('onRun');                                                                        // 35
      this.runHooks('onBeforeAction');                                                               // 36
      action.call(this);                                                                             // 37
      this.runHooks('onAfterAction');                                                                // 38
                                                                                                     // 39
    } catch (e) {                                                                                    // 40
      console.error(e.toString());                                                                   // 41
      this.response.end();                                                                           // 42
    } finally {                                                                                      // 43
      this.response.end();                                                                           // 44
    }                                                                                                // 45
  },                                                                                                 // 46
                                                                                                     // 47
  action: function () {                                                                              // 48
    this.response.end();                                                                             // 49
  }                                                                                                  // 50
});                                                                                                  // 51
                                                                                                     // 52
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/server/router.js                                                         //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
var connect = Npm.require('connect');                                                                // 1
var Fiber = Npm.require('fibers');                                                                   // 2
                                                                                                     // 3
var root = global;                                                                                   // 4
                                                                                                     // 5
var connectHandlers                                                                                  // 6
  , connect;                                                                                         // 7
                                                                                                     // 8
if (typeof __meteor_bootstrap__.app !== 'undefined') {                                               // 9
  connectHandlers = __meteor_bootstrap__.app;                                                        // 10
} else {                                                                                             // 11
  connectHandlers = WebApp.connectHandlers;                                                          // 12
}                                                                                                    // 13
                                                                                                     // 14
IronRouter = Utils.extend(IronRouter, {                                                              // 15
  constructor: function (options) {                                                                  // 16
    var self = this;                                                                                 // 17
    IronRouter.__super__.constructor.apply(this, arguments);                                         // 18
    Meteor.startup(function () {                                                                     // 19
      setTimeout(function () {                                                                       // 20
        if (self.options.autoStart !== false)                                                        // 21
          self.start();                                                                              // 22
      });                                                                                            // 23
    });                                                                                              // 24
  },                                                                                                 // 25
                                                                                                     // 26
  start: function () {                                                                               // 27
    connectHandlers                                                                                  // 28
      .use(connect.query())                                                                          // 29
      .use(connect.bodyParser())                                                                     // 30
      .use(_.bind(this.onRequest, this));                                                            // 31
  },                                                                                                 // 32
                                                                                                     // 33
  onRequest: function (req, res, next) {                                                             // 34
    var self = this;                                                                                 // 35
    Fiber(function () {                                                                              // 36
      self.dispatch(req.url, {                                                                       // 37
        request: req,                                                                                // 38
        response: res,                                                                               // 39
        next: next                                                                                   // 40
      });                                                                                            // 41
    }).run();                                                                                        // 42
  },                                                                                                 // 43
                                                                                                     // 44
  run: function (controller, cb) {                                                                   // 45
    IronRouter.__super__.run.apply(this, arguments);                                                 // 46
    if (controller === this._currentController)                                                      // 47
      cb && cb(controller);                                                                          // 48
  },                                                                                                 // 49
                                                                                                     // 50
  stop: function () {                                                                                // 51
  },                                                                                                 // 52
                                                                                                     // 53
  onUnhandled: function (path, options) {                                                            // 54
    options.next();                                                                                  // 55
  },                                                                                                 // 56
                                                                                                     // 57
  onRouteNotFound: function (path, options) {                                                        // 58
    options.next();                                                                                  // 59
  }                                                                                                  // 60
});                                                                                                  // 61
                                                                                                     // 62
Router = new IronRouter;                                                                             // 63
                                                                                                     // 64
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron-router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  Utils: Utils,
  IronRouter: IronRouter
};

})();
