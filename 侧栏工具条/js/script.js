requirejs.config({
	paths:{
		jquery:"jquery-2.2.0.min"
	}
});
requirejs(["jquery"],function($){
	$("#toolbar-item-top").on("click",move);
	$(window).on("scroll",function(){
		checkPosition($(window).height());
	});

	checkPosition($(window).height());/*加载时先执行一遍，有利于刷新时判断当前
	的滚动高度是否大于临界值，从而进行下一步操作*/
	function move(){
		$("html,body").animate({
			scrollTop: 0
		},800);//兼容
	}
	function checkPosition(pos){
		if($(window).scrollTop()<pos){
            $("#toolbar-item-top").fadeOut();
		}else{
			$("#toolbar-item-top").fadeIn();
		}
	}
});