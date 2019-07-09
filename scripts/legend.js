/**
 * 图例的json对象构造方法
 * 图例是以表格的方式构造
 * @param tableId {string}   表格的唯一标识
 * @param lengStyle {string} 图例的绝对定位样式，默认位于右下方
 * @param imgStyle {string} 图例中图片大小
 * @param legend 对象数组，图例内容
 * @create 曾国范
 * @date 2019年4月11日
 */
var layerLegends = {
    1: {// 污染源分布情况-全部
        tableId: "tuli",
        lengStyle: "left:8px;bottom:8px;width:110px;white-space: nowrap;",
        imgStyle:"",
        colorSqural: "width:12px;height:12px;margin-top: 2px; margin-left: 10px;border-radius: 2px;",    
        legend: [
            { label: '0-2000', imageData: '', color: "#51DEA0" },
            { label: '2000-7000', imageData: '', color: "#FEBE24" },
            { label: '7000-20000', imageData: '', color: "#FE8F24" },
            { label: '20000+', imageData: '', color: "#55B3D7" },
            { label: '入河排污口', imageData: 'img/PKPoints/river.png', color: "" },
            { label: '入海排污口', imageData: 'img/PKPoints/sea.png' , color: ""}         
        ]
    }
}
/**
 * 动态添加图例
 * @create 曾国范
 * @date 2019年4月11日
 * @param {*} numberStr 
 */
function creatLegend(numberStr) {
    clearLengend();//添加图例之前先清除
    var tableId = layerLegends[numberStr]["tableId"];
    var str = "<div id='legend' style='z-index:10;overflow: auto; border: #000 1px solid;position:absolute;" + layerLegends[numberStr]["lengStyle"] + " display:block'>";
    var legend = layerLegends[numberStr]["legend"];
    str += "<table id='" + tableId + "' style='width:100%;display:block;BACKGROUND-COLOR: #E5EFF7;'>";
   // debugger
    for (var j = 0; j < legend.length; j++) {
        if(j<=3){
            str += '<tr valign="middle" style=" cursor: none;">'
            + '<td style="width:auto" >'
            + '<div style="' + layerLegends[numberStr]["colorSqural"] + ';background-color: ' + legend[j]["color"] + ' "></div>'
            + '</td>'
            + '<td align="center" style="font-size: 13px;" >' + legend[j]['label'] + '</td>'
            + '</tr>';
        }else{
            str += '<tr valign="middle" style=" cursor: none;">'
            + '<td style="width:auto" >' 
             + '<img style="' + layerLegends[numberStr]["imgStyle"] + '"  src="' + legend[j]['imageData'] + '" alt=""/>'
            + '</td>'
            + '<td align="center" style="font-size: 13px;" >' + legend[j]['label'] + '</td>'
            + '</tr>';
        }
       
    }
    str += "</table>" + "</div>";
    // 判断图是否存在
    if (document.getElementById('legend')) {
        document.getElementById('legend').remove();
    }
    // 动态添加图例
    $("body").append(str);
    $("#legend").show('slow');
}
/**
 * 清除地图上的图例
 * @create 曾国范
 * @date 2019年4月11日
 */
function clearLengend() {
    if (document.getElementById('legend')) {
        document.getElementById('legend').remove();
    }
}

