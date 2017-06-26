'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const router = express.Router();


// GET all products in category
router.get('/categories/:id', (req, res, next) => {
  knex('categories')
    .select()
    .join('products', 'products.category_id', 'categories.id')
    .where('category_id', req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});


// GET all collections in category
router.get('/categories/:id/collections', (req, res, next) => {
  knex('categories')
    .select()
    .innerJoin('collections', 'collections.category_id', 'categories.id')
    .where('collections.category_id', req.params.id)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
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

const cpUpload = upload.fields([{ name: 'primary', maxCount: 1 }]);

// ADD NEW PRODUCT -> POST METHOD
router.post('/categories/collections', cpUpload, (req, res, next) => {
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
              console.log(err);
            });

          res.send(id);
        })
    })
    .catch((err) => {
      next(err);
    });
});


// INSERT NEW COLLECTION INTO CATEGORY
router.post('/categories/collection', (req, res, next) => {
  const { name, categoryId } = req.body;

  knex('collections')
    .insert({
      collection_name: name,
      category_id: categoryId
    }, '*')
    .then(() => {
      return knex('collections')
        .select('*')
        .where('category_id', categoryId)
        .then((collections) => {
          res.send(collections);
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    });
});


// DELETE COLLECTION FROM SIDE NAV CATEGORY & PRODUCTS_COLLECTIONS RELATIONSHIP
router.delete('/categories/:categoryId/collection/:collectionId', (req, res, next) => {
  const { categoryId, collectionId } = req.params;
  console.log(categoryId, '*********** catID');
  console.log(collectionId, '********** colID');

  knex('collections')
    .where('category_id', categoryId)
    .where('collections.id', collectionId)
    .del()
    .then(() => {
      return knex('collections')
        .select('*')
        .where('category_id', categoryId)
        .then((collections) => {
          res.send(collections);
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
