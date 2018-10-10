'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('product_id').primary();
    table.string('product_name').defaultTo('');
    table.string('product_price').defaultTo('');
    table.string('product_description', 500).defaultTo('');
    table.string('product_size').defaultTo('');
    table.string('product_image_public_id').defaultTo('');
    table.integer('product_quantity').defaultTo(0);
    table.integer('category_id')
      .unsigned()
      .notNullable()
      .references('category_id')
      .inTable('categories');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
