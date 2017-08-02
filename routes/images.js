'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const fs = require('fs');
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
      next(err);
    });
});


// ***********  MULTER -> STORAGE LOCATION OF SECONDARY IMAGE FILES ***********
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([{ name: 'images', maxCount: 4 }]);
// ************************  MULTER END  ********************************


// ADD PRODUCT SECONDARY IMAGES
router.post('/images', cpUpload, (req, res, next) => {
  const id = parseInt(req.body.id);
  const secondaryImages = req.files['images'];

  if (req.files !== {}) {
    let productId;

    if (Array.isArray(id) === true) {
      productId = id[0];
    } else {
      productId = id;
    }

    // MULTER UPLOAD
    cpUpload(req, res, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      let db = knex.table('images')
      let imgArr = [];

      secondaryImages.forEach((img) => {
        imgArr.push({
          image_name: img.filename,
          product_id: productId
        })
      });

      db.insert(imgArr)
        .then((r) => {
          console.log(r, '************* r');
        })
        .catch((err) => {
          next(err);
        });
    });

    res.send('SUCCESS')
  }
  else {
    res.send('SUCCESS');
  }
});


// UPDATE PRIMARY & SECONDARY DROPZONE IMAGE TO AN EMPTY STRING
router.delete('/images/:name/:component/:id', (req, res, next) => {
  const name = req.params.name;
  const component = req.params.component;
  const productId = req.params.id;

  // if (component === 'primary') {
  //   fs.unlink(`public/images/uploads/${name}`, (err) => {
  //     if (err) {
  //       next(err);
  //     }
  //
  //     knex('products')
  //       .where('products.id', productId)
  //       .update('product_image', '')
  //       .then((product) => {
  //         res.send('success');
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
  //   });
  // }
  // else {
  //   fs.unlink(`public/images/uploads/${name}`, (err) => {
  //     if (err) {
  //       next(err);
  //     }
  //
  //     knex('images')
  //       .where({
  //         product_id: productId,
  //         image_name: name
  //       })
  //       .del()
  //       .then((product) => {
  //         res.send('success');
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
  //   });
  // }

  res.send('SUCCESS')
});


module.exports = router;
