//全局map对象
var map = null;
var  currentPointLon=0;
var   currentPointLat=0;
//document ready 初始化
$(function () {
    //初始化地图
    mugis.mapInit.initMap(initMapCallback());
    $('#water_slider').slider({
        tipFormatter: function (value) {
            return value;
        },
        value: 5,

        onComplete: function (value, e) {
            $('.slider').click(function (event) {
                event.preventDefault();
                event.stopPropagation();
            })
            event.preventDefault();
            
            $('#distinctLength').val(value);

         //   var opaciaty = Number(value) / 100;
         //   map.getLayer('1').setOpacity(opaciaty);
        }
    });
    $('#distinctLength').val('5');

    $('#water_slider2').slider({
        tipFormatter: function (value) {
            return value;
        },
        value: 5,
        onChange:function(newValue,oldValue){
            $('.slider-handle').css('margin-top','74px');
        },
        onSlideStart:function(value){
            $('.slider-handle').css('margin-top','74px');
        },	
        onSlideEnd:function(value){
            $('.slider-handle').css('margin-top','74px');
        },
        onComplete:function(value){
            $('.slider-handle').css('margin-top','74px');
        },	
        onComplete: function (value, e) {
            $('.slider-handle').css('margin-top','74px');
            $('.slider').click(function (event) {
                event.preventDefault();
                event.stopPropagation();
            })
            event.preventDefault();
            
            $('#distinctLength').val(value);

         //   var opaciaty = Number(value) / 100;
         //   map.getLayer('1').setOpacity(opaciaty);
        }
    });
    $('#distinctLength').val('5');
})

/**
 * 地图加载完之后回调函数.
 */
