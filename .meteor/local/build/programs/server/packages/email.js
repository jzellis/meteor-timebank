(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var AppConfig = Package['application-configuration'].AppConfig;

/* Package-scope variables */
var Email, EmailTest;

(function () {

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/email/email.js                                                     //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
var Future = Npm.require('fibers/future');                                     // 1
var urlModule = Npm.require('url');                                            // 2
var MailComposer = Npm.require('mailcomposer').MailComposer;                   // 3
                                                                               // 4
Email = {};                                                                    // 5
EmailTest = {};                                                                // 6
                                                                               // 7
var makePool = function (mailUrlString) {                                      // 8
  var mailUrl = urlModule.parse(mailUrlString);                                // 9
  if (mailUrl.protocol !== 'smtp:')                                            // 10
    throw new Error("Email protocol in $MAIL_URL (" +                          // 11
                    mailUrlString + ") must be 'smtp'");                       // 12
                                                                               // 13
  var port = +(mailUrl.port);                                                  // 14
  var auth = false;                                                            // 15
  if (mailUrl.auth) {                                                          // 16
    var parts = mailUrl.auth.split(':', 2);                                    // 17
    auth = {user: parts[0] && decodeURIComponent(parts[0]),                    // 18
            pass: parts[1] && decodeURIComponent(parts[1])};                   // 19
  }                                                                            // 20
                                                                               // 21
  var simplesmtp = Npm.require('simplesmtp');                                  // 22
  var pool = simplesmtp.createClientPool(                                      // 23
    port,  // Defaults to 25                                                   // 24
    mailUrl.hostname,  // Defaults to "localhost"                              // 25
    { secureConnection: (port === 465),                                        // 26
      // XXX allow maxConnections to be configured?                            // 27
      auth: auth });                                                           // 28
                                                                               // 29
  pool._future_wrapped_sendMail = _.bind(Future.wrap(pool.sendMail), pool);    // 30
  return pool;                                                                 // 31
};                                                                             // 32
                                                                               // 33
// We construct smtpPool at the first call to Email.send, so that              // 34
// Meteor.startup code can set $MAIL_URL.                                      // 35
var smtpPoolFuture = new Future;;                                              // 36
var configured = false;                                                        // 37
                                                                               // 38
var getPool = function () {                                                    // 39
  // We check MAIL_URL in case someone else set it in Meteor.startup code.     // 40
  if (!configured) {                                                           // 41
    configured = true;                                                         // 42
    AppConfig.configurePackage('email', function (config) {                    // 43
      // XXX allow reconfiguration when the app config changes                 // 44
      if (smtpPoolFuture.isResolved())                                         // 45
        return;                                                                // 46
      var url = config.url || process.env.MAIL_URL;                            // 47
      var pool = null;                                                         // 48
      if (url)                                                                 // 49
        pool = makePool(url);                                                  // 50
      smtpPoolFuture.return(pool);                                             // 51
    });                                                                        // 52
  }                                                                            // 53
                                                                               // 54
  return smtpPoolFuture.wait();                                                // 55
};                                                                             // 56
                                                                               // 57
var next_devmode_mail_id = 0;                                                  // 58
var output_stream = process.stdout;                                            // 59
                                                                               // 60
// Testing hooks                                                               // 61
EmailTest.overrideOutputStream = function (stream) {                           // 62
  next_devmode_mail_id = 0;                                                    // 63
  output_stream = stream;                                                      // 64
};                                                                             // 65
                                                                               // 66
EmailTest.restoreOutputStream = function () {                                  // 67
  output_stream = process.stdout;                                              // 68
};                                                                             // 69
                                                                               // 70
var devModeSend = function (mc) {                                              // 71
  var devmode_mail_id = next_devmode_mail_id++;                                // 72
                                                                               // 73
  var stream = output_stream;                                                  // 74
                                                                               // 75
  // This approach does not prevent other writers to stdout from interleaving. // 76
  stream.write("====== BEGIN MAIL #" + devmode_mail_id + " ======\n");         // 77
  stream.write("(Mail not sent; to enable sending, set the MAIL_URL " +        // 78
               "environment variable.)\n");                                    // 79
  mc.streamMessage();                                                          // 80
  mc.pipe(stream, {end: false});                                               // 81
  var future = new Future;                                                     // 82
  mc.on('end', function () {                                                   // 83
    stream.write("====== END MAIL #" + devmode_mail_id + " ======\n");         // 84
    future['return']();                                                        // 85
  });                                                                          // 86
  future.wait();                                                               // 87
};                                                                             // 88
                                                                               // 89
var smtpSend = function (pool, mc) {                                           // 90
  pool._future_wrapped_sendMail(mc).wait();                                    // 91
};                                                                             // 92
                                                                               // 93
/**                                                                            // 94
 * Mock out email sending (eg, during a test.) This is private for now.        // 95
 *                                                                             // 96
 * f receives the arguments to Email.send and should return true to go         // 97
 * ahead and send the email (or at least, try subsequent hooks), or            // 98
 * false to skip sending.                                                      // 99
 */                                                                            // 100
var sendHooks = [];                                                            // 101
EmailTest.hookSend = function (f) {                                            // 102
  sendHooks.push(f);                                                           // 103
};                                                                             // 104
                                                                               // 105
/**                                                                            // 106
 * Send an email.                                                              // 107
 *                                                                             // 108
 * Connects to the mail server configured via the MAIL_URL environment         // 109
 * variable. If unset, prints formatted message to stdout. The "from" option   // 110
 * is required, and at least one of "to", "cc", and "bcc" must be provided;    // 111
 * all other options are optional.                                             // 112
 *                                                                             // 113
 * @param options                                                              // 114
 * @param options.from {String} RFC5322 "From:" address                        // 115
 * @param options.to {String|String[]} RFC5322 "To:" address[es]               // 116
 * @param options.cc {String|String[]} RFC5322 "Cc:" address[es]               // 117
 * @param options.bcc {String|String[]} RFC5322 "Bcc:" address[es]             // 118
 * @param options.replyTo {String|String[]} RFC5322 "Reply-To:" address[es]    // 119
 * @param options.subject {String} RFC5322 "Subject:" line                     // 120
 * @param options.text {String} RFC5322 mail body (plain text)                 // 121
 * @param options.html {String} RFC5322 mail body (HTML)                       // 122
 * @param options.headers {Object} custom RFC5322 headers (dictionary)         // 123
 */                                                                            // 124
Email.send = function (options) {                                              // 125
  for (var i = 0; i < sendHooks.length; i++)                                   // 126
    if (! sendHooks[i](options))                                               // 127
      return;                                                                  // 128
                                                                               // 129
  var mc = new MailComposer();                                                 // 130
                                                                               // 131
  // setup message data                                                        // 132
  // XXX support attachments (once we have a client/server-compatible binary   // 133
  //     Buffer class)                                                         // 134
  mc.setMessageOption({                                                        // 135
    from: options.from,                                                        // 136
    to: options.to,                                                            // 137
    cc: options.cc,                                                            // 138
    bcc: options.bcc,                                                          // 139
    replyTo: options.replyTo,                                                  // 140
    subject: options.subject,                                                  // 141
    text: options.text,                                                        // 142
    html: options.html                                                         // 143
  });                                                                          // 144
                                                                               // 145
  _.each(options.headers, function (value, name) {                             // 146
    mc.addHeader(name, value);                                                 // 147
  });                                                                          // 148
                                                                               // 149
  var pool = getPool();                                                        // 150
  if (pool) {                                                                  // 151
    smtpSend(pool, mc);                                                        // 152
  } else {                                                                     // 153
    devModeSend(mc);                                                           // 154
  }                                                                            // 155
};                                                                             // 156
                                                                               // 157
/////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.email = {
  Email: Email,
  EmailTest: EmailTest
};

})();
