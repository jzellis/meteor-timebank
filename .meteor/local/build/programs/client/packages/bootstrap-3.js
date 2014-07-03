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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/bootstrap-3/bootstrap-3/js/bootstrap.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*!                                                                                                                    // 1
 * Bootstrap v3.2.0 (http://getbootstrap.com)                                                                          // 2
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 3
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 4
 */                                                                                                                    // 5
                                                                                                                       // 6
if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }                      // 7
                                                                                                                       // 8
/* ========================================================================                                            // 9
 * Bootstrap: transition.js v3.2.0                                                                                     // 10
 * http://getbootstrap.com/javascript/#transitions                                                                     // 11
 * ========================================================================                                            // 12
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 13
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 14
 * ======================================================================== */                                         // 15
                                                                                                                       // 16
                                                                                                                       // 17
+function ($) {                                                                                                        // 18
  'use strict';                                                                                                        // 19
                                                                                                                       // 20
  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)                                                      // 21
  // ============================================================                                                      // 22
                                                                                                                       // 23
  function transitionEnd() {                                                                                           // 24
    var el = document.createElement('bootstrap')                                                                       // 25
                                                                                                                       // 26
    var transEndEventNames = {                                                                                         // 27
      WebkitTransition : 'webkitTransitionEnd',                                                                        // 28
      MozTransition    : 'transitionend',                                                                              // 29
      OTransition      : 'oTransitionEnd otransitionend',                                                              // 30
      transition       : 'transitionend'                                                                               // 31
    }                                                                                                                  // 32
                                                                                                                       // 33
    for (var name in transEndEventNames) {                                                                             // 34
      if (el.style[name] !== undefined) {                                                                              // 35
        return { end: transEndEventNames[name] }                                                                       // 36
      }                                                                                                                // 37
    }                                                                                                                  // 38
                                                                                                                       // 39
    return false // explicit for ie8 (  ._.)                                                                           // 40
  }                                                                                                                    // 41
                                                                                                                       // 42
  // http://blog.alexmaccaw.com/css-transitions                                                                        // 43
  $.fn.emulateTransitionEnd = function (duration) {                                                                    // 44
    var called = false                                                                                                 // 45
    var $el = this                                                                                                     // 46
    $(this).one('bsTransitionEnd', function () { called = true })                                                      // 47
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }                               // 48
    setTimeout(callback, duration)                                                                                     // 49
    return this                                                                                                        // 50
  }                                                                                                                    // 51
                                                                                                                       // 52
  $(function () {                                                                                                      // 53
    $.support.transition = transitionEnd()                                                                             // 54
                                                                                                                       // 55
    if (!$.support.transition) return                                                                                  // 56
                                                                                                                       // 57
    $.event.special.bsTransitionEnd = {                                                                                // 58
      bindType: $.support.transition.end,                                                                              // 59
      delegateType: $.support.transition.end,                                                                          // 60
      handle: function (e) {                                                                                           // 61
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)                                    // 62
      }                                                                                                                // 63
    }                                                                                                                  // 64
  })                                                                                                                   // 65
                                                                                                                       // 66
}(jQuery);                                                                                                             // 67
                                                                                                                       // 68
/* ========================================================================                                            // 69
 * Bootstrap: alert.js v3.2.0                                                                                          // 70
 * http://getbootstrap.com/javascript/#alerts                                                                          // 71
 * ========================================================================                                            // 72
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 73
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 74
 * ======================================================================== */                                         // 75
                                                                                                                       // 76
                                                                                                                       // 77
+function ($) {                                                                                                        // 78
  'use strict';                                                                                                        // 79
                                                                                                                       // 80
  // ALERT CLASS DEFINITION                                                                                            // 81
  // ======================                                                                                            // 82
                                                                                                                       // 83
  var dismiss = '[data-dismiss="alert"]'                                                                               // 84
  var Alert   = function (el) {                                                                                        // 85
    $(el).on('click', dismiss, this.close)                                                                             // 86
  }                                                                                                                    // 87
                                                                                                                       // 88
  Alert.VERSION = '3.2.0'                                                                                              // 89
                                                                                                                       // 90
  Alert.prototype.close = function (e) {                                                                               // 91
    var $this    = $(this)                                                                                             // 92
    var selector = $this.attr('data-target')                                                                           // 93
                                                                                                                       // 94
    if (!selector) {                                                                                                   // 95
      selector = $this.attr('href')                                                                                    // 96
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7                                   // 97
    }                                                                                                                  // 98
                                                                                                                       // 99
    var $parent = $(selector)                                                                                          // 100
                                                                                                                       // 101
    if (e) e.preventDefault()                                                                                          // 102
                                                                                                                       // 103
    if (!$parent.length) {                                                                                             // 104
      $parent = $this.hasClass('alert') ? $this : $this.parent()                                                       // 105
    }                                                                                                                  // 106
                                                                                                                       // 107
    $parent.trigger(e = $.Event('close.bs.alert'))                                                                     // 108
                                                                                                                       // 109
    if (e.isDefaultPrevented()) return                                                                                 // 110
                                                                                                                       // 111
    $parent.removeClass('in')                                                                                          // 112
                                                                                                                       // 113
    function removeElement() {                                                                                         // 114
      // detach from parent, fire event then clean up data                                                             // 115
      $parent.detach().trigger('closed.bs.alert').remove()                                                             // 116
    }                                                                                                                  // 117
                                                                                                                       // 118
    $.support.transition && $parent.hasClass('fade') ?                                                                 // 119
      $parent                                                                                                          // 120
        .one('bsTransitionEnd', removeElement)                                                                         // 121
        .emulateTransitionEnd(150) :                                                                                   // 122
      removeElement()                                                                                                  // 123
  }                                                                                                                    // 124
                                                                                                                       // 125
                                                                                                                       // 126
  // ALERT PLUGIN DEFINITION                                                                                           // 127
  // =======================                                                                                           // 128
                                                                                                                       // 129
  function Plugin(option) {                                                                                            // 130
    return this.each(function () {                                                                                     // 131
      var $this = $(this)                                                                                              // 132
      var data  = $this.data('bs.alert')                                                                               // 133
                                                                                                                       // 134
      if (!data) $this.data('bs.alert', (data = new Alert(this)))                                                      // 135
      if (typeof option == 'string') data[option].call($this)                                                          // 136
    })                                                                                                                 // 137
  }                                                                                                                    // 138
                                                                                                                       // 139
  var old = $.fn.alert                                                                                                 // 140
                                                                                                                       // 141
  $.fn.alert             = Plugin                                                                                      // 142
  $.fn.alert.Constructor = Alert                                                                                       // 143
                                                                                                                       // 144
                                                                                                                       // 145
  // ALERT NO CONFLICT                                                                                                 // 146
  // =================                                                                                                 // 147
                                                                                                                       // 148
  $.fn.alert.noConflict = function () {                                                                                // 149
    $.fn.alert = old                                                                                                   // 150
    return this                                                                                                        // 151
  }                                                                                                                    // 152
                                                                                                                       // 153
                                                                                                                       // 154
  // ALERT DATA-API                                                                                                    // 155
  // ==============                                                                                                    // 156
                                                                                                                       // 157
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)                                            // 158
                                                                                                                       // 159
}(jQuery);                                                                                                             // 160
                                                                                                                       // 161
/* ========================================================================                                            // 162
 * Bootstrap: button.js v3.2.0                                                                                         // 163
 * http://getbootstrap.com/javascript/#buttons                                                                         // 164
 * ========================================================================                                            // 165
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 166
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 167
 * ======================================================================== */                                         // 168
                                                                                                                       // 169
                                                                                                                       // 170
+function ($) {                                                                                                        // 171
  'use strict';                                                                                                        // 172
                                                                                                                       // 173
  // BUTTON PUBLIC CLASS DEFINITION                                                                                    // 174
  // ==============================                                                                                    // 175
                                                                                                                       // 176
  var Button = function (element, options) {                                                                           // 177
    this.$element  = $(element)                                                                                        // 178
    this.options   = $.extend({}, Button.DEFAULTS, options)                                                            // 179
    this.isLoading = false                                                                                             // 180
  }                                                                                                                    // 181
                                                                                                                       // 182
  Button.VERSION  = '3.2.0'                                                                                            // 183
                                                                                                                       // 184
  Button.DEFAULTS = {                                                                                                  // 185
    loadingText: 'loading...'                                                                                          // 186
  }                                                                                                                    // 187
                                                                                                                       // 188
  Button.prototype.setState = function (state) {                                                                       // 189
    var d    = 'disabled'                                                                                              // 190
    var $el  = this.$element                                                                                           // 191
    var val  = $el.is('input') ? 'val' : 'html'                                                                        // 192
    var data = $el.data()                                                                                              // 193
                                                                                                                       // 194
    state = state + 'Text'                                                                                             // 195
                                                                                                                       // 196
    if (data.resetText == null) $el.data('resetText', $el[val]())                                                      // 197
                                                                                                                       // 198
    $el[val](data[state] == null ? this.options[state] : data[state])                                                  // 199
                                                                                                                       // 200
    // push to event loop to allow forms to submit                                                                     // 201
    setTimeout($.proxy(function () {                                                                                   // 202
      if (state == 'loadingText') {                                                                                    // 203
        this.isLoading = true                                                                                          // 204
        $el.addClass(d).attr(d, d)                                                                                     // 205
      } else if (this.isLoading) {                                                                                     // 206
        this.isLoading = false                                                                                         // 207
        $el.removeClass(d).removeAttr(d)                                                                               // 208
      }                                                                                                                // 209
    }, this), 0)                                                                                                       // 210
  }                                                                                                                    // 211
                                                                                                                       // 212
  Button.prototype.toggle = function () {                                                                              // 213
    var changed = true                                                                                                 // 214
    var $parent = this.$element.closest('[data-toggle="buttons"]')                                                     // 215
                                                                                                                       // 216
    if ($parent.length) {                                                                                              // 217
      var $input = this.$element.find('input')                                                                         // 218
      if ($input.prop('type') == 'radio') {                                                                            // 219
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false                                // 220
        else $parent.find('.active').removeClass('active')                                                             // 221
      }                                                                                                                // 222
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')                         // 223
    }                                                                                                                  // 224
                                                                                                                       // 225
    if (changed) this.$element.toggleClass('active')                                                                   // 226
  }                                                                                                                    // 227
                                                                                                                       // 228
                                                                                                                       // 229
  // BUTTON PLUGIN DEFINITION                                                                                          // 230
  // ========================                                                                                          // 231
                                                                                                                       // 232
  function Plugin(option) {                                                                                            // 233
    return this.each(function () {                                                                                     // 234
      var $this   = $(this)                                                                                            // 235
      var data    = $this.data('bs.button')                                                                            // 236
      var options = typeof option == 'object' && option                                                                // 237
                                                                                                                       // 238
      if (!data) $this.data('bs.button', (data = new Button(this, options)))                                           // 239
                                                                                                                       // 240
      if (option == 'toggle') data.toggle()                                                                            // 241
      else if (option) data.setState(option)                                                                           // 242
    })                                                                                                                 // 243
  }                                                                                                                    // 244
                                                                                                                       // 245
  var old = $.fn.button                                                                                                // 246
                                                                                                                       // 247
  $.fn.button             = Plugin                                                                                     // 248
  $.fn.button.Constructor = Button                                                                                     // 249
                                                                                                                       // 250
                                                                                                                       // 251
  // BUTTON NO CONFLICT                                                                                                // 252
  // ==================                                                                                                // 253
                                                                                                                       // 254
  $.fn.button.noConflict = function () {                                                                               // 255
    $.fn.button = old                                                                                                  // 256
    return this                                                                                                        // 257
  }                                                                                                                    // 258
                                                                                                                       // 259
                                                                                                                       // 260
  // BUTTON DATA-API                                                                                                   // 261
  // ===============                                                                                                   // 262
                                                                                                                       // 263
  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {                                 // 264
    var $btn = $(e.target)                                                                                             // 265
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')                                                             // 266
    Plugin.call($btn, 'toggle')                                                                                        // 267
    e.preventDefault()                                                                                                 // 268
  })                                                                                                                   // 269
                                                                                                                       // 270
}(jQuery);                                                                                                             // 271
                                                                                                                       // 272
