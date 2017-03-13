'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const port = 1337;
mongoose.connect('mongodb://localhost/cheerPlannerAppTest'); // Connect to the DB. By default, buffering means that we don't have to wait on this.

const countSchema = mongoose.Schema({
	id : String,
	count : Number,
	posx : Number,
	posy : Number,
	note : String,
	athleteID : String,
	routineID : String
});

const routineSchema = mongoose.Schema({
	id : String,
	routineName : String,
});

const athleteSchema = mongoose.Schema({
	id : String,
	firstName : String,
	lastName : String,
	routineID : String,
});

var Count = mongoose.model('Count', countSchema);
var Routine = mongoose.model('Routine', routineSchema);
var Athlete = mongoose.model('Athlete', athleteSchema);


var recursiveUpsert = function (arrayToSave, resultsArray, finalCallback) {
	if (arrayToSave.length == 0)
		return finalCallback(resultsArray);
	return arrayToSave[0].save(function (err, retValue) {
		if (err)
			return err;
		resultsArray.push(retValue);
		return recursiveSave(arrayToSave.splice(1), resultsArray, finalCallback);
	});
}

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var router = express.Router();

app.get('/', function (req, res) {
	res.writeHead(200, {'Content-Type' : 'text/html'});
	fs.readFile('/home/ubuntu/CheerPlanner/client/index.html', function (err, contents) {
		res.end(contents, 'utf-8');
	})
});

router.route('/routines/*').get(function (req,res) {
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
	Routine.findOneAndUpdate({id : routine.id}, {$set : routine}, {upsert : true, new : true}).then(function (resultRoutine) {
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
	}).then(function (result) {res.send(result);});

});

app.use('/api', router);
app.use(express.static('/home/ubuntu/CheerPlanner/client/bower_components'));
app.use(express.static('/home/ubuntu/CheerPlanner/client'));


app.listen(port);

