var Comment = require('../models/comment');
var _=require('underscore');
	
// admin post comment
exports.save = function(req,res)
{
	var _comment = req.body.comment;
	console.log("-->"+_comment.cid+"<--");
	
	var movieId = _comment.movie;
	if (_comment.cid)
	{
		Comment.findById(_comment.cid,function(err,comment)
		{
			if (err) 
			{
				console.log("---->"+comment.reply+"<---");
			}
			
			var reply = 
			{
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content,
			}
			console.log('start to push '+comment);
			comment.reply.push(reply);
			comment.save(function(err,comment)
			{
				if (err)
				{
					console.log(err);
				}
				res.redirect('/movie/'+movieId);
			})
		})
	} else
	{
		var comment = new Comment(_comment);
		comment.save(function(err,comment)
		{
			if (err)
			{
				console.log('error');
			}
			res.redirect('/movie/' + movieId);
		})
	}	
}

	