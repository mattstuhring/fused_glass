'use strict';

exports.seed = function(knex) {
  return knex('products').del()
    .then(() => knex('products').insert([
      {
        product_id: 1,
        product_name: 'Tropical Fish',
        product_price: '48.50',
        product_description: 'Fish night light',
        product_size: '8x4',
        product_image_public_id: 'decorative/1/kbjza6ky6ilyy6k6nriz',
        category_id: 1,
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        product_id: 2,
        product_name: 'Space Needle',
        product_price: '28.50',
        product_description: 'Seattle skyline night light',
        product_size: '5x3',
        product_image_public_id: 'decorative/2/ql41pluxufglocautheo',
        category_id: 1,
        created_at: new Date('2017-09-16 12:46:16 UTC'),
        updated_at: new Date('2017-09-16 12:46:16 UTC')
      },
      {
        product_id: 3,
        product_name: 'Dichro Earrings',
        product_price: '19.50',
        product_description: 'Sterling silver dichro earrings',
        product_size: '0.5x0.75',
        product_image_public_id: 'jewelry/3/ghkfwhp1jn34sqdrnk9y',
        category_id: 3,
        created_at: new Date('2017-09-17 12:16:26 UTC'),
        updated_at: new Date('2017-09-17 12:16:26 UTC')
      },
      {
        product_id: 4,
        product_name: 'Salmon',
        product_price: '56.50',
        product_description: 'Garden Stake',
        product_size: '18X8',
        product_image_public_id: 'garden/4/b5glogxrv30qevvkadr3',
        category_id: 4,
        created_at: new Date('2017-09-18 12:26:50 UTC'),
        updated_at: new Date('2017-09-18 12:26:50 UTC')
      },
      {
        product_id: 5,
        product_name: 'Veggie',
        product_price: '32.50',
        product_description: 'Garden Stake',
        product_size: '24x8',
        product_image_public_id: 'garden/5/vjtp99vst7alp3rigoqm',
        category_id: 4,
        created_at: new Date('2017-09-19 12:36:46 UTC'),
        updated_at: new Date('2017-09-19 12:36:46 UTC')
      },
      {
        product_id: 6,
        product_name: 'Ring',
        product_price: '52.50',
        product_description: 'Sterling silver dichro ring',
        product_size: '7',
        product_image_public_id: 'jewelry/6/gzzwbjolt89kuwydw3yv',
        category_id: 3,
        created_at: new Date('2017-09-20 12:26:27 UTC'),
        updated_at: new Date('2017-09-20 12:26:27 UTC')
      },
      {
        product_id: 7,
        product_name: 'Lotion Bottle',
        product_price: '26.50',
        product_description: 'Lotion pump bottle',
        product_size: '6x4',
        product_image_public_id: 'houseware/7/sqbxjea1wxsjqc3ipga5',
        category_id: 2,
        created_at: new Date('2017-09-22 12:26:27 UTC'),
        updated_at: new Date('2017-09-22 12:26:27 UTC')
      },
      {
        product_id: 8,
        product_name: 'Bottle Wine Glass',
        product_price: '15.50',
        product_description: 'Wine bottle on wine glass',
        product_size: '3x5',
        product_image_public_id: 'houseware/8/f2kype9guf2c8buxdjo7',
        category_id: 2,
        created_at: new Date('2017-09-23 12:26:27 UTC'),
        updated_at: new Date('2017-09-23 12:26:27 UTC')
      },
      {
        product_id: 9,
        product_name: 'Bowl',
        product_price: '45.50',
        product_description: 'Beautiful bowl',
        product_size: '12x5',
        product_image_public_id: 'houseware/9/a3yzak0moh9jvt1l7opl',
        category_id: 2,
        created_at: new Date('2017-09-24 12:26:27 UTC'),
        updated_at: new Date('2017-09-24 12:26:27 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products));"
      )
    );
};