function initMapCallback() {
    //初始化地图上的按钮绑定事件
    //initButton();
    ////根据权限删除配置的部分城市
    //initCitys_QX();
    ////权限设置
    //initQuanXian();
    ////初始化mark权限遮盖层
    //mapRegion.hightLightUserMarkRegion(regionCodeSub_QX);
    //初始化工具栏
     initToolBar();
    //加载全国的行政区划下的排口
    setTimeout(function(){
        loadPaiKouQG();
    },800);
  
    $("#pointPKClick td").on("click", function () {
        
        var id = $(this)[0].id;
        if(id=="suyuan"){ //溯源
            $('#huanchong').hide();
            // setTimeout(function(){ //溯源分析
            //     mapControls.DynamicLayerAdd("fill_area",'10');
            // },800)
            mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
            migrationLayer.addEffectLayer(mapinfo.map);
            suyuanMsg_cq_point(suyuanMsg_cq);
         } else if(id=="zhoubian"){ //周边缓冲
            mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
            migrationLayer.clearLayer();
            $('#huanchong').show();
           // alert("周边");
        }else if(id=="video"){ //视频监控
            $('#huanchong').hide();
            //alert("视频监控");
            mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
            migrationLayer.clearLayer();
        }
    });
   var  cjState=true; var  bhState=true;  var dwState=true;var layerAddState=true;
//var  resultState=true;
    $("#topTools td").on("click", function () {
      //  debugger;
        var text = $(this)[0].innerText;
        // $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
        // $(this).toggleClass("topToolsFocus");
        if(text=="测距"){
            if(cjState==true){
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $(this).toggleClass("topToolsFocus");
                $("#cj").attr("src", "img/mapIcon/高亮-测量.png");
                $('#cjTools_fen').show();
                cjState=false;
                 bhState=true;   dwState=true; layerAddState=true;
            }else{
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $("#cj").attr("src", "img/mapIcon/测量.png");
                $('#cjTools_fen').hide();
                cjState=true;
                bhState=true;   dwState=true; layerAddState=true;
            }
            $("#bh").attr("src", "img/mapIcon/标绘.png");
            $("#jqdw").attr("src", "img/mapIcon/精准定位.png");
            $("#tcdj").attr("src", "img/mapIcon/图层.png");
            $('#bh_tools').hide();
            $('#jqdw_open').hide();
            $('#layerAddS').hide();         
        }else if(text=="标绘工具"){
            
            $("#cj").attr("src", "img/mapIcon/测量.png");
            if(bhState==true){
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $(this).toggleClass("topToolsFocus");
                $("#bh").attr("src", "img/mapIcon/高亮-标绘-.png");
                $('#bh_tools').show();
                bhState=false;
                  cjState=true;    dwState=true; layerAddState=true;
            }else{
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $("#bh").attr("src", "img/mapIcon/标绘.png");
                $('#bh_tools').hide();
                bhState=true;
                  cjState=true;  dwState=true; layerAddState=true;
            }
            $("#jqdw").attr("src", "img/mapIcon/精准定位.png");
            $("#tcdj").attr("src", "img/mapIcon/图层.png");        
            $('#jqdw_open').hide();
            $('#layerAddS').hide();
            $('#cjTools_fen').hide();
        }else if(text=="精确定位"){
            $("#cj").attr("src", "img/mapIcon/测量.png");
            $("#bh").attr("src", "img/mapIcon/标绘.png");
            if(dwState){
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $(this).toggleClass("topToolsFocus");
                $("#jqdw").attr("src", "img/mapIcon/高亮-精准定位.png");
                $('#jqdw_open').show();
                dwState=false;
                  cjState=true;   bhState=true;   layerAddState=true;
            }else{
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $("#jqdw").attr("src", "img/mapIcon/精准定位.png");
                $('#jqdw_open').hide();
                dwState=true;
                  cjState=true;   bhState=true;   layerAddState=true;
            }
            $("#tcdj").attr("src", "img/mapIcon/图层.png");
            $('#bh_tools').hide();
            $('#layerAddS').hide();
            $('#cjTools_fen').hide();
        } else if(text=="图层叠加"){
            $("#cj").attr("src", "img/mapIcon/测量.png");
            $("#bh").attr("src", "img/mapIcon/标绘.png");
            $("#jqdw").attr("src", "img/mapIcon/精准定位.png");
            if(layerAddState){
                $('.slider-handle').css('margin-top','74px');
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $(this).toggleClass("topToolsFocus");
                $("#tcdj").attr("src", "img/mapIcon/高亮-图层.png");
                $('#layerAddS').show();
                layerAddState=false;
                  cjState=true;   bhState=true;   dwState=true; 
            }else{
                $(this).parent().find("td.topToolsFocus").toggleClass("topToolsFocus");
                $("#tcdj").attr("src", "img/mapIcon/图层.png");
                $('#layerAddS').hide();
                layerAddState=true;
                  cjState=true;   bhState=true;   dwState=true;
            }
            $('#bh_tools').hide();
            $('#jqdw_open').hide();
            $('#cjTools_fen').hide();
        }
    });
    $("#bh_tools td").on("click", function () {
        var id = $(this)[0].id;
        if(id=="circle1"){  //空间查询--圆
            $("#circle").attr("src", "img/mapIcon/toolIcon/高亮-圆.png");
            $("#line").attr("src", "img/mapIcon/toolIcon/长方形.png");
            $("#area").attr("src", "img/mapIcon/toolIcon/面.png");
            $("#bgz").attr("src", "img/mapIcon/toolIcon/不规则.png");
            btn_ExSpace(1)
        }else if(id=="line1"){//空间查询--矩形
            $("#circle").attr("src", "img/mapIcon/toolIcon/圆.png");
            $("#line").attr("src", " img/mapIcon/toolIcon/高亮-长方形.png");
            $("#area").attr("src", "img/mapIcon/toolIcon/面.png");
            $("#bgz").attr("src", "img/mapIcon/toolIcon/不规则.png");
            btn_ExSpace(0);
        }
        else if(id=="area1"){ //空间查询--多变查询
            $("#circle").attr("src", "img/mapIcon/toolIcon/圆.png");
            $("#line").attr("src", "img/mapIcon/toolIcon/长方形.png");
            $("#area").attr("src", "img/mapIcon/toolIcon/高亮-面.png");
            $("#bgz").attr("src", "img/mapIcon/toolIcon/不规则.png");
            btn_ExSpace(2);
        }
        else if(id=="bgz1"){//空间查询--自由多边形查询
            $("#circle").attr("src", "img/mapIcon/toolIcon/圆.png");
            $("#line").attr("src", "img/mapIcon/toolIcon/长方形.png");
            $("#area").attr("src", "img/mapIcon/toolIcon/面.png");
            $("#bgz").attr("src", "img/mapIcon/toolIcon/高亮-不规则.png");
            btn_ExSpace(3);
        }
    });
    $("#cjTools_fen td").on("click", function () {
        var id = $(this)[0].id;
   if(id=="line2"){ //测距-线
            $("#line22").attr("src", "img/mapIcon/toolIcon/高亮-线.png");
            $("#area22").attr("src", "img/mapIcon/toolIcon/面.png");    
            btn_measure(0);
        }
        else if(id=="area2"){ //测距-面
            $("#line22").attr("src", "img/mapIcon/toolIcon/线.png");
            $("#area22").attr("src", "img/mapIcon/toolIcon/高亮-面.png");    
            btn_measure(1);  
        }
      
    });
    $("input[name='layer']").click(function (e) {
        var name = this.value;
        var checked = this.checked;
        if(checked){ //选中
            if(name=="1"){ //长江流域及渤海支流
                mapControls.DynamicLayerAdd("YangtzRiver",mapconfig.YangtzRiver);
            }else if(name=="2"){ //地表水功能
                mapControls.DynamicLayerAdd();
            }else if(name=="3"){//饮用水源保护区
                mapControls.DynamicLayerAdd();
            }else if(name=="4"){//水资源一级分区
                mapControls.AddFeatureLayer("wateOne",mapconfig.waterResourcesZoing['1']["url"]);
            }else if(name=="5"){//水资源二级分区
                mapControls.AddFeatureLayer("waterTwo",mapconfig.waterResourcesZoing['2']["url"]);
            }else if(name=="6"){//水资源三级分区
                mapControls.AddFeatureLayer("waterThree",mapconfig.waterResourcesZoing['3']["url"]);
            }else if(name=="7"){//河流水系
                mapControls.DynamicLayerAdd("riverSystem",mapconfig.riverSystem);
            }else if(name=="8"){
                mapControls.DynamicLayerAdd("RowmouthCZ",mapconfig.RowmouthCZ);
            }
        }else{//未选中
            var  layerIdN="";
            if(name=="1"){ //长江流域及渤海支流
                layerIdN="YangtzRiver";
            }else if(name=="2"){ //地表水功能
                layerIdN="";
            }else if(name=="3"){//饮用水源保护区
                layerIdN="";
            }else if(name=="4"){//水资源一级分区
                layerIdN="wateOne";
            }else if(name=="5"){//水资源二级分区
                layerIdN="waterTwo";
            }else if(name=="6"){//水资源三级分区
                layerIdN="waterThree";
            }else if(name=="7"){//河流水系
                layerIdN="riverSystem";
            }else if(name=="8"){
                layerIdN="RowmouthCZ";
            }
            if(layerIdN!=""){
                if(map.getLayer(layerIdN)){
                    map.removeLayer(map.getLayer(layerIdN));
                }
            }
        }
      
    });
    $('#mingandianSearch').on('click',function(){
        var  distinctL=   $('#distinctLength').val();
           if(currentPointLon!="0" && currentPointLat!="0"){
               mapControls.hcFxHzhiCircle({"lon":currentPointLon,"lat":currentPointLat},Number(distinctL));
           }
       });
       var  dayPFState=true;var andanState=true;var yangState=true;var  pState=true;  var codState=true;var phState=true;
       $('.rightPCOPDiv').on('click',function(){
       // debugger;
      var spanValue=  $(this)[0].innerText;
      if(spanValue=="日排放量"){
        if(dayPFState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            mapControls.DynamicLayerAdd("RowmouthCZ",mapconfig.RowmouthCZ);
            dayPFState=false;
            andanState=true; yangState=true;  pState=true;   codState=true; phState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            rightClickPanel("RowmouthCZ");
            dayPFState=true;
            andanState=true; yangState=true;  pState=true;   codState=true; phState=true;
        }
       
      }else if(spanValue=="氨氮"){
        if(andanState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            andanState=false;
              dayPFState=true; yangState=true;  pState=true;   codState=true; phState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            andanState=true;
              dayPFState=true; yangState=true;  pState=true;   codState=true; phState=true;
        }
        rightClickPanel("RowmouthCZ");
      }else if(spanValue=="总氧"){
        if(yangState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            yangState=false;
              dayPFState=true; andanState=true;  pState=true;   codState=true; phState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            yangState=true;
              dayPFState=true; andanState=true;  pState=true;   codState=true; phState=true;
        }
        rightClickPanel("RowmouthCZ");
      }
      else if(spanValue=="总磷"){
        if(pState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            pState=false;
              dayPFState=true; andanState=true; yangState=true;   codState=true; phState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            pState=true;
              dayPFState=true; andanState=true; yangState=true;   codState=true; phState=true;
        }
        rightClickPanel("RowmouthCZ");
      }else if(spanValue=="COD"){
        if(codState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            codState=false;
              dayPFState=true; andanState=true; yangState=true;  pState=true;  phState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            codState=true;
              dayPFState=true; andanState=true; yangState=true;  pState=true;   phState=true;
        }
        
        rightClickPanel("RowmouthCZ");
      }else if(spanValue=="PH"){
        if(phState){
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            $(this).toggleClass('rightSpanClic');
            phState=false; 
              dayPFState=true; andanState=true; yangState=true;  pState=true;   codState=true;
        }else{
            $(this).parent().find(".rightSpanClic").toggleClass("rightSpanClic");
            phState=true; 
              dayPFState=true; andanState=true; yangState=true;  pState=true;   codState=true;
        }
        rightClickPanel("RowmouthCZ");
    }
       });
      //精确定位的查询按钮
       $('#jqDwSearch').on('click',function(){
       var  lon=    $('#addLon').val();
       var  lat=$('#addLat').val();
       var  message=[{
           "lon":lon,
           "lat":lat,
           "pointName":"精确定位点位"
       }];
       JQ_LocationSearch(message);
       var poi_cent = new esri.geometry.Point(Number(lon), Number(lat), map.spatialReference);
       map.centerAndZoom(poi_cent, 12);
       map.centerAt(poi_cent);
       });
     //  creatLegend('1');
     
     $('#PointListOutput').on('click',function(){
         alert('导出')
     })
}
/**
 * 排口信息的panel上溯源、缓冲，视频监控
 * @param {*} this 
 */
