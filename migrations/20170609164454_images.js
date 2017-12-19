'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('images', (table) => {
    table.increments('image_id').primary();
    table.string('image_public_id').defaultTo('');
    table.boolean('image_main').defaultTo(false);
    table.integer('product_id')
      .unsigned()
      .notNullable()
      .references('product_id')
      .inTable('products')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('images');
};
