'use strict';

exports.seed = function(knex) {
  return knex('collections').del()
    .then(() => knex('collections').insert([
      {
        id: 1,
        collection_name: 'Sea Life',
        category_id: 1,
        created_at: new Date('2017-09-16 11:16:16 UTC'),
        updated_at: new Date('2017-09-16 11:16:16 UTC')
      },
      {
        id: 2,
        collection_name: 'Dishes',
        category_id: 2,
        created_at: new Date('2017-09-17 11:16:16 UTC'),
        updated_at: new Date('2017-09-17 11:16:16 UTC')
      },
      {
        id: 3,
        collection_name: 'Earrings',
        category_id: 3,
        created_at: new Date('2017-09-18 11:18:16 UTC'),
        updated_at: new Date('2017-09-18 11:18:16 UTC')
      },
      {
        id: 4,
        collection_name: 'Garden Stakes',
        category_id: 4,
        created_at: new Date('2017-09-19 11:16:16 UTC'),
        updated_at: new Date('2017-09-19 11:16:16 UTC')
      },
      {
        id: 5,
        collection_name: 'Bracelets',
        category_id: 3,
        created_at: new Date('2017-09-20 11:16:16 UTC'),
        updated_at: new Date('2017-09-20 11:16:16 UTC')
      },
      {
        id: 6,
        collection_name: 'Bowls',
        category_id: 2,
        created_at: new Date('2017-09-21 11:16:16 UTC'),
        updated_at: new Date('2017-09-21 11:16:16 UTC')
      },
      {
        id: 7,
        collection_name: 'Wine Glasses',
        category_id: 2,
        created_at: new Date('2017-09-22 11:16:16 UTC'),
        updated_at: new Date('2017-09-22 11:16:16 UTC')
      },
      {
        id: 8,
        collection_name: 'Night Lights',
        category_id: 1,
        created_at: new Date('2017-09-23 11:16:16 UTC'),
        updated_at: new Date('2017-09-23 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));"
      )
    );
};
