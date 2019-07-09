var mapName = 'china'
var geoCoordMap = {};
var data = [
{"name":"广东","value":"39327"},
{"name":"四川","value":"12380"},
{"name":"福建","value":"7586"},
{"name":"江苏","value":"6598"},
{"name":"江西","value":"5878"},
{"name":"湖南","value":"4708"},
{"name":"湖北","value":"4084"},
{"name":"贵州","value":"3496"},
{"name":"重庆","value":"3422"},
{"name":"海南","value":"3161"},
{"name":"陕西","value":"2959"},
{"name":"云南","value":"2933"},
{"name":"河南","value":"2777"},
{"name":"山西","value":"2188"},
{"name":"山东","value":"1895"},
{"name":"安徽","value":"1862"},
{"name":"辽宁","value":"1747"},
{"name":"广西","value":"1560"},
{"name":"吉林","value":"1319"},
{"name":"甘肃","value":"1011"},
{"name":"浙江","value":"931"},
{"name":"黑龙江","value":"896"},
{"name":"北京","value":"751"},
{"name":"河北","value":"719"},
{"name":"天津","value":"665"},
{"name":"西藏","value":"623"},
{"name":"内蒙古","value":"337"},
{"name":"青海","value":"334"},
{"name":"上海","value":"316"},
{"name":"宁夏","value":"289"},
{"name":"新疆","value":"93"},
{"name":"兵团","value":"44"}
]
 var color = ["#eca658","#937bec","#1cabef","#ec8058"]   
var legpie = ["工业废水排污口","生活废水排污口","混合废污水排污口","其他排污口"];
var pwunumdata = [
	{"name":"工业废水排污口","value":73291,"color":"#eca658"},
	{"name":"生活废水排污口","value":33598,"color":"#937bec"},
	{"name":"混合废污水排污口","value":7900,"color":"#1cabef"},
	{"name":"其他排污口","value":2100,"color":"#ec8058"}
];
 var color1 = ["#fca660","#20c9fe","#1fdc91","#9585fc","#fc7e60"]   
