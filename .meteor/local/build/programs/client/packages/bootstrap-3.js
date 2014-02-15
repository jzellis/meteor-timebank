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
 * Bootstrap v3.0.3 (http://getbootstrap.com)                                                                         // 2
 * Copyright 2013 Twitter, Inc.                                                                                       // 3
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0                                                          // 4
 */                                                                                                                   // 5
                                                                                                                      // 6
if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }                                   // 7
                                                                                                                      // 8
/* ========================================================================                                           // 9
 * Bootstrap: transition.js v3.0.3                                                                                    // 10
 * http://getbootstrap.com/javascript/#transitions                                                                    // 11
 * ========================================================================                                           // 12
 * Copyright 2013 Twitter, Inc.                                                                                       // 13
 *                                                                                                                    // 14
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 15
 * you may not use this file except in compliance with the License.                                                   // 16
 * You may obtain a copy of the License at                                                                            // 17
 *                                                                                                                    // 18
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 19
 *                                                                                                                    // 20
 * Unless required by applicable law or agreed to in writing, software                                                // 21
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 22
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 23
 * See the License for the specific language governing permissions and                                                // 24
 * limitations under the License.                                                                                     // 25
 * ======================================================================== */                                        // 26
                                                                                                                      // 27
                                                                                                                      // 28
+function ($) { "use strict";                                                                                         // 29
                                                                                                                      // 30
  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)                                                     // 31
  // ============================================================                                                     // 32
                                                                                                                      // 33
  function transitionEnd() {                                                                                          // 34
    var el = document.createElement('bootstrap')                                                                      // 35
                                                                                                                      // 36
    var transEndEventNames = {                                                                                        // 37
      'WebkitTransition' : 'webkitTransitionEnd'                                                                      // 38
    , 'MozTransition'    : 'transitionend'                                                                            // 39
    , 'OTransition'      : 'oTransitionEnd otransitionend'                                                            // 40
    , 'transition'       : 'transitionend'                                                                            // 41
    }                                                                                                                 // 42
                                                                                                                      // 43
    for (var name in transEndEventNames) {                                                                            // 44
      if (el.style[name] !== undefined) {                                                                             // 45
        return { end: transEndEventNames[name] }                                                                      // 46
      }                                                                                                               // 47
    }                                                                                                                 // 48
  }                                                                                                                   // 49
                                                                                                                      // 50
  // http://blog.alexmaccaw.com/css-transitions                                                                       // 51
  $.fn.emulateTransitionEnd = function (duration) {                                                                   // 52
    var called = false, $el = this                                                                                    // 53
    $(this).one($.support.transition.end, function () { called = true })                                              // 54
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }                              // 55
    setTimeout(callback, duration)                                                                                    // 56
    return this                                                                                                       // 57
  }                                                                                                                   // 58
                                                                                                                      // 59
  $(function () {                                                                                                     // 60
    $.support.transition = transitionEnd()                                                                            // 61
  })                                                                                                                  // 62
                                                                                                                      // 63
}(jQuery);                                                                                                            // 64
                                                                                                                      // 65
/* ========================================================================                                           // 66
 * Bootstrap: alert.js v3.0.3                                                                                         // 67
 * http://getbootstrap.com/javascript/#alerts                                                                         // 68
 * ========================================================================                                           // 69
 * Copyright 2013 Twitter, Inc.                                                                                       // 70
 *                                                                                                                    // 71
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 72
 * you may not use this file except in compliance with the License.                                                   // 73
 * You may obtain a copy of the License at                                                                            // 74
 *                                                                                                                    // 75
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 76
 *                                                                                                                    // 77
 * Unless required by applicable law or agreed to in writing, software                                                // 78
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 79
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 80
 * See the License for the specific language governing permissions and                                                // 81
 * limitations under the License.                                                                                     // 82
 * ======================================================================== */                                        // 83
                                                                                                                      // 84
                                                                                                                      // 85
+function ($) { "use strict";                                                                                         // 86
                                                                                                                      // 87
  // ALERT CLASS DEFINITION                                                                                           // 88
  // ======================                                                                                           // 89
                                                                                                                      // 90
  var dismiss = '[data-dismiss="alert"]'                                                                              // 91
  var Alert   = function (el) {                                                                                       // 92
    $(el).on('click', dismiss, this.close)                                                                            // 93
  }                                                                                                                   // 94
                                                                                                                      // 95
  Alert.prototype.close = function (e) {                                                                              // 96
    var $this    = $(this)                                                                                            // 97
    var selector = $this.attr('data-target')                                                                          // 98
                                                                                                                      // 99
    if (!selector) {                                                                                                  // 100
      selector = $this.attr('href')                                                                                   // 101
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7                                  // 102
    }                                                                                                                 // 103
                                                                                                                      // 104
    var $parent = $(selector)                                                                                         // 105
                                                                                                                      // 106
    if (e) e.preventDefault()                                                                                         // 107
                                                                                                                      // 108
    if (!$parent.length) {                                                                                            // 109
      $parent = $this.hasClass('alert') ? $this : $this.parent()                                                      // 110
    }                                                                                                                 // 111
                                                                                                                      // 112
    $parent.trigger(e = $.Event('close.bs.alert'))                                                                    // 113
                                                                                                                      // 114
    if (e.isDefaultPrevented()) return                                                                                // 115
                                                                                                                      // 116
    $parent.removeClass('in')                                                                                         // 117
                                                                                                                      // 118
    function removeElement() {                                                                                        // 119
      $parent.trigger('closed.bs.alert').remove()                                                                     // 120
    }                                                                                                                 // 121
                                                                                                                      // 122
    $.support.transition && $parent.hasClass('fade') ?                                                                // 123
      $parent                                                                                                         // 124
        .one($.support.transition.end, removeElement)                                                                 // 125
        .emulateTransitionEnd(150) :                                                                                  // 126
      removeElement()                                                                                                 // 127
  }                                                                                                                   // 128
                                                                                                                      // 129
                                                                                                                      // 130
  // ALERT PLUGIN DEFINITION                                                                                          // 131
  // =======================                                                                                          // 132
                                                                                                                      // 133
  var old = $.fn.alert                                                                                                // 134
                                                                                                                      // 135
  $.fn.alert = function (option) {                                                                                    // 136
    return this.each(function () {                                                                                    // 137
      var $this = $(this)                                                                                             // 138
      var data  = $this.data('bs.alert')                                                                              // 139
                                                                                                                      // 140
      if (!data) $this.data('bs.alert', (data = new Alert(this)))                                                     // 141
      if (typeof option == 'string') data[option].call($this)                                                         // 142
    })                                                                                                                // 143
  }                                                                                                                   // 144
                                                                                                                      // 145
  $.fn.alert.Constructor = Alert                                                                                      // 146
                                                                                                                      // 147
                                                                                                                      // 148
  // ALERT NO CONFLICT                                                                                                // 149
  // =================                                                                                                // 150
                                                                                                                      // 151
  $.fn.alert.noConflict = function () {                                                                               // 152
    $.fn.alert = old                                                                                                  // 153
    return this                                                                                                       // 154
  }                                                                                                                   // 155
                                                                                                                      // 156
                                                                                                                      // 157
  // ALERT DATA-API                                                                                                   // 158
  // ==============                                                                                                   // 159
                                                                                                                      // 160
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)                                           // 161
                                                                                                                      // 162
}(jQuery);                                                                                                            // 163
                                                                                                                      // 164
/* ========================================================================                                           // 165
 * Bootstrap: button.js v3.0.3                                                                                        // 166
 * http://getbootstrap.com/javascript/#buttons                                                                        // 167
 * ========================================================================                                           // 168
 * Copyright 2013 Twitter, Inc.                                                                                       // 169
 *                                                                                                                    // 170
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 171
 * you may not use this file except in compliance with the License.                                                   // 172
 * You may obtain a copy of the License at                                                                            // 173
 *                                                                                                                    // 174
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 175
 *                                                                                                                    // 176
 * Unless required by applicable law or agreed to in writing, software                                                // 177
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 178
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 179
 * See the License for the specific language governing permissions and                                                // 180
 * limitations under the License.                                                                                     // 181
 * ======================================================================== */                                        // 182
                                                                                                                      // 183
                                                                                                                      // 184
+function ($) { "use strict";                                                                                         // 185
                                                                                                                      // 186
  // BUTTON PUBLIC CLASS DEFINITION                                                                                   // 187
  // ==============================                                                                                   // 188
                                                                                                                      // 189
  var Button = function (element, options) {                                                                          // 190
    this.$element = $(element)                                                                                        // 191
    this.options  = $.extend({}, Button.DEFAULTS, options)                                                            // 192
  }                                                                                                                   // 193
                                                                                                                      // 194
  Button.DEFAULTS = {                                                                                                 // 195
    loadingText: 'loading...'                                                                                         // 196
  }                                                                                                                   // 197
                                                                                                                      // 198
  Button.prototype.setState = function (state) {                                                                      // 199
    var d    = 'disabled'                                                                                             // 200
    var $el  = this.$element                                                                                          // 201
    var val  = $el.is('input') ? 'val' : 'html'                                                                       // 202
    var data = $el.data()                                                                                             // 203
                                                                                                                      // 204
    state = state + 'Text'                                                                                            // 205
                                                                                                                      // 206
    if (!data.resetText) $el.data('resetText', $el[val]())                                                            // 207
                                                                                                                      // 208
    $el[val](data[state] || this.options[state])                                                                      // 209
                                                                                                                      // 210
    // push to event loop to allow forms to submit                                                                    // 211
    setTimeout(function () {                                                                                          // 212
      state == 'loadingText' ?                                                                                        // 213
        $el.addClass(d).attr(d, d) :                                                                                  // 214
        $el.removeClass(d).removeAttr(d);                                                                             // 215
    }, 0)                                                                                                             // 216
  }                                                                                                                   // 217
                                                                                                                      // 218
  Button.prototype.toggle = function () {                                                                             // 219
    var $parent = this.$element.closest('[data-toggle="buttons"]')                                                    // 220
    var changed = true                                                                                                // 221
                                                                                                                      // 222
    if ($parent.length) {                                                                                             // 223
      var $input = this.$element.find('input')                                                                        // 224
      if ($input.prop('type') === 'radio') {                                                                          // 225
        // see if clicking on current one                                                                             // 226
        if ($input.prop('checked') && this.$element.hasClass('active'))                                               // 227
          changed = false                                                                                             // 228
        else                                                                                                          // 229
          $parent.find('.active').removeClass('active')                                                               // 230
      }                                                                                                               // 231
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')                        // 232
    }                                                                                                                 // 233
                                                                                                                      // 234
    if (changed) this.$element.toggleClass('active')                                                                  // 235
  }                                                                                                                   // 236
                                                                                                                      // 237
                                                                                                                      // 238
  // BUTTON PLUGIN DEFINITION                                                                                         // 239
  // ========================                                                                                         // 240
                                                                                                                      // 241
  var old = $.fn.button                                                                                               // 242
                                                                                                                      // 243
  $.fn.button = function (option) {                                                                                   // 244
    return this.each(function () {                                                                                    // 245
      var $this   = $(this)                                                                                           // 246
      var data    = $this.data('bs.button')                                                                           // 247
      var options = typeof option == 'object' && option                                                               // 248
                                                                                                                      // 249
      if (!data) $this.data('bs.button', (data = new Button(this, options)))                                          // 250
                                                                                                                      // 251
      if (option == 'toggle') data.toggle()                                                                           // 252
      else if (option) data.setState(option)                                                                          // 253
    })                                                                                                                // 254
  }                                                                                                                   // 255
                                                                                                                      // 256
  $.fn.button.Constructor = Button                                                                                    // 257
                                                                                                                      // 258
                                                                                                                      // 259
  // BUTTON NO CONFLICT                                                                                               // 260
  // ==================                                                                                               // 261
                                                                                                                      // 262
  $.fn.button.noConflict = function () {                                                                              // 263
    $.fn.button = old                                                                                                 // 264
    return this                                                                                                       // 265
  }                                                                                                                   // 266
                                                                                                                      // 267
                                                                                                                      // 268
  // BUTTON DATA-API                                                                                                  // 269
  // ===============                                                                                                  // 270
                                                                                                                      // 271
  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {                                  // 272
    var $btn = $(e.target)                                                                                            // 273
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')                                                            // 274
    $btn.button('toggle')                                                                                             // 275
    e.preventDefault()                                                                                                // 276
  })                                                                                                                  // 277
                                                                                                                      // 278
}(jQuery);                                                                                                            // 279
                                                                                                                      // 280
