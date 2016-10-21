var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
	clientId : '218e7ca8472b4e3ea6004e02a5be68bd',
	clientSecret : 'aa96d57ac4544e928983db18e68b9429',
	redirectUri : 'http://localhost:3000/spotify/auth'

});

module.exports.getSpotifyWebApi = function(){
	return spotifyApi;
};