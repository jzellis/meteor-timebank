(function(){Template.__define__("offerFull",Package.handlebars.Handlebars.json_ast_to_func([["#",[[0,"with"],[0,"offer"]],["\n\t  <div class='container offer offer-single'>\n\t    <div class='col-md-8 col-md-offset-2'>\n\t\t      <div class='panel panel-default'>\n\t\t        <div class='panel-body'>\n\t\t        \t<div class='row'>\n\t\t        \t\t<div class='col-md-2'>\n\t\t        \t\t\t",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["\n\t\t        \t\t\t<a href='/users/",["{",[[0,"username"]]],"'><img src='",["{",[[0,"profile","picture"]]],"' class='avatar'></a>\n\t\t        \t\t\t"]],"\n\t\t        \t\t</div><!-- /avatar -->\n\n\t\t        \t\t<div class='col-md-10'>\n\t\t        \t\t\t<div class='title'>",["{",[[0,"title"]]],"</div>\n\t\t        \t\t\t<div class='text-muted'>Posted by ",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["<a href='/users/",["{",[[0,"username"]]],"'>",["{",[[0,"username"]]],"</a>"]],"</div>\n\t\t\t\t\t\t\t<div class='text-muted'> ",["#",[[0,"if"],[0,"location"]],["<a href='http://maps.google.com?q=",["{",[[0,"location"]]],"' target='_new'><i class=\"fa fa-map-marker\"></i> ",["{",[[0,"location"]]],"</a> "]],"on <a href=''>",["{",[[0,"formatDate"],[0,"timestamp"]]]," <i class='fa fa-link'></i></a></div>\n\t\t\t\t\t\t\t<div>\n                <i class=\"fa fa-tags\" title='Tags'>\n                </i>\n                ",["#",[[0,"each"],[0,"tags"]],["\n                <a href='/tags/",["{",[[0]]],"' class='label label-default'>\n                  ",["{",[[0]]],"\n                </a>&nbsp;\n                "]],"\n              </div>\n\t\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t\t<div class='body'>",["!",[[0,"nl2br"],[0,"body"]]],"</div>\n\t\t        \t\t</div>\n\n\t\t        \t</div>\n\t\t        </div>\n\t\t    </div><!-- /panel -->\n\t\t    \t\t\t<div class='panel panel-default'>\n\t\t\t\t<div class='panel-body'>\n\t\t<h3><a name='replies'></a>",["{",[[0,"numReplies"]]]," Replies</h3>\n\n\t\t",["#",[[0,"each"],[0,"replies"]],["\n\t\t<hr>\n\t\t\t<div class='reply'>\n\t\t\t\t\t<div class='row'>\n\t\t        \t\t<div class='col-md-1 col-md-offset-1'>\n\t\t        \t\t\t",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["\n\t\t        \t\t\t<a href='/users/",["{",[[0,"username"]]],"'><img src='",["{",[[0,"profile","picture"]]],"' class='avatar'></a>\n\t\t        \t\t\t"]],"\n\t\t        \t\t</div><!-- /avatar -->\n\t\t\t        \t\t<div class='col-md-10'>\n\t\t\t\t\t\t\t",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["\n\t\t        \t\t\t<b><a href='/users/",["{",[[0,"username"]]],"'>",["{",[[0,"username"]]],"</a></b>\n\t\t        \t\t\t"]]," ",["!",[[0,"nl2br"],[0,"body"]]],"\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='col-md-12 text-right small text-muted'>",["{",[[0,"relativeTime"],[0,"timestamp"]]],"</div>\n\t\t\t\t\t</div>\n\n</div>\n\t\t"]],"\n\n<!-- Reply form -->\n\n\t\t\t<div class='' style='margin-top: 2em'>\n\t\t\t\t<form role='form' id='replyForm' name='replyForm'>\n\t            <h3>\n\t              Leave A Reply\n\t            </h3>\n\t            <div class='row'>\n\t              <div class='col-md-1 text-center'>\n\t                ",["#",[[0,"with"],[0,"currentUser"]],["\n\t                <img src='",["{",[[0,"profile","picture"]]],"' class='avatar' >\n\t                <br>\n\t                ",["{",[[0,"username"]]],"\n\t                "]],"\n\t              </div>\n\t              <div class='col-md-11'>\n\t                <textarea class='form-control' name='body' rows='4'>\n\t                </textarea>\n\t              </div>\n\t            </div>\n\t            <br>\n\t            <div class='text-right'>\n\t              <button type='submit' class='btn btn-primary'>\n\t                Post Reply\n\t              </button>\n\t            </div>\n\t            \n\t          </form>\n\t\t\t</div>\n\t\t</div>\n</div>\n\n\t\t</div>\n\t</div>\n\t"]]]));

})();
