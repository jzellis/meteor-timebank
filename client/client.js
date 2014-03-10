  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46330519-3', 'mcred.org');
  ga('send', 'pageview');

Transactions = new Meteor.Collection("transactions");
Requests = new Meteor.Collection("requests");
Options = new Meteor.Collection("options");
Images = new Meteor.Collection("images");
Wanteds = new Meteor.Collection("wanteds", {
    transform: function(doc) {
        return new Wanted(doc);
    }
});

Offers = new Meteor.Collection("offers", {
    transform: function(doc) {
        return new Offer(doc);
    }
});

// This sets up the routing

Router.configure({
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.map(function() {

    this.route('home', {
        path: '/', // match the root path
        // before: function() {
        //     if (Meteor.user()) {
        //         this.render('account');
        //         this.stop();
        //     } else {
        //         this.render('home')
        //     }
        // }
    });

    this.route('completeProfile', {
        path: '/completeProfile' // match the root path
    });

    this.route('transfer', {
        path: '/transfer' // match the root path
    });

    this.route('loginThingy', {
        path: '/loginThingy' // match the root path
    });


    this.route('about', {
        path: '/about' // match the root path
    });

    this.route('stats', {
        path: '/stats' // match the root path
    });

    this.route('admin', {
        path: '/admin' // match the root path
    });

    this.route('setup', {
        path: '/setup',
        before: function() {
            // if (Meteor.users.find().count() > 0) {
            //     this.render('alreadySetup');

            //     // stop the rest of the before hooks and the action function 
            //     this.stop();
            // }
        }
    });

    this.route('account', {
        path: '/account'
    });

    this.route('signup', {
        path: '/signup'
    });

    this.route('wanted', {
        path: '/wanted/'
    });

    this.route('offers', {
        path: '/offers/'
    });

    this.route('wantedFull', {
        path: '/wanted/:id',
        data: function() {

            wanted = Wanteds.findOne({
                _id: this.params.id
            });

            return {
                wanted: wanted

            }
        }
    });

    this.route('offerFull', {
        path: '/offers/:id',
        data: function() {

            offer = Offers.findOne({
                _id: this.params.id
            });

            return {
                offer: offer

            }
        }
    });

    this.route('transfer', {
        path: '/send/:user?/:amount?/:description?',
        data: function() {

            recipient = Meteor.users.findOne({
                $or: [{
                    _id: this.params.user
                }, {
                    username: this.params.user
                }]
            });

            return {
                send: true,
                recipient: recipient,
                amount: this.params.amount,
                description: this.params.description

            }
        }
    });

    this.route('transfer', {
        path: '/request/:user?/:amount?/:description?',
        data: function() {

            recipient = Meteor.users.findOne({
                $or: [{
                    _id: this.params.user
                }, {
                    username: this.params.user
                }]
            });

            return {
                request: true,
                recipient: recipient,
                amount: this.params.amount,
                description: this.params.description

            }
        }
    });

    this.route('user', {
        path: '/users/:user',
        data: function() {

            displayUser = Meteor.users.findOne({
                $or: [{
                    _id: this.params.user
                }, {
                    username: this.params.user
                }]
            });

            return {
                user: displayUser


            }
        }
    });


    this.route('tagSearch', {
        path: '/tags/:tag',
        data: function() {

            tagUsers = Meteor.users.find({
                "profile.tags": {
                    $regex: this.params.tag,
                    $options: "i"
                }
                
            });

            tagWanted = Wanteds.find({
                active: true,
                tags: {
                    $regex: this.params.tag,
                    $options: "i"
                }
            });

            tagOffers = Offers.find({
                active: true,
                tags: {
                    $regex: this.params.tag,
                    $options: "i"
                }
            });

            returned = {
                tag: this.params.tag
            };

            if (tagUsers.count() > 0) returned.users = tagUsers;
            if (tagWanted.count() > 0) returned.wanteds = tagWanted;
            if (tagOffers.count() > 0) returned.offers = tagOffers;

            return returned;
        }
    });




});

Router.before(function() {
    if (Meteor.users.find().count() == 0) {
        this.render('loading');

        // stop the rest of the before hooks and the action function 
        this.stop();
    }

    // if (Meteor.user() && !Meteor.user().emails || Meteor.user() && !Meteor.user().profile.bio) {
    //     window.location.href = '/completeProfile';
    // }

}, {
    except: ['setup', 'completeProfile']
});





$(document).ready(function() {

    // Sets the document title to the site's name
    if (Options.findOne({
        name: 'sitename'
    })) {
        $('title').text(Options.findOne({
            name: 'sitename'
        }).value);
    }

    $('.change').on('click', function() {
        console.log('hello');
        $('#userTwo').html("<input class='form-control userSearch' placeholder='Search Users'>");
    });

});


Deps.autorun(function(){
  if(Meteor.user()){
    Meteor.call("redeemUnclaimedTime", function(e,d){
        console.log(d);
    });
  }
});

Handlebars.registerHelper("formatAmount", function(amount) {
    return amount.toFixed(2);
});

Handlebars.registerHelper("nl2br", function(str) {
    return nl2br(str);
});

Handlebars.registerHelper("trimWords", function(str, num, ellipsis) {
    return trim_words(str, num, ellipsis);
});

Handlebars.registerHelper("formatDate", function(timestamp) {
    return moment(timestamp).format('LLL');
});

Handlebars.registerHelper("relativeTime", function(timestamp) {
    return moment(timestamp).fromNow();
});

Handlebars.registerHelper("recentUsers", function() {
    return Meteor.users.find({}, {
        sort: {
            "profile.timestamp": 1
        },
        limit: 10
    }).fetch();
});


Handlebars.registerHelper("getUsers", function() {
    return Meteor.users.find({}, {
        sort: {
            "profile.timestamp": 1
        }
    }).fetch();
});

Handlebars.registerHelper("userCount", function() {
    return Meteor.users.find().count();
});


Handlebars.registerHelper("getMyTransactions", function() {

    transactions = [];

    Transactions.find({
        $or: [{
            sender: Meteor.userId()
        }, {
            recipient: Meteor.userId()
        }], complete: true
    }, {
        sort: {
            timestamp: -1
        }
    }).forEach(function(transaction) {

        if (transaction.sender == Meteor.userId()) {
            transaction.transactionType = 'sender';
            transaction.isSender = true;
        } else {
            transaction.transactionType = 'recipient';
            transaction.isRecipient = true;
        }

        transactions.push(transaction);


    });

    return transactions;

});

Handlebars.registerHelper("getTotalTime", function() {

    return getTotalTime();

});

Handlebars.registerHelper("getUserTransactions", function(userId) {

    transactions = [];

    Transactions.find({
        $or: [{
            sender: userId
        }, {
            recipient: userId
        }], complete: true
    }, {
        sort: {
            $natural: 1
        }
    }).forEach(function(transaction) {

        if (transaction.sender == userId) {
            transaction.transactionType = 'sender';
            transaction.isSender = true;
        } else {
            transaction.transactionType = 'recipient';
            transaction.isRecipient = true;
        }

        transactions.push(transaction);


    });
    return transactions;

});

Handlebars.registerHelper("subtract", function(amount1, amount2) {
    return (parseFloat(amount2) - parseFloat(amount1)).toFixed(2);
});

Handlebars.registerHelper("urlEncode", function(text) {
    return encodeURIComponent(text);
});

Handlebars.registerHelper("add", function(amount1, amount2) {
    return (parseFloat(amount2) + parseFloat(amount1)).toFixed(2);
});

Handlebars.registerHelper("getUserById", function(id) {
    return Meteor.users.findOne({
        _id: id
    });
});

Handlebars.registerHelper("getImage", function(imageName) {
    image = Images.findOne({
        name: imageName
    });

    if (image) {
        return image.src
    } else {
        return false
    }
});

Handlebars.registerHelper("isFavorite", function(id) {
    if ($.inArray(id, Meteor.user().profile.favorites) != -1) {
        return true;
    }
});

Handlebars.registerHelper("isCurrentUser", function(id) {
    if (id == Meteor.userId()) {
        return true;
    }
});


Handlebars.registerHelper("getOption", function(name) {

    theOption = Options.findOne({
        name: name
    });

    if (theOption && theOption.value.length > 0) return nl2br(theOption.value);


});

Handlebars.registerHelper("recentTransactions", function(num) {

    return Transactions.find({complete:true}, {
        sort: {
            timestamp: -1
        },
        limit: num
    }).fetch();


});

Handlebars.registerHelper("getWanteds", function(num) {
options = {sort: {
            timestamp: -1
        }
    };


    return Wanteds.find({
        active: true
    }, options).fetch();


});

Handlebars.registerHelper("getOffers", function(num) {

options = {sort: {
            timestamp: -1
        }
    };

    return Offers.find({
        active: true
    }, options).fetch();


});

Handlebars.registerHelper("getUserWanteds", function(id) {

    return Wanteds.find({
        userId: id,
        active: true
    }, {
        sort: {
            timestamp: -1
        }
    }).fetch();


});

Handlebars.registerHelper("getUserOffers", function(id) {

    return Offers.find({
        userId: id,
        active: true
    }, {
        sort: {
            timestamp: -1
        }
    }).fetch();


});


Template.home.rendered = function() {

$('.carousel-inner .item:first').addClass('active');





}

Template.transferForm.rendered = function(){

 initializeUserSearchTypeahead();


}


Template.navbar.rendered = function() {


    $('#navbarSearch').typeahead({
        minLength: 3,
        highlight: true,
    }, {
        displayKey: 'user',
        source: function(query, cb) {


            cb(Meteor.users.find({
                $or: [{
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                }, {
                    "profile.name": {
                        $regex: query,
                        $options: "i"
                    }
                }, {
                    "emails.0.address": {
                        $regex: query,
                        $options: "i"
                    }
                }]
            }).map(function(user, index, cursor) {
                return user;
            }));


        },
        templates: {
            suggestion: function(user) {
                // return "<div class='row'><div class='col-md-4'><img src='" + user.profile.picture + "' style='width: 100%'></div><div class='col-md-8'>" + user.username + "</div><div class='row'><div class='col-md-12'><small>Balance: " + user.profile.balance + "</small></div></div>";
                return Template.autocompleteSuggestion(user);
            }
        }
    });

    $('#navbarSearch').on('typeahead:selected', function(object, data, name) {
        window.location.href = "/users/" + data.username;
    })

}

Template.user.rendered = function() {

    $('#tags').removeData('tagsinput');
    $(".bootstrap-tagsinput").remove();
    $('#tags').tagsinput({
        confirmKeys: [13, 9, 188],
        maxTags: 20
    });
    Meteor.users.findOne({
        _id: Meteor.userId()
    }).profile.tags.forEach(function(tag) {

        $('#tags').tagsinput('add', tag);

    });


}

Template.wanted.rendered = function() {

    $('#wantedForm input[name="tags"]').removeData('tagsinput');
    $(".bootstrap-tagsinput").remove();
    $('#wantedForm input[name="tags"]').tagsinput({
        confirmKeys: [13, 9, 188],
        maxTags: 20
    });
    $(".bootstrap-tagsinput").addClass('form-control');

}

Template.offers.rendered = function() {

    $('#offerForm input[name="tags"]').removeData('tagsinput');
    $(".bootstrap-tagsinput").remove();
    $('#offerForm input[name="tags"]').tagsinput({
        confirmKeys: [13, 9, 188],
        maxTags: 20
    });
    $(".bootstrap-tagsinput").addClass('form-control');

}

Template.home.events({
    'click .loginFacebook': function(e) {

        Meteor.loginWithFacebook(function(error) {
            console.log(error);
        })

    }

    

});

Template.transferForm.events({


 'change #toFrom' : function(e){

        $('#sendForm button[type="submit"]').text($(e.currentTarget).val());

    },

    'submit #sendForm': function(e) {
        e.preventDefault();
        $.pnotify.defaults.history = false;
        erroropts = {
            type: "error",
            addclass: "stack-bar-top",
            cornerclass: "",
            width: "90%",
            hide: false,
            sticker: false,
            closer_hover: false
            // stack: stack_bar_top
        };



        if (Meteor.user()) {

            $('.stack-bar-top').remove();

            data = $(e.currentTarget).serializeObject();
            data.userOneId = Meteor.userId();

            console.log(data);

            switch (true) {

                case data.amount == "":
                    erroropts.title = "No Amount Specified";
                    erroropts.text = "You must provide an amount.";
                    $.pnotify(erroropts);
                    break;

                case isInt(parseFloat(data.amount)) == false:
                    erroropts.title = "Invalid amount";
                    erroropts.text = "You must provide an amount that is a whole number.";
                    $.pnotify(erroropts);
                    break;

                case typeof(data.userTwoId) == "undefined" && data.email == '':
                    erroropts.title = "No Recipient Specified";
                    erroropts.text = "You must choose a recipient.";
                    $.pnotify(erroropts);
                    break;

                default:

                    if (data.toFrom == "send") {

                        transaction = {
                            sender: Meteor.userId(),
                            amount: data.amount,
                            description: data.description,
                            timestamp: new Date()
                        };

                        if(data.email){
                            transaction.recipientEmail = data.email;
                        }

                        if(data.userTwoId){
                            transaction.recipient = data.userTwoId;
                        }

                        Meteor.call("sendTime", transaction, function(e,r){

                            $('#transferMessage').html(r.message);
                            $('#transferMessage').removeClass("hidden");


                        });

                        // Transactions.insert(transaction);

                        // recipient = Meteor.users.findOne({
                        //     _id: transaction.recipient
                        // });


                        // newBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(transaction.amount);

                        // Meteor.call("updateBalance", newBalance, transaction, function(error, success) {

                        //     // window.location.href = '/';
                        // });
                    } else {

                        request = {
                            sender: Meteor.userId(),
                            recipient: data.userTwoId,
                            amount: data.amount,
                            description: data.description,
                            timestamp: new Date()
                        };

                        Requests.insert(request, function(error, id) {

                            Meteor.call("sendRequest", id);


                        });


                    }

                    $('#sendForm input[type="text"]').val('');

                    break;
            }


        }
    },

    'click #changeUser': function() {
        $('#userTwo').html("<input class='form-control userSearch input-sm' placeholder='Search Users'>");

        initializeUserSearchTypeahead();

    },


});

Template.loginPanel.events({

    'click .fbLogin': function() {
        Meteor.loginWithFacebook(function(error) {
            console.log(error);
        });
    },

    'submit': function(e) {
        e.preventDefault();
        Meteor.loginWithPassword(
            $('#loginPanel .username').val(),
            $('#loginPanel input[type="password"]').val(),
            function(error) {
                console.log(error)
            });
    }

});

Template.account.events({
    'focus #accountForm *': function(e) {
        $('#accountForm input, #accountForm textarea').removeClass('unstyled');
        $('#accountFormButtons').show();
    },

    'click #accountForm button.cancel': function(e) {
        $('#accountForm input, #accountForm textarea').addClass('unstyled');
        $('#accountForm input, #accountForm textarea').each(function(i) {
            $(this).val($(this).attr('data-original'));
        });
        $('#accountFormButtons').hide();
    },

    'submit #accountForm': function(e) {
        e.preventDefault();

        item = {
            email: $('#email').val(),
            url: $('#url').val(),
            bio: $('#bio').val()
        };

        Meteor.call("updateProfile", item, function(error, result) {

            $('#accountForm input, #accountForm textarea').addClass('unstyled');
            $('#accountFormButtons').hide();

        });


    }
});

Template.navbar.events({
    'click #logout': function(e) {
        Meteor.logout();
        window.location.href = '/';
    },
    'click .logout': function() {
        Meteor.logout();
        window.location.href = '/';

    },
    'click #loginFacebook': function() {
        Meteor.loginWithFacebook(function(error) {
            console.log(error);
        })
    },
    'click #loginTwitter': function() {
        Meteor.loginWithTwitter(function(error) {
            console.log(error);
        })
    },
    'click #loginForm button': function(e) {
        e.preventDefault();
        Meteor.loginWithPassword($('#loginForm input[name="username"]').val(), $('#loginForm input[name="password"]').val(), function(error) {
            console.log(error);
        })
    }

});

Template.completeProfile.events({

    'submit form': function(e) {
        e.preventDefault();

        info = {
            email: $('#email').val(),
            bio: $('#bio').val(),
            url: $('#url').val()
        };

        Meteor.call("completeProfile", info, function(e, i) {
            window.location.href = "/";
        });

    }
});

Template.send.events({

    'keyup #amount': function(e) {

        balance = Meteor.user().profile.balance;
        newBalance = (balance - $('#amount').val()).toFixed(2);
        $('.afterSend').text(newBalance);

    },

    'submit form': function(e) {
        e.preventDefault();



        transaction = {
            sender: Meteor.userId(),
            recipient: $('#recipientId').val(),
            amount: $('#amount').val(),
            description: $('#description').val(),
            timestamp: new Date()
        };

        Transactions.insert(transaction);

        recipient = Meteor.users.findOne({
            _id: transaction.recipient
        });


        newBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(transaction.amount);

        Meteor.call("updateBalance", newBalance, transaction, function(error, success) {

            window.location.href = '/';
        });



    }

});

Template.request.events({

    'submit form': function(e) {
        e.preventDefault();

        request = {
            sender: Meteor.userId(),
            recipient: $('#recipientId').val(),
            amount: $('#amount').val(),
            description: $('#description').val(),
            timestamp: new Date()
        };

        Requests.insert(request, function(error, id) {

            Meteor.call("sendRequest", id);


        });

    }

});

Template.user.events({

    'click .toggleFavorite': function(e) {
        id = $(e.currentTarget).attr('data-id');
        if ($.inArray(id, Meteor.user().profile.favorites) == -1) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $push: {
                    "profile.favorites": id
                }
            });
            return true;
        } else {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $pull: {
                    "profile.favorites": id
                }
            });
            return true;
        }
    },

    'click .markWantedCompleted': function(e) {

        if (confirm("Are you sure you want to mark this as completed?")) {
            Wanteds.update({
                _id: $(e.currentTarget).attr('data-id')
            }, {
                $set: {
                    active: false
                }
            });
        }

    },

    'click .markOfferCompleted': function(e) {

        if (confirm("Are you sure you want to mark this as completed?")) {
            Offers.update({
                _id: $(e.currentTarget).attr('data-id')
            }, {
                $set: {
                    active: false
                }
            });
        }

    },

    'submit #profileForm': function(e) {
        e.preventDefault();
        $('.error').remove();
        $('*').removeClass('has-error');

        error = {};

        switch (true) {

            case $('#email').val() == "":
                error.field = "#email";
                error.msg = "You must provide an email address";
                break;

            case validateEmail($('#email').val()) == false:
                error.field = "#email";
                error.msg = "You must provide a valid email address";
                break;

            case $('#url').val() != "" && validateURL($('#url').val()) == false:
                error.field = "#url";
                error.msg = "You must provide a valid URL";
                break;

            default:

                profile = $('#profileForm').serializeObject();
                profile.tags = $('#tags').tagsinput('items');
                console.log(profile);

                update = {
                    email: profile.email,
                    bio: profile.bio,
                    url: profile.url,
                    tags: profile.tags
                }


                Meteor.call("updateProfile", update, function(error, result) {

                    location.reload();

                });

                break;
        }

        if (error.msg) {
            $(error.field).parent().addClass('has-error');
            $(error.field).after("<div class='help-block error'>" + error.msg + "</div>");
        }



    }

});

