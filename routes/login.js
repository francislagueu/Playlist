var express = require('express');
var router = express.Router();


router.get('/', function(req, res,next) {
	console.log('Login is Called');
    res.render('login');
});

module.exports = router;

