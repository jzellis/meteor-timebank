(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var Email = Package.email.Email;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/accounts-password/email_templates.js                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
Accounts.emailTemplates = {                                                                // 1
  from: "Meteor Accounts <no-reply@meteor.com>",                                           // 2
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),           // 3
                                                                                           // 4
  resetPassword: {                                                                         // 5
    subject: function(user) {                                                              // 6
      return "How to reset your password on " + Accounts.emailTemplates.siteName;          // 7
    },                                                                                     // 8
    text: function(user, url) {                                                            // 9
      var greeting = (user.profile && user.profile.name) ?                                 // 10
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 11
      return greeting + "\n"                                                               // 12
        + "\n"                                                                             // 13
        + "To reset your password, simply click the link below.\n"                         // 14
        + "\n"                                                                             // 15
        + url + "\n"                                                                       // 16
        + "\n"                                                                             // 17
        + "Thanks.\n";                                                                     // 18
    }                                                                                      // 19
  },                                                                                       // 20
  verifyEmail: {                                                                           // 21
    subject: function(user) {                                                              // 22
      return "How to verify email address on " + Accounts.emailTemplates.siteName;         // 23
    },                                                                                     // 24
    text: function(user, url) {                                                            // 25
      var greeting = (user.profile && user.profile.name) ?                                 // 26
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 27
      return greeting + "\n"                                                               // 28
        + "\n"                                                                             // 29
        + "To verify your account email, simply click the link below.\n"                   // 30
        + "\n"                                                                             // 31
        + url + "\n"                                                                       // 32
        + "\n"                                                                             // 33
        + "Thanks.\n";                                                                     // 34
    }                                                                                      // 35
  },                                                                                       // 36
  enrollAccount: {                                                                         // 37
    subject: function(user) {                                                              // 38
      return "An account has been created for you on " + Accounts.emailTemplates.siteName; // 39
    },                                                                                     // 40
    text: function(user, url) {                                                            // 41
      var greeting = (user.profile && user.profile.name) ?                                 // 42
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 43
      return greeting + "\n"                                                               // 44
        + "\n"                                                                             // 45
        + "To start using the service, simply click the link below.\n"                     // 46
        + "\n"                                                                             // 47
        + url + "\n"                                                                       // 48
        + "\n"                                                                             // 49
        + "Thanks.\n";                                                                     // 50
    }                                                                                      // 51
  }                                                                                        // 52
};                                                                                         // 53
                                                                                           // 54
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/accounts-password/password_server.js                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/// BCRYPT                                                                                 // 1
                                                                                           // 2
var bcrypt = Npm.require('bcrypt');                                                        // 3
var bcryptHash = Meteor._wrapAsync(bcrypt.hash);                                           // 4
var bcryptCompare = Meteor._wrapAsync(bcrypt.compare);                                     // 5
                                                                                           // 6
// User records have a 'services.password.bcrypt' field on them to hold                    // 7
// their hashed passwords (unless they have a 'services.password.srp'                      // 8
// field, in which case they will be upgraded to bcrypt the next time                      // 9
// they log in).                                                                           // 10
//                                                                                         // 11
// When the client sends a password to the server, it can either be a                      // 12
// string (the plaintext password) or an object with keys 'digest' and                     // 13
// 'algorithm' (must be "sha-256" for now). The Meteor client always sends                 // 14
// password objects { digest: *, algorithm: "sha-256" }, but DDP clients                   // 15
// that don't have access to SHA can just send plaintext passwords as                      // 16
// strings.                                                                                // 17
//                                                                                         // 18
// When the server receives a plaintext password as a string, it always                    // 19
// hashes it with SHA256 before passing it into bcrypt. When the server                    // 20
// receives a password as an object, it asserts that the algorithm is                      // 21
// "sha-256" and then passes the digest to bcrypt.                                         // 22
                                                                                           // 23
                                                                                           // 24
Accounts._bcryptRounds = 10;                                                               // 25
                                                                                           // 26
// Given a 'password' from the client, extract the string that we should                   // 27
// bcrypt. 'password' can be one of:                                                       // 28
//  - String (the plaintext password)                                                      // 29
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".            // 30
//                                                                                         // 31
var getPasswordString = function (password) {                                              // 32
  if (typeof password === "string") {                                                      // 33
    password = SHA256(password);                                                           // 34
  } else { // 'password' is an object                                                      // 35
    if (password.algorithm !== "sha-256") {                                                // 36
      throw new Error("Invalid password hash algorithm. " +                                // 37
                      "Only 'sha-256' is allowed.");                                       // 38
    }                                                                                      // 39
    password = password.digest;                                                            // 40
  }                                                                                        // 41
  return password;                                                                         // 42
};                                                                                         // 43
                                                                                           // 44