Template.signup.events({

    'submit form': function(e) {
        e.preventDefault();

        $('.error').remove();
        $('*').removeClass('has-error');

        error = {};

        switch (true) {

            case $('#username').val() == "":
                error.field = "#username";
                error.msg = "You must provide a valid username";
                break;

            case $('#email').val() == "":
                error.field = "#email";
                error.msg = "You must provide an email address";
                break;

            case validateEmail($('#email').val()) == false:
                error.field = "#email";
                error.msg = "You must provide a valid email address";
                break;

            case $('#password').val() != $('#password2').val():
                error.field = "#password2";
                error.msg = "Passwords must match";
                break;

            case $('#fullName').val() == "":
                error.field = "#fullName";
                error.msg = "You must provide a name";
                break;

            case $('#url').val() != "" && validateURL($('#url').val()) == false:
                error.field = "#url";
                error.msg = "You must provide a valid URL";
                break;

            default:

                user = {
                    username: $('#username').val(),
                    email: $('#email').val(),
                    password: $('#password').val(),

                    profile: {
                        name: $('#fullName').val(),
                        url: $('#url').val(),
                        bio: $('#bio').val(),
                        createdAt: new Date(),
                        balance: 0.00,
                        favorites: []
                    }
                };
                Accounts.createUser(user, function() {
                    if ($('#avatar')[0].files.length > 0) {
                        uploadUserAvatar($('#avatar'), Meteor.userId());
                    }
                    window.location.href = "/";

                });

                break;
        }

        if (error.msg) {
            $(error.field).parent().addClass('has-error');
            $(error.field).after("<div class='help-block error'>" + error.msg + "</div>");
        }
    }


});

