var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Routine = new Schema({
    id: String,
    name: String,
    accountID : String,
    counts : [{count : Number, athleteID : String, posx : Number, posy : Number, note : String}],
    athletes : [String],
    lastModified : Date
});


module.exports = mongoose.model('Routine', Routine);