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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/bootstrap-3/bootstrap-3/js/bootstrap.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*!                                                                                                                   // 1
 * Bootstrap v3.1.0 (http://getbootstrap.com)                                                                         // 2
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 3
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 4
 */                                                                                                                   // 5
                                                                                                                      // 6
if (typeof jQuery === 'undefined') { throw new Error('Bootstrap requires jQuery') }                                   // 7
                                                                                                                      // 8
/* ========================================================================                                           // 9
 * Bootstrap: transition.js v3.1.0                                                                                    // 10
 * http://getbootstrap.com/javascript/#transitions                                                                    // 11
 * ========================================================================                                           // 12
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 13
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 14
 * ======================================================================== */                                        // 15
                                                                                                                      // 16
                                                                                                                      // 17
+function ($) {                                                                                                       // 18
  'use strict';                                                                                                       // 19
                                                                                                                      // 20
  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)                                                     // 21
  // ============================================================                                                     // 22
                                                                                                                      // 23
  function transitionEnd() {                                                                                          // 24
    var el = document.createElement('bootstrap')                                                                      // 25
                                                                                                                      // 26
    var transEndEventNames = {                                                                                        // 27
      'WebkitTransition' : 'webkitTransitionEnd',                                                                     // 28
      'MozTransition'    : 'transitionend',                                                                           // 29
      'OTransition'      : 'oTransitionEnd otransitionend',                                                           // 30
      'transition'       : 'transitionend'                                                                            // 31
    }                                                                                                                 // 32
                                                                                                                      // 33
    for (var name in transEndEventNames) {                                                                            // 34
      if (el.style[name] !== undefined) {                                                                             // 35
        return { end: transEndEventNames[name] }                                                                      // 36
      }                                                                                                               // 37
    }                                                                                                                 // 38
                                                                                                                      // 39
    return false // explicit for ie8 (  ._.)                                                                          // 40
  }                                                                                                                   // 41
                                                                                                                      // 42
  // http://blog.alexmaccaw.com/css-transitions                                                                       // 43
  $.fn.emulateTransitionEnd = function (duration) {                                                                   // 44
    var called = false, $el = this                                                                                    // 45
    $(this).one($.support.transition.end, function () { called = true })                                              // 46
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }                              // 47
    setTimeout(callback, duration)                                                                                    // 48
    return this                                                                                                       // 49
  }                                                                                                                   // 50
                                                                                                                      // 51
  $(function () {                                                                                                     // 52
    $.support.transition = transitionEnd()                                                                            // 53
  })                                                                                                                  // 54
                                                                                                                      // 55
}(jQuery);                                                                                                            // 56
                                                                                                                      // 57
/* ========================================================================                                           // 58
 * Bootstrap: alert.js v3.1.0                                                                                         // 59
 * http://getbootstrap.com/javascript/#alerts                                                                         // 60
 * ========================================================================                                           // 61
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 62
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 63
 * ======================================================================== */                                        // 64
                                                                                                                      // 65
                                                                                                                      // 66
+function ($) {                                                                                                       // 67
  'use strict';                                                                                                       // 68
                                                                                                                      // 69
  // ALERT CLASS DEFINITION                                                                                           // 70
  // ======================                                                                                           // 71
                                                                                                                      // 72
  var dismiss = '[data-dismiss="alert"]'                                                                              // 73
  var Alert   = function (el) {                                                                                       // 74
    $(el).on('click', dismiss, this.close)                                                                            // 75
  }                                                                                                                   // 76
                                                                                                                      // 77
  Alert.prototype.close = function (e) {                                                                              // 78
    var $this    = $(this)                                                                                            // 79
    var selector = $this.attr('data-target')                                                                          // 80
                                                                                                                      // 81
    if (!selector) {                                                                                                  // 82
      selector = $this.attr('href')                                                                                   // 83
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7                                  // 84
    }                                                                                                                 // 85
                                                                                                                      // 86
    var $parent = $(selector)                                                                                         // 87
                                                                                                                      // 88
    if (e) e.preventDefault()                                                                                         // 89
                                                                                                                      // 90
    if (!$parent.length) {                                                                                            // 91
      $parent = $this.hasClass('alert') ? $this : $this.parent()                                                      // 92
    }                                                                                                                 // 93
                                                                                                                      // 94
    $parent.trigger(e = $.Event('close.bs.alert'))                                                                    // 95
                                                                                                                      // 96
    if (e.isDefaultPrevented()) return                                                                                // 97
                                                                                                                      // 98
    $parent.removeClass('in')                                                                                         // 99
                                                                                                                      // 100
    function removeElement() {                                                                                        // 101
      $parent.trigger('closed.bs.alert').remove()                                                                     // 102
    }                                                                                                                 // 103
                                                                                                                      // 104
    $.support.transition && $parent.hasClass('fade') ?                                                                // 105
      $parent                                                                                                         // 106
        .one($.support.transition.end, removeElement)                                                                 // 107
        .emulateTransitionEnd(150) :                                                                                  // 108
      removeElement()                                                                                                 // 109
  }                                                                                                                   // 110
                                                                                                                      // 111
                                                                                                                      // 112
  // ALERT PLUGIN DEFINITION                                                                                          // 113
  // =======================                                                                                          // 114
                                                                                                                      // 115
  var old = $.fn.alert                                                                                                // 116
                                                                                                                      // 117
  $.fn.alert = function (option) {                                                                                    // 118
    return this.each(function () {                                                                                    // 119
      var $this = $(this)                                                                                             // 120
      var data  = $this.data('bs.alert')                                                                              // 121
                                                                                                                      // 122
      if (!data) $this.data('bs.alert', (data = new Alert(this)))                                                     // 123
      if (typeof option == 'string') data[option].call($this)                                                         // 124
    })                                                                                                                // 125
  }                                                                                                                   // 126
                                                                                                                      // 127
  $.fn.alert.Constructor = Alert                                                                                      // 128
                                                                                                                      // 129
                                                                                                                      // 130
  // ALERT NO CONFLICT                                                                                                // 131
  // =================                                                                                                // 132
                                                                                                                      // 133
  $.fn.alert.noConflict = function () {                                                                               // 134
    $.fn.alert = old                                                                                                  // 135
    return this                                                                                                       // 136
  }                                                                                                                   // 137
                                                                                                                      // 138
                                                                                                                      // 139
  // ALERT DATA-API                                                                                                   // 140
  // ==============                                                                                                   // 141
                                                                                                                      // 142
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)                                           // 143
                                                                                                                      // 144
}(jQuery);                                                                                                            // 145
                                                                                                                      // 146
/* ========================================================================                                           // 147
 * Bootstrap: button.js v3.1.0                                                                                        // 148
 * http://getbootstrap.com/javascript/#buttons                                                                        // 149
 * ========================================================================                                           // 150
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 151
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 152
 * ======================================================================== */                                        // 153
                                                                                                                      // 154
                                                                                                                      // 155
+function ($) {                                                                                                       // 156
  'use strict';                                                                                                       // 157
                                                                                                                      // 158
  // BUTTON PUBLIC CLASS DEFINITION                                                                                   // 159
  // ==============================                                                                                   // 160
                                                                                                                      // 161
  var Button = function (element, options) {                                                                          // 162
    this.$element  = $(element)                                                                                       // 163
    this.options   = $.extend({}, Button.DEFAULTS, options)                                                           // 164
    this.isLoading = false                                                                                            // 165
  }                                                                                                                   // 166
                                                                                                                      // 167
  Button.DEFAULTS = {                                                                                                 // 168
    loadingText: 'loading...'                                                                                         // 169
  }                                                                                                                   // 170
                                                                                                                      // 171
  Button.prototype.setState = function (state) {                                                                      // 172
    var d    = 'disabled'                                                                                             // 173
    var $el  = this.$element                                                                                          // 174
    var val  = $el.is('input') ? 'val' : 'html'                                                                       // 175
    var data = $el.data()                                                                                             // 176
                                                                                                                      // 177
    state = state + 'Text'                                                                                            // 178
                                                                                                                      // 179
    if (!data.resetText) $el.data('resetText', $el[val]())                                                            // 180
                                                                                                                      // 181
    $el[val](data[state] || this.options[state])                                                                      // 182
                                                                                                                      // 183
    // push to event loop to allow forms to submit                                                                    // 184
    setTimeout($.proxy(function () {                                                                                  // 185
      if (state == 'loadingText') {                                                                                   // 186
        this.isLoading = true                                                                                         // 187
        $el.addClass(d).attr(d, d)                                                                                    // 188
      } else if (this.isLoading) {                                                                                    // 189
        this.isLoading = false                                                                                        // 190
        $el.removeClass(d).removeAttr(d)                                                                              // 191
      }                                                                                                               // 192
    }, this), 0)                                                                                                      // 193
  }                                                                                                                   // 194
                                                                                                                      // 195
  Button.prototype.toggle = function () {                                                                             // 196
    var changed = true                                                                                                // 197
    var $parent = this.$element.closest('[data-toggle="buttons"]')                                                    // 198
                                                                                                                      // 199
    if ($parent.length) {                                                                                             // 200
      var $input = this.$element.find('input')                                                                        // 201
      if ($input.prop('type') == 'radio') {                                                                           // 202
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false                               // 203
        else $parent.find('.active').removeClass('active')                                                            // 204
      }                                                                                                               // 205
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')                        // 206
    }                                                                                                                 // 207
                                                                                                                      // 208
    if (changed) this.$element.toggleClass('active')                                                                  // 209
  }                                                                                                                   // 210
                                                                                                                      // 211
                                                                                                                      // 212
  // BUTTON PLUGIN DEFINITION                                                                                         // 213
  // ========================                                                                                         // 214
                                                                                                                      // 215
  var old = $.fn.button                                                                                               // 216
                                                                                                                      // 217
  $.fn.button = function (option) {                                                                                   // 218
    return this.each(function () {                                                                                    // 219
      var $this   = $(this)                                                                                           // 220
      var data    = $this.data('bs.button')                                                                           // 221
      var options = typeof option == 'object' && option                                                               // 222
                                                                                                                      // 223
      if (!data) $this.data('bs.button', (data = new Button(this, options)))                                          // 224
                                                                                                                      // 225
      if (option == 'toggle') data.toggle()                                                                           // 226
      else if (option) data.setState(option)                                                                          // 227
    })                                                                                                                // 228
  }                                                                                                                   // 229
                                                                                                                      // 230
  $.fn.button.Constructor = Button                                                                                    // 231
                                                                                                                      // 232
                                                                                                                      // 233
  // BUTTON NO CONFLICT                                                                                               // 234
  // ==================                                                                                               // 235
                                                                                                                      // 236
  $.fn.button.noConflict = function () {                                                                              // 237
    $.fn.button = old                                                                                                 // 238
    return this                                                                                                       // 239
  }                                                                                                                   // 240
                                                                                                                      // 241
                                                                                                                      // 242
  // BUTTON DATA-API                                                                                                  // 243
  // ===============                                                                                                  // 244
                                                                                                                      // 245
  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {                                  // 246
    var $btn = $(e.target)                                                                                            // 247
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')                                                            // 248
    $btn.button('toggle')                                                                                             // 249
    e.preventDefault()                                                                                                // 250
  })                                                                                                                  // 251
                                                                                                                      // 252
}(jQuery);                                                                                                            // 253
                                                                                                                      // 254
