(function(){
Template.__define__("loginPanel", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<form role="form" id="loginPanel">\n	<div class="text-center"> \n		<button type="button" class="fbLogin btn btn-primary btn-sm"><i class="fa fa-facebook-square"></i> Facebook Login</button></div>\n				<fieldset class="form-group">\n					<input class="username form-control" placeholder="Username or email">\n			<input class="password form-control" name="password" type="password" placeholder="Password">\n			</fieldset>\n				<div class="text-center">\n					<button type="submit" class="login btn btn-success btn-sm">Login</button>\n					<span class="pull-right small"><a href="/signup">Create Account</a></span>\n			</div>\n		</form>');
}));

})();
