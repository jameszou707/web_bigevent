let $image = null;
let options = null;

$(function () {
  //0.初始化富文本编辑器
  initEditor();
  //1.请求分类下来框数据并 渲染 下拉框
  initCateList();

  //2.初始化 裁剪区
  // 1. 初始化图片裁剪器
  $image = $('#image')

  // 2. 裁剪选项
  options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  //3.为 选择封面按钮 添加事件
  $('#btnChoose').on('click', () => {
    // 模拟 文件选择框 被点击
    $('#coverFile').click();
  });

  //4.为文件选择框 绑定 onchange 事件，获取 选中文件信息
  $('#coverFile').on('change', fileChange);

  //5.为发布 和 草稿 按钮 绑定事件
  $('#btnPublish').on('click', publish);
  $('#btnDraft').on('click', draft);

  //6.为表单 绑定 提交事件
  $('#form-pub').on('submit', doSubmit);
})


//1.请求分类下来框数据并 渲染 下拉框 -------------------------
function initCateList() {
  // a.异步请求 分类列表数据
  $.ajax({
    url: '/my/article/cates',
    method: 'GET',
    success(res) {
      console.log(res);
      // b.读取 模板 并 结合res.data 生成下拉框html
      let strHtml = template('tpl-catelist', res);
      // c.将 下拉框 html 设置给 select 标签
      $('select[name=cate_id]').html(strHtml);
      // d.重新渲染 layui下拉框
      layui.form.render();
    }
  });
}

// 2. 选中文件 ----------------------------
function fileChange(e) {
  // 0 .获取 选中文件信息的数组
  let fileList = e.target.files;
  if (fileList.length == 0) return layui.layer.msg('请选择文件~~！');

  // 1.获取 选中的 第一个文件 信息对象
  let file = fileList[0];
  // 2.创建 文件虚拟路径
  var newImgURL = URL.createObjectURL(file)

  // 3.显示新图片：
  //   调用 裁剪组件，销毁之前的 图片，设置 新的 虚拟路径给ta，并重新创建裁剪区
  $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
}

// 3. 发布和草稿共用的 点击事件处理函数
let state = '已发布';
function publish() {
  state = '已发布'
}

function draft() {
  state = '草稿'
}

// 4.表单提交事件处理函数
function doSubmit(e) {
  //a.阻断表单默认行为
  e.preventDefault();
  //b.获取 表单数据 装入 FormData对象（有文件要上传）
  let fd = new FormData(this);
  //c.为 FormData 追加 state 值（已发布/草稿）
  fd.append('state', state);
  //d.为 FormData 追加 剪裁后的文件数据
  $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img', blob);

      // d.提交 到 接口
      $.ajax({
        url: '/my/article/add',
        method: 'post',
        data: fd,
        processData: false,
        contentType: false,
        success(res) {
          //判断是否 发表成功
          //如果不成功，则提示错误消息
          if (res.status != 0) return layui.layer.msg(res.message);
          //如果 成功，则 直接跳转到 列表页面
          location.href = "/article/art_list.html";
        }
      });
    })
}