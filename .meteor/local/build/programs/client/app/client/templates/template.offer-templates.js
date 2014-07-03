(function(){
Template.__define__("offerSingle", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "offer"
  }, "\n			", HTML.DIV({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "col-md-2 text-center"
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
  }, "\n				", HTML.DIV(HTML.A({
    href: [ "/offers/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("title"));
  })), "\n				", HTML.DIV({
    "class": "small"
  }, Spacebars.With(function() {
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
  }))), "\n\n				", HTML.DIV({
    "class": "small text-muted"
  }, " ", UI.If(function() {
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
    return Spacebars.makeRaw(Spacebars.mustache(self.lookup("nl2br"), self.lookup("body")));
  }), "\n				", HTML.DIV({
    "class": "col-md-12"
  }, HTML.Raw('<i class="fa fa-tags" title="Tags"></i> '), UI.Each(function() {
    return Spacebars.call(self.lookup("tags"));
  }, UI.block(function() {
    var self = this;
    return [ HTML.A({
      href: [ "/tags/", function() {
        return Spacebars.mustache(self.lookup("."));
      } ],
      "class": "label label-default"
    }, function() {
      return Spacebars.mustache(self.lookup("."));
    }), " " ];
  }))), "\n								", HTML.DIV({
    "class": "text-right small"
  }, HTML.A({
    href: [ "/offer/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("numReplies"));
  }, " replies")), "\n\n			"), "\n		"), "\n	");
}));

Template.__define__("offerSingleSmall", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "offer"
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
    href: [ "/offers/", function() {
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
    href: [ "/offer/", function() {
      return Spacebars.mustache(self.lookup("_id"));
    } ]
  }, function() {
    return Spacebars.mustache(self.lookup("numReplies"));
  }, " replies")), "\n\n\n			"), "\n		"), "\n	");
}));

})();
