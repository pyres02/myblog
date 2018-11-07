$('.menu img').click(function(event) {
	$('.menu ul').slideToggle(100)
});
$('button').click(function(event) {
	if($('#exampleInputEmail1').val()==''){
		$('.user').html('请输入正确用户名');
		$('.user').css('color', 'red');
	}else{
		$.ajax({
			url: 'http://localhost:8989/user',
			type: 'post',
			dataType: 'json',
			data: {param1: $('#exampleInputEmail1').val()},
			success:function(res){
				console.log(res)
			}
		})
	
		
	}
});