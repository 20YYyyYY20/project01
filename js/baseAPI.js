// 每次调用$.post $.get $.ajax都会先调用ajaxPrefilter这个函数 在这个函数中可以拿到我们给ajax提供的配置的h对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求时，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})