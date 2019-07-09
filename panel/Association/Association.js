// 排污口区域拓扑图
var cont1data =[
{"年份":"2009","企业排污数量":"7","排放量":"58","化学需氧量":"34.8","氨氮":"18.56","总磷":"1.856","总氮":"1.972","动植物油":"0.464","其他":"0.348"},
{"年份":"2010","企业排污数量":"7","排放量":"60.9","化学需氧量":"36.54","氨氮":"19.488","总磷":"1.9488","总氮":"2.0706","动植物油":"0.4872","其他":"0.3654"},
{"年份":"2011","企业排污数量":"8","排放量":"63.945","化学需氧量":"38.367","氨氮":"20.4624","总磷":"2.04624","总氮":"2.17413","动植物油":"0.51156","其他":"0.38367"},
{"年份":"2012","企业排污数量":"8","排放量":"67.14225","化学需氧量":"40.28535","氨氮":"21.48552","总磷":"2.148552","总氮":"2.2828365","动植物油":"0.537138","其他":"0.4028535"},
{"年份":"2013","企业排污数量":"9","排放量":"70.4993625","化学需氧量":"42.2996175","氨氮":"22.559796","总磷":"2.2559796","总氮":"2.396978325","动植物油":"0.5639949","其他":"0.422996175"},
{"年份":"2014","企业排污数量":"9","排放量":"74.02433063","化学需氧量":"44.41459838","氨氮":"23.6877858","总磷":"2.36877858","总氮":"2.516827241","动植物油":"0.592194645","其他":"0.444145984"},
{"年份":"2015","企业排污数量":"10","排放量":"77.72554716","化学需氧量":"46.63532829","氨氮":"24.87217509","总磷":"2.487217509","总氮":"2.642668603","动植物油":"0.621804377","其他":"0.466353283"},
{"年份":"2016","企业排污数量":"10","排放量":"81.61182451","化学需氧量":"48.96709471","氨氮":"26.11578384","总磷":"2.611578384","总氮":"2.774802033","动植物油":"0.652894596","其他":"0.489670947"},
{"年份":"2017","企业排污数量":"11","排放量":"85.69241574","化学需氧量":"51.41544944","氨氮":"27.42157304","总磷":"2.742157304","总氮":"2.913542135","动植物油":"0.685539326","其他":"0.514154494"},
{"年份":"2018","企业排污数量":"11","排放量":"89.97703653","化学需氧量":"53.98622192","氨氮":"28.79265169","总磷":"2.879265169","总氮":"3.059219242","动植物油":"0.719816292","其他":"0.539862219"},
]
var cont1datanum = []; // 排污口数量
var cont1datapfl = []; // 排放量
var cont1category =[]; // X轴
var cont1legend = ["排污口数量","排污口排放量"]; // 图例
var cont1Color= ["#0bb5a4","#f08229"]; // 颜色
var cont1json = [];
var cont2data=[
{"年份":"2009","数量":"73669","排放量":"5810000","化学需氧量":"3486000","氨氮":"1859200","总磷":"185920","总氮":"197540","动植物油":"46480","其他":"34860"},
{"年份":"2010","数量":"77547","排放量":"6100500","化学需氧量":"3660300","氨氮":"1952160","总磷":"195216","总氮":"207417","动植物油":"48804","其他":"36603"},
{"年份":"2011","数量":"81628","排放量":"6405525","化学需氧量":"3843315","氨氮":"2049768","总磷":"204976.8","总氮":"217787.85","动植物油":"51244.2","其他":"38433.15"},
{"年份":"2012","数量":"85924","排放量":"6725801.25","化学需氧量":"4035480.75","氨氮":"2152256.4","总磷":"215225.64","总氮":"228677.2425","动植物油":"53806.41","其他":"40354.8075"},
{"年份":"2013","数量":"90446","排放量":"7062091.313","化学需氧量":"4237254.788","氨氮":"2259869.22","总磷":"225986.922","总氮":"240111.1046","动植物油":"56496.7305","其他":"42372.54788"},
{"年份":"2014","数量":"95207","排放量":"7415195.878","化学需氧量":"4449117.527","氨氮":"2372862.681","总磷":"237286.2681","总氮":"252116.6599","动植物油":"59321.56703","其他":"44491.17527"},
{"年份":"2015","数量":"100218","排放量":"7785955.672","化学需氧量":"4671573.403","氨氮":"2491505.815","总磷":"249150.5815","总氮":"264722.4928","动植物油":"62287.64538","其他":"46715.73403"},
{"年份":"2016","数量":"105492","排放量":"8175253.456","化学需氧量":"4905152.073","氨氮":"2616081.106","总磷":"261608.1106","总氮":"277958.6175","动植物油":"65402.02765","其他":"49051.52073"},
{"年份":"2017","数量":"111045","排放量":"8584016.128","化学需氧量":"5150409.677","氨氮":"2746885.161","总磷":"274688.5161","总氮":"291856.5484","动植物油":"68672.12903","其他":"51504.09677"},
{"年份":"2018","数量":"116889","排放量":"9013216.935","化学需氧量":"5407930.161","氨氮":"2884229.419","总磷":"288422.9419","总氮":"306449.3758","动植物油":"72105.73548","其他":"54079.30161"},

]
var cont2num = [];
var cont2pfl = [];
var cont2cod = [];
var cont2category = [];
var cont2json = [];
var cont2jsoncod = [];
var cont2PieColor = ["#fc7d60","#f6d849","#42d5aa","#208efe","#9585fc","#20b2fe"];
var cont2PieData = [
	{"name":"重庆市永川区箕山电煤有限责任公司","value":60},
	{"name":"万州区罗田镇佐臣水泥砖厂","value":57.5},
	{"name":"重庆万创实业有限公司","value":57},
	{"name":"重庆市万州区江渝杆塔厂","value":56.5},
	{"name":"万州区钟鼓楼成辉门窗加工厂","value":56},
	{"name":"万州区钟鼓楼谭永星纸制品加工厂","value":57},
	{"name":"万州区厦门大道凤阁铝材","value":55}
]
var cont4linedata = [
{"日期":"4月17日","排污口排放量":"5044","上游水质":"3","下游水质":"4"},
{"日期":"4月18日","排污口排放量":"4821","上游水质":"3","下游水质":"4"},
{"日期":"4月19日","排污口排放量":"4238","上游水质":"3","下游水质":"3"},
{"日期":"4月20日","排污口排放量":"6412","上游水质":"3","下游水质":"4"},
{"日期":"4月21日","排污口排放量":"3721","上游水质":"3","下游水质":"3"},
{"日期":"4月22日","排污口排放量":"5731","上游水质":"3","下游水质":"4"},
{"日期":"4月23日","排污口排放量":"3283","上游水质":"3","下游水质":"3"},
{"日期":"4月24日","排污口排放量":"4781","上游水质":"3","下游水质":"4"},
{"日期":"4月25日","排污口排放量":"4789","上游水质":"3","下游水质":"4"},

]
var cont4lincolor = ["#9585fc","#fcaf0b","#00cfc6"];
var cont4legend = ["排污口排放量","上游水质","下游水质"]
var cont4category = [];
var cont4pfl = [];
var cont4sy = [];
var cont4xy = [];
var cont4json = [];
var cont5data = [
{"日期":"4月17日","排污口排放量":"1894.36 ","PH":"7.27","水温":"11.1","浊度":"91","溶解氧":"8.73","电导率":"609","氨氮":"0.27","高锰酸盐指数":"1.8"},
{"日期":"4月18日","排污口排放量":"1889.88 ","PH":"8.17","水温":"9.01","浊度":"25","溶解氧":"11.25","电导率":"298","氨氮":"0.64","高锰酸盐指数":"2"},
{"日期":"4月19日","排污口排放量":"1532.6","PH":"8.51","水温":"8.7","浊度":"77","溶解氧":"12.06","电导率":"278","氨氮":"1.46","高锰酸盐指数":"1.2"},
{"日期":"4月20日","排污口排放量":"1738.88","PH":"8.9","水温":"8.2","浊度":"100","溶解氧":"11.34","电导率":"50","氨氮":"0.79","高锰酸盐指数":"2.3"},
{"日期":"4月21日","排污口排放量":"1751.14","PH":"7.49","水温":"24.6","浊度":"93","溶解氧":"7.29","电导率":"134","氨氮":"0.17","高锰酸盐指数":"2.3"},
{"日期":"4月22日","排污口排放量":"1698.33","PH":"7.5","水温":"10.6","浊度":"406","溶解氧":"9.78","电导率":"540","氨氮":"0.05","高锰酸盐指数":"2.7"},
{"日期":"4月23日","排污口排放量":"1876.84","PH":"8.81","水温":"11.5","浊度":"194","溶解氧":"9.71","电导率":"97","氨氮":"0.36","高锰酸盐指数":"1.5"},
{"日期":"4月24日","排污口排放量":"1850.29","PH":"7.43","水温":"13.7","浊度":"947","溶解氧":"5.99","电导率":"634","氨氮":"0.35","高锰酸盐指数":"8.2"},
{"日期":"4月25日","排污口排放量":"1568.75","PH":"8.45","水温":"10.1","浊度":"43","溶解氧":"8.96","电导率":"574","氨氮":"0.95","高锰酸盐指数":"2.1"},

]
var ph = [];
var sw = [];
var zd = [];
var rjy = [];
var ddl = [];
var ad = [];
var gmsj = [];
var cont5category = [];
$(function(){
	search();
	$(".zl").click(function(){
		$(".Association-cont-3-main-left-menu li").removeClass("active");
		$(this).addClass("active");
		glsearch('zl')
	})
	$(".cod").click(function(){
		$(".Association-cont-3-main-left-menu li").removeClass("active");
		$(this).addClass("active");
		glsearch("cod");
	});
	$("#fx").click(function(){
		var code = $("#jcyz").val()
		jcyzsearch(code)
	})
});

