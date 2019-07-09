//城市点位经纬度对象
var station_lon_lat = {};

var stationInfo = [];

/**
 * 城市.
 */
var stationSearchFunc = {
    //所有点位最新监测评价
    JSON: [],

    //当前监测物类型
    monitorTypeObject: { name: "AQI", field: "AQI", htmlName: "AQI" },

    //监测物类型数组
    monitorTypeArray: [
    { name: "AQI", field: "AQI" },
    { name: "PM2.5", htmlName: "PM<sub>2.5</sub>", field: "PM2_5" },
    { name: "PM10", htmlName: "PM<sub>10</sub>", field: "PM10" },
    { name: "SO2", htmlName: "SO<sub>2</sub>", field: "SO2" },
    { name: "NO2", htmlName: "NO<sub>2</sub>", field: "NO2" },
    { name: "CO", field: "CO" },
    { name: "O3", htmlName: "O<sub>3</sub>", field: "O3" }
    ],

    /**
    * 设置当前选择的监测物.
    * @param {string} monitortype - 监测物名称类型.
    */
    setMonitorTypeObject: function (monitortype) {
        if (monitortype) {
            for (var i = 0; i < this.monitorTypeArray.length; i++) {
                if (this.monitorTypeArray[i].name == monitortype) {
                    this.monitorTypeObject = this.monitorTypeArray[i];
                }
            }
        }

        this.search({ monitorTypeField: this.monitorTypeObject.field });
    },

    /**
     * 查询并加载点位信息.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    search: function (params, callback) {
        var _this = this;

        //如果是在单点统计页，就先回到所有点统计页
        if ($("#citysStatiscs").css("display") == "none") {
            $("#cityStatiscs").css("display", "none");
            $("#citysStatiscs").css("display", "block");
        }

        //查询站点坐标
        $.ajax({
            type: "POST",
            url: config.service.hjjcService + "/GetStationInfo",
            data: JSON.stringify({ regionCode: '410100000', stationCode: "", stationName: "" }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                result = (result && result.d && result.d.trim() != "") ? result.d : "[]";
                var json = eval("(" + result + ")");
                stationInfo = json;
                for (var i = 0; i < json.length; i++) {
                    var jsonObject = json[i];
                    var sCood = {};
                    sCood.lon = jsonObject["Longitude"];
                    sCood.lat = jsonObject["Latitude"];
                    station_lon_lat[jsonObject["ASCode"]] = sCood;
                    console.log(stationInfo);
                    console.log(station_lon_lat);
                }
            }
        });

        //查询点位实时监测值信息
        POI_AirQualityHourStation.searchPOI(params, function (json) {
            //保存全局变量
            _this.JSON = json;

            if (callback) {
                callback(json);//回调时间轴的处理方法
            }

            //设置数据最新更新时间
            var monitorTime = (json && json[0] && json[0]["MonitorTime"]) ?
                    json[0]["MonitorTime"] : "-";
            $("#citysStatiscsDesc .title p").html("数据更新时间：" + monitorTime);

            //加载统计图表
            _this.loadStatiscsInfo(json);
            //加载列表展示
            _this.tableShow(json);
            //加载poi点位
            POI_AirQualityHourStation.mapShowPOI(json);
        });
    },

    /**
     * 加载统计图表.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    loadStatiscsInfo: function (statiscsType) {
        statiscsType = statiscsType || "desc";

        json = this.JSON || [];

        //描述页
        var sum = 0;
        var average = 0;
        var count = 0;
        var monitorTime = (json && json[0] && json[0]["MonitorTime"]) ?
                    json[0]["MonitorTime"] : "-";

        //柱状图
        var data = new Array();
        var category = new Array();

        //等级
        var level1 = new Array();
        var level2 = new Array();
        var level3 = new Array();
        var level4 = new Array();
        var level5 = new Array();
        var level6 = new Array();
        var levelNULL = new Array();

        for (var i = 0; i < json.length; i++) {
            //柱状图
            var value;
            var city = json[i]["ASName"];
            if (json[i]["value"] == null || json[i]["value"] == "" || json[i]["value"] == "-" || json[i]["value"] == "—") {
                value = 0;
                count++;
            }
            else {
                value = Number(json[i]["value"]);
                sum += value;
                count++;
            }
            data.push(value);
            category.push(city);

            //分级
            var quality = mugis.airClassify.getAirQualityByValue(value, this.monitorTypeObject.name);
            if (quality == null || quality == "" || quality == "-" || quality == "—") {
                levelNULL.push(json[i]);
            }
            else if (quality == "Ⅰ" || quality == "Ⅰ类" || quality == "优") {
                level1.push(json[i]);
            }
            else if (quality == "Ⅱ" || quality == "Ⅱ类" || quality == "良") {
                level2.push(json[i]);
            }
            else if (quality == "Ⅲ" || quality == "Ⅲ类" || quality == "轻度污染") {
                level3.push(json[i]);
            }
            else if (quality == "Ⅳ" || quality == "Ⅳ类" || quality == "中度污染") {
                level4.push(json[i]);
            }
            else if (quality == "Ⅴ" || quality == "Ⅴ类" || quality == "重度污染") {
                level5.push(json[i]);
            }
            else if (quality == "劣Ⅴ" || quality == "劣Ⅴ类" || quality == "严重污染") {
                level6.push(json[i]);
            }
        }

        //饼状图
        var piedata = new Array();
        if (level1.length >= 0) {
            piedata.push({ 'name': '优', 'value': level1.length });
        }
        if (level2.length >= 0) {
            piedata.push({ 'name': '良', 'value': level2.length });
        }
        if (level3.length >= 0) {
            piedata.push({ 'name': '轻度污染', 'value': level3.length });
        }
        if (level4.length >= 0) {
            piedata.push({ 'name': '中度污染', 'value': level4.length });
        }
        if (level5.length >= 0) {
            piedata.push({ 'name': '重度污染', 'value': level5.length });
        }
        if (level6.length >= 0) {
            piedata.push({ 'name': '严重污染', 'value': level6.length });
        }
        if (level6.length >= 0) {
            piedata.push({ 'name': '无数据', 'value': levelNULL.length });
        }

        //先隐藏所有统计面板
        $("#citysStatiscsInfo > div").css("display", "none");

        //柱状图排名统计
        if (statiscsType == "sort") {
            $("#citysStatiscsInfo #citysStatiscsSort").css("display", "block");
            EChart_AirAQI("#citysStatiscsInfo #citysStatiscsSort", monitorTime + '各城市AQI排名', category, data);
        }
            //饼状图优良率统计
        else if (statiscsType == "ratio") {
            $("#citysStatiscsInfo #citysStatiscsRatio").css("display", "block");
            EChart_ExcellentRate("#citysStatiscsInfo #citysStatiscsRatio", monitorTime + '各城市优良率统计', piedata);
        }
            //描述页
        else {
            $("#citysStatiscsInfo #citysStatiscsDesc").css("display", "block");

            if (sum) {
                average = (sum / (count));
                if (average < 1) {
                    average = average.toFixed(1);
                }
                else {
                    average = average.toFixed(0);
                }
            }

            //城市名
            $("#citysStatiscsDesc .title h2").html(mapconfig.cityInfo[0].cityName);
            //监测类型名
            $("#citysStatiscsDesc ul .value span").html((this.monitorTypeObject.htmlName || this.monitorTypeObject.name) + "均值");
            //监测值
            $("#citysStatiscsDesc ul .value div").html(average);
            //监测评价描述
            $("#citysStatiscsDesc ul .level div").html(mugis.airClassify.getAirQualityByValue(average, this.monitorTypeObject.name));
            //监测点位个数
            $("#citysStatiscsDesc ul .count div").html(count);

            //设置空气质量颜色
            var color = mugis.airClassify.getAirColorByValue(average, this.monitorTypeObject.name);
            $(".statiscsDesc ul span").css({
                'border-color': color,
                'color': color
            });
            $(".statiscsDesc ul div").css({
                'border-color': color,
                'color': color
            });
        }
    },

    /**
     * 加载列表展示.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    tableShow: function (json) {
        //var a = '<liclass="poilist-item"><divclass="left"><ahref="javascript:void(0)"class="poiImgpoiImg-1"></a></div><divclass="right"><h2class="pollutionIndex">86</h2><spanclass="pollutionClass">轻度污染</span></div><divclass="middlepoilist-item-middle"><divclass="rowline"><h3class="stationName">洛阳市</h3></div><divclass="rowline">AQI:<ahref="javascript:void(0)"class="aqi">NO.2</a></div><divclass="rowline">首要污染物:<spanclass="contaminants"title="PM2.5、SO2、NO2、PM2.5、SO2、NO2">PM2.5、SO2、NO2、PM2.5、SO2、NO2</span></div></div></li>';

        //var listHtml = "";
        //for (var i = 0; i < json.length; i++) {
        //    listHtml += '<li class="poilist-item"><div class="left"><a href="javascript:void(0)" class="poiImg poiImg-' + (i + 1) + '"></a></div><div class="right"><h2 class="pollutionIndex">' + json[i]["value"] + '</h2><span class="pollutionClass"  style="background-color: ' + mugis.airClassify.getAirColorByValue(json[i]["value"], this.monitorTypeObject.name) + ';">' + mugis.airClassify.getAirQualityByValue(json[i]["value"], this.monitorTypeObject.name) + '</span></div><div class="middle poilist-item-middle"><div class="rowline"><h3 class="stationName">' + json[i]["CityName"] + '</h3></div><div class="rowline">AQI:<a href="javascript:void(0)"class="aqi">NO.2</a></div><div class="rowline">首要污染物:<span class="contaminants" title="PM2.5、SO2、NO2、PM2.5、SO2、NO2">PM2.5、SO2、NO2、PM2.5、SO2、NO2</span></div></div></li>';
        //}
        //$(".poilist").html(listHtml);


        var _this = this;
        //[{"CityCode":"410100000","CityName":"郑州市","MonitorTime":"2017-09-07 00:00:00","PM2_5":17.0,"PM10":42.0,"SO2":22.0,"NO2":25.0,"CO":0.6,"O3":67.0,"AQI":null,"QualityRate":null,"PrimaryPollutant":null}]

        var data = new Array();
        for (var i = 0; i < json.length; i++) {
            if (true) {//checkInRegion(json[i]["REGION_CODE"])
                var object = new Object();
                object["rank"] = json[i]["rank"];
                object["code"] = json[i]["ASCode"];
                object["name"] = json[i]["ASName"];
                object["aqi"] = json[i]["value"];
                object["quality"] = mugis.airClassify.getAirQualityByValue(json[i]["value"], this.monitorTypeObject.name);
                object["main"] = json[i]["PrimaryPollutant"];
                var lonlat = station_lon_lat[json[i]["ASCode"]] || {};
                object["lon"] = (lonlat == null || lonlat == undefined) ? 0 : lonlat.lon;
                object["lat"] = (lonlat == null || lonlat == undefined) ? 0 : lonlat.lat;
                data.push(object);
            }
        }

        var columns = [
        {
            field: 'rank',
            title: '排名',
            align: 'center',
            valign: 'middle',
            width: 40,
            sortable: false
        },
        {
            field: 'name',
            title: '站点',
            align: 'center',
            valign: 'middle',
            sortable: false
        },
        {
            field: 'aqi',
            title: '监测值',
            align: 'center',
            valign: 'middle',
            sortable: false
        },
        {
            field: 'quality',
            title: '空气质量',
            align: 'center',
            valign: 'middle',
            sortable: false,
            formatter: function (value) {
                if (value) {
                    var color = mugis.airClassify.getAirColorByQuality(value, _this.monitorTypeObject.name);
                    return "<span class='descpanel' style = 'background:" + color + ";padding:5px 15px;border-radius:5px;color:#fff;'>" + value + "</span>";
                }
            }
        }
        ];
        utils.tableInit.initTable("#airCityTable", null, data, columns, null, false, stationSearchFunc.onClickRow);
    },

    //各城市列表排名行点击
    onClickRow: function (row, ele) {
        //从单点统计页跳转到所有点统计页
        $("#citysStatiscs").css("display", "none");
        $("#cityStatiscs").css("display", "block");

        var cityName = row["name"];
        $("#cityStatiscsDesc .title h3").html(cityName);

        //查询并加载单个点位信息
        stationSearchFunc.searchOneData(row["code"]);

        //居中定位
        var lon = row["lon"];
        var lat = row["lat"];
        mugis.mapZoom.centerAtAndZoom(lon, lat, 9);
    },


    //当前选中的单点点位监测信息
    oneJson: {},

    /**
     * 查询并加载单个点位信息.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    searchOneData: function (code) {
        debugger;
        var json = {};
        var jsons = this.JSON;
        for (var i = 0; i < jsons.length; i++) {
            if (jsons[i]["ASCode"] == code) {
                json = jsons[i];
                continue;
            }
        }

        //当前选中的单点点位信息
        this.oneJson = json;

        //加载描述信息（单点）
        this.loadStatiscsInfo_oneDesc(json);
        //加载统计图表（单点）
        this.loadStatiscsInfo_oneStatiscs();
    },

    /**
     * 加载描述信息（单点）.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    loadStatiscsInfo_oneDesc: function (json) {
        //填充数据最新更新时间
        var monitorTime = (json && json["MonitorTime"]) ?
                json["MonitorTime"] : "-";
        $("#cityStatiscsDesc .title p").html("数据更新时间：" + monitorTime);

        //监测类型名
        $("#cityStatiscsDesc ul .value span").html((this.monitorTypeObject.htmlName || this.monitorTypeObject.name) + "值");
        //监测值
        $("#cityStatiscsDesc ul .value div").html(json["value"]);
        //监测评价描述
        $("#cityStatiscsDesc ul .level div").html(mugis.airClassify.getAirQualityByValue(json["value"], this.monitorTypeObject.name));
        //排名
        $("#cityStatiscsDesc ul .rank div").html('1');
    },

    /**
     * 加载统计图表（单点）search.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    loadStatiscsInfo_oneStatiscs: function (statiscsType) {
        var _this = this;

        var searchcode = this.oneJson["ASCode"];
        var endTime = this.oneJson["MonitorTime"];
        var startTime = utils.timeFormat.addDay(endTime, -7);

        $.ajax({
            type: "POST",
            url: config.service.hjjcService + "/GetCityDayQuaityData_Times",
            data: JSON.stringify({ cityCode: '410100000', startTime: startTime, endTime: endTime }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                result = (result && result.d && result.d.trim() != "") ? result.d : "[]";
                var json = eval("(" + result + ")");

                //使value字段值等于要展示的监测类型对应的值
                if (json.length > 0) {
                    for (var i = 0; i < json.length; i++) {
                        json[i]["value"] = json[i][_this.monitorTypeObject.field];
                    }
                }

                _this.loadStatiscsInfo_oneStatiscs_Then(json, statiscsType);
            },
            error: function () {

            }
        });

    },

    /**
     * 加载统计图表（单点）then.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    loadStatiscsInfo_oneStatiscs_Then: function (json, statiscsType) {
        statiscsType = statiscsType || "ratio";

        //折线图
        var category = new Array();
        var data = new Array();

        //等级
        var level1 = [];
        var level2 = [];
        var level3 = [];
        var level4 = [];
        var level5 = [];
        var level6 = [];
        var levelNULL = [];

        for (var i = 0; i < json.length; i = i + 3) {
            //折线图
            var value = json[i]["value"];
            if (value == null || value == "" || value == "-" || value == "—") {
                value = 0;
            }
            var dateTime = json[i]["MonitorTime"].substring(0, 10);
            category.push(dateTime);
            data.push(Number(value));

            //分级
            var quality = mugis.airClassify.getAirQualityByValue(value, this.monitorTypeObject.name);
            if (quality == null || quality == "" || quality == "-" || quality == "—") {
                levelNULL.push(json[i]);
            }
            else if (quality == "Ⅰ" || quality == "Ⅰ类" || quality == "优") {
                level1.push(json[i]);
            }
            else if (quality == "Ⅱ" || quality == "Ⅱ类" || quality == "良") {
                level2.push(json[i]);
            }
            else if (quality == "Ⅲ" || quality == "Ⅲ类" || quality == "轻度污染") {
                level3.push(json[i]);
            }
            else if (quality == "Ⅳ" || quality == "Ⅳ类" || quality == "中度污染") {
                level4.push(json[i]);
            }
            else if (quality == "Ⅴ" || quality == "Ⅴ类" || quality == "重度污染") {
                level5.push(json[i]);
            }
            else if (quality == "劣Ⅴ" || quality == "劣Ⅴ类" || quality == "严重污染") {
                level6.push(json[i]);
            }
        }

        //饼状图
        var piedata = new Array();
        if (level1.length >= 0) {
            piedata.push({ 'name': '优', 'value': level1.length });
        }
        if (level2.length >= 0) {
            piedata.push({ 'name': '良', 'value': level2.length });
        }
        if (level3.length >= 0) {
            piedata.push({ 'name': '轻度污染', 'value': level3.length });
        }
        if (level4.length >= 0) {
            piedata.push({ 'name': '中度污染', 'value': level4.length });
        }
        if (level5.length >= 0) {
            piedata.push({ 'name': '重度污染', 'value': level5.length });
        }
        if (level6.length >= 0) {
            piedata.push({ 'name': '严重污染', 'value': level6.length });
        }
        if (level6.length >= 0) {
            piedata.push({ 'name': '无数据', 'value': levelNULL.length });
        }

        //先隐藏所有统计面板
        $("#cityStatiscsInfo > div").css("display", "none");

        //折线图最近趋势统计
        if (statiscsType == "line") {
            $("#cityStatiscsInfo #cityStatiscsLine").css("display", "block");
            EChart_createAirLine('#cityStatiscsInfo #cityStatiscsLine', "过去7天AQI情况", category, data);
        }
            //饼状图优良率统计
        else if (statiscsType == "ratio") {
            $("#cityStatiscsInfo #cityStatiscsRatio").css("display", "block");
            EChart_ExcellentRate('#cityStatiscsInfo #cityStatiscsRatio', '最近七天优良率统计', piedata);
        }
    },

    /**
     * 返回到所有点统计页.
     */
    back: function () {
        //从所有点统计页跳转到单点统计页
        $("#cityStatiscs").css("display", "none");
        $("#citysStatiscs").css("display", "block");
    },
}