/* ========================================================================                                            // 273
 * Bootstrap: carousel.js v3.2.0                                                                                       // 274
 * http://getbootstrap.com/javascript/#carousel                                                                        // 275
 * ========================================================================                                            // 276
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 277
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 278
 * ======================================================================== */                                         // 279
                                                                                                                       // 280
                                                                                                                       // 281
+function ($) {                                                                                                        // 282
  'use strict';                                                                                                        // 283
                                                                                                                       // 284
  // CAROUSEL CLASS DEFINITION                                                                                         // 285
  // =========================                                                                                         // 286
                                                                                                                       // 287
  var Carousel = function (element, options) {                                                                         // 288
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))                               // 289
    this.$indicators = this.$element.find('.carousel-indicators')                                                      // 290
    this.options     = options                                                                                         // 291
    this.paused      =                                                                                                 // 292
    this.sliding     =                                                                                                 // 293
    this.interval    =                                                                                                 // 294
    this.$active     =                                                                                                 // 295
    this.$items      = null                                                                                            // 296
                                                                                                                       // 297
    this.options.pause == 'hover' && this.$element                                                                     // 298
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))                                                         // 299
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))                                                         // 300
  }                                                                                                                    // 301
                                                                                                                       // 302
  Carousel.VERSION  = '3.2.0'                                                                                          // 303
                                                                                                                       // 304
  Carousel.DEFAULTS = {                                                                                                // 305
    interval: 5000,                                                                                                    // 306
    pause: 'hover',                                                                                                    // 307
    wrap: true                                                                                                         // 308
  }                                                                                                                    // 309
                                                                                                                       // 310
  Carousel.prototype.keydown = function (e) {                                                                          // 311
    switch (e.which) {                                                                                                 // 312
      case 37: this.prev(); break                                                                                      // 313
      case 39: this.next(); break                                                                                      // 314
      default: return                                                                                                  // 315
    }                                                                                                                  // 316
                                                                                                                       // 317
    e.preventDefault()                                                                                                 // 318
  }                                                                                                                    // 319
                                                                                                                       // 320
  Carousel.prototype.cycle = function (e) {                                                                            // 321
    e || (this.paused = false)                                                                                         // 322
                                                                                                                       // 323
    this.interval && clearInterval(this.interval)                                                                      // 324
                                                                                                                       // 325
    this.options.interval                                                                                              // 326
      && !this.paused                                                                                                  // 327
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))                                // 328
                                                                                                                       // 329
    return this                                                                                                        // 330
  }                                                                                                                    // 331
                                                                                                                       // 332
  Carousel.prototype.getItemIndex = function (item) {                                                                  // 333
    this.$items = item.parent().children('.item')                                                                      // 334
    return this.$items.index(item || this.$active)                                                                     // 335
  }                                                                                                                    // 336
                                                                                                                       // 337
  Carousel.prototype.to = function (pos) {                                                                             // 338
    var that        = this                                                                                             // 339
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))                             // 340
                                                                                                                       // 341
    if (pos > (this.$items.length - 1) || pos < 0) return                                                              // 342
                                                                                                                       // 343
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"  // 344
    if (activeIndex == pos) return this.pause().cycle()                                                                // 345
                                                                                                                       // 346
    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))                                        // 347
  }                                                                                                                    // 348
                                                                                                                       // 349
  Carousel.prototype.pause = function (e) {                                                                            // 350
    e || (this.paused = true)                                                                                          // 351
                                                                                                                       // 352
    if (this.$element.find('.next, .prev').length && $.support.transition) {                                           // 353
      this.$element.trigger($.support.transition.end)                                                                  // 354
      this.cycle(true)                                                                                                 // 355
    }                                                                                                                  // 356
                                                                                                                       // 357
    this.interval = clearInterval(this.interval)                                                                       // 358
                                                                                                                       // 359
    return this                                                                                                        // 360
  }                                                                                                                    // 361
                                                                                                                       // 362
  Carousel.prototype.next = function () {                                                                              // 363
    if (this.sliding) return                                                                                           // 364
    return this.slide('next')                                                                                          // 365
  }                                                                                                                    // 366
                                                                                                                       // 367
  Carousel.prototype.prev = function () {                                                                              // 368
    if (this.sliding) return                                                                                           // 369
    return this.slide('prev')                                                                                          // 370
  }                                                                                                                    // 371
                                                                                                                       // 372
  Carousel.prototype.slide = function (type, next) {                                                                   // 373
    var $active   = this.$element.find('.item.active')                                                                 // 374
    var $next     = next || $active[type]()                                                                            // 375
    var isCycling = this.interval                                                                                      // 376
    var direction = type == 'next' ? 'left' : 'right'                                                                  // 377
    var fallback  = type == 'next' ? 'first' : 'last'                                                                  // 378
    var that      = this                                                                                               // 379
                                                                                                                       // 380
    if (!$next.length) {                                                                                               // 381
      if (!this.options.wrap) return                                                                                   // 382
      $next = this.$element.find('.item')[fallback]()                                                                  // 383
    }                                                                                                                  // 384
                                                                                                                       // 385
    if ($next.hasClass('active')) return (this.sliding = false)                                                        // 386
                                                                                                                       // 387
    var relatedTarget = $next[0]                                                                                       // 388
    var slideEvent = $.Event('slide.bs.carousel', {                                                                    // 389
      relatedTarget: relatedTarget,                                                                                    // 390
      direction: direction                                                                                             // 391
    })                                                                                                                 // 392
    this.$element.trigger(slideEvent)                                                                                  // 393
    if (slideEvent.isDefaultPrevented()) return                                                                        // 394
                                                                                                                       // 395
    this.sliding = true                                                                                                // 396
                                                                                                                       // 397
    isCycling && this.pause()                                                                                          // 398
                                                                                                                       // 399
    if (this.$indicators.length) {                                                                                     // 400
      this.$indicators.find('.active').removeClass('active')                                                           // 401
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])                                    // 402
      $nextIndicator && $nextIndicator.addClass('active')                                                              // 403
    }                                                                                                                  // 404
                                                                                                                       // 405
    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid" // 406
    if ($.support.transition && this.$element.hasClass('slide')) {                                                     // 407
      $next.addClass(type)                                                                                             // 408
      $next[0].offsetWidth // force reflow                                                                             // 409
      $active.addClass(direction)                                                                                      // 410
      $next.addClass(direction)                                                                                        // 411
      $active                                                                                                          // 412
        .one('bsTransitionEnd', function () {                                                                          // 413
          $next.removeClass([type, direction].join(' ')).addClass('active')                                            // 414
          $active.removeClass(['active', direction].join(' '))                                                         // 415
          that.sliding = false                                                                                         // 416
          setTimeout(function () {                                                                                     // 417
            that.$element.trigger(slidEvent)                                                                           // 418
          }, 0)                                                                                                        // 419
        })                                                                                                             // 420
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)                                  // 421
    } else {                                                                                                           // 422
      $active.removeClass('active')                                                                                    // 423
      $next.addClass('active')                                                                                         // 424
      this.sliding = false                                                                                             // 425
      this.$element.trigger(slidEvent)                                                                                 // 426
    }                                                                                                                  // 427
                                                                                                                       // 428
    isCycling && this.cycle()                                                                                          // 429
                                                                                                                       // 430
    return this                                                                                                        // 431
  }                                                                                                                    // 432
                                                                                                                       // 433
                                                                                                                       // 434
  // CAROUSEL PLUGIN DEFINITION                                                                                        // 435
  // ==========================                                                                                        // 436
                                                                                                                       // 437
  function Plugin(option) {                                                                                            // 438
    return this.each(function () {                                                                                     // 439
      var $this   = $(this)                                                                                            // 440
      var data    = $this.data('bs.carousel')                                                                          // 441
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)                 // 442
      var action  = typeof option == 'string' ? option : options.slide                                                 // 443
                                                                                                                       // 444
      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))                                       // 445
      if (typeof option == 'number') data.to(option)                                                                   // 446
      else if (action) data[action]()                                                                                  // 447
      else if (options.interval) data.pause().cycle()                                                                  // 448
    })                                                                                                                 // 449
  }                                                                                                                    // 450
                                                                                                                       // 451
  var old = $.fn.carousel                                                                                              // 452
                                                                                                                       // 453
  $.fn.carousel             = Plugin                                                                                   // 454
  $.fn.carousel.Constructor = Carousel                                                                                 // 455
                                                                                                                       // 456
                                                                                                                       // 457
  // CAROUSEL NO CONFLICT                                                                                              // 458
  // ====================                                                                                              // 459
                                                                                                                       // 460
  $.fn.carousel.noConflict = function () {                                                                             // 461
    $.fn.carousel = old                                                                                                // 462
    return this                                                                                                        // 463
  }                                                                                                                    // 464
                                                                                                                       // 465
                                                                                                                       // 466
  // CAROUSEL DATA-API                                                                                                 // 467
  // =================                                                                                                 // 468
                                                                                                                       // 469
  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {                         // 470
    var href                                                                                                           // 471
    var $this   = $(this)                                                                                              // 472
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return                                                                          // 474
    var options = $.extend({}, $target.data(), $this.data())                                                           // 475
    var slideIndex = $this.attr('data-slide-to')                                                                       // 476
    if (slideIndex) options.interval = false                                                                           // 477
                                                                                                                       // 478
    Plugin.call($target, options)                                                                                      // 479
                                                                                                                       // 480
    if (slideIndex) {                                                                                                  // 481
      $target.data('bs.carousel').to(slideIndex)                                                                       // 482
    }                                                                                                                  // 483
                                                                                                                       // 484
    e.preventDefault()                                                                                                 // 485
  })                                                                                                                   // 486
                                                                                                                       // 487
  $(window).on('load', function () {                                                                                   // 488
    $('[data-ride="carousel"]').each(function () {                                                                     // 489
      var $carousel = $(this)                                                                                          // 490
      Plugin.call($carousel, $carousel.data())                                                                         // 491
    })                                                                                                                 // 492
  })                                                                                                                   // 493
                                                                                                                       // 494
}(jQuery);                                                                                                             // 495
                                                                                                                       // 496
/* ========================================================================                                            // 497
 * Bootstrap: collapse.js v3.2.0                                                                                       // 498
 * http://getbootstrap.com/javascript/#collapse                                                                        // 499
 * ========================================================================                                            // 500
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 501
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 502
 * ======================================================================== */                                         // 503
                                                                                                                       // 504
                                                                                                                       // 505
