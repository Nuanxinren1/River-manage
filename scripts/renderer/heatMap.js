//热力图层
var heatMapLayer;

//方法一 调用查询到数据后再渲染
var HeatMap = {
    //创建热力图
    //各参数：
    //dataType       必填，区分热力图图层
    //data           必填，第一种：图层数据，lon(x，经度)，lat(y，纬度)，attribute(点位所有属性字段，需热力图展示的关键字段)
    //                     第二种：图层服务地址     
    //field          必填，关键字段
    //heatMapConfig  可选，类型为对象，包括：
    //               heatmapRenderer.blurRadius           设置圆点半径                                     默认 10
    //               heatMapConfig.maxPixelIntensity      最大像素强度 0-255                               默认 100
    //               heatMapConfig.minPixelIntensity      最小像素强度 0-255                               默认 0
    //               setColorStops                   设置:比例（ratio）                值域：0 - 1
    //                                                    颜色（color）                值域：（0 - 255,0 - 255,0 - 255）
    //                                                    透明度（transparency）       值域：0 - 1
    //                                                    前二者必须设置，且一一对应,transparency可选设置
    //                                                    第一个ratio和transparency默认设置为0
    //                                                    不设置transparency时，除第一个外其余默认为1
    //                                                    设置transparency的个数少于ratio和color的个数时，其余部分默认为1
    //                                                    设置transparency的个数多于ratio和color的个数时，多余部分无效
    //
    //例: HeatMap.createHeatMap("polluter", pointArr, "lat", {
    //        blurRadius: 15,
    //        colorStops: {
    //            ratio: [0, 0.2, 0.3, 0.4, 0.5],//0-1
    //            color: ["0,0,255", "0, 0, 255", "0, 255, 0", "255,0,0", "255,255,255"],
    //            transparency: [0, 1, 1, 1],//0-1
    //        },
    //        maxPixelIntensity: 50,
    //        minPixelIntensity: 50,
    //    });

    createHeatMap: function (dataType, data, field, heatMapConfig) {
        require([
            "esri/geometry/Point",
            "esri/graphic",
            "esri/Color",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/SpatialReference",
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "dojo/domReady!"],
        function (Point, Graphic, Color, SimpleMarkerSymbol, SimpleLineSymbol, SpatialReference, Query, QueryTask) {
            heatMapLayer = map.getLayer("GL_HeatLayer_" + dataType); //hFeatureLayer
            if (Array.isArray(data)) {
                if (heatMapLayer) {
                    heatMapLayer.clear();//清除  
                }
                else {
                    heatMapLayer = HeatMap.createHeatMapFeaLayer(dataType, field);

                    map.addLayer(heatMapLayer, 50);
                }
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var attribute = item.attributes;
                    //if (attribute[field] == "") attribute[field] = Math.random() * 8 + 20;
                    //if (item.x == "") item.x = Math.random() * 8 + 20;
                    //if (item.y == "") item.y = Math.random() * 8 + 100
                    var currentItem = {
                        ID: attribute[field],
                        X: item.x,
                        Y: item.y
                    };
                    var pt = new Point(item.x, item.y, map.spatialReference);
                    var sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                  new Color([255, 0, 0]), 1),
                                  new Color([0, 255, 0, 0.25]));
                    var g = new Graphic(pt, sms, currentItem, null);
                    heatMapLayer.add(g);
                }
                HeatMap.createHeatmapRenderer(field, heatMapConfig);
            }
            else {
                if (heatMapLayer) {
                    heatMapLayer.clear();//清除  
                }
                else {
                    var query = new esri.tasks.Query();
                    //需要返回Geometry
                    query.returnGeometry = true;
                    //需要返回的字段
                    query.outFields = ["*"];
                    //查询条件
                    query.where = "1=1";
                    var queryTask = new QueryTask(data);
                    queryTask.execute(query, showResults);
                    function showResults(results) {
                        heatMapLayer = HeatMap.createHeatMapFeaLayer(dataType, field, results);
                        HeatMap.createHeatmapRenderer(field, heatMapConfig);
                        map.addLayer(heatMapLayer, 100);
                    }
                }
            }
        })
    },

    //创建热力图渲染器
    //field            必填，关键字段
    //heatMapConfig    必填，热力图参数
    createHeatmapRenderer: function (field, heatMapConfig) {
        require([
            "esri/renderers/HeatmapRenderer",
            "esri/layers/FeatureLayer",
            "dojo/domReady!"],
        function (HeatmapRenderer, FeatureLayer) {
            //创建
            var heatmapRenderer = new HeatmapRenderer();
            if (heatMapConfig) {
                //权重字段
                //if (heatMapConfig.field)
                //heatmapRenderer.setField(field);
                //设置圆点半径
                if (heatMapConfig.blurRadius) heatmapRenderer.setBlurRadius(heatMapConfig.blurRadius);
                //颜色设置
                if (heatMapConfig.colorStops) {
                    var colorStops = heatMapConfig.colorStops;
                    var setColorStopsParam = SetColorStops(colorStops);
                    heatmapRenderer.setColorStops(setColorStopsParam);
                } else {
                    heatmapRenderer.setColorStops([
                                            { ratio: 0, color: "rgba(0, 0, 255,0)" },
                                            { ratio: 0.1, color: "rgba(0, 0, 255,0)" },
                                            { ratio: 0.2, color: "rgba(0, 255, 0,0)" },
                                            { ratio: 0.9, color: "rgba(255, 0, 0,0)" }
                    ]);
                }
                //颜色最高值设置（最大像素强度）
                if (heatMapConfig.maxPixelIntensity) heatmapRenderer.setMaxPixelIntensity(heatMapConfig.maxPixelIntensity);
                //颜色最低值设置（最小像素强度）
                if (heatMapConfig.minPixelIntensity) heatmapRenderer.setMaxPixelIntensity(heatMapConfig.minPixelIntensity);
                //颜色
            }
            heatMapLayer.setRenderer(heatmapRenderer);
        });
        //动态设置setColorStops
        function SetColorStops(colorStops) {
            var colorStopsArr = new Array();
            var ratio = colorStops.ratio;
            var color = colorStops.color;
            var transparency = colorStops.transparency;
            for (var i = 0; i < ratio.length; i++) {
                if (i == 0) {
                    colorStopsArr.push({ ratio: ratio[i], color: "rgba(" + color[i] + ",0)" });
                } else {
                    if (judgeArr(transparency, transparency[i])) {
                        colorStopsArr.push({ ratio: ratio[i], color: "rgba(" + color[i] + "," + transparency[i] + ")" });
                    } else {
                        colorStopsArr.push({ ratio: ratio[i], color: "rgba(" + color[i] + ")" });
                    }
                }
            }
            return colorStopsArr;
            //判断是否为数组里的值
            function judgeArr(arr, element) {

                for (var i = 0; i < arr.length; i++) {

                    if (arr[i] == element) {

                        return true;

                    }

                } return false;

            }
        }
    },

    //创建热力图FeatureLayer
    //dataType   必填，区分热力图图层
    //field      必填，关键字段
    createHeatMapFeaLayer: function (dataType, field, results) {
        var hFeatureLayer;
        require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
            var layerDefinition = {
                "geometryType": "esriGeometryPoint",
                "fields": [{
                    "name": field,//ID
                    "type": "esriFieldTypeOID",
                    "alias": field//ID
                }]
            };
            var featureCollection;
            if (results) {
                featureCollection = {
                    layerDefinition: layerDefinition,
                    featureSet: results
                };
            }
            else {
                featureCollection = {
                    layerDefinition: layerDefinition,
                    featureSet: null
                };
            }
            hFeatureLayer = new FeatureLayer(featureCollection, {
                id: "GL_HeatLayer_" + dataType,
                //mode: FeatureLayer.MODE_ONDEMAND
                mode: FeatureLayer.MODE_SNAPSHOT
            });
        });
        return hFeatureLayer;
    },

    //删除热力图
    //dataType   必填，区分热力图图层
    deleteHeatMap: function (dataType) {
        var heatMapLayer = map.getLayer("GL_HeatLayer_" + dataType);
        if (heatMapLayer) {
            heatMapLayer.clear();//清除  
        }
    },

    //控制热力图显示/隐藏
    //dataType   必填，区分热力图图层
    //control    true/false  默认为true
    controlHeatMap: function (dataType, data) {
        var heatMapLayer = map.getLayer("GL_HeatLayer_" + dataType);
        //if (!control) control = true;
        //if (data) {
        //    drawGraphicsLayer.setVisibility(!data);
        //    clusterLayer.setVisibility(!data);
        //}
        heatMapLayer.setVisibility(data);
    },
}

//方法二  调用地图FeatureServer服务，构造Featurelayer来渲染（需先发布FeatureServer服务）