var legpie1 = ["暗管","明渠","泵站","涵闸","其他"];
var pwunumdata1 = [
	{"name":"暗管","value":73291,"color":"#eca658"},
	{"name":"明渠","value":33598,"color":"#937bec"},
	{"name":"泵站","value":7900,"color":"#1cabef"},
	{"name":"涵闸","value":2100,"color":"#ec8058"},
	{"name":"其他","value":1900,"color":"#ec8058"}
];
var gy=
[
{"省份":"广东","总数":"39327","工业废水排污口":"24659","生活废水排污口":"11304","混合废污水排污口":"2658","其他":"707"},
{"省份":"四川","总数":"12380","工业废水排污口":"7762","生活废水排污口":"3558","混合废污水排污口":"837","其他":"222"},
{"省份":"福建","总数":"7586","工业废水排污口":"4757","生活废水排污口":"2180","混合废污水排污口":"513","其他":"136"},
{"省份":"江苏","总数":"6598","工业废水排污口":"4137","生活废水排污口":"1896","混合废污水排污口":"446","其他":"119"},
{"省份":"江西","总数":"5878","工业废水排污口":"3686","生活废水排污口":"1690","混合废污水排污口":"397","其他":"106"},
{"省份":"湖南","总数":"4708","工业废水排污口":"2952","生活废水排污口":"1353","混合废污水排污口":"318","其他":"85"},
{"省份":"湖北","总数":"4084","工业废水排污口":"2561","生活废水排污口":"1174","混合废污水排污口":"276","其他":"73"},
{"省份":"贵州","总数":"3496","工业废水排污口":"2192","生活废水排污口":"1005","混合废污水排污口":"236","其他":"63"},
{"省份":"重庆","总数":"3422","工业废水排污口":"2146","生活废水排污口":"984","混合废污水排污口":"231","其他":"61"},
{"省份":"海南","总数":"3161","工业废水排污口":"1982","生活废水排污口":"909","混合废污水排污口":"214","其他":"57"},
{"省份":"陕西","总数":"2959","工业废水排污口":"1855","生活废水排污口":"851","混合废污水排污口":"200","其他":"53"},
{"省份":"云南","总数":"2933","工业废水排污口":"1839","生活废水排污口":"843","混合废污水排污口":"198","其他":"53"},
{"省份":"河南","总数":"2777","工业废水排污口":"1741","生活废水排污口":"798","混合废污水排污口":"188","其他":"50"},
{"省份":"山西","总数":"2188","工业废水排污口":"1372","生活废水排污口":"629","混合废污水排污口":"148","其他":"39"},
{"省份":"山东","总数":"1895","工业废水排污口":"1188","生活废水排污口":"545","混合废污水排污口":"128","其他":"34"},
{"省份":"安徽","总数":"1862","工业废水排污口":"1167","生活废水排污口":"535","混合废污水排污口":"126","其他":"33"},
{"省份":"辽宁","总数":"1747","工业废水排污口":"1095","生活废水排污口":"502","混合废污水排污口":"118","其他":"31"},
{"省份":"广西","总数":"1560","工业废水排污口":"978","生活废水排污口":"448","混合废污水排污口":"105","其他":"28"},
{"省份":"吉林","总数":"1319","工业废水排污口":"827","生活废水排污口":"379","混合废污水排污口":"89","其他":"24"},
{"省份":"甘肃","总数":"1011","工业废水排污口":"634","生活废水排污口":"291","混合废污水排污口":"68","其他":"18"},
{"省份":"浙江","总数":"931","工业废水排污口":"584","生活废水排污口":"268","混合废污水排污口":"63","其他":"17"},
{"省份":"黑龙江","总数":"896","工业废水排污口":"562","生活废水排污口":"258","混合废污水排污口":"61","其他":"16"},
{"省份":"北京","总数":"751","工业废水排污口":"471","生活废水排污口":"216","混合废污水排污口":"51","其他":"13"},
{"省份":"河北","总数":"719","工业废水排污口":"451","生活废水排污口":"207","混合废污水排污口":"49","其他":"13"},
{"省份":"天津","总数":"665","工业废水排污口":"417","生活废水排污口":"191","混合废污水排污口":"45","其他":"12"},
{"省份":"西藏","总数":"623","工业废水排污口":"391","生活废水排污口":"179","混合废污水排污口":"42","其他":"11"},
{"省份":"内蒙古","总数":"337","工业废水排污口":"211","生活废水排污口":"97","混合废污水排污口":"23","其他":"6"},
{"省份":"青海","总数":"334","工业废水排污口":"209","生活废水排污口":"96","混合废污水排污口":"23","其他":"6"},
{"省份":"上海","总数":"316","工业废水排污口":"198","生活废水排污口":"91","混合废污水排污口":"21","其他":"6"},
{"省份":"宁夏","总数":"289","工业废水排污口":"181","生活废水排污口":"83","混合废污水排污口":"20","其他":"5"},
{"省份":"新疆","总数":"93","工业废水排污口":"58","生活废水排污口":"27","混合废污水排污口":"6","其他":"2"},
{"省份":"兵团","总数":"44","工业废水排污口":"28","生活废水排污口":"13","混合废污水排污口":"3","其他":"1"}
]
var gyfs = [];
var shws = [];
var hhfws = [];
var qt = [];
var qt1 = [];
var category = [];
var linedata = [];
var unit = "个";
var lineT = [
	{"time":"2014","value":92442},
	{"time":"2015","value":100234},
	{"time":"2016","value":100072},
	{"time":"2017","value":100242},
	{"time":"2018","value":116889}
]
var linegy = [
	{"time":"2014","value":69233},
	{"time":"2015","value":70123},
	{"time":"2016","value":71232},
	{"time":"2017","value":71242},
	{"time":"2018","value":73291}
]
var linesh = [
	{"time":"2014","value":30245},
	{"time":"2015","value":31234},
	{"time":"2016","value":32761},
	{"time":"2017","value":33102},
	{"time":"2018","value":33600}
]
var linehh = [
	{"time":"2014","value":7698},
	{"time":"2015","value":7713},
	{"time":"2016","value":7812},
	{"time":"2017","value":7854},
	{"time":"2018","value":7901}
]
var lineqt = [
	{"time":"2014","value":1860},
	{"time":"2015","value":1879},
	{"time":"2016","value":1978},
	{"time":"2017","value":2000},
	{"time":"2018","value":2100}
]
var dataline = [];
var legend = [];
$(function(){
	$(".gyfs").click(function(){
		$(".zhfx-cont-4-right-btn li").removeClass("active");
		$(".gyfs").addClass("active");
		$(".zhfx-cont-4-right-cont img").attr("src","../../img/zhfx/4.png");
	})
	$(".shws").click(function(){
		$(".zhfx-cont-4-right-btn li").removeClass("active");
		$(".shws").addClass("active");
		$(".zhfx-cont-4-right-cont img").attr("src","../../img/zhfx/44.png");
	})
	$("#zhfx-cont-6-btn li").click(function(){
		$("#zhfx-cont-6-btn li").removeClass("active");
		$(this).addClass("active");
	})
	mapCharts("#mapcharts",data);
	EChart_pie("#zhfx-cont-3-pie",color,legpie,pwunumdata);
	EChart_pie("#zhfx-cont-5-pie",color1,legpie1,pwunumdata1);
	
	for(var i = 0; i< gy.length; i++){
		category.push(gy[i]["省份"]);
		linedata.push(gy[i]["工业废水排污口"]);
		var a = {
			"name":gy[i]["省份"],
			"value":gy[i]["工业废水排污口"]
		}
		var b = {
			"name":gy[i]["省份"],
			"value":gy[i]["生活废水排污口"]
		}
		var c = {
			"name":gy[i]["省份"],
			"value":gy[i]["混合废污水排污口"]
		}
		var d = {
			"name":gy[i]["省份"],
			"value":gy[i]["其他"]
		}
// 		var  e= {
// 			"name":gy[i]["省份"],
// 			"value":gy[i]["其他1"]
// 		}
		gyfs.push(a)
		shws.push(b);
		hhfws.push(c);
		qt.push(d);
		qt1.push(d);
	}
	Echarts_line("#zhfx-cont-3-line",unit,'#eca658',category,linedata);
	Echarts_line("#zhfx-cont-5-line",unit,'#eca658',category,linedata);
	for(var i =0; i <lineT.length; i++){
		legend.push(lineT[i]["time"]);
		dataline.push(lineT[i]["value"]);
	}
	linecharts("#zhfx-cont-6-line",legend, dataline);
	
	// 菜单栏点击
	$(".zhfxmenu li").click(function(){
		$(".zhfxmenu li").removeClass("active");
		$(this).addClass("active");
	})

});
function search(datatype){
	legend = [];
	dataline = []
	if(datatype == "total"){
		for(var i =0; i <lineT.length; i++){
			legend.push(lineT[i]["time"]);
			dataline.push(lineT[i]["value"]);
		}
	}else if(datatype == "gy"){
		for(var i =0; i <linegy.length; i++){
			legend.push(linegy[i]["time"]);
			dataline.push(linegy[i]["value"]);
		}
	}else if(datatype == "sh"){
		for(var i =0; i <linesh.length; i++){
			legend.push(linesh[i]["time"]);
			dataline.push(linesh[i]["value"]);
		}
	}else if(datatype == "hh"){
		for(var i =0; i <linehh.length; i++){
			legend.push(linehh[i]["time"]);
			dataline.push(linehh[i]["value"]);
		}
	}else if(datatype == "qt"){
		for(var i =0; i <lineqt.length; i++){
			legend.push(lineqt[i]["time"]);
			dataline.push(lineqt[i]["value"]);
		}
	}
	linecharts("#zhfx-cont-6-line",legend, dataline);
}

