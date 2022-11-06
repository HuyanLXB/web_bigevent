// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起Ajax请求前先拼接完整的URL地址
    options.url = 'http://www.liulongbin.top:3007' + options.url


    // 统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }

    }
    // 为所有的Ajax请求挂载这个函数
    options.complete = function(res) {
        // 防止用户不登录直接访问后台
        if (res.status !== 0) {
            localStorage.removeItem('token')
            location.href = '../login.html'
        }
    }
    console.log(options.url);
})