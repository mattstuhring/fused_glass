'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();


// select * from products join categories on category_id = categories.id where categories.id = 1;


// GET all products in category
router.get('/categories/:id', (req, res, next) => {
  knex('categories')
    .select()
    .join('products', 'products.category_id', 'categories.id')
    .where('category_id', req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});

// GET all collections in category
router.get('/categories/:id/collections', (req, res, next) => {
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

// ADD NEW PRODUCT POST METHOD
router.post('/categories/collections', (req, res, next) => {
  const { category, categoryId, collectionId, name, description, price, size } = req.body.product;

  knex('products')
    .insert({
      product_name: name,
      product_price: price,
      product_description: description,
      product_size: size
    })
    .returning('id')
    .then((res) => {
      return knex('products_categories')
        .insert({
          product_id: res[0],
          category_id: categoryId
        })
        .returning('product_id')
        .then((r) => {
          return knex('products_collections')
            .insert({
              product_id: r[0],
              collection_id: collectionId
            }, '*')
        })
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