function pwksearch(type){
	linedata = [];
	if(type == "工业废水排污口"){
		for(var i = 0; i <gyfs.length; i++){
			linedata.push(gyfs[i]["value"]);
		}
		Echarts_line("#zhfx-cont-3-line",unit,'#eca658',category,linedata);
	}else if(type == "生活废水排污口"){
		for(var i = 0; i <shws.length; i++){
			linedata.push(shws[i]["value"]);
		}
		Echarts_line("#zhfx-cont-3-line",unit,'#937bec',category,linedata);
	}else if(type == "混合废污水排污口"){
		for(var i = 0; i <hhfws.length; i++){
			linedata.push(hhfws[i]["value"]);
		}
		Echarts_line("#zhfx-cont-3-line",unit,'#1cabef',category,linedata);
	}else if(type == "其他排污口"){
		for(var i = 0; i <qt.length; i++){
			linedata.push(qt[i]["value"]);
		}
		Echarts_line("#zhfx-cont-3-line",unit,'#ec8058',category,linedata);
	}else if(type == "暗管"){
		for(var i = 0; i <gyfs.length; i++){
			linedata.push(gyfs[i]["value"]);
		}
		Echarts_line("#zhfx-cont-5-line",unit,'#fca660',category,linedata);
	}else if(type == "明渠"){
		for(var i = 0; i <shws.length; i++){
			linedata.push(shws[i]["value"]);
		}
		Echarts_line("#zhfx-cont-5-line",unit,'#20c9fe',category,linedata);
	}else if(type == "泵站"){
		for(var i = 0; i <hhfws.length; i++){
			linedata.push(hhfws[i]["value"]);
		}
		Echarts_line("#zhfx-cont-5-line",unit,'#1fdc91',category,linedata);
	}else if(type == "涵闸"){
		for(var i = 0; i <qt.length; i++){
			linedata.push(qt[i]["value"]);
		}
		Echarts_line("#zhfx-cont-5-line",unit,'#9585fc',category,linedata);
	}else if(type == "其他"){
		for(var i = 0; i <qt1.length; i++){
			linedata.push(qt1[i]["value"]);
		}
		Echarts_line("#zhfx-cont-5-line",unit,'#fc7e60',category,linedata);
	}
}

