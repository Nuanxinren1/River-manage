//1.	EntCode:130300164943
//2.	EntName:"中节能淇县水务有限公司"
//3.	IfGasEnterprise:1
//4.	IfOnlineMonitoringEnt:1
//5.	IfWaterEnterprise:0
//6.	OnlineStatus:1
//7.	RegionCode:611001000
//8.	RegionName:"市辖区"
//9.	SuperviseType:1
//10.	basinCode:"0100000000"
//11.	clusterId:2
//12.	p_address:"鹤壁市淇县南杨庄村东300米"
//13.	p_id:130300164943
//14.	p_lat:33.583943
//15.	p_lon:109.966672
//16.	p_name:"中节能淇县水务有限公司"
//17.	tradeCode:"AF"
//18.	tradeName:"其他"



//全局变量
var curPageIndex = 1; //1-统计，2-查询
var btnTypeIndex = 1;
//初始界面
var curSelecterTril = "#div_s1 ";
//聚合图初始展示
var is_cluster = true;
//热力图初始展示
var is_heatmap = true;
//判断是否有图形查询
var geometry;

var cityinfo = _CityInfo;

var polluterKZJB = [
    { name: "国控", value: "01", field: "SuperviseType" },
    { name: "省控", value: "02", field: "SuperviseType" },
    { name: "市控", value: "03", field: "SuperviseType" }
];

var colorY = "#6FBE09";
var colorL = "#FBD12A";
var colorQDWR = "#FFA641";
var colorZDWR = "#EB5B13";
var colorZHDWR = "#960453";
var colorYZWR = "#580422";
var colorNULL = "#B9B4B4";

var legendJson = {
    "污染源图例": [
        { img: "IMG/points/polluterGeneral/国控.png", name: "国控" },
        { img: "IMG/points/polluterGeneral/省控.png", name: "省控" },
        { img: "IMG/points/polluterGeneral/市控.png", name: "市控" },
        { img: "IMG/points/polluterGeneral/其他.png", name: "其他" }
    ]
};

var SupTypeName = ['国控', '省控', '市控', '其他'];
var polluter_total = []; //所有污染源
var polluter_online = []; //在线监测污染源
var ifOnline = true;  //页面是否默认为在线监测企业

//监管类别统计
var poll_total = [];
var poll_levelOne = [];
var poll_levelTwo = [];
var poll_levelThree = [];

$(function () {
    //设置图标按钮默认状态
    setUpBtn();
    //初始化区县下拉框
    initRegionSelect();
    //初始化行业下拉框
    initKZJBSelect();

    searchDefaultData();
    switchTotalAndQuery();

    window.parent.MapUniGIS.MapLegend.mapShowLegend(legendJson);
});

//设置图标按钮默认状态
function setUpBtn() {
    if (ifOnline) {
        $(".switch_btn").append('<img src="../../IMG/checkbox/On_1.png" alt="" />');
        $(".switch_btn img").addClass("switch_btn_On");
    } else {
        $(".switch_btn").append('<img src="../../IMG/checkbox/Off_1.png" alt="" />');
        $(".switch_btn img").addClass("switch_btn_Off");
    }

    document.getElementById("check_isJuhe").checked = is_cluster;
    document.getElementById("check_isRender").checked = is_heatmap;
    $("#check_isJuhe").bind("change", isJuheFun);
    $("#check_isRender").bind("change", showHotMap);
    $("#citysName").html(window.parent.defaultRegionName_QX);
}

//重置搜索页面选框项
function resetSearchSelectItem() {
    $("#select_region").val("-1");
    $("#select_kzjb").val("-1");
    $("#select_kzjb").val("-1");
    $("#select_trade").val('-1');
    $("#txt_entername").val("");
}

//区县选择初始化
function initRegionSelect() {
    $("#select_region").val("-1");
    var selHtml = "";
    for (var i = 1; i < cityinfo.length; i++) {
        var perRegion = cityinfo[i];
        selHtml += "<option value='" + perRegion.cityCodeSub + "'>" + perRegion.cityName + "</option>";
    }
    $("#select_region").append(selHtml);
}

