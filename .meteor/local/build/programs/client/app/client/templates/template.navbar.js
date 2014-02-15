(function(){Template.__define__("navbar",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"navbar navbar-default\" role=\"navigation\">\n      <div class=\"container\">\n        <div class=\"navbar-header\">\n          <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n          </button>\n          <a class=\"navbar-brand\" href=\"/\">",["#",[[0,"if"],[0,"getImage"],"siteImage"],["<img src='",["{",[[0,"getImage"],"siteImage"]],"' style='height: 1em'>"]]," ",["{",[[0,"getOption"],"sitename"]],"</a>\n        </div>\n        <div class=\"collapse navbar-collapse\">\n          <ul class=\"nav navbar-nav\">\n            <li><form><a class='btn btn-default navbar-btn' href='/'>Send</a></form></li>\n            <li><a href=\"about\">About</a></li>\n          </ul>\n                    <ul class=\"nav navbar-nav navbar-left\">\n<li><form class=\"navbar-form navbar-right\" role=\"search\">\n  <div class=\"form-group\">\n    <input type=\"text\" class=\"input-sm form-control\" id='navbarSearch' placeholder=\"Search Users\">\n  </div>\n</form>\n</li>\n</ul>\n\n\n          <ul class=\"nav navbar-nav navbar-right\">\n            ",["#",[[0,"if"],[0,"currentUser"]],["\n<li class='col-md-12' style='padding-top:9px'>\n\n\n    <div class='row'>\n    <div class='col-md-2'>\n      <img src='",["{",[[0,"currentUser","profile","picture"]]],"' style='height: 2.25em'>\n    </div>\n    <div class='col-md-10'>\n      <div class='row'>\n        <div class='col-md-12 h4'><a href='/account'>",["{",[[0,"currentUser","username"]]],"</a></div>\n      </div>\n      <div class='row'>\n        <div class='col-md-6 small'><b>",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"currentUser","profile","balance"]]],"</b></div>\n        <div class='col-md-4 small'><a href='/users/",["{",[[0,"currentUser","username"]]],"'>Profile</a></div>\n\n        <div class='col-md-2 text-right small logout btn-link'>Logout</div>\n      </div>\n\n\n\n</li>\n\n            "],["\n            <li class='dropdown'><a href='#' class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              Signup/Login <b class=\"caret\"></b></a>\n              <ul class=\"dropdown-menu\" style='padding: 1em'>\n          <li><a id='loginFacebook' class='btn btn-primary' style='color:white'><i class='fa fa-facebook-square'></i> Login With Facebook</a></li>\n          <li class='divider'></li>\n\n          <li><form role='form' id='loginForm'><fieldset class='form-group'><input type='text' name='username' class='form-control' placeholder='Username/Email' style='margin-bottom: .5em'>\n          <input type='password' name='password' class='form-control' placeholder='Password'>\n          </fieldset><button type='submit' class='form-control btn-success'>Login</button></form>          </li>\n          <li class='divider'></li>\n          <li style='text-align:center'><b><a href='/signup'>Signup</a></b></li>\n\n        </ul>\n              </li>\n              "]],"\n          </ul>\n\n        </div><!--/.nav-collapse -->\n      </div>\n    </div>"]));

})();
