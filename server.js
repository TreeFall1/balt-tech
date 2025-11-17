const express = require('express');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 🔹 Мониторинг памяти каждые 5 секунд
  setInterval(() => {
    const mem = process.memoryUsage();
    console.log(
        `[Memory] RSS: ${(mem.rss / 1024 / 1024).toFixed(1)} MB | Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`
    );
  }, 500);

  // ✅ Правильный способ для Express 5
  server.use((req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
});
