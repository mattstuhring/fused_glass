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

          console.log(res, '*************** res'); // [12] -> product_id
          console.log(collectionId, '************* collection id');
          // [  { id: 1 },  { id: 8 } ]
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

          // return knex('products_collections')
          //   .insert({
          //     product_id: res[0],
          //     collection_id: collectionId
          //   }, '*')
        })
    })
    .catch((err) => {
      console.log(err);
    });


  // knex('products')
  //   .insert({
  //     product_name: name,
  //     product_price: price,
  //     product_description: description,
  //     product_size: size,
  //     category_id: categoryId
  //   })
  //   .returning('id')
  //   .then((res) => {
  //     return knex('products_collections')
  //       .insert({
  //         product_id: res[0],
  //         collection_id: collectionId
  //       }, '*')
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});

module.exports = router;
