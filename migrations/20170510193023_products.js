'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('product_name').defaultTo('');
    table.string('product_price').defaultTo('');
    table.string('product_description').defaultTo('');
    table.string('product_color').defaultTo('');
    table.string('product_size').defaultTo('');
    table.string('product_image').defaultTo('');
    table.integer('category_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('categories');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