Template.setup.events({

    'click #negativeBalance': function(e) {

        if ($(e.currentTarget).is(":checked")) {
            $('#maxNegativeBalance').removeAttr('disabled');
        } else {
            $('#maxNegativeBalance').attr('disabled',
                'disabled');
        }

    },

    // 'change #siteImage': function(e) {
    //     uploadImageToCollection($('#siteImage'), "siteImage", function(src) {
    //         $('#siteImage').before("<img src='" + src + "'>");
    //     });
    // },

    'submit #adminAccountForm': function(e) {

        e.preventDefault();



        admin = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),

            profile: {
                name: $('#fullName').val(),
                url: $('#url').val(),
                bio: $('#bio').val(),
                createdAt: new Date(),
                balance: 0.00,
                favorites: [],
                isAdmin: true
            }
        };

        Accounts.createUser(admin, function() {
            if ($('#avatar')[0].files.length > 0) {
                uploadUserAvatar($('#avatar'), Meteor.userId());
            }
            window.location.href = "/";
        });

    },

    'submit #communityForm': function(e) {

        e.preventDefault();
        Options.insert({
            name: "sitename",
            value: $('#siteName').val()
        });
        Options.insert({
            name: "description",
            value: $('#siteDescription').val()
        });
        Options.insert({
            name: "currencyName",
            value: $('#currencyName').val()
        });
        Options.insert({
            name: "currencyAbbr",
            value: $('#currencyAbbr').val()
        });
        Options.insert({
            name: "currencyDescription",
            value: $('#currencyDescription').val()
        });
        Options.insert({
            name: "defaultBalance",
            value: $('#defaultBalance').val()
        });
        Options.insert({
            name: "whoCanJoin",
            value: $('#whoCanJoin option:selected').val()
        });

        if ($('#location').val() != '') Options.insert({
            name: "location",
            value: $('#location').val()
        });

        if ($('#fbClientId').val() != '') {


            Accounts.loginServiceConfiguration.insert({
                service: "facebook",
                appId: $('#fbClientId').val(),
                secret: $('#fbSecret').val()
            });

        }

        if ($('#twClientId').val() != '') {
            Accounts.loginServiceConfiguration.insert({
                service: "twitter",
                consumerKey: $('#twClientId').val(),
                secret: $('#twSecret').val()
            });

        }

        if ($('#negativeBalance').is(':checked')) {
            Options.insert({
                name: "negativeBalance",
                value: true
            });
            Options.insert({
                name: "maxNegativeBalance",
                value: $('#maxNegativeBalance').val()
            });

        }

        uploadImageToCollection($('#siteImage'), 'siteImage');
        window.location.href = "/";
    }

});

