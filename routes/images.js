'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

// GET ALL SECONDARY PRODUCT IMAGES BY ID
router.get('/images/:id', (req, res, next) => {
  console.log(req.params.id, '********* ID');

  knex('images')
    .select('*')
    .where('product_id', req.params.id)
    .then((images) => {
      res.send(images);
    })
    .catch((err) => {
      console.log(err);
    });
});



module.exports = router;
