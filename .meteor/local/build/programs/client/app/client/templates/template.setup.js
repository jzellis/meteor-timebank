(function(){
Template.__define__("setup", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "container"
  }, HTML.Raw('\n	<h2>Welcome to Timebank!</h2>\n	<p class="lead">Welcome to your new community! Let\'s get started by setting things up.</p>\n\n'), UI.Unless(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.DIV({
      "class": "well",
      id: "step1"
    }, "\n	", HTML.FORM({
      role: "form",
      id: "adminAccountForm"
    }, "\n\n			", HTML.H3("Step 1: Your Admin Account"), "\n\n			", HTML.SPAN({
      "class": "help-block"
    }, "\n				This is your admin account. Unless you explicitly allow other users admin privilege, you will have sole control of your community. We recommend you create a personal account for yourself as well as an admin account, if you're planning on transacting within the community yourself.\n			"), "\n		", Spacebars.include(self.lookupTemplate("accountForm")), "\n		", HTML.FIELDSET("\n			", HTML.BUTTON({
      "class": "btn",
      type: "submit"
    }, "Create Account"), "\n		"), "\n	"), "\n	"), "\n" ];
  })), "\n", HTML.FORM({
    role: "form",
    id: "communityForm"
  }, "\n		", HTML.DIV({
    "class": "well",
    id: "step2"
  }, HTML.Raw('\n			<h3>Step 2: Community Info</h3>\n		<fieldset class="form-group">\n			<label for="siteName">Community Name</label>\n				<input class="form-control input-lg" id="siteName">\n							<span class="help-block">\n				This is the public name of your community\n			</span>\n		</fieldset>\n\n		<fieldset class="form-group">\n			<label for="siteImage">Icon/Avatar</label>\n				<input type="file" class="form-control input-lg" id="siteImage">\n							<span class="help-block">\n				This is your community\'s icon or avatar.\n			</span>\n		</fieldset>\n\n		'), HTML.FIELDSET({
    "class": "form-group"
  }, HTML.Raw('\n			<label for="siteDescription">Community Description</label>\n				'), HTML.TEXTAREA({
    "class": "form-control",
    id: "siteDescription",
    rows: "8"
  }), HTML.Raw('\n							<span class="help-block">\n				Describe your community – what it is, what it\'s for.\n			</span>\n		')), HTML.Raw('\n				<fieldset class="form-group">\n			<label for="location">Community Location (optional)</label>\n				<input class="form-control" id="location">\n							<span class="help-block">\n				Optional, but useful if your community is based on geography.\n			</span>\n		</fieldset>\n	')), "\n\n		", HTML.DIV({
    "class": "well",
    id: "step3"
  }, HTML.Raw('\n			<h3>Currency Info</h3>\n		<fieldset class="form-group">\n			<label for="currencyName">Currency Name</label>\n				<input class="form-control" id="currencyName">\n							<span class="help-block">\n				e.g. AustinBucks, DogeCoin, etc.\n			</span>\n		</fieldset>\n		'), HTML.FIELDSET({
    "class": "form-group"
  }, HTML.Raw('\n			<label for="currencyDescription">Currency Description</label>\n				'), HTML.TEXTAREA({
    "class": "form-control",
    id: "currencyDescription",
    rows: "8"
  }), HTML.Raw('\n							<span class="help-block">\n				What is your currency based on? How is it shared?\n			</span>\n		')), HTML.Raw('\n		<fieldset class="form-group">\n			<label for="currencyAbbr">Currency Abbrev</label>\n			<div class="row">\n				<div class="col-md-2">\n				<input class="form-control" id="currencyAbbr">\n							<span class="help-block">\n				e.g. auBck, USh, $\n			</span>\n			</div>\n		</div>\n		</fieldset>\n	')), HTML.Raw('\n\n	<div class="well" id="step4">\n			<h3>Community Options</h3>\n		<fieldset class="form-group">\n			<label for="defaultBalance">New User Default Balance</label>\n				<input class="form-control" id="defaultBalance" value="0.00">\n							<span class="help-block">\n				Should new users start with an existing amount of your currency?\n			</span>\n		</fieldset>\n		<fieldset class="form-group">\n			<div class="checkbox">\n			<label for="negativeBalance">\n				<input type="checkbox" id="negativeBalance" value="true">\n				Can Users Have A Negative Balance?\n			</label>\n		</div>\n		</fieldset>\n				<fieldset class="form-group">\n			<label for="maxNegativeBalance">Maximum Negative Balance</label>\n				<input class="form-control" id="maxNegativeBalance" value="-100.00" disabled="">\n							<span class="help-block">\n				This is the maximum amount of negative balance a user can have. If they reach this threshold, they cannot give currency to any other user until their balance gets less negative.\n			</span>\n		</fieldset>\n				<fieldset class="form-group">\n			<label for="whoCanJoin">Who can join the community?</label>\n			<select class="form-control" id="whoCanJoin">\n				<option value="anyone">Anyone</option>\n				<option value="invite">Anyone with an invite code</option>\n			</select>\n						<span class="help-block">\n				Invite codes can be tied to a particular person, or you can generate random ones that you can hand out/print out/make up on the fly.\n			</span>\n		</fieldset>\n	</div>\n	<div class="well" id="step5">\n		<h3>Config Stuff</h3>\n		<fieldset class="form-group">\n			<h4>Facebook</h4>\n			<p class="help-block">Enter your site\'s Facebook client id/secret here.</p>\n			<label for="fbClientId">Client ID</label>\n				<input class="form-control" id="fbClientId">\n			<label for="fbSecret">Secret</label>\n								<input class="form-control" id="fbSecret">\n\n		</fieldset>\n		<fieldset class="form-group">\n			<h4>Twitter</h4>\n			<p class="help-block">Enter your site\'s Twitter client id/secret here.</p>\n			<label for="twClientId">Client ID</label>\n				<input class="form-control" id="twClientId">\n			<label for="twSecret">Secret</label>\n								<input class="form-control" id="twSecret">\n\n		</fieldset>\n	</div>\n	<div class="row">\n<div class="col-md-12" style="text-align:center">\n\n	<button type="submit" class="btn btn-lg btn-success">Let\'s Go!</button>\n</div>\n</div>\n	')), "\n");
}));

})();
