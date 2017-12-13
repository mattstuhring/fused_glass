'use strict';

exports.seed = function(knex) {
  return knex('images').del()
    .then(() => knex('images').insert([
      {
        image_id: 1,
        image_url: 'http://fillmurray.com/200/300',
        image_main: false,
        product_id: 6,
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('images_image_id_seq', (SELECT MAX(image_id) FROM images));"
      )
    );
};
