(function() {
    //定义全局变量
    var marginTop = 20,
        marginLeft = 100,
        windowWidth = 1260,
        windowHeight = 550,
        radius = 8,
        endTime = new Date(2017, 7, 10, 11, 0, 0),
        curShowSeconds = 0,
        balls = [],
        colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000", "#CCFF00", "#AACC66"];
    //获得绘制环境并定义宽度和高度
    var myCanvas = document.getElementById("my-canvas"),
        myContext = myCanvas.getContext("2d");
    myCanvas.width = windowWidth;
    myCanvas.height = windowHeight;

    //定义定时器，实现倒计时效果
    setInterval(function() {
        rendarCountdown(myContext);
        update();
    }, 50);
    //定义倒计时的总秒数的函数
    function getCurShowSeconds() {
        var curTime = new Date(); //此变量不应该声明为全局变量，因为每一次调用时取得的值都应该是当前的时间
        curShowSeconds = Math.round((endTime.getTime() - curTime.getTime()) / 1000);
        return (curShowSeconds > 0) ? curShowSeconds : 0;
    }
    //定义渲染倒计时的函数
    function rendarCountdown(ctx) {
        myContext.clearRect(0, 0, windowWidth, windowHeight);

        var hour = parseInt(curShowSeconds / 3600),
            minute = parseInt((curShowSeconds - hour * 3600) / 60),
            second = curShowSeconds % 60;

        rendarDigit(radius + marginLeft, marginTop, parseInt(hour / 10), ctx);
        rendarDigit((18 * radius) + marginLeft, marginTop, parseInt(hour % 10), ctx);
        rendarDigit((36 * radius) + marginLeft, marginTop, 10, ctx);
        rendarDigit((47 * radius) + marginLeft, marginTop, parseInt(minute / 10), ctx);
        rendarDigit((65 * radius) + marginLeft, marginTop, parseInt(minute % 10), ctx);
        rendarDigit((83 * radius) + marginLeft, marginTop, 10, ctx);
        rendarDigit((92 * radius) + marginLeft, marginTop, parseInt(second / 10), ctx);
        rendarDigit((110 * radius) + marginLeft, marginTop, parseInt(second % 10), ctx);
        //绘制小球
        for (var i = 0; i < balls.length; i++) {
            myContext.fillStyle = balls[i].color;

            myContext.beginPath();
            myContext.arc(balls[i].x, balls[i].y, radius, 0, 2 * Math.PI, true);
            myContext.closePath();

            myContext.fill();
        }
    }
    //定义渲染时钟数字的函数
    function rendarDigit(x, y, num, ctx) {
        myContext.fillStyle = "#f08080";

        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    myContext.beginPath();
                    myContext.arc(x + j * 2 * (radius + 1) + radius + 1, y + i * 2 * (radius + 1) + radius + 1, radius, 0, 2 * Math.PI);
                    myContext.closePath();

                    myContext.fill();
                }
            }
        }
    }
    //更新时间和判断是否添加小球和更新小球的位置参数等信息
    function update() {
        var nextTime = new Date(), //这里就是个坑！！！注意注意！！！
            nextShowSeconds = Math.round((endTime.getTime() - nextTime.getTime()) / 1000),

            curShowHour = parseInt(curShowSeconds / 3600),
            curShowMinute = parseInt((curShowSeconds - curShowHour * 3600) / 60),
            curShowSecond = curShowSeconds % 60,

            nextShowHour = parseInt(nextShowSeconds / 3600),
            nextShowMinute = parseInt((nextShowSeconds - nextShowHour * 3600) / 60),
            nextShowSecond = nextShowSeconds % 60;

        if (nextShowSecond !== curShowSecond) {
            //判断当时钟数字有变化时才添加小球
            if (parseInt(nextShowHour / 10) != parseInt(curShowHour / 10)) {
                addBalls(radius + marginLeft, marginTop, parseInt(curShowHour / 10));
            }
            if (parseInt(nextShowHour % 10) != parseInt(curShowHour % 10)) {
                addBalls((18 * radius) + marginLeft, marginTop, parseInt(curShowHour % 10));
            }
            if (parseInt(nextShowMinute / 10) != parseInt(curShowMinute / 10)) {
                addBalls((47 * radius) + marginLeft, marginTop, parseInt(curShowMinute / 10));
            }
            if (parseInt(nextShowMinute % 10) != parseInt(curShowMinute % 10)) {
                addBalls((65 * radius) + marginLeft, marginTop, parseInt(curShowMinute % 10));
            }
            if (parseInt(nextShowSecond / 10) != parseInt(curShowSecond / 10)) {
                addBalls((92 * radius) + marginLeft, marginTop, parseInt(curShowSecond / 10));
            }
            if (parseInt(nextShowSecond % 10) != parseInt(curShowSecond % 10)) {
                addBalls((110 * radius) + marginLeft, marginTop, parseInt(curShowSecond % 10));
            }
            curShowSeconds = nextShowSeconds;
        }
        updateBalls();
    }
    //定义一旦倒计时时钟的数字改变，那么就往balls数组里添加小球，只是往数组里添加小球，并没有渲染到页面之中
    function addBalls(x, y, num) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    var aBall = {
                        x: x + j * 2 * (radius + 1) + radius + 1,
                        y: y + i * 2 * (radius + 1) + radius + 1,
                        a: 1.5 + Math.random(),
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                        vy: -5 * Math.random(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                    };
                    balls.push(aBall);
                }
            }
        }
    }
    //定义更新小球位置信息参数的函数
    function updateBalls() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy += balls[i].a;
            if (balls[i].y > (windowHeight - radius)) {
                balls[i].y = windowHeight - radius;
                balls[i].vy = -balls[i].vy * 0.75;
            }
        }
        //对存放小球的数组进行长度限制，不然数组长度的一直增长会导致这个程序不适合长久的运行下去，很重要
        var cnt = 0;
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].x + radius > 0 && balls[i].x - radius < windowWidth) {
                balls[cnt++] = balls[i];
            }
        }
        while (balls.length > Math.min(300, cnt)) {
            balls.pop();
        }
    }
    //函数调用
    function initCountdown() {
        getCurShowSeconds();
        rendarCountdown(myContext);
    }
    initCountdown();

})();