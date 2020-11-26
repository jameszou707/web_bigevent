$(function () {
  //0.为layui 添加校验规则
  layui.form.verify({
    nickname: [/^\S{6,12}$/, '昵称必须在6-12个字符之间~']
  });

  //1.加载 用户 基本信息
  initUserInfo()

  //2.重置按钮事件
  $('#btnReset').on('click', function () {
    initUserInfo();
  });

  //3.表单提交事件
  $('.layui-form').on('submit', submitData);
})

// 1. 加载 用户 基本信息----------------
function initUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'get',
    success(res) {
      // 错误判断
      if (res.status != 0) return layui.layer.msg(res.message);
      // 将数据 装入 同名 的 表单元素 中
      layui.form.val('userForm', res.data);
    }
  });
}

// 2.提交 表单数据
function submitData(e) {
  // 阻断表单提交
  e.preventDefault();

  $.ajax({
    url: '/my/userinfo',
    method: 'post',
    data: $(this).serialize(),
    success(res) {
      // 不管成功与否，都显示 消息
      layui.layer.msg(res.message);

      // 如果有错，停止函数执行
      if (res.status != 0) return;

      // 如果 没有出错，则 通过 window.parent 或 window.top 调用
      // 父页面的 方法
      window.top.getUserInfo();
    }
  });
}
