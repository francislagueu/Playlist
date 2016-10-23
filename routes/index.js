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
var itemparams = {playlistId: null, part: 'snippet'};

/* Main page where the playlists are located. */
router.get('/', function(req, res,next) {
		if(req.session.authorized){
			function beginRequest(callback){
				youtube.playlists.list(infoparams,function(err, response){
						var pls = null;
						if(!err){
							pls = response.items;
							callback(req,res, pls);
						}
						else{
							console.log("Error occurred grabbing playlist data!",err);
						}

				});
			}
			beginRequest(setupPlObjects);	
		}
		else if(req.session.spotauth){
			var user;
			spotifyapi.getMe().then(function(data){
				
				user = data;
			}, function(err){console.log("error getting user: ", err);});
			res.end();
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

router.get('/playlist?:id',function(req,res,next){
	if(req.session.authorized){
		 itemparams.playlistId = req.query.id;
		 youtube.playlistItems.list(itemparams, function(err, response){
		 	if(!err){
		 		res.json(response);
			}
			else{
				console.log("Error occurred grabbing playlist items!", err);
			}
		});
	}

	
});





function setupPlObjects(req,res,list){
	var playlists = {'plids':[]};
	if(!(null ===list)){
		for(var i = 0; i < list.length; i++){
			//for each playlist request its items.
			var info = {"id": list[i].id,
						"title": list[i].snippet.title
						};
			//looks kinda hacky, I know :/						
			playlists['plids']['' + i] = info;
		}
		
		
	}	
	renderView(req,res,JSON.stringify(playlists));
}
function renderView(req,res, playlist){
	res.render('index', {title: 'Playlist-Manager',
							authorized: req.session.authorized, 
							playlists: playlist});

	res.end();
}
module.exports = router;
