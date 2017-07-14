'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const router = express.Router();

// GET PRODUCT DETAILS BY ID
router.get('/products/:id', (req, res, next) => {
  const productId = req.params.id;

  knex('products')
    .select('*')
    .innerJoin('products_collections', 'products.id', 'products_collections.product_id')
    .innerJoin('collections', 'products_collections.collection_id', 'collections.id')
    .innerJoin('categories', 'products.category_id', 'categories.id')
    .where('products.id', productId)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      console.log(err);
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


// ADD NEW PRODUCT SECONDARY IMAGES
router.post('/products/images', cpUpload, (req, res, next) => {
  const { id } = req.body;
  const secondaryImages = req.files['images'];

  // MULTER UPLOAD FUNC
  cpUpload(req, res, function (err) {
    if (err) {
      next(err);
      return;
    }
  });

  let db = knex.table('images')
  let foo = [];
  secondaryImages.forEach((img) => {
    foo.push({
      image_name: img.filename,
      product_id: parseInt(id)
    })
  });

  db.insert(foo)
    .then((r) => {
      console.log(r, '************* r');
    })
    .catch((err) => {
      console.log(err);
    });

  res.send({ success: true });
});


// DELETE PRODUCT BY ID
router.delete('/products/:id', (req, res, next) => {
  knex('products')
    .where('products.id', req.params.id)
    .del()
    .then((products) => {
      return knex('images')
        .where('product_id', req.params.id)
        .del()
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});







module.exports = router;
