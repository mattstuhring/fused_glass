'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const router = express.Router();

// DELETE PRODUCT BY ID
router.delete('/products/:id', (req, res, next) => {
  console.log(req.params.id, 'req params id');

  knex('products')
    .where('products.id', req.params.id)
    .del()
    .then((products) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
    });
});




// STORAGE LOCATION OF IMAGE FILES
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([{ name: 'images', maxCount: 4 }]);

// ADD NEW PRODUCT -> POST METHOD
router.post('/products/images', cpUpload, (req, res, next) => {
  const { id } = req.body;
  const secondaryImages = req.files['images'];
  console.log(id, '************* ID');
  console.log(secondaryImages, '************ SECONDARY');

  // MULTER UPLOAD FUNC
  cpUpload(req, res, function (err) {
    if (err) {
      next(err);
      return;
    }
  });


  let db = knex.table('images')

  var foo = [];
  secondaryImages.forEach((img) => {
    foo.push({
      image_name: img.filename,
      product_id: parseInt(id)
    })
  })

  db.insert(foo)
    .then((r) => {
      console.log(r, '************* r');
    })
    .catch((err) => {
      console.log(err);
    });

  res.send({ success: true });
});









module.exports = router;