/* ========================================================================                                           // 255
 * Bootstrap: carousel.js v3.1.0                                                                                      // 256
 * http://getbootstrap.com/javascript/#carousel                                                                       // 257
 * ========================================================================                                           // 258
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 259
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 260
 * ======================================================================== */                                        // 261
                                                                                                                      // 262
                                                                                                                      // 263
+function ($) {                                                                                                       // 264
  'use strict';                                                                                                       // 265
                                                                                                                      // 266
  // CAROUSEL CLASS DEFINITION                                                                                        // 267
  // =========================                                                                                        // 268
                                                                                                                      // 269
  var Carousel = function (element, options) {                                                                        // 270
    this.$element    = $(element)                                                                                     // 271
    this.$indicators = this.$element.find('.carousel-indicators')                                                     // 272
    this.options     = options                                                                                        // 273
    this.paused      =                                                                                                // 274
    this.sliding     =                                                                                                // 275
    this.interval    =                                                                                                // 276
    this.$active     =                                                                                                // 277
    this.$items      = null                                                                                           // 278
                                                                                                                      // 279
    this.options.pause == 'hover' && this.$element                                                                    // 280
      .on('mouseenter', $.proxy(this.pause, this))                                                                    // 281
      .on('mouseleave', $.proxy(this.cycle, this))                                                                    // 282
  }                                                                                                                   // 283
                                                                                                                      // 284
  Carousel.DEFAULTS = {                                                                                               // 285
    interval: 5000,                                                                                                   // 286
    pause: 'hover',                                                                                                   // 287
    wrap: true                                                                                                        // 288
  }                                                                                                                   // 289
                                                                                                                      // 290
  Carousel.prototype.cycle =  function (e) {                                                                          // 291
    e || (this.paused = false)                                                                                        // 292
                                                                                                                      // 293
    this.interval && clearInterval(this.interval)                                                                     // 294
                                                                                                                      // 295
    this.options.interval                                                                                             // 296
      && !this.paused                                                                                                 // 297
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))                               // 298
                                                                                                                      // 299
    return this                                                                                                       // 300
  }                                                                                                                   // 301
                                                                                                                      // 302
  Carousel.prototype.getActiveIndex = function () {                                                                   // 303
    this.$active = this.$element.find('.item.active')                                                                 // 304
    this.$items  = this.$active.parent().children()                                                                   // 305
                                                                                                                      // 306
    return this.$items.index(this.$active)                                                                            // 307
  }                                                                                                                   // 308
                                                                                                                      // 309
  Carousel.prototype.to = function (pos) {                                                                            // 310
    var that        = this                                                                                            // 311
    var activeIndex = this.getActiveIndex()                                                                           // 312
                                                                                                                      // 313
    if (pos > (this.$items.length - 1) || pos < 0) return                                                             // 314
                                                                                                                      // 315
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })                // 316
    if (activeIndex == pos) return this.pause().cycle()                                                               // 317
                                                                                                                      // 318
    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))                                       // 319
  }                                                                                                                   // 320
                                                                                                                      // 321
  Carousel.prototype.pause = function (e) {                                                                           // 322
    e || (this.paused = true)                                                                                         // 323
                                                                                                                      // 324
    if (this.$element.find('.next, .prev').length && $.support.transition) {                                          // 325
      this.$element.trigger($.support.transition.end)                                                                 // 326
      this.cycle(true)                                                                                                // 327
    }                                                                                                                 // 328
                                                                                                                      // 329
    this.interval = clearInterval(this.interval)                                                                      // 330
                                                                                                                      // 331
    return this                                                                                                       // 332
  }                                                                                                                   // 333
                                                                                                                      // 334
  Carousel.prototype.next = function () {                                                                             // 335
    if (this.sliding) return                                                                                          // 336
    return this.slide('next')                                                                                         // 337
  }                                                                                                                   // 338
                                                                                                                      // 339
  Carousel.prototype.prev = function () {                                                                             // 340
    if (this.sliding) return                                                                                          // 341
    return this.slide('prev')                                                                                         // 342
  }                                                                                                                   // 343
                                                                                                                      // 344
  Carousel.prototype.slide = function (type, next) {                                                                  // 345
    var $active   = this.$element.find('.item.active')                                                                // 346
    var $next     = next || $active[type]()                                                                           // 347
    var isCycling = this.interval                                                                                     // 348
    var direction = type == 'next' ? 'left' : 'right'                                                                 // 349
    var fallback  = type == 'next' ? 'first' : 'last'                                                                 // 350
    var that      = this                                                                                              // 351
                                                                                                                      // 352
    if (!$next.length) {                                                                                              // 353
      if (!this.options.wrap) return                                                                                  // 354
      $next = this.$element.find('.item')[fallback]()                                                                 // 355
    }                                                                                                                 // 356
                                                                                                                      // 357
    if ($next.hasClass('active')) return this.sliding = false                                                         // 358
                                                                                                                      // 359
    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })                           // 360
    this.$element.trigger(e)                                                                                          // 361
    if (e.isDefaultPrevented()) return                                                                                // 362
                                                                                                                      // 363
    this.sliding = true                                                                                               // 364
                                                                                                                      // 365
    isCycling && this.pause()                                                                                         // 366
                                                                                                                      // 367
    if (this.$indicators.length) {                                                                                    // 368
      this.$indicators.find('.active').removeClass('active')                                                          // 369
      this.$element.one('slid.bs.carousel', function () {                                                             // 370
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])                                    // 371
        $nextIndicator && $nextIndicator.addClass('active')                                                           // 372
      })                                                                                                              // 373
    }                                                                                                                 // 374
                                                                                                                      // 375
    if ($.support.transition && this.$element.hasClass('slide')) {                                                    // 376
      $next.addClass(type)                                                                                            // 377
      $next[0].offsetWidth // force reflow                                                                            // 378
      $active.addClass(direction)                                                                                     // 379
      $next.addClass(direction)                                                                                       // 380
      $active                                                                                                         // 381
        .one($.support.transition.end, function () {                                                                  // 382
          $next.removeClass([type, direction].join(' ')).addClass('active')                                           // 383
          $active.removeClass(['active', direction].join(' '))                                                        // 384
          that.sliding = false                                                                                        // 385
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)                                    // 386
        })                                                                                                            // 387
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)                                 // 388
    } else {                                                                                                          // 389
      $active.removeClass('active')                                                                                   // 390
      $next.addClass('active')                                                                                        // 391
      this.sliding = false                                                                                            // 392
      this.$element.trigger('slid.bs.carousel')                                                                       // 393
    }                                                                                                                 // 394
                                                                                                                      // 395
    isCycling && this.cycle()                                                                                         // 396
                                                                                                                      // 397
    return this                                                                                                       // 398
  }                                                                                                                   // 399
                                                                                                                      // 400
                                                                                                                      // 401
  // CAROUSEL PLUGIN DEFINITION                                                                                       // 402
  // ==========================                                                                                       // 403
                                                                                                                      // 404
  var old = $.fn.carousel                                                                                             // 405
                                                                                                                      // 406
  $.fn.carousel = function (option) {                                                                                 // 407
    return this.each(function () {                                                                                    // 408
      var $this   = $(this)                                                                                           // 409
      var data    = $this.data('bs.carousel')                                                                         // 410
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)                // 411
      var action  = typeof option == 'string' ? option : options.slide                                                // 412
                                                                                                                      // 413
      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))                                      // 414
      if (typeof option == 'number') data.to(option)                                                                  // 415
      else if (action) data[action]()                                                                                 // 416
      else if (options.interval) data.pause().cycle()                                                                 // 417
    })                                                                                                                // 418
  }                                                                                                                   // 419
                                                                                                                      // 420
  $.fn.carousel.Constructor = Carousel                                                                                // 421
                                                                                                                      // 422
                                                                                                                      // 423
  // CAROUSEL NO CONFLICT                                                                                             // 424
  // ====================                                                                                             // 425
                                                                                                                      // 426
  $.fn.carousel.noConflict = function () {                                                                            // 427
    $.fn.carousel = old                                                                                               // 428
    return this                                                                                                       // 429
  }                                                                                                                   // 430
                                                                                                                      // 431
                                                                                                                      // 432
  // CAROUSEL DATA-API                                                                                                // 433
  // =================                                                                                                // 434
                                                                                                                      // 435
  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {                        // 436
    var $this   = $(this), href                                                                                       // 437
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())                                                          // 439
    var slideIndex = $this.attr('data-slide-to')                                                                      // 440
    if (slideIndex) options.interval = false                                                                          // 441
                                                                                                                      // 442
    $target.carousel(options)                                                                                         // 443
                                                                                                                      // 444
    if (slideIndex = $this.attr('data-slide-to')) {                                                                   // 445
      $target.data('bs.carousel').to(slideIndex)                                                                      // 446
    }                                                                                                                 // 447
                                                                                                                      // 448
    e.preventDefault()                                                                                                // 449
  })                                                                                                                  // 450
                                                                                                                      // 451
  $(window).on('load', function () {                                                                                  // 452
    $('[data-ride="carousel"]').each(function () {                                                                    // 453
      var $carousel = $(this)                                                                                         // 454
      $carousel.carousel($carousel.data())                                                                            // 455
    })                                                                                                                // 456
  })                                                                                                                  // 457
                                                                                                                      // 458
}(jQuery);                                                                                                            // 459
                                                                                                                      // 460
/* ========================================================================                                           // 461
 * Bootstrap: collapse.js v3.1.0                                                                                      // 462
 * http://getbootstrap.com/javascript/#collapse                                                                       // 463
 * ========================================================================                                           // 464
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 465
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 466
 * ======================================================================== */                                        // 467
                                                                                                                      // 468
                                                                                                                      // 469