function  pkPanelClick(id){
    if(id=="suyuan"){ //溯源
        $('#huanchong').hide();
        // setTimeout(function(){ //溯源分析
        //     mapControls.DynamicLayerAdd("fill_area",'10');
        // },800)
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
        migrationLayer.addEffectLayer(mapinfo.map);
        suyuanMsg_cq_point(suyuanMsg_cq);
     } else if(id=="huanchong"){ //周边缓冲
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
        migrationLayer.clearLayer();
        $('#huanchong').show();
       // alert("周边");
    }else if(id=="video"){ //视频监控
        $('#huanchong').hide();
        //alert("视频监控");
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystem","GL_PointCover_points"]);
        migrationLayer.clearLayer();
    }
}







//关闭图例
function closeLengend(){
$('#legendOpen').hide();
$('#lengendClose').show();
}
function openLengend(){
    $('#legendOpen').show();
    $('#lengendClose').hide();
}
/**
 * 关闭缓冲设置的弹窗
 */
function  closeHCSeting(){  
    //关闭缓冲设置的弹窗
    $('#huanchong').hide();
    var  clearIdArr=["GL_Widgets_Buffer_pointpanel","GL_PointCover_Sensitive_point"];
    for(var  t=0;t<clearIdArr.length;t++){
        if(map.getLayer(clearIdArr[t])){
            map.removeLayer(map.getLayer(clearIdArr[t]));
        }
    }
}
/**
 * 根据ID取消相应的图层
 * @Create 曾国范
 * @Date 2019年4月21日
 * @param {*} layerIdS 
 */
