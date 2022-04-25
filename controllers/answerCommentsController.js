var AnswercommentsModel = require('../models/answerCommentsModel.js');

/**
 * answerCommentsController.js
 *
 * @description :: Server-side logic for managing answerCommentss.
 */
module.exports = {

    /**
     * answerCommentsController.list()
     */
    list: function (req, res) {
        AnswercommentsModel.find(function (err, answerCommentss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answerComments.',
                    error: err
                });
            }

            return res.json(answerCommentss);
        });
    },

    /**
     * answerCommentsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AnswercommentsModel.findOne({_id: id}, function (err, answerComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answerComments.',
                    error: err
                });
            }

            if (!answerComments) {
                return res.status(404).json({
                    message: 'No such answerComments'
                });
            }

            return res.json(answerComments);
        });
    },

    /**
     * answerCommentsController.create()
     */
    create: function (req, res) {
        var answerComments = new AnswercommentsModel({
			comment : req.body.comment,
			datetime : req.body.datetime,
			answer_id : req.body.answer_id
        });

        answerComments.save(function (err, answerComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating answerComments',
                    error: err
                });
            }

            return res.status(201).json(answerComments);
        });
    },

    /**
     * answerCommentsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AnswercommentsModel.findOne({_id: id}, function (err, answerComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answerComments',
                    error: err
                });
            }

            if (!answerComments) {
                return res.status(404).json({
                    message: 'No such answerComments'
                });
            }

            answerComments.comment = req.body.comment ? req.body.comment : answerComments.comment;
			answerComments.datetime = req.body.datetime ? req.body.datetime : answerComments.datetime;
			answerComments.answer_id = req.body.answer_id ? req.body.answer_id : answerComments.answer_id;
			
            answerComments.save(function (err, answerComments) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answerComments.',
                        error: err
                    });
                }

                return res.json(answerComments);
            });
        });
    },

    /**
     * answerCommentsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var question_id = req.body.question_id;
        console.log(question_id);
        AnswercommentsModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the answerComments.',
                    error: err
                });
            }

            return res.redirect('/questions/' + question_id);
        });
    }
};
