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
    .innerJoin('products_collections', 'products.product_id', 'products_collections.product_id')
    .innerJoin('collections', 'products_collections.collection_id', 'collections.collection_id')
    .innerJoin('categories', 'products.category_id', 'categories.category_id')
    .where('products.product_id', productId)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});






// ADD NEW PRODUCT TO DB & PRIMARY IMAGE TO CLOUDINARY
router.post('/products', upload.single('primary'), (req, res, next) => {
  const { category, name, description, price, size } = req.body;

  let { collections, categoryId } = req.body;
  collections = collections.split(',');

  // res.sendStatus(200);

  const datauri = new Datauri();
  datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);


  // INSERT FORM DATA INTO DB
  knex('collections')
    .select('collection_id')
    .whereIn('collection_name', collections)
    .then((collectionIdArray) => {
      return knex('products')
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
          let db = knex.table('products_collections')
          const c = [];

          collectionIdArray.forEach((item) => {
            c.push({
              product_id: productId,
              collection_id: parseInt(item.collection_id)
            })
          });

          db.insert(c)
            .then(() => {
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

                  // INSERT IMAGE INTO PRODUCT IMAGE DB COLUMN
                  knex('products')
                    .where('products.product_id', productId)
                    .update({
                      product_image_public_id: result.public_id
                    })
                    .then((data) => {
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
        })
        .catch((err) => {
          next(err);
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

  knex('collections')
    .select('collection_id')
    .whereIn('collection_name', collections)
    .then((collectionIdArray) => {
      return knex('products')
        .select('*')
        .where('products.product_id', productId)
        .returning('product_image_public_id')
        .update({
          product_name: name,
          product_price: price,
          product_description: description,
          product_size: size,
          category_id: categoryId
        })
        .then((imgPublicId) => {
          // DELETE ALL COLLECTIONS ATTACHED TO PRODUCT
          // INSERT NEW COLLECTIONS
          return knex('products_collections')
            .where('products_collections.product_id', productId)
            .del()
            .then(() => {
              let db = knex.table('products_collections')
              const coll = [];

              collectionIdArray.forEach((item) => {
                coll.push({
                  product_id: productId,
                  collection_id: parseInt(item.collection_id)
                })
              });

              db.insert(coll)
                .then(() => {
                  console.log(req.file, '********** req.file');

                  // IF THERE IS A PRIMARY IMAGE FILE THEN
                  // DELETE THE OLD IMAGE FROM CLOUDINARY
                  // UPLOAD NEW IMAGE TO CLOUDINARY
                  // UPDATE DB WITH NEW PUBLIC_ID
                  if (req.file) {
                    cloudinary.v2.api.delete_resources(imgPublicId, function(error, result){console.log(result, '*********  CLOUD DELETE SUCCESS');});

                    const datauri = new Datauri();
                    datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

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
                          next(error)
                        }

                        // UPDATE PRODUCT WITH CLOUDINARY PUBLIC_ID
                        knex('products')
                          .update({
                            product_image_public_id: result.public_id
                          })
                          .then((data) => {
                            res.send(productId.toString());
                          })
                          .catch((err) => {
                            next(err)
                          });
                      });
                  }
                  else {
                    // IF THERE IS NO IMAGE FILE:
                    // SEND BACK PRODUCT ID WHICH UNFORTUNATELY HAS TO BE SENT AS A STRING.
                    res.send(productId.toString());
                  }

                })
                .catch((err) => {
                  next(err);
                });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });

  // // INSERT FORM DATA INTO DB
  // knex('collections')
  //   .select('collection_id')
  //   .whereIn('collection_name', collections)
  //   .then((collectionIdArray) => {
  //     return knex('products')
  //       .update({
  //         product_name: name,
  //         product_price: price,
  //         product_description: description,
  //         product_size: size,
  //         category_id: parseInt(categoryId)
  //       })
  //       .returning('product_id')
  //       .then((productId) => {
  //         productId = parseInt(productId[0]);
  //         let db = knex.table('products_collections')
  //         const c = [];
  //
  //         collectionIdArray.forEach((item) => {
  //           c.push({
  //             product_id: productId,
  //             collection_id: parseInt(item.collection_id)
  //           })
  //         });
  //
  //         db.update(c)
  //           .then((r) => {
  //             cloudinary.v2.uploader.upload(datauri.content,
  //               {
  //                 folder: `${category}/${productId}/`,
  //                 tags: productId,
  //                 height: 400,
  //                 weight: 500,
  //                 crop: 'limit'
  //               },
  //               function(error, result) {
  //                 if (error) {
  //                   next(error)
  //                 }
  //
  //                 // UPDATE PRODUCT WITH CLOUDINARY PUBLIC_ID
  //                 knex('products')
  //                   .update({
  //                     product_image_public_id: result.public_id
  //                   })
  //                   .then((data) => {
  //                     res.send(productId.toString());
  //                   })
  //                   .catch((err) => {
  //                     next(err)
  //                   });
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
