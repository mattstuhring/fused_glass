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

  // GET PRODUCT TABLE
  knex('products')
    .select('*')
    .where('products.product_id', productId)
    .innerJoin('categories', 'categories.category_id', 'products.category_id')
    .then((product) => {

      // CHECK IF PRODUCTS_COLLECTIONS EXISTS
      return knex('products_collections')
        .select('*')
        .where('products_collections.product_id', productId)
        .innerJoin('collections', 'products_collections.collection_id', 'collections.collection_id')
        .then((colls) => {

          let collections = [];

          // IF PRODUCTS_COLLECTIONS EXISTS
          if (colls.length > 0) {
            colls.forEach((c) => {
              collections.push(c);
            });
          }

          product.push(collections);

          // SEND PRODUCT DETAILS
          res.send(product);
        })
        .catch((err) => {
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

  // PRODUCT VARIABLES
  const { name, description, price, size } = req.body;
  let { category, collections, categoryId } = req.body;

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







// UPDATE PRODUCT IN CLOUDINARY & DB
router.put('/products', upload.single('primary'), (req, res, next) => {
  // VARIABLES
  const { category, name, description, price, size } = req.body;
  let { productId, collections, categoryId } = req.body;
  productId = parseInt(productId);
  categoryId = parseInt(categoryId);
  let knexProductsCollections;
  let knexCollections;

  // CHECK IF COLLECTIONS EXISTS && COLLECTIONS LENGTH IS > 0
  if (typeof collections !== 'undefined') {
    let collectionsNameArray = [];

    // COLLECTIONS VARIABLE CONFIG
    if (collections.length > 0) {
      collectionsNameArray = collections.split(',');
    } else {
      collectionsNameArray = [];
    }

    // SELECT ALL COLLECTION_ID's BY COLLECTION_NAME's
    knex('collections')
      .select('collection_id')
      .whereIn('collection_name', collectionsNameArray)
      .then((collectionIdArray) => {

        // DELETE ALL PRODUCTS_COLLECTIONS ROWS IN DB BY PRODUCT_ID
        return knex('products_collections')
          .where('products_collections.product_id', productId)
          .del()
          .then((r) => {
            let db = knex.table('products_collections')
            let coll = [];

            // CREATE PRODUCTS_COLLECTIONS ROWS TO BE INSERTED
            collectionIdArray.forEach((item) => {
              coll.push({
                product_id: productId,
                collection_id: parseInt(item.collection_id)
              })
            });

            // INSERT NEW PRODUCTS_COLLECTIONS ROWS INTO DB
            db.insert(coll)
              .then(() => {
                console.log('Insert collection sucessful!');
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
  }

  // UPDATE PRODUCT DETAILS IN DB
  knex('products')
    .select('*')
    .where('products.product_id', productId)
    .returning('product_image_public_id')
    .update({
      product_name: name,
      product_price: price,
      product_description: description,
      product_size: size
    })
    .then((productImagePublicId) => {
      const file = req.file;

      // IF THERE IS A PRIMARY IMAGE FILE:
      // DELETE THE OLD IMAGE FROM CLOUDINARY
      // UPLOAD NEW IMAGE TO CLOUDINARY
      // UPDATE DB WITH NEW PUBLIC_ID
      if (file !== undefined && Object.keys(file).length > 0 && file.constructor === Object) {

        // DELETE PRIMARY IMAGE FROM CLOUDINARY
        cloudinary.v2.api.delete_resources(productImagePublicId, function(err, res) {
          console.log(res, '*********  CLOUD DELETE SUCCESS');
        });

        const datauri = new Datauri();
        datauri.format(path.extname(file.originalname).toString(), file.buffer);

        // UPLOAD NEW PRIMARY IMAGE TO CLOUDINARY
        cloudinary.v2.uploader.upload(datauri.content,
          {
            folder: `${category}/${productId}/`,
            tags: productId,
            height: 400,
            weight: 500,
            crop: 'limit'
          },
          function(err, result) {
            if (err) {
              next(err)
            }

            // UPDATE PRODUCT WITH CLOUDINARY PUBLIC_ID
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
      }
      else {
        // IF THERE IS NO IMAGE FILE:
        // SEND BACK PRODUCT ID, MUST BE SENT AS A STRING.
        res.send(productId.toString());
      }
    })
    .catch((err) => {
      next(err);
    });
});





const { exec } = require('child_process');

// DELETE PRODUCT BY ID
router.delete('/products/:productId/:categoryName', (req, res, next) => {
  console.log(req.params.productId, '********** PRODUCT ID');
  const productId = req.params.productId;
  let categoryName = req.params.categoryName;
  categoryName = categoryName[0].toUpperCase() + categoryName.substr(1);

  console.log(productId);
  console.log(categoryName);

  // // DELETE IMAGE FROM CLOUDINARY BY PRODUCT ID TAG NAME
  // cloudinary.v2.api.delete_resources_by_tag(productId, function(err, res) {
  //   console.log(res, '*********  CLOUD DELETE BY TAG NAME');
  // });
  //
  // exec(`curl -X DELETE -u ${process.env.API_KEY}:${process.env.API_SECRET} "https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/folders/${categoryName}/${productId}"`, (err, stdout, stderr) => {
  //   if (err) {
  //     console.error(`exec error: ${err}`);
  //     return;
  //   }
  //
  //   console.log(`Something was successful`);
  // });
  //
  // // UPDATE PRODUCT DETAILS IN DB
  // knex('products')
  //   .where('products.product_id', productId)
  //   .del()
  //   .then((r) => {
  //     console.log(r, '******** DELETE RES');
  //     res.sendStatus(200);
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});

module.exports = router;
