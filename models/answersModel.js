var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const UserModel = require("./userModel");
const date = require("date-and-time");
var Schema = mongoose.Schema;

var answersSchema = new Schema({
	'user_id' : String,
	'question_id': String,
	'datetime' : Date,
	'answer' : String,
	'accepted' : Boolean,
	'points' : Number,
	'user' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'comments': [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'answerComments'
	}]
});

answersSchema.statics.getAnswers = function (question_id, callback) {
	Answer.find({question_id: question_id})
		.populate('user')
		.populate({
			path: 'comments',
			populate: {path: 'user'}
		})
		.exec(function (err, answers) {
			if (err) {
				return callback(err);
			} else if (!answers) {
				var err = new Error("Answers were not found.");
				err.status = 401;
				return callback(err);
			}
			return callback(null, answers);
		});
}

answersSchema.statics.getAnswersCount = function (user_id, callback) {
	Answer.find()
		.populate({
			path: 'user',
			match: {_id: user_id}
		})
		.exec(function (err, answers) {
			if (err) { return res.send(err); }
			if (!answers) { return res.status(401).json(); }
			return callback(null, answers.length);
		});
}

answersSchema.statics.getAnswersCount = function (user_id, callback) {
	Answer.where('user', user_id).countDocuments(function (err, count) {
		if (err) return Error(err);
		return callback(null, count);
	});
}

answersSchema.statics.getAcceptedCount = function (user_id, callback) {
	Answer.where({$and: [{user: user_id}, {accepted: true}]}).countDocuments(function (err, count) {
		if (err) return Error(err);
		return callback(null, count);
	});
}

const Answer = mongoose.model('answer', answersSchema);
module.exports = Answer;
