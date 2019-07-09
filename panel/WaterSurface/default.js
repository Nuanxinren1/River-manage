//河流图层
var riverLayerUrl = window.parent._riverLayerUrl;

//水质等级
var waterquality = {
    "Ⅰ": "一类水质",
    "Ⅱ": "二类水质",
    "Ⅲ": "三类水质",
    "Ⅳ": "四类水质",
    "Ⅴ": "五类水质",
    "劣Ⅴ": "劣五水质",
    "-": "暂无数据"
}

//颜色
var color = {
    "Ⅰ": "#14C7F8",
    "Ⅱ": "#15AAF1",
    "Ⅲ": "#24B462",
    "Ⅳ": "#FFD52E",
    "Ⅴ": "#F97638",
    "劣Ⅴ": "#FF2919",
    "-": "#6E7074"
}

//所有的断面
var allSection;
var over;

//存放水质级别
var level1;
var level2;
var level3;
var level4;
var level5;
var level6;
var level7;

//行政区划等级
var regionLevel = window.parent._regionLevel;

//当前时间
var currentDate;

var curJson;

//图例设置
var testlegendjson = { "水质等级": [{ color: "#14C7F8", name: "Ⅰ类" }, { color: "#15AAF1", name: "Ⅱ类" }, { color: "#24B462", name: "Ⅲ类" }, { color: "#FFD52E", name: "Ⅳ类" }, { color: "#F97638", name: "Ⅴ类" }, { color: "#FF2919", name: "劣Ⅴ类" }, { color: "#6E7074", name: "无数据" }] };

//地表水站点经纬度
var stationlonlat = [];

$(function () {
    //初始化时间空间
    //var dateTime = coustomTool.getSystemDate() + ' ' + coustomTool.getSystemTime('HH');
    //初始化最新时间  年 月 日
    var dateTime = coustomTool.getSystemDate();
    //0-8   到月   dateTime.substring(0, 8);
    $("#txt_date").val(dateTime.substring(0, 8));
    $("#txt_date").datepicker({
        changeYear: true,
        changeMonth: true,
        dateFormat: 'yy年mm月',
        onClose: function (dateText, inst) {// 关闭事件  
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
            var date = $("#txt_date").val();
            //var datearray = date.replace('年', '-').replace('月', '-').split('-');
            //var year = datearray[0];  //获取当前日期的年份  
            //var month = datearray[1]; //获取当前日期的月份
            var datearray = date.replace('年', '-').replace('月', '-');
            waterSectionSearch(datearray, "", "");
        },
    });
    //清除图层
    //清除图层
    window.parent.MapUniGIS.MapClear.clearAll();
    //window.parent.clearMapAllCover();
    //清除Graphic
    //window.parent.MapUniGIS.MapClear.clearMapGraphic();
    //创建图例
    window.parent.MapUniGIS.MapLegend.mapShowLegend("1", "WaterSurface", testlegendjson, true);//添加图例
    //window.parent.legend_mapShowLegend(window.parent.legend_getLegendString("WaterSurface", testlegendjson, 1));
    //加载区县
    regionlist();
    //加载河流
    riverSearch();
    //获取饮用水断面经纬度
    getlonlat();
    //饮用水断面信息
    waterSectionSearch("", "", "");
});

//将数据最新时间设置到时间框内
function newTime(time) {
    if (time) {
        $("#txt_date").val(time[0] + "年" + time[1] + "月");
    } else {
        $("#txt_date").val();
    }
}

//获取饮用水断面经纬度以及河流断面编码
function getlonlat() {
    //查询地表水站点坐标
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "WaterService",
        methodName: "GetRiverSegments",
        params: "RegionCode=532600&RiverCode=&WSName=&WSCode="
    }, function (result) {
        var json = eval("(" + result + ")");
        var jsonObject = json.Table;
        for (var i = 0; i < jsonObject.length; i++) {
            stationlonlat.push(jsonObject[i]);
        }
    });
}

//加载区县
function regionlist() {
    var selHtml = "";
    for (var i = 1; i < _CityInfo.length; i++) {
        selHtml += "<option value='" + _CityInfo[i].cityCode + "'>" + _CityInfo[i].cityName + "</option>";
    }
    $("#regionSel").append(selHtml);
}