// 地图
function mapCharts(id,data){
	let myChart = echarts.init($(id)[0], 'default');
/*获取地图数据*/
myChart.showLoading();
var mapFeatures = echarts.getMap(mapName).geoJson.features;
myChart.hideLoading();
mapFeatures.forEach(function(v) {
    // 地区名称
    var name = v.properties.name;
    // 地区经纬度
    geoCoordMap[name] = v.properties.cp;

});
var max = 20,
    min = 9; // todo 
var maxSize4Pin = 10,
    minSize4Pin = 2;

var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {

        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
            });
        }
    }
    return res;
};
let option = {
 
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            if (typeof(params.value)[2] == "undefined") {
                var toolTiphtml = ''
                for(var i = 0;i<data.length;i++){
                    if(params.name==data[i].name){
                        toolTiphtml += data[i].name+':'+data[i].value
                       
                    }
                }
                return toolTiphtml;
            } else {
                var toolTiphtml = ''
                for(var i = 0;i<data.length;i++){
                    for(var i = 0;i<data.length;i++){
                    if(params.name==data[i].name){
                        toolTiphtml += data[i].name+':'+data[i].value
                       
                    }
                }
                }
                console.log(toolTiphtml)
                // console.log(convertData(data))
                return toolTiphtml;
            }
        }
    },

    visualMap: {
        show: true,
        min: 0,
        max: 39327,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        seriesIndex: [1],
        inRange: {
            color: ['#00467F', '#A5CC82'] // 蓝绿

        }
    },

    geo: {
        show: true,
        map: mapName,
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false,
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
            },
            emphasis: {
                areaColor: '#2B91B7',
            }
        }
    },
    series: [{
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
//             symbolSize: function(val) {
// 				debugger;
//                 return val[2] / 10;
//             },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#05C3F9'
                }
            }
        },
        {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.15, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#031525',
                    borderColor: '#3B5077',
                },
                emphasis: {
                    areaColor: '#2B91B7'
                }
            },
            animation: false,
            data: data
        },
    ]
};

