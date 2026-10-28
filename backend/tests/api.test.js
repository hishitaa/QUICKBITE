const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
process.env.NODE_ENV = 'test';
const app = require('../app');

function get(server, path) {
  return new Promise((resolve, reject) => {
    http
      .get({ port: server.address().port, path }, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      })
      .on('error', reject);
  });
}

test('health endpoint returns ok', async () => {
  const server = app.listen(0);
  const res = await get(server, '/api/health');
  server.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('protected route rejects missing token', async () => {
  const server = app.listen(0);
  const res = await get(server, '/api/orders/mine');
  server.close();
  assert.strictEqual(res.status, 401);
});

test('unknown route returns 404', async () => {
  const server = app.listen(0);
  const res = await get(server, '/api/nope');
  server.close();
  assert.strictEqual(res.status, 404);
});
