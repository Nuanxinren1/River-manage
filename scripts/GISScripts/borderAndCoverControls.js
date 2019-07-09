/**
 * map边界控制加载,主要是颜色控制
 * @Create 曾国范
 * @Date 2019年4月2日 
 */
//边界配置json串
var  GISAPI={};
var  borderControls={
    /**
     * 渲染边界和区域
     * @param {*} regionCode 
     */
    XRBorderAndArea:function(regionCode){
        //初始化边界配置
        borderControls.init_GISAPI();
       // regionCode="000000";
     //   regionCode="410000000000";
        if (regionCode == "000000") {
            //加载全国边界，实际是加载省级边界
            borderControls.initRegion(regionCode, hideFourZomm);
        } else {
             var codeLevel = borderControls.judgeRegionType(regionCode);
             borderControls.initRegion(regionCode);
             borderControls.setMapExtent(regionCode, codeLevel);
        }
        //initRegion(vm.CurRegionCode,hideFourZomm);
        function hideFourZomm() {
            var level = map.getZoom();
            if (level == 4) {
                //渲染地图地图和环状对比
                //$(".static").remove();
                //renderMapAndHuan();
                //clearRegionBound();
            }
        }
     },
     /**
      * @Create 曾国范
      * @Date 2019年4月2日
      * 调用相关的gis初始化GISAPI边界配置
      */
     init_GISAPI:function(){
        require(["esri/graphic", "esri/geometry/Extent",
        "esri/geometry/Point", "esri/geometry/Polyline",
        "esri/geometry/Polygon", "esri/Color", "esri/layers/GraphicsLayer",
        "esri/tasks/query", "esri/tasks/QueryTask", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureFillSymbol", "esri/renderers/UniqueValueRenderer"
    ], function (
        Graphic, Extent, Point, Polyline, Polygon, Color,
        GraphicsLayer, Query, QueryTask, SimpleLineSymbol,
        SimpleFillSymbol, PictureFillSymbol, UniqueValueRenderer) {
            GISAPI.Graphic = Graphic;
            GISAPI.Extent = Extent;
            GISAPI.Point = Point;
            GISAPI.Polyline = Polyline;
            GISAPI.Polygon = Polygon;
            GISAPI.Color = Color;
            GISAPI.GraphicsLayer = GraphicsLayer;
            GISAPI.Query = Query;
            GISAPI.QueryTask = QueryTask;
            GISAPI.SimpleLineSymbol = SimpleLineSymbol;
            GISAPI.SimpleFillSymbol = SimpleFillSymbol;
            GISAPI.PictureFillSymbol = PictureFillSymbol;
            GISAPI.UniqueValueRenderer = UniqueValueRenderer;
            //边界设置默认颜色
            borderControls.init_GISAPI_ADDJSON();
        })
     },
     /**
      * 初始化border颜色和填充颜色
      * @Create 曾国范
      * @Date 2019年4月2日
      */
     init_GISAPI_ADDJSON:function(){
        lineSymbol = new GISAPI.SimpleLineSymbol(//边界颜色
            GISAPI.SimpleLineSymbol.STYLE_SOLID, new GISAPI.Color([150, 203, 87]), 2
            );
        symbolAdminBoundaryDefault = new GISAPI.SimpleFillSymbol(//填充颜色
            GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color([142, 197, 240, 0]));
     },
     /**
      * 
      */
     initRegion:function(regionCode){
        borderControls.clearRegionBound();
        $(".static").remove();
        var layerG = map.getLayer("enterpriseLayer");
        if (layerG) {
            layerG.clear();
        }
        var regionType = borderControls.judgeRegionType(regionCode);
        //下一级行政区边界
        var childRegionLayer = new GISAPI.GraphicsLayer({ id: "nextBoundLyaer" });
        map.addLayer(childRegionLayer);
        borderControls.setRegionRender(mapconfig.MapServer_Ssx_china + "/" + regionType, regionCode);
        var regionHead = "";
        var codeForhead = regionCode.substr(0, 2);
        var rCode = regionCode;
        //11-北京市  12-天津市  31-上海市  50-重庆市   
        if ((codeForhead == "11" || codeForhead == "12" || codeForhead == "31" || codeForhead == "50") && regionCode.substr(3, 2) == "00") {
            rCode = codeForhead + "0100";
        }
        var rType = borderControls.judgeRegionType(rCode);
        if (regionType == "2") { //省
            regionHead = rCode.substr(0, 2);
        } else if (regionType == "1") { //市
            regionHead = rCode.substr(0, 4);
        }
        borderControls.setNextRegionRender(rType, regionHead);
        var sign = 1;
        if (regionCode == "000000") {
            sign = 1;//国家在省级别显示全部省份
        } else if (rType == "2") {
            sign = 2;//省在省级别显示本省
        } else if (rType == "1") {
            sign = 3;//市在省级别显示本市
        } else if (rType == "0") {
            sign = 4;//县在省级别显示本县
        }
         //   queryTotalData(rCode, "", sign);
        // if (callback) {
        //     callback();
        // }
     },
     /**
      * 清除地图上的边界
      */
    
     clearRegionBound:function(){
        var RB_layer = map.getLayer("nextBoundLyaer");
        if (RB_layer) {
            map.removeLayer(RB_layer);
            RB_layer = null;
        }
        var glayer = map.getLayer("regionBound");
        if (glayer) {
            map.removeLayer(glayer);
            glayer = null;
        }
        // //新增边界图
        var blayer = map.getLayer("GL_regionsLayer");
        if (blayer) {
            map.removeLayer(blayer);
            blayer = null;
        }
     },
     /**
      * 判断当前行政区划所属级别
      */
     judgeRegionType:function(code){
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
     },
     /**
 * 边界渲染,加载省界或者市界
 * @Change 曾国范
 * @Date 2019年3月29日
 * @param {*} url arcgis  server 的地图服务
 * @param {*} regionCode   区域代码，全国的代码是 000000
 */
setRegionRender: function (url, regionCode) {
    var query = new GISAPI.Query();
    query.returnGeometry = true;
    if (regionCode != "000000") {
        query.where = "XZDM = '" + regionCode + "000000'";
    } else {
        query.where = " 1=1 ";
        //mugis.mapZoom.setFullExtent();
        return;
    }
    var queryTask = new GISAPI.QueryTask(url);
    queryTask.execute(query, function (event) {
        if (event.features.length > 1) {
            var mExtent = new GISAPI.Extent(75.29712499999995 - 0.01, 17.12633593749997 - 0.01, 124.51587500000004 + 0.01, 56.23766406250003 + 0.01, map.spatialReference);
            map.setExtent(mExtent);
        } else if (event.features.length > 0) {
            var feature = event.features[0];
            var lineSymbol = new GISAPI.SimpleLineSymbol(GISAPI.SimpleLineSymbol.STYLE_SOLID, new GISAPI.Color([150, 203, 87]), 2);
            var fillSymbol = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color([142, 197, 240, 0]));
            feature.symbol = fillSymbol;
            var polygon = feature.geometry;
            polygon.prototype = GISAPI.Polygon;
            var pExtent = polygon.getExtent();
            var mExtent = new GISAPI.Extent(pExtent.xmin, pExtent.ymin, pExtent.xmax, pExtent.ymax, map.spatialReference);
            var graphicsLayer = new GISAPI.GraphicsLayer({
                id: "regionBound"
            });
            graphicsLayer.add(feature);
            map.addLayer(graphicsLayer, 0);
            map.setExtent(mExtent);
        }
    })    
},
/**
 * @Change 曾国范
 * @Date 2019年3月29日
 * query使用like查询数据
 * @param {*} regionType   获取边界类型，0-县，1-市，2-省
 * @param {*} regionHead 
 */
