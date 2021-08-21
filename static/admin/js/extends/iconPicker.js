
layui.define(['laypage', 'form'], function (exports) {
    "use strict";

    var IconPicker =function () {
            this.v = '0.1.beta';
        }, _MOD = 'iconPicker',
        _this = this,
        $ = layui.jquery,
        laypage = layui.laypage,
        form = layui.form,
        BODY = 'body',
        TIPS = '请选择图标';

    /**
     * 渲染组件
     */
    IconPicker.prototype.render = function(options){
        var opts = options,
            // DOM选择器
            elem = opts.elem,
            // 数据类型：fontClass/unicode
            type = opts.type == null ? 'fontClass' : opts.type,
            // 是否分页：true/false
            page = opts.page,
            // 每页显示数量
            limit = limit == null ? 12 : opts.limit,
            // 是否开启搜索：true/false
            search = opts.search == null ? true : opts.search,
            // 点击回调
            click = opts.click,
            // json数据
            data = {},
            // 唯一标识
            tmp = new Date().getTime(),
            // 是否使用的class数据
            isFontClass = opts.type === 'fontClass',
            TITLE = 'layui-select-title',
            TITLE_ID = 'layui-select-title-' + tmp,
            ICON_BODY = 'layui-iconpicker-' + tmp,
            PICKER_BODY = 'layui-iconpicker-body-' + tmp,
            PAGE_ID = 'layui-iconpicker-page-' + tmp,
            LIST_BOX = 'layui-iconpicker-list-box',
            selected = 'layui-form-selected',
            unselect = 'layui-unselect';

        var a = {
            init: function () {
                data = common.getData[type]();

                a.hideElem().createSelect().createBody().toggleSelect();
                common.loadCss();
                return a;
            },
            /**
             * 隐藏elem
             */
            hideElem: function () {
                $(elem).hide();
                return a;
            },
            /**
             * 绘制select下拉选择框
             */
            createSelect: function () {
                var selectHtml = '<div class="layui-iconpicker layui-unselect layui-form-select" id="'+ ICON_BODY +'">' +
                    '<div class="'+ TITLE +'" id="'+ TITLE_ID +'">' +
                    '<div class="layui-iconpicker-item">'+
                    '<span class="layui-iconpicker-icon layui-unselect">' +
                    '<i class="iconfont">&#xe6e9;</i>' +
                    '</span>'+
                    '<i class="layui-edge"></i>' +
                    '</div>'+
                    '</div>' +
                    '<div class="layui-anim layui-anim-upbit" style="">' +
                    '123' +
                    '</div>';
                $(elem).after(selectHtml);
                return a;
            },
            /**
             * 展开/折叠下拉框
             */
            toggleSelect: function () {
                var item = '#' + TITLE_ID + ' .layui-iconpicker-item,#' + TITLE_ID + ' .layui-iconpicker-item .layui-edge';
                a.event('click', item, function (e) {
                    var $icon = $('#' + ICON_BODY);
                    if ($icon.hasClass(selected)) {
                        $icon.removeClass(selected).addClass(unselect);
                    } else {
                        $icon.addClass(selected).removeClass(unselect);
                    }
                    e.stopPropagation();
                });
                return a;
            },
            /**
             * 绘制主体部分
             */
            createBody: function () {
                // 获取数据
                var searchHtml = '';

                if (search) {
                    searchHtml = '<div class="layui-iconpicker-search">' +
                        '<input class="layui-input">' +
                        '<i class="iconfont">&#xe6e9;</i>' +
                        '</div>';
                }

                // 组合dom
                var bodyHtml = '<div class="layui-iconpicker-body" id="'+ PICKER_BODY +'">' +
                    searchHtml +
                    '<div class="'+ LIST_BOX +'"></div> '+
                    '</div>';
                $('#' + ICON_BODY).find('.layui-anim').eq(0).html(bodyHtml);
                a.search().createList().check().page();

                return a;
            },
            /**
             * 绘制图标列表
             * @param text 模糊查询关键字
             * @returns {string}
             */
            createList: function (text) {
                var d = data,
                    l = d.length,
                    pageHtml = '',
                    listHtml = $('<div class="layui-iconpicker-list">')//'<div class="layui-iconpicker-list">';

                // 计算分页数据
                var _limit = limit, // 每页显示数量
                    _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1), // 总计多少页
                    _id = PAGE_ID;

                // 图标列表
                var icons = [];

                for (var i = 0; i < l; i++) {
                    var obj = d[i];

                    // 判断是否模糊查询
                    if (text && obj.indexOf(text) === -1) {
                        continue;
                    }

                    // 每个图标dom
                    var icon = '<div class="layui-iconpicker-icon-item" title="'+ obj +'">';
                    if (isFontClass){
                        icon += '<i class="iconfont '+ obj +'"></i>';
                    } else {
                        icon += '<i class="iconfont">'+ obj.replace('amp;', '') +'</i>';
                    }
                    icon += '</div>';

                    icons.push(icon);
                }

                // 查询出图标后再分页
                l = icons.length;
                _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1);
                for (var i = 0; i < _pages; i++) {
                    // 按limit分块
                    var lm = $('<div class="layui-iconpicker-icon-limit" id="layui-iconpicker-icon-limit-'+ (i+1) +'">');

                    for (var j = i * _limit; j < (i+1) * _limit && j < l; j++) {
                        lm.append(icons[j]);
                    }

                    listHtml.append(lm);
                }

                // 无数据
                if (l === 0) {
                    listHtml.append('<p class="layui-iconpicker-tips">无数据</p>');
                }

                // 判断是否分页
                if (page){
                    $('#' + PICKER_BODY).addClass('layui-iconpicker-body-page');
                    pageHtml = '<div class="layui-iconpicker-page" id="'+ PAGE_ID +'">' +
                        '<div class="layui-iconpicker-page-count">' +
                        '<span id="'+ PAGE_ID +'-current">1</span>/' +
                        '<span id="'+ PAGE_ID +'-pages">'+ _pages +'</span>' +
                        ' (<span id="'+ PAGE_ID +'-length">'+ l +'</span>)' +
                        '</div>' +
                        '<div class="layui-iconpicker-page-operate">' +
                        '<i class="iconfont" id="'+ PAGE_ID +'-prev" data-index="0" prev>&#xe6b8;</i> ' +
                        '<i class="iconfont" id="'+ PAGE_ID +'-next" data-index="2" next>&#xe6c8;</i> ' +
                        '</div>' +
                        '</div>';
                }


                $('#' + ICON_BODY).find('.layui-anim').find('.' + LIST_BOX).html('').append(listHtml).append(pageHtml);
                return a;
            },
            // 分页
            page: function () {
                var icon = '#' + PAGE_ID + ' .layui-iconpicker-page-operate .iconfont';

                $(icon).unbind('click');
                a.event('click', icon, function (e) {
                    var elem = e.currentTarget,
                        total = parseInt($('#' +PAGE_ID + '-pages').html()),
                        isPrev = $(elem).attr('prev') !== undefined,
                        // 按钮上标的页码
                        index = parseInt($(elem).attr('data-index')),
                        $cur = $('#' +PAGE_ID + '-current'),
                        // 点击时正在显示的页码
                        current = parseInt($cur.html());

                    // 分页数据
                    if (isPrev && current > 1) {
                        current=current-1;
                        $(icon + '[prev]').attr('data-index', current);
                    } else if (!isPrev && current < total){
                        current=current+1;
                        $(icon + '[next]').attr('data-index', current);
                    }
                    $cur.html(current);

                    // 图标数据
                    $('.layui-iconpicker-icon-limit').hide();
                    $('#layui-iconpicker-icon-limit-' + current).show();
                    e.stopPropagation();
                });
                return a;
            },
            /**
             * 搜索
             */
            search: function () {
                var item = '#' + PICKER_BODY + ' .layui-iconpicker-search .layui-input';
                a.event('input propertychange', item, function (e) {
                    var elem = e.target,
                        t = $(elem).val();
                    a.createList(t);
                });
                a.event('click', item, function (e) {
                    e.stopPropagation();
                });
                return a;
            },
            /**
             * 点击选中图标
             */
            check: function () {
                var item = '#' + PICKER_BODY + ' .layui-iconpicker-icon-item';
                a.event('click', item, function (e) {
                    var el = $(e.currentTarget).find('.iconfont'),
                        icon = '';
                    if (isFontClass) {
                        var clsArr = el.attr('class').split(/[\s\n]/),
                            cls = clsArr[1],
                            icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconpicker-item .iconfont').html('').attr('class', clsArr.join(' '));
                    } else {
                        var cls = el.html(),
                            icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconpicker-item .iconfont').html(icon);
                    }

                    $('#' + ICON_BODY).removeClass(selected).addClass(unselect);
                    $(elem).attr('value', icon);
                    // 回调
                    if (click) {
                        click({
                            icon: icon
                        });
                    }

                });
                return a;
            },
            event: function (evt, el, fn) {
                $(BODY).on(evt, el, fn);
            }
        };

        var common = {
            /**
             * 加载样式表
             */
            loadCss: function () {
                var css = '.layui-iconpicker {max-width: 280px;}.layui-iconpicker .layui-anim{display:none;position:absolute;left:0;top:42px;padding:5px 0;z-index:899;min-width:100%;border:1px solid #d2d2d2;max-height:300px;overflow-y:auto;background-color:#fff;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,.12);box-sizing:border-box;}.layui-iconpicker-item{border:1px solid #e6e6e6;width:90px;height:38px;border-radius:4px;cursor:pointer;position:relative;}.layui-iconpicker-icon{border-right:1px solid #e6e6e6;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;width:60px;height:100%;float:left;text-align:center;background:#fff;transition:all .3s;}.layui-iconpicker-icon i{line-height:38px;font-size:18px;}.layui-iconpicker-item > .layui-edge{left:70px;}.layui-iconpicker-item:hover{border-color:#D2D2D2!important;}.layui-iconpicker-item:hover .layui-iconpicker-icon{border-color:#D2D2D2!important;}.layui-iconpicker.layui-form-selected .layui-anim{display:block;}.layui-iconpicker-body{padding:6px;}.layui-iconpicker .layui-iconpicker-list{background-color:#fff;border:1px solid #ccc;border-radius:4px;}.layui-iconpicker .layui-iconpicker-icon-item{display:inline-block;width:21.1%;line-height:36px;text-align:center;cursor:pointer;vertical-align:top;height:36px;margin:4px;border:1px solid #ddd;border-radius:2px;transition:300ms;}.layui-iconpicker .layui-iconpicker-icon-item i.layui-icon{font-size:17px;}.layui-iconpicker .layui-iconpicker-icon-item:hover{background-color:#eee;border-color:#ccc;-webkit-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;-moz-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;box-shadow:0 0 2px #aaa,0 0 2px #fff inset;text-shadow:0 0 1px #fff;}.layui-iconpicker-search{position:relative;margin:0 0 6px 0;border:1px solid #e6e6e6;border-radius:2px;transition:300ms;}.layui-iconpicker-search:hover{border-color:#D2D2D2!important;}.layui-iconpicker-search .layui-input{cursor:text;display:inline-block;width:86%;border:none;padding-right:0;margin-top:1px;}.layui-iconpicker-search .layui-icon{position:absolute;top:11px;right:4%;}.layui-iconpicker-tips{text-align:center;padding:8px 0;cursor:not-allowed;}.layui-iconpicker-page{margin-top:6px;margin-bottom:-6px;font-size:12px;padding:0 2px;}.layui-iconpicker-page-count{display:inline-block;}.layui-iconpicker-page-operate{display:inline-block;float:right;cursor:default;}.layui-iconpicker-page-operate .layui-icon{font-size:12px;cursor:pointer;}.layui-iconpicker-body-page .layui-iconpicker-icon-limit{display:none;}.layui-iconpicker-body-page .layui-iconpicker-icon-limit:first-child{display:block;}';
                $('head').append('<style rel="stylesheet">'+css+'</style>');
            },
            /**
             * 获取数据
             */
            getData: {
                fontClass: function () {

                    var arr = [
                        "gysguanli","gongyingshang","icon-payment","tuihui","xinzeng","zizhirenzheng","baocun","wenjiandaochu","wenjiandaoru",
                        "xiaoduguanli","shenhe","bumenguanli","fukuanguanli","rukudengji","chukudengji","chaxun","cangkumingcheng","caigoudingdan",
                        "churukuguanli","qitaruku","qitachuku","kuacangyiku","piliangyiku","chengbenguanli","jichuzidian","fukuanshenhe","ziyuanguanli",
                        "fuzhi","yonghuguanli","jiecun","fanjiecun","keshiguanli","dengji","jiliangdanwei","gysdangan","ico_print",
                        "caigouguanli","baobiaoguanli","jichengziduan","wuzicangku","wuzifenlei","hexiao","cangkupancun","yuejiexinxi","yujingguanli",
                        "yizhuguanli","xitongcanshupeizhi","chukuguanli","zidianguanli","ico_wupinguanli_erjikufangrijichaxun","fukuanqueren","shenhebutongguo","shenqing","rukuguanli",
                        "wuziguanli","kucunguanli","zhengjianleixing","changshangguanli","qijianhecha","keshikucunguanli","pinzhong","gonggaoguanli","jiaoseguanli",
                        "zidingyi","pinyin","yiyongcailiao","zidian","zuofei","renliziyuan","piliangxiugai","peitaohuodong","chushihua",
                        "fasong","cangkushangguanli","jixiaoguanli","fuzhushezhi","cangkubaobiao","shanchu","bianhaodanhao","yewuzu","tongguo",
                        "nav-right","xiugai","cangkuguanli","shujutongbu","xitongguanli","cangkupeizhi","daiguankucun","cangkukucun","shujujiekou",
                        "chengbenguanli","dashujucunchu","saomiaofukuan","fukuan","saomakuang","goudui","jiekoutiaoyongzhihang","saoma","xitongzengsong","kucunchaxun","fanshen",
                        "biaoqiandayin","kcpdd","yiku","yiruwenjianjia","yichuwenjianjia","clckd","xinjian","piliangdaoru","chongxiao","piliangshanchu","piliangtianjia",
                        "fanjiezhang","jiezhang","jiesuanqueren","fanshenhe","merge","caigoudingdanguanli","cghztj","shengou","eduguanli","kuaijietongdao","xiangmu",
                        "xiangmu1","yizhuzhihang","qitakeshi","caigouyuan","image","yonghupeizhi","moban","guanbi","gonggaoxinxi","fabugonggao","gonggaoguanli1",
                        "jixiaojiangjin","KPIguanli","zhichu","shourusel","fuwuguanli","zhuzhuangtu","icon-test","lizhi","hetongguanli","zaizhi","caozuorizhi"
                    ];
                    return arr;
                },
                unicode: function () {
                    return [
                        "&#xe68b;","&#xe672;","&#xe647;","&#xe628;","&#xe623;","&#xe67a;","&#xe649;","&#xe6a3;","&#xe6a2;",
                        "&#xe635;","&#xe7c2;","&#xe66e;","&#xe65a;","&#xe626;","&#xe61d;","&#xe632;","&#xe61e;","&#xe630;",
                        "&#xe715;","&#xe614;","&#xe613;","&#xe612;","&#xe607;","&#xe619;","&#xe60c;","&#xe629;","&#xe65d;",
                        "&#xe775;","&#xe63b;","&#xe6b6;","&#xe6b5;","&#xe65b;","&#xe605;","&#xe674;","&#xe64d;","&#xe664;",
                        "&#xe622;","&#xe618;","&#xe787;","&#xe779;","&#xe608;","&#xe66d;","&#xe65c;","&#xe620;","&#xe606;",
                        "&#xe668;","&#xe61f;","&#xe631;","&#xe624;","&#xe86e;","&#xe62a;","&#xe64e;","&#xe634;","&#xe627;",
                        "&#xe7eb;","&#xe6c2;","&#xe68a","&#xe60b;","&#xe60e;","&#xe60a;","&#xeb22;","&#xe625;","&#xe70f;",
                        "&#xe6e9;","&#xe60d;","&#xe62d;","&#xe83a;","&#xe63a;","&#xe61a;","&#xe600;","&#xe610;","&#xe62c;",
                        "&#xe65e;","&#xe6cd;","&#xe642;","&#xe688;","&#xe684;","&#xe615;","&#xe690;","&#xe603;","&#xe66c;",
                        "&#xe760;","&#xe611;","&#xe604;","&#xe616;","&#xe617;","&#xe609;","&#xe64b;","&#xe633;","&#xe60f;",
                        "&#xe62b;","&#xe65f;","&#xe6c4;","&#xe650;","&#xe64f;","&#xe665;","&#xe64c;","&#xe646;","&#xe644;","&#xe643;","&#xe662;",
                        "&#xe641;","&#xe661;","&#xe640;","&#xe648;","&#xe64a;","&#xe658;","&#xe63f;","&#xe6fd;","&#xe655;","&#xe73a;","&#xe6b7;",
                        "&#xe687;","&#xe63c;","&#xe639;","&#xe602;","&#xe6a1;","&#xe645;","&#xe651;","&#xe695","&#xe638;","&#xe654;","&#xe63d;",
                        "&#xe637;","&#xe63e;","&#xe670;","&#xe636;","&#xe621;","&#xe660;","&#xe69e;","&#xe66f;","&#xe6bd;","&#xe61c;","&#xe62f;",
                        "&#xe62e;","&#xe703;","&#xe666;","&#xe66b;","&#xeaca;","&#xe61b;","&#xe601;","&#xe6bb;","&#xe6a4;","&#xe659;","&#xe669;"
                    ];
                }
            }
        };

        a.init();
        return new IconPicker();
    };

    /**
     * 选中图标
     * @param filter lay-filter
     * @param iconName 图标名称，自动识别fontClass/unicode
     */
    IconPicker.prototype.checkIcon = function (filter, iconName){
        var p = $('*[lay-filter='+ filter +']').next().find('.layui-iconpicker-item .iconfont'),
            c = iconName;

        if (c.indexOf('#xe') > 0){
            p.html(c);
        } else {
            p.html('').attr('class', 'iconfont ' + c);
        }
    };

    var iconPicker = new IconPicker();
    exports(_MOD, iconPicker);
});