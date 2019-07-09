/**
 * POI信息.
 */
POI_AirQualityHourStation = {
    /**
     * poi信息.
     */
    JSON: [],

    station: [],

    /**
     * 查询poi点位.
     * @param {string} param - 查询参数.
     */
    searchPOI: function (params, callback) {
        var _this = this;
        params = params || {};

        if (_this.station == null || _this.station.length == 0) {
           
        }

        var time = (params.time || utils.timeFormat.getNowDateString()).split(' ')[0];
        $.ajax({
            type: "POST",
            url: config.service.hjjcService + "/GetStationHourQuaityData",
            data: JSON.stringify({ cityCode: '410100000', timePoint: time, stationCode: "" }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                result = (result && result.d && result.d.trim() != "") ? result.d : "[]";
                var json = eval("(" + result + ")");

                //使value字段值等于要展示的监测类型对应的值
                if (json.length > 0) {
                    var monitorTypeField = params.monitorTypeField || "AQI";
                    for (var i = 0; i < json.length; i++) {
                        json[i]["value"] = json[i][monitorTypeField];
                    }
                    //对数据排序（null值放在最后）,并统一修改无数据字段为字符"-"
                    json = _this.jsonSortByValue(json);
                }

                _this.JSON = json;
                if (callback) {
                    callback(json);
                }
            },
            error: function () {

            }
        });
    },

    /**
     * 加载poi点位.
     * @param {json} json - poi点位信息.
     * @param {object} params - 其他参数.
     */
    mapShowPOI: function (json, params) {
        for (var i = 0; i < json.length; i++) {
            var value;
            if (json[i]["value"] == "-" || json[i]["value"] == "") {
                value = "-";
            }
            else {
                value = Number(json[i]["value"]);
            }

            var monitorTime = json[i]["MonitorTime"] || "";

            var lonlat = station_lon_lat[json[i]["ASCode"]] || {};

            //构建必要属性id,name,lon,lat,value
            var id = json[i]["ASCode"];
            json[i]["p_id"] = id;
            json[i]["p_name"] = json[i]["ASName"];
            json[i]["p_lon"] = lonlat.lon || 0;
            json[i]["p_lat"] = lonlat.lat || 0;
            json[i]["p_value"] = value;
            json[i]["p_urlParam"] = "&time=" + monitorTime + "&code=" + id + "&pointType=" + "station" + "&jianceType=" + params.monitorType || "AQI";
            //其他必要属性etc
            json[i]["p_type"] = params.monitorType || "AQI";
        }
        //构建popWindow参数
        var popWindowUrl = "Panel/AirQualityHour/InfoWindow.html";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        popWindowParam["popHeight"] = 320;
        popWindowParam["popWidth"] = 500;

        //地图加载点位
        mugis.mapClear.clearLabels(["ring"]);
        mugis.mapShowPOI.addPOI("air_City", json, popWindowParam);
    },

    /**
     * 对数据排序（null值放在最后）,并统一修改无数据字段为字符"-".
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    jsonSortByValue: function (json) {
        var jsontSort = [];
        var jsonNULL = [];
        for (var j = 0; j < json.length; j++) {
            var value = json[j]["value"];
            if (typeof (value) == "string" || typeof (value) == "object") {
                if (value == null || value.trim() == "" || value.indexOf('-') > -1 || value.indexOf('—') > -1) {
                    json[j]["value"] = '-';
                    jsonNULL.push(json[j]);
                }
                else {
                    json[j]["rank"] = jsontSort.length + 1;
                    jsontSort.push(json[j]);
                }
            } else if (typeof (value) == "number") {
                if (value == null || value == "") {
                    json[j]["value"] = '-';
                    jsonNULL.push(json[j]);
                }
                else {
                    json[j]["rank"] = jsontSort.length + 1;
                    jsontSort.push(json[j]);
                }
            }
        }
        for (var k = 0; k < jsonNULL.length; k++) {
            jsonNULL[k]["rank"] = jsontSort.length + 1;
            jsontSort.push(jsonNULL[k]);
        }
        return jsontSort;
    }

}