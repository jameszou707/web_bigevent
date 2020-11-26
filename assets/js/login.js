$(function () {
  // 1.去注册按钮点击事件 -------------------
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // 去登录按钮点击事件
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // 2.为 layui 添加 登录校验规则 ------------
  layui.form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码须 6-12 位，不能出现空格~'
    ],
    // 使用函数作为 自定义规则 形参pwd2 是 确认密码框中的 密码
    //    如果出错 返回消息，如果正常，啥也不返回
    repwd: function (pwd2) {
      //1.获取 密码框密码
      let pwd1 = $('.reg-box [name=password]').val();

      //2.比较两个密码是否相同
      if (pwd1 != pwd2) return '两次密码好像不一致哦，亲~~~';
    }
  });

  // 3.注册表单提交事件（注册） ----------------------
  $("#regForm").on('submit', submitData);
  // 4.注册表单提交事件（登录）----------------
  $('#formLogin').on('submit', function (e) {
    e.preventDefault();
    //a.获取登录表单数据
    let dataStr = $(this).serialize();
    //b.异步提交到 登录接口
    $.ajax({
      url: '/api/login',
      method: 'post',
      data: dataStr,
      success(res) {
        // 登录失败
        if (res.status != 0) return layui.layer.msg(res.message);
        // 登录成功
        layui.layer.msg(res.message, {
          icon: 6,
          time: 1500 // 1.5秒关闭（如果不配置，默认是3秒）
        }, function () {
          // a.保存 token 值 到 localstorage
          localStorage.setItem('token', res.token);
          // b.跳转到 index.html 
          location.href = '/index.html'
        });
      },
      // complete(){

      // }
    });
  });
})

// 1.注册函数 ------------------------------
function submitData(e) {
  e.preventDefault(); // 阻断表单默认提交
  //a.获取 表单数据
  let dataStr = $(this).serialize();
  //b.发送 异步请求
  $.ajax({
    url: '/api/reguser',
    method: 'post',
    data: dataStr,
    success(res) {
      // 不论成功与否，都 显示消息
      layui.layer.msg(res.message);

      //注册出错 ------------------
      if (res.status != 0) return;

      //注册成功 ------------------
      //将 用户名 密码 自动 填充到 登录表单中
      let uname = $('.reg-box [name=username]').val().trim();
      $('.login-box [name=username]').val(uname);

      let upwd = $('.reg-box [name=password]').val().trim();
      $('.login-box [name=password]').val(upwd);

      //清空注册表单
      $('#regForm')[0].reset();
      //切换到登录div
      $('#link_login').click();
    }
  });
}