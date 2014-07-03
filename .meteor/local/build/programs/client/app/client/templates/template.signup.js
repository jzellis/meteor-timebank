(function(){
Template.__define__("signup", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", HTML.DIV({
    "class": "col-md-6 col-md-offset-3"
  }, "\n		", HTML.H1("Signup for ", function() {
    return Spacebars.mustache(self.lookup("getOption"), "sitename");
  }, "!"), "\n			", HTML.FORM({
    role: "form",
    id: "accountForm",
    "class": "well"
  }, "\n", Spacebars.include(self.lookupTemplate("accountForm")), HTML.Raw('\n	<fieldset>\n		<button type="submit" class="btn">Signup</button>\n	</fieldset>\n	')), "\n"), "\n	");
}));

})();
