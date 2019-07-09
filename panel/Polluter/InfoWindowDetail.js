//1.	EntCode:130300164943
//2.	EntName:"中节能淇县水务有限公司"
//3.	IfGasEnterprise:1
//4.	IfOnlineMonitoringEnt:1
//5.	IfWaterEnterprise:0
//6.	OnlineStatus:1
//7.	RegionCode:611001000
//8.	RegionName:"市辖区"
//9.	SuperviseType:1
//10.	basinCode:"0100000000"
//11.	clusterId:2
//12.	p_address:"鹤壁市淇县南杨庄村东300米"
//13.	p_id:130300164943
//14.	p_lat:33.583943
//15.	p_lon:109.966672
//16.	p_name:"中节能淇县水务有限公司"
//17.	tradeCode:"AF"
//18.	tradeName:"其他"

var testentjson = [{
    "EntCode": "1",
    "EntName": "富宁县国祯污水处理有限公司",
    "p_lat": 23.6272,
    "p_lon": 105.644,
    "regionCode": "530100000000",
    "regionName": "昆明市",
    "SuperviseType": "01",
    "IfOnlineMonitoringEnt": 1,
    "OnlineStatus": null,
    "rank": 1,
    "CityName": "昆明市",
    "EntAddress": "XX县",
    "FK_NationalEIndustry": "棉纺织",
    "FK_PolluterSuperviseType": "XX县",
    "LegalPpersonName": "李一",
    "ScaleName": "大企业",
    "CreateDate": "2017-01-01",
    "BasinName": "红河"
}];


/*敏感点图层配置*/
var layerList = _layerList;

/*一企一档地址*/
var oneEnterInfoUrl = _oneEnterInfoUrl;

//arcgis js api 地址
var _defaultImageUrl = window.parent._arcgisJSAPIUrl;

//查询出的该企业信息
var searchResult = [];

var paramObject;

$(document).ready(function () {
    debugger;
    paramObject = coustomTool.GetURLParams(document.location.href);
    
    //获取当前企业信息
    if (paramObject.id != "" && paramObject.id != null) {
        var loading = coustomTool.Loading("body", '../../IMG/loading/loading.gif');
        $.post("../../Ashx/ashx.ashx", {
            serviceName: "ZXJCService",
            methodName: "GetEnterList",
            params: "EntCode=" + paramObject.id
        }, function (result) {
            coustomTool.UnLoading(loading);
            $("#div_body").css("visibility", "visible");
            var json = eval("(" + result + ")");
            success(json || []);
        })
        .error(function () {
            coustomTool.UnLoading(loading);
            //success([]);
        });

        function success(json) {
            searchResult = json;

            $("#EntName").html((json[0]["EntName"] == null || json[0]["EntName"] == "") ? "---" : json[0]["EntName"]);
            $("#FK_City").html((json[0]["RegionName"] == null || json[0]["RegionName"] == "") ? "---" : json[0]["RegionName"]);
            $("#FK_CountyDistrict").html((json[0]["p_address"] == null || json[0]["p_address"] == "") ? "---" : json[0]["p_address"]);
            $("#FK_PolluterSuperviseType").html((json[0]["SuperviseType"] == null || json[0]["SuperviseType"] == "") ? "---" : json[0]["SuperviseType"]);
            $("#RiverName").html((json[0]["BasinName"] == null || json[0]["BasinName"] == "") ? "---" : json[0]["BasinName"]);
            $("#CreateTime").html((json[0]["CreateDate"] == null || json[0]["CreateDate"] == "") ? "---" : json[0]["CreateDate"]);
            $("#EntPerName").html((json[0]["LegalPpersonName"] == null || json[0]["LegalPpersonName"] == "") ? "---" : json[0]["LegalPpersonName"]);
            $("#EntScale").html((json[0]["ScaleName"] == null || json[0]["ScaleName"] == "") ? "---" : json[0]["ScaleName"]);
            $("#FK_KeyIndustryType").html((json[0]["FK_NationalEIndustry"] == null || json[0]["FK_NationalEIndustry"] == "") ? "---" : json[0]["FK_NationalEIndustry"]);

            //$("#EntName").attr("href", oneEnterInfoUrl + "&enterPriseCode=" + paramObject.id + "&username=system");
            $("#EntName").attr("href", oneEnterInfoUrl + "&enterPriseCode=" + "0002486" + "&username=system");
        }
    }

});


//缓冲查询
function bufferSearchClick() {
    var lon = Number(paramObject.lon);
    var lat = Number(paramObject.lat);

    //被缓冲图层
    var layerUrls = new Array();
    for (var item in layerList) {
        var obj = layerList[item];
        if (obj.selected == true) {
            layerUrls.push(obj);
        }
    }

    var radius = document.getElementById("radiusText").value;
    debugger;
    window.parent.map_PointBuffer(lon, lat, radius / 1000, 0, 360, layerUrls);
}


//敏感点复选框点击
function mingandianChange(e) {
    for (var item in layerList) {
        var obj = layerList[item];
        if (obj.name == e.id) {
            obj.selected = e.checked;
        }
    }
}


//坐标修改
function modifycoordinate() {
    document.getElementById("update").style.display = "none";
    document.getElementById("coordinate").style.display = "block";
    document.getElementById("longitude").value = paramObject.lon;
    document.getElementById("latitude").value = paramObject.lat;
}

//提交修改
function savetoserver() {
    $.post("../../Ashx/setEntXY.ashx", {
        EntCode: paramObject.EnterCode,
        Longitude: document.getElementById("longitude").value,
        Latitude: document.getElementById("latitude").value,
        ReturnDataType: "1"
    }, function (result) {
        if (result) {
            alert("修改成功！");
        }
    })
    .error(function () {
        alert("修改成功！2");
    });
}

//地图选点
function selectpointfrommap() {

    //$("#selecticon").parents().parent('.esriPopupWrapper').css("display", "none");
    $("body", parent.document).find('.esriPopupWrapper').css("display", "none");
    //$(window.parent.document).find(".esriPopupWrapper").css("display", "none");

    require([
        "esri/geometry/point",
        "esri/toolbars/draw",
        "esri/graphic"
    ], function (Point, Draw, Graphic) {
        var toolbar = new esri.toolbars.Draw(parent.map);
        toolbar.activate(Draw.POINT);
        toolbar.on("draw-complete", function (evt) {
            $("body", parent.document).find('.esriPopupWrapper').css("display", "block");
            toolbar.deactivate();
            //var symbol = new esri.symbol.SimpleMarkerSymbol();//设置符号
            // var graphic = new esri.Graphic(mapPoint, symbol);//创建点图形
            //parent.map.graphics.add(graphic);
            document.getElementById("longitude").value = evt.geometry.x;
            document.getElementById("latitude").value = evt.geometry.y;
        });
    });
}

//选点取消
function cancle() {
    document.getElementById("update").style.display = "block";
    document.getElementById("coordinate").style.display = "none";
}


////气模型
//function airModelClick() {
//    window.open('../../Panel/HorseMapModel/AirModel.html', '_blank')
//}
////水模型
//function waterModelClick() {
//    window.open('../../Panel/HorseMapModel/WaterModel.html', '_blank')
//}