/**
 * Created by 张博 on 2017/6/5.
 */
//弹框的全局变量，暂时存储弹框
var layerIndex="";
// 分页数据信息集合的全局变量
var array=new Array;
// 基础查询搜索框舒服的数据
var searchValue = "";
// 默认从第一页显示
var page=1;
// 默认数据总条数为0
var total = 0;
// 默认每页显示5条
var size = 5;
// 页面统计总条数
var count=0;
//定义搜索框下拉框被选中值的全局变量 默认为"污染源名称"
var selectValue = "EpName";
$(function () {
    // 先根据屏幕大小设置右边栏样式，若小于1366则变成滑动显示样式
    select_right();
    // 初始化页面的数据和部分样式
    init();
    // 加载企业列表的数据,分页
    base_selectChange(page,size);
    // 关注企业
    attentionList();
    historyList();
});
// 这个是存储已选择的条件的数组，每次用这个数组生成条件
var kind=[];
// 存储当前页面是刷新，还是原基础执行查询
var isSearch=false;
/*
 * //高级搜索文本信息，用于将搜索关键字显示高亮 var highSearchMap={};
 */
// 搜索类型：基础，高级
var  search_type="base";
// 初始化函数，要在文档加载完成后进行初始化，初始页面的数据及样式类型
function init() {
    // 初始化搜索框类型
    $(".search_type").html("排口名称");
    $(".tabli").eq(1).addClass("selectli");

}
// 基础查询
function base_selectChange(page,size){
	 // var searchMap = getBaseSearchMap();
// 	 $.ajax({
// 			// 发送请求查询数据总条数和污染源信息 ?page=' + 1 + '&size=' + 5 +'&selectValue='+
// 			// selectValue +'&searchValue='+ searchValue
// //		 url:'../json/info.json',
// 			 	url : '../kqdata/queryDataByPage.do',
// 				data:{'page':page,'size':size,'selectValue':selectValue,'searchValue':searchValue},
// 				type : "post",
// 				dataType : 'JSON',
				// success : function(result) {

	$.getJSON("mock/company.json",function (result) {
        // 页面统计的条数



        // if(searchValue.length>0){
        //     $.getJSON("mock/jiangjin.json",function (data) {
        //         count=result.total;
        //         $(".count").html(count);
        //         array = data.list.slice((page-1)*size,page*size);
        //         var searchMap = getBaseSearchMap();
        //         // load_info(array,searchMap);
        //         load_info_img(array,searchMap);
        //         initpage(size,count,page);
        //         $(".main_bottom").show();
        //         return;
		// 	})
		// }

        // 对排口名称进行模糊搜索
        let myResult=result.list.filter(function (e) {
            return (e.PKMC.indexOf(searchValue)>-1);
        });
        count=myResult.length;
        $(".count").html(count);
        array = myResult.slice((page-1)*size,page*size);
        var searchMap = getBaseSearchMap();
        // load_info(array,searchMap);
        load_info_img(array,searchMap);
        initpage(size,count,page);
        $(".main_bottom").show();
    })

				// }
			// });
}
// 首页右侧展示 固定的 关注企业列表
function attentionList(obj){
	// $.ajax({
	// 	url : '../kqdata/attentionList.do',
	// 	type : 'post',
	// 	dataType : 'JSON',
	// 	data:{
	// 		limit : 6
	// 	},
	// 	success : function(result) {
	let result={
        "attention": [{
            "KQID": "53344513-6c83-11e8-8063-bb4bd0b32cc0",
            "EPNAME": "重庆市开州区排水有限公司入河排污口",
            "UPDATETIME": {
                "data": [120, 119, 2, 28, 10, 26, 35, 46, -54, 38, 64]
            }
        },
			{
            "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
            "EPNAME": "重庆市合川发电有限责任公司2号企业排污口",
            "UPDATETIME": {
                "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
            }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市丰都县三明油脂有限公司入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
                },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市益发包装有限公司入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
                },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "长寿区石堰镇兴隆污水处理厂混合废污水入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市合川排水有限公司混合废污水入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            }
		],
        "size": 5
    };
	if(obj){
		result.attention.unshift(obj);
	}
	var str="";
			if(result.attention.length>0){
	        $.each(result.attention,function (i,obj) {
	        	var time = new Date(parseInt(obj.UPDATETIME)).toLocaleString().split(" ")[0];
	        	var en = '';
	        	if( obj.EPNAME.length > 18 )
	        		en = '<span title="'+ obj.EPNAME +'">' + obj.EPNAME.substring(0,24) + '</span>...';
	        	else
	        		en = obj.EPNAME;

	            str+="<li><span><a onclick='openDetail(&quot;"+obj.KQID+"&quot;,&quot;"+obj.EPNAME+"&quot;);'>"+en+"</a></span></li>";//<span class='time'>"+ time +"</span>

	        });
			$(".myaim .myaimcon").removeClass("noaim");
			}else{
				str+="<img src='../image/archives/noaim.png'>";
				$(".myaim .myaimcon").addClass("noaim");

			}
			$(".myaim .myaimcon").html(str);
	// 	}
	// });
}
// 首页右侧展示 固定的 关注企业列表
function historyList(){
    // $.ajax({
    // 	url : '../kqdata/attentionList.do',
    // 	type : 'post',
    // 	dataType : 'JSON',
    // 	data:{
    // 		limit : 6
    // 	},
    // 	success : function(result) {
    let result={
        "attention": [{
            "KQID": "53344513-6c83-11e8-8063-bb4bd0b32cc0",
            "EPNAME": "重庆市开州区双兴再生能源有限公司排污口",
            "UPDATETIME": {
                "data": [120, 119, 2, 28, 10, 26, 35, 46, -54, 38, 64]
            }
        },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市梁平区双桂污水处理厂2号溢流口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME":"重庆市万州区龙沙镇龙安社区污水处理厂排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME":  "重庆市长寿区万顺镇污水处理工程入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市长寿区海棠镇污水处理厂工程入河排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            },
            {
                "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                "EPNAME": "重庆市万州区机场污水处理站排污口",
                "UPDATETIME": {
                    "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                }
            }
        ],
        "size": 5
    };    var str="";
    if(result.attention.length>0){
        $.each(result.attention,function (i,obj) {
            var time = new Date(parseInt(obj.UPDATETIME)).toLocaleString().split(" ")[0];
            var en = '';
            if( obj.EPNAME.length > 18 )
                en = '<span title="'+ obj.EPNAME +'">' + obj.EPNAME.substring(0,24) + '</span>...';
            else
                en = obj.EPNAME;

            str+="<li><span><a onclick='openDetail(&quot;"+obj.KQID+"&quot;,&quot;"+obj.EPNAME+"&quot;);'>"+en+"</a></span></li>";//<span class='time'>"+ time +"</span>

        });
        $(".myaim .myaimcon").removeClass("noaim");
    }else{
        str+="<img src='../image/archives/noaim.png'>";
        $(".myaim .myaimcon").addClass("noaim");

    }
    $(".history .myaimcon").html(str);
    // 	}
    // });
}
// 首页右侧展示 所有的 关注企业列表
function list_Attention(){
	// $.ajax({
	// 	url : '../kqdata/attentionList.do',
	// 	type : 'post',
	// 	dataType : 'JSON',
	// 	data:{
	// 		limit : 100
	// 	},
	// 	success : function(result) {
			let result={"attention":[{"KQID":"53344513-6c83-11e8-8063-bb4bd0b32cc0","EPNAME":"山西朔州山阴中煤顺通辛安煤业有限公司","UPDATETIME":{"data":[120,119,2,28,10,26,35,46,-54,38,64]}},{"KQID":"5333cfca-6c83-11e8-8063-bb4bd0b32cc0","EPNAME":"山西朔州山阴中煤顺通北祖煤业有限公司","UPDATETIME":{"data":[120,119,2,28,10,26,29,9,106,-29,-128]}}],"size":2};
			var str="<ol class='aimComList'>";
	        $.each(result.attention,function (i,obj) {
	        	var time = new Date(parseInt(obj.CreateTime)).toLocaleString().split(" ")[0];
	            str+="<li><span><span class='deactory' onclick=updateIsAim('"+obj.KQID+"',this)>★</span><a onclick='openDetail(&quot;"+obj.KQID+"&quot;,&quot;"+obj.EPNAME+"&quot;);'>"+obj.EPNAME+"</a></span></li>";//<span class='time'>"+ time +"</span>
	        });
	        str+="</ol><div class='aim_count'>共<span class='count' id='aim_count'>"+result.attention.length+"</span>条结果</div>";

	        layer.open({
		        type:1,
		        title:"<span class='layer_logo aim_logo'></span>关注企业列表",
		        area:["600px","390px"],
		        content:str
		    })

	// 	}
	// });
}

