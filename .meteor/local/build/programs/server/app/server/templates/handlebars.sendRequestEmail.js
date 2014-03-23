(function(){var template = OriginalHandlebars.compile("Hello {{recipient.username}},\n\n{{sender.username}} has sent you a request for {{currencyAbbr}}{{request.amount}} for: \"{{request.description}}\" on {{siteName}}!\n\nTo fulfill this request and send {{sender.username}} {{currencyAbbr}}{{request.amount}}, just go to {{server}}/send/{{sender.username}}/{{request.amount}}");Handlebars.templates["sendRequestEmail"] = function (data) { return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: {},name: "sendRequestEmail"});};

})();
