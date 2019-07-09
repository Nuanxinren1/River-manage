var linedata = [
{"year":"2009","总数":"3682","新增":"2401","删除":"241","修改":"1028","其他":"12"},
{"year":"2010","总数":"4129","新增":"2501","删除":"301","修改":"1312","其他":"15"},
{"year":"2011","总数":"5248","新增":"3021","删除":"322","修改":"1823","其他":"82"},
{"year":"2012","总数":"6890","新增":"3982","删除":"83","修改":"2812","其他":"13"},
{"year":"2013","总数":"4991","新增":"3271","删除":"372","修改":"1327","其他":"21"},
{"year":"2014","总数":"5149","新增":"3482","删除":"281","修改":"1362","其他":"24"},
{"year":"2015","总数":"4129","新增":"2816","删除":"255","修改":"1039","其他":"19"},
{"year":"2016","总数":"3471","新增":"2683","删除":"98","修改":"627","其他":"63"},
{"year":"2017","总数":"3349","新增":"2581","删除":"83","修改":"632","其他":"53"},
{"year":"2018","总数":"5233","新增":"2032","删除":"371","修改":"2798","其他":"32"}
];
var linecolor = ["#fc9b60","#fcc760","#9fe643","#30cab6"];
var linelegend = ["关闭排污口量","修改排污口量","新增排污口量","其他"]
var piedata = [
	{"name":"I类","value":973},
	{"name":"II类","value":509},
	{"name":"III类","value":391},
	{"name":"IV类","value":109},
	{"name":"V类","value":65},
]
var piecolor = ["#16c7f8","#15abf1","#1fdc91","#ffd52b","#f97638"]
var leg = ["I类","II类","III类","IV类","V类"];

var unit = "个";
var xz = [];
var sc = [];
var xg = [];
var qt = []
var category = [];
var tabledata = [];
$(function(){
	$(".daochu").click(excel);
	searchdata(); // 查询数据
	inittable();// 加载表格
})
function searchdata(){
	 xz = [];
	 sc = [];
	 xg = [];
	 qt = [];
	 category = []
	for(var i =0; i < linedata.length; i++){
		xz.push(linedata[i]["新增"]);
		sc.push(linedata[i]["删除"]);
		xg.push(linedata[i]["修改"]);
		qt.push(linedata[i]["其他"]);
		category.push(linedata[i]["year"]);
	}
	var data = [];
	data.push(xz);
	data.push(sc);
	data.push(xg);
	data.push(qt);
	Echarts_line("#approval-zhucharts",unit, linecolor,linelegend,category, data);
	
	// 加载饼状图
	
	EChart_pie("#approval-piecharts", piecolor,leg, piedata)
	
	
}

// 柱状图
function Echarts_line(id,unit, color,legend,category, data){
	let elemt = echarts.init($(id)[0], 'default');
	let option = {
		title:{
			text:"排污口各项数量指标统计",
			textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
	                fontSize: 15,
	                fontStyle: 'normal',
	                fontWeight: '600',
	            },
			padding:10
		},
		 "tooltip": {
		    "trigger": "axis",
		    "axisPointer": {
		        "type": "shadow",
		        textStyle: {
		            color: "#fff"
		        }
		
		    },
		},
		"legend":{
			// orient: "vartical",
			x: "left",
			left:"10%",
			top:"10%",
			data: legend,
		    itemWidth: 14,
		    itemHeight: 14,
			itemStyle:{
				color:'#000'
			}
		},
		"grid": {
		    "borderWidth": 0,
		    "top": 90,
		    "bottom": 30,
			"left":60,
			"right":60,
		    textStyle: {
		        color: "#fff"
		    }
		},
		"calculable": true,
		"xAxis": [{
		    "type": "category",
		    "axisLine": {
		       show:true,
			   
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
		series:[]
	}
	
	for(var i =0; i < data.length; i++){
		var str = {
			name:legend[i],
			type:"bar",
			stack:"总量",
			barMaxWidth:26,
			itemStyle:{
				normal:{
					color:color[i]
				}
			},
			data:data[i]
		}
		option.series.push(str);
	}
	
	elemt.setOption(option);
}


// 
// 饼状图

function EChart_pie(id, color,category, data) {

    var elemt = echarts.init($(id)[0], 'default');
    var option1 = {
		// backgroundColor: "rgba(255,255,255,1)",
		title: {
			text: '入河排污口申请退回与受纳水体水质类别比例分析',
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
							borderColor: '#f2f2f2',
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

// 填充表格
function inittable(){
	
	var page1 = 0;
	layui.use('table', function(){
		
	  var table = layui.table;
		var count = 0;
	  table.render({
	    elem: '#demo'
	    ,url:'data.json',
		page: true,
		 limit: 5,
	    cols: [[
			{type:'checkbox'},
	      {field:'id',width:60,align:'center',title: '序号'},
	      {field:'name',minWidth:360, align:'center',title: '名称'},
		  {field:'sp', align:'center',title: '调整及审批情况'},
		  {field:'person', width:120,align:'center',title: '操作人'},
		  {field:'time',width:210, align:'center',title: '上传时间'},
		  {field:'status',width:160, align:'center',title: '排污口状态'},
		  {field:'right',width:80, align:'center',title:'操作', align:'center', toolbar: '#barDemo'}
	    ]]
		,response: {
	      statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
	    }
	    ,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
			if($(".layui-input").val()!=undefined){
				page1 = $(".layui-input").val();
				page1 = page1-1
			}
			var data = null,json = null;
			data = res.rows.item;
			tabledata = res.rows.item;
			// var aa = page.childElementCount;
			json = data.slice(page1*5,(page1+1)*5);
			count = res.rows.item.length
	      return {
	        "code": res.status, //解析接口状态
	        "msg": res.message, //解析提示文本
	        "count": res.rows.item.length, //解析数据长度
	        "data": json//解析数据列表
	      };
	    },
// 		request: {
// 		  pageName: 'curr' //页码的参数名称，默认：page
// 		  ,limitName: 'nums' //每页数据量的参数名，默认：limit
// 		}
	  });

	//监听行工具事件
	 table.on('tool(test)', function(obj){
	   var data = obj.data;
	   $(".layui-btn").attr({"target":"_blank","href":"../pwukmess/pwukmess.html#pwukmess-cont-right-smzq"});
	 });

	
	
	
	
	});
	
}

function excel(){
	var str = '<table id="tabledc" style="display:none"><tr><th>序号</th><th>名称</th><th>调整及审批情况</th><th>操作人</th><th>上传时间</th><th>排污口状态</th>'
	for(var i =0; i< tabledata.length; i++){
		str +='<tr><td>'+tabledata[i]["id"]+'</td><td>'+tabledata[i]["name"]+'</td><td>'+tabledata[i]["sp"]+'</td><td>'+tabledata[i]["person"]+'</td><td>'+tabledata[i]["time"]+'</td><td>'+tabledata[i]["status"]+'</td></tr>'
	}
	str +='</table>';
	$("body").append(str);
	var html = '<html><head><meta charset="utf-8"/></head><body>'+document.getElementById("tabledc").outerHTML +'</body></html>';
	// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
	var blob = new Blob([html], { type: "application/vnd.ms-excel" });
	var a = document.getElementById("daochu");
	// 利用URL.createObjectURL()方法为a元素生成blob URL
	a.href = URL.createObjectURL(blob);
	// 设置文件名
	a.download = "排污口列表.xls";
}




















