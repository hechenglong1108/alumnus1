/**
 * Created by hcl on 2018/3/14
 */


var login=new Vue({
    el:"#login",
    data:{
        name:"",
        password:""
    },
    methods:{
        login: function(){
            var _inThis = this;
            if(!this.name){
                Base.Messager.open("请输入手机号码")
                return;
            }
            if(!this.password){
                Base.Messager.open("请输入密码")
                return;
            }
            Base.loadJson({
                url:"/api/wns/admin/login",
                type:"post",
                data:{
                    un: _inThis.name,
                    pass: _inThis.password
                }
            },function(json){
                if(json.code*1 == 1){
                    Base.Messager.open("登录成功")
                    Base.setCookies("uid",json.data.uid)
                    setTimeout(function(){
                        location.href = 'index.html'
                    },2000)
                }else{
                    Base.Messager.open(json.message)
                }
            })
        }
    }
})

