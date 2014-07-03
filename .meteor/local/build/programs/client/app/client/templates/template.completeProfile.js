(function(){
Template.__define__("completeProfile", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, HTML.Raw('\n	<h2>Complete Profile</h2>\n	<div class="col-md-12" role="form">You\'re almost done! We just need you to provide some final info about yourself.</div>\n	'), HTML.FORM({
    "class": "col-md-12"
  }, "\n		", HTML.DIV({
    "class": "well"
  }, HTML.Raw('\n	<fieldset class="form-group">\n		<label for="email">Email</label>\n		<input type="email" class="form-control" id="email">\n	</fieldset>\n	<fieldset class="form-group">\n		<label for="url">Homepage/URL</label>\n		<input class="form-control" id="url">\n	</fieldset>\n	'), HTML.FIELDSET({
    "class": "form-group"
  }, HTML.Raw('\n		<label for="bio">Bio</label>\n		'), HTML.TEXTAREA({
    "class": "form-control",
    id: "bio"
  }), "\n	"), HTML.Raw('\n		<fieldset class="form-group" style="text-align:center">\n		<button type="submit" class="btn btn-success btn-lg">Complete profile</button>\n	</fieldset>\n')), "\n	"), "\n	");
}));

})();