/*------------------------------------------------时间-----------------------------------------------*/
//上一月
function preHour() {
    //时间格式   data2017年07月
    var date = $("#txt_date").val();
    //var datearray = date.replace('年', '-').replace('月', '-').replace('日', '').split('-');
    var datearray = date.replace('年', '-').replace('月', '-').split('-');
    var year = datearray[0];  //获取当前日期的年份  
    var month = datearray[1]; //获取当前日期的月份 
    //var day = datearray[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数  
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    //var day2 = day;
    //var days2 = new Date(year2, month2, 0);
    //days2 = days2.getDate();
    //if (day2 > days2) {
    //    day2 = days2;
    //}
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var newYear = year2;
    var newMonth = month2;
    var t2 = year2 + "年" + month2 + "月" /*+ day2*/;
    $("#txt_date").val(t2);
}
//下一月
function nextHour() {
    var date = $("#txt_date").val();
    var datearray = date.replace('年', '-').replace('月', '-').split('-');
    var year = datearray[0];  //获取当前日期的年份  
    var month = datearray[1]; //获取当前日期的月份 
    //var day = datearray[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    //var day2 = day;
    //var days2 = new Date(year2, month2, 0);
    //days2 = days2.getDate();
    //if (day2 > days2) {
    //    day2 = days2;
    //}
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var newYear = year2;
    var newMonth = month2;
    var t2 = year2 + "年" + month2 + "月" /*+ day2*/;
    $("#txt_date").val(t2);

}

//当前页面(从1开始) index 1断面，2河流，3监测
/*面板切换功能*/
//点击断面按钮
function btn_change(index) {
    if (index != 2) {
        window.parent.closedotPopups();
    }
    if (index != 1) {
        $("#div_time").css("display", "none");
    } else {
        $("#div_time").css("display", "block");
    }
    var hide = $("#div_select .btnspan .btn-success").attr("id");
    $("#" + hide).removeClass("btn-success");
    $("#btn_s" + index).addClass("btn-success");
    switchSiteAndcity($("#div_select .btnspan .btn-success").attr("id"), hide);
}

//切换断面、河流、监测
function switchSiteAndcity(show, hide) {
    //全图展示
    window.parent.map_FullExtent();
    //删除定位点
    if (window.parent.map.getLayer("GL_HotPoint")) {
        window.parent.map.removeLayer(window.parent.map.getLayer("GL_HotPoint"));
    }
    //清除区县边界
    clearRegionEdge();
    //展点
    mapShow(allSection);
    if (show == hide) {
        return;
    }
    if (show == "btn_s1") {
        var showElement = "#div_section";
    }
    else if (show == "btn_s2") {
        var showElement = "#div_river";
    }
    else if (show == "btn_s3") {
        var showElement = "#div_monitor";
        //恢复之前查询时的结果
        btnSeacrh();
        ////重置监测界面
        //clearPanel_3();
    }

    if (hide == "btn_s1") {
        var hideElement = "#div_section";
    }
    else if (hide == "btn_s2") {
        var hideElement = "#div_river";
    }
    else if (hide == "btn_s3") {
        var hideElement = "#div_monitor";
    }
    pageChange(showElement, hideElement);
}
//重置监测界面
function clearPanel_3() {
    //重置界面
    //重置表格div
    $('.char2').empty();
    $('.char2').append('<div id="div_2" style="width:100%"></div>');
    //重置区县下拉
    $('#regionSel').val("-1");
    //重置河流下拉
    $('#riverSel').val("-1");
    //重置文本框
    $('#txt_entername').val("");
    //重置查询断面个数
    $("#searchCount").text(0);
}

//切换断面、河流、监测动画显示隐藏
function pageChange($showElement, $hideElement) {
    var browserinfo = getBrowserInfo();
    if (browserinfo == null || (browserinfo && browserinfo.indexOf('ie') > -1)) {
        $($hideElement).css("display", "none");
        $($hideElement).hide();
        $($showElement).css("display", "block");
        $($showElement).show();
    }
    else {
        $($hideElement).animo({ animation: ["fadeOut"], duration: 0.7 }, function () {
            $($hideElement).css("display", "none");
            $($hideElement).hide();
            $($showElement).css("display", "block");
            $($showElement).show();
        });
    }
}