+function ($) {                                                                                                        // 506
  'use strict';                                                                                                        // 507
                                                                                                                       // 508
  // COLLAPSE PUBLIC CLASS DEFINITION                                                                                  // 509
  // ================================                                                                                  // 510
                                                                                                                       // 511
  var Collapse = function (element, options) {                                                                         // 512
    this.$element      = $(element)                                                                                    // 513
    this.options       = $.extend({}, Collapse.DEFAULTS, options)                                                      // 514
    this.transitioning = null                                                                                          // 515
                                                                                                                       // 516
    if (this.options.parent) this.$parent = $(this.options.parent)                                                     // 517
    if (this.options.toggle) this.toggle()                                                                             // 518
  }                                                                                                                    // 519
                                                                                                                       // 520
  Collapse.VERSION  = '3.2.0'                                                                                          // 521
                                                                                                                       // 522
  Collapse.DEFAULTS = {                                                                                                // 523
    toggle: true                                                                                                       // 524
  }                                                                                                                    // 525
                                                                                                                       // 526
  Collapse.prototype.dimension = function () {                                                                         // 527
    var hasWidth = this.$element.hasClass('width')                                                                     // 528
    return hasWidth ? 'width' : 'height'                                                                               // 529
  }                                                                                                                    // 530
                                                                                                                       // 531
  Collapse.prototype.show = function () {                                                                              // 532
    if (this.transitioning || this.$element.hasClass('in')) return                                                     // 533
                                                                                                                       // 534
    var startEvent = $.Event('show.bs.collapse')                                                                       // 535
    this.$element.trigger(startEvent)                                                                                  // 536
    if (startEvent.isDefaultPrevented()) return                                                                        // 537
                                                                                                                       // 538
    var actives = this.$parent && this.$parent.find('> .panel > .in')                                                  // 539
                                                                                                                       // 540
    if (actives && actives.length) {                                                                                   // 541
      var hasData = actives.data('bs.collapse')                                                                        // 542
      if (hasData && hasData.transitioning) return                                                                     // 543
      Plugin.call(actives, 'hide')                                                                                     // 544
      hasData || actives.data('bs.collapse', null)                                                                     // 545
    }                                                                                                                  // 546
                                                                                                                       // 547
    var dimension = this.dimension()                                                                                   // 548
                                                                                                                       // 549
    this.$element                                                                                                      // 550
      .removeClass('collapse')                                                                                         // 551
      .addClass('collapsing')[dimension](0)                                                                            // 552
                                                                                                                       // 553
    this.transitioning = 1                                                                                             // 554
                                                                                                                       // 555
    var complete = function () {                                                                                       // 556
      this.$element                                                                                                    // 557
        .removeClass('collapsing')                                                                                     // 558
        .addClass('collapse in')[dimension]('')                                                                        // 559
      this.transitioning = 0                                                                                           // 560
      this.$element                                                                                                    // 561
        .trigger('shown.bs.collapse')                                                                                  // 562
    }                                                                                                                  // 563
                                                                                                                       // 564
    if (!$.support.transition) return complete.call(this)                                                              // 565
                                                                                                                       // 566
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))                                                      // 567
                                                                                                                       // 568
    this.$element                                                                                                      // 569
      .one('bsTransitionEnd', $.proxy(complete, this))                                                                 // 570
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])                                              // 571
  }                                                                                                                    // 572
                                                                                                                       // 573
  Collapse.prototype.hide = function () {                                                                              // 574
    if (this.transitioning || !this.$element.hasClass('in')) return                                                    // 575
                                                                                                                       // 576
    var startEvent = $.Event('hide.bs.collapse')                                                                       // 577
    this.$element.trigger(startEvent)                                                                                  // 578
    if (startEvent.isDefaultPrevented()) return                                                                        // 579
                                                                                                                       // 580
    var dimension = this.dimension()                                                                                   // 581
                                                                                                                       // 582
    this.$element[dimension](this.$element[dimension]())[0].offsetHeight                                               // 583
                                                                                                                       // 584
    this.$element                                                                                                      // 585
      .addClass('collapsing')                                                                                          // 586
      .removeClass('collapse')                                                                                         // 587
      .removeClass('in')                                                                                               // 588
                                                                                                                       // 589
    this.transitioning = 1                                                                                             // 590
                                                                                                                       // 591
    var complete = function () {                                                                                       // 592
      this.transitioning = 0                                                                                           // 593
      this.$element                                                                                                    // 594
        .trigger('hidden.bs.collapse')                                                                                 // 595
        .removeClass('collapsing')                                                                                     // 596
        .addClass('collapse')                                                                                          // 597
    }                                                                                                                  // 598
                                                                                                                       // 599
    if (!$.support.transition) return complete.call(this)                                                              // 600
                                                                                                                       // 601
    this.$element                                                                                                      // 602
      [dimension](0)                                                                                                   // 603
      .one('bsTransitionEnd', $.proxy(complete, this))                                                                 // 604
      .emulateTransitionEnd(350)                                                                                       // 605
  }                                                                                                                    // 606
                                                                                                                       // 607
  Collapse.prototype.toggle = function () {                                                                            // 608
    this[this.$element.hasClass('in') ? 'hide' : 'show']()                                                             // 609
  }                                                                                                                    // 610
                                                                                                                       // 611
                                                                                                                       // 612
  // COLLAPSE PLUGIN DEFINITION                                                                                        // 613
  // ==========================                                                                                        // 614
                                                                                                                       // 615
  function Plugin(option) {                                                                                            // 616
    return this.each(function () {                                                                                     // 617
      var $this   = $(this)                                                                                            // 618
      var data    = $this.data('bs.collapse')                                                                          // 619
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)                 // 620
                                                                                                                       // 621
      if (!data && options.toggle && option == 'show') option = !option                                                // 622
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))                                       // 623
      if (typeof option == 'string') data[option]()                                                                    // 624
    })                                                                                                                 // 625
  }                                                                                                                    // 626
                                                                                                                       // 627
  var old = $.fn.collapse                                                                                              // 628
                                                                                                                       // 629
  $.fn.collapse             = Plugin                                                                                   // 630
  $.fn.collapse.Constructor = Collapse                                                                                 // 631
                                                                                                                       // 632
                                                                                                                       // 633
  // COLLAPSE NO CONFLICT                                                                                              // 634
  // ====================                                                                                              // 635
                                                                                                                       // 636
  $.fn.collapse.noConflict = function () {                                                                             // 637
    $.fn.collapse = old                                                                                                // 638
    return this                                                                                                        // 639
  }                                                                                                                    // 640
                                                                                                                       // 641
                                                                                                                       // 642
  // COLLAPSE DATA-API                                                                                                 // 643
  // =================                                                                                                 // 644
                                                                                                                       // 645
  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {                              // 646
    var href                                                                                                           // 647
    var $this   = $(this)                                                                                              // 648
    var target  = $this.attr('data-target')                                                                            // 649
        || e.preventDefault()                                                                                          // 650
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7                          // 651
    var $target = $(target)                                                                                            // 652
    var data    = $target.data('bs.collapse')                                                                          // 653
    var option  = data ? 'toggle' : $this.data()                                                                       // 654
    var parent  = $this.attr('data-parent')                                                                            // 655
    var $parent = parent && $(parent)                                                                                  // 656
                                                                                                                       // 657
    if (!data || !data.transitioning) {                                                                                // 658
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')                                          // 660
    }                                                                                                                  // 661
                                                                                                                       // 662
    Plugin.call($target, option)                                                                                       // 663
  })                                                                                                                   // 664
                                                                                                                       // 665
}(jQuery);                                                                                                             // 666
                                                                                                                       // 667
/* ========================================================================                                            // 668
 * Bootstrap: dropdown.js v3.2.0                                                                                       // 669
 * http://getbootstrap.com/javascript/#dropdowns                                                                       // 670
 * ========================================================================                                            // 671
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 672
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 673
 * ======================================================================== */                                         // 674
                                                                                                                       // 675
                                                                                                                       // 676
+function ($) {                                                                                                        // 677
  'use strict';                                                                                                        // 678
                                                                                                                       // 679
  // DROPDOWN CLASS DEFINITION                                                                                         // 680
  // =========================                                                                                         // 681
                                                                                                                       // 682
  var backdrop = '.dropdown-backdrop'                                                                                  // 683
  var toggle   = '[data-toggle="dropdown"]'                                                                            // 684
  var Dropdown = function (element) {                                                                                  // 685
    $(element).on('click.bs.dropdown', this.toggle)                                                                    // 686
  }                                                                                                                    // 687
                                                                                                                       // 688
  Dropdown.VERSION = '3.2.0'                                                                                           // 689
                                                                                                                       // 690
  Dropdown.prototype.toggle = function (e) {                                                                           // 691
    var $this = $(this)                                                                                                // 692
                                                                                                                       // 693
    if ($this.is('.disabled, :disabled')) return                                                                       // 694
                                                                                                                       // 695
    var $parent  = getParent($this)                                                                                    // 696
    var isActive = $parent.hasClass('open')                                                                            // 697
                                                                                                                       // 698
    clearMenus()                                                                                                       // 699
                                                                                                                       // 700
    if (!isActive) {                                                                                                   // 701
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {                      // 702
        // if mobile we use a backdrop because click events don't delegate                                             // 703
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)                             // 704
      }                                                                                                                // 705
                                                                                                                       // 706
      var relatedTarget = { relatedTarget: this }                                                                      // 707
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))                                                  // 708
                                                                                                                       // 709
      if (e.isDefaultPrevented()) return                                                                               // 710
                                                                                                                       // 711
      $this.trigger('focus')                                                                                           // 712
                                                                                                                       // 713
      $parent                                                                                                          // 714
        .toggleClass('open')                                                                                           // 715
        .trigger('shown.bs.dropdown', relatedTarget)                                                                   // 716
    }                                                                                                                  // 717
                                                                                                                       // 718
    return false                                                                                                       // 719
  }                                                                                                                    // 720
                                                                                                                       // 721
  Dropdown.prototype.keydown = function (e) {                                                                          // 722
    if (!/(38|40|27)/.test(e.keyCode)) return                                                                          // 723
                                                                                                                       // 724
    var $this = $(this)                                                                                                // 725
                                                                                                                       // 726
    e.preventDefault()                                                                                                 // 727
    e.stopPropagation()                                                                                                // 728
                                                                                                                       // 729
    if ($this.is('.disabled, :disabled')) return                                                                       // 730
                                                                                                                       // 731
    var $parent  = getParent($this)                                                                                    // 732
    var isActive = $parent.hasClass('open')                                                                            // 733
                                                                                                                       // 734
    if (!isActive || (isActive && e.keyCode == 27)) {                                                                  // 735
      if (e.which == 27) $parent.find(toggle).trigger('focus')                                                         // 736
      return $this.trigger('click')                                                                                    // 737
    }                                                                                                                  // 738
                                                                                                                       // 739
    var desc = ' li:not(.divider):visible a'                                                                           // 740
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)                                    // 741
                                                                                                                       // 742
    if (!$items.length) return                                                                                         // 743
                                                                                                                       // 744
    var index = $items.index($items.filter(':focus'))                                                                  // 745
                                                                                                                       // 746
    if (e.keyCode == 38 && index > 0)                 index--                        // up                             // 747
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down                           // 748
    if (!~index)                                      index = 0                                                        // 749
                                                                                                                       // 750
    $items.eq(index).trigger('focus')                                                                                  // 751
  }                                                                                                                    // 752
                                                                                                                       // 753
  function clearMenus(e) {                                                                                             // 754
    if (e && e.which === 3) return                                                                                     // 755
    $(backdrop).remove()                                                                                               // 756
    $(toggle).each(function () {                                                                                       // 757
      var $parent = getParent($(this))                                                                                 // 758
      var relatedTarget = { relatedTarget: this }                                                                      // 759
      if (!$parent.hasClass('open')) return                                                                            // 760
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))                                                  // 761
      if (e.isDefaultPrevented()) return                                                                               // 762
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)                                         // 763
    })                                                                                                                 // 764
  }                                                                                                                    // 765
                                                                                                                       // 766
  function getParent($this) {                                                                                          // 767
    var selector = $this.attr('data-target')                                                                           // 768
                                                                                                                       // 769
    if (!selector) {                                                                                                   // 770
      selector = $this.attr('href')                                                                                    // 771
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7     // 772
    }                                                                                                                  // 773
                                                                                                                       // 774
    var $parent = selector && $(selector)                                                                              // 775
                                                                                                                       // 776
    return $parent && $parent.length ? $parent : $this.parent()                                                        // 777
  }                                                                                                                    // 778
                                                                                                                       // 779
                                                                                                                       // 780
  // DROPDOWN PLUGIN DEFINITION                                                                                        // 781
  // ==========================                                                                                        // 782
                                                                                                                       // 783
  function Plugin(option) {                                                                                            // 784
    return this.each(function () {                                                                                     // 785
      var $this = $(this)                                                                                              // 786
      var data  = $this.data('bs.dropdown')                                                                            // 787
                                                                                                                       // 788
      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))                                                // 789
      if (typeof option == 'string') data[option].call($this)                                                          // 790
    })                                                                                                                 // 791
  }                                                                                                                    // 792
                                                                                                                       // 793
  var old = $.fn.dropdown                                                                                              // 794
                                                                                                                       // 795
  $.fn.dropdown             = Plugin                                                                                   // 796
  $.fn.dropdown.Constructor = Dropdown                                                                                 // 797
                                                                                                                       // 798
                                                                                                                       // 799
  // DROPDOWN NO CONFLICT                                                                                              // 800
  // ====================                                                                                              // 801
                                                                                                                       // 802
  $.fn.dropdown.noConflict = function () {                                                                             // 803
    $.fn.dropdown = old                                                                                                // 804
    return this                                                                                                        // 805
  }                                                                                                                    // 806
                                                                                                                       // 807
                                                                                                                       // 808
  // APPLY TO STANDARD DROPDOWN ELEMENTS                                                                               // 809
  // ===================================                                                                               // 810
                                                                                                                       // 811
  $(document)                                                                                                          // 812
    .on('click.bs.dropdown.data-api', clearMenus)                                                                      // 813
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })                          // 814
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)                                               // 815
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)      // 816
                                                                                                                       // 817
}(jQuery);                                                                                                             // 818
                                                                                                                       // 819
