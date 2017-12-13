'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('collections', (table) => {
    table.increments('collection_id').primary();
    table.string('collection_name').defaultTo('');
    table.integer('category_id')
      .unsigned()
      .notNullable()
      .references('category_id')
      .inTable('categories');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('collections');
};
