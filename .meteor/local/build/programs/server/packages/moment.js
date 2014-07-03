(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var moment;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/moment/lib/moment/moment.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
//! moment.js                                                                                                          // 1
//! version : 2.6.0                                                                                                    // 2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors                                                         // 3
//! license : MIT                                                                                                      // 4
//! momentjs.com                                                                                                       // 5
                                                                                                                       // 6
(function (undefined) {                                                                                                // 7
                                                                                                                       // 8
    /************************************                                                                              // 9
        Constants                                                                                                      // 10
    ************************************/                                                                              // 11
                                                                                                                       // 12
    var moment,                                                                                                        // 13
        VERSION = "2.6.0",                                                                                             // 14
        // the global-scope this is NOT the global object in Node.js                                                   // 15
        globalScope = typeof global !== 'undefined' ? global : this,                                                   // 16
        oldGlobalMoment,                                                                                               // 17
        round = Math.round,                                                                                            // 18
        i,                                                                                                             // 19
                                                                                                                       // 20
        YEAR = 0,                                                                                                      // 21
        MONTH = 1,                                                                                                     // 22
        DATE = 2,                                                                                                      // 23
        HOUR = 3,                                                                                                      // 24
        MINUTE = 4,                                                                                                    // 25
        SECOND = 5,                                                                                                    // 26
        MILLISECOND = 6,                                                                                               // 27
                                                                                                                       // 28
        // internal storage for language config files                                                                  // 29
        languages = {},                                                                                                // 30
                                                                                                                       // 31
        // moment internal properties                                                                                  // 32
        momentProperties = {                                                                                           // 33
            _isAMomentObject: null,                                                                                    // 34
            _i : null,                                                                                                 // 35
            _f : null,                                                                                                 // 36
            _l : null,                                                                                                 // 37
            _strict : null,                                                                                            // 38
            _isUTC : null,                                                                                             // 39
            _offset : null,  // optional. Combine with _isUTC                                                          // 40
            _pf : null,                                                                                                // 41
            _lang : null  // optional                                                                                  // 42
        },                                                                                                             // 43
                                                                                                                       // 44
        // check for nodeJS                                                                                            // 45
        hasModule = (typeof module !== 'undefined' && module.exports),                                                 // 46
                                                                                                                       // 47
        // ASP.NET json date format regex                                                                              // 48
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,                                                                       // 49
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,                              // 50
                                                                                                                       // 51
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html                   // 52
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere                                   // 53
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
                                                                                                                       // 55
        // format tokens                                                                                               // 56
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,                                              // 58
                                                                                                                       // 59
        // parsing token regexes                                                                                       // 60
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99                                                                  // 61
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999                                                             // 62
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999                                                             // 63
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999                                              // 64
        parseTokenDigits = /\d+/, // nonzero number of digits                                                          // 65
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z                                 // 67
        parseTokenT = /T/i, // T (ISO separator)                                                                       // 68
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123                                   // 69
        parseTokenOrdinal = /\d{1,2}/,                                                                                 // 70
                                                                                                                       // 71
        //strict parsing regexes                                                                                       // 72
        parseTokenOneDigit = /\d/, // 0 - 9                                                                            // 73
        parseTokenTwoDigits = /\d\d/, // 00 - 99                                                                       // 74
        parseTokenThreeDigits = /\d{3}/, // 000 - 999                                                                  // 75
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999                                                                 // 76
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999                                                      // 77
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf                                                             // 78
                                                                                                                       // 79
        // iso 8601 regex                                                                                              // 80
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)   // 81
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                                                                                                                       // 83
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',                                                                            // 84
                                                                                                                       // 85
        isoDates = [                                                                                                   // 86
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],                                                                 // 87
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],                                                                       // 88
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],                                                                       // 89
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],                                                                            // 90
            ['YYYY-DDD', /\d{4}-\d{3}/]                                                                                // 91
        ],                                                                                                             // 92
                                                                                                                       // 93
        // iso time formats and regexes                                                                                // 94
        isoTimes = [                                                                                                   // 95
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],                                                             // 96
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],                                                                       // 97
            ['HH:mm', /(T| )\d\d:\d\d/],                                                                               // 98
            ['HH', /(T| )\d\d/]                                                                                        // 99
        ],                                                                                                             // 100
                                                                                                                       // 101
        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]                                         // 102
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,                                                                      // 103
                                                                                                                       // 104
        // getter and setter names                                                                                     // 105
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),                                 // 106
        unitMillisecondFactors = {                                                                                     // 107
            'Milliseconds' : 1,                                                                                        // 108
            'Seconds' : 1e3,                                                                                           // 109
            'Minutes' : 6e4,                                                                                           // 110
            'Hours' : 36e5,                                                                                            // 111
            'Days' : 864e5,                                                                                            // 112
            'Months' : 2592e6,                                                                                         // 113
            'Years' : 31536e6                                                                                          // 114
        },                                                                                                             // 115
                                                                                                                       // 116
        unitAliases = {                                                                                                // 117
            ms : 'millisecond',                                                                                        // 118
            s : 'second',                                                                                              // 119
            m : 'minute',                                                                                              // 120
            h : 'hour',                                                                                                // 121
            d : 'day',                                                                                                 // 122
            D : 'date',                                                                                                // 123
            w : 'week',                                                                                                // 124
            W : 'isoWeek',                                                                                             // 125
            M : 'month',                                                                                               // 126
            Q : 'quarter',                                                                                             // 127
            y : 'year',                                                                                                // 128
            DDD : 'dayOfYear',                                                                                         // 129
            e : 'weekday',                                                                                             // 130
            E : 'isoWeekday',                                                                                          // 131
            gg: 'weekYear',                                                                                            // 132
            GG: 'isoWeekYear'                                                                                          // 133
        },                                                                                                             // 134
                                                                                                                       // 135
        camelFunctions = {                                                                                             // 136
            dayofyear : 'dayOfYear',                                                                                   // 137
            isoweekday : 'isoWeekday',                                                                                 // 138
            isoweek : 'isoWeek',                                                                                       // 139
            weekyear : 'weekYear',                                                                                     // 140
            isoweekyear : 'isoWeekYear'                                                                                // 141
        },                                                                                                             // 142
                                                                                                                       // 143
        // format function strings                                                                                     // 144
        formatFunctions = {},                                                                                          // 145
                                                                                                                       // 146
        // tokens to ordinalize and pad                                                                                // 147
        ordinalizeTokens = 'DDD w W M D d'.split(' '),                                                                 // 148
        paddedTokens = 'M D H h m s w W'.split(' '),                                                                   // 149
                                                                                                                       // 150
        formatTokenFunctions = {                                                                                       // 151
            M    : function () {                                                                                       // 152
                return this.month() + 1;                                                                               // 153
            },                                                                                                         // 154
            MMM  : function (format) {                                                                                 // 155
                return this.lang().monthsShort(this, format);                                                          // 156
            },                                                                                                         // 157
            MMMM : function (format) {                                                                                 // 158
                return this.lang().months(this, format);                                                               // 159
            },                                                                                                         // 160
            D    : function () {                                                                                       // 161
                return this.date();                                                                                    // 162
            },                                                                                                         // 163
            DDD  : function () {                                                                                       // 164
                return this.dayOfYear();                                                                               // 165
            },                                                                                                         // 166
            d    : function () {                                                                                       // 167
                return this.day();                                                                                     // 168
            },                                                                                                         // 169
            dd   : function (format) {                                                                                 // 170
                return this.lang().weekdaysMin(this, format);                                                          // 171
            },                                                                                                         // 172
            ddd  : function (format) {                                                                                 // 173
                return this.lang().weekdaysShort(this, format);                                                        // 174
            },                                                                                                         // 175
            dddd : function (format) {                                                                                 // 176
                return this.lang().weekdays(this, format);                                                             // 177
            },                                                                                                         // 178
            w    : function () {                                                                                       // 179
                return this.week();                                                                                    // 180
            },                                                                                                         // 181
            W    : function () {                                                                                       // 182
                return this.isoWeek();                                                                                 // 183
            },                                                                                                         // 184
            YY   : function () {                                                                                       // 185
                return leftZeroFill(this.year() % 100, 2);                                                             // 186
            },                                                                                                         // 187
            YYYY : function () {                                                                                       // 188
                return leftZeroFill(this.year(), 4);                                                                   // 189
            },                                                                                                         // 190
            YYYYY : function () {                                                                                      // 191
                return leftZeroFill(this.year(), 5);                                                                   // 192
            },                                                                                                         // 193
            YYYYYY : function () {                                                                                     // 194
                var y = this.year(), sign = y >= 0 ? '+' : '-';                                                        // 195
                return sign + leftZeroFill(Math.abs(y), 6);                                                            // 196
            },                                                                                                         // 197
            gg   : function () {                                                                                       // 198
                return leftZeroFill(this.weekYear() % 100, 2);                                                         // 199
            },                                                                                                         // 200
            gggg : function () {                                                                                       // 201
                return leftZeroFill(this.weekYear(), 4);                                                               // 202
            },                                                                                                         // 203
            ggggg : function () {                                                                                      // 204
                return leftZeroFill(this.weekYear(), 5);                                                               // 205
            },                                                                                                         // 206
            GG   : function () {                                                                                       // 207
                return leftZeroFill(this.isoWeekYear() % 100, 2);                                                      // 208
            },                                                                                                         // 209
            GGGG : function () {                                                                                       // 210
                return leftZeroFill(this.isoWeekYear(), 4);                                                            // 211
            },                                                                                                         // 212
            GGGGG : function () {                                                                                      // 213
                return leftZeroFill(this.isoWeekYear(), 5);                                                            // 214
            },                                                                                                         // 215
            e : function () {                                                                                          // 216
                return this.weekday();                                                                                 // 217
            },                                                                                                         // 218
            E : function () {                                                                                          // 219
                return this.isoWeekday();                                                                              // 220
            },                                                                                                         // 221
            a    : function () {                                                                                       // 222
                return this.lang().meridiem(this.hours(), this.minutes(), true);                                       // 223
            },                                                                                                         // 224
            A    : function () {                                                                                       // 225
                return this.lang().meridiem(this.hours(), this.minutes(), false);                                      // 226
            },                                                                                                         // 227
            H    : function () {                                                                                       // 228
                return this.hours();                                                                                   // 229
            },                                                                                                         // 230
            h    : function () {                                                                                       // 231
                return this.hours() % 12 || 12;                                                                        // 232
            },                                                                                                         // 233
            m    : function () {                                                                                       // 234
                return this.minutes();                                                                                 // 235
            },                                                                                                         // 236
            s    : function () {                                                                                       // 237
                return this.seconds();                                                                                 // 238
            },                                                                                                         // 239
            S    : function () {                                                                                       // 240
                return toInt(this.milliseconds() / 100);                                                               // 241
            },                                                                                                         // 242
            SS   : function () {                                                                                       // 243
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);                                               // 244
            },                                                                                                         // 245
            SSS  : function () {                                                                                       // 246
                return leftZeroFill(this.milliseconds(), 3);                                                           // 247
            },                                                                                                         // 248
            SSSS : function () {                                                                                       // 249
                return leftZeroFill(this.milliseconds(), 3);                                                           // 250
            },                                                                                                         // 251
            Z    : function () {                                                                                       // 252
                var a = -this.zone(),                                                                                  // 253
                    b = "+";                                                                                           // 254
                if (a < 0) {                                                                                           // 255
                    a = -a;                                                                                            // 256
                    b = "-";                                                                                           // 257
                }                                                                                                      // 258
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);                      // 259
            },                                                                                                         // 260
            ZZ   : function () {                                                                                       // 261
                var a = -this.zone(),                                                                                  // 262
                    b = "+";                                                                                           // 263
                if (a < 0) {                                                                                           // 264
                    a = -a;                                                                                            // 265
                    b = "-";                                                                                           // 266
                }                                                                                                      // 267
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);                            // 268
            },                                                                                                         // 269
            z : function () {                                                                                          // 270
                return this.zoneAbbr();                                                                                // 271
            },                                                                                                         // 272
            zz : function () {                                                                                         // 273
                return this.zoneName();                                                                                // 274
            },                                                                                                         // 275
            X    : function () {                                                                                       // 276
                return this.unix();                                                                                    // 277
            },                                                                                                         // 278
            Q : function () {                                                                                          // 279
                return this.quarter();                                                                                 // 280
            }                                                                                                          // 281
        },                                                                                                             // 282
                                                                                                                       // 283
        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];                                 // 284
                                                                                                                       // 285
    function defaultParsingFlags() {                                                                                   // 286
        // We need to deep clone this object, and es5 standard is not very                                             // 287
        // helpful.                                                                                                    // 288
        return {                                                                                                       // 289
            empty : false,                                                                                             // 290
            unusedTokens : [],                                                                                         // 291
            unusedInput : [],                                                                                          // 292
            overflow : -2,                                                                                             // 293
            charsLeftOver : 0,                                                                                         // 294
            nullInput : false,                                                                                         // 295
            invalidMonth : null,                                                                                       // 296
            invalidFormat : false,                                                                                     // 297
            userInvalidated : false,                                                                                   // 298
            iso: false                                                                                                 // 299
        };                                                                                                             // 300
    }                                                                                                                  // 301
                                                                                                                       // 302
    function deprecate(msg, fn) {                                                                                      // 303
        var firstTime = true;                                                                                          // 304
        function printMsg() {                                                                                          // 305
            if (moment.suppressDeprecationWarnings === false &&                                                        // 306
                    typeof console !== 'undefined' && console.warn) {                                                  // 307
                console.warn("Deprecation warning: " + msg);                                                           // 308
            }                                                                                                          // 309
        }                                                                                                              // 310
        return extend(function () {                                                                                    // 311
            if (firstTime) {                                                                                           // 312
                printMsg();                                                                                            // 313
                firstTime = false;                                                                                     // 314
            }                                                                                                          // 315
            return fn.apply(this, arguments);                                                                          // 316
        }, fn);                                                                                                        // 317
    }                                                                                                                  // 318
                                                                                                                       // 319
    function padToken(func, count) {                                                                                   // 320
        return function (a) {                                                                                          // 321
            return leftZeroFill(func.call(this, a), count);                                                            // 322
        };                                                                                                             // 323
    }                                                                                                                  // 324
    function ordinalizeToken(func, period) {                                                                           // 325
        return function (a) {                                                                                          // 326
            return this.lang().ordinal(func.call(this, a), period);                                                    // 327
        };                                                                                                             // 328
    }                                                                                                                  // 329
                                                                                                                       // 330
    while (ordinalizeTokens.length) {                                                                                  // 331
        i = ordinalizeTokens.pop();                                                                                    // 332
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);                                   // 333
    }                                                                                                                  // 334
    while (paddedTokens.length) {                                                                                      // 335
        i = paddedTokens.pop();                                                                                        // 336
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);                                            // 337
    }                                                                                                                  // 338
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);                                                 // 339
                                                                                                                       // 340
                                                                                                                       // 341
    /************************************                                                                              // 342
        Constructors                                                                                                   // 343
    ************************************/                                                                              // 344
                                                                                                                       // 345
    function Language() {                                                                                              // 346
                                                                                                                       // 347
    }                                                                                                                  // 348
                                                                                                                       // 349
    // Moment prototype object                                                                                         // 350
    function Moment(config) {                                                                                          // 351
        checkOverflow(config);                                                                                         // 352
        extend(this, config);                                                                                          // 353
    }                                                                                                                  // 354
                                                                                                                       // 355
    // Duration Constructor                                                                                            // 356
    function Duration(duration) {                                                                                      // 357
        var normalizedInput = normalizeObjectUnits(duration),                                                          // 358
            years = normalizedInput.year || 0,                                                                         // 359
            quarters = normalizedInput.quarter || 0,                                                                   // 360
            months = normalizedInput.month || 0,                                                                       // 361
            weeks = normalizedInput.week || 0,                                                                         // 362
            days = normalizedInput.day || 0,                                                                           // 363
            hours = normalizedInput.hour || 0,                                                                         // 364
            minutes = normalizedInput.minute || 0,                                                                     // 365
            seconds = normalizedInput.second || 0,                                                                     // 366
            milliseconds = normalizedInput.millisecond || 0;                                                           // 367
                                                                                                                       // 368
        // representation for dateAddRemove                                                                            // 369
        this._milliseconds = +milliseconds +                                                                           // 370
            seconds * 1e3 + // 1000                                                                                    // 371
            minutes * 6e4 + // 1000 * 60                                                                               // 372
            hours * 36e5; // 1000 * 60 * 60                                                                            // 373
        // Because of dateAddRemove treats 24 hours as different from a                                                // 374
        // day when working around DST, we need to store them separately                                               // 375
        this._days = +days +                                                                                           // 376
            weeks * 7;                                                                                                 // 377
        // It is impossible translate months into days without knowing                                                 // 378
        // which months you are are talking about, so we have to store                                                 // 379
        // it separately.                                                                                              // 380
        this._months = +months +                                                                                       // 381
            quarters * 3 +                                                                                             // 382
            years * 12;                                                                                                // 383
                                                                                                                       // 384
        this._data = {};                                                                                               // 385
                                                                                                                       // 386
        this._bubble();                                                                                                // 387
    }                                                                                                                  // 388
                                                                                                                       // 389
    /************************************                                                                              // 390
        Helpers                                                                                                        // 391
    ************************************/                                                                              // 392
                                                                                                                       // 393
                                                                                                                       // 394
    function extend(a, b) {                                                                                            // 395
        for (var i in b) {                                                                                             // 396
            if (b.hasOwnProperty(i)) {                                                                                 // 397
                a[i] = b[i];                                                                                           // 398
            }                                                                                                          // 399
        }                                                                                                              // 400
                                                                                                                       // 401
        if (b.hasOwnProperty("toString")) {                                                                            // 402
            a.toString = b.toString;                                                                                   // 403
        }                                                                                                              // 404
                                                                                                                       // 405
        if (b.hasOwnProperty("valueOf")) {                                                                             // 406
            a.valueOf = b.valueOf;                                                                                     // 407
        }                                                                                                              // 408
                                                                                                                       // 409
        return a;                                                                                                      // 410
    }                                                                                                                  // 411
                                                                                                                       // 412
    function cloneMoment(m) {                                                                                          // 413
        var result = {}, i;                                                                                            // 414
        for (i in m) {                                                                                                 // 415
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {                                           // 416
                result[i] = m[i];                                                                                      // 417
            }                                                                                                          // 418
        }                                                                                                              // 419
                                                                                                                       // 420
        return result;                                                                                                 // 421
    }                                                                                                                  // 422
                                                                                                                       // 423
    function absRound(number) {                                                                                        // 424
        if (number < 0) {                                                                                              // 425
            return Math.ceil(number);                                                                                  // 426
        } else {                                                                                                       // 427
            return Math.floor(number);                                                                                 // 428
        }                                                                                                              // 429
    }                                                                                                                  // 430
                                                                                                                       // 431
    // left zero fill a number                                                                                         // 432
    // see http://jsperf.com/left-zero-filling for performance comparison                                              // 433
    function leftZeroFill(number, targetLength, forceSign) {                                                           // 434
        var output = '' + Math.abs(number),                                                                            // 435
            sign = number >= 0;                                                                                        // 436
                                                                                                                       // 437
        while (output.length < targetLength) {                                                                         // 438
            output = '0' + output;                                                                                     // 439
        }                                                                                                              // 440
        return (sign ? (forceSign ? '+' : '') : '-') + output;                                                         // 441
    }                                                                                                                  // 442
                                                                                                                       // 443
    // helper function for _.addTime and _.subtractTime                                                                // 444
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {                                  // 445
        var milliseconds = duration._milliseconds,                                                                     // 446
            days = duration._days,                                                                                     // 447
            months = duration._months;                                                                                 // 448
        updateOffset = updateOffset == null ? true : updateOffset;                                                     // 449
                                                                                                                       // 450
        if (milliseconds) {                                                                                            // 451
            mom._d.setTime(+mom._d + milliseconds * isAdding);                                                         // 452
        }                                                                                                              // 453
        if (days) {                                                                                                    // 454
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);                                          // 455
        }                                                                                                              // 456
        if (months) {                                                                                                  // 457
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);                                          // 458
        }                                                                                                              // 459
        if (updateOffset) {                                                                                            // 460
            moment.updateOffset(mom, days || months);                                                                  // 461
        }                                                                                                              // 462
    }                                                                                                                  // 463
                                                                                                                       // 464
    // check if is an array                                                                                            // 465
    function isArray(input) {                                                                                          // 466
        return Object.prototype.toString.call(input) === '[object Array]';                                             // 467
    }                                                                                                                  // 468
                                                                                                                       // 469
    function isDate(input) {                                                                                           // 470
        return  Object.prototype.toString.call(input) === '[object Date]' ||                                           // 471
                input instanceof Date;                                                                                 // 472
    }                                                                                                                  // 473
                                                                                                                       // 474
    // compare two arrays, return the number of differences                                                            // 475
    function compareArrays(array1, array2, dontConvert) {                                                              // 476
        var len = Math.min(array1.length, array2.length),                                                              // 477
            lengthDiff = Math.abs(array1.length - array2.length),                                                      // 478
            diffs = 0,                                                                                                 // 479
            i;                                                                                                         // 480
        for (i = 0; i < len; i++) {                                                                                    // 481
            if ((dontConvert && array1[i] !== array2[i]) ||                                                            // 482
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {                                             // 483
                diffs++;                                                                                               // 484
            }                                                                                                          // 485
        }                                                                                                              // 486
        return diffs + lengthDiff;                                                                                     // 487
    }                                                                                                                  // 488
                                                                                                                       // 489
    function normalizeUnits(units) {                                                                                   // 490
        if (units) {                                                                                                   // 491
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');                                                  // 492
            units = unitAliases[units] || camelFunctions[lowered] || lowered;                                          // 493
        }                                                                                                              // 494
        return units;                                                                                                  // 495
    }                                                                                                                  // 496
                                                                                                                       // 497
    function normalizeObjectUnits(inputObject) {                                                                       // 498
        var normalizedInput = {},                                                                                      // 499
            normalizedProp,                                                                                            // 500
            prop;                                                                                                      // 501
                                                                                                                       // 502
        for (prop in inputObject) {                                                                                    // 503
            if (inputObject.hasOwnProperty(prop)) {                                                                    // 504
                normalizedProp = normalizeUnits(prop);                                                                 // 505
                if (normalizedProp) {                                                                                  // 506
                    normalizedInput[normalizedProp] = inputObject[prop];                                               // 507
                }                                                                                                      // 508
            }                                                                                                          // 509
        }                                                                                                              // 510
                                                                                                                       // 511
        return normalizedInput;                                                                                        // 512
    }                                                                                                                  // 513
                                                                                                                       // 514
    function makeList(field) {                                                                                         // 515
        var count, setter;                                                                                             // 516
                                                                                                                       // 517
        if (field.indexOf('week') === 0) {                                                                             // 518
            count = 7;                                                                                                 // 519
            setter = 'day';                                                                                            // 520
        }                                                                                                              // 521
        else if (field.indexOf('month') === 0) {                                                                       // 522
            count = 12;                                                                                                // 523
            setter = 'month';                                                                                          // 524
        }                                                                                                              // 525
        else {                                                                                                         // 526
            return;                                                                                                    // 527
        }                                                                                                              // 528
                                                                                                                       // 529
        moment[field] = function (format, index) {                                                                     // 530
            var i, getter,                                                                                             // 531
                method = moment.fn._lang[field],                                                                       // 532
                results = [];                                                                                          // 533
                                                                                                                       // 534
            if (typeof format === 'number') {                                                                          // 535
                index = format;                                                                                        // 536
                format = undefined;                                                                                    // 537
            }                                                                                                          // 538
                                                                                                                       // 539
            getter = function (i) {                                                                                    // 540
                var m = moment().utc().set(setter, i);                                                                 // 541
                return method.call(moment.fn._lang, m, format || '');                                                  // 542
            };                                                                                                         // 543
                                                                                                                       // 544
            if (index != null) {                                                                                       // 545
                return getter(index);                                                                                  // 546
            }                                                                                                          // 547
            else {                                                                                                     // 548
                for (i = 0; i < count; i++) {                                                                          // 549
                    results.push(getter(i));                                                                           // 550
                }                                                                                                      // 551
                return results;                                                                                        // 552
            }                                                                                                          // 553
        };                                                                                                             // 554
    }                                                                                                                  // 555
                                                                                                                       // 556
    function toInt(argumentForCoercion) {                                                                              // 557
        var coercedNumber = +argumentForCoercion,                                                                      // 558
            value = 0;                                                                                                 // 559
                                                                                                                       // 560
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {                                                          // 561
            if (coercedNumber >= 0) {                                                                                  // 562
                value = Math.floor(coercedNumber);                                                                     // 563
            } else {                                                                                                   // 564
                value = Math.ceil(coercedNumber);                                                                      // 565
            }                                                                                                          // 566
        }                                                                                                              // 567
                                                                                                                       // 568
        return value;                                                                                                  // 569
    }                                                                                                                  // 570
                                                                                                                       // 571
    function daysInMonth(year, month) {                                                                                // 572
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();                                                    // 573
    }                                                                                                                  // 574
                                                                                                                       // 575
    function weeksInYear(year, dow, doy) {                                                                             // 576
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;                                          // 577
    }                                                                                                                  // 578
                                                                                                                       // 579
    function daysInYear(year) {                                                                                        // 580
        return isLeapYear(year) ? 366 : 365;                                                                           // 581
    }                                                                                                                  // 582
                                                                                                                       // 583
    function isLeapYear(year) {                                                                                        // 584
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;                                               // 585
    }                                                                                                                  // 586
                                                                                                                       // 587
    function checkOverflow(m) {                                                                                        // 588
        var overflow;                                                                                                  // 589
        if (m._a && m._pf.overflow === -2) {                                                                           // 590
            overflow =                                                                                                 // 591
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :                                                          // 592
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :                           // 593
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :                                                             // 594
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :                                                       // 595
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :                                                       // 596
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :                                       // 597
                -1;                                                                                                    // 598
                                                                                                                       // 599
            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {                                    // 600
                overflow = DATE;                                                                                       // 601
            }                                                                                                          // 602
                                                                                                                       // 603
            m._pf.overflow = overflow;                                                                                 // 604
        }                                                                                                              // 605
    }                                                                                                                  // 606
                                                                                                                       // 607
    function isValid(m) {                                                                                              // 608
        if (m._isValid == null) {                                                                                      // 609
            m._isValid = !isNaN(m._d.getTime()) &&                                                                     // 610
                m._pf.overflow < 0 &&                                                                                  // 611
                !m._pf.empty &&                                                                                        // 612
                !m._pf.invalidMonth &&                                                                                 // 613
                !m._pf.nullInput &&                                                                                    // 614
                !m._pf.invalidFormat &&                                                                                // 615
                !m._pf.userInvalidated;                                                                                // 616
                                                                                                                       // 617
            if (m._strict) {                                                                                           // 618
                m._isValid = m._isValid &&                                                                             // 619
                    m._pf.charsLeftOver === 0 &&                                                                       // 620
                    m._pf.unusedTokens.length === 0;                                                                   // 621
            }                                                                                                          // 622
        }                                                                                                              // 623
        return m._isValid;                                                                                             // 624
    }                                                                                                                  // 625
                                                                                                                       // 626
    function normalizeLanguage(key) {                                                                                  // 627
        return key ? key.toLowerCase().replace('_', '-') : key;                                                        // 628
    }                                                                                                                  // 629
                                                                                                                       // 630
    // Return a moment from input, that is local/utc/zone equivalent to model.                                         // 631
    function makeAs(input, model) {                                                                                    // 632
        return model._isUTC ? moment(input).zone(model._offset || 0) :                                                 // 633
            moment(input).local();                                                                                     // 634
    }                                                                                                                  // 635
                                                                                                                       // 636
    /************************************                                                                              // 637
        Languages                                                                                                      // 638
    ************************************/                                                                              // 639
                                                                                                                       // 640
                                                                                                                       // 641
    extend(Language.prototype, {                                                                                       // 642
                                                                                                                       // 643
        set : function (config) {                                                                                      // 644
            var prop, i;                                                                                               // 645
            for (i in config) {                                                                                        // 646
                prop = config[i];                                                                                      // 647
                if (typeof prop === 'function') {                                                                      // 648
                    this[i] = prop;                                                                                    // 649
                } else {                                                                                               // 650
                    this['_' + i] = prop;                                                                              // 651
                }                                                                                                      // 652
            }                                                                                                          // 653
        },                                                                                                             // 654
                                                                                                                       // 655
        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),  // 656
        months : function (m) {                                                                                        // 657
            return this._months[m.month()];                                                                            // 658
        },                                                                                                             // 659
                                                                                                                       // 660
        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),                                   // 661
        monthsShort : function (m) {                                                                                   // 662
            return this._monthsShort[m.month()];                                                                       // 663
        },                                                                                                             // 664
                                                                                                                       // 665
        monthsParse : function (monthName) {                                                                           // 666
            var i, mom, regex;                                                                                         // 667
                                                                                                                       // 668
            if (!this._monthsParse) {                                                                                  // 669
                this._monthsParse = [];                                                                                // 670
            }                                                                                                          // 671
                                                                                                                       // 672
            for (i = 0; i < 12; i++) {                                                                                 // 673
                // make the regex if we don't have it already                                                          // 674
                if (!this._monthsParse[i]) {                                                                           // 675
                    mom = moment.utc([2000, i]);                                                                       // 676
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');                             // 677
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');                                    // 678
                }                                                                                                      // 679
                // test the regex                                                                                      // 680
                if (this._monthsParse[i].test(monthName)) {                                                            // 681
                    return i;                                                                                          // 682
                }                                                                                                      // 683
            }                                                                                                          // 684
        },                                                                                                             // 685
                                                                                                                       // 686
        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),                             // 687
        weekdays : function (m) {                                                                                      // 688
            return this._weekdays[m.day()];                                                                            // 689
        },                                                                                                             // 690
                                                                                                                       // 691
        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),                                                     // 692
        weekdaysShort : function (m) {                                                                                 // 693
            return this._weekdaysShort[m.day()];                                                                       // 694
        },                                                                                                             // 695
                                                                                                                       // 696
        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),                                                              // 697
        weekdaysMin : function (m) {                                                                                   // 698
            return this._weekdaysMin[m.day()];                                                                         // 699
        },                                                                                                             // 700
                                                                                                                       // 701
        weekdaysParse : function (weekdayName) {                                                                       // 702
            var i, mom, regex;                                                                                         // 703
                                                                                                                       // 704
            if (!this._weekdaysParse) {                                                                                // 705
                this._weekdaysParse = [];                                                                              // 706
            }                                                                                                          // 707
                                                                                                                       // 708
            for (i = 0; i < 7; i++) {                                                                                  // 709
                // make the regex if we don't have it already                                                          // 710
                if (!this._weekdaysParse[i]) {                                                                         // 711
                    mom = moment([2000, 1]).day(i);                                                                    // 712
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');                                  // 714
                }                                                                                                      // 715
                // test the regex                                                                                      // 716
                if (this._weekdaysParse[i].test(weekdayName)) {                                                        // 717
                    return i;                                                                                          // 718
                }                                                                                                      // 719
            }                                                                                                          // 720
        },                                                                                                             // 721
                                                                                                                       // 722
        _longDateFormat : {                                                                                            // 723
            LT : "h:mm A",                                                                                             // 724
            L : "MM/DD/YYYY",                                                                                          // 725
            LL : "MMMM D YYYY",                                                                                        // 726
            LLL : "MMMM D YYYY LT",                                                                                    // 727
            LLLL : "dddd, MMMM D YYYY LT"                                                                              // 728
        },                                                                                                             // 729
        longDateFormat : function (key) {                                                                              // 730
            var output = this._longDateFormat[key];                                                                    // 731
            if (!output && this._longDateFormat[key.toUpperCase()]) {                                                  // 732
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {          // 733
                    return val.slice(1);                                                                               // 734
                });                                                                                                    // 735
                this._longDateFormat[key] = output;                                                                    // 736
            }                                                                                                          // 737
            return output;                                                                                             // 738
        },                                                                                                             // 739
                                                                                                                       // 740
        isPM : function (input) {                                                                                      // 741
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays                         // 742
            // Using charAt should be more compatible.                                                                 // 743
            return ((input + '').toLowerCase().charAt(0) === 'p');                                                     // 744
        },                                                                                                             // 745
                                                                                                                       // 746
        _meridiemParse : /[ap]\.?m?\.?/i,                                                                              // 747
        meridiem : function (hours, minutes, isLower) {                                                                // 748
            if (hours > 11) {                                                                                          // 749
                return isLower ? 'pm' : 'PM';                                                                          // 750
            } else {                                                                                                   // 751
                return isLower ? 'am' : 'AM';                                                                          // 752
            }                                                                                                          // 753
        },                                                                                                             // 754
                                                                                                                       // 755
        _calendar : {                                                                                                  // 756
            sameDay : '[Today at] LT',                                                                                 // 757
            nextDay : '[Tomorrow at] LT',                                                                              // 758
            nextWeek : 'dddd [at] LT',                                                                                 // 759
            lastDay : '[Yesterday at] LT',                                                                             // 760
            lastWeek : '[Last] dddd [at] LT',                                                                          // 761
            sameElse : 'L'                                                                                             // 762
        },                                                                                                             // 763
        calendar : function (key, mom) {                                                                               // 764
            var output = this._calendar[key];                                                                          // 765
            return typeof output === 'function' ? output.apply(mom) : output;                                          // 766
        },                                                                                                             // 767
                                                                                                                       // 768
        _relativeTime : {                                                                                              // 769
            future : "in %s",                                                                                          // 770
            past : "%s ago",                                                                                           // 771
            s : "a few seconds",                                                                                       // 772
            m : "a minute",                                                                                            // 773
            mm : "%d minutes",                                                                                         // 774
            h : "an hour",                                                                                             // 775
            hh : "%d hours",                                                                                           // 776
            d : "a day",                                                                                               // 777
            dd : "%d days",                                                                                            // 778
            M : "a month",                                                                                             // 779
            MM : "%d months",                                                                                          // 780
            y : "a year",                                                                                              // 781
            yy : "%d years"                                                                                            // 782
        },                                                                                                             // 783
        relativeTime : function (number, withoutSuffix, string, isFuture) {                                            // 784
            var output = this._relativeTime[string];                                                                   // 785
            return (typeof output === 'function') ?                                                                    // 786
                output(number, withoutSuffix, string, isFuture) :                                                      // 787
                output.replace(/%d/i, number);                                                                         // 788
        },                                                                                                             // 789
        pastFuture : function (diff, output) {                                                                         // 790
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];                                             // 791
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);                      // 792
        },                                                                                                             // 793
                                                                                                                       // 794
        ordinal : function (number) {                                                                                  // 795
            return this._ordinal.replace("%d", number);                                                                // 796
        },                                                                                                             // 797
        _ordinal : "%d",                                                                                               // 798
                                                                                                                       // 799
        preparse : function (string) {                                                                                 // 800
            return string;                                                                                             // 801
        },                                                                                                             // 802
                                                                                                                       // 803
        postformat : function (string) {                                                                               // 804
            return string;                                                                                             // 805
        },                                                                                                             // 806
                                                                                                                       // 807
        week : function (mom) {                                                                                        // 808
            return weekOfYear(mom, this._week.dow, this._week.doy).week;                                               // 809
        },                                                                                                             // 810
                                                                                                                       // 811
        _week : {                                                                                                      // 812
            dow : 0, // Sunday is the first day of the week.                                                           // 813
            doy : 6  // The week that contains Jan 1st is the first week of the year.                                  // 814
        },                                                                                                             // 815
                                                                                                                       // 816
        _invalidDate: 'Invalid date',                                                                                  // 817
        invalidDate: function () {                                                                                     // 818
            return this._invalidDate;                                                                                  // 819
        }                                                                                                              // 820
    });                                                                                                                // 821
                                                                                                                       // 822
    // Loads a language definition into the `languages` cache.  The function                                           // 823
    // takes a key and optionally values.  If not in the browser and no values                                         // 824
    // are provided, it will load the language file module.  As a convenience,                                         // 825
    // this function also returns the language values.                                                                 // 826
    function loadLang(key, values) {                                                                                   // 827
        values.abbr = key;                                                                                             // 828
        if (!languages[key]) {                                                                                         // 829
            languages[key] = new Language();                                                                           // 830
        }                                                                                                              // 831
        languages[key].set(values);                                                                                    // 832
        return languages[key];                                                                                         // 833
    }                                                                                                                  // 834
                                                                                                                       // 835
    // Remove a language from the `languages` cache. Mostly useful in tests.                                           // 836
    function unloadLang(key) {                                                                                         // 837
        delete languages[key];                                                                                         // 838
    }                                                                                                                  // 839
                                                                                                                       // 840
    // Determines which language definition to use and returns it.                                                     // 841
    //                                                                                                                 // 842
    // With no parameters, it will return the global language.  If you                                                 // 843
    // pass in a language key, such as 'en', it will return the                                                        // 844
    // definition for 'en', so long as 'en' has already been loaded using                                              // 845
    // moment.lang.                                                                                                    // 846
    function getLangDefinition(key) {                                                                                  // 847
        var i = 0, j, lang, next, split,                                                                               // 848
            get = function (k) {                                                                                       // 849
                if (!languages[k] && hasModule) {                                                                      // 850
                    try {                                                                                              // 851
                        require('./lang/' + k);                                                                        // 852
                    } catch (e) { }                                                                                    // 853
                }                                                                                                      // 854
                return languages[k];                                                                                   // 855
            };                                                                                                         // 856
                                                                                                                       // 857
        if (!key) {                                                                                                    // 858
            return moment.fn._lang;                                                                                    // 859
        }                                                                                                              // 860
                                                                                                                       // 861
        if (!isArray(key)) {                                                                                           // 862
            //short-circuit everything else                                                                            // 863
            lang = get(key);                                                                                           // 864
            if (lang) {                                                                                                // 865
                return lang;                                                                                           // 866
            }                                                                                                          // 867
            key = [key];                                                                                               // 868
        }                                                                                                              // 869
                                                                                                                       // 870
        //pick the language from the array                                                                             // 871
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each                    // 872
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {                                                                                       // 874
            split = normalizeLanguage(key[i]).split('-');                                                              // 875
            j = split.length;                                                                                          // 876
            next = normalizeLanguage(key[i + 1]);                                                                      // 877
            next = next ? next.split('-') : null;                                                                      // 878
            while (j > 0) {                                                                                            // 879
                lang = get(split.slice(0, j).join('-'));                                                               // 880
                if (lang) {                                                                                            // 881
                    return lang;                                                                                       // 882
                }                                                                                                      // 883
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {                           // 884
                    //the next array item is better than a shallower substring of this one                             // 885
                    break;                                                                                             // 886
                }                                                                                                      // 887
                j--;                                                                                                   // 888
            }                                                                                                          // 889
            i++;                                                                                                       // 890
        }                                                                                                              // 891
        return moment.fn._lang;                                                                                        // 892
    }                                                                                                                  // 893
                                                                                                                       // 894
    /************************************                                                                              // 895
        Formatting                                                                                                     // 896
    ************************************/                                                                              // 897
                                                                                                                       // 898
                                                                                                                       // 899
    function removeFormattingTokens(input) {                                                                           // 900
        if (input.match(/\[[\s\S]/)) {                                                                                 // 901
            return input.replace(/^\[|\]$/g, "");                                                                      // 902
        }                                                                                                              // 903
        return input.replace(/\\/g, "");                                                                               // 904
    }                                                                                                                  // 905
                                                                                                                       // 906
    function makeFormatFunction(format) {                                                                              // 907
        var array = format.match(formattingTokens), i, length;                                                         // 908
                                                                                                                       // 909
        for (i = 0, length = array.length; i < length; i++) {                                                          // 910
            if (formatTokenFunctions[array[i]]) {                                                                      // 911
                array[i] = formatTokenFunctions[array[i]];                                                             // 912
            } else {                                                                                                   // 913
                array[i] = removeFormattingTokens(array[i]);                                                           // 914
            }                                                                                                          // 915
        }                                                                                                              // 916
                                                                                                                       // 917
        return function (mom) {                                                                                        // 918
            var output = "";                                                                                           // 919
            for (i = 0; i < length; i++) {                                                                             // 920
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];                        // 921
            }                                                                                                          // 922
            return output;                                                                                             // 923
        };                                                                                                             // 924
    }                                                                                                                  // 925
                                                                                                                       // 926
    // format date using native date object                                                                            // 927
    function formatMoment(m, format) {                                                                                 // 928
                                                                                                                       // 929
        if (!m.isValid()) {                                                                                            // 930
            return m.lang().invalidDate();                                                                             // 931
        }                                                                                                              // 932
                                                                                                                       // 933
        format = expandFormat(format, m.lang());                                                                       // 934
                                                                                                                       // 935
        if (!formatFunctions[format]) {                                                                                // 936
            formatFunctions[format] = makeFormatFunction(format);                                                      // 937
        }                                                                                                              // 938
                                                                                                                       // 939
        return formatFunctions[format](m);                                                                             // 940
    }                                                                                                                  // 941
                                                                                                                       // 942
    function expandFormat(format, lang) {                                                                              // 943
        var i = 5;                                                                                                     // 944
                                                                                                                       // 945
        function replaceLongDateFormatTokens(input) {                                                                  // 946
            return lang.longDateFormat(input) || input;                                                                // 947
        }                                                                                                              // 948
                                                                                                                       // 949
        localFormattingTokens.lastIndex = 0;                                                                           // 950
        while (i >= 0 && localFormattingTokens.test(format)) {                                                         // 951
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);                               // 952
            localFormattingTokens.lastIndex = 0;                                                                       // 953
            i -= 1;                                                                                                    // 954
        }                                                                                                              // 955
                                                                                                                       // 956
        return format;                                                                                                 // 957
    }                                                                                                                  // 958
                                                                                                                       // 959
                                                                                                                       // 960
    /************************************                                                                              // 961
        Parsing                                                                                                        // 962
    ************************************/                                                                              // 963
                                                                                                                       // 964
                                                                                                                       // 965
    // get the regex to find the next token                                                                            // 966
    function getParseRegexForToken(token, config) {                                                                    // 967
        var a, strict = config._strict;                                                                                // 968
        switch (token) {                                                                                               // 969
        case 'Q':                                                                                                      // 970
            return parseTokenOneDigit;                                                                                 // 971
        case 'DDDD':                                                                                                   // 972
            return parseTokenThreeDigits;                                                                              // 973
        case 'YYYY':                                                                                                   // 974
        case 'GGGG':                                                                                                   // 975
        case 'gggg':                                                                                                   // 976
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;                                          // 977
        case 'Y':                                                                                                      // 978
        case 'G':                                                                                                      // 979
        case 'g':                                                                                                      // 980
            return parseTokenSignedNumber;                                                                             // 981
        case 'YYYYYY':                                                                                                 // 982
        case 'YYYYY':                                                                                                  // 983
        case 'GGGGG':                                                                                                  // 984
        case 'ggggg':                                                                                                  // 985
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;                                            // 986
        case 'S':                                                                                                      // 987
            if (strict) { return parseTokenOneDigit; }                                                                 // 988
            /* falls through */                                                                                        // 989
        case 'SS':                                                                                                     // 990
            if (strict) { return parseTokenTwoDigits; }                                                                // 991
            /* falls through */                                                                                        // 992
        case 'SSS':                                                                                                    // 993
            if (strict) { return parseTokenThreeDigits; }                                                              // 994
            /* falls through */                                                                                        // 995
        case 'DDD':                                                                                                    // 996
            return parseTokenOneToThreeDigits;                                                                         // 997
        case 'MMM':                                                                                                    // 998
        case 'MMMM':                                                                                                   // 999
        case 'dd':                                                                                                     // 1000
        case 'ddd':                                                                                                    // 1001
        case 'dddd':                                                                                                   // 1002
            return parseTokenWord;                                                                                     // 1003
        case 'a':                                                                                                      // 1004
        case 'A':                                                                                                      // 1005
            return getLangDefinition(config._l)._meridiemParse;                                                        // 1006
        case 'X':                                                                                                      // 1007
            return parseTokenTimestampMs;                                                                              // 1008
        case 'Z':                                                                                                      // 1009
        case 'ZZ':                                                                                                     // 1010
            return parseTokenTimezone;                                                                                 // 1011
        case 'T':                                                                                                      // 1012
            return parseTokenT;                                                                                        // 1013
        case 'SSSS':                                                                                                   // 1014
            return parseTokenDigits;                                                                                   // 1015
        case 'MM':                                                                                                     // 1016
        case 'DD':                                                                                                     // 1017
        case 'YY':                                                                                                     // 1018
        case 'GG':                                                                                                     // 1019
        case 'gg':                                                                                                     // 1020
        case 'HH':                                                                                                     // 1021
        case 'hh':                                                                                                     // 1022
        case 'mm':                                                                                                     // 1023
        case 'ss':                                                                                                     // 1024
        case 'ww':                                                                                                     // 1025
        case 'WW':                                                                                                     // 1026
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;                                            // 1027
        case 'M':                                                                                                      // 1028
        case 'D':                                                                                                      // 1029
        case 'd':                                                                                                      // 1030
        case 'H':                                                                                                      // 1031
        case 'h':                                                                                                      // 1032
        case 'm':                                                                                                      // 1033
        case 's':                                                                                                      // 1034
        case 'w':                                                                                                      // 1035
        case 'W':                                                                                                      // 1036
        case 'e':                                                                                                      // 1037
        case 'E':                                                                                                      // 1038
            return parseTokenOneOrTwoDigits;                                                                           // 1039
        case 'Do':                                                                                                     // 1040
            return parseTokenOrdinal;                                                                                  // 1041
        default :                                                                                                      // 1042
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));                                // 1043
            return a;                                                                                                  // 1044
        }                                                                                                              // 1045
    }                                                                                                                  // 1046
                                                                                                                       // 1047
    function timezoneMinutesFromString(string) {                                                                       // 1048
        string = string || "";                                                                                         // 1049
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),                                              // 1050
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],                                           // 1051
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],                                         // 1052
            minutes = +(parts[1] * 60) + toInt(parts[2]);                                                              // 1053
                                                                                                                       // 1054
        return parts[0] === '+' ? -minutes : minutes;                                                                  // 1055
    }                                                                                                                  // 1056
                                                                                                                       // 1057
    // function to convert string input to date                                                                        // 1058
    function addTimeToArrayFromToken(token, input, config) {                                                           // 1059
        var a, datePartArray = config._a;                                                                              // 1060
                                                                                                                       // 1061
        switch (token) {                                                                                               // 1062
        // QUARTER                                                                                                     // 1063
        case 'Q':                                                                                                      // 1064
            if (input != null) {                                                                                       // 1065
                datePartArray[MONTH] = (toInt(input) - 1) * 3;                                                         // 1066
            }                                                                                                          // 1067
            break;                                                                                                     // 1068
        // MONTH                                                                                                       // 1069
        case 'M' : // fall through to MM                                                                               // 1070
        case 'MM' :                                                                                                    // 1071
            if (input != null) {                                                                                       // 1072
                datePartArray[MONTH] = toInt(input) - 1;                                                               // 1073
            }                                                                                                          // 1074
            break;                                                                                                     // 1075
        case 'MMM' : // fall through to MMMM                                                                           // 1076
        case 'MMMM' :                                                                                                  // 1077
            a = getLangDefinition(config._l).monthsParse(input);                                                       // 1078
            // if we didn't find a month name, mark the date as invalid.                                               // 1079
            if (a != null) {                                                                                           // 1080
                datePartArray[MONTH] = a;                                                                              // 1081
            } else {                                                                                                   // 1082
                config._pf.invalidMonth = input;                                                                       // 1083
            }                                                                                                          // 1084
            break;                                                                                                     // 1085
        // DAY OF MONTH                                                                                                // 1086
        case 'D' : // fall through to DD                                                                               // 1087
        case 'DD' :                                                                                                    // 1088
            if (input != null) {                                                                                       // 1089
                datePartArray[DATE] = toInt(input);                                                                    // 1090
            }                                                                                                          // 1091
            break;                                                                                                     // 1092
        case 'Do' :                                                                                                    // 1093
            if (input != null) {                                                                                       // 1094
                datePartArray[DATE] = toInt(parseInt(input, 10));                                                      // 1095
            }                                                                                                          // 1096
            break;                                                                                                     // 1097
        // DAY OF YEAR                                                                                                 // 1098
        case 'DDD' : // fall through to DDDD                                                                           // 1099
        case 'DDDD' :                                                                                                  // 1100
            if (input != null) {                                                                                       // 1101
                config._dayOfYear = toInt(input);                                                                      // 1102
            }                                                                                                          // 1103
                                                                                                                       // 1104
            break;                                                                                                     // 1105
        // YEAR                                                                                                        // 1106
        case 'YY' :                                                                                                    // 1107
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);                                                     // 1108
            break;                                                                                                     // 1109
        case 'YYYY' :                                                                                                  // 1110
        case 'YYYYY' :                                                                                                 // 1111
        case 'YYYYYY' :                                                                                                // 1112
            datePartArray[YEAR] = toInt(input);                                                                        // 1113
            break;                                                                                                     // 1114
        // AM / PM                                                                                                     // 1115
        case 'a' : // fall through to A                                                                                // 1116
        case 'A' :                                                                                                     // 1117
            config._isPm = getLangDefinition(config._l).isPM(input);                                                   // 1118
            break;                                                                                                     // 1119
        // 24 HOUR                                                                                                     // 1120
        case 'H' : // fall through to hh                                                                               // 1121
        case 'HH' : // fall through to hh                                                                              // 1122
        case 'h' : // fall through to hh                                                                               // 1123
        case 'hh' :                                                                                                    // 1124
            datePartArray[HOUR] = toInt(input);                                                                        // 1125
            break;                                                                                                     // 1126
        // MINUTE                                                                                                      // 1127
        case 'm' : // fall through to mm                                                                               // 1128
        case 'mm' :                                                                                                    // 1129
            datePartArray[MINUTE] = toInt(input);                                                                      // 1130
            break;                                                                                                     // 1131
        // SECOND                                                                                                      // 1132
        case 's' : // fall through to ss                                                                               // 1133
        case 'ss' :                                                                                                    // 1134
            datePartArray[SECOND] = toInt(input);                                                                      // 1135
            break;                                                                                                     // 1136
        // MILLISECOND                                                                                                 // 1137
        case 'S' :                                                                                                     // 1138
        case 'SS' :                                                                                                    // 1139
        case 'SSS' :                                                                                                   // 1140
        case 'SSSS' :                                                                                                  // 1141
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);                                                 // 1142
            break;                                                                                                     // 1143
        // UNIX TIMESTAMP WITH MS                                                                                      // 1144
        case 'X':                                                                                                      // 1145
            config._d = new Date(parseFloat(input) * 1000);                                                            // 1146
            break;                                                                                                     // 1147
        // TIMEZONE                                                                                                    // 1148
        case 'Z' : // fall through to ZZ                                                                               // 1149
        case 'ZZ' :                                                                                                    // 1150
            config._useUTC = true;                                                                                     // 1151
            config._tzm = timezoneMinutesFromString(input);                                                            // 1152
            break;                                                                                                     // 1153
        case 'w':                                                                                                      // 1154
        case 'ww':                                                                                                     // 1155
        case 'W':                                                                                                      // 1156
        case 'WW':                                                                                                     // 1157
        case 'd':                                                                                                      // 1158
        case 'dd':                                                                                                     // 1159
        case 'ddd':                                                                                                    // 1160
        case 'dddd':                                                                                                   // 1161
        case 'e':                                                                                                      // 1162
        case 'E':                                                                                                      // 1163
            token = token.substr(0, 1);                                                                                // 1164
            /* falls through */                                                                                        // 1165
        case 'gg':                                                                                                     // 1166
        case 'gggg':                                                                                                   // 1167
        case 'GG':                                                                                                     // 1168
        case 'GGGG':                                                                                                   // 1169
        case 'GGGGG':                                                                                                  // 1170
            token = token.substr(0, 2);                                                                                // 1171
            if (input) {                                                                                               // 1172
                config._w = config._w || {};                                                                           // 1173
                config._w[token] = input;                                                                              // 1174
            }                                                                                                          // 1175
            break;                                                                                                     // 1176
        }                                                                                                              // 1177
    }                                                                                                                  // 1178
                                                                                                                       // 1179
    // convert an array to a date.                                                                                     // 1180
    // the array should mirror the parameters below                                                                    // 1181
    // note: all values past the year are optional and will default to the lowest possible value.                      // 1182
    // [year, month, day , hour, minute, second, millisecond]                                                          // 1183
    function dateFromConfig(config) {                                                                                  // 1184
        var i, date, input = [], currentDate,                                                                          // 1185
            yearToUse, fixYear, w, temp, lang, weekday, week;                                                          // 1186
                                                                                                                       // 1187
        if (config._d) {                                                                                               // 1188
            return;                                                                                                    // 1189
        }                                                                                                              // 1190
                                                                                                                       // 1191
        currentDate = currentDateArray(config);                                                                        // 1192
                                                                                                                       // 1193
        //compute day of the year from weeks and weekdays                                                              // 1194
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {                                        // 1195
            fixYear = function (val) {                                                                                 // 1196
                var intVal = parseInt(val, 10);                                                                        // 1197
                return val ?                                                                                           // 1198
                  (val.length < 3 ? (intVal > 68 ? 1900 + intVal : 2000 + intVal) : intVal) :                          // 1199
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);                                   // 1200
            };                                                                                                         // 1201
                                                                                                                       // 1202
            w = config._w;                                                                                             // 1203
            if (w.GG != null || w.W != null || w.E != null) {                                                          // 1204
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);                                         // 1205
            }                                                                                                          // 1206
            else {                                                                                                     // 1207
                lang = getLangDefinition(config._l);                                                                   // 1208
                weekday = w.d != null ?  parseWeekday(w.d, lang) :                                                     // 1209
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);                                             // 1210
                                                                                                                       // 1211
                week = parseInt(w.w, 10) || 1;                                                                         // 1212
                                                                                                                       // 1213
                //if we're parsing 'd', then the low day numbers may be next week                                      // 1214
                if (w.d != null && weekday < lang._week.dow) {                                                         // 1215
                    week++;                                                                                            // 1216
                }                                                                                                      // 1217
                                                                                                                       // 1218
                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);               // 1219
            }                                                                                                          // 1220
                                                                                                                       // 1221
            config._a[YEAR] = temp.year;                                                                               // 1222
            config._dayOfYear = temp.dayOfYear;                                                                        // 1223
        }                                                                                                              // 1224
                                                                                                                       // 1225
        //if the day of the year is set, figure out what it is                                                         // 1226
        if (config._dayOfYear) {                                                                                       // 1227
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];                                 // 1228
                                                                                                                       // 1229
            if (config._dayOfYear > daysInYear(yearToUse)) {                                                           // 1230
                config._pf._overflowDayOfYear = true;                                                                  // 1231
            }                                                                                                          // 1232
                                                                                                                       // 1233
            date = makeUTCDate(yearToUse, 0, config._dayOfYear);                                                       // 1234
            config._a[MONTH] = date.getUTCMonth();                                                                     // 1235
            config._a[DATE] = date.getUTCDate();                                                                       // 1236
        }                                                                                                              // 1237
                                                                                                                       // 1238
        // Default to current date.                                                                                    // 1239
        // * if no year, month, day of month are given, default to today                                               // 1240
        // * if day of month is given, default month and year                                                          // 1241
        // * if month is given, default only year                                                                      // 1242
        // * if year is given, don't default anything                                                                  // 1243
        for (i = 0; i < 3 && config._a[i] == null; ++i) {                                                              // 1244
            config._a[i] = input[i] = currentDate[i];                                                                  // 1245
        }                                                                                                              // 1246
                                                                                                                       // 1247
        // Zero out whatever was not defaulted, including time                                                         // 1248
        for (; i < 7; i++) {                                                                                           // 1249
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];                       // 1250
        }                                                                                                              // 1251
                                                                                                                       // 1252
        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid             // 1253
        input[HOUR] += toInt((config._tzm || 0) / 60);                                                                 // 1254
        input[MINUTE] += toInt((config._tzm || 0) % 60);                                                               // 1255
                                                                                                                       // 1256
        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);                                      // 1257
    }                                                                                                                  // 1258
                                                                                                                       // 1259
    function dateFromObject(config) {                                                                                  // 1260
        var normalizedInput;                                                                                           // 1261
                                                                                                                       // 1262
        if (config._d) {                                                                                               // 1263
            return;                                                                                                    // 1264
        }                                                                                                              // 1265
                                                                                                                       // 1266
        normalizedInput = normalizeObjectUnits(config._i);                                                             // 1267
        config._a = [                                                                                                  // 1268
            normalizedInput.year,                                                                                      // 1269
            normalizedInput.month,                                                                                     // 1270
            normalizedInput.day,                                                                                       // 1271
            normalizedInput.hour,                                                                                      // 1272
            normalizedInput.minute,                                                                                    // 1273
            normalizedInput.second,                                                                                    // 1274
            normalizedInput.millisecond                                                                                // 1275
        ];                                                                                                             // 1276
                                                                                                                       // 1277
        dateFromConfig(config);                                                                                        // 1278
    }                                                                                                                  // 1279
                                                                                                                       // 1280
    function currentDateArray(config) {                                                                                // 1281
        var now = new Date();                                                                                          // 1282
        if (config._useUTC) {                                                                                          // 1283
            return [                                                                                                   // 1284
                now.getUTCFullYear(),                                                                                  // 1285
                now.getUTCMonth(),                                                                                     // 1286
                now.getUTCDate()                                                                                       // 1287
            ];                                                                                                         // 1288
        } else {                                                                                                       // 1289
            return [now.getFullYear(), now.getMonth(), now.getDate()];                                                 // 1290
        }                                                                                                              // 1291
    }                                                                                                                  // 1292
                                                                                                                       // 1293
    // date from string and format string                                                                              // 1294
    function makeDateFromStringAndFormat(config) {                                                                     // 1295
                                                                                                                       // 1296
        config._a = [];                                                                                                // 1297
        config._pf.empty = true;                                                                                       // 1298
                                                                                                                       // 1299
        // This array is used to make a Date, either with `new Date` or `Date.UTC`                                     // 1300
        var lang = getLangDefinition(config._l),                                                                       // 1301
            string = '' + config._i,                                                                                   // 1302
            i, parsedInput, tokens, token, skipped,                                                                    // 1303
            stringLength = string.length,                                                                              // 1304
            totalParsedInputLength = 0;                                                                                // 1305
                                                                                                                       // 1306
        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];                                          // 1307
                                                                                                                       // 1308
        for (i = 0; i < tokens.length; i++) {                                                                          // 1309
            token = tokens[i];                                                                                         // 1310
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];                               // 1311
            if (parsedInput) {                                                                                         // 1312
                skipped = string.substr(0, string.indexOf(parsedInput));                                               // 1313
                if (skipped.length > 0) {                                                                              // 1314
                    config._pf.unusedInput.push(skipped);                                                              // 1315
                }                                                                                                      // 1316
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);                               // 1317
                totalParsedInputLength += parsedInput.length;                                                          // 1318
            }                                                                                                          // 1319
            // don't parse if it's not a known token                                                                   // 1320
            if (formatTokenFunctions[token]) {                                                                         // 1321
                if (parsedInput) {                                                                                     // 1322
                    config._pf.empty = false;                                                                          // 1323
                }                                                                                                      // 1324
                else {                                                                                                 // 1325
                    config._pf.unusedTokens.push(token);                                                               // 1326
                }                                                                                                      // 1327
                addTimeToArrayFromToken(token, parsedInput, config);                                                   // 1328
            }                                                                                                          // 1329
            else if (config._strict && !parsedInput) {                                                                 // 1330
                config._pf.unusedTokens.push(token);                                                                   // 1331
            }                                                                                                          // 1332
        }                                                                                                              // 1333
                                                                                                                       // 1334
        // add remaining unparsed input length to the string                                                           // 1335
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;                                              // 1336
        if (string.length > 0) {                                                                                       // 1337
            config._pf.unusedInput.push(string);                                                                       // 1338
        }                                                                                                              // 1339
                                                                                                                       // 1340
        // handle am pm                                                                                                // 1341
        if (config._isPm && config._a[HOUR] < 12) {                                                                    // 1342
            config._a[HOUR] += 12;                                                                                     // 1343
        }                                                                                                              // 1344
        // if is 12 am, change hours to 0                                                                              // 1345
        if (config._isPm === false && config._a[HOUR] === 12) {                                                        // 1346
            config._a[HOUR] = 0;                                                                                       // 1347
        }                                                                                                              // 1348
                                                                                                                       // 1349
        dateFromConfig(config);                                                                                        // 1350
        checkOverflow(config);                                                                                         // 1351
    }                                                                                                                  // 1352
                                                                                                                       // 1353
    function unescapeFormat(s) {                                                                                       // 1354
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {                   // 1355
            return p1 || p2 || p3 || p4;                                                                               // 1356
        });                                                                                                            // 1357
    }                                                                                                                  // 1358
                                                                                                                       // 1359
    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript            // 1360
    function regexpEscape(s) {                                                                                         // 1361
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                                                            // 1362
    }                                                                                                                  // 1363
                                                                                                                       // 1364
    // date from string and array of format strings                                                                    // 1365
    function makeDateFromStringAndArray(config) {                                                                      // 1366
        var tempConfig,                                                                                                // 1367
            bestMoment,                                                                                                // 1368
                                                                                                                       // 1369
            scoreToBeat,                                                                                               // 1370
            i,                                                                                                         // 1371
            currentScore;                                                                                              // 1372
                                                                                                                       // 1373
        if (config._f.length === 0) {                                                                                  // 1374
            config._pf.invalidFormat = true;                                                                           // 1375
            config._d = new Date(NaN);                                                                                 // 1376
            return;                                                                                                    // 1377
        }                                                                                                              // 1378
                                                                                                                       // 1379
        for (i = 0; i < config._f.length; i++) {                                                                       // 1380
            currentScore = 0;                                                                                          // 1381
            tempConfig = extend({}, config);                                                                           // 1382
            tempConfig._pf = defaultParsingFlags();                                                                    // 1383
            tempConfig._f = config._f[i];                                                                              // 1384
            makeDateFromStringAndFormat(tempConfig);                                                                   // 1385
                                                                                                                       // 1386
            if (!isValid(tempConfig)) {                                                                                // 1387
                continue;                                                                                              // 1388
            }                                                                                                          // 1389
                                                                                                                       // 1390
            // if there is any input that was not parsed add a penalty for that format                                 // 1391
            currentScore += tempConfig._pf.charsLeftOver;                                                              // 1392
                                                                                                                       // 1393
            //or tokens                                                                                                // 1394
            currentScore += tempConfig._pf.unusedTokens.length * 10;                                                   // 1395
                                                                                                                       // 1396
            tempConfig._pf.score = currentScore;                                                                       // 1397
                                                                                                                       // 1398
            if (scoreToBeat == null || currentScore < scoreToBeat) {                                                   // 1399
                scoreToBeat = currentScore;                                                                            // 1400
                bestMoment = tempConfig;                                                                               // 1401
            }                                                                                                          // 1402
        }                                                                                                              // 1403
                                                                                                                       // 1404
        extend(config, bestMoment || tempConfig);                                                                      // 1405
    }                                                                                                                  // 1406
                                                                                                                       // 1407
    // date from iso format                                                                                            // 1408
    function makeDateFromString(config) {                                                                              // 1409
        var i, l,                                                                                                      // 1410
            string = config._i,                                                                                        // 1411
            match = isoRegex.exec(string);                                                                             // 1412
                                                                                                                       // 1413
        if (match) {                                                                                                   // 1414
            config._pf.iso = true;                                                                                     // 1415
            for (i = 0, l = isoDates.length; i < l; i++) {                                                             // 1416
                if (isoDates[i][1].exec(string)) {                                                                     // 1417
                    // match[5] should be "T" or undefined                                                             // 1418
                    config._f = isoDates[i][0] + (match[6] || " ");                                                    // 1419
                    break;                                                                                             // 1420
                }                                                                                                      // 1421
            }                                                                                                          // 1422
            for (i = 0, l = isoTimes.length; i < l; i++) {                                                             // 1423
                if (isoTimes[i][1].exec(string)) {                                                                     // 1424
                    config._f += isoTimes[i][0];                                                                       // 1425
                    break;                                                                                             // 1426
                }                                                                                                      // 1427
            }                                                                                                          // 1428
            if (string.match(parseTokenTimezone)) {                                                                    // 1429
                config._f += "Z";                                                                                      // 1430
            }                                                                                                          // 1431
            makeDateFromStringAndFormat(config);                                                                       // 1432
        }                                                                                                              // 1433
        else {                                                                                                         // 1434
            moment.createFromInputFallback(config);                                                                    // 1435
        }                                                                                                              // 1436
    }                                                                                                                  // 1437
                                                                                                                       // 1438
    function makeDateFromInput(config) {                                                                               // 1439
        var input = config._i,                                                                                         // 1440
            matched = aspNetJsonRegex.exec(input);                                                                     // 1441
                                                                                                                       // 1442
        if (input === undefined) {                                                                                     // 1443
            config._d = new Date();                                                                                    // 1444
        } else if (matched) {                                                                                          // 1445
            config._d = new Date(+matched[1]);                                                                         // 1446
        } else if (typeof input === 'string') {                                                                        // 1447
            makeDateFromString(config);                                                                                // 1448
        } else if (isArray(input)) {                                                                                   // 1449
            config._a = input.slice(0);                                                                                // 1450
            dateFromConfig(config);                                                                                    // 1451
        } else if (isDate(input)) {                                                                                    // 1452
            config._d = new Date(+input);                                                                              // 1453
        } else if (typeof(input) === 'object') {                                                                       // 1454
            dateFromObject(config);                                                                                    // 1455
        } else if (typeof(input) === 'number') {                                                                       // 1456
            // from milliseconds                                                                                       // 1457
            config._d = new Date(input);                                                                               // 1458
        } else {                                                                                                       // 1459
            moment.createFromInputFallback(config);                                                                    // 1460
        }                                                                                                              // 1461
    }                                                                                                                  // 1462
                                                                                                                       // 1463
    function makeDate(y, m, d, h, M, s, ms) {                                                                          // 1464
        //can't just apply() to create a date:                                                                         // 1465
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);                                                                     // 1467
                                                                                                                       // 1468
        //the date constructor doesn't accept years < 1970                                                             // 1469
        if (y < 1970) {                                                                                                // 1470
            date.setFullYear(y);                                                                                       // 1471
        }                                                                                                              // 1472
        return date;                                                                                                   // 1473
    }                                                                                                                  // 1474
                                                                                                                       // 1475
    function makeUTCDate(y) {                                                                                          // 1476
        var date = new Date(Date.UTC.apply(null, arguments));                                                          // 1477
        if (y < 1970) {                                                                                                // 1478
            date.setUTCFullYear(y);                                                                                    // 1479
        }                                                                                                              // 1480
        return date;                                                                                                   // 1481
    }                                                                                                                  // 1482
                                                                                                                       // 1483
    function parseWeekday(input, language) {                                                                           // 1484
        if (typeof input === 'string') {                                                                               // 1485
            if (!isNaN(input)) {                                                                                       // 1486
                input = parseInt(input, 10);                                                                           // 1487
            }                                                                                                          // 1488
            else {                                                                                                     // 1489
                input = language.weekdaysParse(input);                                                                 // 1490
                if (typeof input !== 'number') {                                                                       // 1491
                    return null;                                                                                       // 1492
                }                                                                                                      // 1493
            }                                                                                                          // 1494
        }                                                                                                              // 1495
        return input;                                                                                                  // 1496
    }                                                                                                                  // 1497
                                                                                                                       // 1498
    /************************************                                                                              // 1499
        Relative Time                                                                                                  // 1500
    ************************************/                                                                              // 1501
                                                                                                                       // 1502
                                                                                                                       // 1503
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize                          // 1504
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {                                        // 1505
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);                                      // 1506
    }                                                                                                                  // 1507
                                                                                                                       // 1508
    function relativeTime(milliseconds, withoutSuffix, lang) {                                                         // 1509
        var seconds = round(Math.abs(milliseconds) / 1000),                                                            // 1510
            minutes = round(seconds / 60),                                                                             // 1511
            hours = round(minutes / 60),                                                                               // 1512
            days = round(hours / 24),                                                                                  // 1513
            years = round(days / 365),                                                                                 // 1514
            args = seconds < 45 && ['s', seconds] ||                                                                   // 1515
                minutes === 1 && ['m'] ||                                                                              // 1516
                minutes < 45 && ['mm', minutes] ||                                                                     // 1517
                hours === 1 && ['h'] ||                                                                                // 1518
                hours < 22 && ['hh', hours] ||                                                                         // 1519
                days === 1 && ['d'] ||                                                                                 // 1520
                days <= 25 && ['dd', days] ||                                                                          // 1521
                days <= 45 && ['M'] ||                                                                                 // 1522
                days < 345 && ['MM', round(days / 30)] ||                                                              // 1523
                years === 1 && ['y'] || ['yy', years];                                                                 // 1524
        args[2] = withoutSuffix;                                                                                       // 1525
        args[3] = milliseconds > 0;                                                                                    // 1526
        args[4] = lang;                                                                                                // 1527
        return substituteTimeAgo.apply({}, args);                                                                      // 1528
    }                                                                                                                  // 1529
                                                                                                                       // 1530
                                                                                                                       // 1531
    /************************************                                                                              // 1532
        Week of Year                                                                                                   // 1533
    ************************************/                                                                              // 1534
                                                                                                                       // 1535
                                                                                                                       // 1536
    // firstDayOfWeek       0 = sun, 6 = sat                                                                           // 1537
    //                      the day of the week that starts the week                                                   // 1538
    //                      (usually sunday or monday)                                                                 // 1539
    // firstDayOfWeekOfYear 0 = sun, 6 = sat                                                                           // 1540
    //                      the first week is the week that contains the first                                         // 1541
    //                      of this day of the week                                                                    // 1542
    //                      (eg. ISO weeks use thursday (4))                                                           // 1543
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {                                                   // 1544
        var end = firstDayOfWeekOfYear - firstDayOfWeek,                                                               // 1545
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),                                                        // 1546
            adjustedMoment;                                                                                            // 1547
                                                                                                                       // 1548
                                                                                                                       // 1549
        if (daysToDayOfWeek > end) {                                                                                   // 1550
            daysToDayOfWeek -= 7;                                                                                      // 1551
        }                                                                                                              // 1552
                                                                                                                       // 1553
        if (daysToDayOfWeek < end - 7) {                                                                               // 1554
            daysToDayOfWeek += 7;                                                                                      // 1555
        }                                                                                                              // 1556
                                                                                                                       // 1557
        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);                                                        // 1558
        return {                                                                                                       // 1559
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),                                                           // 1560
            year: adjustedMoment.year()                                                                                // 1561
        };                                                                                                             // 1562
    }                                                                                                                  // 1563
                                                                                                                       // 1564
    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday          // 1565
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {                           // 1566
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;                                             // 1567
                                                                                                                       // 1568
        weekday = weekday != null ? weekday : firstDayOfWeek;                                                          // 1569
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);            // 1570
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;                                       // 1571
                                                                                                                       // 1572
        return {                                                                                                       // 1573
            year: dayOfYear > 0 ? year : year - 1,                                                                     // 1574
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear                                   // 1575
        };                                                                                                             // 1576
    }                                                                                                                  // 1577
                                                                                                                       // 1578
    /************************************                                                                              // 1579
        Top Level Functions                                                                                            // 1580
    ************************************/                                                                              // 1581
                                                                                                                       // 1582
    function makeMoment(config) {                                                                                      // 1583
        var input = config._i,                                                                                         // 1584
            format = config._f;                                                                                        // 1585
                                                                                                                       // 1586
        if (input === null || (format === undefined && input === '')) {                                                // 1587
            return moment.invalid({nullInput: true});                                                                  // 1588
        }                                                                                                              // 1589
                                                                                                                       // 1590
        if (typeof input === 'string') {                                                                               // 1591
            config._i = input = getLangDefinition().preparse(input);                                                   // 1592
        }                                                                                                              // 1593
                                                                                                                       // 1594
        if (moment.isMoment(input)) {                                                                                  // 1595
            config = cloneMoment(input);                                                                               // 1596
                                                                                                                       // 1597
            config._d = new Date(+input._d);                                                                           // 1598
        } else if (format) {                                                                                           // 1599
            if (isArray(format)) {                                                                                     // 1600
                makeDateFromStringAndArray(config);                                                                    // 1601
            } else {                                                                                                   // 1602
                makeDateFromStringAndFormat(config);                                                                   // 1603
            }                                                                                                          // 1604
        } else {                                                                                                       // 1605
            makeDateFromInput(config);                                                                                 // 1606
        }                                                                                                              // 1607
                                                                                                                       // 1608
        return new Moment(config);                                                                                     // 1609
    }                                                                                                                  // 1610
                                                                                                                       // 1611
    moment = function (input, format, lang, strict) {                                                                  // 1612
        var c;                                                                                                         // 1613
                                                                                                                       // 1614
        if (typeof(lang) === "boolean") {                                                                              // 1615
            strict = lang;                                                                                             // 1616
            lang = undefined;                                                                                          // 1617
        }                                                                                                              // 1618
        // object construction must be done this way.                                                                  // 1619
        // https://github.com/moment/moment/issues/1423                                                                // 1620
        c = {};                                                                                                        // 1621
        c._isAMomentObject = true;                                                                                     // 1622
        c._i = input;                                                                                                  // 1623
        c._f = format;                                                                                                 // 1624
        c._l = lang;                                                                                                   // 1625
        c._strict = strict;                                                                                            // 1626
        c._isUTC = false;                                                                                              // 1627
        c._pf = defaultParsingFlags();                                                                                 // 1628
                                                                                                                       // 1629
        return makeMoment(c);                                                                                          // 1630
    };                                                                                                                 // 1631
                                                                                                                       // 1632
    moment.suppressDeprecationWarnings = false;                                                                        // 1633
                                                                                                                       // 1634
    moment.createFromInputFallback = deprecate(                                                                        // 1635
            "moment construction falls back to js Date. This is " +                                                    // 1636
            "discouraged and will be removed in upcoming major " +                                                     // 1637
            "release. Please refer to " +                                                                              // 1638
            "https://github.com/moment/moment/issues/1407 for more info.",                                             // 1639
            function (config) {                                                                                        // 1640
        config._d = new Date(config._i);                                                                               // 1641
    });                                                                                                                // 1642
                                                                                                                       // 1643
    // creating with utc                                                                                               // 1644
    moment.utc = function (input, format, lang, strict) {                                                              // 1645
        var c;                                                                                                         // 1646
                                                                                                                       // 1647
        if (typeof(lang) === "boolean") {                                                                              // 1648
            strict = lang;                                                                                             // 1649
            lang = undefined;                                                                                          // 1650
        }                                                                                                              // 1651
        // object construction must be done this way.                                                                  // 1652
        // https://github.com/moment/moment/issues/1423                                                                // 1653
        c = {};                                                                                                        // 1654
        c._isAMomentObject = true;                                                                                     // 1655
        c._useUTC = true;                                                                                              // 1656
        c._isUTC = true;                                                                                               // 1657
        c._l = lang;                                                                                                   // 1658
        c._i = input;                                                                                                  // 1659
        c._f = format;                                                                                                 // 1660
        c._strict = strict;                                                                                            // 1661
        c._pf = defaultParsingFlags();                                                                                 // 1662
                                                                                                                       // 1663
        return makeMoment(c).utc();                                                                                    // 1664
    };                                                                                                                 // 1665
                                                                                                                       // 1666
    // creating with unix timestamp (in seconds)                                                                       // 1667
    moment.unix = function (input) {                                                                                   // 1668
        return moment(input * 1000);                                                                                   // 1669
    };                                                                                                                 // 1670
                                                                                                                       // 1671
    // duration                                                                                                        // 1672
    moment.duration = function (input, key) {                                                                          // 1673
        var duration = input,                                                                                          // 1674
            // matching against regexp is expensive, do it on demand                                                   // 1675
            match = null,                                                                                              // 1676
            sign,                                                                                                      // 1677
            ret,                                                                                                       // 1678
            parseIso;                                                                                                  // 1679
                                                                                                                       // 1680
        if (moment.isDuration(input)) {                                                                                // 1681
            duration = {                                                                                               // 1682
                ms: input._milliseconds,                                                                               // 1683
                d: input._days,                                                                                        // 1684
                M: input._months                                                                                       // 1685
            };                                                                                                         // 1686
        } else if (typeof input === 'number') {                                                                        // 1687
            duration = {};                                                                                             // 1688
            if (key) {                                                                                                 // 1689
                duration[key] = input;                                                                                 // 1690
            } else {                                                                                                   // 1691
                duration.milliseconds = input;                                                                         // 1692
            }                                                                                                          // 1693
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {                                                  // 1694
            sign = (match[1] === "-") ? -1 : 1;                                                                        // 1695
            duration = {                                                                                               // 1696
                y: 0,                                                                                                  // 1697
                d: toInt(match[DATE]) * sign,                                                                          // 1698
                h: toInt(match[HOUR]) * sign,                                                                          // 1699
                m: toInt(match[MINUTE]) * sign,                                                                        // 1700
                s: toInt(match[SECOND]) * sign,                                                                        // 1701
                ms: toInt(match[MILLISECOND]) * sign                                                                   // 1702
            };                                                                                                         // 1703
        } else if (!!(match = isoDurationRegex.exec(input))) {                                                         // 1704
            sign = (match[1] === "-") ? -1 : 1;                                                                        // 1705
            parseIso = function (inp) {                                                                                // 1706
                // We'd normally use ~~inp for this, but unfortunately it also                                         // 1707
                // converts floats to ints.                                                                            // 1708
                // inp may be undefined, so careful calling replace on it.                                             // 1709
                var res = inp && parseFloat(inp.replace(',', '.'));                                                    // 1710
                // apply sign while we're at it                                                                        // 1711
                return (isNaN(res) ? 0 : res) * sign;                                                                  // 1712
            };                                                                                                         // 1713
            duration = {                                                                                               // 1714
                y: parseIso(match[2]),                                                                                 // 1715
                M: parseIso(match[3]),                                                                                 // 1716
                d: parseIso(match[4]),                                                                                 // 1717
                h: parseIso(match[5]),                                                                                 // 1718
                m: parseIso(match[6]),                                                                                 // 1719
                s: parseIso(match[7]),                                                                                 // 1720
                w: parseIso(match[8])                                                                                  // 1721
            };                                                                                                         // 1722
        }                                                                                                              // 1723
                                                                                                                       // 1724
        ret = new Duration(duration);                                                                                  // 1725
                                                                                                                       // 1726
        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {                                               // 1727
            ret._lang = input._lang;                                                                                   // 1728
        }                                                                                                              // 1729
                                                                                                                       // 1730
        return ret;                                                                                                    // 1731
    };                                                                                                                 // 1732
                                                                                                                       // 1733
    // version number                                                                                                  // 1734
    moment.version = VERSION;                                                                                          // 1735
                                                                                                                       // 1736
    // default format                                                                                                  // 1737
    moment.defaultFormat = isoFormat;                                                                                  // 1738
                                                                                                                       // 1739
    // Plugins that add properties should also add the key here (null value),                                          // 1740
    // so we can properly clone ourselves.                                                                             // 1741
    moment.momentProperties = momentProperties;                                                                        // 1742
                                                                                                                       // 1743
    // This function will be called whenever a moment is mutated.                                                      // 1744
    // It is intended to keep the offset in sync with the timezone.                                                    // 1745
    moment.updateOffset = function () {};                                                                              // 1746
                                                                                                                       // 1747
    // This function will load languages and then set the global language.  If                                         // 1748
    // no arguments are passed in, it will simply return the current global                                            // 1749
    // language key.                                                                                                   // 1750
    moment.lang = function (key, values) {                                                                             // 1751
        var r;                                                                                                         // 1752
        if (!key) {                                                                                                    // 1753
            return moment.fn._lang._abbr;                                                                              // 1754
        }                                                                                                              // 1755
        if (values) {                                                                                                  // 1756
            loadLang(normalizeLanguage(key), values);                                                                  // 1757
        } else if (values === null) {                                                                                  // 1758
            unloadLang(key);                                                                                           // 1759
            key = 'en';                                                                                                // 1760
        } else if (!languages[key]) {                                                                                  // 1761
            getLangDefinition(key);                                                                                    // 1762
        }                                                                                                              // 1763
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);                                       // 1764
        return r._abbr;                                                                                                // 1765
    };                                                                                                                 // 1766
                                                                                                                       // 1767
    // returns language data                                                                                           // 1768
    moment.langData = function (key) {                                                                                 // 1769
        if (key && key._lang && key._lang._abbr) {                                                                     // 1770
            key = key._lang._abbr;                                                                                     // 1771
        }                                                                                                              // 1772
        return getLangDefinition(key);                                                                                 // 1773
    };                                                                                                                 // 1774
                                                                                                                       // 1775
    // compare moment object                                                                                           // 1776
    moment.isMoment = function (obj) {                                                                                 // 1777
        return obj instanceof Moment ||                                                                                // 1778
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));                                                  // 1779
    };                                                                                                                 // 1780
                                                                                                                       // 1781
    // for typechecking Duration objects                                                                               // 1782
    moment.isDuration = function (obj) {                                                                               // 1783
        return obj instanceof Duration;                                                                                // 1784
    };                                                                                                                 // 1785
                                                                                                                       // 1786
    for (i = lists.length - 1; i >= 0; --i) {                                                                          // 1787
        makeList(lists[i]);                                                                                            // 1788
    }                                                                                                                  // 1789
                                                                                                                       // 1790
    moment.normalizeUnits = function (units) {                                                                         // 1791
        return normalizeUnits(units);                                                                                  // 1792
    };                                                                                                                 // 1793
                                                                                                                       // 1794
    moment.invalid = function (flags) {                                                                                // 1795
        var m = moment.utc(NaN);                                                                                       // 1796
        if (flags != null) {                                                                                           // 1797
            extend(m._pf, flags);                                                                                      // 1798
        }                                                                                                              // 1799
        else {                                                                                                         // 1800
            m._pf.userInvalidated = true;                                                                              // 1801
        }                                                                                                              // 1802
                                                                                                                       // 1803
        return m;                                                                                                      // 1804
    };                                                                                                                 // 1805
                                                                                                                       // 1806
    moment.parseZone = function () {                                                                                   // 1807
        return moment.apply(null, arguments).parseZone();                                                              // 1808
    };                                                                                                                 // 1809
                                                                                                                       // 1810
    moment.parseTwoDigitYear = function (input) {                                                                      // 1811
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);                                                       // 1812
    };                                                                                                                 // 1813
                                                                                                                       // 1814
    /************************************                                                                              // 1815
        Moment Prototype                                                                                               // 1816
    ************************************/                                                                              // 1817
                                                                                                                       // 1818
                                                                                                                       // 1819
    extend(moment.fn = Moment.prototype, {                                                                             // 1820
                                                                                                                       // 1821
        clone : function () {                                                                                          // 1822
            return moment(this);                                                                                       // 1823
        },                                                                                                             // 1824
                                                                                                                       // 1825
        valueOf : function () {                                                                                        // 1826
            return +this._d + ((this._offset || 0) * 60000);                                                           // 1827
        },                                                                                                             // 1828
                                                                                                                       // 1829
        unix : function () {                                                                                           // 1830
            return Math.floor(+this / 1000);                                                                           // 1831
        },                                                                                                             // 1832
                                                                                                                       // 1833
        toString : function () {                                                                                       // 1834
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");                                 // 1835
        },                                                                                                             // 1836
                                                                                                                       // 1837
        toDate : function () {                                                                                         // 1838
            return this._offset ? new Date(+this) : this._d;                                                           // 1839
        },                                                                                                             // 1840
                                                                                                                       // 1841
        toISOString : function () {                                                                                    // 1842
            var m = moment(this).utc();                                                                                // 1843
            if (0 < m.year() && m.year() <= 9999) {                                                                    // 1844
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                                // 1845
            } else {                                                                                                   // 1846
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                              // 1847
            }                                                                                                          // 1848
        },                                                                                                             // 1849
                                                                                                                       // 1850
        toArray : function () {                                                                                        // 1851
            var m = this;                                                                                              // 1852
            return [                                                                                                   // 1853
                m.year(),                                                                                              // 1854
                m.month(),                                                                                             // 1855
                m.date(),                                                                                              // 1856
                m.hours(),                                                                                             // 1857
                m.minutes(),                                                                                           // 1858
                m.seconds(),                                                                                           // 1859
                m.milliseconds()                                                                                       // 1860
            ];                                                                                                         // 1861
        },                                                                                                             // 1862
                                                                                                                       // 1863
        isValid : function () {                                                                                        // 1864
            return isValid(this);                                                                                      // 1865
        },                                                                                                             // 1866
                                                                                                                       // 1867
        isDSTShifted : function () {                                                                                   // 1868
                                                                                                                       // 1869
            if (this._a) {                                                                                             // 1870
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }                                                                                                          // 1872
                                                                                                                       // 1873
            return false;                                                                                              // 1874
        },                                                                                                             // 1875
                                                                                                                       // 1876
        parsingFlags : function () {                                                                                   // 1877
            return extend({}, this._pf);                                                                               // 1878
        },                                                                                                             // 1879
                                                                                                                       // 1880
        invalidAt: function () {                                                                                       // 1881
            return this._pf.overflow;                                                                                  // 1882
        },                                                                                                             // 1883
                                                                                                                       // 1884
        utc : function () {                                                                                            // 1885
            return this.zone(0);                                                                                       // 1886
        },                                                                                                             // 1887
                                                                                                                       // 1888
        local : function () {                                                                                          // 1889
            this.zone(0);                                                                                              // 1890
            this._isUTC = false;                                                                                       // 1891
            return this;                                                                                               // 1892
        },                                                                                                             // 1893
                                                                                                                       // 1894
        format : function (inputString) {                                                                              // 1895
            var output = formatMoment(this, inputString || moment.defaultFormat);                                      // 1896
            return this.lang().postformat(output);                                                                     // 1897
        },                                                                                                             // 1898
                                                                                                                       // 1899
        add : function (input, val) {                                                                                  // 1900
            var dur;                                                                                                   // 1901
            // switch args to support add('s', 1) and add(1, 's')                                                      // 1902
            if (typeof input === 'string') {                                                                           // 1903
                dur = moment.duration(+val, input);                                                                    // 1904
            } else {                                                                                                   // 1905
                dur = moment.duration(input, val);                                                                     // 1906
            }                                                                                                          // 1907
            addOrSubtractDurationFromMoment(this, dur, 1);                                                             // 1908
            return this;                                                                                               // 1909
        },                                                                                                             // 1910
                                                                                                                       // 1911
        subtract : function (input, val) {                                                                             // 1912
            var dur;                                                                                                   // 1913
            // switch args to support subtract('s', 1) and subtract(1, 's')                                            // 1914
            if (typeof input === 'string') {                                                                           // 1915
                dur = moment.duration(+val, input);                                                                    // 1916
            } else {                                                                                                   // 1917
                dur = moment.duration(input, val);                                                                     // 1918
            }                                                                                                          // 1919
            addOrSubtractDurationFromMoment(this, dur, -1);                                                            // 1920
            return this;                                                                                               // 1921
        },                                                                                                             // 1922
                                                                                                                       // 1923
        diff : function (input, units, asFloat) {                                                                      // 1924
            var that = makeAs(input, this),                                                                            // 1925
                zoneDiff = (this.zone() - that.zone()) * 6e4,                                                          // 1926
                diff, output;                                                                                          // 1927
                                                                                                                       // 1928
            units = normalizeUnits(units);                                                                             // 1929
                                                                                                                       // 1930
            if (units === 'year' || units === 'month') {                                                               // 1931
                // average number of days in the months in the given dates                                             // 1932
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2                   // 1933
                // difference in months                                                                                // 1934
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());                           // 1935
                // adjust by taking difference in days, average number of days                                         // 1936
                // and dst in the given months.                                                                        // 1937
                output += ((this - moment(this).startOf('month')) -                                                    // 1938
                        (that - moment(that).startOf('month'))) / diff;                                                // 1939
                // same as above but with zones, to negate all dst                                                     // 1940
                output -= ((this.zone() - moment(this).startOf('month').zone()) -                                      // 1941
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;                            // 1942
                if (units === 'year') {                                                                                // 1943
                    output = output / 12;                                                                              // 1944
                }                                                                                                      // 1945
            } else {                                                                                                   // 1946
                diff = (this - that);                                                                                  // 1947
                output = units === 'second' ? diff / 1e3 : // 1000                                                     // 1948
                    units === 'minute' ? diff / 6e4 : // 1000 * 60                                                     // 1949
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60                                                 // 1950
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst                   // 1951
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst             // 1952
                    diff;                                                                                              // 1953
            }                                                                                                          // 1954
            return asFloat ? output : absRound(output);                                                                // 1955
        },                                                                                                             // 1956
                                                                                                                       // 1957
        from : function (time, withoutSuffix) {                                                                        // 1958
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);                  // 1959
        },                                                                                                             // 1960
                                                                                                                       // 1961
        fromNow : function (withoutSuffix) {                                                                           // 1962
            return this.from(moment(), withoutSuffix);                                                                 // 1963
        },                                                                                                             // 1964
                                                                                                                       // 1965
        calendar : function () {                                                                                       // 1966
            // We want to compare the start of today, vs this.                                                         // 1967
            // Getting start-of-today depends on whether we're zone'd or not.                                          // 1968
            var sod = makeAs(moment(), this).startOf('day'),                                                           // 1969
                diff = this.diff(sod, 'days', true),                                                                   // 1970
                format = diff < -6 ? 'sameElse' :                                                                      // 1971
                    diff < -1 ? 'lastWeek' :                                                                           // 1972
                    diff < 0 ? 'lastDay' :                                                                             // 1973
                    diff < 1 ? 'sameDay' :                                                                             // 1974
                    diff < 2 ? 'nextDay' :                                                                             // 1975
                    diff < 7 ? 'nextWeek' : 'sameElse';                                                                // 1976
            return this.format(this.lang().calendar(format, this));                                                    // 1977
        },                                                                                                             // 1978
                                                                                                                       // 1979
        isLeapYear : function () {                                                                                     // 1980
            return isLeapYear(this.year());                                                                            // 1981
        },                                                                                                             // 1982
                                                                                                                       // 1983
        isDST : function () {                                                                                          // 1984
            return (this.zone() < this.clone().month(0).zone() ||                                                      // 1985
                this.zone() < this.clone().month(5).zone());                                                           // 1986
        },                                                                                                             // 1987
                                                                                                                       // 1988
        day : function (input) {                                                                                       // 1989
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();                                            // 1990
            if (input != null) {                                                                                       // 1991
                input = parseWeekday(input, this.lang());                                                              // 1992
                return this.add({ d : input - day });                                                                  // 1993
            } else {                                                                                                   // 1994
                return day;                                                                                            // 1995
            }                                                                                                          // 1996
        },                                                                                                             // 1997
                                                                                                                       // 1998
        month : makeAccessor('Month', true),                                                                           // 1999
                                                                                                                       // 2000
        startOf: function (units) {                                                                                    // 2001
            units = normalizeUnits(units);                                                                             // 2002
            // the following switch intentionally omits break keywords                                                 // 2003
            // to utilize falling through the cases.                                                                   // 2004
            switch (units) {                                                                                           // 2005
            case 'year':                                                                                               // 2006
                this.month(0);                                                                                         // 2007
                /* falls through */                                                                                    // 2008
            case 'quarter':                                                                                            // 2009
            case 'month':                                                                                              // 2010
                this.date(1);                                                                                          // 2011
                /* falls through */                                                                                    // 2012
            case 'week':                                                                                               // 2013
            case 'isoWeek':                                                                                            // 2014
            case 'day':                                                                                                // 2015
                this.hours(0);                                                                                         // 2016
                /* falls through */                                                                                    // 2017
            case 'hour':                                                                                               // 2018
                this.minutes(0);                                                                                       // 2019
                /* falls through */                                                                                    // 2020
            case 'minute':                                                                                             // 2021
                this.seconds(0);                                                                                       // 2022
                /* falls through */                                                                                    // 2023
            case 'second':                                                                                             // 2024
                this.milliseconds(0);                                                                                  // 2025
                /* falls through */                                                                                    // 2026
            }                                                                                                          // 2027
                                                                                                                       // 2028
            // weeks are a special case                                                                                // 2029
            if (units === 'week') {                                                                                    // 2030
                this.weekday(0);                                                                                       // 2031
            } else if (units === 'isoWeek') {                                                                          // 2032
                this.isoWeekday(1);                                                                                    // 2033
            }                                                                                                          // 2034
                                                                                                                       // 2035
            // quarters are also special                                                                               // 2036
            if (units === 'quarter') {                                                                                 // 2037
                this.month(Math.floor(this.month() / 3) * 3);                                                          // 2038
            }                                                                                                          // 2039
                                                                                                                       // 2040
            return this;                                                                                               // 2041
        },                                                                                                             // 2042
                                                                                                                       // 2043
        endOf: function (units) {                                                                                      // 2044
            units = normalizeUnits(units);                                                                             // 2045
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);               // 2046
        },                                                                                                             // 2047
                                                                                                                       // 2048
        isAfter: function (input, units) {                                                                             // 2049
            units = typeof units !== 'undefined' ? units : 'millisecond';                                              // 2050
            return +this.clone().startOf(units) > +moment(input).startOf(units);                                       // 2051
        },                                                                                                             // 2052
                                                                                                                       // 2053
        isBefore: function (input, units) {                                                                            // 2054
            units = typeof units !== 'undefined' ? units : 'millisecond';                                              // 2055
            return +this.clone().startOf(units) < +moment(input).startOf(units);                                       // 2056
        },                                                                                                             // 2057
                                                                                                                       // 2058
        isSame: function (input, units) {                                                                              // 2059
            units = units || 'ms';                                                                                     // 2060
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);                               // 2061
        },                                                                                                             // 2062
                                                                                                                       // 2063
        min: function (other) {                                                                                        // 2064
            other = moment.apply(null, arguments);                                                                     // 2065
            return other < this ? this : other;                                                                        // 2066
        },                                                                                                             // 2067
                                                                                                                       // 2068
        max: function (other) {                                                                                        // 2069
            other = moment.apply(null, arguments);                                                                     // 2070
            return other > this ? this : other;                                                                        // 2071
        },                                                                                                             // 2072
                                                                                                                       // 2073
        // keepTime = true means only change the timezone, without affecting                                           // 2074
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200                                         // 2075
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we                                             // 2076
        // adjust the time as needed, to be valid.                                                                     // 2077
        //                                                                                                             // 2078
        // Keeping the time actually adds/subtracts (one hour)                                                         // 2079
        // from the actual represented time. That is why we call updateOffset                                          // 2080
        // a second time. In case it wants us to change the offset again                                               // 2081
        // _changeInProgress == true case, then we have to adjust, because                                             // 2082
        // there is no such time in the given timezone.                                                                // 2083
        zone : function (input, keepTime) {                                                                            // 2084
            var offset = this._offset || 0;                                                                            // 2085
            if (input != null) {                                                                                       // 2086
                if (typeof input === "string") {                                                                       // 2087
                    input = timezoneMinutesFromString(input);                                                          // 2088
                }                                                                                                      // 2089
                if (Math.abs(input) < 16) {                                                                            // 2090
                    input = input * 60;                                                                                // 2091
                }                                                                                                      // 2092
                this._offset = input;                                                                                  // 2093
                this._isUTC = true;                                                                                    // 2094
                if (offset !== input) {                                                                                // 2095
                    if (!keepTime || this._changeInProgress) {                                                         // 2096
                        addOrSubtractDurationFromMoment(this,                                                          // 2097
                                moment.duration(offset - input, 'm'), 1, false);                                       // 2098
                    } else if (!this._changeInProgress) {                                                              // 2099
                        this._changeInProgress = true;                                                                 // 2100
                        moment.updateOffset(this, true);                                                               // 2101
                        this._changeInProgress = null;                                                                 // 2102
                    }                                                                                                  // 2103
                }                                                                                                      // 2104
            } else {                                                                                                   // 2105
                return this._isUTC ? offset : this._d.getTimezoneOffset();                                             // 2106
            }                                                                                                          // 2107
            return this;                                                                                               // 2108
        },                                                                                                             // 2109
                                                                                                                       // 2110
        zoneAbbr : function () {                                                                                       // 2111
            return this._isUTC ? "UTC" : "";                                                                           // 2112
        },                                                                                                             // 2113
                                                                                                                       // 2114
        zoneName : function () {                                                                                       // 2115
            return this._isUTC ? "Coordinated Universal Time" : "";                                                    // 2116
        },                                                                                                             // 2117
                                                                                                                       // 2118
        parseZone : function () {                                                                                      // 2119
            if (this._tzm) {                                                                                           // 2120
                this.zone(this._tzm);                                                                                  // 2121
            } else if (typeof this._i === 'string') {                                                                  // 2122
                this.zone(this._i);                                                                                    // 2123
            }                                                                                                          // 2124
            return this;                                                                                               // 2125
        },                                                                                                             // 2126
                                                                                                                       // 2127
        hasAlignedHourOffset : function (input) {                                                                      // 2128
            if (!input) {                                                                                              // 2129
                input = 0;                                                                                             // 2130
            }                                                                                                          // 2131
            else {                                                                                                     // 2132
                input = moment(input).zone();                                                                          // 2133
            }                                                                                                          // 2134
                                                                                                                       // 2135
            return (this.zone() - input) % 60 === 0;                                                                   // 2136
        },                                                                                                             // 2137
                                                                                                                       // 2138
        daysInMonth : function () {                                                                                    // 2139
            return daysInMonth(this.year(), this.month());                                                             // 2140
        },                                                                                                             // 2141
                                                                                                                       // 2142
        dayOfYear : function (input) {                                                                                 // 2143
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;           // 2144
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));                                     // 2145
        },                                                                                                             // 2146
                                                                                                                       // 2147
        quarter : function (input) {                                                                                   // 2148
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3); // 2149
        },                                                                                                             // 2150
                                                                                                                       // 2151
        weekYear : function (input) {                                                                                  // 2152
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;                            // 2153
            return input == null ? year : this.add("y", (input - year));                                               // 2154
        },                                                                                                             // 2155
                                                                                                                       // 2156
        isoWeekYear : function (input) {                                                                               // 2157
            var year = weekOfYear(this, 1, 4).year;                                                                    // 2158
            return input == null ? year : this.add("y", (input - year));                                               // 2159
        },                                                                                                             // 2160
                                                                                                                       // 2161
        week : function (input) {                                                                                      // 2162
            var week = this.lang().week(this);                                                                         // 2163
            return input == null ? week : this.add("d", (input - week) * 7);                                           // 2164
        },                                                                                                             // 2165
                                                                                                                       // 2166
        isoWeek : function (input) {                                                                                   // 2167
            var week = weekOfYear(this, 1, 4).week;                                                                    // 2168
            return input == null ? week : this.add("d", (input - week) * 7);                                           // 2169
        },                                                                                                             // 2170
                                                                                                                       // 2171
        weekday : function (input) {                                                                                   // 2172
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;                                                // 2173
            return input == null ? weekday : this.add("d", input - weekday);                                           // 2174
        },                                                                                                             // 2175
                                                                                                                       // 2176
        isoWeekday : function (input) {                                                                                // 2177
            // behaves the same as moment#day except                                                                   // 2178
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)                                          // 2179
            // as a setter, sunday should belong to the previous week.                                                 // 2180
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);                     // 2181
        },                                                                                                             // 2182
                                                                                                                       // 2183
        isoWeeksInYear : function () {                                                                                 // 2184
            return weeksInYear(this.year(), 1, 4);                                                                     // 2185
        },                                                                                                             // 2186
                                                                                                                       // 2187
        weeksInYear : function () {                                                                                    // 2188
            var weekInfo = this._lang._week;                                                                           // 2189
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);                                               // 2190
        },                                                                                                             // 2191
                                                                                                                       // 2192
        get : function (units) {                                                                                       // 2193
            units = normalizeUnits(units);                                                                             // 2194
            return this[units]();                                                                                      // 2195
        },                                                                                                             // 2196
                                                                                                                       // 2197
        set : function (units, value) {                                                                                // 2198
            units = normalizeUnits(units);                                                                             // 2199
            if (typeof this[units] === 'function') {                                                                   // 2200
                this[units](value);                                                                                    // 2201
            }                                                                                                          // 2202
            return this;                                                                                               // 2203
        },                                                                                                             // 2204
                                                                                                                       // 2205
        // If passed a language key, it will set the language for this                                                 // 2206
        // instance.  Otherwise, it will return the language configuration                                             // 2207
        // variables for this instance.                                                                                // 2208
        lang : function (key) {                                                                                        // 2209
            if (key === undefined) {                                                                                   // 2210
                return this._lang;                                                                                     // 2211
            } else {                                                                                                   // 2212
                this._lang = getLangDefinition(key);                                                                   // 2213
                return this;                                                                                           // 2214
            }                                                                                                          // 2215
        }                                                                                                              // 2216
    });                                                                                                                // 2217
                                                                                                                       // 2218
    function rawMonthSetter(mom, value) {                                                                              // 2219
        var dayOfMonth;                                                                                                // 2220
                                                                                                                       // 2221
        // TODO: Move this out of here!                                                                                // 2222
        if (typeof value === 'string') {                                                                               // 2223
            value = mom.lang().monthsParse(value);                                                                     // 2224
            // TODO: Another silent failure?                                                                           // 2225
            if (typeof value !== 'number') {                                                                           // 2226
                return mom;                                                                                            // 2227
            }                                                                                                          // 2228
        }                                                                                                              // 2229
                                                                                                                       // 2230
        dayOfMonth = Math.min(mom.date(),                                                                              // 2231
                daysInMonth(mom.year(), value));                                                                       // 2232
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);                                        // 2233
        return mom;                                                                                                    // 2234
    }                                                                                                                  // 2235
                                                                                                                       // 2236
    function rawGetter(mom, unit) {                                                                                    // 2237
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();                                                     // 2238
    }                                                                                                                  // 2239
                                                                                                                       // 2240
    function rawSetter(mom, unit, value) {                                                                             // 2241
        if (unit === 'Month') {                                                                                        // 2242
            return rawMonthSetter(mom, value);                                                                         // 2243
        } else {                                                                                                       // 2244
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);                                            // 2245
        }                                                                                                              // 2246
    }                                                                                                                  // 2247
                                                                                                                       // 2248
    function makeAccessor(unit, keepTime) {                                                                            // 2249
        return function (value) {                                                                                      // 2250
            if (value != null) {                                                                                       // 2251
                rawSetter(this, unit, value);                                                                          // 2252
                moment.updateOffset(this, keepTime);                                                                   // 2253
                return this;                                                                                           // 2254
            } else {                                                                                                   // 2255
                return rawGetter(this, unit);                                                                          // 2256
            }                                                                                                          // 2257
        };                                                                                                             // 2258
    }                                                                                                                  // 2259
                                                                                                                       // 2260
    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);                              // 2261
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);                                             // 2262
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);                                             // 2263
    // Setting the hour should keep the time, because the user explicitly                                              // 2264
    // specified which hour he wants. So trying to maintain the same hour (in                                          // 2265
    // a new timezone) makes sense. Adding/subtracting hours does not follow                                           // 2266
    // this rule.                                                                                                      // 2267
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);                                                    // 2268
    // moment.fn.month is defined separately                                                                           // 2269
    moment.fn.date = makeAccessor('Date', true);                                                                       // 2270
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));        // 2271
    moment.fn.year = makeAccessor('FullYear', true);                                                                   // 2272
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));    // 2273
                                                                                                                       // 2274
    // add plural methods                                                                                              // 2275
    moment.fn.days = moment.fn.day;                                                                                    // 2276
    moment.fn.months = moment.fn.month;                                                                                // 2277
    moment.fn.weeks = moment.fn.week;                                                                                  // 2278
    moment.fn.isoWeeks = moment.fn.isoWeek;                                                                            // 2279
    moment.fn.quarters = moment.fn.quarter;                                                                            // 2280
                                                                                                                       // 2281
    // add aliased format methods                                                                                      // 2282
    moment.fn.toJSON = moment.fn.toISOString;                                                                          // 2283
                                                                                                                       // 2284
    /************************************                                                                              // 2285
        Duration Prototype                                                                                             // 2286
    ************************************/                                                                              // 2287
                                                                                                                       // 2288
                                                                                                                       // 2289
    extend(moment.duration.fn = Duration.prototype, {                                                                  // 2290
                                                                                                                       // 2291
        _bubble : function () {                                                                                        // 2292
            var milliseconds = this._milliseconds,                                                                     // 2293
                days = this._days,                                                                                     // 2294
                months = this._months,                                                                                 // 2295
                data = this._data,                                                                                     // 2296
                seconds, minutes, hours, years;                                                                        // 2297
                                                                                                                       // 2298
            // The following code bubbles up values, see the tests for                                                 // 2299
            // examples of what that means.                                                                            // 2300
            data.milliseconds = milliseconds % 1000;                                                                   // 2301
                                                                                                                       // 2302
            seconds = absRound(milliseconds / 1000);                                                                   // 2303
            data.seconds = seconds % 60;                                                                               // 2304
                                                                                                                       // 2305
            minutes = absRound(seconds / 60);                                                                          // 2306
            data.minutes = minutes % 60;                                                                               // 2307
                                                                                                                       // 2308
            hours = absRound(minutes / 60);                                                                            // 2309
            data.hours = hours % 24;                                                                                   // 2310
                                                                                                                       // 2311
            days += absRound(hours / 24);                                                                              // 2312
            data.days = days % 30;                                                                                     // 2313
                                                                                                                       // 2314
            months += absRound(days / 30);                                                                             // 2315
            data.months = months % 12;                                                                                 // 2316
                                                                                                                       // 2317
            years = absRound(months / 12);                                                                             // 2318
            data.years = years;                                                                                        // 2319
        },                                                                                                             // 2320
                                                                                                                       // 2321
        weeks : function () {                                                                                          // 2322
            return absRound(this.days() / 7);                                                                          // 2323
        },                                                                                                             // 2324
                                                                                                                       // 2325
        valueOf : function () {                                                                                        // 2326
            return this._milliseconds +                                                                                // 2327
              this._days * 864e5 +                                                                                     // 2328
              (this._months % 12) * 2592e6 +                                                                           // 2329
              toInt(this._months / 12) * 31536e6;                                                                      // 2330
        },                                                                                                             // 2331
                                                                                                                       // 2332
        humanize : function (withSuffix) {                                                                             // 2333
            var difference = +this,                                                                                    // 2334
                output = relativeTime(difference, !withSuffix, this.lang());                                           // 2335
                                                                                                                       // 2336
            if (withSuffix) {                                                                                          // 2337
                output = this.lang().pastFuture(difference, output);                                                   // 2338
            }                                                                                                          // 2339
                                                                                                                       // 2340
            return this.lang().postformat(output);                                                                     // 2341
        },                                                                                                             // 2342
                                                                                                                       // 2343
        add : function (input, val) {                                                                                  // 2344
            // supports only 2.0-style add(1, 's') or add(moment)                                                      // 2345
            var dur = moment.duration(input, val);                                                                     // 2346
                                                                                                                       // 2347
            this._milliseconds += dur._milliseconds;                                                                   // 2348
            this._days += dur._days;                                                                                   // 2349
            this._months += dur._months;                                                                               // 2350
                                                                                                                       // 2351
            this._bubble();                                                                                            // 2352
                                                                                                                       // 2353
            return this;                                                                                               // 2354
        },                                                                                                             // 2355
                                                                                                                       // 2356
        subtract : function (input, val) {                                                                             // 2357
            var dur = moment.duration(input, val);                                                                     // 2358
                                                                                                                       // 2359
            this._milliseconds -= dur._milliseconds;                                                                   // 2360
            this._days -= dur._days;                                                                                   // 2361
            this._months -= dur._months;                                                                               // 2362
                                                                                                                       // 2363
            this._bubble();                                                                                            // 2364
                                                                                                                       // 2365
            return this;                                                                                               // 2366
        },                                                                                                             // 2367
                                                                                                                       // 2368
        get : function (units) {                                                                                       // 2369
            units = normalizeUnits(units);                                                                             // 2370
            return this[units.toLowerCase() + 's']();                                                                  // 2371
        },                                                                                                             // 2372
                                                                                                                       // 2373
        as : function (units) {                                                                                        // 2374
            units = normalizeUnits(units);                                                                             // 2375
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();                                // 2376
        },                                                                                                             // 2377
                                                                                                                       // 2378
        lang : moment.fn.lang,                                                                                         // 2379
                                                                                                                       // 2380
        toIsoString : function () {                                                                                    // 2381
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js            // 2382
            var years = Math.abs(this.years()),                                                                        // 2383
                months = Math.abs(this.months()),                                                                      // 2384
                days = Math.abs(this.days()),                                                                          // 2385
                hours = Math.abs(this.hours()),                                                                        // 2386
                minutes = Math.abs(this.minutes()),                                                                    // 2387
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);                                       // 2388
                                                                                                                       // 2389
            if (!this.asSeconds()) {                                                                                   // 2390
                // this is the same as C#'s (Noda) and python (isodate)...                                             // 2391
                // but not other JS (goog.date)                                                                        // 2392
                return 'P0D';                                                                                          // 2393
            }                                                                                                          // 2394
                                                                                                                       // 2395
            return (this.asSeconds() < 0 ? '-' : '') +                                                                 // 2396
                'P' +                                                                                                  // 2397
                (years ? years + 'Y' : '') +                                                                           // 2398
                (months ? months + 'M' : '') +                                                                         // 2399
                (days ? days + 'D' : '') +                                                                             // 2400
                ((hours || minutes || seconds) ? 'T' : '') +                                                           // 2401
                (hours ? hours + 'H' : '') +                                                                           // 2402
                (minutes ? minutes + 'M' : '') +                                                                       // 2403
                (seconds ? seconds + 'S' : '');                                                                        // 2404
        }                                                                                                              // 2405
    });                                                                                                                // 2406
                                                                                                                       // 2407
    function makeDurationGetter(name) {                                                                                // 2408
        moment.duration.fn[name] = function () {                                                                       // 2409
            return this._data[name];                                                                                   // 2410
        };                                                                                                             // 2411
    }                                                                                                                  // 2412
                                                                                                                       // 2413
    function makeDurationAsGetter(name, factor) {                                                                      // 2414
        moment.duration.fn['as' + name] = function () {                                                                // 2415
            return +this / factor;                                                                                     // 2416
        };                                                                                                             // 2417
    }                                                                                                                  // 2418
                                                                                                                       // 2419
    for (i in unitMillisecondFactors) {                                                                                // 2420
        if (unitMillisecondFactors.hasOwnProperty(i)) {                                                                // 2421
            makeDurationAsGetter(i, unitMillisecondFactors[i]);                                                        // 2422
            makeDurationGetter(i.toLowerCase());                                                                       // 2423
        }                                                                                                              // 2424
    }                                                                                                                  // 2425
                                                                                                                       // 2426
    makeDurationAsGetter('Weeks', 6048e5);                                                                             // 2427
    moment.duration.fn.asMonths = function () {                                                                        // 2428
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;                                          // 2429
    };                                                                                                                 // 2430
                                                                                                                       // 2431
                                                                                                                       // 2432
    /************************************                                                                              // 2433
        Default Lang                                                                                                   // 2434
    ************************************/                                                                              // 2435
                                                                                                                       // 2436
                                                                                                                       // 2437
    // Set default language, other languages will inherit from English.                                                // 2438
    moment.lang('en', {                                                                                                // 2439
        ordinal : function (number) {                                                                                  // 2440
            var b = number % 10,                                                                                       // 2441
                output = (toInt(number % 100 / 10) === 1) ? 'th' :                                                     // 2442
                (b === 1) ? 'st' :                                                                                     // 2443
                (b === 2) ? 'nd' :                                                                                     // 2444
                (b === 3) ? 'rd' : 'th';                                                                               // 2445
            return number + output;                                                                                    // 2446
        }                                                                                                              // 2447
    });                                                                                                                // 2448
                                                                                                                       // 2449
    /* EMBED_LANGUAGES */                                                                                              // 2450
                                                                                                                       // 2451
    /************************************                                                                              // 2452
        Exposing Moment                                                                                                // 2453
    ************************************/                                                                              // 2454
                                                                                                                       // 2455
    function makeGlobal(shouldDeprecate) {                                                                             // 2456
        /*global ender:false */                                                                                        // 2457
        if (typeof ender !== 'undefined') {                                                                            // 2458
            return;                                                                                                    // 2459
        }                                                                                                              // 2460
        oldGlobalMoment = globalScope.moment;                                                                          // 2461
        if (shouldDeprecate) {                                                                                         // 2462
            globalScope.moment = deprecate(                                                                            // 2463
                    "Accessing Moment through the global scope is " +                                                  // 2464
                    "deprecated, and will be removed in an upcoming " +                                                // 2465
                    "release.",                                                                                        // 2466
                    moment);                                                                                           // 2467
        } else {                                                                                                       // 2468
            globalScope.moment = moment;                                                                               // 2469
        }                                                                                                              // 2470
    }                                                                                                                  // 2471
                                                                                                                       // 2472
    // CommonJS module is defined                                                                                      // 2473
    if (hasModule) {                                                                                                   // 2474
        module.exports = moment;                                                                                       // 2475
    } else if (typeof define === "function" && define.amd) {                                                           // 2476
        define("moment", function (require, exports, module) {                                                         // 2477
            if (module.config && module.config() && module.config().noGlobal === true) {                               // 2478
                // release the global variable                                                                         // 2479
                globalScope.moment = oldGlobalMoment;                                                                  // 2480
            }                                                                                                          // 2481
                                                                                                                       // 2482
            return moment;                                                                                             // 2483
        });                                                                                                            // 2484
        makeGlobal(true);                                                                                              // 2485
    } else {                                                                                                           // 2486
        makeGlobal();                                                                                                  // 2487
    }                                                                                                                  // 2488
}).call(this);                                                                                                         // 2489
                                                                                                                       // 2490
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/moment/export-moment.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
//This file exposes moment so that it works with Meteor 0.6.5's package system.                                        // 1
if (typeof Package !== "undefined") {                                                                                  // 2
  moment = this.moment;                                                                                                // 3
}                                                                                                                      // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.moment = {
  moment: moment
};

})();
