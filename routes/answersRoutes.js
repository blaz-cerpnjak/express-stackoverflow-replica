var express = require('express');
var router = express.Router();
var AnswersController = require('../controllers/answersController.js');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var status = 401;
        var message = "You must be logged in to view this page.";
        return res.render('error', {status: status, message: message});
    }
}

/*
 * GET
 */
router.get('/', AnswersController.list);

/*
 * GET
 */
router.get('/:id', AnswersController.show);

/*
 * POST
 */
router.post('/', requiresLogin, AnswersController.create);
router.post('/comment', requiresLogin, AnswersController.comment);

/*
 * PUT
 */
router.put('/:id', requiresLogin, AnswersController.update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, AnswersController.remove);

module.exports = router;