//控制级别选择初始化
function initKZJBSelect() {
    $("#select_kzjb").val("-1");
    var selHtml = "";
    for (var i = 0; i < polluterKZJB.length; i++) {
        var perRegion = polluterKZJB[i];
        selHtml += "<option value='" + perRegion.value + "'>" + perRegion.name + "</option>";
    }
    $("#select_kzjb").append(selHtml);
}

//在线检测切换按钮
function switchBtnClick(t) {
    if ($(t).find('img').hasClass("switch_btn_On")) {
        $(t).find('img').attr('src', '../../IMG/checkbox/Off_1.png');
        $(".switch_btn img").removeClass("switch_btn_On").addClass("switch_btn_Off");
        ifOnline = false;
    }
    else {
        $(t).find('img').attr('src', '../../IMG/checkbox/On_1.png');
        $(".switch_btn img").removeClass("switch_btn_Off").addClass("switch_btn_On");
        ifOnline = true;
    }
    searchDefaultData();
}

//点位聚合
function isJuheFun(event) {
    //if (event.target.checked == true) {
    //    is_cluster = true;
    //    window.parent.pointCluster("polluter_general", is_cluster);
    //    window.parent.map_FullExtent();
    //}
    //else {
    //    is_cluster = false;
    //    window.parent.pointCluster("polluter_general", is_cluster);
    //}
    is_cluster = event.target.checked;
    window.parent.ClusterLyr.pointCluster("polluter_general", is_cluster);
}

//显示热力图
function showHotMap(event) {
    //var flag = false;
    //if (event.target.checked == true) {
    //    flag = true;
    //} else {
    //    flag = false;
    //}
    //parent.drawGraphicsLayer.setVisibility(!flag);
    //var hotMapLayer = parent.map.getLayer("GL_HeatMap_polluter_general");
    //if (hotMapLayer) {
    //    hotMapLayer.setVisibility(flag);
    //}
    is_heatmap = event.target.checked;
    window.parent.HeatMap.controlHeatMap("polluter_general", is_heatmap);
}

//统计页面图标类型改变切换图表
function tjChartsTypeChange(index) {
    switch (index) {
        case "pie":
            $("#echarts_tj_bar").css('display', 'none');
            $("#echarts_tj_desc").css('display', 'none');
            $("#echarts_tj_pie").css('display', 'block');
            EChart_ExcellentRate("#echarts_tj_pie", "各监管类别污染源数量统计", SupTypeName, dataStatisticFunc.SupTypeCategory);
            break;
        case "bar":
            $("#echarts_tj_bar").css('display', 'block');
            $("#echarts_tj_desc").css('display', 'none');
            $("#echarts_tj_pie").css('display', 'none');
            EChart_createPollColumn("#echarts_tj_bar", "各地市污染源数据量统计", dataStatisticFunc.regNameCategory, dataStatisticFunc.numByRegCategory);
            break;
        case "desc":
            $("#echarts_tj_desc").css('display', 'block');
            $("#echarts_tj_bar").css('display', 'none');
            $("#echarts_tj_pie").css('display', 'none');
            break;
    }
}

//某个范围生成随机数
function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

//查询默认数据
function searchDefaultData() {
    //debugger;    
    var loading = coustomTool.Loading("body", '../../IMG/loading/loading.gif');
    if (ifOnline) {//ifOnline   true
        //查询数据(methodname接口名称，params传入参数)
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "ZXJCService",
            methodName: "GetEnterList",
            params: "EntCode=&EntName=&regionCode=&tradeCode=&SuperviseType=&onlineEnterprise="
        }, function (result) {
            result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
            var json = eval("(" + result + ")");
            coustomTool.UnLoading(loading);

            //修改经纬度(测试)
            json[0].p_lon = 104.407;
            json[0].p_lat = 24.021;
            for (var i = 1; i < json.length; i++) {
                json[i].p_lon = Math.random() * 2 + 103.5;
                json[i].p_lat = Math.random() * 2 + 22.5;
            }

            success(json || []);
        })
            .error(function (e) {
                coustomTool.UnLoading(loading);
                success([]);
            });
    }
    else {
        $.getJSON("polluterJson2.json", function (data) { //获取数据
            coustomTool.UnLoading(loading);
            var json = data.rows;
            success(json || []);
        });
    }
    function success(json) {
        polluter_total = json;  //附全局变量，保存所有污染源数据
        if (ifOnline) { //若当前页面为在线
            var onlineFilt = [];
            for (var i = 0; i < json.length; i++) {
                if (json[i]["IfOnlineMonitoringEnt"] == 1) {
                    onlineFilt.push(json[i]);
                }
            }
            polluter_online = onlineFilt;
        }
        initialPage();
    }
}

