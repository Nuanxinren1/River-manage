//全局变量
var drawGraphicsLayer, ecologicalLayer, GridLayer;
mugis.mapShowPOI = {
    //存放当前点击的点位的坐标
    checked_point: {
        longitude: 0,
        latitude: 0,
        state: 0
    },
    symbol: null,
    /**
     * @Create 曾国范
     * @Date 2019年4月2日
     * 在地图上添加折线
     * @param {*} datatype 
     * @param {*} json 
     * @param {*} popWindowParam 
     * @param {*} keep 
     */
    createPolyLine: function (datatype, json, popWindowParam, keep) {
        require([
            "esri/symbols/Font",
            "esri/geometry/Point"
            , "esri/layers/GraphicsLayer"
            , "esri/graphic"
            , "esri/symbols/PictureMarkerSymbol"
            , "esri/symbols/SimpleMarkerSymbol"
            , "esri/symbols/SimpleLineSymbol"
            , "esri/symbols/PictureFillSymbol"
            , "esri/Color"
            , "esri/config"
            , "esri/dijit/PopupTemplate"
            , "esri/renderers/ClassBreaksRenderer"
            , "widgets/ClusterLayer"
            , "esri/symbols/TextSymbol",
            "esri/geometry/Polyline"
        ], function (Font, Point, GraphicsLayer, Graphic, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleLineSymbol, PictureFillSymbol, Color, config, PopupTemplate, ClassBreaksRenderer, ClusterLayer, TextSymbol, Polyline) {
            var layer = map.getLayer(datatype);
            var layerExist = (layer == null) ? false : true;
            if (!layerExist) {//(保留&&不存在)||(不保留&&不存在)=不存在
                //创建图层
                drawGraphicsLayer = new GraphicsLayer({ id: "GL_PointCover_" + datatype });
                map.addLayer(drawGraphicsLayer, 50);
            }
            var paths = [];
            for (var z = 0; z < json.length; z++) {
                paths.push([json[z].Jd, json[z].Wd]);
            }
            var polyline = new Polyline(paths);
            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([255, 30, 8]),
                2
            );
            var graphic = new Graphic(polyline, symbol);
            drawGraphicsLayer.add(graphic);
        })
    },
    /**
     * @Create 曾国范
     * @Date 2019年4月2日
     * 地图上添加点位
     * @param {*} datatype   数据类型，点位类型
     * @param {*} json   json数组
     * @param {*} popWindowParam  地图点位点击的弹窗指向的URL
     * @param {*} keep   暂无意义
     */
    addPOI: function (datatype, json, popWindowParam, keep) {
        var _this = this;
        require([
            "esri/symbols/Font",
            "esri/geometry/Point"
            , "esri/layers/GraphicsLayer"
            , "esri/graphic"
            , "esri/symbols/PictureMarkerSymbol"
            , "esri/symbols/SimpleMarkerSymbol"
            , "esri/symbols/SimpleLineSymbol"
            , "esri/symbols/PictureFillSymbol"
            , "esri/Color"
            , "esri/config"
            , "esri/dijit/PopupTemplate"
            , "esri/renderers/ClassBreaksRenderer"
            , "widgets/ClusterLayer"
            , "esri/symbols/TextSymbol"
        ], function (Font, Point, GraphicsLayer, Graphic, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleLineSymbol, PictureFillSymbol, Color, config, PopupTemplate, ClassBreaksRenderer, ClusterLayer, TextSymbol, ) {

            if (_this.symbol == null) {
                _this.symbol = {
                    PictureMarkerSymbol: PictureMarkerSymbol,
                    SimpleMarkerSymbol: SimpleMarkerSymbol,
                    SimpleLineSymbol: SimpleLineSymbol,
                    PictureFillSymbol: PictureFillSymbol,
                    Color: Color
                };
            }
            //参数初始化
            if (json == null) {
                json = [];
            }
            if (json != null) {
                var layer = map.getLayer("GL_PointCover_" + datatype);
                var layerExist = (layer == null) ? false : true;
                if (!layerExist) {//判断图层是否存在
                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: "GL_PointCover_" + datatype });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    if (datatype == "points") {
                      //  drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                      //  drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                    }
                }
                else if (!keep) {//不保留&&存在=不保留
                    //清空+移除
                    layer.clear();
                    map.removeLayer(layer);
                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: "GL_PointCover_" + datatype });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    if (datatype == "points") {
                      //  drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                      //  drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                    }
                }
                else {
                    //保留&&存在
                }
                var multipoint = new esri.geometry.Multipoint(); //查询到的点集合
                var pointArr = new Array(); //(用于聚合)

                var html = "";
                var symbol = null;
                //设置覆盖物样式并添加覆盖物到地图
                for (var i = 0; i < json.length; i++) {
                    if (datatype == "picturePoints" && json[i]["OBJECT_TYPE"] != 0) { continue; }
                    //初始化数据lon,lat
                    var lon = Number(json[i]["lon"]);
                    var lat = Number(json[i]["lat"]);
                    if (isNaN(lon) || lon == 0) {
                        continue;
                    }
                      //添加点位到地图
                      var point = new Point(lon, lat);
                    //添加覆盖物
                    html = "";
                    symbol = null;
                    if(datatype=="points" && json[i]["isOver"]=='1'){
                        var coverStyle2 = mugis.mapShowPOI.GetCoverStyle(datatype, json[i], i,'1');
                        symbol = coverStyle2.symbol;
                        var graphic = new Graphic(point, symbol, json[i]);
                        drawGraphicsLayer.add(graphic);
                      }else if((datatype=="Sensitive_point"||datatype=="suyuanMsg_cq")&& json[i]["isOver"]=='1'){
                        var coverStyle3 = mugis.mapShowPOI.GetCoverStyle(datatype, json[i], i,'1');
                        symbol = coverStyle3.symbol;
                        var graphic = new Graphic(point, symbol, json[i]);
                        drawGraphicsLayer.add(graphic);
                      }
                    //     console.log(datatype);            
                    var coverStyle = mugis.mapShowPOI.GetCoverStyle(datatype, json[i], i);

                    html = coverStyle.html;
                    symbol = coverStyle.symbol;

                    //添加html覆盖物到地图
                    $("body").append(html);

               
                    var screenPnt = map.toScreen(point);
                    multipoint.addPoint(point);

                    var graphic = new Graphic(point, symbol, json[i]);

                    drawGraphicsLayer.add(graphic);
                    pointArr.push({ x: lon, y: lat, attributes: json[i] });

                    //设置标签离覆盖物偏移距离
                    $(".ring_" + datatype + "_" + i).css({ "left": screenPnt.x - 19 + "px", "top": screenPnt.y - 26 + "px", "position": "absolute", "z-index": "39", "cursor": "pointer" });
                    if (datatype != "points") {
                        // var textSym = null;
                        // textSym = new TextSymbol(json[i]["number"]).setColor(new Color([255, 255, 255]));
                        // textSym.setFont(new Font("8pt"));
                        // textSym.setOffset(0, 0);
                        // var textgraphic = new Graphic(point, textSym, json[i]);
                        // drawGraphicsLayer.add(textgraphic);
                        var textSym_number = null;
                        textSym_number = new TextSymbol(json[i]["number"]).setColor(new Color([255, 255, 255]));
                        var fontText = new Font();
                        fontText.setSize('8px');
                      //  fontText.setWeight(Font.WEIGHT_BOLDER);
                        fontText.setStyle([{ ' text-shadow': '2px 2px 0px #fff' }]);
                        fontText.setFamily(['initial']);

                        textSym_number.setFont(fontText);
                        textSym_number.setHaloSize(1);
                        //  textSym2.setFont(new Font("8pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER, "Helvetica"));
                        //   textSym2.setWeight(new Weight("600"));
                        textSym_number.setOffset(0, -3);
                        var textgraphic_number = new Graphic(point, textSym_number, json[i]);
                        drawGraphicsLayer.add(textgraphic_number);
                        // var textSym2 = null;
                        // textSym2 = new TextSymbol(json[i]["regionName"]).setColor(new Color([0, 51, 34]));
                        // var fontText = new Font();
                        // fontText.setSize('15px');
                        // fontText.setWeight(Font.WEIGHT_BOLDER);
                        // fontText.setStyle([{ ' text-shadow': '2px 2px 0px #fff' }]);
                        // fontText.setFamily(['initial']);
                        // textSym2.setFont(fontText);
                        // textSym2.setHaloSize(1);
                        // textSym2.setOffset(0, -30);
                        // var textgraphic = new Graphic(point, textSym2, json[i]);
                    //    drawGraphicsLayer.add(textgraphic);
                    } else {
                        // var textSym2 = null;
                        // textSym2 = new TextSymbol(json[i]["COORDINATE_NAME"]).setColor(new Color([0, 51, 34]));
                        // var fontText = new Font();
                        // fontText.setSize('15px');
                        // fontText.setWeight(Font.WEIGHT_BOLDER);
                        // fontText.setStyle([{ ' text-shadow': '2px 2px 0px #fff' }]);
                        // fontText.setFamily(['initial']);

                        // textSym2.setFont(fontText);
                        // textSym2.setHaloSize(1);
                        // //  textSym2.setFont(new Font("8pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER, "Helvetica"));
                        // //   textSym2.setWeight(new Weight("600"));
                        // textSym2.setOffset(0, -30);
                        // var textgraphic = new Graphic(point, textSym2, json[i]);
                        // drawGraphicsLayer.add(textgraphic);
                    }

                }
            }//if (json != null)结束位置

            //图层的点击事件
            function layerClick(e) {
                var graphic = e.graphic;
                var mapPoint = graphic.geometry;
                //将当前点击的点的信息赋值给一个对象
                mugis.mapShowPOI.checked_point.longitude = mapPoint.x;
                mugis.mapShowPOI.checked_point.latitude = mapPoint.y;
                mugis.mapShowPOI.checked_point.state = 0;
                var attributes = graphic.attributes;
                if (datatype == "points" || datatype=="mainSearchPOI") {
                  //  $('#pointClickMsg').hide();
                  $('#pointClickMsg ').hide()
                    var pkName = attributes["pkName"];
                    var lon = attributes["lon"];  //经度
                    var lat = attributes["lat"];  //经度
                    console.log(lon);
                    console.log(lat);
                    //$('#pointClickMsg').show();
                    //将当前的div传到前台
                    getCurrenClickPointZB(lon,lat);
                    if(attributes["isOver"]=="1"){ 
                        graphic.symbol.height=50;
                        graphic.symbol.width=50;
                       // mapControls.DynamicLayerAdd("pointClickRiver",mapconfig.pointClickRiver);   
                        mapControls.AddFeatureLayer("pointClickRiver",mapconfig.pointClickRiver);                    
                    }
                    $('#pointClickMsg ').show();
                    var point = new Point(Number(lon), Number(lat), map.spatialReference);
                    map.centerAndZoom(point, 12);
                    map.centerAt(point);   
                //     window.dialog = $("#pointClickMsg").clone().dialog({
                //         title: "标题",
                //         width : '330',
                //         height : 600,
                //         modal : true
                //     });                   
                // //    $("iframe",dialog).attr("scrolling","no");
                //     $("iframe",dialog).attr("frameborder","0");
                //     $("iframe",dialog).attr("height","100%");
                //     $("iframe",dialog).attr("width","330px");
                //     $("iframe",dialog).attr("src","sewageDetail.html");    
                    
                 //   map_CenterAtAndZoom(Number(lon), Number(lat),10);
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
                    $("iframe",dialog).attr("src","sewageDetail.html?lon="+lon+"&lat="+lat+"&pkName="+encodeURI(pkName));  






                  //   jsPanels.popPanel("PK_isOver",pkName.substring(0,4),'300','500','sewageDetail.html','1');
                }else  if(datatype=="all"){
                    var regionCode = attributes["regionCode"];
                    var regionName = attributes["regionName"];
                    var type = attributes["type"];
                    var regionType = judgeRegionType(regionCode);
                   // var aSpan = document.querySelector("#map-hierarchy span");
                    var poi_cent = new esri.geometry.Point(Number(attributes["lon"]), Number(attributes["lat"]), map.spatialReference);
                    if (regionType == "2") {//省
                        map.centerAndZoom(poi_cent, 7);
                    } else if (regionType == "1") {//市
                        map.centerAndZoom(poi_cent, 9);
                    } else if (regionType == "0") {//县
                        map.centerAndZoom(poi_cent, 10);
                    }
                    //获取当前地图等级
                    var grade = map.getLevel();
                    //清除所有图层
                    mugis.mapClear.holdLayers([]);
                    //点击点位修改弹窗
                  //  borderControls.XRBorderAndArea(regionCode);
                    //获取当前选择的行政区划污染源的信息，默认是全部
                    if (regionCode == "500112000000") {  //渝北区   500112000000
                        endShowPoints(regionCode, type); 
                    }  else  if(regionCode=="500000000000"){
                        mapControls.DynamicLayerAdd("riverSystemDefaule",mapconfig.riverSystemDefaule);
                        //问题插值图什么样
                      //  mapControls.DynamicLayerAdd("RowmouthCZ",mapconfig.RowmouthCZ);
                        getCurrentPoint(regionCode, type);
                    }else{
                        getCurrentPoint(regionCode, type);
                    }
                }else if(datatype=="Sensitive_point"||datatype=="suyuanMsg_cq" || datatype=="mainSearchPOI"){
                    // if(attributes["isOver"]=="1"){ 
                    //     graphic.symbol.height=50;
                    //     graphic.symbol.width=50;
                    // }
                    // var point = new Point(Number(lon), Number(lat), map.spatialReference);
                    // map.centerAndZoom(point, 11);
                    // map.centerAt(point);
                      //  graphic.symbol=null;
                      var companyName = attributes["companyName"] ||attributes["pkname"];
                            var lon = attributes["lon"];  //经度
                            var lat = attributes["lat"];  //经度
                             infoWidth = popWindowParam.popWidth;
                             infoHeight = popWindowParam.popHeight;
                             map.infoWindow.resize(infoWidth, infoHeight);
                             map.infoWindow.setContent("<iframe id='iframe_infowindow'   frameborder='0'  width='100%' height='" + (infoHeight - 30) + "'  src='" + (popWindowParam.popWindowUrl + "?lon=" + mapPoint.x + "&lat=" + mapPoint.y + "&companyName=" + attributes["companyName"] ||attributes["pkname"] ) + "'/>");
                             map.infoWindow.setTitle("<font style = 'font-weight:bold'>"+companyName+"</font>");
                             map.infoWindow.show(mapPoint);
                }else if(datatype=="JQ_LocationSearch"){
                    return;
                }
            }


            function mouseOverLayer(e) {
                map.setMapCursor("pointer");
                //console.log(e.graphic);
                var font = new esri.symbol.Font();
                font.setSize("10pt");
                font.setFamily("宋体");
                var cpoint = event.graphic.geometry;
                var text = new esri.symbol.TextSymbol(event.graphic.attributes["companyName"]);
                text.setFont(font);
                text.setColor(new dojo.Color([0, 0, 0, 100]));
                text.setOffset(20, -35);
                var pmsTextBg = new PictureMarkerSymbol();
                pmsTextBg.setOffset(20, -30);
                var textLength = event.graphic.attributes["companyName"].length;
                pmsTextBg.setWidth(textLength * 13.5 + 5);
                pmsTextBg.setColor(new esri.Color([255, 255, 0, 0.8]));
                var bgGraphic = new esri.Graphic(cpoint, pmsTextBg);
                map.graphics.add(bgGraphic);
                var labelGraphic = new esri.Graphic(cpoint, text);
                map.graphics.add(labelGraphic);
            };
            function mouseOutLayer() {
                map.graphics.clear();
                map.setMapCursor("default");
            }


        });//require结束(加载点位结束)
    },//地图上添加点位结束

    /**
     * 设置地图上点位的覆盖物的样式
     * @Create 曾国范
     * @Date 2019年4月2日
     * @param {*} datatype 
     * @param {*} json 
     * @param {*} i 
     */
    GetCoverStyle: function (datatype, json, i,type) {
        var PictureMarkerSymbol = this.symbol.PictureMarkerSymbol;
        var SimpleMarkerSymbol = this.symbol.SimpleMarkerSymbol;
        var SimpleLineSymbol = this.symbol.SimpleLineSymbol;
        //var PictureFillSymbol = this.symbol.PictureFillSymbol;
        var Color = this.symbol.Color;
        var r = {
            html: "",
            symbol: null
        };
        try {
            //①html覆盖物
            r.symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0]));//带名称覆盖物旁边的点状标记
            //  var level = mugis.airClassify.getAirLevelAndColor(value, json.p_type);
            // r.html += "<div class='ring_" + datatype + "_" + i + " ring'>"+regionName+"</div>";
            if (datatype == "points") {
                if(type=='1'){
                    r.symbol = new PictureMarkerSymbol('img/hotpoint/hotpoint.gif', 32, 32);
                    r.symbol.setOffset(0, -1);
                }else{
                    if(json["pKType"]=="入河排污口"){
                        r.symbol = new PictureMarkerSymbol('img/PKPoints/river.png', 32, 32);
                        r.symbol.setOffset(0, 12);
                    }else{ //入海排污口
                        r.symbol = new PictureMarkerSymbol('img/PKPoints/sea.png', 32, 32);
                    }
                }
            
            }else if(datatype=="mainSearchPOI"){
                if(json["pkType"]=="入河排污口"){
                    r.symbol = new PictureMarkerSymbol('img/PKPoints/river.png', 32, 32);
                    r.symbol.setOffset(0, 12);
                }else{ //入海排污口
                    r.symbol = new PictureMarkerSymbol('img/PKPoints/sea.png', 32, 32);
                }
            } 
             else if(datatype=='Sensitive_point' || datatype=="suyuanMsg_cq"){ //敏感点或者溯源
                 if(type==1){
                    r.symbol = new PictureMarkerSymbol('img/hotpoint/huang.gif', 32, 32);
                    r.symbol.setOffset(0, -6);
                 }
                 else{
                     if(json["isOver"]=="1"){
                        r.symbol = new PictureMarkerSymbol('img/points/CollectDisplay/center.png', 40, 40);
                        r.symbol.setOffset(0, 7);
                     }else{
                        r.symbol = new PictureMarkerSymbol('img/points/CollectDisplay/center.png', 22, 22);
                        r.symbol.setOffset(0, 7);
                     }
                   
                 }
             
            }else if(datatype=="JQ_LocationSearch"){//精确定位点位添加
                r.symbol = new PictureMarkerSymbol('img/mark/mark.png', 40, 40);
                r.symbol.setOffset(0, 7);
            } 
             else { //导航栏添加点位信息
                var colorClass = json["colorClass"];
                r.symbol = new PictureMarkerSymbol('img/points/points2/' + colorClass + '.png', 40, 40);
            }

        } catch (e) {

        }
        return r;
    },
    /**
     * 根据图层添加点位
     * @param {*} json 
     * @param {*} popWindowParam 
     * @param {*} layerAttr 
     * @param {*} keep 
     */
    addPOIbyLayerInfo: function (json, popWindowParam, layerAttr, keep) {
        var _this = this;
        require([
            "esri/geometry/Point"
            , "esri/layers/GraphicsLayer"
            , "esri/graphic"
            , "esri/symbols/PictureMarkerSymbol"
            , "esri/symbols/SimpleMarkerSymbol"
            , "esri/symbols/SimpleLineSymbol"
            , "esri/symbols/PictureFillSymbol"
            , "esri/Color"
            , "esri/config"
            , "esri/dijit/PopupTemplate"
            , "esri/renderers/ClassBreaksRenderer"
            , "widgets/ClusterLayer"
            , "esri/symbols/TextSymbol"
        ], function (Point, GraphicsLayer, Graphic, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleLineSymbol, PictureFillSymbol, Color, config, PopupTemplate, ClassBreaksRenderer, ClusterLayer, TextSymbol) {
            if (_this.symbol == null) {
                _this.symbol = {
                    PictureMarkerSymbol: PictureMarkerSymbol,
                    SimpleMarkerSymbol: SimpleMarkerSymbol,
                    SimpleLineSymbol: SimpleLineSymbol,
                    PictureFillSymbol: PictureFillSymbol,
                    Color: Color
                };
            }
            //参数初始化
            if (json == null) {
                json = [];
            }
            if (json != null) {
                var layer = map.getLayer(layerAttr.lyrId);
                var layerExist = (layer == null) ? false : true;
                if (!layerExist) {//(保留&&不存在)||(不保留&&不存在)=不存在
                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: layerAttr.lyrId });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                    drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                }
                else if (!keep) {//不保留&&存在=不保留
                    //清空+移除
                    layer.clear();
                    map.removeLayer(layer);
                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: layerAttr.lyrId });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                    drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                }
                else {
                    //保留&&存在
                }
                var symbol = null;
                //设置覆盖物样式并添加覆盖物到地图
                for (var i = 0; i < json.length; i++) {
                    //初始化数据lon,lat
                    var lon = Number(json[i].p_lon ? json[i].p_lon : json[i].lon);
                    var lat = Number(json[i].p_lat ? json[i].p_lat : json[i].lat);
                    if (isNaN(lon) || lon == 0) {
                        continue;
                    }
                    if (layerAttr.dataType == "section") {
                        if (json[i].value) {
                            if (json[i].value.Level) {
                                var level = json[i].value.Level;
                            }
                            else {
                                var level = null;
                            }
                        } else {
                            var level = null;
                        }
                        if (layerAttr.lyrId == '_SecRiver') {
                            if (json[i].sectionauto == '0') {
                                symbol = new PictureMarkerSymbol(layerAttr.iconUrl2[level], 18, 18);
                            } else {
                                symbol = new PictureMarkerSymbol(layerAttr.iconUrl[level], 19, 19);
                            }
                        }
                        //else if (layerAttr.lyrId == '_SecDrink') {
                        //    var waterLevel= json[i].
                        //}
                        else {
                            symbol = new PictureMarkerSymbol(layerAttr.iconUrl[level], 20, 20);
                        }
                        //if (layerAttr.lyrId == '_SecMicro') {
                        //    symbol = new PictureMarkerSymbol(layerAttr.iconUrl[level], 20, 20);
                        //} if (layerAttr.lyrId == '_SecLake') {

                        //}


                    } else if (layerAttr.lyrId == '_Output') {
                        symbol = new PictureMarkerSymbol(layerAttr.iconUrl, 27, 27);
                    }
                    else {
                        symbol = new PictureMarkerSymbol(layerAttr.iconUrl, 18, 18);
                    }

                    //添加点位到地图
                    var point = new Point(lon, lat);
                    var screenPnt = map.toScreen(point);
                    var graphic = new Graphic(point, symbol, json[i]);
                    drawGraphicsLayer.add(graphic);

                    if (layerAttr.dataType == 'section') {
                        var textSym = new TextSymbol(json[i].p_value);
                        textSym.setOffset(0, 0);
                        var textgraphic = new Graphic(point, textSym, json[i]);
                        drawGraphicsLayer.add(textgraphic);
                    }
                }

            }//if (json != null)结束位置
            //图层的点击事件
            function layerClick(e) {
                var graphic = e.graphic;
                var mapPoint = graphic.geometry;
                var attributes = graphic.attributes;
                var name = attributes["p_name"];
                var infoWidth = 550;
                var infoHeight = 400;
                infoWidth = popWindowParam.popWidth;
                infoHeight = popWindowParam.popHeight;
                if (layerAttr.lyrType == "online") {
                    infoHeight = 390;
                }
                var param = "";
                if (attributes["p_id"] != null && attributes["p_id"] != undefined && attributes["p_id"] != "") {
                    if (popWindowParam["urlParam"]) {
                        param = popWindowParam["urlParam"][attributes["p_id"]];
                    } else {
                        param = attributes['p_urlParam'];
                    }
                    if (param == null || param == undefined) {
                        param = "";
                    }
                }
                map.infoWindow.resize(infoWidth, infoHeight);
                console.log(mapPoint);
                map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowParam.popWindowUrl + "?lon=" + mapPoint.x + "&lat=" + mapPoint.y + "&id=" + attributes["p_id"] + "&name=" + attributes["p_name"] + param) + "&time=" + attributes["p_urlParam"] + "'/>");
                if (name.length > 30) {
                    var titleName = name.substring(0, 27) + '...';
                    map.infoWindow.setTitle("<font style = 'font-weight:bold' title=" + name + ">" + titleName + "</font>");
                } else {
                    map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + name + "</font>");
                }


                map.infoWindow.show(mapPoint);
            }
            function mouseOverLayer(e) {
                map.setMapCursor("pointer");
                //console.log(e.graphic);
                var font = new esri.symbol.Font();
                font.setSize("10pt");
                font.setFamily("微软雅黑");
                var cpoint = event.graphic.geometry;
                var text = new esri.symbol.TextSymbol(event.graphic.attributes.p_name);
                text.setFont(font);
                text.setColor(new dojo.Color([0, 0, 0, 100]));
                text.setOffset(20, -35);
                var pmsTextBg = new PictureMarkerSymbol();
                pmsTextBg.setOffset(20, -30);
                var textLength = event.graphic.attributes.p_name.length;
                pmsTextBg.setWidth(textLength * 13.5 + 5);
                pmsTextBg.setColor(new esri.Color([255, 255, 0, 0.8]));
                var bgGraphic = new esri.Graphic(cpoint, pmsTextBg);
                map.graphics.add(bgGraphic);
                var labelGraphic = new esri.Graphic(cpoint, text);
                map.graphics.add(labelGraphic);
            };
            function mouseOutLayer() {
                map.graphics.clear();
                map.setMapCursor("default");
            }
        });//require结束(加载点位结束)
    }
};




