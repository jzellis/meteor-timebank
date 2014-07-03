(function(){
Template.__define__("user", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", UI.If(function() {
    return Spacebars.call(self.lookup("user"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.DIV({
      "class": "col-md-4"
    }, "\n			", HTML.H2("Wanteds"), "\n			", HTML.UL({
      "class": "list-unstyled small"
    }, "\n		", UI.Each(function() {
      return Spacebars.dataMustache(self.lookup("getUserWanteds"), Spacebars.dot(self.lookup("user"), "_id"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.LI({
        "class": "well well-sm"
      }, "\n			", Spacebars.include(self.lookupTemplate("wantedSingleSmall")), " "), "\n		" ];
    })), "\n	"), "\n\n			", HTML.H2("Offers"), "\n			", HTML.UL({
      "class": "list-unstyled small"
    }, "\n		", UI.Each(function() {
      return Spacebars.dataMustache(self.lookup("getUserOffers"), Spacebars.dot(self.lookup("user"), "_id"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.LI({
        "class": "well well-sm"
      }, "\n			", Spacebars.include(self.lookupTemplate("offerSingleSmall")), "\n			"), "\n		" ];
    })), "\n	"), "\n\n		"), "\n", HTML.DIV({
      "class": "col-md-8"
    }, "\n	", HTML.DIV({
      "class": "well text-center"
    }, "\n\n", UI.If(function() {
      return Spacebars.dataMustache(self.lookup("isCurrentUser"), Spacebars.dot(self.lookup("user"), "_id"));
    }, UI.block(function() {
      var self = this;
      return [ "\n", Spacebars.include(self.lookupTemplate("loggedInUserProfile")), "\n" ];
    }), UI.block(function() {
      var self = this;
      return [ "\n", Spacebars.include(self.lookupTemplate("userProfile")), "\n" ];
    })), "\n	"), "\n	", HTML.DIV({
      "class": "row"
    }, "\n		", HTML.H3("Transactions"), "\n			", UI.If(function() {
      return Spacebars.dataMustache(self.lookup("getUserTransactions"), Spacebars.dot(self.lookup("user"), "_id"));
    }, UI.block(function() {
      var self = this;
      return [ "\n	", HTML.TABLE({
        "class": "table table-striped"
      }, "\n		", HTML.THEAD(HTML.TR(HTML.TD("Sender"), HTML.TD("Recipient"), HTML.TD("Amount (", function() {
        return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
      }, ")"), HTML.TD("Description"), HTML.TD("Date"))), "\n		", HTML.TBODY("\n	", UI.Each(function() {
        return Spacebars.dataMustache(self.lookup("getUserTransactions"), Spacebars.dot(self.lookup("user"), "_id"));
      }, UI.block(function() {
        var self = this;
        return [ "\n	", HTML.TR({
          "class": function() {
            return Spacebars.mustache(self.lookup("transactionType"));
          }
        }, "\n	", HTML.TD(Spacebars.With(function() {
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
        })), "\n	" ];
      })), "\n"), "\n	"), "\n" ];
    }), UI.block(function() {
      var self = this;
      return [ "\n", HTML.I("No transactions yet!"), "\n" ];
    })), "\n	"), "\n"), "\n" ];
  })), "\n");
}));

})();