/* ========================================================================                                            // 820
 * Bootstrap: modal.js v3.2.0                                                                                          // 821
 * http://getbootstrap.com/javascript/#modals                                                                          // 822
 * ========================================================================                                            // 823
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 824
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 825
 * ======================================================================== */                                         // 826
                                                                                                                       // 827
                                                                                                                       // 828
+function ($) {                                                                                                        // 829
  'use strict';                                                                                                        // 830
                                                                                                                       // 831
  // MODAL CLASS DEFINITION                                                                                            // 832
  // ======================                                                                                            // 833
                                                                                                                       // 834
  var Modal = function (element, options) {                                                                            // 835
    this.options        = options                                                                                      // 836
    this.$body          = $(document.body)                                                                             // 837
    this.$element       = $(element)                                                                                   // 838
    this.$backdrop      =                                                                                              // 839
    this.isShown        = null                                                                                         // 840
    this.scrollbarWidth = 0                                                                                            // 841
                                                                                                                       // 842
    if (this.options.remote) {                                                                                         // 843
      this.$element                                                                                                    // 844
        .find('.modal-content')                                                                                        // 845
        .load(this.options.remote, $.proxy(function () {                                                               // 846
          this.$element.trigger('loaded.bs.modal')                                                                     // 847
        }, this))                                                                                                      // 848
    }                                                                                                                  // 849
  }                                                                                                                    // 850
                                                                                                                       // 851
  Modal.VERSION  = '3.2.0'                                                                                             // 852
                                                                                                                       // 853
  Modal.DEFAULTS = {                                                                                                   // 854
    backdrop: true,                                                                                                    // 855
    keyboard: true,                                                                                                    // 856
    show: true                                                                                                         // 857
  }                                                                                                                    // 858
                                                                                                                       // 859
  Modal.prototype.toggle = function (_relatedTarget) {                                                                 // 860
    return this.isShown ? this.hide() : this.show(_relatedTarget)                                                      // 861
  }                                                                                                                    // 862
                                                                                                                       // 863
  Modal.prototype.show = function (_relatedTarget) {                                                                   // 864
    var that = this                                                                                                    // 865
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })                                             // 866
                                                                                                                       // 867
    this.$element.trigger(e)                                                                                           // 868
                                                                                                                       // 869
    if (this.isShown || e.isDefaultPrevented()) return                                                                 // 870
                                                                                                                       // 871
    this.isShown = true                                                                                                // 872
                                                                                                                       // 873
    this.checkScrollbar()                                                                                              // 874
    this.$body.addClass('modal-open')                                                                                  // 875
                                                                                                                       // 876
    this.setScrollbar()                                                                                                // 877
    this.escape()                                                                                                      // 878
                                                                                                                       // 879
    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))                     // 880
                                                                                                                       // 881
    this.backdrop(function () {                                                                                        // 882
      var transition = $.support.transition && that.$element.hasClass('fade')                                          // 883
                                                                                                                       // 884
      if (!that.$element.parent().length) {                                                                            // 885
        that.$element.appendTo(that.$body) // don't move modals dom position                                           // 886
      }                                                                                                                // 887
                                                                                                                       // 888
      that.$element                                                                                                    // 889
        .show()                                                                                                        // 890
        .scrollTop(0)                                                                                                  // 891
                                                                                                                       // 892
      if (transition) {                                                                                                // 893
        that.$element[0].offsetWidth // force reflow                                                                   // 894
      }                                                                                                                // 895
                                                                                                                       // 896
      that.$element                                                                                                    // 897
        .addClass('in')                                                                                                // 898
        .attr('aria-hidden', false)                                                                                    // 899
                                                                                                                       // 900
      that.enforceFocus()                                                                                              // 901
                                                                                                                       // 902
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })                                             // 903
                                                                                                                       // 904
      transition ?                                                                                                     // 905
        that.$element.find('.modal-dialog') // wait for modal to slide in                                              // 906
          .one('bsTransitionEnd', function () {                                                                        // 907
            that.$element.trigger('focus').trigger(e)                                                                  // 908
          })                                                                                                           // 909
          .emulateTransitionEnd(300) :                                                                                 // 910
        that.$element.trigger('focus').trigger(e)                                                                      // 911
    })                                                                                                                 // 912
  }                                                                                                                    // 913
                                                                                                                       // 914
  Modal.prototype.hide = function (e) {                                                                                // 915
    if (e) e.preventDefault()                                                                                          // 916
                                                                                                                       // 917
    e = $.Event('hide.bs.modal')                                                                                       // 918
                                                                                                                       // 919
    this.$element.trigger(e)                                                                                           // 920
                                                                                                                       // 921
    if (!this.isShown || e.isDefaultPrevented()) return                                                                // 922
                                                                                                                       // 923
    this.isShown = false                                                                                               // 924
                                                                                                                       // 925
    this.$body.removeClass('modal-open')                                                                               // 926
                                                                                                                       // 927
    this.resetScrollbar()                                                                                              // 928
    this.escape()                                                                                                      // 929
                                                                                                                       // 930
    $(document).off('focusin.bs.modal')                                                                                // 931
                                                                                                                       // 932
    this.$element                                                                                                      // 933
      .removeClass('in')                                                                                               // 934
      .attr('aria-hidden', true)                                                                                       // 935
      .off('click.dismiss.bs.modal')                                                                                   // 936
                                                                                                                       // 937
    $.support.transition && this.$element.hasClass('fade') ?                                                           // 938
      this.$element                                                                                                    // 939
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))                                                         // 940
        .emulateTransitionEnd(300) :                                                                                   // 941
      this.hideModal()                                                                                                 // 942
  }                                                                                                                    // 943
                                                                                                                       // 944
  Modal.prototype.enforceFocus = function () {                                                                         // 945
    $(document)                                                                                                        // 946
      .off('focusin.bs.modal') // guard against infinite focus loop                                                    // 947
      .on('focusin.bs.modal', $.proxy(function (e) {                                                                   // 948
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {                                    // 949
          this.$element.trigger('focus')                                                                               // 950
        }                                                                                                              // 951
      }, this))                                                                                                        // 952
  }                                                                                                                    // 953
                                                                                                                       // 954
  Modal.prototype.escape = function () {                                                                               // 955
    if (this.isShown && this.options.keyboard) {                                                                       // 956
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {                                                // 957
        e.which == 27 && this.hide()                                                                                   // 958
      }, this))                                                                                                        // 959
    } else if (!this.isShown) {                                                                                        // 960
      this.$element.off('keyup.dismiss.bs.modal')                                                                      // 961
    }                                                                                                                  // 962
  }                                                                                                                    // 963
                                                                                                                       // 964
  Modal.prototype.hideModal = function () {                                                                            // 965
    var that = this                                                                                                    // 966
    this.$element.hide()                                                                                               // 967
    this.backdrop(function () {                                                                                        // 968
      that.$element.trigger('hidden.bs.modal')                                                                         // 969
    })                                                                                                                 // 970
  }                                                                                                                    // 971
                                                                                                                       // 972
  Modal.prototype.removeBackdrop = function () {                                                                       // 973
    this.$backdrop && this.$backdrop.remove()                                                                          // 974
    this.$backdrop = null                                                                                              // 975
  }                                                                                                                    // 976
                                                                                                                       // 977
  Modal.prototype.backdrop = function (callback) {                                                                     // 978
    var that = this                                                                                                    // 979
    var animate = this.$element.hasClass('fade') ? 'fade' : ''                                                         // 980
                                                                                                                       // 981
    if (this.isShown && this.options.backdrop) {                                                                       // 982
      var doAnimate = $.support.transition && animate                                                                  // 983
                                                                                                                       // 984
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')                                             // 985
        .appendTo(this.$body)                                                                                          // 986
                                                                                                                       // 987
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {                                                // 988
        if (e.target !== e.currentTarget) return                                                                       // 989
        this.options.backdrop == 'static'                                                                              // 990
          ? this.$element[0].focus.call(this.$element[0])                                                              // 991
          : this.hide.call(this)                                                                                       // 992
      }, this))                                                                                                        // 993
                                                                                                                       // 994
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow                                                     // 995
                                                                                                                       // 996
      this.$backdrop.addClass('in')                                                                                    // 997
                                                                                                                       // 998
      if (!callback) return                                                                                            // 999
                                                                                                                       // 1000
      doAnimate ?                                                                                                      // 1001
        this.$backdrop                                                                                                 // 1002
          .one('bsTransitionEnd', callback)                                                                            // 1003
          .emulateTransitionEnd(150) :                                                                                 // 1004
        callback()                                                                                                     // 1005
                                                                                                                       // 1006
    } else if (!this.isShown && this.$backdrop) {                                                                      // 1007
      this.$backdrop.removeClass('in')                                                                                 // 1008
                                                                                                                       // 1009
      var callbackRemove = function () {                                                                               // 1010
        that.removeBackdrop()                                                                                          // 1011
        callback && callback()                                                                                         // 1012
      }                                                                                                                // 1013
      $.support.transition && this.$element.hasClass('fade') ?                                                         // 1014
        this.$backdrop                                                                                                 // 1015
          .one('bsTransitionEnd', callbackRemove)                                                                      // 1016
          .emulateTransitionEnd(150) :                                                                                 // 1017
        callbackRemove()                                                                                               // 1018
                                                                                                                       // 1019
    } else if (callback) {                                                                                             // 1020
      callback()                                                                                                       // 1021
    }                                                                                                                  // 1022
  }                                                                                                                    // 1023
                                                                                                                       // 1024
  Modal.prototype.checkScrollbar = function () {                                                                       // 1025
    if (document.body.clientWidth >= window.innerWidth) return                                                         // 1026
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()                                               // 1027
  }                                                                                                                    // 1028
                                                                                                                       // 1029
  Modal.prototype.setScrollbar = function () {                                                                         // 1030
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)                                                 // 1031
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)                            // 1032
  }                                                                                                                    // 1033
                                                                                                                       // 1034
  Modal.prototype.resetScrollbar = function () {                                                                       // 1035
    this.$body.css('padding-right', '')                                                                                // 1036
  }                                                                                                                    // 1037
                                                                                                                       // 1038
  Modal.prototype.measureScrollbar = function () { // thx walsh                                                        // 1039
    var scrollDiv = document.createElement('div')                                                                      // 1040
    scrollDiv.className = 'modal-scrollbar-measure'                                                                    // 1041
    this.$body.append(scrollDiv)                                                                                       // 1042
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth                                                 // 1043
    this.$body[0].removeChild(scrollDiv)                                                                               // 1044
    return scrollbarWidth                                                                                              // 1045
  }                                                                                                                    // 1046
                                                                                                                       // 1047
                                                                                                                       // 1048
  // MODAL PLUGIN DEFINITION                                                                                           // 1049
  // =======================                                                                                           // 1050
                                                                                                                       // 1051
  function Plugin(option, _relatedTarget) {                                                                            // 1052
    return this.each(function () {                                                                                     // 1053
      var $this   = $(this)                                                                                            // 1054
      var data    = $this.data('bs.modal')                                                                             // 1055
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)                    // 1056
                                                                                                                       // 1057
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))                                             // 1058
      if (typeof option == 'string') data[option](_relatedTarget)                                                      // 1059
      else if (options.show) data.show(_relatedTarget)                                                                 // 1060
    })                                                                                                                 // 1061
  }                                                                                                                    // 1062
                                                                                                                       // 1063
  var old = $.fn.modal                                                                                                 // 1064
                                                                                                                       // 1065
  $.fn.modal             = Plugin                                                                                      // 1066
  $.fn.modal.Constructor = Modal                                                                                       // 1067
                                                                                                                       // 1068
                                                                                                                       // 1069
  // MODAL NO CONFLICT                                                                                                 // 1070
  // =================                                                                                                 // 1071
                                                                                                                       // 1072
  $.fn.modal.noConflict = function () {                                                                                // 1073
    $.fn.modal = old                                                                                                   // 1074
    return this                                                                                                        // 1075
  }                                                                                                                    // 1076
                                                                                                                       // 1077
                                                                                                                       // 1078
  // MODAL DATA-API                                                                                                    // 1079
  // ==============                                                                                                    // 1080
                                                                                                                       // 1081
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {                                    // 1082
    var $this   = $(this)                                                                                              // 1083
    var href    = $this.attr('href')                                                                                   // 1084
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7        // 1085
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
                                                                                                                       // 1087
    if ($this.is('a')) e.preventDefault()                                                                              // 1088
                                                                                                                       // 1089
    $target.one('show.bs.modal', function (showEvent) {                                                                // 1090
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown      // 1091
      $target.one('hidden.bs.modal', function () {                                                                     // 1092
        $this.is(':visible') && $this.trigger('focus')                                                                 // 1093
      })                                                                                                               // 1094
    })                                                                                                                 // 1095
    Plugin.call($target, option, this)                                                                                 // 1096
  })                                                                                                                   // 1097
                                                                                                                       // 1098
}(jQuery);                                                                                                             // 1099
                                                                                                                       // 1100
