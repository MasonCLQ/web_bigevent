//每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数，可以拿到我们给ajax他提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://big-event-api-t.itheima.net' + options.url

    // 统一为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
        Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        // 无论请求成功还是失败，都会调用complete回调函数
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空
            localStorage.removeItem('token')
            // 强制跳转
            location.href = './login.html'
        }

    }

})

