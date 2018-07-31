'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();
const request = require('request');
const PAYPAL_API = 'https://api.sandbox.paypal.com';
const CLIENT = 'AX3x_CybpUYv5tqxs48pCnRO4yifsqtc8ZPnS_DHTfx9aXP5JkXeUMvXBM-Fn9W90WqMjwsTYLyX-4-k';
const SECRET = 'EFOC5Fh4bd0bWLk9C-mGBh8HYQqAd-quiRkBOZgi6EdIcAJ70i9cEcmJ4OBG8B1JOuC1KPbU15gFu7go';

router.post('/executePayment', (req, res, next) => {
  var paymentID = req.body.paymentID;
  var payerID   = req.body.payerID;

  request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute', {
    auth: {
      user: CLIENT,
      pass: SECRET
    },
    body: {
      payer_id: payerID,
      transactions: [{
        amount: {
          total: '10.99',
          currency: 'USD'
        }
      }]
    },
    json: true
  }, function (err, response) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    // 4. Return a success response to the client
    res.json({
      status: 'success'
    });
  });
});



module.exports = router;
