// server.js
const databasePromise = require("./database.js")
// set up ======================================================================
// get all the tools we need
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
const passport = require('passport');
const flash = require('connect-flash');
const multer = require('multer');
const ObjectId = require('mongodb').ObjectID

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(session({
  secret: 'rcbootcamp2019c', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// twilio =========================================

const accountSid = 'AC89516ff436bd100840ffaa3200580c8d';
const authToken = '1234828a96b7c70b33dc7323578f1ca6';
const twilioClient = require('twilio')(accountSid, authToken);


// routes ======================================================================
databasePromise.then(function (database) {
  require('./app/routes.js')(app, passport, database, multer, ObjectId, twilioClient); // load our routes and pass in our app and fully configured passport  
})




// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


