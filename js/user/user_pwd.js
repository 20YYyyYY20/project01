$(function() {
    let form = layui.form;
    let layer = layui.layer;

    // 自定义表单验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6~12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    });

    // 重置密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://www.liulongbin.top:3007/my/updatepwd',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("修改成功");

                // 将表单初始化
                $('.layui-form')[0].reset(); //[0]将jquery转换为dom元素
            },
        })
    });
})