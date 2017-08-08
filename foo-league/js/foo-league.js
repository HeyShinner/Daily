(function() {
	var user = 1;// 用户标志
	var data = {
    	"Leagues": [{
				"Id": "38", 
				"Cn": "比甲", 
				"Initials": "B", 
				"Hot": null
			}, {
				"Id": "373", 
				"Cn": "巴西杯", 
				"Initials": "B", 
				"Hot": null
			}, {
				"Id": "325", 
				"Cn": "巴甲", 
				"Initials": "B", 
				"Hot": null
			}, {
				"Id": "217", 
				"Cn": "德国杯", 
				"Initials": "D", 
				"Hot": null
			}, {
				"Id": "35", 
				"Cn": "德甲", 
				"Initials": "D", 
				"Hot": "1"
			}, {
				"Id": "203", 
				"Cn": "俄超", 
				"Initials": "E", 
				"Hot": null
			}, {
				"Id": "34", 
				"Cn": "法甲", 
				"Initials": "F", 
				"Hot": "1"
			}, {
				"Id": "335", 
				"Cn": "法国杯", 
				"Initials": "F", 
				"Hot": null
			}, {
				"Id": "37", 
				"Cn": "荷甲", 
				"Initials": "H", 
				"Hot": null
			}, {
				"Id": "20", 
				"Cn": "挪超", 
				"Initials": "N", 
				"Hot": null
			}, {
				"Id": "1", 
				"Cn": "欧洲杯", 
				"Initials": "O", 
				"Hot": null
			}, {
				"Id": "7", 
				"Cn": "欧冠", 
				"Initials": "O", 
				"Hot": "1"
			}, {
				"Id": "238", 
				"Cn": "葡超", 
				"Initials": "P", 
				"Hot": null
			}, {
				"Id": "196", 
				"Cn": "日职", 
				"Initials": "R", 
				"Hot": "1"
			}, {
				"Id": "40", 
				"Cn": "瑞超", 
				"Initials": "R", 
				"Hot": null
			}, {
				"Id": "347", 
				"Cn": "苏足总杯", 
				"Initials": "S", 
				"Hot": null
			}, {
				"Id": "8", 
				"Cn": "西甲", 
				"Initials": "X", 
				"Hot": null
			}, {
				"Id": "463", 
				"Cn": "亚冠", 
				"Initials": "Y", 
				"Hot": "1"
			}, {
				"Id": "341", 
				"Cn": "意超杯", 
				"Initials": "Y", 
				"Hot": null
			}, {
				"Id": "17", 
				"Cn": "英超", 
				"Initials": "Y", 
				"Hot": "1"
			}, {
				"Id": "328", 
				"Cn": "意大利杯", 
				"Initials": "Y", 
				"Hot": null
			}, {
				"Id": "18", 
				"Cn": "英冠", 
				"Initials": "Y", 
				"Hot": null
			}, {
				"Id": "246", 
				"Cn": "亚洲杯", 
				"Initials": "Y", 
				"Hot": "1"
			}, {
				"Id": "23", 
				"Cn": "意甲", 
				"Initials": "Y", 
				"Hot": "1"
			}, {
				"Id": "28", 
				"Cn": "亚预赛", 
				"Initials": "Y", 
				"Hot": null
			}, {
				"Id": "19", 
				"Cn": "足总杯", 
				"Initials": "Z", 
				"Hot": null
			}, {
				"Id": "649", 
				"Cn": "中超", 
				"Initials": "Z", 
				"Hot": "1"
			}], 
		"Result": true
	};

	var hotArr = [],
		allArr = [],
		upperArr = [];

	// 过滤数组
	function filterArr(arr) {
		$(arr).each(function(index, ele) {
			if (ele["Hot"] === "1") {
				hotArr.push(ele);
			} else {
				allArr.push(ele);
			}

			upperArr.push(ele.Initials);
		});
	}
	filterArr(data.Leagues);


	// 大写首字母去重
    function getUniqueUpper(upperArr) {
        var json = {},
            newUpperArr = [];

        $(upperArr).each(function(index, ele) {
            json[ele] = ele;
		});
        for (var obj in json) {
            newUpperArr.push(obj);
        }
		return newUpperArr;
	}
	upperArr = getUniqueUpper(upperArr);


	// 渲染“我的赛事”
	function renderHotArr(hotArr, status) {// status: edit / ""
		$("#focus-list-wrap").empty();

		var hotHtml = '<ul class="focus-list" id="focus-list">';
		$(hotArr).each(function(index, ele) {
			var newStatus = ele.Cn === "FIFA" ? " root " + status : " " + status;
			hotHtml += '<li>\
                            <div data-id="' + ele.Id + '" data-upper="' + ele.Initials + '" class="list-item' + newStatus + '">' + ele.Cn + '</div>\
                        </li>';
		});
		$("#focus-list-wrap").html(hotHtml + "</ul>");
	}
	renderHotArr(hotArr, "");


	// 渲染“全部赛事”
	function renderAllArr(allArr) {
		var isSameUpper = "",// 用于判断是否为同一个首字母
			leagueHtml = "";// 每个联赛html

		$(allArr).each(function(index, ele) {
			var Initials = ele.Initials;
			if (isSameUpper !== Initials) {
				leagueHtml += '</ol></div>\
							   <div data-upper="' + Initials + '" class="total-list">\
							       <h5>' + Initials + '</h5>\
								   <ol>';
			}

			leagueHtml += '<li data-id="' + ele.Id + '" data-upper="' + Initials + '" class="t-l-item">' + ele.Cn + '</li>';
			isSameUpper = Initials;
		});

		$("#total-list-wrap").html(leagueHtml.substring(11) + "</ol></div>");
	}
	renderAllArr(allArr);


	// 渲染通讯录
	function renderUpperArr(upperArr) {
		var upperHtml = "";
		$(upperArr).each(function(index, ele) {
			upperHtml += '<li data-upper="' + ele + '" class="i-item"><a href="javascript:;">' + ele + '</a></li>';
		});

		$("#m-upper").html(upperHtml);
	}
	renderUpperArr(upperArr);


    // 切换联赛选择面板状态
    $("#m-list-link").click(function() {
        toggleLeaguePanel();
    });
    $("#header-btn-back").click(function() {
        toggleLeaguePanel();
	});
	// 显示、隐藏联赛选择面板
    function toggleLeaguePanel() {
        $("#m-league-wrap").toggleClass("active");
        $("#m-upper-wrap").toggleClass("active");
	}
	

    // 切换编辑、保存状态
    $("#focus-btn-edit").click(function() {
		if (user === null) {
			alert("您还未登录！");
			return;
		}

        if ($(this).hasClass("is-edit")) {
			$("#focus-list-wrap .list-item").addClass("edit");
			$("#focus-list-wrap").find(".root").removeClass("edit");
			$(this).text("保存").removeClass("is-edit").addClass("is-save");
			$("#focus-edit-tip").show();
			
			initDragEle();
        } else {
			$("#focus-list-wrap .list-item").removeClass("edit");
			$(this).text("编辑").removeClass("is-save").addClass("is-edit");
			$("#focus-edit-tip").hide();

			renderHotArr(hotArr);
        }
	});
	

	// 用户已登录：点击“所有赛事”中一项添加到“我的赛事”；未登录：不允许添加
    $("#total-list-wrap").find(".t-l-item").on("click", function() {
		if (user === null) {
			return;
		}
        allLeagueClick($(this));
	});	
	// 点击“全部赛事”任意一项
    function allLeagueClick(targetObj) {
		var status = $("#focus-btn-edit").hasClass("is-edit") ? "" : "edit";
		addLeagueToMine(targetObj, status);
	}	
	// 从“所有赛事”中移除一项，添加到“我的赛事”中
    function addLeagueToMine(targetObj, status) {// status: "edit" / ""
        var obj = $(targetObj),
            dataId = obj.data("id"),
            upper = obj.data("upper"),
            text = obj.text();

		obj.remove();
		
		// 添加到hotArr数组中，重新渲染
		hotArr.push({
			"Id": dataId,
			"Cn": text,
			"Initials": upper,
			"Hot": 1
		});
		renderHotArr(hotArr, status);
		if (status === "edit") {
			initDragEle();
		}
	}


    // 点击“我的赛事”任意一项：编辑状态（跳转到主页面）；保存状态（删除并且还原到“全部赛事中”）
    function myLeagueClick(targetObj) {
        var status = $("#focus-btn-edit").hasClass("is-edit") ? true : false;// true：编辑状态

        if (status) {
            // 编辑状态
        } else {
			// 保存状态
            delLeagueFromMine(targetObj);
        }
	}	
	// 从“我的赛事”中移除一项，回到“全部赛事”
    function delLeagueFromMine(targetObj) {
        if ($(targetObj).hasClass("root")) {
            // FIFA不能被删除
            return;
        } else {
            var obj = $(targetObj),
                dataId = obj.data("id"),
                upper = obj.data("upper"),
                text = obj.text();
            
			// 删掉hotArr中对应的项，重新渲染
			$(hotArr).each(function(index, ele) {
				if (ele.Id == dataId) {
					hotArr.splice(index, 1);
				}
			});

			renderHotArr(hotArr, "edit");
			initDragEle();

            var targetPaObj = $("#total-list-wrap").find(".total-list[data-upper=" + upper + "]").find("ol"),
                appendHtml = '<li data-id="' + dataId + '" data-upper="' + upper + '" class="t-l-item">' + text + '</li>';
            $(appendHtml).appendTo($(targetPaObj));

            $(targetPaObj).find(".t-l-item:last").on("click", function() {
                allLeagueClick($(this));
            });
        }
    }


    // 点击“保存”、“关闭按钮”发送数据后端
    function postDataToEnd() {

    }


	// 类微信通讯录功能
    $("#m-upper-wrap").find(".i-item").on("click", function() {
        $("#m-upper-wrap").find(".i-item").removeClass("active");
        $(this).addClass("active");

        stickUpUpper($(this).data("upper"));
	});
    // 类“微信通讯录”定位功能
    function stickUpUpper(upper) {// "A" or "B" or ...
        var targetUpper = $("#total-list-wrap").find(".total-list[data-upper=" + upper + "]"),
            offsetTop = $(targetUpper).position().top;

        $("html, body").scrollTop(offsetTop);
    }
    // 滑动高亮对应字母
    $(window).scroll(function() {
        var top = $(document).scrollTop(),
            items = $("#total-list-wrap").find(".t-l-item"),
            currUpper = "",
            upperWrap = $("#m-upper-wrap");

        items.each(function(index, ele) {
            if (top > $(ele).position().top - 100) {
                currUpper = $(ele).data("upper");
            } else {
                return;
            }
        });

        if (currUpper !== "") {
            upperWrap.find(".i-item").removeClass("active");
            upperWrap.find(".i-item[data-upper=" + currUpper + "]").addClass("active");
        }
    });


    function _m_device() {
	    var _ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(_ua)) {
			return "iOS";		
		} else if (/android/.test(_ua)) {
			return "android";	
		} else {
			return "pc";
		}
	}
	function _m_get_x(ev) {
		if ('pc' == _m_device()) {
			return ev.clientX;
		} else {
			return ev.touches[0].pageX	
		}
	}
	function _m_get_y(ev) {
		if ('pc' == _m_device()) {
			return ev.clientY;
		} else {
			return ev.touches[0].pageY	
		}
	}
	function Pointer(x, y) {
		this.x = x;
		this.y = y;
	}
	function Position(left, top) {
		this.left = left;
		this.top = top;
	}
	function initDragEle() {
		$("#focus-list-wrap .list-item").each(function(i) {
			// 初始化：根据父盒子li位置定位拖动div
			this.init = function() {
				this.box = $(this).parent();
				$(this).attr("index", i).css({
					position: "absolute",
					left: this.box.offset().left,
					top: this.box.offset().top
				}).appendTo("#focus-list-wrap");
				this.drag();
			},
			// 移动：动画效果
			this.move = function(callback) {
				$(this).stop(true).animate({
					left: this.box.offset().left,
					top: this.box.offset().top
				}, 500, function() {
					if (callback) {
						callback.call(this);
					}
				});
			},
			// 碰撞检测
			this.collisionCheck = function() {
				var currentItem = this,
					direction = null;
				$(this).siblings(".list-item").each(function() {
					if (// 越界：this.box代表当前遍历元素的父盒子li
						currentItem.pointer.x > this.box.offset().left &&
						currentItem.pointer.y > this.box.offset().top &&
						(currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
						(currentItem.pointer.y < this.box.offset().top + this.box.height())
					) {
						// 返回对象和方向：currentItem.box代表父盒子li
						if (currentItem.box.offset().top < this.box.offset().top) {
							direction = "down";
						} else if (currentItem.box.offset().top > this.box.offset().top) {
							direction = "up";
						} else {
							direction = "normal";
						}
						this.swap(currentItem, direction);
					}
				});
			},
			// 交换位置
			this.swap = function(currentItem, direction) {
				var directions = {
					normal: function() {
						var saveBox = this.box;
						this.box = currentItem.box;
						currentItem.box = saveBox;
						this.move();
						$(this).attr("index", this.box.index());
						$(currentItem).attr("index", currentItem.box.index());
					},
					down: function() {
						// 移到下方
						var box = this.box,
							node = this,
							startIndex = currentItem.box.index(),
							endIndex = node.box.index();

						for (var i = endIndex; i > startIndex; i--) {
							var prevNode = $("#focus-list-wrap .list-item[index="+ (i - 1) +"]")[0];
							node.box = prevNode.box;
							$(node).attr("index", node.box.index());
							node.move();
							node = prevNode;
						}
						currentItem.box = box;
						$(currentItem).attr("index", box.index());
					},
					up: function() {
						// 移到上方
						var box = this.box,
							node = this,
							startIndex = node.box.index(),
							endIndex = currentItem.box.index();

						for (var i = startIndex; i < endIndex; i++) {
							var nextNode = $("#focus-list-wrap .list-item[index="+ (i + 1) +"]")[0];
							node.box = nextNode.box;
							$(node).attr("index", node.box.index());
							node.move();
							node = nextNode;
						}
						currentItem.box = box;
						$(currentItem).attr("index", box.index());
					}
				}
				directions[direction].call(this);
			},
			// 拖拽
			this.drag = function() {
				var oldPosition = new Position(),
					oldPointer = new Pointer(),
					isDrag = false,
					currentItem = null;

				var _down_event_name = null,
					_move_event_name = null,
					_end_event_name = null;

				if ('pc' == _m_device()) {
					_down_event_name = 'mousedown';
					_move_event_name = 'mousemove';
					_end_event_name = 'mouseup';
				} else {
					_down_event_name = 'touchstart';
					_move_event_name = 'touchmove';
					_end_event_name = 'touchend';
				}

				//长按拖动排序/点击（短按）删除“我的赛事”其中一项
				var timer = null,
					self = this,
					flag = false;//对此元素是进行点击删除操作还是拖动操作
				self.addEventListener(_down_event_name, function(e) {
					var eObj = e;
					timer = setTimeout(function() {
						eObj.preventDefault();
						oldPosition.left = $(self).position().left;
						oldPosition.top =  $(self).position().top;
						oldPointer.x = _m_get_x(eObj);
						oldPointer.y = _m_get_y(eObj);
						isDrag = true;
						currentItem = self;
						flag = true;
					}, 800);
				});
				self.addEventListener(_end_event_name, function(e) {
					clearTimeout(timer);

					if (!flag) {
						myLeagueClick($(self));
					}
				});
				$("#focus-list-wrap").on(_move_event_name, function(e) {
					var currentPointer = new Pointer(_m_get_x(event || e), _m_get_y(event || e));
					if (!isDrag) return false;
					$(currentItem).css({
						"opacity": "0.8",
						"z-index": 999
					});
					var left = currentPointer.x - oldPointer.x + oldPosition.left;
					var top = currentPointer.y - oldPointer.y + oldPosition.top;
					$(currentItem).css({
						left: left,
						top: top
					});
					currentItem.pointer = currentPointer;
					
					// 开始交换位置		
					currentItem.collisionCheck();				
				});
				$("#focus-list-wrap").on(_end_event_name, function() {
					if (!isDrag) return false;
					isDrag = false;
					currentItem.move(function() {
						$(this).css({
							"opacity": "1",
							"z-index": 0
						});
					});
					upHotArrAfterDrag();
				});
			}
			this.init();
		});
	}
	//拖动排序后更新hotArr
	function upHotArrAfterDrag() {
		$("#focus-list-wrap .list-item").each(function(index, ele) {
			var eleObj = $(ele),
				dataId = eleObj.data("id"),
				upper = eleObj.data("upper"),
				text = eleObj.text(),
				index = parseInt( eleObj.attr("index") );

			hotArr[index] = {
				"Id": dataId,
				"Cn": text,
				"Initials": upper,
				"Hot": 1
			};
		});
	}
})();