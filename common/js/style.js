
$(function(){
	init_style();
})
function init_style() {
    // 获取cookie中的内容
    var cookie_style = $.cookie("mystyle");
    
    // 如果cookie中内容为空,则选择默认皮肤样式,如果内容不为空,就设置对应样式
    if(cookie_style==null){
        $("#mystyle").attr("href","../common/css/default.css");
    }else{
        $("#mystyle").attr("href","../common/css/"+cookie_style+".css");
    }
    
}
//给切换echarts线的颜色写的方法
function getColor(){
	var cookie_style=$.cookie("mystyle");
	switch(cookie_style){
		case "default":
			return ["#73bff9"];			
		case "blue":
			return ["#1c84c6"];
			
		case "purple":
			return ["#666cb8"];
			break;
		case "green":
			return ["#16a297"];
			
		case "red":
			return ["#e55464"];
		default:
			return ["#73bff9"];			
	}
	
}