//判断浏览器兼容性
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();
    var regStr_ie = /ie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;
    //IE
    if (agent.indexOf("ie") > -1) {
        return "ie";
    }
        //firefox
    else if (agent.indexOf("firefox") > -1) {
        return "firefox";
    }
        //Chrome
    else if (agent.indexOf("chrome") > -1) {
        return "chrome";
    }
        //Safari
    else if (agent.indexOf("safari") > -1 && agent.indexOf("chrome") < 0) {
        return "safari";
    }
    else {
        return "chrome";
    }
}

/* 页面1 */
//查询地表水数据
function waterSectionSearch(time, river, wscode) {
    $("#div_body").css("visibility", "hidden");
    //获取地表水月报数据
    var loading = coustomTool.Loading("body", '../../IMG/loading/loading2.gif');
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "WaterService",
        methodName: "GetRiverSegmentsQuaityData",
        params: "RegionCode=532600&TimePoint=" + time + "&RiverCode=" + river + "&WSCode=" + wscode
    }, function (result) {
        var json = eval("(" + result + ")");
        json = json.Table;
        coustomTool.UnLoading(loading);
        $("#div_body").css("visibility", "visible");

        //将时间更新至数据最新时间
        var time;
        if (json.length > 0) {
            time = json[0]["MonitorTime"].split("-");
        }
        newTime(time);
        //根据条件增加字段
        json = WS_FieldChange(json);
        //图表、表格、点位
        waterSectionSearchThen(json);
        function waterSectionSearchThen(json) {
            //渲染图表
            setTimeout(function () {
                initECharts(json);
            }, 1);
            //渲染数据表格
            setTimeout(function () {
                LoadGird(json);
            }, 1);
            //地图展点
            setTimeout(function () {
                mapShow(json);
            }, 1000);
        }
        //处理数据
        function WS_FieldChange(json) {
            var jsonChange = [];
            for (var i = 0; i < json.length; i++) {
                for (var j = 0; j < stationlonlat.length; j++) {
                    if (json[i].WSCode == stationlonlat[j].WScode) {
                        json[i]["lon"] = stationlonlat[j].Longitude;
                        json[i]["lat"] = stationlonlat[j].Latitude;
                        json[i]["RiverCode"] = stationlonlat[j].RiverCode;
                        //json[i]["QualityRate"] = json[i]["QualityRate"].replace("类", "");
                        if (json[i]["OverStandardInfo"] != null) {
                            json[i]["IsStandard"] = "是";
                        } else if (json[i]["OverStandardInfo"] == null) {
                            json[i]["OverStandardInfo"] = "无";
                            json[i]["IsStandard"] = "否";
                        }
                        var level = json[i]["QualityRate"];
                        //level="";
                        if (level.indexOf("劣V") > -1) {
                            json[i]["QualityRate"] = "劣Ⅴ";
                        }
                        else if (level.indexOf("V") > -1) {
                            json[i]["QualityRate"] = "Ⅴ";
                        }
                        else if (level.indexOf("IV") > -1) {
                            json[i]["QualityRate"] = "Ⅳ";
                        }
                        else if (level.indexOf("III") > -1) {
                            json[i]["QualityRate"] = "Ⅲ";
                        }
                        else if (level.indexOf("II") > -1) {
                            json[i]["QualityRate"] = "Ⅱ";
                        }
                        else if (level.indexOf("I") > -1) {
                            json[i]["QualityRate"] = "Ⅰ";
                        }
                        else if (level == "") {
                            json[i]["QualityRate"] = "-"
                        }
                        jsonChange.push(json[i]);
                    } else {
                        continue;
                    }
                }
            }
            return jsonChange;
        }
    });
}

