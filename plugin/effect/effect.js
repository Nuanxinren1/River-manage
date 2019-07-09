function ArcgisMapVisual(map, data, option) {
	var layer;
    switch (option.id) {
        case "densePoint"://瀵嗛泦鏁版嵁鐐瑰垎甯冨浘
            layer = new DensePoints(map, data, option);
            break;
        case "barChart"://鏌辩姸鍥�
            layer = new BarChartMap(map, data, option);
            break;
        case "zoning":
            layer = new SegmentColorMap(map, data, option);
            break;
        case "converge"://鑱氬悎鍥�
            layer = new AggregatedGraph(map, data, option);
            break;
        case "anomalyPolygon"://涓嶈鍒欏潡鐘跺垎甯冨浘
            layer = new CanvasPolygon(map, data, option);
            break;
        case "path"://璺緞鐑姏鍥�
            layer = new RouteHeatMap(map, data, option);
            break;
        case "Ingot"://鍏冨疂鍥�
            layer = new AcerGraphic(map, data, option);
            break;
        case "bubble"://姘旀场鍥�
            layer = new BubbleGraphic(map, data, option);
            break;
        case "3DBarChart"://绔嬩綋鏌辩姸鍥�
            layer = new ThreeBarMap(map, data, option);
            break;
        case "BlinkingMap"://闂姩鐐瑰浘
            layer = new BlinkingMap(map, data, option);
            break;
        case "tetragonum"://鍥涜竟褰㈢姸鍥�
            layer = new BlockMapLayer(map, data, option);
            break;
        case "customShp"://鑷畾涔夊舰鐘�
            layer = new CustomShapeMap(map, data, option);
            break;
        case "heatDiagram"://鐑姏鍥�
            layer = new HeatMap(map, data, option);
            break;
        case "bitMap"://鍥炬爣瀹氫綅鍥�
            layer = new LoctionIcon(map, data, option);
            break;
        case "pieMap"://楗肩姸鍥�
            layer = new PieChartMap(map, data, option);
            break;
        case "migrationLine"://杩佺Щ鍥�
            layer = new migrationLine(map, data, option);
            break;
        case "Windmap":
            layer = new Windmap(map, data, option);
            break;
        case "point"://鍦嗙偣鍥�
            layer = new CircleDotsMap(map, data, option);
            break;
        case "dots"://鍛煎惛鍥�
            layer = new MultiPoint(map, data, option);
            break;
        case "shinePoint":
            layer = new TwinkleDotsMapLayer(map, data, option);
            break;
        case "line":
            layer = new sheXian(map, data, option);
            break;
        case "shineLine":
            layer = new sheXian2(map, data, option);
            break;
            //add by wx 2018.04.13
        case "testPoint"://绾壊鐐瑰浘
            layer = new TestPoint(map,data,option);
            break;
        case "colorPoint"://澶氳壊鐐瑰浘
            layer = new ColorPoint(map,data,option);
            break;
        case "airLine"://椋炴満鑸嚎鍥�
            layer = new AirLine(map,data,option);
            break;
        case "purityLine"://绾壊绾�
            layer = new PurityLine(map,data,option);
            break;
        case "circlePoint"://姹℃煋绛夌骇鍥�
            layer = new CirclePoint(map,data,option);
            break;
        case "testLine"://娴嬭瘯杩佺Щ鍥�
            layer = new TestLine(map,data,option);
            break;
            //add by wx 2018.04.16
        case "carsMove"://杞﹁締杞ㄨ抗鍥�
            layer = new CarMove(map,data,option);
            break;
    }
	return layer;
};

var WKTUtil = function (options) {
    this.initialize(options);
};
WKTUtil.prototype = {
    initialize: function (options) {
        this.regExes = {
            'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            'spaces': /\s+/,
            'parenComma': /\)\s*,\s*\(/,
            'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
            'trimParens': /^\s*\(?(.*?)\)?\s*$/
        };
        for (var i in options) {
            this[i] = options[i];
        }
    },

    /**
     * APIMethod: read Deserialize a WKT string and return a vector feature or
     * an array of vector features. Supports WKT for POINT, MULTIPOINT,
     * LINESTRING, MULTILINESTRING, POLYGON, MULTIPOLYGON, and
     * GEOMETRYCOLLECTION.
     *
     * Parameters: wkt - {String} A WKT string
     *
     * Returns: {<OpenLayers.Feature.Vector>|Array} A feature or array of
     * features for GEOMETRYCOLLECTION WKT.
     */
    read: function (wkt) {
        var features = null, type, str;
        wkt = wkt.replace(/[\n\r]/g, " ");
        var matches = this.regExes.typeStr.exec(wkt);
        if (matches) {
            type = matches[1].toLowerCase();
            str = matches[2];
            if (this.parse[type]) {
                features = this.parse[type].apply(this, [str]);
            }
        }
        return features;
    },

    /**
     * Method: extractGeometry Entry point to construct the WKT for a single
     * Geometry object.
     *
     * Parameters: geometry - {<OpenLayers.Geometry.Geometry>}
     *
     * Returns: {String} A WKT string of representing the geometry
     */
    extractGeometry: function (geometry) {
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
        if (!this.extract[type]) {
            return null;
        }
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }
        var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
        var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
        return data;
    },

    trim: function (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    /**
     * Object with properties corresponding to the geometry types. Property
     * values are functions that do the actual parsing.
     */
    parse: {
        /**
         * Return point feature given a point WKT fragment.
         *
         * @param {String}
         *            str A WKT fragment representing the point
         * @returns {OpenLayers.Feature.Vector} A point feature
         * @private
         */
        'point': function (str) {
            var coords = this.trim(str).split(this.regExes.spaces);
            return coords;// new esri.geometry.Point(coords[0], coords[1]);
        },

        /**
         * Return a multipoint feature given a multipoint WKT fragment.
         *
         * @param {String}
         *            str A WKT fragment representing the multipoint
         * @returns {OpenLayers.Feature.Vector} A multipoint feature
         * @private
         */
        'multipoint': function (str) {
            var point;
            var points = this.trim(str).split(',');
            var components = [];
            for (var i = 0, len = points.length; i < len; ++i) {
                point = points[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.point.apply(this, [point]).geometry);
            }
            return components;
        },

        /**
         * Return a linestring feature given a linestring WKT fragment.
         *
         * @param {String}
         *            str A WKT fragment representing the linestring
         * @returns {OpenLayers.Feature.Vector} A linestring feature
         * @private
         */
        'linestring': function (str) {
            var points = this.trim(str).split(',');

            var components = [];
            for (var i = 0, len = points.length; i < len; ++i) {
                components.push(this.parse.point.apply(this, [points[i]]));
            }
            return components;// new esri.geometry.Polyline(components)
        },

        /**
         * Return a multilinestring feature given a multilinestring WKT
         * fragment.
         *
         * @param {String}
         *            str A WKT fragment representing the multilinestring
         * @returns {OpenLayers.Feature.Vector} A multilinestring feature
         * @private
         */
        'multilinestring': function (str) {
            var line;
            var lines = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for (var i = 0, len = lines.length; i < len; ++i) {
                line = lines[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.linestring.apply(this, [line]).geometry);
            }
            return components;
        },

        /**
         * Return a polygon feature given a polygon WKT fragment.
         *
         * @param {String}
         *            str A WKT fragment representing the polygon
         * @returns {OpenLayers.Feature.Vector} A polygon feature
         * @private
         */
        'polygon': function (str) {
            var ring, linestring;
            var rings = this.trim(str).split(this.regExes.parenComma);

            var components = [];
            for (var i = 0, len = rings.length; i < len; ++i) {
                ring = rings[i].replace(this.regExes.trimParens, '$1');
                linestring = this.parse.linestring.apply(this, [ring]);
                components.push(linestring);
            }
            return components;
        },

        /**
         * Return multi polygon feature given a polygon WKT fragment.
         *
         * @param {String}
         *            str multi WKT fragment representing the polygon
         * @returns multi polygon feature
         * @private
         */
        'multipolygon': function (str) {
            var ring, linestring;
            var rings = this.trim(str).split(this.regExes.doubleParenComma);
            var components = [];
            for (var i = 0, len = rings.length; i < len; ++i) {
                var ringstr = rings[i];
                ring = ringstr.replace(this.regExes.trimParens, '$1');
                ring = ring.replace(this.regExes.trimParens, '$1');
                linestring = this.parse.linestring.apply(this, [ring]);
                components.push(linestring);
            }
            return components;
        }
    }
};

function WktToMultiPolygon(wkt, spatialreference) {
    var wktUtil = new WKTUtil();
    var pt = wktUtil.read(wkt);
    var json = {
        rings: pt,
        spatialReference: spatialreference
    };
    var Polygon = new esri.geometry.Polygon(json);
    return Polygon;
};


//---------------------------------瀵嗛泦鏁版嵁鍒嗗竷鍥�-----------------------------------------------------------
function DensePoints(map, data, option) {
    this.densePointOption = option || {};
    this.densePointOption.data = data || {};
    this._map = map;

    var id = document.getElementById('canvasDiv');
    if (!id) {
        this.initCanvas();
    }
    this._bindEvent();
};
DensePoints.prototype = {
    initCanvas: function () {
        var canvas = this._echartsContainer = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.height = this._map.height;
        canvas.width = this._map.width;
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.display = "block";
        this._map.__container.appendChild(canvas);
        this.densePointOption.ctx = canvas.getContext("2d");
        this.init();
    },
    data: [],
    _bindEvent: function () {
        var me = this;
        var ctx = this.densePointOption.ctx;

        this._map.on("pan-start", function () {
            ctx.clearRect(0, 0, me._map.width, me._map.height);
        });
        this._map.on("pan-end", function () {
            me.init();
        });
        this._map.on("zoom-start", function () {
            ctx.clearRect(0, 0, me._map.width, me._map.height);
        });
        this._map.on("zoom-end", function () {
            me.init();
        });
    },

    init: function () {
        var me = this,
            option = this.densePointOption,
            map = this._map;
        var ctx = this.densePointOption.ctx
        var color = option.fillColor ? option.fillColor : "rgba(251,180,72,0.7)";

        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fill();
        ctx.fillRect(0, 0, this._map.width, this._map.height);
        console.log(option.data)
        option.data.forEach(function (item) {
            var point = new esri.geometry.Point(item.geoCoord[0], item.geoCoord[1]);
            var screenPoint = map.toScreen(point);
            me.drawPoint(screenPoint.x, screenPoint.y, ctx, color, option.shadowBlur);
        });
    },
    drawPoint: function (x, y, ctx, color, shadowBlur) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = shadowBlur ? shadowBlur : 5;
        ctx.closePath();


    },
    removeLayer: function () {
        $("#" + this.id).find("canvas").remove();
    }
};

function BaseLayer(map, type) {
    this.map = map || this.map;
    // console.log(this);
    this.layerId = 'mapLayer';
    this.type = type || this.map;
};
BaseLayer.prototype.addLayer = function () {
    var me = this;
    var type = this.option.type;
    var map = this.map = this.option.map;
    // var dataArr = this.option.data;

    // console.log(this);
    require(["esri/layers/GraphicsLayer", "esri/geometry/Point", "esri/SpatialReference", "esri/graphic",
            "esri/renderers/HeatmapRenderer", "esri/layers/FeatureLayer"],
        function (GraphicsLayer, Point, SpatialReference, Graphic, HeatmapRenderer, FeatureLayer) {
            switch (type) {
                case 'heatMap':
                    layerDefinition = {
                        "geometryType": "esriGeometryPoint",
                        "fields": [{
                            "name": "id", "type": "esriFieldTypeInteger", "alias": "id"
                        }]
                    };
                    var featureCollection = {
                        layerDefinition: layerDefinition,
                        featureSet: null
                    };
                    me.heatMapLayer = new FeatureLayer(featureCollection, {
                        showLabels: true,
                        id: me.layerId,
                        opacity: 1,
                        mode: FeatureLayer.MODE_SNAPSHOT
                    });
                    map.addLayer(me.heatMapLayer);
                    break;
                default:
                    me.mapLayer = new GraphicsLayer({id: me.layerId});//鑹插潡鍥剧殑鍥惧眰
                    map.addLayer(me.mapLayer, 2);
                    break;
            }
        });
};
BaseLayer.prototype.getMapLayer = function () {
    this.map.getLayer(this.layerId);
};
BaseLayer.prototype.removeMapLayer = function () {
    this.map.removeLayer(this.map.getLayer(this.layerId));
};

//-----------------------------------鐑姏鍥�------------------------------------------------------
/* 鐑姏鍥�---浣跨敤鍒扮殑鍙傛暟璇存槑锛�
 * map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
 * type锛堝瓧绗︿覆鏍煎紡锛�:鍙笉鍐欙紱
 * data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
 * layerID锛氬浘灞侷D锛�
 * breaks:杩涜璁剧疆棰滆壊
*/
function HeatMap(map, data, option) {

    BaseLayer.call(this);
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();

};
HeatMap.prototype = new BaseLayer();
HeatMap.prototype.init = function () {
    var option = this.option;
    var me = this;
    me.addLayer();
    me.load();
};
HeatMap.prototype.load = function (data) {
    var me = this;
    var option = this.option;
    if (this.option.data && this.option.data.length <= 0) {
        return;
    }
    require(["esri/symbols/SimpleLineSymbol", "esri/Color", "esri/renderers/HeatmapRenderer",
            "esri/geometry/Point", "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleMarkerSymbol"],
        function (SimpleLineSymbol, Color, HeatmapRenderer, Point, SpatialReference,
                  Graphic, SimpleMarkerSymbol) {

            var render = new HeatmapRenderer({
                field: "id",
                blurRadius: option.blurRadius ? option.blurRadius : 10,
                maxPixelIntensity: option.maxPixelIntensity ? option.maxPixelIntensity : 0,
                minPixelIntensity: option.minPixelIntensity ? option.minPixelIntensity : 0,
            });
            var markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0]), 0.8),
                new Color([0, 255, 0, 0.2]));

            option.data.forEach(function (item, index) {
                var point = new Point(item.X, item.Y, new SpatialReference({wkid: 4326}));
                var info = {
                    "id": index + 1,
                    "name": item.NAME
                };
                var graphic = new Graphic(point, markerSymbol, info);
                me.heatMapLayer.add(graphic);0
            });
            var colorStops = [];
            for (var i = 0, c = option.colors.length - 1; i <= c; i++) {
                var RGBA = option.colors[i];
                colorStops.push({ratio: RGBA.ratio, color: RGBA.color});
            }
            render.setColorStops(colorStops);
            me.heatMapLayer.setRenderer(render);
        });
};
HeatMap.prototype.reloadLayer = function (data) {
    this.op.data = data;
    this.load();
};


//-----------------------------------鑹插潡鍥�------------------------------------------------------
/*
*   鑹插潡鍥�---浣跨敤鍒扮殑鍙傛暟璇存槑锛�
*	data:鏁版嵁鐪佷唤JSON锛屼繚璇佹湁缁忕含搴︼紙xcenter,ycenter,蹇呴』鏈夛級鍜岀渷浠藉悕绉�(short_name);
* 	breaks:杩涜娓叉煋鐨勯鑹插拰鏁版嵁鍒嗘锛坰tart锛宔nd,color锛�;
* 	keyword:娓叉煋鎵€浣跨敤鏁版嵁鍏抽敭瀛楁暟鎹紝瀛樺湪鐪佷唤鏁版嵁JSON閲岋紝鑻ヤ笉瀛樺湪锛屽垯澶勭悊涓虹┖瀛楃;
* 	mapColorID:娓叉煋鑹插潡鍥惧眰鐨勫浘灞侷D锛岃嫢涓嶅瓨鍦紝鍒欎负榛樿鍥惧眰ID锛坱his.divId锛�;
*  	breaks:鍒嗘璁捐壊锛�
*	map:map;
*   WktToMultiPolygon姝ゆ柟娉曞湪mapTran.js鏂囦欢涓紱
*/
function SegmentColorMap(map, data, option) {
    this.option = option;
    this.option.data = data;
    this.option.map = map;
    this.addLayer();
    this.init();
};
SegmentColorMap.prototype = new BaseLayer();
SegmentColorMap.prototype.init = function () {
    var me = this;
    var option = this.option;

    if (!option.data || option.data.length <= 0) { //濡傛灉涓虹┖鏁版嵁锛屽垯鐩存帴杩斿洖
        return;
    }
    require(["esri/graphic", "esri/layers/GraphicsLayer", "esri/symbols/TextSymbol", "esri/Color",
            "esri/geometry/Point", "esri/SpatialReference"],
        function (Graphic, GraphicsLayer, TextSymbol, Color, Point, SpatialReference) {
            //瑕佸厛淇濊瘉鑹插潡鍥惧浘灞傞噷鐨刧raphic鏈夊€硷紝鐒跺悗鎵嶈兘杩涜娣诲姞symbol,鍥犳鍐欎簡2涓惊鐜�
            option.data.forEach(function (item) {
                var poly = WktToMultiPolygon(item.geom, new Graphic({wkid: 4326}));
                var graphic = new Graphic(esri.geometry.geographicToWebMercator(poly));
                me.mapLayer.add(graphic);
            });

            option.data.forEach(function (item, index) {
                me.getColorSymbol(item[option.keyword]);
                me.mapLayer.graphics[index].symbol = me.fillSymbol;
            });

            console.log(3);
            if (option.isShowLabelName) {
                setTimeout(function () {
                    option.data.forEach(function (item, index) {
                        var textSymbol = new TextSymbol(item.short_name, 'Microsoft Yahei', '#000');
                        var point = new Point(item.xcenter, item.ycenter, new SpatialReference({wkid: 4326}));
                        var graphic = new Graphic(esri.geometry.geographicToWebMercator(point), textSymbol);
                        me.mapLayer.add(graphic);
                    });
                }, 50);
            }


            //----鏄惁鏄剧ず琛� 鏀垮尯鍒掑悕绉�
            //			if (option.isShowLabelName) {
            //				option.mapLabelLayer = option.map.getLayer('mapLabelLayer');
            //				if (option.mapLabelLayer) {
            //					me.getLabelSymbol();
            //				} else {
            //					option.mapLabelLayer = new GraphicsLayer({ id: 'mapLabelLayer' });//琛屾斂鍖哄垝鍚嶇О鍥惧眰
            //					option.map.addLayer(option.mapLabelLayer, 5);
            //					me.getLabelSymbol();
            //				}
            //			}
        });
};
SegmentColorMap.prototype.getColorSymbol = function (val) {//瀵瑰湴鍥捐繘琛屾覆鏌�
    if (!val) {
        val = '';
    }
    var me = this;

    var option = this.option;
    require(["esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color"],
        function (SimpleLineSymbol, SimpleFillSymbol, Color) {
            var lineSymbol = new SimpleLineSymbol();
            lineSymbol.width = 1;
            lineSymbol.color = new esri.Color([0, 140, 207, 0.8]);

            me.fillSymbol = new SimpleFillSymbol();
            me.fillSymbol.outline = lineSymbol;

            option.breaks.forEach(function (item) {
                if (val >= item.start && val < item.end) {
                    me.fillSymbol.color = item.color;
                }
            });
            return me.fillSymbol;
        });
};
SegmentColorMap.prototype.getLabelSymbol = function () {//鏄剧ず琛屾斂鍖哄垝鍚嶇О
    var me = this;
    var option = this.option;
    require(["esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color",
            "esri/symbols/TextSymbol", "esri/graphic"],
        function (SimpleLineSymbol, SimpleFillSymbol, Color, TextSymbol, Graphic) {
            option.list.forEach(function (item) {
                var textSymbol = new TextSymbol(item.short_name, 'Microsoft Yahei', '#000');
                var point = new Point(item.xcenter, item.ycenter, new SpatialReference({wkid: 4326}));
                var graphic = new Graphic(esri.geometry.geographicToWebMercator(point), textSymbol);
                option.mapLabelLayer.add(graphic);
            });
        });
};
SegmentColorMap.prototype.removeMapLayer = function () {//娓呴櫎鍥惧眰
    var option = this;
    if (option.mapLayer) {
        option.map.removeLayer(option.mapLayer);
    }
    if (option.mapLabelLayer) {
        option.map.removeLayer(option.mapLabelLayer);
    }
};

//-----------------------------------鍦嗙偣鍥�------------------------------------------------------
/*
 *  浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
 *  map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
 *  type锛堝瓧绗︿覆鏍煎紡锛�:鍙笉鍐欙紱
 *  data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
 *  layerID锛氬浘灞侷D锛�
 * pointColor:鐐圭殑棰滆壊锛�
 * */