/* ========================================================================                                            // 1101
 * Bootstrap: tooltip.js v3.2.0                                                                                        // 1102
 * http://getbootstrap.com/javascript/#tooltip                                                                         // 1103
 * Inspired by the original jQuery.tipsy by Jason Frame                                                                // 1104
 * ========================================================================                                            // 1105
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 1106
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 1107
 * ======================================================================== */                                         // 1108
                                                                                                                       // 1109
                                                                                                                       // 1110
+function ($) {                                                                                                        // 1111
  'use strict';                                                                                                        // 1112
                                                                                                                       // 1113
  // TOOLTIP PUBLIC CLASS DEFINITION                                                                                   // 1114
  // ===============================                                                                                   // 1115
                                                                                                                       // 1116
  var Tooltip = function (element, options) {                                                                          // 1117
    this.type       =                                                                                                  // 1118
    this.options    =                                                                                                  // 1119
    this.enabled    =                                                                                                  // 1120
    this.timeout    =                                                                                                  // 1121
    this.hoverState =                                                                                                  // 1122
    this.$element   = null                                                                                             // 1123
                                                                                                                       // 1124
    this.init('tooltip', element, options)                                                                             // 1125
  }                                                                                                                    // 1126
                                                                                                                       // 1127
  Tooltip.VERSION  = '3.2.0'                                                                                           // 1128
                                                                                                                       // 1129
  Tooltip.DEFAULTS = {                                                                                                 // 1130
    animation: true,                                                                                                   // 1131
    placement: 'top',                                                                                                  // 1132
    selector: false,                                                                                                   // 1133
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',                                                                                            // 1135
    title: '',                                                                                                         // 1136
    delay: 0,                                                                                                          // 1137
    html: false,                                                                                                       // 1138
    container: false,                                                                                                  // 1139
    viewport: {                                                                                                        // 1140
      selector: 'body',                                                                                                // 1141
      padding: 0                                                                                                       // 1142
    }                                                                                                                  // 1143
  }                                                                                                                    // 1144
                                                                                                                       // 1145
  Tooltip.prototype.init = function (type, element, options) {                                                         // 1146
    this.enabled   = true                                                                                              // 1147
    this.type      = type                                                                                              // 1148
    this.$element  = $(element)                                                                                        // 1149
    this.options   = this.getOptions(options)                                                                          // 1150
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)               // 1151
                                                                                                                       // 1152
    var triggers = this.options.trigger.split(' ')                                                                     // 1153
                                                                                                                       // 1154
    for (var i = triggers.length; i--;) {                                                                              // 1155
      var trigger = triggers[i]                                                                                        // 1156
                                                                                                                       // 1157
      if (trigger == 'click') {                                                                                        // 1158
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))                      // 1159
      } else if (trigger != 'manual') {                                                                                // 1160
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'                                                   // 1161
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'                                                  // 1162
                                                                                                                       // 1163
        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))                 // 1164
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))                 // 1165
      }                                                                                                                // 1166
    }                                                                                                                  // 1167
                                                                                                                       // 1168
    this.options.selector ?                                                                                            // 1169
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :                              // 1170
      this.fixTitle()                                                                                                  // 1171
  }                                                                                                                    // 1172
                                                                                                                       // 1173
  Tooltip.prototype.getDefaults = function () {                                                                        // 1174
    return Tooltip.DEFAULTS                                                                                            // 1175
  }                                                                                                                    // 1176
                                                                                                                       // 1177
  Tooltip.prototype.getOptions = function (options) {                                                                  // 1178
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)                                          // 1179
                                                                                                                       // 1180
    if (options.delay && typeof options.delay == 'number') {                                                           // 1181
      options.delay = {                                                                                                // 1182
        show: options.delay,                                                                                           // 1183
        hide: options.delay                                                                                            // 1184
      }                                                                                                                // 1185
    }                                                                                                                  // 1186
                                                                                                                       // 1187
    return options                                                                                                     // 1188
  }                                                                                                                    // 1189
                                                                                                                       // 1190
  Tooltip.prototype.getDelegateOptions = function () {                                                                 // 1191
    var options  = {}                                                                                                  // 1192
    var defaults = this.getDefaults()                                                                                  // 1193
                                                                                                                       // 1194
    this._options && $.each(this._options, function (key, value) {                                                     // 1195
      if (defaults[key] != value) options[key] = value                                                                 // 1196
    })                                                                                                                 // 1197
                                                                                                                       // 1198
    return options                                                                                                     // 1199
  }                                                                                                                    // 1200
                                                                                                                       // 1201
  Tooltip.prototype.enter = function (obj) {                                                                           // 1202
    var self = obj instanceof this.constructor ?                                                                       // 1203
      obj : $(obj.currentTarget).data('bs.' + this.type)                                                               // 1204
                                                                                                                       // 1205
    if (!self) {                                                                                                       // 1206
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())                                        // 1207
      $(obj.currentTarget).data('bs.' + this.type, self)                                                               // 1208
    }                                                                                                                  // 1209
                                                                                                                       // 1210
    clearTimeout(self.timeout)                                                                                         // 1211
                                                                                                                       // 1212
    self.hoverState = 'in'                                                                                             // 1213
                                                                                                                       // 1214
    if (!self.options.delay || !self.options.delay.show) return self.show()                                            // 1215
                                                                                                                       // 1216
    self.timeout = setTimeout(function () {                                                                            // 1217
      if (self.hoverState == 'in') self.show()                                                                         // 1218
    }, self.options.delay.show)                                                                                        // 1219
  }                                                                                                                    // 1220
                                                                                                                       // 1221
  Tooltip.prototype.leave = function (obj) {                                                                           // 1222
    var self = obj instanceof this.constructor ?                                                                       // 1223
      obj : $(obj.currentTarget).data('bs.' + this.type)                                                               // 1224
                                                                                                                       // 1225
    if (!self) {                                                                                                       // 1226
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())                                        // 1227
      $(obj.currentTarget).data('bs.' + this.type, self)                                                               // 1228
    }                                                                                                                  // 1229
                                                                                                                       // 1230
    clearTimeout(self.timeout)                                                                                         // 1231
                                                                                                                       // 1232
    self.hoverState = 'out'                                                                                            // 1233
                                                                                                                       // 1234
    if (!self.options.delay || !self.options.delay.hide) return self.hide()                                            // 1235
                                                                                                                       // 1236
    self.timeout = setTimeout(function () {                                                                            // 1237
      if (self.hoverState == 'out') self.hide()                                                                        // 1238
    }, self.options.delay.hide)                                                                                        // 1239
  }                                                                                                                    // 1240
                                                                                                                       // 1241
  Tooltip.prototype.show = function () {                                                                               // 1242
    var e = $.Event('show.bs.' + this.type)                                                                            // 1243
                                                                                                                       // 1244
    if (this.hasContent() && this.enabled) {                                                                           // 1245
      this.$element.trigger(e)                                                                                         // 1246
                                                                                                                       // 1247
      var inDom = $.contains(document.documentElement, this.$element[0])                                               // 1248
      if (e.isDefaultPrevented() || !inDom) return                                                                     // 1249
      var that = this                                                                                                  // 1250
                                                                                                                       // 1251
      var $tip = this.tip()                                                                                            // 1252
                                                                                                                       // 1253
      var tipId = this.getUID(this.type)                                                                               // 1254
                                                                                                                       // 1255
      this.setContent()                                                                                                // 1256
      $tip.attr('id', tipId)                                                                                           // 1257
      this.$element.attr('aria-describedby', tipId)                                                                    // 1258
                                                                                                                       // 1259
      if (this.options.animation) $tip.addClass('fade')                                                                // 1260
                                                                                                                       // 1261
      var placement = typeof this.options.placement == 'function' ?                                                    // 1262
        this.options.placement.call(this, $tip[0], this.$element[0]) :                                                 // 1263
        this.options.placement                                                                                         // 1264
                                                                                                                       // 1265
      var autoToken = /\s?auto?\s?/i                                                                                   // 1266
      var autoPlace = autoToken.test(placement)                                                                        // 1267
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'                                             // 1268
                                                                                                                       // 1269
      $tip                                                                                                             // 1270
        .detach()                                                                                                      // 1271
        .css({ top: 0, left: 0, display: 'block' })                                                                    // 1272
        .addClass(placement)                                                                                           // 1273
        .data('bs.' + this.type, this)                                                                                 // 1274
                                                                                                                       // 1275
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)                 // 1276
                                                                                                                       // 1277
      var pos          = this.getPosition()                                                                            // 1278
      var actualWidth  = $tip[0].offsetWidth                                                                           // 1279
      var actualHeight = $tip[0].offsetHeight                                                                          // 1280
                                                                                                                       // 1281
      if (autoPlace) {                                                                                                 // 1282
        var orgPlacement = placement                                                                                   // 1283
        var $parent      = this.$element.parent()                                                                      // 1284
        var parentDim    = this.getPosition($parent)                                                                   // 1285
                                                                                                                       // 1286
        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement                                                                                          // 1291
                                                                                                                       // 1292
        $tip                                                                                                           // 1293
          .removeClass(orgPlacement)                                                                                   // 1294
          .addClass(placement)                                                                                         // 1295
      }                                                                                                                // 1296
                                                                                                                       // 1297
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)                       // 1298
                                                                                                                       // 1299
      this.applyPlacement(calculatedOffset, placement)                                                                 // 1300
                                                                                                                       // 1301
      var complete = function () {                                                                                     // 1302
        that.$element.trigger('shown.bs.' + that.type)                                                                 // 1303
        that.hoverState = null                                                                                         // 1304
      }                                                                                                                // 1305
                                                                                                                       // 1306
      $.support.transition && this.$tip.hasClass('fade') ?                                                             // 1307
        $tip                                                                                                           // 1308
          .one('bsTransitionEnd', complete)                                                                            // 1309
          .emulateTransitionEnd(150) :                                                                                 // 1310
        complete()                                                                                                     // 1311
    }                                                                                                                  // 1312
  }                                                                                                                    // 1313
                                                                                                                       // 1314
  Tooltip.prototype.applyPlacement = function (offset, placement) {                                                    // 1315
    var $tip   = this.tip()                                                                                            // 1316
    var width  = $tip[0].offsetWidth                                                                                   // 1317
    var height = $tip[0].offsetHeight                                                                                  // 1318
                                                                                                                       // 1319
    // manually read margins because getBoundingClientRect includes difference                                         // 1320
    var marginTop = parseInt($tip.css('margin-top'), 10)                                                               // 1321
    var marginLeft = parseInt($tip.css('margin-left'), 10)                                                             // 1322
                                                                                                                       // 1323
    // we must check for NaN for ie 8/9                                                                                // 1324
    if (isNaN(marginTop))  marginTop  = 0                                                                              // 1325
    if (isNaN(marginLeft)) marginLeft = 0                                                                              // 1326
                                                                                                                       // 1327
    offset.top  = offset.top  + marginTop                                                                              // 1328
    offset.left = offset.left + marginLeft                                                                             // 1329
                                                                                                                       // 1330
    // $.fn.offset doesn't round pixel values                                                                          // 1331
    // so we use setOffset directly with our own function B-0                                                          // 1332
    $.offset.setOffset($tip[0], $.extend({                                                                             // 1333
      using: function (props) {                                                                                        // 1334
        $tip.css({                                                                                                     // 1335
          top: Math.round(props.top),                                                                                  // 1336
          left: Math.round(props.left)                                                                                 // 1337
        })                                                                                                             // 1338
      }                                                                                                                // 1339
    }, offset), 0)                                                                                                     // 1340
                                                                                                                       // 1341
    $tip.addClass('in')                                                                                                // 1342
                                                                                                                       // 1343
    // check to see if placing tip in new offset caused the tip to resize itself                                       // 1344
    var actualWidth  = $tip[0].offsetWidth                                                                             // 1345
    var actualHeight = $tip[0].offsetHeight                                                                            // 1346
                                                                                                                       // 1347
    if (placement == 'top' && actualHeight != height) {                                                                // 1348
      offset.top = offset.top + height - actualHeight                                                                  // 1349
    }                                                                                                                  // 1350
                                                                                                                       // 1351
    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)                            // 1352
                                                                                                                       // 1353
    if (delta.left) offset.left += delta.left                                                                          // 1354
    else offset.top += delta.top                                                                                       // 1355
                                                                                                                       // 1356
    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'                                                       // 1358
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'                                              // 1359
                                                                                                                       // 1360
    $tip.offset(offset)                                                                                                // 1361
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)                                         // 1362
  }                                                                                                                    // 1363
                                                                                                                       // 1364
  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {                                             // 1365
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')                                      // 1366
  }                                                                                                                    // 1367
                                                                                                                       // 1368
  Tooltip.prototype.setContent = function () {                                                                         // 1369
    var $tip  = this.tip()                                                                                             // 1370
    var title = this.getTitle()                                                                                        // 1371
                                                                                                                       // 1372
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)                                            // 1373
    $tip.removeClass('fade in top bottom left right')                                                                  // 1374
  }                                                                                                                    // 1375
                                                                                                                       // 1376
  Tooltip.prototype.hide = function () {                                                                               // 1377
    var that = this                                                                                                    // 1378
    var $tip = this.tip()                                                                                              // 1379
    var e    = $.Event('hide.bs.' + this.type)                                                                         // 1380
                                                                                                                       // 1381
    this.$element.removeAttr('aria-describedby')                                                                       // 1382
                                                                                                                       // 1383
    function complete() {                                                                                              // 1384
      if (that.hoverState != 'in') $tip.detach()                                                                       // 1385
      that.$element.trigger('hidden.bs.' + that.type)                                                                  // 1386
    }                                                                                                                  // 1387
                                                                                                                       // 1388
    this.$element.trigger(e)                                                                                           // 1389
                                                                                                                       // 1390
    if (e.isDefaultPrevented()) return                                                                                 // 1391
                                                                                                                       // 1392
    $tip.removeClass('in')                                                                                             // 1393
                                                                                                                       // 1394
    $.support.transition && this.$tip.hasClass('fade') ?                                                               // 1395
      $tip                                                                                                             // 1396
        .one('bsTransitionEnd', complete)                                                                              // 1397
        .emulateTransitionEnd(150) :                                                                                   // 1398
      complete()                                                                                                       // 1399
                                                                                                                       // 1400
    this.hoverState = null                                                                                             // 1401
                                                                                                                       // 1402
    return this                                                                                                        // 1403
  }                                                                                                                    // 1404
                                                                                                                       // 1405
  Tooltip.prototype.fixTitle = function () {                                                                           // 1406
    var $e = this.$element                                                                                             // 1407
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {                                     // 1408
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')                                         // 1409
    }                                                                                                                  // 1410
  }                                                                                                                    // 1411
                                                                                                                       // 1412
  Tooltip.prototype.hasContent = function () {                                                                         // 1413
    return this.getTitle()                                                                                             // 1414
  }                                                                                                                    // 1415
                                                                                                                       // 1416
  Tooltip.prototype.getPosition = function ($element) {                                                                // 1417
    $element   = $element || this.$element                                                                             // 1418
    var el     = $element[0]                                                                                           // 1419
    var isBody = el.tagName == 'BODY'                                                                                  // 1420
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {         // 1421
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),           // 1422
      width:  isBody ? $(window).width()  : $element.outerWidth(),                                                     // 1423
      height: isBody ? $(window).height() : $element.outerHeight()                                                     // 1424
    }, isBody ? { top: 0, left: 0 } : $element.offset())                                                               // 1425
  }                                                                                                                    // 1426
                                                                                                                       // 1427
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {                       // 1428
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }  // 1432
                                                                                                                       // 1433
  }                                                                                                                    // 1434
                                                                                                                       // 1435
  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {                  // 1436
    var delta = { top: 0, left: 0 }                                                                                    // 1437
    if (!this.$viewport) return delta                                                                                  // 1438
                                                                                                                       // 1439
    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0                                  // 1440
    var viewportDimensions = this.getPosition(this.$viewport)                                                          // 1441
                                                                                                                       // 1442
    if (/right|left/.test(placement)) {                                                                                // 1443
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll                                     // 1444
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight                      // 1445
      if (topEdgeOffset < viewportDimensions.top) { // top overflow                                                    // 1446
        delta.top = viewportDimensions.top - topEdgeOffset                                                             // 1447
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow           // 1448
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset                              // 1449
      }                                                                                                                // 1450
    } else {                                                                                                           // 1451
      var leftEdgeOffset  = pos.left - viewportPadding                                                                 // 1452
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth                                                   // 1453
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow                                                 // 1454
        delta.left = viewportDimensions.left - leftEdgeOffset                                                          // 1455
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow                                       // 1456
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset                              // 1457
      }                                                                                                                // 1458
    }                                                                                                                  // 1459
                                                                                                                       // 1460
    return delta                                                                                                       // 1461
  }                                                                                                                    // 1462
                                                                                                                       // 1463
  Tooltip.prototype.getTitle = function () {                                                                           // 1464
    var title                                                                                                          // 1465
    var $e = this.$element                                                                                             // 1466
    var o  = this.options                                                                                              // 1467
                                                                                                                       // 1468
    title = $e.attr('data-original-title')                                                                             // 1469
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)                                               // 1470
                                                                                                                       // 1471
    return title                                                                                                       // 1472
  }                                                                                                                    // 1473
                                                                                                                       // 1474
  Tooltip.prototype.getUID = function (prefix) {                                                                       // 1475
    do prefix += ~~(Math.random() * 1000000)                                                                           // 1476
    while (document.getElementById(prefix))                                                                            // 1477
    return prefix                                                                                                      // 1478
  }                                                                                                                    // 1479
                                                                                                                       // 1480
  Tooltip.prototype.tip = function () {                                                                                // 1481
    return (this.$tip = this.$tip || $(this.options.template))                                                         // 1482
  }                                                                                                                    // 1483
                                                                                                                       // 1484
  Tooltip.prototype.arrow = function () {                                                                              // 1485
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))                                            // 1486
  }                                                                                                                    // 1487
                                                                                                                       // 1488
  Tooltip.prototype.validate = function () {                                                                           // 1489
    if (!this.$element[0].parentNode) {                                                                                // 1490
      this.hide()                                                                                                      // 1491
      this.$element = null                                                                                             // 1492
      this.options  = null                                                                                             // 1493
    }                                                                                                                  // 1494
  }                                                                                                                    // 1495
                                                                                                                       // 1496
  Tooltip.prototype.enable = function () {                                                                             // 1497
    this.enabled = true                                                                                                // 1498
  }                                                                                                                    // 1499
                                                                                                                       // 1500
  Tooltip.prototype.disable = function () {                                                                            // 1501
    this.enabled = false                                                                                               // 1502
  }                                                                                                                    // 1503
                                                                                                                       // 1504
  Tooltip.prototype.toggleEnabled = function () {                                                                      // 1505
    this.enabled = !this.enabled                                                                                       // 1506
  }                                                                                                                    // 1507
                                                                                                                       // 1508
  Tooltip.prototype.toggle = function (e) {                                                                            // 1509
    var self = this                                                                                                    // 1510
    if (e) {                                                                                                           // 1511
      self = $(e.currentTarget).data('bs.' + this.type)                                                                // 1512
      if (!self) {                                                                                                     // 1513
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())                                        // 1514
        $(e.currentTarget).data('bs.' + this.type, self)                                                               // 1515
      }                                                                                                                // 1516
    }                                                                                                                  // 1517
                                                                                                                       // 1518
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)                                                    // 1519
  }                                                                                                                    // 1520
                                                                                                                       // 1521
  Tooltip.prototype.destroy = function () {                                                                            // 1522
    clearTimeout(this.timeout)                                                                                         // 1523
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)                                            // 1524
  }                                                                                                                    // 1525
                                                                                                                       // 1526
                                                                                                                       // 1527
  // TOOLTIP PLUGIN DEFINITION                                                                                         // 1528
  // =========================                                                                                         // 1529
                                                                                                                       // 1530
  function Plugin(option) {                                                                                            // 1531
    return this.each(function () {                                                                                     // 1532
      var $this   = $(this)                                                                                            // 1533
      var data    = $this.data('bs.tooltip')                                                                           // 1534
      var options = typeof option == 'object' && option                                                                // 1535
                                                                                                                       // 1536
      if (!data && option == 'destroy') return                                                                         // 1537
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))                                         // 1538
      if (typeof option == 'string') data[option]()                                                                    // 1539
    })                                                                                                                 // 1540
  }                                                                                                                    // 1541
                                                                                                                       // 1542
  var old = $.fn.tooltip                                                                                               // 1543
                                                                                                                       // 1544
  $.fn.tooltip             = Plugin                                                                                    // 1545
  $.fn.tooltip.Constructor = Tooltip                                                                                   // 1546
                                                                                                                       // 1547
                                                                                                                       // 1548
  // TOOLTIP NO CONFLICT                                                                                               // 1549
  // ===================                                                                                               // 1550
                                                                                                                       // 1551
  $.fn.tooltip.noConflict = function () {                                                                              // 1552
    $.fn.tooltip = old                                                                                                 // 1553
    return this                                                                                                        // 1554
  }                                                                                                                    // 1555
                                                                                                                       // 1556
}(jQuery);                                                                                                             // 1557
                                                                                                                       // 1558
