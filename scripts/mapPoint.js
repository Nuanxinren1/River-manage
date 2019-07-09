var colorFenDuan = [];
var xzqhList = [];
var colorLevelList = [];
/**
 * @Create 曾国范
 * @Date 2019年4月18日
 * 获取全国的行政区划下的数据
 */
function getCurrentPoint(regionCode, type) {
    var  pointArr=[];
    if(regionCode=="000000000000"){//全国
        pointArr=changjiangRiver;//全国各个辖区的排口信息总数   
    } else if(regionCode=="500000000000"){
        pointArr=cqgq_total_data;//全国各个辖区的排口信息总数  
    }  else{
        return;
    }
    getFenduanData(pointArr, type);
    //地图上添加点位
    mapShowPOI(pointArr, type);
}
/**
 * @Create 曾国范
 * @Date 2019年4月2日
 *地图上添加点位及点位信息的格式化
 * @param {*} json json数组
 */
function mapShowPOI(json, type) {
    if (colorFenDuan != []) {
        for (var i = 0; i < json.length; i++) {
            var count = 0;
            var colorClass = "";
            if (type == 'all') {//全部
                count = Number(json[i]["TOTAL"]) || 0;
            } 
            if (count < colorFenDuan[0]) {
                colorClass = "1";
            } else if (count >= colorFenDuan[0] && count < colorFenDuan[1]) {
                colorClass = "2";
            } else if (count >= colorFenDuan[1] && count < colorFenDuan[2]) {
                colorClass = "3";
            }else if (count >= colorFenDuan[2]) {
                colorClass = "4";
            }
            json[i]["colorClass"] = colorClass;
            json[i]["regionCode"] = json[i]["REGIONCODE"];
            json[i]["number"] = count;
            json[i]["lon"] = json[i]["CENTERX"];  //经度
            json[i]["lat"] = json[i]["CENTERY"];  //经度
            json[i]["regionName"] = json[i]["ORGANIZATIONNAME"];
            json[i]["type"] = type;
            json[i]["p_urlParam"] = '&lon=' + json[i]["CENTERX"] + '&lat=' + json[i]["CENTERY"];
        }
        var popWindowUrl = "";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        // popWindowParam["popHeight"] = 270;
        popWindowParam["popHeight"] = 250;
        popWindowParam["popWidth"] = 530;
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","QG_region_border","YangtzRiver2","RowmouthCZ","riverSystemDefaule"]);
        mugis.mapShowPOI.addPOI(type, json, popWindowParam);
    } else {
        getFenduanData(json, type);
        mapShowPOI(json, type);
    }
};
/**
 * 直接展示重庆市的排口的信息
 * @Create 曾国范
 * @Date 2019年4月20日
 * @param {*} json 
 * @param {*} type 
 */
function  mapShowRowmouth(json, type) {
        for (var i = 0; i < json.length; i++) {
            json[i]["pkName"] = json[i]["排污口名称"];
            json[i]["pKCode"]=json[i]["排污口编码"];
            json[i]["pKAddress"]=json[i]["排放口地址"];
            json[i]["pKType"]=json[i]["排污口类别"];
            json[i]["lon"]=json[i]["经度"];
            json[i]["lat"]=json[i]["纬度"];
            json[i]["isOver"]=json[i]["isOver"];
            json[i]["p_urlParam"] ="";
        }
        var popWindowUrl = "";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        // popWindowParam["popHeight"] = 270;
        popWindowParam["popHeight"] = 250;
        popWindowParam["popWidth"] = 530;
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound"]);
        mugis.mapShowPOI.addPOI("pk_points", json, popWindowParam);
};
/**
 * @Create 曾国范
 * @Date 2019年4月3日
 * 直接在地图上撒点
 */
function endShowPoints(regionCode, type) {
    if(regionCode=="500112000000"){//加载重庆潼南区数据
        mapShowPOIAddPoint(PaiKouMsg, type);
    }else{
        return;
}
}
/**
 * @Create 曾国范
 * @Date 2019年4月2日
 * 直接在地图上撒点
 * @param {*} json json数组
 */
