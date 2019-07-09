//监测物类型
var jianceTypeName = "AQI";
var jianceTypeField = "AQI";
var jianceTypeArray = [{ name: "AQI", field: "AQI" }, { name: "PM2.5", field: "PM2_5" }, { name: "PM10", field: "PM10" }, { name: "SO2", field: "SO2" }, { name: "NO2", field: "NO2" }, { name: "CO", field: "CO" }, { name: "O3", field: "O3" }];

var timeField = "MonitorTime";

var nameTime = "24小时";//时间的中文描述

var category = new Array();
var data = new Array();

var biaoxianArray = [];//标线
var maxObj = null;//自定义设置纵轴刻度最大值(若标线值不在刻度范围内)

var paramObject;
var curPointType = "city";

var valueTime = 0;//0,1,2,3,4,5 

var ylljosn = [];//优良率

var stationCode = "";
var startTime = "";
var endTime = "";
//2017-05-05 00:00:00.000
//0-19
window.onload = function () {

}

$(document).ready(function () {
    //debugger;
    paramObject = coustomTool.GetURLParams(document.location.href);
    if (paramObject && paramObject.pointType) {
        curPointType = paramObject.pointType;
        if (paramObject.pointType == "city") {
            valueTime = 1;
        }
        else if (paramObject.pointType == "station") {
            valueTime = 0;
        }
    }
    if (paramObject.pointType == "city") {
        nameTime = "一周";
        $("#jianceTJ table #div_button").empty();
        $("#jianceTJ table #div_button").html('&nbsp;<button class="searchnewbtn" id="searchTime4">历年年均</button>&nbsp;<button class="searchnewbtn" id="searchTime3" >最近一年</button>&nbsp;<button class="searchnewbtn" id="searchTime2">最近一月</button>&nbsp;<button class="searchnewbtn newbtnac" id="searchTime1">最近一周</button>');
    }
    else if (paramObject.pointType == "station") {
        nameTime = "24小时";
        $("#jianceTJ table #div_button").empty();
        var htmlStr = '&nbsp;<button class="searchnewbtn" id="searchTime4">历年年均</button>&nbsp;<button class="searchnewbtn" id="searchTime3">最近一年</button>&nbsp;<button class="searchnewbtn" id="searchTime2">最近一月</button>&nbsp;<button class="searchnewbtn" id="searchTime1">最近一周</button>&nbsp;<button class="searchnewbtn newbtnac" id="searchTime0">最近24小时</button>';
        $("#jianceTJ table #div_button").html(htmlStr);
    }

    jianceTypeField = "AQI";
    jianceTypeName = "AQI";

    //监测时间点击点击按钮触发事件
    $(".searchnewbtn").click(function () {
        $(this).siblings().removeClass("newbtnac");
        $(this).addClass("newbtnac");
        var id = $(".newbtnac").attr("id");
        if (id == "searchTime5") {
            searchCityByID(5);
        }
        else if (id == "searchTime4") {
            searchCityByID(4, "历年");
        }
        else if (id == "searchTime3") {
            searchCityByID(3, "一年");
        }
        else if (id == "searchTime2") {
            searchCityByID(2, "一月");
        }
        else if (id == "searchTime1") {
            searchCityByID(1, "一周");
        }
        else if (id == "searchTime0") {
            searchCityByID(0, "24小时");
        }
    });
    init();
});



function init() {
    //debugger;

    var cityCode = paramObject.code;
    var stationCode = paramObject.code;

    var endTime = paramObject["time"].replace("T", " ");
    var NYR = endTime.split(' ')[0].split('-');
    var timeObject = new Date();
    timeObject.setFullYear(NYR[0], NYR[1], NYR[2]);
    timeObject.setHours(Number(23));
    var dateTime = new Date(timeObject.getTime() - 24 * 60 * 60 * 1000);
    var h = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
    var startTime = dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate() + " " + h + ":00:00";

    var time = paramObject.time + " " + paramObject.hour;
    //time = "2017-05-07 00:00:00";
    endTime = time;
    var timestart = "";//2016-10-04 16:00:00
    var shijian = time.split(" ")[1];


    if (valueTime == 0) {
        timestart = dateTools.addDateDay(time, -1) + " " + shijian;
    }
    else if (valueTime == 1) {
        timestart = dateTools.addDateDay(time, -7) + " 00:00:00";
    }
    else if (valueTime == 2) {
        var month = new Date().getMonth();
        month += 1;
        timestart = new Date().getFullYear() + "-" + month + "-01 00:00:00";
        timestart = dateTools.addDateDay(time, -30) + " 00:00:00";
    }
    else if (valueTime == 3) {
        timestart = new Date().getFullYear() + "-01-01 00:00:00";
        timestart = dateTools.addDateDay(time, -365) + " 00:00:00";
    }
    else if (valueTime == 4 || valueTime == 5) {//历年  从13年开始
        timestart = "2013-01-01 00:00:00";
    }
    startTime = timestart;


    initTable();
    initECharts(startTime, endTime);

}