/* ========================================================================                                            // 1559
 * Bootstrap: popover.js v3.2.0                                                                                        // 1560
 * http://getbootstrap.com/javascript/#popovers                                                                        // 1561
 * ========================================================================                                            // 1562
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 1563
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 1564
 * ======================================================================== */                                         // 1565
                                                                                                                       // 1566
                                                                                                                       // 1567
+function ($) {                                                                                                        // 1568
  'use strict';                                                                                                        // 1569
                                                                                                                       // 1570
  // POPOVER PUBLIC CLASS DEFINITION                                                                                   // 1571
  // ===============================                                                                                   // 1572
                                                                                                                       // 1573
  var Popover = function (element, options) {                                                                          // 1574
    this.init('popover', element, options)                                                                             // 1575
  }                                                                                                                    // 1576
                                                                                                                       // 1577
  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')                                                    // 1578
                                                                                                                       // 1579
  Popover.VERSION  = '3.2.0'                                                                                           // 1580
                                                                                                                       // 1581
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {                                                 // 1582
    placement: 'right',                                                                                                // 1583
    trigger: 'click',                                                                                                  // 1584
    content: '',                                                                                                       // 1585
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })                                                                                                                   // 1587
                                                                                                                       // 1588
                                                                                                                       // 1589
  // NOTE: POPOVER EXTENDS tooltip.js                                                                                  // 1590
  // ================================                                                                                  // 1591
                                                                                                                       // 1592
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)                                                 // 1593
                                                                                                                       // 1594
  Popover.prototype.constructor = Popover                                                                              // 1595
                                                                                                                       // 1596
  Popover.prototype.getDefaults = function () {                                                                        // 1597
    return Popover.DEFAULTS                                                                                            // 1598
  }                                                                                                                    // 1599
                                                                                                                       // 1600
  Popover.prototype.setContent = function () {                                                                         // 1601
    var $tip    = this.tip()                                                                                           // 1602
    var title   = this.getTitle()                                                                                      // 1603
    var content = this.getContent()                                                                                    // 1604
                                                                                                                       // 1605
    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)                                            // 1606
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events                     // 1607
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'                                    // 1608
    ](content)                                                                                                         // 1609
                                                                                                                       // 1610
    $tip.removeClass('fade top bottom left right in')                                                                  // 1611
                                                                                                                       // 1612
    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do                                       // 1613
    // this manually by checking the contents.                                                                         // 1614
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()                                        // 1615
  }                                                                                                                    // 1616
                                                                                                                       // 1617
  Popover.prototype.hasContent = function () {                                                                         // 1618
    return this.getTitle() || this.getContent()                                                                        // 1619
  }                                                                                                                    // 1620
                                                                                                                       // 1621
  Popover.prototype.getContent = function () {                                                                         // 1622
    var $e = this.$element                                                                                             // 1623
    var o  = this.options                                                                                              // 1624
                                                                                                                       // 1625
    return $e.attr('data-content')                                                                                     // 1626
      || (typeof o.content == 'function' ?                                                                             // 1627
            o.content.call($e[0]) :                                                                                    // 1628
            o.content)                                                                                                 // 1629
  }                                                                                                                    // 1630
                                                                                                                       // 1631
  Popover.prototype.arrow = function () {                                                                              // 1632
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))                                                    // 1633
  }                                                                                                                    // 1634
                                                                                                                       // 1635
  Popover.prototype.tip = function () {                                                                                // 1636
    if (!this.$tip) this.$tip = $(this.options.template)                                                               // 1637
    return this.$tip                                                                                                   // 1638
  }                                                                                                                    // 1639
                                                                                                                       // 1640
                                                                                                                       // 1641
  // POPOVER PLUGIN DEFINITION                                                                                         // 1642
  // =========================                                                                                         // 1643
                                                                                                                       // 1644
  function Plugin(option) {                                                                                            // 1645
    return this.each(function () {                                                                                     // 1646
      var $this   = $(this)                                                                                            // 1647
      var data    = $this.data('bs.popover')                                                                           // 1648
      var options = typeof option == 'object' && option                                                                // 1649
                                                                                                                       // 1650
      if (!data && option == 'destroy') return                                                                         // 1651
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))                                         // 1652
      if (typeof option == 'string') data[option]()                                                                    // 1653
    })                                                                                                                 // 1654
  }                                                                                                                    // 1655
                                                                                                                       // 1656
  var old = $.fn.popover                                                                                               // 1657
                                                                                                                       // 1658
  $.fn.popover             = Plugin                                                                                    // 1659
  $.fn.popover.Constructor = Popover                                                                                   // 1660
                                                                                                                       // 1661
                                                                                                                       // 1662
  // POPOVER NO CONFLICT                                                                                               // 1663
  // ===================                                                                                               // 1664
                                                                                                                       // 1665
  $.fn.popover.noConflict = function () {                                                                              // 1666
    $.fn.popover = old                                                                                                 // 1667
    return this                                                                                                        // 1668
  }                                                                                                                    // 1669
                                                                                                                       // 1670
}(jQuery);                                                                                                             // 1671
                                                                                                                       // 1672
