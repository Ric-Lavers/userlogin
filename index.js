const express = require("express");
const bodyParser = require("body-parser");
const http = require('http'); 
const morgan = require('morgan'); 
const router = require('./router')
const mongoose = require('./db/mongoose');

//App Setup 
// telling app to use express
const app = express(); 

// any req will be passed into these by default. Morgan is a logging framework and will log requests. 
app.use(morgan("combined")); 

// - this module lets us send JSON to the server. Will let us parse incoming requests to JSON.
// - the type option is used to determing what media type the middleware will pass. 
app.use(bodyParser.json({type: '*/*'}));

// routes
router(app)

// Server Setup. 
// port of app. 
const port = process.env.PORT || 3090;
const server = http.createServer(app); 
server.listen(port); 
console.log(`Server listening on ${port}`)
