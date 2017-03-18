$(function()
{
	$('#signupEmail').blur(function()
	{
		var inputEmail = $(this).val();
		var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		if ((!inputEmail)||(inputEmail == ''))
		{
			$('#signupEmailMessage').html("<font color='red'>邮箱地址不能为空！</font>");
			$(this).focus();
			return false;
		} else if (!reg.test(inputEmail))
		{ 
			$('#signupEmailMessage').html("<font color='red'>邮箱格式不正确！</font>");
			$(this).focus();
		} else
		{
			$('#signupEmailMessage').html("<font color='green'>邮箱格式正确！</font>");
			$('#sendCheckcode').attr('disabled',false);
		}
	})
	$('#sendCheckcode').click(function()
	{
		var address = $('#signupEmail').val();
		/*缺乏邮箱格式验证*/
		$.ajax(
		{
			type:'post',
			url:'/user/sendCheckCode',
			dataType:'json',
			data:
			{
				address:address,
			}
		}).done(function(results)
		{
			if (results.status == "success")
			{
				console.log("checkCode send");
				$('#signupEmailMessage').html("<font color='green'>验证码已发送！</font>");
			} else
			{
				console.log(results.status);
			}
		})
	})
	$('#signupCheck').blur(function()
	{
		var inputCode = $(this).val();
		$.ajax(
		{
			type:'POST',
			url:'/user/validateCheckcode',
			dataType:'json',
			data:
			{
				inputCode:inputCode,
			}
		}).done(function(results)
		{
			if (results.status == "success")
			{
				console.log('right');
				$('#signupSubmit').attr('disabled',false);
				$('#signupCheckcodeMessage').html("<font color='green'>验证码正确。excited!</font>");
			} else 
			{
				console.log('wrong');
				$('#signupCheckcodeMessage').html("<font color='red'>验证码错了。I'm angry!</font>")
			}
		})
	})
})