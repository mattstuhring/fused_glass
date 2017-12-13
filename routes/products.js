'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const upload = multer()
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const path = require('path');
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




// // ADD NEW PRODUCT DETAILS
// router.post('/products', (req, res, next) => {
//   const { category, categoryId, name, description, price, size } = req.body;
//   console.log(req.body, '*************** BODY');
//
//   let { collections } = req.body;
//   collections = collections.split(',');
//
//
//   // INSERT FORM DATA INTO DB
//   knex('collections')
//     .select('id')
//     .whereIn('collection_name', collections)
//     .then((collectionId) => {
//       return knex('products')
//         .insert({
//           product_name: name,
//           product_price: price,
//           product_description: description,
//           product_size: size,
//           category_id: parseInt(categoryId)
//         })
//         .returning('id')
//         .then((id) => {
//           let db = knex.table('products_collections')
//
//           var foo = [];
//           collectionId.forEach((item) => {
//             foo.push({
//               product_id: id[0],
//               collection_id: parseInt(item.id)
//             })
//           });
//
//           db.insert(foo)
//             .then((r) => {
//               console.log(r, '************* r');
//             })
//             .catch((err) => {
//               next(err);
//             });
//
//           res.send(id);
//         })
//     })
//     .catch((err) => {
//       next(err);
//     });
// });



// ADD NEW PRODUCT
router.post('/products', upload.single('primary'), (req, res, next) => {
  // const { category, categoryId, name, description, price, size } = req.body;
  //
  // let { collections } = req.body;
  // collections = collections.split(',');

  console.log(req.file, '*************** FILE');
  console.log(req.body, '*********** BODY');

  const datauri = new Datauri();
  datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);


  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  cloudinary.v2.uploader.upload(datauri.content,
    {
      folder: 'decorative/',
      public_id: '10',
      tags: ['primary', 'sea_life']
    },
    function(error, result) {
      console.log(result, '************* CLOUD RESULT');
      console.log(error, '*************** CLOUD ERROR');

      res.sendStatus(200);
    });



  // // INSERT FORM DATA INTO DB
  // knex('collections')
  //   .select('id')
  //   .whereIn('collection_name', collections)
  //   .then((collectionId) => {
  //     return knex('products')
  //       .insert({
  //         product_name: name,
  //         product_price: price,
  //         product_description: description,
  //         product_size: size,
  //         category_id: parseInt(categoryId)
  //       })
  //       .returning('id')
  //       .then((id) => {
  //         let db = knex.table('products_collections')
  //
  //         const c = [];
  //         collectionId.forEach((item) => {
  //           c.push({
  //             product_id: id[0],
  //             collection_id: parseInt(item.id)
  //           })
  //         });
  //
  //         db.insert(c)
  //           .then((r) => {
  //             console.log(r, '************* RESPONSE');
  //           })
  //           .catch((err) => {
  //             next(err);
  //           });
  //
  //         res.send(id[0]);
  //       })
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });



});

























// UPDATE PRODUCT BY ID
router.put('/products', (req, res, next) => {
  const { category, collections, name, description, price, size } = req.body;
  const productId = parseInt(req.body.productId);
  const categoryId = parseInt(req.body.categoryId);
  let request;

  res.send('SUCCESS');
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
