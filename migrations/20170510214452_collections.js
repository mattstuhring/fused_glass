'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('collections', (table) => {
    table.increments();
    table.string('collection_name').defaultTo('');
    table.integer('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('collections');
};
