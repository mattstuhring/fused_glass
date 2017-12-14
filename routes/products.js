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
  const { name, description, price, size } = req.body;

  let { collections, category, categoryId } = req.body;
  collections = collections.split(',');
  category = category.toLowerCase();

  console.log(req.file, '*************** FILE');
  console.log(req.body, '*********** BODY');

  const datauri = new Datauri();
  datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


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
            .then((r) => {

              cloudinary.v2.uploader.upload(datauri.content,
                {
                  folder: `${category}/${productId}/`,
                  public_id: `${path.basename(req.file.originalname, path.extname(req.file.originalname))}_${productId}`,
                  tags: collections
                },
                function(error, result) {
                  if (error) {
                    console.log(error, '********** CLOUD ERROR');
                  }
                  console.log(result, '************* CLOUD RESULT');

                  // INSERT IMAGE INTO DB
                  knex('images')
                    .insert({
                      image_url: result.secure_url,
                      image_main: true,
                      product_id: productId
                    })
                    .then((data) => {
                      console.log(data, '******** data');
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