function mapShowPOIAddPoint(json, type) {
    if(type=="all"){
        for (var i = 0; i < json.length; i++) {
            json[i]["pkName"] = json[i]["排口名称"];
            // json[i]["pKCode"]=json[i]["排污口编码"];
            // json[i]["pKAddress"]=json[i]["排放口地址"];
            json[i]["pKType"]=json[i]["排污口类别"];
            json[i]["lon"]=json[i]["经度"];
            json[i]["lat"]=json[i]["纬度"];
            json[i]["isOver"]=json[i]["isOver"];
            json[i]["p_urlParam"] = '&lon=' + json[i]["经度"] + '&lat=' + json[i]["纬度"];
        }
       // var popWindowUrl = "panel/custooms/custooms.html";
        var popWindowUrl = "";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        // popWindowParam["popHeight"] = 270;
        popWindowParam["popHeight"] = 530;
        popWindowParam["popWidth"] = 900;
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","RowmouthCZ","riverSystemDefaule"]);
        mugis.mapShowPOI.addPOI('points', json, popWindowParam);
        var point =new esri.geometry.Point(106.57027, 29.69333, map.spatialReference);
        map.centerAndZoom(point, 12);
        map.centerAt(point);   
    }
       
};
/**
 * @Create 曾国范
 * @Date 2019年4月2日
 * 直接在地图上撒点
 * @param {*} json json数组
 */
function mapShowPOIAddPointSZ(json, type) {
    if(type=="all"){
        for (var i = 0; i < json.length; i++) {
            json[i]["pkName"] = json[i]["PKMC"];
            // json[i]["pKCode"]=json[i]["排污口编码"];
            // json[i]["pKAddress"]=json[i]["排放口地址"];
            json[i]["pKType"]=json[i]["PWKLB"];
            json[i]["lon"]=json[i]["JD"];
            json[i]["lat"]=json[i]["WD"];
            json[i]["isOver"]=json[i]["isOver"];
            json[i]["p_urlParam"] = '&lon=' + json[i]["JD"] + '&lat=' + json[i]["WD"];
        }
       // var popWindowUrl = "panel/custooms/custooms.html";
        var popWindowUrl = "";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        // popWindowParam["popHeight"] = 270;
        popWindowParam["popHeight"] = 530;
        popWindowParam["popWidth"] = 900;
        // mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","RowmouthCZ","riverSystemDefaule"]);
        mugis.mapShowPOI.addPOI('points', json, popWindowParam);
        // var point =new esri.geometry.Point(106.57027, 29.69333, map.spatialReference);
        // map.centerAndZoom(point, 12);
        // map.centerAt(point);   
    }
       
};

/**
 * 敏感点或者缓冲点分析
 * @Create 曾国范
 * @Date 2019年4月21日
 * @param {*} json 
 * @param {*} type 
 */
function  Sensitive_point(json) {
        for (var i = 0; i < json.length; i++) {
            json[i]["companyName"]=json[i]["ENTERPRISE_NAME"];
            json[i]["lon"]=json[i]["LONGITUDE"];
            json[i]["lat"]=json[i]["LATITUDE"];
            json[i]["isOver"]=json[i]["isOver"];
            json[i]["p_urlParam"] = '&lon=' + json[i]["LONGITUDE"] + '&lat=' + json[i]["LATITUDE"];
        }
       // var popWindowUrl = "panel/custooms/custooms.html";
        var popWindowUrl = "panel/overPollInfo/OverOnLine.html";
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = null;
        // popWindowParam["popHeight"] = 270;
        popWindowParam["popHeight"] = 530;
        popWindowParam["popWidth"] = 700;
        mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","RowmouthCZ","riverSystemDefaule","GL_PointCover_points","GL_Widgets_Buffer_pointpanel"]);  
        mugis.mapShowPOI.addPOI('Sensitive_point', json, popWindowParam);

       
};


/**
 * 精确定位查询点位信息展示
 * @param {*} json 
 */
function  JQ_LocationSearch(json) {
   // var popWindowUrl = "panel/custooms/custooms.html";
    var popWindowUrl = "";
    var popWindowParam = {};
    popWindowParam["popWindowUrl"] = popWindowUrl;
    popWindowParam["urlParam"] = null;
    // popWindowParam["popHeight"] = 270;
    popWindowParam["popHeight"] = 530;
    popWindowParam["popWidth"] = 700;
    // mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","RowmouthCZ","riverSystem","GL_PointCover_points","GL_Widgets_Buffer_pointpanel",'all','YangtzRiver']);  
    mugis.mapShowPOI.addPOI('JQ_LocationSearch', json, popWindowParam);

   
};

/**
 * 地图主页列表弹窗
 * @param {*} json 
 */