+function ($) {                                                                                                       // 470
  'use strict';                                                                                                       // 471
                                                                                                                      // 472
  // COLLAPSE PUBLIC CLASS DEFINITION                                                                                 // 473
  // ================================                                                                                 // 474
                                                                                                                      // 475
  var Collapse = function (element, options) {                                                                        // 476
    this.$element      = $(element)                                                                                   // 477
    this.options       = $.extend({}, Collapse.DEFAULTS, options)                                                     // 478
    this.transitioning = null                                                                                         // 479
                                                                                                                      // 480
    if (this.options.parent) this.$parent = $(this.options.parent)                                                    // 481
    if (this.options.toggle) this.toggle()                                                                            // 482
  }                                                                                                                   // 483
                                                                                                                      // 484
  Collapse.DEFAULTS = {                                                                                               // 485
    toggle: true                                                                                                      // 486
  }                                                                                                                   // 487
                                                                                                                      // 488
  Collapse.prototype.dimension = function () {                                                                        // 489
    var hasWidth = this.$element.hasClass('width')                                                                    // 490
    return hasWidth ? 'width' : 'height'                                                                              // 491
  }                                                                                                                   // 492
                                                                                                                      // 493
  Collapse.prototype.show = function () {                                                                             // 494
    if (this.transitioning || this.$element.hasClass('in')) return                                                    // 495
                                                                                                                      // 496
    var startEvent = $.Event('show.bs.collapse')                                                                      // 497
    this.$element.trigger(startEvent)                                                                                 // 498
    if (startEvent.isDefaultPrevented()) return                                                                       // 499
                                                                                                                      // 500
    var actives = this.$parent && this.$parent.find('> .panel > .in')                                                 // 501
                                                                                                                      // 502
    if (actives && actives.length) {                                                                                  // 503
      var hasData = actives.data('bs.collapse')                                                                       // 504
      if (hasData && hasData.transitioning) return                                                                    // 505
      actives.collapse('hide')                                                                                        // 506
      hasData || actives.data('bs.collapse', null)                                                                    // 507
    }                                                                                                                 // 508
                                                                                                                      // 509
    var dimension = this.dimension()                                                                                  // 510
                                                                                                                      // 511
    this.$element                                                                                                     // 512
      .removeClass('collapse')                                                                                        // 513
      .addClass('collapsing')                                                                                         // 514
      [dimension](0)                                                                                                  // 515
                                                                                                                      // 516
    this.transitioning = 1                                                                                            // 517
                                                                                                                      // 518
    var complete = function () {                                                                                      // 519
      this.$element                                                                                                   // 520
        .removeClass('collapsing')                                                                                    // 521
        .addClass('collapse in')                                                                                      // 522
        [dimension]('auto')                                                                                           // 523
      this.transitioning = 0                                                                                          // 524
      this.$element.trigger('shown.bs.collapse')                                                                      // 525
    }                                                                                                                 // 526
                                                                                                                      // 527
    if (!$.support.transition) return complete.call(this)                                                             // 528
                                                                                                                      // 529
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))                                                     // 530
                                                                                                                      // 531
    this.$element                                                                                                     // 532
      .one($.support.transition.end, $.proxy(complete, this))                                                         // 533
      .emulateTransitionEnd(350)                                                                                      // 534
      [dimension](this.$element[0][scrollSize])                                                                       // 535
  }                                                                                                                   // 536
                                                                                                                      // 537
  Collapse.prototype.hide = function () {                                                                             // 538
    if (this.transitioning || !this.$element.hasClass('in')) return                                                   // 539
                                                                                                                      // 540
    var startEvent = $.Event('hide.bs.collapse')                                                                      // 541
    this.$element.trigger(startEvent)                                                                                 // 542
    if (startEvent.isDefaultPrevented()) return                                                                       // 543
                                                                                                                      // 544
    var dimension = this.dimension()                                                                                  // 545
                                                                                                                      // 546
    this.$element                                                                                                     // 547
      [dimension](this.$element[dimension]())                                                                         // 548
      [0].offsetHeight                                                                                                // 549
                                                                                                                      // 550
    this.$element                                                                                                     // 551
      .addClass('collapsing')                                                                                         // 552
      .removeClass('collapse')                                                                                        // 553
      .removeClass('in')                                                                                              // 554
                                                                                                                      // 555
    this.transitioning = 1                                                                                            // 556
                                                                                                                      // 557
    var complete = function () {                                                                                      // 558
      this.transitioning = 0                                                                                          // 559
      this.$element                                                                                                   // 560
        .trigger('hidden.bs.collapse')                                                                                // 561
        .removeClass('collapsing')                                                                                    // 562
        .addClass('collapse')                                                                                         // 563
    }                                                                                                                 // 564
                                                                                                                      // 565
    if (!$.support.transition) return complete.call(this)                                                             // 566
                                                                                                                      // 567
    this.$element                                                                                                     // 568
      [dimension](0)                                                                                                  // 569
      .one($.support.transition.end, $.proxy(complete, this))                                                         // 570
      .emulateTransitionEnd(350)                                                                                      // 571
  }                                                                                                                   // 572
                                                                                                                      // 573
  Collapse.prototype.toggle = function () {                                                                           // 574
    this[this.$element.hasClass('in') ? 'hide' : 'show']()                                                            // 575
  }                                                                                                                   // 576
                                                                                                                      // 577
                                                                                                                      // 578
  // COLLAPSE PLUGIN DEFINITION                                                                                       // 579
  // ==========================                                                                                       // 580
                                                                                                                      // 581
  var old = $.fn.collapse                                                                                             // 582
                                                                                                                      // 583
  $.fn.collapse = function (option) {                                                                                 // 584
    return this.each(function () {                                                                                    // 585
      var $this   = $(this)                                                                                           // 586
      var data    = $this.data('bs.collapse')                                                                         // 587
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)                // 588
                                                                                                                      // 589
      if (!data && options.toggle && option == 'show') option = !option                                               // 590
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))                                      // 591
      if (typeof option == 'string') data[option]()                                                                   // 592
    })                                                                                                                // 593
  }                                                                                                                   // 594
                                                                                                                      // 595
  $.fn.collapse.Constructor = Collapse                                                                                // 596
                                                                                                                      // 597
                                                                                                                      // 598
  // COLLAPSE NO CONFLICT                                                                                             // 599
  // ====================                                                                                             // 600
                                                                                                                      // 601
  $.fn.collapse.noConflict = function () {                                                                            // 602
    $.fn.collapse = old                                                                                               // 603
    return this                                                                                                       // 604
  }                                                                                                                   // 605
                                                                                                                      // 606
                                                                                                                      // 607
  // COLLAPSE DATA-API                                                                                                // 608
  // =================                                                                                                // 609
                                                                                                                      // 610
  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {                               // 611
    var $this   = $(this), href                                                                                       // 612
    var target  = $this.attr('data-target')                                                                           // 613
        || e.preventDefault()                                                                                         // 614
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7                          // 615
    var $target = $(target)                                                                                           // 616
    var data    = $target.data('bs.collapse')                                                                         // 617
    var option  = data ? 'toggle' : $this.data()                                                                      // 618
    var parent  = $this.attr('data-parent')                                                                           // 619
    var $parent = parent && $(parent)                                                                                 // 620
                                                                                                                      // 621
    if (!data || !data.transitioning) {                                                                               // 622
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')                                         // 624
    }                                                                                                                 // 625
                                                                                                                      // 626
    $target.collapse(option)                                                                                          // 627
  })                                                                                                                  // 628
                                                                                                                      // 629
}(jQuery);                                                                                                            // 630
                                                                                                                      // 631
/* ========================================================================                                           // 632
 * Bootstrap: dropdown.js v3.1.0                                                                                      // 633
 * http://getbootstrap.com/javascript/#dropdowns                                                                      // 634
 * ========================================================================                                           // 635
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 636
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 637
 * ======================================================================== */                                        // 638
                                                                                                                      // 639
                                                                                                                      // 640
+function ($) {                                                                                                       // 641
  'use strict';                                                                                                       // 642
                                                                                                                      // 643
  // DROPDOWN CLASS DEFINITION                                                                                        // 644
  // =========================                                                                                        // 645
                                                                                                                      // 646
  var backdrop = '.dropdown-backdrop'                                                                                 // 647
  var toggle   = '[data-toggle=dropdown]'                                                                             // 648
  var Dropdown = function (element) {                                                                                 // 649
    $(element).on('click.bs.dropdown', this.toggle)                                                                   // 650
  }                                                                                                                   // 651
                                                                                                                      // 652
  Dropdown.prototype.toggle = function (e) {                                                                          // 653
    var $this = $(this)                                                                                               // 654
                                                                                                                      // 655
    if ($this.is('.disabled, :disabled')) return                                                                      // 656
                                                                                                                      // 657
    var $parent  = getParent($this)                                                                                   // 658
    var isActive = $parent.hasClass('open')                                                                           // 659
                                                                                                                      // 660
    clearMenus()                                                                                                      // 661
                                                                                                                      // 662
    if (!isActive) {                                                                                                  // 663
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {                     // 664
        // if mobile we use a backdrop because click events don't delegate                                            // 665
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)                            // 666
      }                                                                                                               // 667
                                                                                                                      // 668
      var relatedTarget = { relatedTarget: this }                                                                     // 669
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))                                                 // 670
                                                                                                                      // 671
      if (e.isDefaultPrevented()) return                                                                              // 672
                                                                                                                      // 673
      $parent                                                                                                         // 674
        .toggleClass('open')                                                                                          // 675
        .trigger('shown.bs.dropdown', relatedTarget)                                                                  // 676
                                                                                                                      // 677
      $this.focus()                                                                                                   // 678
    }                                                                                                                 // 679
                                                                                                                      // 680
    return false                                                                                                      // 681
  }                                                                                                                   // 682
                                                                                                                      // 683
  Dropdown.prototype.keydown = function (e) {                                                                         // 684
    if (!/(38|40|27)/.test(e.keyCode)) return                                                                         // 685
                                                                                                                      // 686
    var $this = $(this)                                                                                               // 687
                                                                                                                      // 688
    e.preventDefault()                                                                                                // 689
    e.stopPropagation()                                                                                               // 690
                                                                                                                      // 691
    if ($this.is('.disabled, :disabled')) return                                                                      // 692
                                                                                                                      // 693
    var $parent  = getParent($this)                                                                                   // 694
    var isActive = $parent.hasClass('open')                                                                           // 695
                                                                                                                      // 696
    if (!isActive || (isActive && e.keyCode == 27)) {                                                                 // 697
      if (e.which == 27) $parent.find(toggle).focus()                                                                 // 698
      return $this.click()                                                                                            // 699
    }                                                                                                                 // 700
                                                                                                                      // 701
    var desc = ' li:not(.divider):visible a'                                                                          // 702
    var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)                                       // 703
                                                                                                                      // 704
    if (!$items.length) return                                                                                        // 705
                                                                                                                      // 706
    var index = $items.index($items.filter(':focus'))                                                                 // 707
                                                                                                                      // 708
    if (e.keyCode == 38 && index > 0)                 index--                        // up                            // 709
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down                          // 710
    if (!~index)                                      index = 0                                                       // 711
                                                                                                                      // 712
    $items.eq(index).focus()                                                                                          // 713
  }                                                                                                                   // 714
                                                                                                                      // 715
  function clearMenus(e) {                                                                                            // 716
    $(backdrop).remove()                                                                                              // 717
    $(toggle).each(function () {                                                                                      // 718
      var $parent = getParent($(this))                                                                                // 719
      var relatedTarget = { relatedTarget: this }                                                                     // 720
      if (!$parent.hasClass('open')) return                                                                           // 721
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))                                                 // 722
      if (e.isDefaultPrevented()) return                                                                              // 723
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)                                        // 724
    })                                                                                                                // 725
  }                                                                                                                   // 726
                                                                                                                      // 727
  function getParent($this) {                                                                                         // 728
    var selector = $this.attr('data-target')                                                                          // 729
                                                                                                                      // 730
    if (!selector) {                                                                                                  // 731
      selector = $this.attr('href')                                                                                   // 732
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7     // 733
    }                                                                                                                 // 734
                                                                                                                      // 735
    var $parent = selector && $(selector)                                                                             // 736
                                                                                                                      // 737
    return $parent && $parent.length ? $parent : $this.parent()                                                       // 738
  }                                                                                                                   // 739
                                                                                                                      // 740
                                                                                                                      // 741
  // DROPDOWN PLUGIN DEFINITION                                                                                       // 742
  // ==========================                                                                                       // 743
                                                                                                                      // 744
  var old = $.fn.dropdown                                                                                             // 745
                                                                                                                      // 746
  $.fn.dropdown = function (option) {                                                                                 // 747
    return this.each(function () {                                                                                    // 748
      var $this = $(this)                                                                                             // 749
      var data  = $this.data('bs.dropdown')                                                                           // 750
                                                                                                                      // 751
      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))                                               // 752
      if (typeof option == 'string') data[option].call($this)                                                         // 753
    })                                                                                                                // 754
  }                                                                                                                   // 755
                                                                                                                      // 756
  $.fn.dropdown.Constructor = Dropdown                                                                                // 757
                                                                                                                      // 758
                                                                                                                      // 759
  // DROPDOWN NO CONFLICT                                                                                             // 760
  // ====================                                                                                             // 761
                                                                                                                      // 762
  $.fn.dropdown.noConflict = function () {                                                                            // 763
    $.fn.dropdown = old                                                                                               // 764
    return this                                                                                                       // 765
  }                                                                                                                   // 766
                                                                                                                      // 767
                                                                                                                      // 768
  // APPLY TO STANDARD DROPDOWN ELEMENTS                                                                              // 769
  // ===================================                                                                              // 770
                                                                                                                      // 771
  $(document)                                                                                                         // 772
    .on('click.bs.dropdown.data-api', clearMenus)                                                                     // 773
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })                         // 774
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)                                              // 775
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)         // 776
                                                                                                                      // 777
}(jQuery);                                                                                                            // 778
                                                                                                                      // 779
