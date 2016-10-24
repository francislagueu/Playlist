var express = require('express');
var router = express.Router();


router.get('/', function(req, res,next) {
	console.log('register called');
    res.render('register', { message: req.flash('signupMessage')});
});

module.exports = router;

