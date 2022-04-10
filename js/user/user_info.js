$(function() {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1~6个字符之间';
            }
        }
    });

    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // layui 中提供的快速为表单取值/赋值的一个方法 formUserInfo为前面表单添加的lay-filter属性名
                form.val('formUserInfo', res.data);
            }
        })
    };

    //重置表单信息
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 调用函数initUsrInfo函数将之前的数据渲染到页面中
        initUserInfo();
    });

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // 将数据更新 调用父界面的函数 对于这个界面的父元素时index界面，可以使用window.parent,重新渲染用户昵称和头像
                window.parent.getUserInfo();
            }
        });
    });
})