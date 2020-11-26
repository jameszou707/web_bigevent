$(function () {
  //1.添加 表单验证规则
  layui.form.verify({
    //1.1 密码规则
    pwd: [/^\S{6,12}$/, '密码必须在6-12个字符之间~'],
    //1.2 新旧密码必须不一样 规则
    samepwd: function (value) {
      if (value == $('[name=oldPwd]').val()) {
        return '新旧密码不能一样哦~~~';
      }
    },
    //1.3 确认面 必须和 新密码一样 规则
    confirmpwd: function (value) {
      if (value != $('[name=newPwd]').val()) {
        return '确认密码和新密码输入不一样哦~~~';
      }
    }
  });

  //2.为 表单 添加提交事件
  $('.layui-form').on('submit', changePwd);
})

// 1.修改密码--------------------------------
function changePwd(e) {
  e.preventDefault();
  //a.提交数据 到 接口 完成更新密码
  $.ajax({
    url: '/my/updatepwd',
    method: 'post',
    data: $(this).serialize(),
    success(res) {
      // b.如果 不成功，则 退出函数
      if (res.status != 0) return layui.layer.msg(res.message);

      // c.如果成功，则 清空 token，并 跳转到login.html
      layui.layer.msg(res.message, {
        icon: 1,
        time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
      }, function () {
        localStorage.removeItem('token');
        window.top.location = '/login.html';
      });
    }
  });
}