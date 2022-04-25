var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionSchema = new Schema({
	'user_id': String,
	'title' : String,
	'description' : String,
	'datetime' : Date,
	'tags' : Array
});

questionSchema.statics.getCount = function (user_id, callback) {
	Question.where('user_id', user_id).countDocuments(function (err, count) {
		if (err) return Error(err);
		return callback(null, count);
	});
}

const Question = mongoose.model('question', questionSchema);
module.exports = Question;

