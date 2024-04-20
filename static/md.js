import express, { static as expressStatic } from 'express';
import { readFile, writeFile, unlink } from 'fs';
import { watch } from 'chokidar';
import { marked } from 'marked';
import { join } from 'path';
import { promisify } from 'util';
import { readdir } from 'fs/promises';

const app = express();
app.use(expressStatic('public')); // 用于提供静态文件，如CSS文件

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

// 更新博客的函数
async function updateBlog() {
  const files = await readdir('../md-files');
  let html = '';
  for (const file of files) {
    const data = await readFileAsync(join('../md-files', file), 'utf8');
    const title = file.split('.')[0];
    // 为每个页面创建一个链接
    html += `
    <dd>
      <a href="md-files/${title}.html">${title}</a>
      </dd>`;
    // 记载每一个md文件内容,为每一个创建一个html页面在md-files文件夹下
    const htmlData = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>layout daoshi1593的个人主页 - Layui</title>
      <meta name="renderer" content="webkit">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="//cdn.staticfile.org/layui/2.9.7/css/layui.css" rel="stylesheet">
    </head>
    <body>
    <div class="layui-layout layui-layout-admin">
      <div class="layui-header">
        <div class="layui-logo layui-hide-xs layui-bg-black">layout demo</div>
        <!-- 头部区域（可配合layui 已有的水平导航） -->
        <ul class="layui-nav layui-layout-left">
          <!-- 移动端显示 -->
          <li class="layui-nav-item layui-show-xs-inline-block layui-hide-sm" lay-header-event="menuLeft">
            <i class="layui-icon layui-icon-spread-left"></i>
          </li>
          <li class="layui-nav-item">
              
          <!-- 电脑端显示 -->
          
          </li>
        </ul>
        <ul class="layui-nav layui-layout-right">
          <li class="layui-nav-item layui-hide layui-show-sm-inline-block">
            <a href="javascript:;">
              <img src="//unpkg.com/outeres@0.0.10/img/layui/icon-v2.png" class="layui-nav-img">
              tester
            </a>
            <dl class="layui-nav-child">
              <dd><a href="..\index.html">index</a></dd>
              <dd><a href="..\cv.html">CV</a></dd>
              <dd><a href="..\blog.html">Blog</a></dd>
            </dl>
          </li>
          <li class="layui-nav-item" lay-header-event="menuRight" lay-unselect>
            <a href="javascript:;">
              <i class="layui-icon layui-icon-more-vertical"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="layui-side layui-bg-black">
        <div class="layui-side-scroll">
          <!-- 左侧导航区域（可配合layui已有的垂直导航） -->
          <ul class="layui-nav layui-nav-tree" lay-filter="test">
            <li class="layui-nav-item layui-nav-itemed">
              <a class="" href="javascript:;">学习笔记</a>
              <dl class="layui-nav-child">
                <!-- start insert -->
    
                <!-- end insert -->
              </dl>
            </li>
            <li class="layui-nav-item">
              <a href="javascript:;">menu group 2</a>
              <dl class="layui-nav-child">
                <dd><a href="javascript:;">list 1</a></dd>
                <dd><a href="javascript:;">list 2</a></dd>
                <dd><a href="javascript:;">超链接</a></dd>
              </dl>
            </li>
            <li class="layui-nav-item"><a href="javascript:;">click menu item</a></li>
            <li class="layui-nav-item"><a href="javascript:;">the links</a></li>
          </ul>
        </div>
      </div>
      <div class="layui-body" style="background-color: rgb(227, 237, 205);overflow-y: auto;">
        <!-- 内容主体区域 -->
        <div style="padding: 15px;">
          <blockquote class="layui-elem-quote layui-text" style="color: aqua;>
            daoshi1593的个人主页
          </blockquote>
            <div class="layui-card-body">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- 标题居中 -->
                <title style="font-size: 100%;">${title} <br></title>
                <link rel="stylesheet" href="..\static\styles.css">
              </head>
              <body>
                <div>${marked(data)}</div>
              </body>
          </div>
        </div>
      </div>
      <div class="layui-footer">
        <!-- 底部固定区域 -->
        底部固定区域
      </div>
    </div>
     
    <script src="//cdn.staticfile.org/layui/2.9.7/layui.js"></script>
    <script>
    //JS 
    layui.use(['element', 'layer', 'util'], function(){
      var element = layui.element;
      var layer = layui.layer;
      var util = layui.util;
      var $ = layui.$;
      
      //头部事件
      util.event('lay-header-event', {
        menuLeft: function(othis){ // 左侧菜单事件
          layer.msg('展开左侧菜单的操作', {icon: 0});
        },
        menuRight: function(){  // 右侧菜单事件
          layer.open({
            type: 1,
            title: '更多',
            content: '<div style="padding: 15px;">处理右侧面板的操作</div>',
            area: ['260px', '100%'],
            offset: 'rt', // 右上角
            anim: 'slideLeft', // 从右侧抽屉滑出
            shadeClose: true,
            scrollbar: false
          });
        }
      });
    });
    </script>
    </body>
    </html>`;
    await writeFileAsync(join('../md-files', `${title}.html`), htmlData);
  }

  // 读取blog.html的内容
  const blogData = await readFileAsync('../blog.html', 'utf8');

  // 找到标记的位置
  const startMarker = '<!-- start insert -->';
  const endMarker = '<!-- end insert -->';
  const startIndex = blogData.indexOf(startMarker);
  const endIndex = blogData.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Marker not found in file: ${startMarker} or ${endMarker}`);
  }

  // 在两个标记之间插入新的内容
  const newBlogData = blogData.slice(0, startIndex + startMarker.length) + html + blogData.slice(endIndex);

  // 将修改后的内容写回blog.html文件
  await writeFileAsync('../blog.html', newBlogData);

  console.log('The blog has been updated!');
}

// 监视'md-files'文件夹
const watcher = watch('../md-files', {
  ignored: /^\./,
  persistent: true
});

// 当检测到新文件被添加或修改时
watcher.on('add', updateBlog);
watcher.on('change', updateBlog);

// 当检测到文件被删除时
watcher.on('unlink', updateBlog);

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

// 初始更新
updateBlog();