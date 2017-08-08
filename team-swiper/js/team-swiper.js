(function() {
    $("#m-con .m-con-item").each(function(index, ele) {
        //index边界值检测
        this.boundaryCheck = function(index, dire) {
            var self = this;
            var directions = {
                //往左滑动
                "toLeft": function() {
                    if (index < 3) {
                        index += 1;
                        self.swiper(index, dire);
                    }
                },
                "toRight": function() {
                    if (index > 0) {
                        index -= 1;
                        self.swiper(index, dire);
                    }
                }
            };
            directions[dire].call(this);
        };
        //滑动切换特效
        this.swiper = function(index, dire) {
            var angle = -(index * 25);
            $("#m-con").css({
                "transform": "translateX(" + angle + "%)",
                "transition": "transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            });
            showContent(index);
        };
        //初始化
        this.init = function() {
            var self = this;
            this.addEventListener("touchstart", function(e) {
                e.preventDefault();
                self.startX = e.targetTouches[0].pageX;
                self.startY = e.targetTouches[0].pageY;
            });
            this.addEventListener("touchmove", function(e) {
                e.preventDefault();
                self.endX = e.targetTouches[0].pageX;
                self.endY = e.targetTouches[0].pageY;
            });
            this.addEventListener("touchend", function() {
                var x = self.endX - self.startX,
                    y = self.endY - self.startY,
                    dire = x > 0 ? "toRight" : "toLeft";

                if (Math.abs(x) > 10 && Math.abs(y) < 80) {
                    self.boundaryCheck($(self).index(), dire);
                }
            });
        };
        this.init();
    });

    //点击tab联动content
    $("#m-tab .m-tab-item").click(function() {
        showContent( $(this).index() );
    });

    function showContent(indexNum) {
        var angle = -(indexNum * 25);

        $("#m-tab .m-tab-item").removeClass("active").each(function(index, ele) {
            if (index == indexNum) {
                $(ele).addClass("active");
                $("#m-con").css({
                    "transform": "translateX(" + angle + "%)",
                    "transition": "transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                });
            }
        });
    }

    //不规则环形数据表
    function drawChartRing(leftObj, rightObj, coverObj, percent) {
        //缺角为106度，一边为53度，则实际转角度为53 + 254 * percent / 100
        var angle = 53 + 254 * percent / 100;
        
        if (percent <= 50) {
            leftObj.hide();
            rightObj.css({
                "transform": "rotateZ(-" + angle + "deg)"
            });
        } else {
            coverObj.hide();
            angle = angle - 180;
            rightObj.css({
                "transform": "rotateZ(-" + 180 + "deg)"
            });
            leftObj.css({
                "transform": "rotateZ(" + angle + "deg)"
            });
        }
    }
    drawChartRing($("#ring-left"), $("#ring-right"), $("#ring-cover"), 80);

    //菜单icon变化动画
    $("#icon-menu-wrap").click(function() {
        $(this).toggleClass("active");
    });
})();