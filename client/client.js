Transactions = new Meteor.Collection("transactions");
Requests = new Meteor.Collection("requests");
Options = new Meteor.Collection("options");
Images = new Meteor.Collection("images");
// This sets up the routing



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

    this.route('send', {
        path: '/send/:user?/:amount?',
        data: function() {

            recipient = Meteor.users.findOne({
                $or: [{
                    _id: this.params.user
                }, {
                    username: this.params.user
                }]
            });

            return {
                recipient: recipient,
                amount: this.params.amount

            }
        }
    });

    this.route('request', {
        path: '/request/:user?/:amount?',
        data: function() {

            recipient = Meteor.users.findOne({
                $or: [{
                    _id: this.params.user
                }, {
                    username: this.params.user
                }]
            });

            return {
                recipient: recipient,
                amount: this.params.amount

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




Handlebars.registerHelper("formatAmount", function(amount) {
    return amount.toFixed(2);
});

Handlebars.registerHelper("formatDate", function(timestamp) {
    return moment(timestamp).format('LLL');
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
        }]
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
        }]
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


Handlebars.registerHelper("getOption", function(name) {

    theOption = Options.findOne({
        name: name
    });

    if (theOption) return theOption.value;


});

Handlebars.registerHelper("recentTransactions", function(num) {

    return Transactions.find({}, {
        sort: {
            timestamp: -1
        },
        limit: num
    }).fetch();


});


Template.home.rendered = function() {


    $('#sendForm .userSearch').typeahead({
        minLength: 3,
        highlight: true,
    }, {
        displayKey: 'user',
        source: function(query, cb) {


            cb(Meteor.users.find({
                username: {
                    $regex: query
                }
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
        html = "<div class='row'><div class='col-md-2'><img src='" + data.profile.picture + "' style='height: 2.25em'></div><div class='col-md-10'><div class='row'><div class='col-md-12 h4'>" + data.username + "</div></div><div class='row'><div class='col-md-6 small'><b>" + Options.findOne({
            name: "currencyAbbr"
        }).value + " " + data.profile.balance + "</b></div><div id='changeUser' class='col-md-6 text-right small change btn-link'>Change</div></div></div><input type='hidden' name='userTwoId' value='" + data._id + "'>";
        $('.userTwo').html(html);



    });




}


Template.navbar.rendered = function() {


    $('#navbarSearch').typeahead({
        minLength: 3,
        highlight: true,
    }, {
        displayKey: 'user',
        source: function(query, cb) {


            cb(Meteor.users.find({
                username: {
                    $regex: query
                }
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

Template.home.events({
    'click .loginFacebook': function(e) {

        Meteor.loginWithFacebook(function(error) {
            console.log(error);
        })

    },

    'submit #sendForm': function(e) {
        e.preventDefault();

        if (Meteor.user()) {

            data = $(e.currentTarget).serializeObject();
            data.userOneId = Meteor.userId();

            if (data.toFrom == "send") {

                transaction = {
                    sender: Meteor.userId(),
                    recipient: data.userTwoId,
                    amount: data.amount,
                    description: data.description,
                    timestamp: new Date()
                };

                Transactions.insert(transaction);

                recipient = Meteor.users.findOne({
                    _id: transaction.recipient
                });


                newBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(transaction.amount);

                Meteor.call("updateBalance", newBalance, transaction, function(error, success) {

                    // window.location.href = '/';
                });
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
        }
    },

    'click .logout': function() {
        Meteor.logout();
    },

    'click #changeUser': function() {
        $('#userTwo').html("<input class='form-control userSearch' placeholder='Search Users'>");

    }

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
    }

});

Template.signup.events({

    'submit form': function(e) {
        e.preventDefault();

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
            uploadUserAvatar($('#avatar'), Meteor.userId());
        });
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
            uploadUserAvatar($('#avatar'), Meteor.userId());
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


// My functions


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