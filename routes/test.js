'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();



router.post('/', (req, res, next) => {
    console.log('We made it!');

});



module.exports = router;