// ****************获取屏幕大小***************
function getScreen() {
  var screen_width=window.screen.width;
  return screen_width;
}
// ****************设置小屏幕右边栏***************
function select_right() {
    // 如果屏幕小于1366的话,隐藏右边栏,将其设置为滑动显示
    if(getScreen()<1366){
        // 先设置右边栏的初始样式，然后才能执行右边栏划出的样式
        $(".mainright").css({"position":"absolute","right":"0"});
        $(".mainright").hide();
        // 显示标签，鼠标放上可以划出右边栏，
        $(".little_tag").show();
        // 鼠标放上标签时的事件
        $(".little_tag").mouseenter(function () {
            $(".little_tag").hide();
            $(".mainright").show();
            // 这是animate.css中的class，通过添加和移除class来设置
            $(".mainright").removeClass('fadeOutRight');
            $(".mainright").addClass("animated fadeInRight");
        });
        // 鼠标离开标签时的事件
        $(".mainright").mouseleave(function () {
            $(".little_tag").show();
            // 设置移除样式的设置
            $(".mainright").removeClass('fadeInRight');
            $(".mainright").css({"position":"absolute","right":"-300"});
            $(".mainright").addClass("animated fadeOutRight");
        });
    }
}
var viewType = 1;
// 切换视图的单击事件
function tiaozhuan(type) {
	viewType = type;
	var searchMap = {};
	if (search_type == "base") {
		/* 基础搜索显示的图标 */
		searchMap = getBaseSearchMap();
	} else if (search_type == "high") {
		searchMap = getHighSearchMap();

	}
	if(viewType){
        load_info(array, searchMap)

    }else {
        load_info_img(array, searchMap)

    }
}