//渲染图表
function initECharts(json) {
    allSection = json;
    curJson = allSection;
    over = new Array();
    level1 = new Array();
    level2 = new Array();
    level3 = new Array();
    level4 = new Array();
    level5 = new Array();
    level6 = new Array();
    level7 = new Array();
    var NULL = 0;
    var year = "-"
    var month = "-";
    for (var i = 0; i < json.length; i++) {
        //获取月报时间
        if (i == 0) {
            var time = json[i]["MonitorTime"];
            year = time.substring(0, 4);
            year = year == undefined ? "-" : year;
            month = time.substring(5, 7);
            month = month == undefined ? "-" : month;
        }
        //超标物及倍数
        if (json[i]["IsStandard"] == "是") {
            over.push(json[i]);
        }
        var quality = json[i]["QualityRate"];
        if (quality == "" || quality == "-" || quality == null) {
            NULL = NULL + 1;
            level7.push(json[i]);
        }
        else if (quality == "Ⅰ") {
            level1.push(json[i]);
        }
        else if (quality == "Ⅱ") {
            level2.push(json[i]);
        }
        else if (quality == "Ⅲ") {
            level3.push(json[i]);
        }
        else if (quality == "Ⅳ") {
            level4.push(json[i]);
        }
        else if (quality == "Ⅴ") {
            level5.push(json[i]);
        }
        else if (quality == "劣Ⅴ") {
            level6.push(json[i]);
        }
    }
    var data = new Array();
    var colorArr = new Array();
    var dataName = new Array();
    if (level1.length > 0) {
        dataName.push("Ⅰ类");
        colorArr.push(color['Ⅰ']);
        data.push({ 'name': 'Ⅰ类', 'value': level1.length });
    }
    if (level2.length > 0) {
        dataName.push("Ⅱ类");
        colorArr.push(color['Ⅱ']);
        data.push({ 'name': 'Ⅱ类', 'value': level2.length });
    }
    if (level3.length > 0) {
        dataName.push("Ⅲ类");
        colorArr.push(color['Ⅲ']);
        data.push({ 'name': 'Ⅲ类', 'value': level3.length });
    }
    if (level4.length > 0) {
        dataName.push("Ⅳ类");
        colorArr.push(color['Ⅳ']);
        data.push({ 'name': 'Ⅳ类', 'value': level4.length });
    }
    if (level5.length > 0) {
        dataName.push("Ⅴ类");
        colorArr.push(color['Ⅴ']);
        data.push({ 'name': 'Ⅴ类', 'value': level5.length });
    }
    if (level6.length > 0) {
        dataName.push("劣Ⅴ类");
        colorArr.push(color['劣Ⅴ']);
        data.push({ 'name': '劣Ⅴ类', 'value': level6.length });
    }
    if (level7.length > 0) {
        dataName.push("无数据");
        colorArr.push(color['-']);
        data.push({ 'name': '无数据', 'value': level7.length });
    }

    //全部图例显示
    // dataName.push("Ⅰ类");
    // colorArr.push(color['Ⅰ']);
    // data.push({ 'name': 'Ⅰ类', 'value': level1.length });	
    // dataName.push("Ⅱ类");
    // colorArr.push(color['Ⅱ']);
    // data.push({ 'name': 'Ⅱ类', 'value': level2.length });
    // dataName.push("Ⅲ类");
    // colorArr.push(color['Ⅲ']);
    // data.push({ 'name': 'Ⅲ类', 'value': level3.length });
    // dataName.push("Ⅳ类");
    // colorArr.push(color['Ⅳ']);
    // data.push({ 'name': 'Ⅳ类', 'value': level4.length });
    // dataName.push("Ⅴ类");
    // colorArr.push(color['Ⅴ']);
    // data.push({ 'name': 'Ⅴ类', 'value': level5.length });
    // dataName.push("劣Ⅴ类");
    // colorArr.push(color['劣Ⅴ']);
    // data.push({ 'name': '劣Ⅴ类', 'value': level6.length });
    // dataName.push("无数据");
    // colorArr.push(color['-']);
    // data.push({ 'name': '无数据', 'value': level7.length });

    //创建饼图
    EChart_createPie("div_echart", '当前月饮用水水质情况', data, colorArr, dataName);
    var HTML = year + "年 " + month + "月，全" + regionLevel.level1 + "共有饮用水监测断面 <a href='javascript:position(0)' class='boldred'>" + allSection.length + "</a> 个，" +
                //"其中超标断面 <a href='javascript:position(10)' class='boldred'>" + over.length + "</a> 个，" +
                "达到Ⅰ类水质 <a href='javascript:position(1)' class='boldred'>" + level1.length + "</a> 个断面，" +
                "达到Ⅱ类水质 <a href='javascript:position(2)' class='boldred'>" + level2.length + "</a> 个断面，" +
                "达到Ⅲ类水质 <a href='javascript:position(3)' class='boldred'>" + level3.length + "</a> 个断面，" +
                "Ⅳ类水质 <a href='javascript:position(4)' class='boldred'>" + level4.length + "</a> 个断面，" +
                "Ⅴ类水质 <a href='javascript:position(5)' class='boldred'>" + level5.length + "</a> 个断面，" +
                "劣Ⅴ类水质 <a href='javascript:position(6)' class='boldred'>" + level6.length + "</a> 个断面，" +
                "当前暂无数据 " + NULL + " 个断面。";
    //HTML += "<div><table class='t_analysis' cellpadding='0' cellspacing='0' border='0' width='100%'><tr><td>统计分析：</td><td><a href='javascript:void(0)' target='_blank' onclick='details(1,this)' >饮用水水质月报分析</a></td></tr></table></div>";
    $('#div_dec_Section').html(HTML);
}

