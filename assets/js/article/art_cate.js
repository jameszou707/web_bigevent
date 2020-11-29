$(function () {
  initArtCateList();
  $('#btnAddCate').on('click', showWindow);

  // 通过代理方式，为 未来的 新增表单 绑定 提交事件
  $('body').on('submit', '#formAdd', doAdd);
  // 通过代理方式，为 未来的 删除按钮 绑定 点击事件
  $('tbody').on('click', '.btn-delete', doDelete);
  // 通过代理方式，为 未来的 编辑按钮 绑定 点击事件
  $('tbody').on('click', '.btn-edit', showEdit);
})

//1.加载 文章分类 列表 -----------------
function initArtCateList() {
  $.ajax({
    url: '/my/article/cates',
    method: 'get',
    success(res) {
      console.log(res);
      //1.遍历 数组 生成 html字符串
      let strHtml = template('tpl-cate', res.data);
      //2.将 html字符串 渲染到 tbody 中
      $('tbody').html(strHtml);
    }
  });
}

// 保存 弹出层的 id
let layerID = null;
//2.显示新增窗口      -----------------
function showWindow() {
  layerID = layui.layer.open({
    type: 1,
    area: ['500px', '260px'],
    title: '添加文章分类',
    content: $('#tpl-window').html()
  });
}

//3.执行新增/编辑      -----------------

function doAdd(e) {
  e.preventDefault();
  //a.获取 弹出层 标题
  let title = $('.layui-layer-title').text().trim();
  // 新增操作 --------------
  if (title == "添加文章分类") {
    //a.获取数据
    let dataStr = $(this).serialize(); //Id=&name=123&alias=456
    // 将 数组字符串中的 Id=& 替换成 空字符串
    dataStr = dataStr.replace('Id=&', ''); //name=123&alias=456
    // 需要 判断 当前 提交， 是 【新增】 还是 【编辑】 操作
    //b.异步提交'
    $.ajax({
      url: '/my/article/addcates',
      method: 'post',
      data: dataStr,
      success(res) {
        layui.layer.msg(res.message);
        if (res.status != 0) return;

        //c.重新获取分类列表
        initArtCateList();
        //d.关闭弹出窗口
        layui.layer.close(layerID);
      }
    });
  } else {
    // 编辑操作 ------------
    $.ajax({
      url: '/my/article/updatecate',
      method: 'post',
      data: $(this).serialize(),
      success(res) {
        layui.layer.msg(res.message);
        if (res.status != 0) return;
        //c.重新获取分类列表
        initArtCateList();
        //d.关闭弹出窗口
        layui.layer.close(layerID);
      }
    });
  }
}

//4.执行删除         -----------------
function doDelete() {
  // let id = this.getAttribute('data-id');
  // h5中 提供了 获取 data- 属性的 快捷语法：
  let id = this.dataset.id;

  // 如果用户点击 确认，则执行 回调函数
  layui.layer.confirm('你确定要删除这条可爱的小数据据吗？', function (index) {

    //发送异步请求，带上动态参数 :id
    $.ajax({
      url: '/my/article/deletecate/' + id,
      method: 'get',
      success(res) {
        layui.layer.msg(res.message);
        if (res.status != 0) return;
        //如果删除成功，则重新请求 列表数据
        initArtCateList();
      }
    });
    // 关闭 当前 确认框
    layui.layer.close(index);
  });
}

//5.显示编辑         -----------------
function showEdit() {
  //a.弹出层
  layerID = layui.layer.open({
    type: 1,
    area: ['500px', '260px'],
    title: '编辑文章分类',
    content: $('#tpl-window').html()
  });
  //b.获取id
  let id = this.dataset.id;
  //c.查询数据
  $.ajax({
    url: '/my/article/cates/' + id,
    method: 'get',
    success(res) {
      console.log(res);
      // 将 获取的 文章分类 数据 自动装填到 表单元素中
      layui.form.val('formData', res.data);
    }
  });
}