var _=require('underscore');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/Comment');
var Category = require('../app/controllers/Category');
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
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);
	app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
	app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);
	//user
	app.post('/user/signup',User.checkCodeValidateRequired,User.uploadPortrait,User.signup);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.userlist);
	app.post('/user/signin',User.signin);
	app.get('/logout',User.logout);
	app.get('/admin/user/details/:id',User.signinRequired,User.details);
	app.get('/user/details',User.signinRequired,User.details);
	app.get('/user/showUpdate',User.signinRequired,User.showUpdate);
	app.post('/user/update',User.signinRequired,User.checkCodeValidateRequired,User.uploadPortrait,User.update);
		//验证码相关
	app.post('/user/sendCheckCode',User.sendCheckCode);
	app.post('/user/validateCheckcode',User.validateCheckcode);
		//收藏电影相关
	app.post('/user/collectMovie',User.signinRequired,User.collectMovie);


	//comments
	app.post('/user/comment',User.signinRequired,Comment.save)

	//category 
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save);
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);

	//result
	app.get('/results',Index.search)
}

