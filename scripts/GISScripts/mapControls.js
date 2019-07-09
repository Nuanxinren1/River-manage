/**
 * 包括图层的添加和图层的空间查询和敏感点查询
 */
var mapControls={
    /**
     * 添加FeatureLayer
     * @param {*} ztName 图层的ID
     * @param {*} url  图层的url
     */
    AddFeatureLayer:function(ztName,url){
        var layerurl=url;
        if(ztName=="pointClickRiver"){
            layerurl=url+"/0";
        }
        mugis.mapClear.holdLayers([]);
        require(['esri/InfoTemplate', 'esri/layers/FeatureLayer'], function (InfoTemplate, FeatureLayer) {
            var filllayer = new FeatureLayer(layerurl, {
                showLabels: true,
                outFields: ['*'],
                id: ztName,
                mode: FeatureLayer.MODE_ONDEMAND
            });
            map.addLayer(filllayer);
            filllayer.setOpacity(0.5);
            if(ztName=="pointClickRiver"){
                filllayer.on('click',function(){
                    alert('111111111112121');
                    $('#mapMainSearch').hide();
                    $("#pointClickMsg iframe").hide();     
                    $("#companyListNew iframe").show();     
                    window.dialog = $("#companyListNew").clone().dialog({
                        title: "标题",
                        width : '330',
                        height : 600,
                        modal : true
                    });
                    $("iframe",dialog).attr("frameborder","0");
                    $("iframe",dialog).attr("height","100%");
                    $("iframe",dialog).attr("width","330px");
                    $("iframe",dialog).attr("src","sewageDetail.html"); 
                })
            }
           
        })
    },
/**
 * 添加DynamicMapServerLayer
 * @param {*} ztName  图层的ID
 * @param {*} url  图层的地址
 */
DynamicLayerAdd:function (ztName,url) {
  //  mugis.mapClear.holdLayers([]);
    require([
        "esri/layers/ArcGISDynamicMapServiceLayer"
    ], function (ArcGISDynamicMapServiceLayer) {
        var layer = new ArcGISDynamicMapServiceLayer(
            url, {
                useMapImage: true,
                id: ztName
            }
        );
        map.addLayer(layer);
        if(ztName=="QG_region_border"){
            layer.setVisibleLayers([2]);
        } else if(ztName=="RowmouthCZ"){
            layer.show();
            layer.setOpacity(0.5);
        }
         else if(ztName=="pointClickRiver"){
            layer.show();
            layer.on('click',function(evt){
                 
            });
        }
        else{
            layer.show();
        }
    })
},
zoomToRiverExtent: function (featuerName, featureCode, popWindowUrl) { //单个河流定位
    require([
        "esri/tasks/query",
        "esri/tasks/QueryTask"
    ], function (Query, QueryTask) {
        var query = new Query();
        query.returnGeometry = true;
    //    query.where = "NAME='" + featuerName + "'";
        query.where = "1=1";
        var queryTask = new QueryTask(mapconfig.pointClickRiver + "/0", {});
        queryTask.execute(query, queryRes, queryError);
        function queryRes(res) {
            alert('1');
            if (res.features.length > 0) {
                var feature = res.features[0];
                var geo = feature.geometry;
                var extent = geo.getExtent();
                map.setExtent(extent);
                var riverPoint = geo.getPoint(0, geo.paths[0].length / 2);
                var infoWidth = 400;
                var infoHeight = 400;
                map.infoWindow.resize(infoWidth, infoHeight);
                map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowUrl + "?riverCode=" + featureCode + "&name=" + featuerName) + "'/>");
                map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + featuerName + "</font>");
                map.infoWindow.show(riverPoint);
            } else {
                alert("未找到相应的河流信息！");
            }
        }
        function queryError(err) {
            alert(err);
        }
    });
},



/**
 * 获取某一点位扇形范围内的点的个数，不是敏感点
 * @param {*} paramObject 
 * @param {*} radiusText  半径
 * @param {*} startAngleText   开始角度
 * @param {*} endAngleText   结束角度
 */
