(function(){
Template.__define__("transfer", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", HTML.DIV({
    "class": "col-md-8 col-md-offset-2 panel panel-default"
  }, "\n			", HTML.DIV({
    "class": "panel-body"
  }, "\n\n		", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n			", HTML.H2(HTML.I({
      "class": "fa fa-heart",
      style: "color: #f00"
    }), " Send ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }), "\n			", HTML.HR(), "\n\n	", Spacebars.include(self.lookupTemplate("transferForm")), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n	", HTML.H2("You must be logged in to do this."), "\n	" ];
  })), "\n	"), "\n\n"), "\n");
}));

})();
