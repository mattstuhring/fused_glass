'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/collections/:id', (req, res, next) => {
  knex('products')
    .select()
    .innerJoin('products_collections', 'products.id', 'products_collections.product_id')
    .where('products_collections.collection_id', req.params.id)
    .then((product) => {
      console.log(product, '************ collections');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
