
/*一企一档地址*/
var oneEnterInfoUrl = window.parent._oneEnterInfoUrl;
/*详情页地址*/
var detailHref = "../../DetailHtml/polluterOnLineMonitor.html";

//企业信息
var enterName = '';
var enterCode = '';

//选中选项的名称
var tabName = '时数据';

var selOutputName = '#sel_output';
var selFactorName = '#sel_factor';
var mType = "1";//废水1water、废气2gas

var paramObject;

$(document).ready(function () {
    debugger;
    paramObject = coustomTool.GetURLParams(document.location.href);
    enterName = decodeURI(paramObject.name);
    enterCode = decodeURI(paramObject.id);
    //alert(enterCode);
    //enterCode = '130300164976';//测试废水
    //enterCode = '130300164950';//测试废气

    checkPKExist();

    //初始化排口下拉框
    //outputSelect();

    $(".chaobiao").css("display", "none");

    $("#zxjcTab li").click(function (e) {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        debugger;
        tabName = e.target.textContent;//e.target.innerHTML
        if (tabName == undefined || tabName == '' || tabName == "时数据" || tabName == "日数据" || tabName == "月数据") {
            $(".chaobiao").hide();
            $(".jiance").show();
            $("#chaobiaoDATA").hide();
            $("#jianceDATA").css("display", "table-row");

            query();
        }
        else if (tabName == "超标信息") {
            $(".jiance").hide();
            $(".chaobiao").show();
            $("#jianceDATA").hide();
            $("#chaobiaoDATA").css("display", "table-row");

            showAlarmTable();
        }
    });

    //初始默认时数据详细页
    $('#detailLinkHour').attr("href", detailHref + "?PolSorCode=" + enterCode + "&TimeType=min");
    $('#jianceTJ td label').click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
    })
});

function checkPKExist() {
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "ZXJCService",
        methodName: "GetOutputByEntCode",//获取企业的排口
        params: "EnterCode=" + enterCode
    }, function (result) {
        result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
        var json = eval("(" + result + ")");
        success(json || []);
    })
    .error(function (e) {

        success([]);
    });

    function success(json) {
        debugger;
        var shui = false;
        var qi = false;
        if (json.length > 0) {
            for (var i = 0; i < json.length; i++) {
                if (json[i]["iType"] == 1) {
                    shui = true;
                }
                if (json[i]["iType"] == 2) {
                    qi = true;
                }
            }
        }
        debugger;
        if (!qi) {
            $("#ra_fq").css("display", "none");
            $("#ra_fq_label").css("display", "none");
            $("#ra_fq_label").removeClass('active');
            $("#ra_fs_label").addClass('active');

        }
        else {
            $("#ra_fq").attr("checked", "checked");
        }
        if (!shui) {
            $("#ra_fs").css("display", "none");
            $("#ra_fs_label").css("display", "none");
            $("#ra_fs_label").removeClass('active');
            $("#ra_fq_label").addClass('active');
        }
        else {
            $("#ra_fs").attr("checked", "checked");
        }
        outputSelect();
    }
}

function river_gas_change(idnex) {
    //test
    //if (idnex == 1) {
    //    enterCode = '130300164976';
    //}
    //else {
    //    enterCode = '130300164950';
    //}
    outputSelect();
}

//排口下拉框联动
function selLink() {
    //是否多次绑定（后续解决）
    $(selOutputName).change(function () {
        //清空污染物
        $(selFactorName).empty();
        factorSelect();
    });
}

//排口下拉框填充
function outputSelect() {
    //初始默认查询【时数据】排口与污染物
    var divName = "";
    var loadingDIV = "";
    if (tabName == undefined || tabName == '' || tabName == "时数据") {
        $('#detailLinkHour').attr("href", detailHref + "?PolSorCode=" + enterCode + "&TimeType=hour&entername=" + enterName);
        //获取类型（废水1water或废气2gas）
        mType = $("input[name='ra_fac']:checked").val();
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
        selLink();
    }
    else if (tabName == "日数据") {
        $('#detailLinkDay').attr("href", detailHref + "?PolSorCode=" + enterCode + "&TimeType=day&entername=" + enterName);
        //获取类型（废水1water或废气2gas）
        mType = $("input[name='ra_fac']:checked").val();
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
        selLink();
    }
    else if (tabName == "月数据") {
        $('#detailLinkMonth').attr("href", detailHref + "?PolSorCode=" + enterCode + "&TimeType=month&entername=" + enterName);
        //获取类型（废水1water或废气2gas）
        mType = $("input[name='ra_fac']:checked").val();
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
        selLink();
    }
    else if (tabName == "超标信息") {
        $('#detailLinkalarm').attr("href", "../../DetailHtml/polluterOnlineAlarmMonitor.html?PolSorCode=" + enterCode + "&TimeType=alarm&entername=" + enterName);
        //获取类型（废水1water或废气2gas）
        mType = $("input[name='ra_fac']:checked").val();
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "alarmTab";
        loadingDIV = "chaobiaoDATA";
    }

    var loading = coustomTool.Loading('#' + loadingDIV, '../../IMG/loading/loading.gif');
    //查询数据(methodname接口名称，params传入参数)
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "ZXJCService",
        methodName: "GetOutputByEntCode",//获取企业的排口
        params: "EnterCode=" + enterCode
    }, function (result) {
        coustomTool.UnLoading(loading);
        result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
        var json = eval("(" + result + ")");
        success(json || []);
    })
    .error(function (e) {
        coustomTool.UnLoading(loading);
        success([]);
    });

    function success(json) {
        $(selOutputName).text("");
        $(selFactorName).text("");
        if (json.length > 0) {
            //给排口的下拉框赋值
            var strHtml = "";
            for (var o in json) {
                if (json[o]["iType"] == mType) {
                    strHtml += "<option value='" + json[o]["OutputCode"] + "'>" + json[o]["OutputName"] + "</option>";
                }
            }
            $(selOutputName).html(strHtml);

            if (tabName == "超标信息") {
                setTimeout(function () {
                    $(selFactorName).empty();
                    //初始化污染物下拉框
                    factorSelect();
                });

                //超标数据查询
                //showAlarmTable();
            }
            else {
                $(selFactorName).empty();
                //初始化污染物下拉框
                factorSelect();
            }
        }
        else {
            $(selOutputName).empty();
            $(selFactorName).empty();
            //$("#" + divName).empty();
            EChart_createAirLine(divName, "", [], [], '');
        }
    }

}

