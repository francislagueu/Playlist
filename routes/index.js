var express = require('express');
var router = express.Router();
var googleapis = require('./google.js');
var google = googleapis.getGoogle();
var oauth2Client = googleapis.getClient();
var youtube = google.youtube({version: 'v3'});
var snippet,contentDetails;
var params =  {mine:true, part: 'snippet, contentDetails'};

var playlists = [];
var messages = '';
function renderCallback(req,res,list){
	if(!(null ===list)){
		res.render('index', {title: 'Playlist-Manager',
							authorized: req.session.authorized, 
							playlists: list});
		res.end();
	}
	else{
		res.render('index', {title: 'Playlist-Manager',
							authorized: req.session.authorized});
		res.end();
	}

	
}
/* GET home page. */
router.get('/', function(req, res,next) {
		if(req.session.authorized){
			console.log("AUTHORIZED");
			function list(callback){
				youtube.playlists.list(params,function(err, response){
						var pls = null;
						if(!err){
							pls = response.items;
							console.log(pls);
							callback(req,res, pls);
							
						}
						else{
							console.log("ERROR OCCURRED!",err);
						}

				});
			}
			list(renderCallback);	
		}
		else{

			req.session.code = null;
			req.session.playlists=null;
			req.session.authorized = null;
			req.session.googleauth= null;
			renderCallback(req,res,null);
			pls = null;
		}
		
});

module.exports = router;
