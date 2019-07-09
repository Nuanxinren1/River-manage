$(function(){
	lunbo();
})
function lunbo() {
    $('.flexslider').flexslider({
        directionNav: false,//是否显示左右控制按钮
        controlNav: true, //是否显示控制菜单(小圆点)
        keyboardNav: true, //是否键盘左右方向键控制图片滑动
        mousewheel: false, //是否鼠标滚轮控制制图片滑动
        animation: "fade",//图片变换方式 "fade" or "slide"
        slideshowSpeed: 1500,  //自动播放速度毫秒
        animationDuration: 200, //渐变毫秒速度
        slideDirection: "vertical"  // 图片设置为滑动式时的滑动方向：左右或者上下"horizontal" or "vertical"
    });
}
