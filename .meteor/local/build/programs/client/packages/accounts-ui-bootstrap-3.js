//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Session = Package.session.Session;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;
var Template = Package.templating.Template;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var $modal;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/accounts_ui.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (!Accounts.ui)                                                                                                      // 1
	Accounts.ui = {};                                                                                                     // 2
                                                                                                                       // 3
if (!Accounts.ui._options) {                                                                                           // 4
	Accounts.ui._options = {                                                                                              // 5
		requestPermissions: {},                                                                                              // 6
		extraSignupFields: []                                                                                                // 7
	};                                                                                                                    // 8
}                                                                                                                      // 9
                                                                                                                       // 10
Accounts.ui.navigate = function (route, hash) {                                                                        // 11
	// if router is iron-router                                                                                           // 12
	if(window.Router && _.isFunction(Router.go)) {                                                                        // 13
		Router.go(route, hash);                                                                                              // 14
	}                                                                                                                     // 15
}                                                                                                                      // 16
                                                                                                                       // 17
Accounts.ui.config = function(options) {                                                                               // 18
	// validate options keys                                                                                              // 19
	var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'extraSignupFields', 'requestOfflineToken'];          // 20
	_.each(_.keys(options), function(key) {                                                                               // 21
		if (!_.contains(VALID_KEYS, key))                                                                                    // 22
			throw new Error("Accounts.ui.config: Invalid key: " + key);                                                         // 23
	});                                                                                                                   // 24
                                                                                                                       // 25
	// deal with `passwordSignupFields`                                                                                   // 26
	if (options.passwordSignupFields) {                                                                                   // 27
		if (_.contains([                                                                                                     // 28
			"USERNAME_AND_EMAIL_CONFIRM",                                                                                       // 29
			"USERNAME_AND_EMAIL",                                                                                               // 30
			"USERNAME_AND_OPTIONAL_EMAIL",                                                                                      // 31
			"USERNAME_ONLY",                                                                                                    // 32
			"EMAIL_ONLY"                                                                                                        // 33
		], options.passwordSignupFields)) {                                                                                  // 34
			if (Accounts.ui._options.passwordSignupFields)                                                                      // 35
				throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");                            // 36
			else                                                                                                                // 37
				Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;                                          // 38
		} else {                                                                                                             // 39
			throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);  // 40
		}                                                                                                                    // 41
	}                                                                                                                     // 42
                                                                                                                       // 43
	// deal with `requestPermissions`                                                                                     // 44
	if (options.requestPermissions) {                                                                                     // 45
		_.each(options.requestPermissions, function(scope, service) {                                                        // 46
			if (Accounts.ui._options.requestPermissions[service]) {                                                             // 47
				throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);               // 48
			} else if (!(scope instanceof Array)) {                                                                             // 49
				throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");                            // 50
			} else {                                                                                                            // 51
				Accounts.ui._options.requestPermissions[service] = scope;                                                          // 52
			}                                                                                                                   // 53
		});                                                                                                                  // 54
		if (typeof options.extraSignupFields !== 'object' || !options.extraSignupFields instanceof Array) {                  // 55
			throw new Error("Accounts.ui.config: `extraSignupFields` must be an array.");                                       // 56
		} else {                                                                                                             // 57
			if (options.extraSignupFields) {                                                                                    // 58
				_.each(options.extraSignupFields, function(field, index) {                                                         // 59
					if (!field.fieldName || !field.fieldLabel)                                                                        // 60
						throw new Error("Accounts.ui.config: `extraSignupFields` objects must have `fieldName` and `fieldLabel` attributes.");
					if (typeof field.visible === 'undefined')                                                                         // 62
						field.visible = true;                                                                                            // 63
					Accounts.ui._options.extraSignupFields[index] = field;                                                            // 64
				});                                                                                                                // 65
			}                                                                                                                   // 66
		}                                                                                                                    // 67
	}                                                                                                                     // 68
};                                                                                                                     // 69
                                                                                                                       // 70
Accounts.ui._passwordSignupFields = function() {                                                                       // 71
	return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";                                                     // 72
};                                                                                                                     // 73
                                                                                                                       // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/template.login_buttons.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("_loginButtons", (function() {                                                                     // 2
  var self = this;                                                                                                     // 3
  var template = this;                                                                                                 // 4
  return UI.If(function() {                                                                                            // 5
    return Spacebars.call(self.lookup("currentUser"));                                                                 // 6
  }, UI.block(function() {                                                                                             // 7
    var self = this;                                                                                                   // 8
    return [ "\n		", UI.If(function() {                                                                                // 9
      return Spacebars.call(self.lookup("loggingIn"));                                                                 // 10
    }, UI.block(function() {                                                                                           // 11
      var self = this;                                                                                                 // 12
      return [ "\n			\n			", UI.If(function() {                                                                        // 13
        return Spacebars.call(self.lookup("dropdown"));                                                                // 14
      }, UI.block(function() {                                                                                         // 15
        var self = this;                                                                                               // 16
        return [ "\n				", Spacebars.include(self.lookupTemplate("_loginButtonsLoggingIn")), "\n			" ];                // 17
      }), UI.block(function() {                                                                                        // 18
        var self = this;                                                                                               // 19
        return [ "\n				", HTML.DIV({                                                                                  // 20
          "class": "login-buttons-with-only-one-button"                                                                // 21
        }, "\n					", Spacebars.include(self.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n				"), "\n			" ];
      })), "\n		" ];                                                                                                   // 23
    }), UI.block(function() {                                                                                          // 24
      var self = this;                                                                                                 // 25
      return [ "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedIn")), "\n		" ];                     // 26
    })), "\n	" ];                                                                                                      // 27
  }), UI.block(function() {                                                                                            // 28
    var self = this;                                                                                                   // 29
    return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOut")), "\n	" ];                        // 30
  }));                                                                                                                 // 31
}));                                                                                                                   // 32
                                                                                                                       // 33
