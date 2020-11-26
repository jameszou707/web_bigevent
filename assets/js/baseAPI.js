
// 1.为 页面上 所有基于 jq 的 ajax 请求发送之前，对参数对象做处理
$.ajaxPrefilter(function (ajaxOpt) {
  // a.拼接 基地址 ------------------------------------------------
  ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

  // b.为 所有 /my/ 请求 添加 token -------------------------------
  if (ajaxOpt.url.indexOf('/my/') > -1) {
    ajaxOpt.headers = {
      Authorization: localStorage.getItem('token')
    }
  }

  // c.为 所有的 ajax请求 统一 配置 complete 事件函数 --------------------------------
  //      获取响应报文之后，先执行 success或 error 回调函数，最后执行 complete 回调函数
  ajaxOpt.complete = function (res) {

    //c1.判断 返回的数据是否在告诉我们 【没有登录】
    if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
      //c2.木有登录，则：
      //c2.1显示 需要重新登录 的消息，显示结束后，再执行 清空token和跳转操作
      alert(res.responseJSON.message);
      //c2.2.清空 token
      localStorage.removeItem('token');
      //c2.3.跳转到 login.html
      window.top.location.href = "/login.html";
    }
  }
});