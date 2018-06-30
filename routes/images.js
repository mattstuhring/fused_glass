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
    .where('images.product_id', req.params.id)
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
  let categoryName;
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


  // CHECK IF THERE ARE ANY SECONARY IMAGES
  if (req.files) {
    req.files.forEach((file) => {
      const datauri = new Datauri();
      datauri.format(path.extname(file.originalname).toString(), file.buffer);

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

          knex('images')
            .insert({
              image_public_id: result.public_id,
              product_id: productId
            })
            .then((r) => {
              console.log(r, '********* r');
            })
            .catch((err) => {
              next(err);
            });
        });
    });
  }

  res.sendStatus(200);
});




// UPDATE PRODUCT SECONDARY IMAGES
router.put('/images', upload.array('images'), (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  // console.log(req.body, '*********** req.body');
  // console.log(req.files, '********** req.files');

  let { id, category } = req.body;
  let productId;
  let categoryName;

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

  if (req.files.length > 0) {
    // NORMAL PROCESS FLOW
    // UPLOAD ALL IMAGES TO CLOUDINARY AND INSERT ALL IMAGES INTO DB
    req.files.forEach((file) => {
      const datauri = new Datauri();
      datauri.format(path.extname(file.originalname).toString(), file.buffer);

      // UPLOAD ALL IMAGES TO CLOUDINARY
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

          // INSERT ALL IMAGES INTO DB
          knex('images')
            .insert({
              image_public_id: result.public_id,
              product_id: productId
            })
            .then((r) => {
              console.log(r.command, '********* success');
            })
            .catch((err) => {
              next(err);
            });
        });
    });
  }

  res.sendStatus(200);
});








// DELETE SECONDARY IMAGE FROM CLOUDINARY & DB
router.delete('/images/:imagePublicId', (req, res, next) => {
  const imagePublicId = req.params.imagePublicId;

  // DELETE SECONDARY IMAGE FROM CLOUDINARY
  cloudinary.v2.api.delete_resources(imagePublicId, function(err, res) {
    if (err) {
      next(err);
    }
    console.log(res, '*********  CLOUD DELETE SUCCESS');
  });

  // DELETE ROW FROM DB BY IMAGE PUBLIC ID
  knex('images')
    .where('images.image_public_id', imagePublicId)
    .del()
    .then((r) => {
      console.log('********* DELETE');

      // COMPLETE WITH STATUS 200
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
