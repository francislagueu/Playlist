var express = require('express');
var router = express.Router();
var googleapis = require('../custom_modules/google.js');
var spotify = require('../custom_modules/spotify.js');
var google = googleapis.getGoogle();
var oauth2Client = googleapis.getClient();
var spotifyapi = spotify.getSpotifyWebApi();
var googleplaylist  = require('../custom_modules/googleplaylist.js');
var youtube = google.youtube({version: 'v3'});
var infoparams =  {mine:true, part: 'snippet'};
var tubeitemparams = {playlistId: null, part: 'snippet'};

/* Main page where the playlists are located. */
router.get('/', function(req, res,next) {
		if(req.session.authorized || req.session.spotauth){
			renderView(req,res,null);
			
		}
		
		else{
			req.session.code = null;
			req.session.playlists=null;
			req.session.authorized = null;
			req.session.googleauth= null;
			renderView(req,res,null);
			pls = null;
		}
		
});

router.get('/playlistinfo', function(req, res, next){
	var playlists = {'plids':[]};
	var info;
	if(req.session.authorized){
			youtube.playlists.list(infoparams,function(err, response){
					var pls = null;
					if(!err){
						pls = response.items;
						if(!(null === pls) || !('undefined' === pls)){
							for(var i = 0; i < pls.length; i++){
								//for each playlist request its items.
								info = {"id": pls[i].id,
										"title": pls[i].snippet.title
										};
								//looks kinda hacky, I know :/						
								playlists['plids']['' + i] = info;
							}
							res.json(playlists);	
						}
						
					}
					else
						console.log("Error occurred grabbing playlist data!",err);
					

			});
	}
	else 
		next();
});

router.get('/playlist?:id',function(req,res,next){
	if(req.session.authorized){
		 tubeitemparams.playlistId = req.query.id;
		 console.log(req.query.id);
		 youtube.playlistItems.list(tubeitemparams, function(err, response){

		 	if(!err){

		 		res.json(response);
			}
			else{
				console.log("Error occurred grabbing playlist items!", err);
			}
		});
	}

});

function renderView(req,res, playlist){
	res.render('home', {title: 'Playlist-Manager',
							authorized: req.session.authorized, 
							playlists: playlist});

	res.end();
}
module.exports = router;
