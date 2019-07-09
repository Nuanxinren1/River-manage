/**
 * 登录检查
 */
function checkLogin() {
    if (getCookie(config.cookie.tokenCookieName) == null) {
        window.location.href = "login.html";
    }
}

//获取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}