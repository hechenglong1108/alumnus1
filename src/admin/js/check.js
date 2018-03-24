/**
 * Created by hcl on 2018/3/15
 */

var check = {
    init: function(){
        Base.judgeadminlogin("login.html")
        this.addevent();
        this.createtable();
    },
    addevent: function() {
        var _inThis = this;
        $("#shuaxin").click(function(){
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
            if(_selected[0].messageType*1 == 1){


                layer.open({
                    content: '确定删除？'
                    ,btn: ['确定', '取消']
                    ,yes: function(index, layero){
                        Base.loadJson({
                            url:"/api/dop/topics/del",
                            data:{
                                tId:_selected[0].id
                            },
                            type:"POST"
                        },function(json){
                            if(json.code*1 == 1){
                                Base.Messager.open("删除成功")
                                _inThis.createtable()
                            }else{
                                Base.Messager.open(json.message)
                            }
                        })
                    }
                    ,btn2: function(index, layero){
                        layer.closeAll();
                    }
                });






            }else if(_selected[0].messageType*1 == 2){


                layer.open({
                    content: '确定删除？'
                    ,btn: ['确定', '取消']
                    ,yes: function(index, layero){
                        Base.loadJson({
                            url:"/api/dop/leave/message/del",
                            data:{
                                id:_selected[0].id
                            },
                            type:"POST"
                        },function(json){
                            if(json.code*1 == 1){
                                Base.Messager.open("删除成功")
                                _inThis.createtable()
                            }else{
                                Base.Messager.open(json.message)
                            }
                        })
                    }
                    ,btn2: function(index, layero){
                        layer.closeAll();
                    }
                });

            }

        })


        $("#update").click(function(){
            var _selected = table.checkStatus('testReload').data;
            if(_selected.length != 1) {
                layer.msg('请选择一条数据。。', {icon: 5});
                return;
            }
            if(!Base.isadmin){
                Base.Messager.open("您的账号不是管理员，请登录管理员账号");
                setTimeout(function(){
                    location.href = 'login.html'
                },2000)
            }
            layer.open({
                type:2,
                area:['800px','600px'],
                title:'留言审核',
                shade:0.6,
                anim:2,
                content:'checkContent.html?messageType='+_selected[0].messageType+"&topicId="+_selected[0].topicId+"&type="+_selected[0].type+"&id="+_selected[0].id,
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
