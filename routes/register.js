var express = require('express');
var router = express.Router();


router.get('/', function(req, res,next) {
	console.log('register called');
    res.render('register', { message: req.flash('signupMessage')});
});

router.get('/login', function (req, res) {
    res.render('login', {message: req.flash('loginMessage')});
});
module.exports = router;

