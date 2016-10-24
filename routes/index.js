var express = require('express');
var router = express.Router();

router.get('/', function (req, res, rext) {
	console.log('login route called');
    res.render('index', {authorized:false});
});
module.exports = router;