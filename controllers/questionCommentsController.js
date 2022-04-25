var QuestionCommentsModel = require('../models/questionCommentsModel.js');

/**
 * questionCommentsController.js
 *
 * @description :: Server-side logic for managing question_comments.
 */
module.exports = {

    /**
     * question_commentsController.list()
     */
    list: function (req, res) {
        QuestionCommentsModel.find(function (err, question_comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question_comments.',
                    error: err
                });
            }

            return res.json(question_comments);
        });
    },

    /**
     * question_commentsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionCommentsModel.findOne({_id: id}, function (err, question_comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question_comments.',
                    error: err
                });
            }

            if (!question_comments) {
                return res.status(404).json({
                    message: 'No such question_comments'
                });
            }

            return res.json(question_comments);
        });
    },

    /**
     * question_commentsController.create()
     */
    create: function (req, res) {
        var questionComments = new QuestionCommentsModel({
			comment : req.body.comment,
			datetime : new Date(),
			question_id : req.body.question_id,
            user: req.body.user_id
        });

        questionComments.save(function (err, questionComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question_comments',
                    error: err
                });
            }

            return res.status(201).json(questionComments);
        });
    },

    /**
     * question_commentsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionCommentsModel.findOne({_id: id}, function (err, question_comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question_comments',
                    error: err
                });
            }

            if (!question_comments) {
                return res.status(404).json({
                    message: 'No such question_comments'
                });
            }

            question_comments.comment = req.body.comment ? req.body.comment : question_comments.comment;
			question_comments.datetime = req.body.datetime ? req.body.datetime : question_comments.datetime;
			question_comments.question_id = req.body.question_id ? req.body.question_id : question_comments.question_id;
			
            question_comments.save(function (err, question_comments) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question_comments.',
                        error: err
                    });
                }

                return res.json(question_comments);
            });
        });
    },

    /**
     * question_commentsController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;
        const question_id = req.body.question_id;

        QuestionCommentsModel.findByIdAndRemove(id, function (err, question_comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question_comments.',
                    error: err
                });
            }

            return res.redirect('/questions/' + question_id);
        });
    }
};