//初始化页面
function initialPage() {
    var panelData = polluter_total; //页面加载的数据
    if (ifOnline) { //若当前页面为在线
        panelData = polluter_online;
    }
    if (curPageIndex == 1) { //数据统计面板
        dataStatisticFunc.mapShow(panelData, is_cluster); //全部污染源点位展示
        dataStatisticFunc.dataStatistic(panelData); //图表展示
    } else { //数据查询面板
        window.parent.ClusterLyr.pointCluster("polluter_general", false);
        //window.parent.mapLayerRemove("GL_Widgets_PointCover_polluter_general"); //移除统计页面污染源点位图层
        polluterDataQuery.initialPanel(panelData);
    }
}




//数据统计
var dataStatisticFunc = {
    SupTypeCategory: [], //监管类别数量统计
    regNameCategory: [],  //区县名称集合
    numByRegCategory: [],  //区县污染源数量统计
    //地图点位展示
    mapShow: function (json) {

        //for (var i = 0; i < 3000; i++) {
        //    var json1 = json[i % json.length];
        //    //json1.p_lon += Math.random();
        //    //json1.p_lat += Math.random();
        //    json.push(json1);
        //}

        var urlParam = new Object();
        for (var i = 0; i < json.length; i++) {
            json[i]["p_name"] = json[i]["EntName"];
            json[i]["p_id"] = json[i]["EntCode"];
            json[i]["p_lon"] = json[i]["p_lon"];
            json[i]["p_lat"] = json[i]["p_lat"];
            json[i]["heatmap"] = 1;
            //urlParam[json[i]["EntCode"]] = "&name=" + json[i]["EntName"] + "&code=" + json[i]["EntCode"];
            var type = "";
            if (ifOnline) {
                type = "online";
                urlParam[json[i]["EntCode"]] = "&name=" + json[i]["EntName"] + "&code=" + json[i]["EntCode"] + "&type=" + type + "&lon=" + json[i]["p_lon"] + "&lat=" + json[i]["p_lat"];
            }
            else {
                type = "allEnt";
                urlParam[json[i]["EntCode"]] = "&name=" + json[i]["EntName"] + "&code=" + json[i]["EntCode"] + "&type=" + type + "&lon=" + json[i]["p_lon"] + "&lat=" + json[i]["p_lat"];
            }
        }

        var popWindowUrl = "Panel/Polluter/InfoWindow.html";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = urlParam;
        popWindowParam["popHeight"] = 180;
        popWindowParam["popWidth"] = 300;
        window.parent.MapUniGIS.mapShowPOI.addPOI("polluter_general", json, popWindowParam);
        window.parent.ClusterLyr.pointCluster("polluter_general", is_cluster);
    },
    //图表展示
    dataStatistic: function (json) {
        debugger;
        var cityObject = {}; //按行政区划分类
        var SupTypeF = []; //按监管类别分类
        var SupTypeS = [];
        var SupTypeT = [];
        var SupTypeNull = [];

        for (var i = 1; i < cityinfo.length; i++) {
            cityObject[cityinfo[i].cityCodeSub] = {
                cityCode: cityinfo[i].cityCode,
                cityCodeSub: cityinfo[i].cityCodeSub,
                cityName: cityinfo[i].cityName,
                lon: cityinfo[i].lon,
                lat: cityinfo[i].lat,
                data: [],
                count: 0
            };
        }

        //污染源按区县分类
        var secondCityCodeSubLength = window.parent._secondCityCodeSubLength;//cityinfo[cityinfo.length-1].cityCodeSub.length       window.parent._secondCityCodeSubLength
        for (var i = 0; i < json.length; i++) {
            var jsonicode = json[i]["RegionCode"];
            jsonicode = (jsonicode != null) ? jsonicode.toString().trim() : "";
            jsonicode = jsonicode.substr(0, secondCityCodeSubLength);//污染源位数处理
            if (cityObject[jsonicode] != null) {
                cityObject[jsonicode].data.push(json[i]);
            }
        }

        //污染源按监管类别分类
        for (var i = 0; i < json.length; i++) {
            if (json[i]["SuperviseType"] == "01") {
                SupTypeF.push(json[i]);
            } else if (json[i]["SuperviseType"] == "02") {
                SupTypeS.push(json[i]);
            } else if (json[i]["SuperviseType"] == "03") {
                SupTypeT.push(json[i]);
            } else {
                SupTypeNull.push(json[i]);
            }
        }

        //监管数据概况
        $("#poll_total").html(json.length);
        $("#poll_levelOne").html(SupTypeF.length);
        $("#poll_levelTwo").html(SupTypeS.length);
        $("#poll_levelThree").html(SupTypeT.length);

        //存储不同监管级别的数据
        poll_total = json;
        poll_levelOne = SupTypeF;
        poll_levelTwo = SupTypeS;
        poll_levelThree = SupTypeT;

        //表格数据准备
        var regionNameArr = []; //区县名称集合   柱状图
        var countData = [];     //区县污染源统计数量集合    柱状图
        var tableJson = [];     //区县列表统计  表格
        var tableOrder = 0;     //行序号

        //debugger;
        for (var perRegion in cityObject) {
            tableOrder++;
            var perRegionData = cityObject[perRegion];
            //柱状图
            regionNameArr.push(perRegionData["cityName"]);
            countData.push(perRegionData.data.length);
            //表格
            tableJson.push({
                "order": tableOrder,
                "regionName": perRegionData["cityName"],
                "regionCode": perRegionData["cityCode"],
                "regionCodeSub": perRegion,
                "number": perRegionData.data.length
            });
        }

        //柱状图全局变量存储
        dataStatisticFunc.regNameCategory = regionNameArr;
        dataStatisticFunc.numByRegCategory = countData;

        //饼状图数据准备
        var supTypeStaData = [];
        if (SupTypeF.length > 0) {
            supTypeStaData.push({ value: SupTypeF.length, name: '国控' });
        }
        if (SupTypeS.length > 0) {
            supTypeStaData.push({ value: SupTypeS.length, name: '省控' });
        }
        if (SupTypeT.length > 0) {
            supTypeStaData.push({ value: SupTypeT.length, name: '市控' });
        } if (SupTypeNull.length > 0) {
            supTypeStaData.push({ value: SupTypeNull.length, name: '其他' });
        }
        dataStatisticFunc.SupTypeCategory = supTypeStaData;

        //区县个数统计列表加载
        dataStatisticFunc.loadTableGrid(tableJson);
    },
    //污染源区县统计列表加载
    loadTableGrid: function (json) {
        var columns = [
            {
                field: 'order',
                title: "序号",
                align: 'center',
                valign: 'middle',
                width: 45,
                sortable: false
                //formatter: function (value, row, index) {
                //    return index + 1;
                //}
            },
            {
                field: 'regionCode',
                title: "城市",
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: false
            },
            {
                field: 'regionName',
                title: "城市",
                align: 'center',
                valign: 'middle',
                sortable: false
                //formatter: function (value) {
                //    return "<div class='autoCut' style='width:82px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;' title='" + value + "'>" + value + "</div>";
                //}
            },
            {
                field: 'number',
                title: "数量",
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    return "<span style='font-weight:bold'>" + value + "家</span>";
                }
            },
            {
                field: 'regionCodeSub',
                title: "区县编码",
                align: 'center',
                valign: 'middle',
                sortable: false,
                visible: false,
            }
            //,
           //{
           //    field: 'statistic',
           //    title: "统计",
           //    align: 'center',
           //    valign: 'middle',
           //    sortable: false,
           //    formatter: function (value) {
           //        return "<img style='width:23px;height:23px;cursor: pointer;' onclick=\'dataStatisticFunc.tradeButClick(this)\' value='" + value + "' src='../../IMG/chart/pie_chart2.png'/>"
           //    }
           //}

        ];
        var height = $(window).height();
        var top = $(curSelecterTril + "#echarts_tj").offset().top + $(curSelecterTril + "#echarts_tj")[0].clientHeight;
        var tableHeight = tableHeight = height - top - 50;
        var dataGrid = coustomTool.craeteDataGrid("#datatable_tj_sort", null, json, columns, tableHeight, false, dataStatisticFunc.onClickRow);
    },
    //表格行点击事件
    onClickRow: function (row, element) {
        //debugger;

        var regionName = row.regionName;
        var regionCodeSub = row.regionCodeSub;

        resetSearchSelectItem();
        $("#select_region").val(regionCodeSub);
        btn_s2();
    },
    //饼状图按钮点击显示该区县行业统计
    tradeButClick: function (t) {
        var regionVal = t.attributes.value.nodeValue; //获取区县代码
        window.parent.dotPopups('dotPopups_tradeSta', '行业统计', 380, 300, '', 100, '', 650, 'Panel/Polluter/tradeStatistic.html?regionCode=' + regionVal);
    }
}

