$(function () {
  // 创建 时间格式化过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();

    let hh = dt.getHours();
    let mm = dt.getMinutes();
    let ss = dt.getSeconds();

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // 为查询表单 绑定事件
  $('#formSearch').on('submit', search)
  initArtList();
  initCate();

  //未 未来的删除按钮 代理 点击事件
  $('tbody').on('click', '.btn-edit', function () {
    location.href = "/article/art_edit.html?id=" + this.dataset.id;
  });
  //未 未来的删除按钮 代理 点击事件
  $('tbody').on('click', '.btn-delete', del);
})

//【全局变量】分页查询参数对象
let q = {
  pagenum: 1, // 当前页码
  pagesize: 5, // 页容量（页显示的行数）
  cate_id: '', // 分类筛选id
  state: '' // 发布状态
};
//1.加载 文章列表 ----------------------
function initArtList() {
  $.ajax({
    url: '/my/article/list',
    method: 'get',
    data: q,
    success(res) {
      console.log(res);
      //1.遍历 数组 生成 html字符串
      let strHtml = template('tpl-list', res.data);
      //2.将 html字符串 渲染到 tbody 中
      $('tbody').html(strHtml);
      //3.调用 生成页码条方法
      renderPage(res.total);
    }
  });
}

//2.加载 分类下拉框 ---------------------
function initCate() {
  $.ajax({
    url: '/my/article/cates',
    method: 'get',
    success(res) {
      //生成 下拉框 html代码
      let htmlStr = template('tpl-cate', res.data);
      // 将 html代码 添加到 分类下拉框中
      $('select[name=cate_id]').html(htmlStr);
      // 通知 layui 重新渲染 下拉框 和 其他表单元素
      layui.form.render();
    }
  });
}

//3.查询事件处理函数 --------------------
function search(e) {
  //a.阻断表单提交
  e.preventDefault();
  //b.逐一获取查询表单下拉框的数据 ， 设置给 分页查询参数对象
  q.cate_id = $('select[name=cate_id]').val();
  q.state = $('select[name=state]').val();
  console.log(q);
  //d.重新加载 文章列表
  initArtList();
}

//4.生成页码条 -------------------------
// 注意：laypage中的 jump 函数触发时机：1.laypage.render 会执行首次触发
//                                  2.点击页码时触发
//                                  3.切换页容量下拉框时触发
function renderPage(total) {
  layui.laypage.render({
    elem: 'pageBar', // 页码条容器
    count: total,    // 总行数
    limit: q.pagesize,// 页容量
    curr: q.pagenum, // 获取起始页
    limits: [2, 5, 10, 15, 20],// 页容量选项
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],// 页码条功能
    jump(obj, first) { // 点击页码的事件函数
      console.log('当前点击页码：', obj.curr);
      q.pagenum = obj.curr; // 获取 当前页码，设置给 分页查询参数
      q.pagesize = obj.limit;// 获取 下拉框中 选中的 页容量，设置给 分页查询参数
      //当点击页码时
      if (!first) {
        initArtList();
      }
    }
  });
}

//5.删除业务   -------------------------
function del() {
  // 获取 要删除文章的 id
  let id = this.dataset.id;
  // 如果用户点击 确认，则执行 回调函数
  layui.layer.confirm('你确定要删除这条可爱的小数据据吗？', function (index) {
    // 获取页面上 剩余行数
    let rows = $('tbody tr .btn-delete').length;

    //发送异步请求，带上动态参数 :id
    $.ajax({
      url: '/my/article/delete/' + id,
      method: 'get',
      success(res) {
        layui.layer.msg(res.message);
        if (res.status != 0) return;
        //删除成功后，需要 判断是否已经没有行了，如果没有，则 页码 -1
        if (rows <= 1) {
          // 如果当前页码已经是第一页，则 仍然保持 1
          // 如果不是第一页，则 页码 -1
          q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
        }
        //如果删除成功，则重新请求 列表数据
        initArtList();
      }
    });
    // 关闭 当前 确认框
    layui.layer.close(index);
  });
}