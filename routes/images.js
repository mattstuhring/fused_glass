'use strict';

const knex = require('../knex');
const express = require('express');
const multer  = require('multer');
const upload = multer()
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const path = require('path');
const router = express.Router();


// GET ALL SECONDARY PRODUCT IMAGES BY ID
router.get('/images/:id', (req, res, next) => {
  console.log(req.params.id, '********* ID');

  knex('images')
    .select('*')
    .where('product_id', req.params.id)
    .then((images) => {
      res.send(images);
    })
    .catch((err) => {
      next(err);
    });
});




// ADD PRODUCT SECONDARY IMAGES
router.post('/images', upload.array('images'), (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  console.log(req.files, '************** FILES');
  console.log(req.body, '***************** BODY');

  const { category } = req.body;
  let { collections, id } = req.body;
  let productId;
  let categoryName;

  if (req.files !== {}) {
    let db = knex.table('images')
    let imgArr = [];
    let productId;

    if (Array.isArray(id) === true) {
      productId = parseInt(req.body.id[0]);
    } else {
      productId = parseInt(req.body.id);
    }

    if (Array.isArray(category) === true) {
      categoryName = req.body.category[0];
    } else {
      categoryName = req.body.category;
    }

    if (Array.isArray(collections) === true) {
      collections = collections[0].split(',');
      collections.push(productId);
    } else {
      collections = collections.split(',');
      collections.push(productId);
    }

    req.files.forEach((img) => {
      console.log(img, '********** IMG forEach');
      const datauri = new Datauri();
      datauri.format(path.extname(img.originalname).toString(), img.buffer);

      cloudinary.v2.uploader.upload(datauri.content,
        {
          folder: `${categoryName}/${productId}/`,
          tags: collections,
          height: 400,
          weight: 500,
          crop: 'limit'
        },
        function(error, result) {
          if (error) {
            console.log(error, '********** CLOUD ERROR');
          }

          imgArr.push({
            image_public_id: result.public_id,
            image_main: false,
            product_id: productId
          });
        });
    });

    db.insert(imgArr)
      .then((r) => {
        console.log(r, '************* r');
        res.sendStatus(200);
      })
      .catch((err) => {
        next(err);
      });
  }
  else {
    res.sendStatus(200);
  }
});








// UPDATE PRIMARY & SECONDARY DROPZONE IMAGE TO AN EMPTY STRING
router.delete('/images/:name/:component/:id', (req, res, next) => {
  const name = req.params.name;
  const component = req.params.component;
  const productId = req.params.id;

  // if (component === 'primary') {
  //   fs.unlink(`public/images/uploads/${name}`, (err) => {
  //     if (err) {
  //       next(err);
  //     }
  //
  //     knex('products')
  //       .where('products.id', productId)
  //       .update('product_image', '')
  //       .then((product) => {
  //         res.send('success');
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
  //   });
  // }
  // else {
  //   fs.unlink(`public/images/uploads/${name}`, (err) => {
  //     if (err) {
  //       next(err);
  //     }
  //
  //     knex('images')
  //       .where({
  //         product_id: productId,
  //         image_name: name
  //       })
  //       .del()
  //       .then((product) => {
  //         res.send('success');
  //       })
  //       .catch((err) => {
  //         next(err);
  //       });
  //   });
  // }

  res.send('SUCCESS')
});


module.exports = router;
