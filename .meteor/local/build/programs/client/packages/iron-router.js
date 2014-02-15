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
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Template = Package.templating.Template;
var Handlebars = Package.handlebars.Handlebars;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Spark = Package.spark.Spark;

/* Package-scope variables */
var RouteController, Route, Router, IronLocation, Utils, IronRouteController, IronRouter, PageManager, ClientRouter, paramParts, href, setState, WaitList;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/utils.js                                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/**                                                                                                             // 1
 * Utility methods available privately to the package.                                                          // 2
 */                                                                                                             // 3
                                                                                                                // 4
Utils = {};                                                                                                     // 5
                                                                                                                // 6
/**                                                                                                             // 7
 * Returns global on node or window in the browser.                                                             // 8
 */                                                                                                             // 9
                                                                                                                // 10
Utils.global = function () {                                                                                    // 11
  if (typeof window !== 'undefined')                                                                            // 12
    return window;                                                                                              // 13
  else if (typeof global !== 'undefined')                                                                       // 14
    return global;                                                                                              // 15
  else                                                                                                          // 16
    return null;                                                                                                // 17
};                                                                                                              // 18
                                                                                                                // 19
/**                                                                                                             // 20
 * Given the name of a property, resolves to the value. Works with namespacing                                  // 21
 * too. If first parameter is already a value that isn't a string it's returned                                 // 22
 * immediately.                                                                                                 // 23
 *                                                                                                              // 24
 * Examples:                                                                                                    // 25
 *  'SomeClass' => window.SomeClass || global.someClass                                                         // 26
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                                 // 27
 *                                                                                                              // 28
 * @param {String|Object} nameOrValue                                                                           // 29
 */                                                                                                             // 30
                                                                                                                // 31
Utils.resolveValue = function (nameOrValue) {                                                                   // 32
  var global = Utils.global()                                                                                   // 33
    , parts                                                                                                     // 34
    , ptr;                                                                                                      // 35
                                                                                                                // 36
  if (_.isString(nameOrValue)) {                                                                                // 37
    parts = nameOrValue.split('.')                                                                              // 38
    ptr = global;                                                                                               // 39
    for (var i = 0; i < parts.length; i++) {                                                                    // 40
      ptr = ptr[parts[i]];                                                                                      // 41
      if (!ptr)                                                                                                 // 42
        return undefined;                                                                                       // 43
    }                                                                                                           // 44
  } else {                                                                                                      // 45
    ptr = nameOrValue;                                                                                          // 46
  }                                                                                                             // 47
                                                                                                                // 48
  // final position of ptr should be the resolved value                                                         // 49
  return ptr;                                                                                                   // 50
};                                                                                                              // 51
                                                                                                                // 52
Utils.hasOwnProperty = function (obj, key) {                                                                    // 53
  var prop = {}.hasOwnProperty;                                                                                 // 54
  return prop.call(obj, key);                                                                                   // 55
};                                                                                                              // 56
                                                                                                                // 57
/**                                                                                                             // 58
 * Don't mess with this function. It's exactly the same as the compiled                                         // 59
 * coffeescript mechanism. If you change it we can't guarantee that our code                                    // 60
 * will work when used with Coffeescript. One exception is putting in a runtime                                 // 61
 * check that both child and parent are of type Function.                                                       // 62
 */                                                                                                             // 63
                                                                                                                // 64
Utils.inherits = function (child, parent) {                                                                     // 65
  if (Utils.typeOf(child) !== '[object Function]')                                                              // 66
    throw new Error('First parameter to Utils.inherits must be a function');                                    // 67
                                                                                                                // 68
  if (Utils.typeOf(parent) !== '[object Function]')                                                             // 69
    throw new Error('Second parameter to Utils.inherits must be a function');                                   // 70
                                                                                                                // 71
  for (var key in parent) {                                                                                     // 72
    if (Utils.hasOwnProperty(parent, key))                                                                      // 73
      child[key] = parent[key];                                                                                 // 74
  }                                                                                                             // 75
                                                                                                                // 76
  function ctor () {                                                                                            // 77
    this.constructor = child;                                                                                   // 78
  }                                                                                                             // 79
                                                                                                                // 80
  ctor.prototype = parent.prototype;                                                                            // 81
  child.prototype = new ctor();                                                                                 // 82
  child.__super__ = parent.prototype;                                                                           // 83
  return child;                                                                                                 // 84
};                                                                                                              // 85
                                                                                                                // 86
Utils.toArray = function (obj) {                                                                                // 87
  if (!obj)                                                                                                     // 88
    return [];                                                                                                  // 89
  else if (Utils.typeOf(obj) !== '[object Array]')                                                              // 90
    return [obj];                                                                                               // 91
  else                                                                                                          // 92
    return obj;                                                                                                 // 93
};                                                                                                              // 94
                                                                                                                // 95
Utils.typeOf = function (obj) {                                                                                 // 96
  if (obj && obj.typeName)                                                                                      // 97
    return obj.typeName;                                                                                        // 98
  else                                                                                                          // 99
    return Object.prototype.toString.call(obj);                                                                 // 100
};                                                                                                              // 101
                                                                                                                // 102
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                                          // 103
  if (arguments.length === 1)                                                                                   // 104
    definition = Super;                                                                                         // 105
  else {                                                                                                        // 106
    definition = definition || {};                                                                              // 107
    definition.extend = Super;                                                                                  // 108
  }                                                                                                             // 109
                                                                                                                // 110
  return Utils.create(definition, {                                                                             // 111
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                            // 112
  });                                                                                                           // 113
};                                                                                                              // 114
                                                                                                                // 115
Utils.create = function (definition, options) {                                                                 // 116
  var Constructor                                                                                               // 117
    , extendFrom                                                                                                // 118
    , savedPrototype;                                                                                           // 119
                                                                                                                // 120
  options = options || {};                                                                                      // 121
  definition = definition || {};                                                                                // 122
                                                                                                                // 123
  if (Utils.hasOwnProperty(definition, 'constructor'))                                                          // 124
    Constructor = definition.constructor;                                                                       // 125
  else {                                                                                                        // 126
    Constructor = function () {                                                                                 // 127
      if (Constructor.__super__ && Constructor.__super__.constructor)                                           // 128
        return Constructor.__super__.constructor.apply(this, arguments);                                        // 129
    }                                                                                                           // 130
  }                                                                                                             // 131
                                                                                                                // 132
  extendFrom = definition.extend;                                                                               // 133
                                                                                                                // 134
  if (definition.extend) delete definition.extend;                                                              // 135
                                                                                                                // 136
  var inherit = function (Child, Super, prototype) {                                                            // 137
    Utils.inherits(Child, Utils.resolveValue(Super));                                                           // 138
    if (prototype) _.extend(Child.prototype, prototype);                                                        // 139
  };                                                                                                            // 140
                                                                                                                // 141
  if (extendFrom) {                                                                                             // 142
    inherit(Constructor, extendFrom);                                                                           // 143
  }                                                                                                             // 144
                                                                                                                // 145
  if (options.onBeforeExtendPrototype)                                                                          // 146
    options.onBeforeExtendPrototype.call(Constructor, definition);                                              // 147
                                                                                                                // 148
  _.extend(Constructor.prototype, definition);                                                                  // 149
                                                                                                                // 150
  return Constructor;                                                                                           // 151
};                                                                                                              // 152
                                                                                                                // 153
/**                                                                                                             // 154
 * Assert that the given condition is truthy.                                                                   // 155
 *                                                                                                              // 156
 * @param {Boolean} condition The boolean condition to test for truthiness.                                     // 157
 * @param {String} msg The error message to show if the condition is falsy.                                     // 158
 */                                                                                                             // 159
                                                                                                                // 160
Utils.assert = function (condition, msg) {                                                                      // 161
  if (!condition)                                                                                               // 162
    throw new Error(msg);                                                                                       // 163
};                                                                                                              // 164
                                                                                                                // 165
Utils.warn = function (condition, msg) {                                                                        // 166
  if (!condition)                                                                                               // 167
    console && console.warn && console.warn(msg);                                                               // 168
};                                                                                                              // 169
                                                                                                                // 170
Utils.capitalize = function (str) {                                                                             // 171
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                                // 172
};                                                                                                              // 173
                                                                                                                // 174
Utils.classify = function (str) {                                                                               // 175
  var re = /_|-|\./;                                                                                            // 176
  return _.map(str.split(re), function (word) {                                                                 // 177
    return Utils.capitalize(word);                                                                              // 178
  }).join('');                                                                                                  // 179
};                                                                                                              // 180
                                                                                                                // 181
Utils.pick = function (/* args */) {                                                                            // 182
  var args = _.toArray(arguments)                                                                               // 183
    , arg;                                                                                                      // 184
  for (var i = 0; i < args.length; i++) {                                                                       // 185
    arg = args[i];                                                                                              // 186
    if (typeof arg !== 'undefined' && arg !== null)                                                             // 187
      return arg;                                                                                               // 188
  }                                                                                                             // 189
                                                                                                                // 190
  return null;                                                                                                  // 191
};                                                                                                              // 192
                                                                                                                // 193
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/route.js                                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*                                                                                                              // 1
 * Inspiration and some code for the compilation of routes comes from pagejs.                                   // 2
 * The original has been modified to better handle hash fragments, and to store                                 // 3
 * the regular expression on the Route instance. Also, the resolve method has                                   // 4
 * been added to return a resolved path given a parameters object.                                              // 5
 */                                                                                                             // 6
                                                                                                                // 7
Route = function (router, name, options) {                                                                      // 8
  var path;                                                                                                     // 9
                                                                                                                // 10
  Utils.assert(router instanceof IronRouter);                                                                   // 11
                                                                                                                // 12
  Utils.assert(_.isString(name),                                                                                // 13
    'Route constructor requires a name as the second parameter');                                               // 14
                                                                                                                // 15
  if (_.isFunction(options))                                                                                    // 16
    options = { handler: options };                                                                             // 17
                                                                                                                // 18
  options = this.options = options || {};                                                                       // 19
  path = options.path || ('/' + name);                                                                          // 20
                                                                                                                // 21
  this.router = router;                                                                                         // 22
  this.originalPath = path;                                                                                     // 23
                                                                                                                // 24
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                                     // 25
    this.originalPath = '/' + this.originalPath;                                                                // 26
                                                                                                                // 27
  this.name = name;                                                                                             // 28
  this.where = options.where || 'client';                                                                       // 29
  this.controller = options.controller;                                                                         // 30
                                                                                                                // 31
  if (typeof options.reactive !== 'undefined')                                                                  // 32
    this.isReactive = options.reactive;                                                                         // 33
  else                                                                                                          // 34
    this.isReactive = true;                                                                                     // 35
                                                                                                                // 36
  this.compile();                                                                                               // 37
};                                                                                                              // 38
                                                                                                                // 39
