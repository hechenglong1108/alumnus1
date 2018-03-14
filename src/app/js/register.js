/**
 * Created by hcl on 2018/3/14
 */


var register=new Vue({
    el:"#register",
    data:{
    },
    methods:{
        reg: function(){
            var _data = new FormData($("#registerfrom")[0]),
                _inThis = this;
            $.ajax({
                type: 'post',
                url: '/api/dop/charge/borrower/apply',
                cache: false,    //上传文件不需缓存
                processData: false, //需设置为false。因为data值是FormData对象，不需要对数据做处理
                contentType: false, //需设置为false。因为是FormData对象，且已经声明了属性enctype="multipart/form-data"
                data: _data,
                dataType: 'json',
                success: function (json) {
                    if (json.code * 1 == 1) {

                    } else {

                    }


                }
            })
        },
        getProvince:function(){

        }
    },
    created(){

    }
})

