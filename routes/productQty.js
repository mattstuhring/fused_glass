'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();



router.post('/productQty', (req, res, next) => {
  console.log(req.body, '******* body')

  const prodsIDs = req.query.productsIDs;
  let psIDs = [];

  prodsIDs.forEach((el) => {
    return psIDs.push(parseInt(el));
  });

  console.log(psIDs, '*********** psIDs');


  knex('products')
    .select('*')
    .whereIn('products.product_id', psIDs)
    .then((prods) => {
      console.log(prods);

      res.send(prods);
    })
    .catch((err) => {
      next(err);
    });
});



module.exports = router;
