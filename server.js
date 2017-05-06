// var express = require('express');
//
// var app = express();
// const PORT = process.env.PORT || 3000;
//
// app.use(function(req, res, next) {
//   if (req.headers['x-forwarded-proto'] === 'https') {
//     res.redirect('http://' + req.hostname + req.url);
//   } else {
//     next();
//   }
// });
//
// app.use(express.static('public'));
//
// app.listen(PORT, function() {
//   console.log('Express server is up on port ' + PORT);
// });
'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ silent: true });
}

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const ev = require('express-validation');

// Middleware
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

// Routes go here
const products = require('./routes/products');


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

app.use(bodyParser.json());

app.use(cookieSession({
  name: 'fused_glass_dev',
  secret: process.env.SESSION_SECRET
}));

app.use(express.static('public'));

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
    console.log('Listening on PORT', PORT);
  }
});

module.exports = app;
