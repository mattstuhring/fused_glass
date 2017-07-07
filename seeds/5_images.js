'use strict';

exports.seed = function(knex) {
  return knex('images').del()
    .then(() => knex('images').insert([
      {
        id: 1,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 1,
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        id: 2,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 2,
        created_at: new Date('2017-09-16 12:46:16 UTC'),
        updated_at: new Date('2017-09-16 12:46:16 UTC')
      },
      {
        id: 3,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 3,
        created_at: new Date('2017-09-17 12:16:26 UTC'),
        updated_at: new Date('2017-09-17 12:16:26 UTC')
      },
      {
        id: 4,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 4,
        created_at: new Date('2017-09-18 12:26:50 UTC'),
        updated_at: new Date('2017-09-18 12:26:50 UTC')
      },
      {
        id: 5,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 5,
        created_at: new Date('2017-09-19 12:36:46 UTC'),
        updated_at: new Date('2017-09-19 12:36:46 UTC')
      },
      {
        id: 6,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 6,
        created_at: new Date('2017-09-20 12:26:27 UTC'),
        updated_at: new Date('2017-09-20 12:26:27 UTC')
      },
      {
        id: 7,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 7,
        created_at: new Date('2017-09-22 12:26:27 UTC'),
        updated_at: new Date('2017-09-22 12:26:27 UTC')
      },
      {
        id: 8,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 8,
        created_at: new Date('2017-09-23 12:26:27 UTC'),
        updated_at: new Date('2017-09-23 12:26:27 UTC')
      },
      {
        id: 9,
        image_name: 'https://placebear.com/g/300/200',
        product_id: 9,
        created_at: new Date('2017-09-24 12:26:27 UTC'),
        updated_at: new Date('2017-09-24 12:26:27 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('images_id_seq', (SELECT MAX(id) FROM images));"
      )
    );
};