// Use bcrypt to hash the password for storage in the database.                            // 45
// `password` can be a string (in which case it will be run through                        // 46
// SHA256 before bcrypt) or an object with properties `digest` and                         // 47
// `algorithm` (in which case we bcrypt `password.digest`).                                // 48
//                                                                                         // 49
var hashPassword = function (password) {                                                   // 50
  password = getPasswordString(password);                                                  // 51
  return bcryptHash(password, Accounts._bcryptRounds);                                     // 52
};                                                                                         // 53
                                                                                           // 54
// Check whether the provided password matches the bcrypt'ed password in                   // 55
// the database user record. `password` can be a string (in which case                     // 56
// it will be run through SHA256 before bcrypt) or an object with                          // 57
// properties `digest` and `algorithm` (in which case we bcrypt                            // 58
// `password.digest`).                                                                     // 59
//                                                                                         // 60
Accounts._checkPassword = function (user, password) {                                      // 61
  var result = {                                                                           // 62
    userId: user._id                                                                       // 63
  };                                                                                       // 64
                                                                                           // 65
  password = getPasswordString(password);                                                  // 66
                                                                                           // 67
  if (! bcryptCompare(password, user.services.password.bcrypt)) {                          // 68
    result.error = new Meteor.Error(403, "Incorrect password");                            // 69
  }                                                                                        // 70
                                                                                           // 71
  return result;                                                                           // 72
};                                                                                         // 73
var checkPassword = Accounts._checkPassword;                                               // 74
                                                                                           // 75
///                                                                                        // 76
/// LOGIN                                                                                  // 77
///                                                                                        // 78
                                                                                           // 79
// Users can specify various keys to identify themselves with.                             // 80
// @param user {Object} with one of `id`, `username`, or `email`.                          // 81
// @returns A selector to pass to mongo to get the user record.                            // 82
                                                                                           // 83
var selectorFromUserQuery = function (user) {                                              // 84
  if (user.id)                                                                             // 85
    return {_id: user.id};                                                                 // 86
  else if (user.username)                                                                  // 87
    return {username: user.username};                                                      // 88
  else if (user.email)                                                                     // 89
    return {"emails.address": user.email};                                                 // 90
  throw new Error("shouldn't happen (validation missed something)");                       // 91
};                                                                                         // 92
                                                                                           // 93
var findUserFromUserQuery = function (user) {                                              // 94
  var selector = selectorFromUserQuery(user);                                              // 95
                                                                                           // 96
  var user = Meteor.users.findOne(selector);                                               // 97
  if (!user)                                                                               // 98
    throw new Meteor.Error(403, "User not found");                                         // 99
                                                                                           // 100
  return user;                                                                             // 101
};                                                                                         // 102
                                                                                           // 103
// XXX maybe this belongs in the check package                                             // 104
var NonEmptyString = Match.Where(function (x) {                                            // 105
  check(x, String);                                                                        // 106
  return x.length > 0;                                                                     // 107
});                                                                                        // 108
                                                                                           // 109
var userQueryValidator = Match.Where(function (user) {                                     // 110
  check(user, {                                                                            // 111
    id: Match.Optional(NonEmptyString),                                                    // 112
    username: Match.Optional(NonEmptyString),                                              // 113
    email: Match.Optional(NonEmptyString)                                                  // 114
  });                                                                                      // 115
  if (_.keys(user).length !== 1)                                                           // 116
    throw new Match.Error("User property must have exactly one field");                    // 117
  return true;                                                                             // 118
});                                                                                        // 119
                                                                                           // 120
var passwordValidator = Match.OneOf(                                                       // 121
  String,                                                                                  // 122
  { digest: String, algorithm: String }                                                    // 123
);                                                                                         // 124
                                                                                           // 125
