'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('products_categories', (table) => {
    table.increments();
    table.string('product_id').defaultTo('');
    table.string('category_id').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('products_categories');
};
