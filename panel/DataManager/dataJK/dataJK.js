// $("#demo").height($(window).height()-110)
//$(".layui-table").height($(window).height() - 110);
//$(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function () {

    var table = layui.table;
    var count = 0;
    table.render({
        elem: '#demo1'
      , url: 'dataJK.json',
        //height: $(window).height() - 110,
        //width: $(window).width() - 70,
        page: true,
        cols: [[
           {field:'id', width:60, title: '序号'}
          , { field: 'style', align: 'center', width: 120, title: '数据类' }
          , { field: 'file', align: 'center', width: 120, title: '数据库或文件', templet: '<div><span title="{{d.file}}">{{d.file}}</span>/div>' }
          , { field: 'name', align: 'center', width: 90, title: '名称' }
           , { field: 'number', align: 'center', width: 90, title: '数据量' }
          , { field: 'relation', align: 'center', width: 90, title: '关联量' }
          , { field: 'norelation', align: 'center', width: 90, title: '未关联' }
        ]]
      , response: {
          statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
      }
      ,
      page: false,
      parseData: function (res, index) { //将原始数据解析成 table 组件所规定的数据
          
          return {
              "code": res.status, //解析接口状态
              "msg": res.message, //解析提示文本
              "count": res.rows.item.length, //解析数据长度
              "data": res.rows.item//解析数据列表
          };
      },
        
    });
});
layui.use('table', function () {

    var table = layui.table;
    var count = 0;
    
    table.render({
        elem: '#demo2'
      , url: 'zuoye.json',
        //height: $(window).height() - 110,
        //width: $(window).width() - 70,
        page: true,
        cols: [[          
           //{ type: 'checkbox' }
           //,
           { field: 'id', width: 60, title: '序号' }
          , { field: 'style', width: 120, align: 'center', title: '数据类' }
          , { field: 'file', align: 'center', title: '数据库或文件', templet: '<div><span title="{{d.file}}";display:block;>{{d.file}}</span></div>' }
          , { field: 'name', align: 'center',  title: '名称' }
           , { field: 'target', align: 'center',  title: '目标库' }
          , { field: 'targetname', align: 'center',  title: '目标名称' }
          , { field: 'jobname', align: 'center',  title: '作业名称' }
          , { field: 'input', align: 'center',  title: '输入量' }
          , { field: 'output', align: 'center',  title: '输出量' }
           , { field: 'start', align: 'center',  title: '开始时间' }
          , { field: 'end', align: 'center', title: '结束时间' }
          , { field: 'result', align: 'center', width: 90, title: '执行结果' }
        ]]
      , response: {
          statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
      }
      , parseData: function (res, index) { //将原始数据解析成 table 组件所规定的数据
          if ($(".layui-input").val() != undefined) {
              page1 = $(".layui-input").val();
              page1 = page1 - 1
          }
          var data = null, json = null;
          data = res.rows.item;
          // var aa = page.childElementCount;
          json = data.slice(page1 * 10, (page1 + 1) * 10);
          count = res.rows.item.length
          return {
              "code": res.status, //解析接口状态
              "msg": res.message, //解析提示文本
              "count": res.rows.item.length, //解析数据长度
              "data": json//解析数据列表
          };
      },
        // 	page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
        //       layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局  
        //       ,curr: 0 //设定初始在第 5 页
        //       ,groups: 3 //只显示 1 个连续页码
        //       ,first: false //不显示首页
        //       ,last: false //不显示尾页
        //       
        //     },
        request: {
            pageName: 'curr' //页码的参数名称，默认：page
        , limitName: 'nums' //每页数据量的参数名，默认：limit
        },

        // 	limit:10
    });



});
$(function () {
    EChart_line("#diagram");
});
// 折线图
//$.get("linedata.json", function (result) {
//    var lineData = result;
//    lineData = lineData[0];
//    EChart_line("#diagram", lineData);
//});
function EChart_line(id) {

    var elemt3 = echarts.init($(id)[0], 'default');
    var option3 = {
        title: { text: "新增监测数据数量和排口总数量变化" },
        tooltip: {
            trigger: 'axis',
            // 			axisPoint:{
            // 				type:"shadow",
            // 			},
            backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
            borderRadius: 8,//边框圆角
            padding: [10, 20, 10, 20],    // [5, 10, 15, 20] 内边距
            position: function (p) {
                return [p[0] + 10, p[1] - 10];
            },
            formatter: function (params) {
                var res = params[0]["name"];
                for (var i = 0, l = params.length; i < l; i++) {
                    res += " :" + params[0]["value"];//鼠标悬浮显示的字符串内容
                }

                return res;
            },
            textStyle: {
                color: "#000",
                background: "#fff"
            }
        },
        xAxis: {
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31],
            splitLine: { show: false },//去除网格线
            splitArea: { show: false },//保留网格区域
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#e5e5e5',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#b3b3b3',//坐标值得具体的颜色

                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: { show: false },//去除网格线
            splitArea: { show: false },//保留网格区域
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#e5e5e5',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#b3b3b3',//坐标值得具体的颜色

                }
            }
        },
        series: [{
            data: [5000, 6000, 4000, 4500, 3900, 7000, 6500, 3400, 5500, 6100, 4000, 5000, 6700, 5500, 3900, 5000, 7500, 8400, 5500, 6100, 3900, 7000, 6500, 3400, 5500, 6100, 7000, 6500, 3400, 5500, 6100, 4500],
            type: 'line',
            smooth: true,
            //symbol: 'circle',     //设定为实心点
            //symbolSize: 8,   //设定实心点的大小
            lineStyle: {
                normal: {
                    color: "#00c1de",
                    width: 3
                }
            },
            itemStyle: {
                normal: {
                    color: "#00c1de",
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00c1de'
                    }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0)'
                    }]),
                }
            }


        }]
    };
    elemt3.setOption(option3);
    elemt3.on("click", function (params) {
        selectValue = params.value;
        selectTime = params.name;
        $(".qbNumber" + index).html(selectValue);
        $(".selectDate" + index).html("(" + selectTime + "年)");
    });
}