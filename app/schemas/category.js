var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectId;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema(
{
	name:String,
	movies:[
	{
		type:ObjectId,
		ref:'Movie',
	}],
	description:String,
	meta:
	{
		createAt:
		{
			type:Date,
			default:Date.now()
		},
		updateAt:
		{
			type:Date,
			default:Date.now()
		}
	}
})

CategorySchema.pre('save',function(next)
{
	if (this.isNew)
	{
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else
	{
		this.meta.updateAt = Date.now();
	}
	next();
})
CategorySchema.statics = 
{
	fetch: function(cb)
	{
		console.log('do fetch');
		//var allCategorys = this.find({}).sort('meta.updateAt');
		//console.log(allCategorys);
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function(id,cb)
	{
		return this.findOne({_id:id})
		.exec(cb)
	}
}
module.exports = CategorySchema;