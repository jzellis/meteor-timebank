(function(){Template.__define__("navbar",Package.handlebars.Handlebars.json_ast_to_func(["<div id='navbar' class='navbar navbar-default'>\n  <div class='container'>\n<ul class=\"nav navbar-nav\">\n  <a href='/'class='navbar-brand'>\n    <img src='/img/logo.png' style='height: 24px'> ",["{",[[0,"getOption"],"sitename"]],"\n\n  </a>\n  ",["#",[[0,"if"],[0,"currentUser"]],["<li><a href='/transfer/'>Transfer</a></li>"]],"\n  <li><a href='/wanted/' class='text-muted'>Wanted</a></li>\n  <li><a href='/offers/' class='text-muted'>Offers</a></li>\n  <li><a href='/groups/' class='text-muted'>Groups</a></li>\n  <li><a href='/stats/' class='text-muted'>Stats</a></li>\n\n  <li><a href='/about/' class='text-muted'>About</a></li>\n</ul>\n  <form role=\"search\" class='navbar-form navbar-left'>\n\n    <input type=\"text\" class=\"input-sm form-control\" id='navbarSearch' placeholder=\"Search Users\" length=\"20\">\n</form>\n",["#",[[0,"if"],[0,"currentUser"]],["\n<div class=\"navbar-text navbar-right small text-muted\">\n\n    <a href='/users/",["{",[[0,"currentUser","username"]]],"' title='My profile'><img src='",["{",[[0,"currentUser","profile","picture"]]],"' class='avatar'></a> <a href='/users/",["{",[[0,"currentUser","username"]]],"' title='My profile'>",["{",[[0,"currentUser","username"]]],"</a> | <b>Balance:</b> ",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"currentUser","profile","balance"]]]," | <a class='logout'><i class='fa fa-unlock-alt'></i> Logout</a>\n\n</div>\n"],["\n<div class='navbar-text navbar-right small'>\n  <a class='btn btn-default btn-xs'data-toggle=\"modal\" data-target=\"#loginModal\">Login</a>\n  <a href='/signup' class='btn btn-default btn-xs'>Signup</a>\n\n</div>\n"]],"\n</div>\n</div>\n<!--\n <header>\n\n<div class='container'>\n  <div class='row'>\n    <div class='col-md-4 brand'>\n      <div class='row'>\n      <a href='/'>\n      <div class='col-md-2'>\n        <img src='/img/logo.png'>\n      </div><div class='col-md-10'>\n\n        <div class='title'>\n          ",["{",[[0,"getOption"],"sitename"]],"\n        </div>\n              <div class='subtitle small'>\n              ",["{",[[0,"getOption"],"siteSubtitle"]],"\n            </div>\n      </a>\n      </div>\n      </div>\n\n    </div>\n",["#",[[0,"if"],[0,"currentUser"]],["\n    <div class='col-md-3 account-info well well-sm pull-right col-md-offset-1'>\n      <div class='col-md-2'>\n               <img src='",["{",[[0,"currentUser","profile","picture"]]],"' class='avatar'>\n      </div>\n      <div class='col-md-10'>\n        <span class='pull-right small logout btn btn-sm btn-link'>Logout</span>\n              <div class='username'><a href='/users/",["{",[[0,"currentUser","username"]]],"'>",["{",[[0,"currentUser","username"]]],"</a></div>\n              <div class='balance small'>",["{",[[0,"getOption"],"currencyAbbr"]]," ",["{",[[0,"currentUser","profile","balance"]]],"</div>\n            </div>\n    </div>\n\n"],["\n    <div class='col-md-3 login well well-sm pull-right small'>\n      <form role='form' id='loginForm'>\n      <fieldset>\n<input class='form-control input-sm username' name='username' placeholder='username'>\n<input class='form-control input-sm password' type='password' name='password' placeholder='password'>\n      </fieldset>\n      <div>\n        <a id='loginFacebook' class='btn btn-primary btn-sm' ></i> Login With Facebook</a>\n        <button type='submit' class='btn btn-success btn-sm pull-right'>Login</button>\n      </div>\n    </form>\n    </div>\n"]],"\n\n\n\n  </div>\n</div> \n\n  </header> -->"]));

})();
