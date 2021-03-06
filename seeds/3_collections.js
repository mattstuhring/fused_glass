'use strict';

exports.seed = function(knex) {
  return knex('collections').del()
    .then(() => knex('collections').insert([
      {
        collection_id: 1,
        collection_name: 'Sea Life',
        category_id: 1,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        collection_id: 2,
        collection_name: 'Night Lights',
        category_id: 1,
        created_at: new Date('2017-09-17 11:16:16 UTC'),
        updated_at: new Date('2017-09-17 11:16:16 UTC')
      },
      {
        collection_id: 3,
        collection_name: 'Earrings',
        category_id: 3,
        created_at: new Date('2017-09-18 11:18:16 UTC'),
        updated_at: new Date('2017-09-18 11:18:16 UTC')
      },
      {
        collection_id: 4,
        collection_name: 'Garden Stakes',
        category_id: 4,
        created_at: new Date('2017-09-19 11:16:16 UTC'),
        updated_at: new Date('2017-09-19 11:16:16 UTC')
      },
      {
        collection_id: 5,
        collection_name: 'Rings',
        category_id: 3,
        created_at: new Date('2017-09-20 11:16:16 UTC'),
        updated_at: new Date('2017-09-20 11:16:16 UTC')
      },
      {
        collection_id: 6,
        collection_name: 'Bowls',
        category_id: 2,
        created_at: new Date('2017-09-21 11:16:16 UTC'),
        updated_at: new Date('2017-09-21 11:16:16 UTC')
      },
      {
        collection_id: 7,
        collection_name: 'Wine Glasses',
        category_id: 2,
        created_at: new Date('2017-09-22 11:16:16 UTC'),
        updated_at: new Date('2017-09-22 11:16:16 UTC')
      },
      {
        collection_id: 8,
        collection_name: 'Lotion Bottles',
        category_id: 2,
        created_at: new Date('2017-09-23 11:16:16 UTC'),
        updated_at: new Date('2017-09-23 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('collections_collection_id_seq', (SELECT MAX(collection_id) FROM collections));"
      )
    );
};
