var express = require('express');
var router = express.Router();

/* GET my register page. *///oct13  correct!
router.get('', function(req, res) {
  res.render('clydeindex', { title: 'Express' });
});
/*to learn*/
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});
module.exports = router;
