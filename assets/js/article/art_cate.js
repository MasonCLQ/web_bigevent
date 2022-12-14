$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)            
            }
        })
    }

    //为添加类别按钮绑定事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 监听提交分类表单submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')

                //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 给编辑按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        console.log(id)
        //发起请求获取对应分类的数据

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })

    //为修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功')
                // 更新成功自动关闭弹出层
                layer.close(indexEdit)

                initArtCateList()
            }

        })
    })

    //
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id)
        //提示用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    return layer.msg('删除成功！')

                    layer.close(index)

                    initArtCateList()
                }
            })
            
        })
    })


})