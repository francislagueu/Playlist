var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var userSchema = mongoose.Schema({

		username:{type: String, index:true},
		password:{type: String},
		email:{type: String},
        first_name:{type: String},
        last_name:{type: String}
        //playlists:[{type: Schema.Types.ObjectId, ref:'Playlist' }]


});

/*var playlistSchema = mongoose.Schema({
    title :string,
    tracks:[{name:string}],
    created:{type:Date, default:Date.now()}

});*/
var User = module.exports = mongoose.model('User', userSchema);
//var Playlist = module.exports = mongoose.model('Playlist', playlistSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function (userPassword, hash, callback) {
    bcrypt.compare(userPassword, hash, function (err, isMatch) {
        if(err)
            throw err;
        callback(null, isMatch);
    });
}