var express = require('express');
var router = express.Router();

module.exports = router;
router.get('/register', function(req, res) {
    res.render('register.ejs', { message: req.flash('signupMessage')});
});

router.get('/login', function (req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});