/* ========================================================================                                           // 281
 * Bootstrap: carousel.js v3.0.3                                                                                      // 282
 * http://getbootstrap.com/javascript/#carousel                                                                       // 283
 * ========================================================================                                           // 284
 * Copyright 2013 Twitter, Inc.                                                                                       // 285
 *                                                                                                                    // 286
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 287
 * you may not use this file except in compliance with the License.                                                   // 288
 * You may obtain a copy of the License at                                                                            // 289
 *                                                                                                                    // 290
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 291
 *                                                                                                                    // 292
 * Unless required by applicable law or agreed to in writing, software                                                // 293
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 294
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 295
 * See the License for the specific language governing permissions and                                                // 296
 * limitations under the License.                                                                                     // 297
 * ======================================================================== */                                        // 298
                                                                                                                      // 299
                                                                                                                      // 300
+function ($) { "use strict";                                                                                         // 301
                                                                                                                      // 302
  // CAROUSEL CLASS DEFINITION                                                                                        // 303
  // =========================                                                                                        // 304
                                                                                                                      // 305
  var Carousel = function (element, options) {                                                                        // 306
    this.$element    = $(element)                                                                                     // 307
    this.$indicators = this.$element.find('.carousel-indicators')                                                     // 308
    this.options     = options                                                                                        // 309
    this.paused      =                                                                                                // 310
    this.sliding     =                                                                                                // 311
    this.interval    =                                                                                                // 312
    this.$active     =                                                                                                // 313
    this.$items      = null                                                                                           // 314
                                                                                                                      // 315
    this.options.pause == 'hover' && this.$element                                                                    // 316
      .on('mouseenter', $.proxy(this.pause, this))                                                                    // 317
      .on('mouseleave', $.proxy(this.cycle, this))                                                                    // 318
  }                                                                                                                   // 319
                                                                                                                      // 320
  Carousel.DEFAULTS = {                                                                                               // 321
    interval: 5000                                                                                                    // 322
  , pause: 'hover'                                                                                                    // 323
  , wrap: true                                                                                                        // 324
  }                                                                                                                   // 325
                                                                                                                      // 326
  Carousel.prototype.cycle =  function (e) {                                                                          // 327
    e || (this.paused = false)                                                                                        // 328
                                                                                                                      // 329
    this.interval && clearInterval(this.interval)                                                                     // 330
                                                                                                                      // 331
    this.options.interval                                                                                             // 332
      && !this.paused                                                                                                 // 333
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))                               // 334
                                                                                                                      // 335
    return this                                                                                                       // 336
  }                                                                                                                   // 337
                                                                                                                      // 338
  Carousel.prototype.getActiveIndex = function () {                                                                   // 339
    this.$active = this.$element.find('.item.active')                                                                 // 340
    this.$items  = this.$active.parent().children()                                                                   // 341
                                                                                                                      // 342
    return this.$items.index(this.$active)                                                                            // 343
  }                                                                                                                   // 344
                                                                                                                      // 345
  Carousel.prototype.to = function (pos) {                                                                            // 346
    var that        = this                                                                                            // 347
    var activeIndex = this.getActiveIndex()                                                                           // 348
                                                                                                                      // 349
    if (pos > (this.$items.length - 1) || pos < 0) return                                                             // 350
                                                                                                                      // 351
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })                // 352
    if (activeIndex == pos) return this.pause().cycle()                                                               // 353
                                                                                                                      // 354
    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))                                       // 355
  }                                                                                                                   // 356
                                                                                                                      // 357
  Carousel.prototype.pause = function (e) {                                                                           // 358
    e || (this.paused = true)                                                                                         // 359
                                                                                                                      // 360
    if (this.$element.find('.next, .prev').length && $.support.transition.end) {                                      // 361
      this.$element.trigger($.support.transition.end)                                                                 // 362
      this.cycle(true)                                                                                                // 363
    }                                                                                                                 // 364
                                                                                                                      // 365
    this.interval = clearInterval(this.interval)                                                                      // 366
                                                                                                                      // 367
    return this                                                                                                       // 368
  }                                                                                                                   // 369
                                                                                                                      // 370
  Carousel.prototype.next = function () {                                                                             // 371
    if (this.sliding) return                                                                                          // 372
    return this.slide('next')                                                                                         // 373
  }                                                                                                                   // 374
                                                                                                                      // 375
  Carousel.prototype.prev = function () {                                                                             // 376
    if (this.sliding) return                                                                                          // 377
    return this.slide('prev')                                                                                         // 378
  }                                                                                                                   // 379
                                                                                                                      // 380
  Carousel.prototype.slide = function (type, next) {                                                                  // 381
    var $active   = this.$element.find('.item.active')                                                                // 382
    var $next     = next || $active[type]()                                                                           // 383
    var isCycling = this.interval                                                                                     // 384
    var direction = type == 'next' ? 'left' : 'right'                                                                 // 385
    var fallback  = type == 'next' ? 'first' : 'last'                                                                 // 386
    var that      = this                                                                                              // 387
                                                                                                                      // 388
    if (!$next.length) {                                                                                              // 389
      if (!this.options.wrap) return                                                                                  // 390
      $next = this.$element.find('.item')[fallback]()                                                                 // 391
    }                                                                                                                 // 392
                                                                                                                      // 393
    this.sliding = true                                                                                               // 394
                                                                                                                      // 395
    isCycling && this.pause()                                                                                         // 396
                                                                                                                      // 397
    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })                           // 398
                                                                                                                      // 399
    if ($next.hasClass('active')) return                                                                              // 400
                                                                                                                      // 401
    if (this.$indicators.length) {                                                                                    // 402
      this.$indicators.find('.active').removeClass('active')                                                          // 403
      this.$element.one('slid.bs.carousel', function () {                                                             // 404
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])                                    // 405
        $nextIndicator && $nextIndicator.addClass('active')                                                           // 406
      })                                                                                                              // 407
    }                                                                                                                 // 408
                                                                                                                      // 409
    if ($.support.transition && this.$element.hasClass('slide')) {                                                    // 410
      this.$element.trigger(e)                                                                                        // 411
      if (e.isDefaultPrevented()) return                                                                              // 412
      $next.addClass(type)                                                                                            // 413
      $next[0].offsetWidth // force reflow                                                                            // 414
      $active.addClass(direction)                                                                                     // 415
      $next.addClass(direction)                                                                                       // 416
      $active                                                                                                         // 417
        .one($.support.transition.end, function () {                                                                  // 418
          $next.removeClass([type, direction].join(' ')).addClass('active')                                           // 419
          $active.removeClass(['active', direction].join(' '))                                                        // 420
          that.sliding = false                                                                                        // 421
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)                                    // 422
        })                                                                                                            // 423
        .emulateTransitionEnd(600)                                                                                    // 424
    } else {                                                                                                          // 425
      this.$element.trigger(e)                                                                                        // 426
      if (e.isDefaultPrevented()) return                                                                              // 427
      $active.removeClass('active')                                                                                   // 428
      $next.addClass('active')                                                                                        // 429
      this.sliding = false                                                                                            // 430
      this.$element.trigger('slid.bs.carousel')                                                                       // 431
    }                                                                                                                 // 432
                                                                                                                      // 433
    isCycling && this.cycle()                                                                                         // 434
                                                                                                                      // 435
    return this                                                                                                       // 436
  }                                                                                                                   // 437
                                                                                                                      // 438
                                                                                                                      // 439
  // CAROUSEL PLUGIN DEFINITION                                                                                       // 440
  // ==========================                                                                                       // 441
                                                                                                                      // 442
  var old = $.fn.carousel                                                                                             // 443
                                                                                                                      // 444
  $.fn.carousel = function (option) {                                                                                 // 445
    return this.each(function () {                                                                                    // 446
      var $this   = $(this)                                                                                           // 447
      var data    = $this.data('bs.carousel')                                                                         // 448
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)                // 449
      var action  = typeof option == 'string' ? option : options.slide                                                // 450
                                                                                                                      // 451
      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))                                      // 452
      if (typeof option == 'number') data.to(option)                                                                  // 453
      else if (action) data[action]()                                                                                 // 454
      else if (options.interval) data.pause().cycle()                                                                 // 455
    })                                                                                                                // 456
  }                                                                                                                   // 457
                                                                                                                      // 458
  $.fn.carousel.Constructor = Carousel                                                                                // 459
                                                                                                                      // 460
                                                                                                                      // 461
  // CAROUSEL NO CONFLICT                                                                                             // 462
  // ====================                                                                                             // 463
                                                                                                                      // 464
  $.fn.carousel.noConflict = function () {                                                                            // 465
    $.fn.carousel = old                                                                                               // 466
    return this                                                                                                       // 467
  }                                                                                                                   // 468
                                                                                                                      // 469
                                                                                                                      // 470
  // CAROUSEL DATA-API                                                                                                // 471
  // =================                                                                                                // 472
                                                                                                                      // 473
  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {                        // 474
    var $this   = $(this), href                                                                                       // 475
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())                                                          // 477
    var slideIndex = $this.attr('data-slide-to')                                                                      // 478
    if (slideIndex) options.interval = false                                                                          // 479
                                                                                                                      // 480
    $target.carousel(options)                                                                                         // 481
                                                                                                                      // 482
    if (slideIndex = $this.attr('data-slide-to')) {                                                                   // 483
      $target.data('bs.carousel').to(slideIndex)                                                                      // 484
    }                                                                                                                 // 485
                                                                                                                      // 486
    e.preventDefault()                                                                                                // 487
  })                                                                                                                  // 488
                                                                                                                      // 489
  $(window).on('load', function () {                                                                                  // 490
    $('[data-ride="carousel"]').each(function () {                                                                    // 491
      var $carousel = $(this)                                                                                         // 492
      $carousel.carousel($carousel.data())                                                                            // 493
    })                                                                                                                // 494
  })                                                                                                                  // 495
                                                                                                                      // 496
}(jQuery);                                                                                                            // 497
                                                                                                                      // 498
/* ========================================================================                                           // 499
 * Bootstrap: collapse.js v3.0.3                                                                                      // 500
 * http://getbootstrap.com/javascript/#collapse                                                                       // 501
 * ========================================================================                                           // 502
 * Copyright 2013 Twitter, Inc.                                                                                       // 503
 *                                                                                                                    // 504
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 505
 * you may not use this file except in compliance with the License.                                                   // 506
 * You may obtain a copy of the License at                                                                            // 507
 *                                                                                                                    // 508
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 509
 *                                                                                                                    // 510
 * Unless required by applicable law or agreed to in writing, software                                                // 511
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 512
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 513
 * See the License for the specific language governing permissions and                                                // 514
 * limitations under the License.                                                                                     // 515
 * ======================================================================== */                                        // 516
                                                                                                                      // 517
                                                                                                                      // 518
