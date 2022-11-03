$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
    initEditor()


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)

                $('#cate-select').html(htmlStr)

                //调用form.render()函数
                form.render()
            }

        })
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


    // 选择封面按钮注册事件
    $('.select-cover').on('click', function(e) {
        $('#coverFile').click()

    })

    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var files = e.target.files[0]
        console.log(files)
        if(files.length === 0) {
            return layer.msg('请选择图片！')
        }
    
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章状态
    var art_state = '已发布'


    // 为草稿按钮绑定事件
    $('#btnSave').on('click', function() {
        art_state = '草稿'
    })

    //监听表单submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                // 发起ajax请求
                publishArticle(fd)
            })



    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交的是Formdata格式的数据，必须配置以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功')
                location.href = './art_list.html'
                
            }

        })
    }
})