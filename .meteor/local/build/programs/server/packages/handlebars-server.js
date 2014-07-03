(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Handlebars, OriginalHandlebars;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/handlebars-server/handlebars-server.js                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
OriginalHandlebars = Npm.require('handlebars');                      // 1
Handlebars = Handlebars || {};                                       // 2
                                                                     // 3
_.extend(Handlebars, {                                               // 4
  templates: {},                                                     // 5
});                                                                  // 6
                                                                     // 7
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['handlebars-server'] = {
  Handlebars: Handlebars,
  OriginalHandlebars: OriginalHandlebars
};

})();