function search(){
	// 
	cont1datanum = [];
	cont1datapfl = [];
	cont1category =[];
	for(var i = 0; i< cont1data.length; i++){
		cont1datanum.push(cont1data[i]["企业排污数量"]);
		cont1datapfl.push(cont1data[i]["排放量"]);
		cont1category.push(cont1data[i]["年份"]);
	}
	cont1json.push(cont1datanum);
	cont1json.push(cont1datapfl);
	Echarts_line("#Association-cont-2-main-right","数量","排放量","排放口与污染源排放量关联分析",cont1legend, cont1category,cont1Color,cont1json);
	// 排污口与污染源关系
	
	cont2num = [];
	cont2pfl = [];
	cont2cod = [];
	for(var i = 0; i< cont2data.length; i++){
		cont2num.push(cont2data[i]["数量"]);
		cont2pfl.push(cont2data[i]["排放量"]);
		cont2cod.push(cont2data[i]["化学需氧量"])
		cont2category.push(cont2data[i]["年份"]);
	}
	cont2jsoncod.push(cont2num);
	cont2jsoncod.push(cont2cod);
	cont2json.push(cont2num);
	cont2json.push(cont2pfl);
	Echarts_line("#Association-cont-3-main-left-line","数量","排放量","排放口与污染源排放量关联分析",cont1legend, cont2category,cont1Color,cont2json);
	EChart_pie("#Association-cont-3-main-right", cont2PieColor, cont2PieData);
	
	
	 cont4category = [];
	 cont4pfl = [];
	 cont4sy = [];
	 cont4xy = [];
	 cont4json = [];
	for(var i = 0; i< cont4linedata.length; i++){
		cont4pfl.push(cont4linedata[i]["排污口排放量"]);
		cont4sy.push(cont4linedata[i]["上游水质"]);
		cont4xy.push(cont4linedata[i]["下游水质"])
		cont4category.push(cont4linedata[i]["日期"]);
	}
	cont4json.push(cont4pfl);
	cont4json.push(cont4sy);
	cont4json.push(cont4xy);
	Echarts_line1("#Association-cont-4-main-line","排放量","水质级别","",cont4legend, cont4category,cont4lincolor,cont4json);
	
	 ph = [];
	 sw = [];
	 zd = [];
	 rjy = [];
	 ddl = [];
	 ad = [];
	 gmsj = [];
	 cont5category = [];
	for(var i =0; i< cont5data.length; i++){
		ph.push(cont5data[i]["PH"]);
		sw.push(cont5data[i]["水温"]);
		zd.push(cont5data[i]["浊度"]);
		rjy.push(cont5data[i]["溶解氧"]);
		ddl.push(cont5data[i]["电导率"]);
		ad.push(cont5data[i]["氨氮"]);
		gmsj.push(cont5data[i]["高锰酸盐指数"]);
		cont5category.push(cont5data[i]["日期"]);
	}
	Echarts_line2("#Association-cont-5-main-line",cont5category,"#f6d849",ph);
}
function jcyzsearch(code){
	if(code == 0){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#f6d849",ph);
	}else if(code == 1){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#fc7d60",sw);
	}else if(code == 2){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#42d5aa",zd);
	}else if(code == 3){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#fcaf0b",rjy);
	}else if(code == 4){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#208efe",ddl);
	}else if(code == 5){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#9585fc",ad);
	}else if(code == 6){
		Echarts_line2("#Association-cont-5-main-line",cont5category,"#20b2fe",gmsj);
	}
}
function glsearch(type){
	if(type == "zl"){
		Echarts_line("#Association-cont-3-main-left-line","数量","排放量","排放口与污染源排放量关联分析",cont1legend, cont2category,cont1Color,cont2json);
	}else if(type == "cod"){
		Echarts_line("#Association-cont-3-main-left-line","数量","排放量","排放口与污染源排放量关联分析",cont1legend, cont2category,cont1Color,cont2jsoncod);
	}
}

