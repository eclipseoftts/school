/*
 * @Author: https://github.com/WangEn
 * @Author: https://gitee.com/lovetime/
 * @Date:   2018-01-01
 * @lastModify 2018-3-27 15:00:35
 * +----------------------------------------------------------------------
 * | Weadmin [ 后台管理模板 ]
 * | 基于Layui http://www.layui.com/
 * +----------------------------------------------------------------------
 */

layui.define(['jquery', 'form', 'layer', 'element'], function(exports) {
	var $ = layui.jquery,
		form = layui.form,
		layer = layui.layer,
		element = layui.element;
	var menu = [];
	var curMenu;

	/*
	 * @todo 初始化加载完成执行方法
	 * 打开或刷新后执行
	 */
	$(function() {
		/*
		 * @todo 读取本地存储中记录的已打开的tab项
		 * 刷新后，读取记录，打开原来已打开的tab项
		 */

		/*
		 * @todo table事件
		 */
		tableCheck = {
			init: function() {
				$(".layui-form-checkbox").click(function(event) {
					if($(this).hasClass('layui-form-checked')) {
						$(this).removeClass('layui-form-checked');
						if($(this).hasClass('header')) {
							$(".layui-form-checkbox").removeClass('layui-form-checked');
						}
					} else {
						$(this).addClass('layui-form-checked');
						if($(this).hasClass('header')) {
							$(".layui-form-checkbox").addClass('layui-form-checked');
						}
					}
				});
			},
			getData: function() {
				var obj = $(".layui-form-checked").not('.header');
				var arr = [];
				obj.each(function(index, el) {
					arr.push(obj.eq(index).attr('data-id'));
				});
				return arr;
			}
		}
		//开启表格多选
		tableCheck.init();
		//延时加载
		setTimeout(function() {
			if(sessionStorage.getItem("menu")) {
				/*menu = JSON.parse(sessionStorage.getItem("menu"));
				for(var i = 0; i < menu.length; i++) {
					tab.tabAdd(menu[i].title, menu[i].url, menu[i].id);
				} */
                return false;
			} else {
				return false;
			}
			if(sessionStorage.getItem("curMenu")) {
				$('.layui-tab-title').find('layui-this').removeClass('layui-class');
				curMenu = JSON.parse(sessionStorage.getItem("curMenu"));
				id = curMenu.id;
				if(id) { //因为默认桌面首页不存在lay-id,所以要对此判断
					$('.layui-tab-title li[lay-id="' + id + '"]').addClass('layui-this');
					tab.tabChange(id);
				} else {
					$(".layui-tab-title li").eq(0).addClass('layui-this'); //未生效
					$('.layui-tab-content iframe').eq(0).parent().addClass('layui-show');
				}
			} else {
				$(".layui-tab-title li").eq(0).addClass('layui-this'); //未生效
				$('.layui-tab-content iframe').eq(0).parent().addClass('layui-show');
			}
		}, 100);
		//点击tab标题时，触发reloadTab函数
		$('#tabNameStop').on('click','li',function(){
			reloadTab(this);
		});

		//初始化加载结束
	});

	/*
	 * @todo 左侧导航菜单的显示和隐藏
	 */
	$('.container .left_open i').click(function(event) {
		if($('.left-nav').css('left') == '0px') {
			//此处左侧菜单是显示状态，点击隐藏
			$('.left-nav').animate({
				left: '-201px'
			}, 100);
			$('.page-content').animate({
				left: '0px'
			}, 100);
			$('.page-content-bg').hide();
		} else {
			//此处左侧菜单是隐藏状态，点击显示
			$('.left-nav').animate({
				left: '0px'
			}, 100);
			$('.page-content').animate({
				left: '201px'
			}, 100);
			//点击显示后，判断屏幕宽度较小时显示遮罩背景
			if($(window).width() < 768) {
				$('.page-content-bg').show();
			}
		}
	});
	//点击遮罩背景，左侧菜单隐藏
	$('.page-content-bg').click(function(event) {
		$('.left-nav').animate({
			left: '-201px'
		}, 100);
		$('.page-content').animate({
			left: '0px'
		}, 100);
		$(this).hide();
	});

	/*
	 * @todo 左侧菜单事件
	 * 如果有子级就展开，没有就打开frame
	 */
	$('.left-nav #nav li').click(function(event) {
		if($(this).children('.sub-menu').length) {
			if($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).find('.nav_right').html('&#xe6b8;');
				$(this).children('.sub-menu').stop().slideUp();
				$(this).siblings().children('.sub-menu').slideUp();
			} else {
				$(this).addClass('open');
				$(this).children('a').find('.nav_right').html('&#xe652;');
				$(this).children('.sub-menu').stop().slideDown();
				$(this).siblings().children('.sub-menu').stop().slideUp();
				$(this).siblings().find('.nav_right').html('&#xe6b8;');
				$(this).siblings().removeClass('open');
				if($(this).children('a').hasClass('menu-click')){
					var url = $(this).children('a').attr('_href');
					var title = $(this).find('cite').html();
					var index = $('.left-nav #nav li').index($(this));

					for(var i = 0; i < $('.weIframe').length; i++) {
						if($('.weIframe').eq(i).attr('tab-id') == index + 1) {
							tab.tabChange(index + 1);
							event.stopPropagation();
							return;
						}
					};

					tab.tabAdd(title, url, index + 1);
					tab.tabChange(index + 1);
				}
			}
		} else {
			var url = $(this).children('a').attr('_href');
			var title = $(this).find('cite').html();
			var index = $('.left-nav #nav li').index($(this));

			for(var i = 0; i < $('.weIframe').length; i++) {
				if($('.weIframe').eq(i).attr('tab-id') == index + 1) {
					tab.tabChange(index + 1);
					event.stopPropagation();
					return;
				}
			};

			tab.tabAdd(title, url, index + 1);
			tab.tabChange(index + 1);
		}
		event.stopPropagation(); //不触发任何前辈元素上的事件处理函数
	});

	/*
	 * @todo tab触发事件：增加、删除、切换
	 */
	var tab = {
		tabAdd: function(title, url, id) {
			//判断当前id的元素是否存在于tab中
			var li = $("#WeTabTip li[lay-id=" + id + "]").length;
			if(li > 0) {
				//tab已经存在，直接切换到指定Tab项
				element.tabChange('wenav_tab', id); //切换到：用户管理
			} else {
				//该id不存在，新增一个Tab项
				element.tabAdd('wenav_tab', {
					title: title,
					content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="weIframe"></iframe>',
					id: id
				});
				//当前窗口内容
				setStorageMenu(title, url, id);

			}
			CustomRightClick(id); //绑定右键菜单
			FrameWH(); //计算框架高度

		},
		tabDelete: function(id) {
			element.tabDelete("wenav_tab", id); //删除
			removeStorageMenu(id);

		},
		tabChange: function(id) {
			//切换到指定Tab项
			element.tabChange('wenav_tab', id);
		},
		tabDeleteAll: function(ids) { //删除所有
			$.each(ids, function(i, item) {
				element.tabDelete("wenav_tab", item);
			})
			sessionStorage.removeItem('menu');
		}
	};

	/*
	 * @todo 监听右键事件,绑定右键菜单
	 * 先取消默认的右键事件，再绑定菜单，触发不同的点击事件
	 */
	function CustomRightClick(id) {
		//取消右键 
		$('.layui-tab-title li').on('contextmenu', function() {
			return false;
		})
		$('.layui-tab-title,.layui-tab-title li').on('click', function() {
			$('.rightMenu').hide();
		});
		//桌面点击右击 
		$('.layui-tab-title li').on('contextmenu', function(e) {
			var aid = $(this).attr("lay-id"); //获取右键时li的lay-id属性
			var popupmenu = $(".rightMenu");
			popupmenu.find("li").attr("data-id", aid);
			l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;
			t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;
			popupmenu.css({
				left: l,
				top: t
			}).show();
			//alert("右键菜单")
			return false;
		});
	}
	$("#rightMenu li").click(function() {
		var type = $(this).attr("data-type");
		var layId = $(this).attr("data-id")
		if(type == "current") {
			tab.tabDelete(layId);
		} else if(type == "all") {
			var tabtitle = $(".layui-tab-title li");
			var ids = new Array();
			$.each(tabtitle, function(i) {
				ids[i] = $(this).attr("lay-id");
			})
			tab.tabDeleteAll(ids);
		} else if(type == "fresh") {
			tab.tabChange($(this).attr("data-id"));
			var othis = $('.layui-tab-title').find('>li[lay-id="' + layId + '"]'),
				index = othis.parent().children('li').index(othis),
				parents = othis.parents('.layui-tab').eq(0),
				item = parents.children('.layui-tab-content').children('.layui-tab-item'),
				src = item.eq(index).find('iframe').attr("src");
			item.eq(index).find('iframe').attr("src", src);
		} else if(type == "other") {
			var thisId = layId;
			$('.layui-tab-title').find('li').each(function(i, o) {
				var layId = $(o).attr('lay-id');
				if(layId != thisId && layId != 0) {
					tab.tabDelete(layId);
				}
			});
		}
		$('.rightMenu').hide();
	});

	/*
	 * @todo 重新计算iframe高度
	 */
	function FrameWH() {
		$("iframe").css("height", "100%");
	}
	$(window).resize(function() {
		FrameWH();
	});

	/*
	 * @todo 弹出层，弹窗方法
	 * layui.use 加载layui.define 定义的模块，当外部 js 或 onclick调用 use 内部函数时，需要在 use 中定义 window 函数供外部引用
	 * http://blog.csdn.net/xcmonline/article/details/75647144 
	 */
	/*
	    参数解释：
	    title   标题
	    url     请求的url
	    id      需要操作的数据id
	    w       弹出层宽度（缺省调默认值）
	    h       弹出层高度（缺省调默认值）
	*/
	window.WeAdminShowBtn = function(title, url, w, h) {
		if(title == null || title == '') {
			title = false;
		};
		if(url == null || url == '') {
			url = "404.html";
		};
		if(w == null || w == '') {
			w = ($(window).width() * 0.9);
		};
		if(h == null || h == '') {
			h = ($(window).height() - 50);
		};
		layer.open({
			type: 2,
			area: [w + 'px', h + 'px'],
			fix: false, //不固定
			maxmin: true,
			shadeClose: true,
			shade: 0.4,
			title: title,
			content: url,
		    btn: ['确定', '取消'],
            btnAlign: 'c',
           yes: function(index, layero){
         var body = layer.getChildFrame('body', index); //得到iframe页面层的BODY
var iframeBtn = body.find('#dicSaveOrUpdate');//得到iframe页面层的提交按钮
iframeBtn.click();//模拟iframe页面层的提交按钮点击 
         },
	error: function(layero, index) {
alert("错误");
}
		});
	}
	//没有按钮
	window.WeAdminShow = function(title, url, w, h) {
		if(title == null || title == '') {
			title = false;
		};
		if(url == null || url == '') {
			url = "404.html";
		};
		if(w == null || w == '') {
			w = ($(window).width() * 0.9);
		};
		if(h == null || h == '') {
			h = ($(window).height() - 50);
		};
		layer.open({
			type: 2,
			area: [w + 'px', h + 'px'],
			fix: false, //不固定
			maxmin: true,
			shadeClose: true,
			shade: 0.4,
			title: title,
			content: url,
		});
	}
	/*弹出层+传递ID参数*/
	window.WeAdminEdit = function(title, url, id, w, h) {
		if(title == null || title == '') {
			title = false;
		};
		if(url == null || url == '') {
			url = "404.html";
		};
		if(w == null || w == '') {
			w = ($(window).width() * 0.9);
		};
		if(h == null || h == '') {
			h = ($(window).height() - 50);
		};
		layer.open({
			type: 2,
			area: [w + 'px', h + 'px'],
			fix: false, //不固定
			maxmin: true,
			shade: 0.4,
			title: title,
			content: url,
			success: function(layero, index) {
				//向iframe页的id=house的元素传值  // 参考 https://yq.aliyun.com/ziliao/133150
				var body = layer.getChildFrame('body', index);
				body.contents().find("#dataId").val(id);
			},
			error: function(layero, index) {
				//alert("aaa");
			}
		});
	}

/*第二中带确定按钮的*/
/*弹出层+传递ID参数*/
window.WeAdminEditBtn = function(title, url, id, w, h) {
if(title == null || title == '') {
title = false;
};
if(url == null || url == '') {
url = "404.html";
};
if(w == null || w == '') {
w = ($(window).width() * 0.9);
};
if(h == null || h == '') {
h = ($(window).height() - 50);
};
layer.open({
type: 2,
area: [w + 'px', h + 'px'],
fix: false, //不固定
maxmin: true,
shadeClose: true,
shade: 0.4,
title: title,
content: url,
btn: ['确定', '取消'],
btnAlign: 'c',
yes: function(index, layero){
var body = layer.getChildFrame('body', index); //得到iframe页面层的BODY
var iframeBtn = body.find('#dicSaveOrUpdate');//得到iframe页面层的提交按钮
//alert(iframeBtn);
iframeBtn.click();//模拟iframe页面层的提交按钮点击 
},
success: function(layero, index) {
//向iframe页的id=house的元素传值 // 参考 https://yq.aliyun.com/ziliao/133150
var body = layer.getChildFrame('body', index);
body.contents().find("#dataId").val(id);
},
error: function(layero, index) {
alert("错误");
}
});
}
	/**
	 *@todo tab监听：点击tab项对应的关闭按钮事件
	 */
	$('.layui-tab-close').click(function(event) {
		$('.layui-tab-title li').eq(0).find('i').remove();
	});
	/**
	 *@todo tab切换监听
	 * tab切换监听不能写字初始化加载$(function())方法内，否则不执行
	 */
	element.on('tab(wenav_tab)', function(data) {
		setStorageCurMenu();
	});
	/*
	 * @todo 监听layui Tab项的关闭按钮，改变本地存储
	 */
	element.on('tabDelete(wenav_tab)', function(data) {
		var layId = $(this).parent('li').attr('lay-id');
		removeStorageMenu(layId);
	});
	/**
	 *@todo 本地存储 localStorage
	 * 为了保持统一，将sessionStorage更换为存储周期更长的localStorage
	 */
	//本地存储记录所有打开的窗口
	function setStorageMenu(title, url, id) {
		var menu = JSON.parse(sessionStorage.getItem('menu'));
		if(menu) {
			var deep = false;
			for(var i = 0; i < menu.length; i++) {
				if(menu[i].id == id) {
					deep = true;
					menu[i].title = title;
					menu[i].url = url;
					menu[i].id = id;
				}
			}
			if(!deep) {
				menu.push({
					title: title,
					url: url,
					id: id
				})
			}
		} else {
			var menu = [{
				title: title,
				url: url,
				id: id
			}]
		}
		sessionStorage.setItem('menu', JSON.stringify(menu));
	}
	//本地存储记录当前打开窗口
	function setStorageCurMenu() {
		var curMenu = sessionStorage.getItem('curMenu');
		var text = $('.layui-tab-title').find('.layui-this').text();
		text = text.split('ဆ')[0];
		var url = $('.layui-tab-content').find('.layui-show').find('.weIframe').attr('src');
		var id = $('.layui-tab-title').find('.layui-this').attr('lay-id');
		curMenu = {
			title: text,
			url: url,
			id: id
		}
		sessionStorage.setItem('curMenu', JSON.stringify(curMenu));
	}
	//本地存储中移除删除的元素
	function removeStorageMenu(id) {
		var menu = JSON.parse(sessionStorage.getItem('menu'));
		//var curMenu = JSON.parse(localStorage.getItem('curMenu'));
		if(menu) {
			var deep = false;
			for(var i = 0; i < menu.length; i++) {
				if(menu[i].id == id) {
					deep = true;
					menu.splice(i, 1);
				}
			}
		} else {
			return false;
		}
		sessionStorage.setItem('menu', JSON.stringify(menu));
	}

	/**
	 *@todo 模拟登录
	 * 判断初次登录时，跳转到登录页
	 */
	var login = localStorage.getItem('login');
	$('.loginout').click(function() {
		login = 0;
		localStorage.setItem('login', login);
	});
	$('.loginin').click(function() {
		login = 1;
		localStorage.setItem('login', login);
	});
	
	/*
	 *Tab加载后刷新
	 * 判断是刷新后第一次点击时，刷新frame子页面
	 * */
	window.reloadTab = function(which){
		var len = $('.layui-tab-title').children('li').length;
		var layId = $(which).attr('lay-id');
		var i=1;	   
		if($(which).attr('data-bit')){
			return false; //判断页面打开后第一次点击，执行刷新
		}else{
			$(which).attr('data-bit',i);  	
			var frame = $('.weIframe[tab-id='+layId+']');
			frame.attr('src', frame.attr('src'));
			console.log("reload:"+$(which).attr('data-bit'));
		} 
    }
	/**
	 *@todo Frame内部的按钮点击打开其他frame的tab
	 */

	exports('admin', {});

    /*公共引用初始化，允许复制*/
    window.initCheckBox = function(){
        $(document).on("click", ".layui-table-body table.layui-table tbody tr", function (e) {
            if ($(e.target).hasClass("layui-table-col-special") || $(e.target).parent().hasClass("layui-table-col-special")) {
                return false;
            }
            var index = $(this).attr('data-index'), tableBox = $(this).closest('.layui-table-box'),
                tableFixed = tableBox.find(".layui-table-fixed.layui-table-fixed-l"),
                tableBody = tableBox.find(".layui-table-body.layui-table-main"),
                tableDiv = tableFixed.length ? tableFixed : tableBody,
                checkCell = tableDiv.find("tr[data-index=" + index + "]").find("td div.laytable-cell-checkbox div.layui-form-checkbox i"),
                radioCell = tableDiv.find("tr[data-index=" + index + "]").find("td div.laytable-cell-radio div.layui-form-radio i");
            if (checkCell.length) {
                checkCell.click();
            }
            if (radioCell.length) {
                radioCell.click();
            }
        });
        $(document).on("click", "td div.laytable-cell-checkbox div.layui-form-checkbox,td div.laytable-cell-radio div.layui-form-radio", function (e) {
            e.stopPropagation();
        });
    }
    //全屏
    $('.admin-side-full').on('click', function () {
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        layer.msg('按Esc即可退出全屏', {icon:0});
    });

    //清除缓存
    $(".clearCache").click(function(){
        window.sessionStorage.clear();
        window.localStorage.clear();
        var index = layer.msg('清除缓存中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("缓存清除成功！");
        },1000);
    })
    //公告
    $(".showNotice").click(function(){
        layer.open({
            type: 1,
            title: "系统公告", //不显示标题栏
            closeBtn: false,
            area: '310px',
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            btn: ['火速围观'],
            moveType: 1, //拖拽模式，0或者1
            content: '<div style="padding:15px 20px; text-align:justify; line-height: 22px; text-indent:2em;border-bottom:1px solid #e2e2e2;"><p>这是一个公告，可根据自己的要求修改，将会在后续版本增加公告管理。</p></div>',
            success: function(layero){
                var btn = layero.find('.layui-layer-btn');
                btn.css('text-align', 'center');
                btn.on("click",function(){
                    window.sessionStorage.setItem("showNotice","true");
                })
                if($(window).width() > 432){  //如果页面宽度不足以显示顶部“系统公告”按钮，则不提示
                    btn.on("click",function(){
                        layer.tips('系统公告躲在了这里', '#showNotice', {
                            tips: 3
                        });
                    })
                }
            }
        });

    })

    //退出
    $('#logout').on('click', function () {
        /* var url = path + '/login/logout.do';
         layer.confirm('退出登陆提示！', '你真的确定要退出系统吗？', url);*/
        window.location.href=path + '/login/logout.do';
    })
});