function CircleDotsMap(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this.option.map = map;
    this.addLayer();
    this.init();
};
CircleDotsMap.prototype = new BaseLayer();
CircleDotsMap.prototype.init = function () {
    this.load();
}
CircleDotsMap.prototype.reloadLayer = function (data) {
    this.op.data = data;
    this.load();
}
CircleDotsMap.prototype.load = function () {
    var me = this;
    var option = this.option;
    if (this.option.data && this.option.data.length <= 0) {
        return;
    }
    // console.log(this);
    require(["esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color",
            "esri/graphic", "esri/geometry/Point", "esri/geometry/Circle", "esri/InfoTemplate",
            "esri/SpatialReference", "esri/symbols/SimpleMarkerSymbol"],
        function (SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, Point, Circle, InfoTemplate,
                  SpatialReference, SimpleMarkerSymbol) {
            option.data.forEach(function (item, index) {
                var line = new SimpleLineSymbol();
                line.setWidth(1);
                var marker = new SimpleMarkerSymbol();
                marker.setSize(8);
                option.pointColor.forEach(function (item1) {
                    if (item1.start < item.value && item1.end >= item.value) {
                        marker.setColor(new Color(item1.color));
                        line.setColor(new Color(item1.color));
                        marker.setOutline(line);
                    }
                });
                var point = new Point(item.X, item.Y, new SpatialReference({wkid: 4326}));
                // var circlePoint = new Circle(point, {
                //     "radius": 2,
                //     geodesic: true
                // });
                var info = {
                    "id": index + 1,
                    "X": item.X, "Y": item.Y,
                    "name": item.NAME
                };
                var infoTemplate = new InfoTemplate('璇︽儏', "鍦扮偣锛� ${name}");
                var graphic = new Graphic(point, marker, info, infoTemplate);
                me.mapLayer.add(graphic);

                // 寮圭獥缇庡寲
                $(".esriPopup .titlePane").css({
                    "background-color": "#EEEEEE",
                    "color": "#525252"
                });
                $(".esriPopup .sizer").css({
                    "width": "170px"
                });
                $(".esriPopup .titleButton").css({
                    "background": " url(../img/location/wrong.png) no-repeat center"
                });
                $(".esriPopup .titleButton.maximize").hide();
                $(".actionList").hide();
            });
        });
};

//-----------------------------------鍥炬爣瀹氫綅鍥�----------------------------------------------------
function LoctionIcon(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
};
LoctionIcon.prototype = new BaseLayer();
LoctionIcon.prototype.init = function () {
    this.load();
    this.addLayer(this._map);
}
LoctionIcon.prototype.load = function () {
    var me = this;
    var option = this.option;
    if (this.option.data && this.option.data.length <= 0) {
        return;
    }
    require(["esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color",
            "esri/graphic", "esri/geometry/Point", "esri/geometry/Circle", "esri/InfoTemplate",
            "esri/SpatialReference", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol"],
        function (SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, Point, Circle, InfoTemplate,
                  SpatialReference, SimpleMarkerSymbol, PictureMarkerSymbol) {
            option.data.forEach(function (item, index) {
                var point = new Point(item.X, item.Y, new SpatialReference({wkid: 4326}));
                var marker;
                option.pointColor.forEach(function (item1) {
                    if (item1.start < item.num1 && item1.end >= item.num1) {
                        marker = new PictureMarkerSymbol({
                            "url": item1.imgUrl,
                            "height": 25,
                            "width": 25,
                            "type": "esriPMS"
                        });
                    }
                });
                var info = {
                    "id": index + 1,
                    // "X": item.X, "Y": item.Y,
                    "name": item.NAME
                };
                var infoTemplate = new InfoTemplate('璇︽儏', '鍦扮偣锛� ${name}');
                var graphic = new Graphic(point, marker, info, infoTemplate);
                me.mapLayer.add(graphic);
            });
        });
};

//----------------------------------鍥涜竟褰㈢姸----------------------------------------------------
/* 鍒涘缓鍥涜竟褰紝浜嬩欢瑙﹀彂鍦╝pp.js閲�
* 1.姝ゆ柟娉曪紝鍙€傜敤浜庤鍒欑殑鍥涜竟褰紝鍗充笂杈规涓庝笅杈规鐩哥瓑锛屽乏杈规绛変簬鍙宠竟妗嗭紱
* 2.闇€瑕佺煡閬撳洓杈瑰舰鐨勪腑蹇冪偣锛岀劧鍚庝互涓績鐐逛负鍘熺偣锛岄€氳繃鍔犲噺distX,distY鐭ラ亾鍥涜竟鐨勭偣锛岀劧鍚庡垱寤洪潰锛�
* 3.涓轰繚璇佸睍鐜版暟鎹笌鍚庡彴淇濇寔涓€鑷达紝distX,distY鏈€濂介€氳繃鍚庡彴鑾峰緱锛�

* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
* list:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
* layerID锛氬浘灞侷D锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
* distX:浠呮敮鎸佹暟瀛楋紝鏍规嵁鍥涜竟褰腑蹇冪偣锛岃绠楀埌楂樼殑璺濈锛屽嵆X杞达紝浠ヤ腑蹇冪偣涓哄潗鏍囧師鐐�
* distY:浠呮敮鎸佹暟瀛楋紝鏍规嵁鍥涜竟褰腑蹇冪偣锛岃绠楀埌瀹界殑璺濈锛屽嵆Y杞达紝浠ヤ腑蹇冪偣涓哄潗鏍囧師鐐�
* renderColor:娓叉煋棰滆壊
* center:涓哄洓杈瑰舰鐨勪腑蹇冪偣锛堜腑蹇冪偣浠ユ暟缁勬牸寮忓瓨鍦紝鍚﹀垯浼氳烦杩囨湰娆″惊鐜級
* */
function BlockMapLayer(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
};
BlockMapLayer.prototype = new BaseLayer();
BlockMapLayer.prototype.init = function () {
    this.addLayer();
    this.loadLayer();
}
BlockMapLayer.prototype.reloadLayer = function (data, layerId) {
    this.op.data = data;
    this.loadLayer();
}
BlockMapLayer.prototype.loadLayer = function () {
    var me = this, option = this.option;
    if (!option.data || option.data.length <= 0 || !option.map) {
        return;
    }
    require(["esri/graphic", "esri/Color", "esri/SpatialReference",
            "esri/geometry/webMercatorUtils", "esri/geometry/Point", "esri/geometry/Polygon",
            "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol"],
        function (Graphic, Color, SpatialReference,
                  webMercatorUtils, Point, Polygon, SimpleLineSymbol, SimpleFillSymbol, TextSymbol) {
            for (var i = 0, len = option.data.length; i < len; i++) {
                var item = option.data[i];
                if (Array.isArray(item.center)) {
                    item.X = item.center[0];
                    item.Y = item.center[1];
                } else {
                    console.warn('涓績鐐规湁闂锛岃烦杩囦竴娆′腑蹇冪偣');
                    continue;
                }
                var fillSymbol = me.getRendererColor(item.value);
                // var getXY = me.getLatLng(item.NAME);

                //杞ⅷ鍗℃墭鍧愭爣绯�
                var webMercator = webMercatorUtils.lngLatToXY(item.X, item.Y);
                var polygon = new Polygon(new SpatialReference({wkid: 102100}));
                polygon.addRing([
                    [webMercator[0] - Number(option.distX), webMercator[1] + Number(option.distY)],
                    [webMercator[0] + Number(option.distX), webMercator[1] + Number(option.distY)],
                    [webMercator[0] + Number(option.distX), webMercator[1] - Number(option.distY)],
                    [webMercator[0] - Number(option.distX), webMercator[1] - Number(option.distY)],
                    [webMercator[0] - Number(option.distX), webMercator[1] + Number(option.distY)]
                ]);

                var info = {
                    'id': i + 1,
                    // 'x': item.X,'y': item.Y
                }
                var graphic = new Graphic(polygon, fillSymbol, info);
                me.mapLayer.add(graphic);

                // var textSymbol = new TextSymbol(item.value);
                // var graphic1 = new Graphic(polygon,textSymbol,info);
                // graphicLayer.add(graphic1);
            }
        });
}
BlockMapLayer.prototype.getRendererColor = function (val) {//鑾峰緱娓叉煋鐨勯鑹�
    var option = this.option;
    if (!val) {
        val == '';
    }

    var lineSymbol = new esri.symbol.SimpleLineSymbol();
    lineSymbol.width = 1;
    lineSymbol.color = new esri.Color([0, 140, 207, 0.5]);

    var fillSymbol = new esri.symbol.SimpleFillSymbol();
    fillSymbol.outline = lineSymbol;

    if (option.renderColor && option.renderColor.length > 0) {
        option.renderColor.forEach(function (item) {
            if (val >= item.start && val < item.end) {
                fillSymbol.color = item.color;
            }
        });
    }
    return fillSymbol;
};


//---------------------------------鍏竟褰㈢姸----------------------------------------------------
/* 鍒涘缓鍥涜竟褰紝浜嬩欢瑙﹀彂鍦╝pp.js閲�
* 1.姝ゆ柟娉曪紝鍙€傜敤浜庤鍒欑殑鍥涜竟褰紝鍗充笂杈规涓庝笅杈规鐩哥瓑锛屽乏杈规绛変簬鍙宠竟妗嗭紱
* 2.闇€瑕佺煡閬撳洓杈瑰舰鐨勪腑蹇冪偣锛岀劧鍚庝互涓績鐐逛负鍘熺偣锛岄€氳繃鍔犲噺distX,distY鐭ラ亾鍥涜竟鐨勭偣锛岀劧鍚庡垱寤洪潰锛�
* 3.涓轰繚璇佸睍鐜版暟鎹笌鍚庡彴淇濇寔涓€鑷达紝distX,distY鏈€濂介€氳繃鍚庡彴鑾峰緱锛�

* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
* list:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
* layerID锛氬浘灞侷D锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
* verticalDist:10 * 300,//浠呮敮鎸佹暟瀛楋紝涓績鐐瑰埌鍚勪釜杈圭殑鍨傜洿璺濈
* renderColor:娓叉煋棰滆壊
* center:涓哄洓杈瑰舰鐨勪腑蹇冪偣锛堜腑蹇冪偣浠ユ暟缁勬牸寮忓瓨鍦紝鍚﹀垯浼氳烦杩囨湰娆″惊鐜級
* */
function HexagonLayerMap(data) {

    this.option = data;
};
HexagonLayerMap.prototype = new BaseLayer();
HexagonLayerMap.prototype.init = function () {
    this.addLayer();
    this.loadLayer();
};
HexagonLayerMap.prototype.reloadLayer = function (data, layerId) {
    this.op.data = data;
    this.loadLayer();
};
HexagonLayerMap.prototype.loadLayer = function () {
    var me = this, option = this.option;
    if (!option.data || option.data.length <= 0 || !option.map) {
        return;
    }
    require(["esri/graphic", "esri/Color", "esri/SpatialReference",
            "esri/geometry/webMercatorUtils", "esri/geometry/Point", "esri/geometry/Polygon",
            "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol"],
        function (Graphic, Color, SpatialReference,
                  webMercatorUtils, Point, Polygon, SimpleLineSymbol, SimpleFillSymbol, TextSymbol) {
            for (var i = 0, len = option.data.length; i < len; i++) {
                var item = option.data[i];
                if (Array.isArray(item.center)) {
                    item.X = item.center[0];
                    item.Y = item.center[1];
                } else {
                    console.warn('涓績鐐规湁闂锛岃烦杩囦竴娆′腑蹇冪偣');
                    continue;
                }
                console.log();
                var fillSymbol = me.getRendererColor(item.value);
                // var getXY = me.getLatLng(item.NAME);

                var webMercator = webMercatorUtils.lngLatToXY(item.X, item.Y);
                var polygon = new Polygon(new SpatialReference({wkid: 102100}));
                polygon.addRing([
                    [webMercator[0] + Number(option.verticalDist / 2), webMercator[1] + Number(option.verticalDist)],
                    [webMercator[0] + Number(option.verticalDist), webMercator[1]],
                    [webMercator[0] + Number(option.verticalDist / 2), webMercator[1] - Number(option.verticalDist)],
                    [webMercator[0] - Number(option.verticalDist / 2), webMercator[1] - Number(option.verticalDist)],
                    [webMercator[0] - Number(option.verticalDist), webMercator[1]],
                    [webMercator[0] - Number(option.verticalDist / 2), webMercator[1] + Number(option.verticalDist)],
                    [webMercator[0] + Number(option.verticalDist / 2), webMercator[1] + Number(option.verticalDist)],
                ]);

                var info = {
                    'id': i + 1,
                    // 'x': item.X,'y': item.Y
                }
                var graphic = new Graphic(polygon, fillSymbol, info);
                me.mapLayer.add(graphic);

                // var textSymbol = new TextSymbol(item.value);
                // var graphic1 = new Graphic(polygon,textSymbol,info);
                // graphicLayer.add(graphic1);
            }
        });
};
HexagonLayerMap.prototype.getRendererColor = function (val) {//鑾峰緱娓叉煋鐨勯鑹�
    var option = this.option;
    if (!val) {
        val == '';
    }

    var lineSymbol = new esri.symbol.SimpleLineSymbol();
    lineSymbol.width = 1;
    lineSymbol.color = new esri.Color([0, 140, 207, 0.5]);

    var fillSymbol = new esri.symbol.SimpleFillSymbol();
    fillSymbol.outline = lineSymbol;

    if (option.renderColor && option.renderColor.length > 0) {
        option.renderColor.forEach(function (item) {
            if (val >= item.start && val < item.end) {
                fillSymbol.color = item.color;
            }
        });
    }
    return fillSymbol;
};


function ShapeBaseLayer(map) {

};
ShapeBaseLayer.prototype.rquireEchart = function () {
    var me = this;
    require(["../libs/echarts.min.js"], function (echart) {
        me.charts = echart;
    });
};
ShapeBaseLayer.prototype._loadDiv = function () {
    var option = this.option || this.BarOption || this.ThreeBarOption;
    if (!option.data || option.data.length <= 0 || !option.map) { //濡傛灉涓虹┖鏁版嵁锛屽垯鐩存帴杩斿洖
        return;
    }
    option.spatialReference = option.map.spatialReference ?
        option.map.spatialReference : new esri.SpatialReference({wkid: 102100});

    this._list = [];
    this._cList = [];
    this._eList = [];
    option.width = option.width || 40;
    option.height = option.height || 60;

    this.layerID = option.layerID ? option.layerID : 'pieChartId';

    if (document.getElementById(this.layerID) == null) {
        var html = "<div id='" + this.layerID + "' style='position: absolute; z-index: 1; box-sizing: border-box; left: 0; top: 0;'></div>";
        $("#" + option.map.id).parent().append(html);
    }
};
ShapeBaseLayer.prototype._process = function () {
    var option = this.option || this.BarOption || this.ThreeBarOption;
    if (option.data.toFixed) {
        return;
    }
    option.data.toFixed = true;
};
ShapeBaseLayer.prototype._getObj = function (list, index, width, height) {
    var me = this;
    this._getMapPoint(list.X, list.Y)

    var obj = {};
    obj.id = "chart_" + index;
    obj.point = me.latLng;
    obj.screen = this._getScreenPoint(this.latLng);
    obj.name = list.NAME;
    obj.width = width;
    obj.height = height;
    this._list.push(obj);
    return obj;
}
//鑾峰緱鏁扮粍鏈€澶у€�
ShapeBaseLayer.prototype._getMax = function () {
    //姹傚彇鏈€澶у€硷紝淇濊瘉鏌辩姸鍥剧湅鐫€涓嶄細澶繃楂樻垨鑰呰繃浣�
    var option = this.option || this.BarOption || this.ThreeBarOption;
    var max = -Infinity;
    var keywords = option.data.keywords;
    var setNumArray = [];
    // 鏀堕泦keywords閲岀殑鏁版嵁鍚庡叏閮╬ush杩泂etNumArray鏁扮粍锛�
    // 鐒跺悗姹傚嚭鎯冲睍绀烘暟鎹腑鐨勬渶澶у€�
    try {
        if (keywords && option.data && option.data.length > 0) {
            option.data.forEach(function (item, index) {
                if (item) {
                    keywords.forEach(function (keyword) {
                        if (item[keyword]) {
                            setNumArray.push(item[keyword]);
                        } else {
                            setNumArray.push('');
                        }
                    });
                } else {
                    console.log('鏁版嵁涓煇鏉℃暟鎹睘鎬т笉瀛樺湪鎵€璁惧叧閿瓧');
                    setNumArray.push('');
                }
            });
            var getNumArray = Math.max.apply(null, setNumArray);
            return getNumArray;
        } else {
            return '';
        }
    } catch (e) {
        console.log('鑾峰彇鍊煎け璐ワ細' + e);
        return '';
    }
}
ShapeBaseLayer.prototype._getMapPoint = function (x, y) {
    var me = this;
    require(["esri/SpatialReference", "esri/geometry/webMercatorUtils", "esri/geometry/Point"],
        function (SpatialReference, webMercatorUtils, Point) {
            var point = new Point(x, y, new SpatialReference({wkid: 4326}));
            me.latLng = point;
        });
};
ShapeBaseLayer.prototype._getScreenPoint = function (point) {
    var option = this.option || this.BarOption || this.ThreeBarOption;
    return option.map.toScreen(point);
};
ShapeBaseLayer.prototype._addTipMapEvent = function () {
    var me = this;
    var option = this.option || this.BarOption || this.ThreeBarOption;
    require(["dojo/_base/declare", "dojo/_base/lang", "dojo/on"], function (declare, lang, on) {
        me._eList.push(option.map.on("pan", lang.hitch(me, me._tipMapPan)));
        me._eList.push(option.map.on("extent-change", lang.hitch(me, me._tipMapExtentChange)));
        me._eList.push(option.map.on("zoom", lang.hitch(me, me._tipMapZoom)));
        //鍦板浘鎿嶄綔鍚庢樉绀篹charts鍥�
        // this._eList.push(option.map.on("pan-end", lang.hitch(this, this._tipMapPanEnd)));
        me._eList.push(option.map.on("zoom-end", lang.hitch(me, me._tipMapZoomEnd)));
    });
};
ShapeBaseLayer.prototype._removeTipMapEvent = function () {
    for (var i = 0, c = this._eList.length; i < c; i++) {
        this._eList[i].remove();
    }
    this._eList.length = 0;
};
//鍦板浘鎿嶄綔鏃堕殣钘忓浘
ShapeBaseLayer.prototype._tipMapPan = function (evt) {
    // $('#chart_div').hide();
    for (var i = 0, c = this._list.length; i < c; i++) {
        this._updateChart(this._list[i], this._list[i].screen.x + evt.delta.x, this._list[i].screen.y + evt.delta.y);
    }
    ;
}
ShapeBaseLayer.prototype._tipMapExtentChange = function (evt) {
    if (evt.levelChange) {
        for (var i = 0, c = this._list.length; i < c; i++) {
            this._list[i].screen = this._getScreenPoint(this._list[i].point);
        }
    } else {
        var dx = (evt.delta && evt.delta.x) || 0;
        var dy = (evt.delta && evt.delta.y) || 0;
        for (var i = 0, c = this._list.length; i < c; i++) {
            this._list[i].screen.x += dx;
            this._list[i].screen.y += dy;
        }
    }
    this._updateCharts();
};
ShapeBaseLayer.prototype._updateCharts = function () {
    for (var i = 0, c = this._list.length; i < c; i++) {
        this._updateChart(this._list[i], this._list[i].screen.x, this._list[i].screen.y);
    }
};
ShapeBaseLayer.prototype._updateChart = function (obj, x, y) {
    var left = x - obj.width / 2;
    var top = y - obj.height / 2;
    $('#' + obj.id).css({"left": left + "px", "top": top + "px"});
};
ShapeBaseLayer.prototype._tipMapZoom = function (evt) {
    $('#' + this.layerID).hide();
    for (var i = 0, c = this._list.length; i < c; i++) {
        var x = (this._list[i].screen.x - evt.anchor.x) * evt.zoomFactor + evt.anchor.x;
        var y = (this._list[i].screen.y - evt.anchor.y) * evt.zoomFactor + evt.anchor.y;
        this._updateChart(this._list[i], x, y);
    }
};
ShapeBaseLayer.prototype._tipMapZoomEnd = function (evt) {
    $('#' + this.layerID).show();
};
ShapeBaseLayer.prototype.addTooltip = function (option, name) {
    var cc = this;

    function getdollaUnit(value) {
        if (value.toString().length > 8) {
            value = (parseFloat(value) / 1E8).toFixed(2) + "浜�";
        } else if (value.toString().length > 4 && value.toString().length <= 8) {
            value = (parseFloat(value / 10000)).toFixed(2) + "涓�";
        }
        return value;
    }

    option.tooltip = {
        formatter: function (params, ticket, callback) {
            if (cc.working || params.name == "") {
                return "";
            }
            return name + "<br/>" + params.name + "锛�" + getdollaUnit(params.value) +
                (cc.unitFn ? cc.unitFn(params.name) : "");
        }
    };
};
ShapeBaseLayer.prototype.addEvent = function (chart) {
    if (!chart || chart == "") return;
    var map = this.op.map, id = chart.sid, code = chart.sid.replace("chart_", "");

    var timer = null;
    chart.on('click', function (param) {
        if (timer) {
            timer = null;
            map.emit("chart-dblclick", code);
            return;
        }

        timer = setTimeout(function () {
            if (timer) {
                timer = null;
                map.emit("chart-click", code);
            }
        }, 500);
    });

    var zIndex = this.op.zIndex;
    chart.on('mouseover', function (param) {
        $("#" + id).css("zIndex", zIndex + 1);
    });
    chart.on('mouseout', function (param) {
        $("#" + id).css("zIndex", zIndex);
    });
};
ShapeBaseLayer.prototype.removeEvent = function (chart) {
    chart.off('click');
    chart.off('mouseover');
    chart.off('mouseout');
};
//鍒涘缓鏀炬煴鐘跺浘鐨勬墍闇€瑕佺殑瀹瑰櫒锛孌IV
ShapeBaseLayer.prototype._createChartDiv = function (id, screen, width, height) {
    var option = this.option || this.BarOption || this.ThreeBarOption;

    var left = screen.x - width / 2;
    var top = screen.y - (option.type && option.type.indexOf('鏌辩姸鍥�') >= 0 ? height : height / 2);
    var padding = 0;

    var html = '<div id="' + id +
        '" style="padding:' + padding + ';position: absolute; z-index: 2; left:' + left + 'px; top:'
        + top + 'px; width: ' + width + 'px; height: ' + height + 'px;"></div>';

    $("#" + this.layerID).append(html);
};
ShapeBaseLayer.prototype.removeMapLayer = function () {
    $('#' + this.layerID).remove();
};


//------------------------------------鑷畾涔夊舰鐘�------------------------------------------------
/* 鎵€浣跨敤鐨勫弬鏁拌鏄庯細
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map;
* otherHtml:鍐欒嚜宸卞畾涔夌殑涓€浜涙牱寮忓悗鏄剧ず鍒板湴鍥句笂锛屾病鏈夊垯鏄剧ず绌哄瓧绗�;
* data:鐪佷唤鏁版嵁JSON;
* layerID:鍥惧眰ID锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
* 姝ゆ枃浠朵富瑕佸疄鐜版樉绀哄浘褰㈠拰鎷栧姩鍦板浘鏃讹紝鍥惧舰鍜屽湴鍥句竴璧峰姩
*/

function CustomShapeMap(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
    //this.layerID = this.option.layer || 'shapeID';
};
CustomShapeMap.prototype = new ShapeBaseLayer();
CustomShapeMap.prototype.init = function () {
    this._list = [];
    this._cList = [];
    this._eList = [];
    this._cList = [];
    this.loadDIV();
};
CustomShapeMap.prototype.reloadLayer = function (data, layerID) {
    this.option.data = data;
    this.option.layerID = layerID || 'shapeID';
    this.loadDIV();
}
CustomShapeMap.prototype.loadDIV = function () {
    var me = this;
    var option = this.option;
    if (!option.data || option.data.length <= 0) {
        return;
    }
    this._clearAll();

    option.spatialReference = option.map.spatialReference ?
        option.map.spatialReference : new esri.SpatialReference({wkid: 102100});
    option.width = option.width || 40;
    option.height = option.height || 60;

    if ($('#' + this.divId)) {
        $('#' + this.divId).remove();
        var htmlDiv = '<div id="' + me.layerID + '"></div>';
        $('#map_container').append(htmlDiv);
    }


    option.data.forEach(function (item, index) {
        me._getMapPoint(item.X, item.Y);
        var obj = {
            id: "shape_" + index,
            point: me.latLng,
            name: item.NAME,
            width: option.width,
            height: option.height
        };
        obj.screen = me._getScreenPoint(obj.point),
            me._list.push(obj);

        var left = obj.screen.x - obj.width / 2;
        var top = obj.screen.y - obj.height / 2;
        var padding = 0;

        var otherHtml = option.otherHtml[Math.floor(Math.random() * 5)]

        var htmlDiv = '<div id="' + obj.id +
            '" onmouseenter="shapeMouse(' + index + ')" ' +
            'onmouseleave="shapeMouseOut(' + index + ')"style="padding:auto;position: absolute; z-index: 2; left:'
            + left + 'px; top:' + top + 'px; width: ' + obj.width + 'px; height: ' + obj.height + 'px;">' +
            (otherHtml ? otherHtml : '') + '<div id="shapeChild_' + index + '"' +
            'style="width:120px;position:absolute;top:5px;left:30px;' +
            'z-index:9999;border-radius:4px;padding:5px;color:#fff;background:rgba(50,50,50,0.7);' +
            'display:none;font-size: 14px;font-family: "Microsoft YaHei";line-height: 21px;">' +
            (item.NAME ? item.NAME : '') + '<br />鍋囪鏁版嵁锛�' + (item.num1 ? item.num1 : '') + '</div></div>';

        me._cList.push(htmlDiv);

        $("#" + me.layerID).append(htmlDiv);
    });
    me._addTipMapEvent();
};
CustomShapeMap.prototype._clearAll = function () {
    $("#" + this._divId).empty();
    this._removeTipMapEvent();
    this._cList.length = 0;
    this._list.length = 0;
};


function shapeMouse(provinceID) {
    $('#shapeChild_' + provinceID).show();
};
function shapeMouseOut(provinceID) {
    $('#shapeChild_' + provinceID).hide();
};

//------------------------------------------楗肩姸鍥�----------------------------------------------
/* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
 * map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
 * type锛堝瓧绗︿覆鏍煎紡锛�:閫夋嫨鏄剧ず浠€涔堝浘褰紙濡傦細鏌辩姸鍥撅紝楗肩姸鍥撅級榛樿鏌辩姸鍥撅紱
 * data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
 * layerID锛氬浘灞侷D锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
 * colors锛堟暟缁勬牸寮忥級:鏌辩姸鍥炬煴瀛愮殑棰滆壊,鑻ユ棤鍒欏彇榛樿棰滆壊锛�
 * titles锛堟暟缁勬牸寮忥級锛氳鏄剧ず鏁扮粍鍚嶇О,涓轰繚璇佹暟鎹樉绀洪綈鍏紝寤鸿titles.length涓嶅ぇ浜巏eywords.length锛�
 * keywords锛堟暟缁勬牸寮忥級锛氶€夋嫨鍏抽敭瀛楁墍灞曠ず鐨勬暟鎹嵆涓€涓猚hart琛ㄩ噷鏄剧ず鍑犳潯鏁版嵁锛屽繀椤绘湁锛屼笉鍏佽涓虹┖锛�
 * 						鍦ㄨ幏寰楁暟鎹笉瀛樺湪鏄紝鍧囪澶勭悊涓虹┖瀛楃涓诧紱
 * showTooltip: 甯冨皵鍊�,鏄惁鏄剧ずtooltip;鑻ユ棤鍒欏彇榛樿涓嶆樉绀猴紱
 * showLabel: 甯冨皵鍊�,鏄惁鏄剧ずlabel;鑻ユ棤鍒欏彇榛樿涓嶆樉绀猴紱
 * pieRadius(瀛楃涓�/鏁扮粍):瀛楃涓茶〃绀烘櫘閫氶ゼ鍥撅紝鏁扮粍鍙仛鐜舰鍥�,涓嶅啓鍙栭粯璁ゅ€硷紙type:'pie'楗肩姸鍥句笓鐢級锛�
 * isRoseType锛�1.鏄惁鏀瑰彉楗煎浘鐨勬樉绀烘柟寮忥紝浠呮敮鎸侊紙true,false,'radius','area'锛夛紙type:'pie'楗肩姸鍥句笓鐢級锛�
 *            2.true,'radius':涓虹帿鐟板浘锛沠alse:涓烘櫘閫氶ゼ鍥撅紱'area'锛氬渾蹇冭鐩稿悓鐨勭帿鐟伴ゼ鍥撅紙type:'pie'楗肩姸鍥句笓鐢級锛�
*/
function PieChartMap(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
};
PieChartMap.prototype = {
    __proto__: new ShapeBaseLayer(),
    init: function () {
        this._loadDiv();
        this.loadLayers();
    },
    _loadDiv: function () {
        this.rquireEchart();
        var option = this.option;
        if (!option.data || option.data.length <= 0 || !option.map) { //濡傛灉涓虹┖鏁版嵁锛屽垯鐩存帴杩斿洖
            return;
        }
        option.spatialReference = option.map.spatialReference ?
            option.map.spatialReference : new SpatialReference({wkid: 102100});

        this._list = [];
        this._cList = [];
        this._eList = [];
        option.width = this.option.width || 40;
        option.height = this.option.height || 60;

        this.layerID = option.layerID ? option.layerID : 'pieChartId';

        if (document.getElementById(this.layerID) == null) {
            var html = "<div id='" + this.layerID + "' style='position: absolute; z-index: 1; box-sizing: border-box; left: 0; top: 0;'></div>";
            $("#" + option.map.id).parent().append(html);
        }
    },
    _createPie: function () {

        var me = this;
        var opList = this.option;

        if (opList.keywords.length > 0 && opList.data.length > 0) {
            for (var i = 0, c = opList.data.length; i < c; i++) {
                var obj = this._getObj(opList.data[i], i, opList.height, opList.height);
                me._createChartDiv(obj.id, obj.screen, obj.width, obj.height);
                var datas = [];
                opList.keywords.forEach(function (item, index) {
                    datas.push({
                        value: opList.data[i][item],
                        name: opList.titles[index]
                    });
                });
                this._cList.push(me.createPie(obj.id, obj.name, datas,
                    opList.colors, opList.showTooltip, opList.showLabel, opList.pieRadius,
                    opList.isRoseType));
            }
        }
        this._addTipMapEvent();
    },

    createPie: function (id, name, datas, colors, showTooltip, showLabel, pieRadius, isRoseType) {
        // console.log(this.charts);
        var chart = this.charts.init(document.getElementById(id));
        var roseType = ['radius', 'area', true, false];
        if (!pieRadius) {
            pieRadius = '65%';
        }
        var option = {
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: pieRadius,
                    center: ['50%', '50%'],
                    data: datas,
                    itemStyle: {
                        normal: {
                            label: {show: false}
                        }
                    }
                }
            ]
        };
        if (roseType.indexOf(isRoseType) > -1) {
            option.roseType = isRoseType;
        }

        if (colors) {
            option.series[0].itemStyle.normal.color = function (params) {
                return colors[params.dataIndex];
            };
        }

        if (showLabel) {
            option.series[0].radius = "55%";
            option.series[0].itemStyle.normal.label.show = true;
        }

        if (showTooltip) {
            this.addTooltip(option, name);
        }

        chart.setOption(option);
        chart.sid = id;

        return chart;
    },
    reloadLayers: function (data) {
        this.option.data = data;
    },
    loadLayers: function (type) {
        this._clearAll();
        this._process();
        this._createPie();
    },
    _clearAll: function () {
        $("#" + this.layerID).empty();
        this._removeTipMapEvent();
        this._cList.length = 0;
        this._list.length = 0;
    }
};