//填充表格各监测类型监测值
function initTable() {
    var json = "";
    var type = paramObject.pointType;
    var time = paramObject.time + " " + paramObject.hour;
    //time = "2017-05-07 00:00:00";
    var code = paramObject.code;
    //获取最新的小时评价数据填充各项监测物实时浓度table表（区分站点和城市）
    if (type == "city") {
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "HJJCService",
            methodName: "GetCityDayQuaityData",
            params: "cityCode=" + window.parent.regionCode_QX + "&timePoint="
        }, function (result) {
            //var jsonstring = result;
            //jsonstring = '[{"ID":"138102","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 00:00:00","SO2":10,"NO2":73,"PM10":64,"CO":0.8,"O3":9,"PM25":33,"AQI":57,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":1}]';

            var json = eval("(" + result + ")");
            json = json.Table;
            //填充表格各监测物的值
            loadJianceData(json);
        });
    }
    else if (type == "station") {
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "HJJCService",
            methodName: "GetStationHourQuaityData",
            params: "regionCode=" + window.parent.regionCode_QX + "&timePoint=" + time + "&stationCode=" + code
        }, function (result) {
            //var jsonstring = result;
            //jsonstring = '[{"ID":"138102","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 00:00:00","SO2":10,"NO2":73,"PM10":64,"CO":0.8,"O3":9,"PM25":33,"AQI":57,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":1}]';
            var json = eval("(" + result + ")");
            json = json.Table;

            //填充表格各监测物的值
            loadJianceData(json);
        });
    }
    //填充表格各监测物的值
    function loadJianceData(json) {
        var i = 0;
        if (json && json.length > 0) {
            if (typeof (json) != Array) {
                var aqi = (json[i]["AQI"] == "" || json[i]["AQI"] == null) ? "" : json[i]["AQI"];
                var pm25 = (json[i]["PM2_5"] == "" || json[i]["PM2_5"] == null) ? "-" : json[i]["PM2_5"];
                var pm10 = (json[i]["PM10"] == "" || json[i]["PM10"] == null) ? "-" : json[i]["PM10"];
                var so2 = (json[i]["SO2"] == "" || json[i]["SO2"] == null) ? "-" : json[i]["SO2"];
                var no2 = (json[i]["NO2"] == "" || json[i]["NO2"] == null) ? "-" : json[i]["NO2"];
                var co = (json[i]["CO"] == "" || json[i]["CO"] == null) ? "-" : json[i]["CO"];
                var o3_h8 = (json[i]["O3"] == "" || json[i]["O3"] == null) ? "-" : json[i]["O3"];

                $("#div_aqi").html(aqi);
                $("#div_pm2_5").html(pm25 + " ug/m³");
                $("#div_pm10").html(pm10 + " ug/m³");
                $("#div_so2").html(so2 + " ug/m³");
                $("#div_no2").html(no2 + " ug/m³");
                $("#div_co").html(co + " mg/m³");
                $("#div_o3_h8").html(o3_h8 + " ug/m³");
            }
            else if (typeof (josn) == Array) {
                json = json[0];
                var aqi = (json[i]["AQI"] == "" || json[i]["AQI"] == null) ? "" : json[i]["AQI"];
                var pm25 = (json[i]["PM2_5"] == "" || json[i]["PM2_5"] == null) ? "-" : json[i]["PM2_5"];
                var pm10 = (json[i]["PM10"] == "" || json[i]["PM10"] == null) ? "-" : json[i]["PM10"];
                var so2 = (json[i]["SO2"] == "" || json[i]["SO2"] == null) ? "-" : json[i]["SO2"];
                var no2 = (json[i]["NO2"] == "" || json[i]["NO2"] == null) ? "-" : json[i]["NO2"];
                var co = (json[i]["CO"] == "" || json[i]["CO"] == null) ? "-" : json[i]["CO"];
                var o3_h8 = (json[i]["O3"] == "" || json[i]["O3"] == null) ? "-" : json[i]["O3"];

                $("#div_aqi").html(aqi);
                $("#div_pm2_5").html(pm25 + " ug/m³");
                $("#div_pm10").html(pm10 + " ug/m³");
                $("#div_so2").html(so2 + " ug/m³");
                $("#div_no2").html(no2 + " ug/m³");
                $("#div_co").html(co + " mg/m³");
                $("#div_o3_h8").html(o3_h8 + " ug/m³");
            }
        }
    }
}


