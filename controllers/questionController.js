var QuestionModel = require('../models/questionModel.js');
var UserModel = require('../models/userModel.js');
var AnswerModel = require('../models/answersModel.js');
var QuestionCommentsModel = require('../models/questionCommentsModel.js');
const date = require("date-and-time");

module.exports = {

    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find({}).sort('-datetime').exec((err, questions) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            UserModel.findById(req.session.userId, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'User not found.',
                        error: err
                    });
                }

                var newQuestions = []
                for (let i = 0; i < questions.length; i++) {
                    const formattedDateTime = date.format(questions[i].datetime, 'DD.MM.YYYY, HH:MM');
                    newQuestions[i] = questions[i];
                    newQuestions[i].formattedDate = formattedDateTime;
                }

                const data = [];
                data.questions = newQuestions;
                if (questions.length === 1) {
                    data.questionsCount = questions.length + " question."
                } else {
                    data.questionsCount = questions.length + " questions.";
                }
                return res.render('index', {data: data, user: user, userId: req.session.userId});
            });
        });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        var user_id = req.session.userId;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            UserModel.findById(question.user_id)
                .exec(function (error, author) {
                    if (error) {
                        return new Error("Error");
                    } else {
                        if (author === null) {
                            var err = new Error("Author of this question was not found.");
                            err.status = 401;
                        } else {
                            var answers = null;
                            var questionComments = null;

                            AnswerModel.getAnswers(id, function (error, ans) {
                                if (!error && ans) {
                                    answers = ans;
                                }

                                QuestionCommentsModel.getComments(id, function (error, comments) {
                                    if (!error && comments) {
                                        questionComments = comments;
                                    }

                                    UserModel.findById(req.session.userId, function (err, user) {
                                        const date = require('date-and-time');
                                        const formattedDateTime = date.format(question.datetime, 'DD.MM.YYYY HH:MM');
                                        const data = [];
                                        data.question = question;
                                        data.questionComments = questionComments;
                                        data.formattedDateTime = formattedDateTime;
                                        data.author = author;
                                        data.answers = answers;
                                        data.user_id = user_id;

                                        if (author.id === user_id) {
                                            data.is_author = true;
                                        }

                                        return res.render('question/show', {data: data, user: user, userId: user_id});
                                    });
                                })
                            });
                        }
                    }
            });
        });
    },

    /**
     * questionController.create()
     */
    create: function (req, res) {
        const tagsString = req.body.tags;
        const tags = tagsString.toString().split(' ');
        console.log(tags);

        const question = new QuestionModel({
            user_id: req.session.userId,
            title: req.body.title,
            description: req.body.description,
            datetime: new Date(),
            tags: tags
        });

        question.save(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question',
                    error: err
                });
            }

            return res.status(201).json(question);
        });
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        const id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            question.title = req.body.title ? req.body.title : question.title;
			question.description = req.body.description ? req.body.description : question.description;
			question.datetime = req.body.datetime ? req.body.datetime : question.datetime;
			question.tags = req.body.tags ? req.body.tags : question.tags;
			
            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;

        QuestionModel.findByIdAndRemove(id, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }

            return res.redirect('../questions');
        });
    },

    /**
     * questionController.showAskQuestion()
     */
    showAskQuestion: function (req, res) {
        UserModel.findById(req.session.userId, function (err, user) {
            return res.render('question/ask', {user: user, userId: req.session.userId});
        });
    },

    /**
     * questionController.search()
     */
    search: function (req, res) {
        const tags = req.query.tags.toString().split(' ');

        QuestionModel.find({tags: {$in: tags}}).sort('-datetime').exec((err, questions) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            var newQuestions = []
            for (let i = 0; i < questions.length; i++) {
                const formattedDateTime = date.format(questions[i].datetime, 'DD.MM.YYYY, HH:MM');
                newQuestions[i] = questions[i];
                newQuestions[i].formattedDate = formattedDateTime;
            }

            const data = [];
            data.questions = newQuestions;
            return res.render('index', {data: data, userId: req.session.userId});
        });
    }
};
