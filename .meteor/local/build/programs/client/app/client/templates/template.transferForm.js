(function(){Template.__define__("transferForm",Package.handlebars.Handlebars.json_ast_to_func(["<form role='form' class='form-inline transferForm' id='sendForm'>\n<!-- <div class='col-md-4 well well-sm small' id='userOne'>\n\t<div class='col-md-3'><img src='",["{",[[0,"currentUser","profile","picture"]]],"' class='avatar'></div>\n\t<div class='col-md-9 text-muted'>\n\t\t<div>",["{",[[0,"currentUser","username"]]],"</div>\n\t\t<div>",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"currentUser","profile","balance"]]],"</div>\n\t\t<div class='small'>&nbsp;</div>\n\t</div>\n</div>\n\n<div class='col-md-4 text-center'>\n\t\t<select id='toFrom' name='toFrom' class='form-control input-sm'>\n\t\t\t<option value='send' ",["#",[[0,"if"],[0,"send"]],["selected='selected'"]],">Send To</option>\n\t\t\t<option value='request' ",["#",[[0,"if"],[0,"request"]],["selected='selected'"]],">Request From</option>\n\t\t</select>\n</div>\n -->\n<fieldset class='form-group col-md-12'>\n \t\t<select id='toFrom' name='toFrom' class='form-control input-sm'>\n\t\t\t<option value='send'>Send To</option>\n\t\t\t<option value='request'>Request From</option>\n\t\t</select>\n\t</fieldset>\n<div class='col-md-12 small' id='userTwo'>\n\t",["#",[[0,"if"],[0,"recipient"]],["\n\t<div class='col-md-4 small'>\n\t\t",["#",[[0,"with"],[0,"recipient"]],["\n\t<div class='col-md-3'><img src='",["{",[[0,"profile","picture"]]],"' class='avatar'></div>\n\t<div class='col-md-9'>\n\t\t<div>",["{",[[0,"username"]]],"</div>\n\t\t<div>",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"profile","balance"]]],"</div>\n\t\t<div class='small'>&nbsp;</div>\n\t</div>\n\t<input type='hidden' name='userTwoId' value='",["{",[[0,"_id"]]],"'>\n\t"]],"\n</div>\n\t"],["\n\t<fieldset>\n\t<div class=\"input-group\">\n\t\t<span class=\"input-group-addon\">To</span>\n\t\t<input name='email' class='form-control userSearch' placeholder='Search users or enter recipient email'>\n\t</div>\n</fieldset>\n\t"]],"\n</div>\n<fieldset class='col-md-12 form-group'>\n\n\t\t<div class=\"input-group\">\n\t\t  <span class=\"input-group-addon\">",["{",[[0,"getOption"],"currencyAbbr"]],"</span>\n\t\t  <input type=\"text\" name='amount' class=\"form-control amount\" placeholder=\"Minutes (please use multiples of 5/10 min! estimating is OK!)\" ",["#",[[0,"if"],[0,"amount"]],["value='",["{",[[0,"amount"]]],"'"]],">\n\t\t</div>\n</fieldset>\n<fieldset class='col-md-12 form-group'>\n<div class=\"col-md-12 input-group\">\n  <span class=\"input-group-addon\">For</span>\n  <input type=\"text\" class=\"form-control description\" name='description' placeholder=\"Optional description, e.g. hours of lawn mowing.\" ",["#",[[0,"if"],[0,"description"]],["value='",["{",[[0,"description"]]],"'"]],">\n</div>\n</fieldset>\n\n<div class='col-md-12 text-right'>\t\t  \n\t<button type='submit' class='form-control btn btn-primary'>Send</button>\n</div>\n</form>"]));

})();
