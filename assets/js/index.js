$(function() {
    // 调用getUserinfo获取用户的信息
    getUserInfo()

    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //清空本地存储中的token
            localStorage.removeItem('token')

            //跳转至login.html
            location.href = './login.html'

            //关闭confirm询问框
            layer.close(index);
          });
    })

})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },

        // // 无论请求成功还是失败，都会调用complete回调函数
        // complete: function(res) {
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空
        //         localStorage.removeItem('token')
        //         // 强制跳转
        //         location.href = './login.html'
        //     }
        // }

    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否设置头像
    if(user.user_pic) {
        // 1、渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //2、渲染首字母头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}