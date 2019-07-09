var jianceTypeArray = [{ name: "水质级别", field: "QualityRate" }, { name: "PH", field: "PH" }, { name: "水温", field: "TEMP" }, { name: "溶解氧", field: "DO" }, { name: "氨氮", field: "AD" }, { name: "高锰酸钾指数", field: "KM" }, { name: "电导率", field: "EC" }];
//全局  WQI  category级别  data水质对应数据
var category = new Array();
var data = new Array();

//时间字段
var timeField = "MonitorTime";
//监测物类型
var jianceTypeName = "水质级别";
var jianceTypeField = "QualityRate";
//时间的中文描述
var nameTime = "一年";
//控制表格加载变量  0加载 1不加载
var tableTime = 0;
//参数集合
var paramObject;
//判断查询类型
var valueTime = 0;

$(document).ready(function () {
    paramObject = coustomTool.GetURLParams(document.location.href);
    init();
});

function init() {
    var time = getMonthObject(paramObject.time);
	var startTime="";
	var endTime="";
	endTime=paramObject.time;
	//一年
    if (valueTime == 0) {
		startTime = getMonthFormat(getPreYear(time,1));
    }
	//历史统计  和  优良率
    else if (valueTime == 4||valueTime == 5) {
		startTime = getMonthFormat(getPreYear(time,2));
    }

    initTable();
    setTimeout(function () {
        search(startTime, endTime);
    }, 1000);
}
//填充表格
function initTable() {
    var time = paramObject.time;
    var code = paramObject.sectionCode;
    if (tableTime == 1) {
        return;
    } else {
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "WSService",
            methodName: "GetRiverSegmentsQuaityData",
            params: "RegionCode=532600&TimePoint=" + time + "&RiverCode=&WSCode=" + code
        }, function (result) {
            var json = eval("(" + result + ")");
            json = json.Table;
            //填充表格各监测物的值
            loadJianceData(json);
        });
    }
    function loadJianceData(json) {
        var i = 0;
        if (json && json.length > 0) {
            var div_wqi = (json[i]["QualityRate"] == "" || json[i]["QualityRate"] == null) ? "" : json[i]["QualityRate"].replace("类", "").replace("III", "Ⅲ").replace("II", "Ⅱ").replace("I", "Ⅰ").replace("IV", "Ⅳ").replace("V", "Ⅴ").replace("劣V", "劣Ⅴ");
            var div_ph = (json[i]["PH"] == "" || json[i]["PH"] == null) ? "-" : json[i]["PH"];
            var div_temp = (json[i]["TEMP"] == "" || json[i]["TEMP"] == null) ? "-" : json[i]["TEMP"];
            var div_do = (json[i]["DO"] == "" || json[i]["DO"] == null) ? "-" : json[i]["DO"];
            var div_ad = (json[i]["AD"] == "" || json[i]["AD"] == null) ? "-" : json[i]["AD"];
            var div_10km = (json[i]["KM"] == "" || json[i]["KM"] == null) ? "-" : json[i]["KM"];
            var div_ec = (json[i]["EC"] == "" || json[i]["EC"] == null) ? "-" : json[i]["EC"];

            $("#div_wqi").html(div_wqi);
            $("#div_ph").html(div_ph);
            $("#div_temp").html(div_temp);
            $("#div_do").html(div_do);
            $("#div_ad").html(div_ad);
            $("#div_10km").html(div_10km);
            $("#div_ec").html(div_ec);
        }
    }
}

