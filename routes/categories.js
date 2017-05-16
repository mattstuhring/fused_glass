'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

// GET all products in category
router.get('/categories/:id', (req, res, next) => {
  knex('products_categories')
    .select()
    .where('category_id', req.params.id)
    .innerJoin('products', 'products_categories.product_id', 'products.id')
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

// GET all collections in category
router.get('/categories/collections/:id', (req, res, next) => {
  knex('categories')
    .select()
    .innerJoin('collections', 'collections.category_id', 'categories.id')
    .where('collections.category_id', req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
