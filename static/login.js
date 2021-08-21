layui.config({
            base: '/static/admin/js/'
        }).use('admin');
        layui.use(['layer','jquery'], function(){
            var layer = layui.layer,
                $ = layui.jquery;

            document.onkeydown = function(e){
                if(e.keyCode == 13){
                    $("#submit").click();
                }
            }


            $("#submit").on("click",function () {
                var username = $('input[name=username]').val()
                var password = $('input[name=password]').val()
                if(!username){
                    layer.msg('用户名不能为空',{icon:0});
                    return false;
                }
                if(!password){
                    layer.msg('密码不能为空',{icon:0});
                    return false;
                }

                $.ajax({
                    url: '/login/',
                    data:{'username':username , 'password': password},
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",
                    success: function (data) {
                       if(data.code == 1){
                           layer.msg(data.msg,{icon:1});
                       }else{
                            layer.msg(data.msg,{icon:0});
                       }
                    },
                    error: function(msg){
                        layer.msg('操作失败',{icon:0});
                    }
                })
            })

    });