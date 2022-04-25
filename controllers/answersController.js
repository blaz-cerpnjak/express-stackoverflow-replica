var AnswersModel = require('../models/answersModel.js');
var AnswerCommentsModel = require('../models/answerCommentsModel.js');

module.exports = {

    /**
     * answersController.list()
     */
    list: function (req, res) {
        AnswersModel.find(function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Answers.',
                    error: err
                });
            }

            return res.json(answers);
        });
    },

    /**
     * answersController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AnswersModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            return res.json(answer);
        });
    },

    /**
     * answersController.create()
     */
    create: function (req, res) {
        var answer = new AnswersModel({
			user : req.body.user_id,
            question_id: req.body.question_id,
			datetime : new Date(),
			answer : req.body.answer,
			accepted : false,
			points : 0
        });

        answer.save(function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Answers',
                    error: err
                });
            }

            return res.redirect('../questions/'+req.body.question_id);
        });
    },

    /**
     * answersController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        var question_id;

        AnswersModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Answers',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such Answers'
                });
            }

            answer.user_id = req.body.user_id ? req.body.user_id :  answer.user_id;
            answer.question_id = req.body.user_id ? req.body.question_id : answer.question_id;
            answer.datetime = req.body.datetime ? req.body.datetime :  answer.datetime;
            answer.answer = req.body.answer ? req.body.answer :  answer.answer;
            answer.accepted = req.body.accepted ? req.body.accepted :  answer.accepted;
            answer.points = req.body.points ? req.body.points :  answer.points;
            question_id = req.body.question_id;

            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Answers.',
                        error: err
                    });
                }

                return res.redirect('/questions');
            });
        });
    },

    /**
     * answersController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var question_id = req.body.question_id;
        console.log(question_id);
        AnswersModel.findByIdAndRemove(id, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Answers.',
                    error: err
                });
            }

            return res.redirect('/questions/' + question_id);
        });
    },

    /**
     * answersController.comment()
     */
    comment: function (req, res) {
        const id = req.body.answer_id;
        const question_id = req.body.question_id;

        const comment = new AnswerCommentsModel({
            user: req.body.user_id,
            answer_id: id,
            datetime: new Date(),
            comment: req.body.comment
        });

        comment.save(function (err, answerComment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating answerComments',
                    error: err
                });
            }

            AnswersModel.findById(id, function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error while getting the answer.',
                        error: err
                    });
                }

                answer.comments.push(answerComment);

                answer.save(function (err) {
                    if(err) {
                        console.log(err);
                    }
                    return res.redirect('/questions/' + question_id);
                })
            });
        });
    }
};
