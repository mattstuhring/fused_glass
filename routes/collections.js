'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/collections/:id', (req, res, next) => {
  console.log(req.params.id, 'params ID');

  knex('products')
    .select()
    .innerJoin('products_collections', 'products.id', 'products_collections.product_id')
    .innerJoin('collections', 'collections.id', 'products_collections.collection_id')
    .where('products_collections.collection_id', req.params.id)
    .then((product) => {
      console.log(product, '$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
