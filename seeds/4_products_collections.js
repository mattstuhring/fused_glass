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
        collection_id: 2,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 3,
        product_id: 3,
        collection_id: 3,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 4,
        product_id: 4,
        collection_id: 4,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 5,
        product_id: 5,
        collection_id: 4,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 6,
        product_id: 6,
        collection_id: 5,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 7,
        product_id: 7,
        collection_id: 8,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 8,
        product_id: 8,
        collection_id: 7,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 9,
        product_id: 9,
        collection_id: 6,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 10,
        product_id: 1,
        collection_id: 8,
        created_at: new Date('2017-09-16 12:16:16 UTC'),
        updated_at: new Date('2017-09-16 12:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('products_collections_id_seq', (SELECT MAX(id) FROM products_collections));"
      )
    );
};
