'use strict';

exports.seed = function(knex) {
  return knex('products_collections').del()
    .then(() => knex('products_collections').insert([
      {
        id: 1,
        product_id: 1,
        collection_id: 1,
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      },
      {
        id: 2,
        product_id: 2,
        collection_id: 1,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('products_collections_id_seq', (SELECT MAX(id) FROM products_collections));"
      )
    );
};
