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



// ***********  MULTER -> STORAGE LOCATION OF PRIMARY IMAGE FILE ***********
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
// ***************************  MULTER END  ********************************



// ADD NEW PRODUCT DETAILS & PRIMARY IMAGE
router.post('/products', cpUpload, (req, res, next) => {
  const { category, categoryId, name, description, price, size } = req.body;
  const primaryImage = req.files['primary'][0].filename;

  let { collections } = req.body;
  collections = collections.split(',');

  // MULTER UPLOAD IMAGE TO FILE SYSTEM
  cpUpload(req, res, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('SUCCESS');
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
          category_id: parseInt(categoryId)
        })
        .returning('id')
        .then((id) => {
          let db = knex.table('products_collections')

          var foo = [];
          collectionId.forEach((item) => {
            foo.push({
              product_id: id[0],
              collection_id: parseInt(item.id)
            })
          });

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
  const { category, collections, name, description, price, size } = req.body;
  const productId = parseInt(req.body.productId);
  const categoryId = parseInt(req.body.categoryId);
  let request;

  res.send('SUCCESS');

  // // FOR SOME UNKNOWN REASON THE LOGIC ON THE IF & ELSE STATEMENT IS BACKWARDS
  // // NEED TO FIND OUT WHY THIS IS HAPPENING BUT FOR NOW IT WILL WORK
  // if (req.files === {}) {
  //   // MULTER UPLOAD IMAGE TO FILE SYSTEM
  //   cpUpload(req, res, function (err) {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //
  //     const filename = req.files['primary'][0].filename;
  //
  //     request = knex('products')
  //       .where('products.id', productId)
  //       .update({
  //         product_name: name,
  //         product_price: price,
  //         product_description: description,
  //         product_size: size,
  //         product_image: filename,
  //         category_id: categoryId
  //       });
  //   });
  // }
  // else {
  //   request = knex('products')
  //     .where('products.id', productId)
  //     .update({
  //       product_name: name,
  //       product_price: price,
  //       product_description: description,
  //       product_size: size,
  //       category_id: categoryId
  //     });
  // }
  //
  // request
  //   .then(() => {
  //     return knex('products_collections')
  //       .where('product_id', productId)
  //       .del()
  //       .then(() => {
  //         if (Array.isArray(collections) === true) {
  //           collections.forEach((c) => {
  //             return knex('collections')
  //               .select('collections.id')
  //               .where('collection_name', c)
  //               .then((collectionId) => {
  //                 knex('products_collections')
  //                   .insert({
  //                     product_id: productId,
  //                     collection_id: collectionId[0].id
  //                   })
  //                   .then(() => {
  //                     res.send('SUCCESS')
  //                   })
  //                   .catch((err) => {
  //                     console.log(err);
  //                   });
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //               });
  //           });
  //         }
  //         else {
  //           return knex('collections')
  //             .select('collections.id')
  //             .where('collection_name', collections)
  //             .then((collectionId) => {
  //               return knex('products_collections')
  //                 .insert({
  //                   product_id: productId,
  //                   collection_id: collectionId[0].id
  //                 })
  //                 .then(() => {
  //                   res.send('SUCCESS')
  //                 })
  //                 .catch((err) => {
  //                   console.log(err);
  //                 });
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
  //
  //     res.send('SUCCESS')
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
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
