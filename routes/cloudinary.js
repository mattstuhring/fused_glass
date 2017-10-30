'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();


// GET ALL SECONDARY PRODUCT IMAGES BY ID
router.get('/cloudinary', (req, res, next) => {
  console.log('SUCCESS');

  res.sendStatus(200);
});



module.exports = router;
