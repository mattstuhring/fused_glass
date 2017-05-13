'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/products', (req, res, next) => {
  knex('products')
    .then((product) => {
      console.log(product, 'server product');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
