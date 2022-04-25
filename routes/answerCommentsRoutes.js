var express = require('express');
var router = express.Router();
var answerCommentsController = require('../controllers/answerCommentsController.js');

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
router.get('/', answerCommentsController.list);

/*
 * GET
 */
router.get('/:id', answerCommentsController.show);

/*
 * POST
 */
router.post('/', requiresLogin, answerCommentsController.create);

/*
 * PUT
 */
router.put('/:id', requiresLogin, answerCommentsController.update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, answerCommentsController.remove);

module.exports = router;