// ************加载主要的企业信息**************

function load_info(array,searchMap) {
	isSearch = true;
	var info_str="";
	if(array.length>0){
            // 加载列表模式的代码
   		$(".view_way").html("<span class='view_method1 simple_view' onclick='tiaozhuan(0)'>图文模式</span><span class='map-view' onclick='' >地图模式</span>")
            for(var i=0;i<array.length;i++){
            	var source=formatterSource(array[i].WATSYSTEMCODE);
            	 info_str+='<li>' +
            	'<div class="company_info"><p class="maintitle"><a onclick="openNewPanel()">'+check_highlight(searchMap,'EpName',array[i].PKMC)+'</a><span class="updateTime">'+array[i].GXSJ+'</span></p>' +
              	'<ol class="companyList"><li><span class="key">排污口编码：</span><span class="code">'+check_highlight(searchMap,'CreditCode',array[i].PWXKZBH)+'</span>' +
                  '<span class="key">联系人：</span><span class="person">'+check_highlight(searchMap,'LegalPersonName',array[i].LXRXM)+'</span></li>' +
                  '<li><span class="key">设置单位：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].SZDWMC)+'</span></li>' +
                  '<li><span class="key">地址：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].DIZHI)+'</span></li>' +
                  '<li><span class="key">数据来源：</span><span class="source"><span class="system">'+check_minRals(array[i].SJLY)+'</span></span><span class="key">数据状态：</span><span class="source"><span class="system">'+check_minRals(array[i].JHZT)+'</span></span></li> ' +
                  '<li><ol class="pf-type"><li>'+array[i].PWKLX+'</li><li>'+array[i].PWKGM+'</li><li>'+array[i].PWKLB+'</li><li>'+array[i].RHHFS+'</li><li>'+array[i].PFFS+'</li></ol></li></ol></div>' +
                  '<div class="tag"><span id="'+array[i].EPCODE+'" class="if_aim">'+check_aim(array[i], isSearch)+'</span></div>' +
                  '</li>';
            }
    		$(".maincenter").removeClass("noinfo");
    		if($(".maincon").length==0){
    			$(".maincenter").html("<ul class='maincon'></ul><div class='paginat' id='paginta'><div id='page'></div></div>")
    		}
    $(".maincon").html(info_str);
    $(".maincon>li").css("opacity","0");
	}else{
		info_str+="<img src='../../image/archives/noinfo.png' style='width:489px;height:273px'><p class='no_p'>未搜索到对应信息，请重新进行搜索</p>";
		$(".maincenter").html(info_str);
		$(".maincenter").addClass("noinfo");

	}

    info_color_bar();
    set_animate_load();
    set_aim();
    // var interval=setInterval(function(){
    // 	if(arcLoaded){
    // 		clearInterval(interval);
    // 		addPointsToMap(array);
    // 	}
    // },50);
}
function load_info_img(array,searchMap) {
    isSearch = true;
    var info_str="";
    if(array.length>0){
        // 加载列表模式的代码
   		$(".view_way").html("<span class='view_method1 hard_view' onclick='tiaozhuan(1)'>图文模式</span><span class='map-view' onclick='' >地图模式</span>");
        for(var i=0;i<array.length;i++){
            var source=formatterSource(array[i].WATSYSTEMCODE);
            info_str+='<li>' +
                '<div class="company_info"><div class="company-img-content"><img src="" alt="暂无图片"></div><div class="company-info-content"><p class="maintitle"><a onclick="openNewPanel()">'+check_highlight(searchMap,'EpName',array[i].PKMC)+'</a><span class="updateTime">'+array[i].GXSJ+'</span></p>' +
                '<ol class="companyList"><li><span class="key">排污口编码：</span><span class="code">'+check_highlight(searchMap,'CreditCode',array[i].PWXKZBH)+'</span>' +
                '<span class="key">联系人：</span><span class="person">'+check_highlight(searchMap,'LegalPersonName',array[i].LXRXM)+'</span></li>' +
                '<li><span class="key">设置单位：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].SZDWMC)+'</span></li>' +
                '<li><span class="key">地址：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].DIZHI)+'</span></li>' +
                '<li><span class="key">数据来源：</span><span class="source"><span class="system">'+check_minRals(array[i].SJLY)+'</span></span><span class="key">数据状态：</span><span class="source"><span class="system">'+check_minRals(array[i].JHZT)+'</span></span></li> ' +
                '<li><ol class="pf-type"><li>'+array[i].PWKLX+'</li><li>'+array[i].PWKGM+'</li><li>'+array[i].PWKLB+'</li><li>'+array[i].RHHFS+'</li><li>'+array[i].PFFS+'</li></ol></li></ol></div></div>' +
                '<div class="tag"><span id="'+array[i].EPCODE+'" class="if_aim">'+check_aim(array[i], isSearch)+'</span></div>' +
                '</li>';
        }
        $(".maincenter").removeClass("noinfo");
        if($(".maincon").length==0){
            $(".maincenter").html("<ul class='maincon'></ul><div class='paginat' id='paginta'><div id='page'></div></div>")
        }
        $(".maincon").html(info_str);
        $(".maincon>li").css("opacity","0");
    }else{
        info_str+="<img src='../../image/archives/noinfo.png' style='width:489px;height:273px'><p class='no_p'>未搜索到对应信息，请重新进行搜索</p>";
        $(".maincenter").html(info_str);
        $(".maincenter").addClass("noinfo");

    }
    getImgSrc();
    info_color_bar();
    set_animate_load();
    set_aim();
    // var interval=setInterval(function(){
    // 	if(arcLoaded){
    // 		clearInterval(interval);
    // 		addPointsToMap(array);
    // 	}
    // },50);
}

