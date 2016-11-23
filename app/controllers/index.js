var Movie = require('../models/movie');
var Category = require('../models/category');
var mongoose = require('mongoose');
//index page
exports.index = function(req,res)
{
	console.log('render index');
	console.log(req.session.user);
	Category
		.find({})
		.populate(
		{
			path:'movies',
			options:
			{
				limit:5,
			}
		})
		.exec(function(err,categories)
		{
			if (err)
			{
				console.log(err);
			}
			console.log('fetch done,and rending');
			res.render('index',
			{
				title:'imooc首页',
				categories:categories,
			})
		})
	
		
	
}