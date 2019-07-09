
/**
 * 模块向map主界面添加dom元素
 */
var append_AirQualityHour = {
    /**
     * 添加dom元素（监测类型切换，时间轴，分析开关）.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    append: function (callback) {
        var _this = this;
        utils.htmlOperate.getHtml("Panel/AirQualityHour/append/append.html", function (html) {
            $('#timecontainer').remove();
            $('.areaSearch').remove();
            $('body').append(html);

            _this.bind();

            if (callback) {
                callback();
            }
        })
    },

    /**
     * 绑定事件.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    bind: function () {
        //监测类型切换
        $(".areaSearch > ul li").click(function (e) {
            $(this).addClass('aqiactive');
            $(this).addClass('aqiactive').siblings().removeClass('aqiactive');
            document.getElementById('iframe_AirQualityHour').contentWindow.setMonitorTypeObject(e.target.innerText);
        });

        $('.areaSearch select').change(function (e) {
            var type = $(this).find('option:selected').val();
            document.getElementById('iframe_AirQualityHour').contentWindow.setStationType(type);
        });


        //时间轴默认数据
        var html = '<ul class="loadbar"><li><div class="bar"></div><span>03</span></li><li><div class="bar"></div><span>06</span></li><li><div class="bar"></div><span>09</span></li><li><div class="bar"></div><span>12</span></li><li><div class="bar"></div><span>15</span></li><li><div class="bar"></div><span>18</span></li><li><div class="bar"></div><span>21</span></li><li><div class="bar"></div></li><div class="content"><div class="time"></div><div id="date1" class="date">2018-01-01(星期一)</div></div></ul>';
        for (var i = 0; i < 6; i++) {
            html += '<ul class="loadbar"><li><div class="bar"></div><span>03</span></li><li><div class="bar"></div><span>06</span></li><li><div class="bar"></div><span>09</span></li><li><div class="bar"></div><span>12</span></li><li><div class="bar"></div><span>15</span></li><li><div class="bar"></div><span>18</span></li><li><div class="bar"></div><span>21</span></li><li><div class="bar"></div></li><div class="content"><div class="time"></div><div id="date1" class="date">2018-01-01(星期一)</div></div></ul>'
        }
        $('#timezhou').append(html);
        var windowWidth = $(window).width();
        var liWidth = Math.floor((windowWidth - 80) / 56);
        $('#timecontainer li').width(liWidth);

        //循环播放
        $(".triggerBar").click(function () {
            turn1 = !turn1;
            if (turn1) {
                $(".triggerBar img").attr("src", "Panel/AirQualityHour/append/img/timestop.png");
                $('.leftmenus li').attr('disabled', "true");
                intervalometer();
                if (jspanel) {
                    jspanel.close();
                }
            }
            else {
                clearInterval(timer);
                $(".triggerBar img").attr("src", "Panel/AirQualityHour/append/img/time.png");
                $('.leftmenus li').removeAttr('disabled');
                //$('.leftmenus li').bind('click');
            }
        });

        //风场控制开关
        $('.rightYj .fc').click(function () {
            if (!fcTurn) {
                $(this).addClass('active');
                if (map.getLayer("windyLayer")) {
                    map.getLayer("windyLayer").show(); //显示风场
                }
            }
            else {
                $(this).removeClass('active');
                if (map.getLayer("windyLayer")) {
                    map.getLayer("windyLayer").hide(); //隐藏风场
                }
            }
            fcTurn = !fcTurn;
        });

        //等值线开关控制
        $('.rightYj .dzx').click(function () {
            var qyLayerId = "contour_" + $(".areaSearch li.aqiactive span").text() + "_imgLayer";
            if (!dzxTurn) {
                $(this).addClass('active');
                if (map.getLayer(qyLayerId)) {
                    map.getLayer(qyLayerId).show();
                }
            }
            else {
                $(this).removeClass('active');
                if (map.getLayer(qyLayerId)) {
                    map.getLayer(qyLayerId).hide();
                }
            }
            dzxTurn = !dzxTurn;
        });

        //区域插值开关控制
        $('.rightYj .qy').click(function () {
            var qyLayerId = "idw_" + $(".areaSearch li.aqiactive span").text() + "_imgLayer";
            if (!$('.actuality li').hasClass('active')) {
                $('.actuality li').css('cursor', 'pointer');
                if (!qyTurn) {
                    $(this).addClass('active');
                    $('.actuality li').css('cursor', 'Crosshair');
                    if (map.getLayer(qyLayerId)) {
                        map.getLayer(qyLayerId).show(); //显示区域插值
                    }
                }
                else {
                    $(this).removeClass('active');
                    $('.actuality li').css('cursor', 'pointer');
                    if (map.getLayer(qyLayerId)) {
                        map.getLayer(qyLayerId).hide(); //隐藏
                    }
                }
                qyTurn = !qyTurn;

            } else {
                $('.actuality li').css('cursor', 'pointer');
            }

        });


    }
}

//循环播放开关
var turn1 = false;

//intervalometer定时器
function intervalometer() {
    timer = setInterval(function () {
        currentWidth += rateW;
        $('#timecontainer li').eq(liIndex).find('.bar').css('width', currentWidth);
        if (currentWidth == liWidth) {
            liIndex += 1;
            currentWidth = 0;
        }
        if (liIndex == $('#timecontainer li').length - 1 && currentWidth == liWidth) {
            clearInterval(timer);
            $(".triggerBar img").attr("src", "Panel/AirQualityHour/append/img/timeclose.png");
        }
        if (liIndex == oli && currentWidth == owidth) {
            clearInterval(timer);
            $(".triggerBar img").attr("src", "Panel/AirQualityHour/append/img/timeclose.png");
        }
        gettime(liIndex);
    }, 3000);
}