// ************动态生成信息颜色条的设置****************
function info_color_bar() {
    for(var j=0;j<$(".maincon").children("li").length;j++){
        switch (j%5){
            case 0:
                $(".maincon").children("li").eq(j).find(".company_info ").css("border-left","4px solid #1c84c6");
                break;
            case 1:
                $(".maincon").children("li").eq(j).find(".company_info ").css("border-left","4px solid #1ab394");
                break;
            case 2:
                $(".maincon").children("li").eq(j).find(".company_info ").css("border-left","4px solid #ed5565");
                break;
            case 3:
                $(".maincon").children("li").eq(j).find(".company_info ").css("border-left","4px solid #f8ac59");
                break;
            case 4:
                $(".maincon").children("li").eq(j).find(".company_info ").css("border-left","4px solid #00bed5");
                break;
        }
    }
}
// ***********设置加载信息的动画效果***************
function set_animate_load() {
    var i=0;
    var time=setInterval(function () {
        $(".maincon>li").eq(i).animate({opacity:1},300);
        i++;
        if(i>=size){
            clearInterval(time);
        }
    },100);
}
// ************判断是否对该企业进行关注*************
function check_aim(object, isSearch) {
	var epcodeAim=$(".if_aim").find("img").attr("epcode");
	if( epcodeAim != null && epcodeAim != undefined && epcodeAim != '' && isSearch == false){
		// $.ajax({
		// 	url : '../kqdata/changeAttentionStats.do',
		// 	type : 'post',
		// 	dataType : 'JSON',
		// 	data:{
		// 		epcode : object.EPCODE,
		// 		changeStats : object.ATTENTION
		// 	},
		// 	success : function(result) {
				attentionList(
                    {
                        "KQID": "5333cfca-6c83-11e8-8063-bb4bd0b32cc0",
                        "EPNAME": "重庆市渝北区翠桃路污水处理厂入河排污口",
                        "UPDATETIME": {
                            "data": [120, 119, 2, 28, 10, 26, 29, 9, 106, -29, -128]
                        }
                    }
				);
		// 	}
		// });
	}
    // 关注则为1类型，不关注则为其他
    if( object.ATTENTION == 1 ){
        return "<img src='image/archives/aim.png' value='1' epcode='"+ object.EPCODE +"' >";
    }else {
        return "<img src='image/archives/unaim.png' value='0' epcode='"+ object.EPCODE +"' >";
    }
}
// **********设置是否关注企业*************
// 点击星星按钮可以设置或取消关注
function set_aim() {
    $(".if_aim").click(function () {
        var myaim=$(this).find("img").attr("value");
        var epcode=$(this).find("img").attr("epcode");
        // var epname=$(this).find("img").attr("epname");
        if(myaim==1){
            myaim=0;
        }else {
            myaim=1;
        }
        var object = new Object();
        object.ATTENTION = myaim;
        object.EPCODE = epcode;
        // object.epName = epname;
        $(this).html(check_aim(object, false));
    })
}
// 加载高级搜索结果列表
function loadHighSearch(size,page){
	var highSearchStr = getHighSearchStr();
	$.ajax({
		url: '../kqdata/highSearchMineDataByPage.do',
		type: 'post',
		dataType: 'json',
		data:{
			size : size,// 每页5条数据
			page : page,// 从第1页开始
			highSearch : highSearchStr
		},
		success: function(result){
			var highSearchStr = getHighSearchStr();
			var highSearchMap = getHighSearchMap();
			count=result.total;
			array = result.list;
			load_info(array,highSearchMap);
			$(".count").html(count);
			initpage(size,count,page);// 初始化分页
		}
	});
}