+function ($) { "use strict";                                                                                         // 519
                                                                                                                      // 520
  // COLLAPSE PUBLIC CLASS DEFINITION                                                                                 // 521
  // ================================                                                                                 // 522
                                                                                                                      // 523
  var Collapse = function (element, options) {                                                                        // 524
    this.$element      = $(element)                                                                                   // 525
    this.options       = $.extend({}, Collapse.DEFAULTS, options)                                                     // 526
    this.transitioning = null                                                                                         // 527
                                                                                                                      // 528
    if (this.options.parent) this.$parent = $(this.options.parent)                                                    // 529
    if (this.options.toggle) this.toggle()                                                                            // 530
  }                                                                                                                   // 531
                                                                                                                      // 532
  Collapse.DEFAULTS = {                                                                                               // 533
    toggle: true                                                                                                      // 534
  }                                                                                                                   // 535
                                                                                                                      // 536
  Collapse.prototype.dimension = function () {                                                                        // 537
    var hasWidth = this.$element.hasClass('width')                                                                    // 538
    return hasWidth ? 'width' : 'height'                                                                              // 539
  }                                                                                                                   // 540
                                                                                                                      // 541
  Collapse.prototype.show = function () {                                                                             // 542
    if (this.transitioning || this.$element.hasClass('in')) return                                                    // 543
                                                                                                                      // 544
    var startEvent = $.Event('show.bs.collapse')                                                                      // 545
    this.$element.trigger(startEvent)                                                                                 // 546
    if (startEvent.isDefaultPrevented()) return                                                                       // 547
                                                                                                                      // 548
    var actives = this.$parent && this.$parent.find('> .panel > .in')                                                 // 549
                                                                                                                      // 550
    if (actives && actives.length) {                                                                                  // 551
      var hasData = actives.data('bs.collapse')                                                                       // 552
      if (hasData && hasData.transitioning) return                                                                    // 553
      actives.collapse('hide')                                                                                        // 554
      hasData || actives.data('bs.collapse', null)                                                                    // 555
    }                                                                                                                 // 556
                                                                                                                      // 557
    var dimension = this.dimension()                                                                                  // 558
                                                                                                                      // 559
    this.$element                                                                                                     // 560
      .removeClass('collapse')                                                                                        // 561
      .addClass('collapsing')                                                                                         // 562
      [dimension](0)                                                                                                  // 563
                                                                                                                      // 564
    this.transitioning = 1                                                                                            // 565
                                                                                                                      // 566
    var complete = function () {                                                                                      // 567
      this.$element                                                                                                   // 568
        .removeClass('collapsing')                                                                                    // 569
        .addClass('in')                                                                                               // 570
        [dimension]('auto')                                                                                           // 571
      this.transitioning = 0                                                                                          // 572
      this.$element.trigger('shown.bs.collapse')                                                                      // 573
    }                                                                                                                 // 574
                                                                                                                      // 575
    if (!$.support.transition) return complete.call(this)                                                             // 576
                                                                                                                      // 577
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))                                                     // 578
                                                                                                                      // 579
    this.$element                                                                                                     // 580
      .one($.support.transition.end, $.proxy(complete, this))                                                         // 581
      .emulateTransitionEnd(350)                                                                                      // 582
      [dimension](this.$element[0][scrollSize])                                                                       // 583
  }                                                                                                                   // 584
                                                                                                                      // 585
  Collapse.prototype.hide = function () {                                                                             // 586
    if (this.transitioning || !this.$element.hasClass('in')) return                                                   // 587
                                                                                                                      // 588
    var startEvent = $.Event('hide.bs.collapse')                                                                      // 589
    this.$element.trigger(startEvent)                                                                                 // 590
    if (startEvent.isDefaultPrevented()) return                                                                       // 591
                                                                                                                      // 592
    var dimension = this.dimension()                                                                                  // 593
                                                                                                                      // 594
    this.$element                                                                                                     // 595
      [dimension](this.$element[dimension]())                                                                         // 596
      [0].offsetHeight                                                                                                // 597
                                                                                                                      // 598
    this.$element                                                                                                     // 599
      .addClass('collapsing')                                                                                         // 600
      .removeClass('collapse')                                                                                        // 601
      .removeClass('in')                                                                                              // 602
                                                                                                                      // 603
    this.transitioning = 1                                                                                            // 604
                                                                                                                      // 605
    var complete = function () {                                                                                      // 606
      this.transitioning = 0                                                                                          // 607
      this.$element                                                                                                   // 608
        .trigger('hidden.bs.collapse')                                                                                // 609
        .removeClass('collapsing')                                                                                    // 610
        .addClass('collapse')                                                                                         // 611
    }                                                                                                                 // 612
                                                                                                                      // 613
    if (!$.support.transition) return complete.call(this)                                                             // 614
                                                                                                                      // 615
    this.$element                                                                                                     // 616
      [dimension](0)                                                                                                  // 617
      .one($.support.transition.end, $.proxy(complete, this))                                                         // 618
      .emulateTransitionEnd(350)                                                                                      // 619
  }                                                                                                                   // 620
                                                                                                                      // 621
  Collapse.prototype.toggle = function () {                                                                           // 622
    this[this.$element.hasClass('in') ? 'hide' : 'show']()                                                            // 623
  }                                                                                                                   // 624
                                                                                                                      // 625
                                                                                                                      // 626
  // COLLAPSE PLUGIN DEFINITION                                                                                       // 627
  // ==========================                                                                                       // 628
                                                                                                                      // 629
  var old = $.fn.collapse                                                                                             // 630
                                                                                                                      // 631
  $.fn.collapse = function (option) {                                                                                 // 632
    return this.each(function () {                                                                                    // 633
      var $this   = $(this)                                                                                           // 634
      var data    = $this.data('bs.collapse')                                                                         // 635
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)                // 636
                                                                                                                      // 637
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))                                      // 638
      if (typeof option == 'string') data[option]()                                                                   // 639
    })                                                                                                                // 640
  }                                                                                                                   // 641
                                                                                                                      // 642
  $.fn.collapse.Constructor = Collapse                                                                                // 643
                                                                                                                      // 644
                                                                                                                      // 645
  // COLLAPSE NO CONFLICT                                                                                             // 646
  // ====================                                                                                             // 647
                                                                                                                      // 648
  $.fn.collapse.noConflict = function () {                                                                            // 649
    $.fn.collapse = old                                                                                               // 650
    return this                                                                                                       // 651
  }                                                                                                                   // 652
                                                                                                                      // 653
                                                                                                                      // 654
  // COLLAPSE DATA-API                                                                                                // 655
  // =================                                                                                                // 656
                                                                                                                      // 657
  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {                               // 658
    var $this   = $(this), href                                                                                       // 659
    var target  = $this.attr('data-target')                                                                           // 660
        || e.preventDefault()                                                                                         // 661
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7                          // 662
    var $target = $(target)                                                                                           // 663
    var data    = $target.data('bs.collapse')                                                                         // 664
    var option  = data ? 'toggle' : $this.data()                                                                      // 665
    var parent  = $this.attr('data-parent')                                                                           // 666
    var $parent = parent && $(parent)                                                                                 // 667
                                                                                                                      // 668
    if (!data || !data.transitioning) {                                                                               // 669
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')                                         // 671
    }                                                                                                                 // 672
                                                                                                                      // 673
    $target.collapse(option)                                                                                          // 674
  })                                                                                                                  // 675
                                                                                                                      // 676
}(jQuery);                                                                                                            // 677
                                                                                                                      // 678
/* ========================================================================                                           // 679
 * Bootstrap: dropdown.js v3.0.3                                                                                      // 680
 * http://getbootstrap.com/javascript/#dropdowns                                                                      // 681
 * ========================================================================                                           // 682
 * Copyright 2013 Twitter, Inc.                                                                                       // 683
 *                                                                                                                    // 684
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 685
 * you may not use this file except in compliance with the License.                                                   // 686
 * You may obtain a copy of the License at                                                                            // 687
 *                                                                                                                    // 688
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 689
 *                                                                                                                    // 690
 * Unless required by applicable law or agreed to in writing, software                                                // 691
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 692
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 693
 * See the License for the specific language governing permissions and                                                // 694
 * limitations under the License.                                                                                     // 695
 * ======================================================================== */                                        // 696
                                                                                                                      // 697
                                                                                                                      // 698
