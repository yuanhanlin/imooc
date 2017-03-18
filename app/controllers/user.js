var User = require('../models/user');
var Movie = require('../models/movie');
var _=require('underscore');
var fs = require('fs');
var path = require('path');
var mailer = require('./mailer');
var _=require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = 	Schema.Types.ObjectId;

exports.showSignup = function(req,res)
{
	res.render('signup',
	{
		title:'注册页面',
	})
}

exports.showSignin = function(req,res)
{
	res.render('signin',
	{
		title:'登录页面',
	})
}

exports.signup = function(req,res)
{
	var _user = req.body.user;
	User.find(
	{
		name:_user.name
	},function(err,user)
	{
		if (err)
		{
			console.log(err);
		}
		if (user.length>0)
		{
			res.redirect('/signin');
		} else
		{
			var user = new User(_user);
			console.log('in User.signup, the req.portrait is'+req.portrait)
			if (req.portrait)
			{
				user.portrait = req.portrait;
			}
			
			//验证码测试开始
			/*
			var address = user.email;
			var checkCode = parseInt(Math.random()*(9999-1000+1)+1000);
			checkCode = checkCode.toString();
			console.log(checkCode);
			mailer.send(checkCode,address,function(err)
			{
				if (err)
				{
					console.log(err);
				}
			})
			*/
			//验证码测试结束
			user.save(function(err,user)
			{
				if (err)
				{
					console.log(err);
				} else
				{
					console.log(user);
					req.session.user = user;
					res.redirect('/');
				}
			})
		}
	})
}

/*验证码发送*/
exports.sendCheckCode = function(req,res)
{
	var address = req.body.address;
	var checkCode = parseInt(Math.random()*(9999-1000+1)+1000);
	checkCode = checkCode.toString();
	console.log(checkCode);
	mailer.send(checkCode,address,function(err)
	{
		if (err)
		{
			console.log(err);
		}
	})
	req.session.checkCode = checkCode;
	res.send(
		{
			status:"success",
			message:"checkCode send",
		});
}
/*验证码验证*/
exports.validateCheckcode = function(req,res)
{
	var _checkCode = req.session.checkCode;
	var checkCode = req.body.inputCode;
	if (checkCode == _checkCode)
	{
		req.session.checkCodeValidate = true;
		res.send(
		{
			status:"success",
			message:"Right",
		})
	} else
	{
		req.session.checkCodeValidate = false;
		res.send(
		{
			status:"fail",
			message:"wrong",
		})
	}
}

exports.userlist = function(req,res)
{
	User.fetch(function(err,users)
	{
		if (err)
		{
			console.log(err);
			alert(err);
		}
		res.render('userlist',
		{
			title:'Imooc 用户列表',
			users:users,
		})
	})	
}

exports.signin = function(req,res)
{
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne(
	{
		name:name
	},function(err,user)
	{
		if (err)
		{
			console.log(err);
		}
		if (!user)
		{
			return res.redirect('/signup');
		} else
		{
			user.comparePassword(password,function(err,isMatch)
			{
				if (err)
				{
					console.log("signin failed")
					console.log(err);
				}
				if (isMatch)
				{
					console.log('Password is matched')
					req.session.user = user;
					//app.locals.user = user;
					return res.redirect('/');
				} else
				{

					console.log('Password is not matched');
					return res.redirect('/signin');
				}
			})
		}
	})
}
	
exports.logout = function(req,res)
{
	delete req.session.user;
//	delete app.locals.user;
	res.redirect('/');
}

exports.details = function(req,res)
{
	var _user = req.session.user;
	var page = parseInt(req.query.mcp)||0; // mcp means the page of collected movies
	var count = 6; //收藏页每页显示多少条电影
	var index = count * page;
	//console.log(_user.name);
	//console.log('portrait path:'+_user.portrait);
	User.find(
	{
		_id:_user._id,
	}).populate(
	{
		path:'collectedMovies',
	}).exec(function(err,users)
	{
		if (err)
		{
			console.log(err);
		}
		var user = users[0]||{};
		var movies = user.collectedMovies||[];
		var results = movies.slice(index,index+count);
		res.render('userDetails',
		{
			title:user.name+"个人信息",
			user:user,
			movies:results,
			totalPage:Math.ceil(movies.length/count),
			currentPage:(page+1),
		})
	})

	/*res.render('userDetails',
	{
		title: user.name + "个人信息",
		user:user,
	})*/
}

