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

const upload = multer({ storage: storage }).array('images');




// ADD NEW PRODUCT -> POST METHOD
router.post('/categories/collections', (req, res, next) => {
  const { category, categoryId, collections, name, description, price, size } = req.body.product;

  // MULTER UPLOAD FUNC
  upload(req, res, function (err) {
    if (err) {
      next(err);
      return;
    }

    // Everything went fine
    res.send({success: true});
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
          category_id: categoryId
        })
        .returning('id')
        .then((res) => {
          let db = knex.table('products_collections')

          var foo = [];
          collectionId.forEach((item) => {
            foo.push({
              product_id: res[0],
              collection_id: item.id
            })
          })

          db.insert(foo)
            .then((r) => {
              console.log(r, '************* r');
            })
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


// DELETE COLLECTION FROM CATEGORY
router.delete('/categories/:categoryId/collection/:collectionId', (req, res, next) => {
  const { categoryId, collectionId } = req.params;
  console.log(categoryId, '*********** catID');
  console.log(collectionId, '********** colID');

  // const collection = collections.id;

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
        })
    })
    .catch((err) => {
      console.log(err);
    });

  // knex('sms')
  //   .where('id', req.params.id)
  //   .first()
  //   .then((text) => {
  //     return knex('sms')
  //       .del()
  //       .where('id', req.params.id)
  //       .then(() => {
  //         delete text.id;
  //         res.send(text);
  //       });
  //   })
  //   .then(() => {
  //     knex('sms')
  //       .select()
  //       .where('sms_id', req.token.userId)
  //       .then((response) => {
  //         res.send(response);
  //       })
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});


module.exports = router;
