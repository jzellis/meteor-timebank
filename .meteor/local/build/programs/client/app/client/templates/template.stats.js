(function(){
Template.__define__("stats", (function() {
  var self = this;
  var template = this;
  return [ HTML.STYLE("/*\n\n	#usageChart{\n		background: #66F;\n	}\n	#usageChart rect{\n		fill: #33F;\n	}\n\n		#usageChart text{\n		fill: white;\n		text-anchor: end;\n	}*/\n	"), "\n	", HTML.DIV({
    "class": "container stats"
  }, HTML.Raw("\n<!-- 		<div class='col-md-12'>\n			<div class='panel panel-default'>\n			<h2 class='panel-heading'>Usage</h2>\n			<div class='panel-body'>\n			<div id='chartWrapper'>\n			</div>\n			</div>\n		</div>\n		</div> -->\n		"), HTML.DIV({
    "class": "col-md-12"
  }, "\n			", HTML.DIV({
    "class": "panel panel-default"
  }, HTML.Raw('\n			<h2 class="panel-heading">Leaderboard</h2>\n			'), HTML.DIV({
    "class": "panel-body"
  }, "\n				", HTML.DIV({
    "class": "col-md-4"
  }, HTML.Raw("\n					<h3>Most Sent</h3>\n					"), HTML.TABLE({
    "class": "table table-striped"
  }, "\n						", HTML.THEAD("\n							", HTML.TR(HTML.Raw('<th>#</th><th colspan="2">User</th>'), HTML.TH("Amount (", function() {
    return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
  }, ")")), "\n						"), "\n						", HTML.TBODY("\n						", UI.Each(function() {
    return Spacebars.call(Spacebars.dot(self.lookup("rankings"), "sent"));
  }, UI.block(function() {
    var self = this;
    return [ "\n							\n							", HTML.TR("\n								", HTML.TD({
      "class": "col-md-1"
    }, function() {
      return Spacebars.mustache(self.lookup("num"));
    }), "\n								", Spacebars.With(function() {
      return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("id"));
    }, UI.block(function() {
      var self = this;
      return [ "\n									", HTML.TD({
        "class": "col-md-1"
      }, HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      }))), "\n									", HTML.TD(HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, function() {
        return Spacebars.mustache(self.lookup("username"));
      })) ];
    })), "\n									", HTML.TD(function() {
      return Spacebars.mustache(self.lookup("amount"));
    }), "\n								"), "\n							\n						" ];
  })), "\n					"), "\n					"), "\n				"), "\n				", HTML.DIV({
    "class": "col-md-4"
  }, HTML.Raw("\n					<h3>Most Received</h3>\n					"), HTML.TABLE({
    "class": "table table-striped"
  }, "\n						", HTML.THEAD("\n							", HTML.TR(HTML.Raw('<th>#</th><th colspan="2">User</th>'), HTML.TH("Amount (", function() {
    return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
  }, ")")), "\n\n						"), "\n						", HTML.TBODY("\n						", UI.Each(function() {
    return Spacebars.call(Spacebars.dot(self.lookup("rankings"), "received"));
  }, UI.block(function() {
    var self = this;
    return [ "\n							\n							", HTML.TR(HTML.TD({
      "class": "col-md-1"
    }, function() {
      return Spacebars.mustache(self.lookup("num"));
    }), Spacebars.With(function() {
      return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("id"));
    }, UI.block(function() {
      var self = this;
      return [ HTML.TD({
        "class": "col-md-1"
      }, HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      }))), HTML.TD(HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, function() {
        return Spacebars.mustache(self.lookup("username"));
      })) ];
    })), HTML.TD(function() {
      return Spacebars.mustache(self.lookup("amount"));
    })), "\n							\n						" ];
  })), "\n					"), "\n					"), "\n				"), "\n				", HTML.DIV({
    "class": "col-md-4"
  }, HTML.Raw("\n					<h3>Total Transactions</h3>\n					"), HTML.TABLE({
    "class": "table table-striped"
  }, HTML.Raw('\n						<thead>\n							<tr><th>#</th><th colspan="2">User</th><th># Transactions</th></tr>\n\n						</thead>\n						'), HTML.TBODY("\n						", UI.Each(function() {
    return Spacebars.call(Spacebars.dot(self.lookup("rankings"), "total"));
  }, UI.block(function() {
    var self = this;
    return [ "\n							\n							", HTML.TR(HTML.TD({
      "class": "col-md-1"
    }, function() {
      return Spacebars.mustache(self.lookup("num"));
    }), Spacebars.With(function() {
      return Spacebars.dataMustache(self.lookup("getUserById"), self.lookup("id"));
    }, UI.block(function() {
      var self = this;
      return [ HTML.TD({
        "class": "col-md-1"
      }, HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      }))), HTML.TD(HTML.A({
        href: [ "/users/", function() {
          return Spacebars.mustache(self.lookup("username"));
        } ]
      }, function() {
        return Spacebars.mustache(self.lookup("username"));
      })) ];
    })), HTML.TD(function() {
      return Spacebars.mustache(self.lookup("amount"));
    })), "\n							\n						" ];
  })), "\n					"), "\n					"), "\n				"), "\n			"), "\n		"), "\n		"), "\n	") ];
}));

})();