/* ========================================================================                                            // 1673
 * Bootstrap: scrollspy.js v3.2.0                                                                                      // 1674
 * http://getbootstrap.com/javascript/#scrollspy                                                                       // 1675
 * ========================================================================                                            // 1676
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 1677
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 1678
 * ======================================================================== */                                         // 1679
                                                                                                                       // 1680
                                                                                                                       // 1681
+function ($) {                                                                                                        // 1682
  'use strict';                                                                                                        // 1683
                                                                                                                       // 1684
  // SCROLLSPY CLASS DEFINITION                                                                                        // 1685
  // ==========================                                                                                        // 1686
                                                                                                                       // 1687
  function ScrollSpy(element, options) {                                                                               // 1688
    var process  = $.proxy(this.process, this)                                                                         // 1689
                                                                                                                       // 1690
    this.$body          = $('body')                                                                                    // 1691
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)                                               // 1692
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)                                                    // 1693
    this.selector       = (this.options.target || '') + ' .nav li > a'                                                 // 1694
    this.offsets        = []                                                                                           // 1695
    this.targets        = []                                                                                           // 1696
    this.activeTarget   = null                                                                                         // 1697
    this.scrollHeight   = 0                                                                                            // 1698
                                                                                                                       // 1699
    this.$scrollElement.on('scroll.bs.scrollspy', process)                                                             // 1700
    this.refresh()                                                                                                     // 1701
    this.process()                                                                                                     // 1702
  }                                                                                                                    // 1703
                                                                                                                       // 1704
  ScrollSpy.VERSION  = '3.2.0'                                                                                         // 1705
                                                                                                                       // 1706
  ScrollSpy.DEFAULTS = {                                                                                               // 1707
    offset: 10                                                                                                         // 1708
  }                                                                                                                    // 1709
                                                                                                                       // 1710
  ScrollSpy.prototype.getScrollHeight = function () {                                                                  // 1711
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }                                                                                                                    // 1713
                                                                                                                       // 1714
  ScrollSpy.prototype.refresh = function () {                                                                          // 1715
    var offsetMethod = 'offset'                                                                                        // 1716
    var offsetBase   = 0                                                                                               // 1717
                                                                                                                       // 1718
    if (!$.isWindow(this.$scrollElement[0])) {                                                                         // 1719
      offsetMethod = 'position'                                                                                        // 1720
      offsetBase   = this.$scrollElement.scrollTop()                                                                   // 1721
    }                                                                                                                  // 1722
                                                                                                                       // 1723
    this.offsets = []                                                                                                  // 1724
    this.targets = []                                                                                                  // 1725
    this.scrollHeight = this.getScrollHeight()                                                                         // 1726
                                                                                                                       // 1727
    var self     = this                                                                                                // 1728
                                                                                                                       // 1729
    this.$body                                                                                                         // 1730
      .find(this.selector)                                                                                             // 1731
      .map(function () {                                                                                               // 1732
        var $el   = $(this)                                                                                            // 1733
        var href  = $el.data('target') || $el.attr('href')                                                             // 1734
        var $href = /^#./.test(href) && $(href)                                                                        // 1735
                                                                                                                       // 1736
        return ($href                                                                                                  // 1737
          && $href.length                                                                                              // 1738
          && $href.is(':visible')                                                                                      // 1739
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null                                                 // 1740
      })                                                                                                               // 1741
      .sort(function (a, b) { return a[0] - b[0] })                                                                    // 1742
      .each(function () {                                                                                              // 1743
        self.offsets.push(this[0])                                                                                     // 1744
        self.targets.push(this[1])                                                                                     // 1745
      })                                                                                                               // 1746
  }                                                                                                                    // 1747
                                                                                                                       // 1748
  ScrollSpy.prototype.process = function () {                                                                          // 1749
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset                                           // 1750
    var scrollHeight = this.getScrollHeight()                                                                          // 1751
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()                               // 1752
    var offsets      = this.offsets                                                                                    // 1753
    var targets      = this.targets                                                                                    // 1754
    var activeTarget = this.activeTarget                                                                               // 1755
    var i                                                                                                              // 1756
                                                                                                                       // 1757
    if (this.scrollHeight != scrollHeight) {                                                                           // 1758
      this.refresh()                                                                                                   // 1759
    }                                                                                                                  // 1760
                                                                                                                       // 1761
    if (scrollTop >= maxScroll) {                                                                                      // 1762
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)                                     // 1763
    }                                                                                                                  // 1764
                                                                                                                       // 1765
    if (activeTarget && scrollTop <= offsets[0]) {                                                                     // 1766
      return activeTarget != (i = targets[0]) && this.activate(i)                                                      // 1767
    }                                                                                                                  // 1768
                                                                                                                       // 1769
    for (i = offsets.length; i--;) {                                                                                   // 1770
      activeTarget != targets[i]                                                                                       // 1771
        && scrollTop >= offsets[i]                                                                                     // 1772
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])                                                            // 1773
        && this.activate(targets[i])                                                                                   // 1774
    }                                                                                                                  // 1775
  }                                                                                                                    // 1776
                                                                                                                       // 1777
  ScrollSpy.prototype.activate = function (target) {                                                                   // 1778
    this.activeTarget = target                                                                                         // 1779
                                                                                                                       // 1780
    $(this.selector)                                                                                                   // 1781
      .parentsUntil(this.options.target, '.active')                                                                    // 1782
      .removeClass('active')                                                                                           // 1783
                                                                                                                       // 1784
    var selector = this.selector +                                                                                     // 1785
        '[data-target="' + target + '"],' +                                                                            // 1786
        this.selector + '[href="' + target + '"]'                                                                      // 1787
                                                                                                                       // 1788
    var active = $(selector)                                                                                           // 1789
      .parents('li')                                                                                                   // 1790
      .addClass('active')                                                                                              // 1791
                                                                                                                       // 1792
    if (active.parent('.dropdown-menu').length) {                                                                      // 1793
      active = active                                                                                                  // 1794
        .closest('li.dropdown')                                                                                        // 1795
        .addClass('active')                                                                                            // 1796
    }                                                                                                                  // 1797
                                                                                                                       // 1798
    active.trigger('activate.bs.scrollspy')                                                                            // 1799
  }                                                                                                                    // 1800
                                                                                                                       // 1801
                                                                                                                       // 1802
  // SCROLLSPY PLUGIN DEFINITION                                                                                       // 1803
  // ===========================                                                                                       // 1804
                                                                                                                       // 1805
  function Plugin(option) {                                                                                            // 1806
    return this.each(function () {                                                                                     // 1807
      var $this   = $(this)                                                                                            // 1808
      var data    = $this.data('bs.scrollspy')                                                                         // 1809
      var options = typeof option == 'object' && option                                                                // 1810
                                                                                                                       // 1811
      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))                                     // 1812
      if (typeof option == 'string') data[option]()                                                                    // 1813
    })                                                                                                                 // 1814
  }                                                                                                                    // 1815
                                                                                                                       // 1816
  var old = $.fn.scrollspy                                                                                             // 1817
                                                                                                                       // 1818
  $.fn.scrollspy             = Plugin                                                                                  // 1819
  $.fn.scrollspy.Constructor = ScrollSpy                                                                               // 1820
                                                                                                                       // 1821
                                                                                                                       // 1822
  // SCROLLSPY NO CONFLICT                                                                                             // 1823
  // =====================                                                                                             // 1824
                                                                                                                       // 1825
  $.fn.scrollspy.noConflict = function () {                                                                            // 1826
    $.fn.scrollspy = old                                                                                               // 1827
    return this                                                                                                        // 1828
  }                                                                                                                    // 1829
                                                                                                                       // 1830
                                                                                                                       // 1831
  // SCROLLSPY DATA-API                                                                                                // 1832
  // ==================                                                                                                // 1833
                                                                                                                       // 1834
  $(window).on('load.bs.scrollspy.data-api', function () {                                                             // 1835
    $('[data-spy="scroll"]').each(function () {                                                                        // 1836
      var $spy = $(this)                                                                                               // 1837
      Plugin.call($spy, $spy.data())                                                                                   // 1838
    })                                                                                                                 // 1839
  })                                                                                                                   // 1840
                                                                                                                       // 1841
}(jQuery);                                                                                                             // 1842
                                                                                                                       // 1843
/* ========================================================================                                            // 1844
 * Bootstrap: tab.js v3.2.0                                                                                            // 1845
 * http://getbootstrap.com/javascript/#tabs                                                                            // 1846
 * ========================================================================                                            // 1847
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 1848
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 1849
 * ======================================================================== */                                         // 1850
                                                                                                                       // 1851
                                                                                                                       // 1852
