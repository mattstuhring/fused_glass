'use strict';

exports.seed = function(knex) {
  return knex('categories').del()
    .then(() => knex('categories').insert([
      {
        category_id: 1,
        category_name: 'Decorative',
        created_at: new Date('2017-09-15 11:16:11 UTC'),
        updated_at: new Date('2017-09-15 11:16:11 UTC')
      },
      {
        category_id: 2,
        category_name: 'Houseware',
        created_at: new Date('2017-09-16 12:46:12 UTC'),
        updated_at: new Date('2017-09-16 12:46:12 UTC')
      },
      {
        category_id: 3,
        category_name: 'Jewelry',
        created_at: new Date('2017-09-17 12:16:23 UTC'),
        updated_at: new Date('2017-09-17 12:16:23 UTC')
      },
      {
        category_id: 4,
        category_name: 'Garden',
        created_at: new Date('2017-09-18 12:26:54 UTC'),
        updated_at: new Date('2017-09-18 12:26:54 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));"
      )
    );
};