// Handler to login with a password.                                                       // 126
//                                                                                         // 127
// The Meteor client sets options.password to an object with keys                          // 128
// 'digest' (set to SHA256(password)) and 'algorithm' ("sha-256").                         // 129
//                                                                                         // 130
// For other DDP clients which don't have access to SHA, the handler                       // 131
// also accepts the plaintext password in options.password as a string.                    // 132
//                                                                                         // 133
// (It might be nice if servers could turn the plaintext password                          // 134
// option off. Or maybe it should be opt-in, not opt-out?                                  // 135
// Accounts.config option?)                                                                // 136
//                                                                                         // 137
// Note that neither password option is secure without SSL.                                // 138
//                                                                                         // 139
Accounts.registerLoginHandler("password", function (options) {                             // 140
  if (! options.password || options.srp)                                                   // 141
    return undefined; // don't handle                                                      // 142
                                                                                           // 143
  check(options, {                                                                         // 144
    user: userQueryValidator,                                                              // 145
    password: passwordValidator                                                            // 146
  });                                                                                      // 147
                                                                                           // 148
                                                                                           // 149
  var user = findUserFromUserQuery(options.user);                                          // 150
                                                                                           // 151
  if (!user.services || !user.services.password ||                                         // 152
      !(user.services.password.bcrypt || user.services.password.srp))                      // 153
    throw new Meteor.Error(403, "User has no password set");                               // 154
                                                                                           // 155
  if (!user.services.password.bcrypt) {                                                    // 156
    if (typeof options.password === "string") {                                            // 157
      // The client has presented a plaintext password, and the user is                    // 158
      // not upgraded to bcrypt yet. We don't attempt to tell the client                   // 159
      // to upgrade to bcrypt, because it might be a standalone DDP                        // 160
      // client doesn't know how to do such a thing.                                       // 161
      var verifier = user.services.password.srp;                                           // 162
      var newVerifier = SRP.generateVerifier(options.password, {                           // 163
        identity: verifier.identity, salt: verifier.salt});                                // 164
                                                                                           // 165
      if (verifier.verifier !== newVerifier.verifier) {                                    // 166
        return {                                                                           // 167
          userId: user._id,                                                                // 168
          error: new Meteor.Error(403, "Incorrect password")                               // 169
        };                                                                                 // 170
      }                                                                                    // 171
                                                                                           // 172
      return {userId: user._id};                                                           // 173
    } else {                                                                               // 174
      // Tell the client to use the SRP upgrade process.                                   // 175
      throw new Meteor.Error(400, "old password format", EJSON.stringify({                 // 176
        format: 'srp',                                                                     // 177
        identity: user.services.password.srp.identity                                      // 178
      }));                                                                                 // 179
    }                                                                                      // 180
  }                                                                                        // 181
                                                                                           // 182
  return checkPassword(                                                                    // 183
    user,                                                                                  // 184
    options.password                                                                       // 185
  );                                                                                       // 186
});                                                                                        // 187
                                                                                           // 188
// Handler to login using the SRP upgrade path. To use this login                          // 189
// handler, the client must provide:                                                       // 190
//   - srp: H(identity + ":" + password)                                                   // 191
//   - password: a string or an object with properties 'digest' and 'algorithm'            // 192
//                                                                                         // 193
// We use `options.srp` to verify that the client knows the correct                        // 194
// password without doing a full SRP flow. Once we've checked that, we                     // 195
// upgrade the user to bcrypt and remove the SRP information from the                      // 196
// user document.                                                                          // 197
//                                                                                         // 198
// The client ends up using this login handler after trying the normal                     // 199
// login handler (above), which throws an error telling the client to                      // 200
// try the SRP upgrade path.                                                               // 201
//                                                                                         // 202
// XXX COMPAT WITH 0.8.1.3                                                                 // 203
Accounts.registerLoginHandler("password", function (options) {                             // 204
  if (!options.srp || !options.password)                                                   // 205
    return undefined; // don't handle                                                      // 206
                                                                                           // 207
  check(options, {                                                                         // 208
    user: userQueryValidator,                                                              // 209
    srp: String,                                                                           // 210
    password: passwordValidator                                                            // 211
  });                                                                                      // 212
                                                                                           // 213
  var user = findUserFromUserQuery(options.user);                                          // 214
                                                                                           // 215
  // Check to see if another simultaneous login has already upgraded                       // 216
  // the user record to bcrypt.                                                            // 217
  if (user.services && user.services.password && user.services.password.bcrypt)            // 218
    return checkPassword(user, options.password);                                          // 219
                                                                                           // 220
  if (!(user.services && user.services.password && user.services.password.srp))            // 221
    throw new Meteor.Error(403, "User has no password set");                               // 222
                                                                                           // 223
  var v1 = user.services.password.srp.verifier;                                            // 224
  var v2 = SRP.generateVerifier(                                                           // 225
    null,                                                                                  // 226
    {                                                                                      // 227
      hashedIdentityAndPassword: options.srp,                                              // 228
      salt: user.services.password.srp.salt                                                // 229
    }                                                                                      // 230
  ).verifier;                                                                              // 231
  if (v1 !== v2)                                                                           // 232
    return {                                                                               // 233
      userId: user._id,                                                                    // 234
      error: new Meteor.Error(403, "Incorrect password")                                   // 235
    };                                                                                     // 236
                                                                                           // 237
  // Upgrade to bcrypt on successful login.                                                // 238
  var salted = hashPassword(options.password);                                             // 239
  Meteor.users.update(                                                                     // 240
    user._id,                                                                              // 241
    {                                                                                      // 242
      $unset: { 'services.password.srp': 1 },                                              // 243
      $set: { 'services.password.bcrypt': salted }                                         // 244
    }                                                                                      // 245
  );                                                                                       // 246
                                                                                           // 247
  return {userId: user._id};                                                               // 248
});                                                                                        // 249
                                                                                           // 250
                                                                                           // 251