function rightClickPanel(layerIdS){
    if(map.getLayer(layerIdS)){
        map.removeLayer(map.getLayer(layerIdS));
    }
}
/**
 * 得到当前点击的点坐标
 */
function getCurrenClickPointZB(lon,lat){
     currentPointLon=lon;
     currentPointLat=lat;
}
/**
 * 默认加载全部的行政区划的排口
 */
function  loadPaiKouQG(){
    //加载全国的行政区划边界
   // mapControls.DynamicLayerAdd("QG_region_border",mapconfig.china_border);
    mapControls.DynamicLayerAdd("YangtzRiver2",mapconfig.YangtzRiver2);
    //获取当前选择的行政区划污染源的信息，默认是全部
   getCurrentPoint('000000000000','all');
   //定位到中国中心
   var poi_cent = new esri.geometry.Point(108.842623, 34.527114, map.spatialReference);
   map.centerAndZoom(poi_cent, 4);
}

function  changeImage(){
	if(!mapEFlag){
		$("#img2").attr("src", "img/rightTool/icon-mapE-open.png");
		mapEFlag=true;
		$(".class_chart").show();//展示地图上所有的Echarts
	}else{
		$("#img2").attr("src", "img/rightTool/icon-mapE-close.png");
		mapEFlag=false;
		$(".class_chart").hide();//隐藏地图上的所有的Echarts
	}
}
/**
 * 导航栏行政区划点击，撒点
 * @Create 曾国范
 * @Date 2019年4月18日
 * @param {*} el 
 */
