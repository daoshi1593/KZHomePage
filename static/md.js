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
    <link rel="stylesheet" href="../static/TOC.css">
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
      <script>
    document.addEventListener('DOMContentLoaded', () => {
      const toc = document.getElementById('toc');
      const ul = document.createElement('ul');
      toc.appendChild(ul);
      const headings = document.querySelectorAll('h1, h2, h3');
      let currentList = ul;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1), 10);
        const item = document.createElement('li');
        item.classList.add('toc-item');
        const link = document.createElement('a');
        const dropdownBtn = document.createElement('span'); // 
      
        const id = heading.id || heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        heading.id = id; // 正确赋值
        link.href = \`#${id}\`;
        link.textContent = heading.textContent;
        link.onclick = (e) => e.stopPropagation(); // 防止点击链接时触发父元素的点击事件
        item.appendChild(link);
        item.appendChild(dropdownBtn); // 将下拉按钮添加到目录项中
        if (level === 3) { // 修改此处，直接创建三级标题的列表
          if (!currentList.querySelector('ul')) {
            const newList = document.createElement('ul');
            currentList.appendChild(newList); // 修改此处，直接将新列表添加到当前列表项
            currentList = newList;
          }
        } else {
          currentList = ul; // 如果不是三级标题，重置currentList为最外层的ul
        }
        currentList.appendChild(item);
      });
      
    });
    </script>
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
    console.log('File updated:', title);
  }

  
  
}
async function blogchange() {
  const files = await readdir('../md-files');
  let html = '';
  for (const file of files) {
    const title = file.split('.')[0];
    items.add(title);
    // 为每个页面创建一个链接
    
  }
  for (const item of items){
    html += `
    <dd>
      <a href="md-files/${item}.html">${item}</a>
      </dd>`;
  }
  console.log(items);
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

// 字符串插入
console.log(html);
const newBlogData = blogData.slice(0, startIndex + startMarker.length) + html + blogData.slice(endIndex); 

// 将修改后的内容写回blog.html文件
await writeFileAsync('../blog.html', newBlogData);
console.log('Blog updated');
}




// 删除重复的函数
async function removeDuplicates() {
  const path = '../blog.html';

  try {
    // 读取文件内容
    let content = await readFileAsync(path, 'utf8');
    console.log('Removing duplicates...');
    // 找到两个 marker 之间的所有 <dd> 模块
    let matches = content.match(/<!-- start insert -->(.*)<!-- end insert -->/s);
    console.log('匹配区域'+ matches[1]+ '长度'+ matches[1].length);
    let dds = matches[0].match(/<dd>[\s\S]*?<\/dd>/g);
    console.log('重复内容'+ dds);
    let uniqueDds = [...new Set(dds)];
    console.log('唯一插入'+ uniqueDds);
    let newContent = content.replace(/<!-- start insert -->(.*)<!-- end insert -->/s, '<!-- start insert -->\n' + uniqueDds.join('\n') + '\n<!-- end insert -->');
    console.log('新内容'+ newContent+'长度'+ newContent.length);
    // 将修改后的内容写回文件
    await writeFileAsync(path, newContent);
    console.log('Duplicates removed');
  } catch (err) {
    console.error('Error removing duplicates:', err);
  }
}

// 监视'md-files'文件夹
// const watcher = watch('C:\hit\个人主页\KZHomePage\md-files', {
//   ignored: /^\./,
//   persistent: true
// });

// // 当检测到新文件被添加或修改时
// watcher.on('add', updateBlog,removeDuplicates);
// watcher.on('change', updateBlog,removeDuplicates);

// // 当检测到文件被删除时
// watcher.on('unlink', updateBlog,removeDuplicates);

// app.listen(3000, () => {
//   console.log('Server is running at http://localhost:3000');
// });
let items = new Set();
// 初始更新
async function ALL() {
  await updateBlog()
  await blogchange()
  
}

ALL()