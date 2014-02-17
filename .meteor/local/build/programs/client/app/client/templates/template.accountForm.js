(function(){Template.__define__("accountForm",Package.handlebars.Handlebars.json_ast_to_func(["<fieldset class='form-group'>\n\t\t\t<label for='username'>Username</label>\n\t\t\t<input class='form-control' id='username' ",["#",[[0,"if"],[0,"username"]],["value='",["{",[[0,"username"]]],"'"]]," required>\n\t\t</fieldset>\n\t\t<fieldset>\n\t\t\t<label for='avatar'>User Picture/Avatar (maximum file size 4MB)</label>\n\t\t\t<input type='file' name='avatar' class='form-control' id='avatar'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='email'>Email</label>\n\t\t\t<input class='form-control' type='email' id='email'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='password'>Password</label>\n\t\t\t<input class='form-control' id='password' name='password' type='password'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='password2'>Repeat Password</label>\n\t\t\t<input class='form-control' id='password2' name='password2' type='password'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='fullName'>Full Name</label>\n\t\t\t<input class='form-control' id='fullName'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='url'>Homepage/Business URL</label>\n\t\t\t<input class='form-control' id='url' placeholder='http://www.mysite.com'>\n\t\t</fieldset>\n\t\t<fieldset class='form-group'>\n\t\t\t<label for='bio'>Description/short bio</label>\n\t\t\t<textarea class='form-control' id='bio' Placeholder='Tell us a little about you and/or your business or service.'></textarea>\n\t\t</fieldset>"]));

})();
