(function(STATSFOO, $, undefined) {
    var UPLIVETIME = 5000,
        nextRid = null,
        EVENTNAMEJSON = {
            "period_start": "上半场开始",
            "match_started": "比赛开始",
            "free_kick": "任意球",
            "throw_in": "界外球",
            "corner_kick": "角球",
            "offside": "越位",
            "goal_kick": "球门球",
            "shot_on_target": "射正",
            "shot_saved": "扑救",
            "penalty_awarded": "判罚点球",
            "penalty missed": "罚失点球",
            "penalty_shootout": "罚失点球",
            "yellow_card": "黄牌",
            "red_card": "红牌",
            "yellow_red_card": "两张黄牌",
            "score_change": "进球",
            "shot_off_target": "射偏",
            "injury": "受伤",
            "injury_return": "受伤回场",
            "break_start": "比赛重新开始",
            "substitution": "换人",
            "match_ended": "比赛结束"
        };
    //足球直播－－live_event初始化
    STATSFOO.initLive = function() {
        //初始化请求此参数为空，后端将返回赛事最新事件id
        STATSFOO.getAJAXData(STATSFOO.API_LIVE + "?s=FbEvent&Mid=" + STATSFOO.Mid + "&Rid=", function(data) {
            if (data.Result) {
                nextRid = data.EventList[0];

                // switch (data.MatchInfo.Status) {
                //     case "赛前":
                //         //textShowAnim("比赛未开始");
                //         //STATSFOO.upLiveData();
                //         // break;
                //     case "赛中":
                //         //chooseAnimFn(data);
                //         //nextRid = data.EventList[0];
                //         //STATSFOO.upLiveData(nextRid);
                //         //break;
                //     case "ended":
                //         //textShowAnim("比赛结束");
                //         //break;
                // }

                chooseAnimFn(data);
                STATSFOO.upLiveData(nextRid);
            }
        });
    }

    //足球直播－－动画每5s更新
    STATSFOO.upLiveData = function(nextRid) {
        STATSFOO.upLiveDataTimer = setInterval(function() {
            STATSFOO.getAJAXData(STATSFOO.API_LIVE + "?s=FbEvent&Mid=" + STATSFOO.Mid + "&Rid=" + nextRid, function(data) {
                if (data.Result) {
                    nextRid = data.EventList[0];

                    // switch (data.MatchInfo.Status) {
                    //     case "赛前":
                    //         // break;
                    //     case "赛中":
                    //         //chooseAnimFn(data);
                    //         //break;
                    //     case "ended":
                    //         //textShowAnim("比赛结束");
                    //         //STATSFOO.clearLiveEvent();按理应该清除更新事件定时器？？？
                    //         //break;
                    // }

                    //test-data
                    // data = {"MatchInfo":{"Tournament":"\u4e2d\u8d85","Date":"2017-07-16","Time":"15:30:00","Hid":"34694","Hcn":"\u957f\u6625\u4e9a\u6cf0","Aid":"3375","Acn":"\u5e7f\u5dde\u5bcc\u529b","Hscore":"3","Ascore":"2","Status":"ended"},"EventList":["315397750","11","score_change",0,"3373","\u4e0a\u6d77\u7533\u82b1","18","58","2065","\u9a6c\u4e01\u65af, \u5965\u5df4\u8d39\u7c73","93202","\u83ab\u96f7\u8bfa, \u5409\u5965\u74e6\u5c3c"],"Result":true};
                    hideAllEle();
                    chooseAnimFn(data);
                }
            });
        }, UPLIVETIME);
    };

    //足球直播－－清除动画定时器
    STATSFOO.clearLiveTimer = function(timeId) {
        clearInterval(STATSFOO.upLiveDataTimer);
    };

    //更新时根据事件类型调用动画函数
    function chooseAnimFn(data) {
        var eventListArr = data.EventList,
            eventType = eventListArr[2],
            team_num = eventListArr[3],
            x_num = parseFloat(eventListArr[6]),
            y_num = parseFloat(eventListArr[7]),
            startPos = [ x_num, y_num ];

        switch (eventType) {
            //文字
            case "period_start":
            case "match_started":
            case "penalty missed":
            case "penalty_shootout":
            case "break_start":
            case "match_ended":
                textShowAnim( EVENTNAMEJSON[eventType] );
                break;
            //直播演示 + 提示框
            case "free_kick":
            case "throw_in":
            case "corner_kick":
            case "offside":
            case "goal_kick":
            case "shot_on_target":
            case "score_change":
            case "shot_off_target":
            case "injury":
                switch (eventType) {
                    case "free_kick":
                        var endPos = team_num === 1 ? {"up": renRight1, "down": renRight2} : {"up": renLeft1, "down": renLeft2};

                        startPos[1] = startPos[1] > 25.9 && startPos[1] < 30.1 ? 25.9 : startPos[1];

                        STATSFOO.showEventTip(eventListArr);
                        ballSpreadAnim(3, "#icon-position", startPos, 0, endPos, "");
                        break;
                    case "throw_in":
                        var endPos = [];
                        
                        //为啥合并就出问题了？？？？？？
                        if (startPos[0] >= 50) {
                            endPos[0] = startPos[0] - 5;
                        } else {
                            endPos[0] = startPos[0] + 5;
                        }

                        if (startPos[1] > 85) {
                            endPos[1] = startPos[1] - 15;
                        } else {
                            endPos[1] = startPos[1] + 15;
                        }

                        STATSFOO.showEventTip(eventListArr);
                        STATSFOO.ballShootAnim("none", startPos, endPos);
                        break;
                    case "corner_kick":
                        var endPos = team_num === 1 ? [91, 50] : [9, 50],
                            newStartPos = [];
                        
                        if (startPos[0] < 50) {
                            if (startPos[1] < 50) {
                                newStartPos = [0, 0];
                            } else {
                                newStartPos = [0, 100];
                            }
                        } else {
                            if (startPos[1] < 50) {
                                newStartPos = [100, 0];
                            } else {
                                newStartPos = [100, 100];
                            }
                        }

                        STATSFOO.showEventTip(eventListArr);
                        STATSFOO.ballShootAnim("flag", newStartPos, endPos);
                        break;
                    case "offside":
                        var endPos = x_num,
                            direStr = team_num === 1 ? "right" : "left";

                        STATSFOO.showEventTip(eventListArr);
                        ballSpreadAnim(4, "#icon-flag", startPos, startPos[0], endPos, direStr);
                        break;
                    case "goal_kick":
                        var endPos = team_num === 1 ? {"up": [100, 0], "down": [100, 100]} : {"up": [0, 0], "down": [0, 100]};

                        STATSFOO.showEventTip(eventListArr);
                        ballSpreadAnim(3, "#icon-position", startPos, 0, endPos, "");
                        break;
                    case "shot_on_target":
                        var endPos = team_num === 1 ? [100, 50] : [0, 50];

                        STATSFOO.showEventTip(eventListArr);
                        STATSFOO.ballShootAnim("player", startPos, endPos);
                        break;
                    case "score_change":
                        var endPos = team_num === 1 ? [100, 50] : [0, 50],
                            posClass = eventListArr[3] === 1 ? "home" : "away";

                        $("#common-msg").html('<div class="event-msg-player" id="msg-player">\
                                '+ eventListArr[9] + '<img src="' + STATSFOO.TEAM_URL + eventListArr[4] + '.png" alt="" class="logo">\
                            </div>\
                            <div class="event-msg-tip">\
                                <em class="icon-ball-smaller"></em>\
                                <span class="tip-score">球进了！</span>' + eventListArr[1] + "'" + '\
                            </div>\
                        ').removeClass("home away msg-anim").addClass("msg-anim " + posClass);
                        ballScoreAnim(startPos, endPos);
                        break;
                    case "shot_off_target":
                        var endPos = team_num === 1 ? [100, 80] : [0, 20];

                        STATSFOO.showEventTip(eventListArr);
                        STATSFOO.ballShootAnim("player", startPos, endPos);
                        break;
                    case "injury":
                        STATSFOO.showEventTip(eventListArr);
                        hurtAnimStart(startPos, "#icon-hurt");
                        break;
                }
                break;
            //球员替换
            case "substitution":
                var teamId = eventListArr[4],
                    time = eventListArr[1],
                    playerUp = {"teamId": eventListArr[4], "name": eventListArr[9]},
                    playerDown = {"teamId": eventListArr[4], "name": eventListArr[11]};

                playerReplaceStart(teamId, time, playerUp, playerDown);
                break;
            //提示框
            case "shot_saved":
            case "penalty_awarded":
            case "injury_return":
            case "yellow_card":
            case "red_card":
                STATSFOO.showEventTip(eventListArr);
                break;
            case "yellow_red_card":
                STATSFOO.showEventTip(eventListArr);
                cardAnimStart();
                break;
        }
    }

    //足球直播－－格式化比赛时间
    function formatMatchTime(str) {
        var newStr = str.split(":");

        return newStr[0] + ":" + newStr[1];
    }

    //足球直播－－射门动画
    STATSFOO.ballShootAnim = function(iconIdStr, startPos, endPos) {//str, [], []
        var fooShootPath = new FOOSHOOTPATH({
            targetEle: "#football",
            start: startPos,
            end: endPos,
            part: 6,
            startIcon: "#icon-" + iconIdStr,
            status: iconIdStr
        });
    }

    //足球直播－－显示提示框
    STATSFOO.showEventTip = function(eventListArr) {//arr
        var posClass = eventListArr[3] === 1 ? "home" : "away",
            cardIconEle = "",
            tipStr = eventListArr[8] === "0" ? eventListArr[5] : eventListArr[9];

        if (eventListArr[2] === "yellow_card") {
            cardIconEle = '<em class="icon-card yellow-card"></em>';
        } else if (eventListArr[2] === "red_card") {
            cardIconEle = '<em class="icon-card red-card"></em>';
        } else {
            cardIconEle = "";
        }

        $("#common-msg").html('<div class="event-msg-player" id="msg-player">\
                ' + tipStr + '<img src="' + STATSFOO.TEAM_URL + eventListArr[4] + '.png" alt="" class="logo">\
            </div>\
            <div class="event-msg-tip">\
                ' + cardIconEle + EVENTNAMEJSON[eventListArr[2]] + ' ' + eventListArr[1] + "'" + '\
            </div>\
        ').removeClass("home away msg-anim").addClass("msg-anim " + posClass).fadeIn();
    }

    //球门球、任意球、越位铺开动画
    function ballSpreadAnim(typeNum, iconIdStr, startPos, percentNum, endPos, direStr) {//num, str, [], num, {"up": [], "down": []}, str
        var fooArea = new FOOAREA({
            canvas: "#foo-canvas",
            dire: direStr,//控制“越位”铺开动画方向，与球门球和任意球主客方向无关
            type: typeNum,//3对应icon-position;4对应icon-flag
            percent: percentNum,
            pos: startPos,
            end: endPos,
            part: 50,
            startIcon: iconIdStr
        });
    }

    //进球动画
    function ballScoreAnim(startPos, endPos) {//[], []
        var fooScore = new FOOSCORE({
            end: startPos,
            shootEndPos: endPos,//用于进球轨迹演示终点位置
            part: 8,
            targetEle: "#anim-football"
        });
    }

    //黄换红牌动画
    function cardAnimStart() {
        $("#anim-match-card").css({"opacity": 1, "display": "block"}).removeClass("card-anim").addClass("card-anim");
    }

    //受伤
    function hurtAnimStart(pos, iconId) {//[], str
        var target = $(iconId);

        pos = STATSFOO.posConvert(pos);
        target.fadeIn().css({
            "left": pos[0] - target.width() / 2,
            "top": pos[1] - target.height()
        });
    }

    //球员替换
    function playerReplaceStart(teamId, time, playerUp, playerDown) {//str, str, {"teamId": str, "name": str}, {"teamId": str, "name": str}
        $("#event-replace").find("#up-msg").html('<div class="player">' + playerDown.name + '</div>\
                                                  <div class="tip">\
                                                      <img src="' + STATSFOO.TEAM_URL + playerDown.teamId + '.png" alt="" class="logo">换下球员 ' + time + "'" + '\
                                                  </div>\
                 ').end().find("#down-msg").html('<div class="player">' + playerUp.name + '</div>\
                                                  <div class="tip">\
                                                      <img src="' + STATSFOO.TEAM_URL + playerUp.teamId + '.png" alt="" class="logo">换上球员 ' + time + "'" + '\
                                                  </div>\
                 ').end().fadeIn().removeClass("exchange-anim").addClass("exchange-anim");
    }

    //文字动画
    function textShowAnim(text) {//str
        $("#anim-match-text").show().removeClass("text-anim").addClass("text-anim").text( text );
    }

    //下次事件开始之前再清除上次事件动画
    function hideAllEle() {
        $(".hide-all").hide();
        ctx.clearRect(0, 0, fooCanvas.width, fooCanvas.height);

        $("#anim-match-text").hide();//貌似第一行代码对它不起作用
    }

    STATSFOO.initLive();
})(STATSFOO, jQuery);