+function ($) {                                                                                                        // 1853
  'use strict';                                                                                                        // 1854
                                                                                                                       // 1855
  // TAB CLASS DEFINITION                                                                                              // 1856
  // ====================                                                                                              // 1857
                                                                                                                       // 1858
  var Tab = function (element) {                                                                                       // 1859
    this.element = $(element)                                                                                          // 1860
  }                                                                                                                    // 1861
                                                                                                                       // 1862
  Tab.VERSION = '3.2.0'                                                                                                // 1863
                                                                                                                       // 1864
  Tab.prototype.show = function () {                                                                                   // 1865
    var $this    = this.element                                                                                        // 1866
    var $ul      = $this.closest('ul:not(.dropdown-menu)')                                                             // 1867
    var selector = $this.data('target')                                                                                // 1868
                                                                                                                       // 1869
    if (!selector) {                                                                                                   // 1870
      selector = $this.attr('href')                                                                                    // 1871
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7                                   // 1872
    }                                                                                                                  // 1873
                                                                                                                       // 1874
    if ($this.parent('li').hasClass('active')) return                                                                  // 1875
                                                                                                                       // 1876
    var previous = $ul.find('.active:last a')[0]                                                                       // 1877
    var e        = $.Event('show.bs.tab', {                                                                            // 1878
      relatedTarget: previous                                                                                          // 1879
    })                                                                                                                 // 1880
                                                                                                                       // 1881
    $this.trigger(e)                                                                                                   // 1882
                                                                                                                       // 1883
    if (e.isDefaultPrevented()) return                                                                                 // 1884
                                                                                                                       // 1885
    var $target = $(selector)                                                                                          // 1886
                                                                                                                       // 1887
    this.activate($this.closest('li'), $ul)                                                                            // 1888
    this.activate($target, $target.parent(), function () {                                                             // 1889
      $this.trigger({                                                                                                  // 1890
        type: 'shown.bs.tab',                                                                                          // 1891
        relatedTarget: previous                                                                                        // 1892
      })                                                                                                               // 1893
    })                                                                                                                 // 1894
  }                                                                                                                    // 1895
                                                                                                                       // 1896
  Tab.prototype.activate = function (element, container, callback) {                                                   // 1897
    var $active    = container.find('> .active')                                                                       // 1898
    var transition = callback                                                                                          // 1899
      && $.support.transition                                                                                          // 1900
      && $active.hasClass('fade')                                                                                      // 1901
                                                                                                                       // 1902
    function next() {                                                                                                  // 1903
      $active                                                                                                          // 1904
        .removeClass('active')                                                                                         // 1905
        .find('> .dropdown-menu > .active')                                                                            // 1906
        .removeClass('active')                                                                                         // 1907
                                                                                                                       // 1908
      element.addClass('active')                                                                                       // 1909
                                                                                                                       // 1910
      if (transition) {                                                                                                // 1911
        element[0].offsetWidth // reflow for transition                                                                // 1912
        element.addClass('in')                                                                                         // 1913
      } else {                                                                                                         // 1914
        element.removeClass('fade')                                                                                    // 1915
      }                                                                                                                // 1916
                                                                                                                       // 1917
      if (element.parent('.dropdown-menu')) {                                                                          // 1918
        element.closest('li.dropdown').addClass('active')                                                              // 1919
      }                                                                                                                // 1920
                                                                                                                       // 1921
      callback && callback()                                                                                           // 1922
    }                                                                                                                  // 1923
                                                                                                                       // 1924
    transition ?                                                                                                       // 1925
      $active                                                                                                          // 1926
        .one('bsTransitionEnd', next)                                                                                  // 1927
        .emulateTransitionEnd(150) :                                                                                   // 1928
      next()                                                                                                           // 1929
                                                                                                                       // 1930
    $active.removeClass('in')                                                                                          // 1931
  }                                                                                                                    // 1932
                                                                                                                       // 1933
                                                                                                                       // 1934
  // TAB PLUGIN DEFINITION                                                                                             // 1935
  // =====================                                                                                             // 1936
                                                                                                                       // 1937
  function Plugin(option) {                                                                                            // 1938
    return this.each(function () {                                                                                     // 1939
      var $this = $(this)                                                                                              // 1940
      var data  = $this.data('bs.tab')                                                                                 // 1941
                                                                                                                       // 1942
      if (!data) $this.data('bs.tab', (data = new Tab(this)))                                                          // 1943
      if (typeof option == 'string') data[option]()                                                                    // 1944
    })                                                                                                                 // 1945
  }                                                                                                                    // 1946
                                                                                                                       // 1947
  var old = $.fn.tab                                                                                                   // 1948
                                                                                                                       // 1949
  $.fn.tab             = Plugin                                                                                        // 1950
  $.fn.tab.Constructor = Tab                                                                                           // 1951
                                                                                                                       // 1952
                                                                                                                       // 1953
  // TAB NO CONFLICT                                                                                                   // 1954
  // ===============                                                                                                   // 1955
                                                                                                                       // 1956
  $.fn.tab.noConflict = function () {                                                                                  // 1957
    $.fn.tab = old                                                                                                     // 1958
    return this                                                                                                        // 1959
  }                                                                                                                    // 1960
                                                                                                                       // 1961
                                                                                                                       // 1962
  // TAB DATA-API                                                                                                      // 1963
  // ============                                                                                                      // 1964
                                                                                                                       // 1965
  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {                  // 1966
    e.preventDefault()                                                                                                 // 1967
    Plugin.call($(this), 'show')                                                                                       // 1968
  })                                                                                                                   // 1969
                                                                                                                       // 1970
}(jQuery);                                                                                                             // 1971
                                                                                                                       // 1972
/* ========================================================================                                            // 1973
 * Bootstrap: affix.js v3.2.0                                                                                          // 1974
 * http://getbootstrap.com/javascript/#affix                                                                           // 1975
 * ========================================================================                                            // 1976
 * Copyright 2011-2014 Twitter, Inc.                                                                                   // 1977
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)                                          // 1978
 * ======================================================================== */                                         // 1979
                                                                                                                       // 1980
                                                                                                                       // 1981
+function ($) {                                                                                                        // 1982
  'use strict';                                                                                                        // 1983
                                                                                                                       // 1984
  // AFFIX CLASS DEFINITION                                                                                            // 1985
  // ======================                                                                                            // 1986
                                                                                                                       // 1987
  var Affix = function (element, options) {                                                                            // 1988
    this.options = $.extend({}, Affix.DEFAULTS, options)                                                               // 1989
                                                                                                                       // 1990
    this.$target = $(this.options.target)                                                                              // 1991
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))                                               // 1992
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))                                  // 1993
                                                                                                                       // 1994
    this.$element     = $(element)                                                                                     // 1995
    this.affixed      =                                                                                                // 1996
    this.unpin        =                                                                                                // 1997
    this.pinnedOffset = null                                                                                           // 1998
                                                                                                                       // 1999
    this.checkPosition()                                                                                               // 2000
  }                                                                                                                    // 2001
                                                                                                                       // 2002
  Affix.VERSION  = '3.2.0'                                                                                             // 2003
                                                                                                                       // 2004
  Affix.RESET    = 'affix affix-top affix-bottom'                                                                      // 2005
                                                                                                                       // 2006
  Affix.DEFAULTS = {                                                                                                   // 2007
    offset: 0,                                                                                                         // 2008
    target: window                                                                                                     // 2009
  }                                                                                                                    // 2010
                                                                                                                       // 2011
  Affix.prototype.getPinnedOffset = function () {                                                                      // 2012
    if (this.pinnedOffset) return this.pinnedOffset                                                                    // 2013
    this.$element.removeClass(Affix.RESET).addClass('affix')                                                           // 2014
    var scrollTop = this.$target.scrollTop()                                                                           // 2015
    var position  = this.$element.offset()                                                                             // 2016
    return (this.pinnedOffset = position.top - scrollTop)                                                              // 2017
  }                                                                                                                    // 2018
                                                                                                                       // 2019
  Affix.prototype.checkPositionWithEventLoop = function () {                                                           // 2020
    setTimeout($.proxy(this.checkPosition, this), 1)                                                                   // 2021
  }                                                                                                                    // 2022
                                                                                                                       // 2023
  Affix.prototype.checkPosition = function () {                                                                        // 2024
    if (!this.$element.is(':visible')) return                                                                          // 2025
                                                                                                                       // 2026
    var scrollHeight = $(document).height()                                                                            // 2027
    var scrollTop    = this.$target.scrollTop()                                                                        // 2028
    var position     = this.$element.offset()                                                                          // 2029
    var offset       = this.options.offset                                                                             // 2030
    var offsetTop    = offset.top                                                                                      // 2031
    var offsetBottom = offset.bottom                                                                                   // 2032
                                                                                                                       // 2033
    if (typeof offset != 'object')         offsetBottom = offsetTop = offset                                           // 2034
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)                                    // 2035
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)                                 // 2036
                                                                                                                       // 2037
    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :                             // 2038
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false                                       // 2040
                                                                                                                       // 2041
    if (this.affixed === affix) return                                                                                 // 2042
    if (this.unpin != null) this.$element.css('top', '')                                                               // 2043
                                                                                                                       // 2044
    var affixType = 'affix' + (affix ? '-' + affix : '')                                                               // 2045
    var e         = $.Event(affixType + '.bs.affix')                                                                   // 2046
                                                                                                                       // 2047
    this.$element.trigger(e)                                                                                           // 2048
                                                                                                                       // 2049
    if (e.isDefaultPrevented()) return                                                                                 // 2050
                                                                                                                       // 2051
    this.affixed = affix                                                                                               // 2052
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null                                                     // 2053
                                                                                                                       // 2054
    this.$element                                                                                                      // 2055
      .removeClass(Affix.RESET)                                                                                        // 2056
      .addClass(affixType)                                                                                             // 2057
      .trigger($.Event(affixType.replace('affix', 'affixed')))                                                         // 2058
                                                                                                                       // 2059
    if (affix == 'bottom') {                                                                                           // 2060
      this.$element.offset({                                                                                           // 2061
        top: scrollHeight - this.$element.height() - offsetBottom                                                      // 2062
      })                                                                                                               // 2063
    }                                                                                                                  // 2064
  }                                                                                                                    // 2065
                                                                                                                       // 2066
                                                                                                                       // 2067
  // AFFIX PLUGIN DEFINITION                                                                                           // 2068
  // =======================                                                                                           // 2069
                                                                                                                       // 2070
  function Plugin(option) {                                                                                            // 2071
    return this.each(function () {                                                                                     // 2072
      var $this   = $(this)                                                                                            // 2073
      var data    = $this.data('bs.affix')                                                                             // 2074
      var options = typeof option == 'object' && option                                                                // 2075
                                                                                                                       // 2076
      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))                                             // 2077
      if (typeof option == 'string') data[option]()                                                                    // 2078
    })                                                                                                                 // 2079
  }                                                                                                                    // 2080
                                                                                                                       // 2081
  var old = $.fn.affix                                                                                                 // 2082
                                                                                                                       // 2083
  $.fn.affix             = Plugin                                                                                      // 2084
  $.fn.affix.Constructor = Affix                                                                                       // 2085
                                                                                                                       // 2086
                                                                                                                       // 2087
  // AFFIX NO CONFLICT                                                                                                 // 2088
  // =================                                                                                                 // 2089
                                                                                                                       // 2090
  $.fn.affix.noConflict = function () {                                                                                // 2091
    $.fn.affix = old                                                                                                   // 2092
    return this                                                                                                        // 2093
  }                                                                                                                    // 2094
                                                                                                                       // 2095
                                                                                                                       // 2096
  // AFFIX DATA-API                                                                                                    // 2097
  // ==============                                                                                                    // 2098
                                                                                                                       // 2099
  $(window).on('load', function () {                                                                                   // 2100
    $('[data-spy="affix"]').each(function () {                                                                         // 2101
      var $spy = $(this)                                                                                               // 2102
      var data = $spy.data()                                                                                           // 2103
                                                                                                                       // 2104
      data.offset = data.offset || {}                                                                                  // 2105
                                                                                                                       // 2106
      if (data.offsetBottom) data.offset.bottom = data.offsetBottom                                                    // 2107
      if (data.offsetTop)    data.offset.top    = data.offsetTop                                                       // 2108
                                                                                                                       // 2109
      Plugin.call($spy, data)                                                                                          // 2110
    })                                                                                                                 // 2111
  })                                                                                                                   // 2112
                                                                                                                       // 2113
}(jQuery);                                                                                                             // 2114
                                                                                                                       // 2115
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['bootstrap-3'] = {};

})();

//# sourceMappingURL=714b8594ea6555f1727061814ffeae31f5e4c7fb.map