// function back_China(el) {
//     var regionCodeType = el.id;
//     if (regionCodeType == "QG") {
//         mugis.mapClear.holdLayers([]);//点击全国的时候把地图上的数据清掉
//         $('#Sheng').html("");
//         $('#ShengCode').html("");
//         $('#XianCode').html("");
//         $('#Xian').html("");
//         $('#XianCode').html("");
//         $('#Shi').html("");
//         $('#ShiCode').html("");
//         $('#QGCode').html("{'regionCode': '000000000000','wuType':'all','QHType':'all'}");
//     }
//     else if (regionCodeType == "Sheng") {
//         $('#Xian').html("");
//         $('#XianCode').html("");
//         $('#Shi').html("");
//         $('#ShiCode').html("");
//     }
//     else if (regionCodeType == "Shi") {
//         $('#Xian').html("");
//         $('#XianCode').html("");
//     }
//     var qhjsonStr = $('#' + regionCodeType + 'Code').html();
//     var qhjson = eval('(' + qhjsonStr + ')');; //由JSON字符串转换为JSON对象
//     //添加边界
    
   
//     if (qhjson["regionCode"] == "000000000000") {
//         mapControls.DynamicLayerAdd("QG_region_border");
//          //获取当前选择的行政区划污染源的信息，默认是全部
//        getCurrentPoint(qhjson["regionCode"], qhjson["wuType"]);
//         var poi_cent = new esri.geometry.Point(108.842623, 34.527114, map.spatialReference);
//         map.centerAndZoom(poi_cent, 4);

