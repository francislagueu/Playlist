var express = require('express');
var router = express.Router();
var app = express();
//grab the googleapi library and Oauth2 Object. 
var googleapis = require('../custom_modules/google.js');
var google = googleapis.getGoogle();
var OAuth2 = google.auth.OAuth2;
var scopes = ['https://www.googleapis.com/auth/youtube'];
var oauth2Client = googleapis.getClient();

function init(req,res,next){
	//set the global oauth2 client for google.
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope:scopes
	});
	res.redirect(url);
}
function grabAndSetCreds(req,res,next){
	// grab the code from the query param
	var code = req.query.code;
	//get the access tokens. 
	oauth2Client.getToken(code, function(err, tokens){
		if(!err){
			oauth2Client.setCredentials(tokens);
			req.session.code = code;
			google.options({auth:oauth2Client});
			req.session.authorized = true;
			res.redirect('/home');
		}
		else{
			req.session.authorized = false;
			next();
		}
	});
}
//start auth flow.
router.get('/',init);
//handle the callback url.
router.get('/callback',grabAndSetCreds);

module.exports = router;
