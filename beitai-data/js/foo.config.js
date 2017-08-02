var STATSFOO = window.STATSFOO || {},
    fooCanvas = document.querySelector("#foo-canvas"),
    fooCourt = $("#foo-court"),
    liveEvent = $("#live-event"),
    WINDOW_W = $(document).width(),
    LIVE_BG_RATIO = 681 / 750,//live-event背景图高度和宽度百分比
    LIVE_COURT_RATIO = 135 / 706,//足球场地背景图高度和宽度百分比
    A_H_RATIO = 255 / 681,//足球场地背景图高度与live-event背景图高度百分比
    xieLength = 0,
    LIVE_COURT_W_RATIO = 0.8586,//足球场地背景图占屏幕宽度百分比
    ctx = fooCanvas.getContext("2d");

//主客队里任意球和球门球的两个固定点的百分比位置
var renLeft1 = [ 0, 26.12],
    renLeft2 = [ 0, 60 ],
    renRight1 = [ 100, 26.12],
    renRight2 = [ 100, 60 ];

var qiuLeft1 = [ 0, 0 ],
    qiuLeft2 = [ 0, 100 ],
    qiuRight1 = [ 100, 0 ],
    qiuRight2 = [ 100, 100 ];

// 获取URL参数
function getUrlParam (name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url ? url.substr(1).match(reg) : window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

(function(STATSFOO, $, undefined) {
    var image_url = 'http://www.misports.cn/images/';

    STATSFOO.DEBUG = true;

    STATSFOO.Mid = getUrlParam("Mid");
    STATSFOO.Rid = getUrlParam("Rid");

    STATSFOO.API_LIVE = "http://www.misports.cn/API/DataCenter.php";
    STATSFOO.TEAM_URL = image_url + "football/team/";

    // 测试
	if (STATSFOO.DEBUG === true) {
		STATSFOO.API_LIVE = 'http://192.168.1.132/Test.php';
	}

    // 获取ajax数据
	STATSFOO.getAJAXData =function(url, cb, para) {
		$.get(url, function(data) {
			var _d = jQuery.parseJSON(data);
			var _p = para ? para : {};
			if (_d.Result === true && typeof cb === 'function') {
				cb(_d, _p);
			} else {
				console.log('error:' + _d.Reason);
			}
		});
    }
    
    /*---------------------------------live_event初始化--------------------------------*/
    LIVE_BG_H = WINDOW_W * LIVE_BG_RATIO;
    liveEvent.height(LIVE_BG_H);

    fooCanvas.width = WINDOW_W * LIVE_COURT_W_RATIO;
    fooCanvas.height = LIVE_BG_H / 3;

    fooCourt.css({
        "height": fooCanvas.height + "px",
        "top": ( LIVE_BG_H - (LIVE_BG_H * A_H_RATIO + LIVE_BG_H / 3 ) ) / LIVE_BG_H * 100 + "%"
    });

    //start：以6P下足球背景图宽高为缩放尺寸基础
    var courtW = WINDOW_W * LIVE_COURT_W_RATIO,
        courtH = courtW * LIVE_COURT_RATIO;
    
    var sinNum = Math.sin(Math.atan(124 / 108)),//梯形背景图底部角的正余弦值
        cosNum = Math.cos(Math.atan(124 / 108));

    xieLength = courtH / Math.sin(Math.atan(126 / 107));

    $(window).resize(function() {
        WINDOW_W = $(window).width();
        LIVE_BG_H = WINDOW_W * LIVE_BG_RATIO;
        liveEvent.height(LIVE_BG_H);

        fooCanvas.width = WINDOW_W * LIVE_COURT_W_RATIO;
        fooCanvas.height = LIVE_BG_H / 3;

        fooCourt.css({
            "height": fooCanvas.height + "px",
            "top": ( LIVE_BG_H - (LIVE_BG_H * A_H_RATIO + LIVE_BG_H / 3 ) ) / LIVE_BG_H * 100 + "%"
        });

        //start：以6P下足球背景图宽高为缩放尺寸基础
        courtW = WINDOW_W * LIVE_COURT_W_RATIO;
        courtH = courtW * LIVE_COURT_RATIO;
        xieLength = courtH / Math.sin(Math.atan(126 / 107));
    });

    STATSFOO.posConvert = function(pos, status) {
        //实际显示在canvas上的坐标为正常坐标，注意百分比的计算跟100挂钩
        var posOnCanvas = [0, 0],
            w = courtW - xieLength * cosNum * 2,//梯形背景图顶边长
            a = xieLength * (100 - pos[1]) * cosNum / 100;//斜边到y轴距离

        //由于缩放视角问题，0%到50%并不代表背景图上足球场地的0%到50%！！！又一个坑！！！
        pos[1] = pos[1] <= 50 && pos[1] > 0 ? pos[1] * 51 / 62 : pos[1];

        if (pos[1] === 100) {
            posOnCanvas[0] = fooCanvas.width * pos[0] / 100;
            posOnCanvas[1] = fooCanvas.height;
        } else {
            posOnCanvas[0] = ( (xieLength * cosNum - a) * 2 + w ) * pos[0] / 100 + a;
            posOnCanvas[1] = fooCanvas.height - xieLength * (100 - pos[1]) * sinNum / 100;
        }
        //由于铺开动画中需要循环调用该函数，所以需要保证pos[1]只能转化一次，又一个坑！！！
        pos[1] = status === "stay" && pos[1] <= 50 && pos[1] > 0 ? pos[1] * 62 / 51 : pos[1];

        return posOnCanvas;
    }
})(STATSFOO, jQuery);