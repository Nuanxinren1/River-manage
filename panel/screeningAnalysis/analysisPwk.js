// $("#demo").height($(window).height()-110)
// $(".layui-table").height($(window).height() - 110);
// $(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function(){

    var table = layui.table;
    var count = 0;
    table.render({
        elem: '#renk'
        ,url:'pwukdata.json',
        height:"400",
        cellMinWidth: 80 ,//全局定义常规单元格的最小宽度，layui 2.2.1 新增
        page: true,
        cols: [[
            {field:'renk', title: '排名'},
            { field: 'code', align: 'center', title: '排污口编码' },
            {field:'name', align:'center',  title: '排污口名称'}
            , { field: 'area', align: 'center',  title: '区域' }
            , { field: 'scal', align: 'center',  title: '许可排污量(吨)' }
            ,{field:'WaterIntake', align:'center',  title: '实际排污量(吨)'}
        ]]
        ,response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        }
        ,parseData: function(res,index){ //将原始数据解析成 table 组件所规定的数据
            console.log(res);
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
                ,value: data.name
            }, function(value, index){
                obj.update({
                    name: value
                });
                layer.close(index);
            });
        }
    });




});


layui.use('table', function(){

    var table = layui.table;
    var count = 0;
    table.render({
        elem: '#shuizhi'
        ,url:'pwukdata.json',
        height:"320",
        cellMinWidth: 80 ,//全局定义常规单元格的最小宽度，layui 2.2.1 新增
        page: true,
        cols: [[
            {field:'renk', title: '排名'},
            { field: 'code', align: 'center', title: '排污口编码' },
            {field:'name', align:'center',  title: '排污口名称'}
            , { field: 'area', align: 'center',  title: '区域' }
            ,{field:'WaterIntake', align:'center',  title: '实际排污量(吨)'}
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
                ,value: data.name
            }, function(value, index){
                obj.update({
                    name: value
                });
                layer.close(index);
            });
        }
    });




});
