var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('register', { message: req.flash('signupMessage')});
});

router.post()

module.exports = router;