//-------------------------------------鍏冨疂鍥�--------------------------------------------------------
function AcerGraphic(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
};
AcerGraphic.prototype = {
    __proto__: new ShapeBaseLayer(),
    init: function () {
        var option = this.option;
        if (!option.data || option.data.length <= 0 || !option.map) { //濡傛灉涓虹┖鏁版嵁锛屽垯鐩存帴杩斿洖
            return;
        }
        option.spatialReference = option.map.spatialReference ?
            option.map.spatialReference : new esri.SpatialReference({wkid: 102100});

        this._list = [];
        this._cList = [];
        this._eList = [];
        option.width = this.option.width || 40;
        option.height = this.option.height || 60;

        this.layerID = option.layerID ? option.layerID : 'acerChartId';

        if (document.getElementById(this.layerID) == null) {
            var html = "<div id='" + this.layerID + "' style='position: absolute; z-index: 1; box-sizing: border-box; left: 0; top: 0;'></div>";
            $("#" + option.map.id).parent().append(html);
        }


        this.loadLayers();
    },
    _createAcer: function () {

        var me = this;
        var opList = this.option;
        if (opList.keywords.length <= 2 && opList.data.length > 0) {
            for (var i = 0, c = opList.data.length; i < c; i++) {
                var obj = this._getObj(opList.data[i], i, opList.height, opList.height);
                me._createChartDiv(obj.id, obj.screen, obj.width, obj.height);
                var datas = [];
                opList.keywords.forEach(function (item, index) {
                    datas.push({
                        value: opList.data[i][item],
                        name: opList.titles[index]
                    });
                });
                this._cList.push(me.createAcer(obj.id, obj.name, datas,
                    opList.colors, opList.showTooltip, opList.showLabel, opList.pieRadius,
                    opList.isRoseType));
            }
        }
        this._addTipMapEvent();

    },

    createAcer: function (id, name, datas, colors, showTooltip, showLabel, pieRadius, isRoseType) {
        this.rquireEchart();
        var chart = this.charts.init(document.getElementById(id));
        if (!pieRadius) {
            pieRadius = '65%';
        }
        var option = {
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: pieRadius,
                    center: ['50%', '50%'],
                    roseType: "area",
                    startAngle: 0,
                    data: datas,
                    itemStyle: {
                        normal: {
                            label: {show: false}
                        }
                    }
                }
            ]
        };

        if (colors) {
            option.series[0].itemStyle.normal.color = function (params) {
                return colors[params.dataIndex];
            };
        }

        if (showLabel) {
            option.series[0].radius = "55%";
            option.series[0].itemStyle.normal.label.show = true;
        }

        if (showTooltip) {
            this.addTooltip(option, name);
        }

        chart.setOption(option);
        chart.sid = id;
        //this.addEvent(id, chart);

        return chart;

    },
    reloadLayers: function (data) {
        this.option.data = data;
    },
    loadLayers: function (type) {
        this._clearAll();
        // this._process();
        this._createAcer();
        // this.addHandler();
    },
    _clearAll: function () {
        $("#" + this.layerID).empty();
        // this._removeTipMapEvent();
        this._cList.length = 0;
        this._list.length = 0;
    }

};

//---------------------------------绔嬩綋鏌辩姸鍥�----------------------------------------------
/* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
  * map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
  * type锛堝瓧绗︿覆鏍煎紡锛�:閫夋嫨鏄剧ず浠€涔堝浘褰紙濡傦細鏌辩姸鍥撅紝楗肩姸鍥撅級榛樿鏌辩姸鍥撅紱
  * data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
  * layerID锛氬浘灞侷D锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
  * colors锛堟暟缁勬牸寮忥級:鏌辩姸鍥炬煴瀛愮殑棰滆壊,鑻ユ棤鍒欏彇榛樿棰滆壊锛�
  * titles锛堟暟缁勬牸寮忥級锛氳鏄剧ず鏁扮粍鍚嶇О,涓轰繚璇佹暟鎹樉绀洪綈鍏紝寤鸿titles.length涓嶅ぇ浜巏eywords.length锛�
  * keywords锛堟暟缁勬牸寮忥級锛氶€夋嫨鍏抽敭瀛楁墍灞曠ず鐨勬暟鎹嵆涓€涓猚hart琛ㄩ噷鏄剧ず鍑犳潯鏁版嵁锛屽繀椤绘湁锛屼笉鍏佽涓虹┖锛�
  * 						鍦ㄨ幏寰楁暟鎹笉瀛樺湪鏄紝鍧囪澶勭悊涓虹┖瀛楃涓诧紱
  * showTooltip: 甯冨皵鍊�,鏄惁鏄剧ずtooltip;鑻ユ棤鍒欏彇榛樿涓嶆樉绀猴紱
*/
function ThreeBarMap(map, data, option) {
    this.ThreeBarOption = option || {};
    this.ThreeBarOption.data = data;
    this.ThreeBarOption.map = this.map = map;
    if (!data || !map) {
        return;
    }

    this.init();

};
ThreeBarMap.prototype = new ShapeBaseLayer();
ThreeBarMap.prototype.init = function () {
    this._loadDiv();
    this._create3DBar();
};
ThreeBarMap.prototype._create3DBar = function () {
    var me = this;
    var option = this.ThreeBarOption;
    var maxNum = me._getMax();
    //鍒涘缓绔嬩綋鏌辩姸鍥�
    for (var i = 0, c = option.data.length; i < c; i++) {
        var obj = this._getObj(option.data[i], i, 40, option.height);
        this._createChartDiv(obj.id, obj.screen, obj.width, obj.height);
        var datas = [];
        option.keywords.forEach(function (item, index) {
            datas.push({
                value: option.data[i][item],
                name: option.titles[index]
            });
        });
        //鍏ㄧ渷浠芥暟鎹姣旈渶瑕佸娣诲姞涓や釜鍙傛暟
        this._cList.push(me.create3DBar(obj.id, obj.name, datas,
            option.colors, option.showTooltip, option.showLabel, maxNum));
        // if (obj.name == "娌冲寳" || obj.name == "澶╂触") {
        // 	if (App.map.getLevel() > 5) {
        // 		$('#' + obj.id).css("display", "block");
        // 	} else {
        // 		$('#' + obj.id).css("display", "none");
        // 	}
        // }
    }
    this._addTipMapEvent();
    //闃叉ichart鎻愮ず妗嗚閬洊
    $('#chart_div > div').css({'z-index': 'auto'});
    //鍒涘缓鐩戝惉榧犳爣婊戝姩浜嬩欢锛岀敤浜庤В鍐砳chart鎻愮ず妗嗕笉闅愯棌bug
    $('#map').off('mousemove');
    $('#map').on('mousemove', function (event) {
        //鍒ゆ柇褰撳墠鏄惁涓�3d鏌辩姸鍥炬ā寮�
        if ($('.ichartTipDiv').length) {
            event = event ? event : window.event;
            var obj = event.srcElement ? event.srcElement : event.target;
            if ($(obj).is('canvas')) {
                // console.log('鏄痗anvas');
            } else {
                // console.log('.ichartTipDiv闅愯棌');
                $('.ichartTipDiv').css({
                    'display': 'none',
                    'visibility': 'hidden',
                    'opacity': '0'
                });
            }
        } else {
            $('#map').off('mousemove');
        }
    });
};
//绔嬩綋鏌辩姸鍥�
ThreeBarMap.prototype.create3DBar = function (id, name, datas, colors, showTooltip, showLabel, max, max1) {
    var provinceName = name;
    //鏁版嵁鏍煎紡鍖栦负ichart鏁版嵁
    datas = datas.map(function (item, i) {
        var color = colors[i];
        if (item.value == 0) {
            color = 'rgba(0,0,0,0)';
        }
        return {
            value: item.value,
            name: item.name,
            color: color
        }
    });
    // require(["../libs/ichart.min.js"], function (iChart) {
        new iChart.Column3D({
            render: id,
            data: datas,
            padding: 0,
            width: 40,
            height: 60,
            align: 'left',
            offsetx: 0,
            offsety: 0,
            bottom_scale: 1.4,//z杞存繁搴�
            text_space: 999,//鍧愭爣绯讳笅鏂圭殑label璺濈鍧愭爣绯荤殑璺濈銆�
            background_color: 'rgba(0,0,0,0)',
            legend: {
                enable: false,//鍥句緥鏄惁鏄剧ず
            },
            sub_option: {//鏌辩姸鍥炬暟鎹�
                label: {
                    color: 'rgba(0,0,0,0)'
                }
            },
            coordinate: {
                width: 40,
                height: 60,
                gridlinesVisible: false,
                board_deep: 0,//鑳岄潰鍘氬害
                background_color: 'rgba(0,0,0,0)',
                pedestal_height: -20,//搴曢儴鍧愭爣杞撮珮搴�
                scale: [{
                    scale_enable: false,
                    start_scale: 0,
                    end_scale: max//鐪佷唤涔嬮棿鐨勫姣旀寚鏍囩殑瀵规瘮
                }],
                label: {
                    color: 'rgba(0,0,0,0)'
                }

            },
            tip: {//娴姩妗�
                enable: true,
                listeners: {
                    //tip:鎻愮ず妗嗗璞°€乶ame:鏁版嵁鍚嶇О銆乿alue:鏁版嵁鍊笺€乼ext:褰撳墠鏂囨湰銆乮:鏁版嵁鐐圭殑绱㈠紩
                    parseText: function (tip, name, value, text, i) {
                        var unitLeft = '';
                        return provinceName + '<br/>' + name + ":" + value;
                    }
                },
                style: 'margin-left:-200px;border:none;white-space: nowrap;z-index: 9999999;background-color: rgba(50, 50, 50, 0.7);border-radius: 4px;color: rgb(255, 255, 255);font-style: normal;font-variant: normal;font-weight: normal;font-stretch: normal;font-size: 14px;font-family: "Microsoft YaHei";line-height: 21px;padding: 5px;'
            }
        }).draw();

    // });

    return '';
};
ThreeBarMap.prototype._clearAll = function () {
    $("#" + this.layerID).empty();
    this._removeTipMapEvent();
    this._cList.length = 0;
    this._list.length = 0;
};

