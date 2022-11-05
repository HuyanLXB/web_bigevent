$(function() {
    // 给a链接绑定点击事件实现登录和注册界面的切换
    $('#link_login').on('click', function() {
        $('.loginBox').hide()
        $('.regBox').show()
    })
    $('#link_reg').on('click', function() {
        $('.loginBox').show()
        $('.regBox').hide()
    })

    // 自定义校验规则
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码
        repwd: function(value) {
            if (value !== $('#passWord').val()) {
                return '两次密码不一致'
            }
        }
    })

    let layer = layui.layer
        // 监听form表单的提交事件 调用登录接口
    $('.loginBox .layui-form').on('submit', function(e) {
        e.preventDefault()
            //发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                layer.msg(res.message)
                console.log(res.token)

                // 登录成功的得到的 token字符串保留到浏览器
                localStorage.setItem('token', res.token)

                // 跳转到主页
                location.href = '/index.html'
            }
        })
    })

    // 监听form表单的提交事件 调用注册接口
    $('.regBox .layui-form').on('submit', function(e) {
        e.preventDefault()
            //发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.regBox [name=username]').val(),
                password: $('.regBox [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 注册成功之后回到登录界面
                $('#link_reg').click()
            }
        })
    })
})