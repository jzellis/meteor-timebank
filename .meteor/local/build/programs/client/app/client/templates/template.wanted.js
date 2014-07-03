(function(){
Template.__define__("wanted", (function() {
  var self = this;
  var template = this;
  return [ HTML.DIV({
    "class": "container"
  }, "\n  ", HTML.DIV({
    "class": "wanted-list col-md-8 col-md-offset-2 panel panel-default"
  }, "\n    ", HTML.DIV({
    "class": "panel-body"
  }, HTML.Raw('\n  <div class="row">\n      <h1 class="col-md-6"><i class="fa fa-chevron-circle-left"></i> Wanted</h1><div class="col-md-6 text-right"><span class="addWanted btn btn-sm btn-success" data-toggle="modal" data-target="#wantedModal"><i class="fa fa-plus-circle"></i> Post A Wanted</span></div> \n  </div>\n  <hr>\n	'), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.UL({
    "class": "list-unstyled"
  }, "\n		", UI.Each(function() {
    return Spacebars.call(self.lookup("getWanteds"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.LI("\n\n			", Spacebars.include(self.lookupTemplate("wantedSingle")), "\n\n"), "\n", HTML.HR(), "\n		" ];
  })), "\n	"), "\n	"), "\n"), "\n"), "\n	"), "\n\n	", HTML.DIV({
    "class": "modal fade",
    id: "wantedModal"
  }, "\n  ", HTML.DIV({
    "class": "modal-dialog"
  }, "\n    ", HTML.DIV({
    "class": "modal-content"
  }, "\n    	        ", HTML.FORM({
    role: "form",
    id: "wantedForm"
  }, HTML.Raw('\n\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title">Post A Wanted Ad</h4>\n      </div>\n      '), HTML.DIV({
    "class": "modal-body"
  }, "\n        	\n 		", Spacebars.include(self.lookupTemplate("wantedForm")), "\n\n      "), HTML.Raw('\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n        <button type="submit" class="btn btn-primary">Post Wanted</button>\n      </div>\n              ')), "\n    "), HTML.Raw("<!-- /.modal-content -->\n  ")), HTML.Raw("<!-- /.modal-dialog -->\n")), HTML.Raw("<!-- /.modal -->") ];
}));

})();
