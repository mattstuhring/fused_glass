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




// POST PRODUCT SECONDARY IMAGES
router.post('/images', upload.array('images'), (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  const { category } = req.body;
  let { id } = req.body;
  let productId;
  let categoryName;

  if (req.files !== {} || req.files !== undefined) {
    console.log(req.files, '************ req files');
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


    req.files.forEach((img) => {
      const datauri = new Datauri();
      datauri.format(path.extname(img.originalname).toString(), img.buffer);

      cloudinary.v2.uploader.upload(datauri.content,
        {
          folder: `${categoryName}/${productId}/`,
          tags: productId,
          height: 400,
          weight: 500,
          crop: 'limit'
        },
        function(error, result) {
          if (error) {
            next(error);
          }

          imgArr.push({
            image_public_id: result.public_id,
            product_id: productId
          });
        });
    });

    db.insert(imgArr)
      .then((r) => {
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




// UPDATE PRODUCT SECONDARY IMAGES
router.put('/images', upload.array('images'), (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  const { category } = req.body;
  let { id } = req.body;
  let productId;
  let categoryName;

  if (req.files !== {} || req.files !== undefined) {
    console.log(req.files, '************ req files');
    let db = knex.table('images')
    let imgArr = [];
    let productId;

    if (Array.isArray(id) === true) {
      productId = parseInt(req.body.id[0]);
    } else {
      productId = parseInt(req.body.id);
    }


    req.files.forEach((img) => {
      const datauri = new Datauri();
      datauri.format(path.extname(img.originalname).toString(), img.buffer);

      cloudinary.v2.uploader.upload(datauri.content,
        {
          folder: `${categoryName}/${productId}/`,
          tags: productId,
          height: 400,
          weight: 500,
          crop: 'limit'
        },
        function(error, result) {
          if (error) {
            next(error);
          }

          imgArr.push({
            image_public_id: result.public_id,
            product_id: productId
          });
        });
    });

    db.insert(imgArr)
      .then((r) => {
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
