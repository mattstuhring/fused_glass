'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('images', (table) => {
    table.increments('id').primary();
    table.string('image_name').defaultTo('');
    table.integer('product_id');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('images');
};
