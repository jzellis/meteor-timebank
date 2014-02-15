(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Handlebars = Package.handlebars.Handlebars;
var _ = Package.underscore._;

/* Package-scope variables */
var OriginalHandlebars;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/handlebars-server/handlebars-server.js                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
OriginalHandlebars = Npm.require('handlebars');                      // 1
                                                                     // 2
_.extend(Handlebars, {                                               // 3
  templates: {},                                                     // 4
});                                                                  // 5
                                                                     // 6
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['handlebars-server'] = {
  OriginalHandlebars: OriginalHandlebars
};

})();
