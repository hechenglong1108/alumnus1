/**
 * Created by hcl on 2018/3/15
 */


var message=new Vue({
    el:"#message",
    data:{
        messagecontent:"",/*留言内容*/
        pingluncontent:"",/*评论内容*/
        messageList:[],/*留言列表*/
        type:Base.getparm("type") || 1,/*1:班级留言板；2：我的留言板；3：站内留言板-人才招聘；4：站内留言板-技术咨询；5：站内留言板-其他*/
        ispinglun:0,
        page:0,
        size:10
    },
    methods:{
        goback: function(){
            history.go(-1)
        },
        /*获取列表*/
        getMessage: function() {
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
        /*取消评论*/
        deletepinglun: function(){
            this.ispinglun = 0
        },
        /*发布评论*/
        releasepinglun: function() {
            var _inThis = this;
            if(!this.pingluncontent){
                Base.Messager.open("请输入评论内容")
                return;
            }
            Base.loadJson({
                url:"",
                type:"",
                data:{

                }
            },function(json){

            })
        },
        /*显示评论框*/
        showpinglun: function() {
            this.ispinglun = 1
        },
        release: function(){
            var _inThis = this;
            if(!this.messagecontent){
                Base.Messager.open("请输入留言内容")
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
    },
    created(){
        this.getMessage()
        console.log(this.type)
    }
})