/**********地图点位加载highcharts柱状图************* */
function loadChartOnMap(divId, Y, N) {
    $(divId).highcharts({
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 0,
                depth: 50,
                viewDistance: 25
            },
            backgroundColor: 'rgba(255,255,255,0)'
        },
        colors: ['#8c93ec', '#56d373'],
        credits: {
            enabled: false
        },
        title: {
            text: ""
        },
        xAxis: {
            //categories: ['本月'],
            //                  categories:[title],
            visible: false,
            crosshair: false,
            labels: {
                style: {
                    color: '#BA222B',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            },
            //                  gridLineColor: '#BA222B',
            //                  lineColor: '#56d373',
            lineWidth: 1
        },
        yAxis: {
            visible: false,
            labels: {
                style: {
                    color: '#BA222B',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            },
            min: 0.1,
            title: {
                text: ''
            },
            //                  lineColor: '#56d373',
            lineWidth: 1
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}:</td><td style="padding:0"><b>{point.y:1f}次</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                depth: 25,
                pointPadding: 5,
                borderWidth: 0,
                pointWidth: 20
            }
        },
        series: [{
            name: '不合格',
            data: Y//[15]
        },
        {
            name: '合格',
            data: N//[30]
        }
        ]
    })
}
/**
 * 关闭地图弹窗
 */
