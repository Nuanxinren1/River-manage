
$(function () {
    var paramObject = coustomTool.GetURLParams(document.location.href);
    var regionCode = paramObject.regionCode;
    var type = paramObject.type;
    //根据区县代码获取区县行业统计数据
    if (type == "allEnt") {

    }
    else if (type == "online") {

    }

    var json = [{  //--测试数据JSON
        "regionCode": "533000000",
        "regionName": "昆明市",
        "tradeCode": "000001",
        "tradeName": "污水处理",
        "amount": "3"
    },
    {
        "regionCode": "533000000",
        "regionName": "昆明市",
        "tradeCode": "000002",
        "tradeName": "化工",
        "amount": "3"
    },
    {
        "regionCode": "533000000",
        "regionName": "昆明市",
        "tradeCode": "000003",
        "tradeName": "水泥",
        "amount": "3"
    },
    {
        "regionCode": "533000000",
        "regionName": "昆明市",
        "tradeCode": "000004",
        "tradeName": "建材",
        "amount": "3"
    },
    {
        "regionCode": "533000000",
        "regionName": "昆明市",
        "tradeCode": "000005",
        "tradeName": "制药",
        "amount": "3"
    }];
    //获取数据后

    if (json == null) {
        json = [];
    }
    var echartData = [];  //饼状图数据
    var legendData = [];  //图例显示数据
    for (var i = 0; i < json.length; i++) {
        echartData.push({ value: json[i]["amount"], name: json[i]["tradeName"] });
        legendData.push(json[i]["tradeName"]);
    }
    EChart_ExcellentRate("#echart_trade", "区县行业统计", legendData, echartData);
});

//区县行业类型统计饼状图
function EChart_ExcellentRate(element, title, legendData, data2) {
    var colorY = "#6FBE09";
    var colorL = "#FBD12A";
    var colorQDWR = "#FFA641";
    var colorZDWR = "#EB5B13";
    var colorZHDWR = "#960453";
    var colorYZWR = "#580422";
    var colorNULL = "#B9B4B4";
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