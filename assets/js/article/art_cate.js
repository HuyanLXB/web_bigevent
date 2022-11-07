$(function() {
    let layer = layui.layer
    let form = layui.form
        // 获取文章类别
    initArtCateList()

    // 实现文章类别的添加功能
    let indexAdd = null
    $('#btnAddCate').click(function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 发起Ajax请求 更新文章类别
    $('body').on('submit', '#form-add', function(e) {
        console.log(1)
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })

    })


    // 实现编辑页面的弹出层
    $('body').on('click', '.btn-edit', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 根据 Id 获取文章分类数据 并填充到弹出层里
        let id = $('.btn-edit').attr('data-id')
        $.ajax({
            method: `GET`,
            url: `/my/article/cates/${id}
          `,
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('获取当前信息失败！')
                }
                form.val('form-edit', res.data)
                layer.msg('获取当前信息成功！')
                    // 根据索引，关闭对应的弹出层

            }
        })
    })

    // 实现文章类别的编辑功能
    $('body').on('submit', '#form-edit', function(e) {
        console.log(1)
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: `/my/article/updatecate
            `,
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('更新分类失败！')
                }
                initArtCateList()
                layer.msg('更新分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })

    })


    // 实现删除界面的弹出层
    $('body').on('click', '.btn-delete', function() {
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //确认删除之后调用删除的接口
            let id = $('.btn-delete').attr('data-id')
            $.ajax({
                method: `GET`,
                url: `/my/article/deletecate/${id}
            `,
                success: function(res) {
                    if (res.status !== 0) {
                        console.log(res);
                        return layer.msg('删除当前信息失败！')
                    }
                    layer.msg('删除当前信息成功！')

                }
            })

            layer.close(index);
        });
    })
})


// 获取文章类别
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: `/my/article/cates
  `,
        success: function(res) {
            if (res.status !== 0) {
                console.log(res);
                return layer.msg('获取文章类别失败')
            }

            layer.msg('获取文章类别成功')
            console.log(res)
            let htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}