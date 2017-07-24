(function() {
    var dis = $(".rebounds").width() / 2, //检测篮框边界碰撞
        DOC_W = $(document).width();

    var trackDuration = 800, //投篮运动时间
        playing = false, //是否正在游戏
        moving = false, //篮球是否在运动
        basketrySpeed = 0; //篮筐运动速度

    var endCoor = {},
        angleDeg = null,
        initSlider = null;

    //点击开始游戏同时开始游戏倒计时，倒计时结束后不管是否正在滑动都将篮球投出
    function countdown() {
        $(".countdown").html('还剩<em id="seconds">5</em>秒');
        var count = 4,
            countdownTimer = setInterval(function() {
                $("#seconds").text(count);
                if (count === 0) {
                    $(".countdown").html("投篮！");
                    clearInterval(countdownTimer);
                    $('#ball').css({ 'left': 0, 'top': 0 });
                    // 计算投篮位置
                    endCoor.top = -$("#basket").height() / 2 - $(".rebounds").height() + 30;
                    if (angleDeg === null) {
                        endCoor.left = 0;
                    } else {
                        if (!playing || moving) return;
                        //根据箭头指向求出篮球需要投出的最终位置
                        endCoor.left = Math.atan(angleDeg * Math.PI / 180) * $(".rebounds").height();
                    }
                    moving = true;
                    handleShoot(endCoor); // 投篮动画
                    $("#angle").removeClass("active");
                    initSlider.setDisabled(true);
                }
                count -= 1;
            }, 1000);
    }

    //初始化投篮游戏
    function initGame() {
        //初始化滑动条
        initSlider = new Powerange(document.querySelector("#slider"), {
            min: 0,
            max: 100,
            start: 50,
            callback: function() { //改变滑动条的值,实时改变箭头的角度
                if (!playing || moving) return; //游戏未开始，滑动条应无法滑动且置灰

                var value = $("#slider").val();
                handleAngle(value);
            },
            setDisabled: true
        });

        $(".range-min , .range-max").remove();
        //点击开始游戏
        $(".btn").click(function() {
            if (playing) return;

            //箭头显示、slider高亮
            playing = true;
            $("#angle").addClass("active");
            initSlider.setDisabled(false);

            basketStartMove($('.rebounds').width() - 25, 0); // 篮筐运动【新方法】
            countdown();
        });
    }

    // 篮筐运动
    function basketStartMove(distance, direction) {
        direction = 1 - direction;
        basketrySpeed = getBasketSpeed();

        $("#basket").stop().animate((direction === 1 ? { 'left': distance } : { 'left': 25 }), basketrySpeed, 'linear', function() {
            basketStartMove(distance, direction);
        }); //递归完成动画！！！
    }

    function getBasketSpeed() {
        var s = Math.random() * 500 + 600;
        return basketrySpeed === 0 ? s : s * 2;
    }

    //在长按滑动slider过程中，根据滑动值改变箭头角度
    function handleAngle(value) {
        //求出箭头转向一边的最大角度
        var H = $(".rebounds").height(),
            step = Math.round(180 * Math.atan2(H, dis) / Math.PI) / 50,
            angleEle = $("#angle");

        angleDeg = (value - 50) * step;
        angleEle.css({
            "transform": "rotateZ(" + angleDeg + "deg)",
            "transform-origin": "bottom center"
        });
    }

    //球沿抛物线轨迹运动
    function handleShoot(endCoor) {
        var ballScale = 1.2;

        var track = new Parabola({
            el: "#ball",
            offset: [endCoor.left, endCoor.top],
            curvature: 0.005,
            duration: trackDuration,
            autostart: true,
            callback: function() {
                //根据当前篮框的位置，计算篮球是否投进（投不投进与后端无关）
                handleBump() ? ballBackToOrigin(endCoor) : ballFlyOut(endCoor);
                $(".countdown").html("");
                //如果中奖显示什么，不中奖显示什么
                var data = {
                    "Result": true,
                    "Title": "运气不错喔！",
                    "Src": "img/ticket.png",
                    "Name": "上海队 球票"
                };
                // var data = {
                //     "Result": false,
                //     "Title": "哎哟！与大奖擦肩而过！"
                // };
                showResult(data);
            },
            stepCallback: function(x, y) {
                ballScale -= 0.008;
                $("#ball").css({ "transform": "scale(" + ballScale + ")" });
            }
        });
    }

    //显示中奖结果
    function showResult(data) {
        if (data.Result === true) {
            $("#result").html('<h4 id="title">' + data.Title + '</h4><img id="gift-img" src="' + data.Src + '" alt=""><p id="gift-name">' + data.Name + '</p>');
        } else {
            $("#result").html('<h4 id="title">' + data.Title + '</h4>');
        }
        $("#result").fadeIn(1000);
        var resultTimer = setTimeout(function() {
            $("#result").fadeOut(500);
            clearTimeout(resultTimer);
        }, 4000);
    }

    //篮球投出时，篮框不必更改速度刻意与篮球碰撞，能进球就进球动画，不能进球就弹飞动画
    function handleBump() {
        var basketObj = $("#basket"),
            currMargin = parseInt(basketObj.css("left")),
            maxRange = currMargin + $("#basket").width() / 2,
            minRange = currMargin - $("#basket").width() / 2,
            endLeft = endCoor.left + $(".rebounds").width() / 2 - 12;

        return (endCoor.left >= minRange && endCoor.left <= maxRange) ? true : false;
    }

    //不中奖：弹开，再做回弹动画
    function ballFlyOut(endCoor) {
        var ballObj = {
            "x": endCoor.left,
            "y": endCoor.top,
            "g": 1.5,
            "vx": Math.pow(-1, Math.ceil(Math.random() * 1000)) * 3, //+3 or -3
            "vy": -5
        };

        var ballOutTimer = setInterval(function() {
            //碰撞检测,body-->overflow:hidden
            if (Math.abs(ballObj.x) >= DOC_W + 10) {
                clearInterval(ballOutTimer);
                resetGame();
                return; //!important
            }

            ballObj.x += ballObj.vx;
            ballObj.y += ballObj.vy;
            ballObj.vy += ballObj.g;

            //运动衰减
            if (ballObj.y >= 0) {
                ballObj.y = 0;
                ballObj.vy = -ballObj.vy * 0.75;
            }
            $("#ball").css({
                "left": ballObj.x,
                "top": ballObj.y
            });
        }, 50);
    }

    //中奖：先掉落，有落网动画，然后再做回弹动画
    function ballBackToOrigin(endCoor) {
        var ballObj = {
            "x": endCoor.left,
            "y": endCoor.top,
            "g": 1.5,
            "vx": Math.pow(-1, Math.ceil(Math.random() * 1000)) * 3, //+3 or -3
            "vy": -5
        };

        var ballDownTimer = setInterval(function() {
            //垂直掉落到达指定位置停止
            if (ballObj.y >= -$(".dashboard").height() / 2) {
                clearInterval(ballDownTimer);

                var ballBackTimer = setInterval(function() {
                    //碰撞检测,body-->overflow:hidden
                    if (Math.abs(ballObj.x) >= DOC_W + 10) {
                        clearInterval(ballBackTimer);
                        resetGame();
                        return; //!important
                    }

                    ballObj.x += ballObj.vx;
                    ballObj.y += ballObj.vy;
                    ballObj.vy += ballObj.g;

                    //运动衰减
                    if (ballObj.y >= 0) {
                        ballObj.y = 0;
                        ballObj.vy = -ballObj.vy * 0.75;
                    }
                    $("#ball").css({
                        "left": ballObj.x,
                        "top": ballObj.y
                    });
                }, 50);
            }

            ballObj.y += ballObj.vy;
            ballObj.vy += ballObj.g;

            $("#ball").css({
                "left": ballObj.x,
                "top": ballObj.y
            });
        }, 50);
    }

    //重置游戏
    function resetGame() {
        initSlider.setDisabled(true);

        $("#basket").stop().css("left", "50%");
        $("#ball").css({ "transform": "scale(1)", "position": "static" });
        $("#angle").css("transform", "rotateZ(0deg)");

        var sliderPos = Math.round($(".range-bar").width() / 100 * 50 - 9);
        $(".range-bar").find(".range-handle").css("left", sliderPos).end().find(".range-quantity").css("width", sliderPos);

        playing = false;
        moving = false;
        endCoor = {};
        angleDeg = null;
        basketrySpeed = 0;
        $('.btn').removeClass('disabled');
    }

    initGame();
})();