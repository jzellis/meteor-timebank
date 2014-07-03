(function(){
Template.__define__("home", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n	", HTML.DIV({
    "class": "row"
  }, "\n", HTML.DIV({
    "class": "col-md-12",
    style: "padding: 1em 1em 2em 2em !important"
  }, HTML.H3(function() {
    return Spacebars.mustache(self.lookup("getOption"), "siteSubtitle");
  })), "\n"), "\n", HTML.DIV({
    "class": "row"
  }, "\n	", HTML.DIV({
    "class": "col-md-3"
  }, "\n		", HTML.DIV({
    "class": "panel panel-default"
  }, HTML.Raw('\n			<div class="panel-heading"><h4><i class="fa fa-refresh"></i> Activity</h4></div>\n			  '), HTML.DIV({
    "class": "panel-body"
  }, "\n			    ", HTML.UL({
    "class": "small transactions list-unstyled"
  }, "\n			    	", UI.Each(function() {
    return Spacebars.dataMustache(self.lookup("recentTransactions"), 20);
  }, UI.block(function() {
    var self = this;
    return [ "\n			    	", HTML.LI({
      "class": "text-muted"
    }, "\n			    		", Spacebars.With(function() {
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
    })), " ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }, " ", function() {
      return Spacebars.mustache(self.lookup("amount"));
    }, " ", UI.If(function() {
      return Spacebars.call(self.lookup("description"));
    }, UI.block(function() {
      var self = this;
      return [ "for ", HTML.CharRef({
        html: "&quot;",
        str: '"'
      }), function() {
        return Spacebars.mustache(self.lookup("description"));
      }, HTML.CharRef({
        html: "&quot;",
        str: '"'
      }), " " ];
    })), function() {
      return Spacebars.mustache(self.lookup("relativeTime"), self.lookup("timestamp"));
    }, ".\n			    	"), "\n			    	" ];
  })), "\n			    "), "\n			  "), "\n		"), "\n	"), "\n\n", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.DIV({
      "class": "col-md-9"
    }, " \n		", HTML.DIV({
      "class": "panel panel-default"
    }, " ", HTML.Comment(" Transfer form "), "\n			", HTML.DIV({
      "class": "panel-heading"
    }, HTML.H4(HTML.I({
      "class": "fa fa-heart"
    }), " Send ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    })), "\n			", HTML.DIV({
      "class": "panel-body"
    }, "\n				", HTML.DIV({
      "class": "col-md-8"
    }, "\n					", Spacebars.include(self.lookupTemplate("transferForm")), "\n				"), "\n				", HTML.DIV({
      "class": "col-md-4 small text-muted"
    }, "\n					", HTML.P({
      "class": "lead"
    }, "Use this form to send or request ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyName");
    }, " from folks in your community!"), "\n\n					", HTML.P("If the person you want to send ", function() {
      return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
    }, " to isn't a member of the community, they'll receive an invite...and when they sign up, they'll automagically be credited with what you've sent them."), "\n				"), "\n			"), "\n	"), HTML.Comment(" /transfer form "), "\n"), "\n" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n\n	", HTML.DIV({
      "class": "col-md-9"
    }, " \n		", HTML.DIV({
      "class": "panel panel-default"
    }, " ", HTML.Comment(" Transfer form "), "\n			", HTML.DIV({
      "class": "panel-heading"
    }, HTML.H4(function() {
      return Spacebars.mustache(self.lookup("getOption"), "siteSubtitle");
    })), "\n			", HTML.DIV({
      "class": "panel-body"
    }, "\n			", function() {
      return Spacebars.makeRaw(Spacebars.mustache(self.lookup("getOption"), "description"));
    }, "\n			"), "\n	"), HTML.Comment(" /transfer form "), "\n"), "\n\n" ];
  })), "\n\n	", HTML.DIV({
    "class": "col-md-4"
  }, "\n		", HTML.DIV({
    "class": "panel panel-default"
  }, HTML.Raw('\n						<div class="panel-heading"><h4><i class="fa fa-arrow-circle-right"></i> Offers </h4></div>\n\n									'), HTML.DIV({
    "class": "panel-body"
  }, "\n										", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ HTML.A({
      "class": "btn btn-primary form-control",
      href: "/offers/post"
    }, HTML.I({
      "class": "fa fa-plus-circle"
    }), " Post An Offer"), HTML.BR(), HTML.BR() ];
  })), "\n										", HTML.UL({
    "class": "list-unstyled"
  }, "\n										", UI.Each(function() {
    return Spacebars.call(self.lookup("getOffers"));
  }, UI.block(function() {
    var self = this;
    return [ "\n										", HTML.LI({
      "class": "offer"
    }, "\n\n										", Spacebars.include(self.lookupTemplate("offerSingleSmall")), "\n\n										"), "\n", HTML.HR(), "\n										" ];
  })), "\n										"), "\n				"), "\n			"), "\n	"), "\n\n	", HTML.DIV({
    "class": "col-md-4 col-md-offset-1"
  }, "\n		", HTML.DIV({
    "class": "panel panel-default"
  }, HTML.Raw('\n									<div class="panel-heading"><h4><i class="fa fa-arrow-circle-left"></i> Wanted</h4></div>\n\n									'), HTML.DIV({
    "class": "panel-body"
  }, "\n										", UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ HTML.A({
      "class": "btn btn-primary form-control",
      href: "/wanteds/post"
    }, HTML.I({
      "class": "fa fa-plus-circle"
    }), " Post A Wanted"), HTML.BR(), HTML.BR() ];
  })), "\n", HTML.UL({
    "class": "list-unstyled"
  }, "\n										", UI.Each(function() {
    return Spacebars.call(self.lookup("getWanteds"));
  }, UI.block(function() {
    var self = this;
    return [ "\n										", HTML.LI({
      "class": "offer"
    }, "\n\n										", Spacebars.include(self.lookupTemplate("wantedSingleSmall")), "\n\n										"), "\n", HTML.HR(), "\n										" ];
  })), "\n										"), "\n				"), "\n			"), "\n	"), "\n"), "\n");
}));

})();
