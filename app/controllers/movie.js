/*
	切记缺少前台页面的数据格式验证，输入错误的数据格式会导致系统崩溃，应在后期加入前台数据格式的验证。
 */

var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _=require('underscore');
var fs = require('fs');
var path = require('path');
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
		Movie.update({_id:id},{$inc:{pv:1}},function(err)
		{
			if (err)
			{
				console.log(err);
			}
		})
		Comment.find(
		{
			movie:id,
		}).populate('from','name portrait')
		.populate('reply.from reply.to','name portrait')
		//.populate('from','portrait')
		.exec(function(err,comments)
		{
			console.log(comments);
			res.render('detail',
			{
				title:'Imooc' + movie.title,
				movie:movie,
				comments:comments,
			})
		})
		
	});
}
//admin update movie
exports.update = function(req,res)
{
	var id = req.params.id;
	if (id)
	{
		Category.find({},function(err,categories)
		{
			Movie.findById(id,function(err,movie)
			{
				res.render('newMovie',
				{
					title:'imooc 后台更新',
					movie:movie,
					categories:categories
				})
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
	//console.log(movieObj);
	var _movie;
	if (req.poster)
	{
		movieObj.poster = req.poster;
	}
	if (id)
	{
		Movie.findById(id,function(err,movie)
		{
			if (err)
			{
				console.log(err);
			}
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}
				
			})


			res.redirect('/movie/'+movie._id);
		})
	} else
	{
		/*_movie = new Movie(
		{
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash,
			category:movieObj.category,
		})*/
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;
		console.log('---movieObj.category->'+movieObj.category+'<----');
		console.log('---movieObj.categoryName->'+movieObj.categoryName+'<----');
		_movie.save(function(err,movie)
		{
			if (err)
			{
				console.log(err);
			}
			//console.log(movie);
			if (categoryId)
			{
				Category.findById(categoryId,function(err,category)
				{
					//console.log("---->"+category.name+"<---");
					//console.log("---->"+movie._id+"<---");
					category.movies.push(movie._id);
					category.save(function(err,category)
					{
						res.redirect('/movie/'+ movie._id);
					})
				})
			} else if (categoryName)
			{
				var category = new Category(
				{
					name:categoryName,
					movies:[movie._id],
				});
				category.save(function(err,category)
				{
					movie.category = category._id; 
					movie.save(function(err,movie)
					{
						res.redirect('/movie/'+ movie._id);
					})
					
				})
			}
		})
	}
}

exports.new = function(req,res)
{
	Category.fetch(function(err,categories)
	{
		res.render('newMovie',
		{
			title:'imooc 后台电影录入页',
			movie:
			{
				title:'',
				doctor:'',
				country:'',
				year:'',
				poster:'',
				flash:'',
				summary:'',
				language:'',
			},
			categories:categories,
		})
	})
	
}

exports.list = function(req,res)
{
	/*Movie.fetch(function(err,movies)
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
	})*/
	Movie.find({})
	.populate('category', 'name')
	.exec(function(err,movies)
	{
		if (err)
		{
			console.err(err);
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

/*此处往下都是中间件的定义*/

/*验证电影海报是否上传*/
exports.savePoster = function(req,res,next)
{
	//console.log('--->>>'+req.files);
	var posterData = req.files.uploadPoster;     //读取提交的文件
	var filePath = posterData.path;                
	var originalFilename = posterData.originalFilename;

	if (originalFilename)              //判断是否有文件名，如果有说明有海报被上传过来了
	{
		fs.readFile(filePath,function(err,data)
			{
				var timestamp = Date.now();
				var type = posterData.type.split('/')[1];
				var poster = timestamp + '.' + type;
				console.log(poster);
				var newPath = path.join(__dirname,'../../','/public/upload/'+poster);
				fs.writeFile(newPath,data,function(err)
				{
					req.poster = poster; //把写入好的文件名挂到请求地址上，便于后面处理时判断
					next();
				})
			});
	} else
	{
		next();   //如果没有文件上传，就直接执行下一步
	}
}
