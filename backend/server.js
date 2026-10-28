require('./src/config/env');
const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const seed = require('./src/seed');
const { init } = require('./src/socket');

(async () => {
  try {
    await connectDB();
    await seed();
    const server = http.createServer(app);
    init(server);
    server.listen(process.env.PORT, () =>
      console.log(`QuickBite API running on http://localhost:${process.env.PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
