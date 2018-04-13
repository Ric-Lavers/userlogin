const passportService = require("../services/passport.js");
const passport = require("passport");


// session is false since we don't want a cookie, but we want a token.
const requireAuth = passport.authenticate("jwt", { session: false });

const requireSignin = passport.authenticate("local", { session: false }); 

module.exports = (requireAuth, requireSignin)

