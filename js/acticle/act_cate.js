$(function() {

    let layer = layui.layer;
    let form = layui.form;
    initArtCateList()
        // 获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.mag('获取文章类别失败');
                }
                // 调用模板引擎
                let htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 为弹出层赋值  layer.open() 会返回一个值，index用来接收，用来关闭弹出层
    let indexAdd = null;
    // 为添加类别绑定事件
    $('#add_cate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: '添加类别',
            // 利用html结构渲染弹出框结构
            content: $('#dialog-add').html(),
        })
    })

    // 为表单绑定提交事件
    $('body').on('submit', '#form-add', function(e) { //页面初始化时没有这个表单元素，需要使用事件委托
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加类别失败');
                }
                initArtCateList()
                    // 关闭弹出层
                layer.close(indexAdd);
            }
        })

    })

    let indexExit = null;
    // 通过代理的方式为btn-edit绑定事件
    $('tbody').on('click', '.btn-edit', function() {
        indexExit = layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: '修改文章类别',
            // 利用html结构渲染弹出框结构
            content: $('#dialog-edit').html(),
        })

        let id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 利用layui的form.val()方法快速渲染数据
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过代理的方式为form-exit表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新列表失败');
                }
                layer.msg('更新列表成功');
                // 关闭弹出层
                layer.close(indexExit);
                // 重新渲染数据
                initArtCateList();
            }
        });
    });

    // 通过代理为删除按钮添加点击事件
    $('tbody').on('click', '.btn-del', function() {
        let id = $(this).attr('data-id');
        // 询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.close(index);
                    initArtCateList();
                }
            });


        });

    });
})