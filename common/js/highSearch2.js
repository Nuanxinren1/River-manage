/**
 * Created by 张博 on 2017/6/5.
 */
//高级搜索JS抽取后的(gis页面也同时引这个)
// 分页数据信息集合的全局变量
var array=new Array;
// 基础查询搜索框舒服的数据
var searchValue = "";
// 默认从第一页显示
var page=1;
// 默认数据总条数为0
var total = 0;
// 默认每页显示5条
var size = 10;
// 页面统计总条数
var count=0;
//这个是存储已选择的条件的数组，每次用这个数组生成条件
var kind=[];
// 存储当前页面是刷新，还是原基础执行查询
var isSearch=false;
//搜索类型：基础，高级
var  search_type="base";

//定义搜索框下拉框被选中值的全局变量 默认为"污染源名称"
var selectValue = "EpName";



var moreOptFlag=0;// 更多选项中是否需要显示“其他分类”。默认为0不需要显示，1需要显示
var v=0;// 用于更多选项各枚举类值的ol标识
// 加载高级搜索块的 【枚举项】、【更多选项】
// 初始化分页插件
function initpage(size1,count1,page2){
	$('#page').html('');
	$('#page').Paging({pagesize:size1,count:count1,hash:false,toolbar:true,pageSizeList:[5,10,20,50],current:page2,
		callback:function(page1,size2,count2){
			page=page1;
			SelctChange();
		}

	});

}
// 搜索按钮单击事件
/**
 * 因为,点击搜索按钮时,系统会再次加载出一个分页条 所以,我们在点击搜索按钮时,删除上一次加载到分页条div,重新添加一个新的分页条div
 */
function search(){
	if($(".maincenter").find(".maincon").length==0){
		$(".maincenter").html('<ul class="maincon"></ul><div class="paginat" id="paginta"><div id="page"></div></div>');
	}
	search_type="base";
	searchValue =document.getElementById("intext").value;
	base_selectChange(page,size);
}

//高级查询
function high_selectChange(size,page){
	loadHighSearch(size,page);
}
function SelctChange(){
	size =$(".ui-select-pagesize").val();
	 if(search_type=="base"){
		 base_selectChange(page,size);
	 }else if(search_type=="high"){
		 high_selectChange(size,page);
	 }
}

// *****************点击下拉菜单按钮时触发的函数********
function select_panel() {
    if($(".select").css('display')=='none'){
        // 下拉菜单显示
        $(".select").show();
    }else {
        // 下拉菜单隐藏
        $(".select").hide();
    }

    // 设置下拉列表的打开时默认被选中的值
    set_selectpanel();
    // *************设置在下拉菜单上鼠标悬浮和鼠标点击的事件*************
    $(".select li").mouseenter(function () {
        $(".select li").removeClass("li_hover");
        $(this).addClass("li_hover");

    });
    $(".select li").click(function (){
        $(".search_type").html($(this).html());
        $(".select").hide();
        // 这是获取下拉框中的值
        selectValue =   $(this).attr("value");
    });
}
// ***********设置下拉列表的打开时默认被选中的值，选中与.search_type的span中内容一样的****************
function set_selectpanel() {
    for(var i=0;i<$(".select li").length;i++){
        if($(".select li").eq(i).html()==$(".search_type").html()){
            $(".select li").eq(i).addClass("li_hover");
        }
    }
}
// ***********设置高级搜索部分内容的隐藏和显示****************
function set_advanced_search() {
    // 事件发生时基本的样式的实现
	$(".search_box").slideUp(200);
    $(".search_fold").hide();
    $(".hsearch_result").slideDown();
    $(".advanced_search_con").fadeIn();
    // 调用多选按钮事件
    mutipule_condition();
 // 调用更多按钮事件
    showmore_condition();
    $(".count").html(count);

   }

// 点击可选的条件部分触发的事件
function condition_click(e) {
    if($(e).parent().parent().parent().find(".mutipule").css("display")=='none'){
        // 点击具体条件触发的事件，显示多选按钮的就生成已选择条件，
        // 不显示多选按钮的就不要生成已选择条件
        single_condition($(e),1);
    }else {
        single_condition($(e),0);

    }
}

