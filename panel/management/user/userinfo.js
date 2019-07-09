//系统管理-个人信息模块

//修改密码弹窗
function updataUserPwd(){
    layer.open({
        type:1,
        title:"修改密码",
        area:["500px","300px"],
       /* offset:["200px","450px"],*/
        content:'<div id="passwordDD">'+
					'<form class="layui-form" action="">'+
						'<div class="layui-form-item">'+
							'<label class="layui-form-label">历史密码</label>'+
							'<div class="layui-input-inline">'+
								'<input type="password" name="password" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">'+
							'</div>'+
						'</div>'+
						'<div class="layui-form-item">'+
							'<label class="layui-form-label">新密码</label>'+
							'<div class="layui-input-inline">'+
								'<input type="password" name="password" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">'+
							'</div>'+
						'</div>'+
						'<div class="layui-form-item">'+
							'<label class="layui-form-label">确认密码</label>'+
							'<div class="layui-input-inline">'+
								'<input type="password" name="password" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">'+
							'</div>'+
						'</div>'+
						'<div class="layui-form-item">'+
							'<div class="layui-input-block">'+
								'<button class="layui-btn" lay-submit lay-filter="formDemo">提交</button>'+
								'<button type="reset" class="layui-btn layui-btn-primary">重置</button>'+
							'</div>'+
						'</div>'+
					'</form>'+
				'</div>'
				});
		}
