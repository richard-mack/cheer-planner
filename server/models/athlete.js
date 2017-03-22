var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Athlete = new Schema({
    id : String,
    name : String,
	firstName : String,
	lastName : String,
	position : String,
	skills : [String],
	accountID : String,
	lastModified : Date,
});

module.exports = mongoose.model('Athlete', Athlete);