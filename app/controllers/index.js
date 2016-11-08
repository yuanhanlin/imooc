var Movie = require('../models/movie');

//index page
exports.index = function(req,res)
{
	console.log('render index');
	console.log(req.session.user);

	Movie.fetch(function(err,movies)
	{
		if (err)
		{
			console.log(err);
		}
		console.log('fetch done,and rending');
		res.render('index',
		{
			title:'imooc首页',
			movies:movies
		})
	})
}