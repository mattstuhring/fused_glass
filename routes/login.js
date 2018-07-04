'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const router = express.Router();
const { camelizeKeys } = require('humps');
const jwt = require('jsonwebtoken')


router.get('/login', (req, res, next) => {
  res.sendStatus(200);
});



router.post('/login', (req, res, next) => {
  let user;

  knex('users')
    .where('user_email', req.body.email)
    .first()
    .then((row) => {
      if (!row) {
        console.log(401, 'Invalid username or password');
        res.sendStatus(401);
      }

      user = camelizeKeys(row);

      return bcrypt.compare(req.body.password, user.userHashedPassword);
    })
    .then(() => {
      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

      const token = jwt.sign(
        { userId: user.userId, email: user.userEmail },
        process.env.JWT_SECRET,
        { expiresIn: '30 days' }
      );

      // res.cookie('accessToken', token, {
      //   httpOnly: true,
      //   expires: expiry,
      //   secure: router.get('env') === 'production'
      // });
      //
      // res.cookie('loggedIn', true, {
      //   expires: expiry,
      //   secure: router.get('env') === 'production'
      // });
      //
      // res.cookie('access', user.access, {
      //   expires: expiry,
      //   secure: router.get('env') === 'production'
      // });

      res.send(token);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      console.log(401, 'Invalid username or password.');
    })
    .catch((err) => {
      next(err);
    });
});


router.delete('/token', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('loggedIn');
  res.clearCookie('access');
  res.sendStatus(200);
});

module.exports = router;
