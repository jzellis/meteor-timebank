(function(){
Template.__define__("autocompleteSuggestion", (function() {
  var self = this;
  var template = this;
  return [ HTML.DIV({
    "class": "text-left"
  }, "\n	", HTML.DIV({
    "class": "col-md-4"
  }, HTML.IMG({
    src: function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
    },
    style: "height: 3em"
  })), "\n	", HTML.DIV({
    "class": "col-md-8"
  }, function() {
    return Spacebars.mustache(self.lookup("username"));
  }), "\n	"), "\n", HTML.DIV({
    "class": "row"
  }, "\n	", HTML.DIV({
    "class": "col-md-12"
  }, HTML.SMALL("Balance: ", function() {
    return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "balance"));
  })), "\n") ];
}));

})();