/* ========================================================================                                           // 780
 * Bootstrap: modal.js v3.1.0                                                                                         // 781
 * http://getbootstrap.com/javascript/#modals                                                                         // 782
 * ========================================================================                                           // 783
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 784
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 785
 * ======================================================================== */                                        // 786
                                                                                                                      // 787
                                                                                                                      // 788
+function ($) {                                                                                                       // 789
  'use strict';                                                                                                       // 790
                                                                                                                      // 791
  // MODAL CLASS DEFINITION                                                                                           // 792
  // ======================                                                                                           // 793
                                                                                                                      // 794
  var Modal = function (element, options) {                                                                           // 795
    this.options   = options                                                                                          // 796
    this.$element  = $(element)                                                                                       // 797
    this.$backdrop =                                                                                                  // 798
    this.isShown   = null                                                                                             // 799
                                                                                                                      // 800
    if (this.options.remote) {                                                                                        // 801
      this.$element                                                                                                   // 802
        .find('.modal-content')                                                                                       // 803
        .load(this.options.remote, $.proxy(function () {                                                              // 804
          this.$element.trigger('loaded.bs.modal')                                                                    // 805
        }, this))                                                                                                     // 806
    }                                                                                                                 // 807
  }                                                                                                                   // 808
                                                                                                                      // 809
  Modal.DEFAULTS = {                                                                                                  // 810
    backdrop: true,                                                                                                   // 811
    keyboard: true,                                                                                                   // 812
    show: true                                                                                                        // 813
  }                                                                                                                   // 814
                                                                                                                      // 815
  Modal.prototype.toggle = function (_relatedTarget) {                                                                // 816
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)                                                      // 817
  }                                                                                                                   // 818
                                                                                                                      // 819
  Modal.prototype.show = function (_relatedTarget) {                                                                  // 820
    var that = this                                                                                                   // 821
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })                                            // 822
                                                                                                                      // 823
    this.$element.trigger(e)                                                                                          // 824
                                                                                                                      // 825
    if (this.isShown || e.isDefaultPrevented()) return                                                                // 826
                                                                                                                      // 827
    this.isShown = true                                                                                               // 828
                                                                                                                      // 829
    this.escape()                                                                                                     // 830
                                                                                                                      // 831
    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))                    // 832
                                                                                                                      // 833
    this.backdrop(function () {                                                                                       // 834
      var transition = $.support.transition && that.$element.hasClass('fade')                                         // 835
                                                                                                                      // 836
      if (!that.$element.parent().length) {                                                                           // 837
        that.$element.appendTo(document.body) // don't move modals dom position                                       // 838
      }                                                                                                               // 839
                                                                                                                      // 840
      that.$element                                                                                                   // 841
        .show()                                                                                                       // 842
        .scrollTop(0)                                                                                                 // 843
                                                                                                                      // 844
      if (transition) {                                                                                               // 845
        that.$element[0].offsetWidth // force reflow                                                                  // 846
      }                                                                                                               // 847
                                                                                                                      // 848
      that.$element                                                                                                   // 849
        .addClass('in')                                                                                               // 850
        .attr('aria-hidden', false)                                                                                   // 851
                                                                                                                      // 852
      that.enforceFocus()                                                                                             // 853
                                                                                                                      // 854
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })                                            // 855
                                                                                                                      // 856
      transition ?                                                                                                    // 857
        that.$element.find('.modal-dialog') // wait for modal to slide in                                             // 858
          .one($.support.transition.end, function () {                                                                // 859
            that.$element.focus().trigger(e)                                                                          // 860
          })                                                                                                          // 861
          .emulateTransitionEnd(300) :                                                                                // 862
        that.$element.focus().trigger(e)                                                                              // 863
    })                                                                                                                // 864
  }                                                                                                                   // 865
                                                                                                                      // 866
  Modal.prototype.hide = function (e) {                                                                               // 867
    if (e) e.preventDefault()                                                                                         // 868
                                                                                                                      // 869
    e = $.Event('hide.bs.modal')                                                                                      // 870
                                                                                                                      // 871
    this.$element.trigger(e)                                                                                          // 872
                                                                                                                      // 873
    if (!this.isShown || e.isDefaultPrevented()) return                                                               // 874
                                                                                                                      // 875
    this.isShown = false                                                                                              // 876
                                                                                                                      // 877
    this.escape()                                                                                                     // 878
                                                                                                                      // 879
    $(document).off('focusin.bs.modal')                                                                               // 880
                                                                                                                      // 881
    this.$element                                                                                                     // 882
      .removeClass('in')                                                                                              // 883
      .attr('aria-hidden', true)                                                                                      // 884
      .off('click.dismiss.bs.modal')                                                                                  // 885
                                                                                                                      // 886
    $.support.transition && this.$element.hasClass('fade') ?                                                          // 887
      this.$element                                                                                                   // 888
        .one($.support.transition.end, $.proxy(this.hideModal, this))                                                 // 889
        .emulateTransitionEnd(300) :                                                                                  // 890
      this.hideModal()                                                                                                // 891
  }                                                                                                                   // 892
                                                                                                                      // 893
  Modal.prototype.enforceFocus = function () {                                                                        // 894
    $(document)                                                                                                       // 895
      .off('focusin.bs.modal') // guard against infinite focus loop                                                   // 896
      .on('focusin.bs.modal', $.proxy(function (e) {                                                                  // 897
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {                                   // 898
          this.$element.focus()                                                                                       // 899
        }                                                                                                             // 900
      }, this))                                                                                                       // 901
  }                                                                                                                   // 902
                                                                                                                      // 903
  Modal.prototype.escape = function () {                                                                              // 904
    if (this.isShown && this.options.keyboard) {                                                                      // 905
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {                                               // 906
        e.which == 27 && this.hide()                                                                                  // 907
      }, this))                                                                                                       // 908
    } else if (!this.isShown) {                                                                                       // 909
      this.$element.off('keyup.dismiss.bs.modal')                                                                     // 910
    }                                                                                                                 // 911
  }                                                                                                                   // 912
                                                                                                                      // 913
  Modal.prototype.hideModal = function () {                                                                           // 914
    var that = this                                                                                                   // 915
    this.$element.hide()                                                                                              // 916
    this.backdrop(function () {                                                                                       // 917
      that.removeBackdrop()                                                                                           // 918
      that.$element.trigger('hidden.bs.modal')                                                                        // 919
    })                                                                                                                // 920
  }                                                                                                                   // 921
                                                                                                                      // 922
  Modal.prototype.removeBackdrop = function () {                                                                      // 923
    this.$backdrop && this.$backdrop.remove()                                                                         // 924
    this.$backdrop = null                                                                                             // 925
  }                                                                                                                   // 926
                                                                                                                      // 927
  Modal.prototype.backdrop = function (callback) {                                                                    // 928
    var animate = this.$element.hasClass('fade') ? 'fade' : ''                                                        // 929
                                                                                                                      // 930
    if (this.isShown && this.options.backdrop) {                                                                      // 931
      var doAnimate = $.support.transition && animate                                                                 // 932
                                                                                                                      // 933
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')                                            // 934
        .appendTo(document.body)                                                                                      // 935
                                                                                                                      // 936
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {                                               // 937
        if (e.target !== e.currentTarget) return                                                                      // 938
        this.options.backdrop == 'static'                                                                             // 939
          ? this.$element[0].focus.call(this.$element[0])                                                             // 940
          : this.hide.call(this)                                                                                      // 941
      }, this))                                                                                                       // 942
                                                                                                                      // 943
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow                                                    // 944
                                                                                                                      // 945
      this.$backdrop.addClass('in')                                                                                   // 946
                                                                                                                      // 947
      if (!callback) return                                                                                           // 948
                                                                                                                      // 949
      doAnimate ?                                                                                                     // 950
        this.$backdrop                                                                                                // 951
          .one($.support.transition.end, callback)                                                                    // 952
          .emulateTransitionEnd(150) :                                                                                // 953
        callback()                                                                                                    // 954
                                                                                                                      // 955
    } else if (!this.isShown && this.$backdrop) {                                                                     // 956
      this.$backdrop.removeClass('in')                                                                                // 957
                                                                                                                      // 958
      $.support.transition && this.$element.hasClass('fade') ?                                                        // 959
        this.$backdrop                                                                                                // 960
          .one($.support.transition.end, callback)                                                                    // 961
          .emulateTransitionEnd(150) :                                                                                // 962
        callback()                                                                                                    // 963
                                                                                                                      // 964
    } else if (callback) {                                                                                            // 965
      callback()                                                                                                      // 966
    }                                                                                                                 // 967
  }                                                                                                                   // 968
                                                                                                                      // 969
                                                                                                                      // 970
  // MODAL PLUGIN DEFINITION                                                                                          // 971
  // =======================                                                                                          // 972
                                                                                                                      // 973
  var old = $.fn.modal                                                                                                // 974
                                                                                                                      // 975
  $.fn.modal = function (option, _relatedTarget) {                                                                    // 976
    return this.each(function () {                                                                                    // 977
      var $this   = $(this)                                                                                           // 978
      var data    = $this.data('bs.modal')                                                                            // 979
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)                   // 980
                                                                                                                      // 981
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))                                            // 982
      if (typeof option == 'string') data[option](_relatedTarget)                                                     // 983
      else if (options.show) data.show(_relatedTarget)                                                                // 984
    })                                                                                                                // 985
  }                                                                                                                   // 986
                                                                                                                      // 987
  $.fn.modal.Constructor = Modal                                                                                      // 988
                                                                                                                      // 989
                                                                                                                      // 990
  // MODAL NO CONFLICT                                                                                                // 991
  // =================                                                                                                // 992
                                                                                                                      // 993
  $.fn.modal.noConflict = function () {                                                                               // 994
    $.fn.modal = old                                                                                                  // 995
    return this                                                                                                       // 996
  }                                                                                                                   // 997
                                                                                                                      // 998
                                                                                                                      // 999
  // MODAL DATA-API                                                                                                   // 1000
  // ==============                                                                                                   // 1001
                                                                                                                      // 1002
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {                                   // 1003
    var $this   = $(this)                                                                                             // 1004
    var href    = $this.attr('href')                                                                                  // 1005
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7        // 1006
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
                                                                                                                      // 1008
    if ($this.is('a')) e.preventDefault()                                                                             // 1009
                                                                                                                      // 1010
    $target                                                                                                           // 1011
      .modal(option, this)                                                                                            // 1012
      .one('hide', function () {                                                                                      // 1013
        $this.is(':visible') && $this.focus()                                                                         // 1014
      })                                                                                                              // 1015
  })                                                                                                                  // 1016
                                                                                                                      // 1017
  $(document)                                                                                                         // 1018
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })                           // 1019
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })                      // 1020
                                                                                                                      // 1021
}(jQuery);                                                                                                            // 1022
                                                                                                                      // 1023