//---------------------------------鏌辩姸鍥�-------------------------------------------------
/* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
  * map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
  * type锛堝瓧绗︿覆鏍煎紡锛�:閫夋嫨鏄剧ず浠€涔堝浘褰紙濡傦細鏌辩姸鍥撅紝楗肩姸鍥撅級榛樿鏌辩姸鍥撅紱
  * data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
  * layerID锛氬浘灞侷D锛岃嫢鏃犲垯鍙栭粯璁ゅ€�
  * colors锛堟暟缁勬牸寮忥級:鏌辩姸鍥炬煴瀛愮殑棰滆壊,鑻ユ棤鍒欏彇榛樿棰滆壊锛�
  * titles锛堟暟缁勬牸寮忥級锛氳鏄剧ず鏁扮粍鍚嶇О,涓轰繚璇佹暟鎹樉绀洪綈鍏紝寤鸿titles.length涓嶅ぇ浜巏eywords.length锛�
  * keywords锛堟暟缁勬牸寮忥級锛氶€夋嫨鍏抽敭瀛楁墍灞曠ず鐨勬暟鎹嵆涓€涓猚hart琛ㄩ噷鏄剧ず鍑犳潯鏁版嵁锛屽繀椤绘湁锛屼笉鍏佽涓虹┖锛�
  * 						鍦ㄨ幏寰楁暟鎹笉瀛樺湪鏄紝鍧囪澶勭悊涓虹┖瀛楃涓诧紱
  * showTooltip: 甯冨皵鍊�,鏄惁鏄剧ずtooltip;鑻ユ棤鍒欏彇榛樿涓嶆樉绀猴紱
  * showLabel: 甯冨皵鍊�,鏄惁鏄剧ずlabel;鑻ユ棤鍒欏彇榛樿涓嶆樉绀猴紱
  * hasValueAsix锛堝瓧绗︿覆鏍煎紡锛夛細閫夋嫨鏌辩姸鍥剧殑灞曠幇褰㈠紡锛堟暟鍦▁杞存樉绀鸿繕鏄痽杞存樉绀猴級锛岃嫢鏃犲垯榛樿y杞�(鏌辩姸鍥句笓鐢�)锛�
*/
function BarChartMap(map, data, option) {
    this.BarOption = option;
    this.BarOption.map = this.map = map;
    this.BarOption.data = data;
    if (!data || !map) {
        return;
    }
    this.init();

};
BarChartMap.prototype = new ShapeBaseLayer();
BarChartMap.prototype.init = function () {
    this.chartColors = [
        '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],

        this._loadDiv();
    this._createBar();
};
BarChartMap.prototype._createBar = function () {
    var max = this._getMax();
    var me = this, opList = this.BarOption;
    for (var i = 0, c = opList.data.length; i < c; i++) {
        var obj = this._getObj(opList.data[i], i, 30, opList.height);
        this._createChartDiv(obj.id, obj.screen, obj.width, obj.height);
        var titles = opList.titles, datas = [];
        opList.keywords.forEach(function (item) {
            datas.push(opList.data[i][item]);
        });
        this._cList.push(me.createBar(obj.id, titles, obj.name, datas,
            opList.colors, max, opList.showTooltip, opList.showLabel, opList.hasValueAsix));
    }
    this._addTipMapEvent();
}
BarChartMap.prototype.createBar = function (id, titles, name, datas, colors, max, showTooltip, showLabel, hasValueAsix) {
    this.rquireEchart();
    var chart = this.charts.init(document.getElementById(id));
    var c = datas.length;
    if (!colors) {
        colors = [];
        for (var i = 0; i < c; i++) {
            colors.push(this.chartColors[i]);
        }
    }
    var me = this;
    var option = {
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: false
        },
        series: [{
            name: '',
            type: 'bar',
            barWidth: '80%',
            stack: '1',
            data: datas,
            itemStyle: {
                normal: {
                    color: function (params) {
                        return colors[params.dataIndex];
                    },
                    label: {
                        show: false,
                        position: 'top',
                        textStyle: {color: '#800080'}
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.7)'
                }
            }
        }]
    };
    //閫夋嫨鏌辩姸鍥剧殑灞曠幇褰㈠紡
    if (hasValueAsix && hasValueAsix.toLowerCase() == 'x') {
        option.xAxis = [{
            type: 'value',
            show: false
        }];
        option.yAxis = [{
            show: false,
            data: titles
        }];
    } else {
        option.yAxis = [{
            type: 'value',
            show: false
        }];
        option.xAxis = [{
            show: false,
            data: titles
        }];
    }
    if (showLabel) {
        option.series[0].itemStyle.normal.label.show = true;
    }

    if (showTooltip) {
        this.addTooltip(option, name);
    }

    chart.setOption(option);
    chart.sid = id;
    //this.addEvent(id, chart);

    return chart;
};


function LineMapLayer(map) {
    this.map = map;
    this.windowResizeTimer = null;
    this.myChart = null;
}
LineMapLayer.prototype.addLayer = function () {
    var me = this, option = this.option;
    require(["../libs/echarts.source.js", "../libs/EchartsLayer.js", "dojo/domReady!"],
        function (echart, EchartsLayer) {
            var overlay = new EchartsLayer(option.map, echarts);
            var chartsContainer = overlay.getEchartsContainer();
            me.myChart = overlay.initECharts(chartsContainer);
            me.overlay = overlay;
            me.windowResize();
            //			window.onresize = this.myChart.onresize;
            me.loadLayer();
        });
};
LineMapLayer.prototype.removeMapLayer = function () {
    $('#sheXianID').remove();
};
LineMapLayer.prototype.windowResize = function () {
    var me = this;
    window.addEventListener('resize', function () {
        clearTimeout(me.windowResizeTimer);
        me.windowResizeTimer = setTimeout(function () {
            $('#sheXianID').css({
                'width': '100%',
                'height': '100%'
            });
            me.myChart.resize();
        }, 300);
    });
}
//---------------------------------灏勭嚎鍥�---------------------------------------------------

/* 鍒涘缓灏勭嚎鍥撅紝浜嬩欢瑙﹀彂鍦╝pp.js閲�
**** EchartsLayer鍙€傜敤浜巈charts鐗堟湰2锛�(echarts鐗堟湰2鐨勭ず渚嬪湴鍧€锛坔ttp://echarts.baidu.com/echarts2/doc/example.html锛夛紱)
* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
* data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
* title锛氭爣棰橈紝鏁扮粍鏍煎紡锛屼唬琛ㄥ惈涔夊涓嬶細 ['鏍囬','鏄惁鏄剧ず鏍囬','鏍囬瀛椾綋棰滆壊','鏍囬瀛椾綋','鏍囬瀛椾綋澶у皬 14']銆�
*       title[0]:琛ㄧず鏍囬锛岃嫢鏃犻粯璁や负绌猴紱
* 	    title[1]锛堝竷灏斿€硷級:琛ㄧず鏄惁鏄剧ず鏍囬锛岃嫢鏃犻粯璁や负涓嶆樉绀篺alse锛�
* 		title[2]:琛ㄧず鏍囬瀛椾綋棰滆壊锛岃嫢鏃犻粯璁や负鐧借壊锛�
*       title[3]:琛ㄧず鏍囬瀛椾綋锛岃嫢鏃犻粯璁や负寰蒋闆呴粦锛�
*       title[4]:琛ㄧず鏍囬瀛椾綋澶у皬锛岃嫢鏃犻粯璁や负14px锛�
* titlePoition/legendPosition:鏍囬浣嶇疆/鍥句緥浣嶇疆锛屼粎鏀寔'center','left','right'(涓嶅尯鍒嗗ぇ灏忓啓)鍜屾暟瀛�,榛樿'center'锛�
* legend:鍥句緥锛屾暟缁勬牸寮忥紝浠ｈ〃鍚箟锛歔'姘村钩/绔栫洿浣嶇疆','鏄惁鏄剧ず鍥句緥'];
*        legend[0]:鍥句緥鏄按骞充綅缃繕鏄瀭鐩翠綅缃紝浠呮敮鎸�'vertical','horizontal';
*  	  	 legend[1]锛堝竷灏斿€硷級:鏄惁鏄剧ず鍥句緥锛岄粯璁や笉鏄剧ずfalse锛�
* legendData锛氬浘渚嬫暟鎹紝鏁扮粍鏍煎紡锛涗笉鏄暟缁勬牸寮忥紝鍒欏彇绌烘暟缁�;
* effectIsShow锛堝竷灏斿€硷級锛氭槸鍚﹀紑鍚偒鍏夌壒鏁堬紝榛樿寮€鍚紱
* markPointColor锛氭爣娉ㄧ偣鐨勯鑹诧紱
* */

function sheXian(map, data, op) {
    this.option = op;
    this.option.data = data;
    this.option.map = map;
    LineMapLayer.call(this);
    this.init();
}
sheXian.prototype = new LineMapLayer();
sheXian.prototype.init = function () {
    this.addLayer();
};
sheXian.prototype.loadLayer = function () {
    var me = this;
    var op = this.option;
    var titlePosition = ['left', 'center', 'right'], legendPosition = ['left', 'center', 'right'];
    var option = {//鍏蜂綋鐨勯厤缃弬鏁拌鍙傝€僥chart鐗堟湰2锛屾鏂规硶鏆傛椂鍙敮鎸乪chart鐗堟湰2
        title: {
            show: (typeof (op.title[1]) == 'undefined') ? false : op.title[1],//甯冨皵鍊�
            text: op.title[0] ? op.title[0] : '',
            x: (function () {
                if (titlePosition.indexOf(op.titlePoition) > -1 || typeof (op.titlePoition) == number) {
                    op.titlePoition = op.titlePoition;
                } else {
                    op.titlePoition = 'center';
                }
                return op.titlePoition;
            })(),
            textStyle: {
                color: op.title[2] ? op.title[2] : '#fff',
                fontFamily: op.title[3] ? op.title[3] : 'Microsoft Yahei',
                fontSize: op.title[4] ? op.title[4] : 14
            }
        },
        //tooltip:{
        //show:true
        //},
        legend: {
            show: (typeof (op.legend[1]) == 'undefined') ? false : op.legend[1],
            orient: ['vertical', 'horizontal'].indexOf(op.legend[0]) > -1 ? op.legend[0] : 'horizontal',
            x: (function () {
                if (titlePosition.indexOf(op.legendPosition.toLowerCase()) > -1) {
                    op.legendPosition = op.legendPosition.toLowerCase();
                } else if (typeof (op.legendPosition) == number) {
                    op.legendPosition = op.legendPosition;
                } else {
                    op.legendPosition = 'center';
                }
                return op.legendPosition;
            })(),
            data: Array.isArray(op.legendData) ? Array.isArray(op.legendData) : [],
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: "",
            type: 'map',
            mapType: 'none',
            data: [{}],
            markLine: {
                smooth: (typeof (op.markLineSmooth) == 'undefined') ? false : op.markLineSmooth,
                effect: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    show: (typeof (op.effectIsShow) == 'undefined') ? true : op.effectIsShow,
                    period: 40,
                    scaleSize: 1,//鏀惧ぇ鍊嶆暟锛�
                    shadowBlur: 10
                },
                large: true,
                smoothness: 0.1,
                symbol: ['none', 'none'],
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        lineStyle: {
                            type: 'solid',
                            color: op.lineColor ? op.lineColor : 'blue',
                            shadowBlur: 10
                        }
                    }
                },
                data: []
            },
            markPoint: {
                effect: {
                    show: true,
                    shadowBlur: 10
                },
                symbol: (typeof (op.markPointSymbol) == 'undefined') ? 'circle' : op.markPointSymbol,
                symbolSize: function (v) {
                    var size = (typeof (op.markPointSymbolSize) == 'undefined') ? 1.5 : op.markPointSymbolSize;
                    return size;
                },
                effect: {
                    show: (typeof (op.markPointEffectShow) == 'undefined') ? false : op.markPointEffectShow,
                    shadowBlur: (typeof (op.markPointEffectBlur) == 'undefined') ? 0 : op.markPointEffectBlur,
                },
                itemStyle: {
                    normal: {
                        color: (typeof (op.markPointColor) == 'undefined') ? 'rgba(255,0,0,0.5)' : op.markPointColor
                    }
                },
                data: []
            }
        }]
    };


    var data = op.data;
    for (var key in op.data) {
        data[key].forEach(function (value, index) {
            data[key][index].num = Number(value.num);
        })
    }
    option.series[0].markLine.data = data.allLine.sort(function (a, b) {
        return b.num - a.num
    }).slice(0).map(function (line) {
        return [{
            geoCoord: line.startCenter
        }, {
            geoCoord: line.endCenter
        }]
    });

    option.series[0].markPoint.data = data.mainStartCity.map(function (point) {
        return {
            geoCoord: [point.X, point.Y]//getGeoCoord(point.name)
        }
    });
    me.overlay.setOption(option);
};

/* 鍒涘缓灏勭嚎鍥�
**** EchartsLayer鍙€傜敤浜巈charts鐗堟湰2锛�
* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
* cityData:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
* title锛氭爣棰橈紝鏁扮粍鏍煎紡锛屼唬琛ㄥ惈涔夊涓嬶細 ['鏍囬','鏄惁鏄剧ず鏍囬','鏍囬瀛椾綋棰滆壊','鏍囬瀛椾綋','鏍囬瀛椾綋澶у皬 14']銆�
*       title[0]:琛ㄧず鏍囬锛岃嫢鏃犻粯璁や负绌猴紱
* 	    title[1]锛堝竷灏斿€硷級:琛ㄧず鏄惁鏄剧ず鏍囬锛岃嫢鏃犻粯璁や负涓嶆樉绀篺alse锛�
* 		title[2]:琛ㄧず鏍囬瀛椾綋棰滆壊锛岃嫢鏃犻粯璁や负鐧借壊锛�
*       title[3]:琛ㄧず鏍囬瀛椾綋锛岃嫢鏃犻粯璁や负寰蒋闆呴粦锛�
*       title[4]:琛ㄧず鏍囬瀛椾綋澶у皬锛岃嫢鏃犻粯璁や负14px锛�
* titlePoition/legendPosition:鏍囬浣嶇疆/鍥句緥浣嶇疆锛屼粎鏀寔'center','left','right'(涓嶅尯鍒嗗ぇ灏忓啓)鍜屾暟瀛�,榛樿'center'锛�
* legend:鍥句緥锛屾暟缁勬牸寮忥紝浠ｈ〃鍚箟锛歔'姘村钩/绔栫洿浣嶇疆','鏄惁鏄剧ず鍥句緥'];
*        legend[0]:鍥句緥鏄按骞充綅缃繕鏄瀭鐩翠綅缃紝浠呮敮鎸�'vertical','horizontal';
*  	  legend[1]锛堝竷灏斿€硷級:鏄惁鏄剧ず鍥句緥锛岄粯璁や笉鏄剧ずfalse锛�
* legendData锛氬浘渚嬫暟鎹紝鏁扮粍鏍煎紡锛涗笉鏄暟缁勬牸寮忥紝鍒欏彇绌烘暟缁勶紱
*                echarts鐗堟湰2鐨勭ず渚嬪湴鍧€锛坔ttp://echarts.baidu.com/echarts2/doc/example.html锛夛紱
* showData:闇€瑕佸湪鍦板浘涓婃樉绀虹殑鏁版嵁;
* showCityData:鍦板浘涓婇渶瑕佹樉绀哄煄鍚嶇О锛�
* lineColor:灏勭嚎鐨勯鑹诧紱
* effectIsShow锛堝竷灏斿€硷級锛氭槸鍚﹀紑鍚偒鍏夌壒鏁堬紝榛樿寮€鍚紱
* labelIsShow锛堝竷灏斿€硷級:绾挎梺杈圭殑鏁板瓧鏄惁鏄剧ず锛�
* */
function sheXian2(map, data, op) {
    this.option = op;
    this.option.data = data;
    this.option.map = map;
    this.init();
};
sheXian2.prototype = new LineMapLayer();
sheXian2.prototype.init = function () {
    this.addLayer();
};
sheXian2.prototype.loadLayer = function () {
    var me = this, op = this.option;

    var titlePosition = ['left', 'center', 'right'],
        legendPosition = ['left', 'center', 'right'];
    var seriesData;
    var dataArr = {};
    for (item in op.data) {
        var itemA = op.data[item];
        dataArr[item] = [itemA[0][0].X, itemA[0][0].Y];
        for (var i = 0; i < itemA.length; i++) {
            dataArr[itemA[i][1].name] = [itemA[i][1].X, itemA[i][1].Y];
        }
    }

    seriesData = [{
        type: 'map',
        mapType: 'none',
        data: [],
        markLine: {
            smooth: false,
            symbol: ['circle', 'circle'],
            symbolSize: 1,
            itemStyle: {
                normal: {
                    color: '#fff',
                    borderWidth: 1,
                    borderColor: 'rgba(30,144,255,0.5)',
                    lineStyle: 'solid',
                    label: {
                        show: typeof (op.labelIsShow) == 'undefined' ? false : op.labelIsShow
                    }
                }
            },
            data: op.data,
        },
        geoCoord: dataArr
    }];
    /*
	 * 杩欐寰幆鐨勯€昏緫锛�
	 * 1.showCityData涓哄湪鍦板浘闇€瑕佹樉绀虹殑鍩庡悕绉帮紝鐢眘howCityData妫€娴媠howData鑾峰緱鏁版嵁锛�
	 * 2.鐢眘howCityData鍐冲畾鏄剧ず鍝簺鍩庣殑鏁版嵁锛�
	 * */
    for (var i = 0, len = op.showCityData.length; i < len; i++) {
        var item = op.showCityData[i];

        seriesData.push({
            name: item,
            type: 'map',
            mapType: 'none',
            data: [],
            markLine: {
                smooth: false,//骞虫粦鏇茬嚎鏄剧ず,甯冨皵鍊�
                symbol: ['circle', 'circle'],
                symbolSize: 1,
                effect: {
                    show: (typeof (op.effectIsShow) == 'undefined') ? true : op.effectIsShow,
                    scaleSize: 1,//鏀惧ぇ鍊嶆暟锛�
                    period: 30,//杩愬姩鍛ㄦ湡
                    color: '#fff',
                    shadowBlur: 10
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        lineStyle: {
                            type: 'solid',
                            color: op.lineColor ? op.lineColor : 'blue',
                            shadowBlur: 10
                        },
                        label: {
                            show: typeof (op.labelIsShow) == 'undefined' ? false : op.labelIsShow
                        }
                    }
                },
                data: op.data[item]
            }
        });
    }

    var option = {
        title: {
            show: (typeof (op.title[1]) == 'undefined') ? false : op.title[1],//甯冨皵鍊�
            text: op.title[0] ? op.title[0] : '',
            x: (function () {
                if (titlePosition.indexOf(op.titlePoition) > -1 || typeof (op.titlePoition) == number) {
                    op.titlePoition = op.titlePoition;
                } else {
                    op.titlePoition = 'center';
                }
                return op.titlePoition;
            })(),
            textStyle: {
                color: op.title[2] ? op.title[2] : '#fff',
                fontFamily: op.title[3] ? op.title[3] : 'Microsoft Yahei',
                fontSize: op.title[4] ? op.title[4] : 14
            }
        },
        tooltip: {
            show: (typeof (op.tooltipIsShow) == 'undefined') ? false : op.tooltipIsShow,
            trigger: 'item',
            // formatter: '{b}'
        },
        legend: {
            show: (typeof (op.legend[1]) == 'undefined') ? false : op.legend[1],
            orient: (['vertical', 'horizontal'].indexOf(op.legend[0]) > -1) ? op.legend[0] : 'horizontal',
            x: (function () {
                if (titlePosition.indexOf(op.legendPosition.toLowerCase()) > -1) {
                    op.legendPosition = op.legendPosition.toLowerCase();
                } else if (typeof (op.legendPosition) == number) {
                    op.legendPosition = op.legendPosition;
                } else {
                    op.legendPosition = 'center';
                }
                return op.legendPosition;
            })(),
            data: Array.isArray(op.legendData) ? Array.isArray(op.legendData) : [],
            selectedMode: 'single',
            textStyle: {
                color: '#fff'
            }
        },
        series: seriesData
    }
    me.overlay.setOption(option);
};