//曲线图
function initECharts(startTime, endTime) {
    var json = "";
    var type = paramObject.pointType;
    var code = paramObject.code;
    //获取最新的小时或日监测数据构建统计图表（区分站点和城市、监测物类型、监测时间）
    if (type == "city") {
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "HJJCService",
            methodName: "GetTimeCityDayQuaityData",
            params: "cityCode=" + window.parent.regionCode_QX + "&startTime=" + startTime + "&endTime=" + endTime
        }, function (result) {
            var json = eval("(" + result + ")");
            json = json.Table;
            //测试数据处理(做数据，使value字段的值等于相应的监测值)
            for (var i = 1; i < json.length; i++) {
                if (json[i][jianceTypeField] == null || json[i][jianceTypeField] == "") {
                    json[i][jianceTypeField] = 0;
                }
                json[i]["value"] = json[i][jianceTypeField];
            }
            initECharts2(json);
        });
    }
    else if (type == "station") {
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "HJJCService",
            methodName: "GetTimeStationHourQuaityData",
            params: "asCode=" + window.parent.regionCode_QX + "&stationCode=" + code + "&startTime=" + startTime + "&endTime=" + endTime
        }, function (result) {
            //var jsonstring = result;
            //jsonstring = '[{"ID":"138102","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 00:00:00","SO2":10,"NO2":73,"PM10":64,"CO":0.8,"O3":9,"PM25":33,"AQI":57,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":1},{"ID":"138107","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 01:00:00","SO2":4,"NO2":62,"PM10":62,"CO":0.7,"O3":8,"PM25":26,"AQI":56,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":2},{"ID":"138112","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 02:00:00","SO2":6,"NO2":61,"PM10":54,"CO":0.7,"O3":10,"PM25":26,"AQI":52,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":3},{"ID":"138117","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 03:00:00","SO2":5,"NO2":60,"PM10":50,"CO":0.7,"O3":6,"PM25":27,"AQI":50,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":4},{"ID":"138122","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 04:00:00","SO2":4,"NO2":54,"PM10":53,"CO":0.7,"O3":8,"PM25":28,"AQI":52,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":5},{"ID":"138127","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 05:00:00","SO2":12,"NO2":50,"PM10":46,"CO":0.6,"O3":8,"PM25":20,"AQI":46,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":6},{"ID":"138132","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 06:00:00","SO2":16,"NO2":42,"PM10":40,"CO":0.6,"O3":10,"PM25":19,"AQI":40,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":7},{"ID":"138137","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 07:00:00","SO2":14,"NO2":36,"PM10":38,"CO":0.7,"O3":10,"PM25":23,"AQI":38,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":8},{"ID":"138142","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 08:00:00","SO2":20,"NO2":32,"PM10":42,"CO":0.6,"O3":12,"PM25":20,"AQI":42,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":9},{"ID":"138147","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 09:00:00","SO2":19,"NO2":25,"PM10":50,"CO":0.6,"O3":22,"PM25":16,"AQI":50,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":10},{"ID":"138152","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 10:00:00","SO2":13,"NO2":19,"PM10":42,"CO":0.6,"O3":46,"PM25":12,"AQI":42,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":11},{"ID":"138157","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 11:00:00","SO2":14,"NO2":17,"PM10":40,"CO":0.7,"O3":68,"PM25":7,"AQI":40,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":12},{"ID":"138162","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 12:00:00","SO2":14,"NO2":15,"PM10":42,"CO":0.8,"O3":101,"PM25":10,"AQI":42,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":13},{"ID":"138167","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 13:00:00","SO2":12,"NO2":12,"PM10":50,"CO":0.8,"O3":108,"PM25":20,"AQI":50,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":14},{"ID":"138172","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 14:00:00","SO2":8,"NO2":12,"PM10":52,"CO":0.7,"O3":110,"PM25":21,"AQI":51,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":15},{"ID":"138177","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 15:00:00","SO2":8,"NO2":11,"PM10":45,"CO":0.7,"O3":104,"PM25":19,"AQI":45,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":16},{"ID":"138182","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 16:00:00","SO2":6,"NO2":11,"PM10":43,"CO":0.7,"O3":100,"PM25":18,"AQI":43,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":17},{"ID":"138187","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 17:00:00","SO2":6,"NO2":14,"PM10":36,"CO":0.7,"O3":90,"PM25":12,"AQI":46,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":18},{"ID":"138192","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 18:00:00","SO2":8,"NO2":24,"PM10":42,"CO":0.7,"O3":82,"PM25":15,"AQI":48,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":19},{"ID":"138197","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 19:00:00","SO2":10,"NO2":36,"PM10":60,"CO":0.8,"O3":61,"PM25":22,"AQI":55,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":20},{"ID":"138202","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 20:00:00","SO2":6,"NO2":44,"PM10":71,"CO":0.9,"O3":39,"PM25":26,"AQI":61,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":21},{"ID":"138207","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 21:00:00","SO2":8,"NO2":53,"PM10":65,"CO":0.8,"O3":20,"PM25":22,"AQI":58,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":22},{"ID":"138213","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 22:00:00","SO2":4,"NO2":39,"PM10":55,"CO":0.7,"O3":26,"PM25":21,"AQI":53,"MAIN_POL":"PM10","AIR_LEVEL":"二级","AIR_STATUS":"良","ROWNO":23},{"ID":"138218","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-17 23:00:00","SO2":4,"NO2":40,"PM10":46,"CO":0.6,"O3":22,"PM25":16,"AQI":46,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":24},{"ID":"138223","REGION_CODE":"330822","REGION_NAME":"常山县","RECORDTIME":"2017-07-18 00:00:00","SO2":5,"NO2":49,"PM10":40,"CO":0.6,"O3":10,"PM25":19,"AQI":40,"MAIN_POL":null,"AIR_LEVEL":"一级","AIR_STATUS":"优","ROWNO":25}]';
            var json = eval("(" + result + ")");
            json = json.Table;
            //测试数据处理(做数据，使value字段的值等于相应的监测值)
            for (var i = 1; i < json.length; i++) {
                if (json[i][jianceTypeField] == null || json[i][jianceTypeField] == "") {
                    json[i][jianceTypeField] = 0;
                }
                json[i]["value"] = json[i][jianceTypeField];
            }
            initECharts2(json);
        });
    }

    function initECharts2(json) {
        if (valueTime == 4) {
            //历年年均
            json = linianjunzhiJSONModify(json, "value", timeField, window.parent.regionCodeSub_QX);
        }
        else if (valueTime == 5) {
            //优良率
            json = youlianglvJSONModify(json, "value", timeField);
            ylljosn = json;
            initYLL(json, timeField);
            return;
        }

        category = new Array();
        data = new Array();

        var jianceValueMax = 0;//监测物浓度最大值

        for (var i = 0; i < json.length; i++) {
            var aqi = json[i]["value"];
            if (aqi == "" || aqi == "-") {
                aqi = "0";
            }
            var dateTime = "";
            dateTime = json[i][timeField].substring(0, 13) + "点";
            if (valueTime == 5) {

            }
            else if (valueTime == 4) {
                //历年年均
                dateTime = json[i][timeField];
            }
            if (aqi) {
                category.push(dateTime);
                if (aqi && aqi > jianceValueMax) {
                    jianceValueMax = aqi;//获取监测物浓度数据的最大值
                }
                data.push(aqi);
            }
        }

        //获取标线数组
        var biaoxian = getbiaoxian(jianceTypeField);

        var biaoxianArray = [];
        var biaoxianMax = 0;//标线最大值
        //构建标线data数组
        for (var i = 0; i < biaoxian.length; i++) {
            var biaoxianValue = biaoxian[i];
            if (biaoxianValue > biaoxianMax) {
                biaoxianMax = biaoxianValue;
            }
            //biaoxianArray.push([{ name: '标准值', value: biaoxianValue, xAxis: -1, yAxis: biaoxianValue }, { xAxis: data.length, yAxis: biaoxianValue }])
            biaoxianArray.push({ yAxis: biaoxianValue });
        }

        var maxY = null;//自定义设置纵轴刻度最大值(若标线值不在刻度范围内)
        var yushu1 = Math.floor(jianceValueMax / 100);
        var yushu2 = Math.floor(jianceValueMax / 10);
        var yushu3 = Math.floor(jianceValueMax / 1);
        maxY = yushu1 == 0 ? (yushu2 == 0 ? (yushu3 == 0 ? 1 : yushu3 + 1) : (yushu2 + 1) * 10) : (yushu1 + 1) * 100;
        if (biaoxianMax > maxY) {    //标线最大值     监测物值最大值
            maxY = biaoxianMax;
        }

        //if (maxY) {
        //    //echarts2特殊处理
        //    maxY = maxY - 0.001;
        //}

        $("#div_echartLine").css("display", "block");
        $("#div_echartBar").css("display", "none");
        if (valueTime == 4) {
            //历年年均
            EChart_createAirLine("bar", "div_echartLine", "最近" + nameTime + jianceTypeName + "情况", category, data, biaoxianArray, maxY);
        }
        else {
            EChart_createAirLine("line", "div_echartLine", "最近" + nameTime + jianceTypeName + "情况", category, data, biaoxianArray, maxY);
        }
    }
}


