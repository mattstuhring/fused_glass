'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.delete('/products/:id', (req, res, next) => {
  console.log(req.params.id, 'req params id');


  knex('products')
    .where('products.id', req.params.id)
    .del()
    .then((products) => {
      console.log(products, '********** delete product');
      res.sendStatus(200);
      // console.log(prods, '****************** connect deleted');
      //
      // return knex('products')
      //   .where('products.category_id', categoryId)
      //   .whereIn('products.id', function() {
      //     this.select('product_id')
      //       .from('products_collections')
      //       .where('products_collections.collection_id', collectionId);
      //   })
      //   .del()
      //   .then((prods) => {
      //     console.log(prods, '****************** products deleted');
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
