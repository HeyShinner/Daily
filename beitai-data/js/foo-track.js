(function($) {
    var FOOSHOOTPATH = function(options) {
        this.initialize(options);
    };

    var i = 0,
        bx = 0,//贝塞尔曲线轨迹坐标x
        by = 0,//贝塞尔曲线轨迹坐标y
        storage = [0, 0];//存储前一个贝塞尔曲线轨迹坐标

    FOOSHOOTPATH.prototype = {
        constructor: FOOSHOOTPATH,
        /**
         * 初始化
         */
        initialize: function(options) {
            var ops = this.getOptions(options);
            this.options = ops;

            //转化后端回传的动画起止坐标
            ops.start = STATSFOO.posConvert(ops.start);
            ops.end = STATSFOO.posConvert(ops.end);

            //根据起始位置计算贝赛尔曲线控制点（自定义）
            this.controlX = (ops.start[0] + ops.end[0]) / 2;
            this.controlY = ops.start[1] < ops.end[1] ? ops.start[1] - 40 : ops.end[1] - 40;
            this.part = ops.part;

            if (ops.autoStart) {
                this.start();
            }
        },
        /**
         * 获取配置
         */
        getOptions: function(options) {
            if (typeof options !== "object") {
                options = {};
            }
            options = $.extend({}, defaultSetting, options);
            return options;
        },
        /**
         * 绘制轨迹
         */
        draw: function(x, y) {
            var ops = this.options;

            //元素模拟动画开始特效
            if (i === 0.1) {
                $("#ellipse").show().css({"left": x - $("#ellipse").width() / 2 + "px", "top": y - $("#ellipse").height() / 2 + "px"});
            }
            
            //直线组成轨迹
            ctx.beginPath();
            ctx.moveTo(storage[0], storage[1]);
            ctx.lineTo(x, y);
            ctx.closePath();
            //画虚线
            ctx.strokeStyle = Math.round(i * 10)% 2 === 1 ? "#fff" : "rgba(255, 255, 255, 0)";
            ctx.stroke();
            //保留前一个贝塞尔轨迹上的点坐标
            storage = [x, y];
        },
        /**
         * 动画开始
         */
        start: function() {
            var self = this,
                ops = this.options,
                posx = ops.status === "player" ? 0 : $(ops.startIcon).width() / 2;

            if (ops.status === "player" && ops.end[0] >= ops.start[0]) {
                $(ops.startIcon).css({
                    "transform": "rotateY(180deg)",
                    "transform-origin": "left center"
                });
            } else {
                $(ops.startIcon).css({
                    "transform": "rotateY(0deg)"
                });
            }

            $(ops.startIcon).show().css({
                "left": ops.start[0]- posx,
                "top": ops.start[1] - $(ops.startIcon).height() * 0.8
            });

            this.timer = setInterval(function() {
                self.step();
            }, 10);
            return this;
        },
        /**
         * 二阶贝塞尔曲线：利用线段之间的比例关系
         * 逐一计算出贝塞尔曲线上的点的坐标
         */
        step: function() {
            var ops = this.options;
            //起始点到控制点x和y每次的增量
            var changeX1 = (this.controlX - ops.start[0]) / this.part,
                changeY1 = (this.controlY - ops.start[1]) / this.part;
            //控制点到结束点x和y每次的增量
            var changeX2 = (ops.end[0] - this.controlX) / this.part,
                changeY2 = (ops.end[1] - this.controlY) / this.part;
            // 计算两个动点的坐标
			var qx1 = ops.start[0] + changeX1 * i,
			    qy1 = ops.start[1] + changeY1 * i,
			    qx2 = this.controlX + changeX2 * i,
			    qy2 = this.controlY + changeY2 * i;
			// 计算得到此时的一个贝塞尔曲线上的点
			bx  = qx1 + (qx2 - qx1) * i / this.part;
            by  = qy1 + (qy2 - qy1) * i / this.part;
            
            if (i === 0) {
                storage = [bx, by];
            }

            i += 0.1;

            if (i >= this.part) {
                this.stop();
                //important!!!
                return;
            }
            this.moveTarget(bx, by);
            this.draw(bx, by);
            return this;
        },
        /**
         * 依照贝赛尔曲线轨迹移动目标元素
         */
        moveTarget: function(x, y) {
            var ops = this.options,
                ball = $(ops.targetEle);
            ball.show();
            ball.css({"left": x - ball.width() / 2 + "px", "top": y - ball.height() / 2 + "px"});
        },
        /**
         * 停止动画
         */
        stop: function() {
            clearTimeout(this.delayHide);
            var ops = this.options,
                ball = $(ops.targetEle);    
            if (!!this.timer) {
                clearInterval(this.timer);
            }
            this.delayHide = setTimeout(function() {
                ball.fadeOut();
                $("#ellipse").fadeOut();
                ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);
                i = 0;
                $("#common-msg").fadeOut();
                $(ops.startIcon).fadeOut();
            }, 2000);
        }
    };
    var defaultSetting = {
        //动画起点
        start: [0, 0],
        //动画终点
        end: [0, 0],
        //动画时间
        part: 5,
        //是否自动开始动画
        autoStart: true,
        //动画需要移动的目标元素（足球）
        targetEle: null,
        //动画起始位置放置icon
        startIcon: null,
        status: null
    };

    window.FOOSHOOTPATH = FOOSHOOTPATH;
})(jQuery);
