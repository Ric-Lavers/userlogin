const passport = require('passport'); 
const config = require('../config'); 
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user"); 


// Create local strategy - by defaul localStrategy looks for username - Purpose is to verify email and password. 
const localOptions = {usernameField: 'email'}

// parses the req and pulls out the email and password. 
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // callback will verify username and password. call done with the user. 
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err, false)}

        if(!user) {return done( null, false )}
        
        // compare passwords - is 'password equal to user.password
        // isMatch is a true false property. 
        user.comparePassword(password, (err, isMatch) => {
            if (err) {return done(err); }
            if(!isMatch) {return done(null, false)}
            return done(null, user)
        })
    })
})

// PATTERN FOR JWT STRATEGY 

// Setup Options for JWT Strategy 
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), 
    secretOrKey: config.secret
}; 

// create JWT Strategy - verifying our routes. 
// payload is the decoded jwt token. --> when we get payload back, the payload will be userId and TimeStamp. 
// done is callback function that we need to call 
const jwtLogin = new JwtStrategy( jwtOptions, (payload, done) => {
    // See if user.id in payload exists in our DB --> if it does, call done() with that user. 
    User.findById(payload.sub, (err, user) => {
        if (err) {return done(err, false);}

        if(user) {
            done(null, user); 
        } else {
            done(null, false)
        }
    })
   

})

// Tell Passport to use the Strategy
passport.use(jwtLogin)
passport.use(localLogin)