function closeWindow() {
    if (map.infoWindow.isShowing == true) {
        map.infoWindow.hide();
    }
}
/**
 * 展示遥测车历史轨迹
 */
function showCarHistoryTrajectoryOnMap(json) {
    require([
        "esri/geometry/Polyline",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/SimpleLineSymbol"
    ], function (Polyline, Graphic, GraphicLayer, SimpleLineSymbol) {
        var layer = new GraphicLayer({ id: "carHistory" });
        if (layer) {
            layer.clear();
            map.removeLayer(layer);
        }
        var sls = new SimpleLineSymbol();
        sls.setWidth(3);
        sls.setColor("red");
        var jwd = [];

        for (var i = 0; i < json.length; i++) {
            var arr = [];
            arr.push(json[i]["longitude"]);
            arr.push(json[i]["latitude"]);
            jwd.push(arr);
            if (i == 0) {
                console.log(json[i]);
            }
        }
        var polylineJson = {
            "paths": [jwd],
            "spatialReference": { "wkid": 4326 }
        };

        var polyline = new Polyline(polylineJson);
        var graphic = new Graphic(polyline, sls);
        layer.add(graphic);
        map.addLayer(layer);
    });
}

// 判断点是否在地图范围内
function testPonitExsistExtent(lon, lat) {

    var iscontains;

    require(["esri/geometry/Extent", "esri/geometry/Point"], function (Extent, Point) {
        var extent = new esri.geometry.Extent({
            "xmin": 109.430334, "ymin": 31.508164, "xmax": 111.579849, "ymax": 33.27337,
            "spatialReference": { "wkid": 4326 }
        });

        var point = new Point({ "x": lon, "y": lat, "spatialReference": { "wkid": 4326 } });

        iscontains = extent.contains(point);

    });


    return iscontains;


}


