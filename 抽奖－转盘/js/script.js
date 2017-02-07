$(document).ready(function() {
    var count = 1,
        rotateStatus = "stop",//转动状态
        // rewardObj = {//各奖品对应角度，以初始位置为准
        //     "thanks": 106,
        //     "packets5": 325,
        //     "shoes": 38,
        //     "packets20": 75,
        //     "tickets": 300,
        //     "gold": 220,
        //     "shirts": 180,
        //     "milk": 150
        // };
        rewardArr = [];

    //计算各个奖品的角度
    $(".outer-round").each(function(index , element) {
        var length = $(".outer-round").size(),
            itemDeg = 360 / length * (3 - index);//跟初始状态时指针和dom结构里第一个奖品相互位置有关

        if (itemDeg < 0) {
            itemDeg = 360 + itemDeg;
        }
        rewardArr.push(itemDeg);
    });
    //点击立即抽奖
    $(".lotto-btn").tap(function() {
        if (rotateStatus == "stop") {
            rotateStatus = "rotating";

            var rotateTime = 5 + Math.random() * 2,
                deg,
                newRotateTime;
            //点击先让转盘转起来，再向后端请求
            $(".wheel").css({
                "transition": "transform " + rotateTime + "s " + "cubic-bezier(0,0,0.25,1)"
            });
            $(".wheel").css({
                "transform": "rotate(" + (360 * count * 5) + "deg)"
            });
            //跑马灯开始
            $(".horse-race-lamp > span").each(function(index , element) {
                $(element).removeClass("light").addClass("light");
            });
            //模拟请求数据
            setTimeout(function() {
                // deg = rewardObj["thanks"];
                deg = rewardArr[Math.floor(Math.random() * 8)];

                newRotateTime = (360 * count * 5 + deg) * rotateTime / (360 * count * 5);
                $(".wheel").css({
                    "transition": "transform " + newRotateTime + "s " + "cubic-bezier(0,0,0.25,1)"
                });
                $(".wheel").css({
                    "transform": "rotate(" + (360 * count * 5 + deg) + "deg)"
                });
                count += 1;
            } , 500);
            //跑马灯停止
            setTimeout(function() {
                rotateStatus = "stop";
                $(".horse-race-lamp > span").each(function(index , element) {
                    $(element).removeClass("light");
                });
            } , rotateTime * 1000);
        }
    });
    //滚动公告
    //todo 定时向后端请求数据 将返回的数据制作成dom添加到html中
    //假定公告已添加到html中
    var area = document.querySelectorAll(".footer-content")[0],
        table = area.querySelectorAll("table tbody")[0],
        scrollHeight = $(".footer-content tr").height() + 2,//单行滚动的高度
        speed = 20,//滚动的速度
        scrollTimer,
        delay = 2000;//滚动一次延时两秒
    area.scrollTop = 0;
    table.innerHTML += table.innerHTML;

    function startScroll() {
	    scrollTimer = setInterval(scrollUp,speed);
	    area.scrollTop ++;
	}
    function scrollUp() {
        if (area.scrollTop % scrollHeight == 0) {
            clearInterval(scrollTimer);
		    setTimeout(startScroll,delay);
		} else {
			area.scrollTop ++;
			if (area.scrollTop >= area.scrollHeight / 2 - 8) {
			    area.scrollTop = 0;
			}
		}
	}
    //初始化滚动公告
	setTimeout(startScroll,delay);
});
