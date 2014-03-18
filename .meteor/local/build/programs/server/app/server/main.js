(function(){// users are created by Meteor itself -- see documentation
Transactions = new Meteor.Collection("transactions");
Groups = new Meteor.Collection("groups");
Requests = new Meteor.Collection("requests");
Options = new Meteor.Collection("options");
Images = new Meteor.Collection("images");
Wanteds = new Meteor.Collection("wanteds");
Offers = new Meteor.Collection("offers");

// Accounts.config({
// 	sendVerificationEmail: true
// });



Accounts.onCreateUser(function(options, user) {

    if (options.profile) {


// This pulls a profile pic if the user is using Facebook.
        if (user.services.facebook !== undefined) {

            options.profile = {
                picture: "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
                name: user.services.facebook.name,
                url: '',
                bio: '',
                createdAt: new Date(),
                balance: 0,
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

// Meteor.users.remove({"profile.group" : true});


    Meteor.users.find({}).forEach(function(user) {



// This makes sure that each user has a profile balance.
        if (!user.profile.balance) {
            Meteor.users.update({
                _id: user._id
            }, {
                $set: {
                    "profile.balance": 0
                }
            });
        }


// This makes sure that any users without a profile pic use the default avatar.
        if(!user.profile.picture){

                        Meteor.users.update({
                _id: user._id
            }, {
                $set: {
                    "profile.picture": "/img/default_avatar.png"
                }
            });

        }

    });

});


Meteor.methods({



// This checks transactions to see if any incomplete transactions have the user's email, and if so, complete them.

    redeemUnclaimedTime: function(){

        message = {transactions : []};

            Transactions.find({recipientEmail: Meteor.user().emails[0].address, complete: false}).forEach(function(transaction){

        console.log(transaction);

        sender = Meteor.users.findOne({_id: transaction.sender});

            newSenderBalance = parseFloat(sender.balance) - parseFloat(transaction.amount);
            Meteor.users.update({_id: sender._id}, {$set: {"profile.balance" : newSenderBalance}});

            recipientBalance = Meteor.user().profile.balance;
            newRecipientBalance = parseFloat(recipientBalance) + parseFloat(transaction.amount);
            console.log(newRecipientBalance);
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.balance" : newRecipientBalance}});



            Transactions.update({_id: transaction._id}, {$set: {recipient: Meteor.userId(), complete: true}});

            message.transactions.push(transaction);



    });

            // return message;


    },

    sendTime: function(transaction){

        response = {};

        if(transaction.recipient){

            recipient = Meteor.users.findOne({_id: transaction.recipient});



        }else if(transaction.recipientEmail){

            recipient = Meteor.users.findOne({"emails.0.address" : transaction.recipientEmail});
            if(recipient) transaction.recipient = recipient._id;

        }


//If there's a known recipient, complete the transaction
        if(recipient){
            response.recipient = recipient;

            transferBalance(transaction.sender, transaction.recipient,transaction.amount);

            transaction.complete = true;

            response.message = "You sent " + recipient.username + " " + Options.findOne({name: "currencyAbbr"}).value + " " + transaction.amount + ".";

        response.transactionId = Transactions.insert(transaction);

        return response;

        }else{
                transaction.complete = false;
            mailBody = "Hi there! " + Meteor.user().profile.name + " has sent you " + Options.findOne({name: "currencyAbbr"}).value + " " + transaction.amount + " on " + Options.findOne({name: "sitename"}).value + "! You can redeem this by creating an account at " + Meteor.absoluteUrl();
            Email.send({to: transaction.recipientEmail, subject: Meteor.user().profile.name + " has sent you " + Options.findOne({name: "currencyAbbr"}).value + " " + transaction.amount + "!",text: mailBody});

            response.message = "An email has been sent to " + transaction.recipientEmail + " letting them know you've sent them " + Options.findOne({name: "currencyAbbr"}).value + " " + transaction.amount + ". Once they create an account the amount will be automatically added to their balance.";

        response.transactionId = Transactions.insert(transaction);

        return response;

        }



    },



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

    updateProfile: function(item) {

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
                "profile.tags": item.tags
            }
        });

    },

    updateUserAvatar: function(id,img){
        Meteor.users.update({_id: id}, {$set: {"profile.picture":img}});
    },

    toggleAdmin: function(userId) {
        if (Meteor.user().profile.isAdmin) {
            user = Meteor.users.findOne({
                _id: userId
            });
            if (user.profile.isAdmin) {
                Meteor.users.update({
                    _id: userId
                }, {
                    $unset: {
                        "profile.isAdmin": ""
                    }
                });
            } else {
                Meteor.users.update({
                    _id: userId
                }, {
                    $set: {
                        "profile.isAdmin": true
                    }
                });

            }
        }
    },

    createNewUser: function(user){
        return Accounts.createUser(user);
    },

    deleteUser: function(userId) {
        if (Meteor.user().profile.isAdmin) {
            Meteor.users.remove({
                _id: userId
            });
        }
    },

    updateSettings: function(settings) {

        settings.forEach(function(setting) {

            Options.upsert({
                name: setting.name
            }, {
                $set: {
                    value: setting.value
                }
            });

        });


    },

    updateBalance: function(balance, transaction) {

        transferBalance(transaction.sender, transaction.recipient,amount);

    }

});



// Functions

transferBalance = function(senderId,recipientId,amount){

    response = true;
    sender = Meteor.users.findOne({_id: senderId});
    recipient = Meteor.users.findOne({_id: recipientId});
    newSenderBalance = parseFloat(sender.profile.balance) - parseFloat(amount);
    newRecipientBalance = parseFloat(sender.profile.balance) + parseFloat(amount);
    Meteor.users.update({_id: senderId}, {$set: {"profile.balance" : newSenderBalance}}, function(e,num){
        if(e) response = e;
    });
    Meteor.users.update({_id: recipientId}, {$set: {"profile.balance" : newRecipientBalance}}, function(e,num){
        if(e) response = e;
    });

    return response;

}

})();
