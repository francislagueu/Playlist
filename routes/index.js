var express = require('express');
var router = express.Router();
var googleapis = require('../custom_modules/google.js');
var google = googleapis.getGoogle();
var oauth2Client = googleapis.getClient();
var googleplaylist  = require('../custom_modules/googleplaylist.js');
var youtube = google.youtube({version: 'v3'});
var infoparams =  {mine:true, part: 'snippet'};
var itemparams = {playlistId: null, part: 'snippet'};

/* GET home page. */
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
			beginRequest(setupPlaylistsRequest);	
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

router.get('/playlist',function(req,res,next){
	console.log("route gets called");
	res.end();
});

function setupPlaylistsRequest(req,res,list){
	var plids = [];

	if(!(null ===list)){
		for(plinfo of list){
			// console.log("id is: ", plinfo.id);
			// console.log("title is: ", plinfo.snippet.title);
			//for each playlist request its items.
			var info = {"id": plinfo.id,
						"title": plinfo.snippet.title
						}
			plids.push(info);
		}
		
	}	
	renderView(req,res,plids);
}
function renderView(req,res, playlist){
	res.render('index', {title: 'Playlist-Manager',
							authorized: req.session.authorized, 
							playlists: playlist});

	res.end();
}
module.exports = router;
