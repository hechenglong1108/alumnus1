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
            ,url:'/api/dop/topics/page?checkStatus=2&type=5'
            ,response: {statusName: 'code',statusCode: 1,countName:'total'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: '', title: '姓名', width: 120},
                {field: 'kefu_name', title: '身份证后六位', width: 120},
                {field: 'un', title: '毕业年份', width: 100},
                {field: 'carOwnerName', title: '班级', width: 150},
                {field: 'licenseNo', title: '所在地区', width: 300,templet: '#titleTpl1'},
                {field: 'city', title: '单位名称', width: 150},
                {field: 'insurance_corp', title: '所在部门', width: 150},
                {field: 'isOver', title: '职务', width: 100,},
                {field: 'sumPrem', title: '手机号码', width: 150},
                {field: 'payMode', title: '头像', width: 100},
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
