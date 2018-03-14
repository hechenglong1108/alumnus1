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
                url:"",
                type:"",
                data:{

                }
            },function(json){

            })
        }
    }
})

