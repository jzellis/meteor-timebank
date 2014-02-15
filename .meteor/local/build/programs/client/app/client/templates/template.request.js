(function(){Template.__define__("request",Package.handlebars.Handlebars.json_ast_to_func(["<div class='container'>\n\t<h1>Request ",["{",[[0,"getOption"],"currencyName"]]," from ",["{",[[0,"recipient","username"]]],"</h1>\n\t<p>You are requesting ",["#",[[0,"if"],[0,"amount"]],["<b>",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"amount"]]],"</b>"],[["{",[[0,"getOption"],"currencyName"]]]]," from <b><a href='/users/",["{",[[0,"recipient","username"]]],"'>",["{",[[0,"recipient","username"]]],"</a></b> (",["{",[[0,"recipient","emails","0","address"]]],").</p>\n\t<form role='form'>\n\t\t<input type='hidden' id='recipientId' value='",["{",[[0,"recipient","_id"]]],"'>\n\t\t<fieldset class='form-group'>\n\t\t<label for='amount'>Amount</label>\n\t\t<div class=\"input-group input-group-lg\">\n  <span class=\"input-group-addon\">",["{",[[0,"getOption"],"currencyAbbr"]],"</span>\n\t\t<input type='text' class='form-control' id='amount' ",["#",[[0,"if"],[0,"amount"]],["value='",["{",[[0,"amount"]]],"'"]],">\n\t</div>\n\t</fieldset>\n\t\t\t<fieldset class='form-group'>\n\t\t<label for='description'>Description</label>\n\t<textarea id='description' class='form-control' rows='4'></textarea>\n\t</fieldset>\n\t<fieldset>\n\t\t<button type='submit' class='btn btn-lg btn-success'>Request</button>\n\t</fieldset>\n\t</form>\n</div>"]));

})();