//----------------------------------闂儊鐐瑰浘-----------------------------------------------
/* 鍒涘缓灏勭嚎鍥撅紝浜嬩欢瑙﹀彂鍦╝pp.js閲�
**** EchartsLayer鍙€傜敤浜巈charts鐗堟湰2锛�
*   (echarts鐗堟湰2鐨勭ず渚嬪湴鍧€锛坔ttp://echarts.baidu.com/echarts2/doc/example.html锛夛紱)
*
* 浠ヤ笅鏄鍙傛暟杩涜璇存槑锛�
* map锛堝瓧绗︿覆鏍煎紡锛�:Arcgis map锛屼笉鍏佽涓虹┖,涓虹┖鐩存帴reutrn;
* data:鎵€闇€瑕佺殑鏁版嵁JSON锛屼负绌虹洿鎺eutrn锛�
* title锛氭爣棰橈紝鏁扮粍鏍煎紡锛屼唬琛ㄥ惈涔夊涓嬶細 ['鏍囬','鏄惁鏄剧ず鏍囬','鏍囬瀛椾綋棰滆壊','鏍囬瀛椾綋','鏍囬瀛椾綋澶у皬 14']銆�
*       title[0]:琛ㄧず鏍囬锛岃嫢鏃犻粯璁や负绌猴紱
* 	    title[1]锛堝竷灏斿€硷級:琛ㄧず鏄惁鏄剧ず鏍囬锛岃嫢鏃犻粯璁や负涓嶆樉绀篺alse锛�
* 		title[2]:琛ㄧず鏍囬瀛椾綋棰滆壊锛岃嫢鏃犻粯璁や负鐧借壊锛�
*       title[3]:琛ㄧず鏍囬瀛椾綋锛岃嫢鏃犻粯璁や负寰蒋闆呴粦锛�
*       title[4]:琛ㄧず鏍囬瀛椾綋澶у皬锛岃嫢鏃犻粯璁や负14px锛�
* titlePoition/legendPosition:鏍囬浣嶇疆/鍥句緥浣嶇疆锛屼粎鏀寔'center','left','right'(涓嶅尯鍒嗗ぇ灏忓啓)鍜屾暟瀛�,榛樿'center'锛�
* legend:鍥句緥锛屾暟缁勬牸寮忥紝浠ｈ〃鍚箟锛歔'姘村钩/绔栫洿浣嶇疆','鏄惁鏄剧ず鍥句緥'];
*        legend[0]:鍥句緥鏄按骞充綅缃繕鏄瀭鐩翠綅缃紝浠呮敮鎸�'vertical','horizontal';
*  	  	 legend[1]锛堝竷灏斿€硷級:鏄惁鏄剧ず鍥句緥锛岄粯璁や笉鏄剧ずfalse锛�
* legendData锛氬浘渚嬫暟鎹紝鏁扮粍鏍煎紡锛涗笉鏄暟缁勬牸寮忥紝鍒欏彇绌烘暟缁�;
* effectIsShow锛堝竷灏斿€硷級锛氭槸鍚﹀紑鍚偒鍏夌壒鏁堬紝榛樿寮€鍚紱
* markPointColor锛氭爣娉ㄧ偣鐨勯鑹诧紱
* baseColor:鐐瑰浘鎵€浣跨敤鐨勯鑹� 锛岃嫢鏃犲垯浣跨敤榛樿棰滆壊锛�
* */
function TwinkleDotsMapLayer(map, data, op) {
    this.option = op || {};
    this.option.data = data;
    this.option.map = map;
    this.init();
};
TwinkleDotsMapLayer.prototype = new LineMapLayer();
TwinkleDotsMapLayer.prototype.init = function () {
    this.addLayer();
    //	this.loadLayer();
};
TwinkleDotsMapLayer.prototype.loadLayer = function () {
    var me = this, op = this.option;
    if (!op.data || op.data.length <= 0) {
        return;
    }
    var titlePosition = ['left', 'center', 'right'], legendPosition = ['left', 'center', 'right'];
    var option = {
        // color: op.baseColor ? op.baseColor :
        //        ['rgba(255, 0, 0, 0.8)', 'rgba(14, 241, 242, 0.8)', 'rgba(37, 140, 249, 0.8)'],
        title: {
            show: (typeof (op.title[1]) == 'undefined') ? false : true,//甯冨皵鍊�
            text: op.title[0] ? op.title[0] : '',
            x: (function () {
                if (titlePosition.indexOf(op.titlePoition) > -1 || typeof (op.titlePoition) == number) {
                    op.titlePoition = op.titlePoition;
                } else {
                    op.titlePoition = 'center';
                }
                return op.titlePoition;
            })(),
            textStyle: {
                color: op.title[2] ? op.title[2] : '#fff',
                fontFamily: op.title[3] ? op.title[3] : 'Microsoft Yahei',
                fontSize: op.title[4] ? op.title[4] : 14
            }
        },
        legend: {
            show: (typeof (op.legend[1]) == 'undefined') ? false : true,
            orient: ['vertical', 'horizontal'].indexOf(op.legend[0]) > -1 ? op.legend[0] : 'horizontal',
            x: (function () {
                if (titlePosition.indexOf(op.legendPosition.toLowerCase()) > -1) {
                    op.legendPosition = op.legendPosition.toLowerCase();
                } else if (typeof (op.legendPosition) == number) {
                    op.legendPosition = op.legendPosition;
                } else {
                    op.legendPosition = 'center';
                }
                return op.legendPosition;
            })(),
            data: Array.isArray(op.legendData) ? Array.isArray(op.legendData) : [],
            selectedMode: 'single',
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: op.legendData[0],
                type: 'map',
                mapType: 'none',
                data: [],
                markPoint: {
                    symbolSize: 2,
                    large: true,
                    effect: {
                        show: true
                    },

                    data: (function () {
                        var data = [];
                        var len = op.data.length;
                        while (len--) {
                            data.push({
                                name: op.data[len].name,
                                value: op.data[len].value,
                                geoCoord: [op.data[len].X, op.data[len].Y]
                            })
                        }
                        return data;
                    })(),
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,0,0,0.8)'
                        }
                    },
                }
            }, {
                name: op.legendData[1],
                type: 'map',
                mapType: 'none',
                data: [],
                markPoint: {
                    symbolSize: 2,
                    large: true,
                    effect: {
                        show: true
                    },

                    data: (function () {
                        var data = [];
                        var len = op.data.length;
                        var geoCoord;
                        while (len--) {
                            data.push({
                                name: op.data[len].name,
                                value: op.data[len].value,
                                geoCoord: [op.data[len].X, op.data[len].Y]
                            })
                        }
                        return data;
                    })(),
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,134,255,0.8)'
                        }
                    },
                }
            }
        ]
    };
    me.overlay.setOption(option);
};

//------------------------------------TimeLine鏃堕棿杞�-------------------------------------------------
/***
 *  闇€瑕侀厤鍚堝悓鐩綍涓媍ss鏂囦欢锛宨mg鏂囦欢鏄剧ず鏃堕棿杞存牱寮忋€�
 *
 *  璋冪敤鐢熸垚鏃堕棿杞寸殑鏂规硶锛�
 *  ele锛堝厓绱犺妭鐐癸級鍙傛暟锛氫竴涓鍣ㄥ厓绱狅紙jQuery瀵硅薄鍏冪礌锛夛紝灏嗙敓鎴愮殑鏃堕棿杞存斁鍏ュ鍣ㄤ腑銆傝33琛�;
 *  times锛堟暟缁勶級鍙傛暟锛氭暟缁勬瘡涓€椤瑰搴旀椂闂磋酱鐨勪竴涓妭鐐�
 *    渚嬶細[2013,2014,2015,2016,2017,2018]
 *       ['2013/6','2014/6','2015/6','2016/6','2017/6','2018/6'];
 *
 *  鏁扮粍姣忎竴椤瑰缓璁唴瀹逛笉瑕佽繃闀匡紝浼氬奖鍝嶇敓鎴愮殑鏃堕棿杞存牱寮忋€�
 *
 */
// 鍒涘缓鏃堕棿杞存柟娉�
var timePlay; //鑷姩鎾斁鐨勮鏃跺櫒
function CreateTimeAxis(ele, times) {
    clearInterval(timePlay);
    if (times.length > 5) {
        var num = 27;
    } else {
        var num = Math.floor((265 - 32 * times.length) / (times.length - 1));
        // console.log(num);
    }
    var html = '<div id="timeLineDiv" class="timeLine">';
    html += '<div class="btn-left"></div>';
    html += '<div class="container"><ul class="years" style="margin-left:0px;">';
    times.forEach(function (item) {
        html = html + '<li style="margin-right:' + num + 'px">' + item + '</li>';
    });
    html += '</ul><div class="line"></div></div><div class="btn-right"></div><div class="btn-play"></div></div>';
    ele.append(html);
    console.log(html);
    $(".timeLine .years li:last").addClass("selected");
    if (times.length > 5) {
        $(".timeLine .years").css("margin-left", -(times.length - 5) * 59);
    }

    //鏃堕棿杞翠簨浠�
    $(".timeLine .years li").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(this).index();
        if (index > 4) {
            $(".timeLine .years").css("margin-lfet", -(index - 4) * 59);
        } else {
            $(this).parent().css("margin-left", 0);
        }
    });

    //宸︾偣鍑讳簨浠�
    $(".timeLine .btn-left").click(function () {
        var index = $(".timeLine .years li.selected").index();
        var max_left = times.length - 5 > 0 ? (times.length - 5) * 59 : 0;
        if (index > 4) {
            $(".timeLine .years li.selected").removeClass("selected").prev().addClass("selected");
            var left = $(".timeLine .years").css("margin-left").replace("px", "");
            console.log(left);
            $(".timeLine .years").css("margin-left", -(index - 5) * 59);
        } else if (index == 0) {
            $(".timeLine .years li.selected").removeClass("selected");
            $(".timeLine .years li:last").addClass("selected");
            $(".timeLine .years").css("margin-left", -max_left + 'px');
        } else {
            $(".timeLine .years li.selected").removeClass("selected").prev().addClass("selected");
        }
    });

    //鍙崇偣鍑讳簨浠�
    $(".timeLine .btn-right").click(function () {
        var index = $(".timeLine .years li.selected").index();
        if (index == times.length - 1) {
            $(".timeLine .years li.selected").removeClass("selected");
            $(".timeLine .years li:first").addClass("selected");
            $(".timeLine .years").css("margin-left", "0");
        } else if (index >= 4) {
            $(".timeLine .years li.selected").removeClass("selected").next().addClass("selected");
            $(".timeLine .years").css("margin-left", -(index - 3) * 59);
            console.log($(".timeLine .years").css("margin-left"));
        } else {
            $(".timeLine .years li.selected").removeClass("selected").next().addClass("selected");
        }
    });

    $(".timeLine .btn-play").click(function () {
        if ($(this).hasClass("selected")) {
            //鍋滄鑷姩鎾斁
            console.log("鍋滄鎾斁");
            $(this).removeClass("selected");
            $(".timeLine .years li.selected").removeClass("selected");
            $(".timeLine .years li:last").addClass("selected");
            if (times.length > 5) {
                $(".timeLine .years").css("margin-left", -(times.length - 5) * 59);
            }
            ;
            clearInterval(timePlay);
        } else {
            //寮€濮嬭嚜鍔ㄦ挱鏀�
            // console.log("鑷姩鎾斁");
            $(this).addClass("selected");
            $(".timeLine .btn-right").click();
            timePlay = setInterval(function () {
                $(".timeLine .btn-right").click();
            }, 3000);
        }
    });
};


//----------------------------------椋庡悜椋庡姏鍥�-----------------------------------------------
/***
 *  闇€瑕侀厤鍚堝悓鐩綍涓媍ss鏂囦欢锛宨mg鏂囦欢鏄剧ず榛樿鍥炬爣鏍峰紡銆�
 *  option鐨勫€间负    map锛歺xx   琛ㄧず椋庡悜鍥惧熀浜庣殑鍦板浘銆�
 *            direction锛� 0-360  鎺ユ敹涓€涓暟鍊兼鍖楁柟鍚戜负0锛岄『鏃堕拡閫掑
 *            power锛�1-9锛� 琛ㄧず椋庡姏
 *                areaname锛� 鍦板潃鍊�  閫氳繃鍦板潃鍊兼煡鎵剧粡绾害鏂瑰悜銆�
 *            areatype; 0,1 0浠ｈ〃鐪侊紝1浠ｈ〃甯�
 */