//地图显示点位
function mapShow(json) {
    /// <summary>地图显示城市点位</summary>     
    /// <param name="json" type="Array">传入对象</param>
    var urlParam = new Object();
    for (var i = 0; i < json.length; i++) {
        var time;
        var cityCode;
        var cityCode = json[i]["RegionCode"];
        var sectionCode = json[i]["WSCode"];

        time = json[i]["MonitorTime"].substring(0, 7);

        json[i]["p_name"] = json[i]["WSName"];
        json[i]["p_id"] = sectionCode;
        json[i]["p_lon"] = Number(json[i]["lon"]);
        json[i]["p_lat"] = Number(json[i]["lat"]);
        json[i]["p_value"] = json[i]["QualityRate"].replace("类", "");

        urlParam[sectionCode] = "&time=" + time + "&cityCode=" + cityCode + "&sectionCode=" + sectionCode + "&index=" + new Date().getTime();
    }
    var popWindowUrl = "Panel/WaterSurface/InfoWindow.html";
    var ringHTML = null;

    var popWindowParam = {};
    popWindowParam["popWindowUrl"] = popWindowUrl;
    popWindowParam["urlParam"] = urlParam;
    popWindowParam["popHeight"] = 320;
    popWindowParam["popWidth"] = 500;
    clearPoint("WaterDrink");
    window.parent.map_AddPointInfoToMap("WaterDrink", json, popWindowParam, true);
    //window.parent.map_FullExtent();
}
//清除点位
function clearPoint(name) {
    var Layer = window.parent.map.getLayer("GL_Widgets_PointCover_draw" + name);
    if (Layer) {
        window.parent.map.removeLayer(Layer);
    }
    //window.parent.map_FullExtent();
}

//加载断面列表数据
function LoadGird(data, heightCustom, type) {
    var height = $(window).height();
    if (type == 2) {
        var columns = [
            { title: '名称', field: 'WSName', align: 'center', valign: 'middle', sortable: false, width: '145px' },
            {
                title: '水质类别'
                , field: 'QualityRate'
                , align: 'center'
                , valign: 'middle'
                , sortable: false
                , width: '145px'
                , formatter: function (value) {
                    return "<span class='descpanel' style = 'background:" + color[value] + "'>" + value + "</span>"
                }
            },
            { title: '经度', field: 'lon', align: 'center', valign: 'middle', visible: false, sortable: false },
            { title: '纬度', field: 'lat', align: 'center', valign: 'middle', visible: false, sortable: false }
        ];
        var top = $("#div_2").offset().top;
        var tableHeight = 0;
        tableHeight = height - top - 220;

        if (heightCustom) {
            tableHeight = heightCustom;
        }
        var dataGrid = coustomTool.craeteDataGrid("#div_2", null, data, columns, tableHeight, false, onClickRow1);
    }
    else {
        var columns = [
            { title: '名称', field: 'RegionName', align: 'center', valign: 'middle', sortable: false },
            { title: '断面名称', field: 'WSName', align: 'center', valign: 'middle', sortable: false },
            {
                title: '水质类别'
                , field: 'QualityRate'
                , align: 'center'
                , valign: 'middle'
                , sortable: false
                , formatter: function (value) {
                    return "<span class='descpanel' style = 'background:" + color[value] + "'>" + value + "</span>"
                }
            },
            { title: '超标元素', field: 'OverStandardInfo', align: 'center', valign: 'middle', sortable: false },
            { title: '经度', field: 'lon', align: 'center', valign: 'middle', visible: false, sortable: false },
            { title: '纬度', field: 'lat', align: 'center', valign: 'middle', visible: false, sortable: false },
        ];
        var top = $("#datatable_Section").offset().top;
        var tableHeight = 0;
        tableHeight = height - top - 45;
        if (heightCustom) {
            tableHeight = heightCustom;
        }
        var dataGrid = coustomTool.craeteDataGrid("#datatable_Section", null, data, columns, tableHeight, false, onClickRow1);
    }
    if (heightCustom != null) {
        $(".fixed-table-container").css("height", heightCustom + "px");
    }
}