/* ========================================================================                                           // 1024
 * Bootstrap: tooltip.js v3.1.0                                                                                       // 1025
 * http://getbootstrap.com/javascript/#tooltip                                                                        // 1026
 * Inspired by the original jQuery.tipsy by Jason Frame                                                               // 1027
 * ========================================================================                                           // 1028
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 1029
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 1030
 * ======================================================================== */                                        // 1031
                                                                                                                      // 1032
                                                                                                                      // 1033
+function ($) {                                                                                                       // 1034
  'use strict';                                                                                                       // 1035
                                                                                                                      // 1036
  // TOOLTIP PUBLIC CLASS DEFINITION                                                                                  // 1037
  // ===============================                                                                                  // 1038
                                                                                                                      // 1039
  var Tooltip = function (element, options) {                                                                         // 1040
    this.type       =                                                                                                 // 1041
    this.options    =                                                                                                 // 1042
    this.enabled    =                                                                                                 // 1043
    this.timeout    =                                                                                                 // 1044
    this.hoverState =                                                                                                 // 1045
    this.$element   = null                                                                                            // 1046
                                                                                                                      // 1047
    this.init('tooltip', element, options)                                                                            // 1048
  }                                                                                                                   // 1049
                                                                                                                      // 1050
  Tooltip.DEFAULTS = {                                                                                                // 1051
    animation: true,                                                                                                  // 1052
    placement: 'top',                                                                                                 // 1053
    selector: false,                                                                                                  // 1054
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',        // 1055
    trigger: 'hover focus',                                                                                           // 1056
    title: '',                                                                                                        // 1057
    delay: 0,                                                                                                         // 1058
    html: false,                                                                                                      // 1059
    container: false                                                                                                  // 1060
  }                                                                                                                   // 1061
                                                                                                                      // 1062
  Tooltip.prototype.init = function (type, element, options) {                                                        // 1063
    this.enabled  = true                                                                                              // 1064
    this.type     = type                                                                                              // 1065
    this.$element = $(element)                                                                                        // 1066
    this.options  = this.getOptions(options)                                                                          // 1067
                                                                                                                      // 1068
    var triggers = this.options.trigger.split(' ')                                                                    // 1069
                                                                                                                      // 1070
    for (var i = triggers.length; i--;) {                                                                             // 1071
      var trigger = triggers[i]                                                                                       // 1072
                                                                                                                      // 1073
      if (trigger == 'click') {                                                                                       // 1074
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))                     // 1075
      } else if (trigger != 'manual') {                                                                               // 1076
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'                                                  // 1077
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'                                                 // 1078
                                                                                                                      // 1079
        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))                // 1080
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))                // 1081
      }                                                                                                               // 1082
    }                                                                                                                 // 1083
                                                                                                                      // 1084
    this.options.selector ?                                                                                           // 1085
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :                             // 1086
      this.fixTitle()                                                                                                 // 1087
  }                                                                                                                   // 1088
                                                                                                                      // 1089
  Tooltip.prototype.getDefaults = function () {                                                                       // 1090
    return Tooltip.DEFAULTS                                                                                           // 1091
  }                                                                                                                   // 1092
                                                                                                                      // 1093
  Tooltip.prototype.getOptions = function (options) {                                                                 // 1094
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)                                         // 1095
                                                                                                                      // 1096
    if (options.delay && typeof options.delay == 'number') {                                                          // 1097
      options.delay = {                                                                                               // 1098
        show: options.delay,                                                                                          // 1099
        hide: options.delay                                                                                           // 1100
      }                                                                                                               // 1101
    }                                                                                                                 // 1102
                                                                                                                      // 1103
    return options                                                                                                    // 1104
  }                                                                                                                   // 1105
                                                                                                                      // 1106
  Tooltip.prototype.getDelegateOptions = function () {                                                                // 1107
    var options  = {}                                                                                                 // 1108
    var defaults = this.getDefaults()                                                                                 // 1109
                                                                                                                      // 1110
    this._options && $.each(this._options, function (key, value) {                                                    // 1111
      if (defaults[key] != value) options[key] = value                                                                // 1112
    })                                                                                                                // 1113
                                                                                                                      // 1114
    return options                                                                                                    // 1115
  }                                                                                                                   // 1116
                                                                                                                      // 1117
  Tooltip.prototype.enter = function (obj) {                                                                          // 1118
    var self = obj instanceof this.constructor ?                                                                      // 1119
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)                        // 1120
                                                                                                                      // 1121
    clearTimeout(self.timeout)                                                                                        // 1122
                                                                                                                      // 1123
    self.hoverState = 'in'                                                                                            // 1124
                                                                                                                      // 1125
    if (!self.options.delay || !self.options.delay.show) return self.show()                                           // 1126
                                                                                                                      // 1127
    self.timeout = setTimeout(function () {                                                                           // 1128
      if (self.hoverState == 'in') self.show()                                                                        // 1129
    }, self.options.delay.show)                                                                                       // 1130
  }                                                                                                                   // 1131
                                                                                                                      // 1132
  Tooltip.prototype.leave = function (obj) {                                                                          // 1133
    var self = obj instanceof this.constructor ?                                                                      // 1134
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)                        // 1135
                                                                                                                      // 1136
    clearTimeout(self.timeout)                                                                                        // 1137
                                                                                                                      // 1138
    self.hoverState = 'out'                                                                                           // 1139
                                                                                                                      // 1140
    if (!self.options.delay || !self.options.delay.hide) return self.hide()                                           // 1141
                                                                                                                      // 1142
    self.timeout = setTimeout(function () {                                                                           // 1143
      if (self.hoverState == 'out') self.hide()                                                                       // 1144
    }, self.options.delay.hide)                                                                                       // 1145
  }                                                                                                                   // 1146
                                                                                                                      // 1147
  Tooltip.prototype.show = function () {                                                                              // 1148
    var e = $.Event('show.bs.' + this.type)                                                                           // 1149
                                                                                                                      // 1150
    if (this.hasContent() && this.enabled) {                                                                          // 1151
      this.$element.trigger(e)                                                                                        // 1152
                                                                                                                      // 1153
      if (e.isDefaultPrevented()) return                                                                              // 1154
      var that = this;                                                                                                // 1155
                                                                                                                      // 1156
      var $tip = this.tip()                                                                                           // 1157
                                                                                                                      // 1158
      this.setContent()                                                                                               // 1159
                                                                                                                      // 1160
      if (this.options.animation) $tip.addClass('fade')                                                               // 1161
                                                                                                                      // 1162
      var placement = typeof this.options.placement == 'function' ?                                                   // 1163
        this.options.placement.call(this, $tip[0], this.$element[0]) :                                                // 1164
        this.options.placement                                                                                        // 1165
                                                                                                                      // 1166
      var autoToken = /\s?auto?\s?/i                                                                                  // 1167
      var autoPlace = autoToken.test(placement)                                                                       // 1168
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'                                            // 1169
                                                                                                                      // 1170
      $tip                                                                                                            // 1171
        .detach()                                                                                                     // 1172
        .css({ top: 0, left: 0, display: 'block' })                                                                   // 1173
        .addClass(placement)                                                                                          // 1174
                                                                                                                      // 1175
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)                // 1176
                                                                                                                      // 1177
      var pos          = this.getPosition()                                                                           // 1178
      var actualWidth  = $tip[0].offsetWidth                                                                          // 1179
      var actualHeight = $tip[0].offsetHeight                                                                         // 1180
                                                                                                                      // 1181
      if (autoPlace) {                                                                                                // 1182
        var $parent = this.$element.parent()                                                                          // 1183
                                                                                                                      // 1184
        var orgPlacement = placement                                                                                  // 1185
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop                              // 1186
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()               // 1187
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()              // 1188
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left                               // 1189
                                                                                                                      // 1190
        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement                                                                                         // 1195
                                                                                                                      // 1196
        $tip                                                                                                          // 1197
          .removeClass(orgPlacement)                                                                                  // 1198
          .addClass(placement)                                                                                        // 1199
      }                                                                                                               // 1200
                                                                                                                      // 1201
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)                      // 1202
                                                                                                                      // 1203
      this.applyPlacement(calculatedOffset, placement)                                                                // 1204
      this.hoverState = null                                                                                          // 1205
                                                                                                                      // 1206
      var complete = function() {                                                                                     // 1207
        that.$element.trigger('shown.bs.' + that.type)                                                                // 1208
      }                                                                                                               // 1209
                                                                                                                      // 1210
      $.support.transition && this.$tip.hasClass('fade') ?                                                            // 1211
        $tip                                                                                                          // 1212
          .one($.support.transition.end, complete)                                                                    // 1213
          .emulateTransitionEnd(150) :                                                                                // 1214
        complete()                                                                                                    // 1215
    }                                                                                                                 // 1216
  }                                                                                                                   // 1217
                                                                                                                      // 1218
  Tooltip.prototype.applyPlacement = function (offset, placement) {                                                   // 1219
    var replace                                                                                                       // 1220
    var $tip   = this.tip()                                                                                           // 1221
    var width  = $tip[0].offsetWidth                                                                                  // 1222
    var height = $tip[0].offsetHeight                                                                                 // 1223
                                                                                                                      // 1224
    // manually read margins because getBoundingClientRect includes difference                                        // 1225
    var marginTop = parseInt($tip.css('margin-top'), 10)                                                              // 1226
    var marginLeft = parseInt($tip.css('margin-left'), 10)                                                            // 1227
                                                                                                                      // 1228
    // we must check for NaN for ie 8/9                                                                               // 1229
    if (isNaN(marginTop))  marginTop  = 0                                                                             // 1230
    if (isNaN(marginLeft)) marginLeft = 0                                                                             // 1231
                                                                                                                      // 1232
    offset.top  = offset.top  + marginTop                                                                             // 1233
    offset.left = offset.left + marginLeft                                                                            // 1234
                                                                                                                      // 1235
    // $.fn.offset doesn't round pixel values                                                                         // 1236
    // so we use setOffset directly with our own function B-0                                                         // 1237
    $.offset.setOffset($tip[0], $.extend({                                                                            // 1238
      using: function (props) {                                                                                       // 1239
        $tip.css({                                                                                                    // 1240
          top: Math.round(props.top),                                                                                 // 1241
          left: Math.round(props.left)                                                                                // 1242
        })                                                                                                            // 1243
      }                                                                                                               // 1244
    }, offset), 0)                                                                                                    // 1245
                                                                                                                      // 1246
    $tip.addClass('in')                                                                                               // 1247
                                                                                                                      // 1248
    // check to see if placing tip in new offset caused the tip to resize itself                                      // 1249
    var actualWidth  = $tip[0].offsetWidth                                                                            // 1250
    var actualHeight = $tip[0].offsetHeight                                                                           // 1251
                                                                                                                      // 1252
    if (placement == 'top' && actualHeight != height) {                                                               // 1253
      replace = true                                                                                                  // 1254
      offset.top = offset.top + height - actualHeight                                                                 // 1255
    }                                                                                                                 // 1256
                                                                                                                      // 1257
    if (/bottom|top/.test(placement)) {                                                                               // 1258
      var delta = 0                                                                                                   // 1259
                                                                                                                      // 1260
      if (offset.left < 0) {                                                                                          // 1261
        delta       = offset.left * -2                                                                                // 1262
        offset.left = 0                                                                                               // 1263
                                                                                                                      // 1264
        $tip.offset(offset)                                                                                           // 1265
                                                                                                                      // 1266
        actualWidth  = $tip[0].offsetWidth                                                                            // 1267
        actualHeight = $tip[0].offsetHeight                                                                           // 1268
      }                                                                                                               // 1269
                                                                                                                      // 1270
      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')                                             // 1271
    } else {                                                                                                          // 1272
      this.replaceArrow(actualHeight - height, actualHeight, 'top')                                                   // 1273
    }                                                                                                                 // 1274
                                                                                                                      // 1275
    if (replace) $tip.offset(offset)                                                                                  // 1276
  }                                                                                                                   // 1277
                                                                                                                      // 1278
  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {                                            // 1279
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')                                     // 1280
  }                                                                                                                   // 1281
                                                                                                                      // 1282
  Tooltip.prototype.setContent = function () {                                                                        // 1283
    var $tip  = this.tip()                                                                                            // 1284
    var title = this.getTitle()                                                                                       // 1285
                                                                                                                      // 1286
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)                                           // 1287
    $tip.removeClass('fade in top bottom left right')                                                                 // 1288
  }                                                                                                                   // 1289
                                                                                                                      // 1290
  Tooltip.prototype.hide = function () {                                                                              // 1291
    var that = this                                                                                                   // 1292
    var $tip = this.tip()                                                                                             // 1293
    var e    = $.Event('hide.bs.' + this.type)                                                                        // 1294
                                                                                                                      // 1295
    function complete() {                                                                                             // 1296
      if (that.hoverState != 'in') $tip.detach()                                                                      // 1297
      that.$element.trigger('hidden.bs.' + that.type)                                                                 // 1298
    }                                                                                                                 // 1299
                                                                                                                      // 1300
    this.$element.trigger(e)                                                                                          // 1301
                                                                                                                      // 1302
    if (e.isDefaultPrevented()) return                                                                                // 1303
                                                                                                                      // 1304
    $tip.removeClass('in')                                                                                            // 1305
                                                                                                                      // 1306
    $.support.transition && this.$tip.hasClass('fade') ?                                                              // 1307
      $tip                                                                                                            // 1308
        .one($.support.transition.end, complete)                                                                      // 1309
        .emulateTransitionEnd(150) :                                                                                  // 1310
      complete()                                                                                                      // 1311
                                                                                                                      // 1312
    this.hoverState = null                                                                                            // 1313
                                                                                                                      // 1314
    return this                                                                                                       // 1315
  }                                                                                                                   // 1316
                                                                                                                      // 1317
  Tooltip.prototype.fixTitle = function () {                                                                          // 1318
    var $e = this.$element                                                                                            // 1319
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {                                     // 1320
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')                                        // 1321
    }                                                                                                                 // 1322
  }                                                                                                                   // 1323
                                                                                                                      // 1324
  Tooltip.prototype.hasContent = function () {                                                                        // 1325
    return this.getTitle()                                                                                            // 1326
  }                                                                                                                   // 1327
                                                                                                                      // 1328
  Tooltip.prototype.getPosition = function () {                                                                       // 1329
    var el = this.$element[0]                                                                                         // 1330
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {              // 1331
      width: el.offsetWidth,                                                                                          // 1332
      height: el.offsetHeight                                                                                         // 1333
    }, this.$element.offset())                                                                                        // 1334
  }                                                                                                                   // 1335
                                                                                                                      // 1336
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {                      // 1337
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   } // 1341
  }                                                                                                                   // 1342
                                                                                                                      // 1343
  Tooltip.prototype.getTitle = function () {                                                                          // 1344
    var title                                                                                                         // 1345
    var $e = this.$element                                                                                            // 1346
    var o  = this.options                                                                                             // 1347
                                                                                                                      // 1348
    title = $e.attr('data-original-title')                                                                            // 1349
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)                                              // 1350
                                                                                                                      // 1351
    return title                                                                                                      // 1352
  }                                                                                                                   // 1353
                                                                                                                      // 1354
  Tooltip.prototype.tip = function () {                                                                               // 1355
    return this.$tip = this.$tip || $(this.options.template)                                                          // 1356
  }                                                                                                                   // 1357
                                                                                                                      // 1358
  Tooltip.prototype.arrow = function () {                                                                             // 1359
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')                                             // 1360
  }                                                                                                                   // 1361
                                                                                                                      // 1362
  Tooltip.prototype.validate = function () {                                                                          // 1363
    if (!this.$element[0].parentNode) {                                                                               // 1364
      this.hide()                                                                                                     // 1365
      this.$element = null                                                                                            // 1366
      this.options  = null                                                                                            // 1367
    }                                                                                                                 // 1368
  }                                                                                                                   // 1369
                                                                                                                      // 1370
  Tooltip.prototype.enable = function () {                                                                            // 1371
    this.enabled = true                                                                                               // 1372
  }                                                                                                                   // 1373
                                                                                                                      // 1374
  Tooltip.prototype.disable = function () {                                                                           // 1375
    this.enabled = false                                                                                              // 1376
  }                                                                                                                   // 1377
                                                                                                                      // 1378
  Tooltip.prototype.toggleEnabled = function () {                                                                     // 1379
    this.enabled = !this.enabled                                                                                      // 1380
  }                                                                                                                   // 1381
                                                                                                                      // 1382
  Tooltip.prototype.toggle = function (e) {                                                                           // 1383
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this            // 1384
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)                                                   // 1385
  }                                                                                                                   // 1386
                                                                                                                      // 1387
  Tooltip.prototype.destroy = function () {                                                                           // 1388
    clearTimeout(this.timeout)                                                                                        // 1389
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)                                           // 1390
  }                                                                                                                   // 1391
                                                                                                                      // 1392
                                                                                                                      // 1393
  // TOOLTIP PLUGIN DEFINITION                                                                                        // 1394
  // =========================                                                                                        // 1395
                                                                                                                      // 1396
  var old = $.fn.tooltip                                                                                              // 1397
                                                                                                                      // 1398
  $.fn.tooltip = function (option) {                                                                                  // 1399
    return this.each(function () {                                                                                    // 1400
      var $this   = $(this)                                                                                           // 1401
      var data    = $this.data('bs.tooltip')                                                                          // 1402
      var options = typeof option == 'object' && option                                                               // 1403
                                                                                                                      // 1404
      if (!data && option == 'destroy') return                                                                        // 1405
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))                                        // 1406
      if (typeof option == 'string') data[option]()                                                                   // 1407
    })                                                                                                                // 1408
  }                                                                                                                   // 1409
                                                                                                                      // 1410
  $.fn.tooltip.Constructor = Tooltip                                                                                  // 1411
                                                                                                                      // 1412
                                                                                                                      // 1413
  // TOOLTIP NO CONFLICT                                                                                              // 1414
  // ===================                                                                                              // 1415
                                                                                                                      // 1416
  $.fn.tooltip.noConflict = function () {                                                                             // 1417
    $.fn.tooltip = old                                                                                                // 1418
    return this                                                                                                       // 1419
  }                                                                                                                   // 1420
                                                                                                                      // 1421
}(jQuery);                                                                                                            // 1422
                                                                                                                      // 1423
