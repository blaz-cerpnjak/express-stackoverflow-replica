var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');

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
router.get('/', questionController.list);
router.get('/ask', requiresLogin, questionController.showAskQuestion);
router.get('/search', questionController.search);

/*
 * GET
 */
router.get('/:id', questionController.show);

/*
 * POST
 */
router.post('/', requiresLogin, questionController.create);

/*
 * PUT
 */
router.put('/:id', requiresLogin, questionController.update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, questionController.remove);

module.exports = router;
