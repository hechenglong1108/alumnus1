/**
 * Created by hcl on 2018/3/15
 */


var reglist = {
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
        $("#output").click(function(){
            if(!Base.isadmin){
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function(){
                    location.href = 'login.html'
                },2000)
            }
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'导出校友信息',
                shade:0.6,
                anim:2,
                content:'output.html',
                yes : function(layero,index) {
                    layer.close(index);
                }
            })
        })


         $("#delete").click(function() {
            if (!Base.isadmin) {
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function() {
                    location.href = 'login.html'
                }, 2000)
            }
            var _selected = table.checkStatus('testReload').data;
            if (_selected.length != 1) {
                layer.msg('请选择一条数据。。', { icon: 5 });
                return;
            }

            layer.open({
                    content: '确定删除？',
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        Base.loadJson({
                            url: "/api/dop/found/del",
                            data: {
                                uid: _selected[0].uid
                            },
                            type: "POST"
                        }, function(json) {
                            if (json.code * 1 == 1) {
                                Base.Messager.open("删除成功")
                                _inThis.createtable()
                            } else {
                                Base.Messager.open(json.message)
                            }
                        })
                    },
                    btn2: function(index, layero) {
                        layer.closeAll();
                    }
                });

            
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
                title:'导入校友信息',
                shade:0.6,
                anim:2,
                content:'import.html',
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
            ,url:"/api/dop/found/alumnus/list"
            ,response: {statusName: 'code',statusCode: 1,countName:'total',dataName:'rows'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: 'trueName', title: '姓名', width: 120},
                {field: 'personAfter', title: '身份证后六位', width: 120},
                {field: 'graduationYear', title: '毕业年份', width: 100},
                {field: 'className', title: '班级', width: 150},
                {field: 'mobile', title: '手机号码', width: 150},
                {field: 'regionTime', title: '是否注册', width: 100,templet: '#titleTpl1'}
            ]],
            page: true
            ,id:'testReload'
        });
    }
}

layui.use('table', function(){
    window.table = layui.table;
    reglist.init();
});
