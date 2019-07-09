var  searchValueT;
// 数据总条数
var  countT=0;
var array=new Array;
var  isFirstState=true;
/**
 * 默认加载全部的排口信息
 */
$(function(){
    //getTotalDate(true);
   // $('#mapMainSearch').show();
    $('#pointClickMsg ').hide()
  //  getTotalDate(true);
})
function search(){
    $('#mapMainSearch').show();
    $('#pointClickMsg ').hide()
    getTotalDate();
}
/**
 * 排口详情窗口关闭
 * @Create 曾国范
 * @Date 2019年4月23日
 */
function  closeOpenBasic(){
    $('#mapMainSearch').show();
    $('#pointClickMsg ').hide();
    if (map.getLayer("GL_HotPoint")) {
        map.removeLayer(map.getLayer("GL_HotPoint"));
    }
    if (map.getLayer("pointClickRiver")) {
        map.removeLayer(map.getLayer("pointClickRiver"));
    }
    search();
    var poi_cent = new esri.geometry.Point(Number(107.87378343200), Number(30.05685419970), map.spatialReference);
    map.centerAndZoom(poi_cent, 7);
    map.centerAt(point);  
}
/**
 * 基本搜索获取所有的值
 */
function   getTotalDate(flag){
    var  type=   $('.search_type')[0].innerText;
    searchValueT=$('#intext').val();
    var  baseSearchMap={};
    $.getJSON("mock/company.json",function (result) {
        var  allMsgFh=[];
        if(flag){  //需要初始化分页控件
            countT=result.total;
            $(".count").html(45678);
            var  dataSourceList=[];
            for(var z=0;z<countT;z++){
                dataSourceList.push(z);
            }
            fenye(dataSourceList,100);
        }
        if(searchValueT.trim().length>0){
            if(type=="排口名称"){
                baseSearchMap["EpName"]=type;
                baseSearchMap["PKMC"]=type;
                allMsgFh=  getMsgAcrrdTJ('PKMC',searchValueT,result.list);
           }else if(type=="设置单位名称"){
                baseSearchMap["SZDWMC"]=type;
                allMsgFh= getMsgAcrrdTJ('SZDWMC',searchValueT,result.list);
           }else if(type=="联系人"){
               baseSearchMap["LXRXM"]=type;  
               allMsgFh=  getMsgAcrrdTJ('LXRXM',searchValueT,result.list);
           }else if(type=="地址"){
               baseSearchMap["DIZHI"]=type;     
               allMsgFh= getMsgAcrrdTJ('DIZHI',searchValueT,result.list);    
           }  
           $(".count").html(allMsgFh.length);
       //    mainSearchMapShowPOI(allMsgFh);
         
        }else{
            allMsgFh=result.list;
            countT=result.total;
            $(".count").html(countT);
        }
    //    if(isFirstState){
    //     isFirstState=false;
    //    }else{
     
    //    }
       mainSearchMapShowPOI(allMsgFh);
       load_info(allMsgFh,baseSearchMap,searchValueT);
      
       
    })
}

// 加载高级搜索结果列表
function loadHighSearch(size,page){
    var highSearchMap = getHighSearchMap();
    advancedSearch(highSearchMap);
    // for(var key in  highSearchMap ){
    //     console.log(key);
    //     console.log(highSearchMap[key]);
    // }

}
/**
 * 高级搜索
 * @param {*} flag 
 */
function  advancedSearch(highSearchMap){
    $.getJSON("mock/company.json",function (result) {
        var msgData=[];
        var  baseSearchMap={};
        countT=result.total;
        $(".count").html(countT);
        for(var mm=0;mm<result.list.length;mm++){
             for(var key in  highSearchMap ){
                 if(highSearchMap[key]=="重庆市"){
                   if(result.list[mm][key].substring(0,2)=='50'){
                
                    msgData.push(result.list[mm]);
                   }
                 }
               }
        }
        load_info(msgData,baseSearchMap);
        mainSearchMapShowPOI(msgData);
        var poi_cent = new esri.geometry.Point(107.548046, 29.690106, map.spatialReference);
        map.centerAndZoom(poi_cent, 7);
    })
}
/**
 * 根据条件筛选数据
 * @param {*} json 
 * @param {*} zdMC 字段名称
 *  * @param {*} zdValue 
 */