/* ========================================================================                                           // 1424
 * Bootstrap: popover.js v3.1.0                                                                                       // 1425
 * http://getbootstrap.com/javascript/#popovers                                                                       // 1426
 * ========================================================================                                           // 1427
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 1428
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 1429
 * ======================================================================== */                                        // 1430
                                                                                                                      // 1431
                                                                                                                      // 1432
+function ($) {                                                                                                       // 1433
  'use strict';                                                                                                       // 1434
                                                                                                                      // 1435
  // POPOVER PUBLIC CLASS DEFINITION                                                                                  // 1436
  // ===============================                                                                                  // 1437
                                                                                                                      // 1438
  var Popover = function (element, options) {                                                                         // 1439
    this.init('popover', element, options)                                                                            // 1440
  }                                                                                                                   // 1441
                                                                                                                      // 1442
  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')                                                   // 1443
                                                                                                                      // 1444
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {                                                // 1445
    placement: 'right',                                                                                               // 1446
    trigger: 'click',                                                                                                 // 1447
    content: '',                                                                                                      // 1448
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })                                                                                                                  // 1450
                                                                                                                      // 1451
                                                                                                                      // 1452
  // NOTE: POPOVER EXTENDS tooltip.js                                                                                 // 1453
  // ================================                                                                                 // 1454
                                                                                                                      // 1455
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)                                                // 1456
                                                                                                                      // 1457
  Popover.prototype.constructor = Popover                                                                             // 1458
                                                                                                                      // 1459
  Popover.prototype.getDefaults = function () {                                                                       // 1460
    return Popover.DEFAULTS                                                                                           // 1461
  }                                                                                                                   // 1462
                                                                                                                      // 1463
  Popover.prototype.setContent = function () {                                                                        // 1464
    var $tip    = this.tip()                                                                                          // 1465
    var title   = this.getTitle()                                                                                     // 1466
    var content = this.getContent()                                                                                   // 1467
                                                                                                                      // 1468
    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)                                           // 1469
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events                            // 1470
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'                                   // 1471
    ](content)                                                                                                        // 1472
                                                                                                                      // 1473
    $tip.removeClass('fade top bottom left right in')                                                                 // 1474
                                                                                                                      // 1475
    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do                                      // 1476
    // this manually by checking the contents.                                                                        // 1477
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()                                       // 1478
  }                                                                                                                   // 1479
                                                                                                                      // 1480
  Popover.prototype.hasContent = function () {                                                                        // 1481
    return this.getTitle() || this.getContent()                                                                       // 1482
  }                                                                                                                   // 1483
                                                                                                                      // 1484
  Popover.prototype.getContent = function () {                                                                        // 1485
    var $e = this.$element                                                                                            // 1486
    var o  = this.options                                                                                             // 1487
                                                                                                                      // 1488
    return $e.attr('data-content')                                                                                    // 1489
      || (typeof o.content == 'function' ?                                                                            // 1490
            o.content.call($e[0]) :                                                                                   // 1491
            o.content)                                                                                                // 1492
  }                                                                                                                   // 1493
                                                                                                                      // 1494
  Popover.prototype.arrow = function () {                                                                             // 1495
    return this.$arrow = this.$arrow || this.tip().find('.arrow')                                                     // 1496
  }                                                                                                                   // 1497
                                                                                                                      // 1498
  Popover.prototype.tip = function () {                                                                               // 1499
    if (!this.$tip) this.$tip = $(this.options.template)                                                              // 1500
    return this.$tip                                                                                                  // 1501
  }                                                                                                                   // 1502
                                                                                                                      // 1503
                                                                                                                      // 1504
  // POPOVER PLUGIN DEFINITION                                                                                        // 1505
  // =========================                                                                                        // 1506
                                                                                                                      // 1507
  var old = $.fn.popover                                                                                              // 1508
                                                                                                                      // 1509
  $.fn.popover = function (option) {                                                                                  // 1510
    return this.each(function () {                                                                                    // 1511
      var $this   = $(this)                                                                                           // 1512
      var data    = $this.data('bs.popover')                                                                          // 1513
      var options = typeof option == 'object' && option                                                               // 1514
                                                                                                                      // 1515
      if (!data && option == 'destroy') return                                                                        // 1516
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))                                        // 1517
      if (typeof option == 'string') data[option]()                                                                   // 1518
    })                                                                                                                // 1519
  }                                                                                                                   // 1520
                                                                                                                      // 1521
  $.fn.popover.Constructor = Popover                                                                                  // 1522
                                                                                                                      // 1523
                                                                                                                      // 1524
  // POPOVER NO CONFLICT                                                                                              // 1525
  // ===================                                                                                              // 1526
                                                                                                                      // 1527
  $.fn.popover.noConflict = function () {                                                                             // 1528
    $.fn.popover = old                                                                                                // 1529
    return this                                                                                                       // 1530
  }                                                                                                                   // 1531
                                                                                                                      // 1532
}(jQuery);                                                                                                            // 1533
                                                                                                                      // 1534