///                                                                                        // 252
/// CHANGING                                                                               // 253
///                                                                                        // 254
                                                                                           // 255
// Let the user change their own password if they know the old                             // 256
// password. `oldPassword` and `newPassword` should be objects with keys                   // 257
// `digest` and `algorithm` (representing the SHA256 of the password).                     // 258
//                                                                                         // 259
// XXX COMPAT WITH 0.8.1.3                                                                 // 260
// Like the login method, if the user hasn't been upgraded from SRP to                     // 261
// bcrypt yet, then this method will throw an 'old password format'                        // 262
// error. The client should call the SRP upgrade login handler and then                    // 263
// retry this method again.                                                                // 264
//                                                                                         // 265
// UNLIKE the login method, there is no way to avoid getting SRP upgrade                   // 266
// errors thrown. The reasoning for this is that clients using this                        // 267
// method directly will need to be updated anyway because we no longer                     // 268
// support the SRP flow that they would have been doing to use this                        // 269
// method previously.                                                                      // 270
Meteor.methods({changePassword: function (oldPassword, newPassword) {                      // 271
  check(oldPassword, passwordValidator);                                                   // 272
  check(newPassword, passwordValidator);                                                   // 273
                                                                                           // 274
  if (!this.userId)                                                                        // 275
    throw new Meteor.Error(401, "Must be logged in");                                      // 276
                                                                                           // 277
  var user = Meteor.users.findOne(this.userId);                                            // 278
  if (!user)                                                                               // 279
    throw new Meteor.Error(403, "User not found");                                         // 280
                                                                                           // 281
  if (!user.services || !user.services.password ||                                         // 282
      (!user.services.password.bcrypt && !user.services.password.srp))                     // 283
    throw new Meteor.Error(403, "User has no password set");                               // 284
                                                                                           // 285
  if (! user.services.password.bcrypt) {                                                   // 286
    throw new Meteor.Error(400, "old password format", EJSON.stringify({                   // 287
      format: 'srp',                                                                       // 288
      identity: user.services.password.srp.identity                                        // 289
    }));                                                                                   // 290
  }                                                                                        // 291
                                                                                           // 292
  var result = checkPassword(user, oldPassword);                                           // 293
  if (result.error)                                                                        // 294
    throw result.error;                                                                    // 295
                                                                                           // 296
  var hashed = hashPassword(newPassword);                                                  // 297
                                                                                           // 298
  // It would be better if this removed ALL existing tokens and replaced                   // 299
  // the token for the current connection with a new one, but that would                   // 300
  // be tricky, so we'll settle for just replacing all tokens other than                   // 301
  // the one for the current connection.                                                   // 302
  var currentToken = Accounts._getLoginToken(this.connection.id);                          // 303
  Meteor.users.update(                                                                     // 304
    { _id: this.userId },                                                                  // 305
    {                                                                                      // 306
      $set: { 'services.password.bcrypt': hashed },                                        // 307
      $pull: {                                                                             // 308
        'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }              // 309
      }                                                                                    // 310
    }                                                                                      // 311
  );                                                                                       // 312
                                                                                           // 313
  return {passwordChanged: true};                                                          // 314
}});                                                                                       // 315
                                                                                           // 316
                                                                                           // 317
// Force change the users password.                                                        // 318
Accounts.setPassword = function (userId, newPlaintextPassword) {                           // 319
  var user = Meteor.users.findOne(userId);                                                 // 320
  if (!user)                                                                               // 321
    throw new Meteor.Error(403, "User not found");                                         // 322
                                                                                           // 323
  Meteor.users.update(                                                                     // 324
    {_id: user._id},                                                                       // 325
    { $unset: {'services.password.srp': 1}, // XXX COMPAT WITH 0.8.1.3                     // 326
      $set: {'services.password.bcrypt': hashPassword(newPlaintextPassword)} }             // 327
  );                                                                                       // 328
};                                                                                         // 329
                                                                                           // 330
                                                                                           // 331