/*用户个人信息更新相关接口*/
exports.showUpdate = function(req,res)
{
	var user = req.session.user;
	res.render('userUpdate',
	{
		title: user.name+"个人信息更新",
		user: user,
	})
}
exports.update = function(req,res)
{
	var userObj = req.body.user;
	console.log('the userObj:'+userObj.name);
	if (userObj.name != req.session.user.name)
	{
		return res.redirect("/");
	}
	var id = userObj._id;
	var _user;
	User.findById(id,function(err,user)
	{
		console.log("change user find in mongoose :"+ user.name);
		_user =_.extend(user,userObj);
		_user.password = req.session.user.password;
		if (req.portrait)
		{
			_user.portrait = req.portrait;
		}
		console.log("in controller.user.update, _user:"+_user.name);
		_user.save(function(err,user)
		{
			if (err)
			{
				console.log(err);
			}
			console.log(user.name);
			req.session.user = _user;
			res.redirect('/admin/user/details/'+user._id);
		})
	})
}
//收藏电影的接口
exports.collectMovie = function(req,res)
{
	var movie_id = req.body.mid;
	var user_id = req.session.user._id;
	console.log(movie_id);
	console.log(user_id)
	var user_collectedMovies = [];
	User.findById(user_id,function(err,user)
	{
		var user_collectedMovies = user.collectedMovies;
		user_collectedMovies.push(movie_id);
		User.update(
		{
			_id:user._id,
		},
		{
			$set:
			{
				collectedMovies:user_collectedMovies,
			}
		},function(err,user)
		{
			if(err)
			{
				console.log(err);
			}
			Movie.findById(movie_id,function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}
				movie.collectedUsers.push(req.session.user._id);
				movie.save(function(err,movie)
				{
					if (err)
					{
						console.log('there is an error when put use._id in movie: '+err);
					}
					console.log("user has been update and the collectMovie is:"+user.collectedMovies);
					res.redirect('/movie/'+ movie_id);
				})
			})
			
		});
		/*user.save(function(err,user)
		{
			if (err)
			{
				console.log(err);
			}
			Movie.findById(movie_id,function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}
				movie.collectedUsers.push(user._id);
				movie.save(function(err,movie)
				{
					if (err)
					{
						console.log(err);
					}
					res.redirect('/movie/'+ movie_id);
				})
			})		
		})*/
	})
}


/*
此处往下都是中间件的定义
 */

//登录控制中间件
exports.signinRequired = function(req,res,next)
{
	var user = req.session.user;
	console.log("the user in session is :" + user);
	if (!user)
	{
		return res.redirect('/signin');
	}
	next();
}
//验证码验证中间件
exports.checkCodeValidateRequired = function(req,res,next)
{
	var checkCodeValidate = req.session.checkCodeValidate;
	if (!checkCodeValidate)
	{
		return res.redirect('/signup')
	}
	next();
}

//权限控制中间件
exports.adminRequired = function(req,res,next)
{
	var user = req.session.user;
	if (user.role <= 10 || !user.role)
	{
		return res.redirect('/signin');
	}
	next();
}

//保存头像中间件
exports.uploadPortrait = function(req,res,next)
{
	var _user = req.body.user;
	var name = _user.name;
	var portraitData = req.files.uploadPortrait;
	console.log('>>>'+portraitData.path+'<<<');
	var filePath = portraitData.path;
	var originalFilename = portraitData.originalFilename;
	console.log('>>>'+originalFilename+'<<<<<<<<<');
	if (originalFilename)
	{
		fs.readFile(filePath,function(err,data)
		{
			var timestamp = Date.now();
			var type = portraitData.type.split('/')[1];
			var portrait = name + timestamp + '.' + type;
			console.log('portrait name is:'+portrait);
			var newPath = path.join(__dirname,'../../','/public/upload/portrait/' + portrait);
			fs.writeFile(newPath,data,function(err)
			{
				req.portrait = portrait;
				next();
			})
		})
	} else
	{
		next();
	}      

}