/**
 * 判断当前行政区划所属级别
 * @Create 曾国范
 * @Date 2019年4月3日
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
 * 点击地图上的点位，图标放大
 * @param {*} lon 
 * @param {*} lat 
 * @param {*} lvl 
 */
function map_CenterAtAndZoomClickPoints(lon, lat, lvl,type,pkName,isOver) {
    require([
        "esri/geometry/Point"
        , "esri/geometry/Extent"
        , "esri/graphic"
        , "esri/layers/GraphicsLayer"
        , "esri/symbols/PictureMarkerSymbol"
        , "esri/config"
    ], function (Point, Extent, Graphic, GraphicsLayer, PictureMarkerSymbol, config) {
        debugger;
        console.log(pkName);
        if (map.getLayer("GL_HotPoint")) {
            map.removeLayer(map.getLayer("GL_HotPoint"));
        }
        var graphicsLayer = new GraphicsLayer({ id: "GL_HotPoint" });
        var point = new Point(lon, lat, map.spatialReference);
        map.centerAndZoom(point, lvl);
        map.centerAt(point);
        if(isOver=="1"){
            var pointSymbl = PictureMarkerSymbol({ "url": "img/hotpoint/hotpoint.gif", "height": 48, "width": 48, "yoffset": 0, "type": "esriPMS" });
            pointSymbl.setOffset(0, -10);
            var graphic = new Graphic(point, pointSymbl);
            graphicsLayer.add(graphic);
        }
        var imgUrl;
        if(type=="入河排污口"){
            imgUrl = 'img/PKPoints/river.png';
        }else{ //入海排污口
            imgUrl = 'img/PKPoints/sea.png';
        }
        var pointSymbl1 = PictureMarkerSymbol({ "url": imgUrl, "height": 50, "width": 50, "yoffset": 0, "type": "esriPMS" });
        pointSymbl1.setOffset(0, 10);
        var graphic1 = new Graphic(point, pointSymbl1);
        graphicsLayer.add(graphic1);
        map.addLayer(graphicsLayer, 0);
    });
}
/**
 * @Create 曾国范
 * @Date  2019年4月3日
 * 获取行政区划的信息
 */
