(function($) {
    var FOOAREA = function(options) {
        this.initialize(options);
    };

    var p3 = 0,//绘制三角形区域铺开动画帧增量
        p4 = 0,//绘制四边形区域铺开动画帧增量
        storagePos = [0, 0];

    //主客队里任意球和球门球的两个固定点的百分比位置
    var renLeft1 = [ 9, 31 ],
        renLeft2 = [ 9, 62 ],
        renRight1 = [ 91, 31 ],
        renRight2 = [ 91, 62 ];
    
    var qiuLeft1 = [ 0, 0 ],
        qiuLeft2 = [ 0, 100 ],
        qiuRight1 = [ 100, 0 ],
        qiuRight2 = [ 100, 100 ];

    FOOAREA.prototype = {
        constructor: FOOAREA,
        /**
         * 初始化
         */
        initialize: function(options) {
            var ops = this.getOptions(options);
            this.options = ops;

            this.reset();
            //将后端回传的动画起止坐标转化
            storagePos = ops.pos;
            ops.pos = STATSFOO.posConvert(ops.pos);

            ops.type === 3 ? this.drawAngleArea() : this.drawQuadArea();
        },
        /**
         * 重置
         */
        reset: function() {
            clearTimeout(this.delayTimerAngle);
            clearTimeout(this.delayTimerQuad);
            $(this.options.startIcon).hide();
        },
        /**
         * 停止
         */
        stop: function() {
            $(this.options.startIcon).fadeOut();
            ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);
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
         * 绘制三角形区域
         */
        drawAngleArea: function(x, y) {
            //特效-铺开
            var self = this,
                ops = this.options;

            $(ops.startIcon).fadeIn().css({
                "left": ops.pos[0] - $(ops.startIcon).width() / 2,
                "top": ops.pos[1] - $(ops.startIcon).height() * (1 - 0.1)
            });
            
            this.angleTimer = setInterval(function() {
                ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);
                self.angleStep(self, renRight1, renRight2);//根据需求要替换“左边右边足球场地固定点”的坐标值，又挖坑给自己跳！！！
            }, 10);
        },
        angleStep: function(obj, targetA, targetB) {
            var ops = obj.options,
                referPos = STATSFOO.posConvert( [targetA[0], storagePos[1]] ),
                fixedA = STATSFOO.posConvert(targetA, "stay"),//因为循环改变了pos[1]的值，所以需要传入"stay"提示函数只可转化一次pos[1]原始值
                fixedB = STATSFOO.posConvert(targetB, "stay"),
                xposUp = fixedA[0] - ops.pos[0],
                yposUp = fixedA[1] - ops.pos[1],
                xposDown = fixedB[0] - ops.pos[0],
                yposDown = fixedB[1] - ops.pos[1],

                upLength = Math.sqrt(xposUp * xposUp + yposUp * yposUp),
                downLength = Math.sqrt(xposDown * xposDown + yposDown * yposDown),
                sideUpLength = xieLength * storagePos[1] / 100 * (targetB[1] - targetA[1]) / 100,//又挖坑给自己跳
                sideDownLength = xieLength * (100 - storagePos[1]) / 100 * (targetB[1] - targetA[1]) / 100,//又挖坑给自己跳
                baseLength = (ops.pos[0] - referPos[0]),

                up = upLength / ops.part,//三角形区域上面一条边增量
                down = downLength / ops.part;//三角形区域下面一条边增量

            var cos = (upLength * upLength + downLength * downLength - xieLength * xieLength) / (2 * downLength * upLength),
                sin = Math.sqrt(1 - cos * cos);

            if (storagePos[1] === 0) {
                fixedA[0] = ops.pos[0] - up * p3;
                fixedA[1] = ops.pos[1];

                fixedB[0] = ops.pos[0] - down * cos * p3;
                fixedB[1] = ops.pos[1] + down * sin * p3;
            } else if (storagePos[1] === 100) {
                fixedA[0] = ops.pos[0] - up * cos * p3;
                fixedA[1] = ops.pos[1] - up * sin * p3;

                fixedB[0] = ops.pos[0] - down * p3;
                fixedB[1] = ops.pos[1];
            } else {
                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideUp = (upLength * upLength + baseLength * baseLength - sideUpLength * sideUpLength) / (2 * baseLength * upLength),
                    cosSideDown = (downLength * downLength + baseLength * baseLength - sideDownLength * sideDownLength) / (2 * baseLength * downLength),
                    sinSideUp = Math.sqrt(1 - cosSideUp * cosSideUp),
                    sinSideDown = Math.sqrt(1 - cosSideDown * cosSideDown);

                var upX = up * cosSideUp,
                    upY = up * sinSideUp,
                    downX = down * cosSideDown,
                    downY = down * sinSideDown;

                fixedA[0] = ops.pos[0] - upX * p3;
                fixedA[1] = ops.pos[1] - upY * p3;

                fixedB[0] = ops.pos[0] - downX * p3;
                fixedB[1] = ops.pos[1] + downY * p3;
            }
            ctx.beginPath();
            ctx.moveTo(ops.pos[0], ops.pos[1]);
            ctx.lineTo(fixedA[0], fixedA[1]);
            ctx.lineTo(fixedB[0], fixedB[1]);
            ctx.closePath();

            var colorGra = ctx.createLinearGradient(fixedA[0], fixedA[1], ops.pos[0], ops.pos[1]);
            colorGra.addColorStop(0, "rgba(255, 255, 255, .1)");
            colorGra.addColorStop(1, "rgba(255, 255, 255, .8)");
            ctx.fillStyle = colorGra;
            ctx.fill();

            p3 += 1;

            if (p3 > ops.part) {
                clearInterval(obj.angleTimer);
                p3 = 0;

                this.delayTimerAngle = setTimeout(function() {
                    obj.stop();
                }, 2000);
            }
        },
        /**
         * 绘制虚线区域
         */
        DrawDashedLine: function(ctx, x1, y1, x2, y2, dashLength) {
            var dashLen = dashLength === undefined ? 5 : dashLength,
                xpos = x2 - x1, //得到横向的宽度;
                ypos = y2 - y1, //得到纵向的高度;
                numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen); //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
            for (var i = 0; i < numDashes + 2; i ++) {
                if (i % 2 === 0) {
                    ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i); 
                    //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
                } else {
                    ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
                }
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#f5b34f";
            ctx.stroke();
        },
        /**
         * 绘制四边形区域
         */
        drawQuadArea: function() {
            //特效-铺开
            var self = this,
                ops = this.options,
                pos = STATSFOO.posConvert([ops.percent, 0]);

            $(ops.startIcon).fadeIn().css({
                "left": pos[0] - $(ops.startIcon).width() / 2,
                "top": pos[1] - $(ops.startIcon).height()
            });

            this.quadTimer = setInterval(function() {
                ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);
                self.quadStep(self);
            }, 10);
        },
        quadStep: function(obj) {
            var ops = obj.options,
                fixedA = ops.dire === "left" ? STATSFOO.posConvert( [0, 0] ) : STATSFOO.posConvert( [100, 0] ),
                fixedB = ops.dire === "left" ? STATSFOO.posConvert( [0, 100] ) : STATSFOO.posConvert( [100, 100] ),
                fixedC = ops.dire === "left" ? STATSFOO.posConvert( [ops.percent, 100] ) : STATSFOO.posConvert( [100 - ops.percent, 100] ),
                fixedD = ops.dire === "left" ? STATSFOO.posConvert( [ops.percent, 0] ) : STATSFOO.posConvert( [100 - ops.percent, 0] ),
                dire = ops.dire === "left" ? 1 : -1,
                up = (fixedD[0] - fixedA[0]) * dire / ops.part,
                down = (fixedC[0] - fixedB[0]) * dire / ops.part;

            ctx.beginPath();
            ctx.moveTo(fixedA[0] + up * p4 * dire, fixedA[1]);
            ctx.lineTo(fixedB[0] + down * p4 * dire, fixedB[1]);
            ctx.lineTo(fixedB[0], fixedB[1]);
            ctx.lineTo(fixedA[0], fixedA[1]);
            ctx.closePath();

            var colorGra = ctx.createLinearGradient(fixedA[0], fixedA[1], fixedD[0], fixedD[1]);
            colorGra.addColorStop(0, "rgba(255, 255, 255, .2)");
            colorGra.addColorStop(1, "rgba(255, 255, 255, .5)");
            ctx.fillStyle = colorGra;
            ctx.fill();

            p4 += 1;

            if (p4 > ops.part) {
                clearInterval(obj.quadTimer);
                p4 = 0;
                //绘制虚线
                ctx.beginPath();
                this.DrawDashedLine(ctx, fixedD[0], fixedD[1], fixedC[0], fixedC[1], 5);
                ctx.closePath();

                this.delayTimerQuad = setTimeout(function() {
                    obj.stop();
                }, 2000);
            }
        }
    };
    var defaultSetting = {
        //画布ID
        canvas: null,
        //三角形需要的方向
        dire: "",
        //三角形还是四边形
        type: 0,
        //四边形需要的百分比
        percent: "",
        //三角形需要的坐标
        pos: [0, 0],
        startIcon: null
    };

    window.FOOAREA = FOOAREA;
})(jQuery);
