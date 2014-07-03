(function(){
Template.__define__("navbar", (function() {
  var self = this;
  var template = this;
  return [ HTML.DIV({
    id: "navbar",
    "class": "navbar navbar-default"
  }, "\n  ", HTML.DIV({
    "class": "container"
  }, "\n", HTML.UL({
    "class": "nav navbar-nav"
  }, "\n  ", HTML.A({
    href: "/",
    "class": "navbar-brand"
  }, HTML.Raw('\n    <img src="/img/logo.png" style="height: 24px"> '), function() {
    return Spacebars.mustache(self.lookup("getOption"), "sitename");
  }, "\n\n  "), "\n  ", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return HTML.LI(HTML.A({
      href: "/transfer/"
    }, "Transfer"));
  })), HTML.Raw('\n  <li><a href="/wanted/" class="text-muted">Wanted</a></li>\n  <li><a href="/offers/" class="text-muted">Offers</a></li>\n  <li><a href="/groups/" class="text-muted">Groups</a></li>\n  <li><a href="/stats/" class="text-muted">Stats</a></li>\n\n  <li><a href="/about/" class="text-muted">About</a></li>\n')), HTML.Raw('\n  <form role="search" class="navbar-form navbar-left">\n\n    <input type="text" class="input-sm form-control" id="navbarSearch" placeholder="Search Users" length="20">\n</form>\n'), UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n", HTML.DIV({
      id: "userProfile",
      "class": "navbar-text navbar-right small text-muted"
    }, "\n\n    ", HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
      } ],
      title: "My profile"
    }, HTML.IMG({
      src: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "picture"));
      },
      "class": "avatar"
    })), " ", HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
      } ],
      title: "My profile"
    }, function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
    }), " | ", HTML.B("Balance:"), " ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }, " ", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "balance"));
    }, " | \n    ", HTML.SPAN({
      "class": "dropdown",
      id: "notificationWrapper"
    }, "\n  ", HTML.A({
      "class": "text-muted",
      style: "text-decoration: none",
      id: "notificationIcon",
      role: "button",
      "data-toggle": "dropdown",
      "data-target": "notificationList"
    }, "\n    ", HTML.I({
      "class": "fa fa-bell"
    }, " "), " ", HTML.SPAN({
      "class": "label label-danger"
    }, function() {
      return Spacebars.mustache(self.lookup("myUnreadNotificationsCount"));
    }), "\n  "), "\n\n\n  ", HTML.UL({
      "class": "dropdown-menu col-md-8 list-unstyled",
      id: "notificationList",
      role: "menu",
      "aria-labelledby": "notificationIcon"
    }, "\n  ", UI.Each(function() {
      return Spacebars.dataMustache(self.lookup("myNotifications"), 10);
    }, UI.block(function() {
      var self = this;
      return [ "\n  ", HTML.LI({
        "data-id": function() {
          return Spacebars.mustache(self.lookup("_id"));
        },
        "class": [ "small col-md-12 ", UI.If(function() {
          return Spacebars.call(self.lookup("read"));
        }, UI.block(function() {
          var self = this;
          return "read";
        }), UI.block(function() {
          var self = this;
          return "unread";
        })) ]
      }, HTML.DIV(function() {
        return Spacebars.mustache(self.lookup("message"));
      }), HTML.DIV({
        "class": "small text-muted pull-right"
      }, function() {
        return Spacebars.mustache(self.lookup("relativeTime"), self.lookup("timestamp"));
      }), HTML.HR()), "\n  " ];
    })), "\n  ", HTML.Comment(" <div class='text-center small'>Show all notifications</div> "), "\n  "), "\n"), " | ", HTML.A({
      "class": "logout"
    }, HTML.I({
      "class": "fa fa-unlock-alt"
    }), " Logout"), "\n\n"), "\n" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n", HTML.DIV({
      "class": "navbar-text navbar-right small"
    }, "\n  ", HTML.A({
      "class": "btn btn-default btn-xs",
      "data-toggle": "modal",
      "data-target": "#loginModal"
    }, "Login"), "\n  ", HTML.A({
      href: "/signup",
      "class": "btn btn-default btn-xs"
    }, "Signup"), "\n\n"), "\n" ];
  })), "\n"), "\n"), HTML.Raw("\n<!--\n <header>\n\n<div class='container'>\n  <div class='row'>\n    <div class='col-md-4 brand'>\n      <div class='row'>\n      <a href='/'>\n      <div class='col-md-2'>\n        <img src='/img/logo.png'>\n      </div><div class='col-md-10'>\n\n        <div class='title'>\n          {{getOption \"sitename\"}}\n        </div>\n              <div class='subtitle small'>\n              {{getOption \"siteSubtitle\"}}\n            </div>\n      </a>\n      </div>\n      </div>\n\n    </div>\n{{#if currentUser}}\n    <div class='col-md-3 account-info well well-sm pull-right col-md-offset-1'>\n      <div class='col-md-2'>\n               <img src='{{currentUser.profile.picture}}' class='avatar'>\n      </div>\n      <div class='col-md-10'>\n        <span class='pull-right small logout btn btn-sm btn-link'>Logout</span>\n              <div class='username'><a href='/users/{{currentUser.username}}'>{{currentUser.username}}</a></div>\n              <div class='balance small'>{{getOption \"currencyAbbr\"}} {{currentUser.profile.balance}}</div>\n            </div>\n    </div>\n\n{{else}}\n    <div class='col-md-3 login well well-sm pull-right small'>\n      <form role='form' id='loginForm'>\n      <fieldset>\n<input class='form-control input-sm username' name='username' placeholder='username'>\n<input class='form-control input-sm password' type='password' name='password' placeholder='password'>\n      </fieldset>\n      <div>\n        <a id='loginFacebook' class='btn btn-primary btn-sm' ></i> Login With Facebook</a>\n        <button type='submit' class='btn btn-success btn-sm pull-right'>Login</button>\n      </div>\n    </form>\n    </div>\n{{/if}}\n\n\n\n  </div>\n</div> \n\n  </header> -->") ];
}));

})();
