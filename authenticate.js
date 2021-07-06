const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
