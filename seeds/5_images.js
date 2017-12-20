'use strict';

exports.seed = function(knex) {
  return knex('images').del()
    .then(() => knex('images').insert([
      {
        image_id: 1,
        image_public_id: 'decorative/1/w3iiee7ay5ctdozz5yip',
        product_id: 1,
        created_at: new Date('2017-09-23 11:16:16 UTC'),
        updated_at: new Date('2017-09-23 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('images_image_id_seq', (SELECT MAX(image_id) FROM images));"
      )
    );
};
