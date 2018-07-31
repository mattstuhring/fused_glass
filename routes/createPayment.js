'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();
const request = require('request');
const PAYPAL_API = 'https://api.sandbox.paypal.com';
const CLIENT = 'AX3x_CybpUYv5tqxs48pCnRO4yifsqtc8ZPnS_DHTfx9aXP5JkXeUMvXBM-Fn9W90WqMjwsTYLyX-4-k';
const SECRET = 'EFOC5Fh4bd0bWLk9C-mGBh8HYQqAd-quiRkBOZgi6EdIcAJ70i9cEcmJ4OBG8B1JOuC1KPbU15gFu7go';

router.post('/createPayment', (req, res, next) => {
    console.log('Create Payment!');

    request.post(PAYPAL_API + '/v1/payments/payment', {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            total: '5.99',
            currency: 'USD'
          }
        }],
        redirect_urls: {
          return_url: 'http://192.168.1.17:3000/cart',
          cancel_url: 'http://192.168.1.17:3000/cart'
        }
      },
      json: true
    }, function (err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }

        // 3. Return the payment ID to the client
        res.json({
          id: response.body.id
        });
    });
});



module.exports = router;