//按监测物类型查询
function typeClick(typeF) {
    jianceTypeField = typeF;
    jianceTypeName = getfieldvalue(jianceTypeArray, "field", typeF, "name");

    if (valueTime == "0") {//24小时
        timeField = "MonitorTime";
        tablestation = "GasStationHourInfo";
        tablecity = "GasCityHourInfo";
    }
    else {
        timeField = "MonitorTime";
        tablestation = "GasStationDayInfo";
        tablecity = "GasCityDayInfo";
    }

    //alert(jianceTypeName+jianceTypeField);
    $("#" + typeF.replace('.', '')).siblings().removeClass("btnselect");
    $("#" + typeF.replace('.', '')).addClass("btnselect");
    init();
}

//按时间查询
function searchCityByID(index, name) {
    valueTime = index;
    if (name) {
        nameTime = name;
    }

    if (index == "0") {//24小时
        timeField = "MonitorTime";
        tablestation = "GasStationHourInfo";
        tablecity = "GasCityHourInfo";
    }
    else {//日
        timeField = "MonitorTime";
        tablestation = "GasStationDayInfo";
        tablecity = "GasCityDayInfo";
    }
    $("#" + "searchTime" + index).siblings().removeClass("btnselect");
    $("#" + "searchTime" + index).addClass("btnselect");

    init();
}