onLinepointSpaceSearch:  function (paramObject, radiusText, startAngleText, endAngleText) {
    //每一次加载新的敏感点的时候需要先清除上一次加载的敏感点
    var layerIds = mapinfo.map.graphicsLayerIds; console.log(layerIds);
    for (var i = 0; i < layerIds.length; i++) {
        if (layerIds[i].search("GL_Widgets_Buffer") != -1) {
            var layer = map.getLayer(layerIds[i]);
            layer.clear();
            map.removeLayer(layer);
        } else {
            continue;
        }
    }    
	require(["esri/graphic","esri/symbols/SimpleFillSymbol", 
	"esri/geometry/Circle", "esri/geometry/Polygon",
	"esri/symbols/SimpleLineSymbol", "esri/layers/GraphicsLayer"],
	 function (Graphic,SimpleFillSymbol, Circle, Polygon,SimpleLineSymbol,GraphicsLayer) {
        var searchGeometry;
        //判断范围是否是默认地范围
        if (Number(endAngleText) - Number(startAngleText) == 360) {//默认范围
             searchGeometry = new Circle([Number(paramObject.jd), Number(paramObject.wd)], {
                "radius": Number(radiusText)    //单位是米
            });
        } else {//角度范围，非360度
            var apoint1 = getPoints([Number(paramObject.jd), Number(paramObject.wd)], Number(radiusText)/100000, Number(startAngleText), Number(endAngleText), 180);
            console.log(apoint1);
            searchGeometry = new Polygon(apoint1);
		}
		var polygonSymbol = new SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.95]), 2), new dojo.Color([185, 180, 180, 0.45]));
		var searchgraphic=new Graphic(searchGeometry,polygonSymbol);
		var glayer=new GraphicsLayer({id:'GL_Widgets_Buffer_online'});
		glayer.add(searchgraphic);
		map.addLayer(glayer);
        //获取选中状态的类别
        var layernames = [];
        $("#iframe_infowindow").contents().find('input[name="onlineCompany"]:checked').each(function (inex, element) {
            layernames.push(this.value);
        })
        var layerList = [];
        for (var key in mapconfig.hotLayerList) {
            for (var i = 0; i < layernames.length; i++) {
                var layername = layernames[i];
                if (layername == mapconfig.hotLayerList[key]['name']) {
                    layerList.push(mapconfig.hotLayerList[key]);
                };
            }
        }
        var geomStr = '';
        for (var i = 0; i < searchGeometry.rings[0].length; i++) {
            var p = searchGeometry.rings[0][i];
            p = Vector2DMercator2lonLat(p[0], p[1]);
            geomStr += p[0] + ' ' + p[1] + ',';
        }
        //空间图层查询
        require(["dojo/dom", "widgets/Query"], function (dom, Query) {
            var query1 = new widgets.Query({ map: map, layerUrlArr: layerList, callback: addBufferResult });
            query1.query(searchGeometry);
        });
    });
},
/**
 * 获取扇形区域内的点的坐标信息
 * @param {*} center 
 * @param {*} radius 
 * @param {*} startAngle 
 * @param {*} endAngle 
 * @param {*} pointNum 
 */
getPoints:function (center, radius, startAngle, endAngle,pointNum) {
    var sin;
    var cos;
    var x;
    var y;
    var angle;
    var points = new Array();
    points.push(center);
    for ( var i = 0; i <= pointNum; i++) {
        angle = startAngle + (endAngle - startAngle) * i
                / pointNum;
        sin = Math.sin(angle * Math.PI / 180);
        cos = Math.cos(angle * Math.PI / 180);
        x = center[0] + radius * sin;
        y = center[1] + radius * cos;
        points[i] = [ x, y ];
    }
    var point = points;
    point.push(center);
    return point;
},
/**
 * 敏感点查询，需要调整，具体视情况修改
 * @param {*} paramObject 
 * @param {*} distance 
 * @param {*} unit 
 */