+function ($) { "use strict";                                                                                         // 699
                                                                                                                      // 700
  // DROPDOWN CLASS DEFINITION                                                                                        // 701
  // =========================                                                                                        // 702
                                                                                                                      // 703
  var backdrop = '.dropdown-backdrop'                                                                                 // 704
  var toggle   = '[data-toggle=dropdown]'                                                                             // 705
  var Dropdown = function (element) {                                                                                 // 706
    $(element).on('click.bs.dropdown', this.toggle)                                                                   // 707
  }                                                                                                                   // 708
                                                                                                                      // 709
  Dropdown.prototype.toggle = function (e) {                                                                          // 710
    var $this = $(this)                                                                                               // 711
                                                                                                                      // 712
    if ($this.is('.disabled, :disabled')) return                                                                      // 713
                                                                                                                      // 714
    var $parent  = getParent($this)                                                                                   // 715
    var isActive = $parent.hasClass('open')                                                                           // 716
                                                                                                                      // 717
    clearMenus()                                                                                                      // 718
                                                                                                                      // 719
    if (!isActive) {                                                                                                  // 720
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {                     // 721
        // if mobile we use a backdrop because click events don't delegate                                            // 722
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)                            // 723
      }                                                                                                               // 724
                                                                                                                      // 725
      $parent.trigger(e = $.Event('show.bs.dropdown'))                                                                // 726
                                                                                                                      // 727
      if (e.isDefaultPrevented()) return                                                                              // 728
                                                                                                                      // 729
      $parent                                                                                                         // 730
        .toggleClass('open')                                                                                          // 731
        .trigger('shown.bs.dropdown')                                                                                 // 732
                                                                                                                      // 733
      $this.focus()                                                                                                   // 734
    }                                                                                                                 // 735
                                                                                                                      // 736
    return false                                                                                                      // 737
  }                                                                                                                   // 738
                                                                                                                      // 739
  Dropdown.prototype.keydown = function (e) {                                                                         // 740
    if (!/(38|40|27)/.test(e.keyCode)) return                                                                         // 741
                                                                                                                      // 742
    var $this = $(this)                                                                                               // 743
                                                                                                                      // 744
    e.preventDefault()                                                                                                // 745
    e.stopPropagation()                                                                                               // 746
                                                                                                                      // 747
    if ($this.is('.disabled, :disabled')) return                                                                      // 748
                                                                                                                      // 749
    var $parent  = getParent($this)                                                                                   // 750
    var isActive = $parent.hasClass('open')                                                                           // 751
                                                                                                                      // 752
    if (!isActive || (isActive && e.keyCode == 27)) {                                                                 // 753
      if (e.which == 27) $parent.find(toggle).focus()                                                                 // 754
      return $this.click()                                                                                            // 755
    }                                                                                                                 // 756
                                                                                                                      // 757
    var $items = $('[role=menu] li:not(.divider):visible a', $parent)                                                 // 758
                                                                                                                      // 759
    if (!$items.length) return                                                                                        // 760
                                                                                                                      // 761
    var index = $items.index($items.filter(':focus'))                                                                 // 762
                                                                                                                      // 763
    if (e.keyCode == 38 && index > 0)                 index--                        // up                            // 764
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down                          // 765
    if (!~index)                                      index=0                                                         // 766
                                                                                                                      // 767
    $items.eq(index).focus()                                                                                          // 768
  }                                                                                                                   // 769
                                                                                                                      // 770
  function clearMenus() {                                                                                             // 771
    $(backdrop).remove()                                                                                              // 772
    $(toggle).each(function (e) {                                                                                     // 773
      var $parent = getParent($(this))                                                                                // 774
      if (!$parent.hasClass('open')) return                                                                           // 775
      $parent.trigger(e = $.Event('hide.bs.dropdown'))                                                                // 776
      if (e.isDefaultPrevented()) return                                                                              // 777
      $parent.removeClass('open').trigger('hidden.bs.dropdown')                                                       // 778
    })                                                                                                                // 779
  }                                                                                                                   // 780
                                                                                                                      // 781
  function getParent($this) {                                                                                         // 782
    var selector = $this.attr('data-target')                                                                          // 783
                                                                                                                      // 784
    if (!selector) {                                                                                                  // 785
      selector = $this.attr('href')                                                                                   // 786
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7             // 787
    }                                                                                                                 // 788
                                                                                                                      // 789
    var $parent = selector && $(selector)                                                                             // 790
                                                                                                                      // 791
    return $parent && $parent.length ? $parent : $this.parent()                                                       // 792
  }                                                                                                                   // 793
                                                                                                                      // 794
                                                                                                                      // 795
  // DROPDOWN PLUGIN DEFINITION                                                                                       // 796
  // ==========================                                                                                       // 797
                                                                                                                      // 798
  var old = $.fn.dropdown                                                                                             // 799
                                                                                                                      // 800
  $.fn.dropdown = function (option) {                                                                                 // 801
    return this.each(function () {                                                                                    // 802
      var $this = $(this)                                                                                             // 803
      var data  = $this.data('bs.dropdown')                                                                           // 804
                                                                                                                      // 805
      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))                                               // 806
      if (typeof option == 'string') data[option].call($this)                                                         // 807
    })                                                                                                                // 808
  }                                                                                                                   // 809
                                                                                                                      // 810
  $.fn.dropdown.Constructor = Dropdown                                                                                // 811
                                                                                                                      // 812
                                                                                                                      // 813
  // DROPDOWN NO CONFLICT                                                                                             // 814
  // ====================                                                                                             // 815
                                                                                                                      // 816
  $.fn.dropdown.noConflict = function () {                                                                            // 817
    $.fn.dropdown = old                                                                                               // 818
    return this                                                                                                       // 819
  }                                                                                                                   // 820
                                                                                                                      // 821
                                                                                                                      // 822
  // APPLY TO STANDARD DROPDOWN ELEMENTS                                                                              // 823
  // ===================================                                                                              // 824
                                                                                                                      // 825
  $(document)                                                                                                         // 826
    .on('click.bs.dropdown.data-api', clearMenus)                                                                     // 827
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })                         // 828
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)                                            // 829
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)                        // 830
                                                                                                                      // 831
}(jQuery);                                                                                                            // 832
                                                                                                                      // 833
/* ========================================================================                                           // 834
 * Bootstrap: modal.js v3.0.3                                                                                         // 835
 * http://getbootstrap.com/javascript/#modals                                                                         // 836
 * ========================================================================                                           // 837
 * Copyright 2013 Twitter, Inc.                                                                                       // 838
 *                                                                                                                    // 839
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 840
 * you may not use this file except in compliance with the License.                                                   // 841
 * You may obtain a copy of the License at                                                                            // 842
 *                                                                                                                    // 843
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 844
 *                                                                                                                    // 845
 * Unless required by applicable law or agreed to in writing, software                                                // 846
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 847
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 848
 * See the License for the specific language governing permissions and                                                // 849
 * limitations under the License.                                                                                     // 850
 * ======================================================================== */                                        // 851
                                                                                                                      // 852
                                                                                                                      // 853
+function ($) { "use strict";                                                                                         // 854
                                                                                                                      // 855
  // MODAL CLASS DEFINITION                                                                                           // 856
  // ======================                                                                                           // 857
                                                                                                                      // 858
  var Modal = function (element, options) {                                                                           // 859
    this.options   = options                                                                                          // 860
    this.$element  = $(element)                                                                                       // 861
    this.$backdrop =                                                                                                  // 862
    this.isShown   = null                                                                                             // 863
                                                                                                                      // 864
    if (this.options.remote) this.$element.load(this.options.remote)                                                  // 865
  }                                                                                                                   // 866
                                                                                                                      // 867
  Modal.DEFAULTS = {                                                                                                  // 868
      backdrop: true                                                                                                  // 869
    , keyboard: true                                                                                                  // 870
    , show: true                                                                                                      // 871
  }                                                                                                                   // 872
                                                                                                                      // 873
  Modal.prototype.toggle = function (_relatedTarget) {                                                                // 874
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)                                                      // 875
  }                                                                                                                   // 876
                                                                                                                      // 877
  Modal.prototype.show = function (_relatedTarget) {                                                                  // 878
    var that = this                                                                                                   // 879
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })                                            // 880
                                                                                                                      // 881
    this.$element.trigger(e)                                                                                          // 882
                                                                                                                      // 883
    if (this.isShown || e.isDefaultPrevented()) return                                                                // 884
                                                                                                                      // 885
    this.isShown = true                                                                                               // 886
                                                                                                                      // 887
    this.escape()                                                                                                     // 888
                                                                                                                      // 889
    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))                       // 890
                                                                                                                      // 891
    this.backdrop(function () {                                                                                       // 892
      var transition = $.support.transition && that.$element.hasClass('fade')                                         // 893
                                                                                                                      // 894
      if (!that.$element.parent().length) {                                                                           // 895
        that.$element.appendTo(document.body) // don't move modals dom position                                       // 896
      }                                                                                                               // 897
                                                                                                                      // 898
      that.$element.show()                                                                                            // 899
                                                                                                                      // 900
      if (transition) {                                                                                               // 901
        that.$element[0].offsetWidth // force reflow                                                                  // 902
      }                                                                                                               // 903
                                                                                                                      // 904
      that.$element                                                                                                   // 905
        .addClass('in')                                                                                               // 906
        .attr('aria-hidden', false)                                                                                   // 907
                                                                                                                      // 908
      that.enforceFocus()                                                                                             // 909
                                                                                                                      // 910
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })                                            // 911
                                                                                                                      // 912
      transition ?                                                                                                    // 913
        that.$element.find('.modal-dialog') // wait for modal to slide in                                             // 914
          .one($.support.transition.end, function () {                                                                // 915
            that.$element.focus().trigger(e)                                                                          // 916
          })                                                                                                          // 917
          .emulateTransitionEnd(300) :                                                                                // 918
        that.$element.focus().trigger(e)                                                                              // 919
    })                                                                                                                // 920
  }                                                                                                                   // 921
                                                                                                                      // 922
  Modal.prototype.hide = function (e) {                                                                               // 923
    if (e) e.preventDefault()                                                                                         // 924
                                                                                                                      // 925
    e = $.Event('hide.bs.modal')                                                                                      // 926
                                                                                                                      // 927
    this.$element.trigger(e)                                                                                          // 928
                                                                                                                      // 929
    if (!this.isShown || e.isDefaultPrevented()) return                                                               // 930
                                                                                                                      // 931
    this.isShown = false                                                                                              // 932
                                                                                                                      // 933
    this.escape()                                                                                                     // 934
                                                                                                                      // 935
    $(document).off('focusin.bs.modal')                                                                               // 936
                                                                                                                      // 937
    this.$element                                                                                                     // 938
      .removeClass('in')                                                                                              // 939
      .attr('aria-hidden', true)                                                                                      // 940
      .off('click.dismiss.modal')                                                                                     // 941
                                                                                                                      // 942
    $.support.transition && this.$element.hasClass('fade') ?                                                          // 943
      this.$element                                                                                                   // 944
        .one($.support.transition.end, $.proxy(this.hideModal, this))                                                 // 945
        .emulateTransitionEnd(300) :                                                                                  // 946
      this.hideModal()                                                                                                // 947
  }                                                                                                                   // 948
                                                                                                                      // 949
  Modal.prototype.enforceFocus = function () {                                                                        // 950
    $(document)                                                                                                       // 951
      .off('focusin.bs.modal') // guard against infinite focus loop                                                   // 952
      .on('focusin.bs.modal', $.proxy(function (e) {                                                                  // 953
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {                                   // 954
          this.$element.focus()                                                                                       // 955
        }                                                                                                             // 956
      }, this))                                                                                                       // 957
  }                                                                                                                   // 958
                                                                                                                      // 959
  Modal.prototype.escape = function () {                                                                              // 960
    if (this.isShown && this.options.keyboard) {                                                                      // 961
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {                                               // 962
        e.which == 27 && this.hide()                                                                                  // 963
      }, this))                                                                                                       // 964
    } else if (!this.isShown) {                                                                                       // 965
      this.$element.off('keyup.dismiss.bs.modal')                                                                     // 966
    }                                                                                                                 // 967
  }                                                                                                                   // 968
                                                                                                                      // 969
  Modal.prototype.hideModal = function () {                                                                           // 970
    var that = this                                                                                                   // 971
    this.$element.hide()                                                                                              // 972
    this.backdrop(function () {                                                                                       // 973
      that.removeBackdrop()                                                                                           // 974
      that.$element.trigger('hidden.bs.modal')                                                                        // 975
    })                                                                                                                // 976
  }                                                                                                                   // 977
                                                                                                                      // 978
  Modal.prototype.removeBackdrop = function () {                                                                      // 979
    this.$backdrop && this.$backdrop.remove()                                                                         // 980
    this.$backdrop = null                                                                                             // 981
  }                                                                                                                   // 982
                                                                                                                      // 983
  Modal.prototype.backdrop = function (callback) {                                                                    // 984
    var that    = this                                                                                                // 985
    var animate = this.$element.hasClass('fade') ? 'fade' : ''                                                        // 986
                                                                                                                      // 987
    if (this.isShown && this.options.backdrop) {                                                                      // 988
      var doAnimate = $.support.transition && animate                                                                 // 989
                                                                                                                      // 990
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')                                            // 991
        .appendTo(document.body)                                                                                      // 992
                                                                                                                      // 993
      this.$element.on('click.dismiss.modal', $.proxy(function (e) {                                                  // 994
        if (e.target !== e.currentTarget) return                                                                      // 995
        this.options.backdrop == 'static'                                                                             // 996
          ? this.$element[0].focus.call(this.$element[0])                                                             // 997
          : this.hide.call(this)                                                                                      // 998
      }, this))                                                                                                       // 999
                                                                                                                      // 1000
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow                                                    // 1001
                                                                                                                      // 1002
      this.$backdrop.addClass('in')                                                                                   // 1003
                                                                                                                      // 1004
      if (!callback) return                                                                                           // 1005
                                                                                                                      // 1006
      doAnimate ?                                                                                                     // 1007
        this.$backdrop                                                                                                // 1008
          .one($.support.transition.end, callback)                                                                    // 1009
          .emulateTransitionEnd(150) :                                                                                // 1010
        callback()                                                                                                    // 1011
                                                                                                                      // 1012
    } else if (!this.isShown && this.$backdrop) {                                                                     // 1013
      this.$backdrop.removeClass('in')                                                                                // 1014
                                                                                                                      // 1015
      $.support.transition && this.$element.hasClass('fade')?                                                         // 1016
        this.$backdrop                                                                                                // 1017
          .one($.support.transition.end, callback)                                                                    // 1018
          .emulateTransitionEnd(150) :                                                                                // 1019
        callback()                                                                                                    // 1020
                                                                                                                      // 1021
    } else if (callback) {                                                                                            // 1022
      callback()                                                                                                      // 1023
    }                                                                                                                 // 1024
  }                                                                                                                   // 1025
                                                                                                                      // 1026
                                                                                                                      // 1027
  // MODAL PLUGIN DEFINITION                                                                                          // 1028
  // =======================                                                                                          // 1029
                                                                                                                      // 1030
  var old = $.fn.modal                                                                                                // 1031
                                                                                                                      // 1032
  $.fn.modal = function (option, _relatedTarget) {                                                                    // 1033
    return this.each(function () {                                                                                    // 1034
      var $this   = $(this)                                                                                           // 1035
      var data    = $this.data('bs.modal')                                                                            // 1036
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)                   // 1037
                                                                                                                      // 1038
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))                                            // 1039
      if (typeof option == 'string') data[option](_relatedTarget)                                                     // 1040
      else if (options.show) data.show(_relatedTarget)                                                                // 1041
    })                                                                                                                // 1042
  }                                                                                                                   // 1043
                                                                                                                      // 1044
  $.fn.modal.Constructor = Modal                                                                                      // 1045
                                                                                                                      // 1046
                                                                                                                      // 1047
  // MODAL NO CONFLICT                                                                                                // 1048
  // =================                                                                                                // 1049
                                                                                                                      // 1050
  $.fn.modal.noConflict = function () {                                                                               // 1051
    $.fn.modal = old                                                                                                  // 1052
    return this                                                                                                       // 1053
  }                                                                                                                   // 1054
                                                                                                                      // 1055
                                                                                                                      // 1056
  // MODAL DATA-API                                                                                                   // 1057
  // ==============                                                                                                   // 1058
                                                                                                                      // 1059
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {                                   // 1060
    var $this   = $(this)                                                                                             // 1061
    var href    = $this.attr('href')                                                                                  // 1062
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7        // 1063
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
                                                                                                                      // 1065
    e.preventDefault()                                                                                                // 1066
                                                                                                                      // 1067
    $target                                                                                                           // 1068
      .modal(option, this)                                                                                            // 1069
      .one('hide', function () {                                                                                      // 1070
        $this.is(':visible') && $this.focus()                                                                         // 1071
      })                                                                                                              // 1072
  })                                                                                                                  // 1073
                                                                                                                      // 1074
  $(document)                                                                                                         // 1075
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })                          // 1076
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })                      // 1077
                                                                                                                      // 1078
}(jQuery);                                                                                                            // 1079
                                                                                                                      // 1080
