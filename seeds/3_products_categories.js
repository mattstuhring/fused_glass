'use strict';

exports.seed = function(knex) {
  return knex('products_categories').del()
    .then(() => knex('products_categories').insert([
      {
        id: 1,
        product_id: 1,
        category_id: 1,
        created_at: new Date('2017-06-26 14:26:16 UTC'),
        updated_at: new Date('2017-06-26 14:26:16 UTC')
      },
      {
        id: 2,
        product_id: 2,
        category_id: 2,
        created_at: new Date('2017-06-26 14:26:16 UTC'),
        updated_at: new Date('2017-06-26 14:26:16 UTC')
      },
      {
        id: 3,
        product_id: 3,
        category_id: 3,
        created_at: new Date('2017-06-26 14:26:16 UTC'),
        updated_at: new Date('2017-06-26 14:26:16 UTC')
      },
      {
        id: 4,
        product_id: 4,
        category_id: 4,
        created_at: new Date('2017-06-27 14:26:16 UTC'),
        updated_at: new Date('2017-06-27 14:26:16 UTC')
      },
      {
        id: 5,
        product_id: 5,
        category_id: 4,
        created_at: new Date('2017-06-28 14:26:16 UTC'),
        updated_at: new Date('2017-06-28 14:26:16 UTC')
      },
      {
        id: 6,
        product_id: 6,
        category_id: 3,
        created_at: new Date('2017-06-29 14:26:16 UTC'),
        updated_at: new Date('2017-06-29 14:26:16 UTC')
      }])
    )

    .then(() => knex.raw(
      "SELECT setval('products_categories_id_seq', (SELECT MAX(id) FROM products_categories));"
      )
    );
};
