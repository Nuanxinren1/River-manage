/**
 * Created by ZhangBB on 2018/4/9.
 */

$(function () {
    getNewsInfo();// 获取菜单数据
    
});
// 获取菜单数据
function getNewsInfo() {
    $.getJSON("../mock/news.json",function (result) {
        var firstMenu='';
        $.each(result,function (i,obj) {
            firstMenu+=setFirstMenu(obj,i);
            if(obj.children!=undefined){//当有子节点的时候
                var secondMenu='<ol class="secondList" style="display: none">';
                $.each(obj.children,function (j,obj1) {
                    secondMenu+=setSecondMenu(obj1);
                });
                secondMenu+='</ol>';
                $('body').append(secondMenu);
                
            }
        });
        $(".firstNav").html(firstMenu);
        $(".firstNav li").click(function () {
            var top=setSecondMenuTop($(this));
            var left=setSecondMenuLeft($(this));
            setPosition(top,left,$(this).index());
            setStyle($(this));
        });
    })
}
function setFirstMenu(data,index) {
	if (data.url != undefined) {
		if(index == 0){
			return '<li class="hover" onclick="openUrl(\''+data.url+'\',this)"><img src="'+data.img+'"><p class="navTitle" >'+data.name+'</p></li> ';
		}else{
			return '<li onclick="openUrl(\''+data.url+'\',this)"><img src="'+data.img+'"><p class="navTitle" >'+data.name+'</p></li> ';
		}
		
	}else{
		return '<li><img src="'+data.img+'"><p class="navTitle" >'+data.name+'</p></li> ';
	}
}

function openUrl(url,el) {
	$(".secondList li").removeClass("selected");
    $("#mumap").attr("src",url);
}


function openUrl2(url,el) {
	$(".secondList li").removeClass("selected");
	$(el).addClass("selected");
	$(".secondList").hide();
    $("#mumap").attr("src",url);
}
//跳转链接
function setSecondMenu(data) {
	if(data.disabled==true){
	    return '<li  class="disabled"><p class="navSecond" >' + data.name + '</p></li> ';

	}else{
	    return '<li onclick="openUrl2(\'' + data.url + '\',this)"><p class="navSecond" >' + data.name + '</p></li> ';

	}

}
function setSecondMenuTop(el) {
    return $(el).offset().top;
}
function setSecondMenuLeft(el) {
    return $(el).offset().left;
}
function setPosition(top,left,index) {
    setOtherHide(index);
    $(".secondList").eq(index).css({"top":top+56,"left":left}).slideToggle();
}
function setStyle(e) {
    $(".firstNav li").removeClass("hover");
    $(e).addClass("hover");
}
function setOtherHide(index) {
    for (var i=0;i<$(".secondList").length;i++){
        if(i!=index){
            $(".secondList").eq(i).hide();
        }
    }

}