'use strict';

exports.seed = function(knex) {
  return knex('products').del()
    .then(() => knex('products').insert([
      {
        id: 1,
        name: 'Mermaid',
        price: '$72.50',
        description: 'Garden Stake',
        category: 'Sea Life',
        color: 'Red',
        size: '4x4',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        id: 2,
        name: 'Jelly Fish',
        price: '$48.50',
        description: 'Votive',
        category: 'Sea Life',
        color: 'Blue',
        size: '8x5',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-16 12:46:16 UTC'),
        updated_at: new Date('2017-09-16 12:46:16 UTC')
      },
      {
        id: 3,
        name: 'Bird',
        price: '$32.50',
        description: 'Votive',
        category: 'Animals',
        color: 'Purple',
        size: '4x6',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-17 12:16:26 UTC'),
        updated_at: new Date('2017-09-17 12:16:26 UTC')
      },
      {
        id: 4,
        name: 'Sun',
        price: '$56.50',
        description: 'Garden Stake',
        category: 'Garden',
        color: 'Red',
        size: '12X12',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-18 12:26:50 UTC'),
        updated_at: new Date('2017-09-18 12:26:50 UTC')
      },
      {
        id: 5,
        name: 'Peace, Love, Music',
        price: '$32.50',
        description: 'Garden Stake',
        category: 'Garden',
        color: 'Neolavendar',
        size: '24x8',
        image: 'http://www.fillmurray.com/300/200',
        created_at: new Date('2017-09-19 12:36:46 UTC'),
        updated_at: new Date('2017-09-19 12:36:46 UTC')
      },
      {
        id: 6,
        name: 'Earrings',
        price: '$19.50',
        description: 'Sterling silver earrings',
        category: 'Jewelry',
        color: 'Dichro Red',
        size: '0.5x0.25',
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
