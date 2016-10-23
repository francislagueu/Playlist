var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

<<<<<<< HEAD
var userSchema = mongoose.Schema{
	{
		//schema is a table
		//create a table on the database
		local:{
			username:String
			first_name:String,
			last_name:String,
			email:String,
			password:String
			
		}
	}
};
//generateHash is a custom name that francis created
userSchema.methods.generateHash = function(password) {  
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
//bcryp methods are built-in

//validpassword is a custom function name
userSchema.methods.validPassword = function (password) 
{
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
=======

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
>>>>>>> origin/Bryan
