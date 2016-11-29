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

			renderView(req,res,req.session.authorized, req.session.spotauth);

		}
		else{
			req.session.code = null;
			req.session.playlists=null;
			req.session.authorized = false;
			req.session.googleauth= null;
			req.session.spotauth = false;
			renderView(req,res,req.session.authorized, req.session.spotauth);
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
					else{
						console.log("Error occurred grabbing playlist data!",err);
					}

			});
	}
	else 
		next();
});

router.get('/playlist?:id',function(req,res,next){
	if(req.session.authorized){
		 tubeitemparams.playlistId = req.query.id;
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

router.get('/spotplaylistinfo',function(req,res,next){
	var playlists = {'items': []};
	var myid, info;
	if(req.session.spotauth){
		spotifyapi.getMe().then(function(userdata){
			myid = userdata.body.id;
			spotifyapi.getUserPlaylists("" + myid).then(function(data){
				for(var i = 0; i < data.body.items.length; i++){
					info = {
						'id' : data.body.items[i].id,
						'title': data.body.items[i].name,
						'ownerid': data.body.items[i].owner.id,
						'trackcount': data.body.items[i].tracks.total
					};
					playlists['items'][''+i] = info;
				}

				res.json(playlists);
			},function(err){
				console.log("error getting spotify playlist meta data: ", err);
				res.end();
			});
		},
		function(err){
			console.log("error getting user id: ", err);
			res.end();
		});
		
	}
});
router.get('/spotplaylist?', function(req,res,next){
	var playlistid=req.query.id;
	var ownerid = req.query.ownerid;
	var playlist = {'items':[]};
	if(req.session.spotauth){
		spotifyapi.getPlaylist(ownerid, playlistid).then(function(data){
			var tracks = data.body.tracks.items;
			for(var i=0; i < tracks.length; i++){
				var item = {
					'id': tracks[i].track.id,
					'name': tracks[i].track.name
				};
				playlist['items'][i] = item;
			}
			res.json(playlist);
		},
		function(err){
			console.log("There was an error: " ,err);
		});
	}
});

router.post('/createspotifyplaylist', function (req, res, next) {
	var ownerid = req.query.ownerid;
	var name = req.body.playlistname;
	if(req.session.spotauth){
		spotify.createPlaylist(ownerid, name, {'public':false}).then(function (data) {
			console.log('Created Playlist ' + data.name);
        }, function(err){
			console.log("Something went wrong****", err);
		});
	}
});

router.post('/addtracktospotplaylist', function (req, res, next) {
	var ownerid = req.query.ownerid;
	var name = req.body.playlistId;
	var tracks = [];
	if(req.session.spotauth){
		for(var i = 0; i< tracks.length; i++) {
            spotify.addTracksToPlaylist(ownerid, playlistId, ["spotify:track:tracks[i]"]).then(function (data) {

            }, function (err) {
				console.log("Error adding track to playlist!!", err);
            });
        }
	}
})

function renderView(req,res, google, spotify){
	res.render('home', {title: 'Playlist-Manager',
							authorized: google, 
							spotauth: spotify
							});

	res.end();
}
module.exports = router;
