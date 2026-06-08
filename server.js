const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.liquid': 'text/plain',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/plain',
  '.txt': 'text/plain',
};

const IGNORE = ['.git', '.cache', '.local', 'node_modules'];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildTree(dir, base) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let html = '<ul>';
  for (const entry of entries) {
    if (IGNORE.includes(entry.name) || entry.name.startsWith('.')) continue;
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      html += `<li class="dir"><span class="toggle">▶</span> <span class="dirname">${escapeHtml(entry.name)}/</span><div class="children hidden">${buildTree(path.join(dir, entry.name), rel)}</div></li>`;
    } else {
      html += `<li class="file"><a href="/view?f=${encodeURIComponent(rel)}">${escapeHtml(entry.name)}</a></li>`;
    }
  }
  html += '</ul>';
  return html;
}

function renderIndex() {
  const tree = buildTree(ROOT, '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Escape Clothing — Shopify Theme Browser</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #0e0e0e; color: #e0e0e0; display: flex; height: 100vh; overflow: hidden; }
  #sidebar { width: 300px; min-width: 220px; background: #151515; border-right: 1px solid #2a2a2a; overflow-y: auto; padding: 16px 0; display: flex; flex-direction: column; }
  #sidebar h1 { font-size: 14px; font-weight: 700; color: #fff; padding: 0 16px 12px; border-bottom: 1px solid #2a2a2a; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
  #sidebar h1 span { color: #888; font-weight: 400; }
  ul { list-style: none; padding-left: 12px; }
  #sidebar > .tree-root > ul { padding-left: 8px; }
  li.file a { display: block; padding: 3px 8px; font-size: 13px; color: #aaa; text-decoration: none; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  li.file a:hover { background: #222; color: #fff; }
  li.dir { margin: 2px 0; }
  .toggle { cursor: pointer; font-size: 10px; color: #555; user-select: none; display: inline-block; width: 14px; transition: transform 0.15s; }
  .toggle.open { transform: rotate(90deg); }
  .dirname { font-size: 13px; color: #777; cursor: pointer; font-weight: 600; }
  .children { padding-left: 8px; }
  .children.hidden { display: none; }
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  #topbar { background: #111; border-bottom: 1px solid #2a2a2a; padding: 10px 20px; font-size: 12px; color: #666; }
  #topbar strong { color: #ccc; }
  #content { flex: 1; overflow: auto; padding: 24px; }
  #content pre { background: #111; border: 1px solid #222; border-radius: 6px; padding: 20px; font-size: 13px; line-height: 1.6; color: #ccc; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
  #welcome { text-align: center; margin-top: 80px; color: #444; }
  #welcome h2 { font-size: 22px; color: #666; margin-bottom: 12px; }
  #welcome p { font-size: 14px; }
  .badge { display: inline-block; background: #1a1a1a; border: 1px solid #333; border-radius: 4px; padding: 2px 8px; font-size: 11px; color: #888; margin: 2px; }
  #img-preview { max-width: 100%; border: 1px solid #222; border-radius: 6px; margin-top: 12px; }
</style>
</head>
<body>
<div id="sidebar">
  <h1>Escape Clothing <span>Theme</span></h1>
  <div class="tree-root">${tree}</div>
</div>
<div id="main">
  <div id="topbar">Shopify Theme Browser &mdash; <strong>Escape Clothing v2.0</strong> &mdash; Select a file on the left to view its contents</div>
  <div id="content">
    <div id="welcome">
      <h2>Shopify Liquid Theme</h2>
      <p>This theme is deployed to Shopify, not run locally.<br>Browse the source files using the sidebar.</p>
      <br>
      <div>
        <span class="badge">Liquid Templates</span>
        <span class="badge">Shopify OS 2.0</span>
        <span class="badge">Cashfree Payments</span>
        <span class="badge">Dark Streetwear</span>
        <span class="badge">INR / COD</span>
      </div>
    </div>
  </div>
</div>
<script>
  document.querySelectorAll('.toggle, .dirname').forEach(el => {
    el.addEventListener('click', () => {
      const li = el.closest('li.dir');
      const children = li.querySelector('.children');
      const toggle = li.querySelector('.toggle');
      if (children.classList.toggle('hidden')) {
        toggle.classList.remove('open');
      } else {
        toggle.classList.add('open');
      }
    });
  });

  const params = new URLSearchParams(location.search);
  if (params.has('f')) {
    const f = params.get('f');
    document.querySelector('#topbar strong').textContent = f;
    document.querySelectorAll('li.file a').forEach(a => {
      if (decodeURIComponent(a.href.split('?f=')[1] || '') === f) {
        a.style.background = '#1e3a2f';
        a.style.color = '#4caf50';
        let p = a.closest('.children');
        while (p) {
          p.classList.remove('hidden');
          const tog = p.previousElementSibling && p.previousElementSibling.querySelector ? null : null;
          const parentLi = p.parentElement && p.parentElement.closest('li.dir');
          const t = p.closest('li.dir') && p.closest('li.dir').querySelector('.toggle');
          if (t) t.classList.add('open');
          p = p.parentElement && p.parentElement.closest('.children');
        }
      }
    });
  }
</script>
</body>
</html>`;
}

function renderFile(filePath, res) {
  const abs = path.join(ROOT, filePath);
  const rel = path.relative(ROOT, abs);
  if (rel.startsWith('..') || IGNORE.some(i => rel.startsWith(i))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  if (!fs.existsSync(abs)) { res.writeHead(404); res.end('Not found'); return; }

  const ext = path.extname(abs).toLowerCase();
  const isImage = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp'].includes(ext);

  if (isImage) {
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(abs).pipe(res);
    return;
  }

  const content = fs.readFileSync(abs, 'utf8');
  const tree = buildTree(ROOT, '');
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(path.basename(filePath))} — Escape Theme</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #0e0e0e; color: #e0e0e0; display: flex; height: 100vh; overflow: hidden; }
  #sidebar { width: 300px; min-width: 220px; background: #151515; border-right: 1px solid #2a2a2a; overflow-y: auto; padding: 16px 0; }
  #sidebar h1 { font-size: 14px; font-weight: 700; color: #fff; padding: 0 16px 12px; border-bottom: 1px solid #2a2a2a; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
  #sidebar h1 span { color: #888; font-weight: 400; }
  ul { list-style: none; padding-left: 12px; }
  li.file a { display: block; padding: 3px 8px; font-size: 13px; color: #aaa; text-decoration: none; border-radius: 4px; }
  li.file a:hover, li.file a.active { background: #1e3a2f; color: #4caf50; }
  li.dir { margin: 2px 0; }
  .toggle { cursor: pointer; font-size: 10px; color: #555; user-select: none; display: inline-block; width: 14px; }
  .toggle.open { display: inline-block; }
  .dirname { font-size: 13px; color: #777; cursor: pointer; font-weight: 600; }
  .children { padding-left: 8px; }
  .children.hidden { display: none; }
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  #topbar { background: #111; border-bottom: 1px solid #2a2a2a; padding: 10px 20px; font-size: 12px; color: #666; display: flex; align-items: center; gap: 8px; }
  #topbar strong { color: #ccc; }
  #topbar a { color: #4caf50; text-decoration: none; font-size: 12px; }
  #content { flex: 1; overflow: auto; padding: 0; }
  pre { background: #0e0e0e; padding: 24px; font-size: 13px; line-height: 1.7; color: #ccc; overflow-x: auto; white-space: pre-wrap; word-break: break-word; min-height: 100%; }
</style>
</head>
<body>
<div id="sidebar">
  <h1>Escape Clothing <span>Theme</span></h1>
  <div>${tree}</div>
</div>
<div id="main">
  <div id="topbar">
    <a href="/">← Home</a>
    <span>/</span>
    <strong>${escapeHtml(filePath)}</strong>
    <span style="margin-left:auto;background:#1a1a1a;border:1px solid #333;border-radius:4px;padding:2px 8px;font-size:11px;color:#888">${ext || 'file'}</span>
  </div>
  <div id="content"><pre>${escapeHtml(content)}</pre></div>
</div>
<script>
  document.querySelectorAll('.toggle, .dirname').forEach(el => {
    el.addEventListener('click', () => {
      const li = el.closest('li.dir');
      const children = li.querySelector('.children');
      const toggle = li.querySelector('.toggle');
      if (children.classList.toggle('hidden')) toggle.classList.remove('open');
      else toggle.classList.add('open');
    });
  });
  const thisFile = ${JSON.stringify(filePath)};
  document.querySelectorAll('li.file a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && decodeURIComponent(href.split('?f=')[1] || '') === thisFile) {
      a.classList.add('active');
      let p = a.closest('.children');
      while (p) {
        p.classList.remove('hidden');
        const t = p.closest('li.dir') && p.closest('li.dir').querySelector('.toggle');
        if (t) t.classList.add('open');
        p = p.parentElement && p.parentElement.closest('.children');
      }
    }
  });
</script>
</body>
</html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/' || url.pathname === '') {
    const f = url.searchParams.get('f');
    if (f) {
      renderFile(f, res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderIndex());
    }
    return;
  }

  if (url.pathname === '/view') {
    const f = url.searchParams.get('f');
    if (!f) { res.writeHead(400); res.end('Missing file param'); return; }
    renderFile(f, res);
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Escape Clothing theme browser running at http://0.0.0.0:${PORT}`);
});