Template.admin.events({

    'change .isAdmin': function(e) {
        e.preventDefault();
        Meteor.call("toggleAdmin", $(e.currentTarget).val());
    },

    'click .deleteButton': function(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to do this?")) {
            Meteor.call("deleteUser", $(e.currentTarget).val());
        }
    },

    'submit #communityForm': function(e) {

        e.preventDefault();

        settings = [{
                name: "sitename",
                value: $('#siteName').val()
            }, {
                name: "description",
                value: $('#siteDescription').val()
            }, {
                name: "currencyName",
                value: $('#currencyName').val()
            }, {
                name: "currencyAbbr",
                value: $('#currencyAbbr').val()
            }, {
                name: "currencyDescription",
                value: $('#currencyDescription').val()
            }, {
                name: "defaultBalance",
                value: $('#defaultBalance').val()
            }

        ];

        if ($('#location').val() != '') settings.push({
            name: "location",
            value: $('#location').val()
        });
        if ($('#negativeBalance').is(':checked')) {
            settings.push({
                name: "negativeBalance",
                value: true
            });
            settings.push({
                name: "maxNegativeBalance",
                value: $('#maxNegativeBalance').val()
            });

        }


        Meteor.call("updateSettings", settings);

    }

});

Template.wanted.events({

    'submit #wantedForm': function(e) {

        e.preventDefault();

        data = $('#wantedForm').serializeObject();
        data.tags = $('#wantedForm input[name="tags"]').tagsinput('items');
        data.timestamp = new Date();
        data.userId = Meteor.userId();
        data.replies = [];
        data.active = true;

        Wanteds.insert(data);
        $('#wantedForm input, #wantedForm textarea').val('');
        $('#wantedModal').modal('hide');

    }

});

