var express = require('express');
var router = express.Router();
var spotify = require('../custom_modules/spotify.js');
var spotifywebapi = spotify.getSpotifyWebApi();
//scopes we want to authorize: 
var scopes = ['playlist-read-private', 'playlist-modify-private','playlist-modify-public'];

function init(req,res,next){
	//need to make this some kind of hashed value!! good for preventing CSRF
	var state = 'abc123';
	req.session.state = state;
	var url = spotifywebapi.createAuthorizeURL(scopes, state);
	res.redirect(url);
}

function prepCredentials(req,res,next){
	var code = req.query.code; 
	spotifywebapi.authorizationCodeGrant(code).then(function(data){
		spotifywebapi.setAccessToken(data.body['access_token']);
		spotifywebapi.setRefreshToken(data.body['refresh_token']);
		res.status(200).redirect('../..');
	},
	function(err){
		console.log("Something went wrong with Spotify Creds!", err);
		res.end();
	});
}

router.get('/', init);
router.get('/auth', prepCredentials);
module.exports = router;
