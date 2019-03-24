/*
    initial setup
*/

//useful variables
let express = require('express');
let app = express();
let logger = require('morgan');
let bodyParser = require('body-parser');

//start listening to port 3000
app.listen(3000, function(){
    console.log("App is running on port 3000!");
});

//initialize logger for testing purposes
app.use(logger('dev'));

//use ejs to serve up js and html
app.set('view engine', "ejs");

//also want to send static files
app.use(express.static('views'));
app.set('views', __dirname + '/views');

//parse user request as json 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
    route requests
*/

//request from user to view root
app.get('/', function(req, res){
    res.render("login.ejs");
});


// //authentication middleware
// function isAuthenticated(req, res, next)
// {   

// }


// //request from user to view dashboard page
// //grant if userr is authenticated
// app.get('/dashboard', isAuthenticated, function(req, res){
//     res.render("dashboard.ejs");
// });

// //store firebase admin credentials
// let admin = require('firebase-admin');
// let serviceAccount = require('');
// let firebaseAdmin = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: ''
// });