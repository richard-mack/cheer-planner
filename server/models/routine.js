var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Routine = new Schema({
    id: String,
    name: String,
    accountID : String,
    counts : Object,
    athletes : [String],
    lastModified : Date,
    notes : [String],
    config : Object,
});


module.exports = mongoose.model('Routine', Routine);