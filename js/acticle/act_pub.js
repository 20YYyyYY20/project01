$(function() {

    let layer = layui.layer;
    let form = layui.form;

    // 定义加载文章分类的方法

    initCate();
    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                // 调用模板引擎 渲染分类的下拉菜单
                let htmlStr = template('tpl-pub', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要使用form.render()方法重新渲染
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定上传文件事件

    $('#btnChooseImage').on('click', function() {
            $('#coveFile').click();
        })
        // 监听coveFile的change事件,获取用户选择的文件列表
    $('#coveFile').on('change', function(e) {
        // 拿到用户选择的文件
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择文件');
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 定义文章的发布状态
    let art_state = '已发布';
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    // 为表单绑定submit事件
    $('#pub_form').on("submit", function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()

        // 基于form表单快速创建一个formdata对象
        let fd = new FormData($(this)[0]);

        // 将文章的发布状态.存到fd中
        fd.append('state', art_state);
        // console.log(fd)
        // fd.forEach(function(v, k) {
        //     console.log(v, k);
        // })

        // 将封面裁剪过后的图片输入为一个文件对象

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob);
                // 发起ajax请求
                publishArticle(fd);
            })
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 向服务器提交forData格式数据时必须加上下面两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');
                // 发布文章成功后,跳转到文章列表页面
                location.href = '/article/act_list.html';
            }
        });
    }
})