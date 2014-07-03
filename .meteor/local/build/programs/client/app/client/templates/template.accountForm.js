(function(){
Template.__define__("accountForm", (function() {
  var self = this;
  var template = this;
  return [ HTML.FIELDSET({
    "class": "form-group"
  }, HTML.Raw('\n			<label for="username">Username</label>\n			'), HTML.INPUT({
    "class": "form-control",
    id: "username",
    value: UI.If(function() {
      return Spacebars.call(self.lookup("username"));
    }, UI.block(function() {
      var self = this;
      return function() {
        return Spacebars.mustache(self.lookup("username"));
      };
    })),
    required: ""
  }), "\n		"), HTML.Raw('\n		<fieldset>\n			<label for="avatar">User Picture/Avatar (maximum file size 4MB)</label>\n			<input type="file" name="avatar" class="form-control" id="avatar">\n		</fieldset>\n		<fieldset class="form-group">\n			<label for="email">Email</label>\n			<input class="form-control" type="email" id="email">\n		</fieldset>\n		<fieldset class="form-group">\n			<label for="password">Password</label>\n			<input class="form-control" id="password" name="password" type="password">\n		</fieldset>\n		<fieldset class="form-group">\n			<label for="password2">Repeat Password</label>\n			<input class="form-control" id="password2" name="password2" type="password">\n		</fieldset>\n		<fieldset class="form-group">\n			<label for="fullName">Full Name</label>\n			<input class="form-control" id="fullName">\n		</fieldset>\n		<fieldset class="form-group">\n			<label for="url">Homepage/Business URL</label>\n			<input class="form-control" id="url" placeholder="http://www.mysite.com">\n		</fieldset>\n		'), HTML.FIELDSET({
    "class": "form-group"
  }, HTML.Raw('\n			<label for="bio">Description/short bio</label>\n			'), HTML.TEXTAREA({
    "class": "form-control",
    id: "bio",
    placeholder: "Tell us a little about you and/or your business or service."
  }), "\n		") ];
}));

})();
