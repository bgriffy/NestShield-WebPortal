/*
    initial setup
*/

const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require("path");

//start listening to port 3000
app.listen(3000, function () {
    console.log("App is running on port 3000!");
});

//initialize logger for testing purposes
app.use(logger('dev'));

//use ejs to serve up js and html
app.set('view engine', "ejs");

//also want to send static files
app.use(express.static('views'));
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "scripts")));


//parse user request as json 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
    route requests
*/

//request to view root page
app.get('/', function (req, res) {
    res.render("landing.ejs");
});

//request to view login page
app.get('/login', function (req, res) {
    res.render("login.ejs");
});

//request to view registration page
app.get('/registration', function (req, res) {
    res.render("registration.ejs");
});

//request to view home page (dashboard)
app.get('/index', function (req, res) {
    res.render("index.ejs");
});

//request to view test page (strictly for development)
app.get('/test', function (req, res) {
    res.render("test.ejs");
});

//request to view device-management page
app.get('/devices', function (req, res) {
    res.render("devices.ejs");
});

//request to view child-management page
app.get('/children', function (req, res) {
    res.render("children.ejs");
});

//request to view child-management page
app.get('/logout', function (req, res) {
    res.render("logout.ejs");
});