/* 08-22 */
/* 修改密码 */ /* 内部是一个单纯的表单 */
function updatePass(){
	 layerIndex=layer.open({
	        type:1,
	        title:"修改密码",
	        area:["500px","300px"],
	        offset:["200px","450px"],
	        content:"<form action='' method='post' class='openform'><table class='one_hang'><tr><td><label class='little_title'>原密码：</label></td><td><input id='oldPass' type='password' name='oldPass'></td></tr>" +
	        "<tr><td><label class='little_title'>新密码：</label></td><td><input id='newPass' type='password' name='newPass'></td></tr><tr><td><label class='little_title'>确认密码：</label></td><td>" +
	        "<input id='rePass' type='password' name='rePass'></td></tr></table><input type='button' class='onpassexit' value='取消' onclick='sub_exit()'><input type='button' class='onpassok' value='提交' onclick='sub_pass()'></form>"
	    })
}
function sub_exit(){
	layer.closeAll();
}
function sub_pass(){
	var oldPass = $('#oldPass').val();
	var newPass = $('#newPass').val();
	var rePass = $('#rePass').val();
	if(oldPass == newPass){
		alert("新旧密码不能一致");
		return false;
	}else if(newPass.length<5 || newPass.length>20){
		alert("密码长度必须为5-20位");
		return false;
	}else if(newPass != rePass) {
		alert("两次输入的新密码不一致，请重新输入！");
		$('#newPass').val('');
		$('#rePass').val('');
		return false;
	}
	$.ajax({// 验证密码
        url:"../dicTable/validationPass.do",
        type: 'POST',
        data:{'oldPass':oldPass},
        success: function (data) {
        	var datas=JSON.parse(data);
        	if(datas.status.status=="1"){
    			// 成功
        		$.ajax({// 验证密码
        	        url:"../dicTable/editPass.do",
        	        type: 'POST',
        	        data:{'oldPass':oldPass,'newPass':newPass,'rePass':rePass},
        	        success: function (data) {
        	        	var datas=JSON.parse(data);
        	        	if(datas.isSuccess){
        	        		alert("修改成功");
        	        		loginOutM();
        	        	}
        	        }
        		});
        	}else{
                alert("请输入正确的原密码");
        	}
        }
    });

}
/* 退出系统的方法 */
function exit_system(){
	layer.confirm('确认退出吗?', {icon: 3, title:'提示'}, function(index){
		  // do something
		  loginOutM();
		  layer.close(index);
		});
}


