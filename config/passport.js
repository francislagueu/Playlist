var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(err, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback:true
    }, function (req, email, password, username, first_name, last_name, done) {
        proces.nextTick(function () {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }else{
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.username = username;
                    newUser.local.first_name = first_name;
                    newUser.local.last_name = last_name;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function (err) {
                        if(err)
                            throw err;
                        return done(null, newUser);

                    });
                }
            });
        });

    }));

    passport.use('local-login', new LocalStrategy({
        passReqToCallback:true
    }, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if(!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops!! Wrong password.'));
            }
            return done(null, user);
        });
    }));

}