/* ========================================================================                                           // 1535
 * Bootstrap: scrollspy.js v3.1.0                                                                                     // 1536
 * http://getbootstrap.com/javascript/#scrollspy                                                                      // 1537
 * ========================================================================                                           // 1538
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 1539
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 1540
 * ======================================================================== */                                        // 1541
                                                                                                                      // 1542
                                                                                                                      // 1543
+function ($) {                                                                                                       // 1544
  'use strict';                                                                                                       // 1545
                                                                                                                      // 1546
  // SCROLLSPY CLASS DEFINITION                                                                                       // 1547
  // ==========================                                                                                       // 1548
                                                                                                                      // 1549
  function ScrollSpy(element, options) {                                                                              // 1550
    var href                                                                                                          // 1551
    var process  = $.proxy(this.process, this)                                                                        // 1552
                                                                                                                      // 1553
    this.$element       = $(element).is('body') ? $(window) : $(element)                                              // 1554
    this.$body          = $('body')                                                                                   // 1555
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)                                  // 1556
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)                                                   // 1557
    this.selector       = (this.options.target                                                                        // 1558
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7                     // 1559
      || '') + ' .nav li > a'                                                                                         // 1560
    this.offsets        = $([])                                                                                       // 1561
    this.targets        = $([])                                                                                       // 1562
    this.activeTarget   = null                                                                                        // 1563
                                                                                                                      // 1564
    this.refresh()                                                                                                    // 1565
    this.process()                                                                                                    // 1566
  }                                                                                                                   // 1567
                                                                                                                      // 1568
  ScrollSpy.DEFAULTS = {                                                                                              // 1569
    offset: 10                                                                                                        // 1570
  }                                                                                                                   // 1571
                                                                                                                      // 1572
  ScrollSpy.prototype.refresh = function () {                                                                         // 1573
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'                                             // 1574
                                                                                                                      // 1575
    this.offsets = $([])                                                                                              // 1576
    this.targets = $([])                                                                                              // 1577
                                                                                                                      // 1578
    var self     = this                                                                                               // 1579
    var $targets = this.$body                                                                                         // 1580
      .find(this.selector)                                                                                            // 1581
      .map(function () {                                                                                              // 1582
        var $el   = $(this)                                                                                           // 1583
        var href  = $el.data('target') || $el.attr('href')                                                            // 1584
        var $href = /^#./.test(href) && $(href)                                                                       // 1585
                                                                                                                      // 1586
        return ($href                                                                                                 // 1587
          && $href.length                                                                                             // 1588
          && $href.is(':visible')                                                                                     // 1589
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })                                                                                                              // 1591
      .sort(function (a, b) { return a[0] - b[0] })                                                                   // 1592
      .each(function () {                                                                                             // 1593
        self.offsets.push(this[0])                                                                                    // 1594
        self.targets.push(this[1])                                                                                    // 1595
      })                                                                                                              // 1596
  }                                                                                                                   // 1597
                                                                                                                      // 1598
  ScrollSpy.prototype.process = function () {                                                                         // 1599
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset                                          // 1600
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight                              // 1601
    var maxScroll    = scrollHeight - this.$scrollElement.height()                                                    // 1602
    var offsets      = this.offsets                                                                                   // 1603
    var targets      = this.targets                                                                                   // 1604
    var activeTarget = this.activeTarget                                                                              // 1605
    var i                                                                                                             // 1606
                                                                                                                      // 1607
    if (scrollTop >= maxScroll) {                                                                                     // 1608
      return activeTarget != (i = targets.last()[0]) && this.activate(i)                                              // 1609
    }                                                                                                                 // 1610
                                                                                                                      // 1611
    if (activeTarget && scrollTop <= offsets[0]) {                                                                    // 1612
      return activeTarget != (i = targets[0]) && this.activate(i)                                                     // 1613
    }                                                                                                                 // 1614
                                                                                                                      // 1615
    for (i = offsets.length; i--;) {                                                                                  // 1616
      activeTarget != targets[i]                                                                                      // 1617
        && scrollTop >= offsets[i]                                                                                    // 1618
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])                                                           // 1619
        && this.activate( targets[i] )                                                                                // 1620
    }                                                                                                                 // 1621
  }                                                                                                                   // 1622
                                                                                                                      // 1623
  ScrollSpy.prototype.activate = function (target) {                                                                  // 1624
    this.activeTarget = target                                                                                        // 1625
                                                                                                                      // 1626
    $(this.selector)                                                                                                  // 1627
      .parentsUntil(this.options.target, '.active')                                                                   // 1628
      .removeClass('active')                                                                                          // 1629
                                                                                                                      // 1630
    var selector = this.selector +                                                                                    // 1631
        '[data-target="' + target + '"],' +                                                                           // 1632
        this.selector + '[href="' + target + '"]'                                                                     // 1633
                                                                                                                      // 1634
    var active = $(selector)                                                                                          // 1635
      .parents('li')                                                                                                  // 1636
      .addClass('active')                                                                                             // 1637
                                                                                                                      // 1638
    if (active.parent('.dropdown-menu').length) {                                                                     // 1639
      active = active                                                                                                 // 1640
        .closest('li.dropdown')                                                                                       // 1641
        .addClass('active')                                                                                           // 1642
    }                                                                                                                 // 1643
                                                                                                                      // 1644
    active.trigger('activate.bs.scrollspy')                                                                           // 1645
  }                                                                                                                   // 1646
                                                                                                                      // 1647
                                                                                                                      // 1648
  // SCROLLSPY PLUGIN DEFINITION                                                                                      // 1649
  // ===========================                                                                                      // 1650
                                                                                                                      // 1651
  var old = $.fn.scrollspy                                                                                            // 1652
                                                                                                                      // 1653
  $.fn.scrollspy = function (option) {                                                                                // 1654
    return this.each(function () {                                                                                    // 1655
      var $this   = $(this)                                                                                           // 1656
      var data    = $this.data('bs.scrollspy')                                                                        // 1657
      var options = typeof option == 'object' && option                                                               // 1658
                                                                                                                      // 1659
      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))                                    // 1660
      if (typeof option == 'string') data[option]()                                                                   // 1661
    })                                                                                                                // 1662
  }                                                                                                                   // 1663
                                                                                                                      // 1664
  $.fn.scrollspy.Constructor = ScrollSpy                                                                              // 1665
                                                                                                                      // 1666
                                                                                                                      // 1667
  // SCROLLSPY NO CONFLICT                                                                                            // 1668
  // =====================                                                                                            // 1669
                                                                                                                      // 1670
  $.fn.scrollspy.noConflict = function () {                                                                           // 1671
    $.fn.scrollspy = old                                                                                              // 1672
    return this                                                                                                       // 1673
  }                                                                                                                   // 1674
                                                                                                                      // 1675
                                                                                                                      // 1676
  // SCROLLSPY DATA-API                                                                                               // 1677
  // ==================                                                                                               // 1678
                                                                                                                      // 1679
  $(window).on('load', function () {                                                                                  // 1680
    $('[data-spy="scroll"]').each(function () {                                                                       // 1681
      var $spy = $(this)                                                                                              // 1682
      $spy.scrollspy($spy.data())                                                                                     // 1683
    })                                                                                                                // 1684
  })                                                                                                                  // 1685
                                                                                                                      // 1686
}(jQuery);                                                                                                            // 1687
                                                                                                                      // 1688
/* ========================================================================                                           // 1689
 * Bootstrap: tab.js v3.1.0                                                                                           // 1690
 * http://getbootstrap.com/javascript/#tabs                                                                           // 1691
 * ========================================================================                                           // 1692
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 1693
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 1694
 * ======================================================================== */                                        // 1695
                                                                                                                      // 1696
                                                                                                                      // 1697
