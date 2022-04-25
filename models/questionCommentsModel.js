var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionCommentsSchema = new Schema({
	'comment' : String,
	'datetime' : Date,
	'question_id' : String,
	'user' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
});

questionCommentsSchema.statics.getComments = function (question_id, callback) {
	QuestionComments.find({question_id: question_id})
		.populate('user')
		.exec(function (err, comments) {
			if (err) {
				return callback(err);
			} else if (!comments) {
				var err = new Error("Comments were not found.");
				err.status = 401;
				return callback(err);
			}
			return callback(null, comments);
		});
}

const QuestionComments = mongoose.model('questionComments', questionCommentsSchema);
module.exports = QuestionComments;
