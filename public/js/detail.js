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
})