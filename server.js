'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ silent: true });
}

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const ev = require('express-validation');
const morgan = require('morgan');

// Middleware
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

// Routes go here
const categories = require('./routes/categories');
const collections = require('./routes/collections');
const products = require('./routes/products');
const images = require('./routes/images');
const cloudinary = require('./routes/cloudinary');
const productQty = require('./routes/productQty');
const login = require('./routes/login');
const createPayment = require('./routes/createPayment');
const executePayment = require('./routes/executePayment');

const app = express();

app.disable('x-powered-by');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(express.static('public'));

app.use(bodyParser.json());

// app.use(cookieSession({
//   name: 'fused_glass_dev',
//   secret: process.env.SESSION_SECRET
// }));

app.use('/api', categories);
app.use('/api', collections);
app.use('/api', products);
app.use('/api', images);
app.use('/api', cloudinary);
app.use('/api', productQty);
app.use('/api', login);
app.use('/api', createPayment);
app.use('/api', executePayment);

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error catch all 400
app.use((_req, res, _next) => {
  res.sendStatus(404);
});

// server error handler
app.use((err, _req, res, _next) => {
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(err);
  }

  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'plain/text')
      .send(err.message);
  }

  console.error(err);
  res.sendStatus(500);
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Served fresh daily on PORT', PORT);
  }
});

module.exports = app;
