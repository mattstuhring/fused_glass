'use strict';

exports.seed = function(knex) {
  return knex('images').del()
    .then(() => knex('images').insert([
      {
        image_id: 1,
        image_product_id: 'decorative/1/inqblewellycdalixs6g',
        image_main: true,
        product_id: 1,
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        image_id: 2,
        image_product_id: 'decorative/2/jgqlsddcyrtfctsscmxs',
        image_main: true,
        product_id: 2,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        image_id: 3,
        image_product_id: 'jewelry/3/ghkfwhp1jn34sqdrnk9y',
        image_main: true,
        product_id: 3,
        created_at: new Date('2017-09-17 11:16:16 UTC'),
        updated_at: new Date('2017-09-17 11:16:16 UTC')
      },
      {
        image_id: 4,
        image_product_id: 'garden/4/b5glogxrv30qevvkadr3',
        image_main: true,
        product_id: 4,
        created_at: new Date('2017-09-18 11:16:16 UTC'),
        updated_at: new Date('2017-09-18 11:16:16 UTC')
      },
      {
        image_id: 5,
        image_product_id: 'garden/5/vjtp99vst7alp3rigoqm',
        image_main: true,
        product_id: 5,
        created_at: new Date('2017-09-19 11:16:16 UTC'),
        updated_at: new Date('2017-09-19 11:16:16 UTC')
      },
      {
        image_id: 6,
        image_product_id: 'jewelry/6/gzzwbjolt89kuwydw3yv',
        image_main: true,
        product_id: 6,
        created_at: new Date('2017-09-20 11:16:16 UTC'),
        updated_at: new Date('2017-09-20 11:16:16 UTC')
      },
      {
        image_id: 7,
        image_product_id: 'houseware/7/sqbxjea1wxsjqc3ipga5',
        image_main: true,
        product_id: 7,
        created_at: new Date('2017-09-21 11:16:16 UTC'),
        updated_at: new Date('2017-09-21 11:16:16 UTC')
      },
      {
        image_id: 8,
        image_product_id: 'houseware/8/f2kype9guf2c8buxdjo7',
        image_main: true,
        product_id: 8,
        created_at: new Date('2017-09-22 11:16:16 UTC'),
        updated_at: new Date('2017-09-22 11:16:16 UTC')
      },
      {
        image_id: 9,
        image_product_id: 'houseware/9/a3yzak0moh9jvt1l7opl',
        image_main: true,
        product_id: 9,
        created_at: new Date('2017-09-23 11:16:16 UTC'),
        updated_at: new Date('2017-09-23 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('images_image_id_seq', (SELECT MAX(image_id) FROM images));"
      )
    );
};
