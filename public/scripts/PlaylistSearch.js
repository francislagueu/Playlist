var playlist = {};
var accessToken = '';
var userID = '';
var audioObject = null;

function makeRequest(type, url, params, cbk) {
    console.log("making a request");
    reqBody = {
        'type':type,
        'url':url,
        'crossDomain':true,
        'xhrFields':{
            'withCredentials':false
        }
    };

    for(var key in params){
        console.log(params[key]);
        reqBody[key] = params[key];
    }

    $.ajax(reqBody)
        .done(cbk)
        .fail(function (xhr, textStatus, errorThrown) {
            alert(xhr.responseText);
            console.log(xhr);
        });

}

function search(type, query) {
    console.log('searching ...');
    console.log(query);
    if(query === ''){
        displayMessage("Sorry, that was an empty search.");
    }else{
        makeRequest(
            'get',
            'https://api.spotify.com/v1/search?q='+query+'&type='+type,
            {
                'dataType':'json',
            },
            function (data) {
                console.log(data);
                if(type == 'artist'){
                    appendToPage(data.artists.items, 'artist');
                }else{
                    appendToPage(data.tracks.items, 'track');
                }
            }
        );
    }
}

function displayMessage(message) {
    $('#search-results').html(message);
}

function appendToPage(data, type) {
    $('#search-results').html(' ');

    if(data.length ===0){
        displayMessage('Sorry we couldn\'t find that.');
    }else{
        for(var result in data){
            if(type=='artist'){
                $('#search-results').append(
                    '<p class="result result-artist" id="' + data[result].id +
                        '"onclick="getArtistsTracks(this.id)">' + data[result].name + '</p>'
                );
            }else{
                $('#search-results').append(
                    '<div class="result">\
                        <span class="glyphicon glyphicon-music music-button"\
                        id="' + data[result].id + '" onclick="playTrack(this.id)"></span>\ ' +
                        '<p class="result-song" id="' + data[result].artists[0].name + '{-]' +
                        data[result].name + '{-]' + data[result].id + '" onclick="addToPlaylist(this.id)"> \
                        <span class="glyphicon glyphicon-plus add-buttoon"></span> '+
                            data[result].artists[0].name + '- ' + data[result].name + '</p>\
                    </div>'
                );
            }
        }
    }
}

function getArtistsTracks(artistID) {
    console.log('Getting and artist tracks...');
    makeRequest(
        'get',
        'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
        {
            'dataType':'json',
        },
        function(data) {
            appendToPage(data.tracks, 'track');
        }
    );
}

function playTrack(trackID) {
    makeRequest(
        'get',
        'https://api.spotify.com/v1/tracks/' + trackID,
        {
            'dataType': 'json',
        },
        function (data) {
            if($('#' + trackID).hasClass('playing')){
                audioObject.pause();
            }else{
                if(audioObject){
                    audioObject.pause();
                }

                $('#'+ trackID).addClass('playing');
                audioObject = new Audio(data.preview_url);
                audioObject.play();
                audioObject.addEventListener('ended', function () {
                    $('.playing').removeClass('playing');
                });
                audioObject.addEventListener('pause', function () {
                    $('.playing').removeClass('playing');
                });
            }
        }
    );
}

function addToPlaylist(id) {

    id = id.split('{-]');

    if(playlist[id[2]]===undefined && id[2]!==undefined){
        playlist[id[2]]=1;
        $('#playlist-list').append(
            '<p class="playlist-song" id="' + id[2]+
                '" onclick=" removeFromPlaylist(this.id)">\
                <span class="glyphicon glyphicon-remove remove-button"></span>'+
                id[0] + '- '+id[1]+'</p>'
        );
    }
}

function removeFromPlaylist(id) {
    $('#' + id).remove();
    delete playlist[id];
}

function savePlaylist() {
    console.log("Saving the playlist....");
    if(accessToken === null) {
        displayMessage('Please login to save your playlist.');
    } else if($.isEmptyObject(playlist)) {
        displayMessage('Please add a song before saving the playlist.');
    } else {
        if($('#playlist-input').val() === "") {
            displayMessage('Please name your playlist first.');
        }
        else {
            var playlistData = { 'uris': [] };
            //Move the songs from the dictionary to the array.
            for(var song in playlist) {
                playlistData.uris.push('spotify:track:' + song);
            }
            //Create the Playlist
            makeRequest(
                'post',
                'https://api.spotify.com/v1/users/' + userID + '/playlists',
                {
                    'contentType': 'json',
                    'dataType': 'json',
                    'headers': {
                        'Authorization': 'Bearer ' + accessToken,
                    },
                    'data': JSON.stringify({
                        'name': $('#playlist-input').val(),
                        'public': false
                    })
                },
                function(data) {
                    /* Returns an object with the newly created playlist's url(href)
                     * Now add the tracks into that playlist.
                     */
                    makeRequest(
                        'post',
                        data.href + '/tracks',
                        {
                            'contentType': 'json',
                            'dataType': 'json',
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken,
                            },
                            'data': JSON.stringify(playlistData),
                        },
                        function(data) {
                            displayMessage('Successfully created the playlist: ' + $('#playlist-input').val());
                        }
                    );
                }
            );
        }
    }
}

function getUserID() {
    console.log("Getting user ID ....");
    makeRequest(
        'get',
        'https://api.spotify.com/v1/me',
        {
            'contentType': 'application/json',
            'dataType':'json',
            'headers':{
                'Authorization':'Bearer ' + accessToken,
            }
        },
        function (data) {
            userID = data.id;
        }
    )

}

function checkLoginStatus() {
    matches = location.hash.match(new RegExp('access_token=([^&]*)'));
    console.log(matches);
    accessToken = matches ? matches[1] : null;
    if(accessToken) {
        getUserID();
    } else {
        displayMessage('First, login to Spotify!');
    }
}

$(document).ready(function () {
    checkLoginStatus();

    $('#input').keyup(function (e) {
        if(e.keyCode == 13) {
            if($('#input:focus').context.activeElement.id == 'search-input') {
                search($('#select').val(),$('#search-input').val());
            } else if($('#input:focus').context.activeElement.id == 'playlist-input') {
                savePlaylist();
            }
        }
    });
});
