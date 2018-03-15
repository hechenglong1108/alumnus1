/**
 * Created by hcl on 2018/3/15
 */

var search=new Vue({
    el:"#search",
    data:{
        classList:[]
    },
    methods:{
        goback: function(){
            history.go(-1)
        },
        search: function(){
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

