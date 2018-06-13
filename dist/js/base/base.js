var Base = {
    _loginUrl: "/app/huoke/login.html",
    _pageSize: 20,
    _dataType: "web", //数据来源方式 目前考虑 webapp:嵌入APP运行、web：h5运行模式 默认web
    islogin: false,
    isadmin:false,
    /*判断是否登录*/
    judgelogin:function(_url){
        var _inThis=this;
        Base.loadJsonNoAsync({
            url:"/api/wns/admin/login",
            type:"get",
        },function(json){
            if(json.code*1 == 1){
                _inThis.islogin=true;
            }else{
                _inThis.islogin=false;
                var _name = localStorage.getItem("name"),
                    _pass = localStorage.getItem("pass")
                if(_name && _pass){
                    Base.loadJson({
                        url:"/api/wns/admin/login",
                        type:"post",
                        data:{
                            un: _name,
                            pass: _pass
                        }
                    },function(json){
                        if(json.code*1 == 1){
                            /*Base.Messager.open("登录成功")*/

                        }else{
                            Base.Messager.open(json.message)
                        }
                    })
                }else{
                    location.href = 'login.html'
                }


                /*Base.Messager.open("系统检测到您未登录，请登录");
                setTimeout(function(){
                    location.href = _url
                },2000)*/

            }
        })
    },




    /*判断是否登录*/
    judgeadminlogin:function(_url){
        var _inThis=this;
        Base.loadJsonNoAsync({
            url:"/api/wns/admin/login",
            type:"get",
        },function(json){
            if(json.code*1 == 1){
                _inThis.islogin=true;
                if(json.data.type*1 != 1){
                    layer.msg("您的账号不是管理员，请登录管理员账号");
                    setTimeout(function(){
                        location.href = _url
                    },2000)
                }else {
                    _inThis.isadmin = true
                }
            }else{
                _inThis.islogin=false;
                layer.msg("系统检测到您未登录，请登录");
                setTimeout(function(){
                    location.href = _url
                },2000)

            }
        })
    },

    /*获取url*/
    getparm: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return  unescape(r[2]);
        return null;
    },

    /**
     * 跳转到某个页面
     * @param url(string) 跳转页面链接
     * @param gotime(number) 等待跳转的秒数
     * @param needlogin(bool) 是否需要登录 需要则直接跳转至login.html页面
     */
    go: function (url, gotime, needlogin) {
        //需要登录
        if(needlogin && !this.islogin)
        {
            window.top.location.href = this._loginUrl;
            return;
        }
        if (gotime == undefined || gotime == null)
            gotime = 0;
        if (gotime == 0)
            window.top.location.href = url;
        else
            setTimeout(function () {
                window.top.location.href = url;
            }, gotime * 1000);
    },

    /*
     * 写入cookies
     * @param key 键
     * @param val 值
     * @param day 存放多少天
     */
    setCookies: function (key, val, day) {
        var expiresDate = new Date();//获取当前日期
        expiresDate.setDate(expiresDate.getDate() + (day ? day : 1));//设置生存期，一天后过期
        document.cookie = key + "=" + val + ";expires= " + expiresDate.toGMTString() + ";path=/;";//标记已经访问了站点
    },
    /*
     * 获取cookies
     * @param key
     */
    getCookies: function (key) {
        var search = key + "=";
        var returnvalue = "";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;// 已经存在cookies内
                end = document.cookie.indexOf(";", offset);// set index of beginning of value
                if (end == -1)// set index of end of cookie value
                    end = document.cookie.length;
                returnvalue = unescape(document.cookie.substring(offset, end));
            }
        }
        return returnvalue;
    },
    /*
     * 删除cookies
     * @param key
     */
    delCookies: function (key) {
        //获取当前日期
        var expiresDate = new Date();
        //设置生存期，一天后过期
        expiresDate.setDate(expiresDate.getDate() - 100);
        document.cookie = key + "=;expires= " + expiresDate.toGMTString() + ";path=/;";//标记已经访问了站点
    },
    /**
     * 清空所有cookies
     */
    delAllCookies: function () {
        //获取所有的cookies key
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--; )
            {
                this.delCookies(keys[i]);
            }
        }
    },
    /**
     * 获取基本http地址
     */
    getBaseUrl: function () {
        return location.protocol + "//" + location.host;
    },
    /**
     * ajax获取json数据 支持回调
     * @param url(string) 接口地址 同时也支持对象传递{url:",data:{}}
     */
    loadJson: function (url, callback) {
        var _data = {}, _type = "post";

        if (typeof url == 'object' && url.url) {
            _data = url.data;
            if (url.type)
                _type = url.type;
            url = url.url;
        }
        url = this.getBaseUrl() + url;
        if (this._dataType == "web")
            $.ajax({
                url: url,
                type: _type, // 默认post
                dataType: "json",
                data: _data,
                success: function (json) {
                    if (typeof callback == "function") {
                        callback(json);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (typeof callback == "function") {
                        callback({reload: true});//reload：为true表示重新执行数据请求 多见适用于用户是否登录认证
                    }
                }
            });
        else
            HostApp.fromHttp(_url, data, function (success) {
                if (typeof callback == "function") {
                    callback(success);
                } else
                    HostApp.alert(success);
            }, function (fail) {
                if (typeof callback == "function") {
                    callback(fail);
                } else
                    HostApp.alert(fail);
            }, function (finish) {
                // if (typeof callback == "function") {
                //      callback(finish);
                //  }else
                //      HostApp.alert(finish);
            });
    },
    /**
     * 同步获取数据
     */
    loadJsonNoAsync: function (url, callback) {
        var _data = {}, _type = "post";

        if (typeof url == 'object' && url.url) {
            _data = url.data;
            if (url.type)
                _type = url.type;
            url = url.url;
        }
        url = this.getBaseUrl() + url;
        if (this._dataType == "web")
            $.ajax({
                url: url,
                type: _type, // 默认post
                dataType: "json",
                async: false, //同步
                data: _data,
                success: function (json) {
                    if (typeof callback == "function") {
                        callback(json);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (typeof callback == "function") {
                        callback({reload: true});//reload：为true表示重新执行数据请求 多见适用于用户是否登录认证
                    }
                }
            });
        else
            HostApp.fromHttp(_url, data, function (success) {
                if (typeof callback == "function") {
                    callback(success);
                } else
                    HostApp.alert(success);
            }, function (fail) {
                if (typeof callback == "function") {
                    callback(fail);
                } else
                    HostApp.alert(fail);
            }, function (finish) {
                // if (typeof callback == "function") {
                //      callback(finish);
                //  }else
                //      HostApp.alert(finish);
            });
    },
    /**
     * 是否是微信
     */
    isWeixin: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 是否是安卓
     * @return {Boolean} [description]
     */
    isAndroid: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf('android') > -1 || ua.indexOf('adr') > -1;
    },
    /**
     * 是否是iOS
     * @return {Boolean} [description]
     */
    isIOS: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
    },
    /**
     * 返回操作系统
     */
    OS: function () {
        if (this.isAndroid()) {
            return "android";
        } else if (this.isIOS()) {
            return "ios";
        } else {
            return "android";//如果检查失败 就返回 安卓
        }
    },

    /**
     * 工具类
     */
    Tools: {
        /**
         * 手机号码格式是否正确
         * @param mobile:string 手机号码 11位
         * @return true/false 
         */
        isMobile: function (mobile)
        {
            var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
            if (mobile == '' || !reg.test(mobile)) {
                return false;
            }
            return true;
        },
        /**
         * 邮箱地址格式是否正确
         * @param email:string 邮箱地址
         * @return true/false 
         */
        isEmail: function (email)
        {
            var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (email == '' || !reg.test(email)) {
                return false;
            }
            return true;
        },
        /**
         * 身份证号码格式是否正确
         * @param cardNo:string 身份证号码
         * @return true/false 
         */
        isIdCardNo: function (cardNo)
        {
            if (cardNo == '' || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(cardNo)) {
                return false;
            }
            return true;
        },
        /**
         * 根据身份证号码获取生日
         * @param personid:string 身份证号码
         * @return birthday:string 生日串
         */
        getBirthdayByIdCard: function (personid)
        {
            var birthday = "";
            if (!isNaN(personid) && personid.length > 16)
            {
                birthday = personid.substring(6, 10) + "-" + personid.substring(10, 12) + "-" + personid.substring(12, 14);
            }
            return birthday;
        },
        /**
         * 根据身份证号码获取性别
         * @param personid:string 身份证号码
         * @return sex:string 性别
         */
        getSexByIdCard: function (personid)
        {
            var sex = "";
            if (!isNaN(personid) && personid.length > 16)
            {
                if (parseInt(personid.substr(16, 1)) % 2 == 1)
                    sex = "男";
                else
                    sex = "女";
            }
            return sex;
        },
        /**
         * 根据身份证号码获取年龄 
         * @param personid:string 身份证号码
         * @return age:number 年龄
         */
        getAgeByIdCard: function (personid)
        {
            var age = "";
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - personid.substring(6, 10) - 1;
            if (personid.substring(10, 12) < month || personid.substring(10, 12) == month && personid.substring(12, 14) <= day) {
                age++;
            }
            return age;
        },
        /*
         *禁用移动流量球、禁用iframe嵌入
         */
        setFrame: function () {
            var frames = window.frames, jss = $("script");
            /*for (var i = 0; i < frames.length; i++) {
             if (frames[i].document.location.href != 'about:blank')
             frames[i].document.location.href = 'about:blank';
             
             frames[i].onload = function() {
             if (this.src != 'about:blank') this.src = 'about:blank';
             }
             }*/
            for (var i = 0; i < jss.length; i++) {
                var _src = jss.eq(i).attr("src").indexOf("http");
                if (_src > -1) {
                    jss.eq(i).remove();
                }
            }
        }
    },
    /**
     * 弹窗类
     */
    Messager: {

        /**
         * 消息提示
         * @param _msg:string 提示内容
         * @param _callback:function 回调
         */
        open: function (_msg, _callback)
        {
            layer.open({
                content: _msg,
                skin: 'msg',
                time: 3, //3秒后自动关闭
                callback: _callback
            });
        },

        /**
         * 单纯的提示框 不能自行关闭
         * @param _config:object {title:"",msg:"",icon:"",callback:function(){}}
         */
        alert: function (_config)
        {
            var _title = _config.title ? _config.title : "";
            var _msg = _config.msg ? _config.msg : "";
            var _icon = _config.icon ? _config.icon : ""; // error,question,info,warning
            var _ok = _config.ok ? _config.ok : "确定";
            var _callback = _config.callback ? _config.callback : null;
            if (_callback)
            {
                layer.open({
                    title: _title,
                    content: _msg,
                    skin: 'msg',
                    time: 3, //3秒后自动关闭
                    callback: _callback
                });
            } else
            {
                layer.open({
                    title: _title,
                    content: _msg,
                    skin: 'msg',
                    time: 3 //3秒后自动关闭
                });
            }
        },
        /**
         * 确认提示框 支持回调
         * @param _config:object {msg:"",btn:['确定','取消'],yes:function(){},cancel:function(){}}
         */
        confirm: function (_config)
        {
            var _msg = _config.msg ? _config.msg : "";
            var _yes = _config.yes ? _config.yes : null;
            var _cancel = _config.cancel ? _config.cancel : null;
            var _btn = _config.btn ? _config.btn : ['确定', '取消'];

            layer.open({
                content: _msg,
                btn: _btn,
                yes: _yes,
                cancel: function () {
                    if (typeof _cancel == "function")
                    {
                        _cancel();
                    }
                    return true;
                }
            });
        },
        /**
         * 加载中的遮罩层
         * @param _loadingText:string 提示文本
         */
        loading: function (_loadingText)
        {
            layer.open({
                type: 2,
                content: _loadingText ? _loadingText : "正在加载中...",
                shadeClose: false//点击其他区域不允许关闭遮罩层
            });
        },
        /**
         * 关闭所有提示框
         */
        hideLoading: function ()
        {
            layer.closeAll();
        }
    }
};
/*
Common.Base.isLogin();*/

$(function(){
    /*Base.judgelogin();*/
})