function   mainSearchMapShowPOI(json) {
    for (var i = 0; i < json.length; i++) {
        json[i]["pkName"]=json[i]["PKMC"]; 
        json[i]["lon"]=json[i]["JD"];
        json[i]["lat"]=json[i]["WD"];
        json[i]["pkType"]=json[i]["PWKLB"];
        json[i]["p_urlParam"] = '&lon=' + json[i]["JD"] + '&lat=' + json[i]["WD"];
    }
   // var popWindowUrl = "panel/custooms/custooms.html";
    var popWindowUrl = "panel/overPollInfo/OverOnLine.html";
    var popWindowParam = {};
    popWindowParam["popWindowUrl"] = popWindowUrl;
    popWindowParam["urlParam"] = null;
    // popWindowParam["popHeight"] = 270;
    popWindowParam["popHeight"] = 500;
    popWindowParam["popWidth"] = 650;
    mugis.mapClear.holdLayers(["riverSystem"]);  
    mapControls.DynamicLayerAdd("riverSystemDefaule",mapconfig.riverSystemDefaule);
    mugis.mapShowPOI.addPOI('mainSearchPOI', json, popWindowParam);
};
/**
 * 溯源时地图上添加的点位   
 * @param {*} json 
 * @param {*} type 
 */
function  suyuanMsg_cq_point(json) {
    for (var i = 0; i < json.length; i++) {
        json[i]["companyName"]=json[i]["企业名称"];
        json[i]["lon"]=json[i]["x"];
        json[i]["lat"]=json[i]["y"];
        json[i]["isOver"]=json[i]["isOver"];
        json[i]["p_urlParam"] = '&lon=' + json[i]["x"] + '&lat=' + json[i]["y"];
    }
   // var popWindowUrl = "panel/custooms/custooms.html";
    var popWindowUrl = "panel/overPollInfo/OverOnLine.html";
    var popWindowParam = {};
    popWindowParam["popWindowUrl"] = popWindowUrl;
    popWindowParam["urlParam"] = null;
    // popWindowParam["popHeight"] = 270;
    popWindowParam["popHeight"] = 530;
    popWindowParam["popWidth"] = 700;
    mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound","riverSystemDefaule","GL_PointCover_points"]);  
    mugis.mapShowPOI.addPOI('suyuanMsg_cq', json, popWindowParam);

   
};

/**
 * 根据数据获取当前分段数据总数
 * @Create 曾国范
 * @Date 2019年4月3日
 */
function getFenduanData(json, type) {
    var dataArrColor = [];
    for (var t = 0; t < json.length; t++) {
        if (type == 'all') {//全部
            dataArrColor.push(Number(json[t]["TOTAL"]) || 0);
        }
    }
    if (dataArrColor.length>0) {
        if (type =="all") {
            colorFenDuan = getJenksBreaks(dataArrColor, 3);
        } else {
            colorFenDuan = getJenksBreaks(dataArrColor, 4);
        }

    }
}
/**
 * 根据数据来对颜色进行分段
 * @param {*} data   json数组
 * @param {*} numclass   分的段数
 */