//数据查询
var polluterDataQuery = {
    initialPanel: function (json) {
        //debugger;
        var tradeObject = {};
        for (var i = 0; i < json.length; i++) {
            var enterInfo = {
                "regionName": json[i]["RegionName"],
                "regionCode": json[i]["RegionCode"],
                "tradeCode": json[i]["tradeCode"],
                "tradeName": json[i]["tradeName"],
                "SuperviseType": json[i]["SuperviseType"]
            };

            //污染源按行业分类
            if (!tradeObject[json[i]["tradeCode"]]) {
                tradeObject[json[i]["tradeCode"]] = [];
            }
            tradeObject[json[i]["tradeCode"]].push(enterInfo);
        }

        polluterDataQuery.initialTradeSel(tradeObject);  //行业选择初始化
        //$("#datatable2").empty();
        $("#search1Count").html("0");
        polluterDataQuery.researchPolluter();
    },
    //行业选择初始化
    initialTradeSel: function (tradeObject) {
        $("#select_trade").val("-1");
        var selHtml = "";
        for (var t in tradeObject) {
            var perTrade = tradeObject[t];
            selHtml += "<option value='" + perTrade[0].tradeCode + "'>" + perTrade[0].tradeName + "</option>";
        }
        $("#select_trade").append(selHtml);
    },
    //重新查询污染源
    researchPolluter: function (geometry) {
        //debugger;
        var queryResData = polluter_total;
        if (ifOnline) {
            queryResData = polluter_online;
        }
        var regionName = $("#select_region").find("option:selected").text();
        var regionCodeSub = $("#select_region").val();
        //if (regionCode.toString().length == 6) {
        //    regionCode = regionCode.toString() + "000";
        //}
        //if (regionCode != '-1') {
        //    regionCode = regionCode.substr(0, 9);
        //}
        var kzjbCode = $("#select_kzjb").val();
        var tradeCode = $("#select_trade").val();
        var polluterName = $("#txt_entername").val();

        for (var i = queryResData.length - 1; i >= 0; i--) {
            if (regionCodeSub != '-1') {
                if ((queryResData[i]["RegionCode"] || "").toString().indexOf(regionCodeSub) == -1) {
                    queryResData = queryResData.del(i);
                    continue;
                }
            }
            if (kzjbCode != '-1') {
                if (queryResData[i]["SuperviseType"] != kzjbCode) {
                    queryResData = queryResData.del(i);
                    continue;
                }
            }
            if (tradeCode != '-1') {
                if (queryResData[i]["tradeCode"] != tradeCode) {
                    queryResData = queryResData.del(i);
                    continue;
                }
            }
            if (polluterName != null && polluterName.trim() != "") {
                if (queryResData[i]["EntName"].indexOf(polluterName.trim()) == -1) {
                    queryResData = queryResData.del(i);
                    continue;
                }
            }
        }
        if (geometry) {
            queryResData = window.parent.btn_pointGraphicSearch(queryResData, geometry);
        }
        dataStatisticFunc.mapShow(queryResData, is_cluster);
        $("#search1Count").html(queryResData.length);
        polluterDataQuery.loadQueryResult(queryResData);

        if (regionCodeSub != '-1') {
            window.parent.MapUniGIS.MapRegion.showCounty(regionCodeSub, 1);
        } else {
            window.parent.MapUniGIS.MapRegion.clearRegion();
            window.parent.MapUniGIS.MapZoom.fullExtent();
        }
    },
    //展示查询结果
    loadQueryResult: function (json) {
        var columns = [
            {
                field: 'EntName',
                title: "企业名称",
                align: 'center',
                valign: 'middle',
                width: 160,
                sortable: false,
                formatter: function (value) {
                    return "<div class='autoCut' style='width:155px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;' title='" + value + "'>" + value + "</div>";
                }
            },
            {
                field: 'RegionName',
                title: "城市",
                align: 'center',
                valign: 'middle',
                sortable: false,
                formatter: function (value) {
                    if (value) {
                        return value.toString().trim();
                    }
                }
                //formatter: function (value) {
                //    return "<div class='autoCut' style='width:65px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;' title='" + value + "'>" + value + "</div>";
                //}
            },
            {
                field: 'tradeName',
                title: "行业",
                align: 'center',
                valign: 'middle',
                sortable: false
            },
        ];
        //debugger;
        //console.log('load search result');
        var height = $(window).height();
        var top = $("#div_s2").offset().top + $("#div_s2")[0].clientHeight;
        var tableHeight = height - top - 50;
        //console.log([height, top, tableHeight].join(','));
        var dataGrid = coustomTool.craeteDataGrid("#datatable2", null, json, columns, tableHeight, false, polluterDataQuery.onClickRow);
    },
    //图形查询(待修改)
    btn_graphicSearch: function (index) {
        window.parent.btn_pollGraphicSearch(index, polluterDataQuery.researchPolluter);
    },
    onClickRow: function (row, element) {
        var lon = Number(row.p_lon);
        var lat = Number(row.p_lat);
        window.parent.MapUniGIS.MapZoom.centerAtAndZoom(lon, lat, 10);
    }
}







