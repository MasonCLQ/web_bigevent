$(function() {
    // 点击去注册账号链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录账号链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 通过form.verify()自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'],

        // 校验注册表单两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val() 
            if(pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 组织表单默认提交行为
        e.preventDefault()

        var data = {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser', data, function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')

            // 注册成功后，模拟点击行为，跳转登录界面
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 组织表单默认提交行为
        e.preventDefault()

        // 发起post请求
        $.post('/api/login', {username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val()}, function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('登录成功')

            //将登录成功后得到的token字符串，保存到localstorage中
            localStorage.setItem('token', res.token)

            // 跳转后台主页
            location.href = './index.html'
        })
    })
})