function Echarts_line(id,unit1,unit2,name,legend, category,color,data){
	let elemt = echarts.init($(id)[0], 'default');
	let option = {
		title:{
			text:name,
			padding:10,
			textStyle:{
				fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '600',
			}
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// type: "shadow",
// 				label: {
// 					show: true
// 				}
			}
		},
		legend: {
			data: legend,
			top: "10%",
			left:"10%",
			right:"10%",
			textStyle: {
				color: "#929292"
			}
		},
		grid: {
			top: "30%",
			bottom: "10%",
			right:"10%",
			left:"12%"
		},
		xAxis:[{
			type:"category",
			data:category,
			"axisLine": {
			   show:false,
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
				// rotate:45
			},
		}],
		yAxis:[
			{
		        type: "value",
		        name: unit1,
		        nameTextStyle: {
		            color: "#808080"
		        },
		        splitLine: {
		            show: false
		        },
		        splitLine: {
		            show: true
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
		                color: "#808080"
		            }
		        }
		    },
		    {
		        type: "value",
		        name: unit2,
		        nameTextStyle: {
		            color: "#808080"
		        },
		        position: "right",
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
		                color: "#808080"
		            }
		        }
		    }
	],
	series:[]
	
}
	for (var i =0; i < data.length; i++){
		var str = "";
		if(i == 0){
			str = {
				type:"line",
				name:legend[i],
				symbol: "circle", 
				symbolSize: 10,
				data:data[i],
				itemStyle:{
					normal:{
						color:color[i]
					}
				}
			}
		}else if(i>0){
			str = {
				type:"line",
				name:legend[i],
				symbol: "circle", 
				symbolSize: 10,
				 yAxisIndex: 1,
				data:data[i],
				itemStyle:{
					normal:{
						color:color[i]
					}
				}
			}
		}
		option.series.push(str);
		
	}
	elemt.setOption(option);

}
function Echarts_line1(id,unit1,unit2,name,legend, category,color,data){
	let elemt = echarts.init($(id)[0], 'default');
	let option = {
		title:{
			text:name,
			padding:10,
			textStyle:{
				fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '600',
			}
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// type: "shadow",
// 				label: {
// 					show: true
// 				}
			}
		},
		legend: {
			data: legend,
			top: "10%",
			left:"10%",
			right:"10%",
			textStyle: {
				color: "#838383"
			}
		},
		grid: {
			top: "30%",
			bottom: "10%",
			right:"10%",
			left:"5%"
		},
		xAxis:[{
			type:"category",
			data:category,
			"axisLine": {
			   show:false,
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
				// rotate:45
			},
		}],
		yAxis:[
			{
		        type: "value",
		        name: unit1,
		        nameTextStyle: {
		            color: "#808080"
		        },
		        splitLine: {
		            show: false
		        },
		        splitLine: {
		            show: true
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
		                color: "#808080"
		            }
		        }
		    },
		    {
		        type: "value",
		        name: unit2,
		        nameTextStyle: {
		            color: "#808080"
		        },
		        position: "right",
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
		                color: "#808080"
		            }
		        }
		    }
	],
	series:[]
	
}
	for (var i =0; i < data.length; i++){
		var str = "";
		if(i == 0){
			str = {
				type:"line",
				name:legend[i],
				symbol: "circle", 
				symbolSize: 10,
				data:data[i],
				itemStyle:{
					normal:{
						color:color[i]
					}
				}
			}
		}else if(i>0){
			str = {
				type:"line",
				name:legend[i],
				symbol: "circle", 
				symbolSize: 10,
				 yAxisIndex: 1,
				data:data[i],
				itemStyle:{
					normal:{
						color:color[i]
					}
				}
			}
		}
		option.series.push(str);
		
	}
	elemt.setOption(option);

}
function Echarts_line2(id,category,color,data){
	let elemt = echarts.init($(id)[0], 'default');
	let option = {
// 		title:{
// 			text:name,
// 			padding:10,
// 			textStyle:{
// 				fontSize: 14,
//                 fontStyle: 'normal',
//                 fontWeight: '600',
// 			}
// 		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				// type: "shadow",
// 				label: {
// 					show: true
// 				}
			}
		},
