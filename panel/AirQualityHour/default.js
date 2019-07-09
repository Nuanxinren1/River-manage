//station点位类型
var stationType = {
    name: "city",
    searchFunc: citySearchFunc
};

/**
 * 设置当前station点位类型.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function setStationType(stationtype) {
    if (stationtype == "city") {
        stationType = {
            name: "city",
            searchFunc: citySearchFunc
        }
        initThisModel(stationType.name);
    }
    else if (stationtype == "station") {
        stationType = {
            name: "station",
            searchFunc: stationSearchFunc
        }
        initThisModel(stationType.name);
    }
}

/**
 * 设置当前选择的监测物.
 * @param {string} monitortype - 监测物名称类型.
 */
function setMonitorTypeObject(monitortype) {
    stationType.searchFunc.setMonitorTypeObject(monitortype);
}

/**
 * 初始化.
 */
$(function () {
    mugis = parent.mugis;
    mapconfig = parent.mapconfig;
    config = parent.config;
    utilsP = parent.utils;

    //插入监测类型切换,插入时间轴
    if (parent.append_AirQualityHour) {
        parent.append_AirQualityHour.append();
    }

    initThisModel();

    //行点击事件
    $(".poilist .poilist-item").click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active')
        }
    })
    $(".poilist .poilist-item").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    })
});

/**
 * 重复调用的初始化.
 */
function initThisModel(type) {
    //获取城市经纬度
    city_lon_lat = mugis.mapCityInfo.getCityInfoObjectByArray(mapconfig.cityInfo);

    //查询并加载地图点位信息
    stationType.searchFunc.search({}, function (json) {
        //根据查询出的最新时间，对时间轴latest时间处理
        parent.getLatestMonitorTime(json[0]["MonitorTime"]); //'2018-01-31 00:00:00'
    });
}


/**
 * 统计图表类型切换.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function statiscsTypeChange(type) {
    stationType.searchFunc.loadStatiscsInfo(type);
}


/**
 * 统计图表类型切换（onecity）.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function statiscsTypeChange_oneStatiscs(type) {
    stationType.searchFunc.loadStatiscsInfo_oneStatiscs(type);
}

/**
 * 返回到所有点统计页.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function back() {
    stationType.searchFunc.back();
}

/**
 * EChart 创建空气质量AQI-柱状图 .
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function EChart_AirAQI(element, title, category, data) {
    AirAQI = echarts.init($(element)[0], 'default');
    option = {
        title: {
            text: title,
            x: 'center',
            y: 'top',
            textStyle: {
                fontSize: 12,
                fontWeigth: "normal"
                //                  writingMode: 'rtl',                  
            }
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            feature: {
                //magicType: { show: true, type: ['line', 'bar'] },
                saveAsImage: { show: true, title: "保存" }
            }
        },
        calculable: false,//图标是否可拖动
        grid: {
            left: 15,
            right: 15
        },
        xAxis: [
            {
                type: 'category',
                show: true,
                data: category,
                axisLabel: {
                    rotate: -60,
                    interval: 0,
                    textStyle: {
                        fontFamily: 'Arial, Verdana',
                        fontSize: 12,
                        fontWeight: 'normal'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                name: 'AQI指数',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var aqi = params.data;
                            return mugis.airClassify.getAirColorByValue(aqi);
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    }
                },
                data: data

            }
        ]
    };
    AirAQI.setOption(option);
}

/**
 * EChart 创建站点空气质量优良率-饼状图.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function EChart_ExcellentRate(element, title, data) {

    ExcellentRate = echarts.init($(element)[0], 'default');
    option = {

        title: {
            text: title,
            x: 'center',
            y: 'top',
            textStyle: {
                fontSize: 12,
                fontWeigth: "normal"
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'bottom',
            x: 'right',
            y: 'bottom',
            data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { show: true, title: '保存' }
            }

        },
        calculable: false,//图标是否可拖动
        color: mugis.airClassify.airColorClassify,

        series: [
            {
                name: '所占比例',
                type: 'pie',
                radius: [0, 35],
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
                    }
                },
                center: ['38%', '60%']
            }
        ]
    };

    ExcellentRate.setOption(option);

}


//Echart  折线图
function EChart_createAirLine(element, title, category, data, type) {
    var myChart = echarts.init($(element)[0], 'default');
    option = {
        title: {
            text: title,
            x: "center",
            y: "top",
            textStyle: {
                fontSize: 12,
                fontWeight: 'normal'
            },
            padding: 0
        },
        grid: {
            top: 50,
            left: '15%',
            right: '5%'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                //magicType: { show: true, type: ['line', 'bar'] },
                saveAsImage: { show: true, title: '保存' }
            }
        },
        calculable: false,//图标是否可拖动
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: category
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                name: type,
                type: 'line',
                data: data,
                //markPoint: {
                //    data: [
                //        { type: 'max', name: '最大值' },
                //        { type: 'min', name: '最小值' }
                //    ]
                //},
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: "#FF7F50"
                        }
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}



/**
 * 数据查询.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
var POI_AirQualityHour_city = {
    /**
     * 查询poi点位.
     * @param {string} poitype - poitype点位类型:city(null默认),station.
     * @@return undefined
     */
    searchPOI: citySearchFunc.searchPOI,
    /**
     * 加载poi点位.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    mapShowPOI: citySearchFunc.mapShowPOI,
}

/**
 * 数据查询.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
var POI_AirQualityHour_station = {
    /**
     * 查询poi点位.
     * @param {string} poitype - poitype点位类型:city(null默认),station.
     * @@return undefined
     */
    searchPOI: stationSearchFunc.searchPOI,
    /**
     * 加载poi点位.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    mapShowPOI: stationSearchFunc.mapShowPOI,
}