Template.__define__("_loginButtonsLoggedIn", (function() {                                                             // 34
  var self = this;                                                                                                     // 35
  var template = this;                                                                                                 // 36
  return UI.If(function() {                                                                                            // 37
    return Spacebars.call(self.lookup("dropdown"));                                                                    // 38
  }, UI.block(function() {                                                                                             // 39
    var self = this;                                                                                                   // 40
    return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedInDropdown")), "\n	" ];                 // 41
  }), UI.block(function() {                                                                                            // 42
    var self = this;                                                                                                   // 43
    return [ "\n	", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedInSingleLogoutButton")), "\n	" ];        // 44
  }));                                                                                                                 // 45
}));                                                                                                                   // 46
                                                                                                                       // 47
Template.__define__("_loginButtonsLoggedOut", (function() {                                                            // 48
  var self = this;                                                                                                     // 49
  var template = this;                                                                                                 // 50
  return UI.If(function() {                                                                                            // 51
    return Spacebars.call(self.lookup("services"));                                                                    // 52
  }, UI.block(function() {                                                                                             // 53
    var self = this;                                                                                                   // 54
    return [ " \n		", UI.If(function() {                                                                               // 55
      return Spacebars.call(self.lookup("configurationLoaded"));                                                       // 56
    }, UI.block(function() {                                                                                           // 57
      var self = this;                                                                                                 // 58
      return [ "\n			", UI.If(function() {                                                                             // 59
        return Spacebars.call(self.lookup("dropdown"));                                                                // 60
      }, UI.block(function() {                                                                                         // 61
        var self = this;                                                                                               // 62
        return [ " \n				", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutDropdown")), "\n			" ];       // 63
      }), UI.block(function() {                                                                                        // 64
        var self = this;                                                                                               // 65
        return [ "\n				", Spacebars.With(function() {                                                                 // 66
          return Spacebars.call(self.lookup("singleService"));                                                         // 67
        }, UI.block(function() {                                                                                       // 68
          var self = this;                                                                                             // 69
          return [ " \n						", UI.If(function() {                                                                     // 70
            return Spacebars.call(self.lookup("loggingIn"));                                                           // 71
          }, UI.block(function() {                                                                                     // 72
            var self = this;                                                                                           // 73
            return [ "\n							", Spacebars.include(self.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n						" ];
          }), UI.block(function() {                                                                                    // 75
            var self = this;                                                                                           // 76
            return [ "\n							", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n						" ];
          })), "\n				" ];                                                                                             // 78
        })), "\n			" ];                                                                                                // 79
      })), "\n		" ];                                                                                                   // 80
    })), "\n	" ];                                                                                                      // 81
  }), UI.block(function() {                                                                                            // 82
    var self = this;                                                                                                   // 83
    return [ "\n		", HTML.DIV({                                                                                        // 84
      "class": "no-services"                                                                                           // 85
    }, "No login services configured"), "\n	" ];                                                                       // 86
  }));                                                                                                                 // 87
}));                                                                                                                   // 88
                                                                                                                       // 89
Template.__define__("_loginButtonsMessages", (function() {                                                             // 90
  var self = this;                                                                                                     // 91
  var template = this;                                                                                                 // 92
  return [ UI.If(function() {                                                                                          // 93
    return Spacebars.call(self.lookup("errorMessage"));                                                                // 94
  }, UI.block(function() {                                                                                             // 95
    var self = this;                                                                                                   // 96
    return [ "\n		", HTML.DIV({                                                                                        // 97
      "class": "alert alert-danger"                                                                                    // 98
    }, function() {                                                                                                    // 99
      return Spacebars.mustache(self.lookup("errorMessage"));                                                          // 100
    }), "\n	" ];                                                                                                       // 101
  })), "\n	", UI.If(function() {                                                                                       // 102
    return Spacebars.call(self.lookup("infoMessage"));                                                                 // 103
  }, UI.block(function() {                                                                                             // 104
    var self = this;                                                                                                   // 105
    return [ "\n		", HTML.DIV({                                                                                        // 106
      "class": "alert alert-success no-margin"                                                                         // 107
    }, function() {                                                                                                    // 108
      return Spacebars.mustache(self.lookup("infoMessage"));                                                           // 109
    }), "\n	" ];                                                                                                       // 110
  })) ];                                                                                                               // 111
}));                                                                                                                   // 112
                                                                                                                       // 113
Template.__define__("_loginButtonsLoggingIn", (function() {                                                            // 114
  var self = this;                                                                                                     // 115
  var template = this;                                                                                                 // 116
  return [ Spacebars.include(self.lookupTemplate("_loginButtonsLoggingInPadding")), HTML.Raw('\n	<div class="loading">&nbsp;</div>\n	'), Spacebars.include(self.lookupTemplate("_loginButtonsLoggingInPadding")) ];
}));                                                                                                                   // 118
                                                                                                                       // 119
Template.__define__("_loginButtonsLoggingInPadding", (function() {                                                     // 120
  var self = this;                                                                                                     // 121
  var template = this;                                                                                                 // 122
  return UI.Unless(function() {                                                                                        // 123
    return Spacebars.call(self.lookup("dropdown"));                                                                    // 124
  }, UI.block(function() {                                                                                             // 125
    var self = this;                                                                                                   // 126
    return [ "\n		\n		", HTML.DIV({                                                                                    // 127
      "class": "login-buttons-padding"                                                                                 // 128
    }, "\n			", HTML.DIV({                                                                                             // 129
      "class": "login-button single-login-button",                                                                     // 130
      style: "visibility: hidden;",                                                                                    // 131
      id: "login-buttons-logout"                                                                                       // 132
    }, HTML.CharRef({                                                                                                  // 133
      html: "&nbsp;",                                                                                                  // 134
      str: " "                                                                                                         // 135
    })), "\n		"), "\n	" ];                                                                                             // 136
  }), UI.block(function() {                                                                                            // 137
    var self = this;                                                                                                   // 138
    return [ "\n		\n		", HTML.DIV({                                                                                    // 139
      "class": "login-buttons-padding"                                                                                 // 140
    }), "\n	" ];                                                                                                       // 141
  }));                                                                                                                 // 142
}));                                                                                                                   // 143
                                                                                                                       // 144
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/template.login_buttons_single.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("_loginButtonsLoggedOutSingleLoginButton", (function() {                                           // 2
  var self = this;                                                                                                     // 3
  var template = this;                                                                                                 // 4
  return UI.If(function() {                                                                                            // 5
    return Spacebars.call(self.lookup("configured"));                                                                  // 6
  }, UI.block(function() {                                                                                             // 7
    var self = this;                                                                                                   // 8
    return [ "\n		", HTML.BUTTON({                                                                                     // 9
      "class": [ "login-button btn btn-block btn-", function() {                                                       // 10
        return Spacebars.mustache(self.lookup("capitalizedName"));                                                     // 11
      } ]                                                                                                              // 12
    }, "sign in with ", function() {                                                                                   // 13
      return Spacebars.mustache(self.lookup("capitalizedName"));                                                       // 14
    }), "\n	" ];                                                                                                       // 15
  }), UI.block(function() {                                                                                            // 16
    var self = this;                                                                                                   // 17
    return [ "\n		", HTML.BUTTON({                                                                                     // 18
      "class": "login-button btn btn-block configure-button btn-danger"                                                // 19
    }, "Configure ", function() {                                                                                      // 20
      return Spacebars.mustache(self.lookup("capitalizedName"));                                                       // 21
    }, " Login"), "\n	" ];                                                                                             // 22
  }));                                                                                                                 // 23
}));                                                                                                                   // 24
                                                                                                                       // 25
Template.__define__("_loginButtonsLoggingInSingleLoginButton", (function() {                                           // 26
  var self = this;                                                                                                     // 27
  var template = this;                                                                                                 // 28
  return HTML.DIV({                                                                                                    // 29
    "class": "login-text-and-button"                                                                                   // 30
  }, "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsLoggingIn")), "\n	");                                 // 31
}));                                                                                                                   // 32
                                                                                                                       // 33
Template.__define__("_loginButtonsLoggedInSingleLogoutButton", (function() {                                           // 34
  var self = this;                                                                                                     // 35
  var template = this;                                                                                                 // 36
  return HTML.LI("\n		", HTML.A({                                                                                      // 37
    href: "#",                                                                                                         // 38
    id: "login-buttons-logout"                                                                                         // 39
  }, function() {                                                                                                      // 40
    return Spacebars.mustache(self.lookup("displayName"));                                                             // 41
  }, " sign Out"), "\n	");                                                                                             // 42
}));                                                                                                                   // 43
                                                                                                                       // 44
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/template.login_buttons_dropdown.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("_loginButtonsLoggedInDropdown", (function() {                                                     // 2
  var self = this;                                                                                                     // 3
  var template = this;                                                                                                 // 4
  return HTML.LI({                                                                                                     // 5
    id: "login-dropdown-list",                                                                                         // 6
    "class": "dropdown"                                                                                                // 7
  }, "\n		", HTML.A({                                                                                                  // 8
    "class": "dropdown-toggle",                                                                                        // 9
    "data-toggle": "dropdown"                                                                                          // 10
  }, "\n			", function() {                                                                                             // 11
    return Spacebars.mustache(self.lookup("displayName"));                                                             // 12
  }, "\n			", HTML.IMG({                                                                                               // 13
    src: function() {                                                                                                  // 14
      return Spacebars.mustache(self.lookup("user_profile_picture"));                                                  // 15
    },                                                                                                                 // 16
    width: "30px",                                                                                                     // 17
    "class": "img-circular",                                                                                           // 18
    alt: "#"                                                                                                           // 19
  }), HTML.Raw('\n			<b class="caret"></b>\n		')), "\n		", HTML.DIV({                                                  // 20
    "class": "dropdown-menu col-sm-3"                                                                                  // 21
  }, "\n			", UI.If(function() {                                                                                       // 22
    return Spacebars.call(self.lookup("inMessageOnlyFlow"));                                                           // 23
  }, UI.block(function() {                                                                                             // 24
    var self = this;                                                                                                   // 25
    return [ "\n				", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n			" ];                     // 26
  }), UI.block(function() {                                                                                            // 27
    var self = this;                                                                                                   // 28
    return [ "\n				", UI.If(function() {                                                                              // 29
      return Spacebars.call(self.lookup("inChangePasswordFlow"));                                                      // 30
    }, UI.block(function() {                                                                                           // 31
      var self = this;                                                                                                 // 32
      return [ "\n					", Spacebars.include(self.lookupTemplate("_loginButtonsChangePassword")), "\n				" ];           // 33
    }), UI.block(function() {                                                                                          // 34
      var self = this;                                                                                                 // 35
      return [ "\n					", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedInDropdownActions")), "\n				" ];  // 36
    })), "\n			" ];                                                                                                    // 37
  })), "\n		"), "\n	");                                                                                                // 38
}));                                                                                                                   // 39
                                                                                                                       // 40
Template.__define__("_loginButtonsLoggedInDropdownActions", (function() {                                              // 41
  var self = this;                                                                                                     // 42
  var template = this;                                                                                                 // 43
  return [ UI.If(function() {                                                                                          // 44
    return Spacebars.call(self.lookup("additionalLoggedInDropdownActions"));                                           // 45
  }, UI.block(function() {                                                                                             // 46
    var self = this;                                                                                                   // 47
    return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsAdditionalLoggedInDropdownActions")), "\n	" ];
  })), "\n\n	", UI.If(function() {                                                                                     // 49
    return Spacebars.call(self.lookup("allowChangingPassword"));                                                       // 50
  }, UI.block(function() {                                                                                             // 51
    var self = this;                                                                                                   // 52
    return [ "\n		", HTML.BUTTON({                                                                                     // 53
      "class": "btn btn-default btn-block",                                                                            // 54
      id: "login-buttons-open-change-password"                                                                         // 55
    }, "change password"), "\n	" ];                                                                                    // 56
  })), HTML.Raw('\n\n	<button class="btn btn-block btn-primary" id="login-buttons-logout">sign out</button>') ];       // 57
}));                                                                                                                   // 58
                                                                                                                       // 59
Template.__define__("_loginButtonsLoggedOutDropdown", (function() {                                                    // 60
  var self = this;                                                                                                     // 61
  var template = this;                                                                                                 // 62
  return HTML.LI({                                                                                                     // 63
    id: "login-dropdown-list",                                                                                         // 64
    "class": "dropdown"                                                                                                // 65
  }, "\n		", HTML.A({                                                                                                  // 66
    "class": "dropdown-toggle",                                                                                        // 67
    "data-toggle": "dropdown"                                                                                          // 68
  }, "sign in", UI.Unless(function() {                                                                                 // 69
    return Spacebars.call(self.lookup("forbidClientAccountCreation"));                                                 // 70
  }, UI.block(function() {                                                                                             // 71
    var self = this;                                                                                                   // 72
    return " / up";                                                                                                    // 73
  })), HTML.Raw('<b class="caret"></b>')), "\n		", HTML.DIV({                                                          // 74
    "class": "dropdown-menu"                                                                                           // 75
  }, "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutAllServices")), "\n		"), "\n	");            // 76
}));                                                                                                                   // 77
                                                                                                                       // 78
Template.__define__("_loginButtonsLoggedOutAllServices", (function() {                                                 // 79
  var self = this;                                                                                                     // 80
  var template = this;                                                                                                 // 81
  return UI.Each(function() {                                                                                          // 82
    return Spacebars.call(self.lookup("services"));                                                                    // 83
  }, UI.block(function() {                                                                                             // 84
    var self = this;                                                                                                   // 85
    return [ "\n	", UI.Unless(function() {                                                                             // 86
      return Spacebars.call(self.lookup("hasPasswordService"));                                                        // 87
    }, UI.block(function() {                                                                                           // 88
      var self = this;                                                                                                 // 89
      return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n	" ];                       // 90
    })), "\n		", UI.If(function() {                                                                                    // 91
      return Spacebars.call(self.lookup("isPasswordService"));                                                         // 92
    }, UI.block(function() {                                                                                           // 93
      var self = this;                                                                                                 // 94
      return [ "\n			", UI.If(function() {                                                                             // 95
        return Spacebars.call(self.lookup("hasOtherServices"));                                                        // 96
      }, UI.block(function() {                                                                                         // 97
        var self = this;                                                                                               // 98
        return [ " \n				", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutPasswordServiceSeparator")), "\n			" ];
      })), "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutPasswordService")), "\n		" ];         // 100
    }), UI.block(function() {                                                                                          // 101
      var self = this;                                                                                                 // 102
      return [ "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n		" ];   // 103
    })), "\n	" ];                                                                                                      // 104
  }));                                                                                                                 // 105
}));                                                                                                                   // 106
                                                                                                                       // 107
Template.__define__("_loginButtonsLoggedOutPasswordServiceSeparator", (function() {                                    // 108
  var self = this;                                                                                                     // 109
  var template = this;                                                                                                 // 110
  return HTML.Raw('<div class="or">\n		<span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n		<span class="or-text">or</span>\n		<span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n	</div>');
}));                                                                                                                   // 112
                                                                                                                       // 113
Template.__define__("_loginButtonsLoggedOutPasswordService", (function() {                                             // 114
  var self = this;                                                                                                     // 115
  var template = this;                                                                                                 // 116
  return UI.If(function() {                                                                                            // 117
    return Spacebars.call(self.lookup("inForgotPasswordFlow"));                                                        // 118
  }, UI.block(function() {                                                                                             // 119
    var self = this;                                                                                                   // 120
    return [ "\n		", Spacebars.include(self.lookupTemplate("_forgotPasswordForm")), "\n	" ];                           // 121
  }), UI.block(function() {                                                                                            // 122
    var self = this;                                                                                                   // 123
    return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n		", UI.Each(function() {     // 124
      return Spacebars.call(self.lookup("fields"));                                                                    // 125
    }, UI.block(function() {                                                                                           // 126
      var self = this;                                                                                                 // 127
      return [ "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsFormField")), "\n		" ];                    // 128
    })), "\n		", HTML.BUTTON({                                                                                         // 129
      "class": "btn btn-primary col-sm-12",                                                                            // 130
      id: "login-buttons-password",                                                                                    // 131
      type: "button"                                                                                                   // 132
    }, "\n			", UI.If(function() {                                                                                     // 133
      return Spacebars.call(self.lookup("inSignupFlow"));                                                              // 134
    }, UI.block(function() {                                                                                           // 135
      var self = this;                                                                                                 // 136
      return "\n				create\n			";                                                                                      // 137
    }), UI.block(function() {                                                                                          // 138
      var self = this;                                                                                                 // 139
      return "\n				sign in\n			";                                                                                     // 140
    })), "\n		"), "\n		", UI.If(function() {                                                                           // 141
      return Spacebars.call(self.lookup("inLoginFlow"));                                                               // 142
    }, UI.block(function() {                                                                                           // 143
      var self = this;                                                                                                 // 144
      return [ "\n			", HTML.DIV({                                                                                     // 145
        id: "login-other-options"                                                                                      // 146
      }, "\n			", UI.If(function() {                                                                                   // 147
        return Spacebars.call(self.lookup("showForgotPasswordLink"));                                                  // 148
      }, UI.block(function() {                                                                                         // 149
        var self = this;                                                                                               // 150
        return [ "\n				", HTML.A({                                                                                    // 151
          id: "forgot-password-link",                                                                                  // 152
          "class": "pull-left"                                                                                         // 153
        }, "forgot password?"), "\n			" ];                                                                             // 154
      })), "\n			", UI.If(function() {                                                                                 // 155
        return Spacebars.call(self.lookup("showCreateAccountLink"));                                                   // 156
      }, UI.block(function() {                                                                                         // 157
        var self = this;                                                                                               // 158
        return [ "\n				", HTML.A({                                                                                    // 159
          id: "signup-link",                                                                                           // 160
          "class": "pull-right"                                                                                        // 161
        }, "create account"), "\n			" ];                                                                               // 162
      })), "\n			"), "\n		" ];                                                                                         // 163
    })), "\n		", UI.If(function() {                                                                                    // 164
      return Spacebars.call(self.lookup("inSignupFlow"));                                                              // 165
    }, UI.block(function() {                                                                                           // 166
      var self = this;                                                                                                 // 167
      return [ "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsBackToLoginLink")), "\n		" ];              // 168
    })), "\n	" ];                                                                                                      // 169
  }));                                                                                                                 // 170
}));                                                                                                                   // 171
                                                                                                                       // 172