//污染源控制（分类）级别点击，进行翻页并重新进行查询
function polluterFenLeiTongJiClick(kzjb) {
    //$("#select_region option:first").prop("selected", 'selected');
    resetSearchSelectItem();
    $("#select_kzjb").val(kzjb);
    btn_s2();
}

//点击统计按钮
function btn_s1() {
    btnTypeIndex = 1;//统计
    if (btnTypeIndex == curPageIndex) {
        return;
    }

    window.parent.MapUniGIS.MapZoom.fullExtent();

    curSelecterTril = "#div_s1 ";
    $("#btn_s1").addClass("btn-success");
    $("#btn_s2").removeClass("btn-success");

    $('#hotMap').show();
    $('#JHT').show();

    //判断聚合图是否勾选，设置样式
    //if (is_cluster_info) {
    //    document.getElementById("check_isJuhe").checked = is_cluster_info;
    //} else {
    //    document.getElementById("check_isJuhe").checked = is_cluster_info;
    //}
    is_cluster = is_cluster_info;
    switchTotalAndQuery(initialPage);
}

//点击查询按钮
function btn_s2() {
    btnTypeIndex = 2;//站点
    if (btnTypeIndex == curPageIndex) {
        return;
    }
    window.parent.MapUniGIS.MapZoom.fullExtent();

    //取消聚合图
    is_cluster_info = is_cluster;
    is_cluster = false;
    window.parent.ClusterLyr.pointCluster("polluter_general", is_cluster);


    curSelecterTril = "#div_s2 ";
    $("#btn_s2").addClass("btn-success");
    $("#btn_s1").removeClass("btn-success");
    $('#hotMap').hide();
    $('#JHT').hide();
    switchTotalAndQuery(initialPage);
}

