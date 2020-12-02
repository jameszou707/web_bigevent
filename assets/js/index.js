//1.在 dom树 创建完后 开始 执行
$(function () {
  getUserInfo();
  $('#btnLogout').on('click', logout);
})


//1.加载 用户信息的 函数 -----------------
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'get',
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success(res) {
      if (res.status != 0) return layui.layer.msg(res.message);
      //渲染 用户信息头像
      renderAvatar(res.data);
    }
  });
}

//2.渲染用户信息函数 ----------------------
function renderAvatar(usrData) {
  //a.先获取 用户名（昵称/登录名）
  let usrName = usrData.nickname || usrData.username;
  //b.设置给 welcome span标签
  $('#welcome').html(usrName);

  //c.渲染头像
  if (usrData.user_pic != null) {
    //c1.有图片头像
    $('.layui-nav-img').attr('src', usrData.user_pic).show();
    // 隐藏文字头像
    $('.text-avatar').hide();
  } else {
    //c2.没有图片头像，使用文本头像
    $('.layui-nav-img').hide();// 隐藏 图片头像
    let firstChar = usrName[0].toUpperCase();//获取名字首字
    $('.text-avatar').text(firstChar).show();//设置文字并显示
  }
}

//3.退出按钮函数
function logout() {
  // a.弹出 确认框
  layui.layer.confirm('您确定要退出这个宇宙无敌超级系统吗？', { icon: 3, title: '系统提示' }, function (index) {
    // b.删除 localStorage 中的 token 值
    localStorage.removeItem('token');
    // c.跳转到 login.html
    // location.href = "/login.html";
    location.replace('/login.html');

    layer.close(index);
  });
}