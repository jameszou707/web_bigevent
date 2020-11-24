// 1.为 页面上 所有基于 jq 的 ajax 请求发送之前，对参数对象做处理
$.ajaxPrefilter(function (ajaxOpt) {
  // a.拼接 基地址
  ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;
});