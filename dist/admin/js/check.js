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
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'留言审核',
                shade:0.6,
                anim:2,
                content:'checkContent.html?messageType='+_selected[0].messageType+"&note="+_selected[0].note+"&time="+_selected[0].regTime+"&topicId="+_selected[0].topicId+"&type="+_selected[0].type+"&id="+_selected[0].id,
                yes : function(layero,index) {
                    layer.close(index);
                }
            })
            
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
                {field: 'note', title: '留言内容', width: 200},
                {field: 'trueName', title: '发布人姓名', width: 100},
                {field: 'regTime', title: '发布时间', width: 150},
                {field: 'payMode', title: '类型', width: 120,templet: '#titleTpl1'},
                {field: 'messageStatus', title: '状态', width: 120,templet: '#titleTpl2'},

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
