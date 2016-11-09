var _=require('underscore');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/Movie');
module.exports = function(app)
{
	app.use(function(req,res,next)
	{
		var _user = req.session.user;
		app.locals.user = _user;
		return next();
	})
	//index
	app.get('/',Index.index);
	//movie
	//app.get('/movie/:ids',Movie.detail);	
	app.get('/movie/:id',Movie.detail);	
	app.get('/admin/update/:id',Movie.update);
	app.post('/admin/movie/new',Movie.save);
	app.get('/admin/movie',Movie.new);
	app.get('/admin/list',Movie.list);
	app.delete('/admin/list',Movie.del);
	//user
	app.post('/user/signup',User.signup);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	app.get('/admin/userlist',User.userlist);
	app.post('/user/signin',User.signin);
	app.get('/logout',User.logout);
}