+function ($) {                                                                                                       // 1698
  'use strict';                                                                                                       // 1699
                                                                                                                      // 1700
  // TAB CLASS DEFINITION                                                                                             // 1701
  // ====================                                                                                             // 1702
                                                                                                                      // 1703
  var Tab = function (element) {                                                                                      // 1704
    this.element = $(element)                                                                                         // 1705
  }                                                                                                                   // 1706
                                                                                                                      // 1707
  Tab.prototype.show = function () {                                                                                  // 1708
    var $this    = this.element                                                                                       // 1709
    var $ul      = $this.closest('ul:not(.dropdown-menu)')                                                            // 1710
    var selector = $this.data('target')                                                                               // 1711
                                                                                                                      // 1712
    if (!selector) {                                                                                                  // 1713
      selector = $this.attr('href')                                                                                   // 1714
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7                                   // 1715
    }                                                                                                                 // 1716
                                                                                                                      // 1717
    if ($this.parent('li').hasClass('active')) return                                                                 // 1718
                                                                                                                      // 1719
    var previous = $ul.find('.active:last a')[0]                                                                      // 1720
    var e        = $.Event('show.bs.tab', {                                                                           // 1721
      relatedTarget: previous                                                                                         // 1722
    })                                                                                                                // 1723
                                                                                                                      // 1724
    $this.trigger(e)                                                                                                  // 1725
                                                                                                                      // 1726
    if (e.isDefaultPrevented()) return                                                                                // 1727
                                                                                                                      // 1728
    var $target = $(selector)                                                                                         // 1729
                                                                                                                      // 1730
    this.activate($this.parent('li'), $ul)                                                                            // 1731
    this.activate($target, $target.parent(), function () {                                                            // 1732
      $this.trigger({                                                                                                 // 1733
        type: 'shown.bs.tab',                                                                                         // 1734
        relatedTarget: previous                                                                                       // 1735
      })                                                                                                              // 1736
    })                                                                                                                // 1737
  }                                                                                                                   // 1738
                                                                                                                      // 1739
  Tab.prototype.activate = function (element, container, callback) {                                                  // 1740
    var $active    = container.find('> .active')                                                                      // 1741
    var transition = callback                                                                                         // 1742
      && $.support.transition                                                                                         // 1743
      && $active.hasClass('fade')                                                                                     // 1744
                                                                                                                      // 1745
    function next() {                                                                                                 // 1746
      $active                                                                                                         // 1747
        .removeClass('active')                                                                                        // 1748
        .find('> .dropdown-menu > .active')                                                                           // 1749
        .removeClass('active')                                                                                        // 1750
                                                                                                                      // 1751
      element.addClass('active')                                                                                      // 1752
                                                                                                                      // 1753
      if (transition) {                                                                                               // 1754
        element[0].offsetWidth // reflow for transition                                                               // 1755
        element.addClass('in')                                                                                        // 1756
      } else {                                                                                                        // 1757
        element.removeClass('fade')                                                                                   // 1758
      }                                                                                                               // 1759
                                                                                                                      // 1760
      if (element.parent('.dropdown-menu')) {                                                                         // 1761
        element.closest('li.dropdown').addClass('active')                                                             // 1762
      }                                                                                                               // 1763
                                                                                                                      // 1764
      callback && callback()                                                                                          // 1765
    }                                                                                                                 // 1766
                                                                                                                      // 1767
    transition ?                                                                                                      // 1768
      $active                                                                                                         // 1769
        .one($.support.transition.end, next)                                                                          // 1770
        .emulateTransitionEnd(150) :                                                                                  // 1771
      next()                                                                                                          // 1772
                                                                                                                      // 1773
    $active.removeClass('in')                                                                                         // 1774
  }                                                                                                                   // 1775
                                                                                                                      // 1776
                                                                                                                      // 1777
  // TAB PLUGIN DEFINITION                                                                                            // 1778
  // =====================                                                                                            // 1779
                                                                                                                      // 1780
  var old = $.fn.tab                                                                                                  // 1781
                                                                                                                      // 1782
  $.fn.tab = function ( option ) {                                                                                    // 1783
    return this.each(function () {                                                                                    // 1784
      var $this = $(this)                                                                                             // 1785
      var data  = $this.data('bs.tab')                                                                                // 1786
                                                                                                                      // 1787
      if (!data) $this.data('bs.tab', (data = new Tab(this)))                                                         // 1788
      if (typeof option == 'string') data[option]()                                                                   // 1789
    })                                                                                                                // 1790
  }                                                                                                                   // 1791
                                                                                                                      // 1792
  $.fn.tab.Constructor = Tab                                                                                          // 1793
                                                                                                                      // 1794
                                                                                                                      // 1795
  // TAB NO CONFLICT                                                                                                  // 1796
  // ===============                                                                                                  // 1797
                                                                                                                      // 1798
  $.fn.tab.noConflict = function () {                                                                                 // 1799
    $.fn.tab = old                                                                                                    // 1800
    return this                                                                                                       // 1801
  }                                                                                                                   // 1802
                                                                                                                      // 1803
                                                                                                                      // 1804
  // TAB DATA-API                                                                                                     // 1805
  // ============                                                                                                     // 1806
                                                                                                                      // 1807
  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {                 // 1808
    e.preventDefault()                                                                                                // 1809
    $(this).tab('show')                                                                                               // 1810
  })                                                                                                                  // 1811
                                                                                                                      // 1812
}(jQuery);                                                                                                            // 1813
                                                                                                                      // 1814
/* ========================================================================                                           // 1815
 * Bootstrap: affix.js v3.1.0                                                                                         // 1816
 * http://getbootstrap.com/javascript/#affix                                                                          // 1817
 * ========================================================================                                           // 1818
 * Copyright 2011-2014 Twitter, Inc.                                                                                  // 1819
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                         // 1820
 * ======================================================================== */                                        // 1821
                                                                                                                      // 1822
                                                                                                                      // 1823
+function ($) {                                                                                                       // 1824
  'use strict';                                                                                                       // 1825
                                                                                                                      // 1826
  // AFFIX CLASS DEFINITION                                                                                           // 1827
  // ======================                                                                                           // 1828
                                                                                                                      // 1829
  var Affix = function (element, options) {                                                                           // 1830
    this.options = $.extend({}, Affix.DEFAULTS, options)                                                              // 1831
    this.$window = $(window)                                                                                          // 1832
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))                                              // 1833
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))                                 // 1834
                                                                                                                      // 1835
    this.$element     = $(element)                                                                                    // 1836
    this.affixed      =                                                                                               // 1837
    this.unpin        =                                                                                               // 1838
    this.pinnedOffset = null                                                                                          // 1839
                                                                                                                      // 1840
    this.checkPosition()                                                                                              // 1841
  }                                                                                                                   // 1842
                                                                                                                      // 1843
  Affix.RESET = 'affix affix-top affix-bottom'                                                                        // 1844
                                                                                                                      // 1845
  Affix.DEFAULTS = {                                                                                                  // 1846
    offset: 0                                                                                                         // 1847
  }                                                                                                                   // 1848
                                                                                                                      // 1849
  Affix.prototype.getPinnedOffset = function () {                                                                     // 1850
    if (this.pinnedOffset) return this.pinnedOffset                                                                   // 1851
    this.$element.removeClass(Affix.RESET).addClass('affix')                                                          // 1852
    var scrollTop = this.$window.scrollTop()                                                                          // 1853
    var position  = this.$element.offset()                                                                            // 1854
    return (this.pinnedOffset = position.top - scrollTop)                                                             // 1855
  }                                                                                                                   // 1856
                                                                                                                      // 1857
  Affix.prototype.checkPositionWithEventLoop = function () {                                                          // 1858
    setTimeout($.proxy(this.checkPosition, this), 1)                                                                  // 1859
  }                                                                                                                   // 1860
                                                                                                                      // 1861
  Affix.prototype.checkPosition = function () {                                                                       // 1862
    if (!this.$element.is(':visible')) return                                                                         // 1863
                                                                                                                      // 1864
    var scrollHeight = $(document).height()                                                                           // 1865
    var scrollTop    = this.$window.scrollTop()                                                                       // 1866
    var position     = this.$element.offset()                                                                         // 1867
    var offset       = this.options.offset                                                                            // 1868
    var offsetTop    = offset.top                                                                                     // 1869
    var offsetBottom = offset.bottom                                                                                  // 1870
                                                                                                                      // 1871
    if (this.affixed == 'top') position.top += scrollTop                                                              // 1872
                                                                                                                      // 1873
    if (typeof offset != 'object')         offsetBottom = offsetTop = offset                                          // 1874
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)                                   // 1875
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)                                // 1876
                                                                                                                      // 1877
    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :                            // 1878
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false                                      // 1880
                                                                                                                      // 1881
    if (this.affixed === affix) return                                                                                // 1882
    if (this.unpin) this.$element.css('top', '')                                                                      // 1883
                                                                                                                      // 1884
    var affixType = 'affix' + (affix ? '-' + affix : '')                                                              // 1885
    var e         = $.Event(affixType + '.bs.affix')                                                                  // 1886
                                                                                                                      // 1887
    this.$element.trigger(e)                                                                                          // 1888
                                                                                                                      // 1889
    if (e.isDefaultPrevented()) return                                                                                // 1890
                                                                                                                      // 1891
    this.affixed = affix                                                                                              // 1892
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null                                                    // 1893
                                                                                                                      // 1894
    this.$element                                                                                                     // 1895
      .removeClass(Affix.RESET)                                                                                       // 1896
      .addClass(affixType)                                                                                            // 1897
      .trigger($.Event(affixType.replace('affix', 'affixed')))                                                        // 1898
                                                                                                                      // 1899
    if (affix == 'bottom') {                                                                                          // 1900
      this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })                             // 1901
    }                                                                                                                 // 1902
  }                                                                                                                   // 1903
                                                                                                                      // 1904
                                                                                                                      // 1905
  // AFFIX PLUGIN DEFINITION                                                                                          // 1906
  // =======================                                                                                          // 1907
                                                                                                                      // 1908
  var old = $.fn.affix                                                                                                // 1909
                                                                                                                      // 1910
  $.fn.affix = function (option) {                                                                                    // 1911
    return this.each(function () {                                                                                    // 1912
      var $this   = $(this)                                                                                           // 1913
      var data    = $this.data('bs.affix')                                                                            // 1914
      var options = typeof option == 'object' && option                                                               // 1915
                                                                                                                      // 1916
      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))                                            // 1917
      if (typeof option == 'string') data[option]()                                                                   // 1918
    })                                                                                                                // 1919
  }                                                                                                                   // 1920
                                                                                                                      // 1921
  $.fn.affix.Constructor = Affix                                                                                      // 1922
                                                                                                                      // 1923
                                                                                                                      // 1924
  // AFFIX NO CONFLICT                                                                                                // 1925
  // =================                                                                                                // 1926
                                                                                                                      // 1927
  $.fn.affix.noConflict = function () {                                                                               // 1928
    $.fn.affix = old                                                                                                  // 1929
    return this                                                                                                       // 1930
  }                                                                                                                   // 1931
                                                                                                                      // 1932
                                                                                                                      // 1933
  // AFFIX DATA-API                                                                                                   // 1934
  // ==============                                                                                                   // 1935
                                                                                                                      // 1936
  $(window).on('load', function () {                                                                                  // 1937
    $('[data-spy="affix"]').each(function () {                                                                        // 1938
      var $spy = $(this)                                                                                              // 1939
      var data = $spy.data()                                                                                          // 1940
                                                                                                                      // 1941
      data.offset = data.offset || {}                                                                                 // 1942
                                                                                                                      // 1943
      if (data.offsetBottom) data.offset.bottom = data.offsetBottom                                                   // 1944
      if (data.offsetTop)    data.offset.top    = data.offsetTop                                                      // 1945
                                                                                                                      // 1946
      $spy.affix(data)                                                                                                // 1947
    })                                                                                                                // 1948
  })                                                                                                                  // 1949
                                                                                                                      // 1950
}(jQuery);                                                                                                            // 1951
                                                                                                                      // 1952
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['bootstrap-3'] = {};

})();

//# sourceMappingURL=6bee655b2d7325a1b4b6164f9c4c16a6d980284f.map
