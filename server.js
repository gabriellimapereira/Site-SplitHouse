#!/usr/bin/env node
/**
 * SplitHouse Localhost Web Server
 * Serve a Landing Page, os protótipos interativos e o download direto do APK.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = parseInt(process.env.PORT, 10) || 3333;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.apk': 'application/vnd.android.package-archive',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevenir directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (stats && stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <div style="font-family: sans-serif; text-align: center; padding: 60px;">
            <h1 style="color: #5E2B97;">404 - Página Não Encontrada</h1>
            <p style="color: #6B7280;">O recurso solicitado não existe no servidor SplitHouse.</p>
            <a href="/" style="display: inline-block; margin-top: 16px; color: #5E2B97; font-weight: bold;">Voltar para a página inicial</a>
          </div>
        `);
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    };

    if (ext === '.apk') {
      const fileName = path.basename(filePath);
      headers['Content-Disposition'] = `attachment; filename="${fileName}"`;
      headers['Content-Length'] = stats.size;
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

function startServer(currentPort) {
  server.listen(currentPort, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🏡 SplitHouse Landing Page Server Iniciado!`);
    console.log(`======================================================`);
    console.log(`🌐 Local URL:        http://localhost:${currentPort}/`);
    console.log(`📱 APK Download:     http://localhost:${currentPort}/downloads/splithouse-v1.0.0.apk`);
    console.log(`📖 Swagger API Docs: http://localhost:${currentPort}/docs/index.html`);
    console.log(`💻 TypeDoc Docs:     http://localhost:${currentPort}/docs/code/index.html`);
    console.log(`📱 32 Telas Mural:   http://localhost:${currentPort}/screens/mural_todas_as_telas.html`);
    console.log(`======================================================`);
    console.log(`Pressione Ctrl+C para encerrar o servidor.\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Porta ${PORT} já estava em uso. Tentando automaticamente a porta ${PORT + 1}...`);
    PORT += 1;
    startServer(PORT);
  } else {
    console.error('Erro no servidor:', err);
  }
});

startServer(PORT);
