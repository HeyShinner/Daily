(function($) {
    var FOOAREA = function(options) {
        this.initialize(options);
    };

    var p3 = 0,//绘制三角形区域铺开动画帧增量
        p4 = 0;//绘制四边形区域铺开动画帧增量

    FOOAREA.prototype = {
        constructor: FOOAREA,
        /**
         * 初始化
         */
        initialize: function(options) {
            var ops = this.getOptions(options);
            this.options = ops;

            //将后端回传的动画起止坐标转化
            this.pos = STATSFOO.posConvert(ops.pos);

            ops.type === 3 ? this.drawAngleArea() : this.drawQuadArea();
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
                "left": this.pos[0] - $(ops.startIcon).width() / 2,
                "top": this.pos[1] - $(ops.startIcon).height() * (1 - 0.1)
            });
            
            this.angleTimer = setInterval(function() {
                ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);
                self.angleStep(self, ops.end["up"], ops.end["down"]);//根据需求要替换“左边右边足球场地固定点”的坐标值，又挖坑给自己跳！！！
            }, 10);
        },
        angleStep: function(obj, targetA, targetB) {
            var ops = obj.options,
                fixedA = STATSFOO.posConvert(targetA, "stay"),//因为循环改变了pos[1]的值，所以需要传入"stay"提示函数只可转化一次pos[1]原始值
                fixedB = STATSFOO.posConvert(targetB, "stay"),
                upLength = this.getDistance(this.pos, fixedA),
                downLength = this.getDistance(this.pos, fixedB);

            var resultPos = this.getPerStepPos(fixedA, fixedB, targetA, targetB, this.pos, p3, upLength, downLength);

            fixedA = resultPos.fixedA;
            fixedB = resultPos.fixedB;

            ctx.beginPath();
            ctx.moveTo(this.pos[0], this.pos[1]);
            ctx.lineTo(fixedA[0], fixedA[1]);
            ctx.lineTo(fixedB[0], fixedB[1]);
            ctx.closePath();

            var colorGra = ctx.createLinearGradient(fixedA[0], fixedA[1], this.pos[0], this.pos[1]);
            colorGra.addColorStop(0, "rgba(255, 255, 255, .1)");
            colorGra.addColorStop(1, "rgba(255, 255, 255, .8)");
            ctx.fillStyle = colorGra;
            ctx.fill();

            p3 += 1;

            if (p3 > ops.part) {
                clearInterval(obj.angleTimer);
                p3 = 0;
            }
        },
        /**
         * 求每一帧动画位置坐标
         */
        getPerStepPos: function(A, B, targetA, targetB, C, increm, upLength, downLength) {//fixedA, fixedB, targetA, targetB, this.pos, p3, upLength, downLength
            var ops = this.options,
                dire = C[0] > A[0] ? -1 : 1,
                sideUpLength = 0,
                sideDownLength = 0,
                referPos = [ targetA[0], ops.pos[1] ],
                // xieUpL = xieLength / 2 * (51 / 62),
                // xieDownL = xieLength / 2 * (73 / 62),
                baseLength = dire * ( STATSFOO.posConvert( referPos )[0] - C[0] ),
                up = upLength / ops.part,//三角形区域上面一条边增量
                down = downLength / ops.part;//三角形区域下面一条边增量

            if (C[1] > A[1] && C[1] < B[1]) {
                //this.pos的y在A B两点之间
                // if (ops.pos[1] < targetA) {
                    sideUpLength = xieLength * (ops.pos[1] - targetA[1]) / 100;
                    sideDownLength = xieLength * (targetB[1] - ops.pos[1]) / 100;
                // } else {
                    // sideUpLength = this.getDistance(STATSFOO.posConvert(referPos), A);
                    // sideDownLength = this.getDistance(STATSFOO.posConvert(referPos), B);
                // }

                // if ( C[1] >= STATSFOO.posConvert([0, 50])[1] ) {
                //     sideUpLength = xieUpL * (50 - targetA[1]) / 50 + xieDownL * (ops.pos[1] - 50) / 50;
                //     sideDownLength = xieDownL * (targetB[1] - ops.pos[1]) / 50;
                //     // console.log(sideUpLength);
                // } else {
                //     sideUpLength = xieUpL * (ops.pos[1] - targetA[1]) / 50;
                //     sideDownLength = xieDownL * (targetB[1] - 50) / 50 + xieUpL * (50 - ops.pos[1]) / 50;
                //     console.log(sideUpLength);
                //     console.log(ops.pos[1] - targetA[1]);
                // }

                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideUp = (upLength * upLength + baseLength * baseLength - sideUpLength * sideUpLength) / (2 * baseLength * upLength),
                    cosSideDown = (downLength * downLength + baseLength * baseLength - sideDownLength * sideDownLength) / (2 * baseLength * downLength),
                    sinSideUp = Math.sqrt(1 - cosSideUp * cosSideUp),
                    sinSideDown = Math.sqrt(1 - cosSideDown * cosSideDown);

                var upX = up * cosSideUp,
                    upY = up * sinSideUp,
                    downX = down * cosSideDown,
                    downY = down * sinSideDown;

                A[0] = C[0] + dire * upX * increm;
                A[1] = C[1] - upY * increm;

                B[0] = C[0] + dire * downX * increm;
                B[1] = C[1] + downY * increm;
            } else if (C[1] < A[1]) {
                //this.pos在A点上方
                sideUpLength = xieLength * (targetA[1] - ops.pos[1]) / 100;
                sideDownLength = xieLength * (targetB[1] - ops.pos[1]) / 100;

                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideUp = (upLength * upLength + baseLength * baseLength - sideUpLength * sideUpLength) / (2 * baseLength * upLength),
                    cosSideDown = (downLength * downLength + baseLength * baseLength - sideDownLength * sideDownLength) / (2 * baseLength * downLength),
                    sinSideUp = Math.sqrt(1 - cosSideUp * cosSideUp),
                    sinSideDown = Math.sqrt(1 - cosSideDown * cosSideDown);

                var upX = up * cosSideUp,
                    upY = up * sinSideUp,
                    downX = down * cosSideDown,
                    downY = down * sinSideDown;

                A[0] = C[0] + dire * upX * increm;
                A[1] = C[1] + upY * increm;

                B[0] = C[0] + dire * downX * increm;
                B[1] = C[1] + downY * increm;
            } else if (C[1] > B[1]) {
                //this.pos在B点下方
                sideUpLength = xieLength * (ops.pos[1] - targetA[1]) / 100;
                sideDownLength = xieLength * (ops.pos[1] - targetB[1] ) / 100;

                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideUp = (upLength * upLength + baseLength * baseLength - sideUpLength * sideUpLength) / (2 * baseLength * upLength),
                    cosSideDown = (downLength * downLength + baseLength * baseLength - sideDownLength * sideDownLength) / (2 * baseLength * downLength),
                    sinSideUp = Math.sqrt(1 - cosSideUp * cosSideUp),
                    sinSideDown = Math.sqrt(1 - cosSideDown * cosSideDown);

                var upX = up * cosSideUp,
                    upY = up * sinSideUp,
                    downX = down * cosSideDown,
                    downY = down * sinSideDown;

                A[0] = C[0] + dire * upX * increm;
                A[1] = C[1] - upY * increm;

                B[0] = C[0] + dire * downX * increm;
                B[1] = C[1] - downY * increm;
            } else if (C[1] === A[1]) {
                sideDownLength = xieLength * (targetB[1] - targetA[1]) / 100;

                console.log(targetA);
                console.log(targetB);

                // console.log(sideDownLength);

                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideDown = (downLength * downLength + baseLength * baseLength - sideDownLength * sideDownLength) / (2 * baseLength * downLength),
                    sinSideDown = Math.sqrt(1 - cosSideDown * cosSideDown);

                var downX = down * cosSideDown,
                    downY = down * sinSideDown;

                A[0] = C[0] + dire * up * increm;
                A[1] = C[1];

                B[0] = C[0] + dire * downX + increm;
                B[1] = C[1] + downY * increm;
            } else {
                sideUpLength = xieLength * (targetB[1] - targetA[1]) / 100;

                //fixedA and fixedB都需要根据角度来转化坐标
                var cosSideUp = (upLength * upLength + baseLength * baseLength - sideUpLength * sideUpLength) / (2 * baseLength * upLength),
                    sinSideUp = Math.sqrt(1 - cosSideUp * cosSideUp);

                var upX = up * cosSideUp,
                    upY = up * sinSideUp;

                A[0] = C[0] + dire * upX * increm;
                A[1] = C[1] - upY * increm;

                B[0] = C[0] + dire * down * increm;
                B[1] = C[1];
            }

            return {
                "fixedA": A,
                "fixedB": B
            };
        },
        /**
         * 两点之间距离
         */
        getDistance: function(pos1, pos2) {
            var x = pos1[0] - pos2[0],
                y = pos1[1] - pos2[1];

            return Math.sqrt(x * x + y * y);
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
                fixedA = ops.dire === "left" ? STATSFOO.posConvert( [100, 0] ) : STATSFOO.posConvert( [0, 0] ),
                fixedB = ops.dire === "left" ? STATSFOO.posConvert( [100, 100] ) : STATSFOO.posConvert( [0, 100] ),
                fixedC = STATSFOO.posConvert( [ops.percent, 100] ),
                fixedD = STATSFOO.posConvert( [ops.percent, 0] ),
                dire = ops.dire === "left" ? -1 : 1,
                upAll = STATSFOO.posConvert( [100, 0] )[0] - STATSFOO.posConvert( [0, 0] )[0],
                downAll = STATSFOO.posConvert( [100, 100] )[0] - STATSFOO.posConvert( [0, 100] )[0],
                up = ops.dire === "left" ? (100 - ops.percent) / 100 * upAll / ops.part : ops.percent / 100 * upAll / ops.part,
                down = ops.dire === "left" ? (100 - ops.percent) / 100 * downAll / ops.part : ops.percent / 100 * downAll / ops.part;

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
        end: {},
        startIcon: null
    };

    window.FOOAREA = FOOAREA;
})(jQuery);