//断面点击事件
function onClickRow1(row, element) {
    var lon = Number(row.lon);
    var lat = Number(row.lat);
    window.parent.map_CenterAtAndZoom(lon, lat, 6);
}

//点击水质类别数字地图点位筛选显示
function position(index) {
    $("#txt_entername").val("");
    if (index == 0) {
        if (allSection.length >= 0) {
            LoadGird(allSection);
            mapShow(allSection);
            curJson = allSection;
        }
    }
    else if (index == 10) {
        if (over.length >= 0) {
            LoadGird(over);
            mapShow(over);
            curJson = over;
        }
    }
    else if (index == 1) {
        if (level1.length >= 0) {
            LoadGird(level1);
            mapShow(level1);
            curJson = level1;
        }
    }
    else if (index == 2) {
        if (level2.length >= 0) {
            LoadGird(level2);
            mapShow(level2);
            curJson = level2;
        }
    }
    else if (index == 3) {
        if (level3.length >= 0) {
            LoadGird(level3);
            mapShow(level3);
            curJson = level3;
        }
    }
    else if (index == 4) {
        if (level4.length >= 0) {
            LoadGird(level4);
            mapShow(level4);
            curJson = level4;
        }
    }
    else if (index == 5) {
        if (level5.length >= 0) {
            LoadGird(level5);
            mapShow(level5);
            curJson = level5;
        }
    }
    else if (index == 6) {
        if (level6.length >= 0) {
            LoadGird(level6);
            mapShow(level6);
            curJson = level6;
        }
    }
    else {
        if (allSection.length >= 0) {
            LoadGird(allSection);
            mapShow(allSection);
            curJson = allSection;
        }
    }
}

var biggerBoottableType = 0;//0小,1大
function biggerBoottableClick(e) {
    if (biggerBoottableType == 0) {
        biggerBoottableType = 1;
        $("#sectionsPieAndDesc").css("display", "none");
        e.src = "IMG/navigate/1186187.png";
        var height = resetSectionsBoottableHeight();
        setTimeout(function () {
            //$("#sectionsBoottableTD").html("");
            //$("#sectionsBoottableTD").html('<table id="datatable_Section" class="boottable1" cellpadding="0" cellspacing="0" border="0" width="100%"></table>');
            LoadGird(curJson, height);
        }, 1);
    }
    else {
        biggerBoottableType = 0;
        $("#sectionsPieAndDesc").css("display", "block");
        e.src = "IMG/navigate/1186190.png";
        var height = resetSectionsBoottableHeight();
        setTimeout(function () {
            //$("#sectionsBoottableTD").html("");
            //$("#sectionsBoottableTD").html('<table id="datatable_Section" class="boottable1" cellpadding="0" cellspacing="0" border="0" width="100%"></table>');
            LoadGird(curJson, height);
        }, 1);
    }
}

function resetSectionsBoottableHeight() {
    var height = $(window).height();
    var tableHeight = 0;
    $(".fixed-table-body").scrollTop(0);//使滚动条回到最初
    var top = $("#datatable_Section").offset().top;
    tableHeight = height - top - 45;
    return tableHeight;
    //$(".fixed-table-container").css("height", tableHeight + "px");
}

