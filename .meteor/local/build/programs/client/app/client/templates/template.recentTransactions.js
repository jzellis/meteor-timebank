(function(){
Template.__define__("recentTransactions", (function() {
  var self = this;
  var template = this;
  return HTML.UL({
    "class": "list-unstyled"
  }, "\n	", UI.Each(function() {
    return Spacebars.dataMustache(self.lookup("recentTransactions"), 10);
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.LI({
      "class": "well"
    }, "\n", HTML.DIV("\n		", Spacebars.With(function() {
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
    })), " sent ", Spacebars.With(function() {
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
    })), " ", HTML.B(function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }, " ", function() {
      return Spacebars.mustache(self.lookup("amount"));
    }), "\n	"), "\n	", UI.If(function() {
      return Spacebars.call(self.lookup("description"));
    }, UI.block(function() {
      var self = this;
      return HTML.DIV({
        style: "font-style:italic"
      }, HTML.CharRef({
        html: "&quot;",
        str: '"'
      }), function() {
        return Spacebars.mustache(self.lookup("description"));
      }, HTML.CharRef({
        html: "&quot;",
        str: '"'
      }));
    })), "\n	", HTML.DIV({
      style: "text-align:right; font-size: 0.8em"
    }, "\n		", function() {
      return Spacebars.mustache(self.lookup("timeago"), self.lookup("timestamp"));
    }, "\n	"), "\n	"), "\n	" ];
  })), "\n");
}));

})();