function getXZQHMsg(regionCode) {
    var paramsS = 'regionParentCode=000000000000';
    $.get("../../proxy/httpurl_n.ashx", { url: 'http://10.103.27.117:8080/region/queryRegionCode', params: paramsS }, function (result) {
        debugger;
        if (result == "") { return; }
        var xzqhArr = eval('(' + result + ')');
    })
}


/**
 *地图点位点击的弹-点位基本信息
 * @param {*} companyName 
 * @param {*} enterID 
 */
function setLegendLayer(companyName, enterID) {
    var area = ["900px", "600px"];
    var myOffset = ["200px", "200px"];
    //layer.clear();
    layer.open({
        type: 2,
        id: "basicmessage_"+Math.round(Math.random()*1000),
        fixed: false,    //取消固定定位，因为固定定位是相对body的
        title: ['&nbsp;&nbsp;&nbsp;<span style="display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;height: 30px;" title="' + companyName + '">' + companyName, '</span>height:40px;line-height:40px;color:#fff'],
        area: area,
        offset: myOffset,
        shade: 0,
        // fhn 替换空间信息-  企业点位信息弹窗
        //content: ['panel/custooms/custooms.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        content: ['panel/spatial/Enterprise.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        closeBtn: 1,
        btn1: function (index, layero) {//点击查询按钮的回调
            layer.close(index);
        },
        maxmin: true,
        success: function () {

        },
        cancel: function (index, layero) {
            // var layerG = map.getLayer(enterpriseLayerId);
            // if (layerG) {
            //     layerG.clear();
            // }
            // goto_page1(); //跳转第一层页面
            // addHotPoint([{ longitude: entPointLon, latitude: entPointLat }]);
            // if (isAssociatedMinerals) {
            //     getAssociatedMineralsData();
            // } else {
            //     $("#addloading").show();
            // }
            // var pageLoading = layer.load(1, { shade: 0.2 }); //换了种风格

            // //除去查询县区点
            // zoomToSelectEnterpriseExtent(entPointUnid);
            // layer.close(pageLoading);
        }
    })

}

