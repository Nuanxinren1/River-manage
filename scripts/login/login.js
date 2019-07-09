//用户名和密码点击的时候css样式切换
$(function () {
    // 用户信息框显示切换
    $("#userName").focus(function () {
        $("#userName").css("border", "0");
    });
    $("#password").focus(function () {
        $("#password").css("border", "0");
    });
	$(".login_Btn").click(login);
	$("#pass").keydown(function(event){
		var evt = window.event||event;
		if (evt.keyCode == 13) { 
			login()
		} 
	})
	
	
	
	
	
});
function login(){
		let yhm = $("#yhm").val();
		let pass = $("#pass").val();
		if(yhm == "admin" && pass == "yutu@123"){
			window.location.href = "index.html";
		} else {
			alert("账号或密码错误");
		}
	}
/**
 * 监听回车事件,触发登录
 */
function enterPress(e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
        LoginIn();
    }
}

var rootPath;//从访问地址截断获得程序起始根路径
if (window.location.href.indexOf("?") != -1) {
    rootPath = window.location.href.substr(0, window.location.href.indexOf("?"));
    rootPath = rootPath.substr(0, rootPath.lastIndexOf("/") + 1);
} else {
    rootPath = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
}
if (window.location.href.lastIndexOf("?token=") != -1) {
    window.location.href = rootPath;
}

//登录控制接口地址
var loginServiceUrl = rootPath + "LoginService.asmx";

/**
 * 登录
 */
function LoginIn() {
    if ($("#userName").val() == "" || $("#password").val() == "") {
        alert("请填写用户名密码！");
        return;
    }

    var userName = $("#userName").val();
    var userPassword = $("#password").val();

    $.ajax({
        type: "POST",
        url: loginServiceUrl + "/login",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ name: 'gis', pwd: 'gis' }),
        dataType: "json",
        success: function (result) {
            result = (result && result.d && result.d.trim() != "") ? result.d : "[]";
            var json = eval("(" + result + ")");
            if (json.isSuccess == false) {
                alert("用户名或密码错误！");
            }
            else if (json.isSuccess == true) {
                setCookie("GIS_USER_TOKEN", userName);
                window.location.href = rootPath;
            }
        },
        error: function () {
            alert("登陆异常,请与管理员联系!");
        }
    })
}

/**
 * 退出登录
 */
function btn_logout() {
    $.post("Ashx/getLoginInfo.ashx", { flag: "LoginOut" }, function (result) {
        if (result == "true") {
            window.location.href = "login.html";
        }
    })
}



//写cookies
function setCookie(name, value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    //exp.setDate(exp.getDate() + 7);//设置为当前时间起算7天后过期
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//获取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}






























//function setCookie(c_name, value, expiredays) {
//    var exdate = new Date();
//    exdate.setDate(exdate.getHours() + expiredays);
//    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
//}


//function getCookie(name) {
//    var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
//    if (xarr != null)
//        return unescape(xarr[2]);
//    return null;
//}

//$(document).ready(function () {
//    //登录

//    $(".btnLogin").click(function () {
//        if ($("#userName").val() === "admin"
//            && $("#passWord").val() === "admin") {
//            setCookie('username', 'Admin', 1);
//            window.open('Default.html', '_self');
//        }

//        else {
//            alert("账号或密码错误！");
//        }

//        return;
//        $.get("../ashx/login.ashx",
//        {
//            name: $("#txtName").val(),
//            pwd: encodeURIComponent($("#txtPassword").val()),
//            code: $("#txtCode").val()
//        },
//        function (data) {
//            switch (data) {
//                case "code error":
//                    alert("验证码错误！");
//                    break;
//                case "success":
//                    alert("登录成功！");
//                    break;
//                case "false":
//                    alert("登录失败！");
//                    break;
//                default:
//                    alert("数据加载失败，请稍后再试！");
//                    break;
//            }
//        });
//    });

//});


//登录
function login32323() {
    var userName = $("#userName").val();
    var passWord = $("#password").val();
    if (userName == "") {
        $("#userName").css("border", "1px solid red");
        return;
    }
    if (passWord == "") {
        $("#password").css("border", "1px solid red");
        return;
    }
    console.log("userInfo:" + userName + "," + passWord);

    delCookie("gisUserName");
    delCookie("gisPassWord");

    var success = null;
    if (userName == "admin" && passWord == "admin") {
        success = true;
    }
    if (success == true) {
        setCookie("gisUserName", userName);
        setCookie("gisPassWord", passWord);
        location.href = "http://localhost:11604/Default.html?userName=" + encodeURI(userName);
    }
    else {
        alert("登陆异常,请与管理员联系!");
    }

    //$.ajax({
    //    url: basePath + "login.do",
    //    type: "post",
    //    data: {
    //        userName: userName,
    //        passWord: passWord
    //    },
    //    dataType: "json",
    //    success: function (resultJson) {
    //        if (resultJson.result == 0) {
    //            alert("用户名或密码错误！");
    //            return;
    //        }
    //        if (resultJson.result == 1) {
    //            // window.location.reload();
    //            //location.href=basePath+"syslist3.jsp";
    //            location.href = "http://10.220.13.251:8112/CPGIS/Default.html?userName=" + encodeURI(userName) + "&passWord=" + encodeURI(passWord);
    //        }
    //    },
    //    error: function () {
    //        alert("登陆异常,请与管理员联系!");
    //        return;
    //    }
    //});
}
