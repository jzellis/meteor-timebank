(function(){
Template.__define__("transferForm", (function() {
  var self = this;
  var template = this;
  return HTML.FORM({
    role: "form",
    "class": "form-inline transferForm",
    id: "sendForm"
  }, HTML.Raw("\n<!-- <div class='col-md-4 well well-sm small' id='userOne'>\n	<div class='col-md-3'><img src='{{currentUser.profile.picture}}' class='avatar'></div>\n	<div class='col-md-9 text-muted'>\n		<div>{{currentUser.username}}</div>\n		<div>{{getOption \"currencyAbbr\"}} {{currentUser.profile.balance}}</div>\n		<div class='small'>&nbsp;</div>\n	</div>\n</div>\n\n<div class='col-md-4 text-center'>\n		<select id='toFrom' name='toFrom' class='form-control input-sm'>\n			<option value='send' {{#if send}}selected='selected'{{/if}}>Send To</option>\n			<option value='request' {{#if request}}selected='selected'{{/if}}>Request From</option>\n		</select>\n</div>\n -->\n"), HTML.FIELDSET({
    "class": "form-group col-md-12"
  }, "\n	", HTML.DIV({
    "class": "col-md-6"
  }, HTML.SELECT({
    "class": "selectpicker form-control input-sm",
    id: "senderId",
    name: "senderId"
  }, "\n		", HTML.OPTGROUP({
    label: "My Account"
  }, "\n		", HTML.OPTION({
    "data-content": [ "<img src='", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "picture"));
    }, "' style='height:1em'> ", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
    }, " <b>Balance: ", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "balance"));
    }, "</b>" ],
    value: function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "_id"));
    }
  }, function() {
    return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "username"));
  }, " Balance: ", function() {
    return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "profile", "balance"));
  }), "\n	"), "\n		", HTML.OPTGROUP({
    label: "My Groups"
  }, "\n		", UI.Each(function() {
    return Spacebars.call(self.lookup("myGroups"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.OPTION({
      "data-content": [ "<img src='", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
      }, "' style='height:1em'> ", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "name"));
      }, " <b>Balance: ", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "balance"));
      }, "</b>" ],
      value: function() {
        return Spacebars.mustache(self.lookup("_id"));
      }
    }, function() {
      return Spacebars.mustache(self.lookup("username"));
    }, " Balance: ", function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "balance"));
    }), "\n		" ];
  })), "\n	"), "\n	"), "\n"), HTML.Raw('\n<div class="col-md-6">\n 		<select id="toFrom" name="toFrom" class="selectpicker form-control input-sm">\n			<option data-content="<i class=\'fa fa-arrow-right\'></i> Send To" value="send">Send To</option>\n			<option data-content="<i class=\'fa fa-arrow-left\'></i> Request From" value="request">Request From</option>\n		</select>\n	</div>\n	')), "\n", HTML.DIV({
    "class": "col-md-12 small",
    id: "userTwo"
  }, "\n	", UI.If(function() {
    return Spacebars.call(self.lookup("recipient"));
  }, UI.block(function() {
    var self = this;
    return [ "\n	", HTML.DIV({
      "class": "col-md-4 small"
    }, "\n		", Spacebars.With(function() {
      return Spacebars.call(self.lookup("recipient"));
    }, UI.block(function() {
      var self = this;
      return [ "\n	", HTML.DIV({
        "class": "col-md-3"
      }, HTML.IMG({
        src: function() {
          return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "picture"));
        },
        "class": "avatar"
      })), "\n	", HTML.DIV({
        "class": "col-md-9"
      }, "\n		", HTML.DIV(function() {
        return Spacebars.mustache(self.lookup("username"));
      }), "\n		", HTML.DIV(function() {
        return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
      }, " ", function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup("profile"), "balance"));
      }), "\n		", HTML.DIV({
        "class": "small"
      }, HTML.CharRef({
        html: "&nbsp;",
        str: " "
      })), "\n	"), "\n	", HTML.INPUT({
        type: "hidden",
        name: "userTwoId",
        value: function() {
          return Spacebars.mustache(self.lookup("_id"));
        }
      }), "\n	" ];
    })), "\n"), "\n	" ];
  }), UI.block(function() {
    var self = this;
    return [ "\n	", HTML.FIELDSET("\n	", HTML.DIV({
      "class": "input-group"
    }, "\n		", HTML.SPAN({
      "class": "input-group-addon"
    }, "To"), "\n		", HTML.INPUT({
      name: "email",
      "class": "form-control userSearch",
      placeholder: "Search users or enter recipient email"
    }), "\n	"), "\n"), "\n	" ];
  })), "\n"), "\n", HTML.FIELDSET({
    "class": "col-md-12 form-group"
  }, "\n\n		", HTML.DIV({
    "class": "input-group"
  }, "\n		  ", HTML.SPAN({
    "class": "input-group-addon"
  }, function() {
    return Spacebars.mustache(self.lookup("getOption"), "currencyAbbr");
  }), "\n		  ", HTML.INPUT({
    type: "text",
    name: "amount",
    "class": "form-control amount",
    placeholder: "Minutes (please use multiples of 5/10 min! estimating is OK!)",
    value: UI.If(function() {
      return Spacebars.call(self.lookup("amount"));
    }, UI.block(function() {
      var self = this;
      return function() {
        return Spacebars.mustache(self.lookup("amount"));
      };
    }))
  }), "\n		"), "\n"), "\n", HTML.FIELDSET({
    "class": "col-md-12 form-group"
  }, "\n", HTML.DIV({
    "class": "col-md-12 input-group"
  }, HTML.Raw('\n  <span class="input-group-addon">For</span>\n  '), HTML.INPUT({
    type: "text",
    "class": "form-control description",
    name: "description",
    placeholder: "Optional description, e.g. hours of lawn mowing.",
    value: UI.If(function() {
      return Spacebars.call(self.lookup("description"));
    }, UI.block(function() {
      var self = this;
      return function() {
        return Spacebars.mustache(self.lookup("description"));
      };
    }))
  }), "\n"), "\n"), HTML.Raw('\n\n<div class="col-md-12 text-right">		  \n	<button type="submit" class="form-control btn btn-primary">Send</button>\n</div>\n'));
}));

})();
