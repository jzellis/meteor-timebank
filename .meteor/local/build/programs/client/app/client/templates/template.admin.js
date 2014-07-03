(function(){
Template.__define__("admin", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n\n	", UI.If(function() {
    return Spacebars.call(Spacebars.dot(self.lookup("currentUser"), "profile", "isAdmin"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.H1("Admin"), "\n\n", HTML.DIV({
      "class": "row"
    }, "\n	", HTML.UL({
      "class": "nav nav-tabs"
    }, "\n  ", HTML.LI({
      "class": "active"
    }, HTML.A({
      href: "#stats",
      "data-toggle": "tab"
    }, "Stats")), "\n\n  ", HTML.LI(HTML.A({
      href: "#users",
      "data-toggle": "tab"
    }, "Users")), "\n  ", HTML.LI(HTML.A({
      href: "#settings",
      "data-toggle": "tab"
    }, "Settings")), "\n"), "\n\n", HTML.Comment(" Tab panes "), "\n", HTML.DIV({
      "class": "tab-content"
    }, "\n  ", HTML.DIV({
      "class": "tab-pane active",
      id: "stats"
    }, "\n  	", HTML.UL("\n  		", HTML.LI("	Users: ", function() {
      return Spacebars.mustache(self.lookup("userCount"));
    }), "\n  		", HTML.LI("Total Time: ", function() {
      return Spacebars.mustache(self.lookup("getTotalTime"));
    }), "\n  	"), "\n\n	", HTML.SPAN({
      "class": "btn btn-danger",
      id: "calculateBalance"
    }, "Recalculate User Balance"), "\n\n  "), "\n\n  ", HTML.DIV({
      "class": "tab-pane",
      id: "users"
    }, "\n", HTML.TABLE({
      "class": "table"
    }, "\n	", HTML.THEAD(HTML.TR(HTML.TH("Username"), HTML.TH("Real Name"), HTML.TH("Email"), HTML.TH("Balance"), HTML.TH("Added"), HTML.TH("Admin"), HTML.TH())), "\n", HTML.TBODY("\n	", UI.Each(function() {
      return Spacebars.call(self.lookup("getUsers"));
    }, UI.block(function() {
      var self = this;
      return [ "\n	", HTML.TR(HTML.TD(HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ],
        target: "_new"
      }, function() {
        return Spacebars.mustache(self.lookup("username"));
      })), HTML.TD(function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "name"));
      }), HTML.TD(HTML.A({
        href: [ "mailto:", function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("emails"), "0", "address"));
        } ]
      }, function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("emails"), "0", "address"));
      })), HTML.TD(function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "balance"));
      }), HTML.TD(function() {
        return Spacebars.mustache(self.lookup("formatDate"), Spacebars.dot(self.lookup("profile"), "createdAt"));
      }), HTML.TD(HTML.INPUT({
        type: "checkbox",
        "class": "isAdmin",
        value: function() {
          return Spacebars.mustache(self.lookup("_id"));
        },
        checked: function() {
          return Spacebars.mustache(self.lookup("isAdmin"));
        }
      })), HTML.TD(HTML.BUTTON({
        type: "button",
        value: function() {
          return Spacebars.mustache(self.lookup("_id"));
        },
        "class": "deleteButton btn btn-danger btn-sm"
      }, "Delete"))), "\n	" ];
    })), "\n"), "\n"), "\n  "), "\n\n  ", HTML.DIV({
      "class": "tab-pane",
      id: "settings"
    }, "\n  	\n", HTML.FORM({
      role: "form",
      id: "communityForm"
    }, "\n		", HTML.DIV({
      "class": "well",
      id: "step2"
    }, "\n			", HTML.H3("Step 2: Community Info"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "siteName"
    }, "Community Name"), "\n				", HTML.INPUT({
      "class": "form-control input-lg",
      id: "siteName",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "sitename");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				This is the public name of your community\n			"), "\n		"), "\n\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "siteURL"
    }, "Site URL"), "\n				", HTML.INPUT({
      "class": "form-control input-lg",
      id: "siteURL",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "siteURL");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				This is the URL of your site, without trailing slashes\n			"), "\n		"), "\n\n\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "siteImage"
    }, "Icon/Avatar"), "\n				", HTML.INPUT({
      type: "file",
      "class": "form-control input-lg",
      id: "siteImage"
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				This is your community's icon or avatar.\n			"), "\n		"), "\n\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "siteDescription"
    }, "Community Description"), "\n				", HTML.TEXTAREA({
      "class": "form-control",
      id: "siteDescription",
      rows: "8"
    }, function() {
      return Spacebars.mustache(self.lookup("getOption"), "description");
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				Describe your community – what it is, what it's for.\n			"), "\n		"), "\n				", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "location"
    }, "Community Location (optional)"), "\n				", HTML.INPUT({
      "class": "form-control",
      id: "location",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "location");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				Optional, but useful if your community is based on geography.\n			"), "\n		"), "\n	"), "\n\n		", HTML.DIV({
      "class": "well",
      id: "step3"
    }, "\n			", HTML.H3("Currency Info"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "currencyName"
    }, "Currency Name"), "\n				", HTML.INPUT({
      "class": "form-control",
      id: "currencyName",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "currencyName");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				e.g. AustinBucks, DogeCoin, etc.\n			"), "\n		"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "currencyDescription"
    }, "Currency Description"), "\n				", HTML.TEXTAREA({
      "class": "form-control",
      id: "currencyDescription",
      rows: "8"
    }, function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyDescription");
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				What is your currency based on? How is it shared?\n			"), "\n		"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "currencyAbbr"
    }, "Currency Abbrev"), "\n			", HTML.DIV({
      "class": "row"
    }, "\n				", HTML.DIV({
      "class": "col-md-2"
    }, "\n				", HTML.INPUT({
      "class": "form-control",
      id: "currencyAbbr",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				e.g. auBck, USh, $\n			"), "\n			"), "\n		"), "\n		"), "\n	"), "\n\n	", HTML.DIV({
      "class": "well",
      id: "step4"
    }, "\n			", HTML.H3("Community Options"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "defaultBalance"
    }, "New User Default Balance"), "\n				", HTML.INPUT({
      "class": "form-control",
      id: "defaultBalance",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "defaultBalance");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				Should new users start with an existing amount of your currency?\n			"), "\n		"), "\n		", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.DIV({
      "class": "checkbox"
    }, "\n			", HTML.LABEL({
      "for": "negativeBalance"
    }, "\n				", HTML.INPUT({
      type: "checkbox",
      id: "negativeBalance",
      value: "true",
      checked: function() {
        return Spacebars.mustache(self.lookup("getOption"), "negativeBalance");
      }
    }), "\n				Can Users Have A Negative Balance?\n			"), "\n		"), "\n		"), "\n				", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "maxNegativeBalance"
    }, "Maximum Negative Balance"), "\n				", HTML.INPUT({
      "class": "form-control",
      id: "maxNegativeBalance",
      value: function() {
        return Spacebars.mustache(self.lookup("getOption"), "maxNegativeBalance");
      }
    }), "\n							", HTML.SPAN({
      "class": "help-block"
    }, "\n				This is the maximum amount of negative balance a user can have. If they reach this threshold, they cannot give currency to any other user until their balance gets less negative.\n			"), "\n		"), "\n				", HTML.FIELDSET({
      "class": "form-group"
    }, "\n			", HTML.LABEL({
      "for": "whoCanJoin"
    }, "Who can join the community?"), "\n			", HTML.SELECT({
      "class": "form-control",
      id: "whoCanJoin"
    }, "\n				", HTML.OPTION({
      value: "anyone"
    }, "Anyone"), "\n				", HTML.OPTION({
      value: "invite"
    }, "Anyone with an invite code"), "\n			"), "\n						", HTML.SPAN({
      "class": "help-block"
    }, "\n				Invite codes can be tied to a particular person, or you can generate random ones that you can hand out/print out/make up on the fly.\n			"), "\n		"), "\n	"), "\n\n	", HTML.DIV({
      "class": "row"
    }, "\n", HTML.DIV({
      "class": "col-md-12",
      style: "text-align:center"
    }, "\n\n	", HTML.BUTTON({
      type: "submit",
      "class": "btn btn-lg btn-success"
    }, "Update Settings"), "\n"), "\n"), "\n	"), "\n\n  "), "\n"), "\n"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return "\n	You are not an admin user.\n	";
  })), "\n		");
}));

})();
