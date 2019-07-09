// $("#demo").height($(window).height()-110)
$(".layui-table").height($(window).height() - 110);
$(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function(){
	
  var table = layui.table;
	var count = 0;
  table.render({
    elem: '#demo'
    ,url:'sectiondata.json',
    height: $(window).height() - 110,
    width:$(window).width() - 70,
	page: true,
    cols: [[
      { type: 'checkbox' }
      , { field: 'SectionName', align: 'center', width: 240, title: '名称' }
      , { field: 'SectionCode', align: 'center', width: 180, title: '编码' }
      , { field: 'AssessmentCity', align: 'center', width: 180, title: '所属行政区' }            
      ,{field:'RiverLevel', align:'center', width:160, title: '河流湖库级别'}
      ,{field:'Basin', align:'center', width:140, title: '流域名称'}
      , { field: 'WaterSystem', align: 'center', width: 140, title: '水系名称' }
      , { field: 'SectionType', align: 'center', width: 160, title: '断面属性' }
      , { field: 'Lon', align: 'center', width: 160, title: '经度' }
      , { field: 'Lat', align: 'center', width: 160, title: '纬度' }
	  ,{field:'right', align:'center', width:140,title:'操作', align:'center', toolbar: '#barDemo'}
    ]]
	,response: {
      statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
    }
    ,parseData: function(res,index){ //将原始数据解析成 table 组件所规定的数据
		if($(".layui-input").val()!=undefined){
			page1 = $(".layui-input").val();
			page1 = page1-1
		}
		var data = null,json = null;
		data = res.rows.item;
		// var aa = page.childElementCount;
		json = data.slice(page1*10,(page1+1)*10);
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
    ,limitName: 'nums' //每页数据量的参数名，默认：limit
  },
	
// 	limit:10
  });
// 	laypage.render({
// 	  elem: '#page'
// 	  ,count: 70 //数据总数，从服务端得到
// 	  ,jump: function(obj, first){
// 		//首次不执行
// 		if(!first){
// 		  //do something
// 		}
// 	  }
// 	});

 //监听行工具事件
  table.on('tool(test)', function(obj){
    var data = obj.data;
    //console.log(obj)

    if(obj.event === 'del'){
      layer.confirm('真的删除行么', function(index){
        obj.del();
        layer.close(index);
      });
    } else if(obj.event === 'edit'){
      layer.prompt({
        formType: 2
        , value: data.SectionName
      }, function(value, index){
        obj.update({
          name: value
        });
        layer.close(index);
      });
    }
  });




});

$(function () {
    //导出
    $("#daochu").click(function () {
        //layer.open({
        //    type: 1
        //    //, offset: lb //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        //    //, id: 'layerDemo' + type //防止重复弹出
        //, title: "导出"
        //, content: '<div style="padding: 20px 100px;">导出成功</div>'
        //, btn: '关闭全部'
        //, btnAlign: 'c' //按钮居中
        //, shade: 0 //不显示遮罩
        //, yes: function () {
        //    layer.closeAll();
        //}
        //});
        var table = layui.table;
        table.exportFile(['排污口名称', '排污口编码', '所在地区区划代码', '排污口类别', '排放口地址', '排污口规模'], [
          ['彭水县郁山镇新中社区镇政府1号市政生活污水入河排污口', '500243104', '500243102002', '入河排污口', '彭水县郁山镇新中社区镇政府1号', '2|规模以下'],
         ['彭水县郁山镇新中社区镇政府1号市政生活污水入河排污口', '500243104', '500243102002', '入河排污口', '彭水县郁山镇新中社区镇政府1号', '2|规模以下'],
         ['彭水县郁山镇新中社区镇政府1号市政生活污水入河排污口', '500243104', '500243102002', '入河排污口', '彭水县郁山镇新中社区镇政府1号', '2|规模以下']
        ], 'xls'); //默认导出 csv，也可以为：xls
    });
    //新增
    $("#xinzeng").click(function () {
        layer.open({
            type: 1
        , title: ""
        , area: ['620px', '300px']
        , content: '<div style="padding: 10px;"><span>断面名称:<input class="layui-input" /></span><span>断面编码:<input class="layui-input" /></span><span>所属行政区:<input class="layui-input" /></span></div>'
        , btn: ['确定', '取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            layer.closeAll();
        }
        });

    });
    //修改
    $("#xiugai").click(function () {
        layer.open({
            type: 1
        , title: ""
        , area: ['620px', '300px']
        , content: '<div style="padding: 10px;"><span>断面名称:<input class="layui-input" value="阿七大桥" /></span><span>断面编码:<input class="layui-input" value="8"/></span><span>所属行政区:<input class="layui-input" value="凉山彝族自治州"/></span></div>'
        , btn: ['确定', '取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            layer.closeAll();
        }
        });
    });
    //删除
    $("#shanchu").click(function () {
        layer.open({
            type: 1
            //, offset: lb //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            //, id: 'layerDemo' + type //防止重复弹出
        , title: "删除"
        , content: '<div style="padding: 20px 100px;">确定删除选中数据？</div>'
        , btn: ['确定', '取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            layer.closeAll();
        }
        });
    });
});