function Windmap(map, data, option) {
    this.option = option || {};
    this._map = map;
    this.data = data || {};
    this.init();
    this.addlenged();
};
Windmap.prototype.init = function () {
    var map = this._map;
    var me = this;
    for (var i = 0; i < this.data.length; i++) {
        var direction = this.tranfrom(this.data[i].direction);
        var power = this.data[i].power;
        require(["esri/SpatialReference", "esri/layers/GraphicsLayer", "esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "esri/graphic"],
            function (SpatialReference, GraphicsLayer, PictureMarkerSymbol, Point, Graphic) {

                var marker = new PictureMarkerSymbol("../img/banner" + power + ".png", 21, 28);
                marker.setAngle(direction);
                //澹版槑鍜屽浘褰�
                var graphicsLayer = new GraphicsLayer();
                //娣诲姞绗竴涓偣鍥惧舰
                var point = new Point({
                    "x": me.data[i].point.X,
                    "y": me.data[i].point.Y,
                    "spatialReference": new SpatialReference(4326),
                });
                var graphic = new Graphic(point, marker);
                graphicsLayer.add(graphic);
                map.addLayer(graphicsLayer);
            });
    }
};
Windmap.prototype.addlenged = function () {
    var mapid = "#" + this._map.id;

    var html = '<ul style="list-style: none; padding:11px; margin:0px; width: 105px;height: 200px; font-size: 14px; " >' +
        '<li style="margin:0px 0px 10px 30px ;font-size: 20px; ">鍥句緥</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #A0E696;"></span>&nbsp;1绾�&nbsp;&nbsp;&nbsp&nbsp</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #40D52A;"></span>&nbsp;2绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #00CA9F;"></span>&nbsp;3绾�&nbsp;&nbsp;&nbsp&nbsp</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #00B7CA;"></span>&nbsp;4绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #0089CA;"></span>&nbsp;5绾�&nbsp;&nbsp;&nbsp&nbsp</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #0058CA;"></span>&nbsp;6绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #0058CA;"></span>&nbsp;7绾�&nbsp;&nbsp;&nbsp&nbsp</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #7200BB;"></span>&nbsp;8绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #B600AA;"></span>&nbsp;9绾�&nbsp;&nbsp;&nbsp&nbsp</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #ED0086;"></span>&nbsp;10绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #F15300;"></span>&nbsp;11绾�&nbsp;&nbsp;</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #F18700;"></span>&nbsp;12绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #F5A623;"></span>&nbsp;13绾�&nbsp;&nbsp;</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background:	#E84B4B;"></span>&nbsp;14绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #E50621;"></span>&nbsp;15绾�&nbsp;&nbsp;</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #B20318;"></span>&nbsp;16绾�</li>' +
        '<li style="float: left;"><span style="display: inline-block; width: 12px; height: 12px;background: #68010E;"></span>&nbsp;17&nbsp;&nbsp;</li></ul>';


    var div = '<div id="div" style="position:absolute">' + html + '</div>';
    $(mapid).append(div);
    $("#div").css({

        "right": "10px",
        "bottom": "10px",
        "z-index": 10,
        "background": "#fff"
    });
};
Windmap.prototype.removelenged = function () {
    $("#div").remove();//绉婚櫎鍥句緥
};
Windmap.prototype.tranfrom = function (str) {
    var directiontranfrom = [{"name": "鍖�", "angle": 0}, {"name": "鍖椾笢鍖�", "angle": 22.5}, {
        "name": "涓滃寳",
        "angle": 45
    }, {"name": "涓滀笢鍖�", "angle": 67.5},
        {"name": "涓�", "angle": 90}, {"name": "涓滀笢鍗�", "angle": 112.5}, {"name": "涓滃崡", "angle": 135}, {
            "name": "鍗椾笢鍗�",
            "angle": 157.5
        },
        {"name": "鍗�", "angle": 180}, {"name": "鍗楄タ鍗�", "angle": 202.5}, {"name": "瑗垮崡", "angle": 225}, {
            "name": "瑗胯タ鍗�",
            "angle": 247.5
        },
        {"name": "瑗�", "angle": 270}, {"name": "瑗胯タ鍖�", "angle": 292.5}, {"name": "瑗垮寳", "angle": 315}, {
            "name": "鍖楄タ鍖�",
            "angle": 337.5
        }];
    for (var i = 0; i < directiontranfrom.length; i++) {
        if (str == directiontranfrom[i].name) {
            return directiontranfrom[i].angle;
        }
    }
};



//-----------------TestLine-----------------澶氱偣杩佸緳绾垮浘-----------------------------------------------
function TestLine(map,data,option){
    //1.楠岃瘉鏁版嵁
    //2.鍒涘缓div
    //3.鍒濆鍖栥€佺粦瀹氫簨浠�
    if(!map || !data){
        return;
    }
    this.option = option || {};
    this.data = data || {};
    this._map =  map;
    var id = document.getElementById("canvasDiv");
    if(!id){//鍒涘缓鏀炬樉绀烘晥鏋滅殑div
        var div = document.createElement("div");
        div.id = "canvasDiv";
        div.style.position = "absolute";
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();
}
TestLine.prototype.init = function (){
    this.getCanvasLine = document.getElementById("canvasLine");
    if(!this.getCanvasLine){
        $("#canvasDiv").append("<canvas id = 'canvasLine' width = "
        + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() +'></canvas>');
        this.getCanvasLine = document.getElementById("canvasLine");
        this.getCanvasLine.style.position = "absolute";
        this.getCanvasLine.style.top = 0;
        this.getCanvasLine.style.left = 0;
    };
    this.getCanvasPathPoint = document.getElementById("canvasPathPoint");
    if(!this.getCanvasPathPoint){
        $("#canvasDiv").append("<canvas id = 'canvasPathPoint' width = "
            + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasPathPoint = document.getElementById("canvasPathPoint");
        this.getCanvasPathPoint.style.position = "absolute";
        this.getCanvasPathPoint.style.top = 0;
        this.getCanvasPathPoint.style.left = 0;
    }
    var me = this;

    this._map.on("load",function(){//浜嬩欢鐩戞帶
        me.drawLine();
        // me.drawPathPoint();
    });
    this._map.on("pan-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
        var ctx2 = me.getCanvasPathPoint.getContext("2d");
        ctx2.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("pan-end",function(e){
        me.drawLine();
        // me.drawPathPoint();
    });
    this._map.on("zoom-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
        var ctx2 = me.getCanvasPathPoint.getContext("2d");
        ctx2.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("zoom-end",function(e){
        me.drawLine();
        // me.drawPathPoint();
    });
}
TestLine.prototype.getxy = function(X,Y){
    var point = new esri.geometry.Point(X,Y);
    var screenPoint = this._map.toScreen(point);
    return{x:screenPoint.x,y:screenPoint.y};
};
TestLine.prototype.drawLine = function (){
    var path = this.data;
    var me = this;
    var width = $("#canvasDiv").width();
    var height = $("#canvasDiv").height();
    var context = this.getCanvasLine.getContext("2d");
    for(var i = 0;i < path.length;i++)
    {
        var startxy = me.getxy( path[i].start.X,path[i].start.Y);
        var endxy = me.getxy(path[i].end.X,path[i].end.Y);
        context.beginPath();

        context.moveTo(startxy.x,startxy.y);//鐢荤嚎骞惰繘琛屽～鍏�
        context.lineTo(endxy.x,endxy.y);
        context.lineWidth = 0.6;//绾挎潯瀹藉害
        context.strokeStyle = "rgba(254,49,100,1)";
        context.stroke();

        context.arc(startxy.x,startxy.y,1.3,0,Math.PI * 2);//鐢荤偣骞惰繘琛屽～鍏�
        context.arc(endxy.x,endxy.y,1.3,0,Math.PI * 2);
        context.fillStyle = "rgba(250,250,250,0.2)"
        context.fill();
    }
};

TestLine.prototype.drawPathPoint = function(){
    var me = this;
    var path = this.data; 
    var width = $("#canvasDiv").width();
    var height = $("#canvasDiv").height();
    var context = this.getCanvasPathPoint.getContext("2d");
    var pathse = [];
    var pathpoint = [];
    var distance = [];
    for(var i = 0;i < path.length;i++){
        var startxy = me.getxy(path[i].start.X,path[i].start.Y);
        var endxy = me.getxy(path[i].end.X,path[i].end.Y);
        var ly = endxy.y - startxy.y;
        var lx = endxy.x - startxy.x;
        var l = Math.pow((ly * ly + lx * lx),0.5);//涓ょ偣涔嬮棿鐨勮矾寰勮窛绂�
        pathpoint.push(startxy);
        distance.push(0);
        pathse.push({start:{x:startxy.x,y:startxy.y},l:l,ly:ly,lx:lx});
    }
    var drawpoint = function(){
        if(pathpoint){
            for(var i = 0;i < pathpoint.length;i++){
                if (distance[i] > pathse[i].l) {
                    distance[i] = 0;
                    pathpoint[i].y = pathse[i].start.y;
                    pathpoint[i].x = pathse[i].start.x;
                    continue;
                } else {
                    distance[i] += pathse[i].l / 300;
                    pathpoint[i].y = (pathse[i].ly / pathse[i].l) * distance[i] + pathse[i].start.y;
                    pathpoint[i].x = (pathse[i].lx / pathse[i].l) * distance[i] + pathse[i].start.x;

                    context.beginPath();
                    context.arc(pathpoint[i].x, pathpoint[i].y, 0.8, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(250,250,250,0.8)'; //棰滆壊
                    context.fill();
                }
            }
        }
    }
    var render = function (ctx) {
        var prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = prev;
        drawpoint();
    }
    
    this.timer2 = requestAnimationFrame(function fn() {
        render(context);
        me.timer2 = requestAnimationFrame(fn);
    });

}

//-----------------carMove----------------杞﹁締杞ㄨ抗鍥�---------------------------------------
var radius = 2.5;
function  CarMove(map,data,option) {
    if(!map || !data){      //鍏堥獙璇佹暟鎹槸鍚﹀瓨鍦�
        return;
    }
    this.option = option || {};
    this.data = data;
    this._map =  map;
    var id = document.getElementById('canvasDiv');//鍒涘缓鏀綾anvas鏍囩鐨刣iv
    if (!id){
        var div = this._echartsContainer = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();
}

//added by wx 2018.04.17
CarMove.prototype.init = function () {
    this.getCanvasIDline = document.getElementById('canvasIDline');
    if (!this.getCanvasIDline) {
        $('#canvasDiv').append('<canvas id="canvasIDline" width='
            + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasIDline = document.getElementById('canvasIDline');
        this.getCanvasIDline.style.position = 'absolute';
        this.getCanvasIDline.style.top = 0;
        this.getCanvasIDline.style.left = 0;
    }
    this.getCanvasIDpathpoint = document.getElementById('canvasIDpathpoint');
    if (!this.getCanvasIDpathpoint) {
        $('#canvasDiv').append('<canvas id="canvasIDpathpoint" width='
            + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasIDpathpoint = document.getElementById('canvasIDpathpoint');
        this.getCanvasIDpathpoint.style.position = 'absolute';
        this.getCanvasIDpathpoint.style.top = 0;
        this.getCanvasIDpathpoint.style.left = 0;
    }

    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var me = this;


    me.drawLine();
    me.drawpathPoint();
    this._map.on("pan-start", function (e) {
        console.log(me.timer2);
        window.cancelAnimationFrame(me.timer2);
        console.log(me.timer2);
        var ctx1 = me.getCanvasIDline.getContext("2d");
        ctx1.clearRect(0, 0, width, height);
        var ctx2 = me.getCanvasIDpathpoint.getContext("2d");
        ctx2.clearRect(0, 0,width, height);
    });
    this._map.on("pan-end", function (e) {
        me.drawLine();
        me.drawpathPoint();
    });
    this._map.on("zoom-start", function (e) {
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasIDline.getContext("2d");
        ctx1.clearRect(0, 0, width, height);
        var ctx2 = me.getCanvasIDpathpoint.getContext("2d");
        ctx2.clearRect(0, 0, width,height);
    });
    this._map.on("zoom-end", function (e) {
        me.drawLine();
        me.drawpathPoint();
    });
}
CarMove.prototype.getxy = function (X, Y) {
    var point = new esri.geometry.Point(X, Y);
    var screenPoint = this._map.toScreen(point);
    return {x: screenPoint.x, y: screenPoint.y}
}

CarMove.prototype.drawLine = function () {
    var me = this;
    var pdata = me.data.lineData;
    var map = me._map;
    var options = me.option.lineOptions;
    var ctx = this.getCanvasIDline.getContext("2d");

    //璁剧疆灞炴€�
    ctx.globalAlpha = options.globalAlpha || 0.8;
    ctx.strokeStyle = options.strokeStyle || "rgba(0,180,219,0.5)";
    ctx.lineWidth = options.lineWidth || 4.0;
    ctx.globalAlpha = options.globalAlpha || 0.8

    //鐢荤嚎鎿嶄綔
    pdata.forEach(function(item){
        var point = new esri.geometry.Point(item.road[0][0], item.road[0][1]);
        var screenPoint = map.toScreen(point);
        ctx.beginPath();
        ctx.moveTo(screenPoint.x, screenPoint.y);
        for (var i = 1; i < item.road.length; i++) {
            var itemA = item.road[i];
            var point1 = new esri.geometry.Point(itemA[0], itemA[1]);
            var screenPoint1 = map.toScreen(point1);

            ctx.lineTo(screenPoint1.x, screenPoint1.y);
        }
        ctx.stroke();

    });


}
CarMove.prototype.drawpathPoint = function () {
    var me = this;
    var pathd = me.data.pointData;//鍘熷鏁版嵁
    var option = me.option.pointOptions;
    var maxleg = 0;
    var curLeg = 0;
    var i = 0;//寰幆璁℃暟
    // var curData = [];//绛涙煡鍚庢暟鎹�
    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var ctx = this.getCanvasIDpathpoint.getContext("2d");

    //璁剧疆灞炴€�
    var color = option.fillStyle || "rgba(246,255,68,1)";
    var radius = option.radius || 2;
    var globalAlpha = option.globalAlpha || 0.8;

    var drawpoint = function () {
        // 鑾峰彇鏈€澶ч暱搴�
        pathd.forEach(function(item){
            curLeg = item.road.length;
            if(maxleg < curLeg){
                maxleg = curLeg;
            }
        })
        if(i < maxleg) {
            for (j = 0; j < pathd.length; j++) {
                var datapoint = pathd[j].road[i];
                if (datapoint) {
                    var screenPoint = me.getxy(datapoint[0], datapoint[1]);
                    ctx.beginPath();
                    ctx.arc(screenPoint.x, screenPoint.y, radius, 0, 360);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }else {
            i= 0;
            for (j = 0; j < pathd.length; j++) {
                var datapoint = pathd[j].road[i];
                if (datapoint) {
                    var screenPoint = me.getxy(datapoint[0], datapoint[1]);
                    ctx.beginPath();
                    ctx.arc(screenPoint.x, screenPoint.y, radius, 0, 360);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }
    }

    var render = function () {
        var prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = globalAlpha;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = prev;
        drawpoint();
        i = i + 1;
        me.timer2 = window.requestAnimationFrame(render);
    }
    render();
    // this.timer2 = requestAnimationFrame(function fn() {
    //     i = i + 1;
    //     render(ctx);
    //     me.timer2 = requestAnimationFrame(fn);
    // });

}

//----------------------------------澶氱偣杩佸緳绾垮浘-----------------------------------------------
/***
 *  闇€瑕侀厤鍚堝悓鐩綍涓媍ss鏂囦欢锛宨mg鏂囦欢鏄剧ず榛樿鍥炬爣鏍峰紡銆�
 *  option鐨勫€间负    map锛歺xx   琛ㄧず椋庡悜鍥惧熀浜庣殑鍦板浘銆�
 *            direction锛� 0-360  鎺ユ敹涓€涓暟鍊兼鍖楁柟鍚戜负0锛岄『鏃堕拡閫掑
 *            power锛�1-9锛� 琛ㄧず椋庡姏
 *                areaname锛� 鍦板潃鍊�  閫氳繃鍦板潃鍊兼煡鎵剧粡绾害鏂瑰悜銆�
 *
 *  ***/
function migrationLine(map, data, option) {
    this.option = option || {};
    this._map = map;
    this.data = data || {};
    var id = document.getElementById('canvasDiv');
    if (!id) {
        var div = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();
}
migrationLine.prototype.init = function () {
    this.getCanvasIDline = document.getElementById('canvasIDline');
    if (!this.getCanvasIDline) {
        $('#canvasDiv').append('<canvas id="canvasIDline" width='
            + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasIDline = document.getElementById('canvasIDline');
        this.getCanvasIDline.style.position = 'absolute';
        this.getCanvasIDline.style.top = 0;
        this.getCanvasIDline.style.left = 0;
    }
    this.getCanvasIDpathpoint = document.getElementById('canvasIDpathpoint');
    if (!this.getCanvasIDpathpoint) {
        $('#canvasDiv').append('<canvas id="canvasIDpathpoint" width='
            + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasIDpathpoint = document.getElementById('canvasIDpathpoint');
        this.getCanvasIDpathpoint.style.position = 'absolute';
        this.getCanvasIDpathpoint.style.top = 0;
        this.getCanvasIDpathpoint.style.left = 0;
    }

    var me = this;

    me.drawLine();
    me.drawpathPoint();
    // this._map.on("load", function () {
    //     me.drawLine();
    //     me.drawpathPoint();
    // });
    /*setTimeout(function(){
    	me.drawLine();
        console.log(111);
        me.drawpathPoint();
    },50);*/

    this._map.on("pan-start", function (e) {
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasIDline.getContext("2d");
        ctx1.clearRect(0, 0, $('#canvasDiv').width(), $('#canvasDiv').height());
        var ctx2 = me.getCanvasIDpathpoint.getContext("2d");
        ctx2.clearRect(0, 0, $('#canvasDiv').width(), $('#canvasDiv').height());
    });
    this._map.on("pan-end", function (e) {

        me.drawLine();
        me.drawpathPoint();
    });
    this._map.on("zoom-start", function (e) {
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasIDline.getContext("2d");
        ctx1.clearRect(0, 0, $('#canvasDiv').width(), $('#canvasDiv').height());
        var ctx2 = me.getCanvasIDpathpoint.getContext("2d");
        ctx2.clearRect(0, 0, $('#canvasDiv').width(), $('#canvasDiv').height());
    });
    this._map.on("zoom-end", function (e) {
        me.drawLine();
        me.drawpathPoint();
    });
}
migrationLine.prototype.removeLayer = function(){
	$("#canvasIDpathpoint").remove();
	$('#canvasDiv').remove();
}
migrationLine.prototype.getxy = function (X, Y) {
    var point = new esri.geometry.Point(X, Y);
    var screenPoint = this._map.toScreen(point);
    return {x: screenPoint.x, y: screenPoint.y}
}
/*migrationLine.prototype.drawCircle = function (str) {
    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var radius = 0;
    var context = this.getCanvasID.getContext("2d");
    var that = this;

    var draw = function () {
        for (var i = 0; i < str.length; i++) {
            var xy = that.getcityxy(str[i]);
            context.beginPath();
            context.arc(xy.x, xy.y, radius, 0, Math.PI * 2);
            context.closePath();
            context.lineWidth = 1; //绾挎潯瀹藉害
            context.strokeStyle = 'rgba(250,0,0,1)'; //棰滆壊
            context.stroke();
            radius += 0.008;//姣忎竴甯у崐寰勫鍔�0.1
            //鍗婂緞radius澶т簬7鏃讹紝閲嶇疆涓�0
            if (radius > 7) {
                radius = 0;
            }
        }
    };
    var render = function () {
        //榛樿鍊间负source-over
        var prev = context.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-in';
        context.globalAlpha = 0.95;
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = prev;
        draw();
    };

    this.timer = requestAnimationFrame(function fn() {
        render(context);
        that.timer = requestAnimationFrame(fn);
    });
}*/
migrationLine.prototype.drawLine = function () {
    var path = this.data;
    var me = this;
    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var context = this.getCanvasIDline.getContext("2d");
    for (var i = 0; i < path.length; i++) {
        var startxy = me.getxy(path[i].start.X, path[i].start.Y);
        var endxy = me.getxy(path[i].end.X, path[i].end.Y);
		if(startxy.x === endxy.x && startxy.y === endxy.y) continue;
        context.beginPath();
        context.moveTo(startxy.x, startxy.y);
        // context.lineTo(endxy.x, endxy.y);
		if(endxy.y < startxy.y){
			context.quadraticCurveTo((endxy.x+startxy.x)/2,((endxy.y+startxy.y)/2)+40,endxy.x, endxy.y);
		}else{
			context.quadraticCurveTo((endxy.x+startxy.x)/2,((endxy.y+startxy.y)/2)-40,endxy.x, endxy.y);
		}
		
		
// 		if((endxy.y > startxy.y && endxy.x > startxy.x) || (endxy.y > startxy.y && endxy.x < startxy.x)){
// 			context.quadraticCurveTo((endxy.x+startxy.x)/2,((endxy.y+startxy.y)/2)+20,endxy.x, endxy.y);
// 		}else{
// 			context.quadraticCurveTo((endxy.x+startxy.x)/2,((endxy.y+startxy.y)/2)-20,endxy.x, endxy.y);
// 		}
		
		// context.quadraticCurveTo(0,0,endxy.x, endxy.y);

        context.lineWidth = 2; //绾挎潯瀹藉害
        context.strokeStyle = 'rgba(255, 100, 62, 0.9)'; //棰滆壊
		context.shadowBlur=10;
		context.shadowColor='rgba(255, 100, 62, 0.9)';
        context.stroke();

//         context.arc(startxy.x, startxy.y, 1.3, 0, Math.PI * 2);
//         context.arc(endxy.x, endxy.y, 1.3, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(192, 255, 62,0.2)'; //棰滆壊
//         context.fill();
    }
}
migrationLine.prototype.drawpathPoint = function () {
    var path = this.data;
    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var context = this.getCanvasIDpathpoint.getContext("2d");
    var me = this;
    var pathpoint = [];
    var pathpoint2 = [];
	var curvePoints = [];
    var distance = [];
    for (var i = 0; i < path.length; i++) {
        var startxy = me.getxy(path[i].start.X, path[i].start.Y);
        var endxy = me.getxy(path[i].end.X, path[i].end.Y);
        var ly = endxy.y - startxy.y;
        var lx = endxy.x - startxy.x;
        var l = Math.pow((ly * ly + lx * lx), 0.5);
        pathpoint.push(startxy);
		pathpoint2.push(endxy);
		if(endxy.y < startxy.y){
			curvePoints.push({
				x:(endxy.x+startxy.x)/2,
				y:((endxy.y+startxy.y)/2)+40
			})
		}else{
			curvePoints.push({
				x:(endxy.x+startxy.x)/2,
				y:((endxy.y+startxy.y)/2)-40
			})
		}
        distance.push(0);
    }

    var drawpoint = function () {
        if (pathpoint) {
            for (var i = 0; i < pathpoint.length; i++) {

                if (distance[i] > 1 || distance[i] == 1){
                    distance[i] = 0;
                    pathpoint[i].y = pathpoint[i].y;
                    pathpoint[i].x = pathpoint[i].x;
                    continue;
                } else {
                    distance[i] += 1 / 300;
                    var disXY = twoBezier(distance[i],pathpoint[i],curvePoints[i],pathpoint2[i]);
                    context.beginPath();
                    context.arc(disXY.x, disXY.y, 2, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(250,250,250,0.8)'; //棰滆壊
                    context.fill();
                }
            }
        }
    }
	
	var twoBezier = function(t, p1, cp, p2) {
        const [x1, y1] = [p1.x,p1.y];
        const [cx, cy] = [cp.x,cp.y];
        const [x2, y2] = [p2.x,p2.y];
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return {x:x, y:y};
    }
	
    var render = function (ctx) {
        //ctx.fillRect(0,0,width,height);
        //ctx.clearRect(0,0,width,height);

        var prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = prev;
        drawpoint();
    }


    this.timer2 = requestAnimationFrame(function fn() {
        render(context);
        me.timer2 = requestAnimationFrame(fn);
    });

}

//----------------------------------闂儊鐐瑰浘-----------------------------------------------
function BlinkingMap(map, data, options) {

    this.option = options || {};
    this.option.data = data;
    this._map = map;
    this.data = data || {};
    var id = document.getElementById('canvasDiv');
    if (!id) {
        var div = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.dataa = [];
    if (this.data.length % 2 == 1) {
        for (var i = 0; i < this.data.length - 1; i = i + 4) {
            var num;

            do {
                num = Math.random();
            } while (num > 0.8)
            var a = {
                point: this.data[i],
                rate: num
            };

            this.dataa.push(a);
        }
    } else {
        for (var i = 0; i < this.data.length; i = i + 4) {
            var num;

            do {
                num = Math.random();
            } while (num > 0.8)
            var a = {
                point: this.data[i],
                rate: num
            };

            this.dataa.push(a);
        }
    }

    this.init();

}
BlinkingMap.prototype.init = function () {
    this.getCanvasID = document.getElementById('canvasID');
    if (!this.getCanvasID) {
        $('#canvasDiv').append('<canvas id="canvasID" width='
            + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasID = document.getElementById('canvasID');
        this.getCanvasID.style.position = 'absolute';
        this.getCanvasID.style.top = 0;
        this.getCanvasID.style.left = 0;
    }
    var me = this;

    me.drawPoint();
}
BlinkingMap.prototype.drawPoint = function () {
    var width = $('#canvasDiv').width();
    var height = $('#canvasDiv').height();
    var context = this.getCanvasID.getContext("2d");
    var me = this;
    var dataa = this.dataa;
    console.log(dataa);
    var currentTr = [];
    for (var i = 0; i < dataa.length; i = i + 2) {
        currentTr[i] = 1;
        currentTr[i + 1] = 0.2;
    }
    var draw = function () {
        context.fillRect(0, 0, width, height);
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < dataa.length; i++) {
            var xy = me.getxy(dataa[i].point.geoCoord);
            context.beginPath();
            context.arc(xy.x, xy.y, 3, 0, Math.PI * 2);
            context.closePath();
            if (currentTr[i] < 0.2) {
                context.fillStyle = 'rgba(255,250,50,0)'; //棰滆壊
            } else {
                context.fillStyle = 'rgba(255,250,50,' + currentTr[i] + ')'; //棰滆壊
            }

            context.fill();
            if (currentTr[i] <= 0) {
                currentTr[i] = 1;
            } else {
                currentTr[i] = currentTr[i] - dataa[i].rate;
            }

        }


    };
    setInterval(function () {
        draw();
    }, 600);
    /*this.timer=requestAnimationFrame(function fn(){
		draw();
		me.timer=requestAnimationFrame(fn);
	});*/
}
BlinkingMap.prototype.getxy = function (point) {
    var point = new esri.geometry.Point(point[0], point[1]);
    var screenPoint = this._map.toScreen(point);
    return {x: screenPoint.x, y: screenPoint.y}
}

//-----------------ColorPoint----------------褰╄壊鐐瑰浘---------------------------------------
function ColorPoint(map,data,option) {
    //1.楠岃瘉鍙傛暟鏄惁瀛樺湪锛屽垱寤哄睘鎬у苟璧嬪€�
    //2.鍒涘缓鏀綾anvas鏍囩鐨勭洅瀛�
    //3.娣诲姞鍑芥暟鐨勫睘鎬э紝缁戝畾浜嬩欢
    //4.娣诲姞鍑芥暟鐨勫睘鎬э紝鍒濆鍖�
    if(!map || !data){//1.楠岃瘉骞跺垱寤哄睘鎬�
        return;
    }
    this.option = option || {};
    this.option.data = data;
    this._map = this.option.map = map;

    var id = document.getElementById("canvasDIV");//2.鍒涘缓鏀綾anvas鐨刣iv锛屽苟璁剧疆鐩稿叧鍙傛暟
    if(!id){
        var div = this._echartsContainer = document.createElement('div');
        div.id = "canvasDIV";
        div.style.position = "absolute";
        div.style.height = this._map.height + "px";
        div.style.width = this._map.width + "px";
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    //鍒濆鍖�
    this._bindEvent();
    this.init();

}
ColorPoint.prototype ={
    _bindEvent:function(){//缁戝畾鐩戝惉浜嬩欢
        this._map.on("pan-start",function(){
            $("#canvasID").hide();
        });
        this._map.on("pan-end",function(){
            $("#canvasID").show();
        });
        this._map.on("zoom-start",function(){
            $("#canvasID").hide();
        });
        this._map.on("zoom-end",function(){
            $("#canvasID").show();
        });
    },
    init:function(){
        var getCanvasID = document.getElementById("canvasID");
        if(!getCanvasID){
            $("#canvasDIV").append('<canvas id = "canvasID" width = '+ $("#canvasDIV").width() +
                '  height = '+$("#canvasDIV").height() +'></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this,option = this.option;
        var ctx = getCanvasID.getContext("2d");
        var map = option.map;

        render();
        function render(){
            ctx.clearRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.fillStyle = "rgba(255,255,255,0)";
            ctx.fillRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.globalAlpha = 0.8;

            var color ;//璁剧疆鐢诲渾鐨勯鑹�
            var radius = 3;//璁剧疆鐢诲渾鐨勫崐寰�
            option.data.forEach(function(item){//灏哾ata涓殑鏁版嵁鍙栧嚭鏉ワ紝骞舵樉绀哄湪鍦板浘涓�
                var point = new esri.geometry.Point(item.X,item.Y);//鑾峰彇鐐�

                option.pointColor.forEach(function(item1){//鍒嗙骇璁捐壊
                    if(item1.start < item.value && item1.end >= item.value){
                        color = item1.color;
                    }
                });
                var screenPoint = map.toScreen(point);
                me.draw(ctx,radius,screenPoint.x,screenPoint.y,color)
            });
            window.requestAnimationFrame(render);
        }
    },
    draw:function(ctx,radius,x,y,color){
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

}
//-----------------testPoint----------------闂儊鐐瑰浘---------------------------------------
// var radius1 = 1,radius2 = 1,radius3 = 2.5;// 鐐圭殑鍗婂緞
// var symbols1 = 1,symbols2 = 1,symbols3 = 1;//鍒よ鍗婂緞鏄惁杈惧埌鏈€澶у€肩殑鏍囪瘑
var radius = 2.5;
function  TestPoint(map,data,option) {
    if(!map || !data){      //鍏堥獙璇佹暟鎹槸鍚﹀瓨鍦�
        return;
    }
    this.option = option || {};
    this.option.data = data;
    this._map = this.option.map = map;
    console.log(option);
    var id = document.getElementById('canvasDiv');//鍒涘缓鏀綾anvas鏍囩鐨刣iv
    if (!id){
        var div = this._echartsContainer = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this._bindEvent();
    this.init();
}
TestPoint.prototype = {
    _bindEvent:function() {//缁戝畾鐩戝惉浜嬩欢
        this._map.on("pan-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("pan-end", function () {
            $("#canvasID").show();
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("zoom-end", function () {
            $("#canvasID").show();
        });
    },
    init:function(){
        var getCanvasID = document.getElementById('canvasID');//鍒涘缓涓€涓�<canvas>鏍囩
        if(!getCanvasID){
            $('#canvasDiv').append('<canvas id="canvasID" width='+ $('#canvasDiv').width()
                + '  height ='+$('#canvasDiv').height() + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this,option = this.option;
        var ctx = getCanvasID.getContext("2d");//鍒涘缓鐢荤瑪
        var map = option.map;
        var maxNum = option.maxNum;
        var minNum = option.minNum;
        console.log(option);
        console.log(option.maxNum);
        if(!maxNum){
            option.data.forEach(function(item){
                max.push(item.value);
            });
            maxNum = Math.max.apply(null,max);
            minNum = Math.max.apply(null,max);
        }
        var rangeNum = (maxNum - minNum) / 3;
        var range1 = maxNum - rangeNum;
        var range2 = range1 - rangeNum;

        render();

        function render(){
            // if(radius3 > 3 || symbols3 == 0){//璁剧疆鍗婂緞鐨勫彉鍖栬寖鍥�
            //     radius3 -= 0.08;
            //     if(radius3 <= 1){
            //         symbols3 = 1;
            //     }
            // } else if(radius3 < 3 || symbols3 == 1){
            //     radius3 += 0.03;
            //     if(radius3 >= 3){
            //         symbols3 = 0;
            //     }
            // }
            // if (radius2 > 3 || symbols2 == 0){
            //     radius2 -= 0.01;
            //     if(radius2 <= 1){
            //         symbols2 = 1;
            //     }
            // } else if(radius2 < 3 || symbols2 == 1){
            //     radius2 +=0.01;
            //     if(radius2 >= 3){
            //         symbols2 = 0;
            //     }
            // }
            // if(radius1 > 3 || symbols1 == 0){
            //     radius1 -=0.03;
            //     if(radius1 <= 1){
            //         symbols1 = 1;
            //     }
            // } else if(radius1 < 3 || symbols1 == 1){
            //     radius1 += 0.05;
            //     if(radius1 >= 3){
            //         symbols1 = 0;
            //     }
            // }
            ctx.clearRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.fillStyle = 'rgba(255,255,255,0)';
            ctx.fillRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.globalAlpha = 0.8;

            var color = option.fillColor ? option.fillColor : "rgba(43,254,187,0.86)";
            option.data.forEach(function(item){
                var point = new esri.geometry.Point(item.X,item.Y);
                var screenPoint = map.toScreen(point);
                me.draw(item.value,screenPoint.x,screenPoint.y,color,ctx,maxNum,minNum,range1,range2);
            });
            window.requestAnimationFrame(render);
        }
    },
    draw:function(value,x,y,color,ctx,maxNum,minNum,range1,range2){
        // if(value >= minNum && value < range1){//璁剧疆涓嶅悓鐨勮捣濮嬪崐寰勫ぇ灏�
        //     radius = radius1;
        // }
        // if(value >= range1 && value < range2){
        //     radius = radius2;
        // }
        // if(value >= range2 && value < maxNum){
        //     radius = radius3;
        // }
        // radius = radius3;

        ctx.beginPath();
        ctx.arc(x,y,radius,0,2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        // ctx.shadowColor = "#2BFEBB";
        // ctx.shadowBlur = 5;
        ctx.closePath();
    }
}


//---------------------------------瀵嗛泦鐐瑰浘---------------------------------------
var radus1 = 1, radus2 = 1, radus3 = 1;//鐐圭殑鍗婂緞
var symbol1 = 1, symbol2 = 1, symbol3 = 1;//鍒ゆ柇鍗婂緞鏄惁杈惧埌鏈€澶у€肩殑鏍囪瘑
var radus;

function MultiPoint(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this.option.map = map;
    this._map = this.option.map;

    var id = document.getElementById('canvasDiv');
    if (!id) {
        var div = this._echartsContainer = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    ;
    this._bindEvent();
    this.init();
};
MultiPoint.prototype = {
    _bindEvent: function () {
        this._map.on("pan-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("pan-end", function () {
            $("#canvasID").show()
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("zoom-end", function () {
            $("#canvasID").show()
        });
    },
    init: function () {
        var getCanvasID = document.getElementById('canvasID');
        if (!getCanvasID) {
            $('#canvasDiv').append('<canvas id="canvasID" width='
                + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this, option = this.option;
        var ctx = getCanvasID.getContext("2d");
        var map = option.map;

        var maxNum = option.maxNum;
        var minNum = option.minNum;
        if (!maxNum) {
            option.data.forEach(function (item) {
                max.push(item.value);
            });
            maxNum = Math.max.apply(null, max);
            minNum = Math.max.apply(null, max)
        }

        var rangeNum = (maxNum - minNum) / 3;
        var range1 = maxNum - rangeNum;
        var range2 = range1 - rangeNum;


        render();

        function render() {
            if (radus3 > 3 || symbol3 == 0) {
                radus3 -= 0.08;
                if (radus3 <= 1) {
                    symbol3 = 1;
                }
            } else if (radus3 < 3 || symbol3 == 1) {
                radus3 += 0.03;
                if (radus3 >= 3) {
                    symbol3 = 0;
                }
            }

            if (radus2 > 3 || symbol2 == 0) {
                radus2 -= 0.01;
                if (radus2 <= 1) {
                    symbol2 = 1;
                }
            } else if (radus2 < 3 || symbol2 == 1) {
                radus2 += 0.01;
                if (radus2 >= 3) {
                    symbol2 = 0;
                }
            }

            if (radus1 > 3 || symbol1 == 0) {
                radus1 -= 0.03
                if (radus1 <= 1) {
                    symbol1 = 1;
                }
            } else if (radus1 < 3 || symbol1 == 1) {
                radus1 += 0.05;
                if (radus1 >= 3) {
                    symbol1 = 0;
                }
            }
            ctx.clearRect(0, 0, getCanvasID.width, getCanvasID.height);
            ctx.fillStyle = 'rgba(255,255,255,0)';
            ctx.fillRect(0, 0, getCanvasID.width, getCanvasID.height);
            ctx.globalAlpha = 0.8;

            var color = option.fillColor ? option.fillColor : "rgba(43,254,187,0.86)";

            option.data.forEach(function (item) {
                var point = new esri.geometry.Point(item.X, item.Y);
                var screenPoint = map.toScreen(point);
                me.draw(item.value, screenPoint.x, screenPoint.y, color, ctx, maxNum, minNum, range1, range2);
            });

            window.requestAnimationFrame(render);
        }
    },

    draw: function (value, x, y, color, ctx, maxNum, minNum, range1, range2) {
        if (value >= minNum && value < range2) {
            radus = radus1;
        }
        if (value >= range2 && value < range1) {
            radus = radus2;
        }
        if (value >= range1 && value < maxNum) {
            radus = radus3;
        }
        ctx.beginPath();
        ctx.arc(x, y, radus, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowColor = "#2BFEBB";
        ctx.shadowBlur = 5;
        ctx.closePath();
    }
}

//-----------------------浣跨敤Arcgis寮€鍙戜笉瑙勫垯褰㈢姸鍒嗗竷----------涓嶈鍒欏舰鐘�----------------------------------------------
//
function MultiPolygon(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();

};
MultiPolygon.prototype = new BaseLayer();
MultiPolygon.prototype.init = function () {
    var me = this, option = this.option;
    var lineSymbol = new esri.symbol.SimpleLineSymbol();
    lineSymbol.width = 1;
    lineSymbol.color = new esri.Color((option.strokeColor ? option.strokeColor : [255, 255, 255, 0.8]));

    var fillSymbol = new esri.symbol.SimpleFillSymbol();
    fillSymbol.outline = lineSymbol;
    fillSymbol.color = new esri.Color((option.fillColor ? option.fillColor : [0, 212, 255, 0.8]));


    option.data.forEach(function (item, index) {
        var info = {
            'id': index + 1,
        }
        var poly = WktToMultiPolygon(item.polygon, new esri.Graphic({wkid: 4326}));
        var polygon = esri.geometry.geographicToWebMercator(poly);
        var graphic = new esri.Graphic(polygon, fillSymbol, info);
        me.mapLayer.add(graphic);

        // var textSymbol = new esri.symbol.TextSymbol(item.name);
        // var graphic1 = new esri.Graphic(polygon,textSymbol,info);
        // me.mapLayer.add(graphic1);
    });
};

// 浣跨敤Canvas寮€鍙戜笉瑙勫垯褰㈢姸鍒嗗竷
function CanvasPolygon(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }


    var id = document.getElementById('canvasDiv');
    if (!id) {
        var div = this._echartsContainer = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    ;
    this.init();
    this._bindEvent();
};
CanvasPolygon.prototype = {
    _bindEvent: function () {
        var me = this;
        this._map.on("pan-start", function () {
            $("#canvasID").remove();
        });
        this._map.on("pan-end", function () {
            me.init();
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").remove();
        });
        this._map.on("zoom-end", function () {
            me.init();
        });

    },
    init: function () {
        var getCanvasID = document.getElementById('canvasID');
        if (!getCanvasID) {
            $('#canvasDiv').append('<canvas id="canvasID" width='
                + $('#canvasDiv').width() + ' height=' + $('#canvasDiv').height() + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this,
            option = this.option,
            map = option.map;
        var ctx = getCanvasID.getContext("2d");


        option.data.forEach(function (item) {
            var point1 = new esri.geometry.Point(item.polygon[0][0], item.polygon[0][1]);
            var screenPoint1 = map.toScreen(point1);
            ctx.beginPath();
            ctx.moveTo(screenPoint1.x, screenPoint1.y);
            item.polygon.forEach(function (itemA, index) {
                if (index != 0) {
                    var point = new esri.geometry.Point(itemA[0], itemA[1]);
                    var screenPoint = map.toScreen(point);
                    ctx.lineTo(screenPoint.x, screenPoint.y);
                }
            });
            ctx.fillStyle = option.fillColor;
            ctx.fill();
            ctx.strokeStyle = option.strokeColor;
            ctx.stroke();
            ctx.closePath();

            // ctx.fillStyle = "rgba(0, 0,0 , 0.8)";
            // ctx.textBaseline = "ideographic";
            // ctx.fillText(item.name,screenPoint1.x,screenPoint1.y);
        });
    }
};
// -----------------TestPoint-----------------绾壊鐐瑰浘---------------------------------------------
var radius = 2.5;
function  TestPoint(map,data,option) {
    if(!map || !data){      //鍏堥獙璇佹暟鎹槸鍚﹀瓨鍦�
        return;
    }
    this.option = option || {};
    this.option.data = data;
    this._map = this.option.map = map;
    console.log(option);
    var id = document.getElementById('canvasDiv');//鍒涘缓鏀綾anvas鏍囩鐨刣iv
    if (!id){
        var div = this._echartsContainer = document.createElement('div');
        div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this._bindEvent();
    this.init();
}
TestPoint.prototype = {
    _bindEvent:function() {//缁戝畾鐩戝惉浜嬩欢
        this._map.on("pan-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("pan-end", function () {
            $("#canvasID").show();
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").hide();
        });
        this._map.on("zoom-end", function () {
            $("#canvasID").show();
        });
    },
    init:function(){
        var getCanvasID = document.getElementById('canvasID');//鍒涘缓涓€涓�<canvas>鏍囩
        if(!getCanvasID){
            $('#canvasDiv').append('<canvas id="canvasID" width='+ $('#canvasDiv').width()
                + '  height ='+$('#canvasDiv').height() + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this,option = this.option;
        var ctx = getCanvasID.getContext("2d");//鍒涘缓鐢荤瑪
        var map = option.map;
        var maxNum = option.maxNum;
        var minNum = option.minNum;
        console.log(option);
        console.log(option.maxNum);
        if(!maxNum){
            option.data.forEach(function(item){
                max.push(item.value);
            });
            maxNum = Math.max.apply(null,max);
            minNum = Math.max.apply(null,max);
        }
        var rangeNum = (maxNum - minNum) / 3;
        var range1 = maxNum - rangeNum;
        var range2 = range1 - rangeNum;

        render();

        function render(){
            // if(radius3 > 3 || symbols3 == 0){//璁剧疆鍗婂緞鐨勫彉鍖栬寖鍥�
            //     radius3 -= 0.08;
            //     if(radius3 <= 1){
            //         symbols3 = 1;
            //     }
            // } else if(radius3 < 3 || symbols3 == 1){
            //     radius3 += 0.03;
            //     if(radius3 >= 3){
            //         symbols3 = 0;
            //     }
            // }
            // if (radius2 > 3 || symbols2 == 0){
            //     radius2 -= 0.01;
            //     if(radius2 <= 1){
            //         symbols2 = 1;
            //     }
            // } else if(radius2 < 3 || symbols2 == 1){
            //     radius2 +=0.01;
            //     if(radius2 >= 3){
            //         symbols2 = 0;
            //     }
            // }
            // if(radius1 > 3 || symbols1 == 0){
            //     radius1 -=0.03;
            //     if(radius1 <= 1){
            //         symbols1 = 1;
            //     }
            // } else if(radius1 < 3 || symbols1 == 1){
            //     radius1 += 0.05;
            //     if(radius1 >= 3){
            //         symbols1 = 0;
            //     }
            // }
            ctx.clearRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.fillStyle = 'rgba(255,255,255,0)';
            ctx.fillRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.globalAlpha = 0.8;

            var color = option.fillColor ? option.fillColor : "rgba(43,254,187,0.86)";
            option.data.forEach(function(item){
                var point = new esri.geometry.Point(item.X,item.Y);
                var screenPoint = map.toScreen(point);
                me.draw(item.value,screenPoint.x,screenPoint.y,color,ctx,maxNum,minNum,range1,range2);
            });
            window.requestAnimationFrame(render);
        }
    },
    draw:function(value,x,y,color,ctx,maxNum,minNum,range1,range2){
        // if(value >= minNum && value < range1){//璁剧疆涓嶅悓鐨勮捣濮嬪崐寰勫ぇ灏�
        //     radius = radius1;
        // }
        // if(value >= range1 && value < range2){
        //     radius = radius2;
        // }
        // if(value >= range2 && value < maxNum){
        //     radius = radius3;
        // }
        // radius = radius3;

        ctx.beginPath();
        ctx.arc(x,y,radius,0,2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        // ctx.shadowColor = "#2BFEBB";
        // ctx.shadowBlur = 5;
        ctx.closePath();
    }
}

//-----------------ColorPoint----------------褰╄壊鐐瑰浘---------------------------------------
function ColorPoint(map,data,option) {
    //1.楠岃瘉鍙傛暟鏄惁瀛樺湪锛屽垱寤哄睘鎬у苟璧嬪€�
    //2.鍒涘缓鏀綾anvas鏍囩鐨勭洅瀛�
    //3.娣诲姞鍑芥暟鐨勫睘鎬э紝缁戝畾浜嬩欢
    //4.娣诲姞鍑芥暟鐨勫睘鎬э紝鍒濆鍖�
    if(!map || !data){//1.楠岃瘉骞跺垱寤哄睘鎬�
        return;
    }
    this.option = option || {};
    this.option.data = data;
    this._map = this.option.map = map;

    var id = document.getElementById("canvasDIV");//2.鍒涘缓鏀綾anvas鐨刣iv锛屽苟璁剧疆鐩稿叧鍙傛暟
    if(!id){
        var div = this._echartsContainer = document.createElement('div');
        div.id = "canvasDIV";
        div.style.position = "absolute";
        div.style.height = this._map.height + "px";
        div.style.width = this._map.width + "px";
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    //鍒濆鍖�
    this._bindEvent();
    this.init();

}
ColorPoint.prototype ={
    _bindEvent:function(){//缁戝畾鐩戝惉浜嬩欢
        this._map.on("pan-start",function(){
            $("#canvasID").hide();
        });
        this._map.on("pan-end",function(){
            $("#canvasID").show();
        });
        this._map.on("zoom-start",function(){
            $("#canvasID").hide();
        });
        this._map.on("zoom-end",function(){
            $("#canvasID").show();
        });
    },
    init:function(){
        var getCanvasID = document.getElementById("canvasID");
        if(!getCanvasID){
            $("#canvasDIV").append('<canvas id = "canvasID" width = '+ $("#canvasDIV").width() +
                '  height = '+$("#canvasDIV").height() +'></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var me = this,option = this.option;
        var ctx = getCanvasID.getContext("2d");
        var map = option.map;

        render();
        function render(){
            ctx.clearRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.fillStyle = "rgba(255,255,255,0)";
            ctx.fillRect(0,0,getCanvasID.width,getCanvasID.height);
            ctx.globalAlpha = 0.8;

            var color ;//璁剧疆鐢诲渾鐨勯鑹�
            var radius = 3.5;//璁剧疆鐢诲渾鐨勫崐寰�
            option.data.forEach(function(item){//灏哾ata涓殑鏁版嵁鍙栧嚭鏉ワ紝骞舵樉绀哄湪鍦板浘涓�
                var point = new esri.geometry.Point(item.X,item.Y);//鑾峰彇鐐�

                option.pointColor.forEach(function(item1){//鍒嗙骇璁捐壊
                    if(item1.start < item.value && item1.end >= item.value){
                        color = item1.color;
                    }
                });
                var screenPoint = map.toScreen(point);
                me.draw(ctx,radius,screenPoint.x,screenPoint.y,color)
            });
            window.requestAnimationFrame(render);
        }
    },
    draw:function(ctx,radius,x,y,color){
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

}

// -----------------AirLine-----------------椋炴満鑸嚎鍥�---------------------------------------------
function AirLine(map,data,option){
    //1.楠岃瘉鏁版嵁
    //2.鍒涘缓div
    //3.鍒濆鍖栥€佺粦瀹氫簨浠�
    if(!map || !data){
        return;
    }
    console.log(data);
    this.option = option || {};
    this.data = data || {};
    this._map =  map;
    var id = document.getElementById("canvasDiv");
    if(!id){//鍒涘缓鏀炬樉绀烘晥鏋滅殑div
        var div = document.createElement("div");
        div.id = "canvasDiv";
        div.style.position = "absolute";
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();
}
AirLine.prototype.init = function (){
    this.getCanvasLine = document.getElementById("canvasLine");
    if(!this.getCanvasLine){
        $("#canvasDiv").append("<canvas id = 'canvasLine' width = "
            + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() +'></canvas>');
        this.getCanvasLine = document.getElementById("canvasLine");
        this.getCanvasLine.style.position = "absolute";
        this.getCanvasLine.style.top = 0;
        this.getCanvasLine.style.left = 0;
    };
    var me = this;
    this._map.on("load",function(){//浜嬩欢鐩戞帶
        me.drawLine();
    });
    this._map.on("pan-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("pan-end",function(e){
        me.drawLine();
    });
    this._map.on("zoom-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("zoom-end",function(e){
        me.drawLine();
    });
}
AirLine.prototype.getxy = function(X,Y){
    var point = new esri.geometry.Point(X,Y);
    var screenPoint = this._map.toScreen(point);
    return{x:screenPoint.x,y:screenPoint.y};
};
AirLine.prototype.drawLine = function (){
    var color;//濉厖棰滆壊
    var airName;//鑸┖鍏徃鍚嶇О
    var optionC = this.option;
    var path = this.data;
    var me = this;
    var width = $("#canvasDiv").width();
    var height = $("#canvasDiv").height();
    var context = this.getCanvasLine.getContext("2d");
    context.lineWidth = optionC.lineWidth|| 1.1;//绾挎潯瀹藉害
    for(var i = 0;i < path.length;i++)
    {
        // optionC.pointColor.forEach(function (item) {
        //     if(item.start <= path[i].value && path[i].value < item.end){
        //         color = item.color;
        //     }
        //     var xvalue = path[i].value;
        // })
        airName = path[i].airCompany;
        optionC.lineColor.forEach(function(item){
            if(item.airways == airName){
                color = item.color;
            }
        });
        var startxy = me.getxy( path[i].start.X,path[i].start.Y);
        var endxy = me.getxy(path[i].end.X,path[i].end.Y);
        context.beginPath();

        context.moveTo(startxy.x,startxy.y);//鐢荤嚎骞惰繘琛屽～鍏�
        context.lineTo(endxy.x,endxy.y);
        context.strokeStyle = color;
        context.stroke();

        context.arc(startxy.x,startxy.y,1.3,0,Math.PI * 2);//鐢荤偣骞惰繘琛屽～鍏�
        context.arc(endxy.x,endxy.y,1.3,0,Math.PI * 2);
        context.fillStyle = "rgba(250,250,250,0.2)"
        context.fill();
    }
};

// -----------------PurityLine-----------------绾壊绾垮浘---------------------------------------------
function PurityLine(map,data,option){
    //1.楠岃瘉鏁版嵁
    //2.鍒涘缓div
    //3.鍒濆鍖栥€佺粦瀹氫簨浠�
    if(!map || !data){
        return;
    }
    this.option = option || {};
    this.data = data || {};
    this._map =  map;
    var id = document.getElementById("canvasDiv");
    if(!id){//鍒涘缓鏀炬樉绀烘晥鏋滅殑div
        var div = document.createElement("div");
        div.id = "canvasDiv";
        div.style.position = "absolute";
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();
}
PurityLine.prototype.init = function (){
    this.getCanvasLine = document.getElementById("canvasLine");
    if(!this.getCanvasLine){
        $("#canvasDiv").append("<canvas id = 'canvasLine' width = "
            + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() +'></canvas>');
        this.getCanvasLine = document.getElementById("canvasLine");
        this.getCanvasLine.style.position = "absolute";
        this.getCanvasLine.style.top = 0;
        this.getCanvasLine.style.left = 0;
    };
    this.getCanvasPathPoint = document.getElementById("canvasPathPoint");
    if(!this.getCanvasPathPoint){
        $("#canvasDiv").append("<canvas id = 'canvasPathPoint' width = "
            + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() + '></canvas>');
        this.getCanvasPathPoint = document.getElementById("canvasPathPoint");
        this.getCanvasPathPoint.style.position = "absolute";
        this.getCanvasPathPoint.style.top = 0;
        this.getCanvasPathPoint.style.left = 0;
    }
    var me = this;
    this._map.on("load",function(){//浜嬩欢鐩戞帶
        me.drawLine();
    });
    this._map.on("pan-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
        var ctx2 = me.getCanvasPathPoint.getContext("2d");
        ctx2.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("pan-end",function(e){
        me.drawLine();
    });
    this._map.on("zoom-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
        var ctx2 = me.getCanvasPathPoint.getContext("2d");
        ctx2.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("zoom-end",function(e){
        me.drawLine();
    });
}
PurityLine.prototype.getxy = function(X,Y){
    var point = new esri.geometry.Point(X,Y);
    var screenPoint = this._map.toScreen(point);
    return{x:screenPoint.x,y:screenPoint.y};
};
PurityLine.prototype.drawLine = function (){

    var me = this;
    var optionC = me.option;
    var path = me.data;

    var width = $("#canvasDiv").width();
    var height = $("#canvasDiv").height();
    var context = this.getCanvasLine.getContext("2d");
    context.strokeStyle = optionC.color || "#0192D3";
    context.lineWidth = optionC.lineWidth || 1.1;//绾挎潯瀹藉害
    var ctxRed = this.getCanvasPathPoint.getContext("2d");//绾㈣壊鐐�
    var ctxYellow = this.getCanvasPathPoint.getContext("2d");//榛勭偣
    for(var i = 0;i < path.length;i++)
    {
        var startxy = me.getxy( path[i].start.X,path[i].start.Y);
        var endxy = me.getxy(path[i].end.X,path[i].end.Y);
        context.beginPath();
        context.moveTo(startxy.x,startxy.y);//鐢荤嚎骞惰繘琛屽～鍏�
        context.lineTo(endxy.x,endxy.y);
        context.stroke();
        context.fillStyle = "rgba(250,250,250,0)"
        context.fill();

        ctxRed.beginPath();
        ctxRed.arc(startxy.x,startxy.y,4,0,360);//鐢荤偣骞惰繘琛屽～鍏�
        ctxRed.fillStyle = "#EF5D23";
        ctxRed.fill();
        ctxRed.closePath();

        ctxYellow.beginPath();
        ctxYellow.arc(endxy.x,endxy.y,4,0,360);
        ctxYellow.fillStyle = "#F6FE21";
        ctxYellow.fill();
        ctxYellow.closePath();

    }
    function redPoint(x,y){

    }

};

// -----------------CirclePoint-----------------姹℃煋绛夌骇鍥�---------------------------------------------
function CirclePoint(map,data,option){
    //1.楠岃瘉鏁版嵁
    //2.鍒涘缓div
    //3.鍒濆鍖栥€佺粦瀹氫簨浠�
    if(!map || !data){
        return;
    }
    // console.log(data);
    this.option = option || {};
    this.data = data || {};
    this._map =  map;
    var id = document.getElementById("canvasDiv");
    if(!id){//鍒涘缓鏀炬樉绀烘晥鏋滅殑div
        var div = document.createElement("div");
        div.id = "canvasDiv";
        div.style.position = "absolute";
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    this.init();

}
CirclePoint.prototype.init = function (){
    this.getCanvasLine = document.getElementById("canvasLine");
    if(!this.getCanvasLine){
        $("#canvasDiv").append("<canvas id = 'canvasLine' width = "
            + $('#canvasDiv').width() + ' height = ' + $('#canvasDiv').height() +'></canvas>');
        this.getCanvasLine = document.getElementById("canvasLine");
        this.getCanvasLine.style.position = "absolute";
        this.getCanvasLine.style.top = 0;
        this.getCanvasLine.style.left = 0;
    };
    var me = this;

    this._map.on("pan-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("pan-end",function(e){
        me.drawLine();
    });
    this._map.on("zoom-start",function(e){
        cancelAnimationFrame(me.timer2);
        var ctx1 = me.getCanvasLine.getContext("2d");
        ctx1.clearRect(0,0,$("#canvasDiv").width(),$("#canvasDiv").height());
    });
    this._map.on("zoom-end",function(e){
        me.drawLine();
    });
    me.drawLine();

}
CirclePoint.prototype.getxy = function(X,Y){
    var point = new esri.geometry.Point(X,Y);
    var screenPoint = this._map.toScreen(point);
    return{x:screenPoint.x,y:screenPoint.y};
};
CirclePoint.prototype.drawLine = function (){
    var me = this;
    var optionC = me.option;
    var path = me.data;

    var radius = 1;//鍗婂緞鍊�
    var pcircle = 0;//鍦嗗績
    var color = optionC.color ||"rgba(255,0,0,0.5)";

    var context = this.getCanvasLine.getContext("2d");
    for(var i = 0;i < path.length;i++)
    {
        optionC.circleRadius.forEach(function (item) {
            if(item.start <= path[i].value && path[i].value < item.end){
                radius = item.radius;
            }
        })
        pcircle = me.getxy( path[i].X,path[i].Y);
        context.beginPath();
        context.arc(pcircle.x,pcircle.y,radius,0,Math.PI * 2);//鐢荤偣骞惰繘琛屽～鍏�
        context.fillStyle = color;
        context.fill();
    }
};

//---------------------------------姘旀场鍥�-----------------------------------------------------------
function BubbleGraphic(map, data, option) {
    var me = this;
    this.option = option || {};
    this._map = option.map = map;
    this.option.data = data;
    if (!data || !map) {
        return;
    }
    var id = document.getElementById('canvasDots');
    if (!id) {
        var div = this._echartsContainer = document.createElement('div');
        me.canvasDotsId = div.id = 'canvasDots';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }
    ;
    this.init();
    this._bindEvent();
};
BubbleGraphic.prototype = {
    _bindEvent: function () {
        var me = this;
        this._map.on("pan-start", function () {
            $("#canvasID").remove();
            $("#canvas2").remove();
        });
        this._map.on("pan-end", function () {
            me.init();
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").remove();
            $("#canvas2").remove();
        });
        this._map.on("zoom-end", function () {
            me.init();
        });
    },
    init: function () {
        var me = this,
            option = this.option,
            map = option.map;
        var width = this._map.width;
        var height = this._map.height;

        // 涓嶆槸闂儊鐐逛娇鐢ㄧ殑canvas灞�
        var getCanvasID = document.getElementById('canvasID');
        if (!getCanvasID) {
            console.log(me.canvasDotsId)
            $("#" + me.canvasDotsId).append('<canvas id="canvasID" width=' + width + ' height=' + height + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
            console.log(getCanvasID)
        }

        var ctx = getCanvasID.getContext("2d");

        var dotsSize = option.dotsSize ? option.dotsSize : 3;
        var color = option.dotsColor ? option.dotsColor : "rgba(251,180,72,0.7)";
        option.data.all.forEach(function (item) {
            var point = new esri.geometry.Point(item.X, item.Y);
            var screenPoint = map.toScreen(point);
            ctx.beginPath();
            ctx.arc(screenPoint.x, screenPoint.y, dotsSize, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        });
        // 闂儊鐐逛娇鐢ㄧ殑canvas灞�
        me.drawShineCircle(width, height);
    },
    drawShineCircle: function (width, height) {
        var me = this,
            option = this.option,
            map = option.map;

        // 闂儊鐐逛娇鐢ㄧ殑canvas灞�
        var getCanvas2 = document.getElementById('canvas2');
        if (!getCanvas2) {
            var canvas2 = document.createElement('canvas'),
                ctx2 = canvas2.getContext('2d');
            canvas2.id = "canvas2";
            canvas2.width = width;
            canvas2.height = height;
            canvas2.style.position = 'absolute';
            canvas2.style.top = 0;
            canvas2.style.left = 0;
            $("#" + me.canvasDotsId).append(canvas2);
            getCanvas2 = document.getElementById('canvas2')
        }
        ;

        var radius = 1;
        // 姘旀场澶у皬
        var bubbleSize = option.bubbleSize ? option.bubbleSize : 20;

        ctx2.strokeStyle = option.bubbleColor ? option.bubbleColor : option.dotsColor;

        var drawCircle = function () {
            radius += 0.4;
            if (radius > bubbleSize) {
                radius = 1;
            }
            option.data.mainCity.forEach(function (item) {
                var point = new esri.geometry.Point(item.X, item.Y);
                var screenPoint = map.toScreen(point);
                ctx2.beginPath();
                ctx2.arc(screenPoint.x + 2, screenPoint.y + 2, radius, 0, 2 * Math.PI);
                ctx2.lineWidth = 2;
                ctx2.closePath();
                ctx2.stroke();
            });
        };

        var render = function () {
            var prev = ctx2.globalCompositeOperation;//榛樿source-over
            ctx2.globalCompositeOperation = 'destination-in';
            ctx2.globalAlpha = 0.9;
            ctx2.fillRect(0, 0, width, height);
            ctx2.globalCompositeOperation = prev;
            drawCircle();
        };
        ani();

        function ani() {
            window.requestAnimationFrame(ani);
            render();
        };
    }
};


//---------------------------------鑱氬悎鍥�-------------------------------------------------------
function AggregatedGraph(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    this.init();
};
AggregatedGraph.prototype = {
    init: function () {
        var option = this.option, map = option.map;
        require(["esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/ClassBreaksRenderer",
                "../libs/ClusterLayer.js", "esri/geometry/Point", "esri/graphic", "esri/geometry/webMercatorUtils",
                "esri/SpatialReference", "esri/Color", "esri/dijit/PopupTemplate"],
            function (SimpleMarkerSymbol, SimpleFillSymbol, ClassBreaksRenderer, ClusterLayer, Point,
                      Graphic, webMercatorUtils, SpatialReference, Color, PopupTemplate) {
                var clusterLayer;
                var wgs = new SpatialReference({
                    "wkid": 4326
                });

                var data = option.data.map(function (item) {
                    var latlng = new Point(item.X, item.Y, wgs);
                    //杞ⅷ鍗℃墭鍧愭爣绯�
                    var webMercator = webMercatorUtils.geographicToWebMercator(latlng);

                    var attributes = {//姘旀场绐楀彛妯″瀷鐨勫睘鎬�
                        "Name": item.NAME,
                        "value": item.value
                    };
                    return {
                        "x": webMercator.x,
                        "y": webMercator.y,
                        "attributes": attributes
                    };
                });

                var popupTemplate = new PopupTemplate({//姘旀场绐楀彛妯″瀷瀹氫箟
                    "title": "",//option.popTitle ? option.popTitle :"璇︽儏",
                    // "fieldInfos": [{
                    //     "fieldName": "Name",//瀛楁鍊�
                    //     "label": "鍚嶇О",//瀛楁鏄剧ず鍒悕
                    //     visible: true//璁剧疆鏄惁鍙
                    // }, {
                    //     "fieldName": "value",
                    //     "label": "鏁板€�",
                    //     // visible: false
                    // }]
                });

                clusterLayer = new ClusterLayer({
                    "data": data,//缁戝畾鑱氬悎鏁版嵁婧�
                    "distance": option.distance ? option.distance : 50,//璁剧疆鑱氬悎璺濈锛屾牴鎹湴鍥惧垎杈ㄧ巼鏉ヨ缃悎閫傜殑鍊硷紝榛樿鏄�50
                    "id": "clusters",
                    "labelColor": option.labelColor,//鍥炬爣瀛椾綋棰滆壊鍊硷紝鐧借壊瀛椾綋
                    "labelOffset": 0,//瀛椾綋鍋忕Щ浣嶇疆
                    "resolution": map.extent.getWidth() / map.width,//璁＄畻褰撳墠鍦板浘鐨勫垎杈ㄧ巼
                    "singleColor": "#FF4021",
                    "singleTemplate": popupTemplate//缁戝畾姘旀场绐楀彛妯″瀷
                });
                var defaultSym = new SimpleMarkerSymbol("circle", 20, null,
                    new Color([0, 0, 0, 0.5])).setSize(9);
                var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

                var radius = option.radius ? option.radius : 10;

                option.renderBreaks.forEach(function (item) {
                    if (option.isIncrease == true) {
                        radius += 15;
                        renderer.addBreak(item.breaks[0], item.breaks[1], new SimpleMarkerSymbol("circle", radius, null, new Color(item.color)).setOffset(0, 5));
                    }
                    else if (option.isIncrease == false) {
                        renderer.addBreak(item.breaks[0], item.breaks[1], new SimpleMarkerSymbol("circle", radius, null, new Color(item.color)).setOffset(0, 5));
                    }
                });


                clusterLayer.setRenderer(renderer);
                map.addLayer(clusterLayer);
            });

        // 寮圭獥缇庡寲
        $(".esriPopup .titlePane").css({
            "background-color": "#EEEEEE",
            "color": "#525252"
        });
        $(".esriPopup .sizer").css({
            "width": "170px"
        });
        $(".esriPopup .titleButton").css({
            "background": " url(../img/location/wrong.png) no-repeat center"
        });
        $(".titleButton .prev").hide();
        $(".titleButton .next").hide();
        $(".esriPopup .titleButton.maximize").hide();
        $(".actionList").hide();
    }
};

//-----------------------------------璺緞鐑姏鍥�----------------------------------------
function RouteHeatMap(map, data, option) {
    this.option = option || {};
    this.option.data = data;
    this._map = option.map = map;
    if (!data || !map) {
        return;
    }
    var id = document.getElementById('canvasDiv');
    if (!id) {
        var div = this._echartsContainer = document.createElement('div');
        this.id = div.id = 'canvasDiv';
        div.style.position = 'absolute';
        div.style.height = this._map.height + 'px';
        div.style.width = this._map.width + 'px';
        div.style.top = 0;
        div.style.left = 0;
        this._map.__container.appendChild(div);
    }


    this.init();
    this._bindEvent();
};
RouteHeatMap.prototype = {
    _bindEvent: function () {
        var me = this;
        this._map.on("pan-start", function () {
            $("#canvasID").remove();
        });
        this._map.on("pan-end", function () {
            me.init();
        });
        this._map.on("zoom-start", function () {
            $("#canvasID").remove();
        });
        this._map.on("zoom-end", function () {
            me.init();
        });

    },
    init: function () {
        var me = this;
        var getCanvasID = document.getElementById('canvasID');
        if (!getCanvasID) {
            $('#' + me.id).append('<canvas id="canvasID" width='
                + $('#' + me.id).width() + ' height=' + $('#' + me.id).height() + '></canvas>');
            getCanvasID = document.getElementById('canvasID');
        }
        var option = this.option,
            map = option.map;
        var ctx = getCanvasID.getContext("2d");

        var width = $("#" + me.id).width(),
            height = $("#" + me.id).height();

        ctx.save();

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = option.strokeColor || 'rgba(0, 0, 0, 0.8)';

        /*ctx.shadowOffsetX = ctx.shadowOffsetY = 0;

        ctx.shadowColor = 'black';*/
        ctx.shadowBlur = option.shadowBlur ? option.shadowBlur : 0.1;

        ctx.lineWidth = option.lineWidth || 5;
        ctx.beginPath();

        option.data.forEach(function (item) {
            var point = new esri.geometry.Point(item.road[0][0], item.road[0][1]);
            var screenPoint = map.toScreen(point);

            ctx.beginPath();
            ctx.moveTo(screenPoint.x, screenPoint.y);

            for (var i = 1; i < item.road.length; i++) {
                var itemA = item.road[i];
                var point1 = new esri.geometry.Point(itemA[0], itemA[1]);
                var screenPoint1 = map.toScreen(point1);

                ctx.lineTo(screenPoint1.x, screenPoint1.y);
            }
            ctx.globalAlpha = 0.9;
            ctx.stroke();
        });

        var colored = ctx.getImageData(0, 0, width, height);
        me.colorize(colored.data, me.getGradient(option.gradient));
        ctx.putImageData(colored, 0, 0);
        ctx.restore();
    },
    getGradient: function generalGradient(grad) {
        if (!grad) {
            grad = {
                "0": "blue",
                "0.5": "cyan",
                "0.7": "lime",
                "0.8": "yellow",
                "1.0": "red"
            }
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        var graColor = ctx.getImageData(0, 0, 1, 256).data;
        return graColor;
    },
    colorize: function colorize(pixels, gradient) {
        var jMin = 0;
        var jMax = 1024;


        var maxOpacity = this.option.maxOpacity || 0.8;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value

            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }

            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            } else {
                pixels[i] = 0;
            }
        }
    }
};



















