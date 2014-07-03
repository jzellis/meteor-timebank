(function(){
Template.__define__("offerFull", (function() {
  var self = this;
  var template = this;
  return Spacebars.With(function() {
    return Spacebars.call(self.lookup("offer"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	  ", HTML.DIV({
      "class": "container offer offer-single"
    }, "\n	    ", HTML.DIV({
      "class": "col-md-8 col-md-offset-2"
    }, "\n		      ", HTML.DIV({
      "class": "panel panel-default"
    }, "\n		        ", HTML.DIV({
      "class": "panel-body"
    }, "\n		        	", HTML.DIV({
      "class": "row"
    }, "\n		        		", HTML.DIV({
      "class": "col-md-2"
    }, "\n		        			", Spacebars.With(function() {
      return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		        			", HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      })), "\n		        			" ];
    })), "\n		        		"), HTML.Comment(" /avatar "), "\n\n		        		", HTML.DIV({
      "class": "col-md-10"
    }, "\n		        			", HTML.DIV({
      "class": "title"
    }, function() {
      return Spacebars.mustache(self.lookup("title"));
    }), "\n		        			", HTML.DIV({
      "class": "text-muted"
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
    }))), "\n							", HTML.DIV({
      "class": "text-muted"
    }, " ", UI.If(function() {
      return Spacebars.call(self.lookup("location"));
    }, UI.block(function() {
      var self = this;
      return [ HTML.A({
        href: [ "http://maps.google.com?q=", function() {
          return Spacebars.mustache(self.lookup("location"));
        } ],
        target: "_new"
      }, HTML.I({
        "class": "fa fa-map-marker"
      }), " ", function() {
        return Spacebars.mustache(self.lookup("location"));
      }), " " ];
    })), "on ", HTML.A({
      href: ""
    }, function() {
      return Spacebars.mustache(self.lookup("formatDate"), self.lookup("timestamp"));
    }, " ", HTML.I({
      "class": "fa fa-link"
    }))), "\n							", HTML.DIV("\n                ", HTML.I({
      "class": "fa fa-tags",
      title: "Tags"
    }, "\n                "), "\n                ", UI.Each(function() {
      return Spacebars.call(self.lookup("tags"));
    }, UI.block(function() {
      var self = this;
      return [ "\n                ", HTML.A({
        href: [ "/tags/", function() {
          return Spacebars.mustache(self.lookup("."));
        } ],
        "class": "label label-default"
      }, "\n                  ", function() {
        return Spacebars.mustache(self.lookup("."));
      }, "\n                "), HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), "\n                " ];
    })), "\n              "), "\n							", HTML.HR(), "\n							", HTML.DIV({
      "class": "body"
    }, function() {
      return Spacebars.makeRaw(Spacebars.mustache(self.lookup("nl2br"), self.lookup("body")));
    }), "\n		        		"), "\n\n		        	"), "\n		        "), "\n		    "), HTML.Comment(" /panel "), "\n		    			", HTML.DIV({
      "class": "panel panel-default"
    }, "\n				", HTML.DIV({
      "class": "panel-body"
    }, "\n		", HTML.H3(HTML.A({
      name: "replies"
    }), function() {
      return Spacebars.mustache(self.lookup("numReplies"));
    }, " Replies"), "\n\n		", UI.Each(function() {
      return Spacebars.call(self.lookup("replies"));
    }, UI.block(function() {
      var self = this;
      return [ "\n		", HTML.HR(), "\n			", HTML.DIV({
        "class": "reply"
      }, "\n					", HTML.DIV({
        "class": "row"
      }, "\n		        		", HTML.DIV({
        "class": "col-md-1 col-md-offset-1"
      }, "\n		        			", Spacebars.With(function() {
        return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
      }, UI.block(function() {
        var self = this;
        return [ "\n		        			", HTML.A({
          href: [ "/users/", function() {
            return Spacebars.mustache(self.lookup("username"));
          } ]
        }, HTML.IMG({
          src: function() {
            return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
          },
          "class": "avatar"
        })), "\n		        			" ];
      })), "\n		        		"), HTML.Comment(" /avatar "), "\n			        		", HTML.DIV({
        "class": "col-md-10"
      }, "\n							", Spacebars.With(function() {
        return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("userId"));
      }, UI.block(function() {
        var self = this;
        return [ "\n		        			", HTML.B(HTML.A({
          href: [ "/users/", function() {
            return Spacebars.mustache(self.lookup("username"));
          } ]
        }, function() {
          return Spacebars.mustache(self.lookup("username"));
        })), "\n		        			" ];
      })), " ", function() {
        return Spacebars.makeRaw(Spacebars.mustache(self.lookup("nl2br"), self.lookup("body")));
      }, "\n							"), "\n							", HTML.DIV({
        "class": "col-md-12 text-right small text-muted"
      }, function() {
        return Spacebars.mustache(self.lookup("relativeTime"), self.lookup("timestamp"));
      }), "\n					"), "\n\n"), "\n		" ];
    })), "\n\n", HTML.Comment(" Reply form "), "\n\n			", HTML.DIV({
      "class": "",
      style: "margin-top: 2em"
    }, "\n				", HTML.FORM({
      role: "form",
      id: "replyForm",
      name: "replyForm"
    }, "\n	            ", HTML.H3("\n	              Leave A Reply\n	            "), "\n	            ", HTML.DIV({
      "class": "row"
    }, "\n	              ", HTML.DIV({
      "class": "col-md-1 text-center"
    }, "\n	                ", Spacebars.With(function() {
      return Spacebars.call(self.lookup("currentUser"));
    }, UI.block(function() {
      var self = this;
      return [ "\n	                ", HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      }), "\n	                ", HTML.BR(), "\n	                ", function() {
        return Spacebars.mustache(self.lookup("username"));
      }, "\n	                " ];
    })), "\n	              "), "\n	              ", HTML.DIV({
      "class": "col-md-11"
    }, "\n	                ", HTML.TEXTAREA({
      "class": "form-control",
      name: "body",
      rows: "4"
    }, "	                "), "\n	              "), "\n	            "), "\n	            ", HTML.BR(), "\n	            ", HTML.DIV({
      "class": "text-right"
    }, "\n	              ", HTML.BUTTON({
      type: "submit",
      "class": "btn btn-primary"
    }, "\n	                Post Reply\n	              "), "\n	            "), "\n	            \n	          "), "\n			"), "\n		"), "\n"), "\n\n		"), "\n	"), "\n	" ];
  }));
}));

})();
