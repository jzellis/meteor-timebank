(function(){Template.__define__("offers",Package.handlebars.Handlebars.json_ast_to_func(["<div class='container'>\n  <div class='offer-list col-md-8 col-md-offset-2 panel panel-default'>\n    <div class='panel-body'>\n  <div class='row'>\n      <h1 class='col-md-6'><i class=\"fa fa-chevron-circle-right\"></i> Offers</h1><div class='col-md-6 text-right'><span class='addOffer btn btn-sm btn-success' data-toggle=\"modal\" data-target=\"#offerModal\"><i class='fa fa-plus-circle'></i> Post An Offer</span></div> \n  </div>\n  <hr>\n  <div class='row'>\n    <ul class='list-unstyled'>\n    ",["#",[[0,"each"],[0,"getOffers"]],["\n    <li>\n\n      ",[">","offerSingle"],"\n\n</li>\n<hr>\n    "]],"\n  </ul>\n  </div>\n</div>\n</div>\n  </div>\n\n  <div class=\"modal fade\" id='offerModal'>\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n              <form role='form' id='offerForm'>\n\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">Post An Offer</h4>\n      </div>\n      <div class=\"modal-body\">\n          \n    ",[">","wantedForm"],"\n\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n        <button type=\"submit\" class=\"btn btn-primary\">Post Offer</button>\n      </div>\n              </form>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->"]));

})();