function getJenksBreaks(data, numclass) {
    function sortNumber(a, b)//在javascript里，Array的sort方法，必须用这个函数，否则不是按数字大小排序
    {
        return a - b
    }
    // int numclass;
    var numdata = data.length;
    if (numdata < numclass) {
        return [];
    }
    data.sort(sortNumber); //先排序
    var mat1 = new Array();
    var mat2 = new Array();
    var st = new Array();
    for (var j = 0; j <= numdata; j++) {
        mat1[j] = new Array();
        mat2[j] = new Array();
        st[j] = 0;
        for (var i = 0; i <= numclass; i++) {
            mat1[j][i] = 0;
            mat2[j][i] = 0;
        }
    }
    for (var i = 1; i <= numclass; i++) {
        mat1[1][i] = 1;
        mat2[1][i] = 0;
        for (var j = 2; j <= numdata; j++) {
            mat2[j][i] = Number.MAX_VALUE;
        }
    }
    var v = 0;
    for (var l = 2; l <= numdata; l++) {
        var s1 = 0;
        var s2 = 0;
        var w = 0;
        var i3 = 0;
        for (var m = 1; m <= l; m++) {
            i3 = l - m + 1;
            var val = parseInt(data[i3 - 1]);
            s2 += val * val;
            s1 += val;
            w++;
            v = s2 - (s1 * s1) / w;
            var i4 = i3 - 1;
            if (i4 != 0) {
                for (var j = 2; j <= numclass; j++) {
                    if (mat2[l][j] >= (v + mat2[i4][j - 1])) {
                        mat1[l][j] = i3;
                        mat2[l][j] = v + mat2[i4][j - 1];
                        if (l == 200 && j == 5) alert("l=" + 200 + ",j=" + 5 + ";mat2[200][5]=" + mat1[l][j] + "i3=" + i3);
                    }
                }
            }
        }
        mat1[l][1] = 1;
        mat2[l][1] = v;
    }
    var k = numdata;
    var kclass = new Array();
    /* int[] kclass = new int[numclass]; */
    kclass[numclass - 1] = parseInt(data[data.length - 1]);
    /* kclass[numclass - 1] = (Integer) data.get(data.size() - 1); */
    for (var j = numclass; j >= 2; j--) {
        var id = parseInt(mat1[k][j]) - 2;
        kclass[j - 2] = parseInt(data[id]);
        k = parseInt(mat1[k][j] - 1);
    }
    //以万为单位取整
    var wkclass = [];
    for (var m = 0; m < kclass.length; m++) {
        if (kclass[m] / 10000 > 1) {
            wkclass.push((parseInt(kclass[m] / 10000) + 1) * 10000);
        } else if (kclass[m] / 1000 > 1) {
            wkclass.push((parseInt(kclass[m] / 1000) + 1) * 1000);
        } else if (kclass[m] / 100 > 1) {
            wkclass.push((parseInt(kclass[m] / 100) + 1) * 100);
        } else if (kclass[m] / 10 > 1) {
            wkclass.push((parseInt(kclass[m] / 10) + 1) * 10);
        } else {
            wkclass.push(kclass[m]);
        }
    }
    return wkclass;
}
/**
 * 排序找出json数组中最大的数
 * @Create 曾国范
 * @Date 2019年4月9日
 * @param {*} json json对象数组
 */
function numberCountPX(json) {
    function sortId(a, b) {
        return a.value - b.value;
    }
    json.sort(sortId);
    return json;
}









function  pointspaceAndareaspaceMsg(json) {
  var json=  [{
        "lon": "113.536851",
        "lat": "34.803488",
        "type":"1"
    }, {    
        "lon": "113.538442",   
        "lat": "34.803268",
        "type":"2"
    }, {    
        "lon": "113.526975",     
        "lat": "34.800283",
        "type":"3"
    }, {
        "lon": "113.528142",       
        "lat": "34.798921",
        "type":"4"
    }]
   // var popWindowUrl = "";
    // var popWindowParam = {};
    // popWindowParam["popWindowUrl"] = popWindowUrl;
    // popWindowParam["urlParam"] = null;
    // // popWindowParam["popHeight"] = 270;
    // popWindowParam["popHeight"] = 300;
    // popWindowParam["popWidth"] = 300;
    mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound"]);
    mugis.mapShowPOI.addPOI('pointSpaceAndAreaSpace', json, null);
};




/**
 * @Create 曾国范
 * @Date 2019年4月2日
 * 直接在地图上撒点
 * @param {*} json json数组
 */
function pointsPictures(json) {
    for (var i = 0; i < json.length; i++) {
        json[i]["picName"] = json[i]["COORDINATE_NAME"];
        var lonAndLat = eval('(' + json[i]["COORDINATE"] + ')');
        json[i]["lon"] = lonAndLat[0]["longitude"];  //经度
        json[i]["lat"] = lonAndLat[0]["latitude"];  //经度
    }
    var popWindowUrl = "panel/custooms/custooms.html";
    // var popWindowParam = {};
    // popWindowParam["popWindowUrl"] = popWindowUrl;
    // popWindowParam["urlParam"] = null;
    // // popWindowParam["popHeight"] = 270;
    // popWindowParam["popHeight"] = 300;
    // popWindowParam["popWidth"] = 300;
    mugis.mapClear.holdLayers(["GL_regionsLayer", "nextBoundLyaer", "regionBound"]);
    mugis.mapShowPOI.addPOI('picturePoints', json, null);
};
/**
 * 清除地图上的所有Echarts，并重新居中地图
 */
function clearAllEcharts(){
    $(".class_chart").remove();//清除所有图层
}
/**
 * 移动中心点
 */
function  moveCenter(){
    //陕西省  108.94562   34.34803
    //原来   104.35416666666   , 28.70833333333
    setTimeout(function () {
        // var poi_cent = new esri.geometry.Point(108.94562 ,34.34803, map.spatialReference);
        // map.centerAt(poi_cent);
        var poi_cent = new esri.geometry.Point(108.842623,34.527114, map.spatialReference);
        map.centerAndZoom(poi_cent, 4);
    }, 800);
   
}