var dateTools = {
    //添加日，原有日期格式上加天数，
    addDateDay: function (date, days) {
        var d = new Date(Date.parse(date.replace(/-/g, "/").substr(0, 19)));
        d.setDate(d.getDate() + days);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var val = d.getFullYear() + "-" + month + "-" + day;
        return val;
    }
}

function getsubName(text) {
    var textNew = text;
    if (text.indexOf('25') > -1) {
        textNew = text.replace('25', '<sub style="font-size:smaller;">25</sub>');
    }
    else if (text.indexOf('10') > -1) {
        textNew = text.replace('10', '<sub style="font-size:smaller;">10</sub>');
    }
    else if (text.indexOf('2') > -1) {
        textNew = text.replace('2', '<sub style="font-size:smaller;">2</sub>');
    }
    else if (text.indexOf('3') > -1) {
        textNew = text.replace('3', '<sub style="font-size:smaller;">3</sub>');
    }
    else {

    }
    return textNew;
}

//历年均值
function linianjunzhiJSONModify(json, type, timeField) {
    //debugger;
    var sendParam = [];
    var length = json.length;
    var obj = {};
    for (var i = 0; i < length; i++) {
        var year = json[i][timeField].substring(0, 4);
        if (obj[year] == null) {
            obj[year] = [];
            obj[year].push(json[i][type]);
        }
        else {
            obj[year].push(json[i][type]);
        }
    }

    var propertys = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propertys.length; i++) {
        var data = obj[propertys[i]];
        var sum = getdatavaluesunm(data);
        var average = (sum / data.length * 100) / 100;

        var temp = {};
        temp[timeField] = propertys[i];
        temp[type] = average.toFixed(6);
        sendParam.push(temp);
    }
    return sendParam;

}

