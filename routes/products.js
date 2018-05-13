'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const upload = multer()
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const path = require('path');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


// GET PRODUCT DETAILS BY ID
router.get('/products/:id', (req, res, next) => {
  const productId = req.params.id;

  knex('products')
    .select('*')
    .where('products.product_id', productId)
    .innerJoin('categories', 'categories.category_id', 'products.category_id')
    .then((product) => {
      console.log(product, '***** product');

      return knex('products_collections')
        .select('*')
        .where('products_collections.product_id', productId)
        .innerJoin('collections', 'products_collections.collection_id', 'collections.collection_id')
        .then((colls) => {
          console.log(colls, '************ res');

          if (colls.length > 0) {
            colls.forEach((c) => {
              product.push(c);
            });
          }

          console.log(product, '******** final product');

          res.send(product);
        })
        .catch((err) => {
          console.log('we here!');
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});






// INSERT NEW PRODUCT TO DB & UPLOAD PRIMARY IMAGE TO CLOUDINARY
router.post('/products', upload.single('primary'), (req, res, next) => {

  // GENERATE DATA URI SCHEME
  const datauri = new Datauri();
  datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

  const { name, description, price, size } = req.body;
  let { category, collections, categoryId } = req.body;
  console.log(collections, '********* initial collections');

  // INSERT NEW PRODUCT INTO DB
  knex('products')
    .insert({
      product_name: name,
      product_price: price,
      product_description: description,
      product_size: size,
      product_image_public_id: '',
      category_id: parseInt(categoryId)
    })
    .returning('product_id')
    .then((productId) => {
      productId = parseInt(productId[0]);

      // IF COLLECTIONS EXIST, INSERT COLLECTIONS INTO DB
      if (collections !== '' || collections.length >= 1) {

        if (collections.length === 1) {
          let collName = collections;
          collections = [];
          collections.push(collName);
        }

        if (collections.length > 1) {
          collections = collections.split(',');
        }

        console.log(collections, '****** collections');

        // INSERT COLLECTIONS INTO DB
        knex('collections')
          .select('collection_id')
          .whereIn('collection_name', collections)
          .then((collectionIdArray) => {
            let db = knex.table('products_collections')
            const colls = [];

            // CREATE COLLECTIONS ARRAY
            collectionIdArray.forEach((item) => {
              colls.push({
                product_id: productId,
                collection_id: parseInt(item.collection_id)
              })
            });

            // INSERT COLLECTIONS ARRAY
            db.insert(colls)
              .then((r) => {
                console.log('collections successful');
              })
              .catch((err) => {
                next(err);
              });
          })
          .catch((err) => {
            next(err);
          });
      }

      // UPLOAD PRIMARY DROPZONE IMAGE TO CLOUNDINARY
      cloudinary.v2.uploader.upload(datauri.content,
        {
          folder: `${category}/${productId}/`,
          tags: productId,
          height: 400,
          weight: 500,
          crop: 'limit'
        },
        function(error, result) {
          if (error) {
            console.log(error, '********** CLOUD ERROR');
          }

          // INSERT IMAGE INTO DB
          knex('products')
            .where('products.product_id', productId)
            .update({
              product_image_public_id: result.public_id
            })
            .then((data) => {
              console.log(productId, '********* productId');

              // SEND RESPONSE -> PRODUCT ID
              res.send(productId.toString());
            })
            .catch((err) => {
              next(err)
            });
        });
    })
    .catch((err) => {
      next(err);
    });
});







// UPDATE PRODUCT
router.put('/products', upload.single('primary'), (req, res, next) => {
  const { category, name, description, price, size } = req.body;

  let { productId, collections, categoryId } = req.body;
  productId = parseInt(productId);
  categoryId = parseInt(categoryId);

  if (Array.isArray(collections) === true) {
    collections = req.body.collections;
  } else {
    collections = req.body.collections.split(',');
  }

  // { productId: '1',
  //   category: 'decorative',
  //   categoryId: '1',
  //   collections: [ 'Sea Life', 'Night Lights' ],
  //   name: 'Tropical Fish',
  //   description: 'Fish night light',
  //   price: '$48.50',
  //   size: '8x4'
  // } '*********** body'

  // [ 'Sea Life', 'Night Lights' ] '********* collections'

  // undefined '******** file'

  console.log(req.body, '*********** body');
  console.log(collections, '********* collections');
  console.log(req.file, '******** file');

  res.sendStatus(200);

  // if (collections !== undefined || collections[0] !== '') {
  //   knex('collections')
  //     .select('collection_id')
  //     .whereIn('collection_name', collections)
  //     .then((collectionIdArray) => {
  //       // DELETE ALL COLLECTIONS ATTACHED TO PRODUCT
  //       // INSERT NEW COLLECTIONS
  //       return knex('products_collections')
  //         .where('products_collections.product_id', productId)
  //         .del()
  //         .then(() => {
  //           let db = knex.table('products_collections')
  //           const coll = [];
  //
  //           collectionIdArray.forEach((item) => {
  //             coll.push({
  //               product_id: productId,
  //               collection_id: parseInt(item.collection_id)
  //             })
  //           });
  //
  //           db.insert(coll)
  //             .then(() => {
  //               console.log('Insert collection sucessful!');
  //             })
  //             .catch((err) => {
  //               next(err);
  //             });
  //         })
  //         .catch((err) => {
  //           next(err);
  //         });
  //
  //     })
  //     .catch((err) => {
  //       next(err);
  //     });
  // }
  //
  //
  // knex('products')
  //   .select('*')
  //   .where('products.product_id', productId)
  //   .returning('product_image_public_id')
  //   .update({
  //     product_name: name,
  //     product_price: price,
  //     product_description: description,
  //     product_size: size
  //   })
  //   .then((imgPublicId) => {
  //     console.log(req.file, '********** req.file');
  //
  //     // IF THERE IS A PRIMARY IMAGE FILE:
  //     // DELETE THE OLD IMAGE FROM CLOUDINARY
  //     // UPLOAD NEW IMAGE TO CLOUDINARY
  //     // UPDATE DB WITH NEW PUBLIC_ID
  //     if (!req.file) {
  //       cloudinary.v2.api.delete_resources(imgPublicId, function(err, res) {
  //         console.log(res, '*********  CLOUD DELETE SUCCESS');
  //       });
  //
  //       const datauri = new Datauri();
  //       datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
  //
  //       cloudinary.v2.uploader.upload(datauri.content,
  //         {
  //           folder: `${category}/${productId}/`,
  //           tags: productId,
  //           height: 400,
  //           weight: 500,
  //           crop: 'limit'
  //         },
  //         function(err, result) {
  //           if (err) {
  //             next(err)
  //           }
  //
  //           // UPDATE PRODUCT WITH CLOUDINARY PUBLIC_ID
  //           knex('products')
  //             .where('products.product_id', productId)
  //             .update({
  //               product_image_public_id: result.public_id
  //             })
  //             .then((data) => {
  //               res.send(productId.toString());
  //             })
  //             .catch((err) => {
  //               next(err)
  //             });
  //         });
  //     }
  //     else {
  //       // IF THERE IS NO IMAGE FILE:
  //       // SEND BACK PRODUCT ID, MUST BE SENT AS A STRING.
  //       res.send(productId.toString());
  //     }
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
















  // knex('collections')
  //   .select('collection_id')
  //   .whereIn('collection_name', collections)
  //   .then((collectionIdArray) => {
  //     return knex('products')
  //       .select('*')
  //       .where('products.product_id', productId)
  //       .returning('product_image_public_id')
  //       .update({
  //         product_name: name,
  //         product_price: price,
  //         product_description: description,
  //         product_size: size,
  //         category_id: categoryId
  //       })
  //       .then((imgPublicId) => {
  //         // DELETE ALL COLLECTIONS ATTACHED TO PRODUCT
  //         // INSERT NEW COLLECTIONS
  //         return knex('products_collections')
  //           .where('products_collections.product_id', productId)
  //           .del()
  //           .then(() => {
  //             let db = knex.table('products_collections')
  //             const coll = [];
  //
  //             collectionIdArray.forEach((item) => {
  //               coll.push({
  //                 product_id: productId,
  //                 collection_id: parseInt(item.collection_id)
  //               })
  //             });
  //
  //             db.insert(coll)
  //               .then(() => {
  //                 console.log(req.file, '********** req.file');
  //
  //                 // IF THERE IS A PRIMARY IMAGE FILE THEN:
  //                 // DELETE THE OLD IMAGE FROM CLOUDINARY
  //                 // UPLOAD NEW IMAGE TO CLOUDINARY
  //                 // UPDATE DB WITH NEW PUBLIC_ID
  //                 if (req.file !== []) {
  //                   cloudinary.v2.api.delete_resources(imgPublicId, function(error, result){console.log(result, '*********  CLOUD DELETE SUCCESS');});
  //
  //                   const datauri = new Datauri();
  //                   datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
  //
  //                   cloudinary.v2.uploader.upload(datauri.content,
  //                     {
  //                       folder: `${category}/${productId}/`,
  //                       tags: productId,
  //                       height: 400,
  //                       weight: 500,
  //                       crop: 'limit'
  //                     },
  //                     function(error, result) {
  //                       if (error) {
  //                         next(error)
  //                       }
  //
  //                       // UPDATE PRODUCT WITH CLOUDINARY PUBLIC_ID
  //                       knex('products')
  //                         .where('products.product_id', productId)
  //                         .update({
  //                           product_image_public_id: result.public_id
  //                         })
  //                         .then((data) => {
  //                           res.send(productId.toString());
  //                         })
  //                         .catch((err) => {
  //                           next(err)
  //                         });
  //                     });
  //                 }
  //                 else {
  //                   // IF THERE IS NO IMAGE FILE:
  //                   // SEND BACK PRODUCT ID WHICH UNFORTUNATELY HAS TO BE SENT AS A STRING.
  //                   res.send(productId.toString());
  //                 }
  //               })
  //               .catch((err) => {
  //                 next(err);
  //               });
  //           })
  //           .catch((err) => {
  //             next(err);
  //           });
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
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
