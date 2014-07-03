(function(){
Template.__define__("send", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.DIV({
      "class": "col-md-8 col-md-offset-2"
    }, "\n	", Spacebars.include(self.lookupTemplate("transferForm")), "\n"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n	", HTML.H2("You must be logged in to do this."), "\n	" ];
  })), "\n");
}));

})();
