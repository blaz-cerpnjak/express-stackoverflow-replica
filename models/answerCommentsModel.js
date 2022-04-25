var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var answerCommentsSchema = new Schema({
	'comment' : String,
	'datetime' : Date,
	'answer_id' : String,
	'user' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
});

var AnswerComments = mongoose.model('answerComments', answerCommentsSchema);
module.exports = AnswerComments;
