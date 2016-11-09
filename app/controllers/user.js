var User = require('../models/user');

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
			user.save(function(err,user)
			{
				if (err)
				{
					console.log(err);
				} else
				{
					console.log(user);
					res.redirect('/');
				}
			})
		}
	})
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