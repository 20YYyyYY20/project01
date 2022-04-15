$(function() {

    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    // 定义美化事件过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth());
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        // console.log(y, m, d);
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的函数
    function padZero(n) {
        return n = n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，请求数据的时候需要将请求参数对象提交给服务器
    let q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '', //文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败');
                }
                // 使用模板引擎导入数据
                let htmlStr = template("tpl-table", res);
                $('tbody').html(htmlStr);
                // 调用分页的方法 total代表数据的数量
                renderPage(res.total);
            }
        });
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取文章列表失败');
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-section', res);
                $('[name=cate_id]').html(htmlStr);
                // 使用form.render()重新渲染列表
                form.render();
            }
        });
    };

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 获取表单中的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件,重新渲染表格中的数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的数量
            curr: q.pagenum, //默认选中第几页
            layout: ['count', 'limit', 'prev', 'page', 'next'], //自定义排版
            limits: [2, 3, 5, 10], //自定义每页显示的数量
            // 分页发生切换时触发的回调函数
            // 1.点击页码时会触发jump回调
            // 2.只要调用了layer.render()方法,就会触发jump回调
            jump: function(obj, first) {
                // 可以使用first的值来判断通过哪种方式触发的jump回调,如果为true,则为方式2,否则1
                // console.log(first);
                // console.log(obj.curr);最新的页码值
                // 将最新的页码值 赋值给q这个查询参数中,重新渲染
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值给q这个查询参数中,重新渲染
                q.pagesize = obj.limit;
                // 这里直接调用initTable()函数会一直触发jump回调,陷入死循环
                if (!first) { //代表时点击页码触发的jump回调
                    initTable();
                }
            }
        });
    };

    // 用代理的方式为删除按钮绑定事件
    $('tbody').on('click', '.btn-del', function() {
        // 弹出层
        let len = $('.btn-del').length;
        // console.log(len);
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    if (len === 1) {
                        // 如果len=1,证明删除完毕后页面上没有任何数据,自动条状到上一页,最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    });



})