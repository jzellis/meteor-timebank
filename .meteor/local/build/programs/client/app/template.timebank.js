(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return "";
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

})();