Template.offers.events({

    'submit #offerForm': function(e) {

        e.preventDefault();

        data = $('#offerForm').serializeObject();
        data.tags = $('#offerForm input[name="tags"]').tagsinput('items');
        data.timestamp = new Date();
        data.userId = Meteor.userId();
        data.replies = [];
        data.active = true;

        Offers.insert(data);
        $('#offerForm input, #offerForm textarea').val('');
        $('#offerModal').modal('hide');

    }

});

Template.offerFull.events({
    'submit #replyForm': function(e, t) {
        e.preventDefault();

        formdata = $('#replyForm').serializeObject();
        if(formdata.body !=""){
        reply = {
            userId: Meteor.userId(),
            body: formdata.body,
            timestamp: new Date()

        }

        Offers.update({
            _id: t.data.offer._id
        }, {
            $push: {
                replies: reply
            }
        });

        $('#replyForm textarea').val('');
    }
    }
});

Template.wantedFull.events({
    'submit #replyForm': function(e, t) {
        e.preventDefault();

        formdata = $('#replyForm').serializeObject();
        if(formdata.body !=""){

        reply = {
            userId: Meteor.userId(),
            body: formdata.body,
            timestamp: new Date()

        }

        Wanteds.update({
            _id: t.data.wanted._id
        }, {
            $push: {
                replies: reply
            }
        });

        $('#replyForm textarea').val('');
}
    }
});