Template.__define__("_forgotPasswordForm", (function() {                                                               // 173
  var self = this;                                                                                                     // 174
  var template = this;                                                                                                 // 175
  return HTML.DIV({                                                                                                    // 176
    "class": "login-form"                                                                                              // 177
  }, "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), HTML.Raw('\n		<div id="forgot-password-email-label-and-input"> \n			<input id="forgot-password-email" type="email" placeholder="E-mail" class="form-control">\n		</div>\n		<button class="btn btn-primary login-button-form-submit col-sm-12" id="login-buttons-forgot-password">reset password</button>\n		'), Spacebars.include(self.lookupTemplate("_loginButtonsBackToLoginLink")), "\n	");
}));                                                                                                                   // 179
                                                                                                                       // 180
Template.__define__("_loginButtonsBackToLoginLink", (function() {                                                      // 181
  var self = this;                                                                                                     // 182
  var template = this;                                                                                                 // 183
  return HTML.Raw('<button id="back-to-login-link" class="btn btn-default col-sm-12">cancel</button>');                // 184
}));                                                                                                                   // 185
                                                                                                                       // 186
Template.__define__("_loginButtonsFormField", (function() {                                                            // 187
  var self = this;                                                                                                     // 188
  var template = this;                                                                                                 // 189
  return UI.If(function() {                                                                                            // 190
    return Spacebars.call(self.lookup("visible"));                                                                     // 191
  }, UI.block(function() {                                                                                             // 192
    var self = this;                                                                                                   // 193
    return [ "\n		", HTML.INPUT({                                                                                      // 194
      id: [ "login-", function() {                                                                                     // 195
        return Spacebars.mustache(self.lookup("fieldName"));                                                           // 196
      } ],                                                                                                             // 197
      type: function() {                                                                                               // 198
        return Spacebars.mustache(self.lookup("inputType"));                                                           // 199
      },                                                                                                               // 200
      placeholder: function() {                                                                                        // 201
        return Spacebars.mustache(self.lookup("fieldLabel"));                                                          // 202
      },                                                                                                               // 203
      "class": "form-control"                                                                                          // 204
    }), "\n	" ];                                                                                                       // 205
  }));                                                                                                                 // 206
}));                                                                                                                   // 207
                                                                                                                       // 208
Template.__define__("_loginButtonsChangePassword", (function() {                                                       // 209
  var self = this;                                                                                                     // 210
  var template = this;                                                                                                 // 211
  return [ Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n	", UI.Each(function() {                // 212
    return Spacebars.call(self.lookup("fields"));                                                                      // 213
  }, UI.block(function() {                                                                                             // 214
    var self = this;                                                                                                   // 215
    return [ "\n		", Spacebars.include(self.lookupTemplate("_loginButtonsFormField")), "\n	" ];                        // 216
  })), HTML.Raw('\n	<button class="btn btn-primary" id="login-buttons-do-change-password">change password</button>\n	<button class="btn btn-default" id="login-buttons-cancel-change-password">cancel</button>') ];
}));                                                                                                                   // 218
                                                                                                                       // 219
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/template.login_buttons_dialogs.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
UI.body.contentParts.push(UI.Component.extend({render: (function() {                                                   // 2
  var self = this;                                                                                                     // 3
  return [ Spacebars.include(self.lookupTemplate("_resetPasswordDialog")), "\n	", Spacebars.include(self.lookupTemplate("_enrollAccountDialog")), "\n	", Spacebars.include(self.lookupTemplate("_justVerifiedEmailDialog")), "\n	", Spacebars.include(self.lookupTemplate("_configureLoginServiceDialog")), HTML.Raw("\n\n	<!-- if we're not showing a dropdown, we need some other place to show messages -->\n	"), Spacebars.include(self.lookupTemplate("_loginButtonsMessagesDialog")) ];
})}));                                                                                                                 // 5
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });
                                                                                                                       // 7
Template.__define__("_resetPasswordDialog", (function() {                                                              // 8
  var self = this;                                                                                                     // 9
  var template = this;                                                                                                 // 10
  return UI.If(function() {                                                                                            // 11
    return Spacebars.call(self.lookup("inResetPasswordFlow"));                                                         // 12
  }, UI.block(function() {                                                                                             // 13
    var self = this;                                                                                                   // 14
    return [ "\n		", HTML.DIV({                                                                                        // 15
      "class": "modal",                                                                                                // 16
      id: "login-buttons-reset-password-modal"                                                                         // 17
    }, "\n			", HTML.DIV({                                                                                             // 18
      "class": "modal-dialog"                                                                                          // 19
    }, "\n				", HTML.DIV({                                                                                            // 20
      "class": "modal-content"                                                                                         // 21
    }, "\n					", HTML.DIV({                                                                                           // 22
      "class": "modal-header"                                                                                          // 23
    }, "\n						", HTML.BUTTON({                                                                                       // 24
      type: "button",                                                                                                  // 25
      "class": "close",                                                                                                // 26
      "data-dismiss": "modal",                                                                                         // 27
      "aria-hidden": "true"                                                                                            // 28
    }, HTML.CharRef({                                                                                                  // 29
      html: "&times;",                                                                                                 // 30
      str: "×"                                                                                                         // 31
    })), "\n						", HTML.H4({                                                                                         // 32
      "class": "modal-title"                                                                                           // 33
    }, "reset your password"), "\n					"), "\n					", HTML.DIV({                                                       // 34
      "class": "modal-body"                                                                                            // 35
    }, "\n						", HTML.INPUT({                                                                                        // 36
      id: "reset-password-new-password",                                                                               // 37
      "class": "form-control",                                                                                         // 38
      type: "password",                                                                                                // 39
      placeholder: "New Password"                                                                                      // 40
    }), "\n						", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n					"), "\n					", HTML.DIV({ // 41
      "class": "modal-footer"                                                                                          // 42
    }, "\n						", HTML.A({                                                                                            // 43
      "class": "btn btn-default",                                                                                      // 44
      id: "login-buttons-cancel-reset-password"                                                                        // 45
    }, "close"), "\n						", HTML.BUTTON({                                                                             // 46
      "class": "btn btn-primary",                                                                                      // 47
      id: "login-buttons-reset-password-button"                                                                        // 48
    }, "\n							set password\n						"), "\n					"), "\n				"), HTML.Comment(" /.modal-content "), "\n			"), HTML.Comment(" /.modal-dalog "), "\n		"), HTML.Comment(" /.modal "), "\n	" ];
  }));                                                                                                                 // 50
}));                                                                                                                   // 51
                                                                                                                       // 52
Template.__define__("_enrollAccountDialog", (function() {                                                              // 53
  var self = this;                                                                                                     // 54
  var template = this;                                                                                                 // 55
  return UI.If(function() {                                                                                            // 56
    return Spacebars.call(self.lookup("inEnrollAccountFlow"));                                                         // 57
  }, UI.block(function() {                                                                                             // 58
    var self = this;                                                                                                   // 59
    return [ "\n		", HTML.DIV({                                                                                        // 60
      "class": "modal",                                                                                                // 61
      id: "login-buttons-enroll-account-modal"                                                                         // 62
    }, "\n			", HTML.DIV({                                                                                             // 63
      "class": "modal-dialog"                                                                                          // 64
    }, "\n				", HTML.DIV({                                                                                            // 65
      "class": "modal-content"                                                                                         // 66
    }, "\n					", HTML.DIV({                                                                                           // 67
      "class": "modal-header"                                                                                          // 68
    }, "\n						", HTML.BUTTON({                                                                                       // 69
      type: "button",                                                                                                  // 70
      "class": "close",                                                                                                // 71
      "data-dismiss": "modal",                                                                                         // 72
      "aria-hidden": "true"                                                                                            // 73
    }, HTML.CharRef({                                                                                                  // 74
      html: "&times;",                                                                                                 // 75
      str: "×"                                                                                                         // 76
    })), "\n						", HTML.H4({                                                                                         // 77
      "class": "modal-title"                                                                                           // 78
    }, "choose a password"), "\n					"), "\n					", HTML.DIV({                                                         // 79
      "class": "modal-body"                                                                                            // 80
    }, "\n						", HTML.INPUT({                                                                                        // 81
      id: "enroll-account-password",                                                                                   // 82
      "class": "form-control",                                                                                         // 83
      type: "password",                                                                                                // 84
      placeholder: "New Password"                                                                                      // 85
    }), "\n						", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n					"), "\n					", HTML.DIV({ // 86
      "class": "modal-footer"                                                                                          // 87
    }, "\n						", HTML.A({                                                                                            // 88
      "class": "btn btn-default",                                                                                      // 89
      id: "login-buttons-cancel-enroll-account-button"                                                                 // 90
    }, "close"), "\n						", HTML.BUTTON({                                                                             // 91
      "class": "btn btn-primary",                                                                                      // 92
      id: "login-buttons-enroll-account-button"                                                                        // 93
    }, "\n							set password\n						"), "\n					"), "\n				"), HTML.Comment(" /.modal-content "), "\n			"), HTML.Comment(" /.modal-dalog "), "\n		"), HTML.Comment(" /.modal "), "\n	" ];
  }));                                                                                                                 // 95
}));                                                                                                                   // 96
                                                                                                                       // 97
Template.__define__("_justVerifiedEmailDialog", (function() {                                                          // 98
  var self = this;                                                                                                     // 99
  var template = this;                                                                                                 // 100
  return UI.If(function() {                                                                                            // 101
    return Spacebars.call(self.lookup("visible"));                                                                     // 102
  }, UI.block(function() {                                                                                             // 103
    var self = this;                                                                                                   // 104
    return [ "\n		", HTML.DIV({                                                                                        // 105
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 106
    }, "\n			email verified\n			", HTML.DIV({                                                                          // 107
      "class": "login-button",                                                                                         // 108
      id: "just-verified-dismiss-button"                                                                               // 109
    }, "dismiss"), "\n		"), "\n	" ];                                                                                   // 110
  }));                                                                                                                 // 111
}));                                                                                                                   // 112
                                                                                                                       // 113
Template.__define__("_configureLoginServiceDialog", (function() {                                                      // 114
  var self = this;                                                                                                     // 115
  var template = this;                                                                                                 // 116
  return UI.If(function() {                                                                                            // 117
    return Spacebars.call(self.lookup("visible"));                                                                     // 118
  }, UI.block(function() {                                                                                             // 119
    var self = this;                                                                                                   // 120
    return [ "\n	", HTML.DIV({                                                                                         // 121
      "class": "modal",                                                                                                // 122
      id: "configure-login-service-dialog-modal"                                                                       // 123
    }, "\n			", HTML.DIV({                                                                                             // 124
      "class": "modal-dialog"                                                                                          // 125
    }, "\n					", HTML.DIV({                                                                                           // 126
      "class": "modal-content"                                                                                         // 127
    }, "\n							", HTML.DIV({                                                                                         // 128
      "class": "modal-header"                                                                                          // 129
    }, "\n									", HTML.H4({                                                                                        // 130
      "class": "modal-title"                                                                                           // 131
    }, "Configure Service"), "\n							"), "\n							", HTML.DIV({                                                     // 132
      "class": "modal-body"                                                                                            // 133
    }, "\n									", HTML.DIV({                                                                                       // 134
      id: "configure-login-service-dialog",                                                                            // 135
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 136
    }, "\n											", Spacebars.include(self.lookupTemplate("configurationSteps")), "\n											", HTML.P("\n											Now, copy over some details.\n											"), "\n											", HTML.P("\n											", HTML.TABLE("\n													", HTML.COLGROUP("\n															", HTML.COL({
      span: "1",                                                                                                       // 138
      "class": "configuration_labels"                                                                                  // 139
    }), "\n															", HTML.COL({                                                                                // 140
      span: "1",                                                                                                       // 141
      "class": "configuration_inputs"                                                                                  // 142
    }), "\n													"), "\n													", UI.Each(function() {                                                    // 143
      return Spacebars.call(self.lookup("configurationFields"));                                                       // 144
    }, UI.block(function() {                                                                                           // 145
      var self = this;                                                                                                 // 146
      return [ "\n													", HTML.TR("\n															", HTML.TD("\n																	", HTML.LABEL({             // 147
        "for": [ "configure-login-service-dialog-", function() {                                                       // 148
          return Spacebars.mustache(self.lookup("property"));                                                          // 149
        } ]                                                                                                            // 150
      }, function() {                                                                                                  // 151
        return Spacebars.mustache(self.lookup("label"));                                                               // 152
      }), "\n															"), "\n															", HTML.TD("\n																	", HTML.INPUT({                       // 153
        id: [ "configure-login-service-dialog-", function() {                                                          // 154
          return Spacebars.mustache(self.lookup("property"));                                                          // 155
        } ],                                                                                                           // 156
        type: "text"                                                                                                   // 157
      }), "\n															"), "\n													"), "\n													" ];                                               // 158
    })), "\n											"), "\n											"), "\n									"), "\n							"), "\n							", HTML.DIV({                     // 159
      "class": "modal-footer new-section"                                                                              // 160
    }, "\n									", HTML.DIV({                                                                                       // 161
      "class": "login-button btn btn-danger configure-login-service-dismiss-button"                                    // 162
    }, "\n											I'll do this later\n									"), "\n									", HTML.DIV({                                        // 163
      "class": [ "login-button login-button-configure btn btn-success ", UI.If(function() {                            // 164
        return Spacebars.call(self.lookup("saveDisabled"));                                                            // 165
      }, UI.block(function() {                                                                                         // 166
        var self = this;                                                                                               // 167
        return "login-button-disabled";                                                                                // 168
      })) ],                                                                                                           // 169
      id: "configure-login-service-dialog-save-configuration"                                                          // 170
    }, "\n											Save Configuration\n									"), "\n							"), "\n					"), "\n			"), "\n	"), "\n	" ];             // 171
  }));                                                                                                                 // 172
}));                                                                                                                   // 173
                                                                                                                       // 174
