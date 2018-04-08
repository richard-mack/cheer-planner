'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
const express = require('express');
const passport = require('passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser')
const port = 1337;

var routes = require('./routes');

mongoose.connect('mongodb://localhost/cheerPlannerAppTest'); // Connect to the DB. By default, buffering means that we don't have to wait on this.

const countSchema = mongoose.Schema({
	id : String,
	count : Number,
	posx : Number,
	posy : Number,
	note : String,
	athleteID : String,
	routineID : String,
	accountID : String,
});

const routineSchema = mongoose.Schema({
	id : String,
	routineName : String,
	accountID : String,
});

const accountSchema = mongoose.Schema({
	username : String,
	password : String,
	id : String,
});

var Count = mongoose.model('Count', countSchema);
//var Routine = mongoose.model('Routine', routineSchema);
//var Athlete = mongoose.model('Athlete', athleteSchema);
//var Account = mongoose.model('Account', accountSchema);

var createID = function (options) {
    var id = "";
    if (options && options.prefix)
      id += options.prefix.slice(0,32);
    id += (new Date()).getTime().toString(36);
    while (id.length < 32) {
      id += Math.floor(Math.random()*36).toString(36);
    }
    return id;
  }

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
	secret : 'cheer squad',
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

var router = express.Router();
//console.log((path.join(__dirname, '../client-angular')));
app.use(express.static(path.join(__dirname, '../client-react')));	

// We need to have the API routes before the generic one
app.use('/api', routes);

// If we aren't accessing an API, load the index and let its routing handle where to go
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client-react', 'index.html'));
});



var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

app.listen(port);

