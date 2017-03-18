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
				limit:6,
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
			});
		})
}

//search page
exports.search = function(req,res)
{
	var cateId = req.query.cate;
	var page = parseInt(req.query.p,10)||0;
	var q = req.query.q;
	var count = 6; //搜索结果每页显示多少条记录
	var index = page * count;
	if (cateId)
	{
		Category
			.find({_id:cateId,})
			.populate(
			{
				path:'movies',
				/*options:
				{
					limit:2,
					skip:index, // moongose 此处有问题
				}*/
			})
			.exec(function(err,categories)
			{
				if (err)
				{
					console.log(err);
				}
				var category = categories[0] || {};
				var movies = category.movies ||	[];
				var results = movies.slice(index,index + count);

				res.render('results',
				{
					title:'imooc 结果列表',
					keyword:category.name,
					currentPage: (page+1),
					query:'cate='+cateId,
					totalPage: Math.ceil(movies.length/count),
					movies:results,
				})
			})
	}else
	{
		Movie
			.find(
			{
				title:new RegExp(q + '.*','i'),

			})
			.exec(function(err,movies)
			{
				if (err)
				{
					console.err(err);
				}
				var results = movies.slice(index, index+count);
				res.render('results',
				{
					title: 'imooc 搜索结果页',
					keyword: q,
					currentPage: (page+1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length/count),
					movies: results,
				})
			})
	}
	

}