// *************隐藏高级搜索部分************
function hide_advanced_search() {
	$(".search_box").slideDown(200);
    $(".hsearch_result").hide();
    $(".search_fold").slideDown();
    $(".advanced_search_con").fadeOut();
    $(".count").html(count);
}
// **********点击更多条件进行展开***********
function create_more_condition(e,termCode) {
    // 打开更多菜单的下拉框时设置的样式
    $(".content img").removeClass("rotate");
    $(".content").removeClass("openmore");
    $(e).find("img").addClass("rotate");
    // 打开更多菜单下拉框要移除更多选项设置的样式
    exit_mutipule();
    // 设置更多选项下拉框位置
/*
 * console.log($(e).parent().parent().parent());
 */    var myleft = $(e).offset().left;
    var mytop = $("#more").offset().top + $("#more").height();
    check_more_condition(myleft,mytop,e);
    $(".olterm").hide();
    $(".olterm_"+termCode).show();
}
// ************点击时判断如何生成选项框*****************
function check_more_condition(myleft,mytop,e) {

    // 字符串拼接的方式插入确认和取消按钮
    var str='<input type="button" class="onclose" value="取消" onclick="exit_more_condition()">'+
        '<input type="button" class="onsub" value="确认" onclick="more_condition_sub()">';
    $(".more_bottom").html(str);
    // 当下拉框不显示的时候设置下拉框位置
    if($(".more_codition").css("display")=='none'){
        $(e).addClass("openmore");
        $(".more_codition").css({"left": myleft, "top": mytop,"z-index":131,"display":"block"});

    }else if($(".more_codition").position().left!=myleft){
        // 当当前的下拉框的位置不等于点击的下拉li的位置,那么就重新设置其的位置
        $(e).addClass("openmore");
        $(".more_codition").css({"left": myleft, "top": mytop,"z-index":1,"display":"block"});

    }else {
        // 如果当前下拉框的位置等于点击的li位置那么就移除样式
        $(".content img").removeClass("rotate");
        $(".content").removeClass("openmore");
        $(".more_codition").hide();
    }
}
// ************更多选项下拉框的确认按钮***************
function more_condition_sub() {
    kind=[];// 清空kind数组
    // kind[0]为条件的类型名称
    kind[0]= $(".openmore").find("span").attr("value") + "##" + $(".openmore").find("span").html();
    $('input[name="check"]:checked').each(function(){
        kind.push($(this).next().attr("value") + '##' + $(this).next().html());
    });
    // 创建已生成的条件
    create_condition(kind);
    // 设置可删除
    del($(".openmore"));
    $(".more_codition").find("input").attr("checked",false);
    if(kind.length>1){
        $(".openmore").fadeOut("slow");
        exit_more_condition();
    }

}
// **************退出更多选项下拉框函数***************
function exit_more_condition(){
    $(".more_codition").hide();
    $(".more_bottom input").remove();
    $(".content img").removeClass("rotate");
    $(".content").removeClass("openmore");
}
// ***********点击每个条件触发的函数************
function single_condition(e,type) {
    // 点击每个具体条件的内容触发的函数，分两种情况，参数为0时生成该类型单个条件；
    // 参数为1时选中其前的复选框
    var term=$(e).parent().parent().parent();

    switch (type){
        case 0:
            exit_more_condition();
            term.fadeOut(100);
            kind=[];// 清空kind[]数组
            // 存放字段编码及 键 名称，##隔开，例：XiangRegionCode##行政区域
            kind[0]=term.find("label").attr("value") + '##' + term.find("label").html();
            // 存放字段的值及 值 名称，##隔开，例：620102000000##城关区
            kind[1]=$(e).attr("value") + '##' + $(e).html();
            create_condition(kind);
            del(term);
            break;
        case 1:
        	if($(e).prev().is(':checked')){
                $(e).prev().prop("checked",false);
        	}else{
                $(e).prev().prop("checked",true);
        	}
            break;
    }
    // 获取最外层的class为term的div
}
// **********创建生成的搜索条件框**************
function create_condition(kind) {
    // 当kind数组长度大于1的时候才生成对应的条件
	// kind[0] example: XiangRegionCode##行政区域, kind[1] example:
	// 620102000000##城关区
    if (kind.length > 1) {
    	// 字段名称
    	var fieldName = kind[0].split('##')[0];
    	// 条件
    	var tiaojian = '=';
    	// 字段值
    	var fieldValue = '';
    	// 字段文本值
    	var fieldText = '';
    	// 关系
    	var relation = 'and';
        var condition = " <span class='condision'><b>" + kind[0].split('##')[1] + "：</b>";
        for(var i=1;i<kind.length;i++){
        	fieldValue += kind[i].split('##')[0] + ',';
        	fieldText += kind[i].split('##')[1] + ',';
            condition += "<span >" + kind[i].split('##')[1] + "；</span>";
        }
        fieldValue = fieldValue.substring(0, fieldValue.length-1);
        fieldText = fieldText.substring(0, fieldText.length-1);
        tiaojian = (fieldValue.indexOf(",") > -1) ? 'in' : '=';
        var group = "<input name='"+fieldName+"' class='queryGroups' type='hidden' value='"+ relation +"@@"+ fieldName +"@@"+ tiaojian +"@@"+ fieldValue +"'/>" +
        			"<input name='"+fieldName+"' class='queryGroupsText' type='hidden' value='"+ fieldName +"@@" + fieldText +"'/>";
        condition+="<span class='icon_del'>×</span>"+group+"</span>";
        $(".muchcondision").append(condition);
    }
}
// ***********点击多选按钮触发的函数**************
function mutipule_condition() {
    $(".mutipule").click(function () {
        // 消除其他更多条件的样式
        exit_more_condition();
        var btn = "<button class='onok' onclick='mutipule_sub(this) '>确认</button>" +
            "<button class='onexit' onclick='exit_mutipule() '>取消</button>";
        // 清除所有所有term的多选状态样式，再设置选中的多选样式
        exit_mutipule();
        // 隐藏多选按钮
        $(this).hide();
        $('.showmore').hide();

        // 点击设置多选的样式
        $(this).parent().addClass("term_select");
        $(this).parent().append(btn);
        var myspan =$(this).parent().find("span.one_condition");
        // 在条件前生成复选框
        var str= "<input type='checkbox' class='check' name='check'>";
        myspan.before(str);
    });
    // 多选按钮悬浮和离开的样式设置
    $(".mutipule").mouseover(function () {
        $(this).find(".add_mutipule").addClass("mutipule_hover")
    });
    $(".mutipule").mouseleave(function () {
        $(this).find(".add_mutipule").removeClass("mutipule_hover")
    });

}

// ************删除已选择的条件按钮*******************
function del(term) {
    $(".icon_del").click(function () {
        exit_more_condition();
        $(this).parent().remove();
        if(term!=null){
            term.fadeIn();
        }
    });
 // ************高级搜索点击“清空”按钮事件*******************
    $(".reset_muchcondision").click(function () {
        exit_more_condition();
        $(".icon_del").parent().remove();
        if(term!=null){
            term.fadeIn();
        }
        clickHighSearch();
    });
}
// ************基础搜索点击“清空”按钮事件*******************
$(".reset_onecondision").click(function () {
	 $('#intext').val("");
	 search();
});

// ************多选按钮的确认按钮***************
function mutipule_sub(e) {
    kind=[];// 清空kind数组
    kind[0]= $(e).parent().find("label").attr('value') + '##' + $(e).parent().find("label").html();
    $('input[name="check"]:checked').each(function(){
        kind.push($(this).next().attr("value") + '##' + $(this).next().html());
    });
    // 创建已选中的条件
    create_condition(kind);
    // 移除多选的状态的样式并隐藏对应term
    hide_mutiple($(e).parent());
    exit_mutipule();
}
// ***********退出多选模式的时候样式的设置***********
function exit_mutipule() {
    $(".term .onok").remove();
    $(".term .onexit").remove();
    $(".mutipule").show();
    $(".showmore").show()
    $(".term .check").remove();
    $(".term").removeClass("term_select");

}
// **********隐藏多选的框*************
function hide_mutiple(e) {
    $(e).fadeOut("slow");
    del(e);
}
// **********添加自定义条件函数************
function add_condition() {
    if ($("#val").val() == "" && $("#val").combobox("getValue") == "" ) {
        alert("请输入条件的值");
    } else {

        kind = [];
        kind[0] = $('#ziduan').combobox('getValue') + '##' + $('#ziduan').combobox('getText');
        kind[1] = $("#tiaojian").combobox('getText');
        kind[2] = ($("#val").val() != "") ? $("#val").val()+'##'+$("#val").val() : $("#val").combobox("getValue") + '##' + $("#val").combobox("getText");
        kind[3] = $("#about").combobox("getValue");
        // 创建自定义条件
        create_myself_condition(kind);
        // 设置删除的事件
        del(null);
    }
}
// ************创建自定义已选条件************
function create_myself_condition(kind) {

    if (kind.length > 0) {
    	// 字段名称
    	var fieldName = kind[0].split('##')[0];
    	// 条件
    	var tiaojian = kind[1];
    	// 字段值
    	var fieldValue = kind[2].split("##")[0];
    	// 字段文本值
    	var fieldText = kind[2].split("##")[1];
    	// 关系
    	var relation = kind[3];

    	var group = "<input name='"+fieldName+"' class='queryGroups' type='hidden' value='"+ relation +"@@"+ fieldName +"@@"+ tiaojian +"@@"+ fieldValue +"'/>" +
    				"<input name='"+fieldName+"' class='queryGroupsText' type='hidden' value='"+ fieldName +"@@"+ fieldText +"'/>";
    	var condition  = "<span class='condision'><b>" + kind[0].split("##")[1] + "：</b>";
            condition += "<span >" + kind[1] + " " +kind[2].split("##")[1]+ "；</span>";
            condition += "<span class='icon_del'>×</span>"+group+"</span>";
        $(".muchcondision").append(condition);
    }
}