/**
 * 空间信息和点位信息
 * @param {*} companyName 
 * @param {*} enterID 
 */
function setLegendLayerSpaceAndPoint(companyName, enterID) {
 //   $('#layui-layer1').hidden;
    $('#layui-layer1').hide();
    var area = ["380px", "500px"];
    var clientHeight = $(window).height();
    var myOffset = [clientHeight - 500 + "px", $(".map-left-list").width() + "px"];
   // layer.clear();
    layer.open({
        type: 2,
        id: "spaceInfo_"+Math.round(Math.random()*1000),
        fixed: false,    //取消固定定位，因为固定定位是相对body的
        title: ['&nbsp;&nbsp;&nbsp;<span style="display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;height: 30px;" title="' + companyName + '">' + companyName, '</span>height:40px;line-height:40px;color:#fff'],
        area: area,
        offset: myOffset,
        shade: 0,
        // fhn 替换空间信息-  企业点位信息弹窗
        content: ['panel/spatial/spatial.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
     //   content: ['panel/spatial/Enterprise.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        closeBtn: 1,
        btn1: function (index, layero) {//点击查询按钮的回调
            layer.close(index);
        },
        maxmin: true,
        success: function () {
        
        },
        cancel: function (index, layero) {
            map_CenterAtAndZoom(113.536851,34.803488,11);
            endShowPoints('410102000000', 'all');

            // var layerG = map.getLayer(enterpriseLayerId);
            // if (layerG) {
            //     layerG.clear();
            // }
            // goto_page1(); //跳转第一层页面
            // addHotPoint([{ longitude: entPointLon, latitude: entPointLat }]);
            // if (isAssociatedMinerals) {
            //     getAssociatedMineralsData();
            // } else {
            //     $("#addloading").show();
            // }
            // var pageLoading = layer.load(1, { shade: 0.2 }); //换了种风格

            // //除去查询县区点
            // zoomToSelectEnterpriseExtent(entPointUnid);
            // layer.close(pageLoading);
        }
    })
}

/**
 *地图点位点击的弹-点位基本信息
 * @param {*} companyName 
 * @param {*} enterID 
 */
function   reportMsg(companyName, enterID) {
    var area = ["900px", "600px"];
    var myOffset = ["200px", "200px"];
   // layer.clear();
    layer.open({
        type: 2,
        id: "report_"+Math.round(Math.random()*1000),
        fixed: false,    //取消固定定位，因为固定定位是相对body的
        title: ['&nbsp;&nbsp;&nbsp;<span style="display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;height: 30px;" title="' + companyName + '">' + companyName, '</span>height:40px;line-height:40px;color:#fff'],
        area: area,
        offset: myOffset,
        shade: 0,
        // fhn 替换空间信息-  企业点位信息弹窗
        //content: ['panel/custooms/custooms.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        content: ['panel/spatial/Report.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        closeBtn: 1,
        btn1: function (index, layero) {//点击查询按钮的回调
            layer.close(index);
        },
        maxmin: true,
        success: function () {

        },
        cancel: function (index, layero) {
            // var layerG = map.getLayer(enterpriseLayerId);
            // if (layerG) {
            //     layerG.clear();
            // }
            // goto_page1(); //跳转第一层页面
            // addHotPoint([{ longitude: entPointLon, latitude: entPointLat }]);
            // if (isAssociatedMinerals) {
            //     getAssociatedMineralsData();
            // } else {
            //     $("#addloading").show();
            // }
            // var pageLoading = layer.load(1, { shade: 0.2 }); //换了种风格

            // //除去查询县区点
            // zoomToSelectEnterpriseExtent(entPointUnid);
            // layer.close(pageLoading);
        }
    })

}


/**
 * water
 * @param {*} companyName 
 * @param {*} enterID 
 */
function   spaceClickNew_water(companyName, enterID) {
    var isOpen = $('#menuJump')['0'].style.left.replace('px', '').trim();
    var area = ["550px", "350px"];
    var clientHeight = $(window).height();
    var clientWidth = $(window).width();
    var myOffset = [clientHeight - 400 + "px", "0px"];
    if (isOpen) {
        myOffset = [clientHeight - 400 + "px", "486px"];
    }
  //  layer.clear();

    layer.open({
        type: 2,
        id: "water",
        fixed: false,    //取消固定定位，因为固定定位是相对body的
        title: ['&nbsp;&nbsp;&nbsp;<span style="display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;height: 30px;" title="' + companyName + '">废水排口:2#废水排口','</span>height:40px;line-height:40px;color:#fff'],
        area: area,
        offset: myOffset,
        shade: 0,
        // fhn 替换空间信息-  企业点位信息弹窗
        //content: ['panel/custooms/custooms.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        content: ['panel/spatial/spatialWater.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        closeBtn: 1,
        btn1: function (index, layero) {//点击查询按钮的回调
            layer.close(index);
        },
        maxmin: true,
        success: function () {

        },
        cancel: function (index, layero) {
            // var layerG = map.getLayer(enterpriseLayerId);
            // if (layerG) {
            //     layerG.clear();
            // }
            // goto_page1(); //跳转第一层页面
            // addHotPoint([{ longitude: entPointLon, latitude: entPointLat }]);
            // if (isAssociatedMinerals) {
            //     getAssociatedMineralsData();
            // } else {
            //     $("#addloading").show();
            // }
            // var pageLoading = layer.load(1, { shade: 0.2 }); //换了种风格

            // //除去查询县区点
            // zoomToSelectEnterpriseExtent(entPointUnid);
            // layer.close(pageLoading);
        }
    })

}

/**
 * gas
 * @param {*} companyName 
 * @param {*} enterID 
 */
function   spaceClickNew_gas(companyName, enterID) {
    var isOpen = $('#menuJump')['0'].style.left.replace('px', '').trim();
    var area = ["550px", "350px"];
    var clientHeight = $(window).height();
    var clientWidth = $(window).width();
    var myOffset = [clientHeight - 400 + "px", "0px"];
    if (isOpen) {
        myOffset = [clientHeight - 400 + "px", "486px"];
    }
  //  layer.clear();

    layer.open({
        type: 2,
        id: "gas",
        fixed: false,    //取消固定定位，因为固定定位是相对body的
        title: ['&nbsp;&nbsp;&nbsp;<span style="display: inline-block;width: 270px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 40px;height: 30px;" title="' + companyName + '">废气排口:1#烟卤','</span>height:40px;line-height:40px;color:#fff'],
        area: area,
        offset: myOffset,
        shade: 0,
        // fhn 替换空间信息-  企业点位信息弹窗
        //content: ['panel/custooms/custooms.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        content: ['panel/spatial/spatialGas.html?companyName=' + companyName + '&enterID=' + enterID],     // 第二个参数为是否显示滚动条
        closeBtn: 1,
        btn1: function (index, layero) {//点击查询按钮的回调
            layer.close(index);
        },
        maxmin: true,
        success: function () {

        },
        cancel: function (index, layero) {
            // var layerG = map.getLayer(enterpriseLayerId);
            // if (layerG) {
            //     layerG.clear();
            // }
            // goto_page1(); //跳转第一层页面
            // addHotPoint([{ longitude: entPointLon, latitude: entPointLat }]);
            // if (isAssociatedMinerals) {
            //     getAssociatedMineralsData();
            // } else {
            //     $("#addloading").show();
            // }
            // var pageLoading = layer.load(1, { shade: 0.2 }); //换了种风格

            // //除去查询县区点
            // zoomToSelectEnterpriseExtent(entPointUnid);
            // layer.close(pageLoading);
        }
    })

}

