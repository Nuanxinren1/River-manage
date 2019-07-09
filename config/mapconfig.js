var rootPath;
//页面的访问地址截断，获得页面起始根路径
if (window.location.href.indexOf("?") != -1) {
    rootPath = window.location.href.substr(0, window.location.href.indexOf("?"));
    rootPath = rootPath.substr(0, rootPath.lastIndexOf("/") + 1);
} else {
    rootPath = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
}
if (window.location.href.lastIndexOf("?token=") != -1) {
    window.location.href = rootPath;
}

//mapconfig配置信息
(function (window) {
    //gis通用方法入口
    mugis = {};

    //mapconfig配置信息
    mapconfig = {
        //页面起始根路径
        rootPath: rootPath,

        //跨域文件
        proxyUrl: rootPath + "proxy/proxy.ashx",

        //图片资源
        defaultImageUrl: rootPath + "IMG",

        /*地图类型，1地图服务，2地图容器，3天地图*/
        mapType: 3,

        /*地图服务地址(矢量、栅格DEM，影像)*/
        //vectorMapServerUrl: "http://192.168.120.103:6080/arcgis/rest/services/WenshanMap/MapServer",
        //rasterMapServerUrl: "http://192.168.120.103:6080/arcgis/rest/services/WenshanDemMap/MapServer",
        //imgMapServerUrl: "http://192.168.120.106:6080/arcgis/rest/services/YunNanMapService/MapServer",
        vectorMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",
        rasterMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",
        imgMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",

        //几何服务地址
       // geometryServer: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer",
        //打印服务
        mapPrintServerUrl: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
       
  
      
      //中国地图边界
      MapServer_Ssx_china:"http://192.168.5.74:6080/arcgis/rest/services/ErWuPu/wupu_Ssx_china4490/MapServer",//-服务器
      //中国的世界地图的边界  2019年3月29日发布-本机
      worldMap : "http://192.168.5.74:6080/arcgis/rest/services/ErWuPu/wupu_Ssx_china4490/MapServer",
        //地图范围
        //河南省范围
        // extent: {
        //     "xmin": 109.542, "ymin": 32.537, "xmax": 117.040, "ymax": 36.025, "spatialReference": { "wkid": 4326 }
        // },
        //中国区域
        extent: {
            "xmin": 72.403, "xmax": 135.41, "ymin": 18.047, "ymax": 55.317, "spatialReference": { "wkid": 4326 }
        },

        //地图加载
        baseMap: {
            //地图加载的默认参数layer,zoom level,center...
        },

        //glevel全国1，省2，市3，县4，乡镇5，村6
        /*区县code、名称和经纬度信息配置*/
        cityInfo: [
           { cityCode: "410000000000", cityCodeSub: "41", cityName: "河南省", "lon": 113.615, "lat": 34.762, "level": 0, "glevel": 2 },
           { cityCode: "410100000000", cityCodeSub: "4101", cityName: "郑州市", "lon": 113.615, "lat": 34.762, "level": 1, "glevel": 3 },
           { cityCode: "411000000000", cityCodeSub: "4110", cityName: "许昌市", "lon": 113.840, "lat": 34.041, "level": 1, "glevel": 3 },
           { cityCode: "410300000000", cityCodeSub: "4103", cityName: "洛阳市", "lon": 112.440, "lat": 34.630, "level": 1, "glevel": 3 },
           { cityCode: "410400000000", cityCodeSub: "4104", cityName: "平顶山", "lon": 113.187, "lat": 33.767, "level": 1, "glevel": 3 },
        ],

        cityInfo222: [
            { cityCode: "611000000000", "cityName": "商洛市", "lon": 109.928, "lat": 33.861, "level": 1, "monitorValue": 0 },
            { cityCode: "611002000000", "cityName": "商州区", "lon": 109.543828, "lat": 33.037981, "level": 1, "monitorValue": 0 },
            { cityCode: "611021000000", "cityName": "洛南县", "lon": 109.677661, "lat": 33.826384, "level": 1, "monitorValue": 0 },
            { cityCode: "611022000000", "cityName": "丹凤县", "lon": 109.222887, "lat": 33.679284, "level": 1, "monitorValue": 0 },
            { cityCode: "611023000000", "cityName": "商南县", "lon": 109.816216, "lat": 33.50512, "level": 1, "monitorValue": 0 },
            { cityCode: "611024000000", "cityName": "山阳县", "lon": 109.7088045, "lat": 33.141193, "level": 1, "monitorValue": 0 },
            { cityCode: "611025000000", "cityName": "镇安县", "lon": 109.852361, "lat": 33.858585, "level": 1, "monitorValue": 0 },
            { cityCode: "611026000000", "cityName": "柞水县", "lon": 109.228939, "lat": 33.59573, "level": 1, "monitorValue": 0 }
        ],



        hotLayerList: [
            {
                selected: true,
                name: "xuexiao",
                icon: "IMG/SpaceSearch/教育教研.png",
                layerUrl: "http://113.200.60.90:6080/arcgis/rest/services/ShangluoMap/MapServer" + "/11",
                infoTiledField: "ID ",
                infoParam: [{ "label": "名称：", "field": "Name" }, { "label": "地址：", "field": "Address" }]
            },
            {
                selected: true,
                name: "yiyuan",
                icon: "IMG/SpaceSearch/医疗卫生.png",
                layerUrl: "http://113.200.60.90:6080/arcgis/rest/services/ShangluoMap/MapServer" + "/12",
                infoTiledField: "ID ",
                infoParam: [{ "label": "名称：", "field": "Name" }, { "label": "地址：", "field": "Address" }]
            },
            {
                selected: true,
                name: "dangzhengjiguan",
                icon: "IMG/SpaceSearch/党政机关.png",
                layerUrl: "http://113.200.60.90:6080/arcgis/rest/services/ShangluoMap/MapServer" + "/5",
                infoTiledField: "ID ",
                infoParam: [{ "label": "名称：", "field": "Name" }, { "label": "地址：", "field": "Address" }]
            },
            {
                selected: true,
                name: "jumindi",
                icon: "IMG/SpaceSearch/居民小区村庄.png",
                layerUrl: "http://113.200.60.90:6080/arcgis/rest/services/ShangluoMap/MapServer" + "/22",
                infoTiledField: "ID ",
                infoParam: [{ "label": "名称：", "field": "Name" }, { "label": "地址：", "field": "Address" }]
            },
        ],
        china_border:"http://192.168.5.74:6080/arcgis/rest/services/ErWuPu/wupu_Ssx_china4490/MapServer",
        riverAndAreaJH:"http://192.168.5.74:6080/arcgis/rest/services/ErWuPu/river_and_area/MapServer",
         localhostAqi:"http://10.103.27.110:6080/arcgis/rest/services/er_wu_pu_zt_server/MapServer",
         //河流水系专题 20190421
         riverSystem:"http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/cqSpecial/MapServer",  
         //长江流域及渤海支流 20190421
         YangtzRiver: "http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/cjSpecial/MapServer" ,
         //排污口插值 20190421
         RowmouthCZ:"http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/rhrhIdw/MapServer",
         YangtzRiver2 : "http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/YongRiver/MapServer",
         riverSystemDefaule:"http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/YongRiver/MapServer",
         //20190421
         waterResourcesZoing:{
             1:{ //一级分区
                 url:'http://192.168.5.74:6080/arcgis/rest/services/waterServices/MapServer/23'
             },
             2:{ //二级分区
                 url:'http://192.168.5.74:6080/arcgis/rest/services/waterServices/MapServer/22'
             },
             3:{ //三级分区
                 url:'http://192.168.5.74:6080/arcgis/rest/services/waterServices/MapServer/21'
             }
         },
             //几何服务地址--公司服务器 20190421
      geometryServer: "http://192.168.5.74:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
      pointClickRiver:"http://192.168.5.74:6080/arcgis/rest/services/rhrhDemo/sewRiver/MapServer",
    //自己的本地的GIS服务 20190421
  //    geometryServer:"http://10.103.27.110:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",

    };

    //map地图对象信息
    mapinfo = {
        map: null,
        initExtent: null,
        panStart: null,
        panEnd: null,

    };

})(window);
