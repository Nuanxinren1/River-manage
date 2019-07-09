var piedata = [
	{"name":"重庆市杰克达视频有限公司","value":241},
	{"name":"重庆市渝北区静涵汽车配件制造厂","value":770},
	{"name":"重庆市渝北区福满园工艺蜡烛厂","value":1278}
]
var color = ["#fca660","#20c9fe","#1fdc91"]
var leg = ["重庆市杰克达视频有限公司","重庆市渝北区静涵汽车配件制造厂","重庆市渝北区福满园工艺蜡烛厂"];
var linedata=[
	{"time":2014,"value":24},
	{"time":2015,"value":25},
	{"time":2016,"value":27},
	{"time":2017,"value":29},
	{"time":2018,"value":32}
]
var coddata = [
	{"time":2014,"value":10865},
	{"time":2015,"value":12345},
	{"time":2016,"value":10235},
	{"time":2017,"value":10873},
	{"time":2018,"value":11409}
]
var type = "total"// 监测因子类型
var unit = "万吨"
$(function(){
	$(".menulist").height($(window).height()-60);
	$(".pwukmess-cont-right").height($(window).height()-73);
	$(".menulist li").click(function(){
		$(".menulist li").removeClass("active");
		$(this).addClass("active");
	});
	// 切换图片
	$(".zhaop").click(function(){
		$(this).addClass("active");
		$(".ditu").removeClass("active");
		$(".photoimg img").attr("src","../../img/pwukmess/pmt.jpg");
	})
	$(".ditu").click(function(){
		$(this).addClass("active");
		$(".zhaop").removeClass("active");
		$(".photoimg img").attr("src","../../img/pwukmess/dtdw.png");
	});
	$("#total").click(function(){
		$(".btnlist li").removeClass("active");
		$("#total").addClass("active");
		type = "total";
		unit = "万吨"
		search()
	})
	$("#cod").click(function(){
		$(".btnlist li").removeClass("active");
		$("#cod").addClass("active");
		
		type = "cod";
		unit = "吨"
		search()
	})
	search();
	// tab 切换
	$(".pwukmess-cont-right").scroll(function(){
		var items = $(".pwukmess-cont-right").find(".item");
		var menu = $(".menulist");
		var top = $(".pwukmess-cont-right").scrollTop();
		var activeId = "";//滚动条现在所在的#ifdef
		items.each(function(){
			var m = $(this);
			if(top > m.offset().top + 240){
				activeId = "#"+m.attr("id");
			}else{
				return false;
			}
		});
		var currentLink = menu.find(".active").children("a");
		if (activeId && currentLink.attr("href") != activeId) {
		    menu.find(".active").removeClass("active");
		    menu.find("[href=" + activeId + "]").parent().addClass("active");
		}
	});
	
	
	
	
	
});
function search(){
	var category = [], data =[];
	if(type == "total"){
		category = [], data =[];
		for(var i =0; i <linedata.length; i++){
			category.push(linedata[i]["time"]);
			data.push(linedata[i]["value"]);
		}
		linecharts("#linechart",category,unit,data)
	}else if(type == "cod"){
		category = [], data =[];
		for(var i =0; i <coddata.length; i++){
			category.push(coddata[i]["time"]);
			data.push(coddata[i]["value"]);
		}
		linecharts("#linechart",category,unit,data)
	}
	
	EChart_pie("#rightpie",color,leg,piedata);
}




// 加载折线图
function linecharts(id,category,unit,data){
	let elem = echarts.init($(id)[0], 'default');
	let option = {
		title: {
			text: '排污口排放量趋势',
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
			"name":unit,
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


// 加载饼状图
function EChart_pie(id, color,category, data) {

    var elemt = echarts.init($(id)[0], 'default');
    var option1 = {
		// backgroundColor: "rgba(255,255,255,1)",
		title: {
			text: '各敏感企业排放总量占比',
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
				name: '企业名称',
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
}












