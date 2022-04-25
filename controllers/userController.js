var UserModel = require('../models/userModel.js');
var AnswersModel = require('../models/answersModel');
var QuestionModel = require('../models/questionModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var image;
        try {
            image = 'images/' + req.file.filename;
        }
        catch (err) {
            image = "images/aa8270956e3bfb97dd3b48294822bfbd";
        }

        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
            image: image
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.redirect('../users/login');
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.id = req.body.id ? req.body.id : user.id;
            user.username = req.body.username ? req.body.username : user.username;
			user.email = req.body.email ? req.body.email : user.email;
			//user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }
                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    /**
     * userController.showLogin()
     * userController.showRegister()
     */

    showLogin: function (req, res) {
        return res.render('user/login');
    },

    showRegister: function (req, res) {
        return res.render('user/register');
    },

    /**
     * userController.login()
     * userController.logout()
     */

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Wrong username or password.");
                err.status = 401; // unauthorised
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/questions');
            }
        });
    },

    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    },

    /**
     * userController.profile()
     */

    profile: function (req, res, next) {
        var id = req.params.id;
        var currentUserId = req.session.userId;
        UserModel.findById(currentUserId)
            .exec(function (error, currentUser) {
                UserModel.findById(id)
                    .exec(function (error, user) {
                        if (error) {
                            return next(error);
                        } else {
                            if (user === null) {
                                var err = new Error("User not found.");
                                err.status = 404;
                                return next(err);
                            } else {
                                AnswersModel.getAnswersCount(id, function (error, answersCount) {
                                    if (error) {
                                        var err = new Error("Cannot get answers.");
                                        err.status = 401;
                                        return next(err);
                                    }
                                    else {
                                        AnswersModel.getAcceptedCount(id, function (error, acceptedCount) {
                                            if (error) {
                                                var err = new Error("Cannot get answers.");
                                                err.status = 401;
                                                return next(err);
                                            } else {
                                                QuestionModel.getCount(id, function (error, questionsCount) {
                                                    return res.render('user/profile', {
                                                        showUser: user,
                                                        userId: currentUserId,
                                                        user: currentUser,
                                                        answersCount: answersCount,
                                                        acceptedCount: acceptedCount,
                                                        questionsCount: questionsCount
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
            });
    }
};
