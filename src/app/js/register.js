/**
 * Created by hcl on 2018/3/14
 */


var login=new Vue({
    el:"#register",
    data:{
        name:"",
        idetify:"",
        years:"",
        banji:"",
        province:"",
        city:"",
        area:"",
        address:"",
        companyName:"",
        department:"",
        post:"",
        mobile:"",
        moblieStatus:"",
        heads:"",
        isuser:0,/*是否通过身份验证*/
        yearList:[],/*届数组*/
        classList:[],/*班级数组*/
        provinceList:[],/*省份数组*/
        cityList:[],/*城市数组*/
        areaList:[]/*区数组*/
    },
    methods:{
        reg: function(){
            var _data = new FormData($("#registerfrom")[0]),
                _inThis = this;

            if(!this.name){
                Base.Messager.open("请输入姓名")
                return;
            }
            if(!this.idetify){
                Base.Messager.open("请输入身份证后六位")
                return;
            }
            if(!this.years){
                Base.Messager.open("请选择毕业年份")
                return;
            }
            if(!this.banji){
                Base.Messager.open("请选择班级")
                return;
            }
            if(!this.province || !this.city || !this.area){
                Base.Messager.open("请选择所在地区")
                return;
            }
            if(!this.address){
                Base.Messager.open("请输入详细地址")
                return;
            }
            if(!this.companyName){
                Base.Messager.open("请输入公司名称")
                return;
            }
            if(!this.department){
                Base.Messager.open("请输入部门名称")
                return;
            }

            if(!this.post){
                Base.Messager.open("请输入职务")
                return;
            }

            if(!this.mobile){
                Base.Messager.open("请输入手机号码")
                return;
            }
            if(!Base.Tools.isMobile(this.mobile)){
                Base.Messager.open("请输入正确的手机号码")
                return;
            }
            if(!this.moblieStatus){
                Base.Messager.open("请选择手机号是否公开")
                return;
            }
            if(!$("#headerss").val()){
                Base.Messager.open("请选择头像")
                return;
            }
            _inThis.checkUser()
            if(!_inThis.isuser){
                return "身份信息不匹配，请检查姓名或者身份证后六位是否输入错误！"
            }

            $.ajax({
                type: 'post',
                url: '/api/wns/user/register',
                cache: false,    //上传文件不需缓存
                processData: false, //需设置为false。因为data值是FormData对象，不需要对数据做处理
                contentType: false, //需设置为false。因为是FormData对象，且已经声明了属性enctype="multipart/form-data"
                data: _data,
                dataType: 'json',
                success: function (json) {
                    if (json.code * 1 == 1) {
                        Base.Messager.loading("注册成功,正在登录")
                        _inThis.login();
                    } else {
                        Base.Messager.open(json.message)
                    }


                }
            })
        },

        login:function(){
            var _inThis  = this;
            Base.loadJson({
                url:"/api/wns/admin/login",
                type:"post",
                data:{
                    un: _inThis.mobile,
                    pass: _inThis.idetify
                }
            },function(json){
                if(json.code*1 == 1){
                    localStorage.setItem("name",_inThis.mobile)
                    localStorage.setItem('pass',_inThis.idetify)
                    Base.Messager.hideLoading();
                    Base.setCookies("uid",json.data.uid)
                    Base.setCookies("cid",json.data.cid)
                    location.href = 'index.html'

                    /*Base.Messager.open("登录成功")
                    setTimeout(function(){
                        location.href = 'index.html'
                    },2000)*/
                }else{
                    Base.Messager.open(json.message)
                }
            })
        },

        /*y验证身份*/
        checkUser: function(){
            var _inThis = this;
            Base.loadJsonNoAsync({
                url:"/api/wns/user/detail",
                data:{
                    trueName: _inThis.name,
                    personAfter: _inThis.idetify
                },
                type:"get"
            },function(json){

                if(json.code*1 == 1 ){
                    _inThis.isuser = 1
                }else{
                    _inThis.isuser = 0
                    Base.Messager.open(json.message)
                }
            })
        },
        /*获取省份*/
        getProvince: function(){
            var _inThis = this;
            Base.loadJson({
                url:"/api/dop/region/search?page=1&size=1000",
                data:{
                    parentId:1
                },
                type:"get"
            },function(json){
                _inThis.provinceList = json.rows;
                /*if(json.code*1 == 1 ){
                    _inThis.provinceList = json.rows;
                }else{
                    console.log(json.message)
                }*/
            })
        },
        /*获取城市*/
        getCity: function(){
            var _inThis = this;
            Base.loadJson({
                url:"/api/dop/region/search?page=1&size=1000",
                data:{
                    parentId:_inThis.province
                },
                type:"get"
            },function(json){
                _inThis.cityList = json.rows;
                /*if(json.code*1 == 1 ){
                    _inThis.cityList = json.rows;
                }else{
                    console.log(json.message)
                }*/
            })
        },
        /*获取区*/
        getArea: function(){
            var _inThis = this;
            Base.loadJson({
                url:"/api/dop/region/search?page=1&size=1000",
                data:{
                    parentId:_inThis.city
                },
                type:"get"
            },function(json){
                _inThis.areaList = json.rows;
                /*if(json.code*1 == 1 ){
                    _inThis.areaList = json.rows;
                }else{
                    console.log(json.message)
                }*/
            })
        },
        /*获取毕业年份*/
        getYear: function() {
            var _inThis = this;
            Base.loadJson({
                url:"/api/wns/user/company/list",
                data:{
                    type:2
                },
                type:"get"
            },function(json){
                if(json.code*1 == 1 ){
                    _inThis.yearList = json.rows;
                }else{
                    console.log(json.message)
                }
            })
        },
        /*根据毕业年份获取班级*/
        getclass: function() {
            var _inThis = this;
            Base.loadJson({
                url:"/api/wns/user/company/list",
                data:{
                    type:3,
                    cid:_inThis.years
                },
                type:"get"
            },function(json){
                if(json.code*1 == 1 ){
                    _inThis.classList = json.rows;
                }else{
                    console.log(json.message)
                }
            })
        }
    },
    created(){
        this.getYear()
        this.getProvince()
    }
})

