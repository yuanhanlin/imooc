//mailer 不是与movie user category comment 等一样的数据模型，而是单纯用于用户邮箱验证码相关的功能实现，
//属于user的下属，但是考虑到功能比较独立，就单独写成一个模块
var nodeMailer = require('nodemailer');
var mailer = {};
mailer.send = function(checkCode,address,callback)
{
  var transporter = nodeMailer.createTransport(
  {
    service:'qq',
    auth:
    {
      user:'582223062@qq.com',
      pass:'irzluvciqpzkbcij',
    }
  })
  var mailOptions = 
  {
    from :'582223062@qq.com',
    to: address,
    subject:'注册用验证码',
    html:'<h3>您的验证码是:'+checkCode+'</h3>',
  }
  transporter.sendMail(mailOptions,function(err,info)
  {
    if (err)
    {
      console.log("出错啦")
      console.log(err);
    } else
    {
      console.log(info);
    }
    callback();
  })
}
module.exports = mailer;