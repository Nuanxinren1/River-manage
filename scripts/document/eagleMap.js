var sepLayer;
var arcLoaded=false;
$(function () {
    //初始化地图
    //mugis.mapInit.initMap(initMapCallback());
    // mugis.mapInit.initMap(function(){
    // 	sepLayer = new mapAPI.GraphicsLayer({id:"mineLayer"});
    // 	map.addLayer(sepLayer);
    // 	arcLoaded=true;
    // });

});

//将图层要素添加到地图
function addPointsToMap(mineData){
	 $(".single_ditu01").remove();
	if(sepLayer){
		sepLayer.clear();
	}
	for(var i in mineData){
		var mineItem = mineData[i];
		var mineGra = createGra(mineItem);
		sepLayer.add(mineGra);
	}
	mugis.mapZoom.setFullExtent();
	//sepLayer.on("click",layerClick);
}

function createGra(item){
	var gra = new mapAPI.Graphic();
	if(item.XCOORDINATE && item.YCOORDINATE){
		var pms=new mapAPI.PictureMarkerSymbol("../image/gis/point.png",20,20);

		var point = new mapAPI.Point(item.XCOORDINATE,item.YCOORDINATE);
		gra.geometry = point;
		gra.symbol = pms;
		gra.attributes = item;
		var content = "<div class=\"infodiv\"><table>";
		content += "<tr><td class=\"lbtitle\" style='width:40px;'>名称" + "：</td><td class=\"lbcontent\" style='cursor:pointer;text-decoration: underline;' onclick=\"window.open('../company.do?EPCODE="+item.EPCODE+"&EPNAME="+item.EPNAME+"', '_blank');\"> " + item.EPNAME + "</td></tr>";
		content += "<tr><td class=\"lbtitle\" style='width:40px;'>地址" + "：</td><td class=\"lbcontent\"> " + item.ADDRESS + "</td></tr>";
		content += "</table></div>";
		var taxParcelTemplate = new mapAPI.InfoTemplate(item.EPNAME, content);
		gra.setInfoTemplate(taxParcelTemplate);
	}
	return gra;
}

//生成搜索到企业的定位图标
function positionIcon(item){
	if(item.XCOORDINATE && item.YCOORDINATE){
		return "<img onclick='locationXY(\""+item.XCOORDINATE+"\",\""+item.YCOORDINATE+"\")' src='../image/archives/dingwei_pressed.png' title='请点击进行定位'>";
	}
	else{
		return "<img src='../image/archives/dingwei_default.png' title='无企业位置信息'>";
	}
}

//单击点位图标在右侧小地图进行定位
function locationXY(x,y){
	var point = new mapAPI.Point( {"x": parseFloat(x), "y": parseFloat(y), "spatialReference": {"wkid": 4326 } })
	map.centerAndZoom(point,10);
	highGraphicLight(map,point);
}

//添加高亮
function highGraphicLight(map,point) {
  //var point = new Point(gra.geometry.x, gra.geometry.y, new SpatialReference({ wkid: 4326 }));
  $(".single_ditu01").remove();
  var screenPnt = map.toScreen(point);
  var html = "<div class='single_ditu01' id='single_ditu01' style='pointer-events:none;'></div>";
  $("#map").append(html);
  $(".single_ditu01:after").css({
      "left": screenPnt.x - 50 + "px",
      "top": screenPnt.y - 56 + "px"
  });
  $(".single_ditu01").css({
      "position": "absolute",
      "left": screenPnt.x + "px",
      "top": screenPnt.y + "px"
  });

  $(".single_ditu01").click(function () {
      $(this).remove();
  });
  var zoomStart = dojo.connect(map, "onZoomStart", null, function () {
      $(".single_ditu01").css("display", "none")
  });
  var zoomEnd = dojo.connect(map, "onZoomEnd", null, function () {
      screenPnt = map.toScreen(point);
      $(".single_ditu01:after").css({
          "position": "absolute",
          "left": screenPnt.x - 50 + "px",
          "top": screenPnt.y - 52 + "px"
      });
      $(".single_ditu01").css({
          "position": "absolute",
          "left": screenPnt.x - 50 + "px",
          "top": screenPnt.y - 52 + "px"
      });
      $(".single_ditu01").css("display", "block");
  });
  var panStart = dojo.connect(map, "onPanStart", null, function () {
      $(".single_ditu01").css("display", "none");
  });
  var panEnd = dojo.connect(map, "onPanEnd", null, function () {
      screenPnt = map.toScreen(point);
      $(".single_ditu01:after").css({
          "position": "absolute",
          "left": screenPnt.x - 50 + "px",
          "top": screenPnt.y - 52 + "px"
      });
      $(".single_ditu01").css({
          "position": "absolute",
          "left": screenPnt.x - 50 + "px",
          "top": screenPnt.y - 52 + "px"
      });
      $(".single_ditu01").css("display", "block");

  });
}
