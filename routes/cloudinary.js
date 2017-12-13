'use strict';

const knex = require('../knex');
const express = require('express');
const cloudinary = require('cloudinary');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


//
router.post('/cloudinary', (req, res, next) => {
  console.log('SUCCESS');

  res.sendStatus(200);
});



module.exports = router;
