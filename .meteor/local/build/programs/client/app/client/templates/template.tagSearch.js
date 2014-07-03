(function(){
Template.__define__("tagSearch", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, "\n		", HTML.H1('Search - "', function() {
    return Spacebars.mustache(self.lookup("tag"));
  }, '"'), "\n", HTML.DIV({
    "class": "row"
  }, HTML.Raw("\n	<h2>Users</h2>\n	"), UI.If(function() {
    return Spacebars.call(self.lookup("users"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.UL({
      "class": "list-unstyled col-md-6"
    }, "\n		", UI.Each(function() {
      return Spacebars.call(self.lookup("users"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.LI({
        "class": "well well-sm"
      }, "\n", HTML.DIV({
        "class": "row"
      }, "\n	", HTML.DIV({
        "class": "col-md-1"
      }, "\n	", HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        }
      }), "\n	"), "\n	", HTML.DIV({
        "class": "col-md-11"
      }, "\n	", HTML.DIV({
        "class": "row"
      }, "\n		", HTML.DIV({
        "class": "col-md-12"
      }, "\n		", HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ],
        "class": "h4"
      }, " ", function() {
        return Spacebars.mustache(self.lookup("username"));
      }), "\n		"), "\n	"), "\n	", HTML.DIV({
        "class": "row"
      }, "\n		", HTML.DIV({
        "class": "col-md-12 small"
      }, "\n		Tags: ", UI.Each(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("profile"), "tags"));
      }, UI.block(function() {
        var self = this;
        return [ HTML.A({
          "class": "label label-default",
          href: [ "/tags/", function() {
            return Spacebars.mustache(self.lookup("."));
          } ]
        }, function() {
          return Spacebars.mustache(self.lookup("."));
        }), " " ];
      })), "\n		"), "\n	"), "\n"), "\n"), "\n			"), "\n		" ];
    })), "\n	"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n	", HTML.I('No users with tag "', function() {
      return Spacebars.mustache(self.lookup("tag"));
    }, '" found.'), "\n	" ];
  })), "\n"), "\n", HTML.DIV({
    "class": "row"
  }, HTML.Raw("\n	<h2>Wanteds</h2>\n	"), UI.If(function() {
    return Spacebars.call(self.lookup("wanteds"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.UL({
      "class": "list-unstyled col-md-6"
    }, "\n		", UI.Each(function() {
      return Spacebars.call(self.lookup("wanteds"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.LI({
        "class": "well well-sm"
      }, "\n			", Spacebars.include(self.lookupTemplate("wantedSingleSmall")), "\n		"), "\n		" ];
    })), "\n	"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n		", HTML.I('No wanteds with tag "', function() {
      return Spacebars.mustache(self.lookup("tag"));
    }, '" found.'), "\n\n	" ];
  })), "\n"), "\n\n", HTML.DIV({
    "class": "row"
  }, HTML.Raw("\n	<h2>Offers</h2>\n	"), UI.If(function() {
    return Spacebars.call(self.lookup("offers"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.UL({
      "class": "list-unstyled col-md-6"
    }, "\n		", UI.Each(function() {
      return Spacebars.call(self.lookup("offers"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.LI({
        "class": "well well-sm"
      }, "\n			", Spacebars.include(self.lookupTemplate("offerSingleSmall")), "\n		"), "\n		" ];
    })), "\n	"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n		", HTML.I('No offers with tag "', function() {
      return Spacebars.mustache(self.lookup("tag"));
    }, '" found.'), "\n\n	" ];
  })), "\n"), "\n");
}));

})();
