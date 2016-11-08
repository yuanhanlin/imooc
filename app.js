var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var bodyParse = require('body-parser');
var cookieParser = require('cookie-parser');
 
var logger = require('morgan');
var port = process.env.PORT||3000;
var app = express();
app.locals.moment = require('moment');
mongoose.Promise = require('bluebird');
var db = mongoose.connect('mongodb://localhost/imooc');

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(bodyParse.json({limit:'1mb'}));
app.use(bodyParse.urlencoded({extended: true}));
app.use(cookieParser('imooc'));
app.use(session(
{
	secrect:'imooc',
	store: new mongoStore(
	{
		url: 'mongodb://localhost/imooc',
		collection: 'sessions',
	}),
	resave:false,
	saveUninitialized:true,
	
}));

if ('development'=== app.get('env'))
{
	app.set('showStackError',true);
	app.use(logger(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

require('./config/routes.js')(app);

app.use(express.static(path.join(__dirname,'public')))
app.listen(port);

console.log('imooc started on port '+ port);
// index page
