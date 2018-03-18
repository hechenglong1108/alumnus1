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
        size:10,
        tid:""/*话题id*/
    },
    methods:{
        goback: function(){
            history.go(-1)
        },
        /*获取列表*/
        getMessage: function() {
            var _inThis = this;
            var _type = 1
            if(_inThis.type*1 == 1){
                _type = 4
            } else if(_inThis.type*1 == 3){
                _type = 2
            } else if(_inThis.type*1 == 4){
                _type = 3
            } else if(_inThis.type*1 == 3){
                _type = 1
            }


            // dropload
            $('.list').dropload({
                scrollArea : window,
                loadDownFn : function(me){
                    _inThis.page++;
                    // 拼接HTML
                    var _url ='/api/dop/topics/page?checkStatus=2&type=' + _type + "&page=" +_inThis.page+'&size='+_inThis.size;
                    if(_inThis.type*1 == 2){
                        _url ='/api/dop/topics/page?checkStatus=2&uid=' + Base.getCookies("uid") + "&page=" +_inThis.page+'&size='+_inThis.size;
                    }
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
                                $(".dropload-down>div").remove();
                                $(".dropload-down").append(me.opts.domDown.domLoad);
                                /*for(var i=0; i<arrLen; i++){
                                    result +=   '<a class="item opacity" href="'+data[i].link+'">'
                                        +'<img src="'+data[i].pic+'" alt="">'
                                        +'<h3>'+data[i].title+'</h3>'
                                        +'<span class="date">'+data[i].date+'</span>'
                                        +'</a>';
                                }*/
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

                            for(var i=0;i<data.rows.length;i++){
                                _inThis.messageList.push( data.rows[i]);
                            }
                           /* _inThis.messageList.push()

                            $('.lists').append(result);*/
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
                url:"/api/dop/leave/message/add",
                type:"POST",
                data:{
                    tId: _inThis.tid,
                    content: _inThis.pingluncontent
                }
            },function(json){
                if(json.code*1 == 1){
                    Base.Messager.open("评论成功");
                    _inThis.ispinglun = 0;
                    $(".dropload-down>div").remove();
                    _inThis.getMessage()
                }else{
                    Base.Messager.open(json.message)
                }
            })
        },
        /*显示评论框*/
        showpinglun: function(_tid) {
            this.ispinglun = 1;
            this.tid = _tid
        },

        /*发布话题*/
        release: function(){
            var _inThis = this;
            var _type = 1
            if(_inThis.type*1 == 1){
                _type = 4
            }else if(_inThis.type*1 == 2){
                _type = 1
            } else if(_inThis.type*1 == 3){
                _type = 2
            } else if(_inThis.type*1 == 4){
                _type = 3
            } else if(_inThis.type*1 == 3){
                _type = 1
            }
            if(!this.messagecontent){
                Base.Messager.open("请输入留言内容")
                return;
            }
            Base.loadJson({
                url:"/api/dop/topics/add",
                type:"post",
                data:{
                    topics:_inThis.messagecontent,
                    type:_type
                }
            },function(json){
                if(json.code*1 == 1){
                    Base.Messager.open("发布成功");
                    /*$(".dropload-down>div").remove();
                    _inThis.getMessage()*/
                }else{
                    Base.Messager.open(json.message);
                }
            })
        }
    },
    created(){
        Base.judgelogin("login.html")
        this.getMessage()
    }
})