myChart.setOption(option);
}


// 加载饼状图
function EChart_pie(id, color,category, data) {

    var elemt = echarts.init($(id)[0], 'default');
    var option1 = {
		// backgroundColor: "rgba(255,255,255,1)",
		title: {
			text: '类型占比情况',
			 textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                fontSize: 15,
                fontStyle: 'normal',
                fontWeight: '600',
            },
			padding:10
		},
        color:color,
        legend: [{
            // orient: "",
//             x: "left",
//             top: "50%",
//             left: "68%",
            bottom: "0%",
            data: category,
            itemWidth: 14,
            itemHeight: 14,
            //itemGap :15,
			itemStyle:{
				color:'#000'
			}
        }],
        series: [
            {
				name: '排污口类型',
				type: 'pie',
				clockwise: true, //饼图的扇区是否是顺时针排布
				// minAngle: 20, //最小的扇区角度（0 ~ 360）
				radius: ["30%", "58%"],
				center: ["35%", "50%"],
				avoidLabelOverlap: false,
				label:{
					normal: {
						show: false,
						formatter: "{b|{b}}\n{hr|}\n{d|{d}%}",
						textStyle: {
							fontSize: 20,

						},
						position: 'outside',
						padding:[0,-70],
						rich: {
							b: {
								fontSize: 15,
								//color: '#000',
								align: 'center',
								// padding: 4
							},
							d: {
								fontSize: 15,
								align: 'center',
							},
						}
					},
					emphasis: {
						show: true
					}
				},
				labelLine:{
					normal: {
						show: false,
						length: 25,
						length2: 70
					},
					emphasis: {
						show: true
					}
				},
				data: data,

			},
			{
				name: '外边框',
				type: 'pie',
				clockWise: false, //顺时加载
				hoverAnimation: false, //鼠标移入变大
				center: ['35%', '50%'],
				radius: ['61%', '61%'],
				label: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 9,
					name: '',
					itemStyle: {
						normal: {
							borderWidth: 8,
							borderColor: '#d2e6fc',
						}
					},
				}]
			}
        ]
    };
    elemt.setOption(option1);
setTimeout(function() {
	elemt.dispatchAction({
		type: 'highlight',
		seriesIndex: 0,
		dataIndex: 0
	});

	elemt.on('mouseover', function(params) {
		if (params.name == data[0].name) {
			elemt.dispatchAction({
				type: 'highlight',
				seriesIndex: 0,
				dataIndex: 0
			});
			option1.series[0]["label"] = {
				normal: {
					show: true,
					formatter: "{c}%",
					textStyle: {
						fontSize: 30,

					},
					position: 'outside'
				},
				emphasis: {
					show: true
				}
			};
			option1.series[0]["labelLine"] = {
				normal: {
					show: true,
					length: 30,
					length2: 55
				},
				emphasis: {
					show: true
				}
			}

		} else {
			elemt.dispatchAction({
				type: 'downplay',
				seriesIndex: 0,
				dataIndex: 0
			});
		}
	});

	elemt.on('mouseout', function(params) {
		elemt.dispatchAction({
			type: 'highlight',
			seriesIndex: 0,
			dataIndex: 0
		});
	});
	}, 800);
	elemt.on("click",function(params){
		pwksearch(params.name);
	})
}

