﻿// $("#demo").height($(window).height()-110)
$(".layui-table").height($(window).height() - 110);
$(".layui-table").width($(window).width() - 70);
var page1 = 0;
layui.use('table', function () {

    var table = layui.table;
    var count = 0;
    table.render({
        elem: '#demo'
      , url: 'yjyuan.json',
        height: $(window).height() - 110,
        width: $(window).width() - 70,
        page: true,
        cols: [[
          // {field:'id', width:80, title: '序号'},
          { type: 'checkbox', width: 60 }
          ,{ field: 'name', align: 'center', width: 500, title: '预案名称' }
          , { field: 'writer', align: 'center', width: 180, title: '作者' }
          , { field: 'style', align: 'center', width: 160, title: '预案分类' }
          ,{ field: 'right', align: 'center', width: 140, title: '操作', align: 'center', toolbar: '#barDemo' }
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

        if (obj.event === 'down') {
            layer.confirm('下载该文件',
                { title: "下载" },
                function (index) {
                    obj.del();
                    layer.close(index);
                });
        } else if (obj.event === 'shenhe') {
            layer.prompt(
                {
                    formType: 2,
                    value: data.name,
                    title: "审核"
                },
            function (value, index) {
                obj.update({
                    name: value
                });
                layer.close(index);
            });
            $(".layui-layer-content").append("<br/><input type=\"text\" id= \"zxr\" class=\"layui-input\" placeholder=\"审核人\"/>")

        }
        else if (obj.event === 'detail') {
            layer.prompt({
                formType: 2,
                //placeholder: '输入注销原因',
                value: data.name + "详情",
                title: '详情',
                //                    area: ['800px', '350px'] //自定义文本域宽高
            }, function (value, index, elem) {
                obj.update({
                    name: value
                });
                /* if(value===""){
                     layer.msg("请填写注销原因")
                     return;
                 }
                 */
                //if ($('#zxr').val() === "") {
                //    layer.tips("请填写注销人", $('#zxr'));
                //    return;
                //}
                //                    alert(value); //得到value
                layer.close(index);
            });


        }
    });




});


$(function () {
    //导出
    $("#daochu").click(function () {
        layer.open({
            type: 1
            //, offset: lb //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            //, id: 'layerDemo' + type //防止重复弹出
        , title: "导出"
        , content: '<div style="padding: 20px 100px;">导出成功</div>'
        , btn: '关闭全部'
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            layer.closeAll();
        }
        });
    });
    //新增
    $("#xinzeng").click(function () {
        layer.open({
            type: 1
        , title: ""
        , area: ['620px', '300px']
        , content: '<div style="padding: 10px;"><img src="../../../img/datamanager/uploadfile.png" /></div>'
            //, btn: '关闭全部'
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
        , content: '<div style="padding: 10px;"><img src="../../../img/datamanager/edit.png" /></div>'
            //, btn: '关闭全部'
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
        , content: '<div style="padding: 20px 100px;">确定删除该文件？</div>'
        , btn: ['确定', '取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            layer.closeAll();
        }
        });
    });
});