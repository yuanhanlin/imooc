/*用户数据模型定义，包含用户的信息以及数据库层面的操作*/
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var Schema = mongoose.Schema;
var ObjectId = 	Schema.Types.ObjectId;
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
	portrait: 				//头像
	{
		type:String,
		default:'defaultPortrait.jpg'
	},
	gender:
	{
		type:String,
		default:'male',
	},
	email:
	{
		type:String,
	},
	phoneNumber:
	{
		type:String,
	},
	//user role
	//0-->normal user
	//1-->verified uesr
	//2-->advanced user
	//3-9--> ready to use
	//10-->admin
	//50-->super admin
	role:
	{
		type:Number,
		default:0,
	},
	//该用户收藏了那些电影
	collectedMovies:[
	{
		type:ObjectId,
		ref:'Movie',
	}],
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
		var password = user.password;
			
		var hash = bcrypt.hashSync(user.password);
		user.password = hash;
		console.log("user.password in mongoose.save is:"+user.password);
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
		console.error(_password,"<--> ",this.password);
		bcrypt.compare(_password,this.password,function(err,isMatch)
		{
			if (err) 
			{
				console.log(err);
				return cb(err);
			}
			if (isMatch)
			{
				console.log('bcryt compare metched');
				return cb(null,isMatch);
			} else
			{
				console.log('bcrypt compare is not matched');
				return cb(null,isMatch);
			}
		})
	}
}
module.exports = Userschema;