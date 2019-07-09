// $("#demo").height($(window).height()-110)
$(".layui-table").height($(window).height() - 110);
$(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function () {

    var table = layui.table;
    var count = 0;
    table.render({
        elem: '#demo'
      , url: 'log.json',
        height: $(window).height() - 110,
        width: $(window).width() - 70,
        page: true,
        cols: [[
           //{ field: 'id', width: 80, title: '序号' },
           { type: 'checkbox' }
           , { field: 'userAccount', align: 'center', title: '账号' }
           , { field: 'userName', align: 'center', title: '姓名' }
            , { field: 'date', align: 'center', title: '操作时间' }
            , { field: 'ip', align: 'center', title: 'ip' }
           , { field: 'content', align: 'center', title: '操作内容' }
           , { field: 'detail', align: 'center', title: '操作详情' }
           //, { field: 'right', align: 'center', title: '操作', align: 'center', toolbar: '#barDemo' }
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
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        //console.log(obj)

        if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            layer.prompt({
                formType: 2
              , value: data.name
            }, function (value, index) {
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
        table.exportFile(['账号', '姓名', '操作时间', 'ip', '操作内容', '操作详情'], [
          ['500110120000', '刘锦泉', '2019/04/24 14:40:48', '192.168.5.130', '登录系统', '成功登录系统']        
        ], 'xls'); //默认导出 csv，也可以为：xls
    });
});