///                                                                                        // 332
/// RESETTING VIA EMAIL                                                                    // 333
///                                                                                        // 334
                                                                                           // 335
// Method called by a user to request a password reset email. This is                      // 336
// the start of the reset process.                                                         // 337
Meteor.methods({forgotPassword: function (options) {                                       // 338
  check(options, {email: String});                                                         // 339
                                                                                           // 340
  var user = Meteor.users.findOne({"emails.address": options.email});                      // 341
  if (!user)                                                                               // 342
    throw new Meteor.Error(403, "User not found");                                         // 343
                                                                                           // 344
  Accounts.sendResetPasswordEmail(user._id, options.email);                                // 345
}});                                                                                       // 346
                                                                                           // 347
// send the user an email with a link that when opened allows the user                     // 348
// to set a new password, without the old password.                                        // 349
//                                                                                         // 350
Accounts.sendResetPasswordEmail = function (userId, email) {                               // 351
  // Make sure the user exists, and email is one of their addresses.                       // 352
  var user = Meteor.users.findOne(userId);                                                 // 353
  if (!user)                                                                               // 354
    throw new Error("Can't find user");                                                    // 355
  // pick the first email if we weren't passed an email.                                   // 356
  if (!email && user.emails && user.emails[0])                                             // 357
    email = user.emails[0].address;                                                        // 358
  // make sure we have a valid email                                                       // 359
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))                 // 360
    throw new Error("No such email for user.");                                            // 361
                                                                                           // 362
  var token = Random.secret();                                                             // 363
  var when = new Date();                                                                   // 364
  var tokenRecord = {                                                                      // 365
    token: token,                                                                          // 366
    email: email,                                                                          // 367
    when: when                                                                             // 368
  };                                                                                       // 369
  Meteor.users.update(userId, {$set: {                                                     // 370
    "services.password.reset": tokenRecord                                                 // 371
  }});                                                                                     // 372
  // before passing to template, update user object with new token                         // 373
  user.services.password.reset = tokenRecord;                                              // 374
                                                                                           // 375
  var resetPasswordUrl = Accounts.urls.resetPassword(token);                               // 376
                                                                                           // 377
  var options = {                                                                          // 378
    to: email,                                                                             // 379
    from: Accounts.emailTemplates.from,                                                    // 380
    subject: Accounts.emailTemplates.resetPassword.subject(user),                          // 381
    text: Accounts.emailTemplates.resetPassword.text(user, resetPasswordUrl)               // 382
  };                                                                                       // 383
                                                                                           // 384
  if (typeof Accounts.emailTemplates.resetPassword.html === 'function')                    // 385
    options.html =                                                                         // 386
      Accounts.emailTemplates.resetPassword.html(user, resetPasswordUrl);                  // 387
                                                                                           // 388
  Email.send(options);                                                                     // 389
};                                                                                         // 390
                                                                                           // 391
// send the user an email informing them that their account was created, with              // 392
// a link that when opened both marks their email as verified and forces them              // 393
// to choose their password. The email must be one of the addresses in the                 // 394
// user's emails field, or undefined to pick the first email automatically.                // 395
//                                                                                         // 396
// This is not called automatically. It must be called manually if you                     // 397
// want to use enrollment emails.                                                          // 398
//                                                                                         // 399
Accounts.sendEnrollmentEmail = function (userId, email) {                                  // 400
  // XXX refactor! This is basically identical to sendResetPasswordEmail.                  // 401
                                                                                           // 402
  // Make sure the user exists, and email is in their addresses.                           // 403
  var user = Meteor.users.findOne(userId);                                                 // 404
  if (!user)                                                                               // 405
    throw new Error("Can't find user");                                                    // 406
  // pick the first email if we weren't passed an email.                                   // 407
  if (!email && user.emails && user.emails[0])                                             // 408
    email = user.emails[0].address;                                                        // 409
  // make sure we have a valid email                                                       // 410
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))                 // 411
    throw new Error("No such email for user.");                                            // 412
                                                                                           // 413
  var token = Random.secret();                                                             // 414
  var when = new Date();                                                                   // 415
  var tokenRecord = {                                                                      // 416
    token: token,                                                                          // 417
    email: email,                                                                          // 418
    when: when                                                                             // 419
  };                                                                                       // 420
  Meteor.users.update(userId, {$set: {                                                     // 421
    "services.password.reset": tokenRecord                                                 // 422
  }});                                                                                     // 423
                                                                                           // 424
  // before passing to template, update user object with new token                         // 425
  Meteor._ensure(user, "services", "password");                                            // 426
  user.services.password.reset = tokenRecord;                                              // 427
                                                                                           // 428
  var enrollAccountUrl = Accounts.urls.enrollAccount(token);                               // 429
                                                                                           // 430
  var options = {                                                                          // 431
    to: email,                                                                             // 432
    from: Accounts.emailTemplates.from,                                                    // 433
    subject: Accounts.emailTemplates.enrollAccount.subject(user),                          // 434
    text: Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl)               // 435
  };                                                                                       // 436
                                                                                           // 437
  if (typeof Accounts.emailTemplates.enrollAccount.html === 'function')                    // 438
    options.html =                                                                         // 439
      Accounts.emailTemplates.enrollAccount.html(user, enrollAccountUrl);                  // 440
                                                                                           // 441
  Email.send(options);                                                                     // 442
};                                                                                         // 443
                                                                                           // 444
                                                                                           // 445
