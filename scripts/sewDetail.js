(function(){
	layui.use(['carousel', 'form'], function() {
		var carousel = layui.carousel,
			form = layui.form;
	
		//常规轮播
		carousel.render({
			elem: '#sewagePic',
			arrow: 'always',
			interval: 1800,
			width: '300px',
			height: '200px'
		});
	
		var element = layui.element;
	
		element.on('tab(pkSwitch)', function(data) {
			if (data.index === 1) {
				setChart();
			}
		});
	
	});
	
	var option = {
		title: {
			text: "过去24小时监测数据"
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['化学需氧量', '氨氮', '总氮', '总磷'],
			top: 25
		},
		toolbox: {
			show: true,
			feature: {
				mark: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			},
			top: 25
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
				name: '化学需氧量',
				type: 'line',
				stack: '浓度',
				data: [16, 23, 13, 20, 19, 28]
			},
			{
				name: '氨氮',
				type: 'line',
				stack: '浓度',
				data: [0.8, 1, 1, 0.6, 1.5, 2.1, 1.4]
			},
			{
				name: '总氮',
				type: 'line',
				stack: '浓度',
				data: [0.32, 0.72, 0.43, 1.1, 0.6, 0.44]
			},
			{
				name: '总磷',
				type: 'line',
				stack: '浓度',
				data: [0.05, 0.08, 0.12, 0.17, 0.22, 0.08]
			}
		]
	};
	
	function setChart() {
		var eleEchart = echarts.init($("#monitorChart")[0]);
		eleEchart.setOption(option);
		eleEchart.dispatchAction({
			type: 'legendUnSelect',
			// 图例名称
			name: "化学需氧量"
		})
	}
	
	var urlInfos = window.location.href.split('?');
	if(urlInfos.length > 1){
		debugger;
		var   paramObject = GetURLParams(document.location.href);
		// var params = urlInfos[1].split('&');
		// $("#overPollData .title").html(params[0]);
		// $(".layui-tab .rpfl").html(params[1]);
		// $(".layui-tab .zywrw").html(params[2]);
		// $(".layui-tab .wzzb").html(params[3]);
		var pkName = decodeURI(paramObject["pkName"]);
		$("#overPollData .title").html(pkName);
		$(".layui-tab .rpfl").html("45吨");
		$(".layui-tab .zywrw").html("COD、氨氮、总氮");
		$(".layui-tab .wzzb").html(paramObject["lon"]+","+paramObject["lat"]);
	}	
	$('#returnResult').on('click',function(){
		//window.close();
		window.close();
		parent.closeOpenBasic();
	});
})()

// paramObject = coustomTool.GetURLParams(document.location.href);

    //获取URL参数
function GetURLParams (URL) {

        var statrIndex = URL.indexOf('?');
        var paramString = URL.substr(statrIndex + 1);
        var paramObject = null
        if (paramString.indexOf('&') > 0) {
            paramObject = new Object();
            var paramArray = paramString.split('&');
            for (var i = 0; i < paramArray.length; i++) {
                if (paramString.indexOf('=') > 0) {
                    var objName = paramArray[i].split('=')[0];
                    var objValue = paramArray[i].split('=')[1];
                    paramObject[objName] = objValue;
                }
            }
        }
        else {
            if (paramString.indexOf('=') > 0) {
                paramObject = new Object();
                var objName = paramString.split('=')[0];
                var objValue = paramString.split('=')[1];
                paramObject[objName] = objValue;
            }
        }
        return paramObject;
	}
	
	function hexToString(str){
		　　　　var val="";
		　　　　var arr = str.split(",");
		　　　　for(var i = 0; i < arr.length; i++){
		　　　　　　val += arr[i].fromCharCode(i);
		　　　　}
		　　　　return val;
		　　}