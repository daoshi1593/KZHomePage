import express, { static as expressStatic } from 'express';
import { readFile, writeFile, } from 'fs';
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
    const htmlData = `
<!DOCTYPE html>
<html lang="ch-cn">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Begin Jekyll SEO tag v2.8.0 -->
<title>${title} | daoshi1593</title>
<meta name="generator" content="Jekyll v3.9.5" />
<meta property="og:title" content="${title}" />
<meta property="og:locale" content="en_US" />
<link rel="canonical" href="https://daoshi1593.github.io/md-files/${title}.html" />
<meta property="og:url" content="https://daoshi1593.github.io/md-files/${title}.html" />
<meta property="og:site_name" content="daoshi1593" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary" />
<meta property="twitter:title" content="${title}" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","headline":"${title}","url":"https://daoshi1593.github.io/md-files/cs106b_ALL.html"}</script>
<!-- End Jekyll SEO tag -->

    <link rel="stylesheet" href="../static/blog.css">
    <!-- start custom head snippets, customize with your own _includes/head-custom.html file -->

<!-- Setup Google Analytics -->



<!-- You can set your favicon here -->
<!-- link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" -->

<!-- end custom head snippets -->

  </head>
  <body>
    <div class="container-lg px-3 my-5 markdown-body">
      
      <h1><a href="https://daoshi1593.github.io/">daoshi1593</a></h1>
      <div style=" display: flex;">
        <h2>
            <a href="https://daoshi1593.github.io/blog">Blog</a>
        </h2>
        <h2>
            <a href="https://daoshi1593.github.io/cv">CV</a>
        </h2>
      </div>
      

      <body>
        <div>${marked(data)}</div>
      </body>

      
      <div class="footer border-top border-gray-light mt-5 pt-3 text-right text-gray">
        This site is open source. <a href="https://github.com/daoshi1593/daoshi1593.github.io/edit/main/md-files/${title}.md">Improve this page</a>.
      </div>
      
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js" integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg=" crossorigin="anonymous"></script>
    <script>anchors.add();</script>
  </body>
</html>
    `;
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