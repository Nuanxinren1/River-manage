var clusterLayer;

//主界面中需要为ClusterLayer.js文件设置路径，如路径改变请更改引用

var ClusterLyr = {
    createClusterLayer: function (type, datatype, pointArr, popWindowParam) {
        require(["esri/dijit/PopupTemplate"
            , "esri/renderers/ClassBreaksRenderer"
            , "esri/symbols/PictureMarkerSymbol"
            , "esri/symbols/SimpleMarkerSymbol"
            , "widgets/ClusterLayer"],
            function (PopupTemplate, ClassBreaksRenderer, PictureMarkerSymbol, SimpleMarkerSymbol, ClusterLayer) {

                var popupTemplate = new PopupTemplate({
                    "title": "",
                    "fieldInfos": [{
                        "fieldName": "Caption",
                        visible: true
                    }, {
                        "fieldName": "Name",
                        "label": "By",
                        visible: true
                    }, {
                        "fieldName": "Link",
                        "label": "On Instagram",
                        visible: true
                    }],
                    "mediaInfos": [{
                        "title": "",
                        "caption": "",
                        "type": "image",
                        "value": {
                            "sourceURL": "{Image}",
                            "linkURL": "{Link}"
                        }
                    }]
                });
                clusterLayer = new ClusterLayer({
                    "data": pointArr,
                    "distance": 70,
                    "id": "GL_ClusterLayer_" + datatype,
                    "labelColor": "#fff",
                    "labelOffset": 10,
                    "resolution": map.extent.getWidth() / map.width,
                    "singleColor": "#888",
                    "singleTemplate": popupTemplate,
                    "spatialReference": map.spatialReference
                });

                if (type == "1") {
                    var defaultSym = new SimpleMarkerSymbol().setSize(4);
                    var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
                    var picBaseUrl = "IMG/points/polluterGeneral/juhe/";
                    var alone = new PictureMarkerSymbol(picBaseUrl + "clusterLayerBlueAlone.png", 20, 20).setOffset(0, 10);
                    var blue = new PictureMarkerSymbol(picBaseUrl + "clusterLayerGreen.png", 30, 30).setOffset(0, 10);
                    var red = new PictureMarkerSymbol(picBaseUrl + "clusterLayerRed.png", 45, 45).setOffset(0, 10);
                    var D_red = new PictureMarkerSymbol(picBaseUrl + "clusterLayerD-red.png", 60, 60).setOffset(1, 6);
                    renderer.addBreak(0, 1, alone)
                    renderer.addBreak(2, 3, blue);
                    renderer.addBreak(3, 99, red);
                    renderer.addBreak(99, 20001, D_red);
                    //加载图层
                    clusterLayer.setRenderer(renderer);
                    map.addLayer(clusterLayer, 50);
                    clusterLayer.setVisibility(true);
                    clusterLayer.on("click", clusterLayerClick);
                }
                //聚合图层的点击事件
                function clusterLayerClick(e) {
                    map.infoWindow.hide();
                    var graphic = e.graphic;
                    if (clusterLayer._singles && clusterLayer._singles.length == 1) {
                        graphic = clusterLayer._singles[0];
                    }
                    else {
                        map.infoWindow.hide();
                    }

                    if (e.graphic.attributes.clusterCount && e.graphic.attributes.clusterCount > 1) {
                        for (var i = 0; i < clusterLayer.graphics.length; i++) {
                            if (clusterLayer.graphics[i].geometry.x == e.graphic.geometry.x && clusterLayer.graphics[i].geometry.y == e.graphic.geometry.y) {
                                clusterLayer.graphics[i].hide();
                            } else {
                                clusterLayer.graphics[i].show();
                            }
                        }
                    }

                    var mapPoint = graphic.geometry;
                    var attributes = graphic.attributes;
                    var name = attributes["p_name"];
                    var infoWidth = 550;
                    var infoHeight = 400;
                    infoWidth = popWindowParam.popWidth;
                    infoHeight = popWindowParam.popHeight;

                    var param = "";
                    if (attributes["p_id"] != null && attributes["p_id"] != undefined && attributes["p_id"] != "") {
                        param = popWindowParam["urlParam"][attributes["p_id"]];
                        if (param == null || param == undefined) {
                            param = "";
                        }
                    }
                    if (attributes["p_id"] == null && param == "") {
                        //不是单点不显示infoWindow
                        return;
                    }
                    map.infoWindow.resize(infoWidth, infoHeight);
                    map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowParam.popWindowUrl + "?lon=" + mapPoint.x + "&lat=" + mapPoint.y + "&id=" + attributes["p_id"] + "&name=" + attributes["p_name"] + param) + "'/>");
                    map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + name + "</font>");
                    map.infoWindow.show(mapPoint);



                    //if (e.graphic.attributes.clusterCount) {
                    //    for (var i = 0; i < clusterLayer.graphics.length; i++) {
                    //        if (clusterLayer.graphics[i].geometry.x == e.graphic.geometry.x && clusterLayer.graphics[i].geometry.y == e.graphic.geometry.y) {
                    //            clusterLayer.graphics[i].hide();
                    //        } else {
                    //            clusterLayer.graphics[i].show();
                    //        }
                    //    }
                    //    var graphic = e.graphic;
                    //    var mapPoint = graphic.geometry;
                    //    var attributes = graphic.attributes;
                    //    var numE = attributes["clusterCount"];
                    //    map.infoWindow.resize(200, 100);
                    //    map.infoWindow.setContent("");
                    //    map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + numE + "个企业</font>");
                    //    map.infoWindow.show(mapPoint);
                    //}
                    //else {
                    //    var graphic = e.graphic;
                    //    var mapPoint = graphic.geometry;
                    //    var attributes = graphic.attributes;
                    //    var numE = attributes["title"];
                    //    if (!numE) { return; }
                    //    map.infoWindow.resize(200, 100);
                    //    map.infoWindow.setContent("");
                    //    map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + numE + "</font>");
                    //    map.infoWindow.show(mapPoint);
                    //}
                    //return;
                }
            });
    },
    //点位聚合展示
    pointCluster: function (datatype, data) {
        map.infoWindow.hide();
        drawGraphicsLayer.setVisibility(!data);
        var clusterLayer = map.getLayer("GL_ClusterLayer_" + datatype);
        if (clusterLayer) {
            clusterLayer.setVisibility(data);
        }
    }
}

