/**
 * Created by hcl on 2018/3/15
 */

var check = {
    init: function(){
        this.addevent();
        this.createtable();
    },
    addevent: function() {
        var _inThis = this;
        $("#update").click(function(){
            var _selected = table.checkStatus('testReload').data;
            if(_selected.length != 1) {
                layer.msg('请选择一条数据。。', {icon: 5});
                return;
            }

        })
    },
    createtable: function() {
        table.render({
            elem: '#list' //指定原始表格元素选择器（推荐id选择器）
            ,url:"/api/dop/topics/topic/message/page?messageStatus=1"
            ,response: {statusName: 'code',statusCode: 1,countName:'total',dataName:'rows'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: 'note', title: '留言项目内容', width: 200},
                {field: 'note', title: '留言内容', width: 200},
                {field: 'trueName', title: '发布人姓名', width: 100},
                {field: 'regTime', title: '发布时间', width: 150},
                {field: 'payMode', title: '类型', width: 100,templet: '#titleTpl1'},
            ]],
            page: true
            ,id:'testReload'
        });
    }
}

layui.use('table', function(){
    window.table = layui.table;
    check.init();
});
