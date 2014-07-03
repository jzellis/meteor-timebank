(function(){
Template.__define__("loginThingy", (function() {
  var self = this;
  var template = this;
  return function() {
    return Spacebars.mustache(self.lookup("loginButtons"));
  };
}));

})();
