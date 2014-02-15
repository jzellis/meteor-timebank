(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var moment;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/moment/lib/moment/moment.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//! moment.js                                                                                                         // 1
//! version : 2.5.1                                                                                                   // 2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors                                                        // 3
//! license : MIT                                                                                                     // 4
//! momentjs.com                                                                                                      // 5
                                                                                                                      // 6
(function (undefined) {                                                                                               // 7
                                                                                                                      // 8
    /************************************                                                                             // 9
        Constants                                                                                                     // 10
    ************************************/                                                                             // 11
                                                                                                                      // 12
    var moment,                                                                                                       // 13
        VERSION = "2.5.1",                                                                                            // 14
        global = this,                                                                                                // 15
        round = Math.round,                                                                                           // 16
        i,                                                                                                            // 17
                                                                                                                      // 18
        YEAR = 0,                                                                                                     // 19
        MONTH = 1,                                                                                                    // 20
        DATE = 2,                                                                                                     // 21
        HOUR = 3,                                                                                                     // 22
        MINUTE = 4,                                                                                                   // 23
        SECOND = 5,                                                                                                   // 24
        MILLISECOND = 6,                                                                                              // 25
                                                                                                                      // 26
        // internal storage for language config files                                                                 // 27
        languages = {},                                                                                               // 28
                                                                                                                      // 29
        // moment internal properties                                                                                 // 30
        momentProperties = {                                                                                          // 31
            _isAMomentObject: null,                                                                                   // 32
            _i : null,                                                                                                // 33
            _f : null,                                                                                                // 34
            _l : null,                                                                                                // 35
            _strict : null,                                                                                           // 36
            _isUTC : null,                                                                                            // 37
            _offset : null,  // optional. Combine with _isUTC                                                         // 38
            _pf : null,                                                                                               // 39
            _lang : null  // optional                                                                                 // 40
        },                                                                                                            // 41
                                                                                                                      // 42
        // check for nodeJS                                                                                           // 43
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),              // 44
                                                                                                                      // 45
        // ASP.NET json date format regex                                                                             // 46
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,                                                                      // 47
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,                             // 48
                                                                                                                      // 49
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html                  // 50
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere                                  // 51
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
                                                                                                                      // 53
        // format tokens                                                                                              // 54
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,                                             // 56
                                                                                                                      // 57
        // parsing token regexes                                                                                      // 58
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99                                                                 // 59
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999                                                            // 60
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999                                                            // 61
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999                                             // 62
        parseTokenDigits = /\d+/, // nonzero number of digits                                                         // 63
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z                                // 65
        parseTokenT = /T/i, // T (ISO separator)                                                                      // 66
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123                                  // 67
                                                                                                                      // 68
        //strict parsing regexes                                                                                      // 69
        parseTokenOneDigit = /\d/, // 0 - 9                                                                           // 70
        parseTokenTwoDigits = /\d\d/, // 00 - 99                                                                      // 71
        parseTokenThreeDigits = /\d{3}/, // 000 - 999                                                                 // 72
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999                                                                // 73
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999                                                     // 74
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf                                                            // 75
                                                                                                                      // 76
        // iso 8601 regex                                                                                             // 77
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)  // 78
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                                                                                                                      // 80
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',                                                                           // 81
                                                                                                                      // 82
        isoDates = [                                                                                                  // 83
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],                                                                // 84
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],                                                                      // 85
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],                                                                      // 86
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],                                                                           // 87
            ['YYYY-DDD', /\d{4}-\d{3}/]                                                                               // 88
        ],                                                                                                            // 89
                                                                                                                      // 90
        // iso time formats and regexes                                                                               // 91
        isoTimes = [                                                                                                  // 92
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],                                                        // 93
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],                                                                      // 94
            ['HH:mm', /(T| )\d\d:\d\d/],                                                                              // 95
            ['HH', /(T| )\d\d/]                                                                                       // 96
        ],                                                                                                            // 97
                                                                                                                      // 98
        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]                                        // 99
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,                                                                     // 100
                                                                                                                      // 101
        // getter and setter names                                                                                    // 102
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),                                // 103
        unitMillisecondFactors = {                                                                                    // 104
            'Milliseconds' : 1,                                                                                       // 105
            'Seconds' : 1e3,                                                                                          // 106
            'Minutes' : 6e4,                                                                                          // 107
            'Hours' : 36e5,                                                                                           // 108
            'Days' : 864e5,                                                                                           // 109
            'Months' : 2592e6,                                                                                        // 110
            'Years' : 31536e6                                                                                         // 111
        },                                                                                                            // 112
                                                                                                                      // 113
        unitAliases = {                                                                                               // 114
            ms : 'millisecond',                                                                                       // 115
            s : 'second',                                                                                             // 116
            m : 'minute',                                                                                             // 117
            h : 'hour',                                                                                               // 118
            d : 'day',                                                                                                // 119
            D : 'date',                                                                                               // 120
            w : 'week',                                                                                               // 121
            W : 'isoWeek',                                                                                            // 122
            M : 'month',                                                                                              // 123
            y : 'year',                                                                                               // 124
            DDD : 'dayOfYear',                                                                                        // 125
            e : 'weekday',                                                                                            // 126
            E : 'isoWeekday',                                                                                         // 127
            gg: 'weekYear',                                                                                           // 128
            GG: 'isoWeekYear'                                                                                         // 129
        },                                                                                                            // 130
                                                                                                                      // 131
        camelFunctions = {                                                                                            // 132
            dayofyear : 'dayOfYear',                                                                                  // 133
            isoweekday : 'isoWeekday',                                                                                // 134
            isoweek : 'isoWeek',                                                                                      // 135
            weekyear : 'weekYear',                                                                                    // 136
            isoweekyear : 'isoWeekYear'                                                                               // 137
        },                                                                                                            // 138
                                                                                                                      // 139
        // format function strings                                                                                    // 140
        formatFunctions = {},                                                                                         // 141
                                                                                                                      // 142
        // tokens to ordinalize and pad                                                                               // 143
        ordinalizeTokens = 'DDD w W M D d'.split(' '),                                                                // 144
        paddedTokens = 'M D H h m s w W'.split(' '),                                                                  // 145
                                                                                                                      // 146
        formatTokenFunctions = {                                                                                      // 147
            M    : function () {                                                                                      // 148
                return this.month() + 1;                                                                              // 149
            },                                                                                                        // 150
            MMM  : function (format) {                                                                                // 151
                return this.lang().monthsShort(this, format);                                                         // 152
            },                                                                                                        // 153
            MMMM : function (format) {                                                                                // 154
                return this.lang().months(this, format);                                                              // 155
            },                                                                                                        // 156
            D    : function () {                                                                                      // 157
                return this.date();                                                                                   // 158
            },                                                                                                        // 159
            DDD  : function () {                                                                                      // 160
                return this.dayOfYear();                                                                              // 161
            },                                                                                                        // 162
            d    : function () {                                                                                      // 163
                return this.day();                                                                                    // 164
            },                                                                                                        // 165
            dd   : function (format) {                                                                                // 166
                return this.lang().weekdaysMin(this, format);                                                         // 167
            },                                                                                                        // 168
            ddd  : function (format) {                                                                                // 169
                return this.lang().weekdaysShort(this, format);                                                       // 170
            },                                                                                                        // 171
            dddd : function (format) {                                                                                // 172
                return this.lang().weekdays(this, format);                                                            // 173
            },                                                                                                        // 174
            w    : function () {                                                                                      // 175
                return this.week();                                                                                   // 176
            },                                                                                                        // 177
            W    : function () {                                                                                      // 178
                return this.isoWeek();                                                                                // 179
            },                                                                                                        // 180
            YY   : function () {                                                                                      // 181
                return leftZeroFill(this.year() % 100, 2);                                                            // 182
            },                                                                                                        // 183
            YYYY : function () {                                                                                      // 184
                return leftZeroFill(this.year(), 4);                                                                  // 185
            },                                                                                                        // 186
            YYYYY : function () {                                                                                     // 187
                return leftZeroFill(this.year(), 5);                                                                  // 188
            },                                                                                                        // 189
            YYYYYY : function () {                                                                                    // 190
                var y = this.year(), sign = y >= 0 ? '+' : '-';                                                       // 191
                return sign + leftZeroFill(Math.abs(y), 6);                                                           // 192
            },                                                                                                        // 193
            gg   : function () {                                                                                      // 194
                return leftZeroFill(this.weekYear() % 100, 2);                                                        // 195
            },                                                                                                        // 196
            gggg : function () {                                                                                      // 197
                return leftZeroFill(this.weekYear(), 4);                                                              // 198
            },                                                                                                        // 199
            ggggg : function () {                                                                                     // 200
                return leftZeroFill(this.weekYear(), 5);                                                              // 201
            },                                                                                                        // 202
            GG   : function () {                                                                                      // 203
                return leftZeroFill(this.isoWeekYear() % 100, 2);                                                     // 204
            },                                                                                                        // 205
            GGGG : function () {                                                                                      // 206
                return leftZeroFill(this.isoWeekYear(), 4);                                                           // 207
            },                                                                                                        // 208
            GGGGG : function () {                                                                                     // 209
                return leftZeroFill(this.isoWeekYear(), 5);                                                           // 210
            },                                                                                                        // 211
            e : function () {                                                                                         // 212
                return this.weekday();                                                                                // 213
            },                                                                                                        // 214
            E : function () {                                                                                         // 215
                return this.isoWeekday();                                                                             // 216
            },                                                                                                        // 217
            a    : function () {                                                                                      // 218
                return this.lang().meridiem(this.hours(), this.minutes(), true);                                      // 219
            },                                                                                                        // 220
            A    : function () {                                                                                      // 221
                return this.lang().meridiem(this.hours(), this.minutes(), false);                                     // 222
            },                                                                                                        // 223
            H    : function () {                                                                                      // 224
                return this.hours();                                                                                  // 225
            },                                                                                                        // 226
            h    : function () {                                                                                      // 227
                return this.hours() % 12 || 12;                                                                       // 228
            },                                                                                                        // 229
            m    : function () {                                                                                      // 230
                return this.minutes();                                                                                // 231
            },                                                                                                        // 232
            s    : function () {                                                                                      // 233
                return this.seconds();                                                                                // 234
            },                                                                                                        // 235
            S    : function () {                                                                                      // 236
                return toInt(this.milliseconds() / 100);                                                              // 237
            },                                                                                                        // 238
            SS   : function () {                                                                                      // 239
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);                                              // 240
            },                                                                                                        // 241
            SSS  : function () {                                                                                      // 242
                return leftZeroFill(this.milliseconds(), 3);                                                          // 243
            },                                                                                                        // 244
            SSSS : function () {                                                                                      // 245
                return leftZeroFill(this.milliseconds(), 3);                                                          // 246
            },                                                                                                        // 247
            Z    : function () {                                                                                      // 248
                var a = -this.zone(),                                                                                 // 249
                    b = "+";                                                                                          // 250
                if (a < 0) {                                                                                          // 251
                    a = -a;                                                                                           // 252
                    b = "-";                                                                                          // 253
                }                                                                                                     // 254
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);                     // 255
            },                                                                                                        // 256
            ZZ   : function () {                                                                                      // 257
                var a = -this.zone(),                                                                                 // 258
                    b = "+";                                                                                          // 259
                if (a < 0) {                                                                                          // 260
                    a = -a;                                                                                           // 261
                    b = "-";                                                                                          // 262
                }                                                                                                     // 263
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);                           // 264
            },                                                                                                        // 265
            z : function () {                                                                                         // 266
                return this.zoneAbbr();                                                                               // 267
            },                                                                                                        // 268
            zz : function () {                                                                                        // 269
                return this.zoneName();                                                                               // 270
            },                                                                                                        // 271
            X    : function () {                                                                                      // 272
                return this.unix();                                                                                   // 273
            },                                                                                                        // 274
            Q : function () {                                                                                         // 275
                return this.quarter();                                                                                // 276
            }                                                                                                         // 277
        },                                                                                                            // 278
                                                                                                                      // 279
        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];                                // 280
                                                                                                                      // 281
    function defaultParsingFlags() {                                                                                  // 282
        // We need to deep clone this object, and es5 standard is not very                                            // 283
        // helpful.                                                                                                   // 284
        return {                                                                                                      // 285
            empty : false,                                                                                            // 286
            unusedTokens : [],                                                                                        // 287
            unusedInput : [],                                                                                         // 288
            overflow : -2,                                                                                            // 289
            charsLeftOver : 0,                                                                                        // 290
            nullInput : false,                                                                                        // 291
            invalidMonth : null,                                                                                      // 292
            invalidFormat : false,                                                                                    // 293
            userInvalidated : false,                                                                                  // 294
            iso: false                                                                                                // 295
        };                                                                                                            // 296
    }                                                                                                                 // 297
                                                                                                                      // 298
    function padToken(func, count) {                                                                                  // 299
        return function (a) {                                                                                         // 300
            return leftZeroFill(func.call(this, a), count);                                                           // 301
        };                                                                                                            // 302
    }                                                                                                                 // 303
    function ordinalizeToken(func, period) {                                                                          // 304
        return function (a) {                                                                                         // 305
            return this.lang().ordinal(func.call(this, a), period);                                                   // 306
        };                                                                                                            // 307
    }                                                                                                                 // 308
                                                                                                                      // 309
    while (ordinalizeTokens.length) {                                                                                 // 310
        i = ordinalizeTokens.pop();                                                                                   // 311
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);                                  // 312
    }                                                                                                                 // 313
    while (paddedTokens.length) {                                                                                     // 314
        i = paddedTokens.pop();                                                                                       // 315
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);                                           // 316
    }                                                                                                                 // 317
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);                                                // 318
                                                                                                                      // 319
                                                                                                                      // 320
    /************************************                                                                             // 321
        Constructors                                                                                                  // 322
    ************************************/                                                                             // 323
                                                                                                                      // 324
    function Language() {                                                                                             // 325
                                                                                                                      // 326
    }                                                                                                                 // 327
                                                                                                                      // 328
    // Moment prototype object                                                                                        // 329
    function Moment(config) {                                                                                         // 330
        checkOverflow(config);                                                                                        // 331
        extend(this, config);                                                                                         // 332
    }                                                                                                                 // 333
                                                                                                                      // 334
    // Duration Constructor                                                                                           // 335
    function Duration(duration) {                                                                                     // 336
        var normalizedInput = normalizeObjectUnits(duration),                                                         // 337
            years = normalizedInput.year || 0,                                                                        // 338
            months = normalizedInput.month || 0,                                                                      // 339
            weeks = normalizedInput.week || 0,                                                                        // 340
            days = normalizedInput.day || 0,                                                                          // 341
            hours = normalizedInput.hour || 0,                                                                        // 342
            minutes = normalizedInput.minute || 0,                                                                    // 343
            seconds = normalizedInput.second || 0,                                                                    // 344
            milliseconds = normalizedInput.millisecond || 0;                                                          // 345
                                                                                                                      // 346
        // representation for dateAddRemove                                                                           // 347
        this._milliseconds = +milliseconds +                                                                          // 348
            seconds * 1e3 + // 1000                                                                                   // 349
            minutes * 6e4 + // 1000 * 60                                                                              // 350
            hours * 36e5; // 1000 * 60 * 60                                                                           // 351
        // Because of dateAddRemove treats 24 hours as different from a                                               // 352
        // day when working around DST, we need to store them separately                                              // 353
        this._days = +days +                                                                                          // 354
            weeks * 7;                                                                                                // 355
        // It is impossible translate months into days without knowing                                                // 356
        // which months you are are talking about, so we have to store                                                // 357
        // it separately.                                                                                             // 358
        this._months = +months +                                                                                      // 359
            years * 12;                                                                                               // 360
                                                                                                                      // 361
        this._data = {};                                                                                              // 362
                                                                                                                      // 363
        this._bubble();                                                                                               // 364
    }                                                                                                                 // 365
                                                                                                                      // 366
    /************************************                                                                             // 367
        Helpers                                                                                                       // 368
    ************************************/                                                                             // 369
                                                                                                                      // 370
                                                                                                                      // 371
    function extend(a, b) {                                                                                           // 372
        for (var i in b) {                                                                                            // 373
            if (b.hasOwnProperty(i)) {                                                                                // 374
                a[i] = b[i];                                                                                          // 375
            }                                                                                                         // 376
        }                                                                                                             // 377
                                                                                                                      // 378
        if (b.hasOwnProperty("toString")) {                                                                           // 379
            a.toString = b.toString;                                                                                  // 380
        }                                                                                                             // 381
                                                                                                                      // 382
        if (b.hasOwnProperty("valueOf")) {                                                                            // 383
            a.valueOf = b.valueOf;                                                                                    // 384
        }                                                                                                             // 385
                                                                                                                      // 386
        return a;                                                                                                     // 387
    }                                                                                                                 // 388
                                                                                                                      // 389
    function cloneMoment(m) {                                                                                         // 390
        var result = {}, i;                                                                                           // 391
        for (i in m) {                                                                                                // 392
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {                                          // 393
                result[i] = m[i];                                                                                     // 394
            }                                                                                                         // 395
        }                                                                                                             // 396
                                                                                                                      // 397
        return result;                                                                                                // 398
    }                                                                                                                 // 399
                                                                                                                      // 400
    function absRound(number) {                                                                                       // 401
        if (number < 0) {                                                                                             // 402
            return Math.ceil(number);                                                                                 // 403
        } else {                                                                                                      // 404
            return Math.floor(number);                                                                                // 405
        }                                                                                                             // 406
    }                                                                                                                 // 407
                                                                                                                      // 408
    // left zero fill a number                                                                                        // 409
    // see http://jsperf.com/left-zero-filling for performance comparison                                             // 410
    function leftZeroFill(number, targetLength, forceSign) {                                                          // 411
        var output = '' + Math.abs(number),                                                                           // 412
            sign = number >= 0;                                                                                       // 413
                                                                                                                      // 414
        while (output.length < targetLength) {                                                                        // 415
            output = '0' + output;                                                                                    // 416
        }                                                                                                             // 417
        return (sign ? (forceSign ? '+' : '') : '-') + output;                                                        // 418
    }                                                                                                                 // 419
                                                                                                                      // 420
    // helper function for _.addTime and _.subtractTime                                                               // 421
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {                           // 422
        var milliseconds = duration._milliseconds,                                                                    // 423
            days = duration._days,                                                                                    // 424
            months = duration._months,                                                                                // 425
            minutes,                                                                                                  // 426
            hours;                                                                                                    // 427
                                                                                                                      // 428
        if (milliseconds) {                                                                                           // 429
            mom._d.setTime(+mom._d + milliseconds * isAdding);                                                        // 430
        }                                                                                                             // 431
        // store the minutes and hours so we can restore them                                                         // 432
        if (days || months) {                                                                                         // 433
            minutes = mom.minute();                                                                                   // 434
            hours = mom.hour();                                                                                       // 435
        }                                                                                                             // 436
        if (days) {                                                                                                   // 437
            mom.date(mom.date() + days * isAdding);                                                                   // 438
        }                                                                                                             // 439
        if (months) {                                                                                                 // 440
            mom.month(mom.month() + months * isAdding);                                                               // 441
        }                                                                                                             // 442
        if (milliseconds && !ignoreUpdateOffset) {                                                                    // 443
            moment.updateOffset(mom);                                                                                 // 444
        }                                                                                                             // 445
        // restore the minutes and hours after possibly changing dst                                                  // 446
        if (days || months) {                                                                                         // 447
            mom.minute(minutes);                                                                                      // 448
            mom.hour(hours);                                                                                          // 449
        }                                                                                                             // 450
    }                                                                                                                 // 451
                                                                                                                      // 452
    // check if is an array                                                                                           // 453
    function isArray(input) {                                                                                         // 454
        return Object.prototype.toString.call(input) === '[object Array]';                                            // 455
    }                                                                                                                 // 456
                                                                                                                      // 457
    function isDate(input) {                                                                                          // 458
        return  Object.prototype.toString.call(input) === '[object Date]' ||                                          // 459
                input instanceof Date;                                                                                // 460
    }                                                                                                                 // 461
                                                                                                                      // 462
    // compare two arrays, return the number of differences                                                           // 463
    function compareArrays(array1, array2, dontConvert) {                                                             // 464
        var len = Math.min(array1.length, array2.length),                                                             // 465
            lengthDiff = Math.abs(array1.length - array2.length),                                                     // 466
            diffs = 0,                                                                                                // 467
            i;                                                                                                        // 468
        for (i = 0; i < len; i++) {                                                                                   // 469
            if ((dontConvert && array1[i] !== array2[i]) ||                                                           // 470
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {                                            // 471
                diffs++;                                                                                              // 472
            }                                                                                                         // 473
        }                                                                                                             // 474
        return diffs + lengthDiff;                                                                                    // 475
    }                                                                                                                 // 476
                                                                                                                      // 477
    function normalizeUnits(units) {                                                                                  // 478
        if (units) {                                                                                                  // 479
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');                                                 // 480
            units = unitAliases[units] || camelFunctions[lowered] || lowered;                                         // 481
        }                                                                                                             // 482
        return units;                                                                                                 // 483
    }                                                                                                                 // 484
                                                                                                                      // 485
    function normalizeObjectUnits(inputObject) {                                                                      // 486
        var normalizedInput = {},                                                                                     // 487
            normalizedProp,                                                                                           // 488
            prop;                                                                                                     // 489
                                                                                                                      // 490
        for (prop in inputObject) {                                                                                   // 491
            if (inputObject.hasOwnProperty(prop)) {                                                                   // 492
                normalizedProp = normalizeUnits(prop);                                                                // 493
                if (normalizedProp) {                                                                                 // 494
                    normalizedInput[normalizedProp] = inputObject[prop];                                              // 495
                }                                                                                                     // 496
            }                                                                                                         // 497
        }                                                                                                             // 498
                                                                                                                      // 499
        return normalizedInput;                                                                                       // 500
    }                                                                                                                 // 501
                                                                                                                      // 502
    function makeList(field) {                                                                                        // 503
        var count, setter;                                                                                            // 504
                                                                                                                      // 505
        if (field.indexOf('week') === 0) {                                                                            // 506
            count = 7;                                                                                                // 507
            setter = 'day';                                                                                           // 508
        }                                                                                                             // 509
        else if (field.indexOf('month') === 0) {                                                                      // 510
            count = 12;                                                                                               // 511
            setter = 'month';                                                                                         // 512
        }                                                                                                             // 513
        else {                                                                                                        // 514
            return;                                                                                                   // 515
        }                                                                                                             // 516
                                                                                                                      // 517
        moment[field] = function (format, index) {                                                                    // 518
            var i, getter,                                                                                            // 519
                method = moment.fn._lang[field],                                                                      // 520
                results = [];                                                                                         // 521
                                                                                                                      // 522
            if (typeof format === 'number') {                                                                         // 523
                index = format;                                                                                       // 524
                format = undefined;                                                                                   // 525
            }                                                                                                         // 526
                                                                                                                      // 527
            getter = function (i) {                                                                                   // 528
                var m = moment().utc().set(setter, i);                                                                // 529
                return method.call(moment.fn._lang, m, format || '');                                                 // 530
            };                                                                                                        // 531
                                                                                                                      // 532
            if (index != null) {                                                                                      // 533
                return getter(index);                                                                                 // 534
            }                                                                                                         // 535
            else {                                                                                                    // 536
                for (i = 0; i < count; i++) {                                                                         // 537
                    results.push(getter(i));                                                                          // 538
                }                                                                                                     // 539
                return results;                                                                                       // 540
            }                                                                                                         // 541
        };                                                                                                            // 542
    }                                                                                                                 // 543
                                                                                                                      // 544
    function toInt(argumentForCoercion) {                                                                             // 545
        var coercedNumber = +argumentForCoercion,                                                                     // 546
            value = 0;                                                                                                // 547
                                                                                                                      // 548
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {                                                         // 549
            if (coercedNumber >= 0) {                                                                                 // 550
                value = Math.floor(coercedNumber);                                                                    // 551
            } else {                                                                                                  // 552
                value = Math.ceil(coercedNumber);                                                                     // 553
            }                                                                                                         // 554
        }                                                                                                             // 555
                                                                                                                      // 556
        return value;                                                                                                 // 557
    }                                                                                                                 // 558
                                                                                                                      // 559
    function daysInMonth(year, month) {                                                                               // 560
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();                                                   // 561
    }                                                                                                                 // 562
                                                                                                                      // 563
    function daysInYear(year) {                                                                                       // 564
        return isLeapYear(year) ? 366 : 365;                                                                          // 565
    }                                                                                                                 // 566
                                                                                                                      // 567
    function isLeapYear(year) {                                                                                       // 568
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;                                              // 569
    }                                                                                                                 // 570
                                                                                                                      // 571
    function checkOverflow(m) {                                                                                       // 572
        var overflow;                                                                                                 // 573
        if (m._a && m._pf.overflow === -2) {                                                                          // 574
            overflow =                                                                                                // 575
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :                                                         // 576
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :                          // 577
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :                                                            // 578
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :                                                      // 579
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :                                                      // 580
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :                                      // 581
                -1;                                                                                                   // 582
                                                                                                                      // 583
            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {                                   // 584
                overflow = DATE;                                                                                      // 585
            }                                                                                                         // 586
                                                                                                                      // 587
            m._pf.overflow = overflow;                                                                                // 588
        }                                                                                                             // 589
    }                                                                                                                 // 590
                                                                                                                      // 591
    function isValid(m) {                                                                                             // 592
        if (m._isValid == null) {                                                                                     // 593
            m._isValid = !isNaN(m._d.getTime()) &&                                                                    // 594
                m._pf.overflow < 0 &&                                                                                 // 595
                !m._pf.empty &&                                                                                       // 596
                !m._pf.invalidMonth &&                                                                                // 597
                !m._pf.nullInput &&                                                                                   // 598
                !m._pf.invalidFormat &&                                                                               // 599
                !m._pf.userInvalidated;                                                                               // 600
                                                                                                                      // 601
            if (m._strict) {                                                                                          // 602
                m._isValid = m._isValid &&                                                                            // 603
                    m._pf.charsLeftOver === 0 &&                                                                      // 604
                    m._pf.unusedTokens.length === 0;                                                                  // 605
            }                                                                                                         // 606
        }                                                                                                             // 607
        return m._isValid;                                                                                            // 608
    }                                                                                                                 // 609
                                                                                                                      // 610
    function normalizeLanguage(key) {                                                                                 // 611
        return key ? key.toLowerCase().replace('_', '-') : key;                                                       // 612
    }                                                                                                                 // 613
                                                                                                                      // 614
    // Return a moment from input, that is local/utc/zone equivalent to model.                                        // 615
    function makeAs(input, model) {                                                                                   // 616
        return model._isUTC ? moment(input).zone(model._offset || 0) :                                                // 617
            moment(input).local();                                                                                    // 618
    }                                                                                                                 // 619
                                                                                                                      // 620
    /************************************                                                                             // 621
        Languages                                                                                                     // 622
    ************************************/                                                                             // 623
                                                                                                                      // 624
                                                                                                                      // 625
    extend(Language.prototype, {                                                                                      // 626
                                                                                                                      // 627
        set : function (config) {                                                                                     // 628
            var prop, i;                                                                                              // 629
            for (i in config) {                                                                                       // 630
                prop = config[i];                                                                                     // 631
                if (typeof prop === 'function') {                                                                     // 632
                    this[i] = prop;                                                                                   // 633
                } else {                                                                                              // 634
                    this['_' + i] = prop;                                                                             // 635
                }                                                                                                     // 636
            }                                                                                                         // 637
        },                                                                                                            // 638
                                                                                                                      // 639
        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), // 640
        months : function (m) {                                                                                       // 641
            return this._months[m.month()];                                                                           // 642
        },                                                                                                            // 643
                                                                                                                      // 644
        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),                                  // 645
        monthsShort : function (m) {                                                                                  // 646
            return this._monthsShort[m.month()];                                                                      // 647
        },                                                                                                            // 648
                                                                                                                      // 649
        monthsParse : function (monthName) {                                                                          // 650
            var i, mom, regex;                                                                                        // 651
                                                                                                                      // 652
            if (!this._monthsParse) {                                                                                 // 653
                this._monthsParse = [];                                                                               // 654
            }                                                                                                         // 655
                                                                                                                      // 656
            for (i = 0; i < 12; i++) {                                                                                // 657
                // make the regex if we don't have it already                                                         // 658
                if (!this._monthsParse[i]) {                                                                          // 659
                    mom = moment.utc([2000, i]);                                                                      // 660
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');                            // 661
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');                                   // 662
                }                                                                                                     // 663
                // test the regex                                                                                     // 664
                if (this._monthsParse[i].test(monthName)) {                                                           // 665
                    return i;                                                                                         // 666
                }                                                                                                     // 667
            }                                                                                                         // 668
        },                                                                                                            // 669
                                                                                                                      // 670
        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),                            // 671
        weekdays : function (m) {                                                                                     // 672
            return this._weekdays[m.day()];                                                                           // 673
        },                                                                                                            // 674
                                                                                                                      // 675
        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),                                                    // 676
        weekdaysShort : function (m) {                                                                                // 677
            return this._weekdaysShort[m.day()];                                                                      // 678
        },                                                                                                            // 679
                                                                                                                      // 680
        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),                                                             // 681
        weekdaysMin : function (m) {                                                                                  // 682
            return this._weekdaysMin[m.day()];                                                                        // 683
        },                                                                                                            // 684
                                                                                                                      // 685
        weekdaysParse : function (weekdayName) {                                                                      // 686
            var i, mom, regex;                                                                                        // 687
                                                                                                                      // 688
            if (!this._weekdaysParse) {                                                                               // 689
                this._weekdaysParse = [];                                                                             // 690
            }                                                                                                         // 691
                                                                                                                      // 692
            for (i = 0; i < 7; i++) {                                                                                 // 693
                // make the regex if we don't have it already                                                         // 694
                if (!this._weekdaysParse[i]) {                                                                        // 695
                    mom = moment([2000, 1]).day(i);                                                                   // 696
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');                                 // 698
                }                                                                                                     // 699
                // test the regex                                                                                     // 700
                if (this._weekdaysParse[i].test(weekdayName)) {                                                       // 701
                    return i;                                                                                         // 702
                }                                                                                                     // 703
            }                                                                                                         // 704
        },                                                                                                            // 705
                                                                                                                      // 706
        _longDateFormat : {                                                                                           // 707
            LT : "h:mm A",                                                                                            // 708
            L : "MM/DD/YYYY",                                                                                         // 709
            LL : "MMMM D YYYY",                                                                                       // 710
            LLL : "MMMM D YYYY LT",                                                                                   // 711
            LLLL : "dddd, MMMM D YYYY LT"                                                                             // 712
        },                                                                                                            // 713
        longDateFormat : function (key) {                                                                             // 714
            var output = this._longDateFormat[key];                                                                   // 715
            if (!output && this._longDateFormat[key.toUpperCase()]) {                                                 // 716
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {         // 717
                    return val.slice(1);                                                                              // 718
                });                                                                                                   // 719
                this._longDateFormat[key] = output;                                                                   // 720
            }                                                                                                         // 721
            return output;                                                                                            // 722
        },                                                                                                            // 723
                                                                                                                      // 724
        isPM : function (input) {                                                                                     // 725
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays                        // 726
            // Using charAt should be more compatible.                                                                // 727
            return ((input + '').toLowerCase().charAt(0) === 'p');                                                    // 728
        },                                                                                                            // 729
                                                                                                                      // 730
        _meridiemParse : /[ap]\.?m?\.?/i,                                                                             // 731
        meridiem : function (hours, minutes, isLower) {                                                               // 732
            if (hours > 11) {                                                                                         // 733
                return isLower ? 'pm' : 'PM';                                                                         // 734
            } else {                                                                                                  // 735
                return isLower ? 'am' : 'AM';                                                                         // 736
            }                                                                                                         // 737
        },                                                                                                            // 738
                                                                                                                      // 739
        _calendar : {                                                                                                 // 740
            sameDay : '[Today at] LT',                                                                                // 741
            nextDay : '[Tomorrow at] LT',                                                                             // 742
            nextWeek : 'dddd [at] LT',                                                                                // 743
            lastDay : '[Yesterday at] LT',                                                                            // 744
            lastWeek : '[Last] dddd [at] LT',                                                                         // 745
            sameElse : 'L'                                                                                            // 746
        },                                                                                                            // 747
        calendar : function (key, mom) {                                                                              // 748
            var output = this._calendar[key];                                                                         // 749
            return typeof output === 'function' ? output.apply(mom) : output;                                         // 750
        },                                                                                                            // 751
                                                                                                                      // 752
        _relativeTime : {                                                                                             // 753
            future : "in %s",                                                                                         // 754
            past : "%s ago",                                                                                          // 755
            s : "a few seconds",                                                                                      // 756
            m : "a minute",                                                                                           // 757
            mm : "%d minutes",                                                                                        // 758
            h : "an hour",                                                                                            // 759
            hh : "%d hours",                                                                                          // 760
            d : "a day",                                                                                              // 761
            dd : "%d days",                                                                                           // 762
            M : "a month",                                                                                            // 763
            MM : "%d months",                                                                                         // 764
            y : "a year",                                                                                             // 765
            yy : "%d years"                                                                                           // 766
        },                                                                                                            // 767
        relativeTime : function (number, withoutSuffix, string, isFuture) {                                           // 768
            var output = this._relativeTime[string];                                                                  // 769
            return (typeof output === 'function') ?                                                                   // 770
                output(number, withoutSuffix, string, isFuture) :                                                     // 771
                output.replace(/%d/i, number);                                                                        // 772
        },                                                                                                            // 773
        pastFuture : function (diff, output) {                                                                        // 774
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];                                            // 775
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);                     // 776
        },                                                                                                            // 777
                                                                                                                      // 778
        ordinal : function (number) {                                                                                 // 779
            return this._ordinal.replace("%d", number);                                                               // 780
        },                                                                                                            // 781
        _ordinal : "%d",                                                                                              // 782
                                                                                                                      // 783
        preparse : function (string) {                                                                                // 784
            return string;                                                                                            // 785
        },                                                                                                            // 786
                                                                                                                      // 787
        postformat : function (string) {                                                                              // 788
            return string;                                                                                            // 789
        },                                                                                                            // 790
                                                                                                                      // 791
        week : function (mom) {                                                                                       // 792
            return weekOfYear(mom, this._week.dow, this._week.doy).week;                                              // 793
        },                                                                                                            // 794
                                                                                                                      // 795
        _week : {                                                                                                     // 796
            dow : 0, // Sunday is the first day of the week.                                                          // 797
            doy : 6  // The week that contains Jan 1st is the first week of the year.                                 // 798
        },                                                                                                            // 799
                                                                                                                      // 800
        _invalidDate: 'Invalid date',                                                                                 // 801
        invalidDate: function () {                                                                                    // 802
            return this._invalidDate;                                                                                 // 803
        }                                                                                                             // 804
    });                                                                                                               // 805
                                                                                                                      // 806
    // Loads a language definition into the `languages` cache.  The function                                          // 807
    // takes a key and optionally values.  If not in the browser and no values                                        // 808
    // are provided, it will load the language file module.  As a convenience,                                        // 809
    // this function also returns the language values.                                                                // 810
    function loadLang(key, values) {                                                                                  // 811
        values.abbr = key;                                                                                            // 812
        if (!languages[key]) {                                                                                        // 813
            languages[key] = new Language();                                                                          // 814
        }                                                                                                             // 815
        languages[key].set(values);                                                                                   // 816
        return languages[key];                                                                                        // 817
    }                                                                                                                 // 818
                                                                                                                      // 819
    // Remove a language from the `languages` cache. Mostly useful in tests.                                          // 820
    function unloadLang(key) {                                                                                        // 821
        delete languages[key];                                                                                        // 822
    }                                                                                                                 // 823
                                                                                                                      // 824
    // Determines which language definition to use and returns it.                                                    // 825
    //                                                                                                                // 826
    // With no parameters, it will return the global language.  If you                                                // 827
    // pass in a language key, such as 'en', it will return the                                                       // 828
    // definition for 'en', so long as 'en' has already been loaded using                                             // 829
    // moment.lang.                                                                                                   // 830
    function getLangDefinition(key) {                                                                                 // 831
        var i = 0, j, lang, next, split,                                                                              // 832
            get = function (k) {                                                                                      // 833
                if (!languages[k] && hasModule) {                                                                     // 834
                    try {                                                                                             // 835
                        require('./lang/' + k);                                                                       // 836
                    } catch (e) { }                                                                                   // 837
                }                                                                                                     // 838
                return languages[k];                                                                                  // 839
            };                                                                                                        // 840
                                                                                                                      // 841
        if (!key) {                                                                                                   // 842
            return moment.fn._lang;                                                                                   // 843
        }                                                                                                             // 844
                                                                                                                      // 845
        if (!isArray(key)) {                                                                                          // 846
            //short-circuit everything else                                                                           // 847
            lang = get(key);                                                                                          // 848
            if (lang) {                                                                                               // 849
                return lang;                                                                                          // 850
            }                                                                                                         // 851
            key = [key];                                                                                              // 852
        }                                                                                                             // 853
                                                                                                                      // 854
        //pick the language from the array                                                                            // 855
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each                   // 856
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {                                                                                      // 858
            split = normalizeLanguage(key[i]).split('-');                                                             // 859
            j = split.length;                                                                                         // 860
            next = normalizeLanguage(key[i + 1]);                                                                     // 861
            next = next ? next.split('-') : null;                                                                     // 862
            while (j > 0) {                                                                                           // 863
                lang = get(split.slice(0, j).join('-'));                                                              // 864
                if (lang) {                                                                                           // 865
                    return lang;                                                                                      // 866
                }                                                                                                     // 867
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {                          // 868
                    //the next array item is better than a shallower substring of this one                            // 869
                    break;                                                                                            // 870
                }                                                                                                     // 871
                j--;                                                                                                  // 872
            }                                                                                                         // 873
            i++;                                                                                                      // 874
        }                                                                                                             // 875
        return moment.fn._lang;                                                                                       // 876
    }                                                                                                                 // 877
                                                                                                                      // 878
    /************************************                                                                             // 879
        Formatting                                                                                                    // 880
    ************************************/                                                                             // 881
                                                                                                                      // 882
                                                                                                                      // 883
    function removeFormattingTokens(input) {                                                                          // 884
        if (input.match(/\[[\s\S]/)) {                                                                                // 885
            return input.replace(/^\[|\]$/g, "");                                                                     // 886
        }                                                                                                             // 887
        return input.replace(/\\/g, "");                                                                              // 888
    }                                                                                                                 // 889
                                                                                                                      // 890
    function makeFormatFunction(format) {                                                                             // 891
        var array = format.match(formattingTokens), i, length;                                                        // 892
                                                                                                                      // 893
        for (i = 0, length = array.length; i < length; i++) {                                                         // 894
            if (formatTokenFunctions[array[i]]) {                                                                     // 895
                array[i] = formatTokenFunctions[array[i]];                                                            // 896
            } else {                                                                                                  // 897
                array[i] = removeFormattingTokens(array[i]);                                                          // 898
            }                                                                                                         // 899
        }                                                                                                             // 900
                                                                                                                      // 901
        return function (mom) {                                                                                       // 902
            var output = "";                                                                                          // 903
            for (i = 0; i < length; i++) {                                                                            // 904
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];                       // 905
            }                                                                                                         // 906
            return output;                                                                                            // 907
        };                                                                                                            // 908
    }                                                                                                                 // 909
                                                                                                                      // 910
    // format date using native date object                                                                           // 911
    function formatMoment(m, format) {                                                                                // 912
                                                                                                                      // 913
        if (!m.isValid()) {                                                                                           // 914
            return m.lang().invalidDate();                                                                            // 915
        }                                                                                                             // 916
                                                                                                                      // 917
        format = expandFormat(format, m.lang());                                                                      // 918
                                                                                                                      // 919
        if (!formatFunctions[format]) {                                                                               // 920
            formatFunctions[format] = makeFormatFunction(format);                                                     // 921
        }                                                                                                             // 922
                                                                                                                      // 923
        return formatFunctions[format](m);                                                                            // 924
    }                                                                                                                 // 925
                                                                                                                      // 926
    function expandFormat(format, lang) {                                                                             // 927
        var i = 5;                                                                                                    // 928
                                                                                                                      // 929
        function replaceLongDateFormatTokens(input) {                                                                 // 930
            return lang.longDateFormat(input) || input;                                                               // 931
        }                                                                                                             // 932
                                                                                                                      // 933
        localFormattingTokens.lastIndex = 0;                                                                          // 934
        while (i >= 0 && localFormattingTokens.test(format)) {                                                        // 935
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);                              // 936
            localFormattingTokens.lastIndex = 0;                                                                      // 937
            i -= 1;                                                                                                   // 938
        }                                                                                                             // 939
                                                                                                                      // 940
        return format;                                                                                                // 941
    }                                                                                                                 // 942
                                                                                                                      // 943
                                                                                                                      // 944
    /************************************                                                                             // 945
        Parsing                                                                                                       // 946
    ************************************/                                                                             // 947
                                                                                                                      // 948
                                                                                                                      // 949
    // get the regex to find the next token                                                                           // 950
    function getParseRegexForToken(token, config) {                                                                   // 951
        var a, strict = config._strict;                                                                               // 952
        switch (token) {                                                                                              // 953
        case 'DDDD':                                                                                                  // 954
            return parseTokenThreeDigits;                                                                             // 955
        case 'YYYY':                                                                                                  // 956
        case 'GGGG':                                                                                                  // 957
        case 'gggg':                                                                                                  // 958
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;                                         // 959
        case 'Y':                                                                                                     // 960
        case 'G':                                                                                                     // 961
        case 'g':                                                                                                     // 962
            return parseTokenSignedNumber;                                                                            // 963
        case 'YYYYYY':                                                                                                // 964
        case 'YYYYY':                                                                                                 // 965
        case 'GGGGG':                                                                                                 // 966
        case 'ggggg':                                                                                                 // 967
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;                                           // 968
        case 'S':                                                                                                     // 969
            if (strict) { return parseTokenOneDigit; }                                                                // 970
            /* falls through */                                                                                       // 971
        case 'SS':                                                                                                    // 972
            if (strict) { return parseTokenTwoDigits; }                                                               // 973
            /* falls through */                                                                                       // 974
        case 'SSS':                                                                                                   // 975
            if (strict) { return parseTokenThreeDigits; }                                                             // 976
            /* falls through */                                                                                       // 977
        case 'DDD':                                                                                                   // 978
            return parseTokenOneToThreeDigits;                                                                        // 979
        case 'MMM':                                                                                                   // 980
        case 'MMMM':                                                                                                  // 981
        case 'dd':                                                                                                    // 982
        case 'ddd':                                                                                                   // 983
        case 'dddd':                                                                                                  // 984
            return parseTokenWord;                                                                                    // 985
        case 'a':                                                                                                     // 986
        case 'A':                                                                                                     // 987
            return getLangDefinition(config._l)._meridiemParse;                                                       // 988
        case 'X':                                                                                                     // 989
            return parseTokenTimestampMs;                                                                             // 990
        case 'Z':                                                                                                     // 991
        case 'ZZ':                                                                                                    // 992
            return parseTokenTimezone;                                                                                // 993
        case 'T':                                                                                                     // 994
            return parseTokenT;                                                                                       // 995
        case 'SSSS':                                                                                                  // 996
            return parseTokenDigits;                                                                                  // 997
        case 'MM':                                                                                                    // 998
        case 'DD':                                                                                                    // 999
        case 'YY':                                                                                                    // 1000
        case 'GG':                                                                                                    // 1001
        case 'gg':                                                                                                    // 1002
        case 'HH':                                                                                                    // 1003
        case 'hh':                                                                                                    // 1004
        case 'mm':                                                                                                    // 1005
        case 'ss':                                                                                                    // 1006
        case 'ww':                                                                                                    // 1007
        case 'WW':                                                                                                    // 1008
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;                                           // 1009
        case 'M':                                                                                                     // 1010
        case 'D':                                                                                                     // 1011
        case 'd':                                                                                                     // 1012
        case 'H':                                                                                                     // 1013
        case 'h':                                                                                                     // 1014
        case 'm':                                                                                                     // 1015
        case 's':                                                                                                     // 1016
        case 'w':                                                                                                     // 1017
        case 'W':                                                                                                     // 1018
        case 'e':                                                                                                     // 1019
        case 'E':                                                                                                     // 1020
            return parseTokenOneOrTwoDigits;                                                                          // 1021
        default :                                                                                                     // 1022
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));                               // 1023
            return a;                                                                                                 // 1024
        }                                                                                                             // 1025
    }                                                                                                                 // 1026
                                                                                                                      // 1027
    function timezoneMinutesFromString(string) {                                                                      // 1028
        string = string || "";                                                                                        // 1029
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),                                             // 1030
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],                                          // 1031
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],                                        // 1032
            minutes = +(parts[1] * 60) + toInt(parts[2]);                                                             // 1033
                                                                                                                      // 1034
        return parts[0] === '+' ? -minutes : minutes;                                                                 // 1035
    }                                                                                                                 // 1036
                                                                                                                      // 1037
    // function to convert string input to date                                                                       // 1038
    function addTimeToArrayFromToken(token, input, config) {                                                          // 1039
        var a, datePartArray = config._a;                                                                             // 1040
                                                                                                                      // 1041
        switch (token) {                                                                                              // 1042
        // MONTH                                                                                                      // 1043
        case 'M' : // fall through to MM                                                                              // 1044
        case 'MM' :                                                                                                   // 1045
            if (input != null) {                                                                                      // 1046
                datePartArray[MONTH] = toInt(input) - 1;                                                              // 1047
            }                                                                                                         // 1048
            break;                                                                                                    // 1049
        case 'MMM' : // fall through to MMMM                                                                          // 1050
        case 'MMMM' :                                                                                                 // 1051
            a = getLangDefinition(config._l).monthsParse(input);                                                      // 1052
            // if we didn't find a month name, mark the date as invalid.                                              // 1053
            if (a != null) {                                                                                          // 1054
                datePartArray[MONTH] = a;                                                                             // 1055
            } else {                                                                                                  // 1056
                config._pf.invalidMonth = input;                                                                      // 1057
            }                                                                                                         // 1058
            break;                                                                                                    // 1059
        // DAY OF MONTH                                                                                               // 1060
        case 'D' : // fall through to DD                                                                              // 1061
        case 'DD' :                                                                                                   // 1062
            if (input != null) {                                                                                      // 1063
                datePartArray[DATE] = toInt(input);                                                                   // 1064
            }                                                                                                         // 1065
            break;                                                                                                    // 1066
        // DAY OF YEAR                                                                                                // 1067
        case 'DDD' : // fall through to DDDD                                                                          // 1068
        case 'DDDD' :                                                                                                 // 1069
            if (input != null) {                                                                                      // 1070
                config._dayOfYear = toInt(input);                                                                     // 1071
            }                                                                                                         // 1072
                                                                                                                      // 1073
            break;                                                                                                    // 1074
        // YEAR                                                                                                       // 1075
        case 'YY' :                                                                                                   // 1076
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);                                   // 1077
            break;                                                                                                    // 1078
        case 'YYYY' :                                                                                                 // 1079
        case 'YYYYY' :                                                                                                // 1080
        case 'YYYYYY' :                                                                                               // 1081
            datePartArray[YEAR] = toInt(input);                                                                       // 1082
            break;                                                                                                    // 1083
        // AM / PM                                                                                                    // 1084
        case 'a' : // fall through to A                                                                               // 1085
        case 'A' :                                                                                                    // 1086
            config._isPm = getLangDefinition(config._l).isPM(input);                                                  // 1087
            break;                                                                                                    // 1088
        // 24 HOUR                                                                                                    // 1089
        case 'H' : // fall through to hh                                                                              // 1090
        case 'HH' : // fall through to hh                                                                             // 1091
        case 'h' : // fall through to hh                                                                              // 1092
        case 'hh' :                                                                                                   // 1093
            datePartArray[HOUR] = toInt(input);                                                                       // 1094
            break;                                                                                                    // 1095
        // MINUTE                                                                                                     // 1096
        case 'm' : // fall through to mm                                                                              // 1097
        case 'mm' :                                                                                                   // 1098
            datePartArray[MINUTE] = toInt(input);                                                                     // 1099
            break;                                                                                                    // 1100
        // SECOND                                                                                                     // 1101
        case 's' : // fall through to ss                                                                              // 1102
        case 'ss' :                                                                                                   // 1103
            datePartArray[SECOND] = toInt(input);                                                                     // 1104
            break;                                                                                                    // 1105
        // MILLISECOND                                                                                                // 1106
        case 'S' :                                                                                                    // 1107
        case 'SS' :                                                                                                   // 1108
        case 'SSS' :                                                                                                  // 1109
        case 'SSSS' :                                                                                                 // 1110
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);                                                // 1111
            break;                                                                                                    // 1112
        // UNIX TIMESTAMP WITH MS                                                                                     // 1113
        case 'X':                                                                                                     // 1114
            config._d = new Date(parseFloat(input) * 1000);                                                           // 1115
            break;                                                                                                    // 1116
        // TIMEZONE                                                                                                   // 1117
        case 'Z' : // fall through to ZZ                                                                              // 1118
        case 'ZZ' :                                                                                                   // 1119
            config._useUTC = true;                                                                                    // 1120
            config._tzm = timezoneMinutesFromString(input);                                                           // 1121
            break;                                                                                                    // 1122
        case 'w':                                                                                                     // 1123
        case 'ww':                                                                                                    // 1124
        case 'W':                                                                                                     // 1125
        case 'WW':                                                                                                    // 1126
        case 'd':                                                                                                     // 1127
        case 'dd':                                                                                                    // 1128
        case 'ddd':                                                                                                   // 1129
        case 'dddd':                                                                                                  // 1130
        case 'e':                                                                                                     // 1131
        case 'E':                                                                                                     // 1132
            token = token.substr(0, 1);                                                                               // 1133
            /* falls through */                                                                                       // 1134
        case 'gg':                                                                                                    // 1135
        case 'gggg':                                                                                                  // 1136
        case 'GG':                                                                                                    // 1137
        case 'GGGG':                                                                                                  // 1138
        case 'GGGGG':                                                                                                 // 1139
            token = token.substr(0, 2);                                                                               // 1140
            if (input) {                                                                                              // 1141
                config._w = config._w || {};                                                                          // 1142
                config._w[token] = input;                                                                             // 1143
            }                                                                                                         // 1144
            break;                                                                                                    // 1145
        }                                                                                                             // 1146
    }                                                                                                                 // 1147
                                                                                                                      // 1148
    // convert an array to a date.                                                                                    // 1149
    // the array should mirror the parameters below                                                                   // 1150
    // note: all values past the year are optional and will default to the lowest possible value.                     // 1151
    // [year, month, day , hour, minute, second, millisecond]                                                         // 1152
    function dateFromConfig(config) {                                                                                 // 1153
        var i, date, input = [], currentDate,                                                                         // 1154
            yearToUse, fixYear, w, temp, lang, weekday, week;                                                         // 1155
                                                                                                                      // 1156
        if (config._d) {                                                                                              // 1157
            return;                                                                                                   // 1158
        }                                                                                                             // 1159
                                                                                                                      // 1160
        currentDate = currentDateArray(config);                                                                       // 1161
                                                                                                                      // 1162
        //compute day of the year from weeks and weekdays                                                             // 1163
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {                                       // 1164
            fixYear = function (val) {                                                                                // 1165
                var int_val = parseInt(val, 10);                                                                      // 1166
                return val ?                                                                                          // 1167
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :                     // 1168
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);                                  // 1169
            };                                                                                                        // 1170
                                                                                                                      // 1171
            w = config._w;                                                                                            // 1172
            if (w.GG != null || w.W != null || w.E != null) {                                                         // 1173
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);                                        // 1174
            }                                                                                                         // 1175
            else {                                                                                                    // 1176
                lang = getLangDefinition(config._l);                                                                  // 1177
                weekday = w.d != null ?  parseWeekday(w.d, lang) :                                                    // 1178
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);                                            // 1179
                                                                                                                      // 1180
                week = parseInt(w.w, 10) || 1;                                                                        // 1181
                                                                                                                      // 1182
                //if we're parsing 'd', then the low day numbers may be next week                                     // 1183
                if (w.d != null && weekday < lang._week.dow) {                                                        // 1184
                    week++;                                                                                           // 1185
                }                                                                                                     // 1186
                                                                                                                      // 1187
                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);              // 1188
            }                                                                                                         // 1189
                                                                                                                      // 1190
            config._a[YEAR] = temp.year;                                                                              // 1191
            config._dayOfYear = temp.dayOfYear;                                                                       // 1192
        }                                                                                                             // 1193
                                                                                                                      // 1194
        //if the day of the year is set, figure out what it is                                                        // 1195
        if (config._dayOfYear) {                                                                                      // 1196
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];                                // 1197
                                                                                                                      // 1198
            if (config._dayOfYear > daysInYear(yearToUse)) {                                                          // 1199
                config._pf._overflowDayOfYear = true;                                                                 // 1200
            }                                                                                                         // 1201
                                                                                                                      // 1202
            date = makeUTCDate(yearToUse, 0, config._dayOfYear);                                                      // 1203
            config._a[MONTH] = date.getUTCMonth();                                                                    // 1204
            config._a[DATE] = date.getUTCDate();                                                                      // 1205
        }                                                                                                             // 1206
                                                                                                                      // 1207
        // Default to current date.                                                                                   // 1208
        // * if no year, month, day of month are given, default to today                                              // 1209
        // * if day of month is given, default month and year                                                         // 1210
        // * if month is given, default only year                                                                     // 1211
        // * if year is given, don't default anything                                                                 // 1212
        for (i = 0; i < 3 && config._a[i] == null; ++i) {                                                             // 1213
            config._a[i] = input[i] = currentDate[i];                                                                 // 1214
        }                                                                                                             // 1215
                                                                                                                      // 1216
        // Zero out whatever was not defaulted, including time                                                        // 1217
        for (; i < 7; i++) {                                                                                          // 1218
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];                      // 1219
        }                                                                                                             // 1220
                                                                                                                      // 1221
        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid            // 1222
        input[HOUR] += toInt((config._tzm || 0) / 60);                                                                // 1223
        input[MINUTE] += toInt((config._tzm || 0) % 60);                                                              // 1224
                                                                                                                      // 1225
        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);                                     // 1226
    }                                                                                                                 // 1227
                                                                                                                      // 1228
    function dateFromObject(config) {                                                                                 // 1229
        var normalizedInput;                                                                                          // 1230
                                                                                                                      // 1231
        if (config._d) {                                                                                              // 1232
            return;                                                                                                   // 1233
        }                                                                                                             // 1234
                                                                                                                      // 1235
        normalizedInput = normalizeObjectUnits(config._i);                                                            // 1236
        config._a = [                                                                                                 // 1237
            normalizedInput.year,                                                                                     // 1238
            normalizedInput.month,                                                                                    // 1239
            normalizedInput.day,                                                                                      // 1240
            normalizedInput.hour,                                                                                     // 1241
            normalizedInput.minute,                                                                                   // 1242
            normalizedInput.second,                                                                                   // 1243
            normalizedInput.millisecond                                                                               // 1244
        ];                                                                                                            // 1245
                                                                                                                      // 1246
        dateFromConfig(config);                                                                                       // 1247
    }                                                                                                                 // 1248
                                                                                                                      // 1249
    function currentDateArray(config) {                                                                               // 1250
        var now = new Date();                                                                                         // 1251
        if (config._useUTC) {                                                                                         // 1252
            return [                                                                                                  // 1253
                now.getUTCFullYear(),                                                                                 // 1254
                now.getUTCMonth(),                                                                                    // 1255
                now.getUTCDate()                                                                                      // 1256
            ];                                                                                                        // 1257
        } else {                                                                                                      // 1258
            return [now.getFullYear(), now.getMonth(), now.getDate()];                                                // 1259
        }                                                                                                             // 1260
    }                                                                                                                 // 1261
                                                                                                                      // 1262
    // date from string and format string                                                                             // 1263
    function makeDateFromStringAndFormat(config) {                                                                    // 1264
                                                                                                                      // 1265
        config._a = [];                                                                                               // 1266
        config._pf.empty = true;                                                                                      // 1267
                                                                                                                      // 1268
        // This array is used to make a Date, either with `new Date` or `Date.UTC`                                    // 1269
        var lang = getLangDefinition(config._l),                                                                      // 1270
            string = '' + config._i,                                                                                  // 1271
            i, parsedInput, tokens, token, skipped,                                                                   // 1272
            stringLength = string.length,                                                                             // 1273
            totalParsedInputLength = 0;                                                                               // 1274
                                                                                                                      // 1275
        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];                                         // 1276
                                                                                                                      // 1277
        for (i = 0; i < tokens.length; i++) {                                                                         // 1278
            token = tokens[i];                                                                                        // 1279
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];                              // 1280
            if (parsedInput) {                                                                                        // 1281
                skipped = string.substr(0, string.indexOf(parsedInput));                                              // 1282
                if (skipped.length > 0) {                                                                             // 1283
                    config._pf.unusedInput.push(skipped);                                                             // 1284
                }                                                                                                     // 1285
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);                              // 1286
                totalParsedInputLength += parsedInput.length;                                                         // 1287
            }                                                                                                         // 1288
            // don't parse if it's not a known token                                                                  // 1289
            if (formatTokenFunctions[token]) {                                                                        // 1290
                if (parsedInput) {                                                                                    // 1291
                    config._pf.empty = false;                                                                         // 1292
                }                                                                                                     // 1293
                else {                                                                                                // 1294
                    config._pf.unusedTokens.push(token);                                                              // 1295
                }                                                                                                     // 1296
                addTimeToArrayFromToken(token, parsedInput, config);                                                  // 1297
            }                                                                                                         // 1298
            else if (config._strict && !parsedInput) {                                                                // 1299
                config._pf.unusedTokens.push(token);                                                                  // 1300
            }                                                                                                         // 1301
        }                                                                                                             // 1302
                                                                                                                      // 1303
        // add remaining unparsed input length to the string                                                          // 1304
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;                                             // 1305
        if (string.length > 0) {                                                                                      // 1306
            config._pf.unusedInput.push(string);                                                                      // 1307
        }                                                                                                             // 1308
                                                                                                                      // 1309
        // handle am pm                                                                                               // 1310
        if (config._isPm && config._a[HOUR] < 12) {                                                                   // 1311
            config._a[HOUR] += 12;                                                                                    // 1312
        }                                                                                                             // 1313
        // if is 12 am, change hours to 0                                                                             // 1314
        if (config._isPm === false && config._a[HOUR] === 12) {                                                       // 1315
            config._a[HOUR] = 0;                                                                                      // 1316
        }                                                                                                             // 1317
                                                                                                                      // 1318
        dateFromConfig(config);                                                                                       // 1319
        checkOverflow(config);                                                                                        // 1320
    }                                                                                                                 // 1321
                                                                                                                      // 1322
    function unescapeFormat(s) {                                                                                      // 1323
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {                  // 1324
            return p1 || p2 || p3 || p4;                                                                              // 1325
        });                                                                                                           // 1326
    }                                                                                                                 // 1327
                                                                                                                      // 1328
    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript           // 1329
    function regexpEscape(s) {                                                                                        // 1330
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                                                           // 1331
    }                                                                                                                 // 1332
                                                                                                                      // 1333
    // date from string and array of format strings                                                                   // 1334
    function makeDateFromStringAndArray(config) {                                                                     // 1335
        var tempConfig,                                                                                               // 1336
            bestMoment,                                                                                               // 1337
                                                                                                                      // 1338
            scoreToBeat,                                                                                              // 1339
            i,                                                                                                        // 1340
            currentScore;                                                                                             // 1341
                                                                                                                      // 1342
        if (config._f.length === 0) {                                                                                 // 1343
            config._pf.invalidFormat = true;                                                                          // 1344
            config._d = new Date(NaN);                                                                                // 1345
            return;                                                                                                   // 1346
        }                                                                                                             // 1347
                                                                                                                      // 1348
        for (i = 0; i < config._f.length; i++) {                                                                      // 1349
            currentScore = 0;                                                                                         // 1350
            tempConfig = extend({}, config);                                                                          // 1351
            tempConfig._pf = defaultParsingFlags();                                                                   // 1352
            tempConfig._f = config._f[i];                                                                             // 1353
            makeDateFromStringAndFormat(tempConfig);                                                                  // 1354
                                                                                                                      // 1355
            if (!isValid(tempConfig)) {                                                                               // 1356
                continue;                                                                                             // 1357
            }                                                                                                         // 1358
                                                                                                                      // 1359
            // if there is any input that was not parsed add a penalty for that format                                // 1360
            currentScore += tempConfig._pf.charsLeftOver;                                                             // 1361
                                                                                                                      // 1362
            //or tokens                                                                                               // 1363
            currentScore += tempConfig._pf.unusedTokens.length * 10;                                                  // 1364
                                                                                                                      // 1365
            tempConfig._pf.score = currentScore;                                                                      // 1366
                                                                                                                      // 1367
            if (scoreToBeat == null || currentScore < scoreToBeat) {                                                  // 1368
                scoreToBeat = currentScore;                                                                           // 1369
                bestMoment = tempConfig;                                                                              // 1370
            }                                                                                                         // 1371
        }                                                                                                             // 1372
                                                                                                                      // 1373
        extend(config, bestMoment || tempConfig);                                                                     // 1374
    }                                                                                                                 // 1375
                                                                                                                      // 1376
    // date from iso format                                                                                           // 1377
    function makeDateFromString(config) {                                                                             // 1378
        var i, l,                                                                                                     // 1379
            string = config._i,                                                                                       // 1380
            match = isoRegex.exec(string);                                                                            // 1381
                                                                                                                      // 1382
        if (match) {                                                                                                  // 1383
            config._pf.iso = true;                                                                                    // 1384
            for (i = 0, l = isoDates.length; i < l; i++) {                                                            // 1385
                if (isoDates[i][1].exec(string)) {                                                                    // 1386
                    // match[5] should be "T" or undefined                                                            // 1387
                    config._f = isoDates[i][0] + (match[6] || " ");                                                   // 1388
                    break;                                                                                            // 1389
                }                                                                                                     // 1390
            }                                                                                                         // 1391
            for (i = 0, l = isoTimes.length; i < l; i++) {                                                            // 1392
                if (isoTimes[i][1].exec(string)) {                                                                    // 1393
                    config._f += isoTimes[i][0];                                                                      // 1394
                    break;                                                                                            // 1395
                }                                                                                                     // 1396
            }                                                                                                         // 1397
            if (string.match(parseTokenTimezone)) {                                                                   // 1398
                config._f += "Z";                                                                                     // 1399
            }                                                                                                         // 1400
            makeDateFromStringAndFormat(config);                                                                      // 1401
        }                                                                                                             // 1402
        else {                                                                                                        // 1403
            config._d = new Date(string);                                                                             // 1404
        }                                                                                                             // 1405
    }                                                                                                                 // 1406
                                                                                                                      // 1407
    function makeDateFromInput(config) {                                                                              // 1408
        var input = config._i,                                                                                        // 1409
            matched = aspNetJsonRegex.exec(input);                                                                    // 1410
                                                                                                                      // 1411
        if (input === undefined) {                                                                                    // 1412
            config._d = new Date();                                                                                   // 1413
        } else if (matched) {                                                                                         // 1414
            config._d = new Date(+matched[1]);                                                                        // 1415
        } else if (typeof input === 'string') {                                                                       // 1416
            makeDateFromString(config);                                                                               // 1417
        } else if (isArray(input)) {                                                                                  // 1418
            config._a = input.slice(0);                                                                               // 1419
            dateFromConfig(config);                                                                                   // 1420
        } else if (isDate(input)) {                                                                                   // 1421
            config._d = new Date(+input);                                                                             // 1422
        } else if (typeof(input) === 'object') {                                                                      // 1423
            dateFromObject(config);                                                                                   // 1424
        } else {                                                                                                      // 1425
            config._d = new Date(input);                                                                              // 1426
        }                                                                                                             // 1427
    }                                                                                                                 // 1428
                                                                                                                      // 1429
    function makeDate(y, m, d, h, M, s, ms) {                                                                         // 1430
        //can't just apply() to create a date:                                                                        // 1431
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);                                                                    // 1433
                                                                                                                      // 1434
        //the date constructor doesn't accept years < 1970                                                            // 1435
        if (y < 1970) {                                                                                               // 1436
            date.setFullYear(y);                                                                                      // 1437
        }                                                                                                             // 1438
        return date;                                                                                                  // 1439
    }                                                                                                                 // 1440
                                                                                                                      // 1441
    function makeUTCDate(y) {                                                                                         // 1442
        var date = new Date(Date.UTC.apply(null, arguments));                                                         // 1443
        if (y < 1970) {                                                                                               // 1444
            date.setUTCFullYear(y);                                                                                   // 1445
        }                                                                                                             // 1446
        return date;                                                                                                  // 1447
    }                                                                                                                 // 1448
                                                                                                                      // 1449
    function parseWeekday(input, language) {                                                                          // 1450
        if (typeof input === 'string') {                                                                              // 1451
            if (!isNaN(input)) {                                                                                      // 1452
                input = parseInt(input, 10);                                                                          // 1453
            }                                                                                                         // 1454
            else {                                                                                                    // 1455
                input = language.weekdaysParse(input);                                                                // 1456
                if (typeof input !== 'number') {                                                                      // 1457
                    return null;                                                                                      // 1458
                }                                                                                                     // 1459
            }                                                                                                         // 1460
        }                                                                                                             // 1461
        return input;                                                                                                 // 1462
    }                                                                                                                 // 1463
                                                                                                                      // 1464
    /************************************                                                                             // 1465
        Relative Time                                                                                                 // 1466
    ************************************/                                                                             // 1467
                                                                                                                      // 1468
                                                                                                                      // 1469
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize                         // 1470
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {                                       // 1471
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);                                     // 1472
    }                                                                                                                 // 1473
                                                                                                                      // 1474
    function relativeTime(milliseconds, withoutSuffix, lang) {                                                        // 1475
        var seconds = round(Math.abs(milliseconds) / 1000),                                                           // 1476
            minutes = round(seconds / 60),                                                                            // 1477
            hours = round(minutes / 60),                                                                              // 1478
            days = round(hours / 24),                                                                                 // 1479
            years = round(days / 365),                                                                                // 1480
            args = seconds < 45 && ['s', seconds] ||                                                                  // 1481
                minutes === 1 && ['m'] ||                                                                             // 1482
                minutes < 45 && ['mm', minutes] ||                                                                    // 1483
                hours === 1 && ['h'] ||                                                                               // 1484
                hours < 22 && ['hh', hours] ||                                                                        // 1485
                days === 1 && ['d'] ||                                                                                // 1486
                days <= 25 && ['dd', days] ||                                                                         // 1487
                days <= 45 && ['M'] ||                                                                                // 1488
                days < 345 && ['MM', round(days / 30)] ||                                                             // 1489
                years === 1 && ['y'] || ['yy', years];                                                                // 1490
        args[2] = withoutSuffix;                                                                                      // 1491
        args[3] = milliseconds > 0;                                                                                   // 1492
        args[4] = lang;                                                                                               // 1493
        return substituteTimeAgo.apply({}, args);                                                                     // 1494
    }                                                                                                                 // 1495
                                                                                                                      // 1496
                                                                                                                      // 1497
    /************************************                                                                             // 1498
        Week of Year                                                                                                  // 1499
    ************************************/                                                                             // 1500
                                                                                                                      // 1501
                                                                                                                      // 1502
    // firstDayOfWeek       0 = sun, 6 = sat                                                                          // 1503
    //                      the day of the week that starts the week                                                  // 1504
    //                      (usually sunday or monday)                                                                // 1505
    // firstDayOfWeekOfYear 0 = sun, 6 = sat                                                                          // 1506
    //                      the first week is the week that contains the first                                        // 1507
    //                      of this day of the week                                                                   // 1508
    //                      (eg. ISO weeks use thursday (4))                                                          // 1509
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {                                                  // 1510
        var end = firstDayOfWeekOfYear - firstDayOfWeek,                                                              // 1511
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),                                                       // 1512
            adjustedMoment;                                                                                           // 1513
                                                                                                                      // 1514
                                                                                                                      // 1515
        if (daysToDayOfWeek > end) {                                                                                  // 1516
            daysToDayOfWeek -= 7;                                                                                     // 1517
        }                                                                                                             // 1518
                                                                                                                      // 1519
        if (daysToDayOfWeek < end - 7) {                                                                              // 1520
            daysToDayOfWeek += 7;                                                                                     // 1521
        }                                                                                                             // 1522
                                                                                                                      // 1523
        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);                                                       // 1524
        return {                                                                                                      // 1525
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),                                                          // 1526
            year: adjustedMoment.year()                                                                               // 1527
        };                                                                                                            // 1528
    }                                                                                                                 // 1529
                                                                                                                      // 1530
    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday         // 1531
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {                          // 1532
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;                                            // 1533
                                                                                                                      // 1534
        weekday = weekday != null ? weekday : firstDayOfWeek;                                                         // 1535
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);           // 1536
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;                                      // 1537
                                                                                                                      // 1538
        return {                                                                                                      // 1539
            year: dayOfYear > 0 ? year : year - 1,                                                                    // 1540
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear                                  // 1541
        };                                                                                                            // 1542
    }                                                                                                                 // 1543
                                                                                                                      // 1544
    /************************************                                                                             // 1545
        Top Level Functions                                                                                           // 1546
    ************************************/                                                                             // 1547
                                                                                                                      // 1548
    function makeMoment(config) {                                                                                     // 1549
        var input = config._i,                                                                                        // 1550
            format = config._f;                                                                                       // 1551
                                                                                                                      // 1552
        if (input === null) {                                                                                         // 1553
            return moment.invalid({nullInput: true});                                                                 // 1554
        }                                                                                                             // 1555
                                                                                                                      // 1556
        if (typeof input === 'string') {                                                                              // 1557
            config._i = input = getLangDefinition().preparse(input);                                                  // 1558
        }                                                                                                             // 1559
                                                                                                                      // 1560
        if (moment.isMoment(input)) {                                                                                 // 1561
            config = cloneMoment(input);                                                                              // 1562
                                                                                                                      // 1563
            config._d = new Date(+input._d);                                                                          // 1564
        } else if (format) {                                                                                          // 1565
            if (isArray(format)) {                                                                                    // 1566
                makeDateFromStringAndArray(config);                                                                   // 1567
            } else {                                                                                                  // 1568
                makeDateFromStringAndFormat(config);                                                                  // 1569
            }                                                                                                         // 1570
        } else {                                                                                                      // 1571
            makeDateFromInput(config);                                                                                // 1572
        }                                                                                                             // 1573
                                                                                                                      // 1574
        return new Moment(config);                                                                                    // 1575
    }                                                                                                                 // 1576
                                                                                                                      // 1577
    moment = function (input, format, lang, strict) {                                                                 // 1578
        var c;                                                                                                        // 1579
                                                                                                                      // 1580
        if (typeof(lang) === "boolean") {                                                                             // 1581
            strict = lang;                                                                                            // 1582
            lang = undefined;                                                                                         // 1583
        }                                                                                                             // 1584
        // object construction must be done this way.                                                                 // 1585
        // https://github.com/moment/moment/issues/1423                                                               // 1586
        c = {};                                                                                                       // 1587
        c._isAMomentObject = true;                                                                                    // 1588
        c._i = input;                                                                                                 // 1589
        c._f = format;                                                                                                // 1590
        c._l = lang;                                                                                                  // 1591
        c._strict = strict;                                                                                           // 1592
        c._isUTC = false;                                                                                             // 1593
        c._pf = defaultParsingFlags();                                                                                // 1594
                                                                                                                      // 1595
        return makeMoment(c);                                                                                         // 1596
    };                                                                                                                // 1597
                                                                                                                      // 1598
    // creating with utc                                                                                              // 1599
    moment.utc = function (input, format, lang, strict) {                                                             // 1600
        var c;                                                                                                        // 1601
                                                                                                                      // 1602
        if (typeof(lang) === "boolean") {                                                                             // 1603
            strict = lang;                                                                                            // 1604
            lang = undefined;                                                                                         // 1605
        }                                                                                                             // 1606
        // object construction must be done this way.                                                                 // 1607
        // https://github.com/moment/moment/issues/1423                                                               // 1608
        c = {};                                                                                                       // 1609
        c._isAMomentObject = true;                                                                                    // 1610
        c._useUTC = true;                                                                                             // 1611
        c._isUTC = true;                                                                                              // 1612
        c._l = lang;                                                                                                  // 1613
        c._i = input;                                                                                                 // 1614
        c._f = format;                                                                                                // 1615
        c._strict = strict;                                                                                           // 1616
        c._pf = defaultParsingFlags();                                                                                // 1617
                                                                                                                      // 1618
        return makeMoment(c).utc();                                                                                   // 1619
    };                                                                                                                // 1620
                                                                                                                      // 1621
    // creating with unix timestamp (in seconds)                                                                      // 1622
    moment.unix = function (input) {                                                                                  // 1623
        return moment(input * 1000);                                                                                  // 1624
    };                                                                                                                // 1625
                                                                                                                      // 1626
    // duration                                                                                                       // 1627
    moment.duration = function (input, key) {                                                                         // 1628
        var duration = input,                                                                                         // 1629
            // matching against regexp is expensive, do it on demand                                                  // 1630
            match = null,                                                                                             // 1631
            sign,                                                                                                     // 1632
            ret,                                                                                                      // 1633
            parseIso;                                                                                                 // 1634
                                                                                                                      // 1635
        if (moment.isDuration(input)) {                                                                               // 1636
            duration = {                                                                                              // 1637
                ms: input._milliseconds,                                                                              // 1638
                d: input._days,                                                                                       // 1639
                M: input._months                                                                                      // 1640
            };                                                                                                        // 1641
        } else if (typeof input === 'number') {                                                                       // 1642
            duration = {};                                                                                            // 1643
            if (key) {                                                                                                // 1644
                duration[key] = input;                                                                                // 1645
            } else {                                                                                                  // 1646
                duration.milliseconds = input;                                                                        // 1647
            }                                                                                                         // 1648
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {                                                 // 1649
            sign = (match[1] === "-") ? -1 : 1;                                                                       // 1650
            duration = {                                                                                              // 1651
                y: 0,                                                                                                 // 1652
                d: toInt(match[DATE]) * sign,                                                                         // 1653
                h: toInt(match[HOUR]) * sign,                                                                         // 1654
                m: toInt(match[MINUTE]) * sign,                                                                       // 1655
                s: toInt(match[SECOND]) * sign,                                                                       // 1656
                ms: toInt(match[MILLISECOND]) * sign                                                                  // 1657
            };                                                                                                        // 1658
        } else if (!!(match = isoDurationRegex.exec(input))) {                                                        // 1659
            sign = (match[1] === "-") ? -1 : 1;                                                                       // 1660
            parseIso = function (inp) {                                                                               // 1661
                // We'd normally use ~~inp for this, but unfortunately it also                                        // 1662
                // converts floats to ints.                                                                           // 1663
                // inp may be undefined, so careful calling replace on it.                                            // 1664
                var res = inp && parseFloat(inp.replace(',', '.'));                                                   // 1665
                // apply sign while we're at it                                                                       // 1666
                return (isNaN(res) ? 0 : res) * sign;                                                                 // 1667
            };                                                                                                        // 1668
            duration = {                                                                                              // 1669
                y: parseIso(match[2]),                                                                                // 1670
                M: parseIso(match[3]),                                                                                // 1671
                d: parseIso(match[4]),                                                                                // 1672
                h: parseIso(match[5]),                                                                                // 1673
                m: parseIso(match[6]),                                                                                // 1674
                s: parseIso(match[7]),                                                                                // 1675
                w: parseIso(match[8])                                                                                 // 1676
            };                                                                                                        // 1677
        }                                                                                                             // 1678
                                                                                                                      // 1679
        ret = new Duration(duration);                                                                                 // 1680
                                                                                                                      // 1681
        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {                                              // 1682
            ret._lang = input._lang;                                                                                  // 1683
        }                                                                                                             // 1684
                                                                                                                      // 1685
        return ret;                                                                                                   // 1686
    };                                                                                                                // 1687
                                                                                                                      // 1688
    // version number                                                                                                 // 1689
    moment.version = VERSION;                                                                                         // 1690
                                                                                                                      // 1691
    // default format                                                                                                 // 1692
    moment.defaultFormat = isoFormat;                                                                                 // 1693
                                                                                                                      // 1694
    // This function will be called whenever a moment is mutated.                                                     // 1695
    // It is intended to keep the offset in sync with the timezone.                                                   // 1696
    moment.updateOffset = function () {};                                                                             // 1697
                                                                                                                      // 1698
    // This function will load languages and then set the global language.  If                                        // 1699
    // no arguments are passed in, it will simply return the current global                                           // 1700
    // language key.                                                                                                  // 1701
    moment.lang = function (key, values) {                                                                            // 1702
        var r;                                                                                                        // 1703
        if (!key) {                                                                                                   // 1704
            return moment.fn._lang._abbr;                                                                             // 1705
        }                                                                                                             // 1706
        if (values) {                                                                                                 // 1707
            loadLang(normalizeLanguage(key), values);                                                                 // 1708
        } else if (values === null) {                                                                                 // 1709
            unloadLang(key);                                                                                          // 1710
            key = 'en';                                                                                               // 1711
        } else if (!languages[key]) {                                                                                 // 1712
            getLangDefinition(key);                                                                                   // 1713
        }                                                                                                             // 1714
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);                                      // 1715
        return r._abbr;                                                                                               // 1716
    };                                                                                                                // 1717
                                                                                                                      // 1718
    // returns language data                                                                                          // 1719
    moment.langData = function (key) {                                                                                // 1720
        if (key && key._lang && key._lang._abbr) {                                                                    // 1721
            key = key._lang._abbr;                                                                                    // 1722
        }                                                                                                             // 1723
        return getLangDefinition(key);                                                                                // 1724
    };                                                                                                                // 1725
                                                                                                                      // 1726
    // compare moment object                                                                                          // 1727
    moment.isMoment = function (obj) {                                                                                // 1728
        return obj instanceof Moment ||                                                                               // 1729
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));                                                 // 1730
    };                                                                                                                // 1731
                                                                                                                      // 1732
    // for typechecking Duration objects                                                                              // 1733
    moment.isDuration = function (obj) {                                                                              // 1734
        return obj instanceof Duration;                                                                               // 1735
    };                                                                                                                // 1736
                                                                                                                      // 1737
    for (i = lists.length - 1; i >= 0; --i) {                                                                         // 1738
        makeList(lists[i]);                                                                                           // 1739
    }                                                                                                                 // 1740
                                                                                                                      // 1741
    moment.normalizeUnits = function (units) {                                                                        // 1742
        return normalizeUnits(units);                                                                                 // 1743
    };                                                                                                                // 1744
                                                                                                                      // 1745
    moment.invalid = function (flags) {                                                                               // 1746
        var m = moment.utc(NaN);                                                                                      // 1747
        if (flags != null) {                                                                                          // 1748
            extend(m._pf, flags);                                                                                     // 1749
        }                                                                                                             // 1750
        else {                                                                                                        // 1751
            m._pf.userInvalidated = true;                                                                             // 1752
        }                                                                                                             // 1753
                                                                                                                      // 1754
        return m;                                                                                                     // 1755
    };                                                                                                                // 1756
                                                                                                                      // 1757
    moment.parseZone = function (input) {                                                                             // 1758
        return moment(input).parseZone();                                                                             // 1759
    };                                                                                                                // 1760
                                                                                                                      // 1761
    /************************************                                                                             // 1762
        Moment Prototype                                                                                              // 1763
    ************************************/                                                                             // 1764
                                                                                                                      // 1765
                                                                                                                      // 1766
    extend(moment.fn = Moment.prototype, {                                                                            // 1767
                                                                                                                      // 1768
        clone : function () {                                                                                         // 1769
            return moment(this);                                                                                      // 1770
        },                                                                                                            // 1771
                                                                                                                      // 1772
        valueOf : function () {                                                                                       // 1773
            return +this._d + ((this._offset || 0) * 60000);                                                          // 1774
        },                                                                                                            // 1775
                                                                                                                      // 1776
        unix : function () {                                                                                          // 1777
            return Math.floor(+this / 1000);                                                                          // 1778
        },                                                                                                            // 1779
                                                                                                                      // 1780
        toString : function () {                                                                                      // 1781
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");                                // 1782
        },                                                                                                            // 1783
                                                                                                                      // 1784
        toDate : function () {                                                                                        // 1785
            return this._offset ? new Date(+this) : this._d;                                                          // 1786
        },                                                                                                            // 1787
                                                                                                                      // 1788
        toISOString : function () {                                                                                   // 1789
            var m = moment(this).utc();                                                                               // 1790
            if (0 < m.year() && m.year() <= 9999) {                                                                   // 1791
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                               // 1792
            } else {                                                                                                  // 1793
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                             // 1794
            }                                                                                                         // 1795
        },                                                                                                            // 1796
                                                                                                                      // 1797
        toArray : function () {                                                                                       // 1798
            var m = this;                                                                                             // 1799
            return [                                                                                                  // 1800
                m.year(),                                                                                             // 1801
                m.month(),                                                                                            // 1802
                m.date(),                                                                                             // 1803
                m.hours(),                                                                                            // 1804
                m.minutes(),                                                                                          // 1805
                m.seconds(),                                                                                          // 1806
                m.milliseconds()                                                                                      // 1807
            ];                                                                                                        // 1808
        },                                                                                                            // 1809
                                                                                                                      // 1810
        isValid : function () {                                                                                       // 1811
            return isValid(this);                                                                                     // 1812
        },                                                                                                            // 1813
                                                                                                                      // 1814
        isDSTShifted : function () {                                                                                  // 1815
                                                                                                                      // 1816
            if (this._a) {                                                                                            // 1817
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }                                                                                                         // 1819
                                                                                                                      // 1820
            return false;                                                                                             // 1821
        },                                                                                                            // 1822
                                                                                                                      // 1823
        parsingFlags : function () {                                                                                  // 1824
            return extend({}, this._pf);                                                                              // 1825
        },                                                                                                            // 1826
                                                                                                                      // 1827
        invalidAt: function () {                                                                                      // 1828
            return this._pf.overflow;                                                                                 // 1829
        },                                                                                                            // 1830
                                                                                                                      // 1831
        utc : function () {                                                                                           // 1832
            return this.zone(0);                                                                                      // 1833
        },                                                                                                            // 1834
                                                                                                                      // 1835
        local : function () {                                                                                         // 1836
            this.zone(0);                                                                                             // 1837
            this._isUTC = false;                                                                                      // 1838
            return this;                                                                                              // 1839
        },                                                                                                            // 1840
                                                                                                                      // 1841
        format : function (inputString) {                                                                             // 1842
            var output = formatMoment(this, inputString || moment.defaultFormat);                                     // 1843
            return this.lang().postformat(output);                                                                    // 1844
        },                                                                                                            // 1845
                                                                                                                      // 1846
        add : function (input, val) {                                                                                 // 1847
            var dur;                                                                                                  // 1848
            // switch args to support add('s', 1) and add(1, 's')                                                     // 1849
            if (typeof input === 'string') {                                                                          // 1850
                dur = moment.duration(+val, input);                                                                   // 1851
            } else {                                                                                                  // 1852
                dur = moment.duration(input, val);                                                                    // 1853
            }                                                                                                         // 1854
            addOrSubtractDurationFromMoment(this, dur, 1);                                                            // 1855
            return this;                                                                                              // 1856
        },                                                                                                            // 1857
                                                                                                                      // 1858
        subtract : function (input, val) {                                                                            // 1859
            var dur;                                                                                                  // 1860
            // switch args to support subtract('s', 1) and subtract(1, 's')                                           // 1861
            if (typeof input === 'string') {                                                                          // 1862
                dur = moment.duration(+val, input);                                                                   // 1863
            } else {                                                                                                  // 1864
                dur = moment.duration(input, val);                                                                    // 1865
            }                                                                                                         // 1866
            addOrSubtractDurationFromMoment(this, dur, -1);                                                           // 1867
            return this;                                                                                              // 1868
        },                                                                                                            // 1869
                                                                                                                      // 1870
        diff : function (input, units, asFloat) {                                                                     // 1871
            var that = makeAs(input, this),                                                                           // 1872
                zoneDiff = (this.zone() - that.zone()) * 6e4,                                                         // 1873
                diff, output;                                                                                         // 1874
                                                                                                                      // 1875
            units = normalizeUnits(units);                                                                            // 1876
                                                                                                                      // 1877
            if (units === 'year' || units === 'month') {                                                              // 1878
                // average number of days in the months in the given dates                                            // 1879
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2                  // 1880
                // difference in months                                                                               // 1881
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());                          // 1882
                // adjust by taking difference in days, average number of days                                        // 1883
                // and dst in the given months.                                                                       // 1884
                output += ((this - moment(this).startOf('month')) -                                                   // 1885
                        (that - moment(that).startOf('month'))) / diff;                                               // 1886
                // same as above but with zones, to negate all dst                                                    // 1887
                output -= ((this.zone() - moment(this).startOf('month').zone()) -                                     // 1888
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;                           // 1889
                if (units === 'year') {                                                                               // 1890
                    output = output / 12;                                                                             // 1891
                }                                                                                                     // 1892
            } else {                                                                                                  // 1893
                diff = (this - that);                                                                                 // 1894
                output = units === 'second' ? diff / 1e3 : // 1000                                                    // 1895
                    units === 'minute' ? diff / 6e4 : // 1000 * 60                                                    // 1896
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60                                                // 1897
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst                  // 1898
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst            // 1899
                    diff;                                                                                             // 1900
            }                                                                                                         // 1901
            return asFloat ? output : absRound(output);                                                               // 1902
        },                                                                                                            // 1903
                                                                                                                      // 1904
        from : function (time, withoutSuffix) {                                                                       // 1905
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);                 // 1906
        },                                                                                                            // 1907
                                                                                                                      // 1908
        fromNow : function (withoutSuffix) {                                                                          // 1909
            return this.from(moment(), withoutSuffix);                                                                // 1910
        },                                                                                                            // 1911
                                                                                                                      // 1912
        calendar : function () {                                                                                      // 1913
            // We want to compare the start of today, vs this.                                                        // 1914
            // Getting start-of-today depends on whether we're zone'd or not.                                         // 1915
            var sod = makeAs(moment(), this).startOf('day'),                                                          // 1916
                diff = this.diff(sod, 'days', true),                                                                  // 1917
                format = diff < -6 ? 'sameElse' :                                                                     // 1918
                    diff < -1 ? 'lastWeek' :                                                                          // 1919
                    diff < 0 ? 'lastDay' :                                                                            // 1920
                    diff < 1 ? 'sameDay' :                                                                            // 1921
                    diff < 2 ? 'nextDay' :                                                                            // 1922
                    diff < 7 ? 'nextWeek' : 'sameElse';                                                               // 1923
            return this.format(this.lang().calendar(format, this));                                                   // 1924
        },                                                                                                            // 1925
                                                                                                                      // 1926
        isLeapYear : function () {                                                                                    // 1927
            return isLeapYear(this.year());                                                                           // 1928
        },                                                                                                            // 1929
                                                                                                                      // 1930
        isDST : function () {                                                                                         // 1931
            return (this.zone() < this.clone().month(0).zone() ||                                                     // 1932
                this.zone() < this.clone().month(5).zone());                                                          // 1933
        },                                                                                                            // 1934
                                                                                                                      // 1935
        day : function (input) {                                                                                      // 1936
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();                                           // 1937
            if (input != null) {                                                                                      // 1938
                input = parseWeekday(input, this.lang());                                                             // 1939
                return this.add({ d : input - day });                                                                 // 1940
            } else {                                                                                                  // 1941
                return day;                                                                                           // 1942
            }                                                                                                         // 1943
        },                                                                                                            // 1944
                                                                                                                      // 1945
        month : function (input) {                                                                                    // 1946
            var utc = this._isUTC ? 'UTC' : '',                                                                       // 1947
                dayOfMonth;                                                                                           // 1948
                                                                                                                      // 1949
            if (input != null) {                                                                                      // 1950
                if (typeof input === 'string') {                                                                      // 1951
                    input = this.lang().monthsParse(input);                                                           // 1952
                    if (typeof input !== 'number') {                                                                  // 1953
                        return this;                                                                                  // 1954
                    }                                                                                                 // 1955
                }                                                                                                     // 1956
                                                                                                                      // 1957
                dayOfMonth = this.date();                                                                             // 1958
                this.date(1);                                                                                         // 1959
                this._d['set' + utc + 'Month'](input);                                                                // 1960
                this.date(Math.min(dayOfMonth, this.daysInMonth()));                                                  // 1961
                                                                                                                      // 1962
                moment.updateOffset(this);                                                                            // 1963
                return this;                                                                                          // 1964
            } else {                                                                                                  // 1965
                return this._d['get' + utc + 'Month']();                                                              // 1966
            }                                                                                                         // 1967
        },                                                                                                            // 1968
                                                                                                                      // 1969
        startOf: function (units) {                                                                                   // 1970
            units = normalizeUnits(units);                                                                            // 1971
            // the following switch intentionally omits break keywords                                                // 1972
            // to utilize falling through the cases.                                                                  // 1973
            switch (units) {                                                                                          // 1974
            case 'year':                                                                                              // 1975
                this.month(0);                                                                                        // 1976
                /* falls through */                                                                                   // 1977
            case 'month':                                                                                             // 1978
                this.date(1);                                                                                         // 1979
                /* falls through */                                                                                   // 1980
            case 'week':                                                                                              // 1981
            case 'isoWeek':                                                                                           // 1982
            case 'day':                                                                                               // 1983
                this.hours(0);                                                                                        // 1984
                /* falls through */                                                                                   // 1985
            case 'hour':                                                                                              // 1986
                this.minutes(0);                                                                                      // 1987
                /* falls through */                                                                                   // 1988
            case 'minute':                                                                                            // 1989
                this.seconds(0);                                                                                      // 1990
                /* falls through */                                                                                   // 1991
            case 'second':                                                                                            // 1992
                this.milliseconds(0);                                                                                 // 1993
                /* falls through */                                                                                   // 1994
            }                                                                                                         // 1995
                                                                                                                      // 1996
            // weeks are a special case                                                                               // 1997
            if (units === 'week') {                                                                                   // 1998
                this.weekday(0);                                                                                      // 1999
            } else if (units === 'isoWeek') {                                                                         // 2000
                this.isoWeekday(1);                                                                                   // 2001
            }                                                                                                         // 2002
                                                                                                                      // 2003
            return this;                                                                                              // 2004
        },                                                                                                            // 2005
                                                                                                                      // 2006
        endOf: function (units) {                                                                                     // 2007
            units = normalizeUnits(units);                                                                            // 2008
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);              // 2009
        },                                                                                                            // 2010
                                                                                                                      // 2011
        isAfter: function (input, units) {                                                                            // 2012
            units = typeof units !== 'undefined' ? units : 'millisecond';                                             // 2013
            return +this.clone().startOf(units) > +moment(input).startOf(units);                                      // 2014
        },                                                                                                            // 2015
                                                                                                                      // 2016
        isBefore: function (input, units) {                                                                           // 2017
            units = typeof units !== 'undefined' ? units : 'millisecond';                                             // 2018
            return +this.clone().startOf(units) < +moment(input).startOf(units);                                      // 2019
        },                                                                                                            // 2020
                                                                                                                      // 2021
        isSame: function (input, units) {                                                                             // 2022
            units = units || 'ms';                                                                                    // 2023
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);                              // 2024
        },                                                                                                            // 2025
                                                                                                                      // 2026
        min: function (other) {                                                                                       // 2027
            other = moment.apply(null, arguments);                                                                    // 2028
            return other < this ? this : other;                                                                       // 2029
        },                                                                                                            // 2030
                                                                                                                      // 2031
        max: function (other) {                                                                                       // 2032
            other = moment.apply(null, arguments);                                                                    // 2033
            return other > this ? this : other;                                                                       // 2034
        },                                                                                                            // 2035
                                                                                                                      // 2036
        zone : function (input) {                                                                                     // 2037
            var offset = this._offset || 0;                                                                           // 2038
            if (input != null) {                                                                                      // 2039
                if (typeof input === "string") {                                                                      // 2040
                    input = timezoneMinutesFromString(input);                                                         // 2041
                }                                                                                                     // 2042
                if (Math.abs(input) < 16) {                                                                           // 2043
                    input = input * 60;                                                                               // 2044
                }                                                                                                     // 2045
                this._offset = input;                                                                                 // 2046
                this._isUTC = true;                                                                                   // 2047
                if (offset !== input) {                                                                               // 2048
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);             // 2049
                }                                                                                                     // 2050
            } else {                                                                                                  // 2051
                return this._isUTC ? offset : this._d.getTimezoneOffset();                                            // 2052
            }                                                                                                         // 2053
            return this;                                                                                              // 2054
        },                                                                                                            // 2055
                                                                                                                      // 2056
        zoneAbbr : function () {                                                                                      // 2057
            return this._isUTC ? "UTC" : "";                                                                          // 2058
        },                                                                                                            // 2059
                                                                                                                      // 2060
        zoneName : function () {                                                                                      // 2061
            return this._isUTC ? "Coordinated Universal Time" : "";                                                   // 2062
        },                                                                                                            // 2063
                                                                                                                      // 2064
        parseZone : function () {                                                                                     // 2065
            if (this._tzm) {                                                                                          // 2066
                this.zone(this._tzm);                                                                                 // 2067
            } else if (typeof this._i === 'string') {                                                                 // 2068
                this.zone(this._i);                                                                                   // 2069
            }                                                                                                         // 2070
            return this;                                                                                              // 2071
        },                                                                                                            // 2072
                                                                                                                      // 2073
        hasAlignedHourOffset : function (input) {                                                                     // 2074
            if (!input) {                                                                                             // 2075
                input = 0;                                                                                            // 2076
            }                                                                                                         // 2077
            else {                                                                                                    // 2078
                input = moment(input).zone();                                                                         // 2079
            }                                                                                                         // 2080
                                                                                                                      // 2081
            return (this.zone() - input) % 60 === 0;                                                                  // 2082
        },                                                                                                            // 2083
                                                                                                                      // 2084
        daysInMonth : function () {                                                                                   // 2085
            return daysInMonth(this.year(), this.month());                                                            // 2086
        },                                                                                                            // 2087
                                                                                                                      // 2088
        dayOfYear : function (input) {                                                                                // 2089
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;          // 2090
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));                                    // 2091
        },                                                                                                            // 2092
                                                                                                                      // 2093
        quarter : function () {                                                                                       // 2094
            return Math.ceil((this.month() + 1.0) / 3.0);                                                             // 2095
        },                                                                                                            // 2096
                                                                                                                      // 2097
        weekYear : function (input) {                                                                                 // 2098
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;                           // 2099
            return input == null ? year : this.add("y", (input - year));                                              // 2100
        },                                                                                                            // 2101
                                                                                                                      // 2102
        isoWeekYear : function (input) {                                                                              // 2103
            var year = weekOfYear(this, 1, 4).year;                                                                   // 2104
            return input == null ? year : this.add("y", (input - year));                                              // 2105
        },                                                                                                            // 2106
                                                                                                                      // 2107
        week : function (input) {                                                                                     // 2108
            var week = this.lang().week(this);                                                                        // 2109
            return input == null ? week : this.add("d", (input - week) * 7);                                          // 2110
        },                                                                                                            // 2111
                                                                                                                      // 2112
        isoWeek : function (input) {                                                                                  // 2113
            var week = weekOfYear(this, 1, 4).week;                                                                   // 2114
            return input == null ? week : this.add("d", (input - week) * 7);                                          // 2115
        },                                                                                                            // 2116
                                                                                                                      // 2117
        weekday : function (input) {                                                                                  // 2118
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;                                               // 2119
            return input == null ? weekday : this.add("d", input - weekday);                                          // 2120
        },                                                                                                            // 2121
                                                                                                                      // 2122
        isoWeekday : function (input) {                                                                               // 2123
            // behaves the same as moment#day except                                                                  // 2124
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)                                         // 2125
            // as a setter, sunday should belong to the previous week.                                                // 2126
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);                    // 2127
        },                                                                                                            // 2128
                                                                                                                      // 2129
        get : function (units) {                                                                                      // 2130
            units = normalizeUnits(units);                                                                            // 2131
            return this[units]();                                                                                     // 2132
        },                                                                                                            // 2133
                                                                                                                      // 2134
        set : function (units, value) {                                                                               // 2135
            units = normalizeUnits(units);                                                                            // 2136
            if (typeof this[units] === 'function') {                                                                  // 2137
                this[units](value);                                                                                   // 2138
            }                                                                                                         // 2139
            return this;                                                                                              // 2140
        },                                                                                                            // 2141
                                                                                                                      // 2142
        // If passed a language key, it will set the language for this                                                // 2143
        // instance.  Otherwise, it will return the language configuration                                            // 2144
        // variables for this instance.                                                                               // 2145
        lang : function (key) {                                                                                       // 2146
            if (key === undefined) {                                                                                  // 2147
                return this._lang;                                                                                    // 2148
            } else {                                                                                                  // 2149
                this._lang = getLangDefinition(key);                                                                  // 2150
                return this;                                                                                          // 2151
            }                                                                                                         // 2152
        }                                                                                                             // 2153
    });                                                                                                               // 2154
                                                                                                                      // 2155
    // helper for adding shortcuts                                                                                    // 2156
    function makeGetterAndSetter(name, key) {                                                                         // 2157
        moment.fn[name] = moment.fn[name + 's'] = function (input) {                                                  // 2158
            var utc = this._isUTC ? 'UTC' : '';                                                                       // 2159
            if (input != null) {                                                                                      // 2160
                this._d['set' + utc + key](input);                                                                    // 2161
                moment.updateOffset(this);                                                                            // 2162
                return this;                                                                                          // 2163
            } else {                                                                                                  // 2164
                return this._d['get' + utc + key]();                                                                  // 2165
            }                                                                                                         // 2166
        };                                                                                                            // 2167
    }                                                                                                                 // 2168
                                                                                                                      // 2169
    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)                            // 2170
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {                                                            // 2171
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);    // 2172
    }                                                                                                                 // 2173
                                                                                                                      // 2174
    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')                      // 2175
    makeGetterAndSetter('year', 'FullYear');                                                                          // 2176
                                                                                                                      // 2177
    // add plural methods                                                                                             // 2178
    moment.fn.days = moment.fn.day;                                                                                   // 2179
    moment.fn.months = moment.fn.month;                                                                               // 2180
    moment.fn.weeks = moment.fn.week;                                                                                 // 2181
    moment.fn.isoWeeks = moment.fn.isoWeek;                                                                           // 2182
                                                                                                                      // 2183
    // add aliased format methods                                                                                     // 2184
    moment.fn.toJSON = moment.fn.toISOString;                                                                         // 2185
                                                                                                                      // 2186
    /************************************                                                                             // 2187
        Duration Prototype                                                                                            // 2188
    ************************************/                                                                             // 2189
                                                                                                                      // 2190
                                                                                                                      // 2191
    extend(moment.duration.fn = Duration.prototype, {                                                                 // 2192
                                                                                                                      // 2193
        _bubble : function () {                                                                                       // 2194
            var milliseconds = this._milliseconds,                                                                    // 2195
                days = this._days,                                                                                    // 2196
                months = this._months,                                                                                // 2197
                data = this._data,                                                                                    // 2198
                seconds, minutes, hours, years;                                                                       // 2199
                                                                                                                      // 2200
            // The following code bubbles up values, see the tests for                                                // 2201
            // examples of what that means.                                                                           // 2202
            data.milliseconds = milliseconds % 1000;                                                                  // 2203
                                                                                                                      // 2204
            seconds = absRound(milliseconds / 1000);                                                                  // 2205
            data.seconds = seconds % 60;                                                                              // 2206
                                                                                                                      // 2207
            minutes = absRound(seconds / 60);                                                                         // 2208
            data.minutes = minutes % 60;                                                                              // 2209
                                                                                                                      // 2210
            hours = absRound(minutes / 60);                                                                           // 2211
            data.hours = hours % 24;                                                                                  // 2212
                                                                                                                      // 2213
            days += absRound(hours / 24);                                                                             // 2214
            data.days = days % 30;                                                                                    // 2215
                                                                                                                      // 2216
            months += absRound(days / 30);                                                                            // 2217
            data.months = months % 12;                                                                                // 2218
                                                                                                                      // 2219
            years = absRound(months / 12);                                                                            // 2220
            data.years = years;                                                                                       // 2221
        },                                                                                                            // 2222
                                                                                                                      // 2223
        weeks : function () {                                                                                         // 2224
            return absRound(this.days() / 7);                                                                         // 2225
        },                                                                                                            // 2226
                                                                                                                      // 2227
        valueOf : function () {                                                                                       // 2228
            return this._milliseconds +                                                                               // 2229
              this._days * 864e5 +                                                                                    // 2230
              (this._months % 12) * 2592e6 +                                                                          // 2231
              toInt(this._months / 12) * 31536e6;                                                                     // 2232
        },                                                                                                            // 2233
                                                                                                                      // 2234
        humanize : function (withSuffix) {                                                                            // 2235
            var difference = +this,                                                                                   // 2236
                output = relativeTime(difference, !withSuffix, this.lang());                                          // 2237
                                                                                                                      // 2238
            if (withSuffix) {                                                                                         // 2239
                output = this.lang().pastFuture(difference, output);                                                  // 2240
            }                                                                                                         // 2241
                                                                                                                      // 2242
            return this.lang().postformat(output);                                                                    // 2243
        },                                                                                                            // 2244
                                                                                                                      // 2245
        add : function (input, val) {                                                                                 // 2246
            // supports only 2.0-style add(1, 's') or add(moment)                                                     // 2247
            var dur = moment.duration(input, val);                                                                    // 2248
                                                                                                                      // 2249
            this._milliseconds += dur._milliseconds;                                                                  // 2250
            this._days += dur._days;                                                                                  // 2251
            this._months += dur._months;                                                                              // 2252
                                                                                                                      // 2253
            this._bubble();                                                                                           // 2254
                                                                                                                      // 2255
            return this;                                                                                              // 2256
        },                                                                                                            // 2257
                                                                                                                      // 2258
        subtract : function (input, val) {                                                                            // 2259
            var dur = moment.duration(input, val);                                                                    // 2260
                                                                                                                      // 2261
            this._milliseconds -= dur._milliseconds;                                                                  // 2262
            this._days -= dur._days;                                                                                  // 2263
            this._months -= dur._months;                                                                              // 2264
                                                                                                                      // 2265
            this._bubble();                                                                                           // 2266
                                                                                                                      // 2267
            return this;                                                                                              // 2268
        },                                                                                                            // 2269
                                                                                                                      // 2270
        get : function (units) {                                                                                      // 2271
            units = normalizeUnits(units);                                                                            // 2272
            return this[units.toLowerCase() + 's']();                                                                 // 2273
        },                                                                                                            // 2274
                                                                                                                      // 2275
        as : function (units) {                                                                                       // 2276
            units = normalizeUnits(units);                                                                            // 2277
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();                               // 2278
        },                                                                                                            // 2279
                                                                                                                      // 2280
        lang : moment.fn.lang,                                                                                        // 2281
                                                                                                                      // 2282
        toIsoString : function () {                                                                                   // 2283
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js           // 2284
            var years = Math.abs(this.years()),                                                                       // 2285
                months = Math.abs(this.months()),                                                                     // 2286
                days = Math.abs(this.days()),                                                                         // 2287
                hours = Math.abs(this.hours()),                                                                       // 2288
                minutes = Math.abs(this.minutes()),                                                                   // 2289
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);                                      // 2290
                                                                                                                      // 2291
            if (!this.asSeconds()) {                                                                                  // 2292
                // this is the same as C#'s (Noda) and python (isodate)...                                            // 2293
                // but not other JS (goog.date)                                                                       // 2294
                return 'P0D';                                                                                         // 2295
            }                                                                                                         // 2296
                                                                                                                      // 2297
            return (this.asSeconds() < 0 ? '-' : '') +                                                                // 2298
                'P' +                                                                                                 // 2299
                (years ? years + 'Y' : '') +                                                                          // 2300
                (months ? months + 'M' : '') +                                                                        // 2301
                (days ? days + 'D' : '') +                                                                            // 2302
                ((hours || minutes || seconds) ? 'T' : '') +                                                          // 2303
                (hours ? hours + 'H' : '') +                                                                          // 2304
                (minutes ? minutes + 'M' : '') +                                                                      // 2305
                (seconds ? seconds + 'S' : '');                                                                       // 2306
        }                                                                                                             // 2307
    });                                                                                                               // 2308
                                                                                                                      // 2309
    function makeDurationGetter(name) {                                                                               // 2310
        moment.duration.fn[name] = function () {                                                                      // 2311
            return this._data[name];                                                                                  // 2312
        };                                                                                                            // 2313
    }                                                                                                                 // 2314
                                                                                                                      // 2315
    function makeDurationAsGetter(name, factor) {                                                                     // 2316
        moment.duration.fn['as' + name] = function () {                                                               // 2317
            return +this / factor;                                                                                    // 2318
        };                                                                                                            // 2319
    }                                                                                                                 // 2320
                                                                                                                      // 2321
    for (i in unitMillisecondFactors) {                                                                               // 2322
        if (unitMillisecondFactors.hasOwnProperty(i)) {                                                               // 2323
            makeDurationAsGetter(i, unitMillisecondFactors[i]);                                                       // 2324
            makeDurationGetter(i.toLowerCase());                                                                      // 2325
        }                                                                                                             // 2326
    }                                                                                                                 // 2327
                                                                                                                      // 2328
    makeDurationAsGetter('Weeks', 6048e5);                                                                            // 2329
    moment.duration.fn.asMonths = function () {                                                                       // 2330
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;                                         // 2331
    };                                                                                                                // 2332
                                                                                                                      // 2333
                                                                                                                      // 2334
    /************************************                                                                             // 2335
        Default Lang                                                                                                  // 2336
    ************************************/                                                                             // 2337
                                                                                                                      // 2338
                                                                                                                      // 2339
    // Set default language, other languages will inherit from English.                                               // 2340
    moment.lang('en', {                                                                                               // 2341
        ordinal : function (number) {                                                                                 // 2342
            var b = number % 10,                                                                                      // 2343
                output = (toInt(number % 100 / 10) === 1) ? 'th' :                                                    // 2344
                (b === 1) ? 'st' :                                                                                    // 2345
                (b === 2) ? 'nd' :                                                                                    // 2346
                (b === 3) ? 'rd' : 'th';                                                                              // 2347
            return number + output;                                                                                   // 2348
        }                                                                                                             // 2349
    });                                                                                                               // 2350
                                                                                                                      // 2351
    /* EMBED_LANGUAGES */                                                                                             // 2352
                                                                                                                      // 2353
    /************************************                                                                             // 2354
        Exposing Moment                                                                                               // 2355
    ************************************/                                                                             // 2356
                                                                                                                      // 2357
    function makeGlobal(deprecate) {                                                                                  // 2358
        var warned = false, local_moment = moment;                                                                    // 2359
        /*global ender:false */                                                                                       // 2360
        if (typeof ender !== 'undefined') {                                                                           // 2361
            return;                                                                                                   // 2362
        }                                                                                                             // 2363
        // here, `this` means `window` in the browser, or `global` on the server                                      // 2364
        // add `moment` as a global object via a string identifier,                                                   // 2365
        // for Closure Compiler "advanced" mode                                                                       // 2366
        if (deprecate) {                                                                                              // 2367
            global.moment = function () {                                                                             // 2368
                if (!warned && console && console.warn) {                                                             // 2369
                    warned = true;                                                                                    // 2370
                    console.warn(                                                                                     // 2371
                            "Accessing Moment through the global scope is " +                                         // 2372
                            "deprecated, and will be removed in an upcoming " +                                       // 2373
                            "release.");                                                                              // 2374
                }                                                                                                     // 2375
                return local_moment.apply(null, arguments);                                                           // 2376
            };                                                                                                        // 2377
            extend(global.moment, local_moment);                                                                      // 2378
        } else {                                                                                                      // 2379
            global['moment'] = moment;                                                                                // 2380
        }                                                                                                             // 2381
    }                                                                                                                 // 2382
                                                                                                                      // 2383
    // CommonJS module is defined                                                                                     // 2384
    if (hasModule) {                                                                                                  // 2385
        module.exports = moment;                                                                                      // 2386
        makeGlobal(true);                                                                                             // 2387
    } else if (typeof define === "function" && define.amd) {                                                          // 2388
        define("moment", function (require, exports, module) {                                                        // 2389
            if (module.config && module.config() && module.config().noGlobal !== true) {                              // 2390
                // If user provided noGlobal, he is aware of global                                                   // 2391
                makeGlobal(module.config().noGlobal === undefined);                                                   // 2392
            }                                                                                                         // 2393
                                                                                                                      // 2394
            return moment;                                                                                            // 2395
        });                                                                                                           // 2396
    } else {                                                                                                          // 2397
        makeGlobal();                                                                                                 // 2398
    }                                                                                                                 // 2399
}).call(this);                                                                                                        // 2400
                                                                                                                      // 2401
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/moment/export-moment.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//This file exposes moment so that it works with Meteor 0.6.5's package system.                                       // 1
if (typeof Package !== "undefined") {                                                                                 // 2
  moment = this.moment;                                                                                               // 3
}                                                                                                                     // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.moment = {
  moment: moment
};

})();
