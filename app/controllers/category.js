var Category = require('../models/category');
var Comment = require('../models/comment');
var _=require('underscore');
	
	//admin update category
	exports.update = function(req,res)
	{
		/*var id = req.params.id;
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
		}*/
	}
	
	//admin post category
	exports.save = function(req,res)
	{
		var _category = req.body.category;
			categories = new Category(_category);
			categories.save(function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}

				res.redirect('/admin/category/list');
			})
	}

	exports.new = function(req,res)
	{
		res.render('category_admin',
		{
			title:'imooc 后台分类录入页',
			category:
			{
				name:'',
				description:'',
			}
		})
	}
	//category list
	exports.list = function(req,res)
	{
		Category.fetch(function(err,categories)
		{
			if (err)
			{
				console.log(err);
			}
			res.render('categorylist',
			{
				title:'Imooc 分类列表页',
				categories:categories,
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