Template.__define__("_loginButtonsMessagesDialog", (function() {                                                       // 175
  var self = this;                                                                                                     // 176
  var template = this;                                                                                                 // 177
  return UI.If(function() {                                                                                            // 178
    return Spacebars.call(self.lookup("visible"));                                                                     // 179
  }, UI.block(function() {                                                                                             // 180
    var self = this;                                                                                                   // 181
    return [ "\n		", HTML.DIV({                                                                                        // 182
      "class": "accounts-dialog accounts-centered-dialog",                                                             // 183
      id: "login-buttons-message-dialog"                                                                               // 184
    }, "\n			", Spacebars.include(self.lookupTemplate("_loginButtonsMessages")), "\n			", HTML.DIV({                   // 185
      "class": "login-button",                                                                                         // 186
      id: "messages-dialog-dismiss-button"                                                                             // 187
    }, "Dismiss"), "\n		"), "\n	" ];                                                                                   // 188
  }));                                                                                                                 // 189
}));                                                                                                                   // 190
                                                                                                                       // 191
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/login_buttons_session.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {                                                                                                         // 1
	var VALID_KEYS = [                                                                                                    // 2
		'dropdownVisible',                                                                                                   // 3
                                                                                                                       // 4
		// XXX consider replacing these with one key that has an enum for values.                                            // 5
		'inSignupFlow',                                                                                                      // 6
		'inForgotPasswordFlow',                                                                                              // 7
		'inChangePasswordFlow',                                                                                              // 8
		'inMessageOnlyFlow',                                                                                                 // 9
                                                                                                                       // 10
		'errorMessage',                                                                                                      // 11
		'infoMessage',                                                                                                       // 12
                                                                                                                       // 13
		// dialogs with messages (info and error)                                                                            // 14
		'resetPasswordToken',                                                                                                // 15
		'enrollAccountToken',                                                                                                // 16
		'justVerifiedEmail',                                                                                                 // 17
                                                                                                                       // 18
		'configureLoginServiceDialogVisible',                                                                                // 19
		'configureLoginServiceDialogServiceName',                                                                            // 20
		'configureLoginServiceDialogSaveDisabled'                                                                            // 21
	];                                                                                                                    // 22
                                                                                                                       // 23
	var validateKey = function (key) {                                                                                    // 24
		if (!_.contains(VALID_KEYS, key))                                                                                    // 25
			throw new Error("Invalid key in loginButtonsSession: " + key);                                                      // 26
	};                                                                                                                    // 27
                                                                                                                       // 28
	var KEY_PREFIX = "Meteor.loginButtons.";                                                                              // 29
                                                                                                                       // 30
	// XXX we should have a better pattern for code private to a package like this one                                    // 31
	Accounts._loginButtonsSession = {                                                                                     // 32
		set: function(key, value) {                                                                                          // 33
			validateKey(key);                                                                                                   // 34
			if (_.contains(['errorMessage', 'infoMessage'], key))                                                               // 35
				throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");  // 36
                                                                                                                       // 37
			this._set(key, value);                                                                                              // 38
		},                                                                                                                   // 39
                                                                                                                       // 40
		_set: function(key, value) {                                                                                         // 41
			Session.set(KEY_PREFIX + key, value);                                                                               // 42
		},                                                                                                                   // 43
                                                                                                                       // 44
		get: function(key) {                                                                                                 // 45
			validateKey(key);                                                                                                   // 46
			return Session.get(KEY_PREFIX + key);                                                                               // 47
		},                                                                                                                   // 48
                                                                                                                       // 49
		closeDropdown: function () {                                                                                         // 50
			this.set('inSignupFlow', false);                                                                                    // 51
			this.set('inForgotPasswordFlow', false);                                                                            // 52
			this.set('inChangePasswordFlow', false);                                                                            // 53
			this.set('inMessageOnlyFlow', false);                                                                               // 54
			this.set('dropdownVisible', false);                                                                                 // 55
			this.resetMessages();                                                                                               // 56
		},                                                                                                                   // 57
                                                                                                                       // 58
		infoMessage: function(message) {                                                                                     // 59
			this._set("errorMessage", null);                                                                                    // 60
			this._set("infoMessage", message);                                                                                  // 61
			this.ensureMessageVisible();                                                                                        // 62
		},                                                                                                                   // 63
                                                                                                                       // 64
		errorMessage: function(message) {                                                                                    // 65
			this._set("errorMessage", message);                                                                                 // 66
			this._set("infoMessage", null);                                                                                     // 67
			this.ensureMessageVisible();                                                                                        // 68
		},                                                                                                                   // 69
                                                                                                                       // 70
		// is there a visible dialog that shows messages (info and error)                                                    // 71
		isMessageDialogVisible: function () {                                                                                // 72
			return this.get('resetPasswordToken') ||                                                                            // 73
				this.get('enrollAccountToken') ||                                                                                  // 74
				this.get('justVerifiedEmail');                                                                                     // 75
		},                                                                                                                   // 76
                                                                                                                       // 77
		// ensure that somethings displaying a message (info or error) is                                                    // 78
		// visible.  if a dialog with messages is open, do nothing;                                                          // 79
		// otherwise open the dropdown.                                                                                      // 80
		//                                                                                                                   // 81
		// notably this doesn't matter when only displaying a single login                                                   // 82
		// button since then we have an explicit message dialog                                                              // 83
		// (_loginButtonsMessageDialog), and dropdownVisible is ignored in                                                   // 84
		// this case.                                                                                                        // 85
		ensureMessageVisible: function () {                                                                                  // 86
			if (!this.isMessageDialogVisible())                                                                                 // 87
				this.set("dropdownVisible", true);                                                                                 // 88
		},                                                                                                                   // 89
                                                                                                                       // 90
		resetMessages: function () {                                                                                         // 91
			this._set("errorMessage", null);                                                                                    // 92
			this._set("infoMessage", null);                                                                                     // 93
		},                                                                                                                   // 94
                                                                                                                       // 95
		configureService: function (name) {                                                                                  // 96
			this.set('configureLoginServiceDialogVisible', true);                                                               // 97
			this.set('configureLoginServiceDialogServiceName', name);                                                           // 98
			this.set('configureLoginServiceDialogSaveDisabled', true);                                                          // 99
			setTimeout(function(){                                                                                              // 100
				$('#configure-login-service-dialog-modal').modal();                                                                // 101
			}, 500)                                                                                                             // 102
		}                                                                                                                    // 103
	};                                                                                                                    // 104
}) ();                                                                                                                 // 105
                                                                                                                       // 106
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/login_buttons.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
	if (!Accounts._loginButtons)                                                                                          // 2
		Accounts._loginButtons = {};                                                                                         // 3
                                                                                                                       // 4
	// for convenience                                                                                                    // 5
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 6
                                                                                                                       // 7
	UI.registerHelper("loginButtons", function () {                                                                       // 8
		return Template._loginButtons;                                                                                       // 9
	});                                                                                                                   // 10
                                                                                                                       // 11
	// shared between dropdown and single mode                                                                            // 12
	Template._loginButtons.events({                                                                                       // 13
		'click #login-buttons-logout': function() {                                                                          // 14
			Meteor.logout(function() {                                                                                          // 15
				loginButtonsSession.closeDropdown();                                                                               // 16
			});                                                                                                                 // 17
		}                                                                                                                    // 18
	});                                                                                                                   // 19
                                                                                                                       // 20
	//                                                                                                                    // 21
	// loginButtonLoggedOut template                                                                                      // 22
	//                                                                                                                    // 23
                                                                                                                       // 24
	Template._loginButtonsLoggedOut.dropdown = function() {                                                               // 25
		return Accounts._loginButtons.dropdown();                                                                            // 26
	};                                                                                                                    // 27
                                                                                                                       // 28
	Template._loginButtonsLoggedOut.services = function() {                                                               // 29
		return Accounts._loginButtons.getLoginServices();                                                                    // 30
	};                                                                                                                    // 31
                                                                                                                       // 32
	Template._loginButtonsLoggedOut.singleService = function() {                                                          // 33
		var services = Accounts._loginButtons.getLoginServices();                                                            // 34
		if (services.length !== 1)                                                                                           // 35
			throw new Error(                                                                                                    // 36
				"Shouldn't be rendering this template with more than one configured service");                                     // 37
		return services[0];                                                                                                  // 38
	};                                                                                                                    // 39
                                                                                                                       // 40
	Template._loginButtonsLoggedOut.configurationLoaded = function() {                                                    // 41
		return Accounts.loginServicesConfigured();                                                                           // 42
	};                                                                                                                    // 43
                                                                                                                       // 44
                                                                                                                       // 45
	//                                                                                                                    // 46
	// loginButtonsLoggedIn template                                                                                      // 47
	//                                                                                                                    // 48
                                                                                                                       // 49
	// decide whether we should show a dropdown rather than a row of                                                      // 50
	// buttons                                                                                                            // 51
	Template._loginButtonsLoggedIn.dropdown = function() {                                                                // 52
		return Accounts._loginButtons.dropdown();                                                                            // 53
	};                                                                                                                    // 54
                                                                                                                       // 55
	Template._loginButtonsLoggedIn.displayName = function() {                                                             // 56
		return Accounts._loginButtons.displayName();                                                                         // 57
	};                                                                                                                    // 58
                                                                                                                       // 59
                                                                                                                       // 60
                                                                                                                       // 61
	//                                                                                                                    // 62
	// loginButtonsMessage template                                                                                       // 63
	//                                                                                                                    // 64
                                                                                                                       // 65
	Template._loginButtonsMessages.errorMessage = function() {                                                            // 66
		return loginButtonsSession.get('errorMessage');                                                                      // 67
	};                                                                                                                    // 68
                                                                                                                       // 69
	Template._loginButtonsMessages.infoMessage = function() {                                                             // 70
		return loginButtonsSession.get('infoMessage');                                                                       // 71
	};                                                                                                                    // 72
                                                                                                                       // 73
	//                                                                                                                    // 74
	// loginButtonsLoggingInPadding template                                                                              // 75
	//                                                                                                                    // 76
                                                                                                                       // 77
	Template._loginButtonsLoggingInPadding.dropdown = function() {                                                        // 78
		return Accounts._loginButtons.dropdown();                                                                            // 79
	};                                                                                                                    // 80
                                                                                                                       // 81
	//                                                                                                                    // 82
	// helpers                                                                                                            // 83
	//                                                                                                                    // 84
                                                                                                                       // 85
	Accounts._loginButtons.displayName = function() {                                                                     // 86
		var user = Meteor.user();                                                                                            // 87
		if (!user)                                                                                                           // 88
			return '';                                                                                                          // 89
                                                                                                                       // 90
		if (user.profile && user.profile.name)                                                                               // 91
			return user.profile.name;                                                                                           // 92
		if (user.username)                                                                                                   // 93
			return user.username;                                                                                               // 94
		if (user.emails && user.emails[0] && user.emails[0].address)                                                         // 95
			return user.emails[0].address;                                                                                      // 96
                                                                                                                       // 97
		return '';                                                                                                           // 98
	};                                                                                                                    // 99
                                                                                                                       // 100
	Accounts._loginButtons.getLoginServices = function() {                                                                // 101
		// First look for OAuth services.                                                                                    // 102
		var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];                                       // 103
                                                                                                                       // 104
		// Be equally kind to all login services. This also preserves                                                        // 105
		// backwards-compatibility. (But maybe order should be                                                               // 106
		// configurable?)                                                                                                    // 107
		services.sort();                                                                                                     // 108
                                                                                                                       // 109
		// Add password, if it's there; it must come last.                                                                   // 110
		if (this.hasPasswordService())                                                                                       // 111
			services.push('password');                                                                                          // 112
                                                                                                                       // 113
		return _.map(services, function(name) {                                                                              // 114
			return {                                                                                                            // 115
				name: name                                                                                                         // 116
			};                                                                                                                  // 117
		});                                                                                                                  // 118
	};                                                                                                                    // 119
                                                                                                                       // 120
	Accounts._loginButtons.hasPasswordService = function() {                                                              // 121
		return !!Package['accounts-password'];                                                                               // 122
	};                                                                                                                    // 123
                                                                                                                       // 124
	Accounts._loginButtons.dropdown = function() {                                                                        // 125
		return this.hasPasswordService() || Accounts._loginButtons.getLoginServices().length > 1;                            // 126
	};                                                                                                                    // 127
                                                                                                                       // 128
	// XXX improve these. should this be in accounts-password instead?                                                    // 129
	//                                                                                                                    // 130
	// XXX these will become configurable, and will be validated on                                                       // 131
	// the server as well.                                                                                                // 132
	Accounts._loginButtons.validateUsername = function(username) {                                                        // 133
		if (username.length >= 3) {                                                                                          // 134
			return true;                                                                                                        // 135
		} else {                                                                                                             // 136
			loginButtonsSession.errorMessage("Username must be at least 3 characters long");                                    // 137
			return false;                                                                                                       // 138
		}                                                                                                                    // 139
	};                                                                                                                    // 140
	Accounts._loginButtons.validateEmail = function(email) {                                                              // 141
		if (Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')                           // 142
			return true;                                                                                                        // 143
                                                                                                                       // 144
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                                                                                       // 146
		if (re.test(email)) {                                                                                                // 147
			return true;                                                                                                        // 148
		} else {                                                                                                             // 149
			loginButtonsSession.errorMessage("Invalid email");                                                                  // 150
			return false;                                                                                                       // 151
		}                                                                                                                    // 152
	};                                                                                                                    // 153
	Accounts._loginButtons.validatePassword = function(password) {                                                        // 154
		if (password.length >= 6) {                                                                                          // 155
			return true;                                                                                                        // 156
		} else {                                                                                                             // 157
			loginButtonsSession.errorMessage("Password must be at least 6 characters long");                                    // 158
			return false;                                                                                                       // 159
		}                                                                                                                    // 160
	};                                                                                                                    // 161
                                                                                                                       // 162
	Accounts._loginButtons.rendered = function () {                                                                       // 163
		debugger;                                                                                                            // 164
	};                                                                                                                    // 165
                                                                                                                       // 166
})();                                                                                                                  // 167
                                                                                                                       // 168
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/login_buttons_single.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {                                                                                                         // 1
	// for convenience                                                                                                    // 2
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 3
                                                                                                                       // 4
	Template._loginButtonsLoggedOutSingleLoginButton.events({                                                             // 5
		'click .login-button': function () {                                                                                 // 6
			var serviceName = this.name;                                                                                        // 7
			loginButtonsSession.resetMessages();                                                                                // 8
			var callback = function (err) {                                                                                     // 9
				if (!err) {                                                                                                        // 10
					loginButtonsSession.closeDropdown();                                                                              // 11
				} else if (err instanceof Accounts.LoginCancelledError) {                                                          // 12
					// do nothing                                                                                                     // 13
				} else if (err instanceof Accounts.ConfigError) {                                                                  // 14
					loginButtonsSession.configureService(serviceName);                                                                // 15
				} else {                                                                                                           // 16
					loginButtonsSession.errorMessage(err.reason || "Unknown error");                                                  // 17
				}                                                                                                                  // 18
			};                                                                                                                  // 19
                                                                                                                       // 20
			var loginWithService = Meteor["loginWith" + capitalize(serviceName)];                                               // 21
                                                                                                                       // 22
			var options = {}; // use default scope unless specified                                                             // 23
			if (Accounts.ui._options.requestPermissions[serviceName])                                                           // 24
				options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];                                 // 25
                                                                                                                       // 26
			loginWithService(options, callback);                                                                                // 27
		}                                                                                                                    // 28
	});                                                                                                                   // 29
                                                                                                                       // 30
	Template._loginButtonsLoggedOutSingleLoginButton.configured = function () {                                           // 31
		return !!Accounts.loginServiceConfiguration.findOne({service: this.name});                                           // 32
	};                                                                                                                    // 33
                                                                                                                       // 34
	Template._loginButtonsLoggedOutSingleLoginButton.capitalizedName = function () {                                      // 35
		if (this.name === 'github')                                                                                          // 36
			// XXX we should allow service packages to set their capitalized name                                               // 37
			return 'GitHub';                                                                                                    // 38
		else                                                                                                                 // 39
			return capitalize(this.name);                                                                                       // 40
	};                                                                                                                    // 41
                                                                                                                       // 42
	// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                        // 43
	var capitalize = function(str){                                                                                       // 44
		str = str == null ? '' : String(str);                                                                                // 45
		return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 46
	};                                                                                                                    // 47
}) ();                                                                                                                 // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/login_buttons_dropdown.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function() {                                                                                                          // 1
                                                                                                                       // 2
	// for convenience                                                                                                    // 3
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 4
                                                                                                                       // 5
	// events shared between loginButtonsLoggedOutDropdown and                                                            // 6
	// loginButtonsLoggedInDropdown                                                                                       // 7
	Template._loginButtons.events({                                                                                       // 8
		'click input': function(){                                                                                           // 9
			event.stopPropagation();                                                                                            // 10
		},                                                                                                                   // 11
		'click #login-name-link, click #login-sign-in-link': function() {                                                    // 12
			event.stopPropagation();                                                                                            // 13
			loginButtonsSession.set('dropdownVisible', true);                                                                   // 14
			Meteor.flush();                                                                                                     // 15
		},                                                                                                                   // 16
		'click .login-close': function() {                                                                                   // 17
			loginButtonsSession.closeDropdown();                                                                                // 18
		}                                                                                                                    // 19
	});                                                                                                                   // 20
                                                                                                                       // 21
	Template._loginButtons.toggleDropdown = function() {                                                                  // 22
		toggleDropdown();                                                                                                    // 23
	};                                                                                                                    // 24
                                                                                                                       // 25
	//                                                                                                                    // 26
	// loginButtonsLoggedInDropdown template and related                                                                  // 27
	//                                                                                                                    // 28
                                                                                                                       // 29
	Template._loginButtonsLoggedInDropdown.events({                                                                       // 30
		'click #login-buttons-open-change-password': function(event) {                                                       // 31
			event.stopPropagation();                                                                                            // 32
			loginButtonsSession.resetMessages();                                                                                // 33
			loginButtonsSession.set('inChangePasswordFlow', true);                                                              // 34
			Meteor.flush();                                                                                                     // 35
		}                                                                                                                    // 36
	});                                                                                                                   // 37
                                                                                                                       // 38
	Template._loginButtonsLoggedInDropdown.displayName = function() {                                                     // 39
		return Accounts._loginButtons.displayName();                                                                         // 40
	};                                                                                                                    // 41
                                                                                                                       // 42
	Template._loginButtonsLoggedInDropdown.inChangePasswordFlow = function() {                                            // 43
		return loginButtonsSession.get('inChangePasswordFlow');                                                              // 44
	};                                                                                                                    // 45
                                                                                                                       // 46
	Template._loginButtonsLoggedInDropdown.inMessageOnlyFlow = function() {                                               // 47
		return loginButtonsSession.get('inMessageOnlyFlow');                                                                 // 48
	};                                                                                                                    // 49
                                                                                                                       // 50
	Template._loginButtonsLoggedInDropdown.dropdownVisible = function() {                                                 // 51
		return loginButtonsSession.get('dropdownVisible');                                                                   // 52
	};                                                                                                                    // 53
                                                                                                                       // 54
	Template._loginButtonsLoggedInDropdownActions.allowChangingPassword = function() {                                    // 55
		// it would be more correct to check whether the user has a password set,                                            // 56
		// but in order to do that we'd have to send more data down to the client,                                           // 57
		// and it'd be preferable not to send down the entire service.password document.                                     // 58
		//                                                                                                                   // 59
		// instead we use the heuristic: if the user has a username or email set.                                            // 60
		var user = Meteor.user();                                                                                            // 61
		return user.username || (user.emails && user.emails[0] && user.emails[0].address);                                   // 62
	};                                                                                                                    // 63
                                                                                                                       // 64
                                                                                                                       // 65
	Template._loginButtonsLoggedInDropdownActions.additionalLoggedInDropdownActions = function () {                       // 66
	  return Template._loginButtonsAdditionalLoggedInDropdownActions !== undefined;                                       // 67
	};                                                                                                                    // 68
                                                                                                                       // 69
	//                                                                                                                    // 70
	// loginButtonsLoggedOutDropdown template and related                                                                 // 71
	//                                                                                                                    // 72
                                                                                                                       // 73
	Template._loginButtonsLoggedOutDropdown.events({                                                                      // 74
		'click #login-buttons-password': function() {                                                                        // 75
			event.stopPropagation();                                                                                            // 76
			loginOrSignup();                                                                                                    // 77
		},                                                                                                                   // 78
                                                                                                                       // 79
		'keypress #forgot-password-email': function(event) {                                                                 // 80
			event.stopPropagation();                                                                                            // 81
			if (event.keyCode === 13)                                                                                           // 82
				forgotPassword();                                                                                                  // 83
		},                                                                                                                   // 84
                                                                                                                       // 85
		'click #login-buttons-forgot-password': function(event) {                                                            // 86
			event.stopPropagation();                                                                                            // 87
			forgotPassword();                                                                                                   // 88
		},                                                                                                                   // 89
                                                                                                                       // 90
		'click #signup-link': function(event) {                                                                              // 91
			event.stopPropagation();                                                                                            // 92
			loginButtonsSession.resetMessages();                                                                                // 93
                                                                                                                       // 94
			// store values of fields before swtiching to the signup form                                                       // 95
			var username = trimmedElementValueById('login-username');                                                           // 96
			var email = trimmedElementValueById('login-email');                                                                 // 97
			var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                           // 98
			// notably not trimmed. a password could (?) start or end with a space                                              // 99
			var password = elementValueById('login-password');                                                                  // 100
                                                                                                                       // 101
			loginButtonsSession.set('inSignupFlow', true);                                                                      // 102
			loginButtonsSession.set('inForgotPasswordFlow', false);                                                             // 103
                                                                                                                       // 104
			// force the ui to update so that we have the approprate fields to fill in                                          // 105
			Meteor.flush();                                                                                                     // 106
                                                                                                                       // 107
			// update new fields with appropriate defaults                                                                      // 108
			if (username !== null)                                                                                              // 109
				document.getElementById('login-username').value = username;                                                        // 110
			else if (email !== null)                                                                                            // 111
				document.getElementById('login-email').value = email;                                                              // 112
			else if (usernameOrEmail !== null)                                                                                  // 113
				if (usernameOrEmail.indexOf('@') === -1)                                                                           // 114
					document.getElementById('login-username').value = usernameOrEmail;                                                // 115
				else                                                                                                               // 116
					document.getElementById('login-email').value = usernameOrEmail;                                                   // 117
		},                                                                                                                   // 118
		'click #forgot-password-link': function(event) {                                                                     // 119
			event.stopPropagation();                                                                                            // 120
			loginButtonsSession.resetMessages();                                                                                // 121
                                                                                                                       // 122
			// store values of fields before swtiching to the signup form                                                       // 123
			var email = trimmedElementValueById('login-email');                                                                 // 124
			var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                           // 125
                                                                                                                       // 126
			loginButtonsSession.set('inSignupFlow', false);                                                                     // 127
			loginButtonsSession.set('inForgotPasswordFlow', true);                                                              // 128
                                                                                                                       // 129
			// force the ui to update so that we have the approprate fields to fill in                                          // 130
			Meteor.flush();                                                                                                     // 131
			//toggleDropdown();                                                                                                 // 132
                                                                                                                       // 133
			// update new fields with appropriate defaults                                                                      // 134
			if (email !== null)                                                                                                 // 135
				document.getElementById('forgot-password-email').value = email;                                                    // 136
			else if (usernameOrEmail !== null)                                                                                  // 137
				if (usernameOrEmail.indexOf('@') !== -1)                                                                           // 138
					document.getElementById('forgot-password-email').value = usernameOrEmail;                                         // 139
		},                                                                                                                   // 140
		'click #back-to-login-link': function() {                                                                            // 141
			event.stopPropagation();                                                                                            // 142
			loginButtonsSession.resetMessages();                                                                                // 143
                                                                                                                       // 144
			var username = trimmedElementValueById('login-username');                                                           // 145
			var email = trimmedElementValueById('login-email') || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?
                                                                                                                       // 147
			loginButtonsSession.set('inSignupFlow', false);                                                                     // 148
			loginButtonsSession.set('inForgotPasswordFlow', false);                                                             // 149
                                                                                                                       // 150
			// force the ui to update so that we have the approprate fields to fill in                                          // 151
			Meteor.flush();                                                                                                     // 152
                                                                                                                       // 153
			if (document.getElementById('login-username'))                                                                      // 154
				document.getElementById('login-username').value = username;                                                        // 155
			if (document.getElementById('login-email'))                                                                         // 156
				document.getElementById('login-email').value = email;                                                              // 157
			// "login-password" is preserved thanks to the preserve-inputs package                                              // 158
			if (document.getElementById('login-username-or-email'))                                                             // 159
				document.getElementById('login-username-or-email').value = email || username;                                      // 160
		},                                                                                                                   // 161
		'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function(event) {
			if (event.keyCode === 13)                                                                                           // 163
				loginOrSignup();                                                                                                   // 164
		}                                                                                                                    // 165
	});                                                                                                                   // 166
                                                                                                                       // 167
	// additional classes that can be helpful in styling the dropdown                                                     // 168
	Template._loginButtonsLoggedOutDropdown.additionalClasses = function() {                                              // 169
		if (!Accounts.password) {                                                                                            // 170
			return false;                                                                                                       // 171
		} else {                                                                                                             // 172
			if (loginButtonsSession.get('inSignupFlow')) {                                                                      // 173
				return 'login-form-create-account';                                                                                // 174
			} else if (loginButtonsSession.get('inForgotPasswordFlow')) {                                                       // 175
				return 'login-form-forgot-password';                                                                               // 176
			} else {                                                                                                            // 177
				return 'login-form-sign-in';                                                                                       // 178
			}                                                                                                                   // 179
		}                                                                                                                    // 180
	};                                                                                                                    // 181
                                                                                                                       // 182
	Template._loginButtonsLoggedOutDropdown.dropdownVisible = function() {                                                // 183
		return loginButtonsSession.get('dropdownVisible');                                                                   // 184
	};                                                                                                                    // 185
                                                                                                                       // 186
	Template._loginButtonsLoggedOutDropdown.hasPasswordService = function() {                                             // 187
		return Accounts._loginButtons.hasPasswordService();                                                                  // 188
	};                                                                                                                    // 189
                                                                                                                       // 190
	Template._loginButtonsLoggedOutDropdown.forbidClientAccountCreation = function() {                                    // 191
		return Accounts._options.forbidClientAccountCreation;                                                                // 192
	};                                                                                                                    // 193
                                                                                                                       // 194
	Template._loginButtonsLoggedOutAllServices.services = function() {                                                    // 195
		return Accounts._loginButtons.getLoginServices();                                                                    // 196
	};                                                                                                                    // 197
                                                                                                                       // 198
	Template._loginButtonsLoggedOutAllServices.isPasswordService = function() {                                           // 199
		return this.name === 'password';                                                                                     // 200
	};                                                                                                                    // 201
                                                                                                                       // 202
	Template._loginButtonsLoggedOutAllServices.hasOtherServices = function() {                                            // 203
		return Accounts._loginButtons.getLoginServices().length > 1;                                                         // 204
	};                                                                                                                    // 205
                                                                                                                       // 206
	Template._loginButtonsLoggedOutAllServices.hasPasswordService = function() {                                          // 207
		return Accounts._loginButtons.hasPasswordService();                                                                  // 208
	};                                                                                                                    // 209
                                                                                                                       // 210
	Template._loginButtonsLoggedOutPasswordService.fields = function() {                                                  // 211
		var loginFields = [{                                                                                                 // 212
			fieldName: 'username-or-email',                                                                                     // 213
			fieldLabel: 'Username or Email',                                                                                    // 214
			visible: function() {                                                                                               // 215
				return _.contains(                                                                                                 // 216
					["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],                              // 217
					Accounts.ui._passwordSignupFields());                                                                             // 218
			}                                                                                                                   // 219
		}, {                                                                                                                 // 220
			fieldName: 'username',                                                                                              // 221
			fieldLabel: 'Username',                                                                                             // 222
			visible: function() {                                                                                               // 223
				return Accounts.ui._passwordSignupFields() === "USERNAME_ONLY";                                                    // 224
			}                                                                                                                   // 225
		}, {                                                                                                                 // 226
			fieldName: 'email',                                                                                                 // 227
			fieldLabel: 'Email',                                                                                                // 228
			inputType: 'email',                                                                                                 // 229
			visible: function() {                                                                                               // 230
				return Accounts.ui._passwordSignupFields() === "EMAIL_ONLY";                                                       // 231
			}                                                                                                                   // 232
		}, {                                                                                                                 // 233
			fieldName: 'password',                                                                                              // 234
			fieldLabel: 'Password',                                                                                             // 235
			inputType: 'password',                                                                                              // 236
			visible: function() {                                                                                               // 237
				return true;                                                                                                       // 238
			}                                                                                                                   // 239
		}];                                                                                                                  // 240
                                                                                                                       // 241
		var signupFields = [{                                                                                                // 242
			fieldName: 'username',                                                                                              // 243
			fieldLabel: 'Username',                                                                                             // 244
			visible: function() {                                                                                               // 245
				return _.contains(                                                                                                 // 246
					["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],             // 247
					Accounts.ui._passwordSignupFields());                                                                             // 248
			}                                                                                                                   // 249
		}, {                                                                                                                 // 250
			fieldName: 'email',                                                                                                 // 251
			fieldLabel: 'Email',                                                                                                // 252
			inputType: 'email',                                                                                                 // 253
			visible: function() {                                                                                               // 254
				return _.contains(                                                                                                 // 255
					["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "EMAIL_ONLY"],                                               // 256
					Accounts.ui._passwordSignupFields());                                                                             // 257
			}                                                                                                                   // 258
		}, {                                                                                                                 // 259
			fieldName: 'email',                                                                                                 // 260
			fieldLabel: 'Email (optional)',                                                                                     // 261
			inputType: 'email',                                                                                                 // 262
			visible: function() {                                                                                               // 263
				return Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";                                      // 264
			}                                                                                                                   // 265
		}, {                                                                                                                 // 266
			fieldName: 'password',                                                                                              // 267
			fieldLabel: 'Password',                                                                                             // 268
			inputType: 'password',                                                                                              // 269
			visible: function() {                                                                                               // 270
				return true;                                                                                                       // 271
			}                                                                                                                   // 272
		}, {                                                                                                                 // 273
			fieldName: 'password-again',                                                                                        // 274
			fieldLabel: 'Password (again)',                                                                                     // 275
			inputType: 'password',                                                                                              // 276
			visible: function() {                                                                                               // 277
				// No need to make users double-enter their password if                                                            // 278
				// they'll necessarily have an email set, since they can use                                                       // 279
				// the "forgot password" flow.                                                                                     // 280
				return _.contains(                                                                                                 // 281
					["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                   // 282
					Accounts.ui._passwordSignupFields());                                                                             // 283
			}                                                                                                                   // 284
		}];                                                                                                                  // 285
                                                                                                                       // 286
		signupFields = Accounts.ui._options.extraSignupFields.concat(signupFields);                                          // 287
                                                                                                                       // 288
		return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;                                         // 289
	};                                                                                                                    // 290
                                                                                                                       // 291
	Template._loginButtonsLoggedOutPasswordService.inForgotPasswordFlow = function() {                                    // 292
		return loginButtonsSession.get('inForgotPasswordFlow');                                                              // 293
	};                                                                                                                    // 294
                                                                                                                       // 295
	Template._loginButtonsLoggedOutPasswordService.inLoginFlow = function() {                                             // 296
		return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');                 // 297
	};                                                                                                                    // 298
                                                                                                                       // 299
	Template._loginButtonsLoggedOutPasswordService.inSignupFlow = function() {                                            // 300
		return loginButtonsSession.get('inSignupFlow');                                                                      // 301
	};                                                                                                                    // 302
                                                                                                                       // 303
	Template._loginButtonsLoggedOutPasswordService.showForgotPasswordLink = function() {                                  // 304
		return _.contains(                                                                                                   // 305
			["USERNAME_AND_EMAIL_CONFIRM", "USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],                  // 306
			Accounts.ui._passwordSignupFields());                                                                               // 307
	};                                                                                                                    // 308
                                                                                                                       // 309
	Template._loginButtonsLoggedOutPasswordService.showCreateAccountLink = function() {                                   // 310
		return !Accounts._options.forbidClientAccountCreation;                                                               // 311
	};                                                                                                                    // 312
                                                                                                                       // 313
	Template._loginButtonsFormField.inputType = function() {                                                              // 314
		return this.inputType || "text";                                                                                     // 315
	};                                                                                                                    // 316
                                                                                                                       // 317
                                                                                                                       // 318
	//                                                                                                                    // 319
	// loginButtonsChangePassword template                                                                                // 320
	//                                                                                                                    // 321
	Template._loginButtonsChangePassword.events({                                                                         // 322
		'keypress #login-old-password, keypress #login-password, keypress #login-password-again': function(event) {          // 323
			if (event.keyCode === 13)                                                                                           // 324
				changePassword();                                                                                                  // 325
		},                                                                                                                   // 326
		'click #login-buttons-do-change-password': function(event) {                                                         // 327
			event.stopPropagation();                                                                                            // 328
			changePassword();                                                                                                   // 329
		},                                                                                                                   // 330
		'click #login-buttons-cancel-change-password': function(event) {                                                     // 331
			event.stopPropagation();                                                                                            // 332
			loginButtonsSession.resetMessages();                                                                                // 333
			Accounts._loginButtonsSession.set('inChangePasswordFlow', false);                                                   // 334
			Meteor.flush();                                                                                                     // 335
		}                                                                                                                    // 336
	});                                                                                                                   // 337
                                                                                                                       // 338
	Template._loginButtonsChangePassword.fields = function() {                                                            // 339
		return [{                                                                                                            // 340
			fieldName: 'old-password',                                                                                          // 341
			fieldLabel: 'Current Password',                                                                                     // 342
			inputType: 'password',                                                                                              // 343
			visible: function() {                                                                                               // 344
				return true;                                                                                                       // 345
			}                                                                                                                   // 346
		}, {                                                                                                                 // 347
			fieldName: 'password',                                                                                              // 348
			fieldLabel: 'New Password',                                                                                         // 349
			inputType: 'password',                                                                                              // 350
			visible: function() {                                                                                               // 351
				return true;                                                                                                       // 352
			}                                                                                                                   // 353
		}, {                                                                                                                 // 354
			fieldName: 'password-again',                                                                                        // 355
			fieldLabel: 'New Password (again)',                                                                                 // 356
			inputType: 'password',                                                                                              // 357
			visible: function() {                                                                                               // 358
				// No need to make users double-enter their password if                                                            // 359
				// they'll necessarily have an email set, since they can use                                                       // 360
				// the "forgot password" flow.                                                                                     // 361
				return _.contains(                                                                                                 // 362
					["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                                 // 363
					Accounts.ui._passwordSignupFields());                                                                             // 364
			}                                                                                                                   // 365
		}];                                                                                                                  // 366
	};                                                                                                                    // 367
                                                                                                                       // 368
                                                                                                                       // 369
	//                                                                                                                    // 370
	// helpers                                                                                                            // 371
	//                                                                                                                    // 372
                                                                                                                       // 373
	var elementValueById = function(id) {                                                                                 // 374
		var element = document.getElementById(id);                                                                           // 375
		if (!element)                                                                                                        // 376
			return null;                                                                                                        // 377
		else                                                                                                                 // 378
			return element.value;                                                                                               // 379
	};                                                                                                                    // 380
                                                                                                                       // 381
	var trimmedElementValueById = function(id) {                                                                          // 382
		var element = document.getElementById(id);                                                                           // 383
		if (!element)                                                                                                        // 384
			return null;                                                                                                        // 385
		else                                                                                                                 // 386
			return element.value.replace(/^\s*|\s*$/g, ""); // trim;                                                            // 387
	};                                                                                                                    // 388
                                                                                                                       // 389
	var loginOrSignup = function() {                                                                                      // 390
		if (loginButtonsSession.get('inSignupFlow'))                                                                         // 391
			signup();                                                                                                           // 392
		else                                                                                                                 // 393
			login();                                                                                                            // 394
	};                                                                                                                    // 395
                                                                                                                       // 396
	var login = function() {                                                                                              // 397
		loginButtonsSession.resetMessages();                                                                                 // 398
                                                                                                                       // 399
		var username = trimmedElementValueById('login-username');                                                            // 400
		var email = trimmedElementValueById('login-email');                                                                  // 401
		var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                            // 402
		// notably not trimmed. a password could (?) start or end with a space                                               // 403
		var password = elementValueById('login-password');                                                                   // 404
                                                                                                                       // 405
		var loginSelector;                                                                                                   // 406
		if (username !== null) {                                                                                             // 407
			if (!Accounts._loginButtons.validateUsername(username))                                                             // 408
				return;                                                                                                            // 409
			else                                                                                                                // 410
				loginSelector = {                                                                                                  // 411
					username: username                                                                                                // 412
				};                                                                                                                 // 413
		} else if (email !== null) {                                                                                         // 414
			if (!Accounts._loginButtons.validateEmail(email))                                                                   // 415
				return;                                                                                                            // 416
			else                                                                                                                // 417
				loginSelector = {                                                                                                  // 418
					email: email                                                                                                      // 419
				};                                                                                                                 // 420
		} else if (usernameOrEmail !== null) {                                                                               // 421
			// XXX not sure how we should validate this. but this seems good enough (for now),                                  // 422
			// since an email must have at least 3 characters anyways                                                           // 423
			if (!Accounts._loginButtons.validateUsername(usernameOrEmail))                                                      // 424
				return;                                                                                                            // 425
			else                                                                                                                // 426
				loginSelector = usernameOrEmail;                                                                                   // 427
		} else {                                                                                                             // 428
			throw new Error("Unexpected -- no element to use as a login user selector");                                        // 429
		}                                                                                                                    // 430
                                                                                                                       // 431
		Meteor.loginWithPassword(loginSelector, password, function(error, result) {                                          // 432
			if (error) {                                                                                                        // 433
				loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                 // 434
			} else {                                                                                                            // 435
				loginButtonsSession.closeDropdown();                                                                               // 436
			}                                                                                                                   // 437
		});                                                                                                                  // 438
	};                                                                                                                    // 439
                                                                                                                       // 440
	var toggleDropdown = function() {                                                                                     // 441
		$('#login-dropdown-list .dropdown-menu').dropdown('toggle');                                                         // 442
	};                                                                                                                    // 443
                                                                                                                       // 444
	var signup = function() {                                                                                             // 445
		loginButtonsSession.resetMessages();                                                                                 // 446
                                                                                                                       // 447
		var options = {}; // to be passed to Accounts.createUser                                                             // 448
                                                                                                                       // 449
		var username = trimmedElementValueById('login-username');                                                            // 450
		if (username !== null) {                                                                                             // 451
			if (!Accounts._loginButtons.validateUsername(username))                                                             // 452
				return;                                                                                                            // 453
			else                                                                                                                // 454
				options.username = username;                                                                                       // 455
		}                                                                                                                    // 456
                                                                                                                       // 457
		var email = trimmedElementValueById('login-email');                                                                  // 458
		if (email !== null) {                                                                                                // 459
			if (!Accounts._loginButtons.validateEmail(email))                                                                   // 460
				return;                                                                                                            // 461
			else                                                                                                                // 462
				options.email = email;                                                                                             // 463
		}                                                                                                                    // 464
                                                                                                                       // 465
		// notably not trimmed. a password could (?) start or end with a space                                               // 466
		var password = elementValueById('login-password');                                                                   // 467
		if (!Accounts._loginButtons.validatePassword(password))                                                              // 468
			return;                                                                                                             // 469
		else                                                                                                                 // 470
			options.password = password;                                                                                        // 471
                                                                                                                       // 472
		if (!matchPasswordAgainIfPresent())                                                                                  // 473
			return;                                                                                                             // 474
                                                                                                                       // 475
		// prepare the profile object                                                                                        // 476
		options.profile = {};                                                                                                // 477
                                                                                                                       // 478
		// define a proxy function to allow extraSignupFields set error messages                                             // 479
		var errorFn = function(errorMessage) {                                                                               // 480
			Accounts._loginButtonsSession.errorMessage(errorMessage);                                                           // 481
		};                                                                                                                   // 482
                                                                                                                       // 483
		var invalidExtraSignupFields = false;                                                                                // 484
                                                                                                                       // 485
		// parse extraSignupFields to populate account's profile data                                                        // 486
		_.each(Accounts.ui._options.extraSignupFields, function(field, index) {                                              // 487
			var value = elementValueById('login-' + field.fieldName);                                                           // 488
			if (typeof field.validate === 'function') {                                                                         // 489
				if (field.validate(value, errorFn)) {                                                                              // 490
					options.profile[field.fieldName] = elementValueById('login-' + field.fieldName);                                  // 491
				} else {                                                                                                           // 492
					invalidExtraSignupFields = true;                                                                                  // 493
				}                                                                                                                  // 494
			} else {                                                                                                            // 495
				options.profile[field.fieldName] = elementValueById('login-' + field.fieldName);                                   // 496
			}                                                                                                                   // 497
		});                                                                                                                  // 498
                                                                                                                       // 499
		if (invalidExtraSignupFields)                                                                                        // 500
			return;                                                                                                             // 501
                                                                                                                       // 502
		Accounts.createUser(options, function(error) {                                                                       // 503
			if (error) {                                                                                                        // 504
				loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                 // 505
			} else {                                                                                                            // 506
				loginButtonsSession.closeDropdown();                                                                               // 507
			}                                                                                                                   // 508
		});                                                                                                                  // 509
	};                                                                                                                    // 510
                                                                                                                       // 511
	var forgotPassword = function() {                                                                                     // 512
		loginButtonsSession.resetMessages();                                                                                 // 513
                                                                                                                       // 514
		var email = trimmedElementValueById("forgot-password-email");                                                        // 515
		if (email.indexOf('@') !== -1) {                                                                                     // 516
			Accounts.forgotPassword({                                                                                           // 517
				email: email                                                                                                       // 518
			}, function(error) {                                                                                                // 519
				if (error)                                                                                                         // 520
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 521
				else                                                                                                               // 522
					loginButtonsSession.infoMessage("Email sent");                                                                    // 523
			});                                                                                                                 // 524
		} else {                                                                                                             // 525
			loginButtonsSession.infoMessage("Email sent");                                                                      // 526
		}                                                                                                                    // 527
	};                                                                                                                    // 528
                                                                                                                       // 529
	var changePassword = function() {                                                                                     // 530
		loginButtonsSession.resetMessages();                                                                                 // 531
                                                                                                                       // 532
		// notably not trimmed. a password could (?) start or end with a space                                               // 533
		var oldPassword = elementValueById('login-old-password');                                                            // 534
                                                                                                                       // 535
		// notably not trimmed. a password could (?) start or end with a space                                               // 536
		var password = elementValueById('login-password');                                                                   // 537
		if (!Accounts._loginButtons.validatePassword(password))                                                              // 538
			return;                                                                                                             // 539
                                                                                                                       // 540
		if (!matchPasswordAgainIfPresent())                                                                                  // 541
			return;                                                                                                             // 542
                                                                                                                       // 543
		Accounts.changePassword(oldPassword, password, function(error) {                                                     // 544
			if (error) {                                                                                                        // 545
				loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                 // 546
			} else {                                                                                                            // 547
				loginButtonsSession.infoMessage("Password changed");                                                               // 548
                                                                                                                       // 549
				// wait 3 seconds, then expire the msg                                                                             // 550
				Meteor.setTimeout(function() {                                                                                     // 551
					loginButtonsSession.resetMessages();                                                                              // 552
				}, 3000);                                                                                                          // 553
			}                                                                                                                   // 554
		});                                                                                                                  // 555
	};                                                                                                                    // 556
                                                                                                                       // 557
	var matchPasswordAgainIfPresent = function() {                                                                        // 558
		// notably not trimmed. a password could (?) start or end with a space                                               // 559
		var passwordAgain = elementValueById('login-password-again');                                                        // 560
		if (passwordAgain !== null) {                                                                                        // 561
			// notably not trimmed. a password could (?) start or end with a space                                              // 562
			var password = elementValueById('login-password');                                                                  // 563
			if (password !== passwordAgain) {                                                                                   // 564
				loginButtonsSession.errorMessage("Passwords don't match");                                                         // 565
				return false;                                                                                                      // 566
			}                                                                                                                   // 567
		}                                                                                                                    // 568
		return true;                                                                                                         // 569
	};                                                                                                                    // 570
})();                                                                                                                  // 571
                                                                                                                       // 572
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-bootstrap-3/login_buttons_dialogs.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {                                                                                                         // 1
	// for convenience                                                                                                    // 2
	var loginButtonsSession = Accounts._loginButtonsSession;                                                              // 3
                                                                                                                       // 4
                                                                                                                       // 5
	//                                                                                                                    // 6
	// populate the session so that the appropriate dialogs are                                                           // 7
	// displayed by reading variables set by accounts-urls, which parses                                                  // 8
	// special URLs. since accounts-ui depends on accounts-urls, we are                                                   // 9
	// guaranteed to have these set at this point.                                                                        // 10
	//                                                                                                                    // 11
                                                                                                                       // 12
	if (Accounts._resetPasswordToken) {                                                                                   // 13
		loginButtonsSession.set('resetPasswordToken', Accounts._resetPasswordToken);                                         // 14
	}                                                                                                                     // 15
                                                                                                                       // 16
	if (Accounts._enrollAccountToken) {                                                                                   // 17
		loginButtonsSession.set('enrollAccountToken', Accounts._enrollAccountToken);                                         // 18
	}                                                                                                                     // 19
                                                                                                                       // 20
	// Needs to be in Meteor.startup because of a package loading order                                                   // 21
	// issue. We can't be sure that accounts-password is loaded earlier                                                   // 22
	// than accounts-ui so Accounts.verifyEmail might not be defined.                                                     // 23
	Meteor.startup(function () {                                                                                          // 24
		if (Accounts._verifyEmailToken) {                                                                                    // 25
			Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {                                                  // 26
				Accounts._enableAutoLogin();                                                                                       // 27
				if (!error)                                                                                                        // 28
					loginButtonsSession.set('justVerifiedEmail', true);                                                               // 29
				// XXX show something if there was an error.                                                                       // 30
			});                                                                                                                 // 31
		}                                                                                                                    // 32
	});                                                                                                                   // 33
                                                                                                                       // 34
                                                                                                                       // 35
	//                                                                                                                    // 36
	// resetPasswordDialog template                                                                                       // 37
	//                                                                                                                    // 38
	Template._resetPasswordDialog.rendered = function() {                                                                 // 39
		var $modal = $(this.find('#login-buttons-reset-password-modal'));                                                    // 40
		$modal.modal();                                                                                                      // 41
	}                                                                                                                     // 42
                                                                                                                       // 43
	Template._resetPasswordDialog.events({                                                                                // 44
		'click #login-buttons-reset-password-button': function (event) {                                                     // 45
			event.stopPropagation();                                                                                            // 46
			resetPassword();                                                                                                    // 47
		},                                                                                                                   // 48
		'keypress #reset-password-new-password': function (event) {                                                          // 49
			if (event.keyCode === 13)                                                                                           // 50
				resetPassword();                                                                                                   // 51
		},                                                                                                                   // 52
		'click #login-buttons-cancel-reset-password': function (event) {                                                     // 53
			event.stopPropagation();                                                                                            // 54
			loginButtonsSession.set('resetPasswordToken', null);                                                                // 55
			Accounts._enableAutoLogin();                                                                                        // 56
			$('#login-buttons-reset-password-modal').modal("hide");                                                             // 57
		}                                                                                                                    // 58
	});                                                                                                                   // 59
                                                                                                                       // 60
	var resetPassword = function () {                                                                                     // 61
		loginButtonsSession.resetMessages();                                                                                 // 62
		var newPassword = document.getElementById('reset-password-new-password').value;                                      // 63
		if (!Accounts._loginButtons.validatePassword(newPassword))                                                           // 64
			return;                                                                                                             // 65
                                                                                                                       // 66
		Accounts.resetPassword(                                                                                              // 67
			loginButtonsSession.get('resetPasswordToken'), newPassword,                                                         // 68
			function (error) {                                                                                                  // 69
				if (error) {                                                                                                       // 70
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 71
				} else {                                                                                                           // 72
					loginButtonsSession.set('resetPasswordToken', null);                                                              // 73
					Accounts._enableAutoLogin();                                                                                      // 74
					$('#login-buttons-reset-password-modal').modal("hide");                                                           // 75
				}                                                                                                                  // 76
			});                                                                                                                 // 77
	};                                                                                                                    // 78
                                                                                                                       // 79
	Template._resetPasswordDialog.inResetPasswordFlow = function () {                                                     // 80
		return loginButtonsSession.get('resetPasswordToken');                                                                // 81
	};                                                                                                                    // 82
                                                                                                                       // 83
                                                                                                                       // 84
	//                                                                                                                    // 85
	// enrollAccountDialog template                                                                                       // 86
	//                                                                                                                    // 87
                                                                                                                       // 88
	Template._enrollAccountDialog.events({                                                                                // 89
		'click #login-buttons-enroll-account-button': function () {                                                          // 90
			enrollAccount();                                                                                                    // 91
		},                                                                                                                   // 92
		'keypress #enroll-account-password': function (event) {                                                              // 93
			if (event.keyCode === 13)                                                                                           // 94
				enrollAccount();                                                                                                   // 95
		},                                                                                                                   // 96
		'click #login-buttons-cancel-enroll-account-button': function () {                                                   // 97
			loginButtonsSession.set('enrollAccountToken', null);                                                                // 98
			Accounts._enableAutoLogin();                                                                                        // 99
			$modal.modal("hide");                                                                                               // 100
		}                                                                                                                    // 101
	});                                                                                                                   // 102
                                                                                                                       // 103
	Template._enrollAccountDialog.rendered = function() {                                                                 // 104
		$modal = $(this.find('#login-buttons-enroll-account-modal'));                                                        // 105
		$modal.modal();                                                                                                      // 106
	};                                                                                                                    // 107
                                                                                                                       // 108
	var enrollAccount = function () {                                                                                     // 109
		loginButtonsSession.resetMessages();                                                                                 // 110
		var password = document.getElementById('enroll-account-password').value;                                             // 111
		if (!Accounts._loginButtons.validatePassword(password))                                                              // 112
			return;                                                                                                             // 113
                                                                                                                       // 114
		Accounts.resetPassword(                                                                                              // 115
			loginButtonsSession.get('enrollAccountToken'), password,                                                            // 116
			function (error) {                                                                                                  // 117
				if (error) {                                                                                                       // 118
					loginButtonsSession.errorMessage(error.reason || "Unknown error");                                                // 119
				} else {                                                                                                           // 120
					loginButtonsSession.set('enrollAccountToken', null);                                                              // 121
					Accounts._enableAutoLogin();                                                                                      // 122
					$modal.modal("hide");                                                                                             // 123
				}                                                                                                                  // 124
			});                                                                                                                 // 125
	};                                                                                                                    // 126
                                                                                                                       // 127
	Template._enrollAccountDialog.inEnrollAccountFlow = function () {                                                     // 128
		return loginButtonsSession.get('enrollAccountToken');                                                                // 129
	};                                                                                                                    // 130
                                                                                                                       // 131
                                                                                                                       // 132
	//                                                                                                                    // 133
	// justVerifiedEmailDialog template                                                                                   // 134
	//                                                                                                                    // 135
                                                                                                                       // 136
	Template._justVerifiedEmailDialog.events({                                                                            // 137
		'click #just-verified-dismiss-button': function () {                                                                 // 138
			loginButtonsSession.set('justVerifiedEmail', false);                                                                // 139
		}                                                                                                                    // 140
	});                                                                                                                   // 141
                                                                                                                       // 142
	Template._justVerifiedEmailDialog.visible = function () {                                                             // 143
		return loginButtonsSession.get('justVerifiedEmail');                                                                 // 144
	};                                                                                                                    // 145
                                                                                                                       // 146
                                                                                                                       // 147
	//                                                                                                                    // 148
	// loginButtonsMessagesDialog template                                                                                // 149
	//                                                                                                                    // 150
                                                                                                                       // 151
	// Template._loginButtonsMessagesDialog.rendered = function() {                                                       // 152
	//   var $modal = $(this.find('#configure-login-service-dialog-modal'));                                              // 153
	//   $modal.modal();                                                                                                  // 154
	// }                                                                                                                  // 155
                                                                                                                       // 156
	Template._loginButtonsMessagesDialog.events({                                                                         // 157
		'click #messages-dialog-dismiss-button': function () {                                                               // 158
			loginButtonsSession.resetMessages();                                                                                // 159
		}                                                                                                                    // 160
	});                                                                                                                   // 161
                                                                                                                       // 162
	Template._loginButtonsMessagesDialog.visible = function () {                                                          // 163
		var hasMessage = loginButtonsSession.get('infoMessage') || loginButtonsSession.get('errorMessage');                  // 164
		return !Accounts._loginButtons.dropdown() && hasMessage;                                                             // 165
	};                                                                                                                    // 166
                                                                                                                       // 167
                                                                                                                       // 168
	//                                                                                                                    // 169
	// configureLoginServiceDialog template                                                                               // 170
	//                                                                                                                    // 171
                                                                                                                       // 172
	Template._configureLoginServiceDialog.events({                                                                        // 173
		'click .configure-login-service-dismiss-button': function () {                                                       // 174
			event.stopPropagation();                                                                                            // 175
			loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                               // 176
			$('#configure-login-service-dialog-modal').modal('hide');                                                           // 177
		},                                                                                                                   // 178
		'click #configure-login-service-dialog-save-configuration': function () {                                            // 179
			if (loginButtonsSession.get('configureLoginServiceDialogVisible') &&                                                // 180
					! loginButtonsSession.get('configureLoginServiceDialogSaveDisabled')) {                                           // 181
				// Prepare the configuration document for this login service                                                       // 182
				var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                               // 183
				var configuration = {                                                                                              // 184
					service: serviceName                                                                                              // 185
				};                                                                                                                 // 186
				_.each(configurationFields(), function(field) {                                                                    // 187
					configuration[field.property] = document.getElementById(                                                          // 188
						'configure-login-service-dialog-' + field.property).value                                                        // 189
						.replace(/^\s*|\s*$/g, ""); // trim;                                                                             // 190
				});                                                                                                                // 191
                                                                                                                       // 192
				// Configure this login service                                                                                    // 193
				Meteor.call("configureLoginService", configuration, function (error, result) {                                     // 194
					if (error)                                                                                                        // 195
						Meteor._debug("Error configuring login service " + serviceName, error);                                          // 196
					else                                                                                                              // 197
						loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                            // 198
						$('#configure-login-service-dialog-modal').modal('hide');                                                        // 199
				});                                                                                                                // 200
			}                                                                                                                   // 201
		},                                                                                                                   // 202
		// IE8 doesn't support the 'input' event, so we'll run this on the keyup as                                          // 203
		// well. (Keeping the 'input' event means that this also fires when you use                                          // 204
		// the mouse to change the contents of the field, eg 'Cut' menu item.)                                               // 205
		'input, keyup input': function (event) {                                                                             // 206
			// if the event fired on one of the configuration input fields,                                                     // 207
			// check whether we should enable the 'save configuration' button                                                   // 208
			if (event.target.id.indexOf('configure-login-service-dialog') === 0)                                                // 209
				updateSaveDisabled();                                                                                              // 210
		}                                                                                                                    // 211
	});                                                                                                                   // 212
                                                                                                                       // 213
	// check whether the 'save configuration' button should be enabled.                                                   // 214
	// this is a really strange way to implement this and a Forms                                                         // 215
	// Abstraction would make all of this reactive, and simpler.                                                          // 216
	var updateSaveDisabled = function () {                                                                                // 217
		var anyFieldEmpty = _.any(configurationFields(), function(field) {                                                   // 218
			return document.getElementById(                                                                                     // 219
				'configure-login-service-dialog-' + field.property).value === '';                                                  // 220
		});                                                                                                                  // 221
                                                                                                                       // 222
		loginButtonsSession.set('configureLoginServiceDialogSaveDisabled', anyFieldEmpty);                                   // 223
	};                                                                                                                    // 224
                                                                                                                       // 225
	// Returns the appropriate template for this login service.  This                                                     // 226
	// template should be defined in the service's package                                                                // 227
	var configureLoginServiceDialogTemplateForService = function () {                                                     // 228
		var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                                 // 229
		return Template['configureLoginServiceDialogFor' + capitalize(serviceName)];                                         // 230
	};                                                                                                                    // 231
                                                                                                                       // 232
	var configurationFields = function () {                                                                               // 233
		var template = configureLoginServiceDialogTemplateForService();                                                      // 234
		return template.fields();                                                                                            // 235
	};                                                                                                                    // 236
                                                                                                                       // 237
	Template._configureLoginServiceDialog.configurationFields = function () {                                             // 238
		return configurationFields();                                                                                        // 239
	};                                                                                                                    // 240
                                                                                                                       // 241
	Template._configureLoginServiceDialog.visible = function () {                                                         // 242
		return loginButtonsSession.get('configureLoginServiceDialogVisible');                                                // 243
	};                                                                                                                    // 244
                                                                                                                       // 245
	Template._configureLoginServiceDialog.configurationSteps = function () {                                              // 246
		// renders the appropriate template                                                                                  // 247
		return configureLoginServiceDialogTemplateForService();                                                              // 248
	};                                                                                                                    // 249
                                                                                                                       // 250
	Template._configureLoginServiceDialog.saveDisabled = function () {                                                    // 251
		return loginButtonsSession.get('configureLoginServiceDialogSaveDisabled');                                           // 252
	};                                                                                                                    // 253
                                                                                                                       // 254
                                                                                                                       // 255
	// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                        // 256
	var capitalize = function(str){                                                                                       // 257
		str = str == null ? '' : String(str);                                                                                // 258
		return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 259
	};                                                                                                                    // 260
                                                                                                                       // 261
}) ();                                                                                                                 // 262
                                                                                                                       // 263
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-ui-bootstrap-3'] = {};

})();

//# sourceMappingURL=b23e26444317abd116ea346c6be0b068471cb2ec.map