function getMsgAcrrdTJ(zdMC,zdValue,result){
    var allFHMsg=[];
     for(var z=0;z<result.length;z++){
         if(result[z][zdMC].indexOf(zdValue)>-1){
            allFHMsg.push(result[z]);
         }else{
             continue;
         }
     }
     return allFHMsg;
}
/**
 * 点击排口列表，弹出详情并定位到地图相应点位
 * @Create 曾国范
 * @Date 2019年4月23日
 * @param {*} pkname 排口的名字
 * @param {*} lon  经度
 * @param {*} lat  纬度
 */
function  clickNameMsg(pkname,lon,lat){
    // var poi_cent = new esri.geometry.Point(Number(attributes["lon"]), Number(attributes["lat"]), map.spatialReference);
    // map.centerAndZoom(poi_cent, 7);
    // map.centerAt(point);  
    map_CenterAtAndZoom(Number(lon), Number(lat),10);
    $('#mapMainSearch').hide();
    $("#pointClickMsg iframe").show();     
    window.dialog = $("#pointClickMsg").clone().dialog({
        title: "标题",
        width : '330',
        height : 600,
        modal : true
    });
    $("iframe",dialog).attr("frameborder","0");
    $("iframe",dialog).attr("height","100%");
    $("iframe",dialog).attr("width","330px");
    $("iframe",dialog).attr("src","sewageDetail.html?lon="+lon+"&lat="+lat+"&pkName="+encodeURI(pkname)); 
} 
//分页信息
function  fenye(dataSourceList,pageSize){
    $('#pagination-container').pagination({
        total:countT,
        pageSize:10,
        showPageInfo:false,
        pageList: [10,20,30],
        onSelectPage:function (pageNumber, pageSize){
         //   companyInfo(pageNumber, pageSize);
        },
        onRefresh:function(pageNumber, pageSize){
          //  companyInfo(pageNumber, pageSize);
        },
        onChangePageSize:function(pageSize){
            var num=Number($('.pagination-num').val())-1;
          //  companyInfo(num, pageSize);
        }
    });}
function load_info(array,searchMap,searchValueT) {
	isSearch = true;
	var info_str="";
	if(array.length>0){
            // 加载列表模式的代码
   		$(".view_way").html("<span class='view_method1 simple_view' onclick='tiaozhuan(0)'></span><span class='map-view' onclick='' ></span>")
            for(var i=0;i<array.length;i++){
                var  pkNameNew="";
                if(searchValueT.trim().length>0){
                    pkNameNew=array[i].PKMC.replace(searchValueT,'<span style="color:red">'+searchValueT+'</span>')
                }else{
                    pkNameNew=array[i].PKMC;
                }
                
                if(i>30){break;}
            	 info_str+='<li style="margin:5px;opacity: 1;">' +
            	'<div class="company_info"><p class="maintitle"><a style="cursor: pointer;" onclick="clickNameMsg(&apos;'+array[i].PKMC+'&apos;,&apos;'+array[i].JD+'&apos;,&apos;'+array[i].WD+'&apos;);">'+pkNameNew+'</a><br/>' +
              	'<ol class="companyList"><li style="height:18px"><span  class="key">排污口编码：</span><span class="code">'+check_highlight(searchMap,'CreditCode',array[i].PWXKZBH)+'</span>' +
                  '<span class="key">联系人：</span><span class="person">'+check_highlight(searchMap,'LegalPersonName',array[i].LXRXM)+'</span></li>' +
                //   '<li><span class="key">设置单位：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].SZDWMC)+'</span></li>' +
                  '<li><span class="key">地址：</span><span class="address">'+check_highlight(searchMap,'Address',array[i].DIZHI)+'</span></li>' +
                  '<li><span class="key">数据状态：</span><span class="source"><span class="system">'+check_minRals(array[i].JHZT)+'</span></span></li> ' +
                  '<li><ol class="pf-type"><li>'+array[i].PWKLX+'</li><li>'+array[i].PWKLB+'</li></ol></li></ol></div>' +
                  '<div class="tag"><span id="'+array[i].EPCODE+'" class="if_aim">'+check_aim(array[i], isSearch)+'</span></div>' +
                  '</li>';
            }
    		$(".maincenter").removeClass("noinfo");
    		if($(".maincon").length==0){
    			$(".maincenter").html("<ul class='maincon'></ul><div class='paginat' id='paginta'><div id='page'></div></div>")
    		}
    $(".maincon").html(info_str);
    $(".maincon>li").css("opacity","1");
	}else{
		info_str+="<img src='../../image/archives/noinfo.png' style='width:242px;height:162px'><p class='no_p'>未搜索到对应信息，请重新进行搜索</p>";
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
                        "EPNAME": "丰都县暨龙镇场镇污水处理厂排污口",
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
                        "EPNAME": "丰都县暨龙镇场镇污水处理厂排污口",
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