// Take token from sendResetPasswordEmail or sendEnrollmentEmail, change                   // 446
// the users password, and log them in.                                                    // 447
Meteor.methods({resetPassword: function (token, newPassword) {                             // 448
  var self = this;                                                                         // 449
  return Accounts._loginMethod(                                                            // 450
    self,                                                                                  // 451
    "resetPassword",                                                                       // 452
    arguments,                                                                             // 453
    "password",                                                                            // 454
    function () {                                                                          // 455
      check(token, String);                                                                // 456
      check(newPassword, passwordValidator);                                               // 457
                                                                                           // 458
      var user = Meteor.users.findOne({                                                    // 459
        "services.password.reset.token": token});                                          // 460
      if (!user)                                                                           // 461
        throw new Meteor.Error(403, "Token expired");                                      // 462
      var email = user.services.password.reset.email;                                      // 463
      if (!_.include(_.pluck(user.emails || [], 'address'), email))                        // 464
        return {                                                                           // 465
          userId: user._id,                                                                // 466
          error: new Meteor.Error(403, "Token has invalid email address")                  // 467
        };                                                                                 // 468
                                                                                           // 469
      var hashed = hashPassword(newPassword);                                              // 470
                                                                                           // 471
      // NOTE: We're about to invalidate tokens on the user, who we might be               // 472
      // logged in as. Make sure to avoid logging ourselves out if this                    // 473
      // happens. But also make sure not to leave the connection in a state                // 474
      // of having a bad token set if things fail.                                         // 475
      var oldToken = Accounts._getLoginToken(self.connection.id);                          // 476
      Accounts._setLoginToken(user._id, self.connection, null);                            // 477
      var resetToOldToken = function () {                                                  // 478
        Accounts._setLoginToken(user._id, self.connection, oldToken);                      // 479
      };                                                                                   // 480
                                                                                           // 481
      try {                                                                                // 482
        // Update the user record by:                                                      // 483
        // - Changing the password to the new one                                          // 484
        // - Forgetting about the reset token that was just used                           // 485
        // - Verifying their email, since they got the password reset via email.           // 486
        var affectedRecords = Meteor.users.update(                                         // 487
          {                                                                                // 488
            _id: user._id,                                                                 // 489
            'emails.address': email,                                                       // 490
            'services.password.reset.token': token                                         // 491
          },                                                                               // 492
          {$set: {'services.password.bcrypt': hashed,                                      // 493
                  'emails.$.verified': true},                                              // 494
           $unset: {'services.password.reset': 1,                                          // 495
                    'services.password.srp': 1}});                                         // 496
        if (affectedRecords !== 1)                                                         // 497
          return {                                                                         // 498
            userId: user._id,                                                              // 499
            error: new Meteor.Error(403, "Invalid email")                                  // 500
          };                                                                               // 501
      } catch (err) {                                                                      // 502
        resetToOldToken();                                                                 // 503
        throw err;                                                                         // 504
      }                                                                                    // 505
                                                                                           // 506
      // Replace all valid login tokens with new ones (changing                            // 507
      // password should invalidate existing sessions).                                    // 508
      Accounts._clearAllLoginTokens(user._id);                                             // 509
                                                                                           // 510
      return {userId: user._id};                                                           // 511
    }                                                                                      // 512
  );                                                                                       // 513
}});                                                                                       // 514
                                                                                           // 515
///                                                                                        // 516
/// EMAIL VERIFICATION                                                                     // 517
///                                                                                        // 518
                                                                                           // 519
                                                                                           // 520
