var express = require('express');
var router = express.Router();
var googleapis = require('./google.js');
var google = googleapis.getGoogle();
var oauth2Client = googleapis.getClient();
var youtube;
router.use(function(req,res,next){
	if(req.session.code){
		res.send(oauth2Client);
		
	}
	else{
		req.session.code = null;
		next();
	}
});


/* GET home page. */
router.get('/', function(req, res,next) {

		
		if(req.session.authorized){
			
			res.end();
		}
		else{
			res.render('index', {title: 'Playlist-Manager',authorized: req.session.authorized, });
			req.session.authorized = null;
			req.session.googleauth= null;
			res.end();
		}

	
});

module.exports = router;
