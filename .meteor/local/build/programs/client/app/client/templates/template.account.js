(function(){
Template.__define__("account", (function() {
  var self = this;
  var template = this;
  return [ UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.DIV({
      "class": "leftSidebar col-md-3"
    }, "\n			", HTML.H2(UI.If(function() {
      return Spacebars.call(Spacebars.dot(self.lookup("currentUser"), "profile", "picture"));
    }, UI.block(function() {
      var self = this;
      return [ HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "picture"));
        },
        style: "height:1em"
      }), " " ];
    })), function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
    }), "\n			", HTML.DIV("Balance: ", HTML.B(function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }, " ", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "balance"));
    })), "\n			", HTML.H3("Profile"), "\n		", HTML.FORM({
      id: "accountForm",
      "parsley-validate": ""
    }, "\n			", HTML.FIELDSET({
      "class": "form-group"
    }, "\n				", HTML.LABEL({
      "for": "email"
    }, "Email"), "\n				", HTML.INPUT({
      type: "email",
      id: "email",
      "class": "email form-control unstyled",
      "parsley-trigger": "change",
      "data-original": function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "emails"), Spacebars.dot(self.lookup("0"), "address"));
      },
      value: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "emails"), Spacebars.dot(self.lookup("0"), "address"));
      }
    }), "\n			"), "\n			", HTML.FIELDSET({
      "class": "form-group"
    }, "\n				", HTML.LABEL({
      "for": "url"
    }, "URL"), "\n				", HTML.INPUT({
      id: "url",
      "class": "url form-control unstyled",
      "data-original": function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "url"));
      },
      value: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "url"));
      }
    }), "\n			"), "\n			", HTML.FIELDSET({
      "class": "form-group"
    }, "\n				", HTML.LABEL({
      "for": "bio"
    }, "Bio"), "\n				", HTML.TEXTAREA({
      id: "bio",
      "class": "bio form-control unstyled",
      rows: "8",
      "data-original": function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "bio"));
      }
    }, function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "bio"));
    }), "\n			"), "\n			", HTML.DIV({
      "class": "text-right",
      id: "accountFormButtons",
      style: "display:none"
    }, HTML.BUTTON({
      type: "button",
      "class": "btn cancel"
    }, "Cancel"), " ", HTML.BUTTON({
      type: "submit",
      "class": "btn"
    }, "Update")), "\n		"), "\n		"), "\n		", HTML.DIV({
      "class": "main col-md-6"
    }, "\n			", HTML.H1("Transactions"), "\n			", UI.If(function() {
      return Spacebars.call(self.lookup("getMyTransactions"));
    }, UI.block(function() {
      var self = this;
      return [ "\n	", HTML.TABLE({
        "class": "table table-striped transactionsTable"
      }, "\n		", HTML.THEAD(HTML.TR(HTML.TD(), HTML.TD("Sender"), HTML.TD("Recipient"), HTML.TD("Amount (", function() {
        return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
      }, ")"), HTML.TD("Description"), HTML.TD("Date"))), "\n		", HTML.TBODY("\n	", UI.Each(function() {
        return Spacebars.call(self.lookup("getMyTransactions"));
      }, UI.block(function() {
        var self = this;
        return [ "\n	", HTML.TR({
          "class": function() {
            return Spacebars.mustache(self.lookup("transactionType"));
          }
        }, "\n	", HTML.TD(UI.If(function() {
          return Spacebars.call(self.lookup("isSender"));
        }, UI.block(function() {
          var self = this;
          return HTML.I({
            "class": "fa fa-chevron-circle-right"
          });
        })), UI.If(function() {
          return Spacebars.call(self.lookup("isRecipient"));
        }, UI.block(function() {
          var self = this;
          return HTML.I({
            "class": "fa fa-chevron-circle-left"
          });
        }))), HTML.TD(Spacebars.With(function() {
          return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("sender"));
        }, UI.block(function() {
          var self = this;
          return HTML.A({
            href: [ "/users/", function() {
              return Spacebars.mustache(self.lookup("username"));
            } ]
          }, function() {
            return Spacebars.mustache(self.lookup("username"));
          });
        }))), HTML.TD(Spacebars.With(function() {
          return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("recipient"));
        }, UI.block(function() {
          var self = this;
          return HTML.A({
            href: [ "/users/", function() {
              return Spacebars.mustache(self.lookup("username"));
            } ]
          }, function() {
            return Spacebars.mustache(self.lookup("username"));
          });
        }))), HTML.TD(function() {
          return Spacebars.mustache(self.lookup("amount"));
        }), HTML.TD(function() {
          return Spacebars.mustache(self.lookup("description"));
        }), HTML.TD(function() {
          return Spacebars.mustache(self.lookup("formatDate"), self.lookup("timestamp"));
        })), "\n\n	" ];
      })), "\n"), "\n	"), "\n" ];
    }), UI.block(function() {
      var self = this;
      return [ "\n", HTML.I("No transactions yet!"), "\n" ];
    })), "\n		"), "\n		", HTML.DIV({
      "class": "rightSidebar col-md-3"
    }, "\n			", HTML.H2("Favorites"), "\n			", UI.If(function() {
      return Spacebars.call(Spacebars.dot(self.lookup("currentUser"), "profile", "favorites"));
    }, UI.block(function() {
      var self = this;
      return [ "\n\n	", HTML.UL({
        "class": "list-unstyled"
      }, "\n\n\n	", UI.Each(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("currentUser"), "profile", "favorites"));
      }, UI.block(function() {
        var self = this;
        return [ "\n	", HTML.LI("\n		", Spacebars.With(function() {
          return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("."));
        }, UI.block(function() {
          var self = this;
          return [ "\n		", HTML.A({
            href: [ "/users/", function() {
              return Spacebars.mustache(self.lookup("username"));
            } ]
          }, HTML.IMG({
            src: function() {
              return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
            },
            style: "height: 1em"
          }), " ", HTML.B(function() {
            return Spacebars.mustache(self.lookup("username"));
          })), HTML.BR(), HTML.A({
            href: [ "/send/", function() {
              return Spacebars.mustache(self.lookup("_id"));
            } ],
            "class": "btn btn-primary btn-xs"
          }, HTML.I({
            "class": "fa fa-arrow-circle-o-right"
          }), " Send ", function() {
            return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
          }), " ", HTML.A({
            href: [ "/request/", function() {
              return Spacebars.mustache(self.lookup("_id"));
            } ],
            "class": "btn btn-primary btn-xs"
          }, HTML.I({
            "class": "fa fa-arrow-circle-o-left"
          }), " Request ", function() {
            return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
          }), "\n		" ];
        })), "\n	"), "\n	" ];
      })), "\n\n	"), "\n	" ];
    }), UI.block(function() {
      var self = this;
      return [ "\n	", HTML.I("No favorites yet!"), "\n" ];
    })), "\n		"), "\n		" ];
  })), "\n", HTML.STYLE("\n.leftSidebar, .rightSidebar{\nbackground: #eee;\npadding-bottom: 1em;\n}\n\n#accountForm .unstyled{\n\n	background: none;\n	border: none;\n	box-shadow: none;\n	-webkit-box-shadow: none;\n}\n\n#accountForm input.unstyled{\n	font-weight: bold;\n}\n\n.transactionsTable{\n	font-size: 0.8em;\n}\n") ];
}));

})();