function search(startTime, endTime) {
    var code = paramObject.sectionCode;
    //var loading = coustomTool.Loading("body", '../../IMG/ICONS/loading/loading.gif');
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "WSService",
        methodName: "GetTimeRiverSegmentsQuaityData",
        params: "CityCode=532600&StartTime=" + startTime + "&EndTime=" + endTime + "&RiveCode=&WSCode=" + code
    },
    function (result) {
        var json = eval("(" + result + ")");
        json = json.Table;
        //coustomTool.UnLoading(loading);
        $("#div_body").css("visibility", "visible");
        //测试数据处理(做数据，使value字段的值等于相应的监测值)
        for (var i = 0; i < json.length; i++) {
            var quality;
            if (jianceTypeField == "QualityRate") {
				if(json[i][jianceTypeField]!=null){
					quality = json[i][jianceTypeField].replace("类", "");
				}                
                if (quality == 'I') {
                    json[i][jianceTypeField] = 'Ⅰ';
                    quality = 10;
                }
                else if (quality == 'II') {
                    json[i][jianceTypeField] = 'Ⅱ';
                    quality = 20;
                }
                else if (quality == 'III') {
                    json[i][jianceTypeField] = 'Ⅲ';
                    quality = 30;
                }
                else if (quality == 'IV') {
                    json[i][jianceTypeField] = 'Ⅳ';
                    quality = 40;
                }
                else if (quality == 'V') {
                    json[i][jianceTypeField] = 'Ⅴ';
                    quality = 50;
                }
                else if (quality == '劣V') {
                    json[i][jianceTypeField] = '劣Ⅴ';
                    quality = 60;
                }
                else {
                    quality = 0;
                }
            } else {
                if (json[i][jianceTypeField] == null || json[i][jianceTypeField] == "") {
                    quality = 0;
                }
                else {
                    quality = json[i][jianceTypeField];
                }
            }
            json[i]["value"] = quality;
        }
        initECharts2(json);
    });
    function initECharts2(json) {
        //debugger;
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
        var maxY = null;//自定义设置纵轴刻度最大值(若标线值不在刻度范围内)
        var yushu1 = Math.floor(jianceValueMax / 100);
        var yushu2 = Math.floor(jianceValueMax / 10);
        var yushu3 = Math.floor(jianceValueMax / 1);
        maxY = yushu1 == 0 ? (yushu2 == 0 ? (yushu3 == 0 ? 1 : yushu3 + 1) : (yushu2 + 1) * 10) : (yushu1 + 1) * 100;

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

//按监测物类型查询
function typeClick(typeF) {
    $("#" + typeF.replace('.', '')).siblings().removeClass("btnselect");
    $("#" + typeF.replace('.', '')).addClass("btnselect");

    jianceTypeField = typeF;
    jianceTypeName = getfieldvalue(jianceTypeArray, "field", typeF, "name");

    init();
}
//按时间查询
function searchCityByID(index, name) {
    $("#" + "searchTime" + index).siblings().removeClass("newbtnac");
    $("#" + "searchTime" + index).addClass("newbtnac");

    valueTime = index;
    if (name) {
        nameTime = name;
    }

    init();
}

function getfieldvalue(array, fromfield, fromvalue, getvaluefield) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][fromfield] == fromvalue) {
            return array[i][getvaluefield];
        }
    }
    return null;
}

//获取标线数组
function getbiaoxian(typePolluter) {
    var biaoxian = null;//标线数组
    if (typePolluter == "QualityRate") {
        biaoxian = [60];
    }
    else if (typePolluter == "PH" || typePolluter == "PM2_5") {
        biaoxian = [20];
    }
    else if (typePolluter == "TEMP") {
        biaoxian = [40];
    }
    else if (typePolluter == "DO") {
        biaoxian = [20];
    }
    else if (typePolluter == "AD") {
        biaoxian = [1];
    }
    else if (typePolluter == "KM") {
        biaoxian = [5];
    }
    else if (typePolluter == "EC") {
        biaoxian = [100];
    }
    else {
        biaoxian = [0];
    }
    return biaoxian;
}

/*----------------------------------------------历年均值-------------------------------------------------*/
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