//污染物监测因子下拉框填充
function factorSelect(search) {
    var divName = "";
    var loadingDIV = "";
    if (tabName == undefined || tabName == '' || tabName == "时数据") {
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
    }
    else if (tabName == "日数据") {
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
    }
    else if (tabName == "月数据") {
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "jianceDATA";
    }
    else if (tabName == "超标信息") {
        selOutputName = "#sel_output";
        selFactorName = "#sel_factor";
        divName = "div_echart_facHour";
        loadingDIV = "chaobiaoDATA";
    }

    var outputCode = $(selOutputName).val();

    var loading = coustomTool.Loading('#' + loadingDIV, '../../IMG/loading/loading.gif');
    //查询数据(methodname接口名称，params传入参数)
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "ZXJCService",
        methodName: "GetOutputPollutant",//获取排口因子
        params: "EnterCode=" + enterCode + "&OutputCode=" + outputCode
    }, function (result) {
        coustomTool.UnLoading(loading);
        result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
        var json = eval("(" + result + ")");
        success(json || []);
    })
    .error(function (e) {
        coustomTool.UnLoading(loading);
        success([]);
    });

    function success(json) {
        if (json.length > 0) {
            //给污染物监测因子的下拉框赋值
            $(selFactorName).text("");
            var strHtml = "";
            for (var o in json) {
                //污染物下拉框污染物添加单位
                var ItemUnit = json[o]["Unit"] == null ? "" : json[o]["Unit"];
                if (ItemUnit) {
                    strHtml += "<option value='" + json[o]["ItemCode"] + "'>" + json[o]["ItemName"] + "(" + ItemUnit + ")</option>";
                } else {
                    strHtml += "<option value='" + json[o]["ItemCode"] + "'>" + json[o]["ItemName"] + "</option>";
                }
            }
            $(selFactorName).html(strHtml);

            if (tabName == "超标信息") {
                //超标数据查询
                showAlarmTable();
            }
            else {
                //初始化查询
                query();
            }
        }
        else {
            $(selFactorName).empty();
            //$("#" + divName).empty();
            EChart_createAirLine(divName, "", [], [], '');
        }
    }
}


