(function(){
Template.__define__("wantedSingle", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "wanted wanted-md"
  }, "\n			", HTML.DIV({
    "class": "row"
  }, "\n							", HTML.DIV({
    "class": "col-md-2"
  }, Spacebars.With(function() {
    return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
  }, UI.block(function() {
    var self = this;
    return HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(self.lookup("username"));
      } ]
    }, HTML.IMG({
      src: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
      },
      "class": "avatar"
    }));
  }))), "\n			", HTML.DIV({
    "class": "col-md-10"
  }, "\n								", HTML.DIV({
    "class": "title"
  }, HTML.A({
    href: [ "/wanted/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("title"));
  })), "\n				", HTML.DIV({
    "class": "small"
  }, "Posted by ", Spacebars.With(function() {
    return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
  }, UI.block(function() {
    var self = this;
    return HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(self.lookup("username"));
      } ]
    }, function() {
      return Spacebars.mustache(self.lookup("username"));
    });
  }))), "\n				", HTML.DIV({
    "class": "small text-muted"
  }, UI.If(function() {
    return Spacebars.call(self.lookup("location"));
  }, UI.block(function() {
    var self = this;
    return [ HTML.A({
      "class": "text-muted",
      href: [ "http://maps.google.com?q=", function() {
        return Spacebars.mustache(self.lookup("location"));
      } ],
      target: "_new"
    }, HTML.I({
      "class": "fa fa-map-marker"
    }), " ", function() {
      return Spacebars.mustache(self.lookup("location"));
    }), " - " ];
  })), function() {
    return Spacebars.mustache(self.lookup("formatDate"), self.lookup("timestamp"));
  }), "\n				", HTML.DIV({
    "class": "col-md-12"
  }, function() {
    return Spacebars.makeRaw(Spacebars.mustache(self.lookup("trimWords"), self.lookup("body"), 200, "..."));
  }), "\n								", HTML.DIV({
    "class": "text-right small"
  }, HTML.A({
    href: [ "/wanted/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("numReplies"));
  }, " replies")), "\n\n\n			"), "\n		"), "\n	");
}));

Template.__define__("wantedSingleSmall", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "wanted wanted-sm"
  }, "\n			", HTML.DIV({
    "class": "row"
  }, "\n							", HTML.DIV({
    "class": "col-md-2"
  }, Spacebars.With(function() {
    return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
  }, UI.block(function() {
    var self = this;
    return HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(self.lookup("username"));
      } ]
    }, HTML.IMG({
      src: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
      },
      "class": "avatar"
    }));
  }))), "\n			", HTML.DIV({
    "class": "col-md-10"
  }, "\n								", HTML.DIV({
    "class": "title"
  }, HTML.A({
    href: [ "/wanted/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("title"));
  })), "\n				", HTML.DIV({
    "class": "small"
  }, "Posted by ", Spacebars.With(function() {
    return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
  }, UI.block(function() {
    var self = this;
    return HTML.A({
      href: [ "/users/", function() {
        return Spacebars.mustache(self.lookup("username"));
      } ]
    }, function() {
      return Spacebars.mustache(self.lookup("username"));
    });
  }))), "\n				", HTML.DIV({
    "class": "small text-muted"
  }, UI.If(function() {
    return Spacebars.call(self.lookup("location"));
  }, UI.block(function() {
    var self = this;
    return [ HTML.A({
      "class": "text-muted",
      href: [ "http://maps.google.com?q=", function() {
        return Spacebars.mustache(self.lookup("location"));
      } ],
      target: "_new"
    }, HTML.I({
      "class": "fa fa-map-marker"
    }), " ", function() {
      return Spacebars.mustache(self.lookup("location"));
    }), " - " ];
  })), function() {
    return Spacebars.mustache(self.lookup("formatDate"), self.lookup("timestamp"));
  }), "\n				", HTML.DIV({
    "class": "col-md-12 small"
  }, function() {
    return Spacebars.makeRaw(Spacebars.mustache(self.lookup("trimWords"), self.lookup("body"), 32, "..."));
  }), "\n								", HTML.DIV({
    "class": "text-right small"
  }, HTML.A({
    href: [ "/wanted/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("numReplies"));
  }, " replies")), "\n\n\n			"), "\n		"), "\n	");
}));

})();
