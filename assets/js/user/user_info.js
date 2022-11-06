$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "长度必须小于6"
            }
        }
    })

    initUserInfo()

    // 实现用户信息的更新
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        console.log('提交了')
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                    // 调用父页面的方法 渲染头像和用户名
                window.parent.getUserInfo()
                initUserInfo()
            }
        })
    })

    // 实现重置功能
    $('#btnReset').click(function(e) {
        e.preventDefault()
        initUserInfo()
    })
})

// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res)
            $('#id').val(res.data.id)
            $('#username').val(res.data.username)
            $('#nickname').val(res.data.nickname)
            $('#email').val(res.data.email)

        }

    })

}