//查询时数据
function query() {
    var unit = "";
    var divName = "";
    var timeType = "";
    var queryTimeService = "";
    var outputCode = "";
    var polltantCode = "";
    var nowDate = "";
    var startTime = "";
    var endTime = "";

    if (tabName == undefined || tabName == '' || tabName == "时数据") {//----------时数据
        timeType = 'hour';
        queryTimeService = "GetHourData";
        divName = "div_echart_facHour";
        outputCode = $('#sel_output').val();
        polltantCode = $('#sel_factor').val();
        //污染物单位
        var obj = document.getElementById("sel_factor");
        if (obj.selectedIndex != '-1') {
            var selText = obj.options[obj.selectedIndex].text;
            unit = selText.match(/\(.+?\)/);
        }
        //var nowDate2 = new Date();
        ////获取当前（终止）时间
        //var endTime = DateFormat(nowDate2, "yyyy-MM-dd hh:mm:ss").substring(0, 13) + ":00:00";
        ////设置开始时间
        //var startTime = DateFormat(getPreDay(nowDate2, 1), "yyyy-MM-dd hh:mm:ss").substring(0, 13) + ":00:00";
        nowDate = new Date();
        endTime = getDateFormat(nowDate);
        //startTime  测试数据从2017-07-15到2017-08-25
        startTime = getDateFormat(getPreDay(nowDate, 1));
        //startTime = '2017-08-11 12:00:00';
        //endTime = '';
    }
    else if (tabName == "日数据") { //---------日数据
        timeType = 'day';
        queryTimeService = "GetDayData";
        divName = "div_echart_facHour";
        outputCode = $('#sel_output').val();
        polltantCode = $('#sel_factor').val();
        //污染物单位
        var obj = document.getElementById("sel_factor");
        if (obj.selectedIndex != '-1') {
            var selText = obj.options[obj.selectedIndex].text;
            unit = selText.match(/\(.+?\)/);
        }
        nowDate = new Date();
        endTime = getDateFormat(nowDate);
        //startTime  测试数据从2017-07-15到2017-08-25
        startTime = getDateFormat(getPreDay(nowDate, 30));
        //var startTime = '';
        //var endTime = '';
    }
    else if (tabName == "月数据") { //---------月数据
        timeType = 'month';
        queryTimeService = "GetMonthData";
        divName = "div_echart_facHour";
        outputCode = $('#sel_output').val();
        polltantCode = $('#sel_factor').val();
        //污染物单位
        var obj = document.getElementById("sel_factor");
        if (obj.selectedIndex != '-1') {
            var selText = obj.options[obj.selectedIndex].text;
            unit = selText.match(/\(.+?\)/);
        }
        nowDate = new Date();
        endTime = getMonthFormat(nowDate);
        //startTime = getMonthFormat(getPreMonth(nowDate, 12)) + "-01";
        startTime = "2017-06-01";
        //var startTime = '';
        //var endTime = '';
    }

    debugger;
    var dateTime = [];
    var polltantData = [];

    var loading = coustomTool.Loading('#' + divName, '../../IMG/loading/loading.gif');
    //查询数据(methodname接口名称，params传入参数)
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "ZXJCService",
        methodName: queryTimeService,//获取小时监测信息
        params: "EnterCode=" + enterCode + "&OutputCode=" + outputCode + "&ItemCode=" + polltantCode + "&MonitorType=" + mType + "&HourTime=" + startTime
    }, function (result) {
        coustomTool.UnLoading(loading);
        result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
        var json = eval("(" + result + ")");
        success(json || []);
    })
    .error(function (e) {
        coustomTool.UnLoading(loading);
        success([]);
    });

    function success(json) {
        if (json.length > 0) {
            for (var o in json) {
                var time = json[o]["MonitorTime"] || "";
                var timeModify = "";
                if (timeType == null || timeType == "" || timeType == "hour") {
                    timeModify = time.substr(0, 16);
                }
                else if (timeType == "day") {
                    timeModify = time.substr(0, 10);
                }
                else if (timeType == "month") {
                    timeModify = time.substr(0, 7);
                }

                dateTime.push(timeModify);
                polltantData.push(json[o]["ItemValue"]);
            }
            //unit = json[0]["Unit"];
            //$("#div_echart").html('');
            //$("#div_echart").html('<div id="div_echart_facHour" style="height:120px"></div>');
            EChart_createAirLine(divName, "", dateTime, polltantData, unit || '');
        }
        else {
            //$("#" + divName).empty();
            EChart_createAirLine(divName, "", [], [], '');
        }
    }
}


//超标数据
function showAlarmTable() {
    var time = $("input[name='time']:checked").val();//1位实时超标数据，2分钟，3小时
    //console.log(time);
    var divName = "div_alarm";
    var startTime = '';
    var endTime = '';


    var nowDate = new Date();
    endTime = getFullFormat(nowDate);

    if (time == "1") {
        startTime = '';
        endTime = '';
    }
    else if (time == "2") {

    }
    else if (time == "3") {

    }

    var outputCode = $(selOutputName).val();//#sel_output
    $.post("../../Ashx/ashx.ashx", {
        serviceName: "ZXJCService",
        methodName: "GetOverData",
        params: "EntCode=" + enterCode + "&OutputCode=" + outputCode + "&MonitorType=" + mType + "&StartTime=" + startTime + "&EndTime=" + endTime
    }, function (result) {
        result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
        if (result != "[]") {
            var json = eval("(" + result + ")");
            $("#alarmTab").html("");
            $("#alarmTab").html("<tr><th>超标污染物</th><th>超标时间</th><th style='border:none;'>超标值</th></tr>");
            for (var o in json) {
                $("#alarmTab").append("<tr><td style='text-align: center;'>" + json[o]["PollutantName"] + "(" + json[o].Unit + ")</td><td style='text-align: center;'>" + json[o]["MonitorTime"] + "</td><td style='text-align: center;'>" + json[o]["ItemValue"] + "</td></tr>");
            }
        }
        else {
            $("#alarmTab").html("");
            $("#alarmTab").html("<tr><th>超标污染物</th><th>超标时间</th><th style='border:none;'>超标值</th></tr>");
        }
    })

}

//Echart  折线图 
function EChart_createAirLine(element, title, category, data, seriename) {
    var myChart = echarts.init(document.getElementById(element), 'default');
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
            top: 10,
            left: '10%',
            right: '10%',
            bottom: 30
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
                name: seriename,
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