// My functions

isInt = function(n) {
    return typeof n === 'number' && n % 1 == 0;
}


getTotalTime = function() {

    total = 0;

    Meteor.users.find().forEach(function(user) {

        if (user.profile.balance > 0) {
            total += user.profile.balance;
        }


    });
    return total;

}

uploadImageToCollection = function(field, name, callback) {
    file = field[0].files[0];

    if (file.size < 4000000) {
        var reader = new FileReader();


        reader.onload = function(e) {
            Images.insert({
                name: name,
                src: e.target.result
            }, function(error, id) {
                item = Images.findOne({
                    _id: id
                });
                if (callback) callback(item);
            });
        }

        reader.readAsDataURL(file);
    } else {
        alert('This file is too large');
    }

}

uploadUserAvatar = function(field, userId, callback) {
    file = field[0].files[0];

    if (file.size < 4000000) {
        var reader = new FileReader();


        reader.onload = function(e) {
            Meteor.users.update({
                _id: userId
            }, {
                $set: {
                    "profile.picture": e.target.result
                }
            });
        }

        reader.readAsDataURL(file);
    } else {
        alert('This file is too large');
    }

}


$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateURL(textval) {
    var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
}



// Collection transforms

Wanted = function(doc) {
    _.extend(this, doc);
};
_.extend(Wanted.prototype, {
    numReplies: function() {
        return this.replies.length;
    }
});

