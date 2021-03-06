const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const config = require('./config.js')
const jwt = require('jsonwebtoken'); 
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); 
};
​
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
opts.secretOrKey = config.secretKey;
​
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);
​
exports.verifyUser = passport.authenticate('jwt', {session: false});    
​
exports.verifyAdmin = function(req, res, next){
    if (req.user.admin === true){
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};