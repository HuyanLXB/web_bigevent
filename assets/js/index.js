$(function() {


    let layer = layui.layer
    getUserInfo()

    // 实现退出的功能
    $('#out').click(function() {
        layer.confirm('确定退出主页?', { icon: 3, title: '提示' }, function(index) {
            //do something
            location.href = '../login.html'

            // 删除掉浏览器里面的 token
            localStorage.removeItem('token')

            // 必须带着
            layer.close(index);
        })
    })
})


// 获取用户的基本信息
function getUserInfo() {
    let layer = layui.layer
        // 发起Ajax请求
    $.ajax({
        method: 'GET',
        url: `/my/userinfo
        `,
        // //    请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            layer.msg('获取用户信息成功')
            console.log(res);

            // 渲染头像
            randerAvater(res.data)
        },
        // 只要发起Ajax请求就回调用这个函数
        // complete: function(res) {
        //     // 防止用户不登录直接访问后台
        //     if (res.status !== 0) {
        //         localStorage.removeItem('token')
        //         location.href = '../login.html'
        //     }
        // }
    })

}

// 渲染头像函数
function randerAvater(user) {
    // 渲染用户的名字

    // 获取用户的名字
    let userName = user.nickname || user.username
        // 渲染文本
    $('#welcome').html(`欢迎 ${userName}`)

    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avatar').hide()
        $('.layui-nav-img').show()
        $('.layui-nav-img').attr('src', user.user_pic)

    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').show()
            // 渲染文字头像
        $('.text-avatar').html(`${userName[0].toUpperCase()}`)
    }



}