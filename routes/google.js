var google = require('googleapis');
var clientId = '249154147070-8giv92se5vejk803lokt05lusoef5ir5.apps.googleusercontent.com';
var secret = 'ZRsxEiA6eO-mM6mtb9F0aGRf';
var redirect_uri = 'http://localhost:3000/oauth/callback';
var scopes = ['https://www.googleapis.com/auth/youtube'];
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(clientId, secret, redirect_uri);

module.exports.getGoogle = function(){
	return google;
}
module.exports.getClient = function(){
	return oauth2Client;
}