//百度地图API操作
mugis.BMapOperation = {
    //百度地图API实现定位操作
    BMapLocation: {
        //获取当前点定位坐标
        getXY: function () {
            var geolocation = new BMap.Geolocation();
            var pt;
            var showpositionname = this.showPositionName;
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    map_CenterAtAndZoom(r.point.lng, r.point.lat, 6);
                    //setCookie("localX", r.point.lng);
                    //setCookie("localY", r.point.lat);
                    //alert(r.point.lng + " ， " + r.point.lat);
                    pt = r;
                    showpositionname(pt);
                    //传参数给地图按钮
                    //document.getElementById("alinkMap").href += "&x="+r.point.lng+"&y="+r.point.lat;
                    //document.getElementById("alinkMap").style.display="block";
                }
            });
        },
        //显示传入点的位置名称(r.point.lat,r.point.lng)
        showPositionName: function (r) {
            // ak = appkey 访问次数流量有限制
            var url = 'http://api.map.baidu.com/geocoder/v2/?ak=7b788c5ea45cc4b3ac6331a4b0643d5b&callback=?&location=' + r.point.lat + ',' + r.point.lng + '&output=json&pois=1';
            $.getJSON(url, function (res) {
                $("#msg").html(url);
                alert(res.result.addressComponent.city);
            });
        }
        
    }
}