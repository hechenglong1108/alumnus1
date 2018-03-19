/**
 * Created by hcl on 2018/3/15
 */

var search=new Vue({
    el:"#search",
    data:{
        studentsList:[],/*校友数组*/
        yearList:[],/*届数组*/
        provinceList:[],/*省份数组*/
        cityList:[],/*城市数组*/
        areaList:[],/*区数组*/
        years:"",
        province:"",
        city:"",
        area:""
    },
    methods:{
        goback: function(){
            history.go(-1)
        },
        search: function(){

            var _inThis = this;


           /* if(_inThis.years){
                _url = "&graduationId=" + _inThis.years
            }*/
            /*if(_inThis.province){
                _url += "&personProvince=" + _inThis.province
            }
            if(_inThis.city){
                _url += "&personCity=" + _inThis.city
            }
            if(_inThis.personArea){
                _url += "&graduationId=" + _inThis.personArea
            }*/
            var page = 0,
                size = 10

            $('.list').dropload({
                scrollArea : window,
                loadDownFn : function(me){
                    _inThis.page++;
                    // 拼接HTML

                    var _url = '/api/dop/found/alumnus/list?activationStatus=1&graduationId=' + _inThis.years
                        + "&personProvince=" + _inThis.province + "&personCity=" + _inThis.city + "&personArea=" + _inThis.area
                        + "&page=" + page + "&size=" + size
                    $.ajax({
                        type: 'GET',
                        url: _url,
                        dataType: 'json',
                        success: function(data){
                            if(!data.rows){
                                return;
                            }
                            var arrLen = data.rows.length;
                            if(arrLen > 0){

                            }else{
                                // 如果没有数据
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                $(".dropload-down>div").remove();
                                $(".dropload-down").append(me.opts.domDown.domNoData);
                            }

                            // 插入数据到页面，放到最后面

                            for(var i=0;i<data.rows.length;i++){
                                _inThis.studentsList.push( data.rows[i]);
                            }
                            /* _inThis.messageList.push()

                             $('.lists').append(result);*/
                            // 每次数据插入，必须重置
                            me.resetload();
                        },
                        error: function(xhr, type){
                            Base.Messager.open('惊呆了!');
                            // 即使加载出错，也得重置
                            me.resetload();
                        }
                    });
                }
            });
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
        }
    },
    created(){
        this.getYear()
        this.getProvince()
        Base.judgelogin("login.html")
    }
})

