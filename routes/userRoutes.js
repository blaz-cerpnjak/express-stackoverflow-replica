var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile/:id', userController.profile);
router.get('/logout', userController.logout);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', upload.single('image'), userController.create);
router.post('/login', userController.login);
router.post('/:id', requiresLogin, userController.update);

/*
 * PUT
 */
router.put('/:id', requiresLogin, userController.update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, userController.remove);

module.exports = router;
