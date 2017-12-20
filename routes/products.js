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
      console.log(product, '**************** PRODUCT');
      res.send(product);
    })
    .catch((err) => {
      next(err);
    });
});






// ADD NEW PRODUCT
router.post('/products', upload.single('primary'), (req, res, next) => {
  const { category, name, description, price, size } = req.body;

  let { collections, categoryId } = req.body;
  collections = collections.split(',');

  console.log(req.file, '*************** FILE');
  console.log(req.body, '*********** BODY');

  // res.sendStatus(200);

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
