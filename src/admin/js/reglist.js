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
            ,url:"/api/dop/found/alumnus/list?activationStatus=1"
            ,response: {statusName: 'code',statusCode: 1,countName:'total',dataName:'rows'}
            ,request: {limitName: 'size'}
            ,cols: [[
                {checkbox: true}, //默认全选,
                {field: 'trueName', title: '姓名', width: 120},
                {field: 'personAfter', title: '身份证后六位', width: 120},
                {field: 'graduationYear', title: '毕业年份', width: 100},
                {field: 'className', title: '班级', width: 150},
                {field: 'licenseNo', title: '所在地区', width: 300,templet: '#titleTpl1'},
                {field: 'company', title: '单位名称', width: 150},
                {field: 'department', title: '所在部门', width: 150},
                {field: 'position', title: '职务', width: 100},
                {field: 'mobile', title: '手机号码', width: 150},
                {field: 'email', title: '邮箱', width: 150},
                {field: 'regionTime', title: '注册时间', width: 100,}
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