// 		legend: {
// 			data: legend,
// 			top: "10%",
// 			left:"10%",
// 			right:"10%",
// 			textStyle: {
// 				color: "#838383"
// 			}
// 		},
		grid: {
			top: "30%",
			bottom: "10%",
			right:"10%",
			left:"5%"
		},
		xAxis:[{
			type:"category",
			data:category,
			"axisLine": {
			   show:false,
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
				// rotate:45
			},
		}],
		yAxis:[
			{
		        type: "value",
		        nameTextStyle: {
		            color: "#808080"
		        },
		        splitLine: {
		            show: false
		        },
		        splitLine: {
		            show: true
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
		                color: "#808080"
		            }
		        }
		    }
	],
	series:[{
				type:"line",
				symbol: "circle", 
				symbolSize: 10,
				data:data,
				itemStyle:{
					normal:{
						color:color
					}
				}
			}]
	
}
	elemt.setOption(option);

}

// 加载饼状图
function EChart_pie(id, color, data) {

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
			right:"2%",
			orient:"vertical",
            bottom: "0%",
            data: data,
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
				center: ["25%", "50%"],
				avoidLabelOverlap: false,
				label:{
					normal: {
						show: false,
						formatter: "{b|{b}}\n{hr|}\n{d|{d}%}",
						textStyle: {
							fontSize: 20,

						},
						position: 'outside',
						padding:[0,-200],
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
						length2: 200
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
				center: ['25%', '50%'],
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
}




