/**
 * Created by hcl on 2018/3/15
 */



var message = {
    init: function(){
        this.addevent();
        this.createtable();
    },
    addevent: function() {
        var _inThis = this;
        $("#shuaxin").click(function(){
            _inThis.createtable()
        })
        $("#update").click(function(){
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'发布消息',
                shade:0.6,
                anim:2,
                content:'release.html',
                yes : function(layero,index) {
                    layer.close(index);
                }
            })

        })
    },
    createtable: function() {
        table.render({
            elem: '#list' //指定原始表格元素选择器（推荐id选择器）
            ,url:'/api/dop/topics/page?uid=' + Base.getCookies("uid")
            ,response: {statusName: 'code',statusCode: 1,countName:'total',dataName:'rows'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: 'addTrueName', title: '发起人姓名', width: 120},
                {field: 'addTime', title: '发起时间', width: 120},
                {field: 'topics', title: '内容', width: 300}
            ]],
            page: true
            ,id:'testReload'
        });
    }
}

layui.use('table', function(){
    window.table = layui.table;
    message.init();
});