//EChart      创建eachat饼图图表
function EChart_createPie(element, title, data, color, dataName) {
    var myChart = echarts.init(document.getElementById(element), 'default');
    option = {
        title: {
            text: title,
            x: 'center',
            y: 'top',
            textStyle: {
                fontSize: 12,
                fontWeigth: "normal",
                color: "#FFF"
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: color,
        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            y: 'bottom',
            data: dataName,
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { show: true, title: "保存" }
            }
        },
        calculable: false,//图标是否可拖动
        series: [
            {
                name: '所占比例',
                type: 'pie',
                radius: [0, 60],
                sort: 'ascending',
                data: data,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true,
                            length: 10
                        }
                        //color: function (params) {
                        //    var level = params.data.name.replace('类', '');
                        //    return coustomTool.getWaterLveAndColor(level).borderColor;
                        //}
                    }
                },
                center: ['45%', '55%']
            }
        ]
    };
    myChart.setOption(option);
}

/* 页面2 */
//河流信息
function riverSearch() {
    //查询河流图层
    window.parent.queryTask(riverLayerUrl + "/1", getResultsRiver, {});

    //查询河流图层时的回调函数
    function getResultsRiver(token) {
        var glArr = [];
        //var zlArr = [];
        var feature = token.features;
        //regionCode  riverCode  riverName  riverType
        for (var i = 0; i < feature.length; i++) {
            var attribute = feature[i].attributes;
            glArr.push(attribute);
            //if (attribute.riverType == "干流") {
            //    glArr.push(attribute);
            //}
            //else {
            //    zlArr.push(attribute);
            //}
        }
        //加载河流下拉列表
        riverList(feature);
        //加载干流支流图层
        window.parent.riverAddGraghicLayer(feature);
        $("#info_river").html("当前列表总数<a id='a_GL' class='redFont'>" + glArr.length /*+ zlArr.length)*/ + "</a>条河流"/*（干流<a class='redFont'>" + glArr.length + "</a>条、支流<a class='redFont'>" + zlArr.length + "</a>条)"*/);
        //加载河流 列表数据
        LoadGirdRiver([glArr]);
    }
}

//加载河流表格数据
function LoadGirdRiver(data) {
    //data[0]干流  data[1]支流
    var height = $(window).height();
    var columns = [
                { title: '河流名称', field: 'Name', align: 'center', valign: 'middle', sortable: false },
                { title: '河流编码', field: 'BM', align: 'center', valign: 'middle', visible: false, sortable: false }
    ]
    var top = $("#datatableDiv_River").offset().top;
    var tableHeight = 0;
    tableHeight = height - top - 250;
    if (data[0]) {
        var dataGrid = coustomTool.craeteDataGrid("#datatable_River_GL", null, data[0], columns, tableHeight, false, onClickRow2);
    }
    if (data[1]) {
        var dataGrid = coustomTool.craeteDataGrid("#datatable_River_ZL", null, data[1], columns, tableHeight, false, onClickRow2);
    }
}

//河流 干/支流列表点击事件
function onClickRow2(row, element) {
    var code = row.BM;
    riverZoom(code);
    var time = $("#txt_date").val().replace('年', '-').replace('月', '');
    window.parent.dotPopups("panel_riverInfo", "河流信息", 393, 300, "", 10, "", 20, "Panel/WaterSurface/riverInfo.html" + "?code=" + code + "&time=" + time/*+ "&name=" + row.riverName*/);
}

//河流缩放
function riverZoom(code) {
    var graphics = window.parent.map.getLayer("River_GL").graphics;
    for (var i = 0; i < graphics.length; i++) {
        var attribute = graphics[i].attributes;
        if (attribute.BM == code) {
            window.parent.map.setExtent(graphics[i]._extent);
        }
    }
}

//勾选添加/取消河流或断面图层
function checkboxRiverClick(th) {
    if (th.checked) {
        if (th.id == "checkboxRiverGL") {
            window.parent.changeLayerVidibile("River_GL", true);
        }
        else if (th.id == "checkboxRiverZL") {
            window.parent.changeLayerVidibile("River_ZL", true);
        }
        else if (th.id == "checkboxSection") {
            window.parent.changeLayerVidibile("GL_Widgets_PointCover_drawWaterDrink", true);
        }
    } else {
        if (th.id == "checkboxRiverGL") {
            window.parent.changeLayerVidibile("River_GL", false);
        }
        else if (th.id == "checkboxRiverZL") {
            window.parent.changeLayerVidibile("River_ZL", false);
        }
        else if (th.id == "checkboxSection") {
            window.parent.changeLayerVidibile("GL_Widgets_PointCover_drawWaterDrink", false);
        }
    }
}

