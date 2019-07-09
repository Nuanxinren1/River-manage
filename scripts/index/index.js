$(function () {
    $(".nav-list>li").click(function () {
        $(".nav-list>li").removeClass("active");
        $(this).addClass("active");
        if($(this).find(".ul-second-list").length){
            // 判断有二级菜单
            let top=$(this).css("top")+60;
            let left=$(this).css("left");
            $(".ul-second-list").hide();
            $(this).find(".ul-second-list").css({
                "top":top+"px",
                "left":left+"px",
                "display":"block"
            });
        }else {
            // $(".ul-second-list").hide();
            openNewPanel($(this).attr("src"));
        }
    });
    $(".ul-second-list>li").click(function () {
        openNewPanel($(this).attr("src"));

    })
});

// 打开新页面
function openNewPanel(src) {
    setTimeout(function () {
        $(".ul-second-list").hide();
    },0)
    $("#main-iframe").attr("src",src);

}
