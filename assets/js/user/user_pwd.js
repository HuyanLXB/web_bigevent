$(function() {

    let layer = layui.layer
        // 实现密码重置
    $('form').on('submit', function(e) {
        e.preventDefault()
            // 发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('更改密码失败')

                }
                layer.msg('更改密码成功')
                console.log(res)
            }
        })
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
})