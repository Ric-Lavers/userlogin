const mongoose = require('mongoose'); 
const { Schema } = mongoose
const bcrypt = require('bcrypt-nodejs'); 

// Define our Model. 
const userSchema = new Schema ({
    email: {
        type: String, 
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    }, 
    password: {
        type: String, 
        trim: true,
        required: true
    }
})

// on Save Hook, encrypt password using bcrypt.
// before saving a model, run this function. 
// --> Can't use arrow function since we need access to instance of user model. 
userSchema.pre('save', function(next) {

    // get access to user model
    const user = this;

    // generate a salt, then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        // hash (encrypt) our password using the salt. 
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err) { return next(err) }

            // overwrite password with encrypted password
            user.password = hash; 
            // go ahead and save the password.
            next(); 
        })
    })
}); 

// method on user Schema. - will compare password of candidate vs password in user model. 
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        
        if (err) { return callback(err) }

        callback(null, isMatch)
    })
}

// Create Model Class - need to make use of Mongoose. 
const ModelClass = mongoose.model('user', userSchema)

// Export Model
module.exports = ModelClass