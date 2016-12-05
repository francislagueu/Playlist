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

//router.use(isLoggedIn() );
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
/*
	Get the playlist items inside a given playlist and also 
	check to make sure that it's categorized as 'Music'
*/
router.get('/playlist?:id',function(req,res,next){
	var idlist = '';
	//items to return to the view. 
	var itemlist = [];
	var itemcount;
	var viewdata = {};
	if(req.session.authorized){
		 tubeitemparams.playlistId = req.query.id;
		 youtube.playlistItems.list(tubeitemparams, function(err, itemsResponse){

		 	if(!err){
		 		if(!(itemsResponse.items == 'undefined') && !(itemsResponse.items.length == 0)){
		 			for(var i = 0; i < itemsResponse.items.length; i ++){
		 				idlist = idlist + itemsResponse.items[i].snippet.resourceId.videoId;
		 				if(!(i == itemsResponse.items.length-1)){
		 					idlist= idlist + ',';
		 				}
		 			}
		 			//split the string into an array
		 			youtube.videos.list({part: 'snippet', id: idlist}, function(err, videosResponse){
		 				if(!err){
		 					itemcount = 0;
		 					idlist = idlist.split(",");
		 					for(var j = 0; j < videosResponse.items.length; j ++){
		 						if(videosResponse.items[j].snippet.categoryId === '10'){
		 							itemlist[itemcount] = videosResponse.items[j];
		 							itemlist[itemcount].id = itemsResponse.items[j].snippet.id;
		 							itemlist[itemcount].vidid = idlist[j];
		 							itemcount++;
		 						}
		 					}
		 					viewdata = {
		 						items: itemlist
		 					}
		 					res.json(viewdata);
		 				}
		 				else
		 					console.log("error getting the videos info: ", err);
		 			});
		 		}
		 		//res.json(itemsResponse);
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
						'trackcount': data.body.items[i].tracks.total,
						'images':data.body.items[i].images
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
					'name': tracks[i].track.name,
					'albumart': tracks[i].track.album.images[0].url
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
		spotifyapi.setAccessToken(data.body['access_token']);
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
