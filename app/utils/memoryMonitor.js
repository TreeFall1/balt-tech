setInterval(() => {
  const mem = process.memoryUsage();
  console.log(
      `[Memory Monitor] heapUsed: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
  );
}, 5000);