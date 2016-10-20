var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userschema = mongoose.Schema({
	local:{
		username:String,
		first_name:String,
		last_name:String,
		email:String,
		password:String,
	}
});
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('user', userSchema);