Offer = function(doc) {
    _.extend(this, doc);
};
_.extend(Offer.prototype, {
    numReplies: function() {
        return this.replies.length;
    }
});

function nl2br(str) {
    return str.replace(/\n/g, '<br />');
}

function trim_words(theString, numWords, ellipsis) {
    expString = theString.split(/\s+/, numWords);
    theNewString = expString.join(" ");
    if (theNewString.length < theString.length && typeof(ellipsis) != 'undefined') theNewString += ellipsis;
    return theNewString;
}

function initializeUserSearchTypeahead(){

   $('#sendForm .userSearch').typeahead({
        minLength: 3,
        highlight: true,
    }, {
        displayKey: 'user',
        source: function(query, cb) {


            cb(Meteor.users.find({
                $or: [{
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                }, {
                    "profile.name": {
                        $regex: query,
                        $options: "i"
                    }
                }, {
                    "emails.0.address": {
                        $regex: query,
                        $options: "i"
                    }
                }]
            }).map(function(user, index, cursor) {
                return user;
            }));


        },
        templates: {
            suggestion: function(user) {
                // return "<div class='row'><div class='col-md-4'><img src='" + user.profile.picture + "' style='width: 100%'></div><div class='col-md-8'>" + user.username + "</div><div class='row'><div class='col-md-12'><small>Balance: " + user.profile.balance + "</small></div></div>";
                return Template.autocompleteSuggestion(user);
            }
        }
    });

    $('#sendForm .userSearch').on('typeahead:selected', function(object, data, name) {
        html = "<div class='col-md-3'>";

        if(data.profile.picture) html += "<img src='" + data.profile.picture + "' class='avatar'>";

        html +="</div><div class='col-md-9'><div><a href='/users/" + data.username + "' target='_new'>" + data.username + "</a></div><div>" + Options.findOne({name: "currencyAbbr"}).value + " " + data.profile.balance + "</div><div id='changeUser' class='text-right change text-primary faux-link'>Change</div></div><input type='hidden' name='userTwoId' value='" + data._id + "'>";
        $('#userTwo').html(html);



    });

}