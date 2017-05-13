'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

// router.get('/categories', (req, res, next) => {
//   knex('categories')
//     .select()
//     .innerJoin('collections', 'collections.category_id', 'categories.id')
//     .then((category) => {
//       console.log(category);
//       res.send(category);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.get('/categories/:id', (req, res, next) => {
  knex('products_categories')
    .select()
    .where('category_id', req.params.id)
    .innerJoin('products', 'products_categories.product_id', 'products.id')
    .then((product) => {
      console.log(product, '$$$$$$$$$$');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/categories/collections/:id', (req, res, next) => {
  knex('categories')
    .select()
    .innerJoin('collections', 'collections.category_id', 'categories.id')
    .where('collections.category_id', req.params.id)
    .then((product) => {
      console.log(product, 'server product');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
