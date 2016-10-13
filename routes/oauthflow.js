var express = require('express');
var router = express.Router();
var app = express();
//grab the googleapi library and Oauth2 Object. 
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
// might have to hide these credentials
var clientId = '249154147070-8giv92se5vejk803lokt05lusoef5ir5.apps.googleusercontent.com';
var secret = 'ZRsxEiA6eO-mM6mtb9F0aGRf';
var redirect_uri = 'http://localhost:3000/oauth/callback';
var scopes = ['https://www.googleapis.com/auth/youtube'];
var oauth2Client = new OAuth2(clientId, secret, redirect_uri);

var youtube = google.youtube('v3');

function init(req,res,next){
	//set the global oauth2 client for google.
	google.options({auth:oauth2Client});
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope:scopes
	});
	// console.log("init..");
	res.redirect(url);
}
function grabAndSetCreds(req,res,next){
	// grab the code from the query param
	var code = req.query.code;
	oauth2Client.getToken(code, function(err, tokens){
		if(!err){
			oauth2Client.setCredentials(tokens);
			res.redirect('/');
			res.end();
		}
		else{
			next();
		}
	});
	
}


//start auth flow.
router.get('/',init);
//handle the callback url.
router.get('/callback',grabAndSetCreds);








module.exports = router;