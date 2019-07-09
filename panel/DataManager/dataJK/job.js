// $("#demo").height($(window).height()-110)
$(".layui-table").height($(window).height() - 110);
$(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function(){
	
  var table = layui.table;
	var count = 0;
  table.render({
    elem: '#demo'
    ,url:'job.json',
    height: $(window).height() - 110,
    width: $(window).width() - 70,
	page: true,
	cols: [[
        //	系统名称	作业名称	定时设置	数据库种类	运行状态	最后运行时间
//id	system	job	core	database	state	runtime
      { type: 'checkbox' }         
      , { field: 'id', width: 50, title: '序号' }
      , { field: 'system', align: 'center', width: 320, title: '系统名称' }
      , { field: 'job', align: 'center', width: 200, title: '作业名称' }
      , { field: 'core', align: 'center', width: 160, title: '定时设置' }
      
      , { field: 'database', align: 'center', width: 160, title: '数据库种类' }
      , { field: 'state', align: 'center', width: 160, title: '运行状态' }
      , { field: 'runtime', align: 'center', width: 140, title: '最后运行时间' }
     
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
        , value: data.system
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
        //, btn: '确定'
        //, btnAlign: 'c' //按钮居中
        //, shade: 0 //不显示遮罩
        //, yes: function () {
        //    layer.closeAll();
        //}
        //});
        var table = layui.table;
        table.exportFile(['系统名称', '作业名称', '定时设置', '数据库种类', '运行状态', '最后运行时间'], [
          ['第二次污染源普查系统', '空间信息同步', '每15分钟运行一次', '源数据库', '运行中', '2019-04-17 17:23:12'],
          ['专项行动排查数据及流域及地方入河、入海排污口设置系统', '排污口信息同步', '每10分钟运行一次', '源数据库', '停止中', '2019-04-17 03:03:12'],
          ['上海入河、入海排污口信息管理系统', '入海排污口设置审批信息', '每5分钟运行一次', '源数据库', '暂停中', '2019-04-17 12:14:12'],
          ['四川入河、入海排污口信息管理系统', '断面信息同步', '每20同步一次', '业务库', '停止中', '2019-04-17 17:34:13'],
          ['重庆入河、入海排污口信息管理系统', '危险品管理数同步', '不进行定时，手动执行', '知识库', '停止中', '2019-04-17 16:14:14'],
          ['青海入河、入海排污口信息管理系统', '事故案例管理同步', '每5分钟运行一次', '知识库', '停止中', '2019-04-17 18:22:15'],
          ['四川入河、入海排污口信息管理系统', '水质监测数据同步', '每2分钟运行一次', '业务库', '停止中', '2019-04-17 17:02:16'],
          ['江苏入河、入海排污口信息管理系统', '水功能区数据同步', '每5分钟运行一次', '基础库', '运行中', '2019-04-17 17:14:17'],
          ['湖北入河、入海排污口信息管理系统', '水文数据同步', '每5分钟运行一次', '基础库', '运行中', '2019-04-17 15:22:18'],
          ['江西入河、入海排污口信息管理系统', '断面监测数据', '每5分钟运行一次', '业务库', '运行中', '2019-04-17 17:14:19'],
          ['云南入河、入海排污口信息管理系统', '影像数据同步', '每5分钟运行一次', '业务库', '暂停中', '2019-04-17 16:54:20'],
          ['第二次污染源普查系统', '污染源数据同步', '每5分钟运行一次', '源数据库', '运行中', '2019-04-17 17:14:21'],
          ['安徽入河、入海排污口信息管理系统', '入河、入海排污口基本信息数据同步', '每5分钟运行一次', '业务库', '运行中', '2019-04-17 13:19:22'],
          ['专项行动排查数据及流域及地方入河、入海排污口设置系统', '地理信息数据', '每6分钟运行一次', '业务库', '运行中', '2019-04-17 13:19:23'],
          ['重庆入河、入海排污口信息管理系统', '污染源数据', '每7分钟运行一次', '业务库', '运行中', '2019-04-17 13:19:24'],
          ['上海入河、入海排污口信息管理系统', '海洋数据同步', '每8分钟运行一次', '业务库', '运行中', '2019-04-17 13:19:25']
        ], 'xls'); //默认导出 csv，也可以为：xls
    });
    //新增
    $("#xinzeng").click(function () {
        layer.open({
            type: 1
        , title: ""
        , area: ['620px', '300px']
        , content: '<div style="padding: 10px;"><span>系统名称:<input class="layui-input" /></span><span>作业名称:<input class="layui-input" /></span><span>数据库种类:<input class="layui-input" /></span></div>'
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
        , content: '<div style="padding: 10px;"><span>系统名称:<input class="layui-input" value="第二次污染源普查系统" /></span><span>作业名称:<input class="layui-input" value="空间信息同步"/></span><span>数据库种类:<input class="layui-input" value="源数据库"/></span></div>'
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