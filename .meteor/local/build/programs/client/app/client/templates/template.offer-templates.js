(function(){Template.__define__("offerSingle",Package.handlebars.Handlebars.json_ast_to_func(["<div class='offer'>\n\t\t\t<div class='row'>\n\t\t\t<div class='col-md-2 text-center'>",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["<a href='/users/",["{",[[0,"username"]]],"'><img src='",["{",[[0,"profile","picture"]]],"' class='avatar'></a>"]],"</div>\n\t\t\t<div class='col-md-10'>\n\t\t\t\t<div><a href='/offers/",["{",[[0,"_id"]]],"'>",["{",[[0,"title"]]],"</a></div>\n\t\t\t\t<div class='small'>",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["<a href='/users/",["{",[[0,"username"]]],"'>",["{",[[0,"username"]]],"</a>"]],"</div>\n\n\t\t\t\t<div class='small text-muted'> ",["#",[[0,"if"],[0,"location"]],["<a class='text-muted' href='http://maps.google.com?q=",["{",[[0,"location"]]],"' target='_new'><i class=\"fa fa-map-marker\"></i> ",["{",[[0,"location"]]],"</a> - "]],["{",[[0,"formatDate"],[0,"timestamp"]]],"</div>\n\t\t\t\t<div class='col-md-12'>",["!",[[0,"nl2br"],[0,"body"]]],"</div>\n\t\t\t\t<div class='col-md-12'><i class=\"fa fa-tags\" title='Tags'></i> ",["#",[[0,"each"],[0,"tags"]],["<a href='/tags/",["{",[[0]]],"' class='label label-default'>",["{",[[0]]],"</a> "]],"</div>\n\t\t\t\t\t\t\t\t<div class='text-right small'><a href='/offer/",["{",[[0,"_id"]]],"#replies'>",["{",[[0,"numReplies"]]]," replies</a></div>\n\n\t\t\t</div>\n\t\t</div>\n\t</div>"]));
Template.__define__("offerSingleSmall",Package.handlebars.Handlebars.json_ast_to_func(["<div class='offer'>\n\t\t\t<div class='row'>\n\t\t\t\t\t\t\t<div class='col-md-2'>",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["<a href='/users/",["{",[[0,"username"]]],"'><img src='",["{",[[0,"profile","picture"]]],"' class='avatar'></a>"]],"</div>\n\t\t\t<div class='col-md-10'>\n\t\t\t\t\t\t\t\t<div class='title'><a href='/offers/",["{",[[0,"_id"]]],"'>",["{",[[0,"title"]]],"</a></div>\n\t\t\t\t<div class='small'>Posted by ",["#",[[0,"with"],[0,"getUserById"],[0,"userId"]],["<a href='/users/",["{",[[0,"username"]]],"'>",["{",[[0,"username"]]],"</a>"]],"</div>\n\t\t\t\t<div class='small text-muted'>",["#",[[0,"if"],[0,"location"]],["<a class='text-muted' href='http://maps.google.com?q=",["{",[[0,"location"]]],"' target='_new'><i class=\"fa fa-map-marker\"></i> ",["{",[[0,"location"]]],"</a> - "]],["{",[[0,"formatDate"],[0,"timestamp"]]],"</div>\n\t\t\t\t<div class='col-md-12 small'>",["!",[[0,"trimWords"],[0,"body"],32,"..."]],"</div>\n\t\t\t\t\t\t\t\t<div class='text-right small'><a href='/offer/",["{",[[0,"_id"]]],"#replies'>",["{",[[0,"numReplies"]]]," replies</a></div>\n\n\n\t\t\t</div>\n\t\t</div>\n\t</div>"]));

})();