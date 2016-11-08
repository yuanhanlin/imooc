var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var Userschema = new mongoose.Schema(
{
	name:
	{
		unique:true,
		type:String,
	},
	password:String,
	meta:
	{
		createAt:
		{
			type:Date,
			default:Date.now()
		},
		updateAt:
		{
			type:Date,
			default:Date.now()
		}
	}
})

Userschema.pre('save',function(next)
{
	var user = this;
	if (this.isNew)
	{
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else
	{
		this.meta.updateAt = Date.now();
	}
	/*bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt)
	{
		if (err) return 
		{
			next(err);
		}*/
		var hash = bcrypt.hashSync(user.password);
		user.password = hash;
		console.log(user.password);
		next();
	/*})*/
})
Userschema.statics = 
{
	fetch: function(cb)
	{
		console.log('do fetch');
		//var allMovies = this.find({}).sort('meta.updateAt');
		//console.log(allMovies);
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function(id,cb)
	{
		return this.findOne({_id:ObjectID(id)})
		.exec(cb)
	}
}
Userschema.methods = 
{
	comparePassword:function(_password,cb)
	{
		console.error(_password," ",this.password);
		bcrypt.compare(_password,this.password,function(err,isMatch)
		{
			if (err) 
			{
				return cb(err);
			}
			if (isMatch)
			{
				console.log('bcryt compare metched')
				cb(null,isMatch);
			}
		})
	}
}
module.exports = Userschema;