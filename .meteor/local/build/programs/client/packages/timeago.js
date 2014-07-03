//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var override;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/timeago/timeago/jquery.timeago.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**                                                                                                                // 1
 * Timeago is a jQuery plugin that makes it easy to support automatically                                          // 2
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").                                          // 3
 *                                                                                                                 // 4
 * @name timeago                                                                                                   // 5
 * @version 1.3.0                                                                                                  // 6
 * @requires jQuery v1.2.3+                                                                                        // 7
 * @author Ryan McGeary                                                                                            // 8
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php                                       // 9
 *                                                                                                                 // 10
 * For usage and examples, visit:                                                                                  // 11
 * http://timeago.yarp.com/                                                                                        // 12
 *                                                                                                                 // 13
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)                                         // 14
 */                                                                                                                // 15
                                                                                                                   // 16
(function (factory) {                                                                                              // 17
  if (typeof define === 'function' && define.amd) {                                                                // 18
    // AMD. Register as an anonymous module.                                                                       // 19
    define(['jquery'], factory);                                                                                   // 20
  } else {                                                                                                         // 21
    // Browser globals                                                                                             // 22
    factory(jQuery);                                                                                               // 23
  }                                                                                                                // 24
}(function ($) {                                                                                                   // 25
  $.timeago = function(timestamp) {                                                                                // 26
    if (timestamp instanceof Date) {                                                                               // 27
      return inWords(timestamp);                                                                                   // 28
    } else if (typeof timestamp === "string") {                                                                    // 29
      return inWords($.timeago.parse(timestamp));                                                                  // 30
    } else if (typeof timestamp === "number") {                                                                    // 31
      return inWords(new Date(timestamp));                                                                         // 32
    } else {                                                                                                       // 33
      return inWords($.timeago.datetime(timestamp));                                                               // 34
    }                                                                                                              // 35
  };                                                                                                               // 36
  var $t = $.timeago;                                                                                              // 37
                                                                                                                   // 38
  $.extend($.timeago, {                                                                                            // 39
    settings: {                                                                                                    // 40
      refreshMillis: 60000,                                                                                        // 41
      allowFuture: false,                                                                                          // 42
      localeTitle: false,                                                                                          // 43
      cutoff: 0,                                                                                                   // 44
      strings: {                                                                                                   // 45
        prefixAgo: null,                                                                                           // 46
        prefixFromNow: null,                                                                                       // 47
        suffixAgo: "ago",                                                                                          // 48
        suffixFromNow: "from now",                                                                                 // 49
        seconds: "less than a minute",                                                                             // 50
        minute: "about a minute",                                                                                  // 51
        minutes: "%d minutes",                                                                                     // 52
        hour: "about an hour",                                                                                     // 53
        hours: "about %d hours",                                                                                   // 54
        day: "a day",                                                                                              // 55
        days: "%d days",                                                                                           // 56
        month: "about a month",                                                                                    // 57
        months: "%d months",                                                                                       // 58
        year: "about a year",                                                                                      // 59
        years: "%d years",                                                                                         // 60
        wordSeparator: " ",                                                                                        // 61
        numbers: []                                                                                                // 62
      }                                                                                                            // 63
    },                                                                                                             // 64
    inWords: function(distanceMillis) {                                                                            // 65
      var $l = this.settings.strings;                                                                              // 66
      var prefix = $l.prefixAgo;                                                                                   // 67
      var suffix = $l.suffixAgo;                                                                                   // 68
      if (this.settings.allowFuture) {                                                                             // 69
        if (distanceMillis < 0) {                                                                                  // 70
          prefix = $l.prefixFromNow;                                                                               // 71
          suffix = $l.suffixFromNow;                                                                               // 72
        }                                                                                                          // 73
      }                                                                                                            // 74
                                                                                                                   // 75
      var seconds = Math.abs(distanceMillis) / 1000;                                                               // 76
      var minutes = seconds / 60;                                                                                  // 77
      var hours = minutes / 60;                                                                                    // 78
      var days = hours / 24;                                                                                       // 79
      var years = days / 365;                                                                                      // 80
                                                                                                                   // 81
      function substitute(stringOrFunction, number) {                                                              // 82
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction; // 83
        var value = ($l.numbers && $l.numbers[number]) || number;                                                  // 84
        return string.replace(/%d/i, value);                                                                       // 85
      }                                                                                                            // 86
                                                                                                                   // 87
      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||                                   // 88
        seconds < 90 && substitute($l.minute, 1) ||                                                                // 89
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||                                             // 90
        minutes < 90 && substitute($l.hour, 1) ||                                                                  // 91
        hours < 24 && substitute($l.hours, Math.round(hours)) ||                                                   // 92
        hours < 42 && substitute($l.day, 1) ||                                                                     // 93
        days < 30 && substitute($l.days, Math.round(days)) ||                                                      // 94
        days < 45 && substitute($l.month, 1) ||                                                                    // 95
        days < 365 && substitute($l.months, Math.round(days / 30)) ||                                              // 96
        years < 1.5 && substitute($l.year, 1) ||                                                                   // 97
        substitute($l.years, Math.round(years));                                                                   // 98
                                                                                                                   // 99
      var separator = $l.wordSeparator || "";                                                                      // 100
      if ($l.wordSeparator === undefined) { separator = " "; }                                                     // 101
      return $.trim([prefix, words, suffix].join(separator));                                                      // 102
    },                                                                                                             // 103
    parse: function(iso8601) {                                                                                     // 104
      var s = $.trim(iso8601);                                                                                     // 105
      s = s.replace(/\.\d+/,""); // remove milliseconds                                                            // 106
      s = s.replace(/-/,"/").replace(/-/,"/");                                                                     // 107
      s = s.replace(/T/," ").replace(/Z/," UTC");                                                                  // 108
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400                                           // 109
      return new Date(s);                                                                                          // 110
    },                                                                                                             // 111
    datetime: function(elem) {                                                                                     // 112
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");                            // 113
      return $t.parse(iso8601);                                                                                    // 114
    },                                                                                                             // 115
    isTime: function(elem) {                                                                                       // 116
      // jQuery's `is()` doesn't play well with HTML5 in IE                                                        // 117
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");                               // 118
    }                                                                                                              // 119
  });                                                                                                              // 120
                                                                                                                   // 121
  // functions that can be called via $(el).timeago('action')                                                      // 122
  // init is default when no action is given                                                                       // 123
  // functions are called with context of a single element                                                         // 124
  var functions = {                                                                                                // 125
    init: function(){                                                                                              // 126
      var refresh_el = $.proxy(refresh, this);                                                                     // 127
      refresh_el();                                                                                                // 128
      var $s = $t.settings;                                                                                        // 129
      if ($s.refreshMillis > 0) {                                                                                  // 130
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);                                         // 131
      }                                                                                                            // 132
    },                                                                                                             // 133
    update: function(time){                                                                                        // 134
      $(this).data('timeago', { datetime: $t.parse(time) });                                                       // 135
      refresh.apply(this);                                                                                         // 136
    },                                                                                                             // 137
    updateFromDOM: function(){                                                                                     // 138
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);                                                                                         // 140
    },                                                                                                             // 141
    dispose: function () {                                                                                         // 142
      if (this._timeagoInterval) {                                                                                 // 143
        window.clearInterval(this._timeagoInterval);                                                               // 144
        this._timeagoInterval = null;                                                                              // 145
      }                                                                                                            // 146
    }                                                                                                              // 147
  };                                                                                                               // 148
                                                                                                                   // 149
  $.fn.timeago = function(action, options) {                                                                       // 150
    var fn = action ? functions[action] : functions.init;                                                          // 151
    if(!fn){                                                                                                       // 152
      throw new Error("Unknown function name '"+ action +"' for timeago");                                         // 153
    }                                                                                                              // 154
    // each over objects here and call the requested function                                                      // 155
    this.each(function(){                                                                                          // 156
      fn.call(this, options);                                                                                      // 157
    });                                                                                                            // 158
    return this;                                                                                                   // 159
  };                                                                                                               // 160
                                                                                                                   // 161
  function refresh() {                                                                                             // 162
    var data = prepareData(this);                                                                                  // 163
    var $s = $t.settings;                                                                                          // 164
                                                                                                                   // 165
    if (!isNaN(data.datetime)) {                                                                                   // 166
      if ( $s.cutoff == 0 || distance(data.datetime) < $s.cutoff) {                                                // 167
        $(this).text(inWords(data.datetime));                                                                      // 168
      }                                                                                                            // 169
    }                                                                                                              // 170
    return this;                                                                                                   // 171
  }                                                                                                                // 172
                                                                                                                   // 173
  function prepareData(element) {                                                                                  // 174
    element = $(element);                                                                                          // 175
    if (!element.data("timeago")) {                                                                                // 176
      element.data("timeago", { datetime: $t.datetime(element) });                                                 // 177
      var text = $.trim(element.text());                                                                           // 178
      if ($t.settings.localeTitle) {                                                                               // 179
        element.attr("title", element.data('timeago').datetime.toLocaleString());                                  // 180
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {                              // 181
        element.attr("title", text);                                                                               // 182
      }                                                                                                            // 183
    }                                                                                                              // 184
    return element.data("timeago");                                                                                // 185
  }                                                                                                                // 186
                                                                                                                   // 187
  function inWords(date) {                                                                                         // 188
    return $t.inWords(distance(date));                                                                             // 189
  }                                                                                                                // 190
                                                                                                                   // 191
  function distance(date) {                                                                                        // 192
    return (new Date().getTime() - date.getTime());                                                                // 193
  }                                                                                                                // 194
                                                                                                                   // 195
  // fix for IE6 suckage                                                                                           // 196
  document.createElement("abbr");                                                                                  // 197
  document.createElement("time");                                                                                  // 198
}));                                                                                                               // 199
                                                                                                                   // 200
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/timeago/helper.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
if (typeof Package.ui != 'undefined') {                                                                            // 1
  var Handlebars = Package.ui.Handlebars                                                                           // 2
};                                                                                                                 // 3
                                                                                                                   // 4
if (typeof Handlebars !== 'undefined') {                                                                           // 5
  Handlebars.registerHelper("timeago", function(date, options) {                                                   // 6
    override = options.hash['default']                                                                             // 7
    var dateObj;                                                                                                   // 8
    if (date) {                                                                                                    // 9
      dateObj = new Date(date);                                                                                    // 10
      return $.timeago(dateObj).replace(/\ /g, "\u00a0");                                                          // 11
    }                                                                                                              // 12
    if (override == undefined) {                                                                                   // 13
      return "some time ago";                                                                                      // 14
    } else {                                                                                                       // 15
      return override;                                                                                             // 16
    }                                                                                                              // 17
  });                                                                                                              // 18
}                                                                                                                  // 19
                                                                                                                   // 20
                                                                                                                   // 21
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.timeago = {};

})();

//# sourceMappingURL=b7867636ccc76a7c528755dbd7bdb6aaa7142801.map