function switchTotalAndQuery(callback) {
    if (curPageIndex == btnTypeIndex) {
        return;
    }
    if (btnTypeIndex == 2) {
        curPageIndex = btnTypeIndex;
        pageChange('#div_s2', '#div_s1', callback);
        setTimeout(function () {
            //polluterDataQuery.researchPolluter();
        }, 1);
    }
    else {
        curPageIndex = btnTypeIndex;
        pageChange('#div_s1', '#div_s2', callback);
        setTimeout(function () {
            //initialPage();
        }, 1);
    }
}

//页面切换
function pageChange($showElement, $hideElement, callback) {
    var browserinfo = getBrowserInfo();
    if (browserinfo == null || (browserinfo && browserinfo.indexOf('ie') > -1)) {
        $($hideElement).css("display", "none");
        $($hideElement).hide();
        $($showElement).css("display", "block");
        $($showElement).show();
        if (callback) {
            setTimeout(function () {
                callback();
            }, 100);
        }
    }
    else {
        $($hideElement).animo({ animation: ["fadeOut"], duration: 0.7 }, function () {
            $($hideElement).css("display", "none");
            $($hideElement).hide();
            $($showElement).css("display", "block");
            $($showElement).show();
            if (callback) {
                setTimeout(function () {
                    callback();
                }, 100);
            }
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

//国省市控数量饼状图统计
function EChart_ExcellentRate(element, title, legendData, data2) {

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
            data: legendData
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { show: true, title: '保存' }
            }

        },
        calculable: false,//图标是否可拖动
        color: [colorY, colorL, colorQDWR, colorZDWR, colorZHDWR, colorYZWR, colorNULL],

        series: [
            {
                name: '所占比例',
                type: 'pie',
                radius: [0, 65],
                sort: 'ascending',
                data: data2,
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

//EChart创建eachat柱状图图表
function EChart_createPollColumn(element, title, regionList, dataList) {
    PollColum = echarts.init($(element)[0], 'default');
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
            trigger: 'item'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { show: true, title: '保存' }
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
                data: regionList,
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
               name: '企业数量',
               type: 'bar',
               itemStyle: {
                   normal: {
                       color: function (params) {
                           var colorList = [
                              '#B5C334', '#B5C334', '#B5C334', '#B5C334',
                              '#B5C334', '#B5C334', '#B5C334', '#B5C334', '#B5C334',
                              '#B5C334', '#B5C334', '#B5C334', '#B5C334', '#B5C334'
                           ];
                           return colorList[params.dataIndex]
                       },
                       label: {
                           show: true,
                           position: 'top',
                           formatter: '{c}'
                       }
                   }
               },
               data: dataList
           }
        ]
    };
    PollColum.setOption(option);
    //window.onresize = myCharPollColumts.resize();
}

/* 扩展，删除Array第n项（从0开始计） */
Array.prototype.del = function (n) {　//n表示第几项，从0开始算起。
    //prototype为对象原型，注意这里为对象增加自定义方法的方法。
    if (n < 0)　//如果n<0，则不进行任何操作。
        return this;
    else
        return this.slice(0, n).concat(this.slice(n + 1, this.length));
    /*
    　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
    　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
     组成的新数组，这中间，刚好少了第n项。
    　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
    */
}

//根据权限筛选区县
function initCitysByQX() {
    if (!window.parent._userISAdmin) {
        for (var ii = city.length - 1; ii >= 0 ; ii--) {
            if (city[ii].cityCode.indexOf(window.parent._userRegionCodeSub) == -1) {
                city = city.del(ii);
            }
        }
    }
}