function getdatavaluesunm(data) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i] != null) {
            sum += data[i];
        }
    }
    return sum;
}

//优良率
function youlianglvJSONModify(json, type, timeField) {
    //debugger;
    var sendParam = [];
    var length = json.length;
    var obj = {};
    for (var i = 0; i < length; i++) {
        var year = json[i][timeField].substring(0, 4);
        if (obj[year] == null) {
            obj[year] = [];
            obj[year].push(json[i]["AQI"]);
        }
        else {
            obj[year].push(json[i]["AQI"]);
        }
    }

    var propertys = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propertys.length; i++) {
        var data = obj[propertys[i]];

        var countAll = 0;
        var coungyl = 0;
        var tempValue = null;
        for (var k = 0; k < data.length; k++) {
            tempValue = null;
            tempValue = data[k];
            if (tempValue != null && tempValue != "") {
                if (Number(tempValue) <= 100) {
                    coungyl++;
                }
                countAll++;
            }
        }

        var temp = {};
        temp[timeField] = propertys[i];
        temp["YL"] = coungyl;
        temp["OTHER"] = countAll - coungyl;
        sendParam.push(temp);
    }
    return sendParam;
}

function initYLL(json, timefield) {

    nameTime = "最近24小时";
    jianceTypeField = "AQI";
    jianceTypeName = "AQI";


    $("#AQI").siblings().removeClass("btnselect");
    $("#AQI").addClass("btnselect");

    $("#div_echartBar").css("display", "block");
    $("#div_echartLine").css("display", "none");

    var data1 = [];
    var data2 = [];
    var catagory = [];
    for (var i = 0; i < json.length; i++) {
        data1.push(json[i]["YL"]);
        data2.push(json[i]["OTHER"]);
        catagory.push(json[i][timefield]);
    }

    EChart_AirAQI("div_echartBar", "最近几年空气站点AQI优良率", data1, data2, catagory);
}


//Echart  折线图
function EChart_createAirLine(echartsType, element, title, category, data, biaoxianArray, maxObj) {
    if (echartsType == null) {
        echartsType = "line";
    }
    var myChart = echarts.init(document.getElementById(element), 'default');
    if (maxObj) {
        option = {
            title: {
                text: title,
                x: "center",
                y: "top",
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#000'
                },
                padding: 10
            },
            grid: {
                left: 50,
                right: 35,
                top: 35,
                bottom: 40
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: false,//图标是否可拖动
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: category,
                    axisLabel: {
                        textStyle: {
                            color: '#000'
                        },
                        //interval: 0,
                        formatter: function (params) {
                            var newParamsName = "";// 最终拼接成的字符串
                            var paramsNameNumber = params.length;// 实际标签的个数
                            var provideNumber = 7;// 每行能显示的字的个数
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                            if (paramsNameNumber > provideNumber) {
                                /** 循环每一行,p表示行 */
                                for (var p = 0; p < rowNumber; p++) {
                                    var tempStr = "";// 表示每一次截取的字符串
                                    var start = p * provideNumber;// 开始截取的位置
                                    var end = start + provideNumber;// 结束截取的位置
                                    // 此处特殊处理最后一行的索引值
                                    if (p == rowNumber - 1) {
                                        // 最后一次不换行
                                        tempStr = params.substring(start, paramsNameNumber).replace("-", "").replace(" ", "日");
                                    } else {
                                        // 每一次拼接字符串并换行
                                        tempStr = params.substring(start, end).replace("-", "年") + "月" + "\n";
                                    }
                                    newParamsName += tempStr;// 最终拼成的字符串
                                }

                            } else {
                                // 将旧标签的值赋给新标签
                                newParamsName = params;
                            }
                            //将最终的字符串返回
                            return newParamsName;
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#000'
                        }
                    }
                ,
                    max: maxObj
                }
            ],
            dataZoom: [
            {
                type: 'inside'
            }
            ],
            series: [
                {
                    name: jianceTypeName,
                    type: "line",
                    data: data,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#FBD12A"
                            }
                        }
                    },
                    markLine: {
                        label: {
                            normal: {
                                position: "end"
                            }
                        },
                        lineStyle: {
                            normal: {
                                type: 'solid',
                                color: 'red'
                            }
                        },
                        data: biaoxianArray
                    }
                }
            ]
        };
    }
    else {
        option = {
            title: {
                text: title,
                x: "center",
                y: "top",
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#000'
                },
                padding: 10
            },
            grid: {
                left: 50,
                right: 50,
                top: 35,
                bottom: 20
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: false,//图标是否可拖动
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: category,
                    axisLabel: {
                        textStyle: {
                            color: '#000'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#000'
                        }
                    }
                }
            ],
            series: [
                {
                    name: jianceTypeName,
                    type: 'line',
                    data: data,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#FBD12A"
                            }
                        }
                    },
                    markLine: {
                        itemStyle: {
                            normal: { lineStyle: { type: 'solid', color: 'red' }, label: { show: true, position: 'right' } }
                        },
                        symbol: ["circle", "none"],
                        data: biaoxianArray
                    }
                }
            ]
        };
    }
    myChart.setOption(option);

}


