/**
 * Created by Francis on 12/5/2016.
 */
var spotify = require('../../custom_modules/spotify.js');
var spotifyapi = spotify.getSpotifyWebApi();

var user = spotifyapi.getMe().then(function (data) {
    console.log(data.body);
}, function (err) {
    console.log("error ", err);
})

exports.CurrentUsert = user;