function Echarts_line(id,unit, color,category, data){
	let elemt = echarts.init($(id)[0], 'default');
	let option = {
		 "tooltip": {
		    "trigger": "axis",
		    "axisPointer": {
		        "type": "shadow",
		        textStyle: {
		            color: "#fff"
		        }
		
		    },
		},
		"grid": {
		    "borderWidth": 0,
		    "top": 45,
		    "bottom": 70,
			"left":70,
			"right":50,
		    textStyle: {
		        color: "#fff"
		    }
		},
		"calculable": true,
		"xAxis": [{
		    "type": "category",
		    "axisLine": {
		       show:false
		    },
		    "splitLine": {
		        "show": false
		    },
		    "axisTick": {
		        "show": false
		    },
		    "splitArea": {
		        "show": false
		    },
		    "axisLabel": {
		        "interval": 0,
				rotate:45
		    },
		    "data": category,
		}],
		"yAxis": [{
		    "type": "value",
			"name":unit,
			nameTextStyle: {
                color: "#000"
            },
		    "splitLine": {
		        "show": false
		    },
		    "axisLine": {
		       "show": false
		    },
		    "axisTick": {
		        "show": false
		    },
		    "axisLabel": {
		        // "interval": 0,
				show: true,
                textStyle: {
                    color: "#aaa"
                }
		    },
		    "splitArea": {
		        "show": false
		    },
		
		}],
// 		"dataZoom": [
// 		    {
// 		        type: 'slider',
// 		        xAxisIndex: 0,
// 		        filterMode: 'empty',
// 		        height:15,
// 				bottom:15
// 		    },
// 		    {
// 		        type: 'slider',
// 		        yAxisIndex: 0,
// 		        filterMode: 'empty',
// 		        left:20,
// 		        width:15
// 		    },
// 		],
		series:[{
			type:"bar",
			stack:"总量",
			barMaxWidth:13,
			itemStyle:{
				normal:{
					color:color
				}
			},
			data:data
		}]
	}
	

	
	elemt.setOption(option);
}

// 加载折线图
function linecharts(id,category,data){
	let elem = echarts.init($(id)[0], 'default');
	let option = {
		title: {
			text: '排污口数量趋势',
		},
		tooltip:{
			trigger:'item'
		},
		xAxis:{
			type:'category',
			data:category,
			splitLine:{show: false},//去除网格线
			splitArea : {show : false},//保留网格区域
			axisLine: {
			    lineStyle: {
			        type: 'solid',
			        color: '#7d7d7d',//左边线的颜色
			        width:'1'//坐标线的宽度
			    }
			},
			axisLabel: {
			    textStyle: {
			        color: '#7d7d7d',//坐标值得具体的颜色
			 
			    }
			}
		},
		yAxis: {
			type: 'value',
			// "name":unit,
			splitLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#7d7d7d"
                }
            }
		},
		series: [{
			data: data,
			type: 'line',
		    symbol: 'circle',//折线点设置为实心点
			symbolSize: 5,   //折线点的大小
			itemStyle:{
				normal: {
				   color: "#00cfc6",//折线点的颜色
				   lineStyle: {
						color:'#00cfc6'
					}
				}
			}
		}]
	}
	elem.setOption(option);
}



function jumphtml(type){
	var html = ""
	if(type == "dz"){
		$(".dzfx-cont").css("display","block");
		$("#iframe").css("display","none");
	}
	else if(type == "gj"){
			$(".dzfx-cont").css("display","none");
		$(".zhfx-right").find("#iframe").remove();
		html = '<iframe id="iframe" src="../screeningAnalysis/screeningAnalysis.html"></iframe>'
		$(".zhfx-right").append(html)
		setTimeout(function(){
			var height = $("#iframe")[0].contentWindow.document.getElementById("screen").clientHeight + 2690;
			$("#iframe").css("height",height);
		},500)
	}else if(type == "gl"){
		$(".dzfx-cont").css("display","none");
		$(".zhfx-right").find("#iframe").remove();
		html = '<iframe id="iframe" src="../Association/Association.html"></iframe>'
		$(".zhfx-right").append(html);
		setTimeout(function(){
			var height = $("#iframe")[0].contentWindow.document.getElementById("Association").clientHeight;
			$("#iframe").css("height",height);
		},500)
	}
}






