setNextRegionRender: function (regionType, regionHead) {
    var url;
    if (regionType != "0") {
        regionType = (parseInt(regionType) - 1).toString();
    }
    url = mapconfig.MapServer_Ssx_china + "/" + regionType;
    var query = new GISAPI.Query();
    query.returnGeometry = true;
    if (regionHead != "00") {
        query.where = "XZDM like '" + regionHead + "%'";
    } else {
        query.where = " 1=1 ";
        url = mapconfig.MapServer_Ssx_china + "/2";
    }
    var queryTask = new GISAPI.QueryTask(url);
    queryTask.execute(query, function (event) {
        var features = event.features;
        var count = features.length;
        var boundLayer = map.getLayer("nextBoundLyaer");
        if (boundLayer != null) {
            boundLayer.clear();
        } else {
            return;
        }
        for (var i = 0; i < count; i++) {
            var color_index = i % 4;
            var feature = event.features[i];
            var lineSymbol = new GISAPI.SimpleLineSymbol(GISAPI.SimpleLineSymbol.STYLE_SOLID, new GISAPI.Color([150, 203, 87]), 2);
            if (regionHead == "00") {
                // var fillSymbol = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color([150, 203, 87, 0]));
                if(colorLevelList.length>0){
                    for(var md=0;md< colorLevelList.length;md++){   
                        if(colorLevelList[md]["regionCode"]==feature.attributes["XZDM"]){
                            //   fillColors_life     fillColors_NongYe fillColors_JiZhongShi 
                            if(colorLevelList[md]["type"]=="move_noManchineOrPollution"){ //移动
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_move[Number(colorLevelList[md]["colorLevel"])].color));
                            }
                            else if(colorLevelList[md]["type"]=="pollution_all"||colorLevelList[md]["type"]=="all"){ //全部
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_all[Number(colorLevelList[md]["colorLevel"])].color));
                            }else if(colorLevelList[md]["type"]=="pollution_GY" || colorLevelList[md]["type"]=="CPCL" || colorLevelList[md]["type"]=="NYXHL" || colorLevelList[md]["type"]=="YFCLYL"||colorLevelList[md]["type"]=="GY"){ //工业
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_GongYe[Number(colorLevelList[md]["colorLevel"])].color));
                            }else if(colorLevelList[md]["type"]=="NY"){
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_NongYe[Number(colorLevelList[md]["colorLevel"])].color));
                            }else if(colorLevelList[md]["type"]=="JZS"){
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_JiZhongShi[Number(colorLevelList[md]["colorLevel"])].color));
                            }else if(colorLevelList[md]["type"]=="SH"){
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_life[Number(colorLevelList[md]["colorLevel"])].color));
                            }else if(colorLevelList[md]["type"]=="YD"){
                                var fillSymbol   = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_move[Number(colorLevelList[md]["colorLevel"])].color));
                            }
                        }
                    }
                }else{
                    var fillSymbol = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color([0, 0, 0, 0]));
                } 
            } else {
                // var fillSymbol = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color(fillColors_move[color_index].color));
                var fillSymbol = new GISAPI.SimpleFillSymbol(GISAPI.SimpleFillSymbol.STYLE_SOLID, lineSymbol, new GISAPI.Color([0, 0, 0, 0]));
            }
            feature.symbol = fillSymbol;
            boundLayer.add(feature);
        }
    })
},
setMapExtent: function (code, codeLevel) {
    require([
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Extent",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color"
    ], function (Query, QueryTask, SimpleFillSymbol, Graphic, GraphicsLayer, Extent, SimpleFillSymbol, SimpleLineSymbol, Color) {
        var cityExtentLayer = map.getLayer("setCityExtent");
        if (cityExtentLayer) {
            map.removeLayer(cityExtentLayer);
        }
        var query = new Query();
        var queryUrl = mapconfig.MapServer_Ssx_china + "/" + codeLevel + "";
        query.where = "1=1";//CODE<>'" + regionSub + "'
        if (codeLevel = "0") {
            query.where = "XZDM like'" + code.substr(0, 6) + "%'";
        } else if (codeLevel == "1") {
            query.where = "XZDM like'" + code.substr(0, 4) + "%'";
        } else if (codeLevel == "2") {
            query.where = "XZDM like'" + code.substr(0, 2) + "%'";
        }
        query.returnGeometry = true;
        query.outFields = ["*"];
        var queryTask = new QueryTask(queryUrl);
        queryTask.execute(query, queryResult);
        function queryResult(e) {
            var features = e.features;
            if(features.length==0){
              return;
            }
            var geometry = features[0].geometry;
            var extent = geometry.getExtent();
            var xMin = extent.xmin - 0.5;
            var xMax = extent.xmax + 0.5;
            var yMin = extent.ymin - 0.1;
            var yMax = extent.ymax + 0.1;
            var newExtent = new Extent({
                "xmin": xMin, "xmax": xMax, "ymin": yMin, "ymax": yMax, "spatialReference": { "wkid": 4490 }
            });
            var city_graLyr = new GraphicsLayer({ id: "setCityExtent" });
            var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([255, 0, 0]), 3), new Color([255, 0, 0, 0]));
            var city_gra = new Graphic(geometry, sym);
            city_graLyr.add(city_gra);
            map.addLayer(city_graLyr);
        }
    });
}
}
