$(function() {

	// 轮播图部分代码 未完成
	$(".site-controls a").click(function() {
		var currentIndexID = this.href.substring(78,85);
		$(currentIndexID).show();
	});

	// 选项卡部分代码
	$(".tab-menu li a").click(function() {
		var currentBoxID = this.href.substring(78,89);
		$(".tab-menu li").removeClass("current");
		$(this.parentNode).addClass("current");
		$(".top-tab-itembox").removeClass("current");
		$(currentBoxID).addClass("current");
	});

	//定位导航部分代码
	//滚动条发生滚动
	$(window).scroll(function() {
		var top = $(document).scrollTop();
		var items = $("body").find(".nav-item");
		var currentID = "";
		// 在没有导航的位置将导航隐藏
		if (top < $("#nav-item1").offset().top - 200 || top > $("#nav-item4").offset().top + $("#nav-item4").height() - 200) {
			$(".home-nav-bar").css({
				"opacity": "0"
			});
		} else {
			$(".home-nav-bar").css({
				opacity: "1"
			});
			items.each(function() {
				var m = $(this);
				var itemTop = m.offset().top;
				if (top > itemTop - 200) {
					currentID = "#" + m.attr("id");
				} else {
					return false;
				}
			});
		}
		// 给当前的位置添导航样式
		var currentLink = $("body").find(".nav-current");
		if (currentID && currentID !== currentLink.attr("href")) {
			currentLink.removeClass("nav-current");
			$("body").find("[href='"+currentID+"']").addClass("nav-current");
		}
	});
});




