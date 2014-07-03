(function(){
Template.__define__("loginModal", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<form role="form" id="loginForm">\n<div class="modal fade" id="loginModal">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title">Login</h4>\n      </div>\n      <div class="modal-body">\n\n      <fieldset>\n      	<label for="username">Username</label>\n<input class="form-control username" name="username" placeholder="username">\n      </fieldset>\n      <fieldset>\n      	<label for="password">Password</label>\n<input class="form-control password" type="password" name="password" placeholder="password">\n	</fieldset>\n\n      </div>\n      <div class="modal-footer">\n      	        <a class="small" href="/signup">Signup</a>\n\n<span id="loginFacebook" class="fbLogin btn btn-primary btn-sm"><i class="fa fa-facebook"></i> Login With Facebook</span>\n        <button type="submit" class="btn btn-success btn-sm">Login</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n</form>');
}));

})();
