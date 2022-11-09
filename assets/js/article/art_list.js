$(function() {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
        // 定义一个参数的查询对象

    //定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data)

        // 获取年月日 时分秒
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1 //获取到的月是从0开始的所以要加1
        let d = dt.getDate()

        let hh = dt.getHours()
        let mm = dt.getMinutes()
        let ss = dt.getSeconds()


        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }


    let q = {
        pagenum: 1, //默认获取第一页的数据
        pagesize: 2, //每页默认显示2条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    initTable()

    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {

                    console.log(res);
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                    // 模版引擎渲染数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(res)

                // 调用渲染分页的方法
                renderPage(res.total)

            }
        })

    }

    getCate()
        // 获取分类的方法
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('获取类别失败')
                }
                console.log(res);
                layer.msg('获取类别成功')

                // 模版引擎进行渲染
                let htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)

                // layui重新渲染
                form.render()
            }
        })

    }

    // 筛选功能的实现 获取下拉选择框里的数据 赋值给Q 再重新调用表单初始化方法

    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取下拉框里的值并赋值给q
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()

        // 重新初始化列表
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            jump: function(obj, first) {
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // 初始化的时候不执行 防止死循环
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'prev', 'page', 'limit', 'skip', 'next'],
            limits: [2, 5, 7, 10]
        })
    }

    // 实现文章删除的功能
    $('body').on('click', '.btn-delete', function() {
        // 通过判断页面上删除按钮的个数来判断还有没有数据
        let length = $('.btn-delete').length

        // 根据id删除数据
        let id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('删除失败')
                }
                console.log(res)
                layer.msg('删除成功')

                // 当我们把最2页的最后一条数据删掉时 页码值还是为2 此时调用渲染函数还是会去请求第2页数据，但是第2页的数据为空，所以前端页面什么也不会有

                // 所以删除完成之后要判断当前这一页是否还有剩余的数据 没有则页码值减一
                if (length === 1) {
                    // 页码减一 页码必须为1
                    q.pagenum === 1 ? q.pagenum -= 1 : 1
                        // 重新渲染
                    initTable()
                }
            }
        })
    })

})