pointSpaceSearch :function pointSpaceSearch(paramObject, distance, unit) {
    searchResulutByKind = {};//每次查询前上次的查询结果置空
    require(["esri/graphic","esri/symbols/SimpleFillSymbol", 
	"esri/geometry/Circle", "esri/geometry/Polygon",
	"esri/symbols/SimpleLineSymbol", "esri/layers/GraphicsLayer"],
	 function (Graphic,SimpleFillSymbol, Circle, Polygon,SimpleLineSymbol,GraphicsLayer) {
    
        var searchGeometry = new Circle([Number(paramObject.lon),Number( paramObject.lat)], {
            "radius": Number(distance)*1000
		});   
		var polygonSymbol = new SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.95]), 2), new dojo.Color([185, 180, 180, 0.45]));
		var searchgraphic=new Graphic(searchGeometry,polygonSymbol);
		var glayer=new GraphicsLayer({id:'GL_Widgets_Buffer_pointpanel'});
		glayer.add(searchgraphic);
		map.addLayer(glayer);
		
        //获取选中状态的类别
        var layernames = [];
        $("#iframe_infowindow").contents().find('input[name="layer2"]:checked,input[name="POI"]:checked').each(function (inex, element) {
            layernames.push(this.value);
        })
        var layerList = [];
        for (var key in mapconfig.hotLayerList) {
            for (var i = 0; i < layernames.length; i++) {
                var layername = layernames[i];
                if (layername == mapconfig.hotLayerList[key]['name']) {
                    layerList.push(mapconfig.hotLayerList[key]);
                };
            }
        }
        var geomStr = '';
        for (var i = 0; i < searchGeometry.rings[0].length; i++) {
            var p = searchGeometry.rings[0][i];
           // p = Vector2DMercator2lonLat(p[0], p[1]);
            geomStr += p[0] + ' ' + p[1] + ',';
        }

        if ($.inArray('ent', layernames)<-1) {//没有先选择污染源，直接空间查询
            //空间图层查询
            require(["dojo/dom", "widgets/Query"], function (dom, Query) {
                var query1 = new widgets.Query({ map: map, layerUrlArr: layerList, callback: addBufferResult });
                query1.query(searchGeometry);
            });
        } else {
            //数据库查询
            $.post(config.basePathApp + 'getGeom', { param: 'geom=((' + geomStr.substr(0, geomStr.length - 1) + '))' }, function (results) {
                try {
                    var json = JSON.parse(results);
                    $('input[name="POI"]:checked').each(function (inex, element) {
                        //添加至全局变量
                        searchResulutByKind[this.value] = json[this.value];
                    })
                    //添加至图层GL_Widgets_Buffer_point1
                    var glayer = new GraphicsLayer({ id: 'GL_Widgets_Buffer_point1' })
                    map.addLayer(glayer);

                    for (var key in searchResulutByKind) {
                        var jsonArr = searchResulutByKind[key];
                        for (var i = 0; i < jsonArr.length; i++) {
                            var element = jsonArr[i];
                            var piurl = 'img/spacesearch/' + key + '.png'
                            var picSymbol = esri.symbol.PictureMarkerSymbol({ "url": piurl, "height": 13, "width": 13, "yoffset": 0, "type": "esriPMS" });
                            var point = new Point(element['longitude'], element['latitude']);
                            var graphic = new Graphic(point, picSymbol, element);

                            glayer.add(graphic);
                        }
                    }
                    if (layerList.length == 0) {
                        addBufferResult(searchResulutByKind);
                    }

                } catch (e) {
                    console.log(e.message)
                } finally {
                    if (layerList.length > 0) {
                        //空间图层查询
                        require(["dojo/dom", "widgets/Query"], function (dom, Query) {
                            var query1 = new widgets.Query({ map: map, layerUrlArr: layerList, callback: addBufferResult });
                            query1.query(searchGeometry);
                        });
                    }

                }
                //addBufferResult(json);
            })

        }
    });
},
/**
 * 将54坐标转换为84坐标
 * @param {*} value 
 */
getLonLatFrom:function getLonLatFrom(value) {
    var d = value.split("°")[0];

    var f = value.split("°")[1].split("′")[0];

    var m = value.split("°")[1].split("′")[1].split('″')[0];

    //计算经纬度
    var f = parseFloat(f) + parseFloat(m / 60);
    var du = parseFloat(f / 60) + parseFloat(d);
    return du;
  //  document.getElementById("calculated_du").innerHTML = du;
},
/**
 * 缓存分析绘制圆圈
 * @param {*} paramObject 
 * @param {*} distance 
 * @param {*} unit 
 */
hcFxHzhiCircle :function pointSpaceSearch(paramObject, distance, unit) {
    searchResulutByKind = {};//每次查询前上次的查询结果置空
    require(["esri/graphic","esri/symbols/SimpleFillSymbol", 
	"esri/geometry/Circle", "esri/geometry/Polygon",
	"esri/symbols/SimpleLineSymbol", "esri/layers/GraphicsLayer",      "esri/geometry/Point"],
	 function (Graphic,SimpleFillSymbol, Circle, Polygon,SimpleLineSymbol,GraphicsLayer,Point) {
    
        var searchGeometry = new Circle([Number(paramObject.lon),Number( paramObject.lat)], {
            "radius": Number(distance)*1000
		});   
		var polygonSymbol = new SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.95]), 2), new dojo.Color([185, 180, 180, 0.45]));
        var searchgraphic=new Graphic(searchGeometry,polygonSymbol);
        if(map.getLayer("GL_Widgets_Buffer_pointpanel")){
           map.removeLayer(map.getLayer("GL_Widgets_Buffer_pointpanel"));
        }
		var glayer=new GraphicsLayer({id:'GL_Widgets_Buffer_pointpanel'});
		glayer.add(searchgraphic);
        map.addLayer(glayer);
     var   pointsHcMsg=[];
     for(var z=0;z<companyMsg_cq.length;z++){
        // debugger;
        var   point = new Point(companyMsg_cq[z]["LONGITUDE"], companyMsg_cq[z]["LATITUDE"], map.spatialReference);
        if (searchGeometry.contains(point)) {
            pointsHcMsg.push(companyMsg_cq[z]);
        }
     }
     Sensitive_point(pointsHcMsg);
    });
},
}