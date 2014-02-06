// users are created by Meteor itself -- see documentation
Transactions = new Meteor.Collection("transactions");
Requests = new Meteor.Collection("requests");
Options = new Meteor.Collection("options");
Images = new Meteor.Collection("images");


// Accounts.config({
// 	sendVerificationEmail: true
// });



Accounts.onCreateUser(function(options, user) {

    if (options.profile) {

        if (user.services.facebook !== undefined) {

            options.profile = {
                picture: "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
                name: user.services.facebook.name,
                url: '',
                bio: '',
                createdAt: new Date(),
                balance: 0.00,
                favorites: [],
            };
            // options.profile.name = user.services.facebook.name;
            user.username = user.services.facebook.username;
            user.emails = [{
                address: user.services.facebook.email,
                verified: false
            }];




        }


        user.profile = options.profile;
    }
    return user;
});

Meteor.startup(function() {

    // Meteor.users.update({
    //     _id: "dfGHhi5Hp7qFqJ4vL"
    // }, {
    //     $set: {
    //         emails: [{
    //             address: "jzellis@gmail.com",
    //             verified: true
    //         }]
    //     }
    // });

    Meteor.users.find({}).forEach(function(user) {


        if (!user.profile.balance) {
            Meteor.users.update({
                _id: user._id
            }, {
                $set: {
                    "profile.balance": 0
                }
            });
        }

    });



    // Accounts.loginServiceConfiguration.remove({
    //     service: "twitter"
    // });
    // Images.remove({});
    // Meteor.users.remove({});
    // Options.remove({});
    // Transactions.remove({});
});


Meteor.methods({

    sendRequest: function(requestId) {

        request = Requests.findOne({
            _id: requestId
        });

        console.log(request);

        sender = Meteor.users.findOne({
            _id: request.sender
        });
        recipient = Meteor.users.findOne({
            _id: request.recipient
        });

        console.log(recipient);

        body = Handlebars.templates['sendRequestEmail']({
            recipient: recipient,
            sender: sender,
            request: request,
            server: Meteor.absoluteUrl(),
            siteName: Options.findOne({
                name: "sitename"
            }).value,
            currencyName: Options.findOne({
                name: "currencyName"
            }).value,
            currencyAbbr: Options.findOne({
                name: "currencyAbbr"
            }).value
        });

        subject = Options.findOne({
            name: "sitename"
        }).value + " request from " +
            sender.username;

        Email.send({
            to: recipient.emails[0].address,
            from: sender.emails[0].address,
            subject: subject,
            text: body
        });


    },

    completeProfile: function(item) {

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: {
                emails: [{
                    address: item.email,
                    verified: true
                }],
                "profile.bio": item.bio,
                "profile.url": item.url,
                "profile.balance": 0.00,
                "profile.favorites": []
            }
        });


    },

    updateBalance: function(balance, transaction) {

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: {
                "profile.balance": balance
            }
        });

        recipient = Meteor.users.findOne({
            _id: transaction.recipient
        });
        newRecipientBalance = parseFloat(recipient.profile.balance) + parseFloat(transaction.amount);

        Meteor.users.update({
            _id: recipient._id
        }, {
            $set: {
                "profile.balance": newRecipientBalance
            }
        });

    }

});