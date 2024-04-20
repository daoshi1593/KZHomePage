import express, { static as expressStatic } from 'express';
import { readFile, writeFile, unlink } from 'fs';
import { watch } from 'chokidar';
import marked from 'marked';

const app = express();
app.use(expressStatic('public')); // 用于提供静态文件，如CSS文件

// 监视'md-files'文件夹
const watcher = watch('./md-files', {
  ignored: /^\./,
  persistent: true
});

// 当检测到新文件被添加或修改时
watcher.on('add', updateFile);
watcher.on('change', updateFile);

function updateFile(path) {
  console.log('File', path, 'has been added or changed');
  readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // 创建一个标题为md文件名的新页面在blog.html的div article模块里面,并且把md文件内容写入到新页面中
    const title = path.split('/').pop().split('.')[0];
    const html = `<div class="post">
      <h2>${title}</h2>
      <p>${marked(data)}</p>
    </div>`;
    writeFile(`./public/${title}.html`, html, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('The file has been saved!');
    });
  });
}

// 当检测到文件被删除时
watcher.on('unlink', function(path) {
  console.log('File', path, 'has been removed');
  const title = path.split('/').pop().split('.')[0];
  unlink(`./public/${title}.html`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('The file has been removed!');
  });
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});