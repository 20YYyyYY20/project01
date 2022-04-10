// 每次调用$.post $.get $.ajax都会先调用ajaxPrefilter这个函数 在这个函数中可以拿到我们给ajax提供的配置的h对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求时，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // console.log(options.url);
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/')) { //判断url地址内是否包含/my/字符  判断是否为需要权限的接口
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    options.complete = function(res) {
        if (res.responseJSON.status === 1) {
            // 强制清空token
            localStorage.removeItem('token');
            //强制跳转到登录页面
            location.href = '/login.html';
        }
        // console.log(res.responseJSON.status);
    }

})