//优良率
function EChart_AirAQI(element, title, data1, data2, catagory) {
    AirAQI = echarts.init(document.getElementById(element), 'default');
    option = {
        title: {
            text: title,
            x: "center",
            y: "top",
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                color: '#000'
            },
            padding: 10
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['优良天数', '其他天数'],
            x: 'right',
            top: 30,
            textStyle: {
                color: '#000'
            }
        },
        grid: {
            left: 50,
            right: 50,
            top: 60,
            bottom: 20
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: catagory,
                axisLabel: {
                    textStyle: {
                        color: '#000'
                    }
                }

            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#000'
                    }
                }
            }
        ],
        series: [
            {
                name: '优良天数',
                type: 'bar',
                stack: '优良率',
                data: data1,
                itemStyle: {
                    normal: {
                        color: "#00ff00"
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: function () {

                        }
                    }
                },
            },

            {
                name: '其他天数',
                type: 'bar',
                stack: '优良率',
                data: data2,
                itemStyle: {
                    normal: {
                        color: "#ff0000"
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
            }
        ]
    };
    AirAQI.setOption(option);

}


//获取标线数组
function getbiaoxian(typePolluter) {
    var biaoxian = null;//标线数组
    if (typePolluter == "AQI") {
        biaoxian = [100];
    }
    else if (typePolluter == "PM2.5" || typePolluter == "PM2_5") {
        biaoxian = [75];
    }
    else if (typePolluter == "PM10") {
        biaoxian = [150];
    }
    else if (typePolluter == "NO2") {
        biaoxian = [10];
    }
    else if (typePolluter == "SO2") {
        biaoxian = [10];
    }
    else if (typePolluter == "CO") {
        biaoxian = [1];
    }
    else if (typePolluter == "O3") {
        biaoxian = [200];
    }
    else {
        biaoxian = [0];
    }
    //if (typePolluter == "AQI") {
    //    biaoxian = [50, 100];
    //}
    //else if (typePolluter == "PM2.5") {
    //    biaoxian = [35, 75];
    //}
    //else if (typePolluter == "PM10") {
    //    biaoxian = [50, 150];
    //}
    //else if (typePolluter == "NO2") {
    //    biaoxian = [100, 200];
    //}
    //else if (typePolluter == "SO2") {
    //    biaoxian = [150, 500];
    //}
    //else if (typePolluter == "CO") {
    //    biaoxian = [5, 10];
    //}
    //else if (typePolluter == "O3") {
    //    biaoxian = [160, 200];
    //}
    //else {
    //    biaoxian = [0];
    //}
    return biaoxian;
}


function getfieldvalue(array, fromfield, fromvalue, getvaluefield) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][fromfield] == fromvalue) {
            return array[i][getvaluefield];
        }
    }
    return null;
}


//window.onresize = function () {
//    setTimeout(function () {
//        resetEcharts();
//    }, 1000);
//}
