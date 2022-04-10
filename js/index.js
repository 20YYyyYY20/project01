$(function() {
        // 调用userInfo函数
        getUserInfo();

        var layer = layui.layer;
        // 退出按钮事件
        $('#btn-outLog').on('click', function() {
            layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function(index) {
                //do something

                // 清除本地存储的token
                localStorage.removeItem('token');
                // 重新跳转到登录页面
                location.href = '/login.html';
                // 关闭confirm询问框
                layer.close(index);

            });
        })
    })
    // 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || '',
        },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            // console.log(res);
            // 调用randerAvatar函数渲染头像
            randerAvatar(res.data);
        },
        // 控制用户的访问权限 防止用户不登陆输入网址直接登录
        // 无论成功还是失败都会调用complete函数
        // 统一放到baseApi里面，不需要再重复调用
        // complete: function(res) {
        //     if (res.responseJSON.status === 1) {
        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         //强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        //     // console.log(res.responseJSON.status);
        // }
    })
}
// 渲染用户头像
function randerAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text_avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        $('.text_avatar').html(first).show();
    }
}