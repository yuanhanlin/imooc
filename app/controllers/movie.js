var Movie = require('../models/movie');
var _=require('underscore');
	//detail
	exports.detail = function(req,res)
	{
		var id = req.params.id;
		/*
			/movie/:id 这种提交方式对应获取方式： req.params.id
			/movie?id=01&name=yuan 这种提交方式对应获取方式： req.query.id
			通过表单提交，或者jQuery的Ajax提交时，数据保存在data中，用req.body.movie.id来获取
			还有一种通用的获取方式 req.param('id'),这种获取方式可以查询三种位置的参数，但是无法确定
			获取的是哪个位置的数据。例子：
			/movie/1111?id=1112  并且data = {id=1113}  用req.param('id')会获取到1111，因为优先级是
			url>body(data)>query
		 */
		Movie.findById(id,function(err,movie)
		{
			res.render('detail',
			{
				title:'Imooc' + movie.title,
				movie:movie,
			})
		});
	}
	//admin update movie
	exports.update = function(req,res)
	{
		var id = req.params.id;
		if (id)
		{
			Movie.findById(id,function(err,movie)
			{
				res.render('admin',
				{
					title:'imooc 后台更新',
					movie:movie,
				})
			})
		}
	}
	
	// admin post movie
	exports.save = function(req,res)
	{
		var id = req.body.movie._id;
		console.log(id);
		var movieObj = req.body.movie;
		console.log(movieObj);
		var _movie;
		if (id!=='undefined')
		{
			Movie.findById(id,function(err,movie)
			{
				if (err)
				{
					console.error(err);
				}
				_movie = _.extend(movie,movieObj);
				_movie.save(function(err,movie)
				{
					if (err)
					{
						console.log(err);
					}
					res.redirect('/movie/'+movie._id);
				})
			})
		} else
		{
			_movie = new Movie(
			{
				doctor:movieObj.doctor,
				title:movieObj.title,
				country:movieObj.country,
				language:movieObj.language,
				year:movieObj.year,
				poster:movieObj.poster,
				summary:movieObj.summary,
				flash:movieObj.flash,
			})
			_movie.save(function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}

				res.redirect('/movie/'+movie._id);
			})
		}
	}

	exports.new = function(req,res)
	{
		res.render('admin',
		{
			title:'imooc 后台录入页',
			movie:
			{
				title:'',
				doctor:'',
				country:'',
				year:'',
				poster:'',
				flash:'',
				summary:'',
				language:''

			}
		})
	}
	
	exports.list = function(req,res)
	{
		Movie.fetch(function(err,movies)
		{
			if (err)
			{
				console.log(err);
			}
			res.render('list',
			{
				title:'Imooc 列表',
				movies:movies,
			})
		})
	}


	/*delete movie*/
	exports.del = function(req,res)
	{
		var id = req.query.id;
		if (id)
		{
			Movie.remove({_id:id},function(err,movie)
			{
				if (err)
				{
					console.error(err);
				} else
				{
					res.json({success:1});
				}
			})
		}	
	}