/* ========================================================================                                           // 1081
 * Bootstrap: tooltip.js v3.0.3                                                                                       // 1082
 * http://getbootstrap.com/javascript/#tooltip                                                                        // 1083
 * Inspired by the original jQuery.tipsy by Jason Frame                                                               // 1084
 * ========================================================================                                           // 1085
 * Copyright 2013 Twitter, Inc.                                                                                       // 1086
 *                                                                                                                    // 1087
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 1088
 * you may not use this file except in compliance with the License.                                                   // 1089
 * You may obtain a copy of the License at                                                                            // 1090
 *                                                                                                                    // 1091
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 1092
 *                                                                                                                    // 1093
 * Unless required by applicable law or agreed to in writing, software                                                // 1094
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 1095
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 1096
 * See the License for the specific language governing permissions and                                                // 1097
 * limitations under the License.                                                                                     // 1098
 * ======================================================================== */                                        // 1099
                                                                                                                      // 1100
                                                                                                                      // 1101
+function ($) { "use strict";                                                                                         // 1102
                                                                                                                      // 1103
  // TOOLTIP PUBLIC CLASS DEFINITION                                                                                  // 1104
  // ===============================                                                                                  // 1105
                                                                                                                      // 1106
  var Tooltip = function (element, options) {                                                                         // 1107
    this.type       =                                                                                                 // 1108
    this.options    =                                                                                                 // 1109
    this.enabled    =                                                                                                 // 1110
    this.timeout    =                                                                                                 // 1111
    this.hoverState =                                                                                                 // 1112
    this.$element   = null                                                                                            // 1113
                                                                                                                      // 1114
    this.init('tooltip', element, options)                                                                            // 1115
  }                                                                                                                   // 1116
                                                                                                                      // 1117
  Tooltip.DEFAULTS = {                                                                                                // 1118
    animation: true                                                                                                   // 1119
  , placement: 'top'                                                                                                  // 1120
  , selector: false                                                                                                   // 1121
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'         // 1122
  , trigger: 'hover focus'                                                                                            // 1123
  , title: ''                                                                                                         // 1124
  , delay: 0                                                                                                          // 1125
  , html: false                                                                                                       // 1126
  , container: false                                                                                                  // 1127
  }                                                                                                                   // 1128
                                                                                                                      // 1129
  Tooltip.prototype.init = function (type, element, options) {                                                        // 1130
    this.enabled  = true                                                                                              // 1131
    this.type     = type                                                                                              // 1132
    this.$element = $(element)                                                                                        // 1133
    this.options  = this.getOptions(options)                                                                          // 1134
                                                                                                                      // 1135
    var triggers = this.options.trigger.split(' ')                                                                    // 1136
                                                                                                                      // 1137
    for (var i = triggers.length; i--;) {                                                                             // 1138
      var trigger = triggers[i]                                                                                       // 1139
                                                                                                                      // 1140
      if (trigger == 'click') {                                                                                       // 1141
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))                     // 1142
      } else if (trigger != 'manual') {                                                                               // 1143
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'                                                    // 1144
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'                                                     // 1145
                                                                                                                      // 1146
        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))                // 1147
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))                // 1148
      }                                                                                                               // 1149
    }                                                                                                                 // 1150
                                                                                                                      // 1151
    this.options.selector ?                                                                                           // 1152
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :                             // 1153
      this.fixTitle()                                                                                                 // 1154
  }                                                                                                                   // 1155
                                                                                                                      // 1156
  Tooltip.prototype.getDefaults = function () {                                                                       // 1157
    return Tooltip.DEFAULTS                                                                                           // 1158
  }                                                                                                                   // 1159
                                                                                                                      // 1160
  Tooltip.prototype.getOptions = function (options) {                                                                 // 1161
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)                                         // 1162
                                                                                                                      // 1163
    if (options.delay && typeof options.delay == 'number') {                                                          // 1164
      options.delay = {                                                                                               // 1165
        show: options.delay                                                                                           // 1166
      , hide: options.delay                                                                                           // 1167
      }                                                                                                               // 1168
    }                                                                                                                 // 1169
                                                                                                                      // 1170
    return options                                                                                                    // 1171
  }                                                                                                                   // 1172
                                                                                                                      // 1173
  Tooltip.prototype.getDelegateOptions = function () {                                                                // 1174
    var options  = {}                                                                                                 // 1175
    var defaults = this.getDefaults()                                                                                 // 1176
                                                                                                                      // 1177
    this._options && $.each(this._options, function (key, value) {                                                    // 1178
      if (defaults[key] != value) options[key] = value                                                                // 1179
    })                                                                                                                // 1180
                                                                                                                      // 1181
    return options                                                                                                    // 1182
  }                                                                                                                   // 1183
                                                                                                                      // 1184
  Tooltip.prototype.enter = function (obj) {                                                                          // 1185
    var self = obj instanceof this.constructor ?                                                                      // 1186
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)                        // 1187
                                                                                                                      // 1188
    clearTimeout(self.timeout)                                                                                        // 1189
                                                                                                                      // 1190
    self.hoverState = 'in'                                                                                            // 1191
                                                                                                                      // 1192
    if (!self.options.delay || !self.options.delay.show) return self.show()                                           // 1193
                                                                                                                      // 1194
    self.timeout = setTimeout(function () {                                                                           // 1195
      if (self.hoverState == 'in') self.show()                                                                        // 1196
    }, self.options.delay.show)                                                                                       // 1197
  }                                                                                                                   // 1198
                                                                                                                      // 1199
  Tooltip.prototype.leave = function (obj) {                                                                          // 1200
    var self = obj instanceof this.constructor ?                                                                      // 1201
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)                        // 1202
                                                                                                                      // 1203
    clearTimeout(self.timeout)                                                                                        // 1204
                                                                                                                      // 1205
    self.hoverState = 'out'                                                                                           // 1206
                                                                                                                      // 1207
    if (!self.options.delay || !self.options.delay.hide) return self.hide()                                           // 1208
                                                                                                                      // 1209
    self.timeout = setTimeout(function () {                                                                           // 1210
      if (self.hoverState == 'out') self.hide()                                                                       // 1211
    }, self.options.delay.hide)                                                                                       // 1212
  }                                                                                                                   // 1213
                                                                                                                      // 1214
  Tooltip.prototype.show = function () {                                                                              // 1215
    var e = $.Event('show.bs.'+ this.type)                                                                            // 1216
                                                                                                                      // 1217
    if (this.hasContent() && this.enabled) {                                                                          // 1218
      this.$element.trigger(e)                                                                                        // 1219
                                                                                                                      // 1220
      if (e.isDefaultPrevented()) return                                                                              // 1221
                                                                                                                      // 1222
      var $tip = this.tip()                                                                                           // 1223
                                                                                                                      // 1224
      this.setContent()                                                                                               // 1225
                                                                                                                      // 1226
      if (this.options.animation) $tip.addClass('fade')                                                               // 1227
                                                                                                                      // 1228
      var placement = typeof this.options.placement == 'function' ?                                                   // 1229
        this.options.placement.call(this, $tip[0], this.$element[0]) :                                                // 1230
        this.options.placement                                                                                        // 1231
                                                                                                                      // 1232
      var autoToken = /\s?auto?\s?/i                                                                                  // 1233
      var autoPlace = autoToken.test(placement)                                                                       // 1234
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'                                            // 1235
                                                                                                                      // 1236
      $tip                                                                                                            // 1237
        .detach()                                                                                                     // 1238
        .css({ top: 0, left: 0, display: 'block' })                                                                   // 1239
        .addClass(placement)                                                                                          // 1240
                                                                                                                      // 1241
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)                // 1242
                                                                                                                      // 1243
      var pos          = this.getPosition()                                                                           // 1244
      var actualWidth  = $tip[0].offsetWidth                                                                          // 1245
      var actualHeight = $tip[0].offsetHeight                                                                         // 1246
                                                                                                                      // 1247
      if (autoPlace) {                                                                                                // 1248
        var $parent = this.$element.parent()                                                                          // 1249
                                                                                                                      // 1250
        var orgPlacement = placement                                                                                  // 1251
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop                              // 1252
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()               // 1253
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()              // 1254
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left                               // 1255
                                                                                                                      // 1256
        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement                                                                                         // 1261
                                                                                                                      // 1262
        $tip                                                                                                          // 1263
          .removeClass(orgPlacement)                                                                                  // 1264
          .addClass(placement)                                                                                        // 1265
      }                                                                                                               // 1266
                                                                                                                      // 1267
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)                      // 1268
                                                                                                                      // 1269
      this.applyPlacement(calculatedOffset, placement)                                                                // 1270
      this.$element.trigger('shown.bs.' + this.type)                                                                  // 1271
    }                                                                                                                 // 1272
  }                                                                                                                   // 1273
                                                                                                                      // 1274
  Tooltip.prototype.applyPlacement = function(offset, placement) {                                                    // 1275
    var replace                                                                                                       // 1276
    var $tip   = this.tip()                                                                                           // 1277
    var width  = $tip[0].offsetWidth                                                                                  // 1278
    var height = $tip[0].offsetHeight                                                                                 // 1279
                                                                                                                      // 1280
    // manually read margins because getBoundingClientRect includes difference                                        // 1281
    var marginTop = parseInt($tip.css('margin-top'), 10)                                                              // 1282
    var marginLeft = parseInt($tip.css('margin-left'), 10)                                                            // 1283
                                                                                                                      // 1284
    // we must check for NaN for ie 8/9                                                                               // 1285
    if (isNaN(marginTop))  marginTop  = 0                                                                             // 1286
    if (isNaN(marginLeft)) marginLeft = 0                                                                             // 1287
                                                                                                                      // 1288
    offset.top  = offset.top  + marginTop                                                                             // 1289
    offset.left = offset.left + marginLeft                                                                            // 1290
                                                                                                                      // 1291
    $tip                                                                                                              // 1292
      .offset(offset)                                                                                                 // 1293
      .addClass('in')                                                                                                 // 1294
                                                                                                                      // 1295
    // check to see if placing tip in new offset caused the tip to resize itself                                      // 1296
    var actualWidth  = $tip[0].offsetWidth                                                                            // 1297
    var actualHeight = $tip[0].offsetHeight                                                                           // 1298
                                                                                                                      // 1299
    if (placement == 'top' && actualHeight != height) {                                                               // 1300
      replace = true                                                                                                  // 1301
      offset.top = offset.top + height - actualHeight                                                                 // 1302
    }                                                                                                                 // 1303
                                                                                                                      // 1304
    if (/bottom|top/.test(placement)) {                                                                               // 1305
      var delta = 0                                                                                                   // 1306
                                                                                                                      // 1307
      if (offset.left < 0) {                                                                                          // 1308
        delta       = offset.left * -2                                                                                // 1309
        offset.left = 0                                                                                               // 1310
                                                                                                                      // 1311
        $tip.offset(offset)                                                                                           // 1312
                                                                                                                      // 1313
        actualWidth  = $tip[0].offsetWidth                                                                            // 1314
        actualHeight = $tip[0].offsetHeight                                                                           // 1315
      }                                                                                                               // 1316
                                                                                                                      // 1317
      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')                                             // 1318
    } else {                                                                                                          // 1319
      this.replaceArrow(actualHeight - height, actualHeight, 'top')                                                   // 1320
    }                                                                                                                 // 1321
                                                                                                                      // 1322
    if (replace) $tip.offset(offset)                                                                                  // 1323
  }                                                                                                                   // 1324
                                                                                                                      // 1325
  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {                                             // 1326
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')                                     // 1327
  }                                                                                                                   // 1328
                                                                                                                      // 1329
  Tooltip.prototype.setContent = function () {                                                                        // 1330
    var $tip  = this.tip()                                                                                            // 1331
    var title = this.getTitle()                                                                                       // 1332
                                                                                                                      // 1333
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)                                           // 1334
    $tip.removeClass('fade in top bottom left right')                                                                 // 1335
  }                                                                                                                   // 1336
                                                                                                                      // 1337
  Tooltip.prototype.hide = function () {                                                                              // 1338
    var that = this                                                                                                   // 1339
    var $tip = this.tip()                                                                                             // 1340
    var e    = $.Event('hide.bs.' + this.type)                                                                        // 1341
                                                                                                                      // 1342
    function complete() {                                                                                             // 1343
      if (that.hoverState != 'in') $tip.detach()                                                                      // 1344
    }                                                                                                                 // 1345
                                                                                                                      // 1346
    this.$element.trigger(e)                                                                                          // 1347
                                                                                                                      // 1348
    if (e.isDefaultPrevented()) return                                                                                // 1349
                                                                                                                      // 1350
    $tip.removeClass('in')                                                                                            // 1351
                                                                                                                      // 1352
    $.support.transition && this.$tip.hasClass('fade') ?                                                              // 1353
      $tip                                                                                                            // 1354
        .one($.support.transition.end, complete)                                                                      // 1355
        .emulateTransitionEnd(150) :                                                                                  // 1356
      complete()                                                                                                      // 1357
                                                                                                                      // 1358
    this.$element.trigger('hidden.bs.' + this.type)                                                                   // 1359
                                                                                                                      // 1360
    return this                                                                                                       // 1361
  }                                                                                                                   // 1362
                                                                                                                      // 1363
  Tooltip.prototype.fixTitle = function () {                                                                          // 1364
    var $e = this.$element                                                                                            // 1365
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {                                     // 1366
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')                                        // 1367
    }                                                                                                                 // 1368
  }                                                                                                                   // 1369
                                                                                                                      // 1370
  Tooltip.prototype.hasContent = function () {                                                                        // 1371
    return this.getTitle()                                                                                            // 1372
  }                                                                                                                   // 1373
                                                                                                                      // 1374
  Tooltip.prototype.getPosition = function () {                                                                       // 1375
    var el = this.$element[0]                                                                                         // 1376
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {              // 1377
      width: el.offsetWidth                                                                                           // 1378
    , height: el.offsetHeight                                                                                         // 1379
    }, this.$element.offset())                                                                                        // 1380
  }                                                                                                                   // 1381
                                                                                                                      // 1382
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {                      // 1383
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   } // 1387
  }                                                                                                                   // 1388
                                                                                                                      // 1389
  Tooltip.prototype.getTitle = function () {                                                                          // 1390
    var title                                                                                                         // 1391
    var $e = this.$element                                                                                            // 1392
    var o  = this.options                                                                                             // 1393
                                                                                                                      // 1394
    title = $e.attr('data-original-title')                                                                            // 1395
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)                                              // 1396
                                                                                                                      // 1397
    return title                                                                                                      // 1398
  }                                                                                                                   // 1399
                                                                                                                      // 1400
  Tooltip.prototype.tip = function () {                                                                               // 1401
    return this.$tip = this.$tip || $(this.options.template)                                                          // 1402
  }                                                                                                                   // 1403
                                                                                                                      // 1404
  Tooltip.prototype.arrow = function () {                                                                             // 1405
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')                                             // 1406
  }                                                                                                                   // 1407
                                                                                                                      // 1408
  Tooltip.prototype.validate = function () {                                                                          // 1409
    if (!this.$element[0].parentNode) {                                                                               // 1410
      this.hide()                                                                                                     // 1411
      this.$element = null                                                                                            // 1412
      this.options  = null                                                                                            // 1413
    }                                                                                                                 // 1414
  }                                                                                                                   // 1415
                                                                                                                      // 1416
  Tooltip.prototype.enable = function () {                                                                            // 1417
    this.enabled = true                                                                                               // 1418
  }                                                                                                                   // 1419
                                                                                                                      // 1420
  Tooltip.prototype.disable = function () {                                                                           // 1421
    this.enabled = false                                                                                              // 1422
  }                                                                                                                   // 1423
                                                                                                                      // 1424
  Tooltip.prototype.toggleEnabled = function () {                                                                     // 1425
    this.enabled = !this.enabled                                                                                      // 1426
  }                                                                                                                   // 1427
                                                                                                                      // 1428
  Tooltip.prototype.toggle = function (e) {                                                                           // 1429
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this            // 1430
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)                                                   // 1431
  }                                                                                                                   // 1432
                                                                                                                      // 1433
  Tooltip.prototype.destroy = function () {                                                                           // 1434
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)                                           // 1435
  }                                                                                                                   // 1436
                                                                                                                      // 1437
                                                                                                                      // 1438
  // TOOLTIP PLUGIN DEFINITION                                                                                        // 1439
  // =========================                                                                                        // 1440
                                                                                                                      // 1441
  var old = $.fn.tooltip                                                                                              // 1442
                                                                                                                      // 1443
  $.fn.tooltip = function (option) {                                                                                  // 1444
    return this.each(function () {                                                                                    // 1445
      var $this   = $(this)                                                                                           // 1446
      var data    = $this.data('bs.tooltip')                                                                          // 1447
      var options = typeof option == 'object' && option                                                               // 1448
                                                                                                                      // 1449
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))                                        // 1450
      if (typeof option == 'string') data[option]()                                                                   // 1451
    })                                                                                                                // 1452
  }                                                                                                                   // 1453
                                                                                                                      // 1454
  $.fn.tooltip.Constructor = Tooltip                                                                                  // 1455
                                                                                                                      // 1456
                                                                                                                      // 1457
  // TOOLTIP NO CONFLICT                                                                                              // 1458
  // ===================                                                                                              // 1459
                                                                                                                      // 1460
  $.fn.tooltip.noConflict = function () {                                                                             // 1461
    $.fn.tooltip = old                                                                                                // 1462
    return this                                                                                                       // 1463
  }                                                                                                                   // 1464
                                                                                                                      // 1465
}(jQuery);                                                                                                            // 1466
                                                                                                                      // 1467