/*----------------------------------------------优良率-------------------------------------------------*/
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
            obj[year].push(json[i]["QualityRate"]);
        }
        else {
            obj[year].push(json[i]["QualityRate"]);
        }
    }

    var propertys = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propertys.length; i++) {
        var data = obj[propertys[i]];
		var count1=0;
		var count2=0;
		var count3=0;
		var count4=0;
		var count5=0;
		var count6=0;
        var tempValue = null;
        for (var k = 0; k < data.length; k++) {
            tempValue = null;
            tempValue = data[k];
            if (tempValue != null && tempValue != "") {
				if (tempValue.indexOf("劣Ⅴ")>-1) {
					count6++;
				}
			    else if (tempValue.indexOf("Ⅴ")>-1) {
					count5++;
                }
				else if (tempValue.indexOf("Ⅳ")>-1) {
					count4++;
                }
                else if (tempValue.indexOf("Ⅲ")>-1) {
					count3++;
                }
				else if (tempValue.indexOf("Ⅱ")>-1) {
				    count2++;
                }
                else if (tempValue.indexOf("Ⅰ")>-1) {
					count1++;
				}
            }
        }

        var temp = {};
        temp[timeField] = propertys[i];
        temp["I"] = count1;
		temp["II"] = count2;
		temp["III"] = count3;
		temp["IV"] = count4;
		temp["V"] = count5;
		temp["劣V"] = count6;
		temp["其他"] = 12-count1-count2-count3-count4-count5-count6;
		
        sendParam.push(temp);
    }
    return sendParam;
}

function initYLL(json, timefield) {
    nameTime = "一年";
    jianceTypeField = "QualityRate";
    jianceTypeName = "水质级别";

    $("#WQI").siblings().removeClass("btnselect");
    $("#WQI").addClass("btnselect");

    $("#div_echartBar").css("display", "block");
    $("#div_echartLine").css("display", "none");

    var data1 = [];
    var data2 = [];
	var data3 = [];
	var data4 = [];
    var data5 = [];
	var data6 = [];
	var data7 = [];
    var catagory = [];
    for (var i = 0; i < json.length; i++) {
        data1.push(json[i]["I"]);
        data2.push(json[i]["II"]);
		data3.push(json[i]["III"]);
        data4.push(json[i]["IV"]);
		data5.push(json[i]["V"]);
		data6.push(json[i]["劣V"]);
		data7.push(json[i]["其他"]);
        catagory.push(json[i][timefield]);
    }

    EChart_AirAQI("div_echartBar", "近三年地表水站点水质级别各年所占月数",catagory, data1, data2, data3, data4, data5, data6, data7);
}

//优良率
function EChart_AirAQI(element, title, catagory, data1, data2, data3, data4, data5, data6, data7) {
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
			//width: 150,
			// orient: 'vertical',
            data: ['I类', 'II类', 'III类', 'IV类', 'V类', '劣V类', '无类别'],            
			x: 'center',
            top: 30,
            textStyle: {
                color: '#000'
            }
        },
        grid: {
            left: 25,
            right: 20,
            top: 60,
            bottom: 20
        },
        calculable: false,
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
                name: 'I类',
                type: 'bar',
                data: data1,
                itemStyle: {
                    normal: {
                        color: "#14C7F8"
                    }
                },
                label: {
                    normal: {						
                        show: true,
                        position: 'inside',
                        formatter: function () {

                        }
                    },
					emphasis: {
						color: "#000000",
					},
                },
            },

            {
                name: 'II类',
                type: 'bar',
                //stack: '统计月数',
                data: data2,
                itemStyle: {
                    normal: {
                        color: "#15AAF1"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
			{
                name: 'III类',
                type: 'bar',
                //stack: '统计月数',
                data: data3,
                itemStyle: {
                    normal: {
                        color: "#24B462"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
			{
                name: 'IV类',
                type: 'bar',
                //stack: '统计月数',
                data: data4,
                itemStyle: {
                    normal: {
                        color: "#FFD52E"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
			{
                name: 'V类',
                type: 'bar',
                //stack: '统计月数',
                data: data5,
                itemStyle: {
                    normal: {
                        color: "#F97638"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
			{
                name: '劣V类',
                type: 'bar',
                //stack: '统计月数',
                data: data6,
                itemStyle: {
                    normal: {
                        color: "#FF2919"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
			{
                name: '无类别',
                type: 'bar',
                //stack: '统计月数',
                data: data7,
                itemStyle: {
                    normal: {
                        color: "#6E7074"
                    }
                },
                label: {
                    normal: {
						color: "#000000",
                        show: true,
                        position: 'inside'
                    }
                },
            },
        ]
    };
    AirAQI.setOption(option);

}