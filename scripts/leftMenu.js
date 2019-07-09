$("#leftMenu h3").hover(function () {
    var lis = $(this).addClass("open").next().fadeIn().parent().siblings();
    lis.find("h3").removeClass("open");
    lis.find(".secondMenu").hide();
});

