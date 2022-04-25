var express = require('express');
var router = express.Router();
var questionCommentsController = require('../controllers/questionCommentsController.js');

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
router.get('/', questionCommentsController.list);

/*
 * GET
 */
router.get('/:id', questionCommentsController .show);

/*
 * POST
 */
router.post('/', requiresLogin, questionCommentsController .create);

/*
 * PUT
 */
router.put('/:id', requiresLogin, questionCommentsController .update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, questionCommentsController .remove);

module.exports = router;
