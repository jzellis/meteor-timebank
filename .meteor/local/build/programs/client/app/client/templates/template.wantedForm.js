(function(){
Template.__define__("wantedForm", (function() {
  var self = this;
  var template = this;
  return [ HTML.Raw('<fieldset class="form-group">\n        		<label for="title">Title</label>\n        		<input class="form-control" name="title" placeholder="Title of your wanted ad">\n        	</fieldset>\n        	'), HTML.FIELDSET({
    "class": "form-group"
  }, "\n        		", HTML.TEXTAREA({
    "class": "form-control",
    name: "body",
    rows: "8",
    placeholder: "Tell us what you're looking for"
  }), "\n        	"), HTML.Raw('\n        	<fieldset class="form-group">\n        		<label for="location">Location (optional)</label>\n        		<input class="form-control" name="location" placeholder="Be as specific as your address or as general as your city or neighborhood.">\n        	</fieldset>\n        	     <fieldset class="form-group">\n        		<label for="tags">Tags (optional)</label>\n        		<input class="form-control" name="tags" placeholder="Add tags for your specific needs.">\n        	</fieldset>') ];
}));

})();
