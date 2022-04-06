$(function() {
    $('.link_reg').on('click', function() {
        $('.reg').show();
        $('.login').hide();
    });
    $('.link_login').on('click', function() {
        $('.reg').hide();
        $('.login').show();
    });
    // 从layui中获取form对象
    var form = layui.form;
    // 获取弹出框对象
    var layer = layui.layer;
    // 通过form.verify()方法自定义校检规则
    form.verify({
        // 自定义了一个pwd校检规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码校检规则
        repwd: function(value) { //value传递过来的是用户输入的值
            var pwd = $('.reg [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });
    // 监听表单注册事件
    $('#reg_form').on('submit', function(e) {
        e.preventDefault(); //阻止表单默认提交行为
        // 发起post请求
        $.post('/api/reguser', {
                username: $('#reg_form [name=username]').val(),
                password: $('#reg_form [name=password]').val(),
            },
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                $('.link_login').click();
            }
        );
    });
    // 监听表单登录事件
    $('#login_form').submit(function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //获取当前表单输入的所有数据
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('账号或密码输入错误');
                }
                layer.msg('登录成功');
                // console.log(res.token);
                // 将登录成功的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到主页
                location.href = '/index.html';
            }
        });
    });
})