'use strict';

exports.seed = function(knex) {
  return knex('collections').del()
    .then(() => knex('collections').insert([
      {
        id: 1,
        name: 'Sea Life',
        created_at: new Date('2017-09-15 11:16:16 UTC'),
        updated_at: new Date('2017-09-15 11:16:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));"
      )
    );
};
