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
      next(err);
    });
});


// ***********  MULTER -> STORAGE LOCATION OF PRIMARY IMAGE FILES ***********
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([{ name: 'primary', maxCount: 1 }]);
// ************************  MULTER END  ********************************


// ADD NEW PRODUCT DETAILS & PRIMARY IMAGE
router.post('/products', cpUpload, (req, res, next) => {
  const { category, categoryId, name, description, price, size } = req.body;
  const primaryImage = req.files['primary'][0].filename;

  let { collections } = req.body;
  collections = collections.split(',');

  // MULTER UPLOAD FUNC
  cpUpload(req, res, function (err) {
    if (err) {
      next(err);
      return;
    }

    // res.send({success: true});
  });

  // INSERT FORM DATA INTO DB
  knex('collections')
    .select('id')
    .whereIn('collection_name', collections)
    .then((collectionId) => {
      return knex('products')
        .insert({
          product_name: name,
          product_price: price,
          product_description: description,
          product_size: size,
          product_image: primaryImage,
          category_id: categoryId
        })
        .returning('id')
        .then((id) => {
          let db = knex.table('products_collections')

          var foo = [];
          collectionId.forEach((item) => {
            foo.push({
              product_id: id[0],
              collection_id: item.id
            })
          })

          db.insert(foo)
            .then((r) => {
              console.log(r, '************* r');
            })
            .catch((err) => {
              next(err);
            });

          res.send(id);
        })
    })
    .catch((err) => {
      next(err);
    });
});



// UPDATE PRODUCT BY ID
router.put('/products', cpUpload, (req, res, next) => {
  console.log(req.body, '*************** update');
  console.log(req.files, '*********** files');
  res.send({data: 'SUCCESS'});
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
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});







module.exports = router;
