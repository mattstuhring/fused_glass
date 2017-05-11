'use strict';

exports.seed = function(knex) {
  return knex('products').del()
    .then(() => knex('products').insert([
      {
        id: 1,
        name: 'Jelly Fish',
        price: '$48.50',
        description: 'Jelly fish votive',
        color: 'Red',
        size: '8x4',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        id: 2,
        name: 'Salmon Dish',
        price: '$48.50',
        description: 'Salmon rectangle dish',
        color: 'Salmon',
        size: '10x6',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-16 12:46:16 UTC'),
        updated_at: new Date('2017-09-16 12:46:16 UTC')
      },
      {
        id: 3,
        name: 'Dichro Earrings',
        price: '$19.50',
        description: 'Sterling silver dichro earrings',
        color: 'Purple',
        size: '0.5x0.75',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-17 12:16:26 UTC'),
        updated_at: new Date('2017-09-17 12:16:26 UTC')
      },
      {
        id: 4,
        name: 'Sun',
        price: '$56.50',
        description: 'Garden Stake',
        color: 'Red',
        size: '12X12',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-18 12:26:50 UTC'),
        updated_at: new Date('2017-09-18 12:26:50 UTC')
      },
      {
        id: 5,
        name: 'Wine & Friends',
        price: '$32.50',
        description: 'Garden Stake',
        color: 'Neolavendar',
        size: '24x8',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-19 12:36:46 UTC'),
        updated_at: new Date('2017-09-19 12:36:46 UTC')
      },
      {
        id: 6,
        name: 'Bracelet',
        price: '$52.50',
        description: 'Sterling silver dichro bracelet',
        color: 'Dichro Purple',
        size: 'Adujustable',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-20 12:26:27 UTC'),
        updated_at: new Date('2017-09-20 12:26:27 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));"
      )
    );
};
