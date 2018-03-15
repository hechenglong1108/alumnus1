/**
 * Created by hcl on 2018/3/15
 */

var classs=new Vue({
    el:"#classs",
    data:{
        classList:[],
        page:0,
        size:10
    },
    methods:{
        goback: function(){
            history.go(-1)
        },

        getList: function() {
            var _inThis = this;
            // dropload
            $('.list').dropload({
                scrollArea : window,
                loadDownFn : function(me){
                    _inThis.page++;
                    // 拼接HTML
                    var result = '';
                    $.ajax({
                        type: 'GET',
                        url: 'http://ons.me/tools/dropload/json.php?page='+_inThis.page+'&size='+_inThis.size,
                        dataType: 'json',
                        success: function(data){
                            var arrLen = data.length;
                            if(arrLen > 0){
                                for(var i=0; i<arrLen; i++){
                                    result +=   '<a class="item opacity" href="'+data[i].link+'">'
                                        +'<img src="'+data[i].pic+'" alt="">'
                                        +'<h3>'+data[i].title+'</h3>'
                                        +'<span class="date">'+data[i].date+'</span>'
                                        +'</a>';
                                }
                                // 如果没有数据
                            }else{
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                $(".dropload-down>div").remove();
                                $(".dropload-down").append(me.opts.domDown.domNoData);
                            }

                            // 插入数据到页面，放到最后面



                            $('.lists').append(result);
                            // 每次数据插入，必须重置
                            me.resetload();
                        },
                        error: function(xhr, type){
                            alert('Ajax error!');
                            // 即使加载出错，也得重置
                            me.resetload();
                        }
                    });
                }
            });
        },

    },
    created(){
        this.getList()
    }
})