// send the user an email with a link that when opened marks that                          // 521
// address as verified                                                                     // 522
//                                                                                         // 523
Accounts.sendVerificationEmail = function (userId, address) {                              // 524
  // XXX Also generate a link using which someone can delete this                          // 525
  // account if they own said address but weren't those who created                        // 526
  // this account.                                                                         // 527
                                                                                           // 528
  // Make sure the user exists, and address is one of their addresses.                     // 529
  var user = Meteor.users.findOne(userId);                                                 // 530
  if (!user)                                                                               // 531
    throw new Error("Can't find user");                                                    // 532
  // pick the first unverified address if we weren't passed an address.                    // 533
  if (!address) {                                                                          // 534
    var email = _.find(user.emails || [],                                                  // 535
                       function (e) { return !e.verified; });                              // 536
    address = (email || {}).address;                                                       // 537
  }                                                                                        // 538
  // make sure we have a valid address                                                     // 539
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address))             // 540
    throw new Error("No such email address for user.");                                    // 541
                                                                                           // 542
                                                                                           // 543
  var tokenRecord = {                                                                      // 544
    token: Random.secret(),                                                                // 545
    address: address,                                                                      // 546
    when: new Date()};                                                                     // 547
  Meteor.users.update(                                                                     // 548
    {_id: userId},                                                                         // 549
    {$push: {'services.email.verificationTokens': tokenRecord}});                          // 550
                                                                                           // 551
  // before passing to template, update user object with new token                         // 552
  Meteor._ensure(user, "services", "email");                                               // 553
  if (! user.services.email.verificationTokens) {                                          // 554
    user.services.email.verificationTokens = [];                                           // 555
  }                                                                                        // 556
  user.services.email.verificationTokens.push(tokenRecord);                                // 557
                                                                                           // 558
  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);                       // 559
                                                                                           // 560
  var options = {                                                                          // 561
    to: address,                                                                           // 562
    from: Accounts.emailTemplates.from,                                                    // 563
    subject: Accounts.emailTemplates.verifyEmail.subject(user),                            // 564
    text: Accounts.emailTemplates.verifyEmail.text(user, verifyEmailUrl)                   // 565
  };                                                                                       // 566
                                                                                           // 567
  if (typeof Accounts.emailTemplates.verifyEmail.html === 'function')                      // 568
    options.html =                                                                         // 569
      Accounts.emailTemplates.verifyEmail.html(user, verifyEmailUrl);                      // 570
                                                                                           // 571
  Email.send(options);                                                                     // 572
};                                                                                         // 573
                                                                                           // 574
// Take token from sendVerificationEmail, mark the email as verified,                      // 575
// and log them in.                                                                        // 576
Meteor.methods({verifyEmail: function (token) {                                            // 577
  var self = this;                                                                         // 578
  return Accounts._loginMethod(                                                            // 579
    self,                                                                                  // 580
    "verifyEmail",                                                                         // 581
    arguments,                                                                             // 582
    "password",                                                                            // 583
    function () {                                                                          // 584
      check(token, String);                                                                // 585
                                                                                           // 586
      var user = Meteor.users.findOne(                                                     // 587
        {'services.email.verificationTokens.token': token});                               // 588
      if (!user)                                                                           // 589
        throw new Meteor.Error(403, "Verify email link expired");                          // 590
                                                                                           // 591
      var tokenRecord = _.find(user.services.email.verificationTokens,                     // 592
                               function (t) {                                              // 593
                                 return t.token == token;                                  // 594
                               });                                                         // 595
      if (!tokenRecord)                                                                    // 596
        return {                                                                           // 597
          userId: user._id,                                                                // 598
          error: new Meteor.Error(403, "Verify email link expired")                        // 599
        };                                                                                 // 600
                                                                                           // 601
      var emailsRecord = _.find(user.emails, function (e) {                                // 602
        return e.address == tokenRecord.address;                                           // 603
      });                                                                                  // 604
      if (!emailsRecord)                                                                   // 605
        return {                                                                           // 606
          userId: user._id,                                                                // 607
          error: new Meteor.Error(403, "Verify email link is for unknown address")         // 608
        };                                                                                 // 609
                                                                                           // 610
      // By including the address in the query, we can use 'emails.$' in the               // 611
      // modifier to get a reference to the specific object in the emails                  // 612
      // array. See                                                                        // 613
      // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)  // 614
      // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull                     // 615
      Meteor.users.update(                                                                 // 616
        {_id: user._id,                                                                    // 617
         'emails.address': tokenRecord.address},                                           // 618
        {$set: {'emails.$.verified': true},                                                // 619
         $pull: {'services.email.verificationTokens': {token: token}}});                   // 620
                                                                                           // 621
      return {userId: user._id};                                                           // 622
    }                                                                                      // 623
  );                                                                                       // 624
}});                                                                                       // 625
                                                                                           // 626
                                                                                           // 627
                                                                                           // 628