//     } else {
//         borderControls.XRBorderAndArea(qhjson["regionCode"]);
//          //获取当前选择的行政区划污染源的信息，默认是全部
//        getCurrentPoint(qhjson["regionCode"], qhjson["wuType"]);
//         for (var t = 0; t < newRegionMsg.length; t++) {
//             if (newRegionMsg[t]["ORGANIZATION_CODE"] == qhjson["regionCode"]) {
//                 var lon = Number(newRegionMsg[t]["CENTERX"]);
//                 var lat = Number(newRegionMsg[t]["CENTERY"]);
//                 var  regionCodeN=qhjson["regionCode"];
//                 var codeForhead = regionCodeN.substr(0, 2);
//                 var  rCode=regionCodeN;
//                 //11-北京市  12-天津市  31-上海市  50-重庆市   
//                 if ((codeForhead == "11" || codeForhead == "12" || codeForhead == "31" || codeForhead == "50") && regionCodeN.substr(3, 2) == "00") {
//                     rCode = codeForhead + "0100";
//                 }
//                 var regionType = judgeRegionType(rCode);
//                 var poi_cent = new esri.geometry.Point(lon, lat, map.spatialReference);
//                 if (regionType == "2") {  //省
//                     map.centerAndZoom(poi_cent, 7);
//                 } else if (regionType == "1") { //市
//                     map.centerAndZoom(poi_cent, 9);
//                 } else if (regionType == "0") { //县
//                     map.centerAndZoom(poi_cent, 10);
//                 }
//             } else {
//                 continue;
//             }
//         }
//     }
// }
/**
 * 判断当前行政区划所属级别
 * @Create 曾国范
 * @Date 2019年4月18日
 */
