require('./src/config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./src/middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN === '*' ? true : process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'QuickBite' }));

// Stricter limit on auth endpoints to slow down brute-force attempts
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/foods', require('./src/routes/foods'));
app.use('/api/orders', require('./src/routes/orders'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
