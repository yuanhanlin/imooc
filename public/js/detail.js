$(function()
{
	$('.comment').click(function(e)
	{
		var $target = $(this);
		var toId = $target.data('tid');
		var commentId = $target.data('cid');
	
		console.log(toId+' ');
		console.log(commentId);
		if ($('#toId').length>0)
		{
			$('#toId').val(toId)
		} else
		{
			$('<input>').attr(
			{
				id:'toId',
				type:'hidden',
				name:'comment[tid]',
				value:toId,
			}).appendTo('#commentForm');
		}
		if ($('#commentId').length>0)
		{
			$('#commentId').val(commentId);
		} else
		{
			$('<input>').attr(
			{
				id:'commentId',
				type:'hidden',
				name:'comment[cid]',
				value:commentId,
			}).appendTo('#commentForm');
		}		
	})
	$('#putInCollection').click(function(e)
	{
		var $target = $(this);
		var mid = $target.data('mid');
		console.log("the "+ mid +" movie will be collected");
		$.ajax(
		{
			type:'POST',
			url:'/user/collectMovie',
			dataType:'json',
			data:
			{
				mid:mid,
			}
		}).done(function(result)
		{
			if (result.status == 'success')
			{
				console.log('收藏成功');
				//$('#putInCollection').html('已收藏')
			} else
			{
				console.log('失败，可能是登录超时，请重新登录。');
			}
		})
	})
})