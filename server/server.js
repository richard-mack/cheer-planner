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

const athleteSchema = mongoose.Schema({
	id : String,
	firstName : String,
	lastName : String,
	routineID : String,
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

app.use(express.static('/Users/richardmack/CheerPlanner/client/bower_components'));
app.use(express.static('/Users/richardmack/CheerPlanner/client'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'main.html'));
});

app.use('/api', routes);

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

/*app.get('/', function (req, res) {
	res.writeHead(200, {'Content-Type' : 'text/html'});
	fs.readFile('/Users/richardmack/CheerPlanner/client/index.html', function (err, contents) {
		res.end(contents, 'utf-8');
	})
});*/

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

/*router.route('/routines/*').get(function (req,res) {
	var returnObj = {}
	var routineID = req.url.split('/')[2];
	// Begin Callback Hell.
	Routine.findOne({id : routineID}, function (err, routine) {
		if (!routine) {
			routine = {routineName : decodeURI(routineID), id : routineID};
		}

		returnObj['routineObj'] = routine;
		Athlete.find({routineID : routineID}, function (err, athletes) {
			returnObj['athleteArray'] = athletes;
			Count.find({routineID : routineID}, function (err, counts) {
				returnObj['countArray'] = counts;
				res.send(returnObj);
			});
		});
	});
});

router.route('/save').post(function (req, res) {
	var response = ''
	var routine = req.body.routine;
	var athletes = req.body.athletes;
	var counts = req.body.counts;
	var deletedAthletes = req.body.deletedAthletes ? req.body.deletedAthletes : [];
	var account = {username : req.headers.username, password : req.headers.password, id : createID({prefix : 'A'})} // In case we need a new account
	Account.findOneAndUpdate({username : account.username, password : account.password}, {$set : {username : account.username, password : account.password, id : account.id}}, {upsert : true, new : true})
	.then(function (resultAccount) {
		routine.accountID = resultAccount.id;
		console.log(resultAccount);
		return Routine.findOneAndUpdate({id : routine.id, accountID : routine.accountID}, {$set : {id : routine.id, routineName : routine.routineName, accountID : routine.accountID}}, {upsert : true, new : true});
	}).then(function (resultRoutine) {
		console.log(resultRoutine);
		return Promise.all(
			deletedAthletes.reduce(function (acc, athlete) {
				acc.push(Athlete.remove({id : athlete}));
				acc.push(Count.remove({athleteID : athlete}));
				return acc;
			}, []).concat(
			athletes.map(function (athlete) {
				return Athlete.findOneAndUpdate({id : athlete.id, routineID : resultRoutine.id}, athlete, {upsert : true, new : true});
			})).concat(
			counts.map(function (count) {
				return Count.findOneAndUpdate({id : count.id, athleteID : count.athleteID, routineID : resultRoutine.id}, count, {upsert : true, new : true});
			})));
	}).then(function (result) {res.send(result);}).catch(function (err) {console.log(err)});

});*/



app.listen(port);

