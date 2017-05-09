'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/products', (req, res, next) => {
  knex('products')
    .then((products) => {
      console.log(products, 'server products');
      res.send(products);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
