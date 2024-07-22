function generateTOC() {
  let toc = document.getElementById('toc');
  // 如果不存在ID为'toc'的元素，则创建一个
  if (!toc) {
    toc = document.createElement('div');
    toc.id = 'toc';
    document.body.prepend(toc); // 将toc元素添加到文档的开始位置
  }

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  toc.innerHTML = '<h2>目录</h2><ul></ul>';
  const ul = toc.querySelector('ul');

  headings.forEach(heading => {
    const text = heading.textContent;
    const id = heading.id ? heading.id : text.replace(/\s+/g, '-').toLowerCase();
    heading.id = id; // 确保每个标题都有ID

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = text;
    a.onclick = (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    };

    li.appendChild(a);
    ul.appendChild(li);
  });
}

// 更新当前活动标题
function updateActiveTocItem() {
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
const tocLinks = document.querySelectorAll('#toc a');

let activeIndex = headings.length - 1;
while (activeIndex >= 0 && headings[activeIndex].offsetTop > window.scrollY) {
  activeIndex--;
}

tocLinks.forEach(link => link.classList.remove('active'));
if (activeIndex >= 0) {
  tocLinks[activeIndex].classList.add('active');
}
}

// 初始化目录和滚动事件监听
document.addEventListener('DOMContentLoaded', generateTOC);
window.addEventListener('scroll', updateActiveTocItem);