/* ========================================================================                                           // 1468
 * Bootstrap: popover.js v3.0.3                                                                                       // 1469
 * http://getbootstrap.com/javascript/#popovers                                                                       // 1470
 * ========================================================================                                           // 1471
 * Copyright 2013 Twitter, Inc.                                                                                       // 1472
 *                                                                                                                    // 1473
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 1474
 * you may not use this file except in compliance with the License.                                                   // 1475
 * You may obtain a copy of the License at                                                                            // 1476
 *                                                                                                                    // 1477
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 1478
 *                                                                                                                    // 1479
 * Unless required by applicable law or agreed to in writing, software                                                // 1480
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 1481
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 1482
 * See the License for the specific language governing permissions and                                                // 1483
 * limitations under the License.                                                                                     // 1484
 * ======================================================================== */                                        // 1485
                                                                                                                      // 1486
                                                                                                                      // 1487
+function ($) { "use strict";                                                                                         // 1488
                                                                                                                      // 1489
  // POPOVER PUBLIC CLASS DEFINITION                                                                                  // 1490
  // ===============================                                                                                  // 1491
                                                                                                                      // 1492
  var Popover = function (element, options) {                                                                         // 1493
    this.init('popover', element, options)                                                                            // 1494
  }                                                                                                                   // 1495
                                                                                                                      // 1496
  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')                                                   // 1497
                                                                                                                      // 1498
  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {                                               // 1499
    placement: 'right'                                                                                                // 1500
  , trigger: 'click'                                                                                                  // 1501
  , content: ''                                                                                                       // 1502
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })                                                                                                                  // 1504
                                                                                                                      // 1505
                                                                                                                      // 1506
  // NOTE: POPOVER EXTENDS tooltip.js                                                                                 // 1507
  // ================================                                                                                 // 1508
                                                                                                                      // 1509
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)                                                // 1510
                                                                                                                      // 1511
  Popover.prototype.constructor = Popover                                                                             // 1512
                                                                                                                      // 1513
  Popover.prototype.getDefaults = function () {                                                                       // 1514
    return Popover.DEFAULTS                                                                                           // 1515
  }                                                                                                                   // 1516
                                                                                                                      // 1517
  Popover.prototype.setContent = function () {                                                                        // 1518
    var $tip    = this.tip()                                                                                          // 1519
    var title   = this.getTitle()                                                                                     // 1520
    var content = this.getContent()                                                                                   // 1521
                                                                                                                      // 1522
    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)                                           // 1523
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)                                       // 1524
                                                                                                                      // 1525
    $tip.removeClass('fade top bottom left right in')                                                                 // 1526
                                                                                                                      // 1527
    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do                                      // 1528
    // this manually by checking the contents.                                                                        // 1529
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()                                       // 1530
  }                                                                                                                   // 1531
                                                                                                                      // 1532
  Popover.prototype.hasContent = function () {                                                                        // 1533
    return this.getTitle() || this.getContent()                                                                       // 1534
  }                                                                                                                   // 1535
                                                                                                                      // 1536
  Popover.prototype.getContent = function () {                                                                        // 1537
    var $e = this.$element                                                                                            // 1538
    var o  = this.options                                                                                             // 1539
                                                                                                                      // 1540
    return $e.attr('data-content')                                                                                    // 1541
      || (typeof o.content == 'function' ?                                                                            // 1542
            o.content.call($e[0]) :                                                                                   // 1543
            o.content)                                                                                                // 1544
  }                                                                                                                   // 1545
                                                                                                                      // 1546
  Popover.prototype.arrow = function () {                                                                             // 1547
    return this.$arrow = this.$arrow || this.tip().find('.arrow')                                                     // 1548
  }                                                                                                                   // 1549
                                                                                                                      // 1550
  Popover.prototype.tip = function () {                                                                               // 1551
    if (!this.$tip) this.$tip = $(this.options.template)                                                              // 1552
    return this.$tip                                                                                                  // 1553
  }                                                                                                                   // 1554
                                                                                                                      // 1555
                                                                                                                      // 1556
  // POPOVER PLUGIN DEFINITION                                                                                        // 1557
  // =========================                                                                                        // 1558
                                                                                                                      // 1559
  var old = $.fn.popover                                                                                              // 1560
                                                                                                                      // 1561
  $.fn.popover = function (option) {                                                                                  // 1562
    return this.each(function () {                                                                                    // 1563
      var $this   = $(this)                                                                                           // 1564
      var data    = $this.data('bs.popover')                                                                          // 1565
      var options = typeof option == 'object' && option                                                               // 1566
                                                                                                                      // 1567
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))                                        // 1568
      if (typeof option == 'string') data[option]()                                                                   // 1569
    })                                                                                                                // 1570
  }                                                                                                                   // 1571
                                                                                                                      // 1572
  $.fn.popover.Constructor = Popover                                                                                  // 1573
                                                                                                                      // 1574
                                                                                                                      // 1575
  // POPOVER NO CONFLICT                                                                                              // 1576
  // ===================                                                                                              // 1577
                                                                                                                      // 1578
  $.fn.popover.noConflict = function () {                                                                             // 1579
    $.fn.popover = old                                                                                                // 1580
    return this                                                                                                       // 1581
  }                                                                                                                   // 1582
                                                                                                                      // 1583
}(jQuery);                                                                                                            // 1584
                                                                                                                      // 1585
