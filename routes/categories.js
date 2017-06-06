'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();


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

// ADD NEW PRODUCT -> POST METHOD
router.post('/categories/collections', (req, res, next) => {
  const { category, categoryId, collections, name, description, price, size } = req.body.product;


  knex('collections')
    .select('id')
    .whereIn('collection_name', collections)
    .then((collectionId) => {
      return knex('products')
        .insert({
          product_name: name,
          product_price: price,
          product_description: description,
          product_size: size,
          category_id: categoryId
        })
        .returning('id')
        .then((res) => {
          let db = knex.table('products_collections')

          var foo = [];
          collectionId.forEach((item) => {
            foo.push({
              product_id: res[0],
              collection_id: item.id
            })
          })

          db.insert(foo)
            .then((r) => {
              console.log(r, '************* r');
            })
        })
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post('/categories/collection', (req, res, next) => {
  const { name, categoryId } = req.body;

  knex('collections')
    .insert({
      collection_name: name,
      category_id: categoryId
    }, '*')
    .then(() => {
      return knex('collections')
        .select('*')
        .where('category_id', categoryId)
        .then((collections) => {
          res.send(collections);
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