///                                                                                        // 629
/// CREATING USERS                                                                         // 630
///                                                                                        // 631
                                                                                           // 632
// Shared createUser function called from the createUser method, both                      // 633
// if originates in client or server code. Calls user provided hooks,                      // 634
// does the actual user insertion.                                                         // 635
//                                                                                         // 636
// returns the user id                                                                     // 637
var createUser = function (options) {                                                      // 638
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary                   // 639
  // options.                                                                              // 640
  check(options, Match.ObjectIncluding({                                                   // 641
    username: Match.Optional(String),                                                      // 642
    email: Match.Optional(String),                                                         // 643
    password: Match.Optional(passwordValidator)                                            // 644
  }));                                                                                     // 645
                                                                                           // 646
  var username = options.username;                                                         // 647
  var email = options.email;                                                               // 648
  if (!username && !email)                                                                 // 649
    throw new Meteor.Error(400, "Need to set a username or email");                        // 650
                                                                                           // 651
  var user = {services: {}};                                                               // 652
  if (options.password) {                                                                  // 653
    var hashed = hashPassword(options.password);                                           // 654
    user.services.password = { bcrypt: hashed };                                           // 655
  }                                                                                        // 656
                                                                                           // 657
  if (username)                                                                            // 658
    user.username = username;                                                              // 659
  if (email)                                                                               // 660
    user.emails = [{address: email, verified: false}];                                     // 661
                                                                                           // 662
  return Accounts.insertUserDoc(options, user);                                            // 663
};                                                                                         // 664
                                                                                           // 665
// method for create user. Requests come from the client.                                  // 666
Meteor.methods({createUser: function (options) {                                           // 667
  var self = this;                                                                         // 668
  return Accounts._loginMethod(                                                            // 669
    self,                                                                                  // 670
    "createUser",                                                                          // 671
    arguments,                                                                             // 672
    "password",                                                                            // 673
    function () {                                                                          // 674
      // createUser() above does more checking.                                            // 675
      check(options, Object);                                                              // 676
      if (Accounts._options.forbidClientAccountCreation)                                   // 677
        return {                                                                           // 678
          error: new Meteor.Error(403, "Signups forbidden")                                // 679
        };                                                                                 // 680
                                                                                           // 681
      // Create user. result contains id and token.                                        // 682
      var userId = createUser(options);                                                    // 683
      // safety belt. createUser is supposed to throw on error. send 500 error             // 684
      // instead of sending a verification email with empty userid.                        // 685
      if (! userId)                                                                        // 686
        throw new Error("createUser failed to insert new user");                           // 687
                                                                                           // 688
      // If `Accounts._options.sendVerificationEmail` is set, register                     // 689
      // a token to verify the user's primary email, and send it to                        // 690
      // that address.                                                                     // 691
      if (options.email && Accounts._options.sendVerificationEmail)                        // 692
        Accounts.sendVerificationEmail(userId, options.email);                             // 693
                                                                                           // 694
      // client gets logged in as the new user afterwards.                                 // 695
      return {userId: userId};                                                             // 696
    }                                                                                      // 697
  );                                                                                       // 698
}});                                                                                       // 699
                                                                                           // 700
// Create user directly on the server.                                                     // 701
//                                                                                         // 702
// Unlike the client version, this does not log you in as this user                        // 703
// after creation.                                                                         // 704
//                                                                                         // 705
// returns userId or throws an error if it can't create                                    // 706
//                                                                                         // 707
// XXX add another argument ("server options") that gets sent to onCreateUser,             // 708
// which is always empty when called from the createUser method? eg, "admin:               // 709
// true", which we want to prevent the client from setting, but which a custom             // 710
// method calling Accounts.createUser could set?                                           // 711
//                                                                                         // 712
Accounts.createUser = function (options, callback) {                                       // 713
  options = _.clone(options);                                                              // 714
                                                                                           // 715
  // XXX allow an optional callback?                                                       // 716
  if (callback) {                                                                          // 717
    throw new Error("Accounts.createUser with callback not supported on the server yet."); // 718
  }                                                                                        // 719
                                                                                           // 720
  return createUser(options);                                                              // 721
};                                                                                         // 722
                                                                                           // 723
///                                                                                        // 724
/// PASSWORD-SPECIFIC INDEXES ON USERS                                                     // 725
///                                                                                        // 726
Meteor.users._ensureIndex('emails.validationTokens.token',                                 // 727
                          {unique: 1, sparse: 1});                                         // 728
Meteor.users._ensureIndex('services.password.reset.token',                                 // 729
                          {unique: 1, sparse: 1});                                         // 730
                                                                                           // 731
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();