/* ========================================================================                                           // 1586
 * Bootstrap: scrollspy.js v3.0.3                                                                                     // 1587
 * http://getbootstrap.com/javascript/#scrollspy                                                                      // 1588
 * ========================================================================                                           // 1589
 * Copyright 2013 Twitter, Inc.                                                                                       // 1590
 *                                                                                                                    // 1591
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 1592
 * you may not use this file except in compliance with the License.                                                   // 1593
 * You may obtain a copy of the License at                                                                            // 1594
 *                                                                                                                    // 1595
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 1596
 *                                                                                                                    // 1597
 * Unless required by applicable law or agreed to in writing, software                                                // 1598
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 1599
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 1600
 * See the License for the specific language governing permissions and                                                // 1601
 * limitations under the License.                                                                                     // 1602
 * ======================================================================== */                                        // 1603
                                                                                                                      // 1604
                                                                                                                      // 1605
+function ($) { "use strict";                                                                                         // 1606
                                                                                                                      // 1607
  // SCROLLSPY CLASS DEFINITION                                                                                       // 1608
  // ==========================                                                                                       // 1609
                                                                                                                      // 1610
  function ScrollSpy(element, options) {                                                                              // 1611
    var href                                                                                                          // 1612
    var process  = $.proxy(this.process, this)                                                                        // 1613
                                                                                                                      // 1614
    this.$element       = $(element).is('body') ? $(window) : $(element)                                              // 1615
    this.$body          = $('body')                                                                                   // 1616
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)                                  // 1617
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)                                                   // 1618
    this.selector       = (this.options.target                                                                        // 1619
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7                     // 1620
      || '') + ' .nav li > a'                                                                                         // 1621
    this.offsets        = $([])                                                                                       // 1622
    this.targets        = $([])                                                                                       // 1623
    this.activeTarget   = null                                                                                        // 1624
                                                                                                                      // 1625
    this.refresh()                                                                                                    // 1626
    this.process()                                                                                                    // 1627
  }                                                                                                                   // 1628
                                                                                                                      // 1629
  ScrollSpy.DEFAULTS = {                                                                                              // 1630
    offset: 10                                                                                                        // 1631
  }                                                                                                                   // 1632
                                                                                                                      // 1633
  ScrollSpy.prototype.refresh = function () {                                                                         // 1634
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'                                             // 1635
                                                                                                                      // 1636
    this.offsets = $([])                                                                                              // 1637
    this.targets = $([])                                                                                              // 1638
                                                                                                                      // 1639
    var self     = this                                                                                               // 1640
    var $targets = this.$body                                                                                         // 1641
      .find(this.selector)                                                                                            // 1642
      .map(function () {                                                                                              // 1643
        var $el   = $(this)                                                                                           // 1644
        var href  = $el.data('target') || $el.attr('href')                                                            // 1645
        var $href = /^#\w/.test(href) && $(href)                                                                      // 1646
                                                                                                                      // 1647
        return ($href                                                                                                 // 1648
          && $href.length                                                                                             // 1649
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })                                                                                                              // 1651
      .sort(function (a, b) { return a[0] - b[0] })                                                                   // 1652
      .each(function () {                                                                                             // 1653
        self.offsets.push(this[0])                                                                                    // 1654
        self.targets.push(this[1])                                                                                    // 1655
      })                                                                                                              // 1656
  }                                                                                                                   // 1657
                                                                                                                      // 1658
  ScrollSpy.prototype.process = function () {                                                                         // 1659
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset                                          // 1660
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight                              // 1661
    var maxScroll    = scrollHeight - this.$scrollElement.height()                                                    // 1662
    var offsets      = this.offsets                                                                                   // 1663
    var targets      = this.targets                                                                                   // 1664
    var activeTarget = this.activeTarget                                                                              // 1665
    var i                                                                                                             // 1666
                                                                                                                      // 1667
    if (scrollTop >= maxScroll) {                                                                                     // 1668
      return activeTarget != (i = targets.last()[0]) && this.activate(i)                                              // 1669
    }                                                                                                                 // 1670
                                                                                                                      // 1671
    for (i = offsets.length; i--;) {                                                                                  // 1672
      activeTarget != targets[i]                                                                                      // 1673
        && scrollTop >= offsets[i]                                                                                    // 1674
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])                                                           // 1675
        && this.activate( targets[i] )                                                                                // 1676
    }                                                                                                                 // 1677
  }                                                                                                                   // 1678
                                                                                                                      // 1679
  ScrollSpy.prototype.activate = function (target) {                                                                  // 1680
    this.activeTarget = target                                                                                        // 1681
                                                                                                                      // 1682
    $(this.selector)                                                                                                  // 1683
      .parents('.active')                                                                                             // 1684
      .removeClass('active')                                                                                          // 1685
                                                                                                                      // 1686
    var selector = this.selector                                                                                      // 1687
      + '[data-target="' + target + '"],'                                                                             // 1688
      + this.selector + '[href="' + target + '"]'                                                                     // 1689
                                                                                                                      // 1690
    var active = $(selector)                                                                                          // 1691
      .parents('li')                                                                                                  // 1692
      .addClass('active')                                                                                             // 1693
                                                                                                                      // 1694
    if (active.parent('.dropdown-menu').length)  {                                                                    // 1695
      active = active                                                                                                 // 1696
        .closest('li.dropdown')                                                                                       // 1697
        .addClass('active')                                                                                           // 1698
    }                                                                                                                 // 1699
                                                                                                                      // 1700
    active.trigger('activate.bs.scrollspy')                                                                           // 1701
  }                                                                                                                   // 1702
                                                                                                                      // 1703
                                                                                                                      // 1704
  // SCROLLSPY PLUGIN DEFINITION                                                                                      // 1705
  // ===========================                                                                                      // 1706
                                                                                                                      // 1707
  var old = $.fn.scrollspy                                                                                            // 1708
                                                                                                                      // 1709
  $.fn.scrollspy = function (option) {                                                                                // 1710
    return this.each(function () {                                                                                    // 1711
      var $this   = $(this)                                                                                           // 1712
      var data    = $this.data('bs.scrollspy')                                                                        // 1713
      var options = typeof option == 'object' && option                                                               // 1714
                                                                                                                      // 1715
      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))                                    // 1716
      if (typeof option == 'string') data[option]()                                                                   // 1717
    })                                                                                                                // 1718
  }                                                                                                                   // 1719
                                                                                                                      // 1720
  $.fn.scrollspy.Constructor = ScrollSpy                                                                              // 1721
                                                                                                                      // 1722
                                                                                                                      // 1723
  // SCROLLSPY NO CONFLICT                                                                                            // 1724
  // =====================                                                                                            // 1725
                                                                                                                      // 1726
  $.fn.scrollspy.noConflict = function () {                                                                           // 1727
    $.fn.scrollspy = old                                                                                              // 1728
    return this                                                                                                       // 1729
  }                                                                                                                   // 1730
                                                                                                                      // 1731
                                                                                                                      // 1732
  // SCROLLSPY DATA-API                                                                                               // 1733
  // ==================                                                                                               // 1734
                                                                                                                      // 1735
  $(window).on('load', function () {                                                                                  // 1736
    $('[data-spy="scroll"]').each(function () {                                                                       // 1737
      var $spy = $(this)                                                                                              // 1738
      $spy.scrollspy($spy.data())                                                                                     // 1739
    })                                                                                                                // 1740
  })                                                                                                                  // 1741
                                                                                                                      // 1742
}(jQuery);                                                                                                            // 1743
                                                                                                                      // 1744
/* ========================================================================                                           // 1745
 * Bootstrap: tab.js v3.0.3                                                                                           // 1746
 * http://getbootstrap.com/javascript/#tabs                                                                           // 1747
 * ========================================================================                                           // 1748
 * Copyright 2013 Twitter, Inc.                                                                                       // 1749
 *                                                                                                                    // 1750
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 1751
 * you may not use this file except in compliance with the License.                                                   // 1752
 * You may obtain a copy of the License at                                                                            // 1753
 *                                                                                                                    // 1754
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 1755
 *                                                                                                                    // 1756
 * Unless required by applicable law or agreed to in writing, software                                                // 1757
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 1758
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 1759
 * See the License for the specific language governing permissions and                                                // 1760
 * limitations under the License.                                                                                     // 1761
 * ======================================================================== */                                        // 1762
                                                                                                                      // 1763
                                                                                                                      // 1764