Route.prototype = {                                                                                             // 40
  constructor: Route,                                                                                           // 41
                                                                                                                // 42
  /**                                                                                                           // 43
   * Compile the path.                                                                                          // 44
   *                                                                                                            // 45
   *  @return {Route}                                                                                           // 46
   *  @api public                                                                                               // 47
   */                                                                                                           // 48
                                                                                                                // 49
  compile: function () {                                                                                        // 50
    var self = this                                                                                             // 51
      , path                                                                                                    // 52
      , options = self.options;                                                                                 // 53
                                                                                                                // 54
    this.keys = [];                                                                                             // 55
                                                                                                                // 56
    if (self.originalPath instanceof RegExp) {                                                                  // 57
      self.re = self.originalPath;                                                                              // 58
    } else {                                                                                                    // 59
      path = self.originalPath                                                                                  // 60
        .replace(/(.)\/$/, '$1')                                                                                // 61
        .concat(options.strict ? '' : '/?')                                                                     // 62
        .replace(/\/\(/g, '(?:/')                                                                               // 63
        .replace(/#/, '/?#')                                                                                    // 64
        .replace(                                                                                               // 65
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                               // 66
          function (match, slash, format, key, capture, optional){                                              // 67
            self.keys.push({ name: key, optional: !! optional });                                               // 68
            slash = slash || '';                                                                                // 69
            return ''                                                                                           // 70
              + (optional ? '' : slash)                                                                         // 71
              + '(?:'                                                                                           // 72
              + (optional ? slash : '')                                                                         // 73
              + (format || '')                                                                                  // 74
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                                        // 75
              + (optional || '');                                                                               // 76
          }                                                                                                     // 77
        )                                                                                                       // 78
        .replace(/([\/.])/g, '\\$1')                                                                            // 79
        .replace(/\*/g, '(.*)');                                                                                // 80
                                                                                                                // 81
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                                     // 82
    }                                                                                                           // 83
                                                                                                                // 84
    return this;                                                                                                // 85
  },                                                                                                            // 86
                                                                                                                // 87
  /**                                                                                                           // 88
   * Returns an array of parameters given a path. The array may have named                                      // 89
   * properties in addition to indexed values.                                                                  // 90
   *                                                                                                            // 91
   * @param {String} path                                                                                       // 92
   * @return {Array}                                                                                            // 93
   * @api public                                                                                                // 94
   */                                                                                                           // 95
                                                                                                                // 96
  params: function (path) {                                                                                     // 97
    if (!path) return null;                                                                                     // 98
                                                                                                                // 99
    var params = []                                                                                             // 100
      , m = this.exec(path)                                                                                     // 101
      , queryString                                                                                             // 102
      , keys = this.keys                                                                                        // 103
      , key                                                                                                     // 104
      , value;                                                                                                  // 105
                                                                                                                // 106
    if (!m)                                                                                                     // 107
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"');            // 108
                                                                                                                // 109
    for (var i = 1, len = m.length; i < len; ++i) {                                                             // 110
      key = keys[i - 1];                                                                                        // 111
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                                        // 112
      if (key) {                                                                                                // 113
        params[key.name] = params[key.name] !== undefined ?                                                     // 114
          params[key.name] : value;                                                                             // 115
      } else                                                                                                    // 116
        params.push(value);                                                                                     // 117
    }                                                                                                           // 118
                                                                                                                // 119
    path = decodeURI(path);                                                                                     // 120
                                                                                                                // 121
    queryString = path.split('?')[1];                                                                           // 122
    if (queryString)                                                                                            // 123
      queryString = queryString.split('#')[0];                                                                  // 124
                                                                                                                // 125
    params.hash = path.split('#')[1];                                                                           // 126
                                                                                                                // 127
    if (queryString) {                                                                                          // 128
      _.each(queryString.split('&'), function (paramString) {                                                   // 129
        paramParts = paramString.split('=');                                                                    // 130
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                              // 131
      });                                                                                                       // 132
    }                                                                                                           // 133
                                                                                                                // 134
    return params;                                                                                              // 135
  },                                                                                                            // 136
                                                                                                                // 137
  normalizePath: function (path) {                                                                              // 138
    var origin = Meteor.absoluteUrl();                                                                          // 139
                                                                                                                // 140
    path = path.replace(origin, '');                                                                            // 141
                                                                                                                // 142
    var queryStringIndex = path.indexOf('?');                                                                   // 143
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                                          // 144
                                                                                                                // 145
    var hashIndex = path.indexOf('#');                                                                          // 146
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                                        // 147
                                                                                                                // 148
    if (path.charAt(0) !== '/')                                                                                 // 149
      path = '/' + path;                                                                                        // 150
                                                                                                                // 151
    return path;                                                                                                // 152
  },                                                                                                            // 153
                                                                                                                // 154
  /**                                                                                                           // 155
   * Returns true if the path matches and false otherwise.                                                      // 156
   *                                                                                                            // 157
   * @param {String} path                                                                                       // 158
   * @return {Boolean}                                                                                          // 159
   * @api public                                                                                                // 160
   */                                                                                                           // 161
  test: function (path) {                                                                                       // 162
    return this.re.test(this.normalizePath(path));                                                              // 163
  },                                                                                                            // 164
                                                                                                                // 165
  exec: function (path) {                                                                                       // 166
    return this.re.exec(this.normalizePath(path));                                                              // 167
  },                                                                                                            // 168
                                                                                                                // 169
  resolve: function (params, options) {                                                                         // 170
    var value                                                                                                   // 171
      , isValueDefined                                                                                          // 172
      , result                                                                                                  // 173
      , wildCardCount = 0                                                                                       // 174
      , path = this.originalPath                                                                                // 175
      , hash                                                                                                    // 176
      , query                                                                                                   // 177
      , isMissingParams = false;                                                                                // 178
                                                                                                                // 179
    options = options || {};                                                                                    // 180
    params = params || [];                                                                                      // 181
    query = options.query;                                                                                      // 182
    hash = options.hash;                                                                                        // 183
                                                                                                                // 184
    if (path instanceof RegExp) {                                                                               // 185
      throw new Error('Cannot currently resolve a regular expression path');                                    // 186
    } else {                                                                                                    // 187
      path = this.originalPath                                                                                  // 188
        .replace(                                                                                               // 189
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                               // 190
          function (match, slash, format, key, capture, optional, offset) {                                     // 191
            slash = slash || '';                                                                                // 192
            value = params[key];                                                                                // 193
            isValueDefined = typeof value !== 'undefined';                                                      // 194
                                                                                                                // 195
            if (optional && !isValueDefined) {                                                                  // 196
              value = '';                                                                                       // 197
            } else if (!isValueDefined) {                                                                       // 198
              isMissingParams = true;                                                                           // 199
              console.warn('You called Route.prototype.resolve with a missing parameter. "' + key + '" not found in params');
              return;                                                                                           // 201
              //throw new Error('You called Route.prototype.resolve with a missing parameter. "' + key + '" not found in params');
            }                                                                                                   // 203
                                                                                                                // 204
            value = _.isFunction(value) ? value.call(params) : value;                                           // 205
            var escapedValue = _.map(String(value).split('/'), function (segment) {                             // 206
              return encodeURIComponent(segment);                                                               // 207
            }).join('/');                                                                                       // 208
            return slash + escapedValue                                                                         // 209
          }                                                                                                     // 210
        )                                                                                                       // 211
        .replace(                                                                                               // 212
          /\*/g,                                                                                                // 213
          function (match) {                                                                                    // 214
            if (typeof params[wildCardCount] === 'undefined') {                                                 // 215
              throw new Error(                                                                                  // 216
                'You are trying to access a wild card parameter at index ' +                                    // 217
                wildCardCount +                                                                                 // 218
                ' but the value of params at that index is undefined');                                         // 219
            }                                                                                                   // 220
                                                                                                                // 221
            var paramValue = String(params[wildCardCount++]);                                                   // 222
            return _.map(paramValue.split('/'), function (segment) {                                            // 223
              return encodeURIComponent(segment);                                                               // 224
            }).join('/');                                                                                       // 225
          }                                                                                                     // 226
        );                                                                                                      // 227
                                                                                                                // 228
      if (_.isObject(query)) {                                                                                  // 229
        query = _.map(_.pairs(query), function (queryPart) {                                                    // 230
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                                         // 231
        }).join('&');                                                                                           // 232
                                                                                                                // 233
        if (query && query.length)                                                                              // 234
          path = path + '/?' + query;                                                                           // 235
      }                                                                                                         // 236
                                                                                                                // 237
      if (hash) {                                                                                               // 238
        hash = encodeURI(hash.replace('#', ''));                                                                // 239
        path = query ?                                                                                          // 240
          path + '#' + hash : path + '/#' + hash;                                                               // 241
      }                                                                                                         // 242
    }                                                                                                           // 243
                                                                                                                // 244
    // Because of optional possibly empty segments we normalize path here                                       // 245
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                                    // 246
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                            // 247
                                                                                                                // 248
    return isMissingParams ? null : path;                                                                       // 249
  },                                                                                                            // 250
                                                                                                                // 251
  path: function (params, options) {                                                                            // 252
    return this.resolve(params, options);                                                                       // 253
  },                                                                                                            // 254
                                                                                                                // 255
  url: function (params, options) {                                                                             // 256
    var path = this.path(params, options);                                                                      // 257
    if (path[0] === '/')                                                                                        // 258
      path = path.slice(1, path.length);                                                                        // 259
    return Meteor.absoluteUrl() + path;                                                                         // 260
  },                                                                                                            // 261
                                                                                                                // 262
  getController: function (path, options) {                                                                     // 263
    var self = this;                                                                                            // 264
    var handler                                                                                                 // 265
      , controllerClass                                                                                         // 266
      , controller                                                                                              // 267
      , action                                                                                                  // 268
      , routeName;                                                                                              // 269
                                                                                                                // 270
    var resolveValue = Utils.resolveValue;                                                                      // 271
    var classify = Utils.classify;                                                                              // 272
    var toArray = Utils.toArray;                                                                                // 273
                                                                                                                // 274
    var findController = function (name) {                                                                      // 275
      var controller = resolveValue(name);                                                                      // 276
      if (typeof controller === 'undefined') {                                                                  // 277
        throw new Error(                                                                                        // 278
          'controller "' + name + '" is not defined');                                                          // 279
      }                                                                                                         // 280
                                                                                                                // 281
      return controller;                                                                                        // 282
    };                                                                                                          // 283
                                                                                                                // 284
    options = _.extend({}, this.router.options, this.options, options || {}, {                                  // 285
      before: toArray(this.options.before),                                                                     // 286
      after: toArray(this.options.after),                                                                       // 287
      unload: toArray(this.options.unload),                                                                     // 288
      waitOn: toArray(this.router.options.waitOn)                                                               // 289
        .concat(toArray(this.options.waitOn)),                                                                  // 290
      path: path,                                                                                               // 291
      route: this,                                                                                              // 292
      router: this.router,                                                                                      // 293
      params: this.params(path)                                                                                 // 294
    });                                                                                                         // 295
                                                                                                                // 296
    // case 1: controller option is defined on the route                                                        // 297
    if (this.controller) {                                                                                      // 298
      controllerClass = _.isString(this.controller) ?                                                           // 299
        findController(this.controller) : this.controller;                                                      // 300
      controller = new controllerClass(options);                                                                // 301
      return controller;                                                                                        // 302
    }                                                                                                           // 303
                                                                                                                // 304
    // case 2: intelligently find the controller class in global namespace                                      // 305
    routeName = this.name;                                                                                      // 306
                                                                                                                // 307
    if (routeName) {                                                                                            // 308
      controllerClass = resolveValue(classify(routeName + 'Controller'));                                       // 309
                                                                                                                // 310
      if (controllerClass) {                                                                                    // 311
        controller = new controllerClass(options);                                                              // 312
        return controller;                                                                                      // 313
      }                                                                                                         // 314
    }                                                                                                           // 315
                                                                                                                // 316
    // case 3: nothing found so create an anonymous controller                                                  // 317
    return new RouteController(options);                                                                        // 318
  }                                                                                                             // 319
};                                                                                                              // 320
                                                                                                                // 321
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/route_controller.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*****************************************************************************/                                 // 1
/* IronRouteController */                                                                                       // 2
/*****************************************************************************/                                 // 3
                                                                                                                // 4
/**                                                                                                             // 5
 * Base class for client and server RouteController.                                                            // 6
 */                                                                                                             // 7
                                                                                                                // 8
IronRouteController = function (options) {                                                                      // 9
  var self = this;                                                                                              // 10
                                                                                                                // 11
  options = this.options = options || {};                                                                       // 12
                                                                                                                // 13
  var getOption = function (key) {                                                                              // 14
    return Utils.pick(self.options[key], self[key]);                                                            // 15
  };                                                                                                            // 16
                                                                                                                // 17
  this.router = options.router;                                                                                 // 18
  this.route = options.route;                                                                                   // 19
  this.path = options.path;                                                                                     // 20
  this.params = options.params || [];                                                                           // 21
  this.where = options.where || 'client';                                                                       // 22
  this.action = options.action || this.action;                                                                  // 23
  this.hooks = {};                                                                                              // 24
                                                                                                                // 25
  options.load = Utils.toArray(options.load);                                                                   // 26
  options.before = Utils.toArray(options.before);                                                               // 27
  options.after = Utils.toArray(options.after);                                                                 // 28
  options.unload = Utils.toArray(options.unload);                                                               // 29
};                                                                                                              // 30
                                                                                                                // 31
IronRouteController.prototype = {                                                                               // 32
  constructor: IronRouteController,                                                                             // 33
                                                                                                                // 34
  runHooks: function (hookName, more) {                                                                         // 35
    var ctor = this.constructor                                                                                 // 36
      , more = Utils.toArray(more);                                                                             // 37
                                                                                                                // 38
    var collectInheritedHooks = function (ctor) {                                                               // 39
      var hooks = [];                                                                                           // 40
                                                                                                                // 41
      if (ctor.__super__)                                                                                       // 42
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                                // 43
                                                                                                                // 44
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                                   // 45
        hooks.concat(ctor.prototype[hookName]) : hooks;                                                         // 46
    };                                                                                                          // 47
                                                                                                                // 48
    var prototypeHooks = collectInheritedHooks(this.constructor);                                               // 49
    var routeHooks = this.options[hookName];                                                                    // 50
    var globalHooks =                                                                                           // 51
      this.route ? this.router.getHooks(hookName, this.route.name) : [];                                        // 52
                                                                                                                // 53
    var allHooks = globalHooks.concat(routeHooks).concat(prototypeHooks).concat(more);                          // 54
                                                                                                                // 55
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                            // 56
      if (this.stopped)                                                                                         // 57
        break;                                                                                                  // 58
      hook.call(this);                                                                                          // 59
    }                                                                                                           // 60
  },                                                                                                            // 61
                                                                                                                // 62
  run: function () {                                                                                            // 63
    throw new Error('not implemented');                                                                         // 64
  },                                                                                                            // 65
                                                                                                                // 66
  action: function () {                                                                                         // 67
    throw new Error('not implemented');                                                                         // 68
  },                                                                                                            // 69
                                                                                                                // 70
  stop: function() {                                                                                            // 71
    this.stopped = true;                                                                                        // 72
  }                                                                                                             // 73
};                                                                                                              // 74
                                                                                                                // 75
_.extend(IronRouteController, {                                                                                 // 76
  /**                                                                                                           // 77
   * Inherit from IronRouteController                                                                           // 78
   *                                                                                                            // 79
   * @param {Object} definition Prototype properties for inherited class.                                       // 80
   */                                                                                                           // 81
                                                                                                                // 82
  extend: function (definition) {                                                                               // 83
    return Utils.extend(this, definition, function (definition) {                                               // 84
      var klass = this;                                                                                         // 85
                                                                                                                // 86
      /*                                                                                                        // 87
        Allow calling a class method from javascript, directly in the subclass                                  // 88
        definition.                                                                                             // 89
                                                                                                                // 90
        Instead of this:                                                                                        // 91
          MyController = RouteController.extend({...});                                                         // 92
          MyController.before(function () {});                                                                  // 93
                                                                                                                // 94
        You can do:                                                                                             // 95
          MyController = RouteController.extend({                                                               // 96
            before: function () {}                                                                              // 97
          });                                                                                                   // 98
                                                                                                                // 99
        And in Coffeescript you can do:                                                                         // 100
         MyController extends RouteController                                                                   // 101
           @before function () {}                                                                               // 102
       */                                                                                                       // 103
    });                                                                                                         // 104
  }                                                                                                             // 105
});                                                                                                             // 106
                                                                                                                // 107
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/router.js                                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*****************************************************************************/                                 // 1
/* IronRouter */                                                                                                // 2
/*****************************************************************************/                                 // 3
IronRouter = function (options) {                                                                               // 4
  var self = this;                                                                                              // 5
                                                                                                                // 6
  this.configure(options);                                                                                      // 7
                                                                                                                // 8
  /**                                                                                                           // 9
   * The routes array which doubles as a named route index by adding                                            // 10
   * properties to the array.                                                                                   // 11
   *                                                                                                            // 12
   * @api public                                                                                                // 13
   */                                                                                                           // 14
  this.routes = [];                                                                                             // 15
                                                                                                                // 16
  this._globalHooks = {};                                                                                       // 17
  _.each(IronRouter.HOOK_TYPES, function(type) { self._globalHooks[type] = []; });                              // 18
};                                                                                                              // 19
                                                                                                                // 20
IronRouter.HOOK_TYPES = ['load', 'before', 'after', 'unload'];                                                  // 21
                                                                                                                // 22
IronRouter.prototype = {                                                                                        // 23
  constructor: IronRouter,                                                                                      // 24
                                                                                                                // 25
  /**                                                                                                           // 26
   * Configure instance with options. This can be called at any time. If the                                    // 27
   * instance options object hasn't been created yet it is created here.                                        // 28
   *                                                                                                            // 29
   * @param {Object} options                                                                                    // 30
   * @return {IronRouter}                                                                                       // 31
   * @api public                                                                                                // 32
   */                                                                                                           // 33
                                                                                                                // 34
  configure: function (options) {                                                                               // 35
    var self = this;                                                                                            // 36
                                                                                                                // 37
    this.options = this.options || {};                                                                          // 38
    _.extend(this.options, options);                                                                            // 39
                                                                                                                // 40
    // e.g. before: fn OR before: [fn1, fn2]                                                                    // 41
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                              // 42
      if (self.options[type]) {                                                                                 // 43
        _.each(Utils.toArray(self.options[type]), function(hook) {                                              // 44
          self.addHook(type, hook);                                                                             // 45
        });                                                                                                     // 46
                                                                                                                // 47
        delete self.options[type];                                                                              // 48
      }                                                                                                         // 49
    });                                                                                                         // 50
                                                                                                                // 51
    return this;                                                                                                // 52
  },                                                                                                            // 53
                                                                                                                // 54
                                                                                                                // 55
  /**                                                                                                           // 56
   *                                                                                                            // 57
   * Add a hook to all routes. The hooks will apply to all routes,                                              // 58
   * unless you name routes to include or exclude via `only` and `except` options                               // 59
   *                                                                                                            // 60
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                                        // 61
   * @param {Object} [options] Options to controll the hooks [optional]                                         // 62
   * @param {Function} [hook] Callback to run                                                                   // 63
   * @return {IronRouter}                                                                                       // 64
   * @api public                                                                                                // 65
   *                                                                                                            // 66
   */                                                                                                           // 67
                                                                                                                // 68
  addHook: function(type, hook, options) {                                                                      // 69
    options = options || {}                                                                                     // 70
                                                                                                                // 71
    if (options.only)                                                                                           // 72
      options.only = Utils.toArray(options.only);                                                               // 73
    if (options.except)                                                                                         // 74
      options.except = Utils.toArray(options.except);                                                           // 75
                                                                                                                // 76
    this._globalHooks[type].push({options: options, hook: hook});                                               // 77
                                                                                                                // 78
    return this;                                                                                                // 79
  },                                                                                                            // 80
                                                                                                                // 81
  load: function(hook, options) {                                                                               // 82
    return this.addHook('load', hook, options);                                                                 // 83
  },                                                                                                            // 84
                                                                                                                // 85
  before: function(hook, options) {                                                                             // 86
    return this.addHook('before', hook, options);                                                               // 87
  },                                                                                                            // 88
                                                                                                                // 89
  after: function(hook, options) {                                                                              // 90
    return this.addHook('after', hook, options);                                                                // 91
  },                                                                                                            // 92
                                                                                                                // 93
  unload: function(hook, options) {                                                                             // 94
    return this.addHook('unload', hook, options);                                                               // 95
  },                                                                                                            // 96
                                                                                                                // 97
  /**                                                                                                           // 98
   *                                                                                                            // 99
   * Fetch the list of global hooks that apply to the given route name.                                         // 100
   * Hooks are defined by the .addHook() function above.                                                        // 101
   *                                                                                                            // 102
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                                        // 103
   * @param {String} [name] the name of the route we are interested in                                          // 104
   * @return {[Function]} [hooks] an array of hooks to run                                                      // 105
   * @api public                                                                                                // 106
   *                                                                                                            // 107
   */                                                                                                           // 108
                                                                                                                // 109
  getHooks: function(type, name) {                                                                              // 110
    var hooks = [];                                                                                             // 111
                                                                                                                // 112
    _.each(this._globalHooks[type], function(hook) {                                                            // 113
      var options = hook.options;                                                                               // 114
                                                                                                                // 115
      if (options.except && _.include(options.except, name))                                                    // 116
        return;                                                                                                 // 117
                                                                                                                // 118
      if (options.only && ! _.include(options.only, name))                                                      // 119
        return;                                                                                                 // 120
                                                                                                                // 121
      hooks.push(hook.hook);                                                                                    // 122
    });                                                                                                         // 123
                                                                                                                // 124
    return hooks;                                                                                               // 125
  },                                                                                                            // 126
                                                                                                                // 127
                                                                                                                // 128
  /**                                                                                                           // 129
   * Convenience function to define a bunch of routes at once. In the future we                                 // 130
   * might call the callback with a custom dsl.                                                                 // 131
   *                                                                                                            // 132
   * Example:                                                                                                   // 133
   *  Router.map(function () {                                                                                  // 134
   *    this.route('posts');                                                                                    // 135
   *  });                                                                                                       // 136
   *                                                                                                            // 137
   *  @param {Function} cb                                                                                      // 138
   *  @return {IronRouter}                                                                                      // 139
   *  @api public                                                                                               // 140
   */                                                                                                           // 141
                                                                                                                // 142
  map: function (cb) {                                                                                          // 143
    Utils.assert(_.isFunction(cb),                                                                              // 144
           'map requires a function as the first parameter');                                                   // 145
    cb.call(this);                                                                                              // 146
    return this;                                                                                                // 147
  },                                                                                                            // 148
                                                                                                                // 149
  /**                                                                                                           // 150
   * Define a new route. You must name the route, but as a second parameter you                                 // 151
   * can either provide an object of options or a Route instance.                                               // 152
   *                                                                                                            // 153
   * @param {String} name The name of the route                                                                 // 154
   * @param {Object} [options] Options to pass along to the route                                               // 155
   * @return {Route}                                                                                            // 156
   * @api public                                                                                                // 157
   */                                                                                                           // 158
                                                                                                                // 159
  route: function (name, options) {                                                                             // 160
    var route;                                                                                                  // 161
                                                                                                                // 162
    Utils.assert(_.isString(name), 'name is a required parameter');                                             // 163
                                                                                                                // 164
    if (options instanceof Route)                                                                               // 165
      route = options;                                                                                          // 166
    else                                                                                                        // 167
      route = new Route(this, name, options);                                                                   // 168
                                                                                                                // 169
    this.routes[name] = route;                                                                                  // 170
    this.routes.push(route);                                                                                    // 171
    return route;                                                                                               // 172
  },                                                                                                            // 173
                                                                                                                // 174
  path: function (routeName, params, options) {                                                                 // 175
    var route = this.routes[routeName];                                                                         // 176
    Utils.warn(route,                                                                                           // 177
     'You called Router.path for a route named ' + routeName + ' but that that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                                // 179
  },                                                                                                            // 180
                                                                                                                // 181
  url: function (routeName, params, options) {                                                                  // 182
    var route = this.routes[routeName];                                                                         // 183
    Utils.warn(route,                                                                                           // 184
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                                 // 186
  },                                                                                                            // 187
                                                                                                                // 188
  dispatch: function (path, options, cb) {                                                                      // 189
    var self = this                                                                                             // 190
      , routes = self.routes                                                                                    // 191
      , route                                                                                                   // 192
      , controller                                                                                              // 193
      , where = Meteor.isClient ? 'client' : 'server'                                                           // 194
      , i = 0;                                                                                                  // 195
                                                                                                                // 196
    function next () {                                                                                          // 197
      route = routes[i++];                                                                                      // 198
                                                                                                                // 199
      if (!route) {                                                                                             // 200
        return self.onRouteNotFound(path, options);                                                             // 201
      }                                                                                                         // 202
                                                                                                                // 203
      if (route.test(path)) {                                                                                   // 204
        if (route.where !== where)                                                                              // 205
          return self.onUnhandled(path, options);                                                               // 206
                                                                                                                // 207
        var controller = route.getController(path, options);                                                    // 208
        self.run(controller, cb);                                                                               // 209
      } else {                                                                                                  // 210
        next();                                                                                                 // 211
      }                                                                                                         // 212
    }                                                                                                           // 213
                                                                                                                // 214
    next();                                                                                                     // 215
  },                                                                                                            // 216
                                                                                                                // 217
  run: function (controller, cb) {                                                                              // 218
    throw new Error('run not implemented');                                                                     // 219
  },                                                                                                            // 220
                                                                                                                // 221
  onUnhandled: function (path, options) {                                                                       // 222
    throw new Error('onUnhandled not implemented');                                                             // 223
  },                                                                                                            // 224
                                                                                                                // 225
  onRouteNotFound: function (path, options) {                                                                   // 226
    throw new Error('Oh no! No route found for path: "' + path + '"');                                          // 227
  }                                                                                                             // 228
};                                                                                                              // 229
                                                                                                                // 230
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/location.js                                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var dep = new Deps.Dependency;                                                                                  // 1
var popped = false;                                                                                             // 2
// XXX: we have to store the state internally (rather than just calling out                                     // 3
// to window.location) due to an android 2.3 bug. See:                                                          // 4
//   https://github.com/EventedMind/iron-router/issues/350                                                      // 5
var currentState = {                                                                                            // 6
  path: location.pathname + location.search + location.hash                                                     // 7
};                                                                                                              // 8
                                                                                                                // 9
function onclick (e) {                                                                                          // 10
  var el = e.currentTarget;                                                                                     // 11
  var which = _.isUndefined(e.which) ? e.button : e.which;                                                      // 12
  var href = el.href;                                                                                           // 13
  var path = el.pathname + el.search + el.hash;                                                                 // 14
                                                                                                                // 15
  // we only want to handle clicks on links which:                                                              // 16
  //  - are with the left mouse button with no meta key pressed                                                 // 17
  if (which !== 1)                                                                                              // 18
    return;                                                                                                     // 19
                                                                                                                // 20
  if (e.metaKey || e.ctrlKey || e.shiftKey)                                                                     // 21
    return;                                                                                                     // 22
                                                                                                                // 23
  // - haven't been cancelled already                                                                           // 24
  if (e.isDefaultPrevented())                                                                                   // 25
    return;                                                                                                     // 26
                                                                                                                // 27
  // - aren't in a new window                                                                                   // 28
  if (el.target)                                                                                                // 29
    return;                                                                                                     // 30
                                                                                                                // 31
  // - aren't external to the app                                                                               // 32
  if (!IronLocation.isSameOrigin(href))                                                                         // 33
    return;                                                                                                     // 34
                                                                                                                // 35
  // note that we _do_ handle links which point to the current URL                                              // 36
  // and links which only change the hash.                                                                      // 37
  e.preventDefault();                                                                                           // 38
  IronLocation.set(path);                                                                                       // 39
}                                                                                                               // 40
                                                                                                                // 41
function onpopstate (e) {                                                                                       // 42
  setState(e.state, null, location.pathname + location.search + location.hash);                                 // 43
                                                                                                                // 44
  if (popped)                                                                                                   // 45
    dep.changed();                                                                                              // 46
}                                                                                                               // 47
                                                                                                                // 48
IronLocation = {};                                                                                              // 49
                                                                                                                // 50
IronLocation.options = {                                                                                        // 51
  "linkSelector": 'a[href]'                                                                                     // 52
};                                                                                                              // 53
                                                                                                                // 54
IronLocation.configure = function(options){                                                                     // 55
  if (this.isStarted){                                                                                          // 56
    IronLocation.unbindEvents();                                                                                // 57
  }                                                                                                             // 58
  _.extend(this.options, options);                                                                              // 59
                                                                                                                // 60
  if(this.isStarted){                                                                                           // 61
    IronLocation.bindEvents();                                                                                  // 62
  }                                                                                                             // 63
};                                                                                                              // 64
                                                                                                                // 65
IronLocation.origin = function () {                                                                             // 66
  return location.protocol + '//' + location.host;                                                              // 67
};                                                                                                              // 68
                                                                                                                // 69
IronLocation.isSameOrigin = function (href) {                                                                   // 70
  var origin = IronLocation.origin();                                                                           // 71
  return href.indexOf(origin) === 0;                                                                            // 72
};                                                                                                              // 73
                                                                                                                // 74
IronLocation.get = function () {                                                                                // 75
  dep.depend();                                                                                                 // 76
  return currentState;                                                                                          // 77
};                                                                                                              // 78
                                                                                                                // 79
IronLocation.path = function () {                                                                               // 80
  dep.depend();                                                                                                 // 81
  return currentState.path;                                                                                     // 82
};                                                                                                              // 83
                                                                                                                // 84
IronLocation.set = function (url, options) {                                                                    // 85
  options = options || {};                                                                                      // 86
                                                                                                                // 87
  var state = options.state || {};                                                                              // 88
                                                                                                                // 89
  if (/^http/.test(url))                                                                                        // 90
    href = url;                                                                                                 // 91
  else {                                                                                                        // 92
    if (url.charAt(0) !== '/')                                                                                  // 93
      url = '/' + url;                                                                                          // 94
    href = IronLocation.origin() + url;                                                                         // 95
  }                                                                                                             // 96
                                                                                                                // 97
  if (!IronLocation.isSameOrigin(href))                                                                         // 98
    window.location = href;                                                                                     // 99
  else if (options.where === 'server')                                                                          // 100
    window.location = href;                                                                                     // 101
  else if (options.replaceState)                                                                                // 102
    IronLocation.replaceState(state, options.title, url);                                                       // 103
  else                                                                                                          // 104
    IronLocation.pushState(state, options.title, url);                                                          // 105
                                                                                                                // 106
  if (options.skipReactive !== true)                                                                            // 107
    dep.changed();                                                                                              // 108
};                                                                                                              // 109
                                                                                                                // 110
// store the state for later access                                                                             // 111
setState = function(newState, title, url) {                                                                     // 112
  currentState = newState || {};                                                                                // 113
  currentState.path = url;                                                                                      // 114
  currentState.title = title;                                                                                   // 115
}                                                                                                               // 116
                                                                                                                // 117
IronLocation.pushState = function (state, title, url) {                                                         // 118
  popped = true;                                                                                                // 119
  setState(state, title, url);                                                                                  // 120
                                                                                                                // 121
  if (history.pushState)                                                                                        // 122
    history.pushState(state, title, url);                                                                       // 123
  else                                                                                                          // 124
    window.location = url;                                                                                      // 125
};                                                                                                              // 126
                                                                                                                // 127
IronLocation.replaceState = function (state, title, url) {                                                      // 128
  popped = true;                                                                                                // 129
  setState(state, title, url);                                                                                  // 130
                                                                                                                // 131
  if (history.replaceState)                                                                                     // 132
    history.replaceState(state, title, url);                                                                    // 133
  else                                                                                                          // 134
    window.location = url;                                                                                      // 135
};                                                                                                              // 136
                                                                                                                // 137
IronLocation.bindEvents = function(){                                                                           // 138
  $(window).on('popstate', onpopstate);                                                                         // 139
  $(document).on('click', this.options.linkSelector, onclick);                                                  // 140
};                                                                                                              // 141
                                                                                                                // 142
IronLocation.unbindEvents = function(){                                                                         // 143
  $(window).off('popstate', onpopstate);                                                                        // 144
  $(window).off('click', this.options.linkSelector, onclick);                                                   // 145
};                                                                                                              // 146
                                                                                                                // 147
IronLocation.start = function () {                                                                              // 148
  if (this.isStarted)                                                                                           // 149
    return;                                                                                                     // 150
                                                                                                                // 151
  IronLocation.bindEvents();                                                                                    // 152
  this.isStarted = true;                                                                                        // 153
                                                                                                                // 154
  // store the fact that this is the first route we hit.                                                        // 155
  // this serves two purposes                                                                                   // 156
  //   1. We can tell when we've reached an unhandled route and need to show a                                  // 157
  //      404 (rather than bailing out to let the server handle it)                                             // 158
  //   2. Users can look at the state to tell if the history.back() will stay                                   // 159
  //      inside the app (this is important for mobile apps).                                                   // 160
  if (history.replaceState)                                                                                     // 161
    history.replaceState({initial: true}, null, location.pathname + location.search + location.hash);           // 162
};                                                                                                              // 163
                                                                                                                // 164
IronLocation.stop = function () {                                                                               // 165
  IronLocation.unbindEvents();                                                                                  // 166
  this.isStarted = false;                                                                                       // 167
};                                                                                                              // 168
                                                                                                                // 169
IronLocation.start();                                                                                           // 170
                                                                                                                // 171
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/page_manager.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var MAIN_YIELD = '__main__';                                                                                    // 1
var DEFAULT_LAYOUT = '__defaultLayout__';                                                                       // 2
                                                                                                                // 3
var getTemplateFunction = function (template, defaultFn) {                                                      // 4
  if (_.isFunction(template))                                                                                   // 5
    return template;                                                                                            // 6
  else if (Template[template])                                                                                  // 7
    return Template[template];                                                                                  // 8
  else if (defaultFn)                                                                                           // 9
    return defaultFn;                                                                                           // 10
  else                                                                                                          // 11
    throw new Error('Oops, no template found named "' + template + '"');                                        // 12
};                                                                                                              // 13
                                                                                                                // 14
var assertTemplateExists = function (template) {                                                                // 15
  if (_.isFunction(template))                                                                                   // 16
    return true;                                                                                                // 17
  else if (!Template[template])                                                                                 // 18
    throw new Error('Uh oh, no template found named "' + template + '"');                                       // 19
};                                                                                                              // 20
                                                                                                                // 21
var ReactiveVar = function (value) {                                                                            // 22
  this._dep = new Deps.Dependency;                                                                              // 23
  this._value = value || null;                                                                                  // 24
};                                                                                                              // 25
                                                                                                                // 26
ReactiveVar.prototype = {                                                                                       // 27
  set: function (value) {                                                                                       // 28
    if (EJSON.equals(value, this._value))                                                                       // 29
      return;                                                                                                   // 30
                                                                                                                // 31
    this._value = value;                                                                                        // 32
    this._dep.changed();                                                                                        // 33
  },                                                                                                            // 34
                                                                                                                // 35
  get: function () {                                                                                            // 36
    this._dep.depend();                                                                                         // 37
    return this._value;                                                                                         // 38
  },                                                                                                            // 39
                                                                                                                // 40
  equals: function (other) {                                                                                    // 41
    this._dep.depend();                                                                                         // 42
    return EJSON.equals(this._value, other);                                                                    // 43
  }                                                                                                             // 44
};                                                                                                              // 45
                                                                                                                // 46
PageManager = function () {                                                                                     // 47
  this.yieldsToTemplates = new ReactiveDict;                                                                    // 48
  this.layout = new ReactiveVar;                                                                                // 49
  this.data = new ReactiveVar({});                                                                              // 50
  this.layout.set(DEFAULT_LAYOUT);                                                                              // 51
  this._yields = {};                                                                                            // 52
};                                                                                                              // 53
                                                                                                                // 54
PageManager.prototype = {                                                                                       // 55
  constructor: PageManager,                                                                                     // 56
                                                                                                                // 57
  setLayout: function (layout) {                                                                                // 58
    var self = this;                                                                                            // 59
    layout = layout || DEFAULT_LAYOUT;                                                                          // 60
    assertTemplateExists(layout);                                                                               // 61
    Deps.nonreactive(function () {                                                                              // 62
      var oldLayout = self.layout.get();                                                                        // 63
                                                                                                                // 64
      // reset because we have a new layout now                                                                 // 65
      if (oldLayout !== layout)                                                                                 // 66
        self._yields = {};                                                                                      // 67
    });                                                                                                         // 68
                                                                                                                // 69
    this.layout.set(layout);                                                                                    // 70
  },                                                                                                            // 71
                                                                                                                // 72
  setTemplate: function (template, to) {                                                                        // 73
    var self = this;                                                                                            // 74
                                                                                                                // 75
    to = to || MAIN_YIELD;                                                                                      // 76
                                                                                                                // 77
    // make sure the yield region was declared otherwise the user may have                                      // 78
    // tried to render into a named yield that was never declared in the                                        // 79
    // layout. Let's provide them a helpful warning if that happens.                                            // 80
                                                                                                                // 81
    // If we're already in a flush we want to schedule the yield check for after                                // 82
    // the next flush, not this one. The flush we're currently in is caused by a                                // 83
    // location change which triggers the router's dispatch process. Then, we                                   // 84
    // add this check to the current flush's afterFlushCallbacks queue which                                    // 85
    // caues it to be executed as soon as all our code is done running, instead                                 // 86
    // of after the next flush which is what we want. There might be a better                                   // 87
    // pattern here.                                                                                            // 88
    Meteor.defer(function () {                                                                                  // 89
      Deps.afterFlush(function () {                                                                             // 90
        var isYieldDeclared = self._yields[to];                                                                 // 91
        var help;                                                                                               // 92
                                                                                                                // 93
        if (!isYieldDeclared) {                                                                                 // 94
          if (to == MAIN_YIELD)                                                                                 // 95
            help = 'Sorry, couldn\'t find the main yield. Did you define it in one of the rendered templates like this: {{yield}}?';
          else                                                                                                  // 97
            help = 'Sorry, couldn\'t find a yield named "' + to + '". Did you define it in one of the rendered templates like this: {{yield "' + to + '"}}?';
                                                                                                                // 99
          if (console && console.warn)                                                                          // 100
            console.warn(help);                                                                                 // 101
          else if (console && console.error)                                                                    // 102
            console.error(help);                                                                                // 103
          else                                                                                                  // 104
            throw new Error(help);                                                                              // 105
        }                                                                                                       // 106
      });                                                                                                       // 107
    });                                                                                                         // 108
                                                                                                                // 109
    this.yieldsToTemplates.set(to, template);                                                                   // 110
  },                                                                                                            // 111
                                                                                                                // 112
  clearYield: function (key) {                                                                                  // 113
    this.yieldsToTemplates.set(key, null);                                                                      // 114
  },                                                                                                            // 115
                                                                                                                // 116
  setData: function (data) {                                                                                    // 117
    this.data.set(data);                                                                                        // 118
  },                                                                                                            // 119
                                                                                                                // 120
  getData: function () {                                                                                        // 121
    return this.data.get();                                                                                     // 122
  },                                                                                                            // 123
                                                                                                                // 124
  helpers: function () {                                                                                        // 125
    var self = this;                                                                                            // 126
    return {                                                                                                    // 127
      'yield': function (key, options) {                                                                        // 128
        var html;                                                                                               // 129
                                                                                                                // 130
        if (arguments.length < 2)                                                                               // 131
          key = null;                                                                                           // 132
                                                                                                                // 133
        html = self._renderTemplate(key);                                                                       // 134
        return new Handlebars.SafeString(html);                                                                 // 135
      }                                                                                                         // 136
    };                                                                                                          // 137
  },                                                                                                            // 138
                                                                                                                // 139
  _renderTemplate: function (key) {                                                                             // 140
    var self = this;                                                                                            // 141
                                                                                                                // 142
    key = key || MAIN_YIELD;                                                                                    // 143
                                                                                                                // 144
    // register that this named yield was used so we can check later that all                                   // 145
    // setTemplate calls were for a yield region that exists.                                                   // 146
    this._yields[key] = true;                                                                                   // 147
                                                                                                                // 148
                                                                                                                // 149
    return Spark.isolate(function () {                                                                          // 150
      // grab the template function from Template or just make the template                                     // 151
      // function return an empty string if no template found                                                   // 152
      var template = getTemplateFunction(self.yieldsToTemplates.get(key), function () {                         // 153
        return '';                                                                                              // 154
      });                                                                                                       // 155
                                                                                                                // 156
      var data = self.getData();                                                                                // 157
      var helpers = self.helpers();                                                                             // 158
      var dataContext = _.extend({}, data, helpers);                                                            // 159
                                                                                                                // 160
      return template(dataContext);                                                                             // 161
    });                                                                                                         // 162
  },                                                                                                            // 163
                                                                                                                // 164
  renderLayout: function () {                                                                                   // 165
    var self = this;                                                                                            // 166
                                                                                                                // 167
    var html = Spark.isolate(function () {                                                                      // 168
      var layout = getTemplateFunction(self.layout.get());                                                      // 169
      var data = self.data.get();                                                                               // 170
      var helpers = self.helpers();                                                                             // 171
      var dataContext = _.extend({}, data, helpers);                                                            // 172
      return layout(dataContext);                                                                               // 173
    });                                                                                                         // 174
                                                                                                                // 175
    return html;                                                                                                // 176
  },                                                                                                            // 177
                                                                                                                // 178
  clearUnusedYields: function (usedYields) {                                                                    // 179
    var self = this;                                                                                            // 180
    var allYields = _.keys(this.yieldsToTemplates.keys);                                                        // 181
                                                                                                                // 182
    usedYields = _.filter(usedYields, function (val) {                                                          // 183
      return !!val;                                                                                             // 184
    });                                                                                                         // 185
                                                                                                                // 186
    var unusedYields = _.difference(allYields, usedYields);                                                     // 187
                                                                                                                // 188
    _.each(unusedYields, function (key) {                                                                       // 189
      self.clearYield(key);                                                                                     // 190
    });                                                                                                         // 191
  }                                                                                                             // 192
};                                                                                                              // 193
                                                                                                                // 194
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/router.js                                                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/**                                                                                                             // 1
 * Client side router.                                                                                          // 2
 *                                                                                                              // 3
 * @class ClientRouter                                                                                          // 4
 * @exports ClientRouter                                                                                        // 5
 * @extends IronRouter                                                                                          // 6
 */                                                                                                             // 7
                                                                                                                // 8
ClientRouter = Utils.extend(IronRouter, {                                                                       // 9
  /**                                                                                                           // 10
   * @constructor                                                                                               // 11
   * @param {Object} [options]                                                                                  // 12
   * @param {Boolean} [options.autoRender] Automatically render to the body                                     // 13
   * @param {Boolean} [options.autoStart] Automatically start listening to                                      // 14
   * events                                                                                                     // 15
   */                                                                                                           // 16
                                                                                                                // 17
  constructor: function (options) {                                                                             // 18
    var self = this;                                                                                            // 19
                                                                                                                // 20
    ClientRouter.__super__.constructor.apply(this, arguments);                                                  // 21
                                                                                                                // 22
    this.isRendered = false;                                                                                    // 23
                                                                                                                // 24
    this._page = new PageManager;                                                                               // 25
                                                                                                                // 26
    /**                                                                                                         // 27
     * The current RouteController instance. This is set anytime a new route is                                 // 28
     * dispatched. It's a reactive variable which you can get by calling                                        // 29
     * Router.current();                                                                                        // 30
     *                                                                                                          // 31
     * @api private                                                                                             // 32
     */                                                                                                         // 33
    this._currentController = null;                                                                             // 34
                                                                                                                // 35
    /**                                                                                                         // 36
     * Dependency to for this._currentController                                                                // 37
     *                                                                                                          // 38
     * @api private                                                                                             // 39
     */                                                                                                         // 40
    this._controllerDep = new Deps.Dependency;                                                                  // 41
                                                                                                                // 42
    /**                                                                                                         // 43
      * Did the URL we are looking at come from a hot-code-reload                                               // 44
      *  (and thus should we treat is as not new?)                                                              // 45
      *                                                                                                         // 46
      * @api private                                                                                            // 47
      */                                                                                                        // 48
    this._hasJustReloaded = false;                                                                              // 49
                                                                                                                // 50
    Meteor.startup(function () {                                                                                // 51
      setTimeout(function () {                                                                                  // 52
        if (self.options.autoRender !== false)                                                                  // 53
          self.autoRender();                                                                                    // 54
        if (self.options.autoStart !== false)                                                                   // 55
          self.start();                                                                                         // 56
      });                                                                                                       // 57
    });                                                                                                         // 58
  },                                                                                                            // 59
                                                                                                                // 60
  /**                                                                                                           // 61
   * Reactive accessor for the current RouteController instance. You can also                                   // 62
   * get a nonreactive value by specifiying {reactive: false} as an option.                                     // 63
   *                                                                                                            // 64
   * @param {Object} [opts] configuration options                                                               // 65
   * @param {Boolean} [opts.reactive] Set to false to enable a non-reactive read.                               // 66
   * @return {RouteController}                                                                                  // 67
   * @api public                                                                                                // 68
   */                                                                                                           // 69
                                                                                                                // 70
  current: function (opts) {                                                                                    // 71
    if (opts && opts.reactive === false)                                                                        // 72
      return this._currentController;                                                                           // 73
    else {                                                                                                      // 74
      this._controllerDep.depend();                                                                             // 75
      return this._currentController;                                                                           // 76
    }                                                                                                           // 77
  },                                                                                                            // 78
                                                                                                                // 79
  setLayout: function (layout) {                                                                                // 80
    this._page.setLayout(layout);                                                                               // 81
  },                                                                                                            // 82
                                                                                                                // 83
  setTemplate: function (template, to) {                                                                        // 84
    this._page.setTemplate(template, to);                                                                       // 85
  },                                                                                                            // 86
                                                                                                                // 87
  clearUnusedYields: function (usedYields) {                                                                    // 88
    this._page.clearUnusedYields(usedYields);                                                                   // 89
  },                                                                                                            // 90
                                                                                                                // 91
  setData: function (data) {                                                                                    // 92
    this._page.setData(data);                                                                                   // 93
  },                                                                                                            // 94
                                                                                                                // 95
  getData: function () {                                                                                        // 96
    return this._page.getData();                                                                                // 97
  },                                                                                                            // 98
                                                                                                                // 99
  run: function (controller, cb) {                                                                              // 100
    var self = this;                                                                                            // 101
    var where = Meteor.isClient ? 'client' : 'server';                                                          // 102
                                                                                                                // 103
    Utils.assert(controller, 'run requires a controller');                                                      // 104
                                                                                                                // 105
    // one last check to see if we should handle the route here                                                 // 106
    if (controller.where != where) {                                                                            // 107
      self.onUnhandled(controller.path, controller.options);                                                    // 108
      return;                                                                                                   // 109
    }                                                                                                           // 110
                                                                                                                // 111
    var runRouteController = function () {                                                                      // 112
      Deps.autorun(function (c) {                                                                               // 113
        self._routeComputation = c;                                                                             // 114
                                                                                                                // 115
        if (! self._hasJustReloaded)                                                                            // 116
          controller.runHooks('load');                                                                          // 117
        self._hasJustReloaded = false;                                                                          // 118
                                                                                                                // 119
        if (this.stopped)                                                                                       // 120
          return;                                                                                               // 121
                                                                                                                // 122
        Deps.autorun(function () {                                                                              // 123
          controller.run();                                                                                     // 124
        });                                                                                                     // 125
      });                                                                                                       // 126
    };                                                                                                          // 127
                                                                                                                // 128
    if (this._currentController)                                                                                // 129
      this._currentController.runHooks('unload');                                                               // 130
                                                                                                                // 131
    this._currentController = controller;                                                                       // 132
                                                                                                                // 133
    if (this._routeComputation) {                                                                               // 134
      this._routeComputation.stop();                                                                            // 135
      this._routeComputation.onInvalidate(runRouteController);                                                  // 136
    } else {                                                                                                    // 137
      runRouteController();                                                                                     // 138
    }                                                                                                           // 139
                                                                                                                // 140
    if (controller == this._currentController) {                                                                // 141
      cb && cb(controller);                                                                                     // 142
      this._controllerDep.changed();                                                                            // 143
    }                                                                                                           // 144
  },                                                                                                            // 145
                                                                                                                // 146
  /**                                                                                                           // 147
   * Wrapper around Location.go that accepts a routeName or a path as the first                                 // 148
   * parameter. This method can accept client and server side routes.                                           // 149
   *                                                                                                            // 150
   * Examples:                                                                                                  // 151
   *                                                                                                            // 152
   *  1. Router.go('/posts', {state: 'true'});                                                                  // 153
   *  2. Router.go('postIndex', [param1, param2], {state});                                                     // 154
   *                                                                                                            // 155
   * @param {String} routeNameOrPath                                                                            // 156
   * @param {Array|Object} [params]                                                                             // 157
   * @param {Object} [state]                                                                                    // 158
   * @param {Boolean} [replaceState]                                                                            // 159
   * @api public                                                                                                // 160
   */                                                                                                           // 161
                                                                                                                // 162
  go: function (routeNameOrPath, params, options) {                                                             // 163
    var isPathRe = /^\/|http/                                                                                   // 164
      , route                                                                                                   // 165
      , path                                                                                                    // 166
      , onComplete                                                                                              // 167
      , controller                                                                                              // 168
      , done = function() {                                                                                     // 169
        options = options || {};                                                                                // 170
        IronLocation.set(path, {                                                                                // 171
          replaceState: options.replaceState,                                                                   // 172
          state: options.state,                                                                                 // 173
          skipReactive: true                                                                                    // 174
        });                                                                                                     // 175
      };                                                                                                        // 176
                                                                                                                // 177
    if (isPathRe.test(routeNameOrPath)) {                                                                       // 178
      path = routeNameOrPath;                                                                                   // 179
      options = params;                                                                                         // 180
      // issue here is in the dispatch process we might want to                                                 // 181
      // make a server request so therefore not call this method yet, so                                        // 182
      // we need to push the state only after we've decided it's a client                                       // 183
      // request, otherwise let the browser handle it and send off to the                                       // 184
      // server                                                                                                 // 185
      this.dispatch(path, options, done);                                                                       // 186
    } else {                                                                                                    // 187
      route = this.routes[routeNameOrPath];                                                                     // 188
      Utils.assert(route, 'No route found named ' + routeNameOrPath);                                           // 189
      path = route.path(params, options);                                                                       // 190
      controller = route.getController(path, options);                                                          // 191
      this.run(controller, done);                                                                               // 192
    }                                                                                                           // 193
  },                                                                                                            // 194
                                                                                                                // 195
  /**                                                                                                           // 196
   * Returns an html string or a document fragment with the router's layout.                                    // 197
   * This method also sets up the 'yield' helper on the layout. This is so that                                 // 198
   * the yield helper has a reference to the router through the closure.                                        // 199
   *                                                                                                            // 200
   * @returns {String|DocumentFragment}                                                                         // 201
   * @api public                                                                                                // 202
   */                                                                                                           // 203
                                                                                                                // 204
  render: function () {                                                                                         // 205
    this.isRendered = true;                                                                                     // 206
    return this._page.renderLayout();                                                                           // 207
  },                                                                                                            // 208
                                                                                                                // 209
  /**                                                                                                           // 210
   * Render the router into the body of the page automatically. Calles the                                      // 211
   * render method inside Spark.render to create a renderer and appends to the                                  // 212
   * document body.                                                                                             // 213
   *                                                                                                            // 214
   * @api public                                                                                                // 215
   */                                                                                                           // 216
                                                                                                                // 217
  autoRender: function () {                                                                                     // 218
    var self = this;                                                                                            // 219
    var frag = Spark.render(function () {                                                                       // 220
      return self.render();                                                                                     // 221
    });                                                                                                         // 222
    document.body.appendChild(frag);                                                                            // 223
  },                                                                                                            // 224
                                                                                                                // 225
                                                                                                                // 226
  /**                                                                                                           // 227
   * Start listening to click events and set up a Deps.autorun for location                                     // 228
   * changes. If already started the method just returns.                                                       // 229
   *                                                                                                            // 230
   * @api public                                                                                                // 231
   */                                                                                                           // 232
                                                                                                                // 233
  start: function () {                                                                                          // 234
    var self = this;                                                                                            // 235
                                                                                                                // 236
    if (self.isStarted) return;                                                                                 // 237
                                                                                                                // 238
    self.isStarted = true;                                                                                      // 239
                                                                                                                // 240
    Deps.autorun(function (c) {                                                                                 // 241
      var location;                                                                                             // 242
      self._locationComputation = c;                                                                            // 243
      self.dispatch(IronLocation.path(), {state: history.state});                                               // 244
    });                                                                                                         // 245
  },                                                                                                            // 246
                                                                                                                // 247
  /**                                                                                                           // 248
   * Remove click event listener and stop listening for location changes.                                       // 249
   *                                                                                                            // 250
   * @api public                                                                                                // 251
   */                                                                                                           // 252
                                                                                                                // 253
  stop: function () {                                                                                           // 254
    this.isStarted = false;                                                                                     // 255
                                                                                                                // 256
    if (this._locationComputation)                                                                              // 257
      this._locationComputation.stop();                                                                         // 258
  },                                                                                                            // 259
                                                                                                                // 260
  /**                                                                                                           // 261
   * If we don't handle a link but the server does, bail to the server                                          // 262
   *                                                                                                            // 263
   * @api public                                                                                                // 264
   */                                                                                                           // 265
  onUnhandled: function (path, options) {                                                                       // 266
    this.stop();                                                                                                // 267
    window.location = path;                                                                                     // 268
  },                                                                                                            // 269
                                                                                                                // 270
  /**                                                                                                           // 271
   * if we don't handle a link, _and_ the server doesn't handle it,                                             // 272
   * do one of two things:                                                                                      // 273
   *   a) if this is the initial route, then it can't be a static asset, so                                     // 274
   *      show notFound or throw an error                                                                       // 275
   *   b) otherwise, let the server have a go at it, we may end up coming back.                                 // 276
   *                                                                                                            // 277
   * @api public                                                                                                // 278
   */                                                                                                           // 279
  onRouteNotFound: function (path, options) {                                                                   // 280
    if (history && ! history.state.initial) {                                                                   // 281
      this.stop();                                                                                              // 282
      window.location = path;                                                                                   // 283
    } else if (this.options.notFoundTemplate) {                                                                 // 284
      this.setLayout(this.options.layoutTemplate);                                                              // 285
      this.setTemplate(this.options.notFoundTemplate);                                                          // 286
    } else {                                                                                                    // 287
      throw new Error('Oh no! No route found for path: "' + path + '"');                                        // 288
    }                                                                                                           // 289
  }                                                                                                             // 290
});                                                                                                             // 291
                                                                                                                // 292
/**                                                                                                             // 293
 * The main Router instance that clients will deal with                                                         // 294
 *                                                                                                              // 295
 * @api public                                                                                                  // 296
 * @exports Router                                                                                              // 297
 */                                                                                                             // 298
                                                                                                                // 299
Router = new ClientRouter;                                                                                      // 300
                                                                                                                // 301
if (Meteor._reload) {                                                                                           // 302
  // just register the fact that a migration _has_ happened                                                     // 303
  Meteor._reload.onMigrate('iron-router', function() { return [true, true]});                                   // 304
                                                                                                                // 305
  // then when we come back up, check if it it's set                                                            // 306
  var data = Meteor._reload.migrationData('iron-router');                                                       // 307
  Router._hasJustReloaded = data;                                                                               // 308
}                                                                                                               // 309
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/template.default_layout.js                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Template.__define__("__defaultLayout__",Package.handlebars.Handlebars.json_ast_to_func([["{",[[0,"yield"]]]])); // 1
                                                                                                                // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/route_controller.js                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*****************************************************************************/                                 // 1
/* WaitList */                                                                                                  // 2
/*****************************************************************************/                                 // 3
WaitList = function () {                                                                                        // 4
  this._dep = new Deps.Dependency;                                                                              // 5
  this.clear();                                                                                                 // 6
};                                                                                                              // 7
                                                                                                                // 8
WaitList.prototype = {                                                                                          // 9
  get: function (idx) {                                                                                         // 10
    return this._list[idx];                                                                                     // 11
  },                                                                                                            // 12
                                                                                                                // 13
  clear: function () {                                                                                          // 14
    this._list = [];                                                                                            // 15
  },                                                                                                            // 16
                                                                                                                // 17
  append: function (list) {                                                                                     // 18
    var self = this;                                                                                            // 19
    list = Utils.toArray(list);                                                                                 // 20
    _.each(list, function (o) {                                                                                 // 21
      self.push(o);                                                                                             // 22
    });                                                                                                         // 23
  },                                                                                                            // 24
                                                                                                                // 25
  push: function (o) {                                                                                          // 26
    var self = this;                                                                                            // 27
                                                                                                                // 28
    if (!o)                                                                                                     // 29
      return;                                                                                                   // 30
                                                                                                                // 31
    var res = this._list.push(o);                                                                               // 32
                                                                                                                // 33
    return res;                                                                                                 // 34
  },                                                                                                            // 35
                                                                                                                // 36
  ready: function () {                                                                                          // 37
    return _.all(this._list, function (handle) {                                                                // 38
      return handle.ready();                                                                                    // 39
    });                                                                                                         // 40
  }                                                                                                             // 41
};                                                                                                              // 42
                                                                                                                // 43
/*****************************************************************************/                                 // 44
/* Predefined Hooks */                                                                                          // 45
/*****************************************************************************/                                 // 46
var setDataHook = function () {                                                                                 // 47
  var self = this;                                                                                              // 48
  var data = _.isFunction(self.data) ? self.data.call(self) : self.data;                                        // 49
  if (data !== false) {                                                                                         // 50
    self.setData(data);                                                                                         // 51
  }                                                                                                             // 52
};                                                                                                              // 53
                                                                                                                // 54
var autoRenderNotFoundTemplateHook = function () {                                                              // 55
  var self = this;                                                                                              // 56
  var data = self.getData();                                                                                    // 57
  if ((data === null || typeof data === 'undefined')                                                            // 58
      && self.notFoundTemplate) {                                                                               // 59
    self.render(self.notFoundTemplate);                                                                         // 60
    this.renderYields();                                                                                        // 61
    self.stop();                                                                                                // 62
  }                                                                                                             // 63
};                                                                                                              // 64
                                                                                                                // 65
var autoRenderLoadingTemplateHook = function () {                                                               // 66
  var self = this;                                                                                              // 67
                                                                                                                // 68
  if (!this.ready()) {                                                                                          // 69
    if (this.loadingTemplate) {                                                                                 // 70
      this.render(this.loadingTemplate);                                                                        // 71
      this.renderYields();                                                                                      // 72
      this.stop();                                                                                              // 73
    }                                                                                                           // 74
  }                                                                                                             // 75
};                                                                                                              // 76
                                                                                                                // 77
var autoClearUnusedYieldsHook = function () {                                                                   // 78
  this.router && this.router.clearUnusedYields(this._renderedYields);                                           // 79
};                                                                                                              // 80
                                                                                                                // 81
/*****************************************************************************/                                 // 82
/* RouteController */                                                                                           // 83
/*****************************************************************************/                                 // 84
RouteController = Utils.extend(IronRouteController, {                                                           // 85
  constructor: function () {                                                                                    // 86
    RouteController.__super__.constructor.apply(this, arguments);                                               // 87
                                                                                                                // 88
    var self = this;                                                                                            // 89
                                                                                                                // 90
    var getOption = function (key) {                                                                            // 91
      return Utils.pick(self.options[key], self[key]);                                                          // 92
    };                                                                                                          // 93
                                                                                                                // 94
    this.loadingTemplate = getOption('loadingTemplate');                                                        // 95
    this.notFoundTemplate = getOption('notFoundTemplate');                                                      // 96
    this.data = getOption('data');                                                                              // 97
    this.template = getOption('template') || (this.route && this.route.name);                                   // 98
    this.yieldTemplates = getOption('yieldTemplates');                                                          // 99
    this.layoutTemplate = getOption('layoutTemplate');                                                          // 100
                                                                                                                // 101
    /*                                                                                                          // 102
     * waitOn can come from the options or the prototype. We add the option                                     // 103
     * waitOn value first and then concatenate the prototype waitOn value.                                      // 104
     * Possible values are:                                                                                     // 105
     *                                                                                                          // 106
     * Router.configure({                                                                                       // 107
     *  waitOn: Meteor.subscribe('items')                                                                       // 108
     * });                                                                                                      // 109
     *                                                                                                          // 110
     * Router.route('someRoute', {                                                                              // 111
     *  waitOn: function () {                                                                                   // 112
     *    return Meteor.subscribe('item', this.params._id);                                                     // 113
     *  }                                                                                                       // 114
     * });                                                                                                      // 115
     *                                                                                                          // 116
     * waitOn => [{}, fn]                                                                                       // 117
     *  fn => could return an object or another array of objects                                                // 118
     *                                                                                                          // 119
     */                                                                                                         // 120
    this.waitOn = []                                                                                            // 121
      .concat(Utils.toArray(this.options.waitOn))                                                               // 122
      .concat(Utils.toArray(this.waitOn));                                                                      // 123
                                                                                                                // 124
    this._waitList = new WaitList;                                                                              // 125
  },                                                                                                            // 126
                                                                                                                // 127
  ready: function () {                                                                                          // 128
    return this._waitList.ready();                                                                              // 129
  },                                                                                                            // 130
                                                                                                                // 131
  /**                                                                                                           // 132
   * Stop running this controller and redirect to a new path. Same parameters as                                // 133
   * those of Router.go.                                                                                        // 134
   *                                                                                                            // 135
   * @api public                                                                                                // 136
   */                                                                                                           // 137
                                                                                                                // 138
  redirect: function (/* args */) {                                                                             // 139
    this.stop();                                                                                                // 140
    return this.router && this.router.go.apply(this.router, arguments);                                         // 141
  },                                                                                                            // 142
                                                                                                                // 143
  /**                                                                                                           // 144
   * Used to specify additional templates to render into named yield regions.                                   // 145
   * The default run method will first render the main template and then use                                    // 146
   * this property to render additional templates. Only used in the 'run'                                       // 147
   * method.                                                                                                    // 148
   *                                                                                                            // 149
   * Example:                                                                                                   // 150
   *                                                                                                            // 151
   *  yieldTemplates: {                                                                                         // 152
   *    'asideTemplateName': {to: 'aside', data: {}, waitOn: Sub},                                              // 153
   *    'footerTemplateName': {to: 'footer'}                                                                    // 154
   *  }                                                                                                         // 155
   *                                                                                                            // 156
   * @type {Object|null}                                                                                        // 157
   * @api public                                                                                                // 158
   */                                                                                                           // 159
                                                                                                                // 160
  yieldTemplates: null,                                                                                         // 161
                                                                                                                // 162
  layoutTemplate: null,                                                                                         // 163
                                                                                                                // 164
  /**                                                                                                           // 165
   * The default template to render                                                                             // 166
   *                                                                                                            // 167
   * @type {String|Function}                                                                                    // 168
   * @api public                                                                                                // 169
   */                                                                                                           // 170
                                                                                                                // 171
  template: null,                                                                                               // 172
                                                                                                                // 173
  /**                                                                                                           // 174
   * Optional template to be used while waiting. If specified, the loading                                      // 175
   * template is used automatically in the run method. You can also use it                                      // 176
   * manually.                                                                                                  // 177
   *                                                                                                            // 178
   * @type {String|Function}                                                                                    // 179
   * @api public                                                                                                // 180
   */                                                                                                           // 181
                                                                                                                // 182
  loadingTemplate: null,                                                                                        // 183
                                                                                                                // 184
  /**                                                                                                           // 185
   * Optional template to be used if data returns a falsy value. Used                                           // 186
   * automatically in the run method. You can also use it manually.                                             // 187
   *                                                                                                            // 188
   * @type {String|Function}                                                                                    // 189
   * @api public                                                                                                // 190
   */                                                                                                           // 191
                                                                                                                // 192
  notFoundTemplate: null,                                                                                       // 193
                                                                                                                // 194
  /**                                                                                                           // 195
   * A default data object or function to be used as the data context in                                        // 196
   * rendering.                                                                                                 // 197
   *                                                                                                            // 198
   * @type {Object|Function}                                                                                    // 199
   * @api public                                                                                                // 200
   */                                                                                                           // 201
                                                                                                                // 202
  data: {},                                                                                                     // 203
                                                                                                                // 204
  getData: function () {                                                                                        // 205
    return this.router && this.router.getData();                                                                // 206
  },                                                                                                            // 207
                                                                                                                // 208
  setData: function (data) {                                                                                    // 209
    this.router && this.router.setData(data);                                                                   // 210
  },                                                                                                            // 211
                                                                                                                // 212
  waitOn: null,                                                                                                 // 213
                                                                                                                // 214
  /*                                                                                                            // 215
   * Calls Meteor.subscribe but adds a wait method to the returned handle                                       // 216
   * object. If the user calls wait on the result, the subscription handle is                                   // 217
   * added to the RouteController's wait list.                                                                  // 218
   */                                                                                                           // 219
                                                                                                                // 220
  subscribe: function (/* same as Meteor.subscribe */) {                                                        // 221
    var self = this;                                                                                            // 222
                                                                                                                // 223
    var waitApi = (function () {                                                                                // 224
      var added = false;                                                                                        // 225
                                                                                                                // 226
      return {                                                                                                  // 227
        wait: function () {                                                                                     // 228
          // make idempotent                                                                                    // 229
          if (!added) {                                                                                         // 230
            self._waitList.push(this);                                                                          // 231
            added = true;                                                                                       // 232
          }                                                                                                     // 233
        }                                                                                                       // 234
      };                                                                                                        // 235
    })();                                                                                                       // 236
                                                                                                                // 237
    var handle = Meteor.subscribe.apply(this, arguments);                                                       // 238
    return _.extend(handle, waitApi);                                                                           // 239
  },                                                                                                            // 240
                                                                                                                // 241
  /**                                                                                                           // 242
   * Either specify a template to render or call with no arguments to render the                                // 243
   * RouteController's template plus all of the yieldTemplates.                                                 // 244
   *                                                                                                            // 245
   */                                                                                                           // 246
                                                                                                                // 247
  render: function (template, options) {                                                                        // 248
    var to;                                                                                                     // 249
    var template;                                                                                               // 250
    var layout;                                                                                                 // 251
    var self = this;                                                                                            // 252
                                                                                                                // 253
    var addRenderedYield = function (key) {                                                                     // 254
      if (self._renderedYields) {                                                                               // 255
        key = key || '__main__';                                                                                // 256
        self._renderedYields.push(key);                                                                         // 257
      }                                                                                                         // 258
    };                                                                                                          // 259
                                                                                                                // 260
    if (arguments.length == 0) {                                                                                // 261
      this.router && this.router.setTemplate(this.template);                                                    // 262
      addRenderedYield();                                                                                       // 263
                                                                                                                // 264
      this.renderYields();                                                                                      // 265
    } else {                                                                                                    // 266
      options = options || {};                                                                                  // 267
      to = options.to;                                                                                          // 268
      this.router && this.router.setTemplate(template, to);                                                     // 269
      addRenderedYield(to);                                                                                     // 270
    }                                                                                                           // 271
  },                                                                                                            // 272
                                                                                                                // 273
  // render all the templates                                                                                   // 274
  renderYields: function() {                                                                                    // 275
    var self = this;                                                                                            // 276
                                                                                                                // 277
    _.each(this.yieldTemplates, function (opts, tmpl) {                                                         // 278
      self.render(tmpl, opts)                                                                                   // 279
    });                                                                                                         // 280
  },                                                                                                            // 281
                                                                                                                // 282
  setLayout: function (template) {                                                                              // 283
    this.router && this.router.setLayout(template);                                                             // 284
  },                                                                                                            // 285
                                                                                                                // 286
  run: function () {                                                                                            // 287
    var self = this;                                                                                            // 288
    var args = _.toArray(arguments);                                                                            // 289
    var action = _.isFunction(this.action) ? this.action : this[this.action];                                   // 290
                                                                                                                // 291
    Utils.assert(action,                                                                                        // 292
      "You don't have an action named \"" + this.action + "\" defined on your RouteController");                // 293
                                                                                                                // 294
    this.stopped = false;                                                                                       // 295
                                                                                                                // 296
    this._renderedYields = [];                                                                                  // 297
                                                                                                                // 298
    // when the waitlist status changes it will get cleared and then                                            // 299
    // populated again from any before hooks or action functions. For                                           // 300
    // subscriptions, we take advantage of the fact that Meteor won't subscribe                                 // 301
    // again to the same subscription because of a computation rerun.                                           // 302
    this._waitList.clear();                                                                                     // 303
                                                                                                                // 304
    /*                                                                                                          // 305
     * Each waitOn value could be an object, array or function. Because it's a                                  // 306
     * concatenation of waitOn options from Router -> Route -> RouteController.                                 // 307
     * So by the time we're done here we should just have a list of objects.                                    // 308
     */                                                                                                         // 309
    var waitOn = _.flatten(_.map(this.waitOn, function (fnOrHandle) {                                           // 310
      return _.isFunction(fnOrHandle) ? fnOrHandle.call(self) : fnOrHandle;                                     // 311
    }));                                                                                                        // 312
                                                                                                                // 313
    this._waitList.append(waitOn);                                                                              // 314
                                                                                                                // 315
    this.setLayout(this.layoutTemplate);                                                                        // 316
                                                                                                                // 317
    // Step 1: Run the before hooks                                                                             // 318
    this.runHooks('before', [                                                                                   // 319
      autoRenderLoadingTemplateHook,                                                                            // 320
      setDataHook,                                                                                              // 321
      autoRenderNotFoundTemplateHook,                                                                           // 322
    ]);                                                                                                         // 323
                                                                                                                // 324
    if (this.stopped) {                                                                                         // 325
      this.isFirstRun = false;                                                                                  // 326
      return;                                                                                                   // 327
    }                                                                                                           // 328
                                                                                                                // 329
    // Step 2: If we're not stopped, run the action                                                             // 330
    action.call(this);                                                                                          // 331
                                                                                                                // 332
    // Step 3: Run the after hooks                                                                              // 333
    this.runHooks('after', [                                                                                    // 334
      autoClearUnusedYieldsHook                                                                                 // 335
    ]);                                                                                                         // 336
                                                                                                                // 337
    // We've run at least once                                                                                  // 338
    this.isFirstRun = false;                                                                                    // 339
  },                                                                                                            // 340
                                                                                                                // 341
  wait: function (handle) {                                                                                     // 342
    handle = _.isFunction(handle) ? handle.call(this) : handle;                                                 // 343
    // handle could be an object or a array if a function returned an array                                     // 344
    this._waitList.append(handle);                                                                              // 345
  },                                                                                                            // 346
                                                                                                                // 347
  action: function () {                                                                                         // 348
    this.render();                                                                                              // 349
  }                                                                                                             // 350
});                                                                                                             // 351
                                                                                                                // 352
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/iron-router/lib/client/helpers.js                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
if (Handlebars) {                                                                                               // 1
  Handlebars.registerHelper('pathFor', function (routeName, params, options) {                                  // 2
                                                                                                                // 3
    if (arguments.length == 2) {                                                                                // 4
      options = params;                                                                                         // 5
      params = this;                                                                                            // 6
    }                                                                                                           // 7
                                                                                                                // 8
    var hash = options.hash.hash;                                                                               // 9
    var query = _.omit(options.hash, 'hash');                                                                   // 10
                                                                                                                // 11
    return Router.path(routeName, params, {                                                                     // 12
      query: query,                                                                                             // 13
      hash: hash                                                                                                // 14
    });                                                                                                         // 15
  });                                                                                                           // 16
                                                                                                                // 17
  Handlebars.registerHelper('urlFor', function (routeName, params, options) {                                   // 18
    if (arguments.length == 2) {                                                                                // 19
      options = params;                                                                                         // 20
      params = this;                                                                                            // 21
    }                                                                                                           // 22
                                                                                                                // 23
    var hash = options.hash.hash;                                                                               // 24
    var query = _.omit(options.hash, 'hash');                                                                   // 25
                                                                                                                // 26
    return Router.url(routeName, params, {                                                                      // 27
      query: query,                                                                                             // 28
      hash: hash                                                                                                // 29
    });                                                                                                         // 30
  });                                                                                                           // 31
                                                                                                                // 32
  Handlebars.registerHelper('renderRouter', function (options) {                                                // 33
    return new Handlebars.SafeString(Router.render());                                                          // 34
  });                                                                                                           // 35
                                                                                                                // 36
  Handlebars.registerHelper('currentRouteController', function () {                                             // 37
    return Router.current();                                                                                    // 38
  });                                                                                                           // 39
                                                                                                                // 40
  Handlebars.registerHelper('link', function (options) {                                                        // 41
    var hash = options.hash || {};                                                                              // 42
    var route = hash.route;                                                                                     // 43
    var params = hash.params || this;                                                                           // 44
    var query = hash.query;                                                                                     // 45
    var urlHash = hash.hash;                                                                                    // 46
    var cls = hash['class'] || '';                                                                              // 47
                                                                                                                // 48
    var path = Router.path(route, params, {                                                                     // 49
      query: query,                                                                                             // 50
      hash: urlHash                                                                                             // 51
    });                                                                                                         // 52
                                                                                                                // 53
    var html = '<a href="' + path + '" class="' + cls + '">';                                                   // 54
    html += options.fn(this);                                                                                   // 55
    html += '</a>'                                                                                              // 56
                                                                                                                // 57
    return new Handlebars.SafeString(html);                                                                     // 58
  });                                                                                                           // 59
}                                                                                                               // 60
                                                                                                                // 61
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron-router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  IronLocation: IronLocation,
  Utils: Utils,
  IronRouteController: IronRouteController,
  IronRouter: IronRouter,
  PageManager: PageManager,
  ClientRouter: ClientRouter
};

})();

//# sourceMappingURL=7a9e077ee92fd60193e5d33532c9c2406c28cb5b.map
