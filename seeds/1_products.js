'use strict';

exports.seed = function(knex) {
  return knex('products').del()
    .then(() => knex('products').insert([
      {
        id: 1,
        product_name: 'Jelly Fish',
        product_price: '$48.50',
        product_description: 'Jelly fish votive',
        product_color: 'Red',
        product_size: '8x4',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        id: 2,
        product_name: 'Salmon Dish',
        product_price: '$48.50',
        product_description: 'Salmon rectangle dish',
        product_color: 'Salmon',
        product_size: '10x6',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-16 12:46:16 UTC'),
        updated_at: new Date('2017-09-16 12:46:16 UTC')
      },
      {
        id: 3,
        product_name: 'Dichro Earrings',
        product_price: '$19.50',
        product_description: 'Sterling silver dichro earrings',
        product_color: 'Blue',
        product_size: '0.5x0.75',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-17 12:16:26 UTC'),
        updated_at: new Date('2017-09-17 12:16:26 UTC')
      },
      {
        id: 4,
        product_name: 'Sun',
        product_price: '$56.50',
        product_description: 'Garden Stake',
        product_color: 'Red',
        product_size: '12X12',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-18 12:26:50 UTC'),
        updated_at: new Date('2017-09-18 12:26:50 UTC')
      },
      {
        id: 5,
        product_name: 'Wine & Friends',
        product_price: '$32.50',
        product_description: 'Garden Stake',
        product_color: 'Neolavendar',
        product_size: '24x8',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-19 12:36:46 UTC'),
        updated_at: new Date('2017-09-19 12:36:46 UTC')
      },
      {
        id: 6,
        product_name: 'Bracelet',
        product_price: '$52.50',
        product_description: 'Sterling silver dichro bracelet',
        product_color: 'Purple',
        product_size: 'Adujustable',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-20 12:26:27 UTC'),
        updated_at: new Date('2017-09-20 12:26:27 UTC')
      },
      {
        id: 7,
        product_name: 'Space Needle Nigh Light',
        product_price: '28.50',
        product_description: 'Seattle Skyline',
        product_color: 'Blue',
        product_size: '5x3',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-22 12:26:27 UTC'),
        updated_at: new Date('2017-09-22 12:26:27 UTC')
      },
      {
        id: 8,
        product_name: 'Heart Wine Glass',
        product_price: '15.50',
        product_description: 'Dichro heart',
        product_color: 'Red',
        product_size: 'Wine cup',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-23 12:26:27 UTC'),
        updated_at: new Date('2017-09-23 12:26:27 UTC')
      },
      {
        id: 9,
        product_name: 'Bowl',
        product_price: '45.50',
        product_description: 'Bowl of the sea',
        product_color: 'blue/green',
        product_size: '12x5',
        product_image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-24 12:26:27 UTC'),
        updated_at: new Date('2017-09-24 12:26:27 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));"
      )
    );
};
