'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();



// GET ALL PRODUCTS IN CATEGORY
router.get('/categories/:id', (req, res, next) => {
  knex('categories')
    .select('*')
    .innerJoin('products', 'products.category_id', 'categories.category_id')
    .innerJoin('images', 'products.product_id', 'images.product_id')
    .where('products.category_id', req.params.id)
    .then((product) => {
      console.log(product, '********** PRODUCT');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});


// GET ALL COLLECTIONS IN CATEGORY
router.get('/categories/:id/collections', (req, res, next) => {
  knex('categories')
    .select()
    .innerJoin('collections', 'collections.category_id', 'categories.category_id')
    .where('collections.category_id', req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});


// INSERT NEW COLLECTION INTO CATEGORY
router.post('/categories/collection', (req, res, next) => {
  const { name } = req.body;
  const categoryId = parseInt(req.body.categoryId);

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
          next(err);
        })
    })
    .catch((err) => {
      next(err);
    });
});


// DELETE COLLECTION FROM SIDE NAV CATEGORY & PRODUCTS_COLLECTIONS RELATIONSHIP
router.delete('/categories/:categoryId/collection/:collectionId', (req, res, next) => {
  const { categoryId, collectionId } = req.params;

  knex('collections')
    .where('category_id', categoryId)
    .where('collections.collection_id', collectionId)
    .del()
    .then(() => {
      return knex('collections')
        .select('*')
        .where('category_id', categoryId)
        .then((collections) => {
          res.send(collections);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