+function ($) { "use strict";                                                                                         // 1765
                                                                                                                      // 1766
  // TAB CLASS DEFINITION                                                                                             // 1767
  // ====================                                                                                             // 1768
                                                                                                                      // 1769
  var Tab = function (element) {                                                                                      // 1770
    this.element = $(element)                                                                                         // 1771
  }                                                                                                                   // 1772
                                                                                                                      // 1773
  Tab.prototype.show = function () {                                                                                  // 1774
    var $this    = this.element                                                                                       // 1775
    var $ul      = $this.closest('ul:not(.dropdown-menu)')                                                            // 1776
    var selector = $this.data('target')                                                                               // 1777
                                                                                                                      // 1778
    if (!selector) {                                                                                                  // 1779
      selector = $this.attr('href')                                                                                   // 1780
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7                                   // 1781
    }                                                                                                                 // 1782
                                                                                                                      // 1783
    if ($this.parent('li').hasClass('active')) return                                                                 // 1784
                                                                                                                      // 1785
    var previous = $ul.find('.active:last a')[0]                                                                      // 1786
    var e        = $.Event('show.bs.tab', {                                                                           // 1787
      relatedTarget: previous                                                                                         // 1788
    })                                                                                                                // 1789
                                                                                                                      // 1790
    $this.trigger(e)                                                                                                  // 1791
                                                                                                                      // 1792
    if (e.isDefaultPrevented()) return                                                                                // 1793
                                                                                                                      // 1794
    var $target = $(selector)                                                                                         // 1795
                                                                                                                      // 1796
    this.activate($this.parent('li'), $ul)                                                                            // 1797
    this.activate($target, $target.parent(), function () {                                                            // 1798
      $this.trigger({                                                                                                 // 1799
        type: 'shown.bs.tab'                                                                                          // 1800
      , relatedTarget: previous                                                                                       // 1801
      })                                                                                                              // 1802
    })                                                                                                                // 1803
  }                                                                                                                   // 1804
                                                                                                                      // 1805
  Tab.prototype.activate = function (element, container, callback) {                                                  // 1806
    var $active    = container.find('> .active')                                                                      // 1807
    var transition = callback                                                                                         // 1808
      && $.support.transition                                                                                         // 1809
      && $active.hasClass('fade')                                                                                     // 1810
                                                                                                                      // 1811
    function next() {                                                                                                 // 1812
      $active                                                                                                         // 1813
        .removeClass('active')                                                                                        // 1814
        .find('> .dropdown-menu > .active')                                                                           // 1815
        .removeClass('active')                                                                                        // 1816
                                                                                                                      // 1817
      element.addClass('active')                                                                                      // 1818
                                                                                                                      // 1819
      if (transition) {                                                                                               // 1820
        element[0].offsetWidth // reflow for transition                                                               // 1821
        element.addClass('in')                                                                                        // 1822
      } else {                                                                                                        // 1823
        element.removeClass('fade')                                                                                   // 1824
      }                                                                                                               // 1825
                                                                                                                      // 1826
      if (element.parent('.dropdown-menu')) {                                                                         // 1827
        element.closest('li.dropdown').addClass('active')                                                             // 1828
      }                                                                                                               // 1829
                                                                                                                      // 1830
      callback && callback()                                                                                          // 1831
    }                                                                                                                 // 1832
                                                                                                                      // 1833
    transition ?                                                                                                      // 1834
      $active                                                                                                         // 1835
        .one($.support.transition.end, next)                                                                          // 1836
        .emulateTransitionEnd(150) :                                                                                  // 1837
      next()                                                                                                          // 1838
                                                                                                                      // 1839
    $active.removeClass('in')                                                                                         // 1840
  }                                                                                                                   // 1841
                                                                                                                      // 1842
                                                                                                                      // 1843
  // TAB PLUGIN DEFINITION                                                                                            // 1844
  // =====================                                                                                            // 1845
                                                                                                                      // 1846
  var old = $.fn.tab                                                                                                  // 1847
                                                                                                                      // 1848
  $.fn.tab = function ( option ) {                                                                                    // 1849
    return this.each(function () {                                                                                    // 1850
      var $this = $(this)                                                                                             // 1851
      var data  = $this.data('bs.tab')                                                                                // 1852
                                                                                                                      // 1853
      if (!data) $this.data('bs.tab', (data = new Tab(this)))                                                         // 1854
      if (typeof option == 'string') data[option]()                                                                   // 1855
    })                                                                                                                // 1856
  }                                                                                                                   // 1857
                                                                                                                      // 1858
  $.fn.tab.Constructor = Tab                                                                                          // 1859
                                                                                                                      // 1860
                                                                                                                      // 1861
  // TAB NO CONFLICT                                                                                                  // 1862
  // ===============                                                                                                  // 1863
                                                                                                                      // 1864
  $.fn.tab.noConflict = function () {                                                                                 // 1865
    $.fn.tab = old                                                                                                    // 1866
    return this                                                                                                       // 1867
  }                                                                                                                   // 1868
                                                                                                                      // 1869
                                                                                                                      // 1870
  // TAB DATA-API                                                                                                     // 1871
  // ============                                                                                                     // 1872
                                                                                                                      // 1873
  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {                 // 1874
    e.preventDefault()                                                                                                // 1875
    $(this).tab('show')                                                                                               // 1876
  })                                                                                                                  // 1877
                                                                                                                      // 1878
}(jQuery);                                                                                                            // 1879
                                                                                                                      // 1880
/* ========================================================================                                           // 1881
 * Bootstrap: affix.js v3.0.3                                                                                         // 1882
 * http://getbootstrap.com/javascript/#affix                                                                          // 1883
 * ========================================================================                                           // 1884
 * Copyright 2013 Twitter, Inc.                                                                                       // 1885
 *                                                                                                                    // 1886
 * Licensed under the Apache License, Version 2.0 (the "License");                                                    // 1887
 * you may not use this file except in compliance with the License.                                                   // 1888
 * You may obtain a copy of the License at                                                                            // 1889
 *                                                                                                                    // 1890
 * http://www.apache.org/licenses/LICENSE-2.0                                                                         // 1891
 *                                                                                                                    // 1892
 * Unless required by applicable law or agreed to in writing, software                                                // 1893
 * distributed under the License is distributed on an "AS IS" BASIS,                                                  // 1894
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                           // 1895
 * See the License for the specific language governing permissions and                                                // 1896
 * limitations under the License.                                                                                     // 1897
 * ======================================================================== */                                        // 1898
                                                                                                                      // 1899
                                                                                                                      // 1900
+function ($) { "use strict";                                                                                         // 1901
                                                                                                                      // 1902
  // AFFIX CLASS DEFINITION                                                                                           // 1903
  // ======================                                                                                           // 1904
                                                                                                                      // 1905
  var Affix = function (element, options) {                                                                           // 1906
    this.options = $.extend({}, Affix.DEFAULTS, options)                                                              // 1907
    this.$window = $(window)                                                                                          // 1908
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))                                              // 1909
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))                                 // 1910
                                                                                                                      // 1911
    this.$element = $(element)                                                                                        // 1912
    this.affixed  =                                                                                                   // 1913
    this.unpin    = null                                                                                              // 1914
                                                                                                                      // 1915
    this.checkPosition()                                                                                              // 1916
  }                                                                                                                   // 1917
                                                                                                                      // 1918
  Affix.RESET = 'affix affix-top affix-bottom'                                                                        // 1919
                                                                                                                      // 1920
  Affix.DEFAULTS = {                                                                                                  // 1921
    offset: 0                                                                                                         // 1922
  }                                                                                                                   // 1923
                                                                                                                      // 1924
  Affix.prototype.checkPositionWithEventLoop = function () {                                                          // 1925
    setTimeout($.proxy(this.checkPosition, this), 1)                                                                  // 1926
  }                                                                                                                   // 1927
                                                                                                                      // 1928
  Affix.prototype.checkPosition = function () {                                                                       // 1929
    if (!this.$element.is(':visible')) return                                                                         // 1930
                                                                                                                      // 1931
    var scrollHeight = $(document).height()                                                                           // 1932
    var scrollTop    = this.$window.scrollTop()                                                                       // 1933
    var position     = this.$element.offset()                                                                         // 1934
    var offset       = this.options.offset                                                                            // 1935
    var offsetTop    = offset.top                                                                                     // 1936
    var offsetBottom = offset.bottom                                                                                  // 1937
                                                                                                                      // 1938
    if (typeof offset != 'object')         offsetBottom = offsetTop = offset                                          // 1939
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()                                                // 1940
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()                                             // 1941
                                                                                                                      // 1942
    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :                            // 1943
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false                                      // 1945
                                                                                                                      // 1946
    if (this.affixed === affix) return                                                                                // 1947
    if (this.unpin) this.$element.css('top', '')                                                                      // 1948
                                                                                                                      // 1949
    this.affixed = affix                                                                                              // 1950
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null                                                // 1951
                                                                                                                      // 1952
    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))                             // 1953
                                                                                                                      // 1954
    if (affix == 'bottom') {                                                                                          // 1955
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })               // 1956
    }                                                                                                                 // 1957
  }                                                                                                                   // 1958
                                                                                                                      // 1959
                                                                                                                      // 1960
  // AFFIX PLUGIN DEFINITION                                                                                          // 1961
  // =======================                                                                                          // 1962
                                                                                                                      // 1963
  var old = $.fn.affix                                                                                                // 1964
                                                                                                                      // 1965
  $.fn.affix = function (option) {                                                                                    // 1966
    return this.each(function () {                                                                                    // 1967
      var $this   = $(this)                                                                                           // 1968
      var data    = $this.data('bs.affix')                                                                            // 1969
      var options = typeof option == 'object' && option                                                               // 1970
                                                                                                                      // 1971
      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))                                            // 1972
      if (typeof option == 'string') data[option]()                                                                   // 1973
    })                                                                                                                // 1974
  }                                                                                                                   // 1975
                                                                                                                      // 1976
  $.fn.affix.Constructor = Affix                                                                                      // 1977
                                                                                                                      // 1978
                                                                                                                      // 1979
  // AFFIX NO CONFLICT                                                                                                // 1980
  // =================                                                                                                // 1981
                                                                                                                      // 1982
  $.fn.affix.noConflict = function () {                                                                               // 1983
    $.fn.affix = old                                                                                                  // 1984
    return this                                                                                                       // 1985
  }                                                                                                                   // 1986
                                                                                                                      // 1987
                                                                                                                      // 1988
  // AFFIX DATA-API                                                                                                   // 1989
  // ==============                                                                                                   // 1990
                                                                                                                      // 1991
  $(window).on('load', function () {                                                                                  // 1992
    $('[data-spy="affix"]').each(function () {                                                                        // 1993
      var $spy = $(this)                                                                                              // 1994
      var data = $spy.data()                                                                                          // 1995
                                                                                                                      // 1996
      data.offset = data.offset || {}                                                                                 // 1997
                                                                                                                      // 1998
      if (data.offsetBottom) data.offset.bottom = data.offsetBottom                                                   // 1999
      if (data.offsetTop)    data.offset.top    = data.offsetTop                                                      // 2000
                                                                                                                      // 2001
      $spy.affix(data)                                                                                                // 2002
    })                                                                                                                // 2003
  })                                                                                                                  // 2004
                                                                                                                      // 2005
}(jQuery);                                                                                                            // 2006
                                                                                                                      // 2007
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['bootstrap-3'] = {};

})();

//# sourceMappingURL=f3cd5092b03e7ea72b7cdef53afadc09f6ea88b8.map
