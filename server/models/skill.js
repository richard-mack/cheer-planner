var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = new Schema({
    id : String,
	name : String,
	category : String,
	accountID : String,
	description : String,
	lastModified : Date,
});

module.exports = mongoose.model('Skill', Skill);