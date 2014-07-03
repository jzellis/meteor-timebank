(function(){
Template.__define__("about", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", HTML.DIV({
    "class": "col-md-10 col-md-offset-1"
  }, "\n", HTML.DIV({
    "class": "panel panel-default"
  }, "\n	", HTML.DIV({
    "class": "panel-body"
  }, "\n", HTML.DIV({
    "class": "row"
  }, "\n", HTML.DIV({
    "class": "col-md-12"
  }, "\n\n		", HTML.H1(function() {
    return Spacebars.mustache(self.lookup("getOption"), "sitename");
  }), HTML.Raw("\n		<hr>\n		"), HTML.DIV({
    "class": "lead"
  }, function() {
    return Spacebars.makeRaw(Spacebars.mustache(self.lookup("getOption"), "description"));
  }), "\n	"), "\n"), "\n"), "\n"), "\n"));
}));

})();