//列表内干/支流切换
function ganliuzhiliuClick(Num) {
    if (Num == "0") {
        $("#datatable_River_GL_DIV").css("display", "block");
        $("#datatable_River_ZL_DIV").css("display", "none");
    }
    else if (Num == "1") {
        $("#datatable_River_GL_DIV").css("display", "none");
        $("#datatable_River_ZL_DIV").css("display", "block");
    }
}

/*------页面3------*/
//加载河流下拉列表
function riverList(feature) {
    var selHtml = "";
    for (var i = 0; i < feature.length; i++) {
        var attribute = feature[i].attributes;
        if (attribute.Name != " " && attribute.Name != "" && attribute.Name != undefined) {
            selHtml += "<option value='" + attribute.BM + "'>" + attribute.Name + "</option>";
        }
    }
    $("#riverSel").append(selHtml);
}

//选择查询
function btnSeacrh() {
    var json1 = [];
    var json2 = [];
    var json3 = [];
    var json4 = [];
    var region = $('#regionSel').find("option:selected").val() == "" ? "" : $('#regionSel').find("option:selected").val();
    var riverCode = $('#riverSel').find("option:selected").val() == "" ? "" : $('#riverSel').find("option:selected").val();
    var station = $('#stationSel').find("option:selected").val() == "" ? "" : $('#stationSel').find("option:selected").val();
    var entername = $('#txt_entername').val();
    if (region != "-1") {
        region = region.substring(0, 6);
        if (region == "532621") {
            region = "532601";
        }
        for (var i = 0; i < allSection.length; i++) {
            if (allSection[i].RegionCode == region) {
                json1.push(allSection[i]);
            }
        }
    }
    else {
        json1 = allSection;
    }
    if (riverCode != "-1") {
        for (var j = 0; j < json1.length; j++) {
            if (json1[j].RiverCode == riverCode) {
                json2.push(json1[j]);
            }
        }
    }
    else {
        json2 = json1;
    }
    if (station != "") {
        for (var k = 0; k < json2.length; k++) {
            if (json2[k].ControlType == station) {
                json3.push(json2[k]);
            }
        }
    }
    else {
        json3 = json2;
    }
    if (entername != "") {
        for (var l = 0; l < json3.length; l++) {
            if (json3[l].p_name) {
                if (json3[l].p_name.indexOf(entername) > -1) {
                    json4.push(json3[l]);
                }
            }
        }
    }
    else {
        json4 = json3;
    }

    //渲染数据表格
    LoadGird(json4, "", 2);
    if (entername == "") {
        if (json2.length != 0) {
            if (region != "-1") {
                if (region == "532601") {
                    region = "532621";
                }
                window.parent.showCounty(region);
            } else {
                //清除区县边界
                clearRegionEdge();
                window.parent.map_FullExtent();
                if (riverCode != "-1") {
                    riverZoom(riverCode);
                }
            }

        } else {
            //清除区县边界
            clearRegionEdge();
            //缩放至全图
            window.parent.map_FullExtent();
        }
    } else {
        if (json4.length != 0) {
            //清除区县边界
            clearRegionEdge();
            window.parent.map_CenterAtAndZoom(json4[0].p_lon, json4[0].p_lat, 1);
        } else {
            clearPoint("WaterDrink");
            if (window.parent.map.getLayer("GL_HotPoint")) {
                window.parent.map.removeLayer(window.parent.map.getLayer("GL_HotPoint"));
            }
            window.parent.map_FullExtent();
        }
    }

    //加载点位
    mapShow(json4);
    $("#searchCount").text(json4.length);
}

//清除区县边界
function clearRegionEdge() {
    //查询全部时，移除上一次查询的区县边界
    var Layer = window.parent.map.getLayer("countyGraphic");
    if (Layer) {
        window.parent.map.removeLayer(Layer);
    }
}


