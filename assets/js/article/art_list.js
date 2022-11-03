$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : n + '0'
    }


    // 定义一个查询的参数对象，在请求数据时，将请求参数对象提交到服务器
    var q = {
        pagenum: 1,      //页码值
        pagesize: 1,     //每页显示几条数据
        cate_id: '',     //文章分类的id
        state: ''        //文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }

                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }

                var htmlStr = template('cate-form', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //监听表单submit事件
    $('#select-cate').on('submit', function(e) {
        //组织表单的默认提交行为
        e.preventDefault()
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //q赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {           
        //执行一个laypage实例
        laypage.render({
          elem: 'pages' //注意，这里的 test1 是 ID，不用加 # 号
          ,count: total //数据总数，从服务端得到
          ,limit: q.pagesize //每页显示几条数据
          ,limits:[1,2,3,4,5]
          ,curr: q.pagenum //默认选中哪一页
          ,layout: ['count','limit','prev', 'page', 'next','skip']
          ,jump: function(obj, first){
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            q.pagenum = obj.curr
            q.pagesize = obj.limit

            
            //首次不执行
            if(!first){
              initTable()
            }
          }
        });
    }

    // 删除文章列表数据
    // 利用代理监听删除按钮的click事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 发起ajax请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章数据失败！')
                    }
                    layer.msg('删除文章数据成功！')
                    //当数据删除完成后，需要判断当前页是否还有数据，如果没有，则让页码-1
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
        

                }
            })
            layer.close(index)
        });
    })

})