/**
 * Created by hcl on 2018/3/21
 */

/**
 * Created by hcl on 2018/3/15
 */


var contact = {
    init: function(){
        Base.judgeadminlogin("login.html")
        this.addevent();
        this.createtable();
    },
    addevent: function() {
        var _inThis = this;
        $("#shuaxin").click(function () {
            _inThis.createtable()
        })
        $("#delete").click(function(){
            if(!Base.isadmin){
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function(){
                    location.href = 'login.html'
                },2000)
            }
            var _selected = table.checkStatus('testReload').data;
            if(_selected.length != 1) {
                layer.msg('请选择一条数据。。', {icon: 5});
                return;
            }
            Base.loadJson({
                url:"/api/dop/leader/info/delete",
                data:{
                    id:_selected[0].id
                },
                type:"post"
            },function(json){
                if(json.code*1 == 1 ){
                    layer.msg(json.message || "删除成功")
                    _inThis.createtable()
                }else{
                    layer.msg(json.message)
                }
            })
        })

        $("#read").click(function(){
            if(!Base.isadmin){
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function(){
                    location.href = 'login.html'
                },2000)
            }
            var _selected = table.checkStatus('testReload').data;
            if(_selected.length != 1) {
                layer.msg('请选择一条数据。。', {icon: 5});
                return;
            }
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'查看信息',
                shade:0.6,
                anim:2,
                content:'read.html?id=' + _selected[0].id,
                yes : function(layero,index) {
                    layer.close(index);
                }
            })
        })

        $("#import").click(function(){
            if(!Base.isadmin){
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function(){
                    location.href = 'login.html'
                },2000)
            }
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'添加学院信息',
                shade:0.6,
                anim:2,
                content:'inputContact.html',
                yes : function(layero,index) {
                    layer.close(index);
                }
            })
        })

        $("#shuaxin").click(function(){
            _inThis.createtable();
        })
    },
    createtable: function() {
        table.render({
            elem: '#list' //指定原始表格元素选择器（推荐id选择器）
            ,url:"/api/dop/leader/info/page"
            ,response: {statusName: 'code',statusCode: 1,countName:'total',dataName:'rows'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: 'content', title: '内容', width: 300},
                {field: 'timeH', title: '添加时间', width: 200},
                {field: 'fid', title: '图片', width: 300,templet: '#titleTpl1'}
            ]],
            page: true
            ,id:'testReload'
        });
    }
}

layui.use('table', function(){
    window.table = layui.table;
    contact.init();
});
