(function(){
Template.__define__("errorModal", (function() {
  var self = this;
  var template = this;
  return [ HTML.DIV({
    "class": "modal fade",
    id: "error"
  }, "\n  ", HTML.DIV({
    "class": "modal-dialog"
  }, "\n    ", HTML.DIV({
    "class": "modal-content"
  }, "\n      ", HTML.DIV({
    "class": "modal-header"
  }, HTML.Raw('\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        '), HTML.H4({
    "class": "modal-title"
  }, function() {
    return Spacebars.mustache(self.lookup("title"));
  }), "\n      "), "\n      ", HTML.DIV({
    "class": "modal-body"
  }, "\n        ", function() {
    return Spacebars.mustache(self.lookup("body"));
  }, "\n      "), HTML.Raw('\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>\n      </div>\n    ')), HTML.Raw("<!-- /.modal-content -->\n  ")), HTML.Raw("<!-- /.modal-dialog -->\n")), HTML.Raw("<!-- /.modal -->") ];
}));

})();
