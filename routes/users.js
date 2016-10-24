var express = require('express');
var router = express.Router();


router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile.ejs', {user:req.user});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports = router;