function judgeRegionType(code) {
    code += "000000000000";  //0为县，1为市，2为省
    code = code.substr(0, 12);
    if (code.substr(2, 10) == "0000000000") {
        return 2;//省
    }
    else if (code.substr(4, 8) == "00000000") {
        return 1;//市
    }
    else if (code.substr(6, 6) == "000000") {
        return 0;//县
    }
}
/**
 * 初始化gis工具.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function initToolBar() {
    //放大
    document.getElementById("toolZoomIn").onclick = function () {
        var grade = map.getLevel();
        map.setLevel(grade + 1);

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
    //缩小
    document.getElementById("toolZoomOut").onclick = function () {
        var grade = map.getLevel();
        map.setLevel(grade - 1);

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
    //漫游
    document.getElementById("toolPan").onclick = function () {
        tool_draw_clear();
        map.setMapCursor("default");

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
  
    //清除
    document.getElementById("toolClear").onclick = function () {
        tool_draw_clear();
        map.setMapCursor("default");
        mugis.mapClear.clearAll();
        $(".tool_drop").css("display", "none");
        $("#toolPan").addClass("active").siblings().removeClass("active");
        loadPaiKouQG();
        $('#bh_tools').hide();
        $('#jqdw_open').hide();
        $('#layerAddS').hide();
        $('#cjTools_fen').hide();
        //pointClickMsg
        //$('#pointClickMsg').hide();
      //  $("#pointClickMsg iframe").hide();
        $('#pointClickMsg ').hide()
        //隐藏顶部的图形界面
        hide_advanced_search();
         //隐藏左侧的图形界面
        //$('#mapMainSearch').hide();
    };
  //全图
  document.getElementById("toolFullExtent").onclick = function () {
    tool_draw_clear();
    map.setMapCursor("default");
    mugis.mapClear.clearAll();
    $(".tool_drop").css("display", "none");
    $("#toolPan").addClass("active").siblings().removeClass("active");
    loadPaiKouQG();
    $('#bh_tools').hide();
    $('#jqdw_open').hide();
    $('#layerAddS').hide();
    $('#cjTools_fen').hide();
    
    $('#huanchong').hide();
    $('#pointClickMsg ').hide();
    $('#mapMainSearch').hide();
   // search();
    //隐藏顶部的图形界面
    hide_advanced_search();
     //隐藏左侧的图形界面
    //$('#mapMainSearch').hide();
  //  mugis.mapZoom.setFullExtent();

};
// //打印
// document.getElementById("toolPrint").onclick = function () {
//     tool_draw_clear();
//     map.setMapCursor("default");
//     alert('打印');

//     $(".tool_drop").css("display", "none");
//     $("#toolPan").addClass("active").siblings().removeClass("active");
// };

//     //测距
//     document.getElementById("toolMeasure").onclick = function () {
//         if ($("#toolMeasure" + "_drop").css("display") == "none") {
//             $(".tool_drop").css("display", "none");
//             $("#toolMeasure" + "_drop").css("display", "block");
//         }
//         else {
//             $("#toolMeasure" + "_drop").css("display", "none");
//         }
//         $(this).addClass("active").siblings().removeClass("active");
//     };
//     //空间查询
//     document.getElementById("toolSpaceSearch").onclick = function () {
//         if ($("#toolSpaceSearch" + "_drop").css("display") == "none") {
//             $(".tool_drop").css("display", "none");
//             $("#toolSpaceSearch" + "_drop").css("display", "block");
//         }
//         else {
//             $("#toolSpaceSearch" + "_drop").css("display", "none");
//         }
//         $(this).addClass("active").siblings().removeClass("active");
//     };
//     //缓冲查询
//     document.getElementById("toolBufferSearch").onclick = function () {
//         if ($("#toolBufferSearch" + "_drop").css("display") == "none") {
//             $(".tool_drop").css("display", "none");
//             $("#toolBufferSearch" + "_drop").css("display", "block");
//         }
//         else {
//             $("#toolBufferSearch" + "_drop").css("display", "none");
//         }
//         $(this).addClass("active").siblings().removeClass("active");
//     };
//     //标绘
//     document.getElementById("toolPlotting").onclick = function () {
//         if ($("#toolPlotting" + "_drop").css("display") == "none") {
//             $(".tool_drop").css("display", "none");
//             $("#toolPlotting" + "_drop").css("display", "block");
//         }
//         else {
//             $("#toolPlotting" + "_drop").css("display", "none");
//         }
//         $(this).addClass("active").siblings().removeClass("active");
//     };
//     //常用工具
//     document.getElementById("toolCYGJ").onclick = function () {
//         if ($("#toolCYGJ" + "_drop").css("display") == "none") {
//             $(".tool_drop").css("display", "none");
//             $("#toolCYGJ" + "_drop").css("display", "block");
//         }
//         else {
//             $("#toolCYGJ" + "_drop").css("display", "none");
//         }
//         $(this).addClass("active").siblings().removeClass("active");
//     };



    //构建滑块控件
    $("#slider").slider({
        max: 100,
        min: 0,
        value: 100,
        slide: function (event, ui) {
            $("#sp_slidervalue").text(ui.value);
        }
    });
    //构建数字选择器
    $(".spinner").spinner({
        max: 100,
        min: 1,
        numberFormat: "n"
    });
    //构建提示框
    $('.tip').poshytip({
        className: 'tip-twitter',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 8,
        alignY: 'bottom',
        allowTipHover: false,
        fade: false,
        slide: false
    });
    //构建颜色选择器
    $(".colorpicker").minicolors({
        defaultValue: "#ff0000",
        change: function (hex, opacity) {
            if (!hex) {
                return;
            }
            else {

                $(this).parent().find(".minicolors-swatch").css("background-color", hex);
            }
        }
    });
}


var measure;
var spaceSearch;
var bufferSearch;
var plot;

//清空绘制状态
function tool_draw_clear() {
    if (measure != undefined) {
        measure.clear();
    }
    if (spaceSearch != undefined) {
        spaceSearch.clear();
    }
    if (bufferSearch != undefined) {
        bufferSearch.clear();
    }
    if (plot != undefined) {
        plot.clear();
    }
}

//测量
function btn_measure(index) {
    tool_draw_clear();
    require(["widgets/Measure"], function (Navigation) {
        measure = new widgets.Measure({
            map: map
        });
        if (index == 0) {
            measure.measure(esri.toolbars.Draw.POLYLINE);
        } else if (index == 1) {
            measure.measure(esri.toolbars.Draw.POLYGON);
        }
    });
}

//空间查询
function btn_ExSpace(index) {
    tool_draw_clear();
    require(["dojo/dom", "widgets/SpaceSearch"], function (dom, SpaceSearch) {

        spaceSearch = new widgets.SpaceSearch({
            map: map
        });
        if (index === 0) {

            spaceSearch.search(esri.toolbars.Draw.EXTENT);
        } else if (index === 1) {
            spaceSearch.search(esri.toolbars.Draw.CIRCLE);
        } else if (index === 2) {
            spaceSearch.search(esri.toolbars.Draw.POLYGON);
        } else if (index === 3) {
            spaceSearch.search(esri.toolbars.Draw.FREEHAND_POLYGON);
        }
    });
}

//缓冲查询
function btn_Buffer(index) {
    tool_draw_clear();
    var distant = $("#txt_distant").val();
    require(["dojo/dom", "widgets/BufferSearch"], function (dom, BufferSearch) {
        bufferSearch = new widgets.BufferSearch({ map: map, distant: distant });
        if (index == 0) {
            bufferSearch.search(esri.toolbars.Draw.POINT);
        }
        else if (index == 1) {
            bufferSearch.search(esri.toolbars.Draw.LINE);
        }
        else if (index == 2) {
            bufferSearch.search(esri.toolbars.Draw.POLYGON);
        }
        else if (index == 3) {
            bufferSearch.search(esri.toolbars.Draw.FREEHAND_POLYGON);
        }
    });
}

//动态标绘
function btn_DynamicPlot(index) {
    tool_draw_clear();
    //参数处理
    var graphSize = Number($("#txt_graph").val());
    var bgColor = $("#sp_bgcolor").parent().find(".minicolors-swatch").css("background-color");
    var alph = $("#sp_slidervalue").text();
    var borderSize = Number($("#txt_border").val());
    var borderColor = $("#sp_bordercolor").parent().find(".minicolors-swatch").css("background-color");
    //var graphSize = 25;
    //var bgColor = "rgb(255, 0, 0)";
    //var alph = 100;
    //var borderSize =1;
    //var borderColor = "rgb(255, 0, 0)";

    require(["widgets/DynamicPlot"], function (DynamicPlot) {
        plot = new widgets.DynamicPlot({ map: map, graphSize: graphSize, bgColor: bgColor, alph: alph, borderSize: borderSize, borderColor: borderColor });
        switch (index) {
            case 0:
                plot.draw(esri.toolbars.Draw.POINT);
                break;
            case 1:
                plot.draw(esri.toolbars.Draw.MULTI_POINT);
                break;
            case 2:
                plot.draw(esri.toolbars.Draw.LINE);
                break;
            case 3:
                plot.draw(esri.toolbars.Draw.POLYLINE);
                break;
            case 4:
                plot.draw(esri.toolbars.Draw.POLYGON);
                break;
            case 5:
                plot.draw(esri.toolbars.Draw.FREEHAND_POLYLINE);
                break;
            case 6:
                plot.draw(esri.toolbars.Draw.FREEHAND_POLYGON);
                break;
            case 7:
                plot.draw(esri.toolbars.Draw.ARROW);
                break;
            case 8:
                plot.draw(esri.toolbars.Draw.LEFT_ARROW);
                break;
            case 9:
                plot.draw(esri.toolbars.Draw.RIGHT_ARROW);
                break;
            case 10:
                plot.draw(esri.toolbars.Draw.UP_ARROW);
                break;
            case 11:
                plot.draw(esri.toolbars.Draw.DOWN_ARROW);
                break;
            case 12:
                plot.draw(esri.toolbars.Draw.CIRCLE);
                break;
            case 13:
                plot.draw(esri.toolbars.Draw.ELLIPSE);
                break;
            case 14:
                plot.draw(esri.toolbars.Draw.RECTANGLE);
                break;
            case 15:
                plot.draw(esri.toolbars.Draw.CURVE);
                break;
            case 16:
                plot.draw(esri.toolbars.Draw.BEZIER_CURVE);
                break;
            case 17:
                plot.draw(esri.toolbars.Draw.BEZIER_POLYGON);
                break;
            case 18:
                plot.draw(esri.toolbars.Draw.FREEHAND_ARROW);
                break;
            case 19:
                plot.draw(esri.toolbars.Draw.TRIANGLE);
                break;
        }

    });
}

//全屏
function toggleFullScreen() {
    if (!isFullscreen()) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
* [isFullscreen 判断浏览器是否全屏]
* @return [全屏则返回当前调用全屏的元素,不全屏返回false]
*/
function isFullscreen() {
    //全屏Element，不全屏false
    return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false;
}