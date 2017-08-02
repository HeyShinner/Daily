(function($) {
    var FOOSCORE = function(options) {
        this.initialize(options);
    };

    var i = 0;//增量

    FOOSCORE.prototype = {
        constructor: FOOSCORE,
        /**
         * 初始化
         */
        initialize: function(options) {
            var ops = this.getOptions(options),
                self = this,
                ball = $(ops.targetEle);

            this.options = ops;
            this.reset();

            this.start = [ball.position().left + ball.width() / 2, ball.position().top + ball.height() / 2];//用css("left")在iPhone上面有坑，哭着也要填
            this.end = STATSFOO.posConvert(ops.end);

            this.controlX = (this.start[0] + this.end[0]) / 2,
            this.controlY = this.start[1] < this.end[1] ? this.start[1] - 40 : this.end[1] - 40;

            this.delayTimer = setTimeout(function() {
                $("#anim-light-gift").hide();
                self.animTimer = setInterval(function() {
                    self.animBallStep(self);
                }, 10);
            }, 2000);
        },
         /**
         * 重置动画
         */
        reset: function() {
            $(this.options.targetEle).show();
            $("#anim-foo-score").show().addClass("text-anim");
            $("#anim-light").show().find("#anim-light-gift").show().removeClass("gift-anim").addClass("gift-anim");
        },
        /**
         * 动画结束
         */
        stop: function() {
            var ball = $(this.options.targetEle);

            ball.hide().css({
                // "left": this.start[0] - ball.width() / 2 + "px",
                // "top": this.start[1] - ball.height() / 2 + "px"
                "top": fooCanvas.height * 0.20 + "px",
                "left": (fooCanvas.width - ball.width()) / 2 + "px"
            });

            console.log(this.start);

            $("#anim-foo-score").hide().removeClass("text-anim");
            $("#common-msg").show();

            clearInterval(this.animTimer);
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
         * 动画帧
         */
        animBallStep: function(obj) {
            var ops = obj.options,
                ball = $(ops.targetEle);
            //起始点到控制点x和y每次的增量
            var changeX1 = (obj.controlX - obj.start[0]) / ops.part,
                changeY1 = (obj.controlY - obj.start[1]) / ops.part;
            //控制点到结束点x和y每次的增量
            var changeX2 = (obj.end[0] - obj.controlX) / ops.part,
                changeY2 = (obj.end[1] - obj.controlY) / ops.part;
            // 计算两个动点的坐标
            var qx1 = obj.start[0] + changeX1 * i,
                qy1 = obj.start[1] + changeY1 * i,
                qx2 = obj.controlX + changeX2 * i,
                qy2 = obj.controlY + changeY2 * i;
            // 计算得到此时的一个贝塞尔曲线上的点
            var bx  = qx1 + (qx2 - qx1) * i / ops.part,
                by  = qy1 + (qy2 - qy1) * i / ops.part;

            i += 0.1;

            if (i >= ops.part) {
                obj.stop();
                i = 0;
                STATSFOO.ballShootAnim("player", ops.end, ops.shootEndPos);
                //important!!!
                return;
            }
            ball.css({
                "left": bx - ball.width() / 2 + "px",
                "top": by - ball.height() / 2 + "px"
            });
        }
    };

    var defaultSetting = {
        //动画终点
        end: [0, 0],
        shootEndPos: [0, 0],
        part: 8,
        //动画目标元素
        targetEle: null
    };

    window.FOOSCORE = FOOSCORE;
})(jQuery);