// 取消关注记录
function updateIsAim(PolluteNb,e){
	var delaim=layer.confirm('确认不再关注该企业么?', {icon: 3, title:'提示'}, function(index){
		$.ajax({
			url : '../kqdata/changeAttentionStats.do',
			type : 'post',
			dataType : 'JSON',
			data:{
				epcode : PolluteNb,
				changeStats : 0,
			},
			success : function(result) {
				layer.close(delaim);
				layer.msg("取消关注成功",{time:2000,icon:1,shade:0.3,
	        		success: function(layero, index){
						$(e).parent().parent().remove();
						attentionList();
						$('#'+PolluteNb).html("<img src='../../image/archives/unaim.png' value='0' epcode='"+ PolluteNb +"' >");
	        	  }});

			}
		});
		layer.close(index);
	});
}
function check_img(img){
	if(img==""){
		return "../../image/archives/nopic.png";
	}else{
		return img;
	}
}
function loginOutM(){
	$.ajax({
        url:"../dicTable/loginOut.do",
        type: 'POST',
        success: function (data) {
        if(data=='1'){
			 top.location='../';
        }
        }
    });
}
//用户点击企业后打开新页面展示
function openDetail(epcode,epname){
	window.open("../company.do?EPCODE="+epcode+"&EPNAME="+epname, "_blank");
}

//搜索矿企enter事件
function searchKuangName(event){
	var name=$("#intext").val();
    if (event.keyCode == 13){
//    	 getCityByName(name);
    	searchValue=name;
    	base_selectChange(page,size)
    }
}



// pwukmess
// 打开新页面
function openNewPanel() {
    // $("#main-iframe",window.parent.document)
    // $("#main-iframe").attr("src","panel/pwukmess/pwukmess.html");
    window.open("panel/pwukmess/pwukmess.html","_blank")
}
function getImgSrc() {
    // let num=Math.random()*10;
    for(let i = 0;i<$(".company-img-content>img").length;i++){

        $(".company-img-content>img").eq(i).attr("src","image/archives/"+(i+1)+".png")
    }
    // return "image/archives/"+num+".png";
}