/* 格式化水系名称 */
function formatterSource(type) {
	if (type==null) {
		return "未知";
	}else{
		return type;
	}
}
// check_highlight说明：根据查询条件输入值将查询结果中相关字段添加高亮
function check_highlight(searchMap, code, value) {
	if (!value) {
		return "未知";
	}
	// 相关字段添加高亮效果后返回字符串
	if ( !searchMap.isempty) {
		for ( var key in searchMap) {
			var highlightMap = searchMap[key];

			// 查询条件输入值key含有需要添加高亮效果的字段一致时
			if (key == code) {// 主关系
				value= highlight_type(highlightMap, value, 1);
			} else {// 从关系
				value= highlight_type(highlightMap, value, 2);
			}
		}
	}
	return value;
}

function highlight_type(highlightMap, value, type) {

	// type==1;主关系 type==2 从关系
	var cStr = '';
	if (type == 1)
		cStr = 'Highlight';// 主关系class值
	else
		cStr = 'Highlightfollow';// 从关系class值
	var highlightValue = "";
	// highlightMap包含“,”表示同一查询字段包含多个属性值
	if (highlightMap.indexOf(",") == -1) {// 高级搜索单选
		highlightValue = highlightMap;
		// 查询列表中含有搜索条件关键字时添加高亮效果
		if (value.indexOf(highlightValue) != -1) {
			value = value.replace(highlightValue, "<span class='" + cStr
					+ "'>" + highlightValue + "</span>");

		}
		return value;
	} else {
		// 高级搜索多选
		var highlightValuelist = highlightMap.split(",");
		for (var i = 0; i < highlightValuelist.length; i++) {
			highlightValue = highlightValuelist[i];
			if (value.indexOf(highlightValue) != -1) {
				value = value.replace(highlightValue, "<span class='"
						+ cStr + "'>" + highlightValue + "</span>");
				return value;
			}
		}
		return value;
	}
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

// *************检查设置煤矿非煤****************
function check_scale(scale) {
    switch (scale){
        case '1':
            return "<img src='image/archives/mei.png' title='煤矿'>";
            break;
        default:
        	return "<img src='image/archives/feimei.png' title='非煤矿'>";
			break;
    }
}
//显示矿种(煤铁铝矿等10几种)暂时先返回
function check_minRals(type){
    switch (type){
    case '1':
        return "煤矿";
        break;
    default:
    	return type;
		break;
    }
}
//格式化显示undefined
function checkFei(scale){
	if (!scale) {
		return "未知";
	}else{
		return scale;
	}
}
//***********检查设置生产状态******************
function check_type(type) {
    switch (type){
        case '2':
            return "<img src='image/archives/shengchan.png' title='在产'>";
            break;
        case '3':
            return "<img src='image/archives/zaijian.png' title='在建'>";
            break;
        case '4':
        	return "<img src='image/archives/tingchan.png' title='停产'>";
        	break;
        case '5':
        	return "<img src='image/archives/guanbi.png' title='关闭'>";
        	break;
        case '1':
        	return "<img src='image/archives/bikeng.png' title='闭坑'>";
        	break;
        default:
        	return "<img src='image/archives/weizhi.png' title='未知'>";
			break;
    }
}
// ***********检查设置有主无主矿***************
function check_level(level) {
    switch (level){
	    case '1':// 暂无国控图片
	    	return "<img src='image/archives/youzhu.png' title='有主'>";
	    	break;
	    	// 国控
        case '0':
            return "<img src='image/archives/wuzhu.png' title='无主'>";
            break;
        default:
        	return "<img src='image/archives/weizhi.png' title='未知'>";
			break;
    }
}
var isneedend=true;// 枚举项显示个数为0时防止自定义多次拼接

// ***********初始化加载高级搜索数据信息***************
// $.ajax({
// 	url : '../pollutionSources/PC/getDataByWebservice.do',
// //	url:'../mock/search.json',
// 	type : 'post',
// //	type : 'get',
// 	dataType : 'json',
// 	success : function(resultJson){
// 	    let resultJson={"rows":[{"children":[{"code":"140100000000","id":"03293801-aa77-41e4-8681-2c9b961ec1c5","parentCode":" ","remark":"","sortCode":1.0,"text":"太原市","type":"1"},{"code":"140200000000","id":"100011","parentCode":"","remark":"","sortCode":2.0,"text":"大同市","type":"1"},{"code":"140300000000","id":"100111","parentCode":"","remark":"","sortCode":2.0,"text":"阳泉市","type":"1"},{"code":"140400000000","id":"100211","parentCode":"","remark":"","sortCode":3.0,"text":"长治市","type":"1"},{"code":"140500000000","id":"11091","parentCode":"","remark":"","sortCode":4.0,"text":"晋城市","type":"1"},{"code":"140600000000","id":"11081","parentCode":"","remark":"","sortCode":5.0,"text":"朔州市","type":"1"},{"code":"140700000000","id":"ebbaf616-bd9f-4222-a220-2191af8d881f","parentCode":"","remark":"","sortCode":6.0,"text":"晋中市","type":"1"},{"code":"140800000000","id":"9b540cbd-80aa-47ae-bb81-928551c86111","parentCode":"","remark":"","sortCode":7.0,"text":"运城市","type":"1"},{"code":"140900000000","id":"98800ba1-6285-4e95-a1b7-3022f6f2241f","parentCode":"","remark":"","sortCode":8.0,"text":"忻州市","type":"1"},{"code":"141000000000","id":"0ee23bda-0d91-4001-bf5f-fe5c23111db3","parentCode":"","remark":"","sortCode":9.0,"text":"临汾市","type":"1"},{"code":"141100000000","id":"10f26da8-18ee-4bab-82ef-e15001bd15dc","parentCode":"","remark":"","sortCode":10.0,"text":"吕梁市","type":"1"}],"code":"001","id":"0001","parentCode":"100010","remark":"SHIREGIONCODE","sortCode":1.0,"text":"行政区域","type":"1"},{"children":[{"code":"煤矿","id":"de8edd44-07fc-4a77-89b4-f469c0f5a2a1","parentCode":"","remark":"","sortCode":1.0,"text":"煤矿","type":"1"},{"code":"铁矿","id":"9142b548-c82e-49b5-820b-b92fcfc0a551","parentCode":"","remark":"","sortCode":2.0,"text":"铁矿","type":"1"},{"code":"石灰岩","id":"794f92b5-5640-44df-bb73-2403ada024b1","parentCode":"","remark":"","sortCode":3.0,"text":"石灰岩","type":"1"},{"code":"铝土矿","id":"f84b0b7b-682a-4c73-9181-34bc3d5d6ce1","parentCode":"","remark":"","sortCode":4.0,"text":"铝土矿","type":"1"},{"code":"大理岩","id":"ff274638-d938-41a4-bdeb-12edcdeedc61","parentCode":"","remark":"","sortCode":5.0,"text":"大理岩","type":"1"},{"code":"沸石矿","id":"6156462c-3518-42e9-add4-b975af400aa1","parentCode":"","remark":"","sortCode":6.0,"text":"沸石矿","type":"1"},{"code":"片麻岩","id":"066627ff-f65a-4400-a800-bb9055bf0171","parentCode":"","remark":"","sortCode":7.0,"text":"片麻岩","type":"1"},{"code":"玄武岩","id":"79bdf946-b411-46ae-8fd2-8fd9b2200121","parentCode":"","remark":"","sortCode":8.0,"text":"玄武岩","type":"1"},{"code":"玉石","id":"760d4518-ae21-4e09-8e12-d15371f624e1","parentCode":"","remark":"","sortCode":9.0,"text":"玉石","type":"1"},{"code":"白云岩","id":"33ffaeb4-1e1e-4807-9535-f58eca63dc50","parentCode":"","remark":"","sortCode":10.0,"text":"白云岩","type":"1"},{"code":"石膏矿","id":"e9753416-5091-45c8-8df7-e3baf5627751","parentCode":"","remark":"","sortCode":11.0,"text":"石膏矿","type":"1"},{"code":"石英岩","id":"86fa9624-62cf-444a-988b-1ab9f691f811","parentCode":"","remark":"","sortCode":12.0,"text":"石英岩","type":"1"},{"code":"砂岩","id":"dc9551e8-7ae2-471c-aa00-688eb539987d","parentCode":"","remark":"","sortCode":13.0,"text":"砂岩","type":"1"},{"code":"硅石矿","id":"17bb78aa-d75b-4717-a254-5dcd360d0021","parentCode":"","remark":"","sortCode":14.0,"text":"硅石矿","type":"1"},{"code":"硫铁矿","id":"39bf4439-1924-48e7-a663-0ccb92a6a2bf","parentCode":"","remark":"","sortCode":15.0,"text":"硫铁矿","type":"1"},{"code":"磷矿","id":"387f20bd-0dcf-4162-8f82-a43b44507442","parentCode":"","remark":"","sortCode":16.0,"text":"磷矿","type":"1"},{"code":"粘土矿","id":"6f595d0d-f366-4814-8d0e-b167b3773521","parentCode":"","remark":"","sortCode":17.0,"text":"粘土矿","type":"1"},{"code":"花岗岩","id":"797945f9-9ba0-41bc-b654-ac61107402a1","parentCode":"","remark":"","sortCode":18.0,"text":"花岗岩","type":"1"},{"code":"蛭石","id":"34057317-c4a9-4857-b61b-861c683b6444","parentCode":"","remark":"","sortCode":19.0,"text":"蛭石","type":"1"},{"code":"辉绿岩","id":"06569cca-3cab-47c9-bc43-90aaba54a161","parentCode":"","remark":"","sortCode":20.0,"text":"辉绿岩","type":"1"},{"code":"重晶石","id":"41668d5e-523f-4b23-940d-071775aea81c","parentCode":"","remark":"","sortCode":21.0,"text":"重晶石","type":"1"},{"code":"金矿","id":"b5baded1-3a8d-416e-9276-c25d2112f266","parentCode":"","remark":"","sortCode":22.0,"text":"金矿","type":"1"},{"code":"铅锌矿","id":"1fe1dea8-48e4-42bb-979d-7e53fce790e5","parentCode":"","remark":"","sortCode":23.0,"text":"铅锌矿","type":"1"},{"code":"铜矿","id":"2ba9dff0-a53f-4c26-97f8-a7d77014e0b0","parentCode":"","remark":"","sortCode":24.0,"text":"铜矿","type":"1"},{"code":"银矿","id":"7f2e4586-73cc-4c17-ab37-230c7539e891","parentCode":"","remark":"","sortCode":25.0,"text":"银矿","type":"1"},{"code":"镁矿","id":"19f7b0d2-00fc-48e0-a958-3903ee01a8d1","parentCode":"","remark":"","sortCode":26.0,"text":"镁矿","type":"1"},{"code":"长石矿","id":"d33e83cc-9fb4-41a8-b2ff-2ec4c94f9f71","parentCode":"","remark":"","sortCode":27.0,"text":"长石矿","type":"1"},{"code":"麦饭石","id":"c55c6543-8a28-4e2a-b33f-8438c1b1bc34","parentCode":"","remark":"","sortCode":28.0,"text":"麦饭石","type":"1"},{"code":"石榴子石","id":"274a820d-7e79-4941-8a48-5cb4531c5188","parentCode":"","remark":"","sortCode":29.0,"text":"石榴子石","type":"1"},{"code":"铁矾土矿","id":"283a2ae7-4a10-4c7e-b4f4-4c4f62575e52","parentCode":"","remark":"","sortCode":30.0,"text":"铁矾土矿","type":"1"},{"code":"多金属矿","id":"af105c22-2e22-4902-b1e6-b07161b31f8e","parentCode":"","remark":"","sortCode":31.0,"text":"多金属矿","type":"1"},{"code":"未知","id":"8f8387fc-55df-4b5a-8161-066ced9f6341","parentCode":" ","remark":"","sortCode":32.0,"text":"未知","type":"1"}],"code":"002","id":"0002","parentCode":"100020","remark":"MINERALS","sortCode":2.0,"text":"矿种","type":"1"},{"children":[{"code":"1","id":"ce47d8d5-ff04-47cc-8be2-3f4155ef5d02","parentCode":"","remark":"","sortCode":1.0,"text":"闭坑","type":"1"},{"code":"2","id":"2599bee8-23ae-47ae-84fa-5333ee8675f7","parentCode":"","remark":"","sortCode":2.0,"text":"生产","type":"1"},{"code":"3","id":"27c670ef-35e6-4247-b4ad-6cb313f82275","parentCode":"","remark":"","sortCode":3.0,"text":"在建","type":"1"},{"code":"4","id":"f376d1a5-96b1-4f0e-9c64-69f6ce328475","parentCode":"","remark":"","sortCode":4.0,"text":"停产","type":"1"},{"code":"5","id":"5c2b3244-f246-4c4e-b4ec-19ad1ecc10e2","parentCode":"","remark":"","sortCode":5.0,"text":"关闭","type":"1"},{"code":"0","id":"5b1f0b8d-77a5-4dea-b34f-96f7b9153079","parentCode":" ","remark":"","sortCode":6.0,"text":"未知","type":"1"}],"code":"004","id":"0004","parentCode":"100040","remark":"PRODUCTSTATUS","sortCode":4.0,"text":"生产现状","type":"1"}]}
	    let resultJson={
            "rows": [
                {
                    "children": [
                        {
                            "code": "明渠",
                            "id": "de8edd44-07fc-4a77-89b4-f469c0f5a2a1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "明渠",
                            "type": "1"
                        },
                        {
                            "code": "暗管",
                            "id": "9142b548-c82e-49b5-820b-b92fcfc0a551",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "暗管",
                            "type": "1"
                        },
                        {
                            "code": "泵站",
                            "id": "794f92b5-5640-44df-bb73-2403ada024b1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 3.0,
                            "text": "泵站",
                            "type": "1"
                        },
                        {
                            "code": "涵闸",
                            "id": "f84b0b7b-682a-4c73-9181-34bc3d5d6ce1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 4.0,
                            "text": "涵闸",
                            "type": "1"
                        },
                        {
                            "code": "潜没",
                            "id": "f84b0b7b-682a-4c73-9181-34bc3d5d6ce1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 4.0,
                            "text": "潜没",
                            "type": "1"
                        },
                        {
                            "code": "其他",
                            "id": "f84b0b7b-682a-4c73-9181-34bc3d5d6ce1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 4.0,
                            "text": "其他",
                            "type": "1"
                        }
                    ],
                    "code": "001",
                    "id": "0002",
                    "parentCode": "100020",
                    "remark": "region",
                    "sortCode": 2.0,
                    "text": "入河海方式",
                    "type": "1"
                },
                {
                    "children": [
                        {
                            "code": "工业废水排污口",
                            "id": "de8edd44-07fc-4a77-89b4-f469c0f5a2a1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "工业废水排污口",
                            "type": "1"
                        },
                        {
                            "code": "生活废水排污口",
                            "id": "9142b548-c82e-49b5-820b-b92fcfc0a551",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "生活废水排污口",
                            "type": "1"
                        },
                        {
                            "code": "混合废水排污口",
                            "id": "794f92b5-5640-44df-bb73-2403ada024b1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 3.0,
                            "text": "混合废水排污口",
                            "type": "1"
                        },
                        {
                            "code": "其他",
                            "id": "f84b0b7b-682a-4c73-9181-34bc3d5d6ce1",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 4.0,
                            "text": "其他",
                            "type": "1"
                        }
                    ],
                    "code": "002",
                    "id": "0002",
                    "parentCode": "100020",
                    "remark": "region",
                    "sortCode": 2.0,
                    "text": "排放口类型",
                    "type": "1"
                },
                {
                    "children": [
                        {
                            "code": "1",
                            "id": "ce47d8d5-ff04-47cc-8be2-3f4155ef5d02",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "规模以上",
                            "type": "1"
                        },
                        {
                            "code": "2",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "规模以下",
                            "type": "1"
                        }
                    ],
                    "code": "003",
                    "id": "0003",
                    "parentCode": "100040",
                    "remark": "PRODUCTSTATUS",
                    "sortCode": 4.0,
                    "text": "排放口规模",
                    "type": "2"
                },
                {
                    "children": [
                        {
                            "code": "1",
                            "id": "ce47d8d5-ff04-47cc-8be2-3f4155ef5d02",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "连续",
                            "type": "1"
                        },
                        {
                            "code": "2",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "间歇",
                            "type": "1"
                        }
                    ],
                    "code": "004",
                    "id": "0004",
                    "parentCode": "100040",
                    "remark": "PRODUCTSTATUS",
                    "sortCode": 4.0,
                    "text": "排放口方式",
                    "type": "2"
                },
                {
                    "children": [
                        {
                            "code": "1",
                            "id": "ce47d8d5-ff04-47cc-8be2-3f4155ef5d02",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "I",
                            "type": "1"
                        },
                        {
                            "code": "2",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "II",
                            "type": "1"
                        },
                        {
                            "code": "3",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "III",
                            "type": "1"
                        },
                        {
                            "code": "4",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "IV",
                            "type": "1"
                        },
                        {
                            "code": "5",
                            "id": "2599bee8-23ae-47ae-84fa-5333ee8675f7",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 2.0,
                            "text": "V",
                            "type": "1"
                        }
                    ],
                    "code": "005",
                    "id": "0005",
                    "parentCode": "100040",
                    "remark": "PRODUCTSTATUS",
                    "sortCode": 5.0,
                    "text": "受纳水体水质类别",
                    "type": "2"
                },
                {
                    "children": [
                        {
                            "code": "1",
                            "id": "ce47d8d5-ff04-47cc-8be2-3f4155ef5d02",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "长江",
                            "type": "1"
                        }
                    ],
                    "code": "006",
                    "id": "0006",
                    "parentCode": "100040",
                    "remark": "PRODUCTSTATUS",
                    "sortCode": 6.0,
                    "text": "受纳水体",
                    "type": "2"
                },
                {  //行政区划
                    "children": [
                        {
                            "code": "1",
                            "id": "320000000000",
                            "parentCode": "",
                            "remark": "320000000000",
                            "sortCode": 1.0,
                            "text": "江苏省",
                            "type": "1"
                        },
                        {
                            "code": "2",
                            "id": "310000000000",
                            "parentCode": "",
                            "remark": "310000000000",
                            "sortCode": 1.0,
                            "text": "上海市",
                            "type": "1"
                        },
                        {
                            "code": "3",
                            "id": "340000000000",
                            "parentCode": "",
                            "remark": "340000000000",
                            "sortCode": 1.0,
                            "text": "安徽省",
                            "type": "1"
                        },
                        {
                            "code": "4",
                            "id": "360000000000",
                            "parentCode": "",
                            "remark": "360000000000",
                            "sortCode": 1.0,
                            "text": "江西省",
                            "type": "1"
                        },
                        {
                            "code": "5",
                            "id": "420000000000",
                            "parentCode": "",
                            "remark": "420000000000",
                            "sortCode": 1.0,
                            "text": "湖北省",
                            "type": "1"
                        },
                        {
                            "code": "6",
                            "id": "430000000000",
                            "parentCode": "",
                            "remark": "430000000000",
                            "sortCode": 1.0,
                            "text": "湖南省",
                            "type": "1"
                        },
                        {
                            "code": "7",
                            "id": "500000000000",
                            "parentCode": "",
                            "remark": "500000000000",
                            "sortCode": 1.0,
                            "text": "重庆市",
                            "type": "1"
                        },
                        {
                            "code": "8",
                            "id": "510000000000",
                            "parentCode": "",
                            "remark": "510000000000",
                            "sortCode": 1.0,
                            "text": "四川省",
                            "type": "1"
                        },
                        {
                            "code": "9",
                            "id": "520000000000",
                            "parentCode": "",
                            "remark": "520000000000",
                            "sortCode": 1.0,
                            "text": "贵州省",
                            "type": "1"
                        },
                        {
                            "code": "10",
                            "id": "530000000000",
                            "parentCode": "",
                            "remark": "530000000000",
                            "sortCode": 1.0,
                            "text": "云南省",
                            "type": "1"
                        },
                        {
                            "code": "11",
                            "id": "630000000000",
                            "parentCode": "",
                            "remark": "630000000000",
                            "sortCode": 1.0,
                            "text": "青海省",
                            "type": "1"
                        }
                    ],
                    "code": "007",
                    "id": "0007",
                    "parentCode": "100040",
                    "remark": "XZQH",
                    "sortCode": 7.0,
                    "text": "行政区划",
                    "type": "2"
                },
                {
                    "children": [
                        {
                            "code": "1",
                            "id": "ce47d8d5-ff04-47cc-8be2-3f4155ef5d02",
                            "parentCode": "",
                            "remark": "",
                            "sortCode": 1.0,
                            "text": "企业联系人",
                            "type": "1"
                        }
                    ],
                    "code": "006",
                    "id": "0006",
                    "parentCode": "100040",
                    "remark": "PRODUCTSTATUS",
                    "sortCode": 6.0,
                    "text": "企业联系人",
                    "type": "3"
                }
            ]
        }

/*
 * console.log(resultJson);
 */		// 初始化多个可选择搜索条件
		var multisearch="<div class='test'>";
		debugger;
		var flags=0;
		var fieldList = [{ 'text':'-请选择-','id':''}];  // 自定义查询： 字段
		// 目前支持二级联动，后期可扩展
		var queryShowFlag=0;
		var queryShowTotal=0;	// 枚举项
		$.each(resultJson.rows ,function (i,obj) {
			// type为3是【自定义查询】
			if( obj.type != 3 ){
				queryShowTotal ++;
			}
		});

		$.each(resultJson.rows ,function (i,obj) {
			// type为3是【自定义查询】
			if( obj.type != 3 ){
				queryShowFlag ++;
				// 【枚举项查询】、【更多选项】html
				multisearch = highSearch_loadEnumMoreData2(queryShowFlag, obj, multisearch, flags,queryShowTotal);
			}else// type为3是自定义查询
				fieldList.push({"text":obj.text,"id":obj.remark});

		});
	/*
	 * $(".more:eq(0)").append("<li> <span class='other_content'> 其他分类</li>");
	 * $(".more:eq(1)").append("<li> <span class='nother_content'> 收起其他分类</li>");
	 */
		// 自定义查询中元素初始化动态填充
		highSearch_loadCustomData(fieldList, resultJson);
	// }
// });

// 加载高级搜索块的 【枚举项】、【更多选项】
function highSearch_loadEnumMoreData(queryShowFlag, obj, multisearch, flags,queryShowTotal){
	/***************************************************************************
	 * 此块展示正常选项( 3 代表高级搜索默认展示3条【枚举查询条件】， 其他查询条件放置在【更多选项】中，--此数字可配置动态改变-- )
	 **************************************************************************/



	if( queryShowFlag <= 4 ){
		// 添加高级搜索的 抬头
		multisearch+="<div class='term term"+obj.code+"'><label for='area' value=\'"+obj.remark+"\'>"+obj.text+"</label><ol class='area' id=\'"+obj.code+"\'>";
		// 加载每项搜索的具体 子项
		$.each(obj.children,function (j,obj1) {

			var itemCount = (obj1.count != undefined ? obj1.count : 0);
			multisearch+="<li><span class='one_condition' onclick='condition_click(this)' value=\'"+obj1.code+"\'>"+obj1.text+"</span></li>";


		});
	}else{// 此块为 更多选项
		// 添加更多选项的抬头
		multisearch+="<div class='term'><label for='more' value='005'>更多选项</label><ol class='more' id='more'>";
		// 加载更多选项中的的具体一类查询条件
		if(obj.children==undefined){
			flags=0;
			multisearch+="<li><span value=\'"+obj.remark+"\'>"+obj.text+"</span></li>";
		}else {
			flags=1;
			multisearch+="<li> <span class='content' onclick='create_more_condition(this,\'"+obj.code+"\)'><span value=\'"+obj.remark+"\'>"+obj.text+"</span><img src='image/archives/down.png'></span></li>"
			var more_codition_li = '';
			// 加载更多选项中选中的具体一项的所有子项
			$.each(obj.children ,function (k,obj2) {
				var itemCount = (obj2.count != undefined ? obj2.count : 0);
				more_codition_li += '<li><input type="checkbox" name="check"/><span onclick="single_condition(this,1)" value='+ obj2.code +'>'+ obj2.text +'</span></li>';
			});
			$(".more_codition ol").html(more_codition_li);
		}
	}
	multisearch+="</ol>";
	// 高级搜索项后边添加 多选 按钮
	if(flags==0){
		multisearch+="<button class='mutipule'><span class='add_mutipule'>+</span>多选</button>"
	}else {
		multisearch+="";
	}
	multisearch+="</div>";
	return multisearch;
}


function highSearch_loadEnumMoreData2(queryShowFlag, obj, multisearch, flags,queryShowTotal){
	/***************************************************************************
	 * 此块展示正常选项( 3 代表高级搜索默认展示3条【枚举查询条件】， 其他查询条件放置在【更多选项】中，--此数字可配置动态改变-- )
	 **************************************************************************/

	var ismulti=0;// 枚举项中值个数是否需要显示“更多”。默认为0不需要显示，1需要显示
	var normalOptionsTotal=2;// 枚举项显示个数
	var multisearchall='';// 显示全部枚举项值div默认隐藏

	var olHtml="<ol class='olterm olterm_"+obj.code+"'></ol>";

	if( queryShowFlag <=normalOptionsTotal ){
		// 添加高级搜索的 抬头
		multisearch+="<div class='term term"+obj.code+"' id='term"+obj.code+"'><label for='area' value=\'"+obj.remark+"\'>"+obj.text+"</label><ol class='area' id=\'"+obj.code+"\'>";
		multisearchall+="<div style='display: none;' class='term term"+obj.code+"' id='term"+obj.code+"'><label for='area' value=\'"+obj.remark+"\'>"+obj.text+"</label><ol class='area' id=\'"+obj.code+"\'>";
		// 加载每项搜索的具体 子项
		$.each(obj.children,function (j,obj1) {

			var itemCount = (obj1.count != undefined ? obj1.count : 0);
			var objtext = '';
        	if( obj1.text.length > 10 )
        		objtext = '<span title="'+ obj1.text +'">' + obj1.text.substring(0,4) + '</span>...';
        	else
        		objtext = obj1.text;
			if(j<20){// 枚举项值个数五个以下
				multisearch+="<li><span class='one_condition' onclick='condition_click(this)' value=\'"+obj1.code+"\'>"+objtext+"</span></li>";
				multisearchall+="<li><span class='one_condition' onclick='condition_click(this)' value=\'"+obj1.code+"\'>"+objtext+"</span></li>";
			}else {// 枚举项值个数五个以上
				ismulti=1;
				multisearchall+="<li><span class='one_condition' onclick='condition_click(this)' value=\'"+obj1.code+"\'>"+objtext+"</span></li>";
			}

		});
	}else{

		// 此块为 更多选项
		$(".show_codition").append(olHtml);

		// 添加更多选项的抬头
		if(moreOptFlag==0){
			var more_codition='';
			var more_coditionall='';
			more_codition+="<div id='more_codition'  class='term'><label for='more' value='005'>更多选项</label><ol class='more' id='more'>";
			more_coditionall+="<div  id='more_codition' style='display:none' class='term'><label for='more' value='005'>更多选项</label><ol class='more' id='more'>";
			moreOptFlag=moreOptFlag+1;

			var more_content_li='';
			// 加载更多选项中的的具体一类查询条件
			if(obj.children==undefined){
				flags=0;
				more_codition+="<li><span value=\'"+obj.remark+"\'>"+obj.text+"</span></li>";
				more_coditionall+="<li><span value=\'"+obj.remark+"\'>"+obj.text+"</span></li>";
			}else {
				flags=1;
				more_codition+="<li> <span class='content' onclick='create_more_condition(this,\""+obj.code+"\")'><span value=\'"+obj.remark+"\'>"+obj.text+"</span><img src='image/archives/down.png'></span></li>";
				more_coditionall+="<li> <span class='content' onclick='create_more_condition(this,\""+obj.code+"\")'><span value=\'"+obj.remark+"\'>"+obj.text+"</span><img src='image/archives/down.png'></span></li>";
				var more_codition_li = '';
				// 加载更多选项中选中的具体一项的所有子项
				$.each(obj.children ,function (k,obj2) {
					var itemCount = (obj2.count != undefined ? obj2.count : 0);
					more_codition_li += '<li><input type="checkbox" name="check"/><span onclick="single_condition(this,1)" value='+ obj2.code +'>'+ obj2.text +'</span></li>';
	});

				$(".show_codition ol:eq(0)").append(more_codition_li);

			}
			more_codition+="</ol>";
			more_codition+="</div>";
			more_coditionall+="</ol>";
			more_coditionall+="</div>";
			$(".test").append(more_codition);
			$(".test").append(more_coditionall);


		}else{
			v=v+1;
			var more_content_li = '';
			var more_content_li_all = '';
			if(obj.children==undefined){
				flags=0;
				if(v<2){
				more_content_li+="<li><span value=\'"+obj.remark+"\'>"+obj.text+"</span></li>";
				}
				more_content_li_all+="<li><span value=\'"+obj.remark+"\'>"+obj.text+"</span></li>";

			}else {
				flags=1;
				/* 08-24张博改了这里 */
				//这里需要改---陈闯锋
				if(v<10){
				more_content_li+="<li> <span class='content' onclick='create_more_condition(this,\""+obj.code+"\")'><span value=\'"+obj.remark+"\'>"+obj.text+"</span><img src='image/archives/down.png'></span></li>";
				}
				more_content_li_all+="<li> <span class='content' onclick='create_more_condition(this,\""+obj.code+"\")'><span value=\'"+obj.remark+"\'>"+obj.text+"</span><img src='image/archives/down.png'></span></li>";
				var more_codition_li = '';
				// 加载更多选项中选中的具体一项的所有子项
				$.each(obj.children ,function (k,obj2) {
					var itemCount = (obj2.count != undefined ? obj2.count : 0);
					more_codition_li += '<li><input type="checkbox" name="check"/><span onclick="single_condition(this,1)" value='+ obj2.code +'>'+ obj2.text +'</span></li>';
				});

				$(".more:eq(0)").append(more_content_li);
				$(".more:eq(1)").append(more_content_li_all);
				$(".show_codition ol:eq("+v+")").append(more_codition_li);
			}


		}

	}
	if (isneedend) {
		if (normalOptionsTotal == 0 || queryShowFlag == normalOptionsTotal) {
			isneedend = false;
			// 【自定义查询】html
			multisearch += "</div></div><div class='term' id='myself_condition'><label class='myself_info'>自定义查询</label>"
					+ "<ol id='myself'>"
					+ "<li><label for='about'>关系</label><input id='about' class='easyui-combobox'/></li>"
					+ "<li><label for='ziduan'>字段</label><input id='ziduan' class='easyui-combobox'/></li>"
					+ "<li><label for='tiaojian'>条件</label><input id='tiaojian' class='easyui-combobox'/></li>"
					+ "<li><label for='val'>值</label><input id='val' type='text' placeholder='输入值'></li>"
					+ "</ol>"
					+ "<button class='add' onclick='add_condition()'>+添加</button></div>"
					+ "<div class='term_bottom'>"
					+ "<span class='result_count'>共<span class='count'>18</span>条结果</span>"
					+ "<div class='view_way ' style='display:none;'>"
					+ "<span class='view_method1 simple_view' onclick='tiaozhuan(0)' ></span>"
					+ "</div>"
					+ "<span class='retract' onclick='hide_advanced_search()'>收起"
					+ "<img src='image/archives/up.png'/>" + "</span>" + "</div>";
			$(".advanced_search_con").append(multisearch);
			$("#term002").eq(0).append('<button class="mutipule"><span class="add_mutipule">+</span>多选</button>')
		}
	}

	if(queryShowFlag<=normalOptionsTotal){
	// 高级搜索项后边添加 多选 按钮
	if(flags==0){
		multisearch+="</ol>";
		multisearchall+="</ol>";
		if(ismulti==1){
			multisearch+="&nbsp;&nbsp;&nbsp;<button class='showmore'><span class='add_more'>更多</span></button>";
		}
			multisearch+="<button class='mutipule'><span class='add_mutipule'>+</span>多选</button>";
			multisearchall+="&nbsp;&nbsp;&nbsp;<button class='showmore'><span class='no_more'>收起</span></button>";
			multisearchall+="<button class='mutipule'><span class='add_mutipule'>+</span>多选</button>";
			multisearch+="</div>";
			multisearchall+="</div>";
	}else {
		multisearch+="";
		multisearchall+="";
	}
	multisearch=multisearch+multisearchall;
	}
	return multisearch;
}



// ***********点击更多按钮触发的函数**************
function showmore_condition() {
	// 更多按钮事件
	$(".add_more").click(function() {
		var cname = $(this).parent().parent().attr('id');
		$("div #" + cname + ":eq(1)").css('display', 'block');
		$("div #" + cname + ":eq(0)").css('display', 'none');
	});
	// 收起按钮事件
	$(".no_more").click(function() {
		var cname = $(this).parent().parent().attr('id');
		$("div #" + cname + ":eq(0)").css('display', 'block');
		$("div #" + cname + ":eq(1)").css('display', 'none');

	});
	// 其他分类按钮事件
	$(".other_content").click(function() {
		$("div #more_codition:eq(0)").css('display', 'none');
		$("div #more_codition:eq(1)").css('display', 'block');

	});
	// 收起其他分类按钮事件
	$(".nother_content").click(function() {
		$("div #more_codition:eq(0)").css('display', 'block');
		$("div #more_codition:eq(1)").css('display', 'none');

	});
}

// 加载高级搜索块的 自定义选项
function highSearch_loadCustomData(fieldList, resultJson){
	// 初始化 【字段】 下拉框，下拉框内选项不同，可联动后边的 【值】 变动，属于选择项，则【值】 动态加载出下拉框，否则动态加载出文本框
	$('#ziduan').combobox({
		data: fieldList,
		valueField: 'id',
		textField: 'text',
		panelHeight:'150px',
		onChange: function (current, old) {
			$.each(resultJson.rows ,function (i,obj) {
				// 循环权限系统返回的json数据，自定义type=3为自定义查询，即当type=3且【字段】选中当前节点，实现 【值】
				// 的联动
				if( obj.remark == current && obj.type == 3 ){
					// 【值】 移除之前的标签为input的元素，重新追加文本框或下拉框
					$("#val").remove();
					$('#myself li:eq(3) .textbox').remove();
					// 加载文本框
					if( obj.children == undefined || obj.children.length == 0 ){
						$("#myself li:eq(3)").append("<input id='val' type='text' placeholder='输入值'>");
					}
					else{// 加载下拉框
						var fieldList2 = [{ 'text':'-请选择-','id':''}];  // 自定义查询：
																		// 字段
						var selects = "<input id='val' class='easyui-combobox'/>";
						var opts = "";
						$.each(obj.children ,function (k,obj2) {
							fieldList2.push({"text":obj2.text,"id":obj2.code});
						});
						$("#myself li:eq(3)").append(selects);
						$('#val').combobox({
							data: fieldList2,
							valueField: 'id',
							textField: 'text'
						});
					}
					return;
				}
			});
		},

	});
	$('#tiaojian').combobox({
		url:'mock/combobox_condition.json',
		method:'get',
		valueField:'id',
		textField:'text',
		panelHeight:'auto'

	});
	$('#about').combobox({
		url:'mock/combobox_relation.json',
		method:'get',
		valueField:'id',
		textField:'text',
		panelHeight:'auto'
	});
}

// 点击高级搜索栏【查询】触发的事件
function clickHighSearch(){

	search_type="high";

	loadHighSearch(5,1);
}

// 作为高级搜索条件传至后台用于条件查询
function getHighSearchStr(){

	var qg = $(".queryGroups");
	var highSearchStr = '';
	$.each(qg,function (i,obj) {
		highSearchStr += obj.value + '&&';
	});
	if( highSearchStr != '' )
		highSearchStr = highSearchStr.substring(0,highSearchStr.length-2);
	return highSearchStr;
}

/** 搜索完成后，参照以下getHighSearchMap及getBaseSearchMap方法中的字段信息将作为条件的关键字添加高亮效果* */

// 组装高级搜索查询条件
function getHighSearchMap(){
	page=1;//初始化之前page
	var qg = $(".queryGroupsText");
	var highSearchMap = {};
	$.each(qg,function (i,obj) {
		var highSearchStr=obj.value;
		var array=highSearchStr.split("@@");
		var key=array[0];
		var value=array[1];
		highSearchMap[key]=value;

	});
	return highSearchMap;
}
// 组装基础搜索查询条件
function getBaseSearchMap(){
	page=1;//初始化之前page
	var baseSearchMap = {};
	if(searchValue.trim().length>0)
		baseSearchMap[selectValue]=searchValue;
	return baseSearchMap;
}
