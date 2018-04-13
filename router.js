const Authentication = require("./controllers/authentication");
const requireAuth = require('./middleware/authorization'); 
const requireSignin = require('./middleware/authorization');



module.exports = function (app) {

    app.get('/', requireAuth, (req, res) => {
        res.send({ message: 'Hi There'})
    })

    app.post('/signin', requireSignin, Authentication.signIn)

    app.post('/signup', Authentication.signUp)
}