const mongoose = require("../db/mongoose.js");
const User = require('../models/user')
const jwt = require('jwt-simple');
const config = require('../config')

// generates a token. 
// jwt's have a sub property and we say the subject of this token is this user. 
tokenForUser = (user) => {
    const timestamp = new Date().getTime(); 
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signIn = (req, res, next) => {
    // user has already had their email and password auth'd 
    // just need to issue them a token. 
    res.send({token: tokenForUser(req.user)})
}

exports.signUp = async (req, res, next) => {
     const email = req.body.email; 
     const password = req.body.password

     try {
    // see if a user with the given email exists
        const userFind = await User.findOne({email: email}, (err, existingUser) => {
    // if connection to db failed.
            if (err) {
                return next (err)
            }
    // if a user with a email does exist, return an error.  
            if (existingUser) {
                return res.status(422).send({error: 'Email is in use'})
            }
        })
    // if a user with a email does not exist, create a new user. 
        const newUser = new User({
            email: email, 
            password: password
        })
    // save the new user. 
         await newUser.save()

    // respond to request indicating user was created. 
        res.status(200).send({ token: tokenForUser(newUser)})

     } catch(